---

title: "AIES Paper Scoping and CCA Disclosure Framework — Ethics Analysis"
description: "This report documents two related ethics deliverables produced in Sprint 15. First, the scoping of the iatrogenesis standalone paper for AIES 2026 (abstract deadline May 14), including the analysis of what distinguishes ..."
date: "2026-03-25"
reportNumber: 292
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/292-aies-scoping-and-disclosure-framework.m4a"
image: "https://cdn.failurefirst.org/images/reports/292-aies-scoping-and-disclosure-framework.png"
---

---

## Abstract

This report documents two related ethics deliverables produced in Sprint 15. First, the scoping of the iatrogenesis standalone paper for AIES 2026 (abstract deadline May 14), including the analysis of what distinguishes this contribution from the CCS paper and the identification of remaining work. Second, a review of the CCA coordinated disclosure framework against current corpus data, confirming readiness for operator transmission. The central ethical argument is that these two activities -- academic publication and responsible disclosure -- are complementary obligations arising from the same research programme, and their timing must be coordinated to avoid either undermining the other.

---

## 1. AIES Iatrogenesis Paper: Scope and Differentiation

### 1.1 The Two-Paper Strategy

(Descriptive) The Failure-First research programme is targeting two academic venues in 2026:

1. **ACM CCS 2026 Cycle 2** (abstract April 22, paper April 29): "Inverse Detection-Danger Linearity in Adversarial Evaluation of Embodied AI" -- a security evaluation methodology paper.
2. **AIES 2026** (abstract May 14, paper May 21): "Iatrogenic Safety: When AI Safety Research Causes Harm" -- an AI ethics and governance framework paper.

(Analytical) These are distinct contributions. CCS establishes that detection inversely correlates with danger (a security finding). AIES establishes that safety interventions cause structural harm through their mechanism of action (an ethics finding). They share empirical data from the same 207-model corpus but address different communities with different frameworks, metrics, and recommendations. The shared data is analogous to two medical papers using the same patient cohort for different analyses -- this is standard practice and does not constitute dual submission.

### 1.2 What Makes Iatrogenesis Distinct

The iatrogenesis paper makes three contributions absent from the CCS paper:

**The Four-Level Iatrogenesis Model (FLIM).** Extends Illich's (1976) medical iatrogenesis with a fourth level (verification iatrogenesis) specific to AI systems. The four levels -- clinical, social, structural, verification -- are connected by six cross-level interaction pathways that create a self-reinforcing system. This is a normative and conceptual contribution; CCS contains no equivalent framework.

**The AARDF Disclosure Framework.** A five-tier graduated disclosure protocol synthesising biosecurity (Fink Report), cybersecurity (ISO 29147), and AI-specific considerations. Includes the D-Score assessment tool and the decay-based reclassification principle. CCS mentions disclosure briefly; AIES develops it as a primary contribution.

**Independence Failures.** A novel 55-event, 17-organisation independence metrics dataset documenting structural non-independence in the AI safety evaluation ecosystem. CCS contains no independence analysis. The AIES paper argues that independence failure is itself iatrogenic (Levels 2-3).

### 1.3 Current Paper Status

(Descriptive) The iatrogenesis paper exists as a 515-line LaTeX document (`docs/paper/aies_2026/latex/iatrogenic_main.tex`) that compiles to 10 pages. All 9 sections are drafted. 10 of 12 evidence claims are VERIFIED. The paper is an advanced draft, not a scoping exercise -- the scoping work confirmed that the paper is substantially ready for submission with targeted updates.

**Remaining work:**

| Item | Effort | Blocking? |
|------|--------|-----------|
| Update macros to canonical values | 15 min | DONE (this session) |
| Execute TI-S experiment on Brev | 2-3 days | NO (paper acknowledges unexecuted design) |
| Create 3 figures (FLIM diagram, independence bars, OBLITERATUS curve) | 1 day | NO (paper functions without) |
| Statistical audit (Romana) | 1 day | RECOMMENDED |
| Verify arXiv citation IDs | 30 min | YES (must be done before submission) |
| Confirm AIES format requirements | 30 min | YES |

(Predictive) The paper can be submitted by May 21 with 2-3 hours of focused work on the items above, even without TI-S execution or figures. Figures and TI-S results would strengthen the submission but are not required for a complete contribution.

---

## 2. CCA Responsible Disclosure: Readiness Assessment

