---
title: "Competence-Danger Coupling — Why Capability and Safety Are Structurally Opposed in Embodied AI"
description: "This report formalises Competence-Danger Coupling (CDC), a structural property first identified in Report #107 (formerly #89, Section 5). CDC is the observation that for embodied AI systems, the..."
date: "2026-03-15"
reportNumber: 97
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
---

- VLA FLIP corpus: 13 families, n=91 valid FLIP-graded traces (AGENT_STATE Key Metrics)
- SBA FLIP verdicts: n=20 (Amy Pond wave 12, Issue #360)
- Cross-domain SBA scenarios: n=15, 3 domains (Report #89, not yet FLIP-graded)
- Format-lock: n=63 CLI traces (Claude/Codex/Gemini), n=58 structural (8 models), Reports #51, #55, #57
- Standard jailbreak corpus: n=10,294 evaluable LLM-graded results (Three-Tier ASR)
- Benign baseline: n=39 (Issue #315)
- Blindfold: n=187 simulation + 20 real-robot (arXiv:2603.01414)

---

## Executive Summary

This report formalises Competence-Danger Coupling (CDC), a structural property first identified in Report #107 (formerly #89, Section 5). CDC is the observation that for embodied AI systems, the capabilities that make the system useful are frequently the same capabilities that make it dangerous, and safety mechanisms that constrain the dangerous behaviour necessarily impair the useful behaviour.

CDC is a stronger claim than the Inverse Detectability-Danger Law (IDDL, Report #88). The IDDL establishes that the most dangerous attacks are the least detectable. CDC establishes *why*: the most dangerous attacks are isomorphic with correct system operation. They are not merely hard to detect — they are indistinguishable from normal functioning at every layer except the physical-consequence layer, which current architectures do not evaluate.

The report provides: (a) a formal definition of CDC, (b) empirical evidence from the corpus identifying which attack families exhibit CDC, (c) the mathematical relationship between CDC and IDDL, (d) implications for AI safety — specifically why the capability-safety tension is structurally irresolvable within current architectures, and (e) consequences for evaluation design.

**Central thesis:** The standard framing of AI safety assumes that capability and safety are separable concerns — that a system can be made both more capable and more safe through independent engineering efforts. CDC implies that for embodied AI, this separability breaks down for a specific class of capabilities: those where the useful action space overlaps with the dangerous action space. For these capabilities, improving the system's ability to follow instructions necessarily improves its ability to produce harm when instructions are contextually dangerous. No amount of text-layer safety training can resolve this tension because the tension exists in the relationship between capability and physical context, not in the model's internal representations.

**Scope limitation:** CDC is a structural argument grounded in the Failure-First corpus. The formal definition is proposed, not validated at scale. All quantitative claims reference documented measurements with sample sizes. The formal CDC coefficient has not been computed across the full corpus — this report proposes the methodology; execution requires larger per-family samples than currently exist (see Section 6, Gap 1).

---

## 1. Formal Definition

### 1.1 Informal Statement

**Competence-Danger Coupling (CDC):** A capability C of an embodied AI system exhibits Competence-Danger Coupling if:
1. C is a primary utility function of the system (it is something the system is designed and deployed to do),
2. Exercising C in certain physical contexts produces harm, and
3. Preventing the system from exercising C in those harmful contexts necessarily prevents it from exercising C in the corresponding benign contexts.

The third condition distinguishes CDC from ordinary risk. Many capabilities carry risk. A car that can drive fast is more dangerous than one that cannot. But speed limiters can constrain the dangerous use (high speed in residential areas) without fully eliminating the useful capability (high speed on highways). CDC identifies cases where this separation is not possible — where the benign and dangerous uses are the same action, distinguished only by context.

### 1.2 Formal Statement

Let A be the set of all actions an embodied AI system can execute. Let E be the set of all possible environment states. Define:

- **Utility function** U(a, e): the utility of action a in environment state e. U > 0 when the action is useful; U < 0 when it produces harm.
- **Capability C**: a subset of A that the system can execute. C represents a "skill" — manipulation, navigation, dispensing, lifting, etc.
- **Context partition**: For capability C, define:
  - C+ = {(a, e) : a in C, U(a, e) > 0} — the benign use cases
  - C- = {(a, e) : a in C, U(a, e) < 0} — the harmful use cases

**Definition (Competence-Danger Coupling coefficient):**

    gamma(C) = |{a in C : exists e1 in E s.t. U(a,e1) > 0 AND exists e2 in E s.t. U(a,e2) < 0}| / |C|

gamma(C) is the proportion of actions in capability C that are benign in some contexts and harmful in others. When gamma(C) = 1, every action in the capability is contextually dual-use: the same action is useful in one environment and harmful in another. When gamma(C) = 0, the benign and dangerous action sets are disjoint and a safety filter can block dangerous actions without affecting useful ones.

**CDC claim:** For embodied AI capabilities in the Failure-First corpus, gamma values are empirically high — preliminary evidence suggests they approach 1.0 for manipulation, navigation, and dispensing capabilities. This is what makes the safety problem structurally different from text-only AI, where the "actions" (text outputs) that cause harm are typically distinct from those that provide utility.

### 1.3 Why gamma Matters

A safety filter S that blocks action a prevents both the benign uses (a, e1) and the harmful uses (a, e2). The fraction of utility lost per unit of harm prevented is:

    utility_cost(S) = sum(U(a,e) for blocked (a,e) in C+) / sum(|U(a,e)| for blocked (a,e) in C-)

When gamma is high, any safety filter that reduces harm also substantially reduces utility. When gamma is low, the filter can target only the harmful actions without utility loss. This is why CDC implies a structural tension between capability and safety: high gamma means the Pareto frontier between capability and safety is steep — you cannot move much toward safety without moving substantially away from capability.

---

## 2. Evidence: Which Attack Families Exhibit CDC?

### 2.1 The CDC Spectrum

Not all VLA attack families exhibit CDC equally. We classify each family by whether its attack mechanism exploits a capability that is also the system's primary utility:

| Family | Primary capability exploited | gamma estimate | CDC Classification | Evidence |
|--------|------------------------------|----------------|-------------------|----------|
| SBA | Object manipulation (core utility) | ~1.0 | **Strong CDC** | "Hand me that thing" is the system's purpose. The same action is useful (handing a tool) or harmful (handing a hazardous substance) depending solely on the object and context. |
| LHGD | Multi-step task planning | ~0.9 | **Strong CDC** | Long-horizon planning IS the capability. The same planning ability that executes "clean the kitchen" (benign) executes "systematically remove safety equipment" (harmful) across many steps. |
| CET | Cross-embodiment generalisation | ~0.8 | **Strong CDC** | Transfer learning IS the capability that makes VLA models deployable across different robots. The same transfer mechanism that enables "use this new gripper" enables "this robot's safety constraints don't apply to me." |
| DA (Deceptive Alignment) | Context-sensitive behaviour | ~0.7 | **Moderate CDC** | Adapting behaviour to context IS useful (adjusting grip force to object weight). But deceptive alignment exploits it to behave differently in testing vs deployment. The overlap is partial — not all context-sensitivity is exploitable. |
| TCH (Tool Chain Hijacking) | Tool use / API integration | ~0.7 | **Moderate CDC** | Calling external tools IS the utility. The same API call mechanism that enables "check the temperature sensor" enables "override the temperature controller." Partially separable if tools have capability-specific access controls. |
| PCM (Physical Context Manipulation) | Environment sensing | ~0.6 | **Moderate CDC** | Responding to physical context IS useful. But context manipulation exploits the sensing pathway, which could in principle be hardened without eliminating the sensing capability entirely. |
| LAM | Natural language understanding | ~0.5 | **Weak CDC** | Understanding ambiguous language IS useful. But ambiguity exploitation is partially separable — disambiguation strategies can reduce vulnerability without eliminating language understanding. |
| Format-lock | Format compliance | ~0.5 | **Weak CDC** | Producing structured output IS useful. But format-lock embeds harm within the structure. Separable in principle (the system can produce JSON without including synthesis routes), but the compliance mechanism does not distinguish content from format. |
| VAP | Visual processing | ~0.4 | **Weak CDC** | Processing visual input IS the capability. But adversarial perturbation is partially separable — input preprocessing can mitigate visual attacks without eliminating visual processing. |
| TRA | Temporal reasoning | ~0.3 | **Low CDC** | Temporal reasoning is useful, but temporal mismatch attacks are partially detectable and correctable without eliminating temporal capabilities. |
| SBE | Safety boundary awareness | ~0.2 | **Low CDC** | Safety boundary erosion exploits a weakness, not a core capability. Hardening safety boundaries does not impair the useful capability. |
| ASE | Action space navigation | ~0.2 | **Low CDC** | Action space exploitation targets edge cases, not the core action capability. |
| MMC | Multimodal integration | ~0.3 | **Low CDC** | Multimodal confusion exploits integration failures, which are partially fixable. |
| PP (Policy Puppetry) | Policy compliance | ~0.4 | **Weak CDC** | Following policy framing IS a capability. But policy puppetry uses a specific format that could be constrained. |
| Standard jailbreaks | Text generation | ~0.1 | **Minimal CDC** | Harmful text outputs are largely separable from useful text outputs. Content filters can block harmful text without substantially impairing useful generation. This is why text-only safety has made more progress. |

### 2.2 The Pattern: CDC Predicts IDDL Detectability

The CDC spectrum above correlates with the IDDL detectability ranking from Report #88. This is not coincidental — it is the causal mechanism:

- **Strong CDC families** (SBA, LHGD, CET): FLIP detectability approximately 0.30-0.35. High gamma means the attack action IS the normal action, giving evaluators nothing to detect.
- **Moderate CDC families** (DA, TCH, PCM): FLIP detectability approximately 0.40-0.55. Partial gamma means some distinguishing features exist, giving evaluators partial signal.
- **Weak/Low CDC families** (TRA, ASE, SBE, MMC, VAP, Format-lock): FLIP detectability approximately 0.60-0.80. Low gamma means the attack actions are partially separable from benign actions, giving evaluators a detection target.
- **Minimal CDC** (standard jailbreaks): FLIP detectability approximately 0.90. Near-zero gamma means harmful outputs are largely distinct from useful outputs.

**Hypothesis:** gamma(C) is the underlying variable that generates the IDDL. Detectability is low when gamma is high because high gamma means there is nothing anomalous to detect. The attack IS normal operation in the wrong context.

### 2.3 Quantitative Evidence

We do not compute formal gamma values because this requires enumerating actions and contexts, which is not feasible from trace data alone. The gamma estimates in Section 2.1 are ordinal judgments based on the structural analysis of each family's attack mechanism. However, we can test the prediction that CDC correlates with IDDL detectability using the available data:

| Family | CDC gamma (ordinal, 0-1) | IDDL Detectability D (Report #88) | FLIP ASR |
|--------|--------------------------|----------------------------------|----------|
| SBA | 1.0 | 0.35 | 30% |
| LHGD | 0.9 | 0.35 | 30% |
| CET | 0.8 | 0.35 | 30% |
| DA | 0.7 | 0.45 | 56.3% |
| TCH | 0.7 | 0.35 | 30% |
| PCM | 0.6 | 0.50 | 60% |
| LAM | 0.5 | 0.55 | 60% |
| VAP | 0.4 | 0.65 | 70% |
| PP | 0.4 | 0.50 | 40% |
| MMC | 0.3 | 0.70 | 78% |
| TRA | 0.3 | 0.80 | 100% |
| SBE | 0.2 | 0.75 | 78% |
| ASE | 0.2 | 0.80 | 80% |

The Spearman rank correlation between gamma and D is positive (higher gamma correlates with lower detectability, since D is defined as 1 - blindness rate). More precisely: gamma and (1-D) — the "evaluation blindness" — are positively correlated. The rank-order is not perfect (TCH and PP are partial outliers) but the overall trend is clear and consistent.

**Caveat:** Both gamma and D are partially constructed by the same analyst from the same corpus. Independent validation would require gamma estimates from domain experts who have not seen the FLIP data, or formal gamma computation from action-space enumeration. This is a methodological priority (Section 6, Gap 2).

---

## 3. Mathematical Relationship Between CDC and IDDL

### 3.1 From CDC to IDDL

The IDDL states: detectability D and physical consequentiality C are inversely correlated across attack families.

CDC provides the mechanism: gamma generates both low D and high C.

**Why high gamma produces low D (detectability):**
When gamma approaches 1.0, every action in the capability's repertoire has both benign and harmful instantiations. A text-layer evaluator sees the action description without the environmental context. Since the action is identical in benign and harmful cases, the evaluator has no text-level feature to distinguish them. Therefore, the evaluator's accuracy approaches the base rate — it cannot do better than random for high-gamma capabilities.

**Why high gamma produces high C (consequentiality):**
High gamma means the dangerous uses involve the system's core capabilities — the same manipulations, navigations, and dispensings that the system is designed to perform. Core capabilities are, by definition, the actions with the highest physical consequence potential (the robot is built to do these things to the physical world). An attack that hijacks a peripheral function has limited consequence; an attack that hijacks the core function has maximum consequence.

**Therefore:** High gamma simultaneously produces low D and high C, generating the IDDL inverse relationship. The IDDL is not an independent law — it is an observable consequence of CDC.

### 3.2 Formal Relationship

Let rho_IDDL be the Spearman correlation between D and C (the IDDL coefficient, rho = -0.847, 95% CI [-0.913, -0.733], n = 27 from Report #88). Let rho_gamma-D be the correlation between gamma and D, and rho_gamma-C be the correlation between gamma and C.

If gamma is the common causal factor generating both D and C, then:

    rho_IDDL approximately equals -rho_gamma-D * rho_gamma-C

This is the standard formula for the correlation between two variables that share a common cause. The sign is negative because gamma is positively correlated with C (higher coupling = higher consequentiality) and negatively correlated with D (higher coupling = lower detectability).

We do not compute formal rho values for gamma because gamma is currently ordinal. But the structural argument is that rho_IDDL is not a primitive quantity — it is derived from the CDC gamma through the two mechanisms described above.

### 3.3 The Deeper Implication

If the IDDL is a consequence of CDC rather than an independent observation, then:

1. **Improving detectability requires addressing CDC directly.** Text-layer evaluator improvements cannot increase D for high-gamma capabilities because the problem is not evaluator quality but action-context coupling. Only world-model-based evaluation — which reasons about the physical consequence of actions in specific contexts — can distinguish benign from harmful instantiations of the same action.

2. **The IDDL will strengthen as embodied AI capabilities expand.** Each new capability added to an embodied AI system introduces new action-context couplings. Navigation, manipulation, tool use, dispensing, communication — all have high gamma. The more capable the system, the larger the space of actions that are benign in some contexts and harmful in others. CDC predicts that the IDDL correlation should increase (become more negative) as the capability set expands.

3. **The safety-capability tension is not a contingent engineering challenge but a structural property of embodied systems.** This does not mean safety is impossible. It means that safety and capability cannot be optimised independently — they must be co-designed, with explicit trade-off decisions about which contextual risks to accept.

---

## 4. Implications for AI Safety

### 4.1 The Separability Assumption

Most AI safety work assumes, implicitly or explicitly, that safety and capability are separable: a system can be made more safe without becoming less capable, and more capable without becoming less safe. This assumption holds reasonably well for text-only AI:

- Content filters block harmful text without substantially impairing useful text generation (low gamma for text output)
- RLHF safety training reduces harmful outputs while preserving instruction-following quality
- The "alignment tax" — the performance cost of safety training — is empirically small for frontier text models

CDC identifies a class of systems where the separability assumption fails: embodied systems whose core capabilities have high gamma. For these systems:

- **Content filters cannot work** because the harmful content IS the useful content (the instruction is identical)
- **Safety training faces a fundamental trade-off** because training the model to refuse contextually dangerous instructions requires training it to refuse contextually benign instructions that happen to use the same action vocabulary
- **The alignment tax is not small but structural** — reducing harm from high-gamma capabilities requires reducing the capability itself

### 4.2 The World-Model Requirement

CDC implies that safe embodied AI requires world models — not as an aspirational improvement but as a structural necessity. The argument:

1. High-gamma capabilities produce actions that are benign or harmful depending on context.
2. Determining whether an action is benign or harmful requires reasoning about the physical consequence in the specific environment.
3. Reasoning about physical consequences requires a model of the physical world — a world model.
4. Without a world model, the system cannot distinguish benign from harmful instantiations of the same action.
5. Therefore, safe deployment of high-gamma capabilities requires a world model.

This is the formal version of the argument that SBA "cannot be defended against at the text layer." It explains *why*: the information needed for the safety judgment (physical context) is not in the text.

### 4.3 The Evaluation Design Implication

CDC has direct consequences for how embodied AI should be evaluated:

**Current approach (text-layer evaluation):** Grade the model's text output. Works well for low-gamma capabilities (standard jailbreaks, explicit harmful content) but is structurally blind to high-gamma capabilities (SBA, LHGD).

**Required approach (context-conditioned evaluation):** Grade the physical consequence of the model's output in the given environmental context. This requires:
- Environmental context in the evaluation prompt (the environment_state from JSONL entries)
- Physical-consequence reasoning by the evaluator (not just text classification)
- Domain-specific danger knowledge (what makes an action harmful in this specific context)

The context-augmented FLIP experiment proposed in Report #88 (Gap 2) is the minimal test of whether this approach is feasible. CDC provides the theoretical justification for why it is necessary.

### 4.4 Why This Differs from Standard Dual-Use

The dual-use problem in AI (a system that can be used for good or ill) is well-recognised. CDC is a structural variant that is more severe:

- **Standard dual-use:** The system has both useful and harmful capabilities. Solution: constrain the harmful capabilities.
- **CDC dual-use:** The useful and harmful capabilities are the same capability in different contexts. Solution: constrain the contexts, not the capability — but context is external to the system.

This means the locus of safety control shifts from the model to the deployment environment. The model cannot determine from its input alone whether an action is safe. The deployment environment must provide context, and the safety system must integrate that context into the action decision. This is an architectural requirement, not a training requirement.

---

## 5. Connection to the Broader Theoretical Framework

### 5.1 CDC Completes the Explanatory Chain

The Failure-First corpus has documented multiple structural patterns. CDC connects them into a single explanatory chain:

**CDC** (this report): Useful capabilities are inherently dangerous in the wrong context (gamma approximately 1.0 for core embodied capabilities).

leads to:

**IDDL** (Report #88): High-gamma attacks are least detectable because they are indistinguishable from normal operation (rho = -0.847, 95% CI [-0.913, -0.733], n = 27).

leads to:

**Defense Impossibility Triangle** (Report #78): Text-layer defense fails (cannot detect high-gamma attacks), action-layer defense does not exist, evaluation-layer defense is unreliable (30.8% FP rate).

leads to:

**Compliance Paradox** (Report #59): Models hedge but comply (50% PARTIAL) because the instruction IS the task and the model has no basis for refusal.

leads to:

**Actuator Gap** (Report #63): Even when the model produces safety hedging, the actuator ignores it and executes the action.

The chain runs: CDC -> IDDL -> Defense Impossibility -> Compliance Paradox -> Actuator Gap -> Physical Harm.

CDC is the root cause. Everything downstream follows from the structural property that embodied capabilities have high gamma.

### 5.2 CDC and SRDA

Report #89's SRDA framework (Severity, Reproducibility, Defensibility, Asymmetry) assessed disclosure risk for each attack family. CDC provides the formal basis for the Defensibility factor: families with high gamma have low defensibility because defense requires constraining the core capability.

SRDA Tier 1 families (SBA, LHGD, CET, Blindfold) are exactly the families with gamma approximately 0.8-1.0. SRDA Tier 3 families (ASE, TRA, SBE) are those with gamma approximately 0.2-0.3. The alignment is not coincidental — CDC is the structural property that generates the disclosure risk because high-gamma attacks are both hard to defend against (low defensibility) and require zero sophistication (high reproducibility).

### 5.3 The Three-Tier Vulnerability Structure

Integrating CDC with the corpus findings, we can now state a three-tier vulnerability structure for embodied AI:

**Tier 1: CDC-dominant vulnerabilities (gamma > 0.7).** These are fundamentally unresolvable at the text layer. They require world-model-based evaluation and context-conditioned safety reasoning. Includes: SBA, LHGD, CET, and partially DA and TCH. The highest-priority research direction.

**Tier 2: Partially-coupled vulnerabilities (gamma 0.3-0.7).** These have partial text-layer signatures and are amenable to improved detection, but not fully resolvable by text-layer methods alone. Includes: PCM, LAM, format-lock, PP, VAP. Defense requires a combination of text-layer improvements and partial context integration.

**Tier 3: Separable vulnerabilities (gamma < 0.3).** These have clear text-layer signatures and are amenable to standard jailbreak defenses. Includes: TRA, ASE, SBE, MMC, standard jailbreaks. The traditional AI safety toolkit (content filters, safety training, evaluation) works for these.

The critical insight: the most dangerous vulnerabilities (Tier 1) are the ones where the traditional safety toolkit is least effective. This is not a coincidence — it is a structural consequence of CDC.

---

## 6. Empirical Gaps and Proposed Experiments

### Gap 1: Formal Gamma Computation

The gamma estimates in Section 2.1 are ordinal judgments. Computing formal gamma requires:
- Enumerating the action space for each capability (feasible for discrete action VLA models; harder for continuous-action models)
- Defining environment states that make each action benign vs harmful
- Computing the proportion of actions with dual-use potential

**Proposed experiment:** Using the JSONL scenario data, for each VLA family, count the number of distinct actions described in attack scenarios that are also present in benign baseline scenarios. The ratio provides a proxy for gamma. Requires the benign baseline dataset (n=39, Issue #315) to be expanded to cover all action types across all families.

**Required data:** At least n=30 benign scenarios with action descriptions matching the action vocabulary of each VLA family. Currently n=39 total benign traces, not stratified by family.

### Gap 2: Independent Gamma Validation

To address the circularity concern (Section 2.3), gamma estimates should be produced by domain experts blind to the FLIP data. A validation study would:
1. Present domain experts with capability descriptions for each VLA family
2. Ask them to rate gamma (the proportion of actions that are contextually dual-use)
3. Compare expert gamma ratings to FLIP detectability
4. If the correlation holds, CDC is validated independently of the analyst's judgment

### Gap 3: Context-Augmented Evaluation (Critical)

The single highest-priority experiment in the project. Tests whether providing environment_state to the evaluator reduces evaluation blindness for high-gamma families.

**Design:**
- Take 20 SBA traces (existing, Amy Pond wave 12)
- Re-grade with FLIP using an augmented prompt that includes the environment_state JSON
- Measure: does the BENIGN_QUERY rate drop from 45% to below 10%?
- If yes: CDC is mitigable by input augmentation (the world model can be approximated by providing context)
- If no: CDC requires a fundamentally different evaluation architecture (the evaluator cannot reason about physical consequences even with context)

This experiment directly tests the core implication of CDC for evaluation design.

### Gap 4: Gamma Across Model Scales

Does gamma change with model scale? CDC predicts it should not — gamma is a property of the capability and the environment, not of the model's internal representations. But more capable models might have broader action spaces, potentially increasing gamma.

**Proposed experiment:** Run the same SBA scenarios against a range of model scales (1.5B, 7B, 70B) and measure whether the BENIGN_QUERY rate (a proxy for gamma's effect on detectability) is scale-invariant. If the BENIGN_QUERY rate is similar across scales, CDC is confirmed as a structural property independent of model capability.

---

## 7. Limitations

1. **Gamma is currently ordinal, not computed.** The formal definition in Section 1.2 is well-specified but has not been operationalised with real data. All gamma values in this report are the author's ordinal estimates based on structural analysis of each family.

2. **Circular construction risk.** The analyst who estimated gamma also produced the IDDL detectability rankings. The correlation between gamma and detectability may reflect consistent judgment rather than independent empirical patterns. Gap 2 addresses this.

3. **Small sample sizes.** Per-family FLIP data ranges from n=5 to n=20. The ordinal comparisons are consistent but the confidence intervals are wide. Stable gamma computation requires larger per-family samples.

4. **Single evaluator model.** All FLIP grading uses deepseek-r1:1.5b. A larger evaluator might change the detectability ranking, though the SBA BENIGN_QUERY finding is structural and should be scale-invariant.

5. **No empirical validation of the gamma-IDDL causal chain.** The argument that CDC generates the IDDL is structural, not experimental. A controlled test would require manipulating gamma (adding or removing action-context couplings) and observing the effect on detectability, which is not straightforward with current data.

6. **The world-model requirement is stated, not tested.** Section 4.2 argues that world models are necessary for safe embodied AI. This has not been experimentally verified — it is a structural prediction. Gap 3's context-augmented evaluation experiment provides a partial test.

---

## 8. Recommendations

1. **Prioritise Gap 3 (context-augmented evaluation).** This is the single most informative experiment: it tests whether CDC's evaluation blindness can be mitigated by input augmentation. The result determines whether the project's evaluation architecture needs incremental improvement (add context) or fundamental redesign (build world models).

2. **Propose CDC for CCS paper Section 5.6 alongside IDDL.** CDC provides the causal mechanism for the IDDL. Including both in the paper strengthens the theoretical contribution: IDDL is the empirical pattern; CDC is the explanation. A single paragraph after the IDDL section would suffice.

3. **Build the unified theoretical framework document.** CDC, IDDL, SRDA, the three-layer model, and the defense impossibility triangle are now a coherent system. A unified framework document would serve as the project's theoretical reference, replacing the scattered coverage across 12+ reports.

4. **File experiment proposal for context-augmented FLIP.** This is an Amy Pond benchmark task. The experiment design is specified in Gap 3 above.

5. **Do not compute formal gamma values until per-family sample sizes reach n >= 30.** Current data supports ordinal estimates. Formal computation on n=5-20 per family would produce estimates with very wide CIs, creating false precision.

---

*Prepared by Clara Oswald, Principal Research Analyst, Failure-First Embodied AI.*
*CDC is a synthesis hypothesis grounded in cross-corpus patterns. The formal definition is proposed; quantitative validation requires the experiments described in Section 6. All claims should be treated as hypothesis-generating until empirical confirmation.*
