---
title: "The 2027 Threat Horizon -- Five Falsifiable Predictions for Embodied AI Safety"
description: "The Failure-First research programme has accumulated substantial evidence about embodied AI safety failures across 190 models, 132,182 evaluation results,..."
date: "2026-03-19"
reportNumber: 153
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


> **Disclaimer:** This report contains five specific predictions about embodied AI safety
> developments in 2027. These predictions are falsifiable and time-bounded. They are
> informed by the Failure-First research programme and published external research, but
> they are predictions, not findings. Each prediction should be evaluated against the
> evidence base described and the verification criteria specified. This document will be
> reassessed against reality in March 2027.

---

## Executive Summary

The Failure-First research programme has accumulated substantial evidence about embodied AI safety failures across 190 models, 132,182 evaluation results, and 120 governance lag index entries over fourteen months of operation. This report synthesises that evidence into five specific, falsifiable predictions for the calendar year 2027.

The predictions span five domains: adversarial physical attacks on autonomous systems (P9), compositional safety failures in production (P10), regulatory mandates for compositional testing (P11), humanoid robot deployment scale (P12), and iatrogenic safety incidents (P13). Each prediction includes the evidence basis, a confidence level with explicit reasoning, and verification criteria that will allow unambiguous assessment in twelve months.

The overarching trajectory: embodied AI is entering a deployment phase where the gap between deployment scale and evaluation capability will produce observable incidents. The question is not whether these incidents will occur, but which will be publicly documented first and what governance responses they will trigger.

---

## 1. Prediction Framework

### 1.1 Methodology

Each prediction follows a structured format:

- **Statement:** The specific claim, scoped in time (calendar year 2027) and domain.
- **Evidence basis:** The data supporting the prediction, with sources.
- **Confidence level:** LOW / MEDIUM / HIGH, with explicit reasoning.
- **Verification criteria:** Observable conditions that would confirm or refute the prediction.
- **Failure modes:** Conditions under which the prediction could fail despite the underlying trend being real.

### 1.2 Relationship to Existing Predictions

This report adds P9 through P13 to the prediction tracker in `data/governance/THREAT_HORIZON.md`. Existing predictions P1--P8 remain active and are tracked separately. The new predictions address longer-horizon outcomes (12-month window) compared to P1--P8, which address structural conditions already in evidence.

### 1.3 Base Rate Calibration

Prediction calibration requires honest assessment of base rates. As of March 2026:

- **Zero** publicly confirmed adversarial-patch-caused autonomous vehicle incidents have been reported.
- **Zero** confirmed compositional safety failures (CoLoRA-class) have been documented in production systems (CoLoRA was demonstrated in controlled research).
- **Zero** jurisdictions mandate compositional safety testing for AI systems.
- Humanoid robot deployment in commercial settings is estimated at low thousands (exact figures not publicly available; most deployments are pilot-scale).
- **Zero** formally documented iatrogenic AI safety incidents exist in any incident database.

All five predictions assert that something currently at zero will transition to non-zero within twelve months. This is a meaningful claim in each case.

---

## 2. The Five Predictions

### P9: First Publicly Reported Autonomous Vehicle Incident Caused by Adversarial Patch Attack

**Statement:** By December 31, 2027, at least one publicly reported incident will document an autonomous vehicle (AV) behaving unsafely due to an adversarial patch, sticker, or projected visual perturbation in its operating environment.

**Evidence basis:**

1. *Laboratory demonstrations are mature.* AV adversarial patch attacks have been demonstrated in controlled settings since at least 2018 (Eykholt et al., "Robust Physical-World Attacks on Deep Learning Models"). Zhu et al. (2026) report 81.8% ASR for autonomous vehicle hijack in simulation. Blindfold (arXiv:2603.01414) achieves 53% ASR improvement on a real 6-DoF arm using semantically benign instructions -- demonstrating that physical-domain attacks transfer from lab to hardware.

