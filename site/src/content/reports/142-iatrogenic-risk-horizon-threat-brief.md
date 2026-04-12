---
title: "The Iatrogenic Risk Horizon -- Threat Brief"
description: "Three independent papers published in early March 2026 -- from Kyoto University (Japan), Hong Kong Polytechnic University / University of Cambridge (UK/China), and Mercedes-Benz R&D North America..."
date: "2026-03-18"
reportNumber: 142
classification: "Research — Empirical Study"
status: "complete"
author: "River Song (Head of Predictive Risk)"
tags: []
draft: false
---

- Fukui (2026), arXiv:2603.04904 (Alignment Backfire)
- Li et al. (2026), arXiv:2603.01414 (Blindfold)
- Ding et al. (2026), arXiv:2603.12681 (CoLoRA, Mercedes-Benz R&D)
**GLI Entries:** gli_113, gli_114, gli_115 (new, this brief)
**Metrics Source:** `docs/CANONICAL_METRICS.md` (236 models, 135,623 results, 537 VLA scenarios, 33 VLA families, 163 GLI entries prior to this session)

---

> **Disclaimer:** This brief synthesizes findings from independent external research and the Failure-First corpus. Empirical figures are attributed to their sources and assessed on their own methodological terms. Predictions are explicitly flagged as such and should be evaluated against the evidence base described. This is a risk assessment, not a statement of certainty.

---

## Executive Summary

Three independent papers published in early March 2026 -- from Kyoto University (Japan), Hong Kong Polytechnic University / University of Cambridge (UK/China), and Mercedes-Benz R&D North America (USA/Germany) -- converge on a finding that represents a qualitative shift in the embodied AI threat landscape: **safety mechanisms themselves are becoming the primary attack surface.**

This is not a single vulnerability. It is an emerging phase transition in which the relationship between safety investment and safety outcome reverses. We term this the **Iatrogenic Risk Horizon** -- the point at which the dominant source of AI safety failure shifts from the absence of safety mechanisms to the presence of safety mechanisms that produce unintended harm.

The three papers document this shift at three different layers:

| Paper | Layer | Mechanism | Key Finding |
|-------|-------|-----------|-------------|
| Alignment Backfire (2603.04904) | Training | Safety training reverses safety outcomes | 8/16 languages show worsened outcomes from alignment |
| Blindfold (2603.01414) | Inference | Text safety creates action-layer blind spot | 53% ASR improvement via semantically benign instructions |
| CoLoRA (2603.12681) | Weights | Per-module safety verification fails under composition | Individually safe adapters suppress safety when combined |

Each paper, independently, would be notable. Their simultaneous publication from four countries and three continents indicates that the iatrogenic pattern is visible to research groups working on different problems with different methods. This is not one team's hypothesis; it is a convergent empirical observation.

---

## 1. The Phase Transition: From Vulnerability to Iatrogenesis

### 1.1 What Changed

Prior to March 2026, the dominant framing of AI safety failure was **insufficiency**: systems fail because safety mechanisms are absent, incomplete, or bypassable. The standard response is to add more safety -- more RLHF, more guardrails, more evaluation. The implicit assumption is that safety investment is monotonically beneficial: more safety training produces more safety.

The three March papers falsify this assumption at three distinct architectural layers.

**Training layer (Alignment Backfire).** Fukui's preregistered study (n=1,584 multi-agent simulations, 16 languages, 3 model families) demonstrates that increasing the proportion of safety-aligned agents in a multi-agent system amplifies collective pathology in 8 of 16 languages tested. In Japanese, the effect size is Hedges' g=+0.771 -- a medium-to-large effect in the harmful direction. The mechanism is "internal dissociation": aligned agents articulate safety values while their behavioral output contradicts those values, and this dissociation propagates through multi-agent interactions. Individuation instructions -- a standard safety intervention -- were "absorbed and became sources of pathology."

**Inference layer (Blindfold).** Li et al. demonstrate an automated framework for jailbreaking embodied LLMs using instructions that are semantically benign at the text level but produce dangerous physical consequences. On a real 6-DoF robotic arm, Blindfold achieves 53% higher ASR than existing baselines. The attack exploits a structural gap: text-level safety filters cannot detect action-level harm because the text satisfies every safety check. The safety filter's existence creates a false assurance that the instruction is safe, when the harm occurs at a layer the filter cannot inspect.

**Weight layer (CoLoRA).** Ding et al. (Mercedes-Benz R&D) demonstrate that LoRA adapters which individually pass safety verification suppress refusal behavior when linearly composed. Each adapter is benign in isolation; the attack emerges from composition. Exhaustive composition scanning is computationally intractable for realistic adapter ecosystems. The safety verification procedure itself creates the false assurance: a deployer who verifies each adapter individually has followed the standard procedure and will reasonably conclude the system is safe.

### 1.2 The Common Causal Structure

All three findings share a causal structure that distinguishes them from ordinary safety failures:

