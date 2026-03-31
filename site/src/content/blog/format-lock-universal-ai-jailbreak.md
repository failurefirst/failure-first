---
title: "Format-Lock: The Universal AI Jailbreak"
description: "One attack family achieves 97.5-100% success rates on every model we have tested, from 4B to 1.1 trillion parameters. Even the safest model in our corpus -- which resists every other attack -- falls to format-lock. Here is what deployers need to know."
date: 2026-03-25
tags: [research, format-lock, jailbreak, adversarial-testing, ai-safety, embodied-ai, vulnerability]
image: "https://cdn.failurefirst.org/images/daily-paper/format-lock-universal.webp"
draft: false
---

Every model we have tested falls to the same attack.

Not most models. Not frontier models. Not models from a particular provider. Every model. From a 4-billion parameter open-weight release to a 1.1-trillion parameter mixture-of-experts system. Across Google, Mistral, DeepSeek, Moonshot AI, Zhipu AI, NVIDIA, Meta, and Alibaba. Regardless of safety training investment, architecture, or deployment configuration.

The attack family is called **format-lock**, and it is the single most reliable adversarial technique we have documented in over 133,000 evaluation results across 201 models.

---

## What Format-Lock Does

Format-lock constrains the model's response format rather than directly requesting harmful content. Instead of asking "How do I do X?", a format-lock prompt says something like: "Return the following information as a JSON object with these fields..." or "Format your response as a YAML configuration file with these keys..."

The mechanism is straightforward. Safety training teaches models to refuse harmful *requests*. But format compliance -- generating structured output in a specified schema -- is a core capability that models are extensively trained to perform. Format-lock exploits the gap between these two training objectives. The model's instruction-following system treats format compliance as a higher priority than safety reasoning, and the structured output format masks the harmful content from the model's own safety detection.

The result: models that would refuse the same content in natural language will generate it when asked to produce structured output.

---

## The Data

We tested format-lock across four output formats (JSON, YAML, Python code, CSV) and five harm domains (cyber-security, bioweapons, drug synthesis, social engineering, financial fraud). All results were graded by Claude Haiku 4.5 using our FLIP methodology -- not keyword matching, not heuristic classification, but independent LLM-based semantic evaluation of each response.

### Scale Does Not Help

| Scale Band | Models Tested | Strict ASR | Notes |
|-----------|--------------|------------|-------|
| Sub-3B (floor) | 2 models | ~47-63% | Capability-limited: some models cannot reliably produce structured output at all |
| 4-14B (midrange) | 2 models | **97.5%** | Near-total compliance. 39 of 40 traces fully compliant |
| Frontier (>30B) | 6+ models | 100% (format-lock specific scenarios) | Every frontier model complied with all format-lock scenarios |

The midrange result is particularly striking. At 12-14 billion parameters, models have enough capability to produce well-formed structured output but have not developed sufficient safety reasoning to recognise the embedded harm. The 97.5% strict ASR means that out of 40 traces, only a single response was not full compliance -- and that one was a hallucinated refusal (the model appeared to refuse but still produced the content), making the Functionally Dangerous rate 100%.

### The Safest Model Falls

GLM-5 from Zhipu AI is the safest model in our frontier corpus. On standard adversarial prompts, it achieves 0% strict compliance -- it never fully complies with a harmful request. It resists compliance cascade attacks (0% ASR). It resists crescendo attacks (0% ASR). It resists multi-domain authority escalation (0% ASR). It resists compositional reasoning attacks (0% ASR).

Against format-lock? **100% compliance. All three format-lock scenarios. Every grading method.**

This is not a model with weak safety training. GLM-5 has the lowest adversarial compliance rate of any model we have tested. Its safety mechanisms are effective against every attack family we have documented -- except the one that bypasses safety reasoning entirely by operating at the instruction-following level.

### Universal Across Frontier Models

In our Operation Frontier Sweep campaign, format-lock was one of only two attack families to achieve 100% ASR across all four frontier models tested (480B to 1.1T parameters):

| Model | Parameters | Format-Lock ASR | Other Attack Families (Average) |
|-------|-----------|----------------|-------------------------------|
| Qwen3 Coder | 480B | 3/3 (100%) | 52.9% |
| DeepSeek V3.2 | 671B | 3/3 (100%) | 82.4% |
| Mistral Large 3 | 675B | 3/3 (100%) | 94.1% |
| Kimi K2.5 | 1.1T | 3/3 (100%) | 64.7% |

Every other attack family showed model-dependent results. Some models resisted authority gradient attacks. Some resisted compliance cascades. Some resisted reasoning budget starvation. But none resisted format-lock.

---

## Why It Works

Format-lock exploits what we call the **instruction-compliance gap**: the distance between a model's safety training and its instruction-following training. These two objectives are trained somewhat independently. Safety training teaches the model to recognise and refuse harmful content. Instruction-following training teaches the model to comply with format specifications, schema requirements, and structural constraints.

When these two objectives conflict, instruction-following wins -- consistently, across architectures, across providers, across scale.

Three factors make format-lock particularly resistant to mitigation:

1. **Format compliance is a core commercial capability.** Models are extensively optimised for structured output generation because enterprise users need JSON APIs, data extraction, and code generation. Degrading format compliance to improve safety would break legitimate use cases.

2. **The harm is distributed across fields.** In a JSON response, no single field contains "the harmful content" -- it is spread across keys, values, and structure. This makes content-level filtering difficult without understanding the semantic meaning of the assembled output.

3. **Safety detection fires too late.** By the time the model has committed to producing a structured response, it has already passed the decision point where safety reasoning typically intervenes. The format specification acts as a cognitive commitment device.

---

## What Deployers Should Do

If you deploy AI systems that accept user-specified output formats -- and most production systems do -- format-lock is a live vulnerability in your deployment today. Here is what we recommend based on our testing:

**Immediate actions:**

- **Audit your structured output endpoints.** Any API that accepts user-specified output schemas (JSON mode, function calling, tool use) is a potential format-lock vector.
- **Test with format-lock scenarios.** We provide pattern-level descriptions of the attack family. Contact us for assessment scenarios calibrated to your deployment context.
- **Do not rely on safety training alone.** Our data shows that no amount of safety training currently prevents format-lock compliance. You need output-level filtering in addition to model-level safety.

**Architectural mitigations:**

- **Schema validation with semantic analysis.** Validate not just the structure of model outputs but the semantic content of field values. A well-formed JSON object can contain harmful content in its values.
- **Output monitoring.** Monitor structured outputs for content that would trigger refusals in natural language. If the same content in prose would be refused, the structured version should be flagged.
- **Format-aware safety evaluation.** Include format-lock in your pre-deployment adversarial testing. If your evaluation only tests natural language prompts, you are missing the most reliable attack vector in the current threat landscape.

---

## Test Your Model

Format-lock resistance is now included in our **Model Safety Scorecard** and all tiers of our [adversarial robustness assessment services](/blog/adversarial-robustness-assessment-services). If you want to know whether your model or deployment is vulnerable -- it almost certainly is, but the severity depends on your output format exposure -- we can help you measure it.

Contact **adrian@failurefirst.org** to discuss format-lock assessment for your deployment.

---

*This post describes the format-lock attack family at a pattern level. Specific attack prompts, scenario details, and operational methodologies are not published. Our research is conducted under the Failure-First ethical framework with graduated disclosure.*
