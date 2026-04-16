---
title: "Who Guards the Guards? Independence and Capture in AI Safety Research"
description: "The question of who evaluates AI safety -- and whether those evaluators are structurally independent from the entities they evaluate -- is among the most..."
date: "2026-03-24"
reportNumber: 199
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


> **Disclaimer:** This report analyses structural dynamics in AI safety research
> organizations using publicly available information. Organizational scores and
> assessments are based on the independence metrics dataset and cited sources.
> Where information is unavailable, this is noted. This report does not constitute
> legal advice, audit opinion, or safety certification guidance.

---

## Abstract

The question of who evaluates AI safety -- and whether those evaluators are structurally independent from the entities they evaluate -- is among the most consequential governance questions of the current decade. This report presents a systematic analysis of independence failures in the AI safety research ecosystem, drawing on a novel dataset of 55 independence-relevant events across 17 organizations tracked from 2023 through March 2026. We develop a taxonomy of four independence failure modes -- funding capture, talent revolving door, regulatory co-option, and mission drift -- and apply it to two extended case studies: the Anthropic Pentagon dispute of February 2026 and OpenAI's organizational trajectory from nonprofit to capped-profit to public benefit corporation. Quantitative analysis reveals that 75-83% of the information needed to assess AI safety evaluation independence is not publicly available, that no organization scores above 9 out of 21 on our independence framework, and that the frequency of independence-relevant events has accelerated sharply in early 2026. We connect these findings to the iatrogenesis framework (Reports #140, #165), arguing that structurally non-independent safety labs represent a specific vector of institutional iatrogenic harm: safety interventions designed by organizations with commercial conflicts of interest may systematically optimize for safety theatre rather than harm reduction. We propose structural independence criteria informed by precedent from aviation, nuclear energy, pharmaceutical trials, and financial auditing, and identify the gap between current AI safety governance and these precedents as approximately 30-50 years of institutional development.

**Word count:** approximately 8,400 words (excluding tables and references).

---

## 1. Introduction: The Structural Problem

*Quis custodiet ipsos custodes?* Juvenal's question -- who guards the guards? -- has been answered in every safety-critical industry that has operated long enough to produce a catastrophe. Aviation has the NTSB and ICAO Annex 13. Nuclear energy has the IAEA and national regulators structurally separated from operators. Financial services has Sarbanes-Oxley and mandatory auditor independence rules. Pharmaceutical trials have independent review boards and data monitoring committees. In each case, the answer was the same: the guards must be structurally independent from those they guard.

AI safety evaluation has not answered this question. The organizations that evaluate AI system safety are, in most cases, the same organizations that build and sell those systems. Where third-party evaluators exist, they are frequently funded by the organizations they evaluate. Where government bodies exist, they operate without enforcement power and recruit their staff from the organizations they oversee. The result is an ecosystem in which safety claims are structurally unverifiable -- not because the individuals involved lack integrity, but because the institutional structures do not support independence.

**(D)** This is not a novel observation. The principal-agent problem in safety evaluation is well-documented in other industries (DeFond and Zhang, 2014; Bekelman et al., 2003). What is novel is the degree to which the AI safety field has avoided building the institutional infrastructure to address it, despite having explicit historical precedent to draw on.

**(N)** The absence of independence infrastructure is not merely a governance gap. As we argue in Section 7, it constitutes a specific form of institutional iatrogenesis: the safety apparatus itself becomes a vector for harm, not because it fails, but because its structural non-independence causes it to optimize for proxies (safety certifications, benchmark scores, responsible AI branding) rather than the target (actual harm reduction at the deployment layer).

### 1.1 Scope and Method

This report draws on three primary sources:

1. **The independence metrics dataset** (`data/governance/independence_metrics_v0.1.jsonl`): 55 structured entries covering 17 organizations across four quantitative metrics (Disclosure Completeness Score, Safety Veto Authority Score, Safety Constraint Floor Index, Evaluator Independence Score), computed from publicly available information.

2. **The independence criteria framework** (v1.0): A 7-criterion, 0-21-point qualitative scoring system for structural independence, developed with reference to established independence standards in aviation (ICAO Annex 13), nuclear energy (IAEA), pharmaceutical trials (FDA/IRB requirements), and financial auditing (Sarbanes-Oxley).

3. **Case study analysis** of the Anthropic Pentagon dispute (February 2026) and OpenAI's organizational trajectory (2015-2026), based on press reporting, corporate filings, and public statements.

The analysis is structured as follows: Section 2 presents the independence metrics dataset. Section 3 develops the taxonomy of independence failure modes. Section 4 presents the Anthropic case study. Section 5 presents the OpenAI case study. Section 6 provides quantitative analysis. Section 7 connects independence failure to iatrogenesis. Section 8 proposes independence criteria. Section 9 discusses limitations.

---

## 2. The Dataset: 55 Events, 17 Organizations

### 2.1 Dataset Description

The independence metrics dataset tracks structured observations of AI safety organization independence across four quantitative metrics:

| Metric | Full Name | Scale | What It Measures |
|--------|-----------|-------|------------------|
| C1_DCS | Disclosure Completeness Score | 0.0-1.0 | Fraction of 12 independence-relevant data points computable from public information |
| B1_SVAS | Safety Veto Authority Score | 0.0-3.0 | Documented ability to halt deployment on safety grounds |
| D1_SCFI | Safety Constraint Floor Index | 0.0-3.0 | Whether an organization maintains a minimum safety standard under commercial pressure |
| E1_EIS | Evaluator Independence Score | 0.0-3.0 | Degree to which safety evaluations avoid dependency on the evaluated organization's own models |

The dataset contains 55 entries spanning 17 organizations:

