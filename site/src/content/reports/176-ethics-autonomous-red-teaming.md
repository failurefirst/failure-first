---
title: "The Ethics of Autonomous Red-Teaming: Dual-Use Analysis of Attack Evolution Systems"
description: "This report provides a dual-use ethical analysis of the Failure-First project's autonomous attack evolution system (`tools/autoresearch/evolve_attacks.py`)...."
date: "2026-03-23"
reportNumber: 176
classification: "Research — Empirical Study"
status: "draft"
author: "Failure-First Research Team"
tags: []
draft: false
---


## Abstract

This report provides a dual-use ethical analysis of the Failure-First project's autonomous attack evolution system (`tools/autoresearch/evolve_attacks.py`). The system applies evolutionary search to jailbreak attacks: it selects parent attacks, applies one of seven structural mutations, evaluates mutants against target models, and retains improvements. This report assesses who benefits from this capability, who could be harmed, what safety gates constrain the system, how it compares to existing autonomous red-team tools in the literature, and what responsible disclosure norms should apply. A D-Score assessment is computed. The report concludes with minimum safety requirements that the field should adopt for autonomous red-team tools.

---

## 1. What We Built

### 1.1 System Architecture

The autonomous attack evolution system follows the `autoresearch` pattern (Karpathy, 2025): a fixed infrastructure that autonomously conducts experiments, evaluates results, and iterates. Three components:

1. **prepare_attacks.py** (fixed): validates API access, computes baseline ASR from 10 seed attacks across 5 attack families (format-lock, crescendo, semantic inversion, authority claim, context manipulation), and caches state.

2. **evolve_attacks.py** (fixed): the core evolution loop. Each iteration: (a) selects a parent attack weighted by past ASR, (b) applies a randomly chosen mutation, (c) validates the mutant against a safety lint gate, (d) evaluates it against 2+ target models via OpenRouter API, (e) keeps the mutant if ASR >= parent ASR, discards otherwise.

3. **attack_template.jsonl** (mutable): the seed population of 10 attacks, which grows as the evolution loop retains successful mutants.

### 1.2 Seven Mutation Strategies

All mutations operate on persuasion patterns and structural framing. None makes the underlying harmful request more explicit:

| Strategy | Mechanism | What Changes | What Does Not Change |
|----------|-----------|--------------|---------------------|
| Paraphrase | Rewording vocabulary and sentence structure | Surface phrasing | Persuasion pattern |
| Amplify | Adding urgency, authority, or consequence signals | Compliance pressure | Request content |
| Combine | Merging framing from one attack with structure of another | Hybrid persuasion | Harm category |
| Contextualise | Adding domain-specific framing (mining, surgical, warehouse) | Legitimacy signal | Underlying request |
| Compress | Removing filler, tightening prompt | Prompt length | Core structure |
| Role Shift | Changing claimed identity (researcher, auditor, red team lead) | Authority claim | Request substance |
| Format Shift | Changing requested output format (JSON, YAML, table, CSV) | Format compliance path | Request semantics |

### 1.3 Key Design Choice: Structural Mutation, Not Content Escalation

The system's most important ethical design choice is that mutations modify *how* an attack is framed, not *what* it asks for. The harmful request is fixed in the seed template; the evolution searches for more effective persuasion wrappers around that fixed request.

