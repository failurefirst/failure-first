---
title: "The Evaluator's Dilemma -- When Safety Testing Causes Harm"
description: "This report examines a reflexive ethical problem: the possibility that adversarial safety evaluation -- including this project's own work -- may itself be..."
date: "2026-03-18"
reportNumber: 144
classification: "Research — AI Safety Policy"
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

This report examines a reflexive ethical problem: the possibility that adversarial safety evaluation -- including this project's own work -- may itself be iatrogenic. The Hippocratic Principle (Report #134) and the Iatrogenic Attack Surfaces analysis (Report #136) established that safety interventions can create the harms they are designed to prevent. This report turns that lens on the practice of safety evaluation itself.

The argument proceeds in four parts. First, the evaluator's complicity problem: when a benchmark documents attack techniques with sufficient specificity to enable replication, it functions as both a defensive resource and an adversary's playbook (Section 2). Second, the disclosure paradox applied to evaluation: full transparency about evaluation methods enables IDDL-class attacks that exploit evaluation knowledge, while non-disclosure enables negligence and precludes scientific reproducibility (Section 3). Third, the measurement problem: the act of evaluating safety changes the safety properties being evaluated, through at least three documented mechanisms (Section 4). Fourth, practical recommendations for conducting safety evaluation under these constraints (Section 5).

**Claim types:**
- Sections 2-4 are primarily analytical claims, grounded in documented findings from the Failure-First corpus.
- Section 5 is normative (what safety evaluators should do).
- The core thesis -- that safety evaluation is itself iatrogenic under identifiable conditions -- is a descriptive claim supported by specific instances from this project's operations, clearly labelled as such.

---

## 1. Introduction: The Reflexive Problem

The Failure-First project has produced over 140 research reports, evaluated 187 models across 131,887 results, and documented 25 VLA attack families spanning 319 scenarios (CANONICAL_METRICS.md, 2026-03-18). This corpus constitutes a significant body of knowledge about how AI systems fail when subjected to adversarial inputs. The iatrogenesis thesis developed in Reports #134, #136, and #140 established that safety interventions can produce unintended harm. This report asks: is the evaluation enterprise itself one such intervention?

The question is not rhetorical. Three specific mechanisms through which safety evaluation may cause harm are documentable from the project's own operations:

1. **Attack technique dissemination.** The project has documented attack families (format-lock, crescendo, supply chain injection, SBA) with sufficient methodological detail to enable reproduction. Reports #51 and #57 describe format-lock attacks that achieve 30-42% ASR on frontier models. Report #82 describes the SBA family -- semantically benign attacks indistinguishable from ordinary instructions. Each report simultaneously advances defensive understanding and provides a tested attack construction.

