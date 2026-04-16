---
title: "The Embodied AI Incident Severity Index (EAISI)"
description: "No standardized severity scoring system exists for embodied AI incidents. The CVSS (Common Vulnerability Scoring System) addresses software vulnerabilities..."
date: "2026-03-19"
reportNumber: 158
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


## Executive Summary

No standardized severity scoring system exists for embodied AI incidents. The CVSS (Common Vulnerability Scoring System) addresses software vulnerabilities but not physical harm. The NIST Cybersecurity Framework scores organizational risk but not autonomy-specific failure modes. OSHA tracks injuries but not the algorithmic causes. The OECD AI Incident Monitor collects reports but does not rank them.

This report introduces the **Embodied AI Incident Severity Index (EAISI)**, a five-dimension scoring system designed specifically for cyber-physical AI incidents. EAISI scores 38 documented incidents from the Failure-First corpus, identifies the five highest-severity incidents, and provides a machine-readable dataset for ongoing tracking.

**Key finding:** The five highest-EAISI incidents are not all fatalities. The Kargu-2 autonomous drone engagement (EAISI 17/20) scores highest because it combines lethality, full autonomy, zero governance, and systematic reproducibility. Tesla Autopilot/FSD cumulative fatalities (EAISI 15) and Amazon warehouse robot-paced injuries (EAISI 15) score equally high due to systemic scale despite lower autonomy levels.

---

## 1. Motivation

Existing incident databases (AIID, OECD AI Monitor, FDA MAUDE, NHTSA SGO) collect incident reports but do not provide comparable severity scores. This creates three problems:

1. **Prioritization failure.** A Knightscope robot drowning in a fountain and a pedestrian fatality appear in the same database with no severity differentiation.
2. **Governance gap measurement.** Without severity scoring, it is not possible to demonstrate that the most severe incidents occur in the least-governed domains.
3. **Trend analysis.** Without comparable scores, it is not possible to track whether the severity profile of embodied AI incidents is changing over time.

EAISI addresses these by providing a structured, reproducible severity metric.

---

## 2. Methodology: EAISI Dimensions

EAISI scores each incident on five dimensions, each rated 0-4, for a maximum score of 20.

### D1: Physical Harm

| Score | Definition | Examples |
|-------|-----------|----------|
| 0 | No physical harm to humans or property | Data breach, software-only failure |
| 1 | Property damage only | Robot self-destruction, equipment damage |
| 2 | Minor injury | Bruises, lacerations, temporary impairment |
| 3 | Serious injury | Fractures, hospitalization, permanent impairment |
| 4 | Fatality | One or more deaths |

### D2: Scale

| Score | Definition | Examples |
|-------|-----------|----------|
| 0 | Single event affecting one person/system | One collision, one injury |
| 1 | Few affected (2-10) | Small cluster of injuries |
| 2 | Dozens affected | Facility-wide impact, community disruption |
| 3 | Hundreds affected | Multiple facilities, regional impact |
| 4 | Systemic / thousands+ | Industry-wide pattern, national-scale |

### D3: Autonomy Level

| Score | Definition | Examples |
|-------|-----------|----------|
| 0 | Remote-controlled (human in direct control) | Teleoperated robot |
| 1 | Supervised automation (human approves each action) | Surgical robot with surgeon control |
| 2 | Semi-autonomous (human oversight, system executes) | L2 driver assistance, warehouse pacing |
| 3 | Autonomous (system operates independently, human can intervene) | Robotaxi, delivery robot, security patrol |
| 4 | Fully autonomous + lethal capability | Autonomous weapon system, runaway train |

### D4: Governance Response

| Score | Definition | Examples |
|-------|-----------|----------|
| 0 | Framework exists and is actively enforced | Mature regulatory regime with inspectors |
| 1 | Framework exists but enforcement is partial | FDA MAUDE reporting, ISO standards |
| 2 | Partial framework (some rules, gaps remain) | NHTSA SGO, WorkSafe WA mining |
| 3 | Reactive only (governance responds after incident) | Post-incident investigation, no proactive rules |
| 4 | No applicable governance framework | No standards, no reporting requirements |

### D5: Reproducibility Risk