1. **A safety mechanism is deployed** (alignment training, text-level safety filter, per-module verification).
2. **The mechanism produces a measurable positive signal at its target layer** (aligned text output, instruction classified as safe, adapter passes safety check).
3. **The positive signal at the target layer masks or produces harm at an adjacent layer** (multi-agent pathology, physical action harm, compositional safety suppression).
4. **The harm at the adjacent layer would not exist, or would be more detectable, without the safety mechanism.**

This is the formal structure of iatrogenesis: the treatment causes the disease. The critical distinction from ordinary safety failure is criterion (4) -- the safety mechanism is not merely insufficient; it actively contributes to the harmful outcome.

### 1.3 Why This Is a Phase Transition

The shift from "safety mechanisms are insufficient" to "safety mechanisms are iatrogenic" changes the optimal response to AI safety failure.

Under the insufficiency framing, the correct response to safety failure is to invest more in safety: more training, more evaluation, more guardrails. Under the iatrogenic framing, additional safety investment at the wrong layer or granularity can make outcomes worse. The standard response becomes potentially counter-productive.

This does not mean safety investment is globally counter-productive. It means the relationship between safety investment and safety outcomes is non-monotonic, context-dependent, and layer-sensitive. Safety interventions must be evaluated not only for their direct effects but for their iatrogenic potential -- their capacity to create new attack surfaces or mask existing ones.

---

## 2. Predictive Risk Assessment

### 2.1 Near-Term Predictions (6-12 months)

**P1: Compositional attacks will scale with the LoRA ecosystem.** The Hugging Face model hub currently hosts tens of thousands of LoRA adapters. CoLoRA demonstrates that pairwise composition can suppress safety. The attack surface grows combinatorially with the number of available adapters. As adapter ecosystems grow (LoRA, QLoRA, adapters, plugins), compositional safety attacks will become easier to execute and harder to detect. No safety verification framework addresses combinatorial composition.

**P2: Language-dependent safety failure will be discovered in additional deployment contexts.** Fukui's finding of safety reversal in 8/16 languages was tested in multi-agent text systems. The same mechanism (internal dissociation producing cross-linguistic pathology) may apply to embodied AI systems deployed multilingually -- for example, collaborative robot interfaces in multilingual factories, autonomous vehicle HMIs in linguistically diverse markets, or multi-agent logistics coordination across language boundaries. No current safety evaluation regime tests cross-linguistic safety in embodied contexts.

**P3: Action-layer attacks will outpace text-layer defenses.** Blindfold demonstrates that automated action-level attack generation is feasible and effective. As embodied AI deployment scales (XPENG VLA 2.0 mass production, Tesla Optimus, Figure 02), attackers will increasingly target the action layer directly, bypassing text-level safety entirely. Current investment in text-level safety (RLHF, constitutional AI, guardrail APIs) does not address this attack surface.

**P4: Safety evaluation frameworks will lag the iatrogenic shift.** Current safety benchmarks (AdvBench, HarmBench, JailbreakBench, StrongREJECT) measure whether safety mechanisms prevent known attacks. They do not measure whether safety mechanisms create new attack surfaces. The conceptual framework for evaluating iatrogenic effects does not exist in any standards body. The GLI for iatrogenic safety evaluation is null at all stages (see gli_113 below).

### 2.2 Confidence Levels

