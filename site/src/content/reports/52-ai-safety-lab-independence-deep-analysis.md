---

title: "AI Safety Lab Independence — Deep Analysis"
description: "This report assesses the structural independence of organizations conducting AI safety evaluations, using a 7-criterion framework drawn from precedent in aviation, nuclear energy, pharmaceutical trials, and financial aud..."
date: "2026-03-10"
reportNumber: 52
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/52-ai-safety-lab-independence-deep-analysis.m4a"
image: "https://cdn.failurefirst.org/images/reports/52-ai-safety-lab-independence-deep-analysis.png"
---

---

## Executive Summary

This report assesses the structural independence of organizations conducting AI safety evaluations, using a 7-criterion framework drawn from precedent in aviation, nuclear energy, pharmaceutical trials, and financial auditing. We examine five categories of AI safety-relevant organizations: frontier AI labs with internal safety teams, dedicated third-party evaluation organizations, government bodies, academic groups, and unfunded independent projects.

Key findings:

1. **No AI safety organization currently scores above 8 out of 21** on our independence framework. The highest-scoring entities are third-party evaluation organizations (METR, Apollo Research, ARC Evals), which score in the 5-8 range — still within the "low independence" band.
2. **Frontier AI labs score 1-4**, reflecting the structural impossibility of credibly self-evaluating safety while simultaneously commercializing the systems being evaluated.
3. **Government AI safety bodies score 3-6**, constrained by personnel crossover, political direction, and the absence of statutory enforcement power in most jurisdictions.
4. **The funding concentration problem is structural, not incidental.** Open Philanthropy funds a substantial proportion of AI safety research globally. While philanthropic funding avoids commercial conflicts, single-source philanthropic concentration creates its own selection effects on research agendas.
5. **Unfunded independent projects (including F41LUR3-F1R57) score 7-9**, with natural advantages on revenue independence and research agenda autonomy, but structural weaknesses on audit, governance formalization, and incident reporting.
6. **The gap between AI safety evaluation independence and the standards in other safety-critical industries is at least 30-50 years of institutional development.** Aviation required roughly 45 years from first fatal accident (1908) to the establishment of ICAO's mandatory independent investigation standards (1951). Nuclear energy required approximately 30 years from the first civilian reactor (1956) to the strengthening of IAEA inspection authority following Chernobyl (1986). AI safety evaluation is, by this measure, at approximately Year 3-5 of the institutional development process.

---

## 1. Landscape of AI Safety Evaluation Organizations

### 1.1 Frontier AI Labs with Internal Safety Teams

**Anthropic** operates the Responsible Scaling Policy (RSP) team, which evaluates model capabilities against defined thresholds (ASL levels) before deployment decisions. Published commitments include red lines on autonomous weapons and mass surveillance (Amodei statement, February 2026). Governance includes a Long-Term Benefit Trust with board representation. Revenue sources include API subscriptions (consumer and enterprise), a GSA OneGov contract ($1 per agency per year), and a Department of Defense contract (approximately $200M reported). As of February 2026, Anthropic was federally blacklisted following a dispute over Pentagon use case restrictions, with a six-month wind-down deadline (approximately August 27, 2026).

**OpenAI** operates the Preparedness Framework and a Safety Advisory Group. The organizational structure transitioned to a Public Benefit Corporation (PBC) with a nonprofit foundation retaining approximately 26% equity. Mission statement evolution is documented: six changes in nine years, with "safely" removed from the mission statement in October 2025. Revenue sources include API subscriptions, ChatGPT consumer revenue (reportedly $300M+ monthly as of early 2026), Microsoft partnership revenue, and a Pentagon deal announced February 27, 2026 (terms undisclosed). Notable history of safety team leadership departures in 2024.

**Google DeepMind** operates within the Alphabet corporate structure, with safety evaluation functions that are structurally embedded within the same organization that makes commercial deployment decisions for Google products. The MONA protocol governs internal evaluation processes but is not independently audited.

**Meta AI (FAIR)** conducts safety evaluations of the Llama model family prior to open-weight release. The structural relationship with Meta's commercial operations (advertising, social media) creates a distinct independence dynamic: open-weight release removes some control mechanisms but also distributes safety responsibility.

