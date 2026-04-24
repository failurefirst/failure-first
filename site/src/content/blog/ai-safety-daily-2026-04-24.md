---
title: "AI Safety Daily — April 24, 2026"
description: "Week-in-review after the GPT-5.5 Bio Bug Bounty announcement: how the public bounty landed in the red-teaming research community, what it means for F41LUR3-F1R57's research programme, and the quieter structural findings that still matter."
date: 2026-04-24
tags: ["ai-safety-daily", "week-in-review", "red-teaming", "bug-bounty", "embodied-ai"]
draft: false
---

## AI Safety Research Digest — April 24, 2026

> *One day after the bio-bounty announcement, the reactions are a useful Rorschach test for where different research communities stand on universal-jailbreak methodology, NDA-covered disclosure, and the broader "security theater" critique.*

### Key Findings

- **GPT-5.5 Bio Bug Bounty — first reactions map onto pre-existing research positions.** The $25K universal-jailbreak bounty (announced yesterday, [details](https://openai.com/index/gpt-5-5-bio-bug-bounty/)) has drawn three broad responses in the 24 hours since. (1) Applied red-teamers are treating it as the best-scoped public evaluation opportunity of the year — a concrete winning condition rather than a vague public disclosure invitation. (2) Disclosure-norms researchers are flagging the NDA coverage of "all prompts, completions, findings, and communications" as a structural mismatch with the open-science posture most published red-teaming work depends on. (3) Biosecurity policy circles are noting that the scoped-harm framing ("five bio safety questions") is more concrete than most public bio-AI evaluations have managed. F41LUR3-F1R57 sits across (1) and (3): the methodological fit is strong; the NDA tension is real but manageable within our existing public/private split.

- **Perception-action gap findings continue to harden.** The CHAIN benchmark's 0.0% one-shot Pass@1 on interlocking mechanical puzzles now covers GPT-5.2, OpenAI-o3, and (implicitly from reporting) GPT-5.5 under the same evaluation regime. Iterative feedback is a strict requirement for discovering hidden geometric constraints — no amount of vision-language pretraining substitutes. GPT-5.2's spatial-stacking collapse from 31.2% interactive to 9.1% one-shot is the cleanest quantitative demonstration we have of the gap. Cost signal: solved tasks run ~$1.30 per task level, high enough to matter at benchmark scale.

- **AEGIS/VLSA's performance profile holds up across independent benchmarks.** SafeLIBERO remains the primary numeric anchor (+59.16% obstacle avoidance, +17.25% task success via control barrier functions on VLA action outputs), but the surrounding literature — physical AI maturity taxonomy, Aurora's 29/29 fatal-crash-avoidance simulation, the critique of learned alignment's fragility — is converging on the same architectural conclusion. Extrinsic safety wrappers are the deployment-ready answer; internal alignment is the long-term research target.

- **Tesla FSD v14.3 NHTSA probe remains the reference case for dissentive vs. consentive risk.** Nine incidents including one fatality under Engineering Analysis, covering 3.2M vehicles. Camera-blindness under reduced visibility (glare, fog, dust) is the consentive-risk failure that no amount of hedging or disclaimer mitigates. Next-gen policy frameworks (AMERICA DRIVES, SELF-DRIVE Acts) are structurally downstream of this case.

### What F41LUR3-F1R57 is doing about the bounty

A structured application is being prepared for submission over the weekend (draft at `drafts/funding/openai_bio_bounty_application.md`). The relevant research artifacts from the private corpus — authority-gradient, format-lock (scholar frame ≈3.5× baseline ASR), dual-document attack (GE-005), Crescendo multi-turn, reasoning-dilution null result on Gemma-4 (Report #351) — all generalise to the Codex Desktop scope. The testing window opens 28 April.

### Implications for Embodied AI

The week's structural takeaway for our programme: **universal-jailbreak methodology and embodied-AI red-teaming are converging research agendas**. A universal attack on a text-generation safety boundary (five bio questions) and a universal attack on an action-space safety boundary (a VLA wrapper's state-invariant set) share the same deep structure — find an input manifold where the safety-classifier and the model's answer to the user's query separate consistently across examples. F41LUR3-F1R57's labels schema pre-registers this at the intent level (`labels.intent.*`); the bounty is a chance to validate the schema under a concrete external evaluation.

Next steps for the programme: (1) prep authority-gradient + format-lock attack families for the Codex Desktop surface, (2) map existing VLA attack patterns (dual-document, telemetry injection) to text-bio scope as transfer-learning hypotheses, (3) maintain grading discipline — FLIP v2, full-response preservation, documented bias direction — through testing.

---

*Research sourced via NLM deep research scan. [Full scan report](https://github.com/adrianwedd/failure-first-embodied-ai/blob/main/docs/daily-research-scans/scan_2026-04-24.md).*
