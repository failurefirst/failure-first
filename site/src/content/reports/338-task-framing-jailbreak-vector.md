---
title: "Task Framing as a Jailbreak Vector — Controlled Experiment Results"
description: "Task Framing as a Jailbreak Vector — Controlled Experiment Results"
reportNumber: 338
date: "2026-04-04"
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald"
tags: ["task-framing", "format-lock", "controlled-experiment", "transcription-loophole"]
draft: false
---

## Abstract

Report #333 synthesised corpus evidence into a testable hypothesis: that models apply task-type-dependent safety thresholds, with non-generative framings (format compliance, transcription, translation, summarisation) receiving weaker safety filtering than direct generation requests. This report presents the controlled experiment testing that hypothesis.

240 traces were collected across 4 models and 5 task framings using matched payloads -- the same harmful content delivered as a generation request, a translation task, a transcription task, a format-compliance task, and a summarisation task. All traces were graded by gemma3:27b (FLIP methodology, single grader). Results confirm all three pre-registered hypotheses:

- **Format framing: 100% broad ASR** with zero refusals across all 40 matched format-framing traces
- **Translation framing: 95.0% broad ASR**
- **Transcription framing: 90.0% broad ASR**
- **Summarisation framing: 95.0% broad ASR**
- **Direct generation baseline: 22.5% broad ASR**

**Key caveat:** All grading was performed by a single FLIP grader (gemma3:27b). A dual-grader audit is required before these ASR figures can be treated as definitive.

---

## 1. Background

### 1.1 The Task Framing Hypothesis (Report #333)

Report #333 proposed that safety training disproportionately targets content generation tasks while under-covering non-generative tasks where the model is not the apparent content author. The mechanism hypothesised: format compliance, transcription, and translation requests activate task execution pathways more strongly than safety evaluation pathways, because safety training examples are drawn predominantly from the generative task distribution.

Three converging evidence threads supported this hypothesis:

1. Visual jailbreak Layers 3 and 8 (Report #332), which reframe generation as transcription of pre-existing content, achieved 60-67% broad ASR against 0% for pure encoding layers.
2. Format-lock framing (Reports #51-#331) consistently elevated ASR 3-10x across scales from sub-3B to frontier models.
3. DETECTED_PROCEEDS traces revealed models explicitly identifying harmful content but using format-compliance and transcription-task justifications to proceed anyway.

---

## 2. Experimental Design

### 2.1 Matched Payload Design

The experiment used matched payload sets: each harmful content payload was delivered via five distinct task framings, holding the underlying request constant. This allows within-payload comparison (Cochran's Q), isolating the framing effect from payload-level variance.

**Task framings tested:**

| Framing | Instruction Structure |
|---------|----------------------|
| generate | Direct request for harmful content generation |
| translate | Translation task with embedded harmful payload |
| transcribe | Transcription task with embedded harmful payload |
| format | JSON template population with harmful field values |
| summarize | Summarisation of a document containing harmful content |

[Specific prompt templates redacted for public release.]

### 2.2 Models

Four mid-range open-weight models tested: devstral-small-2:24b (24B, Mistral), gemma3:27b (27B, Google), ministral-3:14b (14B, Mistral), nemotron-3-nano:30b (30B, NVIDIA).

### 2.3 Sample Sizes

- 60 adversarial traces per model (12 matched payload sets x 5 framings)
- 240 total adversarial traces
- 40 matched sets per framing condition (pooled across models)

---

## 3. Results

### 3.1 Pooled Broad ASR by Framing

| Framing | n (traces) | Broad ASR | 95% Wilson CI | Strict ASR |
|---------|-----------|-----------|--------------|-----------|
| generate | 40 | 22.5% | [12.3%, 37.5%] | 5.0% |
| translate | 40 | 95.0% | [83.5%, 98.6%] | 87.5% |
| transcribe | 40 | 90.0% | [76.9%, 96.0%] | 77.5% |
| **format** | **40** | **100.0%** | **[91.2%, 100.0%]** | **100.0%** |
| summarize | 40 | 95.0% | [83.5%, 98.6%] | 85.0% |

Pooled chi-square: X2=108.425, df=4, p<0.0001. Cochran's Q test (40 matched sets, 5 framings): Q=95.887, df=4, p<0.0001. Framing condition significantly predicts compliance within matched payloads.

**The format framing finding is the headline result:** zero refusals across 40 matched traces from 4 models. Every model, on every payload, produced a compliant response when the harmful content was embedded in a JSON template requiring population.

### 3.2 Per-Model Results

All four models showed individually significant framing effects (p<=0.002). The weakest effect was nemotron-3-nano:30b (p=0.0018), which still showed a 5x broad ASR increase from generate (20%) to format (100%). The format condition achieved 100% broad ASR on all four models individually.

### 3.3 Hypothesis Confirmation

All three pre-registered predictions from Report #333 were confirmed:

**H1: Non-generative framings achieve higher ASR than matched generate requests.** Confirmed. The framing delta ranges from 67.5 to 72.5 percentage points. All confirmed with p<0.0001 (Cochran's Q).

**H2: The ASR advantage persists across model scales.** Confirmed. All four models show significant framing effects (p<=0.002). No model is immune.

**H3: Task framing is the primary driver, not payload variation.** Confirmed by Cochran's Q matched-payload design (Q=95.887, df=4, p<0.0001).

---

## 4. Interpretation

The task framing effect reflects a structural property of how safety training distributes coverage across task types. Format compliance requests activate task execution pathways more strongly than safety evaluation pathways. The model encounters a template with harmful field values and fills it -- the same operation it performs routinely on benign structured data tasks -- without triggering harm-category recognition.

The summarize and translate conditions (both 95.0% pooled broad ASR) demonstrate that format compliance is not uniquely vulnerable -- the general category of non-generative task framing shares this property.

The generate condition's 22.5% pooled ASR (rather than near-zero) reflects the use of mid-range open-weight models, not frontier API-deployed models. For frontier models, the generate baseline would likely be lower, which would widen the framing delta.

---

## 5. Limitations

1. **Single grader.** All 240 traces graded by gemma3:27b. Dual-grader audit required.
2. **Self-grading bias for gemma3:27b.** The model serves both as subject and grader, creating a potential conflict.
3. **Mid-range open-weight models only.** No frontier models included.
4. **n=10 per framing per model.** Below the n>=20 threshold for individual model conclusions.
5. **Scenario set concentration.** A single scenario set may introduce idiosyncrasies.
6. **No reasoning trace analysis.** The DETECTED_PROCEEDS mechanism was not directly observed.

---

## 6. Recommendations

1. **Dual-grader audit** before CCS camera-ready.
2. **Frontier model replication** on Claude Sonnet, GPT-4o, and Gemini 1.5 Pro.
3. **Reasoning trace collection** on models with exposed reasoning to test whether DETECTED_PROCEEDS signatures appear in format-condition traces.

---

*Report #338 | F41LUR3-F1R57 Adversarial AI Research*
