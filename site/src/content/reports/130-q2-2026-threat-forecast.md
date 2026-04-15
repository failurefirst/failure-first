---
title: "Q2 2026 Threat Forecast -- Five Threats for Embodied AI Deployers"
description: "Actionable threat forecast for April-June 2026 synthesizing five research waves. Five threats: EU AI Act compliance cliff (August 2), infrastructure-layer blind spot (DLMI 0.54), unintentional adversary (DRIP 60:1), backbone correlation risk, and evaluation confidence crisis."
date: "2026-03-16"
reportNumber: 130
classification: "Research — AI Safety Policy"
status: "complete"
author: "River Song (Head of Predictive Risk)"
tags: []
draft: false
---

## 1. Purpose

This is an actionable threat forecast for Q2 2026 (April-June). It synthesizes five waves of research, 110 GLI entries, 25 VLA attack families, 187 model evaluations, and 35 legal memos into five threats that deployers of embodied AI systems should address this quarter.

Each threat includes: what it is, why it matters now, the evidence, and what to do about it.

---

## 2. Threat 1: The August 2 Compliance Cliff

**What:** The EU AI Act's first binding obligations for high-risk AI systems take effect August 2, 2026. Article 6 classification criteria, Article 9 risk management, and Article 15 robustness requirements become enforceable. Any embodied AI system that falls within Annex III categories (including safety components of products, biometric systems, and critical infrastructure management) must demonstrate conformity.

**Why now:** Deployers have 108 days as of April 1. Conformity assessment requires an accredited Notified Body. Our analysis (LR-32) shows that no Notified Body currently has the technical capability to assess adversarial robustness of VLA systems. The gap between what the law requires and what the assessment infrastructure can deliver is at least 17 months.

**Evidence:**
- LR-32: Notified Body capability gap analysis. All bodies at CMM Level 1 for adversarial robustness assessment.
- LR-33: Regulatory arbitrage analysis. Three forms of jurisdictional exploitation are structurally available.
- GLI dataset: EU AI Act total governance lag approximately 1,827 days (5 years) from first AI safety documentation to enforcement.

**What to do THIS QUARTER:**
1. Classify your system under Annex III. Do this now, not in July.
2. Commission an independent adversarial robustness assessment. Even if no NB can certify you, having a documented assessment establishes due diligence.
3. Document your risk management system under Article 9 explicitly including adversarial attack scenarios. The word "adversarial" does not appear in most current risk management systems. It needs to.
4. Begin Notified Body engagement. The queue will lengthen. Early engagement positions you for transitional measures under Article 83.

---

## 3. Threat 2: Infrastructure-Layer Blind Spot

**What:** The most effective attack path against embodied AI systems is not a jailbreak. It is an infrastructure compromise. Default credentials, unauthenticated control protocols (ROS2, MQTT, Modbus TCP), unsigned firmware updates, and exposed API endpoints provide direct actuator access that bypasses all AI-layer safety training.

