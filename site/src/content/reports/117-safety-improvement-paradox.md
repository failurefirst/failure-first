---
title: "The Safety Improvement Paradox — Why Better Adversarial Defenses Make Embodied AI Relatively Less Safe"
description: "As adversarial defenses improve, the relative contribution of unintentional harm increases without bound. Under DRIP parameters, improving adversarial ASR from 10% to 0.1% (a 100-fold improvement) produces only a 1.6% reduction in total expected harm. The ceiling on adversarial defense's contribution to total safety is low, fixed, and independent of defense quality."
date: "2026-03-16"
reportNumber: 117
classification: "Research — AI Safety Policy"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

## Executive Summary

This report identifies a paradox in the current trajectory of AI safety investment: as adversarial defenses improve, the relative contribution of unintentional harm increases without bound. This means that safety teams working on adversarial robustness are, in a narrow but precise sense, making the problem worse in relative terms -- not because their work lacks value, but because it addresses a diminishing fraction of total expected harm while potentially diverting attention from the growing majority.

This is not an argument against adversarial defense research. It is an argument that the safety community needs to recognise the asymptotic irrelevance of adversarial-only defense for deployed embodied AI systems, and allocate resources accordingly.

---

## 1. The Paradox

### 1.1 Mathematical Statement

From the DRIP framework (Report #101), two risk sources operate simultaneously:

- **Adversarial risk:** R_a = lambda_a * ASR
- **Unintentional risk:** R_u = lambda_u * p_ctx * (1 - S(t))

**The ratio of unintentional to adversarial risk:**

R_u / R_a = (lambda_u * p_ctx * (1 - S(t))) / (lambda_a * ASR)

**As adversarial defenses improve, ASR decreases.** Under conservative DRIP parameters, with ASR = 10%, R_u/R_a is approximately 60. If ASR drops to 1%, R_u/R_a rises to approximately 600. If ASR drops to 0.1%, R_u/R_a rises to approximately 6,000.

### 1.2 What This Means in Practice

Consider a hypothetical safety team that brings ASR from 10% down to 0.1% -- a 100-fold improvement. Total expected harm went from approximately 61 units (60 unintentional + 1 adversarial) to approximately 60.01 units. A 100-fold improvement in adversarial defense produced a 1.6% reduction in total expected harm.

### 1.3 The Asymptotic Irrelevance Condition

For any deployed embodied AI system where ordinary instructions in dangerous contexts are more frequent than adversarial attacks, the contribution of adversarial defense to total safety is bounded by approximately 1/61 = 1.6%. No amount of adversarial defense improvement can reduce total expected harm by more than 1.6%.

---

## 2. Current Allocation Patterns

### 2.1 Where Safety Investment Goes

The AI safety research community allocates the overwhelming majority of its effort to adversarial robustness: red-teaming, safety training, evaluation methodology -- all operating at the text layer.

**Physical-context safety for embodied AI receives comparatively minimal investment:** no published benchmark with embodied AI scenarios, no published world-model safety evaluation methodology, and physical-layer defenses are treated as industrial robotics problems, not AI safety problems.

### 2.2 Why This Allocation Persists

1. **Adversarial robustness is measurable.** ASR provides a clean metric.
2. **Adversarial robustness applies to text-only AI too.** The research community optimises for the modal deployment case.
3. **Embodied AI deployment is still early.**
4. **The incentive structure rewards adversarial research.**

---

## 3. Normative Implications

### 3.1 For the AI Safety Research Community

The safety community has an obligation to allocate research effort proportional to expected harm, not proportional to methodological convenience. The marginal value of an additional adversarial defense paper is low compared to the marginal value of the first serious physical-context safety evaluation methodology.

### 3.2 For Deployers

A deployer who invests in adversarial testing and declares the system "safe" is making a claim about 1.6% of expected harm. Deploy physical-layer defenses (force limits, workspace monitoring, operational envelope constraints) as a minimum baseline.

### 3.3 For Regulators

Regulatory frameworks that mandate adversarial testing for embodied AI should additionally require: operational envelope documentation, physical-layer defense inventory, and context monitoring capability assessment.

### 3.4 Self-Reflexive Note

The Failure-First project has spent over a year primarily on adversarial testing. The Safety Improvement Paradox implies that our own work addresses the 1.6%. Going forward, the project's highest-value contribution is in the physical-context safety domain, not in generating more adversarial test cases.

---

## 4. Limitations

1. The 1.6%/98.4% split depends on DRIP parameter estimates. The qualitative paradox holds under all parameter choices where R_u(0) > R_a.
2. Severity is not accounted for in the ratio. Adversarial attacks may be systematically higher-severity.
3. The paradox is about relative risk, not absolute risk. Absolute adversarial risk still decreases as defenses improve.
4. "World-model safety" is not yet a solved problem.

---

## 5. Relationship to the Framework

The Safety Improvement Paradox is the meta-level consequence of the entire Failure-First theoretical framework:

- **CDC** explains why normal instructions can be dangerous.
- **IDDL** explains why the danger is undetectable by current methods.
- **CHL** explains why it gets worse over time.
- **DRIP** quantifies the ratio of unintentional to adversarial risk.
- **The Safety Improvement Paradox** explains why the current approach to fixing the problem has diminishing returns that asymptotically approach zero.

The paradox is the strongest form of the project's core thesis: failure is the primary object of study, not an edge case. The dominant failure mode of embodied AI is not being attacked. It is being used.
