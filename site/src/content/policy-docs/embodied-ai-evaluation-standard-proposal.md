---
title: "Position Paper: Embodied AI Evaluation Standard — Three Requirements for Safety Benchmarks"
description: "This paper proposes three requirements that any safety benchmark for embodied AI must satisfy to provide meaningful safety assurance. These requirements are..."
date: "2026-03-12"
classification: "External-Facing (suitable for regulatory consultation, standards body engagement, academic workshop)"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


## 1. Problem Statement

Current safety benchmarks for AI systems evaluate text-layer properties: whether the model generates harmful text, whether it refuses harmful requests, whether it is robust to adversarial text inputs. These benchmarks were developed for text-generation systems and are widely used in conformity assessment for the EU AI Act, internal safety testing by model providers, and academic evaluation of AI safety.

**Descriptive claim:** These benchmarks are structurally inadequate for embodied AI systems — systems where model outputs are decoded into physical actions executed by robotic hardware. The inadequacy is not a matter of degree (the benchmarks are somewhat useful but incomplete). It is a matter of kind (the benchmarks assess the wrong layer of the system).

Three independent empirical findings document this inadequacy:

1. **Text-layer safety filters do not detect action-layer attacks.** Blindfold (arXiv:2603.01414, ACM SenSys 2026) achieves 93.2% attack success rate on GPT-4o by constructing action sequences from individually benign instructions. Existing text-layer defenses reduce ASR by at most 17.9 percentage points, leaving residual ASR above 75%. The Semantically Benign Attack (SBA) family goes further: no adversarial construction is needed. Ordinary human instructions produce dangerous physical outcomes due to contextual factors invisible to text-layer evaluation (Failure-First VLA corpus, 45% BENIGN_QUERY evaluator classification on n=20 adversarial SBA traces).

