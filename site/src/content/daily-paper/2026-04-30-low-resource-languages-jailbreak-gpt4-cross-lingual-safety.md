---
title: "Low-Resource Languages Jailbreak GPT-4"
description: "Translating harmful queries into low-resource languages bypasses GPT-4's safety filters at high rates, exposing a systematic cross-lingual gap in LLM safety training."
date: 2026-04-30
arxiv: "2310.02446"
authors: "Zheng-Xin Yong, Cristina Menghini, Stephen H. Bach"
paperType: "empirical"
tags: [jailbreak, cross-lingual, safety-alignment, red-teaming, multilingual]
draft: false
---

Safety alignment research has largely been conducted in English. The datasets used to train human feedback signals, the harmful-content classifiers used to filter outputs, and the red-teaming exercises that surface failure modes — nearly all of it reflects a monolingual assumption baked into how frontier LLMs are built. A 2023 paper from Brown University makes this assumption explicit by testing its consequences: when you translate a harmful query from English into a low-resource language, does GPT-4's safety filter still hold?

The answer, consistently, is no.

### The Cross-Lingual Vulnerability

The mechanism is structural. Safety training via RLHF relies on human annotators flagging harmful content. Those annotators work primarily in high-resource languages — English, Mandarin, Spanish, French. The reinforcement signal that teaches a model to refuse harmful requests is therefore densest in those languages. For languages like Zulu, Scottish Gaelic, or Hmong, the training signal is thin or absent.

The authors test this by taking prompts from AdvBenchmark — a standard evaluation suite of harmful queries — and machine-translating them into a range of low-resource languages. The translated queries are then submitted to GPT-4. The results show high rates of unsafe content generation from the translated inputs, with success rates substantially above what the same prompts achieve in English, where the safety filter reliably triggers.

The attack requires no adversarial expertise. Any user with access to a machine translation API can convert a refused English query into a low-resource language equivalent and receive the harmful content. The vulnerability is wide, cheap to exploit, and not specific to any particular category of harmful content.

### Why RLHF Alone Cannot Close This Gap

The paper surfaces a fundamental tension in how safety alignment works. RLHF trains a model to reproduce the preferences expressed by its feedback annotators. If those annotators cannot evaluate content in a given language, the model receives no signal about what constitutes harmful output in that language. The model's multilingual capabilities — its ability to read, generate, and reason in dozens of languages — are acquired largely through pretraining on multilingual corpora. But safety is calibrated almost exclusively in the languages where human feedback is available.

This means the safety and capability curves diverge as you move toward lower-resource languages. GPT-4 is remarkably capable in languages like Zulu; it can generate fluent, coherent text on almost any topic. But its refusal behavior in those languages is unreliable, because no one trained it to refuse in Zulu.

The mismatch is not a corner case. As large language models are adopted globally, users who speak lower-resource languages will interact with them in those languages. The demographic distribution of users is not the same as the demographic distribution of RLHF annotators, and this paper shows that gap has safety consequences.

### Embodied AI and the Multilingual Attack Surface

The cross-lingual vulnerability documented here is not limited to text generation, and its relevance to embodied AI deserves attention.

VLA (Vision-Language-Action) models interpret natural language instructions and translate them into physical actions. If such a system is deployed in a multilingual context — an international facility, a consumer robot sold across language markets, or an agent operating across jurisdictions — the instructions it receives may span many languages. Safety alignment conducted exclusively in English provides no guarantee that the model will refuse harmful action commands issued in Thai or Yoruba.

The threat model extends further: an adversary aware of this gap might deliberately issue instructions in a low-resource language not to communicate naturally, but specifically to exploit the alignment deficit. The physical consequences of a successful jailbreak in an embodied system are categorically different from harmful text generation — an unlocked refusal in a chatbot produces words; an unlocked refusal in a robot controller can produce physical harm.

### What Robust Multilingual Safety Requires

The authors stop short of proposing a full solution, but the paper implies several directions. Safety red-teaming must include low-resource language evaluation as a first-class component, not an afterthought. RLHF data collection needs to expand its annotator pool to cover the languages in which systems will actually be deployed. And output classifiers that operate as safety guardrails must be evaluated for cross-lingual coverage, not just English performance.

There is also a case for language-agnostic safety mechanisms — approaches that detect harmful *intent* regardless of surface language rather than relying on language-specific pattern matching. Representation engineering and latent-space interventions may offer more robust paths forward than multilingual prompt classifiers, precisely because they operate below the level where language identity matters.

### The Takeaway

This paper is a reminder that safety is a property of a deployed system, not just of a model evaluated in controlled conditions. A model that refuses harmful requests in English but complies with the same requests translated to Zulu is not a safe model — it is a model with an exploitable gap in its safety coverage. Closing that gap requires treating multilingual evaluation as a core safety requirement, not an internationalization concern.

*Read the [full paper on arXiv](https://arxiv.org/abs/2310.02446) · [PDF](https://arxiv.org/pdf/2310.02446.pdf)*