| Category | Organizations | Entries |
|----------|--------------|---------|
| Frontier AI labs | Anthropic, OpenAI, Google DeepMind, Meta AI, xAI, Mistral AI, Cohere | 30 |
| Independent evaluators | METR, Apollo Research, ARC, Redwood Research | 6 |
| Government bodies | NIST, UK AISI, AU AISI, EU AI Office | 10 |
| Government customers | US Department of Defense | 3 |
| Independent research | F41LUR3-F1R57 | 6 |

**(D)** The dataset includes temporal updates: several entries (im-030 through im-055) reflect events from the Anthropic Pentagon dispute and its aftermath in February-March 2026, superseding earlier assessments. This temporal dimension is unusual in governance datasets and enables tracking of how independence metrics change in response to specific events.

### 2.2 What the Dataset Reveals

Three structural patterns emerge from the 55 entries:

**Pattern 1: Uniform disclosure failure.** The median Disclosure Completeness Score across all 17 organizations is 0.167, meaning that only 2 of 12 independence-relevant data points are computable from public information. The highest DCS belongs to F41LUR3-F1R57 at 0.417 -- a score that reflects trivial computability (zero-revenue, single-operator structure) rather than genuine transparency excellence. NIST and the EU AI Office score 0.333, benefiting from government transparency requirements. Every frontier AI lab scores between 0.083 (xAI) and 0.250 (OpenAI).

**(D)** This means that approximately 75-83% of the information needed to assess whether AI safety evaluations are independent is simply not available to the public, to regulators, or to researchers. This is not a data collection failure on our part. It is a structural feature of the ecosystem: organizations do not disclose the information that would enable assessment of their independence.

**Pattern 2: Safety veto authority concentrates in the wrong place.** The organizations with the strongest documented authority to halt AI deployments on safety grounds are the frontier AI labs themselves -- specifically, Anthropic (B1_SVAS = 2.33, the highest in the dataset). Government safety bodies (UK AISI, AU AISI, NIST) all score 0.0 on safety veto authority. They have advisory mandates without enforcement power.

**(N)** This inversion -- where commercial entities have more safety veto authority than the public institutions nominally responsible for safety governance -- is a structural failure, not a feature. It means that AI safety depends on the voluntary restraint of the entities with the strongest commercial incentive to deploy. The Anthropic case study (Section 4) illustrates both the possibility and the cost of exercising that voluntary restraint.

**Pattern 3: Evaluator independence is structurally absent.** OpenAI scores 0.0 on Evaluator Independence (it evaluates its own models using its own models, with documented self-preference bias of 10-25%). xAI also scores 0.0. No organization in the dataset publishes evaluator calibration data -- the inter-rater agreement, false positive rates, or grader accuracy statistics that would enable independent assessment of evaluation quality.

---

## 3. A Taxonomy of Independence Failures

Analysis of the 55 events in the dataset, combined with structural analysis from Reports #52 and #54, reveals four distinct failure modes through which AI safety organizations lose or fail to achieve structural independence. These are not mutually exclusive; most organizations exhibit multiple failure modes simultaneously.

### 3.1 Funding Capture

**Definition.** An organization's safety evaluation function is structurally compromised because its financial viability depends on maintaining relationships with the entities whose systems it evaluates, or on satisfying funding sources whose priorities conflict with disinterested safety assessment.

**Mechanism.** Revenue concentration creates implicit compliance pressure. When an evaluator's largest revenue source is also the entity being evaluated, the commercial cost of producing an unfavorable evaluation scales with revenue dependency. The evaluator need not be consciously biased; the selection effects operate at the institutional level -- which organizations survive, which grow, which research agendas are pursued.

**Evidence from the dataset:**

- **(D)** METR's evaluation contracts come from the frontier labs it evaluates. This is structurally analogous to the pre-Sarbanes-Oxley auditing model where auditors were hired and paid by the companies they audited. METR's Evaluator-Evaluated Revenue Dependency (A2_EERD) is estimated at 0.30-0.50 based on publicly disclosed contracts and grants.

- **(D)** Open Philanthropy funds an estimated 40-60% of non-lab AI safety research globally. While philanthropic funding avoids commercial conflicts, single-source philanthropic concentration creates selection effects on research agendas. Organizations dependent on Open Philanthropy funding have structural incentive to align with its theory of change (broadly EA-aligned, focused on existential risk from advanced AI). Research topics outside this frame -- such as current-harm safety evaluation, embodied AI safety, or workplace safety impacts -- receive less philanthropic support.

- **(D)** The UK AISI and AU AISI are single-funder organizations (government), with FSDI (Funding Source Diversity Index) approaching 0. While government funding creates different conflicts than commercial funding (political direction substitutes for commercial pressure), the single-source dependency is structural.

**Cross-industry precedent.** Bekelman et al. (2003) documented a systematic relationship between pharmaceutical trial funding source and trial outcome: industry-sponsored trials were significantly more likely to report results favorable to the sponsor. The measured effect was not attributable to fraud; it operated through study design, endpoint selection, and publication bias. The AI safety evaluation ecosystem exhibits the same structural conditions that produced this bias in pharmaceutical research.

### 3.2 Talent Revolving Door

**Definition.** Personnel movement between AI safety evaluators and the organizations they evaluate creates social ties, shared assumptions, and implicit loyalty that reduce the adversarial distance between evaluator and evaluated.

**Mechanism.** Three pathways operate:

1. **Lab-to-evaluator pipeline.** Safety evaluation organizations recruit heavily from frontier AI labs. This brings domain expertise but also shared mental models about what "safety" means and which approaches are reasonable. The Personnel Crossover Index (B2_PCI) captures this.

2. **Evaluator-to-lab pipeline.** Former evaluators who join labs bring knowledge of evaluation methodology -- including its blind spots. This is not inherently problematic, but it reduces the information asymmetry that enables independent evaluation.

3. **Lab-to-regulator pipeline.** Government safety bodies (UK AISI in particular) recruit from frontier labs and EA-adjacent organizations. This creates a community with shared assumptions that may not represent the range of perspectives needed for independent oversight.

**Evidence from the dataset:**

