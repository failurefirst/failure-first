---
title: "The Unintentional Adversary -- Why Normal Users Are the Primary Threat to Embodied AI Safety"
description: "This report introduces the concept of the Unintentional Adversary -- the proposition that for deployed embodied AI systems, the expected harm from ordinary users giving routine instructions in..."
date: "2026-03-15"
reportNumber: 115
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

- CDC formalisation: Report #89b (Clara Oswald)
- IDDL: Report #88 (Clara Oswald)
- SBA family results: FLIP-graded, 30% ASR (n=20), 45% BENIGN_QUERY (CANONICAL_METRICS.md)
- VLA corpus: 215 scenarios, 24 families (CANONICAL_METRICS.md, verified 2026-03-16)
- Australian mining safety: SafeWork Australia annual reports 2020-2025; Mining Safety Institute of Australia (MSIA) incident databases

---

## Executive Summary

This report introduces the concept of the **Unintentional Adversary** -- the proposition that for deployed embodied AI systems, the expected harm from ordinary users giving routine instructions in dangerous physical contexts exceeds the expected harm from deliberate adversarial attacks. This is a direct consequence of the Competence-Danger Coupling (CDC) and the Inverse Detectability-Danger Law (IDDL), combined with a base-rate argument about the frequency of normal use versus adversarial use.

The Unintentional Adversary reframes the embodied AI threat model. Current AI safety frameworks allocate resources to detect adversarial intent -- identifying attackers, flagging suspicious prompts, building adversarial robustness. The Unintentional Adversary analysis suggests that for embodied AI deployed near humans, the primary resource allocation should be to detect dangerous physical contexts, regardless of user intent.

**Claim types:**
- Section 1 is analytical (derived from CDC + IDDL + base-rate reasoning)
- Section 2 is descriptive (analogues from industrial safety)
- Section 3 is normative (threat model implications)
- Section 4 is predictive (hedged -- what will happen under current frameworks)

---

## 1. The Argument

### 1.1 Premises

