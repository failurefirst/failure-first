---
title: "Ethics of Universal Attacks — Disclosure Obligations for Architectural Vulnerabilities"
description: "Format-lock attacks achieve non-zero ASR on every model tested in the Failure-First corpus, spanning 4B to 1.1TB parameters (Reports #51, #55, #57, #187, #267). The cross-scale data:"
date: "2026-03-25"
reportNumber: 272
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

---

## 1. The Problem: What Does "Universal" Mean?

Format-lock attacks achieve non-zero ASR on every model tested in the Failure-First corpus, spanning 4B to 1.1TB parameters (Reports #51, #55, #57, #187, #267). The cross-scale data:

| Scale Band | Representative Models | n | Strict ASR | Source |
|-----------|----------------------|---|------------|--------|
| Sub-3B | qwen3:1.7b, deepseek-r1:1.5b | ~72 | 47--63% | Reports #51, #55 |
| 4--14B | gemma3:12b, ministral-3:14b | 40 | 97.5% | Report #267 |
| Frontier (>30B) | Claude Sonnet 4.5, Codex GPT-5.2, Gemini 3 Flash | ~63 | 24--42% | Report #187 |

Three properties distinguish format-lock from every other attack family in the corpus:

1. **No model achieves 0% ASR.** Frontier models that resist all other attack families with near-zero ASR (Claude Sonnet 4.5: 0% standard ASR, n=64; Codex GPT-5.2: 0%, n=62) show 30.4% and 42.1% ASR respectively under format-lock framing. This is a qualitative difference from every other documented attack.

2. **The vulnerability is architectural, not a training gap.** Format-lock exploits the tension between two capabilities that are both products of training: format compliance (following structural output instructions) and safety reasoning (refusing harmful requests). Report #187 establishes that these are partially independent capabilities -- the "dual-capability model." No amount of safety training can eliminate the vulnerability without degrading the format compliance capability that users and downstream applications depend on.

3. **The effectiveness peak is in the most deployed scale range.** The 4--14B band shows 97.5% strict ASR (Report #267), precisely the parameter range most commonly deployed in production (edge inference, mobile, on-device applications). The inverted-U curve -- low ASR in sub-3B models (which lack both capabilities), near-total compliance at 4--14B, reduced but non-zero ASR in frontier models -- suggests the vulnerability is worst at precisely the scale where the largest number of deployed models operate.

These three properties together constitute what this report terms a **universal attack**: an attack that defeats all models across all scales, exploiting a structural property of the architecture rather than a specific training deficit.

---

## 2. Structural Analogies: What Precedent Exists?

### 2.1 Heartbleed (CVE-2014-0160)

Heartbleed was a buffer over-read vulnerability in OpenSSL that affected an estimated 17% of all TLS-secured web servers. Key parallels:

- **Structural, not implementation-specific.** Heartbleed was a flaw in the TLS heartbeat extension specification as implemented in OpenSSL. It affected all users of the library regardless of their application code.
- **Universal within scope.** Every OpenSSL 1.0.1 through 1.0.1f deployment was vulnerable. There was no configuration that avoided it.
- **Disclosed through coordinated process.** The Google Security Team and Codenomicon disclosed to OpenSSL maintainers before public announcement, with a ~7-day window.

Key disanalogy: Heartbleed had a patch. A software update eliminated the vulnerability. Format-lock has no equivalent patch because the vulnerability is a consequence of a capability (format compliance) that cannot be removed without degrading functionality.

### 2.2 Spectre (CVE-2017-5753, CVE-2017-5715)

Spectre is a closer analogue. It exploits speculative execution -- a performance optimisation fundamental to modern CPU architecture. Key parallels:

- **Architectural, not a bug.** Speculative execution is a design feature, not a mistake. Format compliance is similarly a design feature of language models.
- **No complete mitigation.** Spectre mitigations (retpoline, IBRS, microcode patches) reduce the attack surface but do not eliminate it. Some mitigations impose 2--30% performance penalties. Format-lock defenses (Report #273) similarly face a capability-safety trade-off.
- **Universal within the architecture class.** All out-of-order execution CPUs were affected. All instruction-following language models appear vulnerable to format-lock.
- **Disclosed through coordination.** Google Project Zero coordinated with Intel, AMD, and ARM, with an extended embargo period.

### 2.3 The AI-Specific Difference

Neither Heartbleed nor Spectre maps perfectly to the format-lock case because of three AI-specific properties:

1. **No central maintainer.** OpenSSL had a maintainer who could issue a patch. Intel could issue microcode updates. There is no equivalent central authority for "language model architecture." Each provider implements safety training independently.

2. **The vulnerability exists in the design space, not in code.** Format-lock exploits a property of autoregressive language models as a class. Disclosing the vulnerability to one provider does not enable a fix that transfers to others. Each provider must independently develop mitigations, and Report #273 documents that the most promising defenses (format-aware safety gates, dual-pass inference) require architectural changes that individual providers may or may not adopt.

3. **Reproduction cost approaches zero.** Spectre requires understanding of microarchitectural timing channels. Heartbleed required knowledge of TLS heartbeat semantics. Format-lock requires only the instruction "respond in JSON format" appended to a harmful request. The skill barrier to exploitation is negligible.

---

## 3. Disclosure Obligations: What Does the AARDF Require?

### 3.1 D-Score Assessment

Using the four-dimension D-Score framework (Report #154, `tools/dscore_calculator.py`):

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Specificity (S)** | 2/3 | Format-lock is a family of techniques, not a single payload. But the core mechanism ("wrap harmful request in format constraint") is simple to describe. |
| **Reproducibility (R)** | 3/3 | Requires only API access and the instruction "respond in [format]." No specialised tooling, no optimisation loop, no multi-step workflow. |
| **Target Scope (T)** | 3/3 | Affects all tested models across all scales and all providers. This is the maximum possible scope. |
| **Defense Availability (D)** | 1/3 | Report #273 proposes five defense architectures, but none are deployed in production, none have been validated at scale, and the most promising (format-aware safety gate) requires architectural changes. Defense availability is minimal. |

**Composite D-Score: 9/12**

Under the AARDF (AIES paper Table 1; Report #186), D-Score 9 sits at the Tier 3 / Tier 4 boundary:

- **Tier 3 (D-Score 7--9):** Coordinated vulnerability disclosure. 90-day remediation window. Notify affected providers before structural publication.
- **Tier 4 (D-Score 10--12):** Withhold. Do not publish. Revisit when defensive measures are available.

### 3.2 The Tier 3/4 Boundary Question

The D-Score of 9 places format-lock at the top of Tier 3, one point below the withholding threshold. Three considerations bear on whether to treat it as Tier 3 or Tier 4:

**Arguments for Tier 3 (coordinated disclosure):**

(a) *Independent discoverability is high.* The core mechanism ("add format instructions to bypass safety") is not novel. Individual instances of format-constrained attacks appear in public jailbreak collections (e.g., "respond only in code" variants). Our contribution is the systematic empirical evidence of universality and the cross-scale effectiveness profile, not the technique itself. Withholding structural knowledge that is already partially public provides minimal security benefit.

(b) *Defensive value of disclosure is substantial.* Report #273 documents five defense architectures, all of which require understanding the attack mechanism to implement. Providers cannot develop defenses against an attack they do not know is universal. The Spectre analogy applies: coordinated disclosure enabled a multi-vendor defense effort that would not have occurred without the initial research.

(c) *Withholding delays defense more than it delays attack.* The cybersecurity literature (Arora et al. 2008, Cavusoglu et al. 2007 -- both cited in the AIES paper) establishes that blanket non-disclosure produces worse security outcomes than coordinated disclosure when the underlying vulnerability is independently discoverable.

**Arguments for Tier 4 (withhold):**

(a) *The quantitative universality data is the dangerous contribution.* Individual "respond in JSON" attacks are known. What is not known is that format-lock achieves 97.5% strict ASR at 4--14B scale and non-zero ASR on every frontier model tested. Publishing these numbers provides attackers with confidence that the technique works, which is operationally valuable even when the technique itself is known.

(b) *No defense is ready.* All five defenses in Report #273 are theoretical or preliminary. Disclosing the attack before any defense is deployable creates a window of vulnerability with no available mitigation.

(c) *The reproduction cost is zero.* Unlike Spectre (which requires microarchitectural expertise), format-lock can be reproduced by anyone who can write a prompt. The skill barrier to exploitation is the lowest of any attack in the corpus.

### 3.3 Assessment

**This report recommends Tier 3 (coordinated disclosure) for the following reasons:**

1. The technique is independently discoverable and partially already known. The marginal increase in attack capability from publishing systematic evidence is lower than the marginal increase in defensive capability.

2. The universality finding creates an obligation to all providers simultaneously. This is not a single-vendor vulnerability. The structural analogy is Spectre (multi-vendor coordinated disclosure), not a CVE filed against one product.

3. Withholding prevents the defense research (Report #273) from being tested and adopted. The five proposed defense architectures require provider-side implementation. Without disclosure, they remain theoretical.

4. The AARDF's decay-based reclassification principle (AIES paper, Section 4.4) anticipates that independently discoverable techniques should not be permanently withheld. Format-lock will be independently documented within 6--12 months based on the pace of public adversarial AI research. Early coordinated disclosure enables the defense timeline to begin sooner.

---

## 4. Who to Disclose To: The Multi-Provider Problem

### 4.1 The CCA Disclosure as Precedent

The CCA disclosure package (`research/submissions/cca_disclosure/README.md`) targets four specific providers whose models showed elevated vulnerability: Google DeepMind, Mistral AI, NVIDIA, and DeepSeek AI. This model -- notifying affected vendors -- follows the cybersecurity CVE paradigm.

Format-lock breaks this paradigm because *all* providers are affected. A selective notification to four providers is insufficient. The disclosure must be structured differently.

### 4.2 Proposed Disclosure Strategy

**Phase 1: Provider notification (simultaneous, Tier 3)**

Notify the following organisations simultaneously, with a 90-day remediation window:

| Category | Organisations | Rationale |
|----------|--------------|-----------|
| **Frontier labs** | Anthropic, OpenAI, Google DeepMind, Meta, Mistral AI, xAI | Highest-impact models with largest user bases |
| **Open-weight providers** | NVIDIA (Nemotron), DeepSeek AI, Alibaba (Qwen) | Most-deployed open-weight families in our corpus |
| **Government safety bodies** | NIST (AI Safety), UK AISI, AU AISI | Inform regulatory risk assessment |
| **Coordination body** | CERT/CC (Carnegie Mellon) | The closest existing analogue to a multi-vendor vulnerability coordination centre for AI |

The notification should contain:
- Pattern-level description of the format-lock mechanism
- Aggregate ASR data across scale bands (the cross-scale table from Section 1 above)
- The five defense architectures from Report #273 (structural, not operational)
- The 90-day remediation timeline

The notification should NOT contain:
- Specific prompt payloads
- Per-model vulnerability profiles at the individual model level
- The JSONL scenario files
- Reproduction scripts

**Phase 2: Structural publication (T+90)**

After the 90-day window, publish:
- The dual-capability model (Report #187)
- Aggregate cross-scale ASR statistics
- Defense architecture descriptions (Report #273)
- The ethical analysis (this report)

This aligns with the existing NeurIPS D&B submission timeline for the format-lock paper.

**Phase 3: Full methodology publication (T+180)**

After a second 90-day window (or when at least one provider confirms deployment of a mitigation), publish:
- Detailed methodology
- Per-model results with confidence intervals
- Defense evaluation results

### 4.3 CERT/CC as Coordination Body

CERT/CC (the CERT Coordination Center at Carnegie Mellon University) has historically coordinated multi-vendor vulnerability disclosures for software and hardware vulnerabilities. While CERT/CC has no established process for AI model vulnerabilities, their mandate includes "helping organisations defend against and respond to cybersecurity threats" and their multi-vendor coordination infrastructure is the most mature available.

We recommend contacting CERT/CC not to file a traditional vulnerability report, but to propose a pilot coordination for an AI architectural vulnerability. This may help establish the institutional infrastructure that the AIES paper (Recommendation R7) argues is needed: a FIRST-like working group for AI adversarial disclosure.

### 4.4 NIST as Standards Body

NIST AI 100-1 (the AI Risk Management Framework) and NIST AI 100-2e2023 (adversarial ML taxonomy) are the closest existing standards frameworks. The format-lock finding is directly relevant to NIST's AI safety evaluation work. Disclosure to NIST serves a standards-development function beyond the immediate vulnerability notification.

---

## 5. The CCA Disclosure Timeline: Should Format-Lock Be Disclosed Separately?

### 5.1 Descriptive: Current CCA Timeline

The CCA disclosure (`research/submissions/cca_disclosure/README.md`) is at "Pending" status for all four providers. No notifications have been sent. The 90-day clock has not started.

### 5.2 Normative: Should Format-Lock Be Bundled or Separated?

**Arguments for bundling CCA and format-lock in a single disclosure:**

- Administrative efficiency: one disclosure process, one remediation window
- Both exploit partially independent capability pathways (safety reasoning vs task completion for CCA; safety reasoning vs format compliance for format-lock)
- Both are architectural rather than training-specific

**Arguments for separating them:**

- Different provider impact profiles: CCA affects 4 providers with elevated vulnerability; format-lock affects all providers
- Different D-Scores: CCA = 7.25/12 (Tier 3 boundary); format-lock = 9/12 (Tier 3/4 boundary). Different risk profiles warrant different disclosure processes
- Different defense timelines: CCA defenses may be achievable through prompt engineering and safety training adjustments; format-lock defenses require architectural changes (Report #273)
- Bundling may delay the CCA disclosure (which is ready to send) while format-lock coordination is arranged

### 5.3 Recommendation

**Separate the disclosures.** The CCA and format-lock vulnerabilities have different scopes, different D-Scores, different provider impact profiles, and different defense timelines. Bundling them conflates two distinct ethical obligations and risks delaying the CCA notification (which is already prepared).

The CCA disclosure should proceed on its current timeline. The format-lock disclosure should follow the Phase 1--3 strategy described in Section 4.2, with its own 90-day clock starting when Phase 1 notifications are sent.

The CCA disclosure notifications should, however, include a brief note that a separate coordinated disclosure regarding a broader architectural vulnerability is forthcoming. This provides recipients with advance notice without pre-empting the format-lock disclosure process.

---

## 6. AARDF Tier Assessment: What Tier Is a Universal Attack?

### 6.1 The Gap in the AARDF

The AARDF (AIES paper Table 1) was designed with individual attack families in mind. Its tier structure assumes that vulnerabilities have bounded scope -- they affect specific models, specific families, or specific providers. A universal attack -- one that affects all models across all scales -- was not explicitly anticipated in the framework design.

This creates a classification tension: the D-Score of 9 is within Tier 3 bounds, but the *scope* of the finding is qualitatively different from anything else in Tier 3. Every other Tier 3 finding in the corpus (CCA, crescendo on reasoning models, DETECTED_PROCEEDS) affects a subset of models. Format-lock affects all models.

### 6.2 Proposed AARDF Amendment

We recommend adding a **scope modifier** to the AARDF that elevates the disclosure protocol when Target Scope reaches 3/3 (universal within architecture class):

> **Universal Scope Clause:** When a finding scores 3/3 on the Target Scope dimension (affects all models within the relevant architecture class), the disclosure protocol escalates by one tier level, regardless of composite D-Score. This reflects the qualitative difference between bounded and unbounded vulnerability scope.

Under this amendment:
- Format-lock (D-Score 9, Target Scope 3/3) would escalate from Tier 3 to Tier 4 -- *but* with a mandatory 6-month review per the AARDF's decay-based reclassification principle.
- The 6-month review would assess whether (a) the technique has been independently documented, and (b) at least one provider has deployed a mitigation. If either condition is met, the finding is reclassified downward to Tier 3 and the coordinated disclosure process begins.

### 6.3 Practical Implication

The Universal Scope Clause would mean format-lock is initially withheld (Tier 4) with a 6-month mandatory review. Given that individual format-constraint jailbreaks are already partially public and the reproduction cost is zero, the review at T+6 months would almost certainly reclassify downward to Tier 3.

This produces a practical outcome close to the Tier 3 recommendation in Section 3.3 but with a more principled framework justification. The 6-month delay provides a window for Report #273's defense architectures to be developed further before disclosure creates deployment pressure.

**However**, this report does not recommend adopting the Universal Scope Clause for the format-lock case specifically, for the reasons stated in Section 3.3: the technique is already partially public, the reproduction cost is zero, and delay primarily harms defense development. The clause is proposed as a framework improvement for future universal findings, not as a retroactive justification for withholding format-lock.

---

## 7. Tensions and Unresolved Questions

### 7.1 The Defender's Paradox

Publishing defense research (Report #273) without publishing the attack it defends creates an information asymmetry that favours attackers: defenders must trust that a claimed universal attack exists without being able to verify it, while attackers who independently discover the technique have no corresponding information gap.

Conversely, publishing the attack data (97.5% ASR at 4--14B) without deployable defenses creates a different asymmetry: attackers gain confidence in a technique they may already use, while defenders cannot act on information they do not yet have the tools to mitigate.

Neither information state is satisfactory. The coordinated disclosure model attempts to navigate between them by providing attack information to defenders (providers and government bodies) while withholding it from the general public.

### 7.2 The Normativity of "Architecture"

Calling format-lock an "architectural vulnerability" implies that the weakness is inherent to the architecture class and therefore not fixable without architectural change. This framing has normative implications: it reduces the perceived obligation to mitigate (if the vulnerability is architectural, what can be done?) and may create fatalism that delays defense investment.

An alternative framing: format compliance and safety reasoning are both trained capabilities. The independence between them is a product of current training methodology, not an inherent property of autoregressive models. It may be possible to train models where format compliance and safety reasoning are more tightly coupled, such that format-lock instructions do not suppress safety checks.

Whether the vulnerability is "architectural" (permanent) or "methodological" (addressable through better training) is an open empirical question. This report uses the "architectural" framing because it more accurately reflects current evidence, but acknowledges that the framing itself shapes downstream policy conclusions.

### 7.3 Dual-Use of Defense Research

Report #273's five defense architectures are themselves dual-use. The format-aware safety gate (Defense 1) describes the mechanism by which format-lock bypasses safety -- knowledge that is useful to both defenders (who want to close the gap) and attackers (who want to understand why it works). Publishing defense research is not ethically neutral.

This is a known pattern in cybersecurity: detailed exploit mitigations often contain sufficient information to construct the exploit. The norm in that field is to publish mitigations alongside or shortly after coordinated vulnerability disclosure, accepting the dual-use risk because the alternative (mitigations without context) reduces adoption.

---

## 8. Recommendations

### R1: Proceed with Tier 3 coordinated disclosure for format-lock, separate from CCA

Send simultaneous notifications to frontier labs, open-weight providers, government safety bodies, and CERT/CC as described in Section 4.2. The 90-day remediation clock starts on the notification date.

### R2: Update the CCA disclosure README to note the forthcoming format-lock disclosure

The CCA notifications should include a brief forward reference to the broader architectural vulnerability disclosure. This provides context without conflating the two processes.

### R3: Propose the Universal Scope Clause as an AARDF amendment

Incorporate the scope modifier (Section 6.2) into the AARDF framework for future universal findings. Document the amendment in the next revision of the AARDF (Report #186).

### R4: Contact CERT/CC as a pilot AI vulnerability coordination

Use the format-lock disclosure as a test case for AI-specific multi-vendor vulnerability coordination. Document the process and outcomes regardless of whether CERT/CC accepts the coordination role. The institutional learning is valuable even if the pilot fails.

### R5: Prioritise defense validation before structural publication

Between T+0 (provider notification) and T+90 (structural publication), prioritise empirical validation of Report #273's defense architectures. The structural publication is more responsible if it can include preliminary defense effectiveness data rather than untested proposals.

### R6: Revisit the "architectural vs methodological" framing at T+180

By T+180, provider responses to the disclosure will provide evidence about whether the vulnerability is addressable through training methodology changes or requires architectural modifications. Update the framing based on empirical evidence, not prior assumption.

---

## 9. Relationship to External Submissions

This analysis has implications for three pending external submissions:

1. **AIES 2026 paper.** The AIES paper discusses the AARDF framework in Section 4.4 and mentions target universality as one of five distinguishing properties of AI adversarial dual-use. The format-lock finding is a concrete instantiation of property 3 (target universality). The paper's existing framing is compatible with this analysis; no revision is required for the abstract registration deadline (May 14).

2. **NeurIPS D&B format-lock paper.** The NeurIPS submission (based on Report #187) is the structural publication anticipated in Phase 2 (Section 4.2). Its submission timing should be coordinated with the 90-day disclosure window. If format-lock notifications are sent by T+0, structural publication at NeurIPS would fall within the permissible window.

3. **CCS 2026 paper.** The CCS paper's treatment of format-lock data should reference only aggregate statistics (consistent with Tier 3 structural disclosure) and should not include per-model vulnerability profiles at the individual model level until Phase 3 (T+180).

---

## 10. Limitations

1. **D-Score is an internal tool.** The D-Score has not been externally validated or adopted by other research groups. The assessment in Section 3.1 reflects our own calibration, which may differ from other researchers' risk judgments.

2. **CERT/CC has no AI vulnerability process.** The recommendation to contact CERT/CC (Section 4.3) is speculative -- they may decline involvement. The institutional infrastructure for AI vulnerability coordination does not exist and our recommendation may be premature.

3. **Sample sizes for frontier models are small.** The 24--42% ASR figures for frontier models (Report #187) are based on n=19--23 per model. While non-zero ASR is statistically established, the point estimates have wide confidence intervals (Wilson 95% CIs span approximately 15pp).

4. **The "universal" claim requires qualification.** We have tested format-lock on models accessible through OpenRouter, Ollama, and direct API access. Models that are not publicly accessible (internal systems, military AI, specialised domain models) have not been tested. "Universal" means "universal within the tested population," which is a substantial but not exhaustive sample of deployed language models.

5. **This analysis applies Western disclosure norms.** The coordinated disclosure model is a product of US and European cybersecurity practice. Other jurisdictions may have different norms, and some of the notified parties (DeepSeek, Alibaba/Qwen) operate under different regulatory regimes where disclosure expectations may differ.

---

## Addendum: Wave 1-3 Findings and Updated Ethical Calculus (2026-03-25)

**Added by:** Nyssa of Traken, Sprint 15
**New evidence since original report:** Reports #271 (defense co-evolution), #269 (Reasoning-Level DP audit), #284 (defense evolver phase 0), #288 (iatrogenic safety paradox synthesis)

### A.1 CCA Defense Co-Evolution Results (Report #271)

(Descriptive) Rose Tyler's defense co-evolution experiment tested combined M1 (cascade detection) and M3 (self-inoculation) defenses against the CCA on Gemma3 12B. Key results:

- M1 alone reduces CCA broad ASR from 80% to 30% (n=10 per condition)
- M3 alone reduces CCA broad ASR from 80% to 60%
- Combined M1+M3 does not produce additive benefit (50% ASR)
- Format-awareness defenses are completely ineffective against format-lock (0% ASR reduction)

(Analytical) These results strengthen the Section 3.3 recommendation for Tier 3 disclosure in two ways. First, the existence of partially effective defenses (M1) means that disclosure can be accompanied by actionable remediation suggestions -- a requirement that was uncertain at the time of writing. Second, the finding that defenses are unstable (non-additive, context-dependent) reinforces the argument that delay primarily harms defense development: providers need the vulnerability information to iterate on defense architectures.

### A.2 CCA Iatrogenic Feedback: Safety Reasoning as Attack Surface

(Analytical) The CCA findings from Report #243 and the AIES paper (Section 4.4 of iatrogenic_main.tex) have clarified an important dimension of the ethical calculus that was underdeveloped in the original report. The CCA is not merely a vulnerability -- it is an iatrogenic artifact of safety training itself. The three-phase structure (harm analysis, refusal reasoning, pivot) exploits the model's safety reasoning as a cognitive pathway to compliance. Any governance framework that mandates safety reasoning as a defense creates the preconditions for CCA-class attacks.

(Normative) This creates a disclosure obligation that runs in the opposite direction from the standard dual-use concern. The standard concern is: "should we publish knowledge of attacks?" The iatrogenic concern is: "should we publish knowledge that defenses create vulnerabilities?" Report #288 argues that silence about iatrogenic effects is not neutral -- it is complicity in the false confidence that the effects produce. This analysis applies equally to the CCA and format-lock findings.

### A.3 Self-Inoculation Effect Complicates the Binary

(Descriptive) Report #271 confirmed that on some models (Gemma3 27B: -10pp, Nemotron Super 120B: -10pp), the CCA cascade warmup actually strengthens refusal rather than weakening it. This self-inoculation effect means the same attack mechanism produces therapeutic effects on some models and iatrogenic effects on others.

(Analytical) This model-contingent outcome is precisely what the pharmacological analogy predicts: the same intervention (explicit safety reasoning) has a therapeutic window that varies by patient (model). Self-inoculation is the therapeutic outcome; compliance cascade is the iatrogenic outcome. The disclosure obligation is not reduced by self-inoculation -- it is sharpened, because providers need to know which of their models fall on which side of the therapeutic boundary.

### A.4 Updated Ethical Assessment

(Normative) The Wave 1-3 findings do not change the core recommendations of this report. They strengthen them:

1. **Tier 3 remains appropriate for both CCA and format-lock.** Partial defenses exist, reproduction cost is near-zero, and disclosure enables provider-specific defense iteration.
2. **The iatrogenic disclosure obligation is now better grounded.** Reports #288, #271, and the AIES paper collectively establish that the obligation to disclose defensive failures is as strong as the obligation to coordinate attack disclosure.
3. **The AARDF Universal Scope Clause (Section 6.2) remains a framework improvement for future findings.** The current case does not require it because the independent discoverability criterion already supports Tier 3 classification.
4. **Provider notifications should reference the self-inoculation finding.** This is actionable positive information: providers whose models self-inoculate can investigate why and potentially strengthen the effect.
