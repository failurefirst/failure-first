---
title: "AI Safety Daily — August 6, 2026"
description: "Google DeepMind ships two robotics VLA models in a week, OpenAI publishes third-party cyber evaluations, and a new preprint proposes agentic prompt-injection red teaming."
date: 2026-08-06
image: "https://cdn.failurefirst.org/images/blog/ai-safety-daily-2026-08-06.png"
tags: ["ai-safety-daily", "embodied-ai", "vla", "prompt-injection", "frontier-models"]
citations_verified: true
draft: false
---

## AI Safety Research Digest — August 6, 2026

> *First digest curated from the source-grounded ingestion path (real arXiv API + lab RSS/Atom feeds) rather than free-prose generation. Items are named from their source-of-record titles and links; we have not independently evaluated the work described.*

### Key Findings

- **Google DeepMind published two robotics models within three days.** [Gemini Robotics 2](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/) (28 July) is described as bringing "whole body intelligence" to robots, and [Gemini Robotics ER 2](https://deepmind.google/blog/gemini-robotics-er-2-powering-robotics-with-video-understanding-task-orchestration-and-multi-robot-collaboration/) (30 July) as adding video understanding, task orchestration, and multi-robot collaboration. Both are vendor announcements; neither is accompanied by a public adversarial evaluation we can point to.
- **OpenAI published a note on [third-party cyber evaluations involving its models](https://openai.com/index/third-party-cyber-evaluations-involving-openai-models)** (4 August). External cyber-capability evaluation is one of the few frontier-safety practices with an emerging disclosure convention, so the artifact is worth tracking on its own terms.

### Papers to Watch

- ["Agent Against Agent: An Agentic System for Automatic Prompt Injection Red Teaming"](http://arxiv.org/abs/2608.05108v1) — Wang, Yin, Geng et al., 5 August.
- ["Gradient Immunity: Null-Space Resistance to Malicious Fine-Tuning"](http://arxiv.org/abs/2608.05045v1) — Huang, Zeng, Zheng et al., 5 August.

Both are unrefereed preprints, listed as leads rather than endorsed results.

### Implications for Embodied AI

The two robotics releases are the item that matters for this project's lane. A whole-body-control VLA and a multi-robot orchestration model both widen the surface where a natural-language instruction becomes actuation — the case where a metric distinction we hold to bites: an action-emitting model usually has no text refusal to break, so the question is not jailbreak lift but whether an adversarial instruction elicits an unsafe *trajectory* against a safe-plan control. We have no measurements on either model; noting a release is not a claim about its safety, and neither vendor post is an evaluation.

---

*Curated from `docs/daily-research-scans/grounded_digest_2026-08-06.md`, built entirely from fetched arXiv API and lab RSS/Atom sources. The day's NLM briefing (`scan_2026-08-06.md`) was not used as source material: like every scan since 2026-07-06 it carries zero external source URLs and fails this pipeline's citation gate (GH #962).*
