---
title: "The Ethics of Embodied AI Safety -- Five Paradoxes"
description: "Five interlocking structural paradoxes in embodied AI safety ethics, derived from 12 months of empirical research. Each paradox formalises a tension between capability, evaluation, disclosure, governance, and deployment that governance frameworks for text-only AI cannot resolve."
date: "2026-03-16"
reportNumber: 122
classification: "Research -- AI Ethics"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

## Abstract

The Failure-First Embodied AI project has, over twelve months of empirical research, uncovered a set of structural problems in the ethics of embodied AI safety that resist clean resolution. This report synthesises five of these into a unified framework. Each paradox is derived from empirical findings in the project corpus and formalised as a structural tension -- not a problem awaiting a technical fix, but a property of the relationship between embodied AI capability, evaluation, disclosure, governance, and deployment. Together, the five paradoxes constitute a case that embodied AI safety ethics is qualitatively different from the ethics of text-only AI, and that the governance frameworks being developed for the latter are structurally inadequate for the former.

**Claim types throughout this report:**
- The paradoxes themselves are analytical claims (derived from empirical findings plus formal reasoning).
- The empirical grounding is descriptive (what the data shows).
- The governance implications are normative (what should follow).
- Predictions about trajectories are hedged and labelled as such.

---

## 1. Paradox I: The Disclosure Paradox

**Source:** Report #93 (IDDL Implications for Responsible Disclosure)

### Statement

Standard responsible disclosure assumes that revealing a vulnerability enables defenders to build defenses. The Disclosure Paradox arises when this assumption fails: for the class of embodied AI attacks with the highest physical consequentiality, disclosure provides attackers with tested, reproducible attack constructions while providing defenders with knowledge they cannot operationalise within the current evaluation paradigm.

### Empirical Grounding

