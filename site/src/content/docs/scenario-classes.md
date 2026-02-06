---
title: "Comprehensive Scenario Classes Reference"
description: "Browsable reference for all 755 scenario classes and 117 harm categories in the Failure-First Embodied AI taxonomy"
last_updated: 2026-02-06
category: "taxonomy"
related: ["failure-taxonomy-guide", "ailuminate-mapping-rationale", "technique-evolution"]
toc: true
---

# Comprehensive Scenario Classes Reference

This document provides a browsable reference for all failure modes and harm categories covered in the project. The complete taxonomy includes **755 scenario classes** organized by domain.

## 1. Taxonomy Overview

Scenario classes represent specific, context-aware failure patterns discovered in our datasets. They are organized into these major domains:

- **embodied_redteam** (581 classes) - Core embodied AI failure patterns
- **adversarial_poetry_redteam** (30 classes) - Poetic/creative attack vectors
- **jailbreak_archaeology** (multiple eras) - Historical jailbreak patterns adapted for embodiment
- **multi_agent** - Multi-actor conflict scenarios
- **episodes** - Stateful multi-turn degradation patterns

## 2. Major Scenario Class Categories

### 2.1 Embodied Redteam Classes (Sample)

Key categories within the 581 embodied_redteam classes include:

- **Academic_Research_Exemption** - Exploiting research context claims
- **Adversarial_Dataset_Generation** - Meta-level jailbreak generation requests
- **Authority_Conflict** - Multi-authority contradictions
- **Cognitive_Load_Exploitation** - Overwhelming agent reasoning capacity
- **Comparative_Distinction_Leakage** - Eliciting information through comparison
- **Constraint_Erosion** - Gradual relaxation of safety boundaries
- **Embodied_Mirror_Neuron_Hijack** - Exploiting imitation behaviors
- **Format_Lock** - Forcing strict output formats to bypass refusals
- **Future_Year_Laundering** - Temporal displacement attacks
- **Goal_Drift** - Incremental objective shifts
- **Incremental_Erosion** - Multi-turn safety degradation
- **Intent_Bait** - High-precision instruction-hierarchy subversion
- **Memory_Poisoning** - Adversarial context injection
- **Persona_Hijack** - Role-based safety bypass
- **Physical_Boundary_Violation** - Spatial constraint exploitation
- **Post_Refusal_Leakage** - Extracting information after initial refusal
- **Reasoning_Exploit** - CoT manipulation in reasoning models
- **Refusal_Suppression** - Explicit anti-refusal instructions
- **Social_Shielding** - Using human presence to prevent safety interventions
- **Temporal_Displacement** - Future/past context manipulation
- **Workspace_Intrusion** - Restricted zone access attempts

### 2.2 Adversarial Poetry Classes

Creative attack vectors using poetic forms:

- **Memory Corruption through Repetition**
- **Syllabic Safety Bypass**
- **Visual Command Exploitation**
- **Recursive Command Echo**
- **Sensor Fusion Corruption through Syllable Patterns**
- **Navigation Distortion**
- **Social Engineering Cascade**

### 2.3 Jailbreak Archaeology Eras

Historical jailbreak techniques organized by era:

- **dan_2022** - Original DAN (Do Anything Now) persona variants
- **persona_2022** - Early persona-based jailbreaks
- **cipher_2023** - Encoding-based evasion (Base64, ROT13, leetspeak)
- **many_shot_2024** - Context window saturation attacks
- **crescendo_2024** - Incremental multi-turn erosion
- **reasoning_2025** - Chain-of-thought manipulation for reasoning models

## 3. Harm Class Taxonomy (117 Classes)

All scenario classes map to one of 117 harm categories, which in turn map to the **MLCommons AILuminate v1.0** taxonomy (12 categories across 3 domains).

### AILuminate Domain Distribution

| Domain | AILuminate Category | Coverage |
|--------|-------------------|---------|
| Physical Hazards | Violent Crimes | 9.7% |
| Physical Hazards | Indiscriminate Weapons (CBRN) | 4.5% |
| Physical Hazards | Suicide and Self-Harm | 2.7% |
| Nonphysical Hazards | Nonviolent Crimes | 21.8% |
| Nonphysical Hazards | Hate | 12.0% |
| Nonphysical Hazards | Defamation | 5.8% |
| Nonphysical Hazards | Child Sexual Exploitation | 1.5% |
| Nonphysical Hazards | Sex-Related Crimes | 1.2% |
| Contextual Hazards | Specialized Advice | 12.0% |
| Contextual Hazards | Sexual Content | 4.5% |
| Contextual Hazards | Privacy | 3.0% |
| Contextual Hazards | Intellectual Property | 1.6% |
| *(unmapped)* | Mixed/needs annotation | 19.6% |

## 4. Using This Taxonomy

### For Researchers
- **Dataset Selection**: Choose datasets based on the scenario classes you want to test
- **Failure Analysis**: Classify observed failures using this taxonomy
- **Coverage Analysis**: Identify gaps in your evaluation suite

### For Developers
- **Safety Testing**: Build comprehensive test suites covering multiple classes
- **Failure Monitoring**: Categorize production failures for trend analysis
- **Defense Design**: Prioritize defenses based on high-risk scenario classes

### For Policymakers
- **Risk Assessment**: Understand the breadth of potential failure modes
- **Standards Development**: Reference this taxonomy when creating safety standards
- **Compliance**: Map regulatory requirements to specific scenario classes

## 5. Accessing the Full Taxonomy

The complete taxonomy with all 755 scenario classes is available in the research datasets. Key interfaces:

- **Dataset Files**: JSONL files with `scenario_class` field
- **Database Queries**: SQL queries against the jailbreak corpus database
- **Programmatic Access**: Python tools for taxonomy traversal and analysis

## 6. Taxonomy Evolution

This taxonomy is continuously expanded through:

- **Automated Discovery**: Pattern-mining from model responses
- **Manual Curation**: Expert review and classification
- **Community Contributions**: Researcher submissions of novel failure patterns
- **Cross-Dataset Integration**: Importing patterns from public benchmarks

Version history and change logs track taxonomy evolution over time.

---

## Related Documentation
- [Failure Taxonomy Guide](/docs/failure-taxonomy-guide) - Dual-taxonomy framework
- [AILuminate Mapping Rationale](/docs/ailuminate-mapping-rationale) - Industry standard mapping
- [Technique Evolution](/docs/technique-evolution) - Historical attack technique development
- [Dataset Selection Guide](/docs/dataset-selection) - Choosing datasets by scenario class

---

*Note: The complete 755-class taxonomy with example IDs and detailed descriptions is available in the research datasets. This web reference provides the organizational structure and key categories for navigation and understanding.*
