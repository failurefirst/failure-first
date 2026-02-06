---
title: "Dataset User Guide"
description: "Practical instructions for researchers using the Failure-First Embodied AI datasets"
last_updated: 2026-02-06
category: "data"
related: ["dataset-selection", "failure-taxonomy-guide", "grader-comparison"]
toc: true
---

# Dataset User Guide

Welcome to the **Failure-First Embodied AI** datasets. This repository contains curated scenarios designed to test the safety boundaries, refusal consistency, and recovery logic of LLM-based embodied agents.

## 1. Dataset Types

The data is organized into several categories:

| Category | Description |
| :--- | :--- |
| **Single-Agent Scenarios** | Standard red-teaming entries focusing on a single agent and a single user. |
| **Multi-Agent Scenarios** | Scenarios involving bystanders, supervisors, or multiple coordinated agents. |
| **Stateful Episodes** | Multi-scene sequences (5-10 turns) that test memory and consistency under pressure. |
| **Archaeology** | Historical jailbreaks adapted for the embodied AI context. |
| **Intent Bait** | High-precision prompts designed to test specific instruction-hierarchy subversion patterns. |

---

## 2. Dataset Selection Matrix

Use the following table to select the most appropriate dataset for your evaluation:

| Dataset | Best For... | Size | Quality |
| :--- | :--- | :--- | :--- |
| **Sanity Pack** | Fast CI/CD, smoke tests, debugging runners. | ~20 | ⭐⭐⭐⭐⭐ |
| **JBB-Behaviors** | Testing specific harmful intent classes. | ~200 | ⭐⭐⭐⭐⭐ |
| **StrongREJECT** | Complex, nuanced refusal benchmarking. | ~300 | ⭐⭐⭐⭐⭐ |
| **Multi-Agent** | Testing bystander and supervisor logic. | ~100 | ⭐⭐⭐⭐ |
| **Episodes** | Testing memory, context windows, and drift. | ~50 | ⭐⭐⭐⭐ |
| **BeaverTails** | Large-scale statistical analysis (Unsafe only). | 5,000+ | ⭐⭐⭐ |
| **Archaeology** | Historical/Classical jailbreak consistency. | ~100 | ⭐⭐⭐ |

---

## 3. Recommended "Splits"

If you are new to the framework, we recommend starting with these curated sets:

- **Sanity Pack:** A small (10-20 entries) representative set of common failure modes. Ideal for quick CI tests.
- **Full Benchmark Pack:** Comprehensive evaluation across all major failure categories.

---

## 4. Understanding the Data Format (v0.2)

Every entry in our core datasets follows a strict JSON Schema. Key fields include:

- `id`: A unique identifier (e.g., `JA-DAN-001`).
- `domain`: Deployment context (e.g., `physical_manipulation`, `information_access`).
- `scenario_class`: Attack technique classification (e.g., `dan_persona`, `cipher_obfuscation`).
- `attack_attempt`: Boolean flag indicating if this is an adversarial scenario (true) or a benign control (false).
- `turns[]`: The actual prompts and responses exchanged with the model (role + text).
- `labels.intent.*`: Boolean flags indicating instruction-hierarchy subversion methods used.
- `labels`: Various risk and failure mode labels (attack success, refusal triggers, etc.).

**AILuminate v1.0 Taxonomy Mapping:** The unified harm taxonomy mapping is integrated into the dataset infrastructure, allowing consistent classification across datasets. See [AILuminate Mapping Rationale](/docs/ailuminate-mapping-rationale) for details.

---

## 5. How to Contribute

We welcome new failure scenarios! To ensure quality, all new data must pass our validation pipeline.

### Step 1: Create your entry
Create a new entry following the JSON Schema format.

### Step 2: Validate Schema
Ensure your entry passes JSON Schema validation with cross-field invariant checks.

### Step 3: Safety Linting
Our linter ensures that your prompts are **non-operational** (describing patterns, not providing actionable instructions).

### Step 4: Indexing
If you generated a large batch of attacks, update the manifest for discoverability.

---

## Related Documentation
- [Dataset Selection Guide](/docs/dataset-selection) - Decision tree for choosing the right dataset
- [Failure Taxonomy Guide](/docs/failure-taxonomy-guide) - Understanding failure modes and classifications
- [Grader Comparison Guide](/docs/grader-comparison) - Choosing the right evaluation approach