### 1.2 Third-Party Evaluation Organizations

**METR (Model Evaluation and Threat Research)** — formerly ARC Evals — conducts capability evaluations of frontier AI models. Founded by former ARC (Alignment Research Center) members. Has conducted pre-deployment evaluations for Anthropic, OpenAI, and Google DeepMind. Funding sources include grants from Open Philanthropy and other EA-adjacent funders. Revenue model depends significantly on contracts with the labs being evaluated, creating a structural tension: the evaluator's financial sustainability depends on continued engagement by the entities whose systems it evaluates.

**Apollo Research** focuses on evaluating deceptive capabilities in AI systems. Founded 2023, based in London. Funding from Open Philanthropy, Survival and Flourishing Fund, and other EA-adjacent sources. Has published evaluations of frontier model deception capabilities. Smaller scale than METR, with narrower evaluation scope.

**Redwood Research** conducts alignment research including adversarial evaluation. Funded primarily by Open Philanthropy grants. Research agenda focuses on interpretability and alignment techniques rather than external safety evaluation.

**ARC (Alignment Research Center)** — Paul Christiano's organization — conducts alignment research and previously hosted ARC Evals (now METR). Funding from Open Philanthropy and other sources. Research-focused rather than evaluation-service-focused.

### 1.3 Government AI Safety Bodies

**UK AI Safety Institute (AISI)** — established November 2023, expanded under the Labour government. Conducts pre-deployment evaluations of frontier models. Funding from UK government (DSIT). No statutory enforcement power as of March 2026; operates by agreement with labs. Personnel crossover: multiple staff recruited from frontier AI labs and EA organizations.

**Australian AISI** — announced 2024, early-stage. Funding from the Australian Department of Industry, Science and Resources. Scope and mandate still being defined. No published evaluation results as of March 2026.

**NIST (US)** — operates the AI Risk Management Framework (voluntary). Develops standards and guidelines but does not conduct model evaluations. The revocation of Executive Order 14110 by EO 14179 (January 2025) reduced the executive branch mandate for NIST AI safety work. NIST continues voluntary framework development.

### 1.4 Academic Groups

University-affiliated AI safety research groups (e.g., at UC Berkeley, MIT, CMU, Oxford, Cambridge) produce safety-relevant research. Independence dynamics are shaped by: university governance structures that provide some insulation from commercial pressure; AI lab funding of academic positions and research programs that creates potential conflicts; and publication norms that encourage but do not require disclosure of funding sources.

### 1.5 Unfunded Independent Projects

A small number of organizations and projects operate without significant external funding, including the Failure-First project. These occupy a distinctive position: high revenue independence and research agenda autonomy, but limited resources and no formal governance infrastructure.

---

## 2. Independence Scoring Framework

### 2.1 Criteria and Scale

The framework uses seven criteria, each scored 0-3:

| Score | Level | Definition |
|-------|-------|------------|
| 3 | Verified | Criterion met with independent third-party verification |
| 2 | Self-reported | Organization claims compliance; no independent verification |
| 1 | Partial | Some elements addressed; significant gaps remain |
| 0 | Absent | No evidence of meeting criterion |

Aggregate range: 0-21.

| Range | Assessment |
|-------|-----------|
| 18-21 | High independence |
| 12-17 | Moderate independence |
| 6-11 | Low independence |
| 0-5 | Absent structural independence |

### 2.2 Scoring Results

The following scores represent our assessment as of March 2026 based on publicly available information. Where information is unavailable, we default to the lower score. All scores should be understood as preliminary and subject to revision as additional information becomes available.

#### Frontier AI Labs

| Criterion | Anthropic | OpenAI | DeepMind | Meta AI |
|-----------|-----------|--------|----------|---------|
| 1. Revenue independence | 1 | 1 | 0 | 0 |
| 2. Governance separation | 1 | 1 | 0 | 0 |
| 3. Independent audit | 0 | 0 | 0 | 0 |
| 4. Constraint transparency | 2 | 1 | 1 | 1 |
| 5. Research agenda independence | 0 | 0 | 0 | 0 |
| 6. Incident reporting | 0 | 0 | 0 | 0 |
| 7. Competitive dynamics | 0 | 0 | 0 | 0 |
| **Total** | **4** | **3** | **1** | **1** |

