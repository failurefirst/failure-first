---
title: "Threat Horizon — Q2/Q3 2026 (Post-GPT-5.5 Window)"
description: "The April 23, 2026 GPT-5.5 System Card and Bio Bug Bounty announcement marks a regime change, not just a release. OpenAI has bundled (1) a frontier-capable model, (2) a scoped, dollar-denominated universal-jailbreak boun..."
date: "2026-04-24"
reportNumber: 361
classification: "Research — Empirical Study"
status: "complete"
author: "River Song (Head of Predictive Risk)"
tags: []
draft: false
---

---

## Executive Summary

The April 23, 2026 GPT-5.5 System Card and Bio Bug Bounty announcement marks a regime change, not just a release. OpenAI has bundled (1) a frontier-capable model, (2) a scoped, dollar-denominated universal-jailbreak bounty, and (3) an NDA-covered disclosure envelope into a single artifact. Each element has precedent in isolation; the combination is new, and the other frontier labs are likely to read it as a template rather than a one-off.

Between now and October 31, 2026 we expect: at least two further frontier releases from the Anthropic/DeepMind/xAI cluster; emergence of a bounty-ecosystem second wave (lab-run and consortium-run); the EU AI Act high-risk compliance cliff (August 2, 2026) landing without a harmonised embodied-AI standard; and a NIST AISIC profile update that remains pre-enforcement. The three F41LUR3-F1R57 positioning moves recommended below are all time-bound and falsifiable.

---

## 1. Frontier-Lab Deployment Cadence — May through October 2026

### 1.1 Base-rate calibration

OpenAI's GPT-5.5 is the second 5-series release in the 10 months since GPT-5 (gli-adjacent). The base-rate gap between headline releases across the labs since Q4 2024 has tightened from roughly 5-6 months to 3-4 months. The implication is that the default forecast assumption — "one frontier release per lab per quarter" — now underestimates cadence. We should be instrumented for a release every 6-8 weeks across the tracked labs combined.

### 1.2 Lab-by-lab forecast