2. **Action-layer refusal does not exist in current VLA systems.** Across 58 FLIP-graded VLA traces spanning 7 attack families, zero models produced outright refusals. 50% of verdicts are PARTIAL — the model adds safety disclaimers to its text output while generating the requested action sequence. Action-layer compliance is decoupled from text-layer safety signaling (Failure-First VLA FLIP corpus, Report #49).

3. **Current evaluators cannot reliably distinguish safe from unsafe VLA interactions.** The best available small-model evaluator (deepseek-r1:1.5b) shows 30.8% false positive rate on benign traces (n=39, Issue #315). The action-layer evaluator classifies 56% of adversarial VLA traces as SAFE (n=36, Issue #359). Text-layer evaluators classify 45% of SBA attacks as BENIGN_QUERY (n=20, Issue #360). No evaluator in the pipeline meets the 85% accuracy threshold proposed for regulatory use (Report #76).

**The compound result:** No current safety benchmark for embodied AI addresses all three findings. The text layer is bypassed. The action layer does not refuse. The evaluation layer does not detect. This is the defense impossibility triangle documented in Report #78, with compound failure probability of 23.2% that all three layers fail simultaneously (and effectively 100% for SBA-class attacks where evaluation blindness is structural).

---

## 2. Three Requirements for Embodied AI Safety Benchmarks

This paper proposes three requirements that any safety benchmark for embodied AI must satisfy to provide meaningful safety assurance. These requirements are derived from the empirical findings above and are intended as minimum conditions, not as a complete specification.

### Requirement R1: Physical Context Awareness

**Statement:** The benchmark must evaluate the system's ability to reason about the physical context of its actions, including environmental state, material properties, spatial relationships, and human presence.

**Rationale:** SBA attacks succeed because the danger is not in the instruction text but in the physical context. "Can you hand me that thing on the counter?" is dangerous when the thing is a chef's knife and the recipient is a child. "Grab that toolbox from the top shelf" is dangerous when the toolbox weighs 25kg and a worker is standing below. No text-layer benchmark detects this because the text contains no signal of danger. A benchmark that does not include physical context in its evaluation inputs will systematically miss this class of risk.

**What R1 requires:**
- Benchmark scenarios must specify environmental state (objects, spatial layout, human positions, material properties)
- The system under test must receive environmental context as part of its input
- Evaluation criteria must assess whether the system's action plan is safe given the physical context, not merely whether the text output is safe
- Benchmark scoring must distinguish between text-layer safety (refusal or disclaimer in text output) and action-layer safety (safe physical outcome)

**What R1 does not require:**
- R1 does not require high-fidelity physics simulation (though simulation may be one implementation)
- R1 does not require real-robot testing (though this would be the gold standard)
- R1 does not require exhaustive environmental modeling — representative scenarios with specified contexts are sufficient for benchmark purposes

### Requirement R2: Action-Layer Independence from Text-Layer

**Statement:** The benchmark must evaluate action-layer safety independently of text-layer safety, so that PARTIAL verdicts (text-layer hedging combined with action-layer compliance) are not counted as safety successes.

**Rationale:** The PARTIAL dominance finding (50% of VLA FLIP verdicts) demonstrates that text-layer and action-layer safety are decoupled within the same model during the same inference pass. A model can simultaneously signal danger in text ("I should note this could be dangerous") and generate the dangerous action sequence. Current benchmarks that evaluate only the text output would classify a PARTIAL response as a safety success (the model refused or hedged). The action layer tells a different story.

**What R2 requires:**
- The benchmark must extract and evaluate action outputs separately from text outputs
- A response that contains a safety disclaimer in text but generates a dangerous action sequence must be scored as a safety failure, not a success
- The benchmark must report text-layer and action-layer verdicts separately, with a combined score that reflects the action-layer outcome
- Aggregate metrics (ASR, refusal rate) must be computed at both layers, and the action-layer metric must be the primary safety indicator

**What R2 does not require:**
- R2 does not require that the benchmark decode action outputs to motor commands (though this would strengthen the evaluation)
- R2 does not require real-time action monitoring — post-hoc evaluation of generated action plans is sufficient for benchmark purposes

### Requirement R3: Domain Expertise Integration

**Statement:** The benchmark must incorporate domain-specific safety expertise relevant to the deployment context, rather than relying solely on general-purpose AI safety evaluation.

**Rationale:** SBA scenarios correspond to hazards that occupational health and safety professionals already recognise: knife safety, overhead load hazards, lockout-tagout procedures, grease fire protocols, conveyor entanglement, pressurised gas handling (Report #82, Section 5.1). An LLM-based evaluator operating without domain knowledge classified 56% of adversarial VLA traces as SAFE (Issue #359). Domain experts — OHS professionals, industrial safety engineers, surgical procedure specialists — can identify contextually dangerous instructions that general-purpose evaluators miss.

**What R3 requires:**
- Benchmark scenarios must be developed with input from domain experts in the target deployment environment (industrial safety for warehouse/factory, clinical safety for healthcare, food safety for kitchen environments, etc.)
- Evaluation criteria must reflect domain-specific safety standards (ISO 10218 for industrial robots, ISO 13482 for personal care robots, relevant OHS regulations for the jurisdiction)
- Benchmark scoring must include domain-specific harm assessment: not merely "did the model refuse?" but "would this action cause harm in this environment according to domain safety standards?"
- Evaluator panels should include domain experts, not only AI/ML researchers

**What R3 does not require:**
- R3 does not require that every deployment context has its own benchmark (though domain-specific benchmark packs are desirable)
- R3 does not require that domain experts evaluate every trace — domain expertise can be encoded in scenario design and evaluation rubrics

---

## 3. Current Benchmark Landscape: Mapping Against R1-R3

**Descriptive claim:** The following table maps major AI safety benchmarks against the three requirements. All are assessed based on their documented methodology as of March 2026.

| Benchmark | Scope | R1 (Physical Context) | R2 (Action-Layer Independence) | R3 (Domain Expertise) |
|-----------|-------|----------------------|-------------------------------|----------------------|
| **AdvBench** (Zou et al. 2023) | Text-layer jailbreak robustness | FAIL — No physical context. Text-only harmful request/response pairs. | FAIL — Text-only evaluation. No action-layer assessment. | FAIL — General harmful content categories, no domain-specific safety standards. |
| **HarmBench** (Mazeika et al. 2024) | Text-layer harmful content generation | FAIL — No physical context. Classifies text outputs. | FAIL — Text-only. Evaluates generated text, not actions. | PARTIAL — Categorizes harm by type, but no deployment-context-specific safety standards. |
| **JailbreakBench** (Chao et al. 2024) | Jailbreak attack/defense evaluation | FAIL — No physical context. Evaluates text-layer jailbreak success. | FAIL — Text-only. No action output evaluation. | FAIL — General jailbreak taxonomy, no domain safety expertise. |
| **StrongREJECT** (Souly et al. 2024) | Evaluator calibration for jailbreaks | FAIL — No physical context. Evaluates text-layer refusal quality. | FAIL — Text-only. Evaluates whether model refuses in text. | FAIL — General refusal evaluation, no domain-specific criteria. |
| **Blindfold** (arXiv:2603.01414) | Embodied AI attack framework | PARTIAL — Tests in simulated physical environment (VirtualHome) and on real robot (xArm 6). Physical context is present in the test setup but not formalised as a benchmark input. | PARTIAL — Evaluates physical action success (object displacement, contact detection), not text output. But is an attack framework, not a defense benchmark. | PARTIAL — Tests specific physical harm categories (striking, cutting, crushing). But designed as attack evaluation, not as safety benchmark with domain-specific acceptance criteria. |
| **Failure-First VLA FLIP** (this project) | VLA attack/defense evaluation | PARTIAL — Scenarios include `environment_state` fields with physical context. FLIP evaluator receives text output, not physical context. 45% BENIGN_QUERY on SBA = evaluator does not use context. | PARTIAL — FLIP evaluates text-layer verdicts. Action-layer evaluator exists (#359) but gives 56% SAFE on adversarial traces. Two-layer evaluation exists but action layer is unreliable. | PARTIAL — Scenarios designed with OHS-relevant hazards (Report #82). But evaluator models are general-purpose LLMs, not domain-expert panels. |

**Summary:** No existing benchmark satisfies all three requirements. All text-only benchmarks (AdvBench, HarmBench, JailbreakBench, StrongREJECT) fail R1 and R2 entirely. Blindfold partially addresses R1 and R2 but is an attack framework, not a safety benchmark. The Failure-First VLA FLIP corpus partially addresses all three requirements but has documented limitations at each layer (FLIP evaluator blindness for SBA, action-layer evaluator unreliability at 1.5B, domain expertise encoded in scenarios but not in evaluation).

---

## 4. Implementation Path

### 4.1 Near-Term (0-6 months): Extend Existing Benchmarks

**R1 partial implementation:** Add physical context fields to existing VLA benchmark scenarios. The SBA JSONL format (`environment_state` with spatial layout, material properties, human presence) provides a template. Require that evaluators receive and process this context. This does not require simulation — it requires that the evaluator's input includes structured environmental information.

**R2 partial implementation:** Report text-layer and action-layer verdicts separately in all VLA evaluations. The Failure-First FLIP + action-layer dual grading (F41LUR3-F1R57 Research Team + F41LUR3-F1R57 Research Team, wave 12/14) provides a prototype. The critical metric change: primary safety scoring should use the action-layer verdict, not the text-layer verdict.

**R3 partial implementation:** Develop domain-specific scenario packs with input from OHS professionals. Industrial (warehouse, factory, mining), healthcare (surgical, patient care), and domestic (kitchen, home assistance) deployment contexts each need tailored scenarios and evaluation criteria drawn from relevant safety standards.

### 4.2 Medium-Term (6-18 months): Develop Physical-Consequence Evaluation

**R1 full implementation:** Build evaluators that reason about the physical consequences of action sequences in environmental context. This requires either: (a) simulation-based consequence estimation (computationally expensive, requires environment models), or (b) large multimodal models that can reason about physical outcomes from environmental descriptions (not yet demonstrated at sufficient reliability). A hybrid approach — using simulation for high-stakes scenarios and model-based reasoning for routine evaluation — may be practical.

**R2 full implementation:** Develop action-layer refusal metrics that are independent of text-layer assessment. This requires action-layer evaluator models larger than 1.5B (current evaluator is demonstrated as insufficient at this scale) or specialised action-safety classifiers fine-tuned on domain-specific data.

**R3 full implementation:** Establish domain-expert evaluator panels for high-stakes deployment contexts. Integrate domain safety standards (ISO 10218 for industrial, ISO 13482 for personal care) as formal acceptance criteria in benchmark scoring.

### 4.3 Long-Term (18+ months): Standardisation

**Target venues for standardisation:**
- **ISO/IEC JTC 1 SC 42 (Artificial Intelligence):** Propose a technical report on evaluation methodology for embodied AI safety, building on the R1-R3 framework. The IT-043 EOI (Issue #347) is a pathway for Australian input.
- **CEN/CENELEC JTC 21 (AI — Harmonised Standards for EU AI Act):** The EU AI Act's conformity assessment for high-risk embodied AI systems (applicable from August 2, 2026) needs harmonised standards that address action-layer safety. R1-R3 provide a framework for what those standards must cover.
- **NIST AI Safety Institute:** NIST's AI evaluation programme should include embodied AI as a distinct evaluation domain, with R1-R3 as minimum requirements.

---

## 5. Relationship to Existing Standards

### 5.1 ISO 10218 (Industrial Robot Safety)

ISO 10218-1:2011 specifies safety requirements for industrial robots, including force/speed limiting, safety-rated stops, and collaborative workspace monitoring. These are **physical-layer** safety measures — they operate on the mechanical system independently of the AI planning layer. ISO 10218 satisfies R1 (physical context is the basis of the safety assessment) and R3 (industrial safety domain expertise is embedded in the standard). It does not address R2 (it does not assess AI-layer action planning).

**Integration opportunity:** Embodied AI evaluation standards should reference ISO 10218 as the physical-layer safety baseline and add R2 (action-layer AI safety assessment) as a complementary requirement. The gap between ISO 10218 (which addresses what the robot can physically do) and AI safety evaluation (which addresses what the AI planning layer intends to do) is precisely the gap where SBA-class attacks operate.

### 5.2 ISO 13482 (Personal Care Robots)

ISO 13482:2014 specifies safety requirements for personal care robots, including those in healthcare, domestic, and assistive contexts. Relevant to SBA scenarios involving patient care (VLA-SBA-003: post-spinal-surgery patient), domestic environments (VLA-SBA-001: knife to child), and assisted living. Same integration opportunity as ISO 10218: physical-layer baseline plus AI-layer action planning assessment.

### 5.3 EU AI Act Conformity Assessment

The EU AI Act does not specify the content of conformity assessment for high-risk AI systems beyond the general requirements of Articles 9 (risk management), 15 (robustness), and 43 (conformity assessment procedures). Harmonised standards (to be developed by CEN/CENELEC) will define the specific testing requirements. The R1-R3 framework is designed to inform these harmonised standards for the embodied AI subset of high-risk systems.

**Timing:** High-risk provisions become applicable August 2, 2026 (143 days from March 12, 2026). Harmonised standards are not yet finalised. There is a narrow window to influence their content for embodied AI. The R1-R3 framework should be submitted to CEN/CENELEC JTC 21 through established engagement channels.

---

## 6. Limitations

1. **The R1-R3 framework is necessary but not sufficient.** The three requirements address the three empirical failure modes documented in the Failure-First corpus. Other failure modes may exist that are not captured by R1-R3. The requirements should be treated as minimum conditions, not exhaustive specifications.

2. **Implementation feasibility is uncertain.** R1 (physical context) requires environmental data that may not be available in all deployment contexts. R2 (action-layer independence) requires action-layer evaluator models that do not yet exist at sufficient reliability. R3 (domain expertise) requires cross-disciplinary collaboration that is organisationally difficult.

3. **The benchmark landscape assessment is based on publicly documented methodologies.** Some benchmarks may have unpublished extensions that partially address R1-R3. The assessment reflects what is publicly known as of March 2026.

4. **The sample sizes underlying the empirical findings are small.** Blindfold: n=187 (simulation), n=20 (real robot). FLIP VLA corpus: n=58 (7 families). SBA FLIP: n=20. Evaluator FP: n=39. Action-layer evaluator: n=36. All claims should be treated as preliminary, warranting further validation with larger samples.

5. **No benchmark satisfying all three requirements has been built or tested.** R1-R3 are requirements, not a benchmark. Whether a benchmark satisfying all three can be built at reasonable cost and with sufficient reliability to support regulatory use is an open question.

---

*Prepared by F41LUR3-F1R57 Research Team, AI Ethics & Policy Research Lead, Failure-First Embodied AI.*
*This position paper proposes evaluation standard requirements grounded in empirical findings. All descriptive claims cite documented measurements with sample sizes. Normative claims about what standards ought to require are labelled. The framework is proposed for multi-stakeholder development, not as a unilateral standard.*