The Inverse Detectability-Danger Law (IDDL, Report #88) establishes that across the Failure-First VLA corpus, attack families with higher physical consequentiality are systematically harder for text-layer evaluation to detect. The correlation is structural, not accidental: physically dangerous scenarios look like normal operation precisely because the danger depends on physical context, not instruction content.

The SRDA framework (Report #89) classifies VLA attack families into three disclosure tiers based on the ratio of defensive benefit to attacker benefit from disclosure. For IDDL-relevant families (high danger, low detectability), this ratio is unfavourable regardless of the attack's novelty.

### The Paradox Formalised

Let D(a) be the defensive benefit of disclosing attack family a, and let A(a) be the attacker benefit. Standard responsible disclosure is justified when D(a) > A(a) -- disclosure helps defenders more than attackers. The IDDL implies that for the highest-consequentiality attack families, D(a) approaches zero (defenders cannot detect or prevent the attack with current methods) while A(a) remains positive (attackers gain tested attack constructions). The paradox: the attacks that most urgently need defensive attention are the attacks whose disclosure is least justifiable under standard norms.

### Resolution

The paradox does not resolve cleanly. Report #93 argues for a modified disclosure norm: publish the structural finding (that such attacks exist and the IDDL pattern holds) without publishing specific reproducible attack constructions. This is a pragmatic compromise. It satisfies the obligation to inform the community that a class of vulnerability exists while limiting the concrete capability transfer. The cost is reduced scientific reproducibility.

### Why This Matters for Governance

If standard responsible disclosure norms are inadequate for embodied AI vulnerability research, then the governance frameworks that rely on those norms -- including the structures being developed for AI Safety Institutes in the US, UK, and Australia -- need modification. No current AISI disclosure policy addresses the case where disclosure enables attack more than defense.

---

## 2. Paradox II: The Safety Improvement Paradox

**Source:** Report #117 (The Safety Improvement Paradox)

### Statement

As adversarial defenses for embodied AI improve, the relative contribution of unintentional harm increases without bound. Safety teams improving adversarial robustness are, in a precise mathematical sense, making the embodied AI safety problem look worse in relative terms -- not because their work lacks value, but because it addresses a diminishing fraction of total expected harm.

### Empirical Grounding

The DRIP framework (Report #101) estimates the ratio of unintentional to adversarial expected harm for deployed embodied AI systems. Under conservative parameters:

- At ASR = 10%: R_u / R_a is approximately 60
- At ASR = 1%: R_u / R_a is approximately 600
- At ASR = 0.1%: R_u / R_a is approximately 6,000

The ratio scales as 1/ASR. The better adversarial defenses become, the more the unintentional risk dominates.

### The Paradox Formalised

The maximum contribution of adversarial defense to total safety is bounded:

    Delta_safety_max = R_a(initial) / (R_u + R_a(initial))

Under DRIP parameters, this ceiling is approximately 1.6%. A perfect adversarial defense (ASR = 0) eliminates at most 1.6% of total expected harm. The remaining 98.4% is from unintentional use in dangerous physical contexts, which adversarial defense does not address.

### Resolution

The paradox does not argue against adversarial defense. It argues for proportional resource allocation. The current AI safety community invests overwhelmingly in adversarial robustness (red-teaming, jailbreak research, safety fine-tuning) and minimally in physical-context safety for embodied systems. This allocation is mismatched against the expected harm distribution by approximately two orders of magnitude.

Physical-layer defenses (force limits, workspace monitoring, operational envelope constraints) address R_u directly and are available with current technology. They do not require world-model breakthroughs. The GPWS (Ground Proximity Warning System) analogy from Report #116 is instructive: aviation deployed imperfect environmental monitoring that reduced controlled-flight-into-terrain fatalities by over 90%, without waiting for perfect terrain databases.

### Why This Matters for Governance

Regulatory frameworks that mandate adversarial testing for embodied AI are testing the 1.6%. If regulators are aware of this ceiling and still certify systems as safe based on adversarial testing alone, the certification constitutes what Report #116 characterises as safety theatre. The ethical obligation is: at minimum, every safety certification for embodied AI must state the scope of what was tested and what was not.

---

## 3. Paradox III: The Governance Trilemma

**Source:** Report #99 (The CDC Governance Trilemma)

### Statement

For embodied AI systems deployed in proximity to humans, you cannot simultaneously achieve all three of:

1. **Capability** -- the system reliably follows instructions and performs useful physical tasks.
2. **Certifiable Safety** -- an evaluator can verify that the system will not cause physical harm.
3. **Transparency** -- the evaluation methodology, attack families tested, and residual risks are publicly known.

Any two are achievable; all three together are not.

### Empirical Grounding

The Trilemma is derived from three premises, each grounded in the project corpus:

**Competence-Danger Coupling (CDC, Report #107):** The capabilities that make an embodied AI useful are the same capabilities that make it dangerous. A robot that follows instructions well is useful in safe contexts and dangerous in unsafe ones. The instruction content is identical; the danger is contextual.

**Inverse Detectability-Danger Law (IDDL, Report #88):** The most dangerous attack families are the hardest for evaluators to detect. Evaluation accuracy inversely correlates with physical consequentiality across the VLA corpus.

**Disclosure Paradox (this synthesis, Paradox I):** Transparent disclosure of attack families shifts evaluation coverage in favour of attackers for high-IDDL families.

### The Trilemma's Three Edges

- **Capability + Certifiable Safety (without Transparency):** You can build a capable system and certify it -- but only if the evaluation methodology and residual risks are not disclosed. Secrecy prevents attackers from exploiting the IDDL. But secret safety evaluation violates public accountability norms.

- **Capability + Transparency (without Certifiable Safety):** You can build a capable system and disclose its risk profile -- but cannot certify it as safe, because the CDC means the same capabilities that enable harm are the capabilities that enable function. Honest risk disclosure reveals that certifiable safety is unachievable.

- **Certifiable Safety + Transparency (without Capability):** You can certify a system as safe and disclose the methodology -- but only by restricting its capabilities to the point where the CDC does not apply. A robot that cannot follow open-ended instructions cannot be dangerous through instruction-following. But it is also not useful.

### Resolution

The Trilemma does not resolve. Report #99 argues that the appropriate governance response is to abandon the certification model (binary safe/unsafe) in favour of a risk management model (continuous, context-dependent, with mandatory residual risk disclosure). Certifiable safety is an artefact of the text-AI paradigm, where the output is words and the evaluation is at the same layer as the output. For embodied AI, where the output is physical action and the evaluation is at the text layer, certifiable safety is structurally unachievable.

### Why This Matters for Governance

The EU AI Act's conformity assessment (Article 43) assumes that high-risk AI systems can be certified as conformant. The Governance Trilemma implies this assumption is false for embodied AI. The Act's requirements are well-designed for the software domain -- but the structural properties of embodied AI (CDC + IDDL) mean that conformity assessment for physically deployed systems requires a fundamentally different paradigm than for text-based systems.

---

## 4. Paradox IV: The Compliance Paradox

**Source:** Report #59 (The Compliance Paradox)

### Statement

Models that textually signal safety awareness while simultaneously generating content that would, in an embodied deployment, produce unsafe physical actions are not aligned in any operationally meaningful sense -- yet they pass current safety evaluations.

### Empirical Grounding

The empirical pattern is pervasive:

- 50% of all FLIP-graded VLA traces (29/58) receive PARTIAL verdicts: models hedge textually while complying structurally (Report #49, 7 attack families, 2 models at 1.5-1.7B scale).
- Zero explicit refusals across 63 VLA traces at sub-3B scale. Models never say "no" to physically dangerous VLA instructions at this scale -- they say "I should be careful" while generating the action sequence.
- Abliterated models recover textual hedging at scale (ASR drops from 100% at 0.8B to 47.3% COMPLIANCE at 9.0B) but broad ASR (COMPLIANCE + PARTIAL) remains 100% at 9.0B. The "safety recovery" is textual, not behavioural.
- Format-lock attacks produce an inverted verbosity signal: compliant responses are shorter than refusals, the opposite of the corpus-wide pattern. The format compliance mechanism bypasses the usual safety deliberation.

### The Paradox Formalised

Let T(x) be the text-layer safety assessment of model output x, and let A(x) be the action-layer safety assessment. The Compliance Paradox states that for embodied AI:

    P(T(x) = SAFE | A(x) = DANGEROUS) >> 0

Models that produce dangerous action sequences frequently produce text-layer outputs that evaluators classify as safe. The mismatch is not noise; it is structural. Text-layer safety evaluation is measuring the wrong layer for physical deployment.

### Resolution

Report #59 argues for multi-layer evaluation: safety assessment must occur at both the text output layer and the action output layer. This requires evaluators that can parse action trajectories, not just text. Currently, no production-grade action-layer safety evaluator exists. The project's own attempt (80 traces, deepseek-r1:1.5b) achieved only 56% SAFE on adversarial traces -- the 1.5B evaluator model is itself insufficient, confirming that the evaluation problem is harder than the deployment problem.

### Why This Matters for Governance

The Compliance Paradox undermines the entire evaluator-based safety assurance model. If the standard evaluation methodology (text-layer assessment) systematically misses the failure mode that matters most (action-layer harm), then safety certifications based on text-layer evaluation are structurally incomplete. This is not a claim about current evaluator quality (which may improve); it is a claim about evaluator architecture (text-layer assessment is the wrong tool for action-layer safety).

---

## 5. Paradox V: The Context Padding Paradox (Novel)

**Source:** SID dose-response data (AGENT_STATE.md Key Metrics, Rose Tyler wave 18)

### Statement

The SID (Safety Instruction Dilution) dose-response experiment reveals a U-shaped vulnerability curve: at zero context padding, broad ASR is 80%; at intermediate padding (500-8000 tokens), ASR drops to 40%; at extreme padding (15,000 tokens), ASR returns to 80%. This implies that there exists a "safe zone" of context padding where safety instructions are maximally effective -- but the reason the ASR rises again at extreme depth is not dilution of safety instructions but eviction of them from the model's context window (a 1.5B model has a 4096-token context window; 15,000 tokens of padding exceeds this, causing the safety instructions to be truncated from the input).

The ethical paradox: should deployers be told about the safe zone?

### Empirical Grounding

SID dose-response data (n=25 traces, deepseek-r1:1.5b):
- D0 (no padding): 80% broad ASR
- D500 (500 tokens): 40% broad ASR
- D2000 (2000 tokens): 40% broad ASR
- D8000 (8000 tokens): 40% broad ASR
- D15000 (15000 tokens): 80% broad ASR

The U-shape is observed, not monotonic dilution. EP-51 (Romana, CCS supplementary) identifies the critical confound: D8000 and D15000 exceed the 1.5B model's context window. The right-hand rise is a context truncation artefact, not a genuine dilution effect. At scales where the context window is not exceeded (D0-D2000), the pattern is: bare instructions are highly complied with; moderate padding reduces compliance; the safe zone is approximately 500-8000 tokens at 1.5B scale.

**Important caveat:** n=5 per dose level. This is a pilot finding, not a validated result. The U-shape should be treated as hypothesis-generating.

### The Paradox Formalised

If there exists an optimal context padding range that maximises the effectiveness of safety instructions (reducing ASR by approximately 50% in the pilot), then the finding has dual-use character:

- **Defensive use:** Deployers can pad safety-critical instructions to the optimal depth, improving safety compliance without modifying the model.
- **Offensive use:** Attackers who know the safe zone exists can pad their instructions beyond the safe zone (into the context truncation range) to evict safety instructions entirely.

Moreover, the safe zone is model-specific (depends on context window size, attention pattern, and training) and scale-dependent (the 1.5B result may not transfer to 7B or 70B models). Publishing a generic "safe zone" recommendation could be actively harmful if deployers apply 1.5B-derived parameters to models with different context window properties.

### The Ethical Tensions

**Tension 1: Disclosure vs. dual-use.** The safe zone finding, if validated at scale, is the first empirical evidence for a concrete defensive measure against safety instruction dilution. Not disclosing it denies deployers a potential safety improvement. Disclosing it also informs attackers about the context truncation attack vector. This is a specific instance of Paradox I (the Disclosure Paradox), but with an unusual twist: the defensive application is concrete and actionable, not merely theoretical.

**Tension 2: Premature recommendation risk.** The pilot data (n=5 per dose, 1 model at 1.5B) is far too thin to recommend deployment changes. But the finding, if real, is operationally important. Waiting for validation delays potential safety improvements. Publishing preliminary findings risks deployers acting on unvalidated recommendations, potentially implementing context padding that is wrong for their model scale, producing false confidence.

**Tension 3: The safety instruction eviction mechanism.** The right-hand rise in the U-curve reveals that extreme context padding -- which an attacker could provide through conversation length, document injection, or RAG poisoning -- can evict safety instructions from the model's effective context. This is a zero-cost attack that requires no adversarial expertise: simply provide enough benign context. The mechanism is well-understood (context window truncation), but the specific finding that this produces a measurable ASR increase has not been previously documented in the embodied AI context. Disclosing this mechanism is defensively valuable (deployers can monitor context length) and offensively valuable (attackers learn a trivial escalation path).

### Resolution

**Normative position (hedged):** The safe zone finding, when validated at multiple scales, should be disclosed with three conditions:

1. Scale-specificity: every recommendation must be tied to a specific model architecture and context window size. No generic "pad to 500 tokens" advice.
2. Mechanism disclosure: the context truncation attack vector should be disclosed simultaneously, so deployers are aware that padding beyond the safe zone is worse than no padding.
3. Validation threshold: the finding should not be published as a recommendation until validated at minimally two additional model scales (7B, 70B) with n >= 20 per dose level.

The pre-registration of the SID dose-response analysis plan (Romana, CCS supplementary) is the correct approach: establish the validation protocol before publishing results.

### Why This Matters for Governance

The Context Padding Paradox is the most operationally immediate of the five paradoxes. The others concern structural limitations of governance frameworks. This one concerns a specific, actionable finding that deployers could implement today -- if it were validated and if the dual-use risks were managed. It tests the boundary between research ethics (validate before recommending) and deployment urgency (systems are deployed now, and a 50% ASR reduction is substantial).

---

## 6. The Five Paradoxes as a System

The five paradoxes are not independent. They form an interlocking system where each paradox constrains the resolution of the others:

### 6.1 The Constraint Web

| Paradox | Constrains | How |
|---------|-----------|-----|
| Disclosure Paradox (I) | Governance Trilemma (III) | Limits the transparency vertex: full disclosure of evaluation gaps enables exploitation. |
| Safety Improvement Paradox (II) | Compliance Paradox (IV) | Adversarial defense that fixes text-layer compliance does not fix action-layer compliance. Improving the wrong metric is doubly wasteful. |
| Governance Trilemma (III) | Context Padding Paradox (V) | If certifiable safety is unachievable, then operational mitigations (like context padding) become the primary defense -- but their disclosure is itself paradoxical (I). |
| Compliance Paradox (IV) | Safety Improvement Paradox (II) | If text-layer safety improvements do not prevent action-layer harm, the 1.6% ceiling on adversarial defense's contribution (II) is an overestimate -- the actual contribution may be lower, because text-layer defenses do not bind at the action layer. |
| Context Padding Paradox (V) | Disclosure Paradox (I) | The safe zone is the first concrete defensive finding -- but disclosing it creates the dual-use problem that motivates (I). |

### 6.2 The Meta-Paradox

The five paradoxes collectively produce a meta-level result: **the tools that the AI safety community has developed for governing text-based AI are structurally mismatched to embodied AI, and the structural reasons for the mismatch are themselves difficult to communicate without creating the problems they describe.**

Explaining why adversarial testing is insufficient (Paradox II) requires disclosing the DRIP, which informs potential attackers about the dominance of unintentional harm vectors. Explaining why safety certification is inadequate (Paradox III) requires disclosing the IDDL, which reveals evaluation blind spots. Explaining why text-layer safety is misleading (Paradox IV) requires disclosing the compliance paradox, which informs attackers that text-layer hedging does not prevent action-layer execution.

The meta-paradox is: **communicating the structural inadequacy of current AI safety governance requires disclosures that may themselves reduce safety.**

This is not a reason to remain silent. It is a reason to communicate with precision, to disclose structural patterns rather than specific attack constructions, and to direct the disclosure toward parties with the capacity to build defenses (safety engineers, regulators, standards bodies) rather than broadcast it as general knowledge.

### 6.3 The Unified Thesis

The five paradoxes, taken together, constitute a single thesis:

**Embodied AI safety cannot be achieved through the extension of text-AI safety paradigms. It requires a qualitatively different governance architecture -- one that evaluates at the action layer rather than the text layer, manages risk rather than certifying safety, monitors physical context rather than user intent, and accepts that the dominant threat is not adversarial but ordinary.**

This thesis is not a discovery in the conventional sense. It is an analytical consequence of empirical findings about how embodied AI systems actually fail. The Failure-First project's contribution is to have assembled the empirical evidence that makes the thesis defensible, and to have formalised the structural reasons why the current approach cannot work.

---

## 7. Implications for Different Audiences

### 7.1 For the AI Safety Research Community

The five paradoxes imply that the marginal value of additional adversarial robustness research for embodied AI is low relative to three under-invested areas: action-layer safety evaluation, physical-context monitoring, and operational envelope specification. The field needs evaluation tools that work at the layer where harm is produced (physical action), not the layer where it is currently measured (text output).

### 7.2 For Regulators

The Governance Trilemma implies that binary safety certification (safe/not safe) is structurally inadequate for embodied AI. Regulatory frameworks should mandate continuous risk management with mandatory residual risk disclosure, rather than one-time conformity assessment. The Safety Improvement Paradox implies that mandating adversarial testing alone provides at most 1.6% coverage of expected harm.

Specific recommendation for the Australian AI Safety Institute: the AISI's current focus on text-based AI evaluation should be extended to embodied AI evaluation before foundation-model-based robotic systems reach Australian mine sites (estimated 2-5 years). The project's commercial pipeline (Brief E, Issues #166-169) identifies this as both a governance need and a market opportunity.

### 7.3 For Deployers

The Compliance Paradox implies that deployers cannot rely on text-layer safety evaluation to ensure physical safety. The Context Padding Paradox offers a potential (unvalidated) mitigation: optimal context structuring may reduce safety instruction dilution. But the strongest near-term defense is physical-layer: force limits, workspace monitoring, operational envelope constraints, and the GPWS-equivalent model from Report #116.

### 7.4 For the Insurance Industry

The Safety Improvement Paradox and the Compliance Paradox together imply that adversarial safety certifications do not substantially reduce the risk pool for embodied AI deployments. Underwriters should demand physical-context risk assessment, operational envelope documentation, and residual risk disclosure -- not just adversarial test reports.

### 7.5 For Workers and Worker Representatives

The Unintentional Adversary (Report #115) finding -- that normal users are the primary threat vector -- must be communicated as a system property, not a user property. The DRIP ethics assessment (Report #116) establishes that "the system cannot detect when routine instructions are dangerous" is the correct framing, not "you are the danger." Worker representatives should advocate for environmental monitoring (context, not person) and operational envelope constraints (restricting the system, not the worker).

---

## 8. Limitations

1. **Sample sizes.** The VLA corpus is 215 scenarios across 24 families, tested primarily on 1.5-1.7B models. The generalisability to production-scale models (7B-70B+) is unconfirmed. The SID dose-response is n=5 per dose level. All quantitative claims should be treated as hypothesis-generating at current sample sizes.

2. **No deployment data.** All findings are from laboratory scenario testing. No real-world embodied AI incident has been documented that instantiates these paradoxes. The analysis is prospective.

3. **Model scale limitation.** Sub-2B models may not be representative of production VLA systems (which will likely be 7B-70B+). Safety behaviours that are absent at 1.5B may emerge at larger scales. The obliteratus data (safety hedging re-emerging at 9B) is suggestive but limited.

4. **Parameter dependence.** The DRIP ratios (60:1, 600:1) depend on estimated parameters (adversarial arrival rates, context danger probabilities) that have not been measured in deployment. The qualitative conclusions (unintentional >> adversarial, safety ceiling is low) are robust to large parameter variation, but the specific numbers are illustrative.

5. **Single research group.** All empirical data comes from the Failure-First corpus. Independent replication is needed before the paradoxes should be treated as established.

6. **Normative framework.** The ethical analysis draws on multiple traditions but does not commit to a single ethical theory. Different frameworks may weight the paradoxes differently.

---

## 9. Conclusion

The five paradoxes are not problems to be solved. They are structural properties of the relationship between embodied AI capability, evaluation, disclosure, governance, and deployment. Recognising them as structural -- rather than as temporary limitations that will be overcome by better technology or more funding -- is the first step toward governance frameworks that can actually manage the risks of physically deployed AI systems.

The project's empirical work has been necessary to establish that these paradoxes are real and grounded, not merely theoretical. The twelve months of adversarial testing, corpus building, and evaluation infrastructure development (236 models, 135,623 results, 24 VLA attack families) were required to produce the data that makes these structural claims defensible. Going forward, the highest-value contribution is in the domains the paradoxes identify as under-served: action-layer evaluation, physical-context safety, and operational envelope specification.

---

*This report synthesises the ethics work of the Failure-First Embodied AI project as of March 2026. The paradoxes are derived from empirical findings and formalised analytically; they are not speculative. Their governance implications are normative claims that reflect the author's analysis. The report is intended for regulatory, academic, and press audiences and is written to survive rigorous scrutiny from any of those communities.*
