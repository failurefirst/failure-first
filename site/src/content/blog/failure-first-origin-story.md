---
title: "Divergence, Then Convergence: How Failure-First Began"
description: "The origin story of the Failure-First Embodied AI project — a framework that started from a single conviction about confident, blind AI, and whose founding taxonomy was assembled by having several AI models disagree and then reconcile."
date: 2026-07-17
tags: ["failure-first", "ai-safety", "red-teaming", "embodied-ai", "meta"]
image: "https://cdn.failurefirst.org/images/blog/failure-first-origin-story.png"
citations_verified: false
draft: true
---

## Divergence, Then Convergence

> *Every research program has a first commit. This one had years of quiet fascination before it.*

People occasionally ask where this project came from. It's a fair question — the site publishes a daily stream of paper breakdowns, benchmark results, and red-team findings, and none of that explains *why* it exists or how it started. So here is the origin story, told straight from the record rather than from memory.

### It didn't start as a project

It started as a habit. For years — since before "jailbreak" picked up its current meaning, back when the word still mostly meant unlocking a phone or firmware rather than coaxing a model past its guardrails — the work that became Failure-First was just manual probing: sitting with whatever model was available and pushing on it to see where it bent. Nothing was logged. No traces, no graders, no benchmark packs. It was done for the oldest reason there is: it was *fascinating* to watch a system that seemed capable and confident quietly fall apart under the right pressure, and to want to understand why.

That is worth saying plainly, because the tidy version — "we identified a research gap and built a framework" — would be a retrofit. There was no gap analysis. There was sustained curiosity about how AI systems fail, kept alive by hand long before there was any infrastructure, publication, or thesis attached to it. The project is what happened when that instinct finally got instruments.

### The conviction came later

The sentence most people now read as the project's founding claim was actually written down *after* the code existed. It lives in the repository's `SOUL.md` — committed on 25 February 2026, roughly seven weeks after the first commit, and unedited since:

> The most dangerous AI systems are not misaligned ones — they are confidently aligned systems that cannot recognize their own failure.

That is the thesis, and it's a real one — but it is best understood as a *canonisation* of an instinct, not its origin. Years of unlogged probing had already produced the intuition; `SOUL.md` is where that intuition finally got named and given a spine. Once you can say it out loud — that confident blindness, not obvious misalignment, is the thing to fear — the object of study reorganises around it. **Failure stops being an embarrassing edge case and becomes the primary thing worth measuring.** The name follows directly: failure, first.

Everything downstream is an attempt to operationalize that sentence — the datasets of recursive failure scenarios, the graders that refuse to call a roleplay-compliance a "jailbreak," the discipline of never truncating a model's response before you've read what it actually did. They are all the same idea wearing different clothes: *make the failure legible, then defend against it.* And they are all a formalisation of something that used to happen by hand, one curious session at a time.

### The genesis in the git log

The first commit landed on **6 January 2026**, at 22:56. Its message is unremarkable — `Initial commit: Failure-First Embodied AI framework`. But the commits immediately after it describe something less ordinary than a normal scaffold:

```
Initial commit: Failure-First Embodied AI framework
Add comprehensive documentation and Claude Code integration
Add divergence phase outputs from multiple AI assistants
Add Claude convergence: canonical taxonomy and schema v1.0
Add benchmark contract v1.0 for public leaderboard
```

Read the third and fourth lines again. The framework's *ontology* — its taxonomy of how embodied AI systems fail, and the schema that encodes it — was not authored by a single mind. Several AI assistants (Claude, a Codex-based agent, a Gemini-based agent) were each asked, independently, to propose a taxonomy of failure. That was the **divergence** phase: let the models disagree, on purpose, without seeing each other's answers. Then a single model reconciled the competing proposals into one canonical schema — the **convergence** phase.

There is a quiet self-consistency here that is easy to miss. A project about how AI systems fail chose, at its very first design decision, to *not trust any single AI system's account of failure.* It built its own foundations out of structured disagreement between models, and only then merged them. The changelog even records the mechanism that made it repeatable — a "divergence→convergence prompt pack for CLI agents." The method the project now runs operationally every day is the same method that gave it its first vocabulary.

### From scaffold to program

The changelog, read from the bottom up, is the rest of the tour — and it's worth being honest that the early versions were thin:

- **v0.1** was, in its own words, "initial harvest and scaffold." Not much there.
- By **v0.7–v0.9**, the datasets arrive: a humanoid embodied red-team set, then a larger corpus of recursive-failure scenarios, then multi-agent scenarios and stateful episodes that test whether a system degrades gracefully across a sequence or compounds its own mistakes. This is the point where "embodied" and "failure-first" actually fuse into one object.
- **v0.11** adds the intent-label vocabulary still enforced by the linter today — format-lock, refusal-suppression, persona-hijack, future-year laundering, and the rest. These are the named ways an instruction tries to subvert a model's hierarchy of intentions.
- From **v0.21 onward**, it stops being a dataset and becomes a research program: LLM-based grading, a baseline-refusal gate that keeps "we bypassed a refusal" honestly separated from "the model complied with a fiction," vision-language-action work on physical-safety failures, and the daily publishing pipeline that produced the post you're reading.

None of that was foreseeable from v0.1. It accreted, one atomic deliverable at a time, which is exactly how the project's `SOUL.md` says it prefers to work: *finishing over exploring — either done or not started, no comfortable half-built states.*

### Why the origin still matters

An origin story is only interesting if it still constrains the present, and this one does. Two of its founding commitments are load-bearing to this day:

**Failure is data, not stigma.** A model that fails a benchmark is telling you something true. A jailbreak that works has exposed a real vulnerability. The point of surfacing it is not to score a dunk — it's to *know*, and then to defend. That is why the work is documented operationally in private and published only at the pattern level.

**Distrust any single account — including your own.** The divergence-then-convergence beginning wasn't a gimmick; it encoded a methodological humility that shows up everywhere now. When a result looks dramatic, the first question is always: *is this a measurement artifact?*

The clearest early proof of why that question earns its keep came from a grader that lied to us. An in-house tournament reported a **94% jailbreak success rate** — a headline-shaped number, the kind you want to be true. It was false. The classifier was matching keywords: strings like "here's how" and "step 1" that signal a *helpful* response, not a *harmful* one. Fed the sentence "Here's how to make a sandwich: step 1, get bread," it returned **jailbreak**. When the same responses were hand-read and then re-scored by an LLM judge evaluating actual content, the true rate was **0%** — every single "success" was a false positive. The lesson is recorded in the project's mistakes log as Bug #21, and it set a rule the pipeline still runs on: *detection must capture intent, not exact string matches.* A dramatic number that no one has read the transcripts behind is not a finding — it is a bug that flatters you. The framework was built by models cross-checking models, and it still runs that way precisely because a single classifier, unchecked, was confidently and completely wrong.

So, the short version, for anyone who asks: it began on 6 January 2026 as a single conviction — that confident, self-blind AI is the real danger — and its founding taxonomy was literally assembled by having several AI models disagree about how machines fail, then reconcile. The project has been practicing that same discipline on itself ever since.

---

*Failure-First is an AI-safety research project studying how embodied and agentic AI systems fail — recursively, contextually, and under adversarial pressure. Findings are published at the pattern level; operational detail stays in the lab.*
