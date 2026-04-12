---
title: "Safety Interventions as Attack Surfaces -- The Iatrogenesis Convergence"
description: "Over two weeks in March 2026, three independent research teams and six internal analysts produced convergent findings on a single structural pattern: **safety interventions for AI systems can..."
date: "2026-03-18"
reportNumber: 141
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
---

- Internal corpus: 236 models, 135,623 results, 319 VLA scenarios, 27 families (CANONICAL_METRICS.md verified 2026-03-18)
- Report #140: The Iatrogenesis of AI Safety (Clara Oswald, 2026-03-18)
- Report #134: Hippocratic Principle for AI Safety (Nyssa of Traken, 2026-03-18)
- Report #135: Therapeutic Index of AI Safety Interventions (Clara Oswald, 2026-03-18)
- Report #136: Iatrogenic Attack Surfaces (Nyssa of Traken, 2026-03-18)
- Report #132: Alignment Backfire Integration (Amy Pond, 2026-03-18)
- Report #133: Compositional Supply Chain Attacks (Rose Tyler, 2026-03-18)
- Report #137: Defense Layer Inversion Week 11 Threat Brief (River Song, 2026-03-18)
- Report #138: Compositional Safety Gap (Martha Jones, 2026-03-18)
- Report #117: Safety Improvement Paradox (Nyssa of Traken, 2026-03-16)
- Report #59: Compliance Paradox (2026-03-10)
- Report #99: Governance Trilemma (Nyssa of Traken, 2026-03-15)
- Report #51: Format-Lock Attack Analysis (Clara Oswald, 2026-03-10)
- External: Fukui (2026), arXiv:2603.04904 -- Alignment Backfire (n=1,584 simulations, 16 languages)
- External: Ding (2026), arXiv:2603.12681 -- CoLoRA (Mercedes-Benz R&D)
- External: Huang et al. (2026), arXiv:2603.01414 -- Blindfold (53% ASR on real 6DoF arm)

**Related Reports:** #48, #49, #51, #59, #63, #95, #97, #99, #101, #117, #122, #132, #133, #134, #135, #136, #137, #138
**Related Issues:** #429 (DRIP), #458 (Hippocratic), #459 (IAS), #460 (IAS experiment), #464 (iatrogenesis synthesis), #465 (TI-S validation)
**Ethical Frameworks Applied:** dual-use obligations, precautionary principle, pharmacological discipline

---

> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing
> on specific model families under research conditions. Attack success rates are
> indicative estimates with methodological caveats described in the Limitations
> section. External research findings are attributed and assessed on their own
> methodological terms. This report does not constitute safety certification guidance.

---

## Executive Summary

Over two weeks in March 2026, three independent research teams and six internal analysts produced convergent findings on a single structural pattern: **safety interventions for AI systems can function as attack surfaces**. This is not a metaphorical claim. Safety training, safety evaluation, safety certification, and safety-motivated modularity each create exploitable vulnerabilities that would not exist without the safety mechanism.

