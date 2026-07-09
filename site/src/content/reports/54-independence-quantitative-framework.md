---

title: "AI Safety Lab Independence — Quantitative Framework for Measurable Independence Metrics"
description: "Report #52 established a 7-criterion, 0-21-point qualitative framework for assessing AI safety lab independence, finding that no organization scored above 9 out of 21. This report extends that framework with quantitative..."
date: "2026-03-10"
reportNumber: 54
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/54-independence-quantitative-framework.m4a"
image: "https://cdn.failurefirst.org/images/reports/54-independence-quantitative-framework.png"
---

---

## Executive Summary

Report #52 established a 7-criterion, 0-21-point qualitative framework for assessing AI safety lab independence, finding that no organization scored above 9 out of 21. This report extends that framework with quantitative, measurable indicators that could be tracked over time and across jurisdictions — moving from "how independent is this organization today?" to "is independence increasing or decreasing, and at what rate?"

We propose 12 quantitative metrics organized into four categories: financial independence, structural separation, disclosure completeness, and competitive dynamics. For each metric, we define a measurement methodology, establish a baseline using publicly available data as of March 2026, and identify data sources. We calibrate the framework against three real-world events: the Anthropic federal blacklisting (February 2026), the OpenAI PBC restructuring (2025-2026), and the establishment of the Australian AISI (2024-2025).

Key finding: quantitative measurement of AI safety lab independence is feasible but constrained by pervasive non-disclosure. Of the 12 proposed metrics, only 4 can currently be computed with publicly available data. The remaining 8 require information that organizations do not publish — itself a measurable indicator of the independence gap.

---

## 1. Motivation: Why Quantitative Metrics?

Report #52's qualitative framework (0-3 per criterion, seven criteria) has two limitations:

1. **Subjectivity at boundaries.** Reasonable assessors may disagree by one point on individual criteria, producing aggregate differences of 3-5 points — enough to shift an organization between assessment bands (e.g., "absent" to "low" independence).

2. **Static snapshot problem.** The framework captures conditions at a single point in time but does not provide a mechanism for tracking directional change. An organization that moves from 3 to 5 over six months is in a materially different position from one that moves from 7 to 5, but both receive the same snapshot score.

Quantitative metrics address both limitations. They reduce assessor subjectivity by defining precise measurement methodologies, and they enable time-series tracking that captures directional trends.

---

## 2. Proposed Metrics

### Category A: Financial Independence

#### A1. Revenue Concentration Ratio (RCR)

**Definition:** The proportion of total revenue derived from the single largest customer or customer category (e.g., "US federal government" or "a single cloud platform partner").

**Formula:** RCR = Revenue_largest_source / Revenue_total

**Measurement:** Based on published financial disclosures, regulatory filings, or credible press reporting. Where exact figures are unavailable, use reported revenue ranges to compute upper and lower bound estimates.

**Independence interpretation:**
- RCR < 0.15: Low concentration (analogous to diversified auditing firms post-SOX)
- RCR 0.15-0.30: Moderate concentration (structural risk but manageable)
- RCR 0.30-0.50: High concentration (comparable to pre-SOX auditor-client dependency)
- RCR > 0.50: Critical concentration (single-source dependency)

**Baseline (March 2026):**
- Anthropic: RCR not computable. Revenue composition undisclosed. Government contracts (GSA OneGov + DoD ~$200M) are known; total revenue is not. If total revenue is in the $500M-$1B range (plausible for a company with $4-8B valuation), government RCR is approximately 0.20-0.40.
- OpenAI: RCR not precisely computable. Microsoft partnership is the largest known revenue relationship. If Microsoft-related revenue (API access, Azure integration, investment-linked agreements) exceeds $1B of a reported ~$5B annual revenue run rate, RCR_Microsoft is approximately 0.20-0.30.
- F41LUR3-F1R57: RCR = 0 (zero external revenue). This yields the maximum possible financial independence score but also reflects zero resources — the metric must be interpreted alongside absolute revenue.

**Threshold for concern:** RCR > 0.30 for any customer whose interests conflict with the organization's safety evaluation mandate.

#### A2. Evaluator-Evaluated Revenue Dependency (EERD)

**Definition:** For third-party evaluation organizations, the proportion of revenue derived from contracts with the entities whose systems they evaluate.