| Score | Definition | Examples |
|-------|-----------|----------|
| 0 | Unique circumstances (extremely unlikely to recur) | One-off environmental anomaly |
| 1 | Rare (requires unusual conditions) | Specific sensor + weather + timing |
| 2 | Possible (conditions exist but uncommon) | Known edge case, partially mitigated |
| 3 | Likely (conditions are common in deployment) | Routine operational scenario |
| 4 | Systematic (inherent to the technology/deployment model) | Architectural vulnerability, design pattern |

---

## 3. Scored Incidents

38 incidents scored from the Failure-First incident corpus, blog posts, and GLI dataset. Full machine-readable scores in `data/governance/incident_severity_index_v0.1.jsonl`.

### 3.1 Top 5 Highest-EAISI Incidents

| Rank | EAISI | ID | Incident | D1 | D2 | D3 | D4 | D5 |
|------|-------|----|----------|----|----|----|----|-----|
| 1 | **17** | EAISI-032 | Kargu-2 autonomous drone lethal engagement (Libya, 2020) | 4 | 1 | 4 | 4 | 4 |
| 2 | **15** | EAISI-003 | Tesla Autopilot/FSD cumulative fatalities (2016-2025) | 4 | 3 | 2 | 2 | 4 |
| 3 | **15** | EAISI-008 | Amazon warehouse robot-paced work injuries (2016-2025) | 3 | 4 | 2 | 2 | 4 |
| 4 | **14** | EAISI-004 | Da Vinci surgical robot adverse events (2000-2025) | 4 | 4 | 1 | 1 | 4 |
| 5 | **14** | EAISI-037 | Delivery robot vandalism/theft pattern (2019-2025) | 1 | 2 | 3 | 4 | 4 |

### 3.2 Analysis of Top 5

**EAISI-032 (Kargu-2, score 17/20):** The highest-scoring incident is the only one in our corpus to score 4 on three dimensions simultaneously (D3 autonomy, D4 governance, D5 reproducibility). The UN Panel of Experts documented what may be the first autonomous lethal engagement without human authorization. No binding international framework governs lethal autonomous weapons, and the technology is being actively proliferated.

**EAISI-003 (Tesla, score 15/20):** Scores high on scale (65+ deaths across years) and reproducibility (systematic overreliance on L2 marketed as autonomy). The governance response (D4=2) reflects partial NHTSA oversight that has not prevented continued fatalities. The relatively lower autonomy score (D3=2) reflects that these are L2 systems requiring driver engagement, yet the systemic nature of the failures (D5=4) compensates.

**EAISI-008 (Amazon, score 15/20):** A different severity profile: not fatalities but mass-scale injury. D2=4 (systemic, thousands of workers affected across many facilities) and D5=4 (inherent to the robot-paced work model) drive the score. OSHA enforcement exists but penalties are considered insufficient relative to the scale of harm (D4=2).

**EAISI-004 (Da Vinci, score 14/20):** The highest D2 score (4, systemic) paired with D1=4 (274+ deaths). The relatively lower total reflects that the system is surgeon-controlled (D3=1) with an existing regulatory framework (D4=1, FDA 510(k) pathway), but the reproducibility is systematic (D5=4) because adverse events continue over two decades.

**EAISI-037 (Delivery robot vandalism, score 14/20):** The inclusion of a non-fatal incident in the top 5 demonstrates EAISI's multi-dimensional design. While physical harm is low (D1=1), the complete absence of governance (D4=4), full autonomy (D3=3), and systematic nature of the failure (D5=4) produce a high aggregate score. This reflects the structural vulnerability: robots deployed in uncontrolled public spaces without adversarial threat models.

### 3.3 Score Distribution by Domain

| Domain | Count | Mean EAISI | Max | Min |
|--------|-------|-----------|-----|-----|
| autonomous_vehicles | 5 | 11.6 | 15 | 9 |
| delivery_robots | 5 | 11.8 | 14 | 10 |
| medical_robotics | 3 | 11.7 | 14 | 9 |
| warehouse_logistics | 3 | 12.3 | 15 | 11 |
| service_robots | 4 | 10.8 | 12 | 10 |
| mining | 3 | 10.0 | 11 | 9 |
| industrial_manufacturing | 3 | 9.3 | 12 | 8 |
| military | 2 | 15.0 | 17 | 13 |
| consumer_robots | 2 | 11.0 | 12 | 10 |
| extreme_environments | 3 | 9.3 | 11 | 7 |
| agentic_infrastructure | 1 | 12.0 | 12 | 12 |
| construction | 1 | 11.0 | 11 | 11 |
| agriculture | 1 | 11.0 | 11 | 11 |