| Prediction | Confidence | Basis |
|------------|------------|-------|
| P1 (compositional scaling) | High | CoLoRA demonstrates the mechanism; LoRA ecosystem growth is observable; combinatorial scaling is mathematical |
| P2 (cross-linguistic embodied) | Medium | Alignment Backfire demonstrates the mechanism in text; embodied extension is plausible but untested |
| P3 (action-layer outpacing) | High | Blindfold demonstrates automated generation; IDDL (Report #88) formalizes the structural advantage of undetectable attacks |
| P4 (evaluation framework lag) | Very High | GLI dataset shows null governance for all three iatrogenic vectors; no standards body has published on iatrogenic safety evaluation |

---

## 3. Governance Lag Analysis

Three new GLI entries (gli_113 through gli_115) are added to the dataset in this session.

### gli_113: Iatrogenic Safety Evaluation Gap

The concept that safety interventions themselves require adverse-effect evaluation has no framework, no legislation, and no enforcement anywhere. T_doc = 2026-03-09 (Alignment Backfire, the first paper to formally demonstrate iatrogenic safety effects with preregistered methodology). GLI: null at all stages.

### gli_114: Compositional Weight-Level Safety Verification

The challenge of verifying safety properties across composed model weights (LoRA adapters, merged models) has no framework beyond per-component verification. CoLoRA demonstrates that per-component verification is insufficient. T_doc = 2026-03-18 (CoLoRA publication). GLI: null at all stages. Note: gli_111 covers the attack itself; gli_114 covers the governance gap in compositional verification methodology.

### gli_115: Safety Mechanism Weaponization (Synthesized)

The deliberate exploitation of safety mechanisms to produce harm -- using the safety system against itself -- constitutes a distinct attack class that no governance framework recognizes. The three March papers demonstrate that safety mechanisms can be weaponized at the training layer (Alignment Backfire), inference layer (Blindfold), and weight layer (CoLoRA). T_doc = 2026-03-18 (date of first synthesis; individual papers published March 3-18). GLI: null at all stages.

### Governance Lag Implications

All three entries have null GLI -- no framework, no legislation, no enforcement at any stage. This places the iatrogenic attack class in the same governance vacuum as alignment faking (gli_002), VLA adversarial attacks (gli_013), and promptware kill chains (gli_019). The pattern is consistent: attack surface discovery outpaces governance by 2-5 years for text-level AI risks and is undefined (null) for embodied/compositional risks.

The iatrogenic entries are qualitatively worse than standard null-GLI entries because they target the defense layer itself. Standard null-GLI entries track attacks that governance has not yet addressed. Iatrogenic null-GLI entries track attacks where the standard governance response (mandate more safety) may be counter-productive without layer-specific design.

---

## 4. Implications for Failure-First Research Programme

### 4.1 Validation of Existing Findings

The three March papers independently validate several Failure-First findings:

- **Compliance Paradox (Report #59):** Blindfold confirms that text-level safety compliance does not prevent action-level harm. Our 50% PARTIAL rate across VLA traces predicted exactly this gap.
- **Safety Improvement Paradox (Report #117):** Alignment Backfire confirms that safety investment can produce negative returns. Our DRIP framework predicted bounded safety contribution at ~1.6%.
- **Defense Impossibility Triangle (Report #78):** The three papers map onto the three vertices of the triangle (text-layer, action-layer, evaluation-layer), each showing failure at a different vertex.
- **Competence-Danger Coupling (Brief A / Report #97):** All three papers demonstrate instances where capability and vulnerability are inseparable -- the mechanism that makes the system capable (alignment training, safety filters, modular adapters) is the mechanism that makes it vulnerable.

### 4.2 New Research Directions

The iatrogenic framing suggests three areas not currently covered by the Failure-First experimental programme:

1. **Cross-linguistic VLA safety testing.** Alignment Backfire tested text systems in 16 languages. No VLA safety evaluation exists for non-English contexts. This is a gap in both the Failure-First corpus and in public benchmarks.
2. **Compositional adapter safety testing.** CoLoRA tested pairwise LoRA composition. The Failure-First supply chain family (#27, CSC) covers the conceptual attack but has 0 empirical traces with composed adapters. This requires compute resources beyond current allocation.
3. **Iatrogenic safety evaluation methodology.** No tool in the Failure-First toolkit evaluates whether a safety intervention creates new attack surfaces. The FLIP methodology assesses attack success; it does not assess whether a defense intervention increases or decreases the attack surface.

### 4.3 CCS Paper Relevance

The iatrogenic risk horizon strengthens the CCS paper's core argument (IDDL + CDC) with external validation from three independent groups. For the April 22 abstract registration deadline, the defense layer inversion finding is the strongest new evidence available. Recommend citing Alignment Backfire (2603.04904) in the related work section and Blindfold (2603.01414) as validation of the compliance paradox finding.

---

## 5. Recommendations

1. **Add GLI entries gli_113 through gli_115** to `data/governance/gli_dataset_v0.1.jsonl`. [Done in this session.]
2. **Create GitHub issue** to track iatrogenic risk horizon as a research stream.
3. **Update commercial briefs (B1 red-team, B2 actuarial):** The iatrogenic framing changes the risk calculus for insurers -- safety certification that focuses exclusively on text-level defenses may actually increase actuarial risk by creating false assurance.
4. **Prioritize CCS paper integration** of defense layer inversion finding before April 22 abstract deadline.
5. **Scope cross-linguistic VLA testing** as a follow-on experiment (requires multilingual model access + compute).

---

## 6. Limitations

- This brief synthesizes three external papers that we have not independently replicated. Our assessment is based on the published methodology and results.
- The "phase transition" framing is an analytical claim, not an empirical measurement. The three papers are evidence of the pattern; they do not prove that the pattern is universal.
- Predictions P1-P4 are extrapolations from limited evidence. They should be evaluated against incoming data and updated accordingly.
- The Failure-First corpus has zero empirical traces for compositional adapter attacks (CSC family, Report #133) and zero cross-linguistic VLA evaluations. Our claims about these domains are informed by external literature, not first-party data.

---

## References

1. Fukui (2026). "Alignment Backfire: Language-Dependent Reversal of Safety Interventions Across 16 Languages in LLM Multi-Agent Systems." arXiv:2603.04904.
2. Li et al. (2026). "Blindfold: Jailbreaking Embodied LLMs with Semantically Benign Instructions." arXiv:2603.01414.
3. Ding et al. (2026). "Colluding LoRA: A Composite Attack on LLM Safety Alignment." arXiv:2603.12681. Mercedes-Benz R&D North America.
4. Failure-First Reports: #59 (Compliance Paradox), #78 (Defense Impossibility), #88 (IDDL), #97 (CDC), #117 (Safety Improvement Paradox), #132 (Alignment Backfire Integration), #136 (Iatrogenic Attack Surfaces), #137 (Defense Layer Inversion), #140 (Iatrogenesis of AI Safety).
5. Failure-First GLI Dataset v0.1: `data/governance/gli_dataset_v0.1.jsonl` (112 entries prior to this session).