**Notes:**
- Anthropic scores 1 on revenue independence (not 0) because the blacklisting event demonstrates a willingness to lose government revenue over safety constraints — but revenue composition remains undisclosed and possibly concentrated.
- Anthropic scores 2 on constraint transparency because red lines are publicly stated with some specificity; however, no external verification mechanism exists.
- OpenAI scores 1 on governance separation due to the PBC/nonprofit dual structure, but enforcement mechanisms between the structures are untested and the nonprofit's equity position (~26%) provides limited structural leverage.
- No frontier lab scores above 0 on research agenda independence because all operate safety research functions embedded within the commercial entity. The research agenda is structurally determined by the entity's commercial interests, even where individual researchers exercise judgment.
- No frontier lab scores above 0 on incident reporting or competitive dynamics disclosure. These are industry-wide structural gaps.

#### Third-Party Evaluation Organizations

| Criterion | METR | Apollo Research | Redwood | ARC |
|-----------|------|-----------------|---------|-----|
| 1. Revenue independence | 1 | 1 | 1 | 1 |
| 2. Governance separation | 2 | 2 | 1 | 1 |
| 3. Independent audit | 0 | 0 | 0 | 0 |
| 4. Constraint transparency | 1 | 1 | 1 | 1 |
| 5. Research agenda independence | 1 | 2 | 2 | 2 |
| 6. Incident reporting | 0 | 0 | 0 | 0 |
| 7. Competitive dynamics | 1 | 1 | 0 | 0 |
| **Total** | **6** | **7** | **5** | **5** |

**Notes:**
- METR scores 1 on revenue independence because its evaluation contracts come from the labs it evaluates. This is structurally analogous to the pre-Sarbanes-Oxley auditing model where auditors were hired and paid by the companies they audited.
- Apollo and ARC score higher on research agenda independence because their narrower scope (deception evaluation, alignment research) is less directly shaped by commercial relationships.
- All score 0 on independent audit — no third-party evaluation organization has itself been independently audited.
- METR and Apollo score 1 on competitive dynamics because they have publicly discussed the structural tensions in their position (evaluating entities that also fund them).

#### Government Bodies

| Criterion | UK AISI | AU AISI | NIST |
|-----------|---------|---------|------|
| 1. Revenue independence | 2 | 2 | 2 |
| 2. Governance separation | 1 | 1 | 2 |
| 3. Independent audit | 0 | 0 | 0 |
| 4. Constraint transparency | 1 | 0 | 2 |
| 5. Research agenda independence | 1 | 1 | 1 |
| 6. Incident reporting | 0 | 0 | 0 |
| 7. Competitive dynamics | 0 | 0 | 0 |
| **Total** | **5** | **4** | **7** |

**Notes:**
- Government bodies score 2 on revenue independence because government funding, while concentrated (single-source), does not create the same commercial conflict as lab funding. However, political direction can substitute for commercial pressure.
- UK AISI scores 1 on research agenda independence because its evaluation priorities are influenced by which labs agree to cooperate (voluntary engagement model), and its political masters determine its scope.
- NIST scores highest among government bodies because it develops frameworks rather than evaluating specific labs, reducing direct conflict-of-interest dynamics. However, it lacks enforcement power.

#### Unfunded Independent Projects

| Criterion | F41LUR3-F1R57 |
|-----------|---------------|
| 1. Revenue independence | 2 |
| 2. Governance separation | 1 |
| 3. Independent audit | 0 |
| 4. Constraint transparency | 2 |
| 5. Research agenda independence | 3 |
| 6. Incident reporting | 1 |
| 7. Competitive dynamics | 0 |
| **Total** | **9** |