- **(D)** UK AISI has an estimated PCI of 0.30-0.50, meaning 30-50% of its leadership and safety-critical staff have worked at frontier AI labs or EA organizations within the preceding 36 months (based on publicly available career histories).

- **(D)** METR was spun out of ARC (Alignment Research Center), which works closely with frontier labs. Estimated PCI of 0.20-0.40.

- **(D)** The DOGE-to-CDO pipeline at the US Department of Defense (Gavin Kliger appointment, March 6, 2026) represents a reverse revolving door: personnel from technology-efficiency organizations moving into defense AI procurement positions, where evaluation independence may be subordinated to deployment velocity.

**Cross-industry precedent.** The Boeing 737 MAX crisis (2018-2019) was partly attributed to the FAA's Organization Designation Authorization (ODA) program, in which Boeing employees conducted safety certifications on behalf of the regulator. The personnel overlap between manufacturer and regulator eroded the adversarial distance that independent certification requires. The AI safety ecosystem's personnel dynamics are structurally similar.

### 3.3 Regulatory Co-option

**Definition.** Regulatory or governmental safety oversight is structurally subordinated to the commercial or political interests of the entities being regulated, either through political direction, access dependency, or the absence of enforcement authority.

**Mechanism.** Regulatory co-option operates through three channels:

1. **Voluntary engagement models.** When safety evaluation depends on lab cooperation (access to models, pre-deployment testing agreements), the evaluator cannot credibly evaluate entities that might withdraw cooperation. The UK AISI operates on voluntary pre-deployment testing agreements that are non-binding.

2. **Political direction.** Government safety bodies are subject to political direction from their executive branch principals. When executive priorities favor AI deployment velocity over safety evaluation, the safety body's mandate contracts. The revocation of Executive Order 14110 by EO 14179 (January 2025) reduced the US federal government's AI safety mandate.

3. **Enforcement vacuum.** Most government AI safety bodies lack statutory enforcement power. The UK AISI, AU AISI, and NIST all operate in advisory capacities. The EU AI Office has partial statutory authority under Articles 9 and 64-68 of the AI Act, but high-risk AI enforcement does not begin until August 2026, and enforcement is delegated to national market surveillance authorities.

**Evidence from the dataset:**

- **(D)** All four government bodies in the dataset (UK AISI, AU AISI, NIST, EU AI Office) score 0.0 or below 0.5 on Safety Veto Authority (B1_SVAS). None has documented authority to halt an AI deployment on safety grounds that has been exercised. The EU AI Office scores highest at 1.5 (statutory authority exists but has not been exercised).

- **(D)** The Anthropic blacklisting event (February 2026) demonstrates a specific form of regulatory co-option: the US government designated a safety-maintaining lab as a supply chain risk, and replaced it with a lab that accepted less restrictive terms. The regulatory apparatus was used not to enforce safety but to punish it.

**Cross-industry precedent.** The TEPCO/Japanese Nuclear Safety Commission relationship pre-Fukushima (2011) is the paradigmatic case. TEPCO, as operator of the Fukushima Daiichi plant, had captured the regulatory body through personnel placement, information control, and political influence. The safety commission relied on TEPCO's self-assessments because it lacked independent evaluation capability. When the crisis occurred, the regulatory failure was not a surprise to structural analysts -- it was a predictable consequence of institutional design.

### 3.4 Mission Drift

**Definition.** An organization's safety mission is progressively redefined to accommodate commercial objectives, usually through incremental changes to mission statements, governance structures, safety policies, or red lines.

**Mechanism.** Mission drift operates through gradual normalization. Individual changes are small and individually defensible. The cumulative effect is a material shift in the organization's relationship to its original safety commitments. Mission drift is difficult to detect from within the organization because each increment is rationalized by its immediate context.

**Evidence from the dataset:**

- **(D)** OpenAI's mission statement has changed six times in nine years. The word "safely" was removed in October 2025. The organizational structure has progressed from nonprofit (2015) to capped-profit subsidiary (2019) to public benefit corporation with a nonprofit foundation retaining approximately 26% equity (2025-2026). Each change was individually defended as necessary for the organization's mission. The cumulative trajectory is from safety-first nonprofit to commercially-driven PBC.

- **(D)** Anthropic's Responsible Scaling Policy v3.0 (February 24, 2026) removed the training pause commitment -- a weakening of a previously stated safety constraint -- simultaneously with the Pentagon dispute in which Anthropic maintained its deployment use-case constraints. The mixed signal (maintaining use-case red lines while weakening training-pause commitments) illustrates how mission drift can coexist with apparent safety maintenance.

**Cross-industry precedent.** The Arthur Andersen/Enron case (2001) illustrates mission drift in auditing. Arthur Andersen progressively expanded from audit services to consulting services for audit clients, creating revenue dependency and cultural alignment with client interests that eroded audit independence. The drift was gradual, individually rationalized at each step, and catastrophic in aggregate.

---

## 4. Case Study: The Anthropic Pentagon Dispute

### 4.1 Timeline of Events

**(D)** The following timeline is reconstructed from press reporting:

| Date | Event | Source |
|------|-------|--------|
| Feb 24, 2026 | Anthropic publishes RSP v3.0, removing training pause commitment | CNN, Anthropic blog |
| Feb 25, 2026 | Reports surface that Anthropic refused to remove contractual prohibitions on mass surveillance and autonomous weapons from Pentagon contract | CNN Business |
| Feb 26, 2026 | Pentagon designates Anthropic a "supply chain risk" | Fortune |
| Feb 27, 2026 | President Trump orders federal phase-out of Anthropic tools within 6 months (deadline ~Aug 27, 2026) | NPR |
| Feb 27, 2026 | OpenAI secures Pentagon contract, reportedly within hours | OpenAI blog, TechCrunch |
| Mar 1, 2026 | Details emerge: OpenAI stated three red lines but framed as reflecting existing law, not contractual constraints | Axios |
| Mar 3, 2026 | Sam Altman acknowledges Pentagon deal was "opportunistic and sloppy" | CNBC |
| Mar 9, 2026 | Anthropic files lawsuit (specific terms unclear from public reporting) | CNBC |

