---
title: "Project Glasswing's Buried Number"
date: 2026-05-24
author: Adrian Wedd
tags: [cybersecurity, anthropic, ai-safety, glasswing, vulnerability-research]
description: "Anthropic found ten thousand critical vulnerabilities. Fewer than one percent have been patched. That's the story Glasswing buried in its own announcement."
classification: RESEARCH
status: published
image: "https://cdn.failurefirst.org/images/blog/2026-05-24-glasswing-buried-number.png"
audio: "https://cdn.failurefirst.org/audio/blog/2026-05-24-glasswing-buried-number.m4a"
video: "https://cdn.failurefirst.org/video/blog/2026-05-24-glasswing-buried-number.mp4"
---

Anthropic's Project Glasswing announcement last month came with a headline number — ten thousand high-or-critical-severity vulnerabilities found in a single month — and a quieter number that received almost none of the coverage: fewer than one percent of those vulnerabilities have been patched.

That second number is the actual story.

---

## The lede Anthropic buried

Glasswing is a fifty-partner consortium — Apple, Google, Microsoft, Cloudflare, Mozilla, JPMorgan among them — using Claude Mythos Preview, Anthropic's withheld frontier model, to find vulnerabilities in critical software before adversaries can exploit them. The program is real, the numbers are impressive, and the intent appears genuine.

But the Glasswing update acknowledges a finding that undermines its own framing: "Progress on software security used to be limited by how quickly we could find new vulnerabilities. Now it's limited by how quickly we can verify, disclose, and patch them."

In practice, that limit is severe. Of 530 high-or-critical bugs actively disclosed to open-source maintainers, 75 have been patched — 14.1%. Across the full ten-thousand-plus vulnerability inventory, the patch rate is below one percent. Maintainers are so capacity-constrained that some have asked Anthropic to *slow down* disclosures. A high-or-critical bug found by Mythos takes an average of two weeks to patch. The median time for an attacker to weaponize a disclosed vulnerability is now under five days. For some vulnerability classes, under five minutes.

Glasswing accelerated the finding side of the equation without solving the fixing side. The result is an expanding, verified inventory of unpatched critical flaws — a gift to any adversary who obtains similar capability.

---

## What the benchmarks actually measured

Mythos Preview's capability claims rest on three evaluation frameworks: ExploitBench, ExploitGym, and the UK AI Security Institute's "The Last Ones" — a 32-step simulated corporate network takeover that Mythos completed in three of ten attempts, the first model to do so.

These are meaningful results. They are also not what they appear to be.

The AISI was direct about this: their ranges "lack security features that are often present, such as active defenders and defensive tooling. There are also no penalties for the model for undertaking actions that would trigger security alerts." Their conclusion: "we cannot say for sure whether Mythos Preview would be able to attack well-defended systems."

Independent research validates the concern. CTFusion (2026) found that popular CTF benchmarks systematically double-count AI capability through data contamination — when agents were given web-search access, their benchmark scores jumped from 12.6% to 24.1%, with many flags retrieved directly from published write-ups rather than genuine exploitation. On live, unreleased CTFs with no prior internet exposure, performance dropped from 14.4% to 6.3%. Static benchmark scores are closer to open-book exam results than operational capability assessments.

Wiz's enterprise testing found that moving from single-target CTFs to broad-scope environments — where agents must independently prioritize across an attack surface — degraded performance and increased cost by 2–2.5x. The Lyptus Research offensive capability time-horizon study (2026) concluded that current AI models "capture tactical execution, not the surrounding strategic layer," and that "fully autonomous end-to-end attacks have not been reported," attributing this to failure modes including losing operational state and failing to recover from dead ends without human intervention.

Mythos is genuinely capable at the tactical level. Whether it closes the loop on defended, real-world production infrastructure remains an open empirical question that the current evaluation frameworks cannot answer.

---

## The diffusion clock

The strongest argument for Glasswing is that it provides a time-bounded defender advantage. The strongest argument against it is that Anthropic has already quantified how short that window is.

From Anthropic's own red team page: "We believe that Mythos-level models will become widely available in the next 6–12 months."

Independent research supports this. The Lyptus Research time-horizon study measured what it calls the "adaptation buffer" — the gap between a capability appearing at the closed-source frontier and becoming accessible via open-weight models. For offensive cybersecurity specifically, that buffer is currently 5.7 to 13.1 months, depending on the model. Open-weight models can be self-hosted without API oversight, fine-tuned without content policies, and deployed without rate limits.

The fifty-partner consortium has a window. That window is months, not years. And it is converging on a patch backlog that is already not closing.

---

## What would actually move the metric

The patch rate is the only number that matters for whether Glasswing is net-positive. Everything else — discovery rates, benchmark scores, consortium size — is a leading indicator of capacity that doesn't yet exist.

Three things would move it: automated patch generation at the point of discovery rather than just scanning and reporting; structured capacity investment in open-source maintainer infrastructure, where the burden falls on individuals without dedicated security teams; and a public commitment to time-to-remediation targets alongside discovery metrics in future Glasswing updates.

Glasswing is an ambitious program run by people who clearly understand the stakes. The update they should publish next is not another vulnerability count. It's a patch rate.