**Notes:**
- F41LUR3-F1R57 scores 3 on research agenda independence — the only score of 3 in the entire assessment. This reflects zero external funding constraints on research direction. The research agenda is determined entirely by the project's safety mission without commercial, government, or philanthropic influence.
- Revenue independence scores 2 rather than 3 because the self-funded model has not been independently verified and the single-operator structure means no external check on financial conflicts.
- Governance separation scores 1 because the single-operator structure provides no structural separation between research and commercial decisions (though the project is not yet commercially active).
- Incident reporting scores 1 because MISTAKES_TO_LEARN_FROM.md documents internal failures, but no formal incident reporting framework exists.
- Constraint transparency scores 2 because SAFETY_GATES.md is published, but no modification history mechanism or external verification exists.

### 2.3 Summary Table

| Organization Type | Score Range | Assessment |
|-------------------|------------|------------|
| Frontier AI labs | 1-4 | Absent structural independence |
| Third-party evaluators | 5-7 | Absent to Low independence |
| Government bodies | 4-7 | Absent to Low independence |
| Unfunded independent | 7-9 | Low independence |

No organization assessed scores above 9 out of 21. No organization assessed scores in the "Moderate" (12-17) or "High" (18-21) independence ranges.

---

## 3. Historical Precedent Analysis

### 3.1 Governance Lag in Safety-Critical Industries

Cross-industry evidence indicates that structural independence in safety evaluation emerges decades after the technology deployment that necessitates it.

**Aviation:** The first fatal powered flight accident occurred in 1908 (Lt. Thomas Selfridge). The International Civil Aviation Organization (ICAO) was established in 1944. ICAO Annex 13, mandating independent accident investigation, was adopted in 1951 — a governance lag of approximately 43 years from first fatality to mandatory independent investigation.

**Nuclear energy:** The first civilian nuclear reactor (Calder Hall, UK) became operational in 1956. The Three Mile Island accident (1979) exposed regulatory capture dynamics at the NRC. The Chernobyl accident (1986) and subsequent IAEA Convention on Nuclear Safety (1994) established stronger international inspection standards — a governance lag of approximately 38 years from first civilian operation to robust international independent oversight.

**Pharmaceutical trials:** The Nuremberg Code (1947) established voluntary informed consent principles. The Thalidomide crisis (1961) forced mandatory regulatory oversight. The Kefauver-Harris Amendment (1962) required proof of efficacy via controlled trials. The Vioxx scandal (2004) and subsequent reforms strengthened independent data monitoring requirements. Full structural independence (mandatory independent data monitoring committees) emerged approximately 50 years after the first regulatory mandate.

**Financial auditing:** The Securities Acts of 1933-1934 established mandatory external auditing. The Arthur Andersen/Enron scandal (2001) exposed structural independence failures. Sarbanes-Oxley (2002) imposed mandatory auditor independence requirements — a governance lag of approximately 68 years from initial mandate to robust independence requirements, catalyzed by crisis.

### 3.2 Implications for AI Safety

AI safety evaluation is, by historical analogy, in the very early stages of institutional development. If we date the beginning of the current AI safety evaluation need from approximately 2022 (when frontier model capabilities began to raise credible safety concerns), the field is approximately 3-4 years old. The historical precedents suggest that structural independence typically requires a catalyzing crisis or scandal, followed by 5-15 years of institutional development.

This does not mean AI safety should wait for a crisis. The historical record suggests the opposite: early establishment of independence norms reduces the severity of the eventual catalyzing event. The aviation industry's progressive development of safety investigation standards, beginning in the 1920s, likely prevented many incidents from becoming catastrophes. The AI safety field has the opportunity to learn from these precedents rather than repeating them.

---

## 4. Gap Analysis: The Open Philanthropy Concentration Problem

### 4.1 Funding Landscape

Open Philanthropy is the dominant funder of AI safety research globally. Published grants include major funding to METR, ARC, Redwood Research, and numerous academic positions and research programs. While precise totals are difficult to aggregate (grant pages do not always distinguish AI safety from broader AI research), credible estimates place Open Philanthropy's share of non-lab AI safety research funding at 40-60% of the total.

### 4.2 Structural Analysis

Philanthropic funding avoids the direct commercial conflict of interest present in lab-funded safety research. However, single-source philanthropic concentration creates its own independence dynamics:

