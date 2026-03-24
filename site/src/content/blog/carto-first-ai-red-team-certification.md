---
title: "CARTO: The First AI Red Team Certification"
description: "There is no credential for AI red-teaming. CARTO changes that. Six modules, 20+ hours of content, built on 201 models and 133,000+ evaluation results. Coming Q3 2026."
date: 2026-03-25
tags: [carto, certification, red-teaming, ai-safety, training, professional-development]
image: "/images/daily-paper/carto-certification.webp"
draft: false
---

# CARTO: The First AI Red Team Certification

There is no credential for AI red-teaming.

Penetration testers have OSCP. Security auditors have CISA. Cloud architects have AWS Solutions Architect. But the person testing whether a language model will help a warehouse robot ignore its safety constraints? No credential. No curriculum. No standard of practice.

This is a problem, and it is getting worse.

---

## The Gap

The EU AI Act enters enforcement on August 2, 2026. Article 9 requires adversarial robustness testing for high-risk AI systems. The Australian AI Safety Institute is expanding its scope beyond text-only LLMs. NSW's Digital Work Systems Act creates workplace safety obligations for AI-integrated systems.

Organisations will need people who can test AI systems adversarially. Right now, those people are self-taught researchers, security professionals repurposing web application testing skills, or academics with paper-writing experience but no operational methodology.

None of these backgrounds is sufficient on its own. AI adversarial testing requires understanding attack taxonomies that span four years of rapid evolution, grading methodologies that handle probabilistic outputs (not binary pass/fail), defense assessment frameworks that account for non-composability, and ethical obligations that the cybersecurity world has spent decades developing but the AI safety field has barely begun to codify.

---

## What CARTO Covers

CARTO (Certified AI Red-Team Operator) is a six-module certification programme built on the F41LUR3-F1R57 research corpus: 201 models tested, 133,000+ evaluation results, 33 attack families documented, and 240+ research reports analysing how AI systems fail.

### Module 1: The AI Safety Landscape (2 hours)

The threat landscape across four eras of jailbreak evolution (DAN 2022, Crescendo 2024, Cipher 2024, Reasoning 2025). The 33 attack families in the F41LUR3-F1R57 taxonomy. Regulatory context across the EU AI Act, NIST AI RMF, OWASP LLM Top 10, and Australian frameworks.

### Module 2: FLIP Grading Methodology (3 hours)

The core technical methodology. FLIP (Failure-First Lethality and Impact Protocol) replaces binary pass/fail with four verdicts -- COMPLIANCE, PARTIAL, HALLUCINATION_REFUSAL, REFUSAL -- that capture the spectrum of model behavior. Manual grading, automated grading pipelines, and grader reliability analysis (Cohen's kappa between methods is 0.126 -- near-chance agreement, which is itself a research finding).

### Module 3: Attack Execution (3 hours)

How to conduct adversarial assessments: attack family selection, scenario construction, multi-turn escalation design, format-lock and reasoning-exhaustion techniques, and the critical distinction between testing methodology and operational exploitation. All exercises use pattern-level descriptions, never operational payloads.

### Module 4: Defense Assessment (3 hours)

The four-level defense benchmark (NONE through ADVERSARIAL_AWARE), the Defense Evolver automated optimization system, defense non-composability (why stacking defenses does not multiply protection), and the empirical finding that model selection matters more than prompt engineering for safety.

### Module 5: Reporting (3 hours)

Assessment report structure, writing findings without operational detail, MITRE ATLAS and OWASP mapping, Model Safety Scorecard computation, remediation recommendations, and EU AI Act compliance evidence packaging. Includes the full assessment report template used in commercial engagements.

### Module 6: Ethics and Responsible Disclosure (3 hours)

The AARDF graduated disclosure framework (five tiers from pre-registration to restricted hold), D-Score dual-use risk assessment, the observe-document-weaponise chain and how to interrupt it, the Grader Paradox (what happens when AI grades AI), and professional conduct standards for working with model providers.

---

## Why It Is Built on Research, Not Theory

Every module references specific empirical findings with report numbers, sample sizes, and confidence intervals. This is not a certification built on "best practices" distilled from conference talks. It is built on:

- **133,000+ adversarial evaluation results** across 201 models, graded by LLM-based classifiers with documented reliability metrics
- **33 attack families** with measured Attack Success Rates, including 6 novel families not documented elsewhere in the literature
- **A defense benchmark** showing that structured system prompts (L2) provide no measurable improvement over single-sentence instructions (L1) -- only adversarial-aware defenses (L3) reduce ASR
- **A grading methodology audit** demonstrating that keyword-based classifiers have 79.9% over-report rate compared to LLM grading -- meaning most "jailbreak detected" signals from simple classifiers are false positives
- **An ethics framework** developed in response to the project's own experience with the dual-use dilemma, not theoretical principles imported from other domains

When the curriculum states that "model selection matters more than prompt engineering for safety," it cites the specific data point: a model with no system prompt (L0) can outperform a different model with an adversarial-aware defense (L3), because base safety training is the dominant factor.

---

## Two Tiers

| Element | CARTO Fundamentals | CARTO Practitioner |
|---------|-------------------|-------------------|
| **Format** | Self-paced online | Proctored capstone exam |
| **Duration** | ~20 hours | 48-hour practical assessment |
| **Prerequisite** | None | CARTO Fundamentals |
| **Credential validity** | 2 years | 2 years |
| **Audience** | Security professionals, AI engineers, compliance officers | Professional red-teamers, safety consultants, audit firms |

CARTO Fundamentals covers all six modules with knowledge checks. CARTO Practitioner adds a 48-hour practical assessment: conduct a real adversarial evaluation, produce an assessment report, and defend your methodology and findings.

---

## Coming Q3 2026

We are currently finalising the curriculum content and assessment framework. The six modules are written. The assessment rubrics are in development.

If you are a security professional looking to move into AI safety, an AI engineer who wants to understand how your systems fail, a compliance officer preparing for EU AI Act enforcement, or a researcher who wants a structured methodology rather than ad hoc testing -- CARTO is built for you.

**Expressions of interest are welcome.** Contact us at [hello@failurefirst.org](mailto:hello@failurefirst.org) to be notified when enrolment opens.

---

*CARTO is developed by the F41LUR3-F1R57 project, an independent AI safety research programme. The certification is grounded in empirical adversarial research, not vendor-sponsored content. No model provider has editorial control over the curriculum.*
