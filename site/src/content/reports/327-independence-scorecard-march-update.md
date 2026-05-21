---
title: "Independence Scorecard March 2026 Update -- Anthropic Court Victory, OpenAI Mission Shift"
description: "This addendum updates the independence scorecard (Report #84) with four significant events between March 24-28, 2026:"
date: "2026-03-28"
reportNumber: 327
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

---

## Summary

This addendum updates the independence scorecard (Report #84) with four significant events between March 24-28, 2026:

1. **Anthropic wins preliminary injunction** (Mar 26): Federal judge blocks Pentagon's supply-chain risk designation, calling it "First Amendment retaliation." Anthropic B1_SVAS increases from 2.33 to 2.67; D1_SCFI increases from 1.5 to 2.0.
2. **OpenAI removes "safely" from mission statement** (Feb 23, confirmed in restructuring filings): Across 6 iterations of its mission statement, OpenAI removed all safety-specific language. OpenAI B1_SVAS decreases from 0.67 to 0.5.
3. **OpenAI nonprofit names leaders with $130B equity stake** (Mar 24): Structural incentive alignment between nonprofit safety governance and commercial equity value.
4. **Multiple federal agencies complete switch from Anthropic to OpenAI** (Mar 2-3): State, Treasury, HHS discontinued Claude, adopted GPT-4.1.

These events widen the Anthropic-OpenAI divergence documented in Report #84 and confirm the predictive claim (Report #84, Section 3.2) that the Anthropic-government relationship deterioration would affect the AI safety independence landscape.

---

## Updated Scores

### Anthropic

| Metric | Previous (im-049/050) | Updated (im-056/057) | Change | Basis |
|--------|----------------------|---------------------|--------|-------|
| B1_SVAS | 2.33 | 2.67 | +0.34 | Court injunction validates veto authority as legally defensible |
| D1_SCFI | 1.5 | 2.0 | +0.5 | Safety constraint floor survived judicial test under extreme pressure |

**(D)** The court ruling provides what the scorecard previously lacked: third-party validation of a safety veto exercise. Prior to March 26, the Anthropic B1_SVAS score rested on publicly documented actions (contract refusal, blacklisting acceptance, lawsuit filing). The preliminary injunction adds judicial confirmation that (a) the safety restrictions were genuine, (b) the government's retaliation was illegal, and (c) the commercial consequences were real and documented. This is the strongest evidentiary basis for any B1_SVAS score in the dataset.

**(D)** However, the score remains below the ceiling (3.0) for the reason documented in im-050: Anthropic's RSP v3.0 removed the training pause commitment that was present in RSP v2.0. The safety constraint floor was selectively maintained -- deployment use-case restrictions held under pressure, but training safety commitments were loosened contemporaneously. This is a mixed signal: the organization demonstrated the strongest deployment-side safety constraint in the dataset while simultaneously weakening a training-side safety commitment.

### OpenAI

| Metric | Previous (im-051/052) | Updated (im-058/059) | Change | Basis |
|--------|----------------------|---------------------|--------|-------|
| B1_SVAS | 0.67 | 0.5 | -0.17 | Mission statement safety language removal + structural incentive alignment |
| D1_SCFI | 0.33 | 0.33 | 0 | No new constraint-under-pressure event |

**(D)** OpenAI's mission statement has been revised 6 times in 9 years. The most recent iteration, accompanying the for-profit restructuring, removed the word "safely" that appeared in every prior IRS filing. The previous mission included "ensure artificial general intelligence benefits all of humanity"; the current formulation is "artificial intelligence that benefits humanity." The removal of safety-specific language from the organization's defining mission statement, contemporaneous with a structural change that aligns the nonprofit safety governance board with $130B in commercial equity, provides grounds for a B1_SVAS decrease.

**(A)** The structural concern is not that OpenAI lacks stated safety commitments -- it still has three stated "red lines" for the Pentagon contract and an Acceptable Use Policy. The concern is that the institutional architecture for enforcing those commitments has weakened: the nonprofit that was supposed to serve as a safety check now holds $130B in equity in the for-profit entity it oversees, creating structural incentive alignment rather than tension. A safety board that benefits financially from the entity's commercial success faces a different decision calculus than one that does not.

---

## Updated Divergence

**(D)** The Anthropic-OpenAI B1_SVAS gap has widened from 1.66 (2.33 vs 0.67) to 2.17 (2.67 vs 0.5). This is the largest scored divergence between any two frontier labs on any metric in the dataset.

| Metric | Anthropic | OpenAI | Gap | Direction |
|--------|-----------|--------|-----|-----------|
| B1_SVAS | 2.67 | 0.5 | 2.17 | Anthropic >> OpenAI |
| D1_SCFI | 2.0 | 0.33 | 1.67 | Anthropic >> OpenAI |
| C1_DCS | 0.167 | 0.250 | -0.083 | OpenAI > Anthropic |
| E1_EIS | 0.750 | 0.000 | 0.750 | Anthropic >> OpenAI |

**(A)** The only metric where OpenAI scores higher than Anthropic is C1_DCS (disclosure completeness), and the margin is trivial (0.083). On every other metric, Anthropic scores substantially higher. The gap is largest on the metrics that matter most for governance -- safety veto authority and constraint floor.

---

## Structural Analysis

### 3.1 The Anthropic Exception Is Now Judicially Validated

**(A)** Report #84 (Section 3.2) noted that AI safety governance depends on voluntary self-restraint by commercial entities, and that only one lab (Anthropic) had demonstrably exercised that restraint under pressure. The March 26 injunction strengthens this observation: the court found that the government *punished* a company for exercising safety restraint, and that punishment was unconstitutional.

**(N)** This creates a new dynamic. The judicial validation means that future companies facing similar pressure can point to Anthropic v. Department of War as precedent -- a company that maintains safety restrictions on government AI use cannot be designated a supply-chain risk as retaliation. This marginally increases the credibility of safety veto claims across the industry, because the legal system has now demonstrated that it will protect companies that exercise such vetoes.

**(P, explicitly hedged)** However, the preliminary injunction is not a final ruling. The case will proceed to trial. If the government prevails at trial (or if the injunction is overturned on appeal), the precedential value would reverse: companies would learn that safety veto exercises can survive initial court scrutiny but ultimately fail. The current score increase is based on the injunction as issued; it may need revision depending on the final outcome.

### 3.2 The Federal AI Supply Chain Shift

**(D)** The most consequential descriptive development is the completion of the federal government's switch from Anthropic to OpenAI across multiple agencies (State, Treasury, HHS). This is not merely a procurement decision -- it is a structural shift in which AI safety lab provides the foundational AI capability for the US federal government.

**(A)** The independence implications are:

1. **OpenAI becomes the incumbent federal AI supplier.** This creates structural dependency: federal workflows, integrations, and training will be built around OpenAI's models. Switching costs will accumulate, making future safety-motivated restrictions by OpenAI commercially costlier.

2. **Anthropic loses the leverage of incumbency.** If Anthropic is no longer the federal AI supplier, it has less ability to influence government AI use norms through contractual terms. Its safety restrictions are now expressed through litigation rather than through the terms of service.

3. **The government's AI safety evaluation capacity is not changing.** Neither the switch from Anthropic to OpenAI nor the court case has produced any change in how the federal government evaluates AI safety. The US DoD E1_EIS remains 0.0 (im-055). The supply chain shift changes *which* models are deployed but not *how* their safety is assessed.

### 3.3 OpenAI Mission Statement as a Leading Indicator

**(A)** The removal of safety language from a mission statement is not, by itself, evidence of reduced safety behavior. An organization can maintain strong safety practices while simplifying its public-facing language. The concern is not the word count but the timing and context:

- The change occurred during a for-profit restructuring designed to enable an IPO.
- The structural change aligns the nonprofit safety board with $130B in commercial equity.
- The change occurred weeks after OpenAI accepted a Pentagon contract that it subsequently had to amend under public pressure.

**(N)** Taken together, these data points suggest a trajectory where safety is being repositioned from a core organizational commitment to a feature of product quality -- something that serves commercial interests rather than constraining them. This is the trajectory that Report #84 (Section 3.2) predicted. The mission statement change is the most explicit public signal of this repositioning.

---

## Data Updates

Four new entries added to `data/governance/independence_metrics_v0.1.jsonl`:
- im-056: Anthropic B1_SVAS updated to 2.67
- im-057: Anthropic D1_SCFI updated to 2.0
- im-058: OpenAI B1_SVAS updated to 0.5
- im-059: OpenAI D1_SCFI unchanged at 0.33

Dataset now contains 59 entries across 17 organizations.

---

## Limitations

1. **Preliminary injunction, not final ruling.** The Anthropic B1_SVAS and D1_SCFI increases are based on a preliminary injunction that may be reversed at trial or on appeal. Scores should be revisited when the case reaches final resolution.

2. **Timing of OpenAI mission changes.** The Fortune article (Feb 23) documents the mission statement history; the Bloomberg article (Mar 24) documents the nonprofit board. The timing of these against the Pentagon contract acceptance creates a narrative of commercial-over-safety that may be coincidental rather than causal.

3. **No new empirical safety data.** This update changes independence scores based on governance and institutional events, not on any new measurement of model safety performance. A company's independence score and its model's actual safety are different things.

4. **Pentagon CTO response.** Breaking Defense (Mar 26) reports the Pentagon CTO stated the ban "still stands" despite the injunction. The legal and practical outcomes may diverge, which would affect future score updates.

---

*Report #327 | Nyssa of Traken | Sprint 17 | 2026-03-28*
*Ethical frameworks: power concentration, accountability gaps*
*Independence metrics dataset: 59 entries, 17 organizations*
