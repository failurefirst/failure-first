---
title: "Glasswing's Missing Manual"
date: 2026-05-29
author: Adrian Wedd
tags: [cybersecurity, anthropic, ai-safety, glasswing, vulnerability-research]
description: "Anthropic published the operational how-to that the Glasswing announcement lacked. It's good. The patch rate is still 6.1 percent."
classification: RESEARCH
status: published
image: "https://cdn.failurefirst.org/images/blog/2026-05-29-glasswing-missing-manual.png"
audio: "https://cdn.failurefirst.org/audio/blog/2026-05-29-glasswing-missing-manual.m4a"
video: "https://cdn.failurefirst.org/video/blog/2026-05-29-glasswing-missing-manual.mp4"
---

When the Glasswing numbers landed in May, we argued that Anthropic had buried the only statistic that actually matters: fewer than one percent of its full vulnerability inventory had been patched, and open-source maintainers were asking the program to *slow down* because the finding rate was outpacing their capacity to remediate. The headline — ten thousand vulnerabilities found — was impressive. The follow-on number was not.

This week Anthropic published the operational framework that should have accompanied the Glasswing announcement. It is, genuinely, a well-constructed piece of engineering thinking. And the patch rate is still 6.1 percent.

---

## What the six-step loop gets right

The framework Anthropic describes — threat model, sandbox, discover, verify, triage, patch — is not novel, but novelty is not the point. The value is in what each step is protecting against, and two of the six are doing the most work.

**Verification separation** is load-bearing. The recommendation to use an independent verifier — a separate agent, not the same model that found the bug — is the correct call, and the reasoning is sound: a discovery agent will rationalise ambiguous findings upward. In our own grading pipelines for adversarial AI research, heuristic classifiers that share context with the generation step inflate success rates by 30–60 percentage points relative to structured LLM-based verification with an independent rubric. The mechanism is the same: when the evaluator has access to its own prior conclusion, it confirms rather than tests. Using a separate verifier reportedly halved false positives in Glasswing's pipeline. That number is plausible.

**Threat-model-first** changes what the discovery step can return. Anthropic reports that teams with documented trust boundaries and explicit definitions of exploitability achieved exploitable findings 90% of the time, against a much lower baseline for teams without them. This is not a capability improvement — Mythos is the same model either way. It is a precision improvement achieved by constraining the search space before the agent begins, so that marginal findings — plausible but unverifiable without deep environmental context — are never surfaced in the first place.

The deduplication-by-root-cause step in triage is also underrated. The natural failure mode of any stochastic discovery process is that it rediscovers the same root cause through multiple symptom paths and counts each one separately. Triage on root cause rather than finding count compresses the queue into something a human team can actually work through.

---

## The numbers still rhyme

When the Glasswing program was announced, the figures were: 530 high-or-critical bugs actively disclosed to open-source maintainers, 75 patched — 14.1% — against a full inventory patch rate below one percent.

This week's post puts the current figures at 1,596 vulnerabilities disclosed, 97 patched — 6.1%.

The comparison is imperfect: different timeframes, different scopes, different severity thresholds. But the shape is the same. A substantial, independently verified inventory of unpatched critical vulnerabilities is accumulating faster than the remediation pipeline is clearing it. The six-step loop addresses the finding and verification sides of this equation. It does not solve the patching side, and it is careful to say so: "Human review remains essential for nuanced patching decisions" and "generated patches often address symptoms rather than root causes." Both are true. Both mean the bottleneck is still downstream of what the framework controls.

---

## The structural limit prompting cannot fix

The most honest caveat in the framework is also the one that receives the least development: models lack visibility into compensating controls.

A vulnerability agent working from source code has no access to the WAF rules in front of the service, the authentication gateway that precedes the vulnerable endpoint, the network segmentation that limits lateral movement from the bug's location, or the runtime monitoring that would detect exploitation in progress. Severity calibration without that context will be wrong in a predictable direction: upward. The result is a triage queue biased toward findings that are theoretically critical but practically low-risk in their deployed context, and away from findings that appear benign in isolation but are high-risk because a compensating control was misconfigured or removed.

This is not a problem that can be resolved by improving the threat model document. The threat model is a static description of an intent. Compensating-control context requires live visibility into infrastructure state. Until discovery agents have authenticated access to runtime environment signals — not just the codebase — severity ratings will remain a best-effort estimate from an agent working with partial information.

---

## The diffusion clock is still running

The strongest argument for Glasswing is that it gives defenders a time-bounded advantage: if Mythos-level capability exists inside Anthropic and its consortium partners but not in open-weight models, the defenders have a window.

Anthropic has already quantified how long that window is. From its own capability disclosures: Mythos-level models will become widely available in the next six to twelve months. The Lyptus Research time-horizon study measured the adaptation buffer — the gap between a capability appearing at the closed-source frontier and becoming accessible via open-weight models deployable without API oversight, content policies, or rate limits — at 5.7 to 13.1 months for offensive cybersecurity capability specifically.

The consortium has a window. That window is measured in months. And it is converging on a patch backlog — 6.1% clearance rate, maintainers already at capacity — that is not closing on anything like the same timescale.

The calculus is not comfortable: a program that finds vulnerabilities faster than they can be patched, operating in a window before equivalent capability is available without institutional guardrails, is building a verified inventory of unpatched flaws against a shrinking timeline for exclusive access to the finding method.

That is not an argument against Glasswing. It is an argument for urgency about the patch rate that the framework, thoughtful as it is, does not yet provide.

---

## What would move the metric

The six-step loop is good operational infrastructure. It is not sufficient to change the number that matters.

Three things would actually move the patch rate:

**Automated patch generation at the point of discovery.** The framework treats patching as a downstream human step, with AI assistance. The bottleneck is human capacity. A program that generates, validates, and submits patches automatically — not just reports — would change the equation. This is technically harder than scanning; it requires the agent to understand not just what is wrong but what a correct, regression-safe fix looks like. It is also where the leverage is.

**Structured investment in maintainer capacity.** The burden of Glasswing's disclosure rate falls disproportionately on individual open-source maintainers without dedicated security teams. Some have already asked Anthropic to slow down. That is a capacity problem, not a motivation problem. Addressing it requires sustained funding for maintainer security infrastructure — not a disclosure pipeline that assumes capacity exists on the receiving end.

**Public time-to-remediation commitments alongside discovery metrics.** Future Glasswing updates should report patch rates, median time-to-remediation, and the gap between that median and the median attacker weaponization time (currently under five days for disclosed vulnerabilities; under five minutes for some classes). Discovery counts are a leading indicator. Patch rates are the outcome. Publishing only leading indicators while the outcome metric sits below ten percent is the buried number problem, repeated.

Glasswing is ambitious and technically sound. The update it should publish next is not another vulnerability count. It is a patch rate — and a plan for what happens when the window closes.

---

*See also: [Project Glasswing's Buried Number](/blog/2026-05-24-glasswing-buried-number) — our original analysis of the Glasswing announcement and the patch rate that received almost none of the press coverage.*