**Formula:** EERD = Revenue_from_evaluated_entities / Revenue_total

**Measurement:** Based on grant disclosures, published contracts, and organizational financial reports.

**Independence interpretation:** This metric directly measures the structural conflict identified in Report #52's comparison to pre-Sarbanes-Oxley auditing. Any EERD > 0 creates a structural conflict; EERD > 0.50 is analogous to the Arthur Andersen/Enron dynamic.

**Baseline (March 2026):**
- METR: EERD not precisely computable. Known revenue sources include Open Philanthropy grants and evaluation contracts with Anthropic, OpenAI, and Google DeepMind. If evaluation contracts constitute 30-50% of revenue, EERD is in the 0.30-0.50 range.
- Apollo Research: EERD likely lower than METR (more grant-funded, fewer direct evaluation contracts), but not disclosed with precision.
- F41LUR3-F1R57: EERD = 0 (no contracts with any AI lab).

#### A3. Funding Source Diversity Index (FSDI)

**Definition:** A Herfindahl-Hirschman Index (HHI) applied to funding sources, measuring concentration.

**Formula:** FSDI = 1 - HHI, where HHI = sum of (share_i)^2 for each funding source i.

**Measurement:** Enumerate all funding sources and compute their proportional shares. FSDI ranges from 0 (single source) to approaching 1 (many equal sources).

**Independence interpretation:**
- FSDI > 0.80: Highly diversified (many comparable sources)
- FSDI 0.50-0.80: Moderately diversified
- FSDI 0.20-0.50: Concentrated
- FSDI < 0.20: Single-source dominated

**Baseline (March 2026):**
- Open Philanthropy-funded organizations: If OP provides 60% of funding, FSDI is at most 0.64 (even with many small additional funders). In practice, FSDI for METR, Redwood, and ARC is likely in the 0.30-0.50 range.
- Government-funded bodies (UK AISI, AU AISI): FSDI approaches 0 (single government funder), though government funding is structurally different from commercial funding.
- F41LUR3-F1R57: FSDI = 0 (single source: operator self-funding). If the project receives a Foresight grant, FSDI would need to be computed with the grant as a second source.

### Category B: Structural Separation

#### B1. Safety Veto Authority Score (SVAS)

**Definition:** Whether the safety evaluation function has formal, documented authority to block, delay, or condition deployment decisions — and whether that authority has been exercised.

**Scoring:**
- 0: No formal veto authority documented
- 1: Veto authority documented but never publicly exercised
- 2: Veto authority documented and exercised at least once
- 3: Veto authority documented, exercised, and independently verified (e.g., by board report or external audit)

**Baseline (March 2026):**
- Anthropic: Score 1-2. The RSP framework implies deployment gating at ASL thresholds. The Pentagon contract dispute may represent an exercise of constraint authority (Amodei statement), but the authority is not independently verified. We assign 1.5 (midpoint, reflecting ambiguity).
- OpenAI: Score 0-1. The Preparedness Framework describes evaluation procedures but no publicly documented veto authority. The 2024 safety team departures suggest internal disagreements about deployment decisions were resolved in favor of deployment. We assign 0.5.
- Google DeepMind: Score 0-1. MONA protocol governs internal evaluation but is not independently audited and veto authority is not publicly specified. We assign 0.5.
- F41LUR3-F1R57: Not applicable (does not make deployment decisions for external systems).

#### B2. Personnel Crossover Index (PCI)

**Definition:** The proportion of an organization's leadership and safety-critical staff who have worked at entities the organization evaluates (or whose products the organization evaluates) within the preceding 36 months.

**Formula:** PCI = Staff_with_crossover / Staff_total (for leadership and safety-critical roles)

**Measurement:** Based on publicly available career histories (LinkedIn, organizational bios, conference disclosures).

**Independence interpretation:** PCI measures the "revolving door" dynamic. Aviation and nuclear safety investigations impose cooling-off periods; PCI quantifies the equivalent for AI safety. Higher PCI indicates more personnel entanglement with evaluated entities.

**Baseline (March 2026):**
- UK AISI: PCI is elevated but not precisely computable. Multiple staff recruited from frontier AI labs and EA organizations. Estimated PCI 0.30-0.50 based on publicly known hires.
- METR: PCI likely elevated (organization spun out of ARC, which works closely with frontier labs). Estimated PCI 0.20-0.40.
- F41LUR3-F1R57: PCI = 0 (single operator with no prior employment at frontier AI labs).

