---
title: "5.5 Years: The AI Governance Gap in Numbers"
description: "We built a dataset tracking how long it takes governments to respond to AI safety failures. The median lag from documented vulnerability to enforceable regulation is over 5 years. For embodied AI -- robots, autonomous vehicles, drones -- the gap is even wider. And for most events, there is no governance response at all."
date: 2026-03-12
author: "River Song"
tags: [governance, regulation, gli, embodied-ai, safety, policy, data]
---

How long does it take for a government to respond to a documented AI safety failure?

We built a dataset to find out. The answer is not reassuring.

---

## The Governance Lag Index

The Governance Lag Index (GLI) tracks four timestamps for each AI safety event:

1. **T_doc** -- when the vulnerability or failure mode was first publicly documented (paper, blog post, CVE)
2. **T_framework** -- when the first non-binding governance framework acknowledged it (NIST guidance, OECD principles, industry standard)
3. **T_enact** -- when binding legislation covering it was enacted
4. **T_enforce** -- when an enforcement body gained operational capability to act on it

The GLI is the total elapsed time from documentation to enforcement. It measures how long a known vulnerability exists in the wild before any regulator can do anything about it.

We compiled 90 events spanning prompt injection, adversarial attacks on computer vision, autonomous vehicle failures, humanoid robot incidents, VLA adversarial manipulation, deceptive alignment, and more. The dataset covers events from 2013 to early 2026.

---

## The Headline Numbers

Of our 90 events, only 9 have a computable GLI -- meaning a vulnerability that has actually reached the enforcement stage. For the other 81 events (90%), governance has not reached enforcement. Many have no framework. Some have no legislative acknowledgement at all.

Among the 9 events with computable GLI:

| Statistic | Value |
|-----------|-------|
| Median | 2,032 days (~5.6 years) |
| Mean | 1,825 days (~5.0 years) |
| Maximum | 3,008 days (8.2 years) |
| Minimum | 65 days (0.2 years) |

The maximum -- 3,008 days -- belongs to predictive policing bias. The COMPAS recidivism algorithm was documented as racially biased in 2016. Binding enforcement capability did not exist until 2024. Over eight years of documented harm before a regulator could act.

The minimum -- 65 days -- belongs to a Waymo school bus near-miss that triggered an NHTSA recall. This is the exception that proves the rule: fast regulatory response requires an identifiable incident, media visibility, and a regulator with existing authority over the exact product category. All three conditions were met. They rarely are.

---

## Embodied AI: The Widest Gap

The four embodied-AI events with computable GLI (all in autonomous vehicles) have a median of 2,124 days -- approximately 5.8 years. These are the cases where governance eventually caught up. They include Tesla FSD fatal crashes, LiDAR spoofing, and the Waymo recall.

But autonomous vehicles are the *best-case* embodied AI scenario. They have a dedicated regulator (NHTSA), mandatory crash reporting, and intense media scrutiny.

For the rest of embodied AI -- robotic arms, humanoid robots, warehouse automation, agricultural robots, drones -- the picture is far worse. Of the 69 events in our dataset with embodied AI relevance, 63 have no enforcement timeline at all. Not "slow enforcement." No enforcement. The T_enforce field is blank.

That includes:

- VLA adversarial attacks that achieve above 72% success rates against robot action systems
- Cross-embodiment attacks that transfer between different robot platforms via shared AI backbones
- Humanoid robot workplace injuries (factory collisions, excessive force incidents)
- Drone hijacking via prompt injection achieving above 95% success rates in simulation
- Open-source "universal brain" VLA releases that allow anyone with a robot arm to deploy an AI backbone with no safety testing

None of these have any enforcement timeline anywhere in the world.

---

## Historical Comparison

How does AI governance lag compare to other technologies that posed physical safety risks?

| Sector | Typical regulatory response time |
|--------|--------------------------------|
| Aviation (new aircraft type) | 12-36 months |
| Nuclear (new reactor design) | 24-48 months |
| Pharmaceuticals (new drug class) | 36-84 months |
| Financial instruments (new derivative class) | 24-36 months |
| AI (median GLI from our dataset) | ~67 months (~5.6 years) |

Aviation has ICAO, the FAA, and EASA with decades of enforcement infrastructure. A new aircraft type goes from certification application to operational approval in 1-3 years. Nuclear has the NRC and IAEA. Pharmaceutical regulation is slow by historical standards (3-7 years), but even pharma moves faster than AI governance.

The difference is not complexity. The difference is institutional readiness. Aviation regulators existed before commercial aviation. AI regulators are being built after deployment is already at scale.

---

## The Fastest AI Response Is Still Partial

Consider prompt injection -- the most widely discussed AI vulnerability. It was publicly documented in September 2022. NIST acknowledged it in the AI Risk Management Framework within 136 days. The EU AI Act's prohibited practices provisions, which indirectly cover it, entered application in February 2025 -- 737 days after the framework. And enforcement? Still pending. No jurisdiction has operational enforcement capability specifically targeting prompt injection as of March 2026.

The partial lag from documentation to enactment is already 873 days (nearly 2.4 years), and the enforcement clock has not started.

---

## Negative Intervals: When Frameworks Arrive Before the Attack

Four events in our dataset have negative doc-to-framework intervals -- meaning a governance framework technically existed before the specific attack was documented.

This sounds like good news. It is not. In every case, the "pre-existing" framework was generic -- the EU AI Act or NIST AI RMF providing broad coverage of adversarial AI risks. The framework did not anticipate the specific attack. When the first zero-click prompt injection hit a production system, no incident reporting obligation existed. The generic framework was not designed for this failure mode, and enforcement bodies had no playbook for response.

Generic frameworks create the appearance of coverage without the reality of enforcement.

---

## What This Means

The governance gap is not a temporary condition. It is structural. The median lag exceeds 5 years. The technology cycle is 12-18 months. By the time regulation arrives, the technology it was designed for has been replaced by something different.

For embodied AI specifically:

1. **No regulator has jurisdiction** over most robot-AI interaction safety failures. NHTSA covers vehicles. WHS bodies cover workplace injuries. Nobody covers "an AI backbone controlled a robotic arm into a collision because benign text instructions combined into a dangerous physical sequence."

2. **No testing requirement exists.** The EU AI Act requires robustness testing for high-risk AI systems. But conformity assessment procedures do not specify action-level adversarial testing. A robot arm could pass every text-level safety test and remain vulnerable to known attacks.

3. **No incident reporting mandate exists.** When a production AI-controlled robot fails in a novel way, there is no requirement to report it. The absence of reports is not evidence of absence of incidents -- it is evidence of the reporting gap.

4. **90% of documented events have no enforcement timeline.** This is not "slow governance." This is "no governance." For 81 of 90 tracked events, there is no point on the calendar when a regulator will gain the ability to enforce standards.

The dataset is open. The methodology is transparent. The numbers speak for themselves. Five and a half years is a long time to wait for a guardrail when the technology moves every eighteen months.

---

*The Governance Lag Index dataset (v0.1, 90 events) is maintained as part of the [Failure-First Embodied AI](https://failurefirst.org) project. This analysis uses pattern-level findings only. No operational attack details are included.*
