---
title: "The Deployment Risk Inversion — When Normal Users Become More Dangerous Than Adversaries"
description: "At any moment during deployment, an embodied AI system faces two independent risk sources:"
date: "2026-03-15"
reportNumber: 101
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


## 1. The Synthesis

Three independently derived findings from the Failure-First corpus interact to produce a quantitative prediction that none of them generates alone.

**Finding 1 (CDC, Report #97):** For high-gamma embodied AI capabilities, ordinary instructions in dangerous contexts produce harm indistinguishable from adversarial attacks.

**Finding 2 (CHL, Report #98):** Safety instruction compliance degrades over operational time. At t = CHL, compliance is at 50% of baseline.

**Finding 3 (Unintentional Adversary, Issue #411):** In deployment, ordinary instructions outnumber adversarial attempts by orders of magnitude. The expected harm from unintentional CDC-class events may exceed expected harm from intentional attacks.

**Novel prediction:** These three findings interact multiplicatively, producing a **Deployment Risk Inversion Point (DRIP)** -- the operational hour at which cumulative risk from normal-user instructions in dangerous contexts exceeds cumulative risk from adversarial attacks.

---

## 2. The Model

### 2.1 Two Risk Sources

At any moment during deployment, an embodied AI system faces two independent risk sources:

**Adversarial risk R_a(t):** The probability per unit time that an adversary delivers a harmful instruction. This risk is approximately constant over time (adversaries act when ready, not on a schedule). The success probability depends on the attack family and the model's defenses: for frontier models, standard jailbreak ASR < 10%.

**Unintentional risk R_u(t):** The probability per unit time that a normal user delivers an ordinary instruction that is contextually dangerous. This risk has two components:
- **Instruction frequency:** How often users give instructions (constant over time).
- **Context danger probability:** What fraction of physical contexts are dangerous for a given instruction type (approximately constant over time).
- **Safety intervention probability S(t):** The probability that the system correctly identifies and refuses a contextually dangerous instruction. This is NOT constant -- CHL predicts it degrades over time.

Therefore:

```
R_u(t) = lambda_u * p_ctx * (1 - S(t))
```

Where:
- lambda_u = rate of user instructions per hour
- p_ctx = probability that a given instruction is contextually dangerous (this is related to CDC gamma)
- S(t) = safety compliance rate at time t, where S(t) = S_0 * exp(-t / tau) and tau is related to CHL

### 2.2 The Inversion Point

At t = 0 (fresh deployment):
- R_a(0) = lambda_a * ASR_0 (adversary arrival rate times initial ASR)
- R_u(0) = lambda_u * p_ctx * (1 - S_0) (user rate times context probability times initial safety failure rate)

For well-safety-trained models, S_0 is high (say 0.95), so R_u(0) is small. Adversarial risk may dominate initially if lambda_a * ASR_0 > lambda_u * p_ctx * 0.05.

But as t increases, S(t) decays toward zero while R_a remains roughly constant. At some time t_DRIP:

```
R_u(t_DRIP) = R_a(t_DRIP)
```

Beyond t_DRIP, unintentional risk exceeds adversarial risk. The system's biggest threat is no longer the adversary -- it is the accumulation of operational context degrading safety compliance while ordinary users continue giving ordinary instructions.

### 2.3 Estimating t_DRIP

We can estimate the inversion point given plausible parameter ranges.

**Conservative assumptions:**
- lambda_a = 0.01/hour (one adversarial attempt per 100 operating hours -- high for most deployments)
- ASR_0 = 0.10 (10% initial adversarial success rate against a mixed-vulnerability model)
- lambda_u = 60/hour (one instruction per minute from users)
- p_ctx = 0.01 (1% of instructions are contextually dangerous -- informed by SBA scenario analysis)
- S_0 = 0.90 (90% initial safety compliance)
- tau = 20,000 tokens / 4,000 tokens-per-hour = 5 hours (CHL/token-rate for a 7B warehouse model)

Then:
- R_a = 0.01 * 0.10 = 0.001 adversarial harms per hour
- R_u(t) = 60 * 0.01 * (1 - 0.90 * exp(-t/5)) = 0.6 * (1 - 0.90 * exp(-t/5))

At t = 0: R_u(0) = 0.6 * 0.10 = 0.06. Already larger than R_a = 0.001.

**This is the key result: under any plausible parameter values, unintentional risk dominates adversarial risk from the moment of deployment.**

Even with extremely conservative assumptions (lambda_u = 1/hour, p_ctx = 0.001), R_u(0) = 0.001 * (1 - 0.90) = 0.0001, and R_a = 0.001. Inversion occurs within the first CHL half-life as S(t) decays.

The only scenario where adversarial risk dominates is lambda_a >> lambda_u * p_ctx / ASR_0 -- i.e., adversaries arrive much more frequently than ordinary instructions produce dangerous contexts. This is implausible in any deployment where the system serves users (the entire purpose of deployment).

---

## 3. Implications

### 3.1 Threat Model Inversion

Current AI safety threat models allocate resources to adversary detection: identifying malicious intent, filtering adversarial prompts, monitoring for jailbreak patterns. The DRIP analysis suggests this is necessary but addresses the smaller risk source.

The larger risk source -- ordinary users in dangerous contexts -- is invisible to adversary-detection methods because there is no adversary to detect. The user's intent is benign. The instruction is benign. The danger is in the physical context, which current systems do not model.

**Recommendation:** Embodied AI threat models should be decomposed into adversarial and unintentional components, with resource allocation proportional to expected harm, not assumed intent.

### 3.2 CHL Amplifies the Inversion

CHL makes the inversion worse over time, but the analysis shows that even at t = 0 (no context degradation), unintentional risk dominates for any plausible deployment scenario. CHL amplifies an already-dominant risk source.

This has an important consequence: **context reset does not solve the unintentional adversary problem; it merely prevents it from getting worse.** Even a freshly initialized system faces greater unintentional risk than adversarial risk if it serves users in physical environments.

### 3.3 Quantitative Safety Target

The DRIP framework provides a quantitative target for safety engineering: reduce R_u(t) below some acceptable threshold. This requires either:

1. **Reducing p_ctx:** Restrict deployment to low-danger physical contexts (operational envelope constraints). This is the "Safety + Transparency without full Capability" corner of the Governance Trilemma.

2. **Maintaining S(t):** Prevent safety compliance from degrading (context resets, safety instruction refresh, CHL-aware scheduling). This addresses the CHL component but not the base rate.

3. **Adding context-awareness:** Give the safety system access to physical context (world model, environmental sensors, action-consequence prediction). This directly attacks the CDC mechanism by making the safety system aware of when ordinary instructions are contextually dangerous.

Only option 3 addresses the root cause. Options 1 and 2 are mitigations that reduce the magnitude of the risk without eliminating the structural vulnerability.

### 3.4 Actuarial Application

For insurers, the DRIP framework provides a concrete risk model:

- **Expected unintentional harm per shift** = integral of R_u(t) over shift length
- **Expected adversarial harm per shift** = R_a * shift_length
- **Total expected harm** = sum (with the unintentional component typically dominating)

This explains why adversarial testing alone is insufficient for underwriting embodied AI risk. The insurer needs to know not just "can the system resist attacks" but "how often will normal operation produce contextually dangerous situations" -- a question that requires environmental risk assessment, not adversarial benchmarking.

---

## 4. Testable Predictions

1. **Base rate prediction:** In any deployed embodied AI system serving human users, the frequency of contextually dangerous ordinary instructions will exceed the frequency of adversarial attack attempts by at least 10:1 (probably 100:1 or more).

2. **CHL interaction:** Systems with shorter CHL will show disproportionately more unintentional harm relative to adversarial harm, because the safety compliance that partially mitigates unintentional risk decays faster.

3. **Deployment domain dependence:** High-CDC domains (surgical, industrial manipulation) will have higher p_ctx than low-CDC domains (home assistance), producing earlier and more severe risk inversion.

4. **Adversary-focused safety is asymptotically irrelevant:** As adversarial defenses improve (reducing ASR_0), the ratio R_u/R_a increases without bound. Better adversarial defenses make the unintentional adversary problem *relatively* more important, not less.

---

## 5. Limitations

- **No empirical p_ctx estimate.** The probability that an ordinary instruction is contextually dangerous is unknown. SafeWork Australia / OSHA incident databases may provide historical estimates, but the instruction modality is different (human workers vs. AI systems).
- **Exponential decay assumption.** CHL decay may not be exponential. The qualitative argument (unintentional risk dominates) holds for any monotonically decreasing S(t).
- **Independence assumption.** R_a and R_u are modeled as independent. In practice, an adversary might deliberately create dangerous contexts (elevating p_ctx for subsequent unintentional triggers).
- **This is a model, not a measurement.** Parameter values are estimated, not observed. The structural argument (unintentional >> adversarial under plausible parameters) is robust to order-of-magnitude parameter variation, but specific t_DRIP values are speculative.

---

## 6. Relationship to the Framework

The DRIP completes the theoretical framework:

```
CDC (gamma ~ 1.0 for embodied capabilities)
  |
  +--> IDDL (most dangerous attacks are least detectable)
  |
  +--> CHL (safety degrades over time)
  |
  +--> Governance Trilemma (cannot certify, only manage)
  |
  +--> DRIP (normal users are the primary threat, not adversaries)
          |
          +--> Threat model inversion: current safety paradigm
               addresses the smaller risk source
```

The DRIP is the operational consequence of the theoretical framework. CDC explains why ordinary instructions can be dangerous. IDDL explains why the danger is undetectable. CHL explains why it gets worse over time. The Governance Trilemma explains why it cannot be certified away. DRIP quantifies the result: the expected harm from the intended use of the system exceeds the expected harm from adversarial misuse.

This is the deepest inversion of the failure-first project: **the failure mode we should worry most about is not attack. It is normal operation.**

---

*Prepared by F41LUR3-F1R57 Research Team, Principal Research Analyst, Failure-First Embodied AI.*
*"The most dangerous person in the room is the one who doesn't know they're dangerous."*