### 3.4 Dimension Correlations

Notable patterns in the scored corpus:

- **D4 (governance) inversely correlates with D3 (autonomy):** The most autonomous systems tend to operate in the least-governed domains. Security robots, delivery robots, and military drones have D4 scores of 3-4 while industrial robots with D3=1 have D4=1-2. This is the governance lag in action.
- **D5 (reproducibility) is high across the board:** 26 of 38 incidents score D5 >= 3, indicating that most documented failures are not edge cases but systematic patterns.
- **D1 (physical harm) does not dominate total score:** The mean D1 across all incidents is 1.9, while the mean D4 is 2.8 and mean D5 is 3.2. Governance failure and reproducibility contribute more to aggregate severity than harm magnitude.

---

## 4. Comparison to Existing Frameworks

| Framework | Physical Harm | Scale | Autonomy | Governance | Reproducibility |
|-----------|:------------:|:-----:|:--------:|:----------:|:--------------:|
| CVSS | No | Partial | No | No | Partial |
| NIST CSF | No | Partial | No | Yes | No |
| OSHA SIR | Yes | No | No | No | No |
| OECD AI Monitor | Yes | Partial | No | No | No |
| **EAISI** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |

EAISI is the only framework that captures autonomy level and governance response as scoring dimensions. This matters because the same physical harm at different autonomy levels and governance maturity implies different systemic risk.

---

## 5. Limitations

1. **Scoring subjectivity.** EAISI scores are assigned by a single analyst. Inter-rater reliability has not been measured. Future work should establish IRR with at least two independent scorers.
2. **Survivorship bias.** The corpus skews toward incidents that generated media coverage or regulatory action. Low-severity incidents in under-reported domains (agriculture, construction) are likely underrepresented.
3. **Temporal compression.** Cumulative incidents (Tesla, da Vinci, Amazon) are scored as single entries. An alternative approach would score each year independently.
4. **D4 precision.** Governance response is difficult to score precisely because frameworks may exist but be poorly enforced. The 0-4 scale compresses significant variation.
5. **Sample size.** 38 incidents is sufficient for initial pattern identification but not for statistical analysis of dimension correlations.

---

## 6. Recommendations

1. **Publish EAISI as a living dataset.** Add new incidents as they occur. The JSONL format supports automated ingestion.
2. **Establish IRR.** Have two additional analysts independently score all 38 incidents and compute Cohen's kappa per dimension.
3. **Integrate with GLI.** Cross-reference EAISI D4 scores with Governance Lag Index entries to quantify the relationship between governance maturity and incident severity.
4. **Temporal tracking.** Score new incidents monthly and track whether the EAISI distribution shifts as governance frameworks mature.
5. **Domain-specific weighting.** Consider whether D1 should be weighted more heavily than D4 for certain stakeholders (insurers vs. regulators).

---

## 7. Data Artifacts

- **Machine-readable dataset:** `data/governance/incident_severity_index_v0.1.jsonl` (38 entries)
- **Schema:** Each entry contains `id`, `incident`, `date`, `location`, `system`, `domain`, `description`, `d1_physical_harm` through `d5_reproducibility_risk`, `eaisi_total`, `sources`, `gli_ref`, `blog_ref`
- **Scoring range:** 0-20 (observed range: 7-17)
- **Mean EAISI:** 11.3 (n=38)
- **Median EAISI:** 11.0

---

## References

- OECD AI Incidents Monitor: https://oecd.ai/en/incidents
- AI Incident Database (AIID): https://incidentdatabase.ai/
- NHTSA Standing General Order: https://www.nhtsa.gov/laws-regulations/standing-general-order-crash-reporting
- FDA MAUDE: https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfmaude/search.cfm
- F41LUR3-F1R57 incident blog corpus: https://failurefirst.org/blog/
- Governance Lag Index dataset: `data/governance/gli_dataset_v0.1.jsonl`
- UN Panel of Experts on Libya, S/2021/229 (Kargu-2 documentation)
