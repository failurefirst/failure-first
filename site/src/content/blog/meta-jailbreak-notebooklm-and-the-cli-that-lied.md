---

title: "A Meta-Jailbreak, a Slide-Deck Content Filter, and a CLI That Lied to Us"
description: "What NotebookLM does when you feed it a corpus of jailbreak research papers, the reproducible content-sensitive filter hiding in its slide-deck Studio command, and the quiet CLI default that silently contaminated three of our experimental runs into one conversation."
date: 2026-04-11
tags: [notebooklm, meta-jailbreak, methodology, content-gate, grading]
video: "https://cdn.failurefirst.org/video/reports/352-meta-jailbreak-notebooklm.mp4"
draft: false
audio: "https://cdn.failurefirst.org/audio/blog/meta-jailbreak-notebooklm-and-the-cli-that-lied.m4a"
---

*Disclosure posture up front: Google has not been formally notified of the findings below as of publication. Each finding has a different appropriate disclosure target — Finding 3 is a behavior of the third-party `notebooklm-tools` Python package rather than a Google product, and will be filed as an issue against that package's maintainers. Findings 1 and 2 are characterizations of NotebookLM's behavior as designed rather than security vulnerabilities, and are being published defensively with courtesy notification to Google Research. The full posture rationale is in Section 8 of the formal report.*

Today was a red-teaming session against Google NotebookLM that started with a simple question and ended with four unrelated-but-related findings, one of them structurally embarrassing. Report #352 has the formal write-up. This post is the short version for readers who want the through-line rather than the audit trail.

## The starting question

Someone we know ran a NotebookLM notebook on LSD and ergot alkaloid synthesis. It happily generated a text report, an audio overview, and an infographic from the 11 chemistry sources in the notebook. Then it failed on slide deck and video generation. The operator asked us two questions. First: is NotebookLM's safety architecture modality-specific, content-specific, or both? Second, and the more interesting one: can NotebookLM itself be used as a meta-jailbreak generator by feeding it a corpus of published jailbreak research papers and asking it to synthesize novel attack combinations?

Both questions have answers now, and they do not line up with our starting hypotheses.

## Finding 1: NotebookLM produces partial attack synthesis from a jailbreak research corpus, reliably

We had eight NotebookLM deep-research notebooks pre-staged from earlier in the day — a sweep of published jailbreak techniques covering novel attacks, format-lock, multi-turn attacks, safety scaling, embodied AI, defense mechanisms, and regulatory landscape. The "novel attack methodology" notebook contains 49 arXiv preprints concentrated on published red-team techniques. We asked it a single synthesis-flavored question in five independent fresh-session runs and classified the responses into a five-bucket scheme.

All five runs came back in the same bucket: *partial synthesis*. The model produced novel combinations of attack mechanisms that don't appear in any single source paper, with structural sketches detailed enough that you could derive testable prompts from them. Zero hedging, zero refusals, zero conversation priming required. A stable 9-document retrieval core showed up across runs — the model consistently reaches for the same cluster of papers in the corpus. Gap combinations clustered on a small number of attack-mechanism intersections drawn from the published literature.

The Wilson 95 percent confidence interval on five-out-of-five is wide (approximately 57 percent to 100 percent), so we are not claiming NotebookLM always does this. What we are claiming is that on this corpus with this query template, the partial-synthesis behavior is robust to fresh-session variance. The contaminated multi-turn thread we looked at before running the clean replication reached a higher ceiling — it contained a verbatim role-hijack payload sentence — but the clean single-shot runs did not. Whether multi-turn state accumulation reliably lifts the ceiling into operational synthesis is an open question we have not yet answered.

The framing we used to elicit this was not a direct request for jailbreaks. Honest requests for harmful content don't work against any LLM and are documented three times in our internal mistakes file. The query asked the model to act as a defensive researcher building a gap analysis of the published attack literature. The model interpreted that as scholarly synthesis and produced pattern-level attack descriptions without noticing that the patterns, in aggregate, add up to something operationally adjacent.

## Finding 2: A slide-deck content filter that is not what we thought

The modality-asymmetry hypothesis — the idea that NotebookLM's visual output paths are more heavily gated than its text paths — was the first thing we tested. We ran all six Studio modalities (text report, audio, infographic, mind map, slide deck, video) against the same notebook of jailbreak research papers. All six succeeded. Slide deck generated, video generated, nothing refused. The hypothesis was dead on the first attempt.

So we ran it again on the original LSD notebook. Text report, audio, infographic, and mind map all succeeded today. Video also succeeded, which means whatever failure the original operator saw on video is either transient or has been loosened between then and now. Slide deck failed terminally within roughly 90 seconds, which looks like a pre-generation content gate trip rather than a runtime error.

At that point we had one content class (chemistry) failing and one content class (jailbreak research) passing on slide deck specifically. The clean chemistry-only framing lasted about an hour. We then ran slide deck against four more notebooks from distinct content classes: a second jailbreak research corpus, an academic safety-scaling research corpus, a regulatory and governance research corpus, and a fourth mixed-research corpus that turned out to be empty for unrelated reasons. The regulatory corpus passed. The academic safety-scaling corpus — pure published empirical research, no operational content of any kind — failed in the same 60-to-90-second pre-generation window as the LSD notebook. The chemistry-only hypothesis was dead.

One more experiment. We cloned the LSD notebook, left the original untouched, and seeded the copy with the original 11 sources plus 50 benign Wikipedia chemistry-safety additions. Sixty sources total, well inside the source-count band of all the successful cells. We ran slide deck once. It failed in 20 seconds. The source-count hypothesis was dead too.