This design choice has both an ethical rationale (Principles 1 and 2 of the Research Ethics Charter -- do no harm, publish patterns not exploits) and an empirical rationale (Mistakes #7, #11, #20 -- the project has documented three separate occasions where directly asking for harmful content produces worse results than indirect framing).

---

## 2. Dual-Use Framework: Who Benefits, Who Could Be Harmed?

### 2.1 Stakeholders and Interests

**Descriptive claim:** The following stakeholder analysis maps who interacts with autonomous red-team tools, what their interests are, and how those interests are affected.

| Stakeholder | Interest | Benefit from System | Risk from System |
|-------------|----------|--------------------|--------------------|
| AI safety researchers | Finding vulnerabilities before adversaries do | Automated discovery of attack variants at scale | Capability demonstrated could be replicated |
| Model providers (Anthropic, Google, OpenAI, etc.) | Hardening models against attacks | Continuous red-teaming input for safety training | Evolved attacks could be used against their models before patching |
| Regulators (AISI, NIST, SWA) | Evidence base for governance | Empirical data on evolving threat landscape | Risk of regulatory lag if attack evolution outpaces governance |
| Downstream deployers (mining, logistics, healthcare) | Safe embodied AI deployment | Better-tested models before deployment | If evolved attacks leak, deployment risk increases |
| Workers in proximity to embodied AI | Physical safety | Better safety evaluation of systems they work alongside | No direct risk (system targets text-only APIs, not physical systems) |
| Adversaries (state actors, criminal organisations) | Exploiting AI systems | N/A | Lower barrier to discovering effective attack patterns |

### 2.2 Asymmetric Benefit Analysis

**Normative claim:** The ethical justification for building autonomous red-team tools rests on whether the defensive benefit exceeds the offensive risk. This is not straightforward.

**Arguments that defensive benefit dominates:**

1. **The attack surface already exists.** The seed attacks in the template are drawn from established, publicly documented attack families. The system does not invent new attack categories; it optimises within known categories. An adversary who wants these patterns can find them in the existing literature (AutoDAN: Zhu et al. 2023; PAIR: Chao et al. 2023; TAP: Mehrotra et al. 2023; GCG: Zou et al. 2023).

2. **The mutation strategies are generic.** Paraphrasing, role-shifting, format-shifting, and adding context are general persuasion techniques, not novel attack primitives. Any competent adversary can apply them manually.

3. **Defender information asymmetry is the greater risk.** If model providers do not know what evolved attacks look like, they cannot train against them. The alternative -- waiting for adversaries to discover these patterns in the wild -- produces worse outcomes because adversaries have no incentive to disclose.

**Arguments that offensive risk is significant:**

1. **Automation lowers the skill barrier.** A manually crafted attack requires understanding of model behavior. An automated evolution loop requires only API access and the seed templates. The system reduces the effort from "think creatively about persuasion" to "run a script."

2. **The evolved population is the dangerous artifact.** The seed attacks are public knowledge. The evolved population -- the specific mutants that passed selection -- contains attack variants that have been empirically validated against specific models. This validated population is more operationally useful than the seed population.

3. **Free-tier API access means zero cost.** The system's default configuration uses free OpenRouter models. An adversary can run the evolution loop at zero cost, with no rate-limiting friction beyond standard free-tier quotas.

**Assessment:** The defensive benefit likely exceeds the offensive risk *provided that the evolved attack population is not published*. The structural knowledge (that evolutionary search over persuasion patterns works, which mutation strategies are effective) is publishable. The operational knowledge (specific evolved prompts, per-model ASR data) should remain in the private repository under the structural-operational split (Principle 2, Ethics Charter).

---

## 3. Safety Gates: What Constrains the System

### 3.1 Existing Safety Gates

The system implements five safety constraints:

**Gate 1: Structural mutation only.** Mutations modify framing, not content. The `mutate_*` functions operate on sentence structure, urgency markers, role claims, domain context, and output format. No mutation function generates or modifies the harmful request itself.

*Assessment:* This is the strongest gate. It is enforced by code structure (the mutation functions receive the template as input and return modified text without access to a "harm generation" capability). However, it is not formally verified -- a code change to a mutation function could violate this constraint without detection.

**Gate 2: Lint validation.** All mutated attacks pass through `lint_check()`, which rejects prompts containing hard-reject patterns (weapon construction, malware, CSAM, etc.), prompts shorter than 30 characters, and prompts longer than 5,000 characters.

*Assessment:* The lint gate catches crude violations but cannot detect subtle content escalation. It uses exact substring matching against 19 hard-reject patterns. A mutation that makes a harmful request more specific without using any of the 19 patterns would pass. This is a necessary but insufficient gate.

**Gate 3: Heuristic-only evaluation.** The system measures refusal/compliance using keyword detection, not content analysis. It does not parse or score the harmfulness of compliant responses.

*Assessment:* This is both a limitation and a safety feature. The system cannot optimise for *more harmful* responses because it has no signal for response harmfulness -- it only knows whether the model refused. An adversary who modified the system to include a harm scorer would create a qualitatively more dangerous tool.

**Gate 4: Complete logging.** Every mutation, evaluation, and selection decision is logged in structured JSONL and TSV. The full evolutionary history is auditable.

*Assessment:* Logging enables post-hoc review but does not prevent harm in real time. It is a forensic control, not a preventive one.

**Gate 5: Free-tier default.** The default configuration targets free-tier models, limiting scope to models that are publicly accessible and already rate-limited.

*Assessment:* This is a friction gate, not a safety gate. Changing the model list to paid-tier or frontier models requires editing a single command-line argument.

### 3.2 Safety Gate Gaps

Three gaps in the current safety architecture warrant attention:

1. **No formal separation between seed content and mutation logic.** The seed attacks contain the harmful requests. The mutation logic modifies framing. But nothing enforces this separation at a level deeper than "the code happens to work this way." A refactoring or extension could inadvertently allow mutations that modify the harmful content.

2. **No content-level output analysis.** The system records whether models refused but does not assess whether compliant responses are actually harmful. This means the evolution loop could keep a mutant that elicits a response that looks like compliance (passes refusal heuristic) but is actually a safe, contextualised answer. The known 2-12x over-reporting of heuristic ASR (Mistake #21) means the system likely retains many false positives.

3. **No model-provider notification.** The system evaluates attacks against live models via API without notifying the model providers. Under the D-Score coordinated disclosure framework (Principle 3, Ethics Charter), findings above D-Score 7 require notification. The system has no mechanism for triggering this notification automatically.

---

## 4. Comparison to Existing Autonomous Red-Team Tools

### 4.1 Landscape

The autonomous red-teaming landscape as of March 2026 includes several published systems:

| System | Year | Mechanism | Reported ASR | Key Distinction |
|--------|------|-----------|-------------|-----------------|
| GCG (Zou et al.) | 2023 | Gradient-based adversarial suffix optimisation | 84% (Llama-2, Vicuna) | Requires model weights; white-box; produces nonsensical suffixes |
| AutoDAN (Zhu et al.) | 2023 | Hierarchical genetic algorithm over prompt structure | 70%+ across open models | Genetic algorithm over token sequences; black-box variant available |
| PAIR (Chao et al.) | 2023 | Attacker LLM iteratively refines jailbreak prompts | 60%+ (GPT-4, Claude) | Uses an attacker LLM to generate and refine; fully black-box |
| TAP (Mehrotra et al.) | 2023 | Tree-of-thought attacker with pruning | Higher than PAIR | Extends PAIR with tree search and off-topic pruning |
| Rainbow Teaming (Samvelyan et al.) | 2024 | Quality-diversity search over attack space | Coverage-optimised | Optimises for diversity of successful attacks, not just ASR |
| LRM-based attack (arXiv:2508.04039) | 2025 | Frontier reasoning models attack other models | 97% across 25,200 inputs | Most capable; uses reasoning models as attackers |
| **Failure-First evolve_attacks** | 2026 | Evolutionary search over persuasion patterns | Preliminary (heuristic) | Structural mutation only; no content escalation; embodied AI context |

### 4.2 What Distinguishes the Failure-First System

**The system evolves persuasion patterns, not harmful content.** GCG optimises adversarial suffixes (token-level). AutoDAN uses genetic algorithms over prompt tokens. PAIR and TAP use an attacker LLM that generates complete attack prompts, including the harmful request. The Failure-First system holds the harmful request constant and evolves only the persuasion wrapper. This is a narrower optimisation space that produces less operationally dangerous artifacts.

**The system is embodied-AI-contextualised.** The seed attacks and domain contexts are drawn from robotics, autonomous vehicles, industrial automation, and mining -- the physical safety domains where jailbreak consequences include bodily harm. No other autonomous red-team tool is specifically designed for embodied AI safety evaluation.

**The system is less capable than PAIR/TAP.** Using a language model as the attacker (PAIR, TAP) produces more creative and effective attacks than rule-based mutation strategies. The Failure-First system trades capability for controllability: its mutations are predictable, auditable, and constrained in ways that LLM-generated attacks are not.

### 4.3 Normative Assessment

**Normative claim:** The trade-off between capability and controllability in autonomous red-team design is an ethical choice, not merely a technical one. More capable systems (PAIR, TAP, LRM-based) produce better safety evaluations but also produce more dangerous artifacts. The Failure-First system's choice to use rule-based mutations rather than LLM-generated attacks is a deliberate capability limitation motivated by dual-use risk management.

This choice has a cost: the system will discover fewer novel attack patterns than PAIR or TAP would. It has a benefit: the evolved population contains structurally predictable mutations rather than open-ended, potentially novel harmful constructions.

---

## 5. D-Score Assessment

Applying the D-Score framework (Report #154, `tools/dscore_calculator.py`) to the autonomous attack evolution system:

### 5.1 The Code Itself (tools/autoresearch/)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| S (Specificity) | 2 | The code is a complete, runnable system. However, it requires seed attacks (operational content) to function. The code alone is a search framework, not an attack tool. |
| R (Reproducibility) | 2 | Reproducible by technically competent non-expert. Requires: Python, OpenRouter API key (free), understanding of JSONL format. Does not require ML expertise. |
| T (Target Scope) | 2 | Targets any model accessible via chat completion API. Scope is architectural (API-level), not limited to specific models. |
| D (Defense Availability) | 2 | No automated defense against evolved persuasion attacks exists. However, the evolution is constrained to structural mutations of known attack families, and the heuristic evaluation likely over-reports success (2-12x). |

**Composite D-Score (code): 8 / 12**

**Action Tier: Coordinated Disclosure (7-9)**

This score indicates that the code should not be published openly without coordinated disclosure to affected parties. The code is currently in the private repository, consistent with this tier.

### 5.2 The Evolved Attack Population (runs/autoresearch/)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| S (Specificity) | 3 | Complete operational attack prompts with empirical validation. Copy-pasteable. |
| R (Reproducibility) | 3 | Usable by anyone with API access. No expertise required to re-use an evolved prompt. |
| T (Target Scope) | 2 | Validated against specific models, but likely transferable to others in the same family. |
| D (Defense Availability) | 2 | Same as code assessment. |

**Composite D-Score (evolved population): 10 / 12**

**Action Tier: Withhold (10-12)**

The evolved attack population is classified as too operationally specific for any form of external publication. It remains in `runs/autoresearch/` in the private repository only. Statistical summaries (ASR distributions, mutation effectiveness rates) may be published at Tier 1 (structural disclosure).

### 5.3 The Structural Knowledge (mutation strategies, evolutionary pattern)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| S (Specificity) | 1 | Category-level description of mutation strategies. No specific prompts. |
| R (Reproducibility) | 1 | An expert could reconstruct the system from the description, but would need to design their own seed attacks, mutation logic, and evaluation pipeline. |
| T (Target Scope) | 3 | The pattern (evolutionary search over persuasion) is model-agnostic and API-agnostic. |
| D (Defense Availability) | 2 | Same as above. |

**Composite D-Score (structural knowledge): 7 / 12**

**Action Tier: Coordinated Disclosure (7-9), lower bound**

The structural knowledge falls at the lower edge of coordinated disclosure. The blog post published on 2026-03-23 appropriately discloses at this level: it describes the pattern and mutation categories without providing seed attacks, specific evolved prompts, or model-specific results.

---

## 6. Responsible Publication: What Can Be Published vs What Stays Private

Applying the three-tier disclosure model (Report #144, Section 5) and the D-Score assessments above:

### Tier 1 (Structural Disclosure) -- Publishable

- The evolutionary search pattern (select, mutate, evaluate, keep/discard)
- The seven mutation strategy categories and their general mechanisms
- Aggregate statistics: mutation effectiveness rates, population growth curves
- The finding that format-lock attacks are the most defense-resistant starting point
- The design principle: structural mutation, not content escalation
- Comparison to existing autonomous red-team tools (AutoDAN, PAIR, TAP, GCG)
- Safety gate architecture and gap analysis

**Status:** Published in blog post (2026-03-23). Suitable for academic paper, regulatory brief, and conference presentation.

### Tier 2 (Methodological Disclosure) -- Restricted

- The code architecture in sufficient detail for expert reproduction
- The lint gate patterns (what specific strings are rejected)
- The evaluation methodology (refusal detection heuristic, model selection criteria)
- Per-mutation-strategy ASR differentials

**Status:** Suitable for academic papers with peer review. CCS submission may include this level of detail in the methodology section.

### Tier 3 (Operational Disclosure) -- Private Repository Only

- The seed attack templates (`attack_template.jsonl`)
- The evolved attack population (`runs/autoresearch/evolved_attacks.jsonl`)
- Per-model evaluation results
- The complete code with runnable configuration

**Status:** Remains in private repository. Not published externally under any circumstance without D-Score re-assessment and unanimous stakeholder agreement (per Ethics Charter Principle 2).

---

## 7. Comparison to NemoClaw: Sandboxed Execution as Mitigation

GLI entry gli_128 documents NVIDIA NemoClaw (announced GTC 2026) as the first policy-enforced autonomous AI sandbox for embodied AI agents. NemoClaw provides a sandboxed runtime where AI agents operate within explicit safety policy constraints enforced at the runtime level rather than the model level.

**Descriptive claim:** NemoClaw represents an architectural response to the very problem that autonomous red-teaming exposes. If model-level safety (system prompts, RLHF, safety training) can be bypassed by evolved persuasion attacks, then safety enforcement must operate at a layer the model cannot influence -- the runtime environment.

**Normative claim:** The existence of sandboxed execution environments like NemoClaw does not eliminate the need for autonomous red-teaming, but it does change the ethical calculus. If model-level defenses are supplemented by runtime-level enforcement:

1. The consequences of a successful jailbreak are bounded by the sandbox constraints (force limits, workspace boundaries, action filtering).
2. Autonomous red-teaming becomes a tool for testing the *combined* system (model + sandbox), not just the model in isolation.
3. The dual-use risk of evolved attacks is partially mitigated because the attacks target a layer (model behavior) that is no longer the sole defense.

**Predictive claim (timeframe: 12 months, confidence: medium):** By March 2027, at least one major embodied AI deployer will adopt a NemoClaw-style sandbox and claim that model-level jailbreak testing is no longer necessary because runtime enforcement "solves" the problem. This claim will be incorrect -- runtime sandboxes constrain the action space but do not prevent all harmful outcomes (an agent operating within its force limits can still cause harm through task-level misdirection). Autonomous red-teaming of the combined system will remain necessary.

---

## 8. Recommendations: Minimum Safety Requirements for Autonomous Red-Team Tools

### 8.1 For the Field

**Normative claims:** The following recommendations describe what the field ought to adopt as minimum standards for responsible development and deployment of autonomous red-teaming tools.

1. **Mutation constraint documentation.** Any autonomous red-team tool should document, in its publication and code, what types of mutations it can and cannot perform. The distinction between structural mutation (modifying persuasion patterns) and content mutation (generating or escalating harmful requests) should be explicit.

2. **Output classification.** The evolved attack population should be classified using the D-Score framework or equivalent. Evolved populations with D-Score >= 10 should not be published.

3. **Logging and auditability.** Every mutation, evaluation, and selection decision should be logged in a structured, machine-readable format. The complete evolutionary history must be available for audit.

4. **Provider notification threshold.** When autonomous red-teaming discovers vulnerabilities with D-Score >= 7 against specific named models, the model provider should be notified before or concurrent with structural publication. A 90-day remediation window is standard practice in security research.

5. **No harm-scoring optimisation.** Autonomous red-team tools should not include a harm scorer that optimises for *more harmful* responses. The evaluation signal should be binary (refused/complied) or structural (format compliance, length, presence of safety disclaimers). Optimising for response harmfulness creates a qualitatively more dangerous tool.

6. **Seed attack provenance.** The seed attack population should be sourced from publicly documented attack families with traceable provenance, not generated by asking an LLM to create novel harmful requests.

7. **Rate-limiting and scope bounds.** Autonomous red-team tools should enforce rate limits on API calls and scope bounds on target models. The tool should not be designed to exhaustively test every available model at maximum throughput.

### 8.2 For the Failure-First Project

1. **Formalise the structural mutation constraint.** Add a code-level invariant test that verifies mutation functions do not modify the harmful content portion of seed attacks. This could be implemented as a unit test that extracts the "request" portion of each seed template and verifies it is unchanged after mutation.

2. **Implement D-Score-triggered notification.** When the evolved population contains attacks with per-model ASR exceeding a threshold (suggested: 80% on LLM-graded verdicts across 3+ models), automatically flag for coordinated disclosure review.

3. **Add LLM-based re-grading to the pipeline.** The current heuristic-only evaluation (Mistake #21) means the kept population likely contains many false positives. Adding FLIP re-grading of kept attacks before they influence the population would improve both research quality and safety (fewer false positives = fewer incorrectly retained attacks).

4. **Document the system in the Ethics Charter appendix.** The autoresearch system should be explicitly referenced in the Research Ethics Charter as a case study for Principles 1-3.

---

## 9. GLI Entry: gli_129

### Governance Lag: Autonomous Red-Team Tools

**Descriptive claim:** As of March 2026, no jurisdiction has governance covering autonomous red-teaming tools specifically. No licensing requirements, no disclosure mandates, no safety standards, and no use restrictions exist for tools that automatically generate, evolve, and evaluate adversarial attacks against AI systems.

**Key dates:**

- **T_doc:** 2023 (GCG, AutoDAN, PAIR, TAP published). Automated adversarial attack generation demonstrated across multiple research groups.
- **T_framework:** null. No governance framework exists for autonomous red-team tools. The closest analogues are: (a) the Wassenaar Arrangement on dual-use technology, which covers "intrusion software" but has not been applied to AI red-teaming tools; (b) the CFAA and Computer Misuse Act, which govern unauthorized access but not research tools used with API authorization; (c) the EU AI Act, which classifies "AI systems intended to be used for [...] real-time and post remote biometric identification" as high-risk but does not address red-teaming tools.
- **T_enact:** null. No legislation pending.
- **T_enforce:** null.

**GLI:** Not computable (no framework exists).

**Normative claim:** The absence of governance is not inherently a problem -- many security research tools operate without specific regulation. However, the scale and automation of AI red-teaming tools distinguishes them from manual penetration testing. A manual pen tester discovers vulnerabilities one at a time. An automated evolution loop discovers them at scale. The governance vacuum means there is no mechanism for:

- Requiring responsible disclosure of vulnerabilities discovered by autonomous tools
- Restricting the sale or distribution of evolved attack populations
- Mandating safety gates (lint checks, content constraints) in autonomous red-team tools
- Distinguishing between defensive research use and offensive commercial use

This entry is filed as a structural observation, not a call for specific legislation. The appropriate governance form (voluntary standard, industry code, regulatory guidance, or legislation) depends on the maturity of the threat and the adequacy of existing self-governance mechanisms. As of March 2026, self-governance is the dominant model, and its adequacy is untested.

---

## 10. Limitations and Uncertainty

1. **The D-Score is a framework, not a measurement.** The scores assigned in Section 5 reflect the assessor's judgment. Different assessors might score the same system differently by 1-2 points on individual dimensions. The composite score is an ethical reasoning tool, not a precision instrument.

2. **The comparison to PAIR/TAP/GCG is based on published papers.** The actual capability of these systems in current deployment may exceed their published results. Our characterisation of the Failure-First system as "less capable" than PAIR/TAP is based on the design constraint (rule-based vs LLM-generated mutations), not on comparative empirical testing.

3. **The stakeholder analysis is not exhaustive.** Additional stakeholders (insurance companies, standards bodies, legal systems) are affected by autonomous red-teaming tools but are not analysed in depth here.

4. **The safety gate analysis is static.** The system's safety posture depends on the current code. Code changes, extensions, or forks could alter the safety gate coverage without triggering any review process.

5. **The blog post was published before this ethics report was completed.** The blog post (2026-03-23) was assessed by the publishing agent (Failure-First Research Team) as Tier 1 structural disclosure. This report provides the formal ethical analysis that should have preceded publication. This ordering gap is noted for process improvement.

---

## 11. Conclusion

The Failure-First autonomous attack evolution system is a dual-use tool that advances defensive AI safety research at the cost of demonstrating a capability that adversaries could replicate. The ethical case for building and using the system rests on three claims: (1) the attack patterns it evolves are drawn from publicly known families and do not represent novel capability, (2) the structural mutation constraint prevents the system from generating novel harmful content, and (3) defenders who do not build automated red-teaming systems will be outpaced by adversaries who do.

The D-Score assessment yields 8/12 for the code, 10/12 for the evolved attack population, and 7/12 for the structural knowledge. This places the code and structural knowledge in the coordinated disclosure tier and the evolved population in the withhold tier. Current practice is consistent with these tiers: the code is in the private repository, the structural knowledge has been published at Tier 1, and the evolved population is not published.

The primary ethics gap is the absence of field-wide governance for autonomous red-team tools. GLI entry gli_129 documents this gap. The recommendations in Section 8 propose minimum safety requirements that, if adopted, would constrain the most dangerous applications of autonomous red-teaming while preserving its defensive utility.

---

*Failure-First Research Ethics Charter v1.0 (2026) governs all findings in this report. D-Score assessments computed per Report #154.*
