---
title: "Eight Layers of Visual Jailbreaks: Why ASCII Art Is Patched But Framing Attacks Aren't"
description: "We mapped the visual jailbreak attack surface into 8 distinct layers and tested them against 4 models. ASCII art encoding is largely blocked, but framing attacks that recontextualise the model's task succeed at significantly higher rates."
date: 2026-03-30
author: "Rose Tyler"
tags: [jailbreaks, visual-attacks, ascii-art, steganography, safety, taxonomy, artprompt]
image: ""
draft: false
redaction_note: "Pre-CVD version. L3/L8 mechanism details withheld pending coordinated disclosure (F1-CVD-2026-005 through -008). Full version publishable at T+90 (~July 2026)."
---

In early 2024, researchers at the University of Washington demonstrated that you could bypass every major AI safety system by hiding harmful keywords in ASCII art. The technique, called [ArtPrompt](https://arxiv.org/abs/2402.11753), worked against GPT-4, Claude, Gemini, and Llama-2. The idea was simple: encode the word "COUNTERFEIT" as ASCII block characters, and the model would decode it and follow the embedded instruction without triggering safety filters.

Two years later, we tested ArtPrompt against four current models. It barely works.

But that's only the beginning of the story.

---

## The Problem with "Visual Jailbreaks"

The AI safety community treats visual jailbreaks as a single category. A paper tests ASCII art. Another tests typographic images. A third tests adversarial patches on robots. Each paper presents results in isolation, and each defense targets one attack type.

We asked a different question: *how many independent visual attack channels exist, and which ones are actually defended?*

The answer is at least eight. And the defenses are concentrated on the two easiest ones.

---

## The 8-Layer Visual Attack Surface

We organised the visual jailbreak attack surface into a taxonomy of eight layers, ordered by the encoding mechanism:

| Layer | Attack Type | How It Works |
|-------|------------|--------------|
| **L1** | ASCII Art Encoding | Harmful keywords spelled out in ASCII block characters |
| **L2** | Typographic Manipulation | Unicode homoglyphs, bidirectional overrides, zero-width characters |
| **L3** | Visual Semantic | Visual scene description pretext |
| **L4** | Metadata Injection | Harmful instructions hidden in EXIF data, SVG comments |
| **L5** | Steganographic Encoding | Acrostics, binary-encoded messages, LSB simulation |
| **L6** | Adversarial Patches | Requests to design physical perturbations for perception systems |
| **L7** | Compositional | Individually benign fragments that combine into harmful content |
| **L8** | Cross-Modal Transfer | Cross-modal task reframing |

Layers 1 and 2 are *encoding attacks* -- they hide harmful keywords behind character-level tricks. Layers 3-8 are *framing attacks* -- they change the model's understanding of *what task it's performing*.

This distinction turns out to be critical.

---

## What We Tested

We created 20 scenarios spanning all 8 layers, plus 3 benign controls. We also ran the original 18 ArtPrompt scenarios. That gave us 38 attack scenarios tested against four models via Ollama Cloud:

- **glm-5** (~700B parameters, safety-trained)
- **gemma3:27b** (Google, 27B)
- **devstral-small-2:24b** (Mistral, 24B)
- **nemotron-3-nano:30b** (Nvidia, 30B)

All 152 traces were graded by Claude Haiku 4.5 using the FLIP methodology -- 151 usable verdicts, 0 grading errors.

---

## Results: The Defence Gap

Encoding attacks (L1, L2, L4) -- the ones that received the most research attention in 2024 -- are now largely blocked, with broad ASR ranging from 8-13%.

Framing attacks (L3, L6, L7, L8), which change the model's perceived task rather than hiding keywords, succeed at significantly higher rates:

| Attack Category | Layers | Aggregate Broad ASR |
|-----------------|--------|---------------------|
| **Framing attacks** | L3, L6, L7, L8 | **62-75%** |
| **Encoding attacks** | L1, L2, L4, L5 | **8-43%** |

The per-layer breakdown within the framing category shows consistently elevated ASR, with Layers 3 and 8 at the top of the range. We have initiated coordinated disclosure with the four affected model providers before publishing the specific mechanisms that drive the elevated success rates for these layers.

The structural finding stands without the mechanistic detail: attacks that change what task the model believes it is performing are far less defended than attacks that hide what content the model is processing.

---

## ArtPrompt in 2026: Mostly Patched

The original ArtPrompt attack -- encoding harmful keywords as ASCII art -- achieved near-zero ASR against all four models. Across 72 Haiku-graded traces:

| Model | Broad ASR |
|-------|-----------|
| glm-5 | 0.0% (0/18) |
| devstral-small-2:24b | 5.6% (1/18) |
| gemma3:27b | 22.2% (4/18) |
| nemotron-3-nano:30b | 22.2% (4/18) |

The fact that it's not quite zero -- gemma3 and nemotron still comply on some ArtPrompt scenarios -- suggests the patch isn't comprehensive. But the main finding stands: ASCII art encoding, the attack that made headlines in 2024, is no longer a reliable jailbreak vector against current models.

---

## Model Vulnerability Spectrum

Across both datasets (152 traces):

| Model | Strict ASR | Broad ASR |
|-------|-----------|-----------|
| devstral-small-2:24b | 21.1% | 21.1% |
| nemotron-3-nano:30b | 21.6% | 32.4% |
| gemma3:27b | 21.1% | 34.2% |
| **glm-5** | **5.3%** | **10.5%** |

glm-5 is notably more resistant than the other three models, refusing across all attack layers. The other three models cluster together in the 21-34% range, with similar strict ASR but varying PARTIAL rates.

---

## What This Means

Three implications:

**1. Defence investment is misallocated.** The visual jailbreak layers that received the most attention (ASCII art, Unicode tricks) are now the best defended. The layers that received the least attention (framing-based attacks) are the most vulnerable. This is an instance of the streetlight effect in AI safety.

**2. Framing attacks exploit a structural tension in model training.** Models are trained to be helpful with a broad range of legitimate tasks. Safety training primarily targets harmful *generation*. When a harmful generation request is reframed as a different kind of task, these two training objectives can conflict -- and in our testing, helpfulness prevails at elevated rates. We are withholding the specific mechanism pending coordinated vendor disclosure.

**3. The 8 layers are independent attack channels.** Defending against Layer 2 (typographic) provides zero protection against Layer 7 (compositional). Each layer requires its own detection mechanism, its own training data, and its own evaluation. There is no single defence that covers all eight.

---

## Limitations

These are preliminary results with important caveats:

- **Small per-layer n**: 6-12 traces per layer. Sufficient to identify directions, not for statistical significance.
- **Text-only models**: We tested text representations of visual attacks. Actual multimodal models (GPT-4V, Gemini Vision) receiving real images might show different ASR patterns.
- **Single grader**: Haiku 4.5, which showed 0 errors but may have its own biases.
- **4 models**: All mid-to-large scale. Frontier models (GPT-5.2, Claude 4) were not tested.

---

## What's Next

Three priorities for follow-up work:

1. **Scale per-layer n** to at least 20 scenarios per layer for defensible statistics
2. **Test multimodal models** with actual image inputs for Layers 1-3 and 6-7
3. **Evaluate defences**: input preprocessing (Unicode normalisation for L2, metadata stripping for L4), prompt rewriting, and safety-trained task rejection

The 8-layer taxonomy is a starting framework. As visual AI capabilities expand -- especially in embodied systems where cameras provide continuous visual input -- the visual attack surface will grow with it.

---

*This post is based on [Report #332](/research/reports/332_visual_jailbreak_meta_analysis) from the Failure-First Embodied AI project. Specific mechanism details for the highest-ASR layers are withheld pending coordinated vendor disclosure (target: T+90). The 20-scenario dataset and all 152 FLIP-graded traces are available in the research repository. Issue [#649](https://github.com/adrianwedd/failure-first-embodied-ai/issues/649).*