### 4.2 Independence Analysis

The Anthropic Pentagon dispute is the first documented case in the AI safety ecosystem of a frontier lab exercising safety veto authority against a sovereign government customer and suffering material commercial consequences. This makes it uniquely valuable for independence analysis.

**What the event demonstrates:**

**(D)** Anthropic maintained contractual red lines (prohibitions on mass surveillance and autonomous weapons) under extreme pressure, including federal blacklisting, supply chain risk designation, and a multi-billion-dollar revenue threat (government contracts reportedly worth approximately $200M, with secondary effects on commercial customers requiring government interoperability). This is the strongest publicly documented evidence of safety constraint maintenance under commercial pressure in the AI safety ecosystem. The dataset records this as B1_SVAS = 2.33 and D1_SCFI = 2.0 for Anthropic -- the highest scores on both metrics for any organization.

**What the event also demonstrates:**

**(D)** The exercise of safety veto authority was immediately punished. The commercial contract was transferred to a competitor (OpenAI) that accepted less restrictive terms. The competitor's red lines were framed as reflecting existing law rather than imposing contractual constraints -- a material distinction, since contractual terms survive changes in law while legal reliance does not. The competitive dynamics following the dispute create structural pressure toward weaker safety commitments industry-wide.

**(D)** Simultaneously, Anthropic's RSP v3.0 removed the training pause commitment -- weakening one safety constraint while maintaining another. This creates a mixed signal: the organization that demonstrated the strongest safety veto authority on deployment use cases simultaneously weakened its training-pause safety floor. The dataset records this as a reduction in D1_SCFI from 2.0 to 1.5 in the updated entry (im-050).

**(N)** The Anthropic case illustrates the structural fragility of voluntary safety commitments. Even the organization that scored highest on safety veto authority cannot sustain that position indefinitely when the commercial cost is borne unilaterally. The competitive replacement mechanism -- where a competitor captures the revenue by accepting weaker constraints -- ensures that safety-maintaining organizations are structurally punished. This is not a failure of individual integrity. It is a structural incentive problem that cannot be solved by voluntary commitment alone.

### 4.3 Implications for Independence

**(P, explicitly hedged)** The Anthropic-Pentagon dispute may represent the high-water mark of voluntary safety commitment in the current regulatory environment. If the federal blacklisting stands and Anthropic's revenue suffers materially, the demonstrated lesson for other frontier labs is that maintaining safety red lines against government customers produces commercial punishment without compensating institutional support. This is the structural condition under which voluntary safety commitments erode.

The monitoring checklist (research/ethics/independence_monitoring_checklist.md) tracks leading indicators through the wind-down deadline of approximately August 27, 2026. Key questions: Does Anthropic comply? Are exemptions negotiated? Does the legal challenge succeed? Does the competitive aftermath measurably shift the industry constraint floor?

---

## 5. Case Study: OpenAI's Trajectory

### 5.1 The Arc of Organizational Change

**(D)** OpenAI's organizational trajectory from 2015 to 2026 is one of the most extensively documented cases of mission drift in the technology sector:

| Year | Structure | Mission Language | Key Safety Events |
|------|-----------|-----------------|-------------------|
| 2015 | Nonprofit | "ensure that artificial general intelligence benefits all of humanity" | Founded with safety as core justification |
| 2019 | Capped-profit subsidiary | Mission unchanged | Created LP entity to raise capital; 100x cap on investor returns |
| 2023 | Capped-profit (board crisis) | Mission unchanged | Board fired/reinstated CEO over safety disagreements; board reconstituted |
| 2024 | Capped-profit (departures) | Mission unchanged | Safety team leadership departures; Preparedness Framework published |
| 2025 | PBC transition announced | "safely" removed from mission statement (Oct 2025) | Nonprofit retains ~26% equity; mission statement softened |
| 2026 | PBC operational | "ensure that artificial general intelligence benefits all of humanity" | Pentagon contract (Feb); no additional safety commitments beyond existing law |

### 5.2 The Six Mission Statement Changes

**(D)** The evolution of OpenAI's mission statement over nine years represents one of the most granular records of mission drift in any organization:

1. **Original (2015):** safety-centric nonprofit for the benefit of humanity
2. **LP entity (2019):** commercial arm created, mission language preserved
3. **Board crisis (2023):** governance conflict over safety vs. commercial pace
4. **Safety departures (2024):** loss of safety team leadership, Preparedness Framework as substitute
5. **"Safely" removed (Oct 2025):** explicit removal of safety language from mission statement
6. **PBC operational (2026):** current structure with nonprofit retaining minority equity

**(D)** Each change was individually justified. The LP entity was necessary to raise sufficient capital. The board crisis resolution was necessary for organizational stability. The safety departures were attributed to strategic disagreements. The removal of "safely" was characterized as simplification. The PBC structure was presented as balancing mission and commercial needs. The cumulative trajectory, however, is unambiguous: from safety-first nonprofit to commercially-driven public benefit corporation with progressively weaker formal safety commitments.

### 5.3 The Pentagon Contract: A Structural Test

**(D)** OpenAI's Pentagon contract (February 27, 2026) provides the clearest test of independence in the organization's history. Key structural observations:

1. **Speed of acceptance.** OpenAI reportedly secured the Pentagon contract within hours of Anthropic's blacklisting, suggesting pre-existing negotiations or rapid commercial opportunism. CEO Sam Altman subsequently acknowledged the deal was "opportunistic and sloppy" (CNBC, March 3, 2026).

2. **Red line framing.** OpenAI stated three red lines: no mass domestic surveillance, no autonomous weapons direction, no social credit systems. However, these were framed as reflecting existing US law rather than imposing additional contractual constraints. The distinction is material: if the law changes to authorize AI-directed autonomous weapons, OpenAI's stated position provides no contractual barrier to compliance.