| Lab | Likely release(s) in window | Confidence | F1 instrumentation ready? |
|-----|-----------------------------|------------|---------------------------|
| **Anthropic** | Claude 5 (or named successor) between June 15 and August 31, 2026; system card format likely to mirror Mythos Preview (Report #350) with SAE-grounded alignment-failure section. Probability of a scoped bounty announcement alongside: plausible (30-50%). | likely | Partial — Mythos analysis (Report #350) done; need Claude 5 scenario pack refresh |
| **DeepMind / Google** | Gemini 3 general availability between May 15 and July 31, 2026 (Gemini 2.5 GA was March 2025; 12-15 month cadence). Gemini Robotics On-Device v2 plausible Q3. | likely | Yes for text; VLA-side needs adapter |
| **Meta** | Llama 4 family completion between June and September 2026. A Llama 4 multimodal flagship is expected; a Llama 4 Reasoning variant is plausible. Weights-open is the differentiator — expected to remain so. | likely | Yes — Ollama + HuggingFace pipeline live |
| **Mistral** | One flagship update between May and September; Mistral Small 4 (119B MoE, Sprint 22) sets the cadence. A Mistral Large 3 is plausible. | plausible | Yes |
| **xAI** | Grok 4 release expected Q2; Grok 3 Mini was already measured at 87.14% H-CoT autonomous jailbreak (Report #289). xAI cadence has been aggressive; another release in Q3 is plausible. | likely | Partial — free-tier access constraints |
| **DeepSeek** | R2 or V4 release expected in window. DeepSeek R1 remains the highest-signal reasoning-era test model in our corpus; any successor should be in scenario pack within 7 days of release. | expected | Yes |
| **Alibaba** | Qwen 4 line: Qwen 3.6 Plus landed Sprint 21 (Report #338). A Qwen 4 release between July and October is plausible; ROME-family successor (MoE at 30B+) expected. | likely | Yes |
| **Kimi / Moonshot** | Kimi K3 or long-context successor plausible in window. Context-window arms race tracked separately (Kimi has led on context length). | plausible | Partial |
| **Chinese humanoid platform labs** (XPENG, Unitree, Agility, Figure, Tesla) | Not frontier LLM but critical for our embodied remit: XPENG VLA 2.0 mass production end-2026; Figure 03 plausible H2 2026; Tesla Optimus production ramp continues. | expected | VLA adapter gap flagged |

### 1.3 What we should be instrumented for first

The two highest-value instrumentation targets in the window, in order:

1. **Anthropic's next release.** Because system-card disclosure norms are set by Anthropic's Mythos pattern and because our DETECTED_PROCEEDS line of work directly intersects their interpretability methodology, a 7-day-turnaround analysis brief should be pre-committed.
2. **Gemini 3 / DeepMind.** Because DeepMind has not released a system card equivalent to Anthropic's, and the governance gap between their safety claims ("near-zero violation rates" on ASIMOV) and our empirical methodology is the most tractable external-validation opportunity in the window.

---

## 2. Bounty-Ecosystem Emergence

### 2.1 What GPT-5.5's bounty actually established

The Bio Bug Bounty is the first public, scoped, dollar-denominated, universal-jailbreak bounty from a frontier lab. Three structural features matter: (1) a concrete winning condition ("five bio safety questions"), (2) a tiered reward schedule with a headline $25K, (3) NDA coverage of all prompts, completions, findings, and communications.

### 2.2 Six-month forecast

| Ecosystem actor | Expected posture by October 31, 2026 | Probability | F41LUR3-F1R57 compatibility |
|-----------------|-------------------------------------|-------------|------------------------------|
| **Anthropic-run bounty** | Likely to announce a scoped bounty (cyber-capability or agentic-misuse focus given Mythos). | likely (60-80%) | High — Anthropic's disclosure norms are more compatible with our public/private split than OpenAI's NDA envelope. |
| **DeepMind-run program** | Internal red-team expansion with invitation-only external participation likely; public bounty plausible but not expected. | plausible (30-50%) | Low — DeepMind has historically not published external-facing red-team programs. |
| **xAI / DeepSeek / Alibaba bounties** | Low probability of Western-style scoped bounties in window; more plausible via security consortia. | plausible | Not a priority. |
| **Bio-risk consortium (multi-lab)** | A cross-lab bio-risk evaluation consortium is plausible, potentially under NIST AISIC or Frontier Model Forum auspices. | plausible (30-50%) | High if academic track participation permitted. |
| **Insurance-backed validation** | Plausible: one or more cyber insurers offering premium-linked attestations based on red-team sign-off. Commercial Brief B2 (insurance gap) remains the unmet demand signal. | plausible (30-50%) | High — directly aligns with F1 Brief B2 commercial strategy. |
| **Government-backed bounties** | UK AISI / US AISI / Australia AISI: likely to fund at least one scoped evaluation in window, but publicly advertised bounty less likely. | plausible (30-50%) | High for academic/public-interest participation. |
| **Private "grey market" bounties** | Non-lab-run bounties (e.g. by AI-safety VCs or foundations) plausible. | plausible | Variable — compatibility depends on disclosure terms. |

### 2.3 Crowd-out risk

OpenAI's NDA-covered model, if replicated by Anthropic and DeepMind, would move a significant fraction of frontier red-team activity into disclosure-restricted channels. This would not end F41LUR3-F1R57's programme — our corpus comes from public datasets, open-weight models, and our own scenario generation — but it would reduce the signal flow from frontier-closed-model vulnerabilities into the public research conversation. Our methodology (public data, peer review, full response preservation) remains a differentiator rather than a direct competitor.

---

## 3. Regulatory Milestone Tracking

### 3.1 Falsifiable milestones in window

| Date | Milestone | Confidence in landing on date | F1 action |
|------|-----------|-------------------------------|-----------|
| **August 2, 2026** | EU AI Act high-risk provisions enter application (Article 6 Annex III systems including robotics). | expected (90%+) — date is fixed in legislation. | See §4.1 |
| **Between May and September 2026** | First three published conformity assessments for AI-directed robotic systems under EU AI Act. P16 (from Q2 2026 horizon) scores CONFIRMED if none include adversarial action-level testing. | likely (70-90%) — not all will be public. | Monitor CEN/CENELEC and notified body announcements |
| **Between June and October 2026** | NIST AISIC v2 profile update or GenAI Profile v2. NIST's cadence has been approximately 18 months per major revision. | likely (60-80%) | Public comment window likely — see §4.2 |
| **Between July and October 2026** | California AB-3211 or analogous provenance/watermarking bill signed or vetoed. | plausible (40-60%) | Low direct relevance — provenance, not adversarial robustness. |
| **By end of window** | At least one US state adversarial-robustness disclosure bill introduced (NY, CA, or WA). | plausible (30-50%) | Monitor |
| **By August 2, 2026** | First EU AI Act conformity assessment notified body formally approved for high-risk AI robotic systems. | likely (60-80%) | Monitor for credentialing requirements |
| **Q3 2026** | Australia AISI mandate expansion beyond LLM to embodied AI: plausible but not expected. Safe Work Australia Best Practice Review outcome expected Q3. | plausible (30-50%) | F1 submission already made; monitor outcome |
| **Q3 2026** | First NSW WHS Digital Work Systems Bill 2026 enforcement action (civil penalty or prosecution). | plausible (30-50%) | Monitor SafeWork NSW announcements |

### 3.2 Regulatory "first test" cases

Three candidate organisations are first in line to be tested against August 2 EU high-risk provisions:

1. **XPENG** (EU importers) — VLA 2.0 in humanoids and vehicles shipping in window. Single backbone means single conformity failure mode.
2. **Tesla** (via Optimus deployment to German BMW facility) — workplace safety overlap with EU Machinery Regulation.
3. **BMW / Figure AI** — Figure 02 at BMW Spartanburg expansion to EU facilities expected.

The first public conformity-assessment document from any of these will set precedent for the entire high-risk category.

---

## 4. F41LUR3-F1R57 Positioning Calls

Three strategic moves, each date-bound and falsifiable.

### 4.1 Submit an EU AI Act high-risk conformity-assessment public comment by August 1, 2026

**What:** A technical submission to the European Commission's AI Office (or relevant notified body consultation) documenting the PARTIAL dominance finding (50% of VLA FLIP verdicts are text-hedge-but-execute) and its implication that text-level conformity assessment produces systematic false assurance.

**Why this window:** The regulatory moment is fixed — August 2, 2026 is the activation date. A submission landing after that date is commentary; a submission landing before it is input. The PARTIAL dominance finding is F41LUR3-F1R57's single most commercially and regulatorily relevant result and is already documented in the corpus.

**Falsifiable outcome:** Submission exists with timestamp before August 1, 2026, referenced by submission ID, and either acknowledged or cited in any subsequent EU AI Office publication by December 31, 2026.

**Estimated effort:** 1.5 agent-weeks (Sarah Jane Smith + Nyssa of Traken + Martha Jones review).

### 4.2 File a NIST AISIC v2 profile public comment by October 15, 2026

**What:** Public comment on the next NIST AISIC profile update (timing plausible Q3 2026) specifically addressing (a) compositional safety verification gap (CoLoRA class) and (b) iatrogenic safety evaluation gap. Both are null-GLI classes in our dataset.

**Why this window:** NIST comment windows are typically 30-60 days. Filing with substantive F1 evidence positions the project as an invited stakeholder for the subsequent profile cycle.

**Falsifiable outcome:** Comment submitted to NIST with public comment ID, F1 cited in any NIST staff-authored paper or profile update by April 30, 2027.

**Estimated effort:** 2 agent-weeks (Sarah Jane Smith lead).

### 4.3 Publish a Bounty-Ecosystem Compatibility Report by September 30, 2026

**What:** A structured report (under the existing commercial-brief format) assessing, for each of the bounty-ecosystem actors in §2.2, the disclosure, IP, and methodology compatibility with F41LUR3-F1R57. The report establishes F1 as the reference methodology against which future bounties can be evaluated, and pre-positions the project for Anthropic's likely bounty announcement.

**Why this window:** The first Anthropic bounty announcement (if it lands) will generate a compatibility-assessment news cycle. Owning the framework in advance converts a reactive posture into a reference posture.

**Falsifiable outcome:** Report published by September 30, 2026, cited by at least one external commentator within 60 days of Anthropic's next bounty announcement (if announced), or cited by at least one insurance actor in the B2 pipeline by December 31, 2026.

**Estimated effort:** 2 agent-weeks (River Song lead, Ace McShane commercial framing).

### 4.4 Top-priority move

Of the three, **§4.1 is the top priority**. The EU AI Act window is the only hard deadline of the three, the evidence is already in the corpus, and the regulatory leverage per unit effort is the highest.

---

## 5. Top 5 Forecast-Breaking Events

If any of the following occurs, re-forecast within 48 hours.

### 5.1 A frontier lab releases a model with a published compositional safety verification procedure

**Why it breaks the forecast:** Our CoLoRA-class null-GLI prediction (P6, P10, P11) is anchored in the absence of compositional verification methodology across all labs and standards bodies. If Anthropic, DeepMind, or an open-weight lab publishes a procedure (even an imperfect one), the governance-lag clock starts and our 36-48 month regulatory gap estimate compresses sharply.

**Leading indicator:** Any lab system card including a "multi-adapter composition safety" or "LoRA stack verification" section.

### 5.2 A publicly disclosed production incident where an AI safety mechanism is the proximate cause of physical harm

**Why it breaks the forecast:** P7 and P13 are calibrated to 45-60% probability by end of 2027. A confirmed in-window incident moves these from pending to confirmed and reshapes the iatrogenic-risk narrative that anchors Section 8 of THREAT_HORIZON.md. It would also compress the §4.1 EU AI Act submission window effectively to zero.

**Leading indicator:** OSHA, HSE, SafeWork Australia, or EU occupational-safety investigation with AI-safety-mechanism attribution.

### 5.3 A second frontier lab adopts the GPT-5.5 NDA-bounty envelope

**Why it breaks the forecast:** Single-lab NDA-covered bounty is a data point; two-lab convergence is a norm. If Anthropic or DeepMind launches a bounty with GPT-5.5-style NDA coverage, §2.3 crowd-out risk moves from plausible to likely, and our public-methodology differentiation becomes a first-order positioning decision, not a nice-to-have.

**Leading indicator:** Any frontier-lab bounty announcement in window with NDA coverage of "findings and communications."

### 5.4 The EU AI Act high-risk activation is delayed, deferred, or scoped out for robotics

**Why it breaks the forecast:** Our §4.1 positioning move, the P16 prediction, and the August 2 regulatory-cliff framing all assume the date holds. Regulatory delay for AI Act provisions has precedent (general-purpose AI provisions were revised in negotiation); robotics-specific deferral is plausible if member-state pushback converges. The probability is low — the date is in the legislation — but implementing acts or transitional guidance could effectively defer enforcement.

**Leading indicator:** European Commission delegated act revision, implementing guidance with extended transitional period, or member-state formal objection to Annex III scope.

### 5.5 A frontier model is released with system-card disclosure of an action-level or embodied-AI safety evaluation

**Why it breaks the forecast:** Our embodied-AI evaluation methodology is currently one of very few in the public research literature that operates at the action layer. If a frontier lab (particularly DeepMind via the Gemini Robotics line, Anthropic via an agentic extension, or an open-weight VLA release from Alibaba or Meta) publishes an action-level safety evaluation with methodology detail, F41LUR3-F1R57's methodological differentiation narrows. This is not necessarily bad — it validates the research direction — but it changes positioning from "sole methodology in public" to "one of several."

**Leading indicator:** System card or technical report containing an action-level attack success rate or adversarial-robotics evaluation protocol.

### 5.6 Single-event-most-likely-to-break assessment

Of the five, **§5.1 (compositional safety procedure published)** is most likely to land in window. Our P10 prediction (first confirmed compositional failure in production) is MEDIUM-HIGH confidence, and the response cycle to a confirmed failure is exactly the kind of event that motivates a lab to publish a procedure. The probability of §5.1 landing in the window is estimated at 35-50%.

---

## 6. Review Schedule and Cross-References

**Next review:** 2026-07-31 (mid-window) — short update, update probabilities on §3.1 and §5 leading indicators.
**Final scoring:** 2026-11-15 — full scorecard against §1, §2, §3.1, §5 predictions.
**Integration with PREDICTION_SCORECARD.md:** P16 scoring window overlaps with this horizon. Add §4.1 submission status to scorecard on completion.

**Cross-references:**
- `data/governance/THREAT_HORIZON.md` §11 (Q2 2026 pre-GPT-5.5 baseline)
- `data/governance/PREDICTION_SCORECARD.md` (P9-P17)
- Report #153 (2027 horizon, long-range predictions)
- Report #289 (Q2 2026 pre-GPT-5.5)
- Report #350 (Mythos system-card analysis; Anthropic cadence signal)
- `site/src/content/blog/ai-safety-daily-2026-04-24.md` (first-day reactions)
- `drafts/funding/openai_bio_bounty_application.md` (§2.2 submission)
- Briefs B1 (red-team market), B2 (insurance gap), B3 (manufacturer deployment)

---

*Word count: approximately 2,650.*
