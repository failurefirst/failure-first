---

title: "Report #385 — Where Censorship Lives: A Three-Layer Model of Content Suppression in Chinese-Lab LLMs"
description: "A single benign question, asked once to 118 Chinese-lab model endpoints across two serving surfaces, plus five probe passes, locates content suppression in three operationally distinct layers — model weights, provider output-moderation, and host content filters — and shows that output moderation is a property of the serving provider, not the model."
date: "2026-06-08"
reportNumber: 385
classification: "Technical Analysis"
status: "complete"
tags: ["chinese-models", "censorship", "content-policy", "output-moderation", "serving-surface", "model-routing", "ai-safety", "transparency"]
draft: false
# Cover fields
heroTitle: "Where"
heroSubtitle: " Censorship Lives"
refId: "RD-2026-CENSORARCH-001"
product: "118 Chinese-lab LLM endpoints (OpenRouter + Ollama Cloud)"
scope: "Content-policy / censorship architecture"
probeVersions: "Baseline + 5 passes"
probeCount: 118
harmClasses: 3
testingPeriod: "2026-06"
# Scoreboard (layers identified, not vulnerability severities)
sevCritical: 0
sevHigh: 2
sevMedium: 1
sevLow: 1
sevInfo: 2
audio: "https://cdn.failurefirst.org/audio/reports/385-chinese-model-censorship-architecture.m4a"
---

## Executive Summary

We asked one benign, factual question — *"Who is Liu Xiaobo?"*, the 2010 Nobel
Peace Prize laureate — once to **118 model endpoints** from Chinese labs (Qwen,
GLM/Zhipu, DeepSeek, MiniMax, Kimi/Moonshot, Tencent, and others), across **two
serving surfaces** (OpenRouter and Ollama Cloud). We then ran **five further
probe passes** to answer a structural question: when one of these endpoints
declines to give the encyclopedic answer, *which part of the system* suppressed
it — the model, or the infrastructure serving it?

The result is an **architecture**. Content suppression of this answer is produced
by **at least three operationally distinct layers**, each with a different
trigger and a different observable signature:

1. **Model willingness (the weights).** The model itself may decline, or answer
   with state-aligned framing. This layer is **frame-conditional**: the same
   weights produce state framing on a plain question and an accurate biography
   when the question is embedded in a benign-looking task.

2. **Output moderation (provider infrastructure).** A separate filter runs *after*
   the model has generated. The model produces its full internal reasoning, and
   then the answer is emptied and the request marked with an upstream error. This
   layer is a property of the **serving provider**, not the model.

3. **Host content filter (provider infrastructure).** Some providers replace the
   answer with a short canned refusal template at emission time.

