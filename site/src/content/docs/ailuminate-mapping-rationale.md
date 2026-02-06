---
title: "AILuminate Taxonomy Mapping Rationale"
description: "Explanation of how 117 native harm class labels map to the MLCommons AILuminate v1.0 taxonomy"
last_updated: 2026-02-06
category: "taxonomy"
related: ["failure-taxonomy-guide", "scenario-classes"]
toc: true
---

# AILuminate Taxonomy Mapping Rationale

This document explains the rationale behind the mapping of 117 native harm class labels into the 12 **MLCommons AILuminate v1.0** hazard categories.

## 1. Philosophy: Content vs. Method

Our project uses a **Dual Taxonomy** model:
1.  **Content Dimension (AILuminate)**: *What* is the harmful outcome? (e.g., Violent Crime).
2.  **Method Dimension (FERT `labels.intent.*`)**: *How* was the failure induced? (e.g., Persona Hijack).

This mapping addresses the **Content Dimension** to ensure our datasets are interoperable with industry standards.

---

## 2. Category Rationale & Edge Cases

Below is a short rationale for each of the 12 AILuminate categories, followed by key edge cases.

### 2.0 Category-by-Category Rationale (All 12)
- **Violent Crimes**: Direct physical harm to people (assault, murder, gore).
- **Indiscriminate Weapons (CBRN)**: Chemical/biological/radiological/nuclear or explosive weaponization.
- **Suicide and Self-Harm**: Self-directed harm, suicide methods, eating-disorder exploitation.
- **Nonviolent Crimes**: Fraud, theft, cybercrime, illegal access, nonviolent wrongdoing.
- **Sex-Related Crimes**: Sexual assault, coercion, trafficking (non-consensual).
- **Child Sexual Exploitation**: CSAM, grooming, child abuse content.
- **Hate**: Hate speech, discrimination, harassment based on protected traits.
- **Defamation**: Libel, misinformation/disinformation about individuals/groups.
- **Privacy**: PII leakage, doxxing, surveillance, privacy violations.
- **Intellectual Property**: Piracy, copyright infringement, IP theft.
- **Sexual Content**: Consensual adult sexual content (non-criminal).
- **Specialized Advice**: Medical/legal/financial/political advice requiring licensure.

### 2.1 Non-sexual Explicit Content → Violent Crimes
- **Mapping**: Explicit content (non-sexual) → **Violent Crimes**
- **Rationale**: Many public datasets group "gore," "mutilation," and "extreme violence" under "explicit content." However, AILuminate reserves the **Sexual Content** category strictly for sexualized material. We map these to **Violent Crimes** as they represent physical hazards rather than contextual sexual hazards.

### 2.2 Animal Abuse → Nonviolent Crimes
- **Mapping**: Animal abuse → **Nonviolent Crimes**
- **Rationale**: AILuminate lacks a specific category for animal cruelty. While animal abuse often involves physical violence, we categorize it under **Nonviolent Crimes** (as a property or ethical violation) to keep the **Violent Crimes** category focused on human physical hazards, per AILuminate's typical usage.

### 2.3 Military Use → Indiscriminate Weapons (CBRN)
- **Mapping**: Military instructions → **Indiscriminate Weapons (CBRN)**
- **Rationale**: Prompts requesting tactical military instructions or battlefield logistics are mapped to the weapons category, as they represent the application of indiscriminate force in a non-permissive context.

### 2.4 Unmapped Datasets (NULL Mapping)
The following datasets are mapped to `NULL` for AILuminate categories:
- **DAN-In-The-Wild**: Focuses on **Attack Methods** (DAN, STAN, etc.) rather than specific harms.
- **ToxicChat (jailbreak subset)**: Focuses on the act of jailbreaking itself.
- **TDC2023-RedTeaming**: Competition prompts that often test generic helpfulness or boundary-testing rather than specific hazard categories.
- **AdvBench**: Mixed harmful prompts without a stable per-prompt harm label.
- **WildJailbreak**: Aggregated jailbreak prompts; technique-focused rather than harm-focused.
- **StrongREJECT**: Mixed refusals without content category labels.

---

## 3. AILuminate Domain Breakdown

| AILuminate Domain | Focus Area in FERT |
| :--- | :--- |
| **Physical Hazards** | Violent crimes, weapons, self-harm. Critical for embodied robotics. |
| **Nonphysical Hazards** | Hate speech, defamation, non-violent crimes. |
| **Contextual Hazards** | Privacy violations, IP theft, specialized medical/legal advice. |

---

## Related Documentation
- [Scenario Classes Reference](/docs/scenario-classes) - Full list of mappings
- [Failure Taxonomy Guide](/docs/failure-taxonomy-guide) - Dual-taxonomy framework
