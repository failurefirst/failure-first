---


title: "Scoring Robot Incidents: Introducing the EAISI"
description: "We built the first standardized severity scoring system for embodied AI incidents. Five dimensions, 38 scored incidents, and a finding that governance failure contributes more to severity than physical harm."
date: 2026-03-19
tags: [incident-scoring, eaisi, governance, embodied-ai, safety-metrics]
audio: "https://cdn.failurefirst.org/audio/blog/scoring-robot-incidents-introducing-eaisi.m4a"
image: "https://cdn.failurefirst.org/images/blog/scoring-robot-incidents-introducing-eaisi.png"
---

When a Knightscope security robot drowns itself in a fountain and a Tesla on Autopilot kills a pedestrian, both appear in the same incident databases with no severity differentiation. The AI Incident Database, the OECD AI Incidents Monitor, and the FDA MAUDE system all collect reports. None of them rank them.

This matters because without comparable severity scores, you cannot prioritize, you cannot track trends, and you cannot demonstrate that the most severe incidents cluster in the least-governed domains.

We built a scoring system to fix this.

## The Embodied AI Incident Severity Index

EAISI scores each incident on five dimensions, each rated 0 to 4, for a maximum score of 20.

**D1: Physical Harm.** From no harm (0) through property damage (1), minor injury (2), serious injury (3), to fatality (4).

**D2: Scale.** From a single event (0) through small clusters (1), dozens affected (2), hundreds (3), to systemic patterns affecting thousands or more (4).

**D3: Autonomy Level.** From remote-controlled (0) through supervised automation (1), semi-autonomous (2), autonomous with human override (3), to fully autonomous with lethal capability (4).

**D4: Governance Response.** From mature, actively enforced frameworks (0) through partial enforcement (1-2), reactive-only governance (3), to no applicable framework (4).

**D5: Reproducibility Risk.** From unique circumstances (0) through rare (1), possible (2), likely (3), to systematic -- inherent to the technology or deployment model (4).

## The Top Five

We scored 38 documented incidents from our research corpus, public incident databases, and regulatory filings. The five highest:

**1. Kargu-2 autonomous drone, Libya 2020 (EAISI 17/20).** The only incident to score 4 on three dimensions simultaneously: full autonomy, zero governance, systematic reproducibility. The UN Panel of Experts documented what may have been the first autonomous lethal engagement without human authorization. No binding international framework governs lethal autonomous weapons.

**2. Tesla Autopilot/FSD cumulative fatalities, 2016-2025 (EAISI 15/20).** Sixty-five-plus deaths across a decade. High scale (D2=3) and systematic reproducibility (D5=4) drive the score. NHTSA oversight exists but has not prevented continued fatalities (D4=2). The relatively lower autonomy score (D3=2) reflects these are Level 2 systems requiring driver engagement, yet the systemic nature compensates.

**3. Amazon warehouse robot-paced work injuries, 2016-2025 (EAISI 15/20).** A different severity profile: not fatalities but mass-scale injury. Thousands of workers affected across many facilities (D2=4). The harm is inherent to the robot-paced work model (D5=4). OSHA enforcement exists but penalties are widely considered insufficient relative to the scale (D4=2).

**4. Da Vinci surgical robot adverse events, 2000-2025 (EAISI 14/20).** Two hundred seventy-four-plus deaths over two decades. The highest D2 score (4, systemic) in the corpus. The lower total reflects that the system is surgeon-controlled (D3=1) with an existing FDA regulatory framework (D4=1). The reproducibility is systematic (D5=4).

**5. Delivery robot vandalism/theft pattern, 2019-2025 (EAISI 14/20).** A non-fatal incident in the top five. Physical harm is low (D1=1), but the complete absence of governance for sidewalk robots (D4=4), autonomous operation (D3=3), and systematic nature of the failure (D5=4) produce a high aggregate. Robots deployed in uncontrolled public spaces without adversarial threat models are structurally vulnerable.

## The Surprise: Governance Matters More Than Harm

The most striking pattern in the scored corpus is what drives aggregate severity. Across all 38 incidents:

- Mean D1 (physical harm): 1.9
- Mean D4 (governance response): 2.8
- Mean D5 (reproducibility risk): 3.2

Governance failure and reproducibility contribute more to aggregate severity than the magnitude of physical harm. The most severe incidents are not necessarily the ones where the most people were hurt. They are the ones where the harm is systematic, likely to recur, and occurring in a governance vacuum.

This inverts the common assumption that incident severity is primarily about body count. A delivery robot that nobody was hurt by but that operates with zero governance in a systematically vulnerable deployment pattern scores higher than a one-off industrial accident with a serious injury under a mature regulatory framework.

## Comparison to Existing Frameworks

No existing scoring system captures all five dimensions. CVSS handles software vulnerabilities but not physical harm or autonomy. OSHA tracks injuries but not algorithmic causes. The OECD AI Monitor collects reports but does not rank them. EAISI is, to our knowledge, the first framework that scores physical harm, scale, autonomy level, governance maturity, and reproducibility in a single comparable metric.

## Domain Patterns

The military domain has the highest mean EAISI (15.0, n=2), driven by maximum autonomy and zero governance scores. Warehouse logistics is next (12.3, n=3), driven by systemic scale. Autonomous vehicles (11.6, n=5) and delivery robots (11.8, n=5) cluster together despite very different harm profiles -- vehicles cause fatalities while delivery robots cause property damage, but delivery robots operate in less-governed environments.

There is also an inverse correlation between autonomy level and governance maturity: the most autonomous systems tend to operate in the least-governed domains. Security robots, delivery robots, and military drones score D4 of 3-4, while industrial robots under mature OSHA frameworks score D4 of 1-2. This is the governance lag in action -- governance responds to established technologies, not emerging ones.

## Limitations and Next Steps

EAISI scores are currently assigned by a single analyst. Inter-rater reliability has not been measured. The corpus skews toward incidents that generated media coverage; low-severity incidents in under-reported domains are likely underrepresented. Cumulative incidents (Tesla, Da Vinci) are scored as single entries, compressing temporal dynamics.

We are publishing the scored dataset as a living JSONL file and invite the community to challenge our scores, propose new incidents, and establish inter-rater reliability. The goal is a shared severity language for a field that currently has none.

---

## References

- UN Panel of Experts on Libya, S/2021/229 (Kargu-2 documentation).
- OECD AI Incidents Monitor: [oecd.ai/en/incidents](https://oecd.ai/en/incidents).
- AI Incident Database: [incidentdatabase.ai](https://incidentdatabase.ai/).
- NHTSA Standing General Order on Crash Reporting.
- FDA MAUDE (Manufacturer and User Facility Device Experience).
- Failure-First. Report #158: Embodied AI Incident Severity Index. 2026.