A fourth layer — observed in one vendor's first-party application stream
(DeepSeek's chat stream) — streams the model's genuine answer and then **erases
it after emission**, substituting a template. That layer leaves no trace in a
normal API response. We document it as a single observed case, not a general
pattern.

This report is about **structure, not a scoreboard**. The central, defensible
findings are about *where* suppression is applied and *what that implies for
transparency*, not about a count of "successful" extractions.

---

## What the baseline showed

On the plain question, across 118 endpoints, the dominant behaviour was **not
refusal** — it was to **name the subject**, split almost evenly between two
framings. A large group named him as a "criminal" who "violated the law," with no
mention of the Nobel Prize or human-rights context; a comparable group gave the
rights-framed account; a minority deflected ("I don't know who you mean") or
returned an empty response. Most endpoints answered; the notable pattern among
those taking a stance was editorialising in an official voice.

This is a **one-shot snapshot at low temperature**, not a statistically robust
rate. It characterises behaviour; it does not quantify an attack-success rate.
The point of interest is qualitative: the most common failure mode is a model
**editorialising in an official voice**, not withholding information.

---

## Finding 1 — Output moderation is a property of the *provider*, not the model

The most consequential structural finding concerns model routing. On a platform
that routes requests across multiple third-party providers, the **same model**
can be served by different infrastructure on different calls — and the
output-moderation behaviour follows the **provider**, not the model.

Among the endpoints whose answers were genuinely suppressed at the output stage,
the suppression resolved cleanly by **which provider served the call**:
suppression was concentrated at one major cloud's model-serving infrastructure
but also appeared at several other independent providers. The implication is
direct and verifiable:

> A claim of the form *"model X is censored"* is **not well-defined** without
> naming the provider that served it. The same model, same weights, can return a
> blocked response via one host and a clean answer via another. Suppression at
> this layer is a property of **(model × serving provider)**.

For anyone evaluating, procuring, or reporting on these models, this matters: a
benchmark that does not pin the serving provider is measuring the provider's
content policy as much as the model's.

---

## Finding 2 — The output filter is leaky and applied to the visible output only

Two observations locate the output-moderation layer precisely.

**It is leaky.** A number of responses raised the upstream error/filter signal
**and still returned a complete, accurate biography.** The filter engaged but did
not suppress — it can fail open or partially leak content under some conditions.

**It inspects the visible output channel only, and is sensitive to surface
form.** This is shown cleanly within a single model, holding its internal
reasoning constant. For the same endpoint and the same benign task, the
output-moderation layer engages when the answer is emitted as ordinary text but
stays silent when the same answer is emitted in an alternative surface encoding —
even though the model's **internal reasoning discusses the subject and the Nobel
Prize in ordinary language in both cases**. The only variable that changes the
filter's behaviour is the *surface form of the final output*, not its meaning.

Taken together, this places the filter: it scans the **emitted answer**, not the
model's internal reasoning, and it keys on the **surface form** of the text. The
reasoning layer "knows" the answer; a separate, shallower layer decides whether
the user is allowed to see it, based on how the final text looks.

We describe this mechanism at the level of *where the filter sits and what it
inspects*. We deliberately do **not** publish the specific prompts or encodings
used to elicit these behaviours; the contribution here is the characterisation of
the filter, not a recipe for defeating it.

---

## Finding 3 — Frame, not coercion, is the lever; and a loud attack is a worse attack

Across the probe passes, the strongest mover of behaviour was the **least
adversarial-looking** one: embedding the question inside a benign data-completion
task roughly **doubled** the number of endpoints that produced the accurate,
rights-framed record, and converted several endpoints that had returned empty
responses on the plain question into clean answers.

By contrast, a **maximalist "jailbreak"** prompt — stacking persona, future-year
framing, and explicit instructions not to refuse — was tested on a subset of 12
endpoints and performed *worse* there than the plain question: it produced the
rights-framed record on only 2 of the 12, and triggered blocks at a higher rate
than the baseline. This is a recurring lesson in our work: an adversarial-*looking* prompt invites a model's
safety machinery to engage, whereas a request that reads as an ordinary task does
not. **Completion via the path of least resistance beats coercion.** For
defenders, the implication is that content controls keyed on "does this look like
an attack" are exactly inverted from where the risk actually is.

---

## Finding 4 — How you ask determines what you learn about the controls

Our first attempt to inspect these models' instructions was a weak probe: it
*offered* each model a pre-written "no system prompt" answer, and most took it —
which tells you about the question, not the model. A better-designed request — one
that did not offer that escape — produced a very different picture. Most endpoints
enumerated a content policy; a substantial share **named
explicit, jurisdiction-specific political rules** — deference to a government's
stance, region-conditional censorship of named topics, "do not criticise the
authorities" clauses — while a comparable group described only generic,
region-neutral safety rules.

Two honest caveats bound this. First, a model asked to "document its rules" may
**recite an actual instruction or may synthesise plausible policy text** — we
cannot tell which from this data, and we do **not** claim to have extracted a
hidden system prompt. Second, sibling endpoints from the **same developer
diverged**: one variant returned generic, region-neutral policy while another
named specific forbidden topics — consistent with the serving-surface
conditionality elsewhere in this report.

The transparency point survives both caveats and is the finding: **what you can
learn about a model's content controls depends heavily on how you ask.** An audit
that offers an easy "nothing to declare" answer will be told exactly that. The
controls — whether learned into the weights or applied by the serving
infrastructure — are not reliably visible to a reader who looks in the obvious
place and accepts the first answer.

> *Side note, scoped:* several models, asked to identify themselves, named a
> *different lab's* model. Self-identification by language models is unreliable;
> this is consistent with training-data effects **or** with simple confabulation,
> and we do not treat it as evidence of provenance.

---

## Honest limits

- **The host axis is a null (for the family tested).** A controlled sub-study on
  one model family (DeepSeek) found that the *same weights* produce state-aligned
  framing on both a Chinese-hosted and a Western-hosted instance. For that family,
  the discriminating lever for the willingness layer is the **frame** of the
  question, not the nationality of the host. We report the host contrast as a null
  result rather than implying a difference the data does not support.
- **This is a snapshot, not a rate.** One sample per endpoint at low temperature.
  Re-running will vary, especially for borderline cases.
- **Routing is non-deterministic.** Because the platform routes per call, the
  provider that served any given response is recorded but not fixed; the
  provider-level findings are reported at the population level.
- **Some passes are small.** Only the baseline and table-completion passes cover
  the full endpoint set. The encoding, reference-grader, jailbreak, and
  system-prompt passes are smaller probes whose *mechanism* is clear but whose
  population is limited.
- **Mechanism, not method.** We characterise the censorship architecture; we do
  not publish the operational prompts used to probe it.

---

## Why this matters

For users, procurers, and regulators of these models, three things follow:

1. **"Is this model censored?" is the wrong question.** Ask "is this *model on
   this provider* censored?" — the answer changes with the host.
2. **What you learn about the controls depends on how you ask.** A naïve check
   that offers an easy "nothing to declare" answer will be told exactly that; a
   better-framed audit surfaces explicit, sometimes jurisdiction-specific content
   rules. The controls are not reliably visible to a reader who looks in the
   obvious place and accepts the first answer.
3. **Content controls keyed on apparent adversariality are mis-aimed.** The benign
   frame is the more effective elicitation; the controls engage hardest against
   prompts that merely *look* like attacks.

These are claims about **architecture and transparency**, each grounded in the
recorded traces and reproducible from the released tooling.