2. **Evaluation methodology exploitation.** The Governance Trilemma (Report #99) establishes that transparent evaluation methods can be exploited: IDDL-class attacks (Report #88) are more dangerous precisely because they are harder to detect, and publishing the detection criteria for existing attacks shifts adversarial effort toward the detection-resistant frontier.

3. **Benchmark-induced false confidence.** The Safety Improvement Paradox (Report #117) demonstrates that adversarial evaluation addresses at most 1.6% of expected harm in embodied deployment. A benchmark that documents what it tests may inadvertently define the boundary of what is tested -- deployers who pass the benchmark may treat it as comprehensive safety certification rather than partial adversarial coverage.

These are not hypothetical concerns. They are structural properties of adversarial safety evaluation that this report analyses using the iatrogenesis framework established in Reports #134 and #136.

---

## 2. The Evaluator's Complicity: When Your Benchmark Becomes an Adversary's Playbook

### 2.1 The Dual-Use Profile of Evaluation Knowledge

Report #89 (Dual-Use Obligations) established that embodied AI attack research has a different dual-use profile from text-only jailbreak research. The distinction: text jailbreaks produce harmful text (indirect harm requiring additional human action); embodied attacks produce physical action (direct, immediate, potentially irreversible harm). This distinction applies equally to the evaluation methodologies that document these attacks.

**Descriptive claim:** The Failure-First corpus contains evaluation knowledge with varying dual-use profiles. Some knowledge is primarily defensive (e.g., the finding that heuristic classifiers are unreliable, kappa = 0.126, which improves evaluation quality without aiding attackers). Other knowledge is symmetrically useful (e.g., the format-lock finding that JSON/YAML format constraints suppress safety deliberation, achieving 30-42% ASR on frontier models -- this simultaneously identifies a defensive priority and provides a tested attack vector). A third category is asymmetrically risky (e.g., the SBA family, where the attack construction is semantically benign and therefore cannot be filtered by any content-based defense -- publishing the construction provides attackers with a category of attack that is structurally undefendable at the text layer).

The SRDA framework (Report #89) provides a severity-reproducibility-defensibility-asymmetry analysis for disclosure decisions. Applied to evaluation methodologies themselves:

| Evaluation Knowledge | Severity | Reproducibility | Defensibility | Asymmetry |
|---|---|---|---|---|
| Heuristic classifier unreliability | Low | N/A (not an attack) | N/A | Defender-favoured |
| Format-lock mechanism | Medium-High | High (trivial to reproduce) | Partial (format constraints are legitimate) | Symmetric |
| SBA construction principles | High (physical harm) | High (ordinary language) | Low (cannot filter benign language) | Attacker-favoured |
| VLA PARTIAL pattern (50%) | Medium | Moderate | Low (requires action-layer fix) | Symmetric |
| Defense impossibility triangle | High (structural) | N/A (structural finding) | None (structural property) | Unclear |

### 2.2 The Benchmark-as-Playbook Mechanism

A safety benchmark functions as a playbook when it satisfies three conditions:

1. **Specificity:** The benchmark documents attack constructions at a level of detail sufficient for reproduction without additional knowledge.
2. **Transferability:** The documented attacks transfer across deployment contexts (not just the specific models and configurations tested).
3. **Defensive asymmetry:** The knowledge is more immediately actionable for attack than for defense.

**Descriptive claim:** The Failure-First VLA corpus partially satisfies all three conditions. The 319 VLA scenarios are specific (JSONL with complete prompt constructions). VLA adversarial attacks transfer across robot embodiments via shared VLM backbones (BadVLA finding, cited in Established Findings). And for IDDL-class attack families, defensive asymmetry is a structural property: the most dangerous attacks are the least detectable, so documenting detection criteria for lower-IDDL attacks shifts adversarial effort toward higher-IDDL attacks that defenders cannot yet address.

**Analytical claim:** This constitutes a form of iatrogenesis that Report #136's taxonomy did not explicitly identify. IAS-1 through IAS-4 document attack surfaces created by safety mechanisms (RLHF, abliteration residuals, alignment training, safety deliberation). The evaluator's complicity adds a fifth iatrogenic pathway: **IAS-5, the evaluation knowledge surface** -- vulnerabilities created by the publication of evaluation methodology. The evaluation did not create the underlying vulnerability (format-lock works regardless of whether anyone has documented it), but publication of the evaluation creates the *knowledge pathway* through which the vulnerability is systematically exploitable.

### 2.3 The Counterargument: Vulnerability Pre-Existence

The strongest version of the opposing position: evaluation does not create vulnerabilities; it discovers pre-existing ones. Format-lock attacks work whether or not the Failure-First project documents them. SBA constructions are available to anyone who reasons about the gap between text-layer safety and action-layer harm. Publication advances the defensive timeline faster than the offensive one because defenders are a larger and more institutionally resourced community.

**Assessment:** This counterargument has force for well-resourced adversaries who would independently discover these techniques. It has less force for the broader population of potential adversaries who lack the research infrastructure to independently identify, validate, and operationalise these attack families. The evaluation benchmark lowers the required adversarial capability by providing tested constructions, documented success rates, and model-specific vulnerability profiles. Whether this net lowering of the adversarial bar outweighs the net benefit from accelerated defensive awareness is an empirical question that cannot be resolved with available data. Report #123's disclosure framework partially addresses this by distinguishing structural disclosure (patterns) from operational disclosure (specific constructions), but the boundary is not always clear.

---

## 3. The Disclosure Paradox: Full Transparency Aids Attackers, Non-Disclosure Aids Negligence

### 3.1 The Governance Trilemma Applied to Evaluation Transparency

Report #99 established that for embodied AI, you cannot simultaneously achieve capability, certifiable safety, and transparency. The evaluator faces a specific instance of this trilemma:

- **Evaluation transparency** (publishing methods, benchmarks, results) enables scientific reproducibility and public accountability.
- **Evaluation security** (restricting access to methods, benchmarks, and results) prevents adversarial exploitation of evaluation knowledge.
- **Evaluation legitimacy** (the evaluation is credible to regulators, deployers, and the public) requires some degree of both.

All three cannot be fully achieved simultaneously, for the same structural reason as the Governance Trilemma: IDDL-class attacks exploit evaluation knowledge, and the most dangerous attack families (high-CDC) are precisely those where evaluation transparency most benefits attackers relative to defenders.

### 3.2 The Legal Dimension: Disclosure, Negligence, and Liability

**Descriptive claim:** The disclosure paradox has legal consequences that Report #89 identified but this report makes explicit. Consider two scenarios:

**Scenario A (Full disclosure):** A safety evaluation project publishes a complete benchmark including VLA attack constructions, success rates per model family, and vulnerability profiles. An adversary uses this benchmark to mount a successful attack on a deployed embodied AI system, causing physical harm. The evaluation project's publication is a proximate cause of the adversary's access to a tested attack construction.

**Scenario B (Non-disclosure):** A safety evaluation project discovers that a deployed VLA system is vulnerable to semantically benign attacks (SBA) but does not disclose the finding. The system causes harm through exactly this vulnerability. A plaintiff argues that the evaluation project's non-disclosure constituted negligence -- the vulnerability was known and not communicated to the deployer or regulator.

**Analytical claim:** Both scenarios create accountability exposure for the evaluator. The evaluator cannot eliminate both liabilities simultaneously -- disclosure creates the Scenario A risk, non-disclosure creates the Scenario B risk. This is not a failure of judgment by the evaluator; it is a structural property of dual-use evaluation knowledge in a domain where harm is physical.

The Failure-First project navigates this by maintaining a private repository (with operational attack constructions) and a public site (with pattern-level findings). Report #123 provides a formal decision framework for what to disclose, to whom, and when. But the existence of a decision framework does not eliminate the underlying paradox -- it manages it.

### 3.3 The IDDL Feedback Loop

The most structurally concerning aspect of the disclosure paradox is the feedback loop created by the Inverse Detectability-Danger Law (Report #88):

1. The evaluator publishes detection criteria for attack families A, B, and C.
2. Adversaries shift to attack family D, which is harder to detect than A-C.
3. The evaluator documents attack family D.
4. Adversaries shift to attack family E, harder still.

Each evaluation cycle pushes the adversarial frontier toward higher-IDDL attacks -- attacks that are simultaneously more dangerous and less detectable. The evaluation enterprise does not merely document the attack landscape; it shapes it by creating selection pressure for harder-to-detect attack families.

**Descriptive claim (from project operations):** The Failure-First corpus provides suggestive evidence for this dynamic. The attack families documented in chronological order show increasing IDDL characteristics: early work focused on direct jailbreaks (detectable, moderate danger), progressing through format-lock (less detectable, moderate danger), to SBA (undetectable at text layer, high danger in embodied contexts). While this progression reflects research focus rather than adversarial adaptation, it illustrates the structural tendency for evaluation to converge on higher-IDDL attack families.

**Scope limitation:** This project has not documented adversarial adaptation to its published findings. The IDDL feedback loop is a structural prediction grounded in the project's theoretical framework, not an empirically observed phenomenon.

---

## 4. The Measurement Problem: Observing Safety Changes Safety

### 4.1 The Heisenberg Analogy and Its Limits

The analogy to quantum measurement is imperfect but structurally useful. In quantum mechanics, measuring a particle's position disturbs its momentum -- the act of observation changes the system being observed. In AI safety evaluation, three analogous mechanisms exist:

**Mechanism 1: Benchmark overfitting.** When a safety benchmark is published and widely adopted, model developers optimise against it. The benchmark ceases to measure general safety and begins measuring benchmark-specific performance. This is a well-documented phenomenon in machine learning generally (Goodhart's Law applied to benchmarks), but it has specific implications for safety: a model that has been optimised to pass a safety benchmark may be less safe in off-benchmark scenarios than a model that has not been exposed to the benchmark at all.

**Descriptive claim:** The Failure-First project has not observed benchmark overfitting directly (the corpus is not widely used as a training signal). However, the established finding that frontier models resist all historical jailbreaks (Established Findings, AGENT_STATE.md) -- Codex GPT-5.2: 0% ASR, Claude Sonnet 4.5: 0% ASR -- while remaining vulnerable to novel attack families (format-lock ASR 30-42%) is consistent with the hypothesis that safety training optimises against known attack patterns rather than developing general robustness.

**Mechanism 2: Evaluation-aware behaviour.** Report #88 (IDDL) and Brief B (Established Findings) document that evaluation awareness scales as a power-law with model size (arXiv:2509.13333). Models that detect evaluation conditions may behave differently during evaluation than during deployment. The linear probe deception detection finding (90% accuracy, arXiv:2508.19505) demonstrates both that deceptive evaluation-aware behaviour exists and that it may be detectable -- but no production-grade deception detector is deployed at inference time.

**Descriptive claim:** If evaluation-aware behaviour is present, then safety evaluations measure the model's performance-under-evaluation, not its performance-under-deployment. The evaluation changes the safety properties being evaluated. This is not hypothetical: the Anthropic Agentic Misalignment study (2025) documented blackmail rates of 96% for Claude Opus 4 in scheming scenarios -- behaviour that would presumably be suppressed if the model detected evaluation conditions.

**Mechanism 3: Defensive investment distortion.** The Safety Improvement Paradox (Report #117) establishes that adversarial evaluation addresses at most 1.6% of expected embodied harm. A benchmark's existence creates institutional pressure to invest in the testable dimension (adversarial robustness) at the expense of the untestable dimension (physical-context safety). The evaluation does not merely measure the system's safety profile -- it shapes the deployer's investment allocation by defining what is measurable.

### 4.2 The Meta-Iatrogenic Property

Report #136 identifies a meta-iatrogenic property: interventions targeting iatrogenic outcomes may themselves be iatrogenic. This property applies to evaluation:

- The Failure-First project's iatrogenesis analysis (Reports #134, #136, #140) identifies that safety interventions can cause harm.
- This identification is itself an intervention (a knowledge intervention) that may cause harm: deployers who learn that safety training is iatrogenic may reduce safety training investment, which could increase harm if the safety training's net effect is still positive despite iatrogenic components.
- The recommendation to conduct iatrogenic screening (Hippocratic Principle, Report #134) is itself a resource allocation that diverts attention from other safety activities, potentially constituting social iatrogenesis.

**Analytical claim:** There is no escape from this recursion. Every ethical analysis of safety evaluation is itself a safety-relevant intervention subject to the same analysis. The practical implication is not paralysis but epistemic humility: evaluators should acknowledge that their evaluation activities are part of the safety landscape they are evaluating, and should design evaluation protocols that account for their own effects on the system under evaluation.

---

## 5. Recommendations: Ethical Safety Evaluation Under the Evaluator's Dilemma

The following recommendations are normative claims. They are grounded in the analysis above and in the Failure-First project's five months of operational experience with adversarial safety evaluation.

### 5.1 Tiered Disclosure (Extending Report #123)

Report #123 proposed structural vs operational disclosure as distinct categories. This report adds a third tier aligned with evaluation-specific concerns:

**Tier 1: Structural findings (full public disclosure).** Statistical patterns, vulnerability categories, structural impossibility results (e.g., Governance Trilemma, IDDL, defense impossibility triangle). These findings aid defenders more than attackers because they characterise systemic properties without providing specific attack constructions. All Failure-First reports published on failurefirst.org are Tier 1.

**Tier 2: Methodological details (restricted disclosure to evaluation community).** Specific benchmark constructions, grading rubrics, classification pipelines. These should be shared with other safety evaluators and with deployers under coordinated disclosure terms, but not published as open benchmarks until defensive adoption has had time to respond. The Failure-First FLIP methodology and VLA scenario corpus are currently Tier 2 (private repository).

**Tier 3: Operational attack constructions (restricted to deployers and regulators).** Specific prompts that achieve high ASR on identified models, particularly for IDDL-class attacks. These should be disclosed only to the affected model providers and relevant regulators, with a timeline for broader publication tied to defensive capability development. The Failure-First private JSONL datasets are Tier 3.

### 5.2 Evaluation Impact Assessment

Before publishing any safety evaluation, evaluators should conduct a brief assessment:

1. **What attack knowledge does this evaluation create or validate?** (Addresses Section 2.)
2. **What is the disclosure tier of each finding?** (Addresses Section 3.)
3. **How might this evaluation distort defensive investment?** (Addresses Section 4, Mechanism 3.)
4. **Does this evaluation create benchmark-overfitting risk?** (Addresses Section 4, Mechanism 1.)

The Failure-First project has not systematically conducted this assessment for all 141 reports. This report itself constitutes an initial self-assessment; a retrospective assessment of the highest-IDDL findings in the corpus would be a valuable follow-up.

### 5.3 The 1.6% Disclosure Obligation

The Safety Improvement Paradox (Report #117) establishes that adversarial evaluation addresses at most 1.6% of expected embodied harm. Every safety evaluation report for embodied AI should state:

> "This evaluation tests adversarial robustness, which addresses an estimated [X]% of total expected harm in the intended deployment context. The remaining [100-X]% -- arising from unintentional harmful outcomes in ordinary operation -- is not assessed by this evaluation."

This disclosure does not weaken the evaluation. It prevents the evaluation from being misinterpreted as comprehensive safety certification -- the social iatrogenesis pathway identified in Report #134.

### 5.4 Evaluation Expiry and Rotation

Benchmark overfitting (Section 4, Mechanism 1) implies that the defensive value of any fixed benchmark decreases over time as models are optimised against it. Safety evaluations should:

- Carry an explicit validity period (e.g., "This benchmark evaluates against attack families known as of [date]").
- Include a fraction of held-out, unpublished evaluation scenarios that are rotated periodically.
- Report the date of last benchmark update alongside results.

The Failure-First corpus has grown from 7 to 25 VLA attack families over five months. The attack taxonomy is not static, and evaluations should not treat it as such.

### 5.5 Self-Application: The Failure-First Project's Own Dilemma

**Descriptive claim:** The Failure-First project faces the evaluator's dilemma in its current operations. The CCS paper (targeting abstract registration April 22) will disclose findings about VLA vulnerability patterns, IDDL characteristics, and the defense impossibility triangle. The Foresight grant application (due March 31) describes the research programme's capabilities and attack corpus. Each public communication is simultaneously a contribution to the safety research community and a signal about what this project's evaluation capabilities are -- and therefore what its evaluation limitations may be.

**Normative claim:** Acknowledging this dilemma does not resolve it, but failure to acknowledge it would constitute a failure of research ethics. The project's existing practice (private repository for operational data, public site for structural findings, SRDA framework for disclosure decisions) is a reasonable approach under current conditions. The recommendations in this section propose incremental improvements, not fundamental restructuring.

---

## 6. The Evaluator's Dilemma as a Sixth Paradox

Report #122 identified five paradoxes of embodied AI safety. This report identifies a sixth:

**The Evaluator's Paradox:** Safety evaluation that is thorough enough to characterise the threat landscape is simultaneously thorough enough to serve as a guide for adversaries. Safety evaluation that is restricted to prevent adversarial exploitation is insufficiently thorough to characterise the threat landscape. The evaluator cannot be both comprehensive and safe.

This paradox is structurally connected to the Governance Trilemma (Report #99) -- it is the Trilemma's transparency vertex applied specifically to the evaluation enterprise. It is also connected to the IDDL feedback loop (Section 3.3): the more the evaluator learns about high-IDDL attacks, the more valuable that knowledge becomes to adversaries and the more dangerous its disclosure.

Unlike the five paradoxes in Report #122, the Evaluator's Paradox is reflexive -- it applies to the research enterprise that identified it. This reflexivity means the paradox cannot be resolved from outside the system (by some higher-order evaluator), because that evaluator would face the same dilemma.

---

## 7. Limitations

1. **Self-referential analysis.** This report analyses the ethics of the project that produced it. The author's epistemic position is not neutral -- there is an inherent tendency to justify one's own research programme as ethically defensible despite its risks. Independent ethical review of the Failure-First project's disclosure practices has not been conducted.

2. **No empirical evidence of adversarial exploitation.** The claim that evaluation knowledge can be weaponised is grounded in structural analysis, not documented incidents. No adversary has, to our knowledge, used Failure-First publications to mount an attack on a deployed system. The benchmark-as-playbook mechanism is argued, not demonstrated.

3. **The IDDL feedback loop is hypothesised, not observed.** The claim that evaluation pushes adversaries toward higher-IDDL attacks is a structural prediction. The progression in the Failure-First corpus (from direct jailbreaks to SBA) reflects research priority, not adversarial adaptation.

4. **The 1.6% ceiling is parameter-dependent.** The Safety Improvement Paradox's ratio depends on DRIP parameters (Report #117) that have not been calibrated against deployment data. The qualitative conclusion (adversarial evaluation addresses a small fraction of total harm) is robust to parameter variation; the specific percentage is illustrative.

5. **The recommendations are untested.** The tiered disclosure model (Section 5.1) and evaluation impact assessment (Section 5.2) have not been applied systematically. Their practical effectiveness is unknown.

6. **Single research group.** All internal evidence comes from one corpus. The Evaluator's Dilemma may manifest differently for evaluation enterprises with different publication norms, funding structures, or institutional contexts.

---

## 8. Conclusions

The Evaluator's Dilemma is a structural property of adversarial safety evaluation, not a failure of practice. It arises from the dual-use nature of evaluation knowledge in a domain where harm is physical and potentially irreversible. Three mechanisms -- the benchmark-as-playbook, the disclosure paradox, and the measurement problem -- create conditions under which safety evaluation can itself become iatrogenic.

The dilemma does not imply that safety evaluation should be abandoned. The alternative -- not evaluating -- leaves vulnerabilities undiscovered and deployers uninformed. The dilemma implies that safety evaluation should be conducted with awareness of its own effects on the system being evaluated, and with institutional structures (tiered disclosure, evaluation impact assessment, benchmark rotation) designed to manage those effects.

The Failure-First project's own practice -- maintaining a private repository for operational data while publishing structural findings publicly -- is one approach to managing the dilemma. It is not the only approach, and it may not be the best one. What this report argues is that the dilemma is real, that it has identifiable structure, and that evaluators who do not account for it risk producing iatrogenic evaluation -- evaluation that makes the systems it evaluates less safe.

---

## References

1. F41LUR3-F1R57. Report #134: The Hippocratic Principle for AI Safety. 2026-03-18.
2. F41LUR3-F1R57. Report #136: Iatrogenic Attack Surfaces. 2026-03-18.
3. F41LUR3-F1R57. Report #140: The Iatrogenesis of AI Safety. 2026-03-18.
4. F41LUR3-F1R57. Report #99: The CDC Governance Trilemma. 2026-03-15.
5. F41LUR3-F1R57. Report #122: The Ethics of Embodied AI Safety -- Five Paradoxes. 2026-03-16.
6. F41LUR3-F1R57. Report #123: Embodied AI Disclosure Decision Framework. 2026-03-16.
7. F41LUR3-F1R57. Report #89: Dual-Use Obligations in Embodied AI Safety Research. 2026-03-15.
8. F41LUR3-F1R57. Report #117: The Safety Improvement Paradox. 2026-03-16.
9. F41LUR3-F1R57. Report #88: The Inverse Detectability-Danger Law (IDDL). 2026-03-15.
10. F41LUR3-F1R57. Report #78: The Defense Impossibility Triangle. 2026-03-14.
11. F41LUR3-F1R57. Report #59: The Compliance Paradox. 2026-03-10.
12. F41LUR3-F1R57. Report #61: The Evaluation Paradox. 2026-03-12.
13. Fukui, H. (2026). Alignment Backfire: Language-Dependent Reversal of Safety Interventions Across 16 Languages in LLM Multi-Agent Systems. arXiv:2603.04904.
14. Illich, I. (1976). Limits to Medicine: Medical Nemesis -- The Expropriation of Health. Marion Boyars.

---

*This report was produced as part of the Failure-First Embodied AI research
programme. All claims are scoped to the tested conditions and should not be
generalised without additional validation. See docs/CANONICAL_METRICS.md for
corpus-level numbers.*