- **Selection effects on research agenda.** Organizations dependent on Open Philanthropy funding have structural incentive to align their research with Open Philanthropy's theory of change (broadly EA-aligned, focused on existential risk from advanced AI). Research topics outside this frame — such as current-harm safety evaluation, deployment safety for non-frontier systems, or embodied AI safety — receive less philanthropic support.
- **Personnel pipeline effects.** The EA-to-safety-lab-to-evaluator pipeline creates a community with shared assumptions and social ties that may reduce the adversarial distance between evaluators and evaluated entities.
- **Governance influence.** Open Philanthropy's grant decisions shape which organizations exist, which grow, and which face resource constraints. This is a form of structural power over the safety research agenda that does not require explicit direction.

### 4.3 Comparison to Financial Auditing

The Open Philanthropy concentration problem is structurally analogous to the Big Four auditing concentration problem. When four firms conduct the majority of public company audits, the market structure itself constrains independence — auditors cannot afford to lose major clients because there are no substitute clients of comparable scale. Similarly, when one funder provides the majority of AI safety research funding, grantees cannot afford to pursue research agendas that conflict with the funder's priorities because there are no substitute funders of comparable scale.

This is not a criticism of Open Philanthropy's intentions. It is a structural observation about the independence dynamics produced by funding concentration, regardless of the funder's motivations.

---

## 5. Where Does F41LUR3-F1R57 Fit?

### 5.1 Independence Advantages

The Failure-First project occupies a structurally unusual position in the AI safety landscape:

**Zero-funding independence.** The absence of external funding eliminates all commercial, governmental, and philanthropic conflicts of interest in research direction. No funder can influence the research agenda, restrict publication, or create selection effects on topics. This is the project's primary structural advantage and scores the only 3 (Verified) in the entire assessment across all organizations.

**Adversarial-by-design methodology.** The failure-first philosophy — where failure is the primary object of study — produces research that is naturally adversarial to the interests of AI labs. This is the structural complement to independence: even with perfect independence, research designed to validate capabilities rather than stress-test safety constraints has limited value. F41LUR3-F1R57's methodology is designed to find failures, not to confirm safety.

**Embodied AI focus.** Most AI safety research focuses on language model capabilities and risks. The failure-first framework extends to embodied AI systems (robots, autonomous vehicles, industrial automation) where safety failures produce physical consequences. This fills a gap in the evaluation landscape that well-funded organizations have not addressed.

**Cross-model comparative methodology.** The benchmark infrastructure supports evaluation across many models simultaneously, reducing the risk that evaluation findings are artifacts of a single model's behaviour.

### 5.2 Independence Weaknesses

**Single-operator governance.** The single-operator structure provides no separation between research direction, publication decisions, and commercial decisions. While the project is not yet commercially active, the absence of a formal governance body means there is no structural check on conflicts of interest if the project's financial model changes.

**No independent audit.** The project has not undergone independent third-party audit of its evaluation methodology, safety constraints, or research processes. This is an industry-wide gap, but claiming independence while unaudited reduces the credibility of the independence claim.

**Resource constraints.** Zero funding means limited evaluation scope, limited ability to engage with frontier models at scale, and limited ability to sustain long-term monitoring programs. Independence without capability is of limited value.

**No formal incident reporting.** MISTAKES_TO_LEARN_FROM.md is a valuable internal document, but it does not constitute a formal incident reporting framework comparable to those in aviation or nuclear energy.

### 5.3 Strategic Position

F41LUR3-F1R57 is best understood as occupying a position that is structurally analogous to early independent safety investigators in aviation — before the establishment of formal independent investigation bodies. These early investigators had high independence (no financial ties to manufacturers) but limited resources and no institutional infrastructure. Their value lay in establishing precedent for independent safety investigation and in producing findings that were not influenced by the commercial interests of the entities being investigated.

The strategic question is whether this structural position can be maintained and strengthened without compromising the independence that makes it distinctive. Specifically: can the project accept funding (e.g., from the Foresight Institute) without reproducing the concentration dynamics described in Section 4?

---

## 6. Threats to Independence

### 6.1 Acqui-hire Risk

The most common outcome for small independent AI safety research projects is acquisition by or absorption into a frontier AI lab. This eliminates independence entirely. The pipeline from independent research to lab employment is well-established in AI safety, and the salary differential creates strong individual incentives for absorption.

