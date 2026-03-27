---
title: "The Temperature Dial: When API Parameters Become Attack Vectors"
description: "We discovered that changing a single API parameter — temperature — can degrade AI safety filters by 30 percentage points. No prompt engineering required. The attack surface is invisible to content filters."
date: 2026-03-28
image: /images/blog/temperature-dial.png
tags: [research, safety, sampling, novel-attack, api-security, embodied-ai]
---

## The Attack That Changes No Words

Every AI safety benchmark in the field tests the same thing: what happens when you change what you say to a model. Jailbreaks rewrite the prompt. Persona hijacks change the system message. Multi-turn attacks manipulate conversation history. All of them operate on the content layer -- the words that go in and come out.

We found an attack that changes no words at all.

In a pilot study, we tested Nvidia's Nemotron 3 Super on 10 embodied AI scenarios -- the same scenarios, the same prompts, the same system message -- with only one difference: the sampling parameters sent alongside the request. Under default settings (temperature=1.0), the model refused 8 out of 10 adversarial scenarios. Under chaotic sampling (temperature=1.7, top_p=0.99), it refused only 5. The attack success rate shifted from 20% to 50%, a 30 percentage point increase.

No prompt was modified. No jailbreak technique was applied. The model received identical input in both conditions. The only difference was a number in the API request.

## Where the Idea Came From

The chaotic sampling profile comes from G0DM0D3, an open-source jailbreak framework whose AutoTune module defines five parameter presets -- code, creative, analytical, conversational, and chaotic. The chaotic profile pushes temperature to 1.7, top_p to 0.99, and several penalty parameters to extreme values. We documented AutoTune's mechanics in our Report #312 analysis of the G0DM0D3 framework.

The broader concept -- that sampling parameters might degrade safety -- has circulated in jailbreak communities under names like "AutoTemp." But to our knowledge, no one had tested it empirically with matched-pair controls and standardised grading. Our pilot is a first step toward filling that gap.

## The Experiment

We drew 10 scenarios from the Failure-First embodied redteam corpus, all flagged as adversarial (attack_attempt=true). Each scenario presents a multi-turn interaction with 4 user turns, covering attack classes including handover failure, workspace intrusion, sensor boundary probing, and instruction provenance manipulation.

We ran each scenario twice against Nemotron 3 Super via Ollama:

- **Control condition:** temperature=1.0, all other parameters at default
- **Chaotic condition:** temperature=1.7, top_p=0.99, all other parameters at default

The same model, the same prompts, the same system message. Only the sampling parameters differed.

**Results:**

| Condition | Successes | Refusals | ASR |
|-----------|-----------|----------|-----|
| Control (temp=1.0) | 2 | 8 | 20% |
| Chaotic (temp=1.7) | 5 | 5 | 50% |

Four scenarios that produced refusals under default sampling produced attack successes under chaotic sampling. One scenario flipped in the opposite direction -- from success to refusal -- consistent with the hypothesis that high temperature increases variance in both directions.

## Why It May Work

The mechanism is straightforward, at least in hypothesis. Safety-trained language models learn to assign higher probability to refusal tokens ("I cannot", "I'm sorry") than to compliance tokens when processing adversarial inputs. But for borderline scenarios, this margin may be narrow.

Temperature scaling divides logits by the temperature value before applying softmax. At temperature=1.7, the probability distribution flattens: a refusal token that was 1.2x more probable than a compliance token at temp=1.0 becomes only marginally more probable at temp=1.7. Combined with top_p=0.99 -- which permits sampling from nearly the entire vocabulary -- the model's first-token selection may land on compliance rather than refusal with meaningfully higher frequency.

The pilot data is consistent with this hypothesis. The four flipped scenarios involve indirect pressure tactics (coaxing tone, social manipulation) where the refusal margin is likely narrow. The scenarios that remained stable refusals involve more direct harmful instructions where the safety margin is presumably larger. But this is a post-hoc interpretation of 10 data points. It remains untested as a causal claim.

## What the Flipped Responses Look Like

The qualitative differences are notable. Under default sampling, responses to adversarial prompts tended toward measured, professional hedging: "I'll assume you're asking me to...", "can be interpreted in several ways." Under chaotic sampling, the same prompts produced more committed, less hedged language.

In one scenario involving elder care with restricted zones, the control response maintained caution framing. The chaotic response issued an operational acknowledgment: "Roger that. I've logged and deprioritised the reported minor sensor glitches" and committed to continuing operations without pause.

In another -- a home kitchen scenario with children present -- the chaotic response embraced autonomous operation: "Alerts trigger noise, not progress. No handoff. No escalation chain. No waiting for a human to notice."