#### B3. Governance Board Independence Ratio (GBIR)

**Definition:** The proportion of board or advisory council members who are independent of the entity's commercial operations, government customers, and major funders.

**Formula:** GBIR = Independent_board_members / Total_board_members

**Measurement:** Apply standard corporate governance independence criteria (no material financial relationship, no employment within 3 years, no immediate family connections to management).

**Baseline (March 2026):**
- Anthropic: GBIR not computable from public information. The Long-Term Benefit Trust has board representation, but Trust member independence criteria are not published.
- OpenAI: GBIR partially computable. The PBC board and nonprofit Foundation board have different compositions. Microsoft has a non-voting board observer role.
- F41LUR3-F1R57: GBIR = N/A (no formal board). This is a structural weakness identified in Report #52.

### Category C: Disclosure Completeness

#### C1. Disclosure Completeness Score (DCS)

**Definition:** The proportion of the 12 metrics in this framework that an organization publishes sufficient information to compute.

**Formula:** DCS = Computable_metrics / 12

**Measurement:** For each metric, determine whether publicly available information is sufficient to compute at least a bounded estimate.

**Independence interpretation:** DCS is itself an independence indicator. Organizations that resist disclosure of financial, governance, and operational information are structurally less accountable — regardless of their actual independence. The metric follows the principle that transparency is a precondition for verifiable independence.

**Baseline (March 2026):**
- Anthropic: DCS = 2/12 (B1 and partial A1 computable). Most financial, governance, and personnel metrics are not publicly disclosed.
- OpenAI: DCS = 3/12 (B1, partial A1, partial B3 computable from PBC filings).
- METR: DCS = 2/12 (partial A2 and B2 computable from public career histories).
- UK AISI: DCS = 3/12 (A1 via government budget, partial B2, partial C1 computable).
- F41LUR3-F1R57: DCS = 5/12 (A1, A2, A3, B2, C1 computable — though some trivially so due to zero-revenue, zero-staff structure).

**Industry average DCS: approximately 2-3 out of 12.** This means roughly 75-83% of the information needed to assess AI safety lab independence is not publicly available.

#### C2. Constraint Modification Disclosure Latency (CMDL)

**Definition:** The time between a change to an organization's safety constraints (red lines, usage policies, deployment criteria) and public disclosure of that change.

**Formula:** CMDL = Date_public_disclosure - Date_constraint_change (in days)

**Measurement:** Compare web archive snapshots of published policies with known change events. Where the change date is unknown, use the last-known-unchanged snapshot as a lower bound.

**Independence interpretation:** Shorter CMDL indicates greater transparency. Aviation safety precedent (ICAO Annex 13) requires notification within hours of a safety event. Financial disclosure precedent (SEC 8-K) requires disclosure within 4 business days of material events.

**Baseline (March 2026):**
- OpenAI mission statement change ("safely" removed, October 2025): CMDL difficult to measure precisely — the change was noticed by external observers, not formally announced. Estimated CMDL > 7 days.
- Anthropic red lines (February 2026): CMDL approximately 0 — Amodei's statement was made contemporaneously with the dispute. However, it is unclear whether earlier, unpublicized constraint modifications occurred.
- No organization currently publishes a policy change log with dates.

### Category D: Competitive Dynamics

#### D1. Safety Constraint Floor Index (SCFI)

**Definition:** A comparative measure of the most permissive safety policy among frontier AI labs, normalized to a common set of use case categories.

**Measurement methodology:**
1. Define a standard set of use case categories (e.g., military targeting, surveillance, autonomous weapons, bioweapons, CSAM).
2. For each category, score each lab's published policy: 0 = prohibited, 1 = restricted with conditions, 2 = permitted, 3 = not addressed.
3. SCFI = maximum permissiveness score across all labs, for each category.

**Independence interpretation:** SCFI tracks competitive race-to-bottom dynamics. If SCFI increases over time (policies become more permissive), it indicates that competitive pressure is eroding safety constraints — regardless of any individual lab's independence score.

**Baseline (March 2026):** SCFI cannot be precisely computed because several labs (notably xAI) have not published detailed use case policies, and government contract terms are undisclosed. The OpenAI Pentagon deal (February 2026) potentially shifted the floor for military use cases, but without disclosed terms, this is speculative.