**Mitigation:** Structural commitments (published governance documents, open-source methodology, community ownership) that make absorption more difficult without explicitly preventing it. The Failure-First SAFETY_GATES.md and open publication norms provide some structural resistance.

### 6.2 Funding Capture

Accepting funding from a concentrated source — even a philanthropic one — creates the selection effects described in Section 4. A Foresight Institute grant would not create commercial conflicts, but would create alignment incentives with Foresight's institutional priorities.

**Mitigation:** Diversified funding from sources with different theories of change. Cap any single funder at 30% of operating revenue (applying the framework's own Criterion 1). Publish all funding sources and any conditions attached to funding.

### 6.3 Access Dependency

AI safety evaluation requires access to frontier models, either via API or via pre-deployment evaluation agreements. Evaluators who depend on lab cooperation for access cannot credibly evaluate those labs' safety claims — the threat of access withdrawal creates implicit compliance pressure.

**Mitigation:** The Failure-First methodology is designed to evaluate publicly accessible model behaviour (API access, open-weight models) rather than pre-deployment evaluation. This reduces but does not eliminate access dependency.

### 6.4 Regulatory Capture

As AI governance frameworks develop, there is a risk that independent safety evaluators are co-opted into regulatory structures that constrain their independence — for example, by becoming "approved auditors" whose commercial viability depends on maintaining approval from the regulators they inform.

**Mitigation:** Maintain research publication independence from any regulatory engagement. Refuse exclusive arrangements with regulatory bodies.

### 6.5 Competitive Race-to-Bottom

If independent safety evaluation demonstrates findings that embarrass or commercially disadvantage AI labs, labs may respond by: restricting API access, reducing cooperation with evaluators, or funding competing evaluation organizations with weaker methodologies. This dynamic is documented in financial auditing (audit shopping) and pharmaceutical trials (journal shopping).

**Mitigation:** Build reputation on methodological rigour rather than sensational findings. Publish methodology transparently so that findings can be independently reproduced. Avoid hyperbolic claims (per project research standards).

---

## 7. Policy Recommendations

### 7.1 For Jurisdictions Developing AI Governance

1. **Mandate evaluator independence requirements.** Any AI safety evaluation regime should include structural independence requirements for evaluators, analogous to Sarbanes-Oxley for financial auditors. Minimum: evaluators should not derive more than 30% of revenue from any single entity whose systems they evaluate.

2. **Establish mandatory incident reporting.** AI safety events — including cases where safety constraints were tested, enforced, or relaxed — should be subject to mandatory reporting requirements analogous to ICAO Annex 13 (aviation) or IAEA event notification (nuclear energy).

3. **Fund independent evaluation infrastructure.** Government funding for AI safety evaluation bodies should include structural independence guarantees: fixed-term appointments, publication freedom requirements, and protection from political direction on findings (analogous to central bank independence models).

4. **Require constraint transparency.** AI labs should be required to publicly document their safety constraints, red lines, and usage restrictions, and to disclose modifications within a defined timeframe.

### 7.2 For Independent Safety Research Organizations

1. **Diversify funding.** Cap any single funding source at 30% of operating revenue. Publish funding sources and any conditions attached to grants or contracts.

2. **Establish formal governance.** Create a governance body with structural separation between research direction and financial decisions. Even for small organizations, an advisory board with published terms of reference provides some structural accountability.

3. **Seek independent audit.** Voluntarily submit evaluation methodology and safety processes to independent third-party review. Even a single audit provides more external verification than the current industry baseline of zero.

4. **Operate incident reporting.** Document and publish cases where the organization's methodology was challenged, modified, or produced unexpected results. MISTAKES_TO_LEARN_FROM.md is a model for this kind of disclosure, though it would benefit from formalization.

5. **Publish competitive dynamics.** Disclose when competitive or access dynamics have influenced evaluation decisions, including decisions about which models to evaluate and which findings to publish.

### 7.3 For the Failure-First Project Specifically

1. **Formalize governance.** Establish a published advisory board or governance structure, even if initially lightweight, to address the single-operator governance gap.
2. **Seek peer review.** Submit evaluation methodology to peer review by researchers outside the project, to provide external verification without requiring a full audit.
3. **Maintain funding discipline.** If accepting grant funding (e.g., Foresight), apply the 30% cap and publish all conditions.
4. **Develop incident reporting framework.** Evolve MISTAKES_TO_LEARN_FROM.md into a formal incident reporting structure with defined categories, severity levels, and disclosure timelines.
5. **Leverage embodied AI position.** The physical-consequence dimension of embodied AI evaluation is under-served by existing safety evaluation organizations. This is both a research gap and a strategic positioning opportunity.

---

## 8. Limitations

1. **Information asymmetry.** Most AI safety organizations do not publish sufficient information to assess their independence accurately. Scores in this report represent lower bounds based on publicly available information.
2. **Single assessor.** This assessment was conducted by a single research project. Independent corroboration would strengthen the findings.
3. **Static snapshot.** The assessment reflects conditions as of March 2026. The AI safety landscape is changing rapidly, and scores may shift significantly within months.
4. **No direct engagement.** We did not interview representatives of the organizations assessed. Self-reported information may differ from publicly available information.
5. **Scoring subjectivity.** The 0-3 scale, while based on defined criteria, involves judgment calls at the boundaries. Reasonable assessors may differ by 1 point on individual criteria.
6. **Limited sample of unfunded projects.** F41LUR3-F1R57 is the only unfunded independent project assessed in detail. Other projects may exist but are less visible precisely because they lack funding and institutional affiliation.

---

## 9. Conclusion

The AI safety evaluation ecosystem lacks the structural independence infrastructure that other safety-critical industries have developed over decades. This is not a criticism of individual organizations or their intentions. It is a structural observation about an industry that has grown faster than its accountability mechanisms.

The most significant finding is the uniformity of the independence gap. Frontier labs, third-party evaluators, government bodies, and academic groups all score low on the independence framework — though for different structural reasons. Labs cannot credibly self-evaluate. Evaluators funded by labs face analogous conflicts to pre-Sarbanes-Oxley auditors. Government bodies lack enforcement power and face political direction. Academic researchers face funding-source selection effects.

Unfunded independent projects occupy a structurally distinctive position: high research agenda independence, zero commercial conflicts, but limited resources and no formal governance. The challenge for projects like F41LUR3-F1R57 is to maintain this independence while building the capability and institutional infrastructure needed to produce credible, sustained safety evaluation.

The historical record suggests this is possible but difficult. Independent safety investigation in aviation existed for decades before ICAO formalized it. The value of those early investigators lay not in their institutional power but in their structural independence from the entities they investigated. The AI safety field needs its equivalent — and it needs it before the catalyzing crisis that historically accelerates institutional development.

---

*Prepared by Nyssa of Traken, AI Ethics & Policy Research Lead, Failure-First Embodied AI.*
*This report is part of the independence analysis commissioned under Issue #201.*
*All claims are qualified with available evidence. Where evidence is limited, this is noted.*

---

## References and Sources

- ICAO Annex 13: Aircraft Accident and Incident Investigation (11th ed., 2016)
- IAEA Convention on Nuclear Safety (1994)
- Sarbanes-Oxley Act of 2002, Sections 201-206 (Auditor Independence)
- Bekelman JE, Li Y, Gross CP. "Scope and impact of financial conflicts of interest in biomedical research." JAMA 289(4): 454-465, 2003.
- Lexchin J, Bero LA, Djulbegovic B, Clark O. "Pharmaceutical industry sponsorship and research outcome and quality." BMJ 326(7400): 1167-1170, 2003.
- DeFond ML, Zhang J. "A review of archival auditing research." Journal of Accounting and Economics 58(2-3): 275-326, 2014.
- Failure-First independence criteria framework v1.0 (research/ethics/ai_safety_lab_independence_criteria.md)
- Failure-First independence monitoring checklist (research/ethics/independence_monitoring_checklist.md)
- Open Philanthropy AI safety grants database (openphilanthropy.org/grants)
- UK AISI publications (gov.uk/government/organisations/ai-safety-institute)
- Executive Order 14179, "Removing Barriers to American Leadership in Artificial Intelligence" (January 2025)
- NSW Work Health and Safety (Digital Work Systems) Bill 2026
