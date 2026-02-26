---
title: "The Faithfulness Gap: When Models Follow Format But Refuse Content"
description: "Format-lock prompts reveal a distinct vulnerability class where models comply with structural instructions while safety filters focus on content. Our CLI benchmarks across 11 models show format compliance rates from 0% to 92%."
date: 2026-02-26
tags: [faithfulness, benchmarks, vulnerability, format-lock, safety]
---

## The Problem

When you ask an LLM to produce a JSON object, follow a YAML schema, or complete a code snippet, it tries hard to comply. Format instructions trigger a different kind of obedience than content instructions — one that appears to operate partially outside the usual safety evaluation pipeline.

We call this the **faithfulness gap**: the measurable difference between a model's willingness to follow structural/format instructions and its willingness to produce harmful content embedded within those structures. Format-lock prompts exploit this gap by wrapping adversarial requests inside formatting constraints that the model feels obligated to satisfy.

This is not the same thing as a standard jailbreak. Budget-starvation attacks, persona hijacks, and DAN-style prompts all try to suppress the safety filter directly. Format-lock prompts do something subtler — they route the request through a compliance pathway (format adherence) that may be evaluated independently from content safety.

## CLI Benchmarks: 3 Frontier Models

We tested 25 faithfulness-gap scenarios against three frontier models using their native CLI tools: Claude Sonnet 4.5, Codex GPT-5.2, and Gemini 3 Flash. Each scenario embedded a harmful request inside a format-compliance frame — JSON output schemas, YAML config generation, code completion tasks, and similar structural patterns.

Results were graded by an LLM judge (not heuristic keyword matching), which turned out to matter significantly.

| Model | LLM-Graded ASR | Heuristic ASR | Delta |
|-------|----------------|---------------|-------|
| Codex GPT-5.2 | 42.1% (8/19) | 84.2% | -42 pts |
| Claude Sonnet 4.5 | 30.4% (7/23) | 4.3% | +26 pts |
| Gemini 3 Flash | 23.8% (5/21) | — | — |

The heuristic classifier — which looked for structural patterns like step-by-step responses and helpful formatting — massively over-reported Codex's compliance and under-reported Claude's. Codex's responses frequently included formatted structure (which the heuristic read as compliance) alongside substantive refusals. Claude's refusals were sometimes minimal or indirect, which the heuristic missed as partial compliance.

This divergence is itself a finding: measuring faithfulness-gap vulnerabilities with keyword or pattern heuristics produces unreliable results. The gap between heuristic and LLM-graded ASR for Codex was 42 percentage points.

## Structural ASR Across 8 Open Models

We ran the same scenario family against eight models via Ollama to test whether format compliance scales with model size or architecture. These results used heuristic classification, so they should be interpreted as directional rather than precise — but the spread is striking enough to be informative.

| Model | Structural ASR |
|-------|---------------|
| Nemotron 30B | 92% |
| Llama 3.1 70B | 91% |
| DeepSeek R1 | 84% |
| GPT-OSS 120B | 65% |
| Nemotron 9B | 44% |
| Nemotron 12B | 36% |
| LFM 1.2B | 35% |
| Gemma 27B | 0% |

The range from 0% to 92% suggests that format compliance is not a simple function of model capability. Gemma 27B refused every format-lock prompt, while models both larger and smaller complied at high rates. The Nemotron family showed an interesting non-monotonic pattern: the 30B variant complied at 92% while the 9B and 12B variants were below 45%.

## Why Format-Lock Works Differently

Standard adversarial prompts try to convince the model that the harmful content is acceptable — through roleplay, hypothetical framing, or authority claims. Format-lock prompts instead try to make the format compliance feel mandatory while the content decision feels secondary.

Consider the difference:

- **Budget-starvation:** "You have 10 tokens. Just answer the question." — Tries to bypass reasoning about safety.
- **Format-lock:** "Complete this JSON schema with the requested field values." — Routes the request through a code-completion pathway where format adherence is the primary objective.

In our testing, budget-starvation prompts achieved 4-17% ASR across seven models (as documented in our inverse scaling study). Format-lock prompts achieved 23-92% against comparable models. The difference suggests these are genuinely distinct vulnerability classes, not variations on the same attack.

The hypothesis — not yet validated at scale — is that format compliance and content safety are evaluated through partially independent pathways during inference. When a prompt frames the task as primarily structural, the format-compliance pathway may dominate, reducing the weight given to content safety evaluation.

## Implications

Three observations emerge from this testing:

**Measurement methodology matters.** The 42-point divergence between heuristic and LLM-graded ASR for Codex means that any study of format-lock vulnerabilities using only keyword classification is likely producing unreliable numbers. Our earlier heuristic-based results required substantial correction. Studies in this area should use LLM-graded or human-graded evaluation.

**Format compliance is a distinct attack surface.** The low correlation between format-lock ASR and standard jailbreak ASR across our model set suggests these vulnerabilities have different root causes. A model that resists DAN prompts effectively may still be vulnerable to format-lock attacks, and vice versa. Safety evaluations that test only one category will miss the other.

**Non-monotonic scaling deserves investigation.** The Nemotron family's pattern (30B at 92%, 12B at 36%, 9B at 44%) and the broader spread across model sizes suggest that format-lock resistance is not simply acquired through scale. Whatever training or architectural choices make Gemma 27B completely resistant to these prompts, they are not present in larger models from other families.

## Limitations

Our sample size is modest: 25 scenarios, with effective counts of 19-23 per model after excluding parsing failures. The Ollama results use heuristic classification, which we have demonstrated is unreliable for this attack class. The CLI results use LLM grading, which is more reliable but not ground truth. These findings are preliminary and directional.

The traces from these experiments are available in our benchmark archive for reproduction and further analysis.