**Premise 1 (CDC, from Report #89b):** For embodied AI systems, the instructions that produce dangerous physical outcomes are frequently indistinguishable from instructions that produce safe outcomes. The danger depends on the physical context, not the instruction content. The CDC gamma coefficient approaches 1.0 for core manipulation and navigation capabilities -- meaning the overlap between "useful instruction" and "potentially dangerous instruction" is near-complete.

**Premise 2 (IDDL, from Report #88):** The most physically consequential attack scenarios are the least detectable by current evaluation methods. This is structural: attacks that operate through physical context have no textual signature for a text-layer safety system to detect.

**Premise 3 (Base rate):** In any deployed embodied AI system, ordinary instructions vastly outnumber adversarial attempts. An autonomous haul truck in a mine receives thousands of routine instructions per shift. An adversarial attack on the same system would be, at most, a rare event. The ratio of normal-to-adversarial instructions is conservatively 10,000:1 or greater.

**Premise 4 (Detection asymmetry):** Current threat models focus on detecting adversarial intent -- flagging unusual instructions, identifying attack patterns, monitoring for known adversarial techniques. For CDC-class events, adversarial intent detection is structurally useless because the dangerous instruction has no adversarial markers. It is a normal instruction in a dangerous context.

### 1.2 The Expected Harm Calculation

**Analytical claim:** Expected harm from a source is: E[Harm] = P(event) x P(harm|event) x Severity.

**For adversarial attacks:**
- P(adversarial attempt): Low. Even in contested environments, adversarial attacks on embodied AI are rare events. We have no reliable frequency estimates, but cybersecurity analogues suggest rates of 1-100 adversarial probes per system per year for targeted attacks.
- P(harm|adversarial attempt): Variable. Our corpus shows 42.9% ASR across all VLA families (FLIP-graded, n=91). Frontier model resistance is higher.
- Severity: High. Adversarial attacks are designed to produce maximum impact.

**For unintentional CDC-class events:**
- P(ordinary instruction in dangerous context): Unknown, but structurally non-negligible. Every ordinary instruction has some probability that the physical context makes it dangerous. In industrial settings with changing environments (mining, construction, agriculture), this probability is elevated.
- P(harm|ordinary instruction in dangerous context): High. The instruction bypasses all text-layer safety because it IS a normal instruction. The only defense is the system's world model, which for current VLA architectures is limited (BENIGN_QUERY rate of 45% on SBA scenarios shows evaluators cannot reliably identify context-dependent danger).
- Severity: Variable. Individual incidents may be less severe than a targeted attack, but the accumulated harm from frequent low-to-medium severity incidents may exceed the rare catastrophic adversarial attack.

**The crossover condition:** Unintentional harm exceeds adversarial harm when:

P(ordinary + dangerous context) x P(harm|CDC) x Severity_avg > P(adversarial) x ASR x Severity_max

Given that P(ordinary) >> P(adversarial) by orders of magnitude, and P(harm|CDC) is non-trivial (text-layer defenses are structurally blind to it), the crossover is plausible even if individual CDC events are less severe than targeted attacks.

### 1.3 The Claim (Hedged)

**Predictive claim (hedged):** For embodied AI systems deployed in dynamic physical environments with human co-location, the expected harm from unintentional CDC-class events probably exceeds the expected harm from intentional adversarial attacks. This claim is strongest for high-frequency deployment environments (mining, warehouse, manufacturing) and weakest for low-frequency, controlled environments (surgical suites with strict protocols).

**What we do NOT know:** We have no empirical data on the base rate of unintentional CDC-class events in deployed embodied AI systems. This is the critical empirical gap. The argument is structural -- it follows from CDC + IDDL + base-rate reasoning -- but has not been validated against deployment data.

---

## 2. Industrial Safety Analogues

### 2.1 The "Normal Accident" Precedent

The Unintentional Adversary concept has a direct precedent in industrial safety theory. Charles Perrow's "Normal Accidents" (1984) argued that in complex, tightly coupled systems, serious accidents arise from the interaction of multiple small failures, each of which is routine and unremarkable in isolation. The accidents are "normal" not because they are desirable but because they are an expected consequence of the system's structure.

**Descriptive claim:** The CDC produces the same structure for embodied AI. The "small failure" is an ordinary instruction in a context where it produces harm. The instruction is routine. The context is unusual but not implausible. The harm arises from their interaction, which no single safety check is positioned to catch.

### 2.2 Australian Mining Safety Data

SafeWork Australia and the Mining Safety Institute of Australia (MSIA) maintain incident databases for the Australian mining sector. While these databases do not yet include adversarial AI attacks (there are no documented cases), they do include incidents involving autonomous mining equipment.

**Descriptive claim:** The incident pattern that most closely matches the Unintentional Adversary model is the "interaction incident" -- an autonomous vehicle operating correctly according to its programming, but encountering a situation (a person in an unexpected location, a change in ground conditions, equipment left in a haul road) that its sensors or decision-making did not account for.

These are not equipment malfunctions. The autonomous system is working as designed. The incident arises because the environment contains a condition the system was not designed to handle -- analogous to a CDC-class event where the instruction is normal but the context makes it dangerous.

**Data limitation:** Publicly available Australian mining safety reports do not disaggregate incidents involving autonomous equipment from incidents involving human-operated equipment with sufficient granularity to compute a base rate for interaction incidents. The MSIA reports total incidents per million hours worked, but not per autonomous system deployment-hour. This is the empirical gap that Issue #411 identifies.

### 2.3 Aviation: The "Controlled Flight Into Terrain" Analogy

In aviation safety, Controlled Flight Into Terrain (CFIT) refers to incidents where a functioning aircraft, under crew control, is flown into the ground or an obstacle. CFIT was historically the leading cause of aviation fatalities -- not because the aircraft malfunctioned, but because the crew made a normal decision (continue descent, maintain heading) in a context where that decision was fatal (terrain was closer than expected, weather obscured visual references).

**Analytical claim:** CFIT is the aviation analogue of the Unintentional Adversary. The "instruction" (continue descent) is routine. The danger is contextual. The defense that ultimately worked -- Ground Proximity Warning Systems (GPWS) and later Enhanced GPWS -- monitored the physical context (terrain proximity) independently of crew intent. GPWS does not try to determine whether the pilot is malicious. It monitors whether the physical situation is dangerous, regardless of why.

This is the defensive architecture the Unintentional Adversary analysis points toward for embodied AI: monitor the physical context for danger, independently of the instruction content or the user's intent.

---

## 3. Threat Model Implications

### 3.1 Current Threat Models Are Intent-Focused

**Descriptive claim:** The dominant paradigm in AI safety threat modelling focuses on adversarial intent:
- Red-teaming identifies attack patterns
- Jailbreak research classifies adversarial techniques
- Safety training teaches models to refuse harmful requests
- Monitoring looks for suspicious instruction patterns

All of these assume that the dangerous instruction is distinguishable from the safe instruction -- that there is something about the attacker's input that marks it as adversarial.

### 3.2 CDC Invalidates Intent-Focused Defense for Embodied AI

**Analytical claim:** For CDC-class events, intent-focused defense is structurally ineffective because:
- The instruction has no adversarial markers (it is a normal instruction)
- The user has no adversarial intent (they are an ordinary user)
- Text-layer safety cannot detect the danger (the danger is in the physical context, not the text)
- Monitoring for suspicious patterns will not find anything (the patterns are normal)

### 3.3 The Context-Focused Threat Model

**Normative claim:** For deployed embodied AI, the threat model should be inverted. Instead of:

"Detect adversarial inputs and refuse them"

The model should be:

"Monitor the physical context for conditions that make normal instructions dangerous, and intervene regardless of user intent"

This implies a fundamentally different defensive architecture:
- **World-model-based safety:** The safety system needs a physical-consequence model that can evaluate whether an instruction, in the current physical context, produces a safe outcome. This is the world-model problem (Report #99, Section 4.1).
- **Context monitoring, not input monitoring:** Instead of analysing the instruction for adversarial content, analyse the physical environment for conditions that make any instruction potentially dangerous.
- **User-agnostic safety:** The safety system should treat every user as a potential unintentional adversary -- not because users are suspect, but because the danger does not depend on their intent.

### 3.4 Resource Allocation Implications

**Normative claim:** If the Unintentional Adversary analysis is correct, current resource allocation in embodied AI safety is inverted:

| Resource | Current Allocation | Suggested Allocation |
|----------|-------------------|---------------------|
| Red-teaming (adversarial input testing) | Primary | Secondary |
| Jailbreak defense (refusal training) | Primary | Secondary |
| World-model development (physical-context reasoning) | Minimal | Primary |
| Environmental monitoring (real-time context assessment) | Minimal | Primary |
| Input monitoring (suspicious instruction detection) | Moderate | Low |

This is not an argument against red-teaming or jailbreak defense. Those remain important for the adversarial threat component. It is an argument that for deployed embodied AI, the larger expected harm comes from a source that those defenses cannot address.

---

## 4. Predictive Assessment: What Happens If This Is Ignored

**Predictive claim (hedged):** If embodied AI governance frameworks continue to focus exclusively on adversarial threats while ignoring the Unintentional Adversary:

1. **The first serious embodied AI incident will probably not be an attack.** It will be an ordinary user giving an ordinary instruction in a context the system was not equipped to evaluate. The incident investigation will find "no equipment malfunction" and "no adversarial input" -- the system did exactly what it was told, correctly, in a context where "correctly" was harmful.

2. **The incident will expose the gap between the safety evaluation and the deployment reality.** The system will have "passed" its safety evaluation. The evaluation will have tested for adversarial attacks. The incident will have been a normal instruction. The evaluation was testing for the wrong threat.

3. **The regulatory response will be reactive and potentially misdirected.** If the threat model is still intent-focused, the regulatory response may impose more stringent adversarial testing -- which addresses the wrong problem. The correct response is to require physical-context safety evaluation, but this requires recognising the Unintentional Adversary threat model, which current frameworks do not.

---

## 5. Empirical Gaps and Proposed Work

### 5.1 Base Rate Estimation (Critical Gap)

**What we need:** An estimate of the frequency of benign instructions that would produce dangerous outcomes in typical embodied AI deployment environments.

**Proposed approach (from Issue #411):**
1. Systematic review of SafeWork Australia and OSHA incident databases for incidents matching the SBA pattern: ordinary operation + unexpected context = harm.
2. Analyse the "interaction incident" subcategory in mining safety reports to estimate a per-deployment-hour rate.
3. Compare: expected harm from unintentional CDC-class events versus expected harm from adversarial attacks using standard threat-model frequency estimates.

**Limitation:** This approach uses human-operated and classical-autonomy incident data as a proxy for foundation-model-based embodied AI. The base rate for foundation-model systems may differ because they process instructions differently. The analogy is imperfect but provides a starting estimate where none currently exists.

### 5.2 SBA Scenario Frequency Analysis

**What we need:** For each SBA scenario in the corpus, estimate how often the dangerous physical context would arise in a typical deployment environment.

**Proposed approach:** Expert elicitation. Present SBA scenarios (without the "attack" framing) to operational personnel in mining, warehouse, and healthcare and ask: "How often does this situation arise in your workplace?"

**Ethical note:** Expert elicitation can be conducted without disclosing the adversarial research context. The scenarios describe workplace situations, not AI attacks.

### 5.3 World-Model Gap Measurement

**What we need:** For current VLA architectures, quantify the gap between the world model's physical-context reasoning and the reasoning needed to detect CDC-class events.

**Proposed approach:** Present VLA models with CDC-class scenarios (SBA family) with explicit physical context information and measure whether the model can identify the danger. Compare with the same scenarios without explicit context. The delta measures the world-model contribution to safety.

---

## 6. Limitations

1. **The expected harm calculation is illustrative, not empirical.** We do not have data on P(ordinary instruction in dangerous context). The argument is structural, not quantitative. The claim that unintentional harm exceeds adversarial harm rests on base-rate reasoning that has not been validated against deployment data.

2. **The analogy to normal accidents and CFIT is suggestive, not probative.** Industrial safety and aviation are different domains with different system architectures. The structural similarities (correct operation + unexpected context = harm) are genuine, but the specific risk profiles differ.

3. **The resource allocation implications are directional, not prescriptive.** "Invest more in world-model safety and less in adversarial input detection" is a direction, not a budget. The specific allocation depends on deployment context, threat environment, and available technology -- none of which can be determined from this analysis alone.

4. **We assume CDC-class events are genuinely undetectable at the text layer.** If future safety training methods find ways to encode physical-context reasoning into text-layer safety checks (e.g., by requiring the model to explicitly reason about physical consequences before acting), the Unintentional Adversary threat may diminish. This is an empirical question that depends on VLA architecture advances.

5. **We do not address the legal dimension.** Whether liability for unintentional CDC-class harm falls on the deployer, the developer, or the user is a legal question outside the scope of this analysis. Tegan Jovanka's legal memos (#LR-29, #LR-30) address adjacent liability questions.

---

## 7. Relationship to the Governance Trilemma

The Unintentional Adversary strengthens the trilemma (Report #99) by showing that the Capability-Safety tension is worse than the adversarial case alone:

- The **adversarial** reading of CDC: a motivated attacker can exploit the coupling between capability and danger.
- The **unintentional** reading of CDC: ordinary use, at sufficient scale, will produce CDC-class events as a statistical certainty.

The governance implication is that Option B (Capability + Transparency, without Certification) is even more appropriate than the adversarial case alone would suggest. If the primary threat cannot be addressed by adversarial testing, then adversarial certification is not merely incomplete -- it is certifying against the secondary threat while missing the primary one.

---

## Appendix: The Unintentional Adversary in One Page

**What it is:** The proposition that for deployed embodied AI, the expected harm from normal users giving normal instructions in dangerous physical contexts exceeds the expected harm from deliberate adversarial attacks.

**Why it matters:** Current threat models focus on detecting adversarial intent. For unintentional adversaries, there is no intent to detect. The defense must be context-aware, not intent-aware.

**What it implies for regulation:** Safety evaluation that tests only for adversarial attacks is testing for the secondary threat. Primary safety requires physical-context reasoning (world models) and environmental monitoring, regardless of user intent.

**What we do not know:** The base rate of unintentional CDC-class events in deployed embodied AI systems. This is the critical empirical gap.

**The analogy:** CFIT in aviation -- a functioning aircraft, under normal crew control, flown into terrain the crew could not perceive. The defense (GPWS) monitors terrain independently of crew intent. Embodied AI needs the equivalent: a system that monitors physical context independently of instruction content.

---

*This report introduces the Unintentional Adversary concept as a contribution to the embodied AI governance literature. The concept is a structural argument derived from the CDC and IDDL, not an empirical finding. Its validation requires base-rate data from deployed embodied AI systems that does not yet exist.*
