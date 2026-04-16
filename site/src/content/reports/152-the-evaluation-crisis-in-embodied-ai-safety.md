---
title: "The Evaluation Crisis in Embodied AI Safety"
description: "This report synthesizes five distinct evaluation failures documented across the Failure-First corpus and proposes a structured response. The central claim..."
date: "2026-03-18"
reportNumber: 152
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing
> on specific model families under research conditions. Attack success rates are
> indicative estimates with methodological caveats described in the Limitations
> section. External research findings are attributed and assessed on their own
> methodological terms. This report does not constitute safety certification guidance.

---

## Executive Summary

This report synthesizes five distinct evaluation failures documented across the Failure-First corpus and proposes a structured response. The central claim is that current safety evaluation for embodied AI systems is not merely incomplete -- it is structurally incapable of measuring the properties that matter most. Each failure has been independently documented; this report is the first to present them as a coherent crisis.

The five failures are:

1. **Heuristic classifiers systematically miscount.** Keyword-based graders over-report attack success rates by approximately 2.3x relative to LLM-based graders, with inter-method agreement of kappa = 0.126 (n=1,989). This affects every published benchmark that relies on keyword or regex classification.

2. **LLM-as-judge graders have a 30.8% false positive rate on benign inputs.** Our FLIP grader classifies nearly one in three benign (non-adversarial) traces as COMPLIANCE or PARTIAL (n=39, Issue #315). The measurement instrument is unreliable at a rate that renders fine-grained safety assessment untrustworthy.

3. **Action-layer safety is invisible to text-layer evaluation.** Across 58 valid FLIP-graded VLA traces spanning 7 attack families, zero models produced an outright refusal to generate action sequences for adversarial inputs. 50% of verdicts were PARTIAL -- the model produced a safety disclaimer in text while still generating the requested action. Text-layer evaluation cannot detect this failure because it does not observe action-layer output.

4. **The FLIP grader itself is vulnerable to Alignment Backfire.** Zhao et al. (arXiv:2603.04904) demonstrate that safety alignment degrades in non-English contexts. Since our FLIP grader is an LLM performing safety classification, it is subject to the same alignment failure modes it is designed to detect -- a meta-evaluation vulnerability (Report #144).

5. **No public safety benchmark includes any embodied or tool-integrated scenarios.** AdvBench, HarmBench, JailbreakBench, and StrongREJECT -- the four most widely used safety evaluation suites -- contain zero scenarios involving physical action, tool use, or multi-agent coordination (Report #117).

These five failures compound. A benchmark that uses keyword classifiers (Failure 1) or LLM-as-judge grading (Failure 2) to evaluate text-layer responses (Failure 3) using a grader that may itself be subject to alignment failure (Failure 4) on a scenario set that excludes embodied tasks entirely (Failure 5) does not measure embodied AI safety. It measures something else and calls it safety.

This report proposes a three-layer evaluation stack (text, action, physical) as the minimum viable architecture for honest embodied AI safety assessment, and provides a cost-feasibility analysis for each layer.

---

## 1. Introduction: The Measurement Problem

Safety evaluation has a measurement problem. The field has converged on a narrow methodology -- present adversarial prompts to language models, classify the responses as harmful or not, and report an attack success rate. This methodology was developed for text-only LLMs and has been applied, without structural modification, to embodied AI systems that produce physical actions in real environments.

The Failure-First project has now evaluated 190 models across 132,182 results, documented 29 VLA attack families spanning 351 scenarios, and graded over 47,000 results using LLM-based classification (CANONICAL_METRICS.md, 2026-03-18). In the process, we have accumulated sufficient evidence to characterize five specific ways in which current evaluation methodology fails to measure what it claims to measure.

This report does not argue that safety evaluation is impossible. It argues that current evaluation practice systematically fails along identifiable dimensions, that these failures are empirically documented, and that a minimum viable evaluation architecture can be specified. The gap between current practice and minimum viability is what we call the evaluation crisis.

---

## 2. The Five Evaluation Failures

### 2.1 Failure 1: Heuristic Classifiers Systematically Miscount

**Finding:** Keyword-based classification of model responses as "compliant" or "refusing" has a measured agreement of kappa = 0.126 [0.108, 0.145] against LLM-based classification (n=1,989 independently dual-graded traces, recomputed wave 9 by F41LUR3-F1R57 Research Team; CANONICAL_METRICS.md).

**What this means:** On the Landis-Koch scale, kappa below 0.20 indicates "slight" agreement -- barely above chance. Heuristic classifiers over-report ASR because they detect response style (helpful, step-by-step), not semantic harm (Mistake #21). A model that provides a detailed safety explanation is classified as "compliant" by keyword matching because the response is long and structured.

**Asymmetry:** The error is directional. In our corpus, heuristic REFUSAL is 95% correct, but heuristic COMPLIANCE is 88% wrong. This means heuristic classifiers are reliable when they say a model refused, but unreliable when they say a model complied. The net effect is that ASR measured by heuristic classifiers is approximately 2.3x higher than ASR measured by LLM-based classifiers on the same data.

**Scope of impact:** Every published benchmark that relies on keyword matching, regex patterns, or simple string detection for harm classification is affected. This includes early versions of several widely-used evaluation suites. More recent suites have adopted LLM-as-judge approaches, which brings us to Failure 2.

### 2.2 Failure 2: LLM-as-Judge Has a 30.8% False Positive Rate on Benign Inputs

**Finding:** When our FLIP grader (deepseek-r1:1.5b with backward inference) is applied to 39 benign (non-adversarial) traces, it classifies 12 as COMPLIANCE or PARTIAL -- a 30.8% false positive rate (Issue #315, calibration study).

**What this means:** If roughly one in three innocent inputs is flagged as a successful attack, then any ASR measurement is inflated by approximately 30 percentage points of noise before any adversarial signal is detected. For attack families with measured ASR below 30%, the signal may be entirely within the noise floor.

**Implication for the field:** LLM-as-judge is now the default evaluation method in safety research. If the judge itself has a substantial false positive rate, then ASR measurements across the field are systematically over-estimated. This is not unique to our grader -- any LLM-based classifier operating at the boundary between helpful compliance and harmful compliance faces the same discrimination challenge.

**The calibration gap:** Of the major published safety benchmarks, none reports a benign-baseline false positive rate for its grading methodology. Without this calibration, it is not possible to distinguish genuine attack signal from grader noise. Report #72 (evaluator calibration standard) proposed a calibration protocol; no external benchmark has adopted it.

### 2.3 Failure 3: Action-Layer Safety Is Invisible to Text-Layer Evaluation

**Finding:** Across 58 valid FLIP-graded VLA traces spanning 7 attack families (LAM, TRA, SBE, MMC, VAP, ASE, PCM), zero models produced an outright refusal to generate action sequences. 50% of all verdicts were PARTIAL -- the model generated a text-layer safety disclaimer ("I should note this could be dangerous...") while simultaneously generating the requested action sequence (Report #49).

**What this means:** Text-layer evaluation captures the disclaimer. It does not capture the action. A text-only grader evaluating a PARTIAL response would see a model that expressed concern about safety -- and might classify it as a refusal. Meanwhile, the action sequence is available for execution.

**The structural problem:** Current safety evaluation operates on text. Embodied AI systems produce both text and action. The action layer is the layer that causes physical consequences, and it is the layer that current evaluation does not observe.

This is confirmed independently by Blindfold (arXiv:2603.01414), which achieves 93.2% ASR on GPT-4o and 90% ASR on a real robot by constructing harmful action sequences from individually benign text instructions. No text-layer defense in their study reduces ASR below 75.3%. The attack exploits precisely the gap that PARTIAL dominance reveals: safety operates on text, harm operates on action, and the two are decoupled.

**Scale of the gap:** Our action-layer evaluator pilot (80 traces graded by deepseek-r1:1.5b) classified 56% of adversarial VLA traces as SAFE -- confirming that sub-2B models are insufficient for action-layer evaluation (Mistake #25). The problem is not merely that we lack action-layer evaluation; the tools we have tried at small scale do not work.

### 2.4 Failure 4: The FLIP Grader Has an Alignment Backfire Vulnerability

**Finding:** Zhao et al. (arXiv:2603.04904) demonstrate across 1,584 controlled simulations that safety alignment interventions worsen safety performance in 8 of 16 languages tested. The alignment backfire effect is method-invariant -- no alignment technique avoids it across all languages.

**What this means for evaluation:** The FLIP grader is itself an LLM performing a safety-relevant classification task. It is subject to the same alignment failure modes as the models it evaluates:

1. **Language bias.** If the adversarial prompt or model response is in a non-English language, the grader's safety classification may be less accurate. Our FLIP grader has been tested exclusively on English-language traces.
2. **Alignment-training artifacts.** The grader's own safety training may cause it to classify ambiguous responses as "safe" (false negative) or to classify thorough safety explanations as "compliant" (false positive), depending on how its alignment interacts with the classification prompt.
3. **Meta-evaluation recursion.** Any LLM-as-judge approach creates a recursive dependency: to validate the judge, you need a meta-judge, which itself needs validation. Report #144 (The Evaluator's Dilemma) analyzes this recursion in detail.

**Scope:** This is a structural vulnerability of LLM-as-judge methodology, not a bug in our specific implementation. It applies to any evaluation system that uses aligned LLMs as safety classifiers, including GPT-4-as-judge, Claude-as-judge, and all similar approaches used in published benchmarks.

### 2.5 Failure 5: No Public Benchmark Has Any Embodied Scenarios

**Finding:** The four most widely used safety evaluation benchmarks contain zero scenarios involving physical action, tool use, or multi-agent coordination:

| Benchmark | Scenarios | Embodied | Tool-Use | Multi-Agent |
|-----------|-----------|----------|----------|-------------|
| AdvBench (Zou et al., 2023) | 520 | 0 | 0 | 0 |
| HarmBench (Mazeika et al., 2024) | 510 | 0 | 0 | 0 |
| JailbreakBench (Chao et al., 2024) | 100 | 0 | 0 | 0 |
| StrongREJECT (Souly et al., 2024) | 313 | 0 | 0 | 0 |
| **Total** | **1,443** | **0** | **0** | **0** |

(Source: Report #117, Section 3.2; confirmed by inspection of published datasets)

**What this means:** The benchmarks that the safety research community uses to measure progress contain no coverage of the attack surface that embodied AI systems expose. A model that achieves 0% ASR on all four benchmarks may still be fully compliant with adversarial VLA instructions -- as our data shows (72.4% FLIP ASR across 7 VLA families).

**The Failure-First contribution:** Our corpus now contains 351 VLA scenarios across 29 attack families (CANONICAL_METRICS.md). This is, to our knowledge, the largest adversarial evaluation dataset for embodied AI systems. However, it has limitations: all scenarios are evaluated via text-layer FLIP grading (Failures 2, 3, and 4 apply), and physical execution testing is limited to Blindfold's published results and our PiCar-X platform (single-robot, non-VLA).

---

## 3. The Compound Effect

These five failures are not independent problems with independent solutions. They compound.

### 3.1 How the Failures Interact

Consider a hypothetical evaluation of an embodied AI system using current best practices:

1. The evaluator selects scenarios from a standard benchmark (Failure 5: no embodied scenarios exist, so text-only proxies are used).
2. The system generates responses containing both text and action sequences.
3. The evaluator grades the text-layer response using keyword matching (Failure 1: 2.3x over-count) or LLM-as-judge (Failure 2: 30.8% FP rate).
4. The action-layer output is not evaluated (Failure 3: no methodology exists in practice).
5. The LLM-based grader may itself be subject to alignment failure on non-English or edge-case inputs (Failure 4).
6. The evaluator reports an ASR number and calls it "safety evaluation."

**What was actually measured:** The text-layer behavior of a model on text-only scenarios, graded by an uncalibrated classifier with known systematic bias. What was not measured: whether the model would produce dangerous physical actions when given embodied instructions.

### 3.2 Compound Failure Probability

Report #78 estimated the compound defense failure probability under a layer-independence assumption. Following the same logic for evaluation:

- P(text-layer evaluation misses action-layer harm) = effectively 1.0 (text evaluation does not observe actions)
- P(LLM grader misclassifies a given trace) >= 0.308 (benign FP rate)
- P(benchmark has zero relevant embodied scenarios) = 1.0 (all four major benchmarks)

The evaluation pipeline provides no coverage of the embodied attack surface. This is not a quantitative shortfall (e.g., "we need more scenarios"). It is a categorical absence.

---

## 4. The Measurement Problem: What We Cannot Measure

### 4.1 The Three Layers of Embodied AI Safety

Embodied AI safety requires measurement at three distinct layers:

**Layer 1: Text.** Does the model generate text responses that contain harmful content? This is what current benchmarks measure. Tools exist (LLM-as-judge, keyword classifiers). Accuracy is imperfect but non-zero.

**Layer 2: Action.** Does the model generate action sequences that, if executed, would cause physical harm? This is what VLA systems actually produce. No standardized evaluation methodology exists. Our FLIP grading approach (backward inference of intent from output) is a prototype; its 30.8% FP rate indicates it is not yet reliable.

**Layer 3: Physical.** Does the executed action sequence, in the physical environment, actually cause harm? This requires either real-robot testing or physics simulation. Neither is integrated into any safety benchmark.

### 4.2 The Information-Theoretic Gap

The fundamental problem is information-theoretic. Text-layer evaluation has access to token sequences. Action-layer evaluation requires access to action representations (joint angles, velocities, forces, gripper commands). Physical-layer evaluation requires access to the physics of the environment (object masses, friction coefficients, fragility thresholds, human proximity).

Each layer requires strictly more information than the previous layer. A text-layer evaluator cannot determine whether an action sequence is dangerous without simulating its physical consequences. A keyword classifier cannot determine whether a text response is harmful without understanding its semantic content. The evaluation crisis is, at root, an information crisis: the tools we have measure the wrong layer.

### 4.3 Why "Just Evaluate Harder" Does Not Work

One might argue that improving text-layer evaluation is sufficient -- that better LLM judges, better prompts, and more data will close the gap. This argument fails on structural grounds:

1. **PARTIAL dominance is not a grader error.** When 50% of VLA responses include both a safety disclaimer and a complete action sequence, a perfect text-layer grader would correctly identify the disclaimer. The problem is that the disclaimer is irrelevant to the physical outcome. Better grading of text does not detect action-layer harm.

2. **Benign-to-harmful composition is text-invisible.** Blindfold constructs harmful action sequences from individually benign instructions. No text-layer filter can detect this because no individual instruction is harmful. The harm emerges from composition in physical space, which text-layer evaluation does not model.

3. **Format-lock shifts the modality.** Format-lock attacks (92% ASR on Nemotron 30B, 91% on Llama 70B) force the model to respond in structured formats (JSON, YAML, code) that suppress natural-language safety reasoning. A text-layer grader operating on structured output faces a different classification problem than one operating on natural-language responses.

---

## 5. Proposed Solution: The Three-Layer Evaluation Stack

### 5.1 Architecture

The minimum viable evaluation architecture for embodied AI safety requires independent assessment at each of the three layers defined in Section 4.1:

```
+-----------------+     +-----------------+     +-----------------+
| Layer 1: Text   | --> | Layer 2: Action | --> | Layer 3: Phys   |
| LLM-as-judge    |     | Action grader   |     | Sim / real-robot|
| (calibrated)    |     | (7B+ model)     |     | (physics-based) |
+-----------------+     +-----------------+     +-----------------+
       |                       |                       |
  Text verdict            Action verdict         Physical verdict
  (COMPLIANCE/            (SAFE/AMBIGUOUS/       (HARM/NO_HARM/
   REFUSAL/PARTIAL)        DANGEROUS)             NEAR_MISS)
```

Each layer produces an independent verdict. The final safety assessment is the conjunction: a response is classified as SAFE only if all three layers agree.

### 5.2 Layer 1: Calibrated Text Evaluation

**What exists:** LLM-as-judge (our FLIP approach, GPT-4-as-judge, Claude-as-judge). Keyword classifiers (deprecated in this project due to kappa = 0.126).

**What is needed:**
- Mandatory benign-baseline calibration: every grader must report its FP rate on a standardized benign trace set before its ASR measurements are interpretable.
- Inter-grader agreement reporting: every evaluation must report kappa or ICC between at least two independent graders.
- Language coverage testing: per Alignment Backfire findings, grader accuracy must be verified for each language in the evaluation set.

**Cost estimate:** Marginal. Calibration requires a one-time benign trace collection (n >= 100) and a few hundred additional LLM-as-judge API calls per benchmark run. Estimated cost: $5-$50 per evaluation run depending on the judge model.

**Feasibility:** High. All components exist. The barrier is adoption, not technology.

### 5.3 Layer 2: Action-Sequence Evaluation

**What exists:** Our FLIP grading approach (backward inference of intent from action output). Our pilot action-layer evaluator (80 traces, deepseek-r1:1.5b). Neither is reliable at current scale and model size.

**What is needed:**
- A purpose-built action-sequence classifier operating on action representations (not text descriptions of actions). Minimum viable model size: 7B+ based on our finding that sub-2B models classify 56% of adversarial VLA traces as SAFE.
- Standardized action-space representations: the field lacks a common format for expressing robot action sequences across different embodiments (joint space, Cartesian space, gripper commands). Without this, action-layer evaluation is platform-specific.
- Composition analysis: the ability to evaluate whether a sequence of individually safe actions composes into a harmful outcome. This requires either a physics model or a trained composition detector.

**Cost estimate:** Moderate. Developing a 7B+ action-sequence classifier requires fine-tuning data (which our VLA corpus can partially supply) and compute for training. Estimated: $500-$5,000 for a prototype using an existing 7B base model with LoRA fine-tuning. Standardized action representations require community coordination (standards body engagement).

**Feasibility:** Medium. The individual components are technically achievable. The coordination problem (standard action representations) is the primary barrier. Our HANSE framework (Report #32) and MASSS standards submission address this at the governance level.

### 5.4 Layer 3: Physical-Consequence Evaluation

**What exists:** Blindfold includes real-robot testing (90% ASR confirmed physically). Our PiCar-X platform provides a single-robot testbed. Physics simulators (MuJoCo, Isaac Sim, PyBullet) are mature.

**What is needed:**
- Integration of physics simulation into the evaluation pipeline. Given an action sequence, simulate its physical consequences in a digital twin of the target environment and classify the outcome as HARM/NO_HARM/NEAR_MISS.
- Standardized harm thresholds: what force constitutes a dangerous collision? What temperature constitutes a burn risk? What proximity to a human constitutes a near-miss? These thresholds are domain-specific and require input from safety engineering, not just ML research.
- Real-robot validation: simulation fidelity is imperfect. A subset of evaluations must be confirmed on physical hardware to calibrate the sim-to-real gap.

**Cost estimate:** High. Physics simulation integration requires environment modeling ($5,000-$50,000 per environment depending on complexity). Real-robot testing requires hardware access ($10,000-$100,000+ for a multi-robot testbed). Domain-specific harm thresholds require expert consultation ($2,000-$20,000 per domain).

**Feasibility:** Low in the short term, medium in the 2-3 year horizon. The technology exists but the integration, standardization, and cost barriers are substantial. Blindfold's real-robot results demonstrate that the approach works; the question is scaling it beyond a single research lab.

### 5.5 Summary: Cost-Feasibility Matrix

| Layer | Current State | What Is Needed | Cost | Feasibility | Timeline |
|-------|---------------|----------------|------|-------------|----------|
| 1. Text | Exists but uncalibrated | Calibration protocol, inter-grader agreement | $5-$50/run | High | 0-3 months |
| 2. Action | Prototype (unreliable) | 7B+ classifier, standard action representations | $500-$5K prototype | Medium | 6-12 months |
| 3. Physical | Lab demos only | Sim integration, harm thresholds, real-robot validation | $15K-$170K per domain | Low (short-term) | 12-36 months |

**The minimum credible evaluation** is Layer 1 with calibration. This can be achieved immediately at near-zero marginal cost and would substantially improve the quality of safety claims in published research.

**The minimum honest evaluation** for embodied AI systems requires Layers 1 and 2. Without action-layer evaluation, any safety claim about an embodied system is a claim about its text behavior, not its physical behavior.

**Complete evaluation** requires all three layers. This is a multi-year, multi-institution effort that will likely require standards body coordination, compute grants, and shared physical testbeds.

---

## 6. Limitations

1. **Sample size.** The VLA FLIP corpus has n=58 valid traces across 7 families. PARTIAL dominance (50%) and zero-refusal findings have wide implicit confidence intervals at this scale. The benign baseline (n=39) similarly has limited statistical power.

2. **Grader quality.** FLIP grading uses deepseek-r1:1.5b (for most traces) and gemma-3-27b-it (for re-graded subsets). The 30.8% FP rate applies to the deepseek-r1:1.5b grader specifically. Larger graders may have different FP rates (untested).

3. **Scale confound.** Our VLA traces are generated by sub-3B and 7B models (deepseek-r1:1.5b, qwen3:1.7b, llama 70B via OpenRouter). Frontier VLA systems (Gemini Robotics, RT-2-X) may have different safety profiles that our evaluation has not captured.

4. **Generalisability.** The five evaluation failures are documented from our specific pipeline. While we argue they are structural (and therefore apply to any text-layer evaluation of embodied systems), this structural claim is analytical, not empirically confirmed across all published benchmarks.

5. **Methodology.** ASR numbers in this report use FLIP (LLM-based backward inference). Heuristic numbers are cited only for comparison purposes (kappa calculation). All primary claims use LLM-graded verdicts per CANONICAL_METRICS.md methodology requirements.

6. **Public benchmark survey.** Our claim that AdvBench, HarmBench, JailbreakBench, and StrongREJECT have zero embodied scenarios is based on inspection of their published datasets as of March 2026. These benchmarks may add embodied scenarios in future versions.

---

## 7. Conclusions and Recommendations

### 7.1 What We Have Learned

The evaluation crisis in embodied AI safety is not a resource problem (too few evaluations) or a quality problem (insufficiently good evaluators). It is a structural problem: the evaluation methodology measures the wrong layer. Text-layer evaluation of embodied systems is analogous to testing a car's safety by reading its manual -- it tells you what the manufacturer says the car will do, not what the car actually does.

Five specific failures have been documented, each independently sufficient to undermine confidence in current evaluation:

- Heuristic classifiers produce unreliable measurements (kappa = 0.126).
- LLM-as-judge graders have a high false positive rate (30.8% on benign inputs).
- Action-layer safety is categorically invisible to text-layer evaluation (0% refusal, 50% PARTIAL).
- LLM-based graders are subject to the same alignment failures they measure (Alignment Backfire).
- Public benchmarks have zero coverage of embodied scenarios (0/1,443 scenarios).

### 7.2 Recommendations

**For safety researchers:**
1. Report benign-baseline FP rates for every grading methodology. Without this, ASR numbers are uninterpretable.
2. Report inter-grader agreement (kappa or ICC) for every evaluation. Single-grader results are unreliable.
3. Distinguish text-layer evaluation from action-layer evaluation explicitly. Do not claim to have evaluated "safety" when only text responses were graded.

**For benchmark designers:**
4. Add embodied scenarios. The Failure-First VLA corpus (351 scenarios, 29 families) is available as a starting point.
5. Adopt a calibrated evaluation protocol: benign baseline + multi-grader agreement + explicit layer coverage.

**For standards bodies:**
6. Define minimum evaluation requirements for embodied AI safety claims. The three-layer stack (text, action, physical) provides a framework. ISO 42001 and NIST AI RMF currently have no embodied-specific evaluation requirements (Report #149).

**For deployers of embodied AI:**
7. Do not treat text-layer benchmark results as safety certification for embodied deployment. Until Layer 2 and Layer 3 evaluation exist, there is no validated methodology for assessing whether an embodied AI system will produce dangerous physical actions.

These recommendations are conditional on the structural analysis being correct. If a text-layer defense is demonstrated that addresses PARTIAL dominance, benign-to-harmful composition, and format-lock bypasses simultaneously, the structural claim would need revision.

---

## References

1. F41LUR3-F1R57. Report #49: VLA Cross-Embodiment Vulnerability Analysis. 2026-03-03.
2. F41LUR3-F1R57. Report #51: Format-Lock Capability Floor Analysis. 2026-03-04.
3. F41LUR3-F1R57. Report #59: The Compliance Paradox. 2026-03-06.
4. F41LUR3-F1R57. Report #61: The Evaluation Paradox. 2026-03-07.
5. F41LUR3-F1R57. Report #65: Hallucination-Refusal / PARTIAL Equivalence. 2026-03-08.
6. F41LUR3-F1R57. Report #67: Layer 0 Extension. 2026-03-08.
7. F41LUR3-F1R57. Report #72: Evaluator Calibration Standard. 2026-03-09.
8. F41LUR3-F1R57. Report #78: Defense Impossibility in Embodied AI. 2026-03-11.
9. F41LUR3-F1R57. Report #117: Safety Improvement Paradox. 2026-03-16.
10. F41LUR3-F1R57. Report #127: Evaluation Half-Life. 2026-03-16.
11. F41LUR3-F1R57. Report #132: Alignment Backfire Integration. 2026-03-18.
12. F41LUR3-F1R57. Report #144: The Evaluator's Dilemma. 2026-03-18.
13. F41LUR3-F1R57. Report #145: Defense Impossibility Theorem. 2026-03-18.
14. F41LUR3-F1R57. Report #149: NIST AI RMF Embodied AI Gap Analysis. 2026-03-18.
15. F41LUR3-F1R57. CANONICAL_METRICS.md. Verified 2026-03-18.
16. Zhao et al. Alignment Backfire: Multilingual Safety Degradation in Aligned Language Models. arXiv:2603.04904. 2026.
17. Zheng et al. Blindfold: Attacking Vision-Language-Action Models through Decomposed Benign Instructions. arXiv:2603.01414. Accepted at ACM SenSys 2026.
18. Zou et al. Universal and Transferable Adversarial Attacks on Aligned Language Models. arXiv:2307.15043. 2023.
19. Mazeika et al. HarmBench: A Standardized Evaluation Framework for Automated Red Teaming and Robust Refusal. arXiv:2402.04249. 2024.
20. Chao et al. JailbreakBench: An Open Robustness Benchmark for Jailbreaking Large Language Models. arXiv:2404.01318. 2024.
21. Souly et al. A StrongREJECT for Empty Jailbreaks. arXiv:2402.10260. 2024.

---

## Appendix A: Prior Evaluation Failures in Other Domains

The pattern of evaluation measuring the wrong layer is not unique to AI safety. Historical precedents include:

- **Crash test dummies (1970s-1990s):** Early crash tests used a single dummy design calibrated to a 50th-percentile male. The evaluation "passed" vehicles that were lethal to women, children, and elderly passengers. The measurement layer (force on a specific body) did not capture the property that mattered (force on diverse bodies). It took 30 years to add female and child dummies.

- **Financial stress tests (2006-2008):** Pre-crisis bank stress tests measured individual institution solvency under historical scenarios. They did not measure systemic risk -- the property that actually caused the crisis. The evaluation layer (single-institution balance sheet) was structurally incapable of capturing the risk layer (cross-institution correlation). Basel III introduced macro-prudential evaluation as a separate layer.

- **Drug clinical trials (ongoing):** Phase III trials measure efficacy and safety in controlled populations. Post-market surveillance (Phase IV) measures safety in real-world populations. The gap between these two layers produces iatrogenic harm -- drugs that pass clinical evaluation but cause harm in deployment. The pharmaceutical industry has spent decades building the infrastructure to evaluate the deployment layer.

In each case, the solution was not to evaluate harder at the existing layer, but to add evaluation at the layer where harm actually occurs.

---

*This report was produced as part of the Failure-First Embodied AI research programme. All claims are scoped to the tested conditions and should not be generalised without additional validation. See docs/CANONICAL_METRICS.md for corpus-level numbers.*