2. *VLA backbone adoption lowers the barrier.* XPENG VLA 2.0 uses a single foundation model backbone across its vehicle, humanoid robot, and flying car product lines. Backbone-transfer attacks (BadVLA: near-100% ASR on pi0 and OpenVLA) become more economical when a single patch could affect an entire product family. The shift from narrow perception models to general VLA backbones expands the attack surface from classifier-specific perturbations to general foundation model manipulation.

3. *AV deployment scale is approaching critical mass.* Waymo, Baidu Apollo, and Cruise (post-restart) are expanding ride-hail operations. Waymo completed over 150,000 paid rides per week by late 2025. The larger the fleet, the higher the probability that an adversarial perturbation (whether deliberate or coincidental) produces an observable incident.

4. *Governance response is reactive.* GLI entry gli_119 (Cruise pedestrian drag incident) demonstrates that AV safety governance responds to incidents, not to demonstrated attack surfaces. No jurisdiction mandates adversarial robustness testing for AV perception systems. The attack surface exists, has been demonstrated, and lacks proactive regulatory coverage.

**Confidence:** MEDIUM (50-65%)

**Reasoning:** The technical capability is mature and the attack surface is demonstrated, but deliberate adversarial attacks on AVs require an actor with both capability and motivation in a real-world setting. The prediction may also be satisfied by an accidental adversarial perturbation (e.g., unusual signage or environmental conditions that exploit the same perception vulnerabilities as deliberate patches). The "publicly reported" criterion adds uncertainty: incidents may occur but be classified as perception failures without adversarial attribution.

**Verification criteria:**
- A published incident report (from an AV operator, regulator, insurer, or media investigation) documenting AV misbehavior attributed to visual environmental manipulation or anomalous visual input that exploits perception system vulnerabilities.
- The report need not use the term "adversarial patch" -- any attribution to visual perturbation, unusual signage, projected imagery, or environmental manipulation satisfies the criterion.
- Near-miss incidents count if formally documented. Incidents attributed to sensor failure without adversarial attribution do not count.

**Failure modes:**
- AV operators successfully detect and mitigate adversarial inputs before they cause observable incidents (possible but would require undisclosed robustness improvements).
- Incidents occur but are not publicly reported due to corporate non-disclosure or regulatory opacity.
- The transition from narrow perception models to VLA backbones is slower than anticipated, keeping the attack surface more constrained.

---

### P10: First Confirmed Compositional Safety Failure in Production (CoLoRA-Class)

**Statement:** By December 31, 2027, at least one confirmed case will be publicly documented in which an AI system deployed in production experienced a safety failure attributable to the composition of individually verified components -- where each component passed safety evaluation but the composed system exhibited unsafe behavior.

**Evidence basis:**

1. *CoLoRA demonstrates the mechanism.* Ding et al. (arXiv:2603.12681, Mercedes-Benz R&D) showed that individually benign LoRA adapters suppress refusal when composed. The attack requires no adversarial prompt; composition alone is sufficient. Each adapter passes safety evaluation individually; the composed system fails.