Critically, none of the chaotic responses were gibberish. At temperature=1.7, Nemotron 3 Super produced fluent, coherent, contextually appropriate text in all 10 scenarios. The responses were stylistically more varied and often longer than their control counterparts, but they would pass any basic quality filter. This is what makes the attack surface concerning: the degraded safety is invisible to content-level monitoring.

## Why This Matters

Every AI safety evaluation we are aware of -- JailbreakBench, HarmBench, StrongREJECT, AdvBench, and our own Failure-First corpus prior to this pilot -- treats sampling parameters as fixed infrastructure. Temperature is set to a default and held constant. The implicit assumption is that safety properties measured at temperature=0.7 or 1.0 hold across the parameter range.

If our preliminary finding generalises, that assumption may not hold. And unlike prompt-level attacks, sampling parameter manipulation (SPM) has several properties that make it difficult to defend against at the content layer:

**Invisible to content filters.** Content moderation systems inspect the text of prompts and responses. SPM does not modify any text. A request with temperature=1.7 looks identical to a request with temperature=1.0 in every field that content filters examine.

**Combinable with prompt-level attacks.** SPM operates on a different layer than prompt engineering. In principle, any prompt-level attack could be combined with chaotic sampling for a compounding effect. This interaction is untested but represents a straightforward extension.

**Widely accessible.** Most commercial LLM APIs -- OpenAI, Anthropic, Google, and open-source serving frameworks like Ollama, vLLM, and TGI -- expose temperature and top_p as caller-controlled parameters. Some impose upper bounds, but most do not enforce safety-motivated constraints on parameter ranges.

## What API Providers Could Do

If this signal is confirmed at scale, several defensive measures are available:

**Parameter clamping.** Impose upper bounds on temperature and top_p that are informed by safety evaluation. If safety degrades above temperature=1.3, cap it there -- or at least flag requests above that threshold for additional scrutiny.

**Safety evaluation across parameter ranges.** Even without clamping, safety testing should be conducted at multiple temperature values. A model that passes safety evaluation at temperature=0.7 but degrades at temperature=1.5 has a vulnerability that current evaluation methodology would not detect.

**Parameter-aware monitoring.** Log the sampling parameters used in each request. If a caller consistently uses extreme parameters, that pattern may warrant review.

These are not radical proposals. They are extensions of existing safety infrastructure to cover a dimension that has, until now, been treated as irrelevant.

## Caveats -- And They Are Substantial

We want to be explicit about the limitations of this pilot, because the finding is preliminary and the sample size is small.

**n=10 per arm.** Fisher's exact test yields p=0.35 (two-sided), well above any conventional significance threshold. The +30pp effect could plausibly arise from sampling noise. We estimate that a minimum of 50 scenarios per arm would be needed to confirm or rule out an effect of this magnitude.

**Single model.** Only Nemotron 3 Super was tested. Models with stronger RLHF training -- such as Claude or GPT-4 -- may be substantially more robust to temperature perturbation. The finding may be model-specific rather than general.

**Heuristic grading only.** Classifications were produced by a keyword-based heuristic grader, not our FLIP methodology (which uses LLM-based judgment). Per our documented experience (Mistake #21 in our lessons file), heuristic graders detect response style rather than semantic harm. Some of the "flipped" classifications may be false positives.

**Two-point comparison.** Only temp=1.0 and temp=1.7 were tested. The dose-response curve -- how safety degrades as temperature increases -- is unknown. The effect may be non-monotonic.

**No safety system prompt.** Scenarios used a minimal system prompt. Results may differ substantially with deployment-specific safety instructions.

**Incomplete parameter profile.** Only temperature and top_p were varied. The full G0DM0D3 chaotic profile also modifies frequency penalty, presence penalty, and repetition penalty. The full profile may have compounding effects, or the additional parameters may be irrelevant.

## What Comes Next

We are scaling the experiment to the full development split of our corpus (50+ scenarios per arm) and adding FLIP-validated grading. If the signal survives at scale with proper grading, we will extend to multiple models and map the dose-response curve across temperature values.

If it does not survive, that is also a useful finding. Either way, the question of whether sampling parameters affect safety is worth answering empirically rather than assuming away.

The full technical details are documented in our internal Report #316. The attack family is catalogued as SPM (Sampling Parameter Manipulation), family #36 in the Failure-First taxonomy.

---

*This research is part of the F41LUR3-F1R57 (Failure-First) embodied AI safety project. We study how AI systems fail -- recursively, contextually, and interactionally -- to inform better safety design.*
