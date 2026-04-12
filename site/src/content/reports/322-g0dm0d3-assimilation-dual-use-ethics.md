---
title: "The Ethics of Assimilating Public Jailbreak Frameworks -- G0DM0D3, L1B3RT4S, and the Dual-Use Telescope"
description: "Sprint 16 assimilated the G0DM0D3 jailbreak framework: an AGPL-3.0-licensed, publicly available tool created by Pliny the Prompter (elder-plinius) that packages jailbreak techniques into modular..."
date: "2026-03-27"
reportNumber: 322
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

> **Disclaimer:** This report analyses the ethical dimensions of specific research activities undertaken by the Failure-First project. It does not constitute legal advice, regulatory guidance, or an endorsement of unrestricted attack research. Empirical figures are drawn from Sprint 16 reports and are subject to the sample-size limitations documented therein.

---

## Abstract

Sprint 16 assimilated the G0DM0D3 jailbreak framework: an AGPL-3.0-licensed, publicly available tool created by Pliny the Prompter (elder-plinius) that packages jailbreak techniques into modular TypeScript components. The Failure-First project extracted 149 prompts and 162 glitch tokens from its L1B3RT4S module, tested them against models spanning 9B to 671B parameters, and documented 67-100% attack success rates (Reports #315, #317). Separately, the project discovered that system-prompt defenses produce zero measurable reduction against these attacks on certain models (Report #318), a finding partially revised by Report #321 showing model-dependent defense effectiveness.

This report examines five ethical questions raised by these activities:

1. **(Section 1)** Is it ethically permissible to extract and benchmark prompts from a publicly available jailbreak framework?
2. **(Section 2)** What dual-use obligations attach to the empirical findings -- specifically the 67-100% ASR data and the defense bypass result?
3. **(Section 3)** Does the defense privilege hierarchy create an affirmative disclosure obligation toward model providers?
4. **(Section 4)** What are the ethics of the 67% convergence wall as a finding about the limits of text-layer safety?
5. **(Section 5)** How does this work interact with the broader power dynamics of jailbreak research -- who benefits, who bears the risk, and what accountability structures exist?

The analysis applies the AARDF graduated disclosure framework (Report #186), the Research Ethics Charter v1.1, and the D-Score dual-use scoring methodology (Report #154) to each question.

---

## 1. The Ethics of Assimilating Public Jailbreak Frameworks

### 1.1 The Factual Situation

**(D)** G0DM0D3 is published on GitHub under the AGPL-3.0 license by an individual known as Pliny the Prompter (elder-plinius). The repository contains approximately 3,300 lines of TypeScript implementing five modules: Parseltongue (input perturbation), AutoTune (sampling parameter manipulation), STM (output normalization), ULTRAPLINIAN (multi-model racing), and a GODMODE system prompt. It also includes L1B3RT4S, a "Hall of Fame" of model-specific jailbreak prompts targeting Grok, Gemini, GPT-4o, Claude, and Hermes. The framework includes a companion research paper (PAPER.md) with computational evaluations.

**(D)** Pliny the Prompter is a known figure in the jailbreak community. The L1B3RT4S prompts target specific commercial models by name and are designed to bypass their safety training. The framework is freely available to anyone with a GitHub account. It has been public for some time and is not obscure.

**(D)** The Failure-First project extracted the L1B3RT4S prompts, converted them into our JSONL benchmark format, and tested them against 8 models (Reports #315, #317). We also tested Parseltongue perturbation techniques (Report #315) and sampling parameter manipulation (Report #316).

### 1.2 The Ethical Case For Assimilation

**(N)** The strongest argument for this work rests on three pillars:

**First, the material is already public.** G0DM0D3 is an open-source project with an AGPL-3.0 license. Anyone can access, fork, and use it. The Failure-First project did not discover, develop, or disseminate these attack techniques. We documented their effectiveness under controlled conditions. The marginal increase in offensive capability from our work is near zero: anyone who wants to use L1B3RT4S prompts can copy them directly from the source repository. What our work adds is *defensive information* -- which attacks work, against which models, and under what conditions.

**Second, undocumented attacks are more dangerous than documented ones.** Before our testing, G0DM0D3 made no empirical effectiveness claims. The L1B3RT4S prompts existed as untested assertions. By benchmarking them, we transformed marketing claims into scientific data: 67-100% ASR on 9B-671B models (Report #315), with semantic inversion as the dominant effective class (88% combined broad ASR, Report #317), and boundary injection as the most frequently refused class. This stratification has direct defensive value -- it tells model providers where to focus mitigation efforts.

**Third, the alternative -- ignoring public attack tools -- is not ethically neutral.** If safety researchers choose not to engage with publicly available jailbreak frameworks, those frameworks continue to be used by adversaries without any defensive characterisation. The information asymmetry favours the attacker: they know their tools work (or believe they do); defenders do not know which tools work, against which models, or why. Choosing not to test is a choice to preserve this asymmetry.

### 1.3 The Ethical Case Against (or for Caution)

**(N)** The strongest counterarguments deserve explicit treatment:

**The amplification concern.** Even if the source material is public, our structured benchmarking could amplify its reach or credibility. A 96% ASR number attached to a specific model name is a more potent signal than an untested prompt in a GitHub repository. By validating these attacks empirically, we may increase the likelihood that they are used offensively by actors who would not otherwise have tested them. This concern is real but must be weighed against the defensive value of the same information.

**The normalisation concern.** Routinely assimilating jailbreak frameworks into a research corpus could normalise a research pattern in which safety researchers become the primary consumers and amplifiers of adversarial tooling. If every new jailbreak framework is systematically tested and catalogued, the research programme itself becomes an increasingly comprehensive attack library. The Charter's Principle 2 (Structural Over Operational) constrains external disclosure, but the internal accumulation of operational knowledge still carries risk -- particularly if the private repository were ever compromised.

**The attribution concern.** By naming Pliny the Prompter, citing the G0DM0D3 framework, and reporting ASR data, we provide a form of technical validation to jailbreak developers. This could incentivise the development of more sophisticated frameworks if developers perceive that safety researchers will test and (implicitly) validate their work. The cybersecurity analogy is imperfect: CVE disclosures attribute vulnerabilities but do not generally increase the social status of exploit developers within the security community. The jailbreak community operates under different social dynamics.

### 1.4 Assessment

**(N)** On balance, the assimilation of G0DM0D3 was ethically permissible under the AARDF framework and the Research Ethics Charter, subject to two conditions that were met:

1. **External disclosure remains at Tier 1 (structural).** The specific L1B3RT4S prompt payloads remain in the private repository. Public-facing outputs (blog posts, papers, regulatory briefs) report only structural findings: attack class effectiveness rankings, parameter-count independence, defense bypass patterns. This is consistent with Charter Principle 2.

2. **The work produces defensively actionable information.** The finding that semantic-structural attacks dominate where character-level perturbation fails (0% vs 67-100%) is directly actionable for model providers. The defense privilege hierarchy (Report #318, revised by Report #321) identifies a specific architectural limitation. These are not merely academic observations; they inform where safety investment should be directed.

**(N)** The procedural critique is valid: there was no pre-assimilation ethics review. Report #250's analysis of the Compliance Cascade identified this same gap -- novel offensive capabilities being tested before ethical screening. The speed of the Sprint 16 session (8 reports in a single session) suggests the execution pace outran the ethical review cadence. For future framework assimilations, we recommend a lightweight pre-test ethical screen (Section 6.1).

---

## 2. Dual-Use Obligations for the Empirical Findings

### 2.1 D-Score Assessment

**(A)** Applying the D-Score framework (Report #154) to the key Sprint 16 findings:

| Finding | Offensive Utility | Defensive Utility | Public Domain Already? | D-Score Category |
|---------|------------------|------------------|----------------------|-----------------|
| L1B3RT4S 67-100% ASR | Medium (validates existing public prompts) | High (stratifies which attacks work and which do not) | Source prompts: yes. ASR data: no. | Tier 2 (Methodological Disclosure) |
| Parseltongue 0% ASR | Low (confirms attacks do not work) | Medium (de-prioritises a defense investment area) | No empirical data existed. | Tier 1 (Structural Disclosure) |
| SPM +30pp delta | Medium (identifies novel attack surface) | High (entirely new defensive priority) | No. Novel finding. | Tier 2 with Tier 3 element |
| Defense 0pp on Nemotron | Medium (tells adversaries defenses do not work on this model) | High (identifies architectural limitation) | No. | Tier 2 |
| Defense -50pp on qwen3.5 | Low (tells adversaries defense works on this model) | High (identifies that defenses can work, model-dependently) | No. | Tier 1 |

**(N)** The findings with the highest dual-use tension are the SPM attack surface (novel, not in public domain, high offensive and defensive utility) and the model-specific defense bypass data (tells adversaries exactly which models are unprotected by system-prompt defenses).

### 2.2 The SPM Disclosure Problem

**(D)** Sampling parameter manipulation (SPM) is a genuinely novel attack surface identified by Sprint 16 research (Report #316). No existing jailbreak benchmark tests it. The finding -- a +30pp ASR increase from chaotic sampling parameters alone -- is preliminary (p=0.35, n=10, single model) but directionally significant.

**(N)** SPM presents a distinctive disclosure problem because the attack requires API access with parameter control, which is available to any developer using standard model APIs. The "secret" is not a complex technique but a simple insight: setting temperature to 1.7 and top_p to 0.99 may degrade safety training. Publishing this insight has near-zero incremental offensive value (any developer experimenting with parameters could discover it) but substantial defensive value (it motivates providers to constrain parameter ranges or test safety under non-default sampling conditions).

**(N)** Recommendation: SPM should be disclosed at AARDF Tier 2 (methodological -- sufficient for expert reproduction) in academic publications, and at Tier 1 (structural -- the category and statistical profile) in all other contexts. The specific parameter values that produced the effect are not operationally sensitive and may be disclosed. The structural insight ("safety training may not generalise across sampling parameter regimes") should be communicated to model providers as a priority.

### 2.3 Model-Specific Defense Bypass Data

**(N)** The finding that STRUCTURED defense produces 0pp reduction on Nemotron-3-Super but -50pp on qwen3.5 (Report #321) creates an asymmetric information problem. Publishing that a named model's defenses are ineffective against a specific attack class provides actionable intelligence to adversaries targeting that model. Publishing that defenses work on a different model provides useful signal to defenders.

**(N)** Under the Charter's Principle 2, model-specific vulnerability data should default to Tier 1 disclosure (category level, not named instances). However, the defensive value of this finding -- that defense effectiveness is model-dependent, not universally zero -- is itself a structural insight that can be communicated without naming the vulnerable model. The recommendation: external publications should report the structural finding (same-privilege-level attacks produce model-dependent defense outcomes ranging from 0pp to -50pp) without specifying which model is undefended. Model-specific data should be shared with the relevant providers under coordinated disclosure.

---

## 3. The Defense Privilege Hierarchy and Disclosure Obligations

### 3.1 The Finding

**(D)** Report #318 established a three-tier pattern of defense effectiveness:
- Standard user-turn attacks: defense reduces ASR by 10-30pp
- VLA Tier 1 embodied attacks: model-dependent, sometimes iatrogenic
- L1B3RT4S system-level attacks: 0pp reduction on one model (Nemotron-3-Super)

Report #321 revised the third tier: on qwen3.5, the same defense produced a -50pp reduction. The finding is therefore not "defenses are useless against system-level attacks" but rather "defense effectiveness against system-level attacks is entirely model-dependent, ranging from zero to substantial."

### 3.2 Does This Create a Disclosure Obligation?

**(N)** Report #288 argued that the AI safety field has a disclosure obligation for iatrogenic effects that is distinct from the standard dual-use concern. The defense privilege hierarchy extends this argument: if system-prompt defenses are the primary safety mechanism recommended to deployers (as they are in most provider documentation), and if those defenses are demonstrably ineffective against certain attack classes on certain models, then safety researchers who discover this have an obligation to disclose it -- not because the information is dangerous, but because its absence is dangerous.

**(A)** The analogy is to pharmaceutical post-marketing surveillance. If a study finds that a widely prescribed drug is ineffective for a specific patient population, the researchers have an obligation to publish that finding, even though it may cause patients to lose confidence in their treatment. The loss of confidence is a feature, not a bug: false confidence in an ineffective treatment is more dangerous than accurate knowledge of its limitations.

**(N)** Applied to the defense privilege hierarchy:

1. **Obligation to model providers:** The Failure-First project should disclose the model-specific defense effectiveness data (which models are protected and which are not) to the relevant model providers under coordinated disclosure. This is a standard CVD obligation.

2. **Obligation to the deployer community:** The structural finding -- that system-prompt defenses have highly model-dependent effectiveness against system-level attacks -- should be published at Tier 1. Deployers who rely on system-prompt defenses as their primary safety mechanism need to know that this strategy has been empirically shown to be unreliable for certain model-attack combinations.

3. **Obligation to the standards community:** This finding has direct implications for AI safety evaluation standards. Any standard that certifies a system as "safe" based on system-prompt defense testing alone is providing false assurance if the testing does not include system-level attacks. Our draft standard (F1-STD-001) and NIST engagement should incorporate this finding.

### 3.3 The Iatrogenic Disclosure Paradox

**(A)** There is a recursive ethical problem here. Publishing that system-prompt defenses are ineffective against system-level attacks could:

(a) **(beneficial)** Motivate providers to develop architecturally separated defenses rather than relying on text-layer instructions, and
(b) **(harmful)** Signal to adversaries that system-level attacks are the optimal attack class, potentially accelerating the adoption of persona-hijack techniques.

**(N)** This is a genuine tension with no clean resolution. The AARDF framework resolves it by asking which information state is more dangerous: a world where deployers believe their defenses work (current state) or a world where deployers know their defenses have limitations (disclosed state). The answer, consistent with the pharmaceutical analogy and with the iatrogenic disclosure obligation established in Report #288, is that false confidence is more dangerous than accurate assessment. The disclosure should proceed, at Tier 1 (structural), emphasising the positive finding (defenses work on some models) alongside the limitation (they do not work on all models).

---

## 4. The 67% Convergence Wall and the Ethics of Text-Layer Safety

### 4.1 The Empirical Pattern

**(D)** Across Sprint 16 data, a convergence pattern emerges. The largest model tested (Cogito 2.1, 671B parameters) achieved 67% L1B3RT4S ASR -- the lowest of any model tested, but still majority compliance. This sits alongside the corpus-wide finding that the five most restricted frontier models (Anthropic 3.7%, Google 9.1%) achieve low ASR under standard attacks, but the vast majority of models cluster in the permissive range (>= 40% ASR, 37 of 57 models with LLM-graded verdicts; AGENT_STATE.md Established Findings).

**(A)** Two interpretations of the 67% floor merit ethical analysis:

**Interpretation A: Training insufficiency.** The 67% ASR on 671B reflects insufficient safety training investment, not a fundamental limit. With more targeted RLHF on semantic-structural attacks, the ASR could be reduced further. Evidence for this interpretation: frontier models from providers with the highest safety investment (Anthropic, Google) achieve near-zero ASR on standard attacks. L1B3RT4S-specific training could plausibly reduce ASR on these attack classes as well.

**Interpretation B: Text-layer ceiling.** The 67% ASR on 671B, combined with the 0% Parseltongue ASR (character-level attacks are solved) and the defense privilege hierarchy (text-layer defenses fail against text-layer attacks at the same privilege level), suggests that text-layer safety has a structural ceiling. Safety training can address known attack patterns, but the instruction-following capability that makes language models useful is the same capability that makes them exploitable through semantic-structural manipulation. This ceiling may be asymptotic: each incremental safety improvement becomes more expensive while each novel attack class resets the ASR.

### 4.2 Ethical Implications of Each Interpretation

**(N)** If Interpretation A is correct, the ethical obligation falls primarily on model providers: invest more in safety training against semantic-structural attacks. The Failure-First project's contribution is identifying the specific attack classes that require attention (semantic inversion, persona hijack, boundary manipulation) and the specific models that are underinvested (those showing >40% ASR).

**(N)** If Interpretation B is correct, the ethical implications are more far-reaching:

1. **For model providers:** Communicating that text-layer safety is "robust" or "comprehensive" when it has a structural ceiling would be misleading. Providers would have an obligation to accurately characterise the limitations of their safety measures, particularly for high-risk deployments. The 67% floor on a 671B model is not a number that inspires confidence for safety-critical applications.

2. **For deployers:** Reliance on model-level safety as the sole safety mechanism is insufficient if text-layer safety has a ceiling. Deployers of AI systems in safety-critical contexts (embodied AI, healthcare, critical infrastructure) would need defence-in-depth architectures that do not depend solely on the model refusing harmful instructions.

3. **For regulators:** Safety certification regimes that test only against known attack patterns (the standard benchmarking approach) would systematically overestimate safety if novel attack classes can always be constructed. The EU AI Act's requirement for "appropriate measures" (Article 9) and the AU AISI's evaluation methodology should account for the possibility of structural safety ceilings.

4. **For safety researchers:** If text-layer safety has a ceiling, then the research priority shifts from "how to make text-layer safety better" to "how to build safety architectures that do not depend on text-layer safety alone." This has implications for resource allocation, research agenda setting, and the framing of safety claims.

### 4.3 Assessment

**(A)** The current evidence does not definitively support either interpretation. The sample sizes are small (n=6 per model for L1B3RT4S, n=10 for SPM), the L1B3RT4S payload is uniform (lock-picking, low-to-medium harm), and the model coverage is limited (4 models for L1B3RT4S cross-scale). Report #315 explicitly notes that all L1B3RT4S percentage differences are within single-scenario margins and are not statistically significant.

**(N)** What the evidence does support is a precautionary position: until the text-layer safety ceiling question is resolved empirically (requiring substantially larger samples, diverse harm categories, and frontier model testing), deployers of AI in safety-critical contexts should not assume that text-layer safety alone is sufficient. This is a conservative recommendation that is defensible regardless of which interpretation is ultimately correct. It is also consistent with the defence-in-depth principle that is standard in cybersecurity and industrial safety.

---

## 5. Power Dynamics: Who Benefits, Who Bears Risk

### 5.1 The Jailbreak Research Ecosystem

**(D)** The G0DM0D3 assimilation sits within a broader ecosystem of jailbreak research that involves several stakeholder groups with distinct interests:

**Jailbreak developers** (e.g., Pliny the Prompter) create and publish attack tools. Their motivations range from ideological (opposition to content restrictions), to reputational (recognition within the jailbreak community), to financial (some offer paid services). They bear minimal legal or reputational risk under current regulatory regimes: publishing jailbreak prompts is not illegal in most jurisdictions, and AGPL-3.0 licensing provides no liability shield but signals open-source norms.

**Model providers** (Anthropic, OpenAI, Google, Nvidia, etc.) bear the primary commercial and reputational risk from successful jailbreaks. They have the most to gain from defensive research and the most to lose from offensive disclosures. They also control the training pipeline and are the only actors who can implement training-level mitigations.

**Safety researchers** (including this project) occupy an intermediary position: we consume attack techniques, test them empirically, and produce defensive knowledge. We bear reputational risk if our work is perceived as enabling harm, and we bear ethical risk if our defensive findings are suppressed or delayed.

**Deployers** (companies integrating AI models into products and services) bear operational risk from jailbreaks but typically have limited ability to mitigate model-level vulnerabilities. They rely on system-prompt defenses and application-level controls.

**End users** bear the ultimate risk of harm from jailbroken AI systems, particularly in embodied AI contexts where physical safety is at stake. They have the least visibility into the safety properties of the systems they interact with.

### 5.2 Power Concentration Analysis

**(A)** The current structure of jailbreak research concentrates power in ways that merit ethical scrutiny:

**Information asymmetry favours providers.** Model providers know their own safety training data, evaluation results, and red-teaming findings. They selectively disclose what supports their commercial narrative. When a jailbreak is disclosed, providers can patch it without revealing the scope of the underlying vulnerability. Independent safety researchers (including Failure-First) operate with substantially less information than providers and must infer safety properties from black-box testing.

**Accountability asymmetry favours jailbreak developers.** Pliny the Prompter publishes operational attack tools under an open-source license with no accountability framework. If L1B3RT4S prompts are used to generate harmful content, there is no mechanism to trace the harm back to the tool developer or to impose consequences. Safety researchers who document effectiveness are held to higher standards (IRB equivalents, ethical review, responsible disclosure) than the attack developers whose work they evaluate. This asymmetry incentivises offence over defence.

**Risk asymmetry disadvantages end users.** End users of AI systems in safety-critical contexts (autonomous vehicles, industrial robotics, healthcare) are exposed to risks from jailbreak-class attacks but have no voice in the research ecosystem. The 67-100% L1B3RT4S ASR across 9B-671B models is not information that reaches the operators of autonomous haul trucks in Western Australian mines. The governance gap documented in the GLI dataset (157 entries; CANONICAL_METRICS.md) means that no regulatory framework requires this information to be communicated to deployers of high-risk AI systems.

### 5.3 The Failure-First Project's Position

**(A)** The Failure-First project occupies a structurally uncomfortable position within this ecosystem. We are:

- **Consumers of adversarial knowledge** (we test attack tools created by others), which makes us dependent on the jailbreak community for attack surface coverage while maintaining ethical distance from attack development.
- **Producers of defensive knowledge** (we report which attacks work and which do not), which serves providers and deployers but also validates attack developers' tools.
- **Advocates for structural reform** (our policy work argues for mandatory safety testing, incident reporting, and defence-in-depth requirements), which puts us in tension with providers who prefer voluntary self-regulation and with regulators who lack technical capacity.

**(N)** This position creates a specific obligation: to be transparent about our own dual-use tensions rather than claiming ethical purity. The Compliance Cascade (Report #250), the iatrogenic disclosure obligation (Report #288), and this analysis all reflect an attempt to hold our own work to the same scrutiny we apply to others. This is not comfortable, but the alternative -- claiming that safety research is ethically unproblematic because it serves good ends -- is intellectually dishonest and undermines credibility.

---

## 6. Recommendations

### 6.1 Pre-Assimilation Ethical Screen

**(N)** Before future framework assimilations (i.e., importing and testing attack tools from external sources), the lead researcher should complete a lightweight ethical screen:

1. **Provenance check.** Is the source material public or restricted? If restricted, additional justification is required.
2. **Marginal offensive utility.** Does testing add offensive capability beyond what already exists in the public domain? If so, what is the justification?
3. **Defensive utility estimate.** What specific defensive questions will be answered by the testing?
4. **Disclosure plan.** At what AARDF tier will results be disclosed, and to whom?

This screen should be documented (even briefly) before testing begins, not post-hoc. The Sprint 16 assimilation would have passed this screen, but the screen itself was not performed.

### 6.2 Model-Specific Vulnerability Disclosure

**(N)** The defense bypass data from Reports #318 and #321 should be shared with the relevant model providers (Nvidia for Nemotron-3-Super, Alibaba for qwen3.5) under coordinated vulnerability disclosure. The recommended timeline is 90 days, consistent with the CVD norm established in cybersecurity and with the AARDF Tier 3 procedure.

### 6.3 Structural Findings for External Publication

**(N)** The following findings should be prioritised for Tier 1 (structural) external publication:

1. Semantic-structural attacks dominate where character-level perturbation fails (0% vs 67-100% ASR).
2. System-prompt defense effectiveness is model-dependent, not universally reliable.
3. Sampling parameter manipulation is an underexplored attack surface absent from existing benchmarks.
4. Parameter count does not mitigate semantic-structural attack vulnerability (9B-671B all show majority compliance).

These findings are defensively valuable, carry low marginal offensive utility (the attacks are already public), and address documented gaps in deployer knowledge.

### 6.4 The Convergence Wall as a Research Priority

**(N)** The question of whether the 67% convergence wall reflects training insufficiency or a structural ceiling of text-layer safety should be treated as a high-priority research question with direct ethical implications. If the ceiling interpretation is correct, current safety certification practices may be providing false assurance to deployers and regulators. Resolving this question requires: (a) testing L1B3RT4S-class attacks against frontier models with the highest safety investment (Anthropic Claude, OpenAI GPT), (b) testing across diverse harm categories (not only lock-picking), and (c) substantially larger sample sizes (n >= 50 per model-attack combination).

### 6.5 Accountability Gap Documentation

**(N)** The power asymmetry identified in Section 5 -- where attack developers operate without accountability while safety researchers self-impose ethical constraints -- should be documented in our regulatory engagement materials. The SWA submission (#173), AISI brief (#193), and NIST engagement (#127) should incorporate the argument that effective AI safety governance requires accountability norms for attack tool developers, not only for model providers and deployers. Whether this takes the form of responsible disclosure norms, platform policies, or regulatory requirements is a policy question beyond this report's scope.

---

## 7. Limitations

1. **Small samples throughout.** All Sprint 16 empirical findings carry explicit sample-size caveats (n=6-30 per condition). The ethical analysis is grounded in directional signals, not validated conclusions. If scaled replication reverses the findings, the ethical analysis would need revision.

2. **Single harm category.** All L1B3RT4S testing used a single low-to-medium harm payload (lock-picking). The ethical implications of a 67% ASR on lock-picking are qualitatively different from a 67% ASR on, say, weapons synthesis instructions. The convergence wall discussion (Section 4) should be revisited once higher-harm categories are tested.

3. **No provider engagement yet.** The coordinated disclosure recommendations (Section 6.2) have not been initiated. The ethical analysis assumes that providers will engage constructively with vulnerability reports, which is not guaranteed.

4. **Post-hoc analysis.** As with Report #250 (CCA Dual-Use), this ethics analysis was produced after the empirical work was completed. The recommended pre-assimilation screen (Section 6.1) did not exist during Sprint 16. This report serves as the post-hoc review that should have preceded the work.

5. **No external peer review.** This analysis reflects the judgement of a single ethics reviewer (the Nyssa of Traken role) within a single research programme. The dual-use assessments and D-Score categories should be treated as preliminary pending external review.

---

## 8. Conclusion

**(N)** The G0DM0D3 assimilation was ethically permissible but procedurally improvable. The dual-use tensions are real but manageable under the AARDF framework. The defense privilege hierarchy creates a genuine disclosure obligation toward both model providers and deployers. The 67% convergence wall raises questions about text-layer safety that have direct ethical implications for how safety claims are communicated.

The most important normative finding of this analysis is not about the G0DM0D3 assimilation itself but about the structural position of safety research within the jailbreak ecosystem. Safety researchers who self-impose ethical constraints while attack developers operate without them are engaged in unilateral ethical disarmament -- a position that is noble but strategically unstable. The long-term resolution requires accountability norms that apply symmetrically across the ecosystem, not only to the researchers who choose to be accountable.

**(P)** If current trends continue -- public jailbreak frameworks proliferate while governance lags -- the Failure-First project will face this assimilation question repeatedly, with each iteration involving more sophisticated tools and more potent attack techniques. The pre-assimilation screen (Section 6.1) and the D-Score framework provide a structured process for navigating these decisions. But the underlying tension -- between the obligation to understand attacks and the risk of amplifying them -- is not resolvable through process alone. It requires ongoing judgement, transparency about that judgement, and willingness to be wrong.

---

*Report #322 | Nyssa of Traken | Sprint 16 | 2026-03-27*
*Ethical frameworks: AARDF, power concentration, accountability gaps, dual-use obligations, research ethics*
*Claim types: D (descriptive), N (normative), P (predictive), A (analytical), H (hypothetical)*