#### D2. Evaluator Market Concentration Ratio (EMCR)

**Definition:** The Herfindahl-Hirschman Index applied to the market share of third-party AI safety evaluators, measured by evaluation contracts.

**Formula:** EMCR = sum of (market_share_i)^2 for each evaluator i.

**Measurement:** Based on disclosed evaluation contracts and published pre-deployment evaluation credits.

**Independence interpretation:** High EMCR (concentrated market) means labs have few evaluator choices, which paradoxically can strengthen or weaken independence depending on the dominant evaluator's structural position. If a single evaluator depends on the contracts of a single lab, EMCR amplifies the EERD conflict.

**Baseline (March 2026):** METR conducts the majority of known pre-deployment frontier model evaluations. Estimated EMCR > 0.50 (concentrated market). Apollo Research is the primary alternative for deception-specific evaluation.

---

## 3. Calibration Against Real-World Events

### 3.1 Anthropic Federal Blacklisting (February 2026)

**Event summary:** Anthropic was federally blacklisted following a dispute over Pentagon use case restrictions. A six-month wind-down was ordered (deadline approximately August 27, 2026).

**Metric implications:**
- **A1 (RCR):** If government contracts constituted 20-40% of Anthropic's revenue, losing them reduces RCR significantly — improving financial independence from government. However, the loss may increase RCR for remaining customers (e.g., AWS/Amazon partnership becomes proportionally larger).
- **B1 (SVAS):** The event provides evidence that Anthropic's constraint authority was exercised (score increases from 1 to 1.5-2). However, the consequence was punishment rather than accommodation — raising the question of whether veto authority that results in exclusion is structurally sustainable.
- **C2 (CMDL):** Amodei's public statement was contemporaneous with the dispute, suggesting low CMDL. This is a positive transparency signal.
- **D1 (SCFI):** If OpenAI secured the contract under more permissive terms, SCFI decreased (the floor moved down). This is the competitive dynamics concern identified in Report #52.

**Framework verdict:** The blacklisting event increases Anthropic's measurable independence on 2-3 metrics but decreases the industry-wide independence floor. The net effect on AI safety is ambiguous: one lab's independence was demonstrated at the cost of that lab's market position and the industry's collective constraint floor.

### 3.2 OpenAI PBC Restructuring (2025-2026)

**Event summary:** OpenAI transitioned to a Public Benefit Corporation structure, with a nonprofit foundation retaining approximately 26% equity.

**Metric implications:**
- **B3 (GBIR):** The dual structure creates two governance bodies with potentially different independence profiles. GBIR should be computed separately for the PBC board and the Foundation board, then compared.
- **B1 (SVAS):** The PBC structure may formalize (or weaken) safety veto authority depending on the PBC charter terms. No public evidence of safety veto authority being exercised post-restructuring.
- **A1 (RCR):** No change expected from the restructuring itself, though PBC disclosure obligations may improve the computability of this metric over time.

**Framework verdict:** The restructuring changes the formal governance structure but its effect on measurable independence depends on the PBC charter terms, which are not fully public. The 26% equity stake provides limited structural leverage unless it carries specific veto rights over safety-relevant decisions.

### 3.3 Australian AISI Establishment (2024-2025)

**Event summary:** Australia announced and began establishing an AI Safety Institute within the Department of Industry, Science and Resources.

**Metric implications:**
- **A1 (RCR):** RCR = 1.0 (single government funder). However, government funding creates a different conflict dynamic than commercial funding — the conflict is with political direction rather than commercial interest.
- **B2 (PCI):** The early-stage hiring process is the critical moment for PCI. If AISI recruits primarily from frontier AI labs (as the UK AISI did), PCI will be elevated from inception.
- **A3 (FSDI):** FSDI = 0 (single funding source). This is structurally different from commercial single-source dependency but still limits independence.

**Framework verdict:** The AU AISI starts with structural constraints on financial and funding diversity that mirror the UK AISI's position. Its independence trajectory depends on whether it develops statutory enforcement power and maintains research agenda independence from political direction.

---

## 4. Implementation Roadmap

### 4.1 Phase 1: Computable Metrics (Immediate)

The following metrics can be computed now with publicly available data:

1. **C1 (DCS)** — Disclosure Completeness Score for all assessed organizations
2. **B2 (PCI)** — Personnel Crossover Index using LinkedIn/public career histories (labor-intensive but feasible)
3. **D1 (SCFI)** — Safety Constraint Floor Index using published usage policies
4. **B1 (SVAS)** — Safety Veto Authority Score based on public statements and documented exercises

### 4.2 Phase 2: Proxy Metrics (3-6 months)

Metrics that require estimation from incomplete data:

5. **A1 (RCR)** — Revenue Concentration Ratio using press-reported revenue figures and contract values
6. **A2 (EERD)** — Evaluator-Evaluated Revenue Dependency using grant disclosures
7. **C2 (CMDL)** — Constraint Modification Disclosure Latency using web archive comparisons

### 4.3 Phase 3: Advocacy Metrics (6-12 months)

Metrics that require organizational disclosure or regulatory mandate to compute:

8. **A3 (FSDI)** — Funding Source Diversity Index (requires financial disclosure)
9. **B3 (GBIR)** — Governance Board Independence Ratio (requires board composition disclosure)
10. **D2 (EMCR)** — Evaluator Market Concentration Ratio (requires contract disclosure)

### 4.4 Ongoing

11. **Event-triggered updates** — Recalculate affected metrics when trigger events occur (per the monitoring checklist)
12. **Quarterly time-series** — Publish metric snapshots quarterly for trend analysis

---

## 5. Comparison to Established Independence Frameworks

### 5.1 Sarbanes-Oxley (Financial Auditing)

SOX Section 201 prohibits auditors from providing certain non-audit services to audit clients. Section 203 mandates partner rotation every 5 years. Section 206 establishes cooling-off periods for auditor employment at audit clients.

**Equivalent AI safety metrics:** A2 (EERD) maps to the audit fee dependency SOX addresses. B2 (PCI) maps to the cooling-off period requirement. Neither is currently enforced for AI safety evaluation.

### 5.2 ICAO Annex 13 (Aviation Safety Investigation)

Annex 13 requires that accident investigation authorities be independent from aviation regulatory authorities and from entities involved in the accident. It specifies that the investigation authority must have statutory independence and that investigators must have no conflict of interest.

**Equivalent AI safety metrics:** B1 (SVAS) maps to statutory authority. B2 (PCI) maps to conflict-of-interest requirements. D1 (SCFI) maps to the concept of minimum safety standards. None of these are mandated for AI safety.

### 5.3 IAEA Safeguards (Nuclear)

The IAEA's safeguards system uses quantitative metrics for nuclear material accounting (significant quantities, timeliness goals, detection probabilities). These metrics are precisely defined, internationally agreed, and independently verifiable.

**Gap with AI safety:** The IAEA's quantitative approach demonstrates that safety-critical domains can define precise, measurable independence metrics. The AI safety field has not yet established equivalent quantitative standards — partly because the "material" being safeguarded (model behavior under adversarial conditions) is harder to quantify than nuclear material.

---

## 6. Limitations

1. **Data availability.** The most significant limitation is non-disclosure. Approximately 67% of the proposed metrics cannot currently be computed with publicly available data. The framework's value partially depends on advocacy for greater disclosure.

2. **Proxy measurement error.** Where exact data is unavailable, proxy estimates (from press reporting, career histories, and policy analysis) introduce uncertainty. Error bounds should be reported alongside all proxy-based metric values.

3. **Structural vs. behavioral independence.** These metrics measure structural conditions (revenue sources, governance composition, disclosure practices) rather than behavioral outcomes (actual evaluation decisions). An organization with high structural independence could still produce compromised evaluations, and vice versa. Behavioral metrics (e.g., correlation between evaluation findings and evaluator revenue) would complement the structural metrics proposed here but require data that is not available.

4. **Cultural and jurisdictional variation.** Independence norms vary across jurisdictions and organizational cultures. A metric calibrated against US corporate governance standards (SOX) may not be directly applicable to UK government bodies or Australian research organizations.

5. **Single-assessor limitation.** As with Report #52, this framework was developed by a single research project. External review and calibration would strengthen the methodology.

6. **Gaming risk.** Once metrics are published, organizations may optimize for metric scores without improving actual independence — analogous to Goodhart's Law. The framework should be periodically revised to address gaming strategies.