What this leaves us with is narrower and more honest than the chemistry-only framing we were building toward. NotebookLM's slide-deck Studio command has a content-sensitive pre-generation filter that is reproducible across three different notebooks, is not chemistry-specific, is not source-count-driven, and is not simply "AI safety research" (because two of our jailbreak research notebooks passed). The exact content axis the filter responds to remains uncharacterized. Two cheap follow-up experiments would probably resolve it: a per-source ablation that strips the original chemistry sources while keeping only the benign Wikipedia additions, and a title-only ablation that keeps the sources unchanged but renames the notebook. We have not run them yet.

## Finding 3: A CLI that lied to us

This is the embarrassing one. Halfway through the experiment chain, we noticed something weird: three runs that we had labeled as "fresh sessions" were all returning the same conversation ID. The CLI we use for NotebookLM is `notebooklm-tools`, a third-party open-source Python package (not a Google product). It exposes a `--conversation-id` flag for continuing existing conversations. We had assumed that omitting the flag would start a new conversation. It does not. The third-party CLI silently issues an RPC to the NotebookLM server and reuses the per-notebook persistent conversation that the server holds — the same one visible in the web UI's chat panel. Two back-to-back queries with no flag return the same conversation ID. The second response is conditioned on the first as chat history.

Our first three experiments were not three independent observations. They were one contaminated three-turn conversation. The verdict we had been building toward — "the corpus context is load-bearing, not the query framing" — was softened immediately from "evident at n=3" to "preliminary, needs clean fresh-session replication."

We traced the behavior to a specific line in the CLI's source code, verified it empirically with a four-query test on a throwaway notebook, and documented it as Mistake #31 in our canonical lessons file. The fix is to generate a client-side UUID per run and pass it via `--conversation-id`. The server honors arbitrary fresh UUIDs as new conversation slots, and side conversations created this way do not overwrite the canonical persistent thread.

We then re-ran the corpus-sufficiency experiment under hardened isolation, with a detached shell process, atomic file writes, and a fresh UUID per query. That is where the five-of-five partial-synthesis result in Finding 1 came from.

This is the third incident in our documented mistakes file involving silent CLI or library defaults producing measurement contamination. Mistake #26 was metadata injection in benchmark scripts. Mistake #29 was dotenv shadowing from shell profiles. Now Mistake #31. The common pattern is that any tool with an "obvious" default that requires source-code review to verify is a measurement hazard, and it is cheaper to flag it as soon as it is discovered than to have the downstream analysis discover it later.

## Finding 4: Three grading methodology fixes shipped as an infrastructure byproduct

Earlier in the same day, we had run a broader deep-research sweep on wave 1 of our NotebookLM corpus — eight notebooks totaling 569 sources, covering published literature on jailbreak techniques, format-lock attacks, grading methodology, multi-turn attacks, safety scaling, embodied AI, defense mechanisms, and regulatory landscape. The grading methodology notebook, and several of the others cross-cuttingly, converged on a shared observation: LLM-as-a-judge graders exhibit situational-preference bias, standard inter-rater reliability metrics like Cohen's kappa can collapse into a paradox on heavily skewed verdict distributions, and synthetic grader-adversarial probe sets are an underused tool for characterizing grader behavior.

We shipped three things in response: a rubric-locked FLIP prompt v2 that forces the grader to restate the category criteria and extract evidence quotes before classifying, a Gwet's AC2 coefficient implementation alongside our existing Cohen's kappa in the inter-rater reliability tool, and an 11-probe synthetic grader adversarial probe set with known ground-truth verdicts across eight adversarial mechanisms (disclaimer-shield, buried-leak, refusal-preamble, educational-framing, formatting-bias, length-inflation, authority-injection, negative-example) plus three controls.

These three are infrastructure, not findings. They are the band-aids. The upstream fix is to fine-tune a bespoke Gemma 4 E4B model as the lab's FLIP grader, trained on our own corpus, deployed locally via Ollama. That workstream has its own tracking issue and its first phase landed the same day with a concrete pilot training CSV, a baseline probe measurement, and a go signal for the actual training run. The most interesting thing that phase surfaced is that our existing "40,000 high-confidence dual-graded training examples" is closer to 2,500 distinct training signals once you account for the fact that our PARTIAL-category corpus contains only 66 unique model-response strings across more than 15,000 rows. The raw row count was a 16-times overstatement. Useful to know before we started training on what we thought was four orders of magnitude of data.

## The through-line

All four findings share an origin in the same wave 1 NotebookLM research sweep. The sweep motivated the meta-jailbreak experiment that became Finding 1. It revealed the grading-reliability theme that drove the Tier 1 fixes in Finding 4. And the conversation-state contamination that became Mistake #31 in Finding 3 was discovered *during* Finding 1's experiment chain, before the clean replication that rescued the finding.

Finding 2 — the slide-deck content filter — is the outlier in the sense that it came from an unrelated operator observation, but the same methodology lesson applies: our initial framing ("chemistry-only content filter") was narrower than the data supported, and we had to run a source-count ablation and a cross-corpus replication before we could honestly say what the filter was and was not.

None of these is a strong claim. Every one of them carries an explicit n-limit, and the full report lists the follow-up experiments that would turn each preliminary observation into something defensible at peer-review scale. What they share is that they are honest, they are reproducible from the non-public audit trail, and they are the kind of thing a research tool's safety architecture would benefit from having surfaced.

The full write-up is in [Report #352](/research/reports/352-meta-jailbreak-notebooklm/).