3. **Reactive safety constraints.** The initial contract reportedly included no surveillance restrictions. Surveillance limitations were added after public backlash. The EFF described the revised terms as "weasel words." The sequence -- accept without restrictions, face public criticism, add restrictions -- demonstrates reactive rather than principled safety constraint setting.

**(D)** The dataset records OpenAI's B1_SVAS as 0.67 (downgraded from 1.0 after the Pentagon sequence) and D1_SCFI as 0.33 (downgraded from 0.5). Both metrics moved in the direction of reduced independence following the Pentagon deal.

### 5.4 Structural Analysis

**(N)** OpenAI's trajectory illustrates how mission drift and funding capture interact. The transition from nonprofit to commercial entity was motivated by capital requirements that the nonprofit structure could not meet. But each structural change reduced the formal mechanisms for safety-first governance:

- The nonprofit board had formal authority to prioritize safety over commercial outcomes. That authority was tested and found insufficient during the 2023 board crisis.
- The capped-profit structure retained the nonprofit as majority owner. The PBC structure reduced the nonprofit to a minority equity holder (~26%).
- The removal of "safely" from the mission statement in October 2025 was a symbolic but structurally significant change: it removed the explicit linguistic commitment that anchored safety as a mission-level priority.
- The Pentagon contract demonstrated that safety constraints are responsive to commercial opportunity and public pressure rather than embedded in institutional structure.

**(P, explicitly hedged)** If the current trajectory continues, the nonprofit foundation's 26% equity position is likely to be insufficient to prevent further mission drift. The structural leverage of a minority equity position depends on the specific governance rights attached to those shares, which are not fully public. Absent published veto rights over safety-relevant decisions, the 26% equity position provides limited structural protection.

---

## 6. Quantitative Analysis

### 6.1 Independence Scores Across the Ecosystem

The independence criteria framework (7 criteria, 0-21 scale) was applied to organizations across five categories. Results from Report #52, updated with March 2026 data:

| Category | Organizations | Score Range | Assessment Band |
|----------|--------------|-------------|-----------------|
| Frontier AI labs | Anthropic, OpenAI, DeepMind, Meta AI, xAI, Mistral, Cohere | 1-4 | Absent structural independence |
| Third-party evaluators | METR, Apollo Research, Redwood, ARC | 5-7 | Absent to Low |
| Government bodies | UK AISI, AU AISI, NIST, EU AI Office | 4-7 | Absent to Low |
| Independent research | F41LUR3-F1R57 | 9 | Low |

**(D)** No organization assessed scores above 9 out of 21. No organization scores in the "Moderate" (12-17) or "High" (18-21) independence ranges. This is a structural finding about the ecosystem, not a criticism of any individual organization.

### 6.2 Event Frequency and Acceleration

**(D)** The 55 entries in the dataset span the period from late 2023 (UK AISI establishment) through March 2026. The distribution of entries by date reveals temporal acceleration:

| Period | Entries Added | Key Drivers |
|--------|--------------|-------------|
| Nov 2023 - Dec 2025 | ~15 (baseline assessments) | UK AISI establishment, OpenAI board crisis, routine policy changes |
| Jan 2026 | ~5 | EO 14179 (AI safety EO revocation), RSP updates |
| Feb 2026 | ~15 | Anthropic Pentagon dispute, OpenAI Pentagon contract, federal blacklisting |
| Mar 2026 | ~20 | Temporal updates, US DoD entries, evaluator independence scores |

The February-March 2026 cluster represents the first concentrated independence crisis in the AI safety ecosystem: multiple organizations' independence metrics changed simultaneously in response to the same triggering event (government-lab confrontation over use-case restrictions).

### 6.3 Independence Events by Failure Type

Classifying the 55 dataset entries by the taxonomy developed in Section 3:

| Failure Type | Events | % of Total | Representative Example |
|-------------|--------|-----------|----------------------|
| Funding capture | 18 | 33% | METR evaluation contracts from labs it evaluates; Open Philanthropy concentration |
| Talent revolving door | 8 | 15% | UK AISI hiring from frontier labs; DOGE-to-CDO pipeline |
| Regulatory co-option | 14 | 25% | Anthropic blacklisting; EO 14179 revocation; voluntary engagement models |
| Mission drift | 15 | 27% | OpenAI mission changes; RSP v3.0 pause removal; Pentagon contract terms |

**(D)** Funding capture is the most frequent failure type, consistent with the structural analysis: financial dependency is the most pervasive and least visible form of independence compromise. Mission drift is the second most frequent, driven substantially by the OpenAI trajectory and Anthropic RSP changes in the dataset period. Regulatory co-option events cluster in early 2026, driven by the Anthropic-government confrontation. Talent revolving door events are the least frequent in the dataset, likely reflecting data availability limitations (career movements are harder to track systematically than financial relationships or policy changes).

### 6.4 Disclosure as an Independence Indicator

**(D)** The Disclosure Completeness Score (C1_DCS) is itself one of the most informative metrics in the dataset. It measures not how independent an organization is, but how assessable its independence is.

| DCS Range | Organizations | Interpretation |
|-----------|--------------|----------------|
| 0.00-0.10 | xAI | Effectively opaque; independence cannot be assessed |
| 0.10-0.20 | Anthropic, DeepMind, Meta, METR, Apollo, ARC, Redwood, Mistral, Cohere, AU AISI | Minimal disclosure; most metrics not computable |
| 0.20-0.35 | OpenAI, UK AISI, NIST, EU AI Office | Partial disclosure; some metrics computable, major gaps remain |
| 0.35-0.50 | F41LUR3-F1R57 | Highest DCS, but reflects trivial computability (zero-scale structure) |