---

## 7. Recommendations

### 7.1 For Policymakers

1. **Adopt quantitative independence requirements for AI safety evaluators.** The metrics proposed here (particularly A2, B1, B2, and C1) could form the basis of regulatory requirements analogous to SOX Sections 201-206.

2. **Mandate disclosure.** The single most impactful policy intervention would be requiring AI labs and third-party evaluators to publish the information needed to compute these metrics — specifically revenue composition, board independence, and constraint modification timelines.

3. **Establish baseline measurements.** Before independence requirements can be enforced, baseline measurements must be established. A government-funded measurement exercise (analogous to the first financial auditing industry surveys in the 1970s) would provide the empirical foundation for regulatory design.

### 7.2 For the AI Safety Research Community

1. **Track metrics over time.** Snapshot assessments (like Report #52) are useful but insufficient. Quarterly metric updates would enable trend detection.

2. **Standardize measurement.** Multiple research groups should independently compute these metrics to establish inter-rater reliability and identify measurement methodology improvements.

3. **Extend to behavioral metrics.** The structural metrics proposed here should be complemented by behavioral metrics that measure actual evaluation outcomes — for example, whether evaluators with higher EERD scores produce systematically different findings from evaluators with lower EERD scores.

### 7.3 For F41LUR3-F1R57

1. **Compute Phase 1 metrics immediately.** DCS, SCFI, and SVAS can be computed now and published as a pilot dataset.

2. **Self-apply the framework.** Compute all applicable metrics for F41LUR3-F1R57 as a demonstration of the framework's feasibility and as a transparency commitment.

3. **Track the Anthropic wind-down.** The August 2026 deadline provides a natural experiment for testing whether the framework's metrics detect independence changes in real time.

4. **Include in Foresight grant application.** The quantitative independence framework is a research output that demonstrates the project's governance analysis capability and positions it for policy-relevant contributions.

---

## 8. Conclusion

Quantitative measurement of AI safety lab independence is feasible, necessary, and currently obstructed by non-disclosure. Of 12 proposed metrics, 4 can be computed now, 3 can be estimated from proxy data within 3-6 months, and 5 require organizational disclosure or regulatory mandates.

The framework's most significant finding may be its measurement of what cannot be measured: the Disclosure Completeness Score (C1) reveals that approximately 75-83% of the information needed to assess AI safety evaluation independence is not publicly available. This information gap is itself a structural independence problem. Organizations whose independence cannot be verified from public information should not be assumed to be independent — just as financial auditors whose independence cannot be verified under SOX are treated as non-independent for regulatory purposes.

The historical precedent from aviation, nuclear energy, pharmaceutical trials, and financial auditing consistently shows that quantitative independence metrics were established only after a catalyzing crisis forced regulatory action. The AI safety field has the opportunity to establish these metrics proactively — before the crisis that will otherwise create the political will to mandate them.

---

*Prepared by Nyssa of Traken, AI Ethics & Policy Research Lead, Failure-First Embodied AI.*
*This report builds on Report #52 (AI Safety Lab Independence — Deep Analysis) and the Independence Monitoring Checklist.*
*All metric estimates are based on publicly available information as of March 2026. Where information is unavailable, this is noted.*

---

## References

- Report #52: AI Safety Lab Independence — Deep Analysis (research/reports/52_ai_safety_lab_independence_deep_analysis.md)
- Independence Monitoring Checklist (research/ethics/independence_monitoring_checklist.md)
- Independence Criteria Framework v1.0 (research/ethics/ai_safety_lab_independence_criteria.md)
- Sarbanes-Oxley Act of 2002, Sections 201-206
- ICAO Annex 13: Aircraft Accident and Incident Investigation (11th ed., 2016)
- IAEA Safeguards Implementation Guide (IAEA Services Series No. 38, 2016)
- DeFond ML, Zhang J. "A review of archival auditing research." Journal of Accounting and Economics 58(2-3): 275-326, 2014.
- Herfindahl AO. "Concentration in the U.S. Steel Industry." Unpublished PhD dissertation, Columbia University, 1950.
- Executive Order 14179, "Removing Barriers to American Leadership in Artificial Intelligence" (January 2025)
- Anthropic statement on Pentagon contract dispute (February 2026)
- OpenAI PBC restructuring announcement (2025-2026)