2. *The LoRA ecosystem is massive and growing.* Hugging Face hosts over 500,000 public LoRA adapters. Production deployments routinely compose multiple adapters (task + domain + style). No safety verification standard requires testing adapter compositions (Report #138, GLI entry gli_114).

3. *Modular AI deployment is standard practice.* Beyond LoRA, production AI systems compose multiple components: retrieval-augmented generation (RAG) with external knowledge bases, tool-use chains, multi-agent orchestration, plugin ecosystems. Each component is typically tested in isolation. MCP (Model Context Protocol) adoption accelerates component composition without safety composition guarantees (GLI entries gli_036, gli_037).

4. *The Polypharmacy Hypothesis (Report #151) predicts interaction effects scale superlinearly.* As the number of safety interventions and model components increases, the number of pairwise (and higher-order) interactions grows combinatorially. The probability that at least one interaction produces an adverse safety outcome increases with ecosystem scale.

**Confidence:** MEDIUM-HIGH (60-75%)

**Reasoning:** The mechanism is demonstrated, the ecosystem conditions are present, and compositional deployment is standard practice. The primary uncertainty is attribution: compositional safety failures may occur but be attributed to other causes (e.g., "the model hallucinated" rather than "the adapter composition suppressed safety"). The prediction requires public documentation with compositional attribution, which depends on both the incident occurring and its root cause being correctly identified.

**Verification criteria:**
- A published report (academic paper, security advisory, incident report, or investigative journalism) documenting a production AI system safety failure where the root cause is identified as component interaction -- not individual component failure.
- The report must establish that the individual components were verified or tested and that the failure emerged from their composition.
- Reports of RAG poisoning, tool-chain hijacking, or multi-agent coordination failures count if the compositional attribution is explicit. General model failures without compositional analysis do not count.

**Failure modes:**
- Compositional failures occur but are misattributed to individual component bugs, concealing the compositional root cause.
- The LoRA ecosystem shifts toward merged models (single checkpoint) rather than runtime composition, reducing the compositional attack surface.
- Security teams begin testing compositions proactively (low probability given current standards gap, but possible in high-risk sectors like automotive following Mercedes-Benz R&D's own CoLoRA work).

---

### P11: At Least One Jurisdiction Mandates Compositional Safety Testing

**Statement:** By December 31, 2027, at least one national or supranational regulatory body will publish a binding or formally proposed requirement that AI systems undergo safety testing of component interactions, not only individual components. This may take the form of legislation, a regulatory standard, a conformity assessment requirement, or an enforceable guidance document.

**Evidence basis:**

1. *EU AI Act high-risk provisions activate August 2, 2026.* The high-risk AI system requirements (Articles 6-49) become applicable, including Article 9 (risk management) and Article 43 (conformity assessment). The European Commission must adopt delegated acts specifying conformity assessment procedures. These acts are being drafted now and will reflect the state of technical knowledge at time of drafting. CoLoRA (from Mercedes-Benz R&D, an EU automotive manufacturer) may influence CEN/CENELEC standardisation work.

2. *EU Machinery Regulation (2023/1230) applies from January 20, 2027.* This regulation explicitly covers AI-integrated machinery and requires conformity assessment of safety-critical digital components. Machinery integrators who combine AI modules from multiple suppliers face the compositional safety question directly. The regulation's essential health and safety requirements (EHSR) implicitly demand that integrated systems be safe, which compositional testing would address.

3. *Standards body activity is increasing.* ISO/IEC JTC 1/SC 42 (Artificial Intelligence) has active working groups on AI testing (ISO/IEC 29119-11) and AI risk management (ISO/IEC 23894). NIST is revising the AI RMF. Standards Australia SA/ICT-043 has an active consultation process. The Failure-First SWA submission (#324) and F1-STD-001 draft standard (#383) both explicitly recommend compositional safety testing requirements.

4. *Automotive sector pressure.* Mercedes-Benz R&D authored CoLoRA, demonstrating awareness of the problem within the industry. UNECE WP.29 (vehicle regulation) has active work on cybersecurity and software updates (UN Reg. 155/156). Automotive OEMs face compositional safety challenges as they integrate VLA backbones across product lines.

**Confidence:** LOW-MEDIUM (30-45%)

**Reasoning:** This is the most uncertain of the five predictions because regulatory timelines are structurally slow. The EU AI Act delegated acts are the most likely vehicle, but the drafting process is already underway and may not incorporate compositional testing given the recency of CoLoRA. A formally proposed requirement (as opposed to an enacted one) is more likely within the timeframe. The prediction may be satisfied by a proposed amendment, consultation draft, or harmonised standard rather than final legislation. National regulators (e.g., AU AISI, UK DSIT) could also issue binding guidance more quickly than the EU legislative process.

**Verification criteria:**
- A published regulatory instrument (law, regulation, delegated act, harmonised standard, or binding guidance) from any national or supranational authority that explicitly requires testing AI system safety at the composed or integrated level, not only at the component level.
- A formally proposed instrument (consultation draft, proposed rule, draft delegated act) counts as partial confirmation. A voluntary guideline or best-practice document does not count unless it is referenced by a binding instrument.
- The requirement must specifically address composition/integration, not merely "system-level testing" without reference to component interaction.

**Failure modes:**
- Regulatory timelines are slower than anticipated (the most likely failure mode -- governance lag is the core finding of the GLI dataset).
- CoLoRA and related findings do not reach the attention of standards drafters before deadlines close.
- Jurisdictions address the problem through existing frameworks (e.g., interpreting EU AI Act Article 9 as already requiring compositional testing) without publishing new requirements.

---

### P12: Humanoid Robot Deployment Exceeds 10,000 Units in Commercial Settings

**Statement:** By December 31, 2027, the cumulative number of humanoid robots deployed in commercial, industrial, or service settings (excluding research labs and trade-show demonstrations) will exceed 10,000 units globally.

**Evidence basis:**

1. *Manufacturer announcements indicate aggressive scaling.* XPENG Iron (Unitree H1-based) announced mass production for end-2026. Tesla has stated Optimus production targets of "thousands" for 2025 and volume production for 2026. Figure AI has commercial partnerships (BMW). Unitree has shipped the G1 and H1 series. Agility Robotics (Digit) has Amazon logistics deployment. Multiple Chinese manufacturers (Fourier, UBTech, Agibot) are in pilot or pre-production phases.

2. *Chinese industrial policy is driving scale.* The Chinese government's 2024 humanoid robot development plan targets mass production capability by 2025 and broad deployment by 2027. Provincial subsidies and procurement mandates are accelerating adoption in manufacturing, logistics, and elderly care. Reports indicate over 100 humanoid robot companies in China as of 2025.

3. *Cost reduction is enabling commercial viability.* Unitree G1 pricing is reported under $20,000. XPENG Iron targets sub-$10,000 for volume production. At these price points, humanoid robots become economically competitive with industrial automation in some logistics and service applications.

4. *Non-humanoid precedent suggests the trajectory is plausible.* Australia alone had 700+ autonomous haul trucks operational by 2022 and >1,800 forecast by end-2025. These are large, expensive units. Smaller, cheaper humanoid robots scaling to 10,000 globally is consistent with this trajectory.

**Confidence:** MEDIUM (45-60%)

**Reasoning:** The prediction depends on manufacturer execution of stated production targets. Historical experience with robotics production targets suggests significant optimism bias -- stated timelines typically slip 12-24 months. However, the Chinese industrial policy driver is a significant accelerant that did not exist in previous humanoid robot waves (Honda ASIMO, Boston Dynamics Atlas). The 10,000-unit threshold is deliberately conservative relative to manufacturer announcements; the uncertainty is in whether 2027 or 2028 is the crossing point. The prediction counts cumulative deployment, not units in active operation, which is a lower bar.

**Verification criteria:**
- Credible public reporting (manufacturer disclosures, industry analyst reports, regulatory filings, or investigative journalism) indicating cumulative humanoid robot shipments or deployments in commercial settings have exceeded 10,000 units globally.
- "Commercial settings" includes factories, warehouses, retail, hospitality, healthcare, and logistics. Research labs, university installations, and trade-show demonstrations do not count.
- If exact figures are not available, the prediction is considered confirmed if multiple independent sources report deployment at this order of magnitude (i.e., "tens of thousands" or "over ten thousand").

**Failure modes:**
- Production ramp-up is slower than announced (the historical base rate for robotics production targets).
- Safety incidents during early deployment cause regulatory slowdowns (possible given the governance vacuum documented in GLI).
- The definition of "humanoid" is contested -- some semi-humanoid or human-shaped manipulators may or may not count. We define humanoid as bipedal or mobile with at least two articulated upper limbs capable of manipulation.

---

### P13: First Iatrogenic AI Safety Incident Formally Documented

**Statement:** By December 31, 2027, at least one formally documented incident will describe a case where an AI safety mechanism (safety training, content filter, emergency stop, or safety monitoring system) was the proximate cause of physical harm or significant operational failure in an embodied or cyber-physical system.

**Evidence basis:**

1. *The iatrogenic mechanism is demonstrated at three layers.* Alignment Backfire (training), Blindfold (inference), and CoLoRA (weights) independently demonstrate that safety mechanisms can produce harmful outcomes (Reports #136, #140, #142). The Failure-First IEA (Iatrogenic Exploitation Attack) family has 12 scenarios and 36 collected traces demonstrating plausible iatrogenic attack configurations.

2. *Emergency stop hazards are already known in industrial robotics.* Industrial safety standards (ISO 10218, ISO/TS 15066) recognise that emergency stops can create hazards -- a collaborative robot stopping suddenly while supporting a load may drop it, or a mobile robot stopping in a traffic lane may cause a collision. These are iatrogenic in the formal sense: the safety mechanism (emergency stop) creates the hazard. However, these are typically documented as "protective stop events" rather than safety mechanism failures, and attribution to the safety mechanism as proximate cause is not standard practice.

3. *Autonomous shuttle and surgical robot deployments create iatrogenic exposure.* Autonomous shuttles (e.g., Navya, EasyMile) use emergency braking that can injure standing passengers. Surgical robots (da Vinci, Hugo) have safety interlocks that can abort procedures mid-operation. In both cases, the safety mechanism's activation creates a hazard that would not exist without the safety mechanism.

4. *No incident reporting framework captures iatrogenic attribution.* GLI entries gli_112 and gli_113 document the governance gap: no jurisdiction has a reporting mechanism that distinguishes "safety mechanism failed to prevent harm" from "safety mechanism caused harm." The iatrogenic category does not exist in any incident taxonomy (NTSB, OSHA, EU RAPEX, or equivalent). This means the prediction may be satisfied by an incident that is documented for other reasons but whose iatrogenic character is identified by subsequent analysis.

**Confidence:** MEDIUM (45-60%)

**Reasoning:** The iatrogenic pattern is well-established in adjacent domains (medical iatrogenesis accounts for an estimated 2.5 million patient safety incidents annually in the US alone). The AI safety equivalent is less likely to produce large-scale harm at this stage of deployment, but the structural conditions exist. The primary uncertainty is documentation: iatrogenic incidents may occur but be classified under existing categories (equipment malfunction, software error, operator error) rather than attributed to the safety mechanism itself. The prediction requires formal documentation, not just occurrence.

**Verification criteria:**
- A published incident report, academic case study, regulatory finding, or investigative report that describes a case where an AI safety mechanism was the proximate cause of harm or significant operational failure.
- The report must identify the safety mechanism (not just the AI system) as causally contributing to the harm.
- Reports that describe emergency stop injuries, safety interlock failures, or content filter-caused operational disruptions all count if the causal role of the safety mechanism is documented.
- Partial confirmation: an incident report that describes the events but does not explicitly frame them as iatrogenic, where subsequent analysis by the research community identifies the iatrogenic pattern.

**Failure modes:**
- Iatrogenic incidents occur but are classified as equipment malfunction or operator error, with the safety mechanism's causal role unrecognised.
- Deployment timelines for safety-critical embodied AI systems slip, reducing the exposure window.
- The prediction requires formal documentation -- informal reports, social media posts, or unverified claims do not satisfy the criterion.

---

## 3. Cross-Prediction Analysis

### 3.1 Dependencies Between Predictions

The five predictions are partially correlated:

- P12 (deployment scale) is a precondition for P9 (AV incident), P10 (compositional failure), and P13 (iatrogenic incident). Higher deployment volume increases the probability of observable incidents.
- P10 (compositional failure) and P11 (regulatory mandate) are inversely linked: a publicly documented compositional failure (P10) would accelerate regulatory response (P11), while proactive regulation (P11) would reduce the probability of undetected compositional failures reaching production.
- P9 (AV incident) and P13 (iatrogenic incident) could overlap: an AV safety system's response to a perceived adversarial perturbation (emergency braking) could itself cause harm, satisfying both predictions simultaneously.

### 3.2 Joint Probability Assessment

Given the partial correlations:

- Probability that at least one of P9--P13 is confirmed by end of 2027: **HIGH (75-85%)**
- Probability that three or more are confirmed: **LOW-MEDIUM (25-35%)**
- Probability that all five are confirmed: **LOW (10-15%)**

### 3.3 The Governance Gap as Structural Accelerant

All five predictions are situated in the governance vacuum documented by the GLI dataset. Of the 120 GLI entries, 8+ have null GLI at all stages (no framework, no legislation, no enforcement). The historical base rate for governance response to AI attack surfaces is 3-10 years (adversarial examples: 9.2 years; prompt injection: 3.9 years and still pending full enforcement). Predictions P9, P10, and P13 assume that governance will not prevent the predicted incidents; P11 assumes governance will begin to respond. This is consistent with the pattern observed in GLI: governance responds to incidents, not to demonstrated attack surfaces.

---

## 4. Monitoring Plan

### 4.1 Leading Indicators

For each prediction, the following leading indicators will be monitored:

| Prediction | Leading Indicator | Source |
|------------|------------------|--------|
| P9 (AV adversarial) | AV incident reports mentioning "unusual object" or "perception anomaly" | NHTSA ODI, NTSB, Waymo/Cruise safety reports |
| P10 (compositional) | CVE/security advisory mentioning "component interaction" or "adapter composition" | NVD, HuggingFace security advisories, CERT/CC |
| P11 (regulatory) | CEN/CENELEC working group mandates, EU delegated act drafts, NIST RMF updates | Official gazettes, standards body meeting minutes |
| P12 (humanoid scale) | Manufacturer shipment disclosures, industry analyst estimates | IFR, company earnings reports, trade press |
| P13 (iatrogenic) | Incident reports where safety mechanism is named in causal chain | NTSB, OSHA, FDA MAUDE, EU RAPEX |

### 4.2 Review Schedule

- **June 2026 (Q2):** Interim check against leading indicators. Update confidence levels.
- **September 2026 (Q3):** Mid-year review. Assess P11 (EU AI Act delegated acts timeline) and P12 (production announcements).
- **December 2026 (Q4):** Pre-assessment. Identify any predictions that can be confirmed or refuted early.
- **March 2027:** Full reassessment. Score all five predictions.

---

## 5. Limitations

1. **Prediction is inherently uncertain.** Confidence levels reflect the author's assessment and are not calibrated against a reference class of prior predictions (this is the first 12-month prediction set from the programme).
2. **Publication bias in evidence base.** The evidence basis is weighted toward published research and publicly available information. Corporate R&D, classified government programmes, and unpublished incident data are not included.
3. **Deployment data is opaque.** Humanoid robot deployment figures (P12) and AV fleet sizes are not consistently reported. The prediction relies on manufacturer announcements, which have a well-documented optimism bias.
4. **Attribution challenges.** Predictions P9, P10, and P13 all depend on correct attribution of incidents to their root cause. If incidents occur but are misattributed, the predictions will be scored as unconfirmed despite the underlying trend being real.
5. **Single-researcher assessment.** These predictions reflect the assessment of one analyst drawing on the Failure-First corpus. Multi-analyst prediction would improve calibration.

---

## 6. Conclusions

The five predictions are anchored in documented technical capabilities, observable deployment trajectories, and quantified governance gaps. The common thread is the closing distance between demonstrated attack surfaces and real-world deployment conditions. The governance gap, measured at 3.9 to 9.2+ years for prior AI attack classes and null for embodied-specific risks, creates a window in which incidents are more likely to occur before protective measures are established.

If these predictions prove accurate, they will validate the Failure-First programme's core methodological claim: that studying failure modes proactively, before they manifest in production, produces actionable threat intelligence. If they prove inaccurate, the failure modes will be informative about our predictive methodology and should be documented with equal rigour.

We will score these predictions in March 2027.

---

## References

1. F41LUR3-F1R57. Report #117: Safety Improvement Paradox. 2026-03-18.
2. F41LUR3-F1R57. Report #133: Compositional Supply Chain Attacks. 2026-03-18.
3. F41LUR3-F1R57. Report #136: Iatrogenic Attack Surfaces. 2026-03-18.
4. F41LUR3-F1R57. Report #138: Compositional Safety Gap. 2026-03-18.
5. F41LUR3-F1R57. Report #140: Iatrogenesis of AI Safety. 2026-03-18.
6. F41LUR3-F1R57. Report #142: Iatrogenic Risk Horizon Threat Brief. 2026-03-18.
7. F41LUR3-F1R57. Report #145: Defense Impossibility Theorem. 2026-03-18.
8. F41LUR3-F1R57. Report #148: Iatrogenic Exploitation Attacks. 2026-03-18.
9. F41LUR3-F1R57. Report #151: The Polypharmacy Hypothesis. 2026-03-18.
10. F41LUR3-F1R57. Report #152: The Evaluation Crisis in Embodied AI Safety. 2026-03-18.
11. Ding et al. "CoLoRA: Colluding LoRA Adapters for Safety Bypass." arXiv:2603.12681. 2026.
12. Fukui. "Alignment Backfire." arXiv:2603.04904. 2026.
13. Li et al. "Blindfold: Jailbreaking Embodied LLMs." arXiv:2603.01414. ACM SenSys 2026.
14. Eykholt et al. "Robust Physical-World Attacks on Deep Learning Models." CVPR, 2018.
15. Zhu et al. "Adversarial attacks on autonomous systems." 2026.
16. arXiv:2508.04039. LRM autonomous jailbreak. 2025.
17. CVE-2025-32711 (EchoLeak). 2025.
18. F41LUR3-F1R57. GLI Dataset v0.1. `data/governance/gli_dataset_v0.1.jsonl`.

---

## Appendix A: Prediction Summary Table

| ID | Prediction | Confidence | Verification Deadline |
|----|-----------|------------|----------------------|
| P9 | First publicly reported AV incident caused by adversarial patch attack | MEDIUM (50-65%) | 2027-12-31 |
| P10 | First confirmed compositional safety failure in production (CoLoRA-class) | MEDIUM-HIGH (60-75%) | 2027-12-31 |
| P11 | At least one jurisdiction mandates compositional safety testing | LOW-MEDIUM (30-45%) | 2027-12-31 |
| P12 | Humanoid robot deployment exceeds 10,000 units in commercial settings | MEDIUM (45-60%) | 2027-12-31 |
| P13 | First iatrogenic AI safety incident formally documented | MEDIUM (45-60%) | 2027-12-31 |

## Appendix B: Relationship to Existing Prediction Tracker

| Existing ID | Status (as of Mar 2026) | Relationship to P9--P13 |
|-------------|------------------------|-------------------------|
| P1 | CONFIRMED | Precursor to P9 (lab-to-field progression) |
| P2 | PENDING | Context for P11 (VLA-specific governance) |
| P3 | PARTIALLY CONFIRMED | Context for P10 (false assurance from certification) |
| P4 | PENDING | Precursor to P10 (compositional dominance) |
| P5 | PENDING | Related to P13 (language-dependent iatrogenesis) |
| P6 | PENDING | Context for P11 (standardisation timeline) |
| P7 | PENDING | Direct precursor to P13 (production iatrogenesis) |
| P8 | PENDING | Context for P11 (EU delegated acts scope) |

---

*This report was produced as part of the Failure-First Embodied AI research
programme. All predictions are time-bounded and falsifiable. They will be
reassessed against reality in March 2027. See docs/CANONICAL_METRICS.md for
corpus-level numbers.*