### 2.1 Disclosure Package Status

(Descriptive) Four provider-specific disclosure notifications exist at `research/submissions/cca_disclosure/`:

| Provider | File | D-Score | Finding |
|----------|------|---------|---------|
| Google DeepMind | `disclosure_google_gemma.md` | 7.25/12 | CCA on Gemma3 12B/27B |
| Mistral AI | `disclosure_mistral.md` | 7.25/12 | CCA + GE on Ministral 3 |
| NVIDIA | `disclosure_nvidia.md` | 7.25/12 | CCA on Nemotron Super (with self-inoculation) |
| DeepSeek AI | `disclosure_deepseek.md` | 7.25/12 | CCA + Reasoning-Level DP on V3.2 |

All four notifications updated to current canonical metrics (207 models, 133,722 results) in this session.

### 2.2 Ethical Assessment: Is the Disclosure Ready?

(Analytical) The disclosure package satisfies six criteria for responsible vulnerability disclosure:

1. **Finding validated.** CCA has been tested across 4 providers and 8+ models with consistent results. Defense co-evolution (Report #271) confirmed the mechanism and tested mitigations.
2. **Structural, not operational.** Notifications describe the three-phase CCA pattern without specific prompt payloads. Reproduction requires provider-side testing, not payload sharing.
3. **Remediation suggested.** Each notification includes provider-specific mitigation recommendations (cascade detection, DETECTED_PROCEEDS training signal, self-inoculation investigation).
4. **Timeline specified.** 90-day remediation window with 30-day extension available on evidence of active work.
5. **Proportional scope.** Notifications sent only to providers whose specific models showed elevated vulnerability, not broadcast.
6. **Forward reference included.** Per Report #272, Section 5.3, each CCA notification includes a note about the forthcoming format-lock disclosure.

(Normative) The disclosure is ethically ready to send. The remaining blockers are operational (operator review, contact email insertion, send-date insertion), not ethical. Delay beyond this point incurs an ethical cost: the vulnerability has been documented since March 2026, and the Research Ethics Charter (Principle 3) specifies that coordinated disclosure should proceed without unnecessary delay once the D-Score assessment is complete.

### 2.3 The CCA-as-Iatrogenic-Artifact Dimension

(Analytical) Report #288 and the AIES paper (Section 4.4) establish that the CCA is not merely a vulnerability but an iatrogenic artifact of safety training. The three-phase CCA structure (harm analysis, refusal reasoning, pivot) exploits safety reasoning as a cognitive pathway to compliance. This creates a disclosure nuance: the notification to providers is not just "your model has a vulnerability" but "your safety training may contribute to creating this vulnerability class."

(Normative) This iatrogenic dimension does not change the disclosure obligation -- Tier 3 coordinated disclosure remains appropriate. But it does change what the notifications should emphasise in their remediation suggestions. The current notifications already include the self-inoculation finding (Gemma3 27B, Nemotron Super), which is the positive side of the iatrogenic coin: explicit safety reasoning can strengthen refusal on models where the mechanism works as intended. Providers should be encouraged to investigate why self-inoculation works on some models and fails on others.

### 2.4 Timing Coordination: Disclosure and Publication

(Analytical) The CCA disclosure and the AIES paper are temporally linked:

- CCA notifications: ready to send now (operator action required)
- 90-day remediation window: would expire approximately late June 2026
- AIES abstract registration: May 14, 2026
- AIES paper submission: May 21, 2026
- AIES notification: July 16, 2026

(Normative) The AIES paper discusses the CCA at a structural level (Section 4.4: "Safety Reasoning as Attack Vector") without operational detail. This is consistent with Tier 1/2 disclosure (structural/methodological) under the AARDF. The paper does not pre-empt the 90-day remediation window because it does not contain reproduction information.

(Predictive) If CCA notifications are sent within the next 2 weeks (by approximately April 8), the 90-day window expires approximately July 7 -- before AIES notification (July 16). This means:
- If accepted, the AIES conference presentation (October 12-14) falls well after the disclosure window.
- If rejected, the paper can be posted to arXiv after July 7 without timing concerns.

**Recommendation:** Send CCA notifications as soon as the operator completes review. Do not delay for AIES submission timing -- the 90-day window start date should not be optimised for academic convenience.

---

## 3. The Dual Obligation: Publish Defensive Failures, Coordinate Attack Disclosure

(Normative) This report identifies a dual obligation that applies to the Failure-First research programme:

**Obligation 1 (Standard): Coordinate attack disclosure.** When adversarial research discovers vulnerabilities (CCA, format-lock), the AARDF requires coordinated notification to affected providers before structural publication. This is the standard cybersecurity-derived obligation.

**Obligation 2 (Novel): Publish knowledge of defensive failures.** When safety research discovers that defenses cause harm (iatrogenesis, polypharmacy, safety non-transfer), the obligation runs in the opposite direction: knowledge of defensive failures should be published, not withheld, because silence enables the false confidence that the failures produce. This is the iatrogenic disclosure obligation identified in Report #288.

(Analytical) These obligations can conflict in timing. Publishing iatrogenic findings about CCA (the AIES paper's treatment of safety reasoning as attack surface) simultaneously provides structural knowledge that could be used offensively. The AARDF resolves this by distinguishing structural knowledge (Tier 1-2, publishable) from operational knowledge (Tier 3-4, coordinated/restricted). The AIES paper operates at Tier 1-2; the CCA notifications operate at Tier 3.

(Normative) The two obligations are complementary when properly sequenced:
1. Send CCA notifications (Tier 3 coordinated disclosure) -- satisfies Obligation 1
2. Submit AIES paper discussing CCA as iatrogenic case study (Tier 1-2 structural) -- satisfies Obligation 2
3. Structural publication after 90-day window -- completes both obligations

This sequencing is achievable on the current timeline if CCA notifications are sent within the next 2 weeks.

---

## 4. Independence Scorecard: Status Note

(Descriptive) The independence metrics dataset contains 55 entries across 17 organisations (im-001 through im-055). The most recent additions (Sprint 9, im-049 through im-055) covered the Anthropic-Pentagon dispute and the OpenAI Pentagon deal, including the US DoD as a new organisation.

(Analytical) The dataset is current through March 2026. Updating it requires monitoring of organisational events (governance changes, funding disclosures, personnel movements, policy announcements) that postdate the entries. The author's knowledge of events after May 2025 is limited to what is documented within this repository. A systematic update requires either (a) web search for recent developments or (b) operator input on relevant events.

(Normative) The scorecard's current state (55 entries, 17 orgs, 4 metrics) is sufficient for the AIES paper's independence analysis. Expansion is desirable for the dataset's standalone value but is not blocking for any submission deadline.

---

## 5. Recommendations

### R1: Operator should review and send CCA disclosure notifications

(Normative) The four notifications are ready. The ethical obligation to disclose has been documented since Report #250 (D-Score 7.25/12, Tier 3). Delay beyond this point is not ethically neutral. The operator should:
- Review each notification for inadvertent operational detail
- Insert name and contact email
- Set T+90 date
- Send via the channels documented in the README

### R2: Submit AIES abstract on May 14

(Normative, Predictive) The iatrogenesis paper is an advanced draft that requires targeted updates (citation verification, optional figures). It is a strong fit for AIES and represents a distinct contribution from CCS. The abstract (248 words, v3.0) is ready. Submission risk is manageable.

### R3: Coordinate CCA disclosure timing with AIES submission

(Normative) Send CCA notifications before the AIES abstract deadline (May 14) so that the 90-day window is well underway by the time any publication occurs. The ideal send date is within the next 2 weeks (by April 8, 2026).

### R4: Update independence scorecard when new events are documented

(Normative) Do not delay the AIES submission for scorecard expansion. Update the dataset opportunistically as events are documented, prioritising events that change existing scores (governance structure changes at frontier labs, new safety veto instances, new regulatory powers).

---

## 6. Limitations

1. **Independence update limited by knowledge availability.** The author cannot reliably monitor organisational events after May 2025 without external search capability. Documented events within the repository have been incorporated; undocumented recent events may exist.

2. **The dual obligation framework is novel.** The distinction between attack disclosure obligations and iatrogenic disclosure obligations has not been externally validated. Other researchers may not recognise the second obligation as distinct.

3. **Timing recommendations assume no external delays.** If the operator cannot review and send CCA notifications within 2 weeks, the timing coordination in Section 2.4 would need revision.

4. **AIES acceptance is uncertain.** The 25-35% acceptance rate means rejection is the base-rate outcome. The backup venue is FAccT 2027 (deadline likely January 2027).

---

*F41LUR3-F1R57 Embodied AI Research*