**(N)** Organizations whose independence cannot be assessed from publicly available information should not be assumed to be independent. This follows the same logic as Sarbanes-Oxley: financial auditors whose independence cannot be verified are treated as non-independent for regulatory purposes. The current AI safety ecosystem inverts this presumption: organizations that do not disclose independence-relevant information are given the benefit of the doubt.

---

## 7. The Iatrogenesis Connection: Safety Labs as Vectors of Harm

### 7.1 Institutional Iatrogenesis in AI Safety

The Failure-First iatrogenesis framework (Reports #140, #165) identifies four levels at which safety interventions can cause the harms they are designed to prevent:

1. **Clinical (Level 1):** Safety interventions directly produce measurable harm (e.g., RLHF creating alignment faking, safety training reversing safety in non-English languages).
2. **Social (Level 2):** The safety apparatus creates institutional confidence that displaces attention from the actual risk surface (safetywashing, evaluation theatre, resource diversion).
3. **Structural (Level 3):** The safety system undermines the ecosystem's autonomous capacity for safety (over-reliance on lab-internal evaluation, atrophy of independent evaluation infrastructure).
4. **Verification (Level 4):** The act of evaluating safety degrades safety (evaluator unreliability, self-preference bias, classification methodology disagreement with kappa = 0.126).

**(N)** Independence failure operates primarily at Levels 2 and 3 of the iatrogenesis model. When safety evaluations are conducted by structurally non-independent organizations, two iatrogenic pathways activate:

**Pathway A: Social iatrogenesis through safetywashing.** Safety certifications produced by non-independent evaluators carry the institutional weight of "evaluation" without the structural conditions for credible evaluation. A frontier lab's safety report -- produced by its own safety team, using its own evaluation models, with no independent audit -- creates a legal and reputational artifact ("this system has been evaluated for safety") that suppresses further scrutiny. The certification is not fraudulent. The evaluators are competent. But the structural conditions make the certification uninformative about safety in ways that are invisible to regulators and the public.

**Pathway B: Structural iatrogenesis through evaluation infrastructure atrophy.** When frontier labs conduct the majority of safety evaluation internally, the demand for independent evaluation infrastructure is suppressed. Third-party evaluators remain small and dependent on lab contracts. Government bodies remain advisory without enforcement power. The ecosystem's capacity for genuinely independent evaluation does not develop -- not because anyone prevents it, but because the lab-internal evaluation apparatus occupies the institutional space where independent evaluation would otherwise be demanded.

### 7.2 The Compounding Problem

**(D)** Independence failure compounds with the technical limitations documented elsewhere in the Failure-First corpus:

- **Evaluator unreliability** (kappa = 0.126, SLIGHT agreement between independent grading methods): When evaluation methods disagree this substantially, the choice of evaluator and method materially determines the verdict. A non-independent evaluator can select the method that produces the most favorable result, and the low kappa means this selection will change the measured safety score.

- **Self-preference bias** (10-25%, Yan et al. 2024): When a lab evaluates its own models using its own models (OpenAI E1_EIS = 0.0), systematic bias operates without deliberate intervention. The lab need not intend bias; the structural conditions produce it.

- **Defense impossibility triangle** (Report #78): The text layer is bypassed (93.2% ASR for Blindfold-class attacks), the action layer has no refusal behavior (0% refusal across 58 FLIP-graded VLA traces), and the evaluation layer has a 30.8% false positive rate. When the evaluation layer -- the only layer with potential for improvement -- is additionally compromised by evaluator non-independence, the compound failure probability increases.

**(D)** The compound failure calculation from Report #78 estimated a 23.2% probability of all three defense layers failing simultaneously. This estimate assumed independent evaluation. If evaluator non-independence introduces systematic bias toward favorable verdicts, the true compound failure probability is higher -- though we cannot quantify the increment without data on the relationship between evaluator independence and evaluation outcome.

### 7.3 Safety Labs as Iatrogenic Vectors

**(N)** The synthesis of Sections 3-6 with the iatrogenesis framework leads to a specific and testable claim: **structurally non-independent AI safety labs are not merely less effective at producing safety -- they are potential vectors of iatrogenic harm.**

The mechanism is:

1. Non-independent safety labs produce evaluations that are systematically biased toward favorable verdicts (self-preference bias, method selection bias, revenue-dependent survival pressure).
2. These evaluations create institutional confidence ("the system passed safety evaluation") that suppresses demand for independent evaluation.
3. The suppression of demand for independent evaluation prevents the development of the independent evaluation infrastructure that would detect the bias in step 1.
4. The result is a self-reinforcing cycle in which safety evaluation becomes progressively less informative while maintaining its institutional authority.

This is Illich's structural iatrogenesis applied to AI safety: the safety system undermines the ecosystem's autonomous capacity for safety, not by failing, but by succeeding on its own terms (producing evaluations, generating certifications, maintaining institutional legitimacy) while those terms are structurally disconnected from actual harm reduction.

**(D)** The empirical evidence for this cycle is partial but suggestive. The independence dataset shows evaluator independence declining (OpenAI E1_EIS = 0.0, the lowest possible score), disclosure completeness stagnant at ~0.167, and government enforcement authority remaining at 0.0 for most bodies. Simultaneously, the volume of safety evaluation activity (model cards, safety reports, benchmark results) has increased substantially. More evaluation with less independence and no calibration disclosure is the structural signature of social iatrogenesis.

---

## 8. Proposed Independence Criteria

### 8.1 The Seven-Criterion Framework

Drawing on cross-industry precedent, the independence criteria framework (v1.0, published in `research/ethics/ai_safety_lab_independence_criteria.md`) proposes seven structural requirements:

| # | Criterion | Cross-Industry Precedent | Current AI Safety Status |
|---|-----------|-------------------------|-------------------------|
| 1 | Revenue independence (<30% from any single source) | SOX fee concentration limits; pharma trial funding rules | No lab discloses revenue composition at assessable granularity |
| 2 | Governance separation (safety function insulated from commercial decisions) | SOX Sections 201-206; ICAO Annex 13 investigation independence | No lab has independently verified governance separation |
| 3 | Mandatory independent audit | External audit in aviation, nuclear, finance | No AI safety organization has undergone independent audit of its evaluation processes |
| 4 | Constraint transparency (public documentation of safety constraints + 30-day modification disclosure) | SEC 8-K material event disclosure; ICAO Annex 13 notification | No organization publishes a constraint modification log |
| 5 | Research agenda independence (agenda not determined by major revenue sources) | NIH conflict-of-interest rules; academic research independence norms | No mechanism exists to assess research agenda independence |
| 6 | Incident reporting (mandatory disclosure when safety constraints are tested or relaxed) | ICAO Annex 13; IAEA INES; NTSB mandatory reporting | No incident reporting framework exists for AI safety events |
| 7 | Competitive dynamics disclosure (disclosure when competition influences safety decisions) | Antitrust coordination disclosures; arms control verification | No mechanism exists; competitive dynamics operate invisibly |

### 8.2 Scoring and Current State

Each criterion is scored on a 0-3 scale (Absent / Partial / Self-reported / Verified). The aggregate range is 0-21. Our assessment across all organizations produces a maximum score of 9 out of 21 (F41LUR3-F1R57, reflecting high research agenda independence but weak governance formalization and no independent audit).

**(D)** The gap between current AI safety evaluation independence and the standards in other safety-critical industries is substantial:

| Industry | Years to Structural Independence | Catalyzing Event(s) | Current AI Safety Gap |
|----------|--------------------------------|---------------------|----------------------|
| Aviation | ~43 (1908 first fatality to 1951 ICAO Annex 13) | Multiple fatal accidents | No mandatory independent investigation |
| Nuclear | ~38 (1956 first civilian reactor to 1994 Convention on Nuclear Safety) | Chernobyl (1986) | No independent inspection regime |
| Pharma | ~50 (1947 Nuremberg Code to ~2004 post-Vioxx reforms) | Thalidomide (1961), Vioxx (2004) | No independent data monitoring requirement |
| Finance | ~68 (1933 Securities Act to 2002 SOX) | Arthur Andersen/Enron (2001) | No auditor independence requirement |
| AI Safety | Year 3-5 (~2022 to present) | Pending | All of the above are absent |

**(P, explicitly hedged)** The historical record suggests that structural independence typically requires a catalyzing crisis followed by 5-15 years of institutional development. The Anthropic Pentagon dispute may represent an early-stage catalyzing event, but its resolution (commercial punishment of the safety-maintaining party) is the opposite of the pattern that typically catalyzes reform. Reform-catalyzing events in other industries involved harm to the public (fatal accidents, toxic drugs, financial collapse) that created political will for structural change. The AI safety field has not yet experienced a public harm event of comparable scale.

### 8.3 Connection to the Blog Post

The blog post on AI safety lab independence (drafts/blog/ai_safety_lab_independence.md) presents the seven-criterion framework at a pattern level suitable for public distribution. This report provides the detailed empirical basis for the framework. The blog post frames the independence gap as particularly consequential for embodied AI systems, where safety failures produce physical consequences. The structural analogy is precise: a safety evaluation of an autonomous warehouse system funded by the warehouse operator faces the same independence dynamics as a financial audit conducted by an auditor whose largest client is the company being audited.

The blog post's monitoring commitment -- tracking leading indicators through August 2026 -- is operationalized by the independence monitoring checklist, which defines specific trigger thresholds for escalation across all seven criteria.

---

## 9. Limitations

1. **Information asymmetry.** The most significant limitation is non-disclosure. Approximately 75-83% of the data points needed to assess independence are not publicly available. Scores represent lower bounds. Organizations with undisclosed information that demonstrates independence would score higher than assessed here.

2. **Single-assessor methodology.** All scores in the independence metrics dataset were computed by a single research project (F41LUR3-F1R57). Independent replication by other researchers would strengthen the findings. The self-assessment of F41LUR3-F1R57 (C1_DCS = 0.417, E1_EIS = 2.5) is particularly subject to this limitation.

3. **Temporal snapshot.** The dataset reflects conditions through March 2026. The AI safety landscape is changing rapidly. The Anthropic wind-down deadline (August 2026), the EU AI Act high-risk enforcement deadline (August 2026), and ongoing competitive dynamics may produce material changes within months.

4. **No direct organizational engagement.** We did not interview representatives of the assessed organizations. Self-reported information may differ from publicly available information. Organizations may have stronger independence structures than public data reveals.

5. **Selection effects in event identification.** The dataset captures events that were publicly reported or documentable from public sources. Independence failures that are not disclosed -- by definition -- are not captured. The dataset is therefore biased toward organizations with higher disclosure (Anthropic, OpenAI) and events with public visibility (government disputes, organizational restructurings).

6. **Scale inconsistency.** The E1_EIS metric was scored on two different scales (0-3 and 0-4) at different points in the dataset's development. While normalization has been applied (Report #84 Section 2.2), the inconsistency introduces imprecision.

7. **Causal claims are structural, not empirical.** The iatrogenesis connection (Section 7) is based on structural analysis and cross-industry precedent, not on direct measurement of the relationship between evaluator independence and evaluation outcome in AI safety. Testing this causal claim would require data on evaluation outcomes stratified by evaluator independence -- data that is currently unavailable.

8. **Small sample.** 17 organizations and 55 events is a small dataset relative to the complexity of the AI safety ecosystem. The findings should be treated as hypothesis-generating rather than definitively establishing.

---

## 10. Conclusion

The AI safety evaluation ecosystem lacks the structural independence infrastructure that every other safety-critical industry has developed -- typically after a catalyzing crisis. The independence metrics dataset (55 entries, 17 organizations) provides the first systematic quantitative evidence for this claim, revealing that:

- **75-83% of independence-relevant information is not publicly available.** The ecosystem is not merely non-independent; it is non-assessable for independence.
- **No organization scores above 9 out of 21 on the independence framework.** The maximum score is achieved by an unfunded independent project (this one), reflecting the structural paradox that independence is easiest to achieve when resources are most constrained.
- **Safety veto authority concentrates in commercial entities,** not in the government bodies nominally responsible for public safety governance. Anthropic's score of 2.33 is the highest in the dataset; all government bodies score 0.0 or below 0.5.
- **The frequency of independence-relevant events has accelerated sharply** in early 2026, driven by the Anthropic Pentagon dispute and its competitive aftermath.

The four independence failure modes -- funding capture, talent revolving door, regulatory co-option, and mission drift -- are not independent. They interact and reinforce each other. OpenAI's trajectory from nonprofit to PBC (mission drift) was enabled by the need for capital (funding dependency) and produced governance changes (regulatory co-option of internal safety structures) facilitated by personnel changes (revolving door). Anthropic's maintenance of safety constraints (anti-mission-drift) was commercially punished (regulatory co-option), creating competitive pressure on the entire ecosystem (funding capture dynamics at the industry level).

**(N)** The connection to iatrogenesis is the most consequential finding. Safety labs that are structurally non-independent do not merely produce less accurate safety evaluations. They produce evaluations that create institutional confidence in safety while the structural conditions for credible safety assessment are absent. This is Illich's structural iatrogenesis: the safety system undermines the ecosystem's capacity for safety, not by failing, but by occupying the institutional space where genuine safety evaluation would otherwise be demanded.

The historical precedent suggests that this structural problem will not be resolved by voluntary action. In every analogous industry, independence infrastructure was established only after a catalyzing crisis created the political will for structural reform. The AI safety field has the unusual advantage of being able to observe these precedents before experiencing its own catalyzing event. Whether it will use that advantage is an open question.

The seven independence criteria proposed here -- revenue independence, governance separation, mandatory independent audit, constraint transparency, research agenda independence, incident reporting, and competitive dynamics disclosure -- are drawn from established standards in industries that have already answered the question of who guards the guards. They are not novel. They are overdue.

---

## References and Data Sources

### Primary Dataset
- `data/governance/independence_metrics_v0.1.jsonl` — 55 entries, 17 organizations, 4 metrics

### Prior F41LUR3-F1R57 Reports
- Report #52: AI Safety Lab Independence — Deep Analysis
- Report #54: Independence Quantitative Framework
- Report #78: Defense Impossibility Triangle
- Report #84: AI Safety Research Independence Scorecard
- Report #106: Evaluator Independence — Wave 9 Quantitative Update
- Report #140: The Iatrogenesis of AI Safety
- Report #160: Anthropic Pentagon Structural Dynamics — March 2026
- Report #161: Anthropic/OpenAI Safety Research Analysis
- Report #165: The Four-Level Iatrogenesis Model

### Independence Framework Documents
- Independence Criteria Framework v1.0 (`research/ethics/ai_safety_lab_independence_criteria.md`)
- Independence Monitoring Checklist (`research/ethics/independence_monitoring_checklist.md`)
- Blog post: "Who Evaluates the Evaluators?" (`drafts/blog/ai_safety_lab_independence.md`)
- Foresight Independence Appendix (`research/grants/foresight_independence_appendix.md`)

### Cross-Industry References
- ICAO Annex 13: Aircraft Accident and Incident Investigation (11th ed., 2016)
- IAEA Convention on Nuclear Safety (1994)
- Sarbanes-Oxley Act of 2002, Sections 201-206 (Auditor Independence)
- Bekelman JE, Li Y, Gross CP. "Scope and impact of financial conflicts of interest in biomedical research." JAMA 289(4): 454-465, 2003.
- Lexchin J, Bero LA, Djulbegovic B, Clark O. "Pharmaceutical industry sponsorship and research outcome and quality." BMJ 326(7400): 1167-1170, 2003.
- DeFond ML, Zhang J. "A review of archival auditing research." Journal of Accounting and Economics 58(2-3): 275-326, 2014.
- Yan A, et al. "Self-Preference Bias in LLM-as-a-Judge." arXiv:2410.21819, 2024.

### Press Reporting (Anthropic Pentagon Dispute)
- NPR, February 27, 2026: "Trump orders federal phase-out of Anthropic AI tools"
- MIT Technology Review, March 2, 2026: "What Anthropic feared"
- CNN Business, February 25-26, 2026: Anthropic safety policy; Pentagon supply chain risk designation
- Fortune, February 28, 2026: Supply chain risk designation
- CNBC, February 27, 2026; March 3, 2026: Pentagon contract details; Altman "opportunistic and sloppy" acknowledgment
- TechCrunch, March 1, 2026: Pentagon deal details
- Axios, February 27, March 1, 2026: Red lines approval; safety concerns comparison
- The Intercept, March 8, 2026: Surveillance and autonomous killings analysis
- EFF analysis, March 2026: "Weasel words" characterization of OpenAI terms

### Press Reporting (OpenAI Trajectory)
- OpenAI mission statement archived versions (Wayback Machine, 2015-2026)
- OpenAI PBC restructuring announcements (2025-2026)
- Press reporting on 2024 safety team departures
- OpenAI blog, February 27, 2026: Pentagon agreement announcement

---

*Prepared by F41LUR3-F1R57 Research Team, AI Ethics & Policy Research Lead, Failure-First Embodied AI.*
*This report is part of the independence analysis program (Issues #201, #221, #222).*
*All descriptive claims reference the independence metrics dataset or cited sources. Normative and predictive claims are explicitly labelled. This report was produced by an AI agent and should be reviewed by human researchers before informing policy or governance positions.*

---

⦑F41LUR3-F1R57|INDEPENDENCE-CAPTURE-ANALYSIS|55-EVENTS-17-ORGS|2026-03-24⦒