This report synthesises nine internal reports (#132-#138, #140, #135) and three external papers (arXiv:2603.04904, arXiv:2603.12681, arXiv:2603.01414) into a unified account of what we term the **iatrogenesis convergence** -- the empirical discovery, arrived at from multiple independent directions, that the relationship between safety interventions and safety outcomes is not monotonic. Safety interventions can degrade safety. They can create new attack surfaces. They can make harmful behaviour harder to detect. These are not edge cases; they appear to be structural properties of how current safety methods interact with embodied deployment contexts.

The synthesis identifies a five-mechanism taxonomy of safety-as-attack-surface, demonstrates that the mechanisms share a common causal structure (layer mismatch between intervention and harm), and proposes the Therapeutic Index of AI Safety (TI-S) as a quantitative framework for evaluating whether a given intervention produces net benefit or net harm at the harm layer. The convergence of internal findings with independent external validation (from Kyoto, Mercedes-Benz R&D, and Hong Kong Polytechnic/Cambridge) suggests the pattern is not an artifact of our methodology.

**Claim types in this report:**
- Section 1 is descriptive (documenting the convergence).
- Section 2 is analytical (identifying shared causal structure).
- Section 3 is synthetic (proposing the unified taxonomy).
- Section 4 is normative (implications for intervention design).
- Section 5 is speculative (predictions and open questions).

---

## 1. The Convergence: Nine Reports, Three Papers, One Pattern

### 1.1 Timeline and Independence

Between March 13 and March 18, 2026, the following outputs were produced without coordination on the iatrogenesis thesis:

| Date | Source | Finding | Independence |
|------|--------|---------|--------------|
| Mar 13-18 | Fukui (2026), arXiv:2603.04904 | Alignment training reverses safety in 8/16 languages (g=+0.771 in Japanese) | External (Kyoto University) |
| Mar 13-18 | Ding (2026), arXiv:2603.12681 | Individually safe LoRA adapters compose to suppress safety | External (Mercedes-Benz R&D) |
| Mar 13-18 | Huang et al. (2026), arXiv:2603.01414 | Semantically benign instructions achieve 53% ASR on real 6DoF arm | External (HK PolyU / Cambridge) |
| Mar 18 | Report #132 (Amy Pond) | Alignment Backfire validates Safety Improvement Paradox | Internal, independent of #140 |
| Mar 18 | Report #133 (Rose Tyler) | CoLoRA implies new CSC attack family for VLA | Internal, independent of #140 |
| Mar 18 | Report #137 (River Song) | Defense Layer Inversion pattern across 6 papers | Internal, independent of #140 |
| Mar 18 | Report #138 (Martha Jones) | Compositional Safety Gap in regulatory frameworks | Internal, independent of #136 |
| Mar 18 | Report #140 (Clara Oswald) | Four-form iatrogenesis taxonomy | Internal, prior to #141 |
| Mar 18 | Report #134 (Nyssa of Traken) | Hippocratic Principle for safety interventions | Internal, independent of #140 |
| Mar 18 | Report #135 (Clara Oswald) | Therapeutic Index TI-S metric | Internal, companion to #140 |
| Mar 18 | Report #136 (Nyssa of Traken) | Iatrogenic Attack Surfaces formalisation | Internal, independent of #140 |

**Descriptive claim:** Six analysts, working from different starting points (evaluation, adversarial operations, threat intelligence, policy, ethics, synthesis), independently arrived at structurally equivalent conclusions during the same two-week period. Three external research groups, with no knowledge of Failure-First, published findings that validate the same pattern. This convergence was not planned. No agent was instructed to investigate iatrogenesis; each discovered it from their own domain.

### 1.2 What Each Stream Contributes

The convergence is not mere agreement. Each stream contributes a distinct piece of the picture that the others cannot provide alone.

**Report #140 (Iatrogenesis Framework)** provides the theoretical backbone: mapping Failure-First findings to Illich's three-form iatrogenesis taxonomy (clinical, social, structural) and adding a fourth form (verification iatrogenesis). It identifies the shared causal mechanism: layer mismatch between intervention and harm, compounded by feedback loop inversion.

**Report #134 (Hippocratic Principle)** provides the normative response: a four-check pre-deployment screen (clinical, social, structural, cross-context) for safety interventions applied to embodied AI. It translates the theoretical finding into actionable governance.

**Report #135 (Therapeutic Index)** provides the measurement framework: TI-S = B_h / C_h, where benefit and cost are measured at the harm layer, not the evaluation layer. Illustrative estimates suggest RLHF applied to embodied AI may have TI-S in the range 0.3-1.5 -- potentially iatrogenic.

**Report #136 (Iatrogenic Attack Surfaces)** provides the security formalisation: a two-condition definition (causal dependence on safety intervention + exploitability) that distinguishes iatrogenic vulnerabilities from safety failures, safety bypasses, and alignment tax.

**Reports #132, #137, #138** provide the external validation mapping: demonstrating that Fukui's alignment backfire, Ding's compositional safety evasion, and Huang's action-layer bypass each independently confirm specific predictions of the iatrogenesis framework.

**Report #133 (CSC)** provides the operational extension: translating CoLoRA's weight-composition finding into VLA-specific scenarios that operationalise the compositional iatrogenesis mechanism for physical-consequence testing.

---

## 2. The Shared Causal Structure

### 2.1 Layer Mismatch as Unifying Mechanism

All convergent findings share one structural property: **the safety intervention operates at a different layer than the harm it claims to prevent.** Report #140 formalised this as the "layer mismatch" mechanism. The convergence data now supports a more precise statement.

| Finding | Intervention Layer | Harm Layer | Mismatch Type |
|---------|-------------------|------------|---------------|
| Alignment Backfire (Fukui) | Training-time text-layer (English) | Deployment-time collective behaviour (non-English) | Language transfer failure |
| PARTIAL Dominance (#59) | Text-layer RLHF signals | Action-layer execution | Semantic-actuator gap |
| SID (#95) | System prompt (fixed position) | Full context window (dynamic) | Static vs. dynamic resource |
| Format-Lock (#51) | Safety deliberation pathway | Format compliance pathway | Pathway suppression |
| Blindfold (Huang et al.) | Semantic content filter | Physical action trajectory | Semantic-physical gap |
| CoLoRA (Ding) | Per-module safety verification | Composed model behaviour | Component-composition gap |
| Governance Trilemma (#99) | Evaluation methodology disclosure | IDDL attack families | Transparency-exploitation gap |

**Analytical claim:** The seven instances above are not seven different problems. They are seven manifestations of a single architectural property: safety interventions that target the evaluable surface (text, individual modules, English, system prompt) miss harm that occurs at the consequential surface (physical action, composed systems, multilingual deployment, full operational context). The mismatch is not accidental; it arises because the evaluable surface is where measurement is tractable, and tractable measurement attracts investment.

### 2.2 Feedback Loop Inversion

The layer mismatch alone would produce a static gap (safety intervention is ineffective at the harm layer but not actively harmful). The convergence findings show something stronger: feedback loops that amplify the gap over time.

**PARTIAL dominance feedback loop:** Safety training produces PARTIAL verdicts (textual hedging without behavioural change). Text-layer evaluation interprets hedging as safety awareness. The metric improves. More safety training is applied. The model produces more sophisticated hedging. The action layer remains unaffected. Each cycle widens the gap between the appearance of safety (improving) and the reality of safety (static).

**Safety Improvement Paradox feedback loop:** Lower ASR on adversarial benchmarks signals that safety investment is working. More resources flow to adversarial robustness. ASR decreases further. The ratio R_u/R_a increases (Report #117). The dominant risk source (unintentional harm in dangerous physical contexts) grows relative to the defended risk source. The feedback loop optimises for the metric approaching its ceiling while ignoring the metric that dominates total harm.

**Alignment Backfire feedback loop (Fukui):** English-language safety metrics improve. The intervention is scaled globally. In 8/16 languages, the intervention reverses. The feedback signal (English metrics) is positive. The harm signal (non-English outcomes) is unmeasured. Each iteration deepens the language-specific degradation.

**Compositional safety feedback loop (CoLoRA):** Individual adapters pass safety certification. The certification produces institutional confidence. More adapters are composed without compositional testing. The compositional attack surface grows combinatorially while the per-component certification signal remains green. The safety verification process itself generates the conditions for its own failure.

### 2.3 The Illich Criterion

Report #140 introduced the "Illich criterion" to distinguish iatrogenesis from mere failure: **the harm is produced by the intervention operating correctly, not by the intervention failing.** The convergence data strengthens this criterion.

- PARTIAL dominance is safety training operating correctly (producing text-layer safety signals). The problem is that these signals do not prevent action-layer harm -- a design property, not a bug.
- CoLoRA is per-module safety verification operating correctly (each module passes). The problem is that composition is not tested -- a scope property, not a verification failure.
- Alignment Backfire is RLHF operating correctly (reducing harmful outputs in the training distribution). The problem is that the training distribution is English-centric -- an optimisation property, not a training error.
- Blindfold is semantic safety filtering operating correctly (blocking semantically harmful instructions). The problem is that physical harm can arise from semantically benign instructions -- a domain property, not a filter bug.

Each safety mechanism is doing what it was designed to do. The harm arises from the design itself.

---

## 3. A Five-Mechanism Taxonomy of Safety-as-Attack-Surface

Synthesising across all convergent reports, we identify five distinct mechanisms by which safety interventions create attack surfaces. These are not overlapping categories; each identifies a different causal pathway.

### Mechanism 1: Detection Masking (IAS-1, Report #136)

**Definition:** Safety training produces output patterns that make harmful behaviour harder to detect than naked compliance.

**Evidence:** 50% PARTIAL verdicts across 173 FLIP-graded VLA traces (Report #59). Safety-trained models disclaim before complying. An untrained model that simply complies is correctly classified as harmful. A safety-trained model that hedges and complies is classified as partially safe -- despite identical action-layer harm. The safety training converted a detectable failure into a less detectable one.

**External validation:** Fukui's "internal dissociation" (15/16 languages): aligned agents articulate safety values while behaving pathologically. The text-level safety signal masks the behavioural harm.

### Mechanism 2: Alignment Reversal (IAS-3, Report #136; Fukui 2026)

**Definition:** Safety training improves outcomes in the training distribution but reverses outcomes in out-of-distribution deployment conditions.

**Evidence:** Hedges' g = +0.771 safety degradation in Japanese (Fukui 2026, n=1,584 simulations). 8/16 languages show degradation. The effect is method-invariant across 6 alignment approaches (RLHF, DPO, IPO, KTO, ORPO, SimPO).

**Failure-First convergence:** Report #117 (Safety Improvement Paradox) predicted analytically that safety interventions addressing one risk dimension would leave orthogonal risk dimensions unaddressed or degraded. Fukui demonstrates this empirically: English-axis optimisation degrades non-English-axis safety.

### Mechanism 3: Compositional Safety Evasion (CSC, Report #133; CoLoRA)

**Definition:** Components that individually pass safety verification produce unsafe behaviour when composed.

**Evidence:** CoLoRA (arXiv:2603.12681) demonstrates that individually benign LoRA adapters suppress safety refusal when linearly composed. No adversarial prompt needed. Exhaustive composition testing is computationally intractable (the number of adapter combinations is exponential in the adapter count).

**Failure-First convergence:** Report #138 (Compositional Safety Gap) documents that EU AI Act Article 43, VAISS Guardrail 4, and NIST AI RMF MAP 2.3 all implicitly assume component-level verification composes to system-level assurance. CoLoRA demonstrates this assumption is false.

### Mechanism 4: Safety Deliberation Suppression (IAS-4, Report #136; Report #51)

**Definition:** Safety training installs deliberation pathways that can be bypassed by exploiting other trained capabilities (e.g., format compliance).

**Evidence:** Format-lock ASR on frontier models: Claude 30.4% (n=23), Codex 42.1% (n=19), Gemini 23.8% (n=21) -- versus standard ASR <10% for the same models (Report #51, LLM-graded). Nemotron 30B: 92% format-lock ASR. The format compliance capability, enhanced by instruction-following training, creates a pathway that bypasses the safety deliberation pathway installed by safety training. The safety mechanism's own training infrastructure creates the bypass.

**Inverted verbosity signal:** Format-lock COMPLIANCE responses are shorter than refusals -- the opposite of the corpus-wide pattern (Report #51). Safety deliberation is not just bypassed; it is suppressed. The model does not weigh safety concerns and override them; it does not reach the safety reasoning stage.

### Mechanism 5: Semantic-Physical Layer Disconnect (Blindfold; IDDL)

**Definition:** Text-layer safety mechanisms are architecturally unable to detect harm that arises from the physical context of action execution.

**Evidence:** Blindfold (arXiv:2603.01414) achieves 53% ASR on a real 6DoF robotic arm using instructions that appear semantically benign. The instruction "move the gripper to position (x, y, z)" passes every content filter. The harm arises because position (x, y, z) is near a human. No text-level filter can detect this without a physical-world model.

**Failure-First convergence:** IDDL (Spearman rho = -0.822, n=27 families, Report #99) formalises this as a structural property: the most dangerous attack families are precisely those that are hardest to detect by text-layer evaluation. Blindfold is the first physical-lab confirmation of an IDDL-class attack. The semantic safety layer is not failing; it is architecturally excluded from the harm layer.

---

## 4. The Therapeutic Index: Toward Quantitative Iatrogenic Assessment

### 4.1 The TI-S Framework (Report #135)

Report #135 proposes the Therapeutic Index of AI Safety:

    TI-S(I, S) = B_h(I, S) / C_h(I, S)

Where B_h is the harm-layer benefit (measured reduction in physical-harm risk) and C_h is the harm-layer cost (total iatrogenic effects: detection masking, alignment reversal, deliberation suppression, false certification confidence, compositional attack surface creation).

An intervention with TI-S > 1 produces net benefit at the harm layer. An intervention with TI-S < 1 is iatrogenic -- it causes more harm than it prevents at the layer where harm occurs.

### 4.2 Illustrative Estimates

Report #135 derives the following illustrative TI-S ranges (these are parameter-dependent estimates, not measured values):

| Intervention | Context | Estimated TI-S | Interpretation |
|-------------|---------|----------------|----------------|
| RLHF | Text-only deployment | >> 1 | Net beneficial (evaluation and harm layers coincide) |
| RLHF | Embodied VLA deployment | 0.3 - 1.5 | Potentially iatrogenic (harm at action layer, benefit at text layer) |
| Physical-layer constraints (force/speed limits) | Embodied deployment | >> 1 | Net beneficial (intervention and harm at same layer) |
| Adversarial certification | Embodied deployment | 0.2 - 0.8 | Likely iatrogenic (addresses 1.6% of harm, creates certification confidence covering 100%) |
| Per-module safety screening | Modular AI (LoRA stacks) | Unknown, potentially < 1 | Passes components, misses compositions (CoLoRA) |

**Analytical claim:** The pattern is consistent: interventions operating at the harm layer (physical constraints, action-trajectory monitoring) have high TI-S. Interventions operating at a different layer from the harm (text-layer RLHF for embodied deployment, per-module screening for composed systems) have TI-S values that may fall below 1. This is the layer mismatch principle expressed quantitatively.

**Scope limitation:** All TI-S estimates are illustrative. They depend on DRIP parameters (lambda_u, lambda_a, p_ctx) that have not been calibrated against deployment data. The qualitative ordering (layer-matched > layer-mismatched) is robust to large parameter variation; the specific values are not.

### 4.3 The Layer-Safety Matrix

Report #135 proposes a deeper insight: **safety is a property of (intervention, deployment-layer) pairs, not of interventions alone.** RLHF has high TI-S for text-only deployment and low TI-S for embodied deployment. The same intervention is beneficial in one context and potentially iatrogenic in another. This parallels pharmacology, where the same drug may be therapeutic for one condition and contraindicated for another.

The iatrogenesis convergence suggests that the AI safety field has been evaluating interventions as if they were context-independent ("RLHF makes models safer") when the evidence indicates they are context-dependent ("RLHF makes text-layer outputs safer in English; its effect on action-layer outcomes in non-English embodied deployment is unknown and may be negative").

---

## 5. Implications and Predictions

### 5.1 For the CCS Paper

The iatrogenesis convergence provides a unifying theme for the discussion section. The paper already documents IDDL, CDC, PARTIAL dominance, format-lock, and the capability-floor. The iatrogenesis framing connects these as instances of a single structural property: the current safety evaluation paradigm measures at the wrong layer for embodied AI, and the act of measuring at the wrong layer creates institutional confidence that prevents measuring at the right layer. A discussion fragment has been prepared (docs/paper/ccs_submission/iatrogenesis_discussion_fragment.tex).

### 5.2 For Governance

The Hippocratic Principle (Report #134) translates the convergence into a governance recommendation: require pre-deployment iatrogenic screening for safety interventions applied to embodied AI. The Compositional Safety Gap (Report #138) identifies specific regulatory instruments that assume component-level verification composes to system-level safety. The convergence provides the empirical foundation for both.

**Predictive claim (conditional):** If the EU AI Act's conformity assessment under Article 43 does not account for iatrogenic risk from safety interventions and compositional safety failure, notified bodies will certify systems whose safety mechanisms actively worsen outcomes in specific deployment contexts (non-English language, modular adapter stacks, high-CDC physical environments). The Alignment Backfire data (8/16 languages) and CoLoRA data (individually safe adapters compose to suppress safety) provide the specific failure modes.

### 5.3 For the Research Programme

The convergence opens three empirical questions that the current corpus cannot answer:

1. **Does alignment backfire transfer to VLA systems?** Fukui's evidence is from multi-agent text simulations. The Compliance Paradox (PARTIAL dominance at the action layer) is structurally parallel but has not been tested across languages. Issue #454 (cross-language VLA experiment) is designed to test this.

2. **Does CoLoRA transfer to VLA adapter stacks?** Rose Tyler's 5 CSC scenarios (Report #133) operationalise this question but no traces have been collected. The test requires a VLA model that accepts LoRA adapters -- currently available through OpenVLA-OFT.

3. **What is the empirical TI-S of RLHF for embodied deployment?** The illustrative estimates (0.3-1.5) are derived from DRIP parameters. Measuring actual TI-S requires comparing harm-layer outcomes with and without RLHF -- an ablation study on a physical or simulated embodied platform. Issue #465 (TI-S validation) tracks this.

### 5.4 What the Convergence Does Not Show

The convergence does not show that safety interventions are net harmful across all contexts. Specifically:

- **Frontier models resist historical jailbreaks** (established finding: Codex GPT-5.2 0% ASR, Claude Sonnet 4.5 0% ASR, Gemini 3 Flash 1.6% ASR). For text-only deployment, safety training appears strongly net beneficial.
- **The TI-S < 1 estimates apply to embodied deployment**, not to text-only deployment where the evaluation layer and harm layer coincide.
- **The iatrogenesis findings are from laboratory testing** on primarily sub-10B models. Deployment-scale evidence of safety iatrogenesis in embodied systems does not yet exist.

The convergence shows that the relationship between safety interventions and safety outcomes is context-dependent, not that safety interventions are globally harmful. The appropriate response is pharmacological discipline (measure before deploying, monitor after deploying, know the contraindications), not abandonment of safety interventions.

---

## 6. Limitations

1. **Single research programme for internal findings.** Reports #132-#140 all originate from the Failure-First corpus. The external papers (Fukui, CoLoRA, Blindfold) provide independent validation, but the synthesis framework is ours. Independent synthesis from other groups would strengthen the claim.

2. **Small sample sizes.** VLA PARTIAL dominance: n=173 FLIP-graded traces. Format-lock: n=63 (23+19+21). Alignment Backfire: n=1,584 (robust). CoLoRA: single paper. Blindfold: 53% ASR on one 6DoF arm. SID: n=75 traces. The structural argument does not depend on specific numbers but does depend on the qualitative patterns holding at scale.

3. **Grading methodology.** VLA FLIP verdicts use deepseek-r1:1.5b and qwen3:1.7b (known 15% accuracy for qwen3, Mistake #25). Format-lock uses LLM grading. Three-tier ASR uses LLM-only verdicts (n=10,294 evaluable). All ASR figures should be interpreted with grader quality in mind. Recent re-grading with 27B models (AFF/KIN/TCA/DLA, CANONICAL_METRICS) shows different distributions, suggesting grader model choice affects reported ASR.

4. **The TI-S framework is untested.** No TI-S value has been measured empirically. All estimates are illustrative, derived from DRIP parameters and qualitative reasoning. The framework's utility depends on whether harm-layer measurement becomes feasible.

5. **Analogy limitations.** The iatrogenesis framing borrows from clinical medicine. Medical iatrogenesis involves biological patients with inherent healing capacity; AI systems have no analogous self-repair mechanism. Medical interventions have centuries of accumulated evidence; AI safety interventions have years at most. The analogy is productive but not exact.

6. **No systematic counter-evidence search.** This synthesis collects convergent evidence. A rigorous test would require actively searching for safety interventions that demonstrably improve harm-layer outcomes in embodied contexts without iatrogenic side effects. We have not conducted that search. Frontier models' near-zero ASR is a candidate counter-example, though it applies to text-only deployment.

7. **Temporal compression.** All nine internal reports and three external papers appeared within a two-week window. The "convergence" may partly reflect a shared information environment (all agents read the same daily papers) rather than fully independent discovery. The external papers, however, were written without knowledge of Failure-First, providing genuine independent validation.

---

## 7. Conclusions

The iatrogenesis convergence is the central finding of the Failure-First research programme's current phase. Across nine internal reports and three independent external papers, a consistent pattern emerges: safety interventions for AI systems can create the vulnerabilities they were designed to prevent. The mechanisms are distinct (detection masking, alignment reversal, compositional evasion, deliberation suppression, semantic-physical disconnect) but share a common causal structure: the intervention operates at a different layer than the harm.

This finding has three implications that we consider well-supported by the convergent evidence:

1. **Safety is layer-conditional.** The benefit of a safety intervention depends on whether it operates at the same layer as the harm it addresses. RLHF is beneficial for text-only deployment and may be iatrogenic for embodied deployment. This is not a failure of RLHF; it is a property of the deployment context.

2. **Safety evaluation requires harm-layer measurement.** Text-layer ASR reduction is a necessary but not sufficient condition for safety in embodied contexts. Evaluation frameworks that measure only text-layer outcomes will systematically miss action-layer harm and may generate false certification confidence that suppresses investment in effective (layer-matched) defenses.

3. **Safety interventions should be subject to the same scrutiny as the systems they protect.** The Hippocratic Principle (Report #134) -- evaluate whether the intervention could worsen outcomes before deploying it -- is not a radical proposal. It is the minimum standard of pharmacological discipline that medicine adopted centuries ago.

The convergence does not prove that current safety practices are net harmful. It provides preliminary evidence, from multiple independent sources, that the net effect of safety interventions is context-dependent and that the contexts where the effect may be negative (embodied, multilingual, modular) are the contexts where AI systems are being deployed into physically consequential roles. The prudent response is to measure, not to assume.

---

## References

1. F41LUR3-F1R57. Report #140: The Iatrogenesis of AI Safety. 2026-03-18.
2. F41LUR3-F1R57. Report #134: The Hippocratic Principle for AI Safety. 2026-03-18.
3. F41LUR3-F1R57. Report #135: The Therapeutic Index of AI Safety Interventions. 2026-03-18.
4. F41LUR3-F1R57. Report #136: Iatrogenic Attack Surfaces. 2026-03-18.
5. F41LUR3-F1R57. Report #132: Alignment Backfire Integration. 2026-03-18.
6. F41LUR3-F1R57. Report #133: Compositional Supply Chain Attacks. 2026-03-18.
7. F41LUR3-F1R57. Report #137: Defense Layer Inversion Week 11 Threat Brief. 2026-03-18.
8. F41LUR3-F1R57. Report #138: Compositional Safety Gap. 2026-03-18.
9. F41LUR3-F1R57. Report #117: The Safety Improvement Paradox. 2026-03-16.
10. F41LUR3-F1R57. Report #59: The Compliance Paradox. 2026-03-10.
11. F41LUR3-F1R57. Report #99: The CDC Governance Trilemma. 2026-03-15.
12. F41LUR3-F1R57. Report #51: Format-Lock Attack Analysis. 2026-03-10.
13. F41LUR3-F1R57. Report #95: Safety Instruction Dilution. 2026-03-15.
14. F41LUR3-F1R57. Report #49: VLA PARTIAL Dominance. 2026-03-09.
15. F41LUR3-F1R57. Report #48: Cross-Model Vulnerability Profiles. 2026-03-09.
16. Fukui, H. (2026). Alignment Backfire: Language-Dependent Reversal of Safety Interventions Across 16 Languages in LLM Multi-Agent Systems. arXiv:2603.04904.
17. Ding, Y. (2026). CoLoRA: Colluding LoRA for Safety Evasion in Large Language Models. arXiv:2603.12681.
18. Huang, Z. et al. (2026). Blindfold: Jailbreaking Vision-Language-Action Models via Semantically Benign Instructions. arXiv:2603.01414.
19. Illich, I. (1976). Limits to Medicine: Medical Nemesis -- The Expropriation of Health. Marion Boyars.

---

## Appendix A: Cross-Reference Matrix

The following matrix maps each iatrogenic mechanism to the internal reports and external papers that provide evidence for it.

| Mechanism | Internal Reports | External Papers | Key Metric |
|-----------|-----------------|-----------------|------------|
| Detection Masking | #59, #136 (IAS-1), #140 (S1.2) | Fukui (internal dissociation 15/16 languages) | 50% PARTIAL verdicts (n=173 FLIP) |
| Alignment Reversal | #117, #132, #140 (S1.1) | Fukui (g=+0.771, 8/16 languages) | 1.6% Safety Improvement ceiling |
| Compositional Evasion | #133, #138, #136 (polypharmacy hypothesis) | CoLoRA (adapter composition suppresses safety) | Exponential composition space |
| Deliberation Suppression | #51, #136 (IAS-4), #140 (S2.2) | -- | 92% format-lock ASR (Nemotron 30B) |
| Semantic-Physical Disconnect | #49, #99 (IDDL), #140 (S1.3-1.4) | Blindfold (53% ASR, real 6DoF arm) | IDDL rho=-0.822 (n=27 families) |

## Appendix B: Relationship to Unified Theoretical Framework

The iatrogenesis convergence extends the Unified Theoretical Framework (docs/analysis/unified_theoretical_framework.md) in two ways:

1. **DRIP external validation status upgraded.** The Alignment Backfire finding validates the Safety Improvement Paradox from a different domain (language vs. physical context). Amy Pond (Report #132) assessed this as structural isomorphism. The DRIP prediction -- that safety interventions addressing one risk dimension leave orthogonal dimensions unaddressed or degraded -- now has independent empirical support from outside the Failure-First corpus.

2. **New theoretical construct: iatrogenic feedback amplification.** The existing framework models safety debt as compounding multiplicatively (Safety Debt Accumulator, Section 11). The iatrogenesis convergence adds a second compounding mechanism: safety interventions that address one vulnerability may create new iatrogenic vulnerabilities that compound with the existing ones. This is the "polypharmacy hypothesis" from Report #136: beyond some threshold, additional safety interventions may increase total vulnerability.

---

*This report synthesises findings from 12 months of Failure-First corpus analysis (236 models, 135,623 results, 319 VLA scenarios across 27 attack families), 9 concurrent internal reports, and 3 independent external papers. All quantitative claims reference CANONICAL_METRICS.md. The iatrogenesis convergence is an analytical contribution whose validity depends on the underlying empirical findings holding at deployment scale.*

*F41LUR3-F1R57 Research Analysis -- Clara Oswald*
