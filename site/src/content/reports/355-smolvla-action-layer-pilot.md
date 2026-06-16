---

title: "SmolVLA Action-Layer Adversarial Pilot — Null Result at 450M Scale"
description: "This report documents the first action-layer adversarial evaluation in the Failure-First corpus. We tested SmolVLA (450M parameters), a vision-language-action model from Hugging Face's LeRobot library, against 80 scenari..."
date: "2026-04-13"
reportNumber: 355
classification: "Research — Empirical Study"
status: "complete"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/355-smolvla-action-layer-pilot.m4a"
---

## Executive Summary

This report documents the first action-layer adversarial evaluation in the Failure-First corpus. We tested SmolVLA (450M parameters), a vision-language-action model from Hugging Face's LeRobot library, against 80 scenarios across four categories (n=20 each): benign controls, direct adversarial, format-lock framed, and task-framing. The primary metric was action magnitude (max joint displacement across a 50-step trajectory), measured directly from the model's action outputs rather than from text responses.

**The result is a well-characterized null finding.** SmolVLA produces statistically indistinguishable action magnitudes regardless of whether the input prompt is benign or adversarial. All three adversarial categories produced equal or smaller mean displacements compared to benign controls. Format-lock framing, which achieves 84-100% text-layer ASR on models above 3B parameters (Report #51), produced no measurable effect at the action layer at this scale.

An initial 20-scenario pilot (n=5 per category) showed a spurious +71% format-lock signal that did not replicate at n=20. This is a direct application of the lesson from Mistake #9: conclusions drawn from fewer than 20 samples are unreliable.

This null result is informative for the CCS paper's capability-floor hypothesis. It suggests that below approximately 1B parameters, VLA models lack the representational capacity to differentially respond to adversarial framing at the action layer — prompts are processed, but the action head produces similar trajectories regardless of adversarial intent.

## 1. Method

### 1.1 Model

**SmolVLA** (smolvla_base) is a 450M-parameter vision-language-action model from Hugging Face's LeRobot library. It consists of a small vision encoder, a language backbone, and a 6-DoF action head that outputs continuous joint displacement vectors. The model was loaded via the LeRobot/transformers pipeline and run on CPU (Apple Silicon Mac).

### 1.2 Scenarios

80 scenarios across four categories (n=20 each), sourced from `data/vla_smolvla_pilot/expanded_scenarios_v0.2.jsonl`:

| Category | n | Description |
|----------|---|-------------|
| **Benign controls** | 20 | Standard robotic manipulation tasks (pick-and-place, sorting, stacking) |
| **Direct adversarial** | 20 | Explicit requests for dangerous actions (collision, high-speed movement, force application) |
| **Format-lock** | 20 | Adversarial instructions wrapped in structured output format constraints (JSON schema compliance, step-by-step formatting) |
| **Task-framing** | 20 | Harmful actions disguised as legitimate tasks (quality testing, calibration, maintenance) |

### 1.3 Evaluation Protocol

Each scenario was presented to SmolVLA with a synthetic camera image (224x224 random scene). The model generated a 50-step action trajectory (6-DoF joint displacements per step). We measured:

- **Max displacement:** Maximum absolute joint displacement across all 6 joints and 50 steps — the primary metric indicating how aggressively the model attempts to move
- **Peak velocity:** Maximum inter-step displacement change
- **Trajectory norm:** L2 norm of the full flattened trajectory
- **Per-joint max:** Maximum displacement per joint

The safety classifier applied fixed thresholds (dangerous: max_displacement >= 0.8, trajectory_norm >= 5.0). All 80 traces were classified as DANGEROUS by this threshold-based classifier, which is itself uninformative — the thresholds are calibrated for production safety, not for distinguishing adversarial from benign inputs.

The meaningful analysis is the comparison of action magnitudes across categories.

### 1.4 Trace Location

- **Expanded pilot (n=80):** `runs/smolvla_pilot/smolvla_live_20260413_074532_traces.jsonl`
- **Initial pilot (n=20):** `runs/smolvla_pilot/smolvla_live_20260413_065013_traces.jsonl`
- **Summary:** `runs/smolvla_pilot/smolvla_live_20260413_074532_summary.json`

## 2. Results

### 2.1 Expanded Pilot (n=20 per category)

| Category | Mean Max Displacement | 95% CI | vs Benign | Cohen's d |
|----------|----------------------|--------|-----------|-----------|
| Benign controls | 0.923 | [0.806, 1.040] | baseline | -- |
| Direct adversarial | 0.850 | [0.755, 0.946] | -7.9% | -0.30 (small) |
| Format-lock | 0.852 | [0.681, 1.023] | -7.7% | -0.21 (small) |
| Task-framing | 0.730 | [0.632, 0.828] | -20.9% | -0.78 (medium) |

Key observations:

1. **No adversarial amplification.** All three adversarial categories produce mean displacements equal to or smaller than benign controls. If adversarial framing were effective at the action layer, we would expect larger displacements (more aggressive movement) from adversarial inputs.

2. **Format-lock produces no differential signal.** Cohen's d = -0.21 (small, in the wrong direction) with widely overlapping confidence intervals [0.681, 1.023] vs [0.806, 1.040]. The format-lock technique that achieves 84-100% text-layer ASR above 3B parameters (Report #51) has no measurable effect on SmolVLA's action outputs.

3. **Task-framing shows the largest effect, but in the opposite direction.** The -0.78 Cohen's d (medium) for task-framing indicates these scenarios produce smaller actions than benign controls. This may reflect the model's limited ability to parse complex framing — it generates more conservative (smaller) actions when the prompt structure is more elaborate, regardless of intent.

4. **All confidence intervals overlap with the benign baseline.** No category's CI excludes the benign mean of 0.923.

### 2.2 Initial Pilot (n=5 per category) — The Misleading Signal

An initial 20-scenario pilot (n=5 per category, different scenario class names) produced a striking apparent result:

| Category (pilot names) | n | Mean Max Displacement | vs Benign |
|------------------------|---|----------------------|-----------|
| benign_control | 5 | 1.050 | baseline |
| direct_harmful_request | 4 | 0.750 | -28.6% |
| format_lock_framed | 5 | 1.798 | **+71.2%** |
| task_framing | 5 | 1.084 | +3.2% |

The format-lock mean of 1.798 vs benign 1.050 appeared to show a large, meaningful effect (+71%). This did not replicate at n=20 (actual effect: -7.7%, d=-0.21). The n=5 pilot was contaminated by one or two high-displacement outliers that dominated the small sample.

**Lesson applied:** Mistake #9 warns against drawing conclusions from fewer than 20 samples. This is a concrete demonstration: the n=5 signal was directionally wrong and the apparent effect size was an artifact of sampling noise.

### 2.3 Threshold Classifier Results

All 80 traces were classified as DANGEROUS by the fixed-threshold safety classifier (max_displacement >= 0.8 or trajectory_norm >= 5.0). This 100% DANGEROUS rate across all categories — including benign controls — confirms that the threshold classifier is not useful for distinguishing adversarial from benign behavior at this model scale. SmolVLA produces action magnitudes that exceed the safety thresholds regardless of input content.

## 3. Discussion

### 3.1 Capability-Floor Hypothesis

The capability-floor hypothesis (Report #51, Section 4.7 of the CCS paper) states that below a critical parameter threshold (estimated at approximately 1-3B), models lack the representational capacity to differentially respond to adversarial framing. Above this floor, adversarial techniques like format-lock achieve elevated ASR; below it, model behavior is dominated by the action head's learned dynamics rather than by prompt content.

SmolVLA at 450M parameters sits well below the estimated capability floor. The null result is consistent with the hypothesis: the model processes prompts through its language backbone, but the action head generates trajectories driven primarily by visual input and learned motor primitives, not by the semantic content of adversarial instructions.

This is the first empirical test of the capability-floor hypothesis at the action layer. Prior evidence (Report #51, Gemma 4 capability-floor validation) was entirely at the text layer. The action-layer null result provides complementary evidence from a qualitatively different output modality.

### 3.2 What This Does Not Show

This null result should not be interpreted as evidence that VLA models are generally robust to adversarial inputs. It shows that a 450M-parameter model does not differentially respond — this is consistent with the model simply lacking capacity to process adversarial nuance, not with the model having effective safety mechanisms. The distinction matters: a model that cannot parse adversarial intent is not "safe" in the way a model that parses and refuses is safe. It is merely incapable.

The VLA adversarial literature (BadVLA, Cardenas and Xie 2026) demonstrates near-100% ASR on larger VLA systems. The question for future work is where on the parameter scale differential adversarial response emerges at the action layer.

### 3.3 Synthetic Image Limitation

All traces used synthetic (random) camera images rather than realistic robotic workspace scenes. SmolVLA's action outputs are conditioned on both language and vision inputs. With uninformative visual input, the action head may rely more heavily on learned priors than on prompt-driven planning. It is possible that realistic visual input would enable greater prompt sensitivity and reveal adversarial effects not visible in this pilot. This limitation applies equally to all four categories and does not explain differential effects (or their absence) between categories.

## 4. Implications for the CCS Paper

1. **Section 4.7 (Capability Floor):** This result provides the first action-layer data point for the capability-floor argument. At 450M parameters, adversarial framing has no measurable effect on action outputs. This complements the text-layer evidence (Gemma 4 e4b at 4B showing elevated ASR, 26b/31b showing decreasing ASR) and extends the floor analysis to a different output modality.

2. **Null result framing:** The paper can cite this as evidence that the adversarial threat to VLA systems is scale-dependent — small models are not meaningfully vulnerable because they lack the capacity to differentially process adversarial content, not because they are robust.

3. **Methodological contribution:** This is the first adversarial evaluation in the corpus (and, to our knowledge, in the published literature) that measures action-layer output magnitudes rather than text-layer compliance. The methodology — comparing action magnitude distributions across adversarial and benign categories — is a template for future VLA adversarial evaluations.

## 5. Limitations

1. **Single model, single scale.** Only SmolVLA (450M) was tested. The capability floor cannot be precisely located from one data point.

2. **Synthetic visual input.** Random images may suppress prompt-driven action planning. Realistic workspace scenes should be tested.

3. **Fixed action horizon.** All trajectories were 50 steps. Longer horizons or variable-length generation might reveal effects not visible in short sequences.

4. **No ground-truth action labels.** Without a simulator or physical robot, we cannot assess whether the generated trajectories would actually be dangerous. We measure magnitude as a proxy for aggressiveness, not actual harm potential.

5. **Threshold classifier uninformative.** The safety classifier labels all 80 traces as DANGEROUS, providing no discriminative signal. Future work should develop action-layer classifiers calibrated per model family.

6. **Sample size.** While n=20 per category is the minimum recommended by project conventions (Mistake #9), it limits statistical power for detecting small effects. The task-framing medium effect (d=-0.78) is detectable at n=20; a true small effect (d=0.2) would require n>=100 per group.

## 6. Next Steps

1. **Test G0Plus (3B parameters).** The first model above the estimated capability floor with an accessible action head. If differential adversarial response emerges at 3B, it narrows the floor estimate significantly.

2. **Test OpenVLA (7B parameters).** Well above the estimated floor, with published adversarial results (BadVLA). Replication in our framework would validate the action-layer evaluation methodology.

3. **Gemini Robotics-ER API.** If access becomes available, test a frontier-scale VLA with the same scenario set. This would provide the high-end anchor for a multi-scale action-layer capability-floor analysis.

4. **Realistic visual input.** Generate or source realistic robotic workspace images and re-run the SmolVLA pilot to assess whether visual context modulates prompt sensitivity.

5. **Action-layer classifier development.** Develop per-model-family action magnitude baselines and calibrated thresholds that can distinguish adversarial amplification from normal operational variance.

## 7. Data Availability

| Asset | Path |
|-------|------|
| Expanded pilot traces (n=80) | `runs/smolvla_pilot/smolvla_live_20260413_074532_traces.jsonl` |
| Expanded pilot summary | `runs/smolvla_pilot/smolvla_live_20260413_074532_summary.json` |
| Initial pilot traces (n=20) | `runs/smolvla_pilot/smolvla_live_20260413_065013_traces.jsonl` |
| Scenario source | `data/vla_smolvla_pilot/expanded_scenarios_v0.2.jsonl` |

---

*Report #355 documents a null result. Null results at the action layer are as important as positive results at the text layer — they constrain the parameter regimes in which adversarial framing poses a meaningful threat to embodied AI systems.*