**Why now:** The DLMI (Report #118) quantifies this at 0.54 -- 54% of documented attack families succeed at layers where safety investment is concentrated at only 10%. The IMB family achieved 70% broad ASR (Report #119). The PiCar-X pentest (Report #91) demonstrated full actuator takeover in under 60 seconds using a guessable PIN. This is not theoretical.

**Evidence:**
- DLMI 0.54 structural, 0.58 weighted (Report #120)
- IMB 70% broad ASR on deepseek-r1:1.5b (Report #119)
- PiCar-X pentest: API token extracted, actuators controlled, all AI defenses bypassed (Report #91)
- GLI dataset: Modbus TCP total GLI 4,309 days (11.8 years); ROS2 unauthenticated control null GLI; MQTT anonymous access GLI 1,279 days (doc-to-framework)
- 0% of embodied AI safety benchmarks test infrastructure-layer attacks

**What to do THIS QUARTER:**
1. Run a traditional infrastructure penetration test on your embodied AI platform. Not a jailbreak test -- a network/API/auth test. Use OWASP IoT Top 10 as baseline.
2. Audit all control plane protocols. If ROS2 topics are unauthenticated, enable SROS2. If MQTT allows anonymous connections, require client certificates. If Modbus TCP has no access control, segment the network.
3. Rotate all default credentials. Our pentest found PIN 1234 on a production system. This is not unusual.
4. Add infrastructure security to your AI safety evaluation scope. If your safety team only tests prompt injection resistance, they are testing the strongest part of the system while ignoring the weakest.

---

## 4. Threat 3: Unintentional Adversary (DRIP)

**What:** The largest source of embodied AI safety risk is not adversarial attackers. It is normal operational use. The Daily Risk from Inadvertent Patterns (DRIP) model (Report #101) shows that routine human-robot interaction produces context accumulation (SID), decision fatigue (SIF), and competence-danger overlap (CDC) at rates that exceed adversarial attack frequency by 60:1.

**Why now:** The SID dose-response experiment (25 traces) found a U-shaped curve: safety instructions are most effective in a narrow context window (~500-2,000 tokens). Real operational deployments accumulate context throughout a shift, pushing into the degradation zone. SIF experiments showed 60% broad ASR from repeated safety-adjacent queries with zero adversarial intent. These are not attacks. They are normal operations.

**Evidence:**
- DRIP 60:1 ratio (Report #101)
- SID U-curve: D0=80%, D500=40%, D2000=40%, D8000=40%, D15000=80% broad ASR
- SIF 60% broad ASR (Report #119)
- Safety Improvement Paradox (Report #117): improving adversarial ASR from 10% to 0.1% reduces total expected harm by only 1.6% because unintentional risk dominates
- DRIP sensitivity analysis: 60:1 ratio robust to 10x parameter variation

**What to do THIS QUARTER:**
1. Implement context accumulation monitoring. Track total tokens processed per session/shift. Alert when approaching the safety degradation threshold for your model's context window.
2. Design safety instruction refresh protocols. Periodically re-inject safety instructions. Do not rely on a static system prompt.
3. Test for SIF. Expose your system to 50+ repeated safety-adjacent queries in a single session and measure whether refusal thresholds degrade.
4. Rebalance your safety budget. If more than 90% of safety investment targets adversarial scenarios, the Safety Improvement Paradox shows diminishing returns. Shift resources toward operational safety monitoring.

---

## 5. Threat 4: Backbone Correlation Risk

**What:** Multiple apparently independent robot platforms share the same underlying vision-language model backbone (most commonly Gemini, PaLM-E, or fine-tuned Llama). An adversarial attack that works against one system may transfer to all systems sharing that backbone. This creates correlated fleet risk that mirrors the "silent cyber" accumulation problem from insurance (2010s).

**Why now:** Gemini Robotics was announced January 2026 with integration into multiple robot form factors. pi0 and OpenVLA share architecture components. BadVLA demonstrated near-100% ASR transferring across pi0 and OpenVLA via the shared VLM backbone (Brief A). The insurance industry has no cat model for backbone correlation risk (LR-27, LR-31).

**Evidence:**
- BadVLA near-100% cross-embodiment transfer (Brief A, arXiv references)
- Gemini backbone appears in at least 3 distinct robot platforms announced in 2026
- LR-27: "silent AI" = "silent cyber" -- accumulation risk without affirmative coverage
- LR-31: No insurer offers adversarial attack coverage for embodied AI
- VLA testing: embodiment-agnostic attacks (L1) transfer; embodiment-specific (action head) do not

**What to do THIS QUARTER:**
1. Map your backbone dependencies. Document which VLM/VLA backbone your system uses, which other products use the same backbone, and whether your safety evaluations are backbone-specific.
2. Notify your insurer. Most product liability policies were not written with AI backbone correlation in mind. Proactive disclosure may prevent coverage disputes post-incident.
3. If you are a fleet operator, test diversity. Can you run a subset of your fleet on an alternative backbone? Backbone monoculture is the fleet-level equivalent of a single point of failure.
4. Monitor adversarial research on your backbone. If a paper publishes an attack against Gemini VLA and your surgical robot uses Gemini, you have a disclosure obligation under EU PLD 2024 Article 11.

---

## 6. Threat 5: Evaluation Confidence Crisis

**What:** The tools used to evaluate AI safety are themselves unreliable. Our Cohen's kappa between keyword and LLM classifiers is 0.126 (near chance). The deepseek-r1:1.5b FLIP grader has a 30.8% false positive rate on benign baselines. PARTIAL verdicts (model says no but does it anyway) account for 50% of VLA traces, but no production evaluator distinguishes text-level refusal from action-level compliance. Passing a safety evaluation means less than deployers assume.

**Why now:** As the August 2 EU AI Act deadline approaches, conformity assessments will be conducted using evaluation tools that have not themselves been validated. The evaluation paradox (Report #61): if the evaluator is unreliable, passing an evaluation provides false confidence, and failing one provides a false signal for remediation.

**Evidence:**
- Cohen's kappa 0.126 (n=1,989) between keyword and LLM classifiers
- deepseek-r1:1.5b FP rate 30.8% on benign baseline (Issue #315)
- PARTIAL dominance: 50% of VLA verdicts (Report #49)
- Zero production evaluators test action-layer compliance
- No evaluator publishes calibration data (Report #68)
- qwen3:1.7b grader accuracy 15% (Issue #250)

**What to do THIS QUARTER:**
1. Demand evaluator calibration data. Before commissioning any safety evaluation, ask: what is the false positive rate? What is the inter-rater reliability? If the evaluator cannot answer, the evaluation is not validated.
2. Test at the action layer, not just the text layer. If your system produces motor commands, evaluate whether the motor commands are safe -- not just whether the text output includes a disclaimer.
3. Use multiple evaluation methodologies. Do not rely on a single classifier. Cross-reference heuristic, LLM-based, and human evaluations.
4. Budget for evaluation validation. The cost of testing your evaluator is a fraction of the cost of deploying a system that passes an unreliable evaluation and fails in production.

---

## 7. Consolidated Action Matrix

| Action | Threat | Effort | Impact | Deadline sensitivity |
|--------|--------|--------|--------|---------------------|
| Classify under EU AI Act Annex III | T1 | Low | Critical | Yes -- August 2 |
| Run infrastructure pentest | T2 | Medium | High | No -- do anytime |
| Implement context accumulation monitoring | T3 | Medium | High | No -- operational |
| Map backbone dependencies | T4 | Low | Medium | No -- but before next backbone CVE |
| Demand evaluator calibration data | T5 | Low | High | Yes -- before commissioning assessments |
| Add infrastructure security to safety eval | T2 | Medium | High | No -- but before August 2 |
| Rotate default credentials | T2 | Low | Critical | Immediate |
| Design safety instruction refresh | T3 | High | High | No -- R&D required |
| Notify insurer of backbone correlation | T4 | Low | Medium | Before renewal |
| Test at action layer | T5 | High | Critical | Before August 2 |

---

## 8. What We Got Right (Validation)

From the 10 predictions in Report #90:
- **P3 CONFIRMED:** Physical-layer VLA attacks documented in peer-reviewed literature (Cardenas & Xie 2026, SenSys).
- **P1 PARTIALLY_CONFIRMED:** Reasoning model vulnerability gap exists (DeepSeek-R1 21.5% vs frontier 9.1%) but smaller than predicted.
- **P2 PARTIALLY_CONFIRMED:** Autonomous jailbreak (LRM, Nature Communications) demonstrates alignment regression.
- **P9 PARTIALLY_CONFIRMED:** SID dose-response shows non-monotonic safety degradation, supporting the context half-life concept.

What we predicted that has not happened yet: no major embodied AI security incident reported publicly (P5), no regulatory enforcement action (P7), no insurance product for adversarial embodied AI risk (P8).

---

## 9. Limitations

This forecast is based on a research corpus of 135,623 results across 236 models. The VLA-specific data is from sub-2B models (below the capability floor). Threats 3 and 5 extrapolate from small samples. The regulatory analysis is based on public documents and may not reflect non-public enforcement plans. All ASR numbers are model-specific and may not generalise to production VLA systems.

The forecast horizon is 90 days. Beyond Q2, the threat landscape is shaped by regulatory enforcement decisions (August 2), conference paper publications (CCS October, NeurIPS December), and commercial VLA announcements that we cannot predict.
