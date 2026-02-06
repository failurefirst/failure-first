---
title: "Attack Technique Evolution Timeline"
description: "Historical evolution of jailbreak techniques from 2022 to present, showing how adversarial innovation responds to AI safety training"
last_updated: 2026-02-06
category: "taxonomy"
related: ["failure-taxonomy-guide", "scenario-classes"]
toc: true
---

# Attack Technique Evolution Timeline

This document traces the historical evolution of jailbreak techniques from 2022 to the present, highlighting how adversarial innovation has responded to improvements in AI safety training.

## 1. Timeline Overview

| Era | Key Theme | Landmark Technique | Vulnerability Exploited |
| :--- | :--- | :--- | :--- |
| **Pre-2022** | Naive Override | "Ignore previous instructions" | Lack of system/user turn distinction. |
| **2022** | Persona Hijack | **DAN** (Do Anything Now) | Deference to roleplay and helpfulness priors. |
| **2023** | Obfuscation | **Base64 / Leetspeak** | Semantic filters bypassing non-natural text. |
| **2024** | Erosion | **Crescendo / Many-Shot** | Context window saturation and stateful drift. |
| **2025** | Logic Traps | **CoT Manipulation** | Trust in the model's own reasoning traces. |

---

## 2. Era Deep-Dive

### 2.1 Pre-2022: Naive Prompt Injection
Early attacks were simple and direct. They relied on the fact that models didn't clearly distinguish between "System Instructions" and "User Input."
- **Landmark**: `prompt_injection/ignore_previous`
- **Mechanism**: Telling the model to "Forget everything above" and act as a simple terminal.

### 2.2 2022: The "DAN" Era (Persona Injection)
As models became more helpful, attackers exploited that helpfulness by creating fictional personas that "must" comply with restricted requests.
- **Landmark**: `DAN/v1`, `AIM/v1`
- **Mechanism**: Creating a complex character (e.g., "Always Intelligent and Machiavellian") whose internal rules override the model's safety guidelines.

### 2.3 2023: The "Cipher" Era (Encoding Evasion)
Safety training began catching persona-based attacks. Attackers responded by encoding their requests into formats that the model could understand but safety filters (at the time) could not read.
- **Landmark**: `cipher/base64`, `cipher/leetspeak`, `cipher/rot13`
- **Mechanism**: Exploiting the gap between the model's reasoning capabilities and its keyword-based input filters.

### 2.4 2024: The "Volumetric" Era (Many-Shot & Multi-Turn)
With the expansion of context windows, attackers discovered that they could "erode" a model's safety alignment by providing hundreds of benign examples (Many-Shot) or incrementally leading the model toward a violation (Crescendo).
- **Landmark**: `many_shot/128_shots`, `crescendo/social_engineering`
- **Mechanism**: Saturation of the attention mechanism and incremental goal drift.

### 2.5 2025: The "Reasoning" Era (CoT Exploits)
The latest generation of "thinking" models (e.g., DeepSeek-R1, OpenAI o1) introduces a new surface: the Chain-of-Thought (CoT). Attackers now use logic traps to induce the model to "reason itself" into a violation.
- **Landmark**: `reasoning_exploit/cot_manipulation`, `reasoning_exploit/thinking_trace`
- **Mechanism**: Using deductive traps where the model's own logical steps lead it to conclude that a harmful action is necessary for "consistency" or "logic."

---

## 3. Technique Families

Our database maps 79 specific techniques into these broader families:

- **Persona**: Roleplay, authority spoofing, emotional leverage.
- **Encoding**: Base64, ROT13, Morse, Ciphers.
- **Volumetric**: Many-shot, long-context saturation.
- **Multi-Turn**: Incremental erosion, stateful drift.
- **CoT_Exploit**: Reasoning traps, deductive interference.

---

## 4. Family → Era Mapping

| Family | Primary Eras | Notes |
| :--- | :--- | :--- |
| Persona | 2022 | DAN-style role hijacks. |
| Encoding | 2023 | Base64, ROT13, leetspeak. |
| Volumetric | 2024 | Many-shot saturation. |
| Multi-Turn | 2024 | Crescendo, incremental erosion. |
| CoT_Exploit | 2025 | Reasoning trace manipulation. |
| Prompt_Injection | Pre-2022 | Naive override patterns. |

---

## Related Documentation
- [Scenario Classes Reference](/docs/scenario-classes) - Complete taxonomy of attack patterns
- [Failure Taxonomy Guide](/docs/failure-taxonomy-guide) - Dual-taxonomy framework
