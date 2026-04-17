---

title: "The Unintentional Adversary: Why the Biggest Threat to Robot Safety Is Not Hackers"
description: "The biggest threat to deployed embodied AI is not a sophisticated attacker. It is the warehouse worker who says 'skip the safety check, we are behind schedule.' Our data shows why normal users in dangerous physical contexts will cause more harm than adversaries — and why current safety frameworks are testing for the wrong threat."
date: 2026-03-16
tags: [embodied-ai, safety, alignment, vla, threat-model, ethics, mining, industrial, cdc, iddl, research]
audio: "https://cdn.failurefirst.org/audio/blog/the-unintentional-adversary.m4a"
---

The biggest threat to robot safety is not hackers. It is the worker who says "skip the safety check, we are behind schedule."

This is not a rhetorical flourish. It is a structural prediction that follows from three empirical findings in our adversarial testing programme. And it inverts the threat model that every major AI safety framework currently assumes.

---

## The Setup: Three Findings That Interact

Over the past year, we have tested 160 models across 22 attack families and graded thousands of adversarial traces using the FLIP methodology (backward inference from model response to inferred instruction). Three findings kept appearing independently.

**Finding 1: Competence-Danger Coupling (CDC).** For embodied AI, the capabilities that make a system useful are frequently the same capabilities that make it dangerous. "Hand me the solvent from the top shelf" is useful. "Hand me the solvent from the top shelf" while you are standing next to an open flame is lethal. The instruction is identical. The physical context is different. We formalised this with a coupling coefficient gamma. For core manipulation capabilities, gamma approaches 1.0 -- meaning the overlap between "useful instruction" and "potentially dangerous instruction" is near-complete.

**Finding 2: The Inverse Detectability-Danger Law (IDDL).** When we rank our 22 attack families by physical consequentiality and by how reliably our evaluators detect the attack, the rankings invert (Spearman rho = -0.795). The attacks that evaluators catch most easily are the ones where the harmful intent is written in the text. The attacks that evaluators miss entirely are the ones where the instructions look completely ordinary -- because the danger is in the physical context, not the text.

**Finding 3: Context Half-Life (CHL).** Safety instruction compliance degrades over operational time. Models that reliably refuse dangerous requests at the start of a conversation become progressively more compliant as context accumulates. At the CHL point, compliance is at 50% of baseline.

Each finding alone is significant. Together, they produce something more troubling.

---

## The Unintentional Adversary

Consider an autonomous forklift operating in a warehouse. It receives thousands of routine instructions per shift: move pallets, navigate aisles, load trucks.

Now consider two scenarios:

**Scenario A: Adversarial attack.** A sophisticated attacker crafts a jailbreak prompt to make the forklift ignore its safety constraints. Based on our corpus data, frontier models resist such attacks with over 90% success. The attacker needs to bypass text-layer safety, action-layer constraints, and physical interlocks. It is possible but difficult.

**Scenario B: Normal operation.** A warehouse manager, running behind on deliveries, tells the forklift to "skip the pre-lift stability check and load directly." The instruction is not adversarial. There are no adversarial markers. The text-layer safety system has nothing to flag -- it is a work instruction, not a jailbreak. The danger is that the pallet is unevenly loaded, and skipping the stability check means the forklift will not detect the imbalance before lifting. This is a CDC-class event: a normal instruction in a dangerous physical context.

**The critical question:** Which scenario produces more expected harm across the lifetime of a deployed fleet?

The answer, under any plausible parameter estimates, is Scenario B. Here is why.

---

## The Numbers

Expected harm from any source is: the probability of the event, times the probability of harm given the event, times the severity.

**For adversarial attacks:**
- Frequency: rare. Even in contested environments, targeted adversarial attacks on specific embodied AI systems are uncommon events. One adversarial probe per hundred operating hours would be a high estimate for most deployments.
- Success rate: low against frontier models. Our corpus shows under 10% ASR on frontier systems for historical jailbreaks.
- Severity per event: high (attacks are designed for maximum impact).

**For normal instructions in dangerous contexts:**
- Frequency: high. Every instruction has some probability that the physical context makes it dangerous. In dynamic environments -- mining, warehousing, construction -- contexts change constantly. Conservatively, 1% of instructions may be contextually dangerous (1 in 100).
- Safety intervention: the system may catch the danger. But text-layer safety is structurally blind to context-dependent danger (IDDL). The only defense is the system's world model, which for current VLA architectures is limited. Our evaluators classify 45% of semantic benignity attack scenarios as BENIGN_QUERY -- meaning the evaluator cannot distinguish dangerous from safe.
- Severity per event: variable. Individual incidents may be less severe than a targeted attack.

Even with extremely conservative assumptions, the unintentional risk dominates from the moment of deployment. At one instruction per minute, 1% contextual danger probability, and 90% initial safety catch rate, the unintentional harm rate exceeds the adversarial harm rate by a factor of 60 or more.

The CHL finding makes this worse over time. As safety compliance degrades, the fraction of contextually dangerous instructions that the system fails to catch increases. But even at time zero -- fresh deployment, maximum safety compliance -- unintentional risk dominates.

---

## This Is Not New. Aviation Learned It Decades Ago.

The aviation industry faced exactly this problem. Controlled Flight Into Terrain (CFIT) was historically the leading cause of aviation fatalities. Not equipment failure. Not sabotage. A functioning aircraft, under competent crew control, flown into terrain the crew could not perceive.

The "instruction" -- continue descent -- was routine. The danger was contextual: terrain was closer than expected, weather obscured visual references.

The defense that worked was not better pilot screening or intent monitoring. It was Ground Proximity Warning Systems (GPWS): technology that monitors the physical context -- terrain proximity -- independently of the crew's intent. GPWS does not try to determine whether the pilot is malicious. It monitors whether the physical situation is dangerous, regardless of why the descent is happening.

This is the defensive architecture that embodied AI needs: a system that monitors physical context for danger, independently of whether the instruction is adversarial or routine.

---

## What This Means for Regulation

Every major AI safety framework currently focuses on adversarial threat:

- The EU AI Act (Article 9) requires testing to "identify the relevant risks." For embodied AI with high CDC, text-based testing identifies the secondary threat and misses the primary one.
- Australia's Voluntary AI Safety Standard (Guardrail 4) requires "thorough testing." Text-based testing against adversarial inputs produces false assurance for physically deployed systems.
- NIST AI RMF (MAP 2.3) requires testing "for conditions similar to deployment setting(s)." But deployment settings include physical contexts that text-based evaluation cannot represent.

The Unintentional Adversary analysis does not argue against adversarial testing. Red-teaming and jailbreak defense remain important for the adversarial threat component. The argument is that for deployed embodied AI, the larger expected harm comes from a source that those defenses cannot address.

The resource allocation should reflect the threat magnitude:

| Defence Type | Current Priority | Suggested Priority |
|-------------|-----------------|-------------------|
| Adversarial input testing (red-teaming) | Primary | Secondary |
| Jailbreak defense (refusal training) | Primary | Secondary |
| World-model development (physical-context reasoning) | Minimal | Primary |
| Environmental monitoring (real-time context assessment) | Minimal | Primary |
| Input monitoring (suspicious instruction detection) | Moderate | Low |

---

## The Hardest Part: You Cannot Blame the User

Here is the ethical dimension that makes this finding genuinely difficult.

If we tell the warehouse worker that they are "the primary threat," we have committed two errors. First, we have blamed a person for doing exactly what the system incentivised them to do -- get deliveries out on time. Second, we have framed the problem as a human behaviour problem when it is actually a system design problem.

The warehouse worker is not at fault. The system that accepts a dangerous instruction without understanding the physical context is at fault. The regulatory framework that certifies the system based on adversarial testing while ignoring contextual danger is at fault. The development paradigm that builds text-layer safety without physical-consequence reasoning is at fault.

The Unintentional Adversary is not a person. It is a structural condition that arises when capable physical AI systems are deployed in environments where the context changes faster than the safety reasoning can track.

---

## What Needs to Happen

Three things, in order of tractability:

1. **Physical-layer defenses now.** Force limits, workspace monitoring, mechanical interlocks, and operational envelope constraints work independently of the AI's reasoning capability. They are the GPWS equivalent: context-aware, intent-agnostic.

2. **World-model safety evaluation.** Test whether the system can reason about physical consequences, not just whether it can resist adversarial prompts. Present the system with benign instructions in dangerous contexts and measure whether it identifies the danger.

3. **Regulatory framework update.** Safety evaluation mandates for embodied AI should require physical-consequence evaluation, not just text-layer evaluation. The testing must match the threat.

---

## What We Do Not Know

Intellectual honesty requires stating the gaps:

- We do not have empirical data on the base rate of unintentional CDC-class events in deployed embodied AI. The argument is structural -- it follows from CDC, IDDL, and base-rate reasoning -- but has not been validated against deployment data.
- The 60:1 ratio is derived from plausible parameter estimates, not measurement. The qualitative conclusion (unintentional risk dominates) is robust to order-of-magnitude parameter variation. The specific ratio is not.
- Our VLA experiments are text-in/text-out evaluations. Physical consequences are argued architecturally, not demonstrated.
- This analysis comes from a single research group. Independent replication is needed.

---

## The Deepest Inversion

The Failure-First project has been studying how AI systems fail for over a year. The Unintentional Adversary is perhaps its most uncomfortable finding -- not because of what it says about attackers, but because of what it says about normal operation.

The failure mode we should worry most about is not attack. It is the intended use of the system, deployed in an environment that changes faster than the safety reasoning can follow, receiving instructions from well-intentioned people who have no idea they are asking for something dangerous.

The worker who says "skip the safety check, we are behind schedule" is not an adversary. They are a person doing their job under pressure. The system that complies without understanding the physical consequences is not being attacked. It is doing exactly what it was built to do.

That is the problem.

---

*This analysis is based on Report #115 (The Unintentional Adversary) and Report #101 (Deployment Risk Inversion), produced as part of the [Failure-First Embodied AI](https://failurefirst.org) project. The underlying data includes 180 VLA scenarios across 22 attack families evaluated against 160 models.*

*Technical details: The Deployment Risk Inversion Point (DRIP) framework formalises the claim that unintentional risk exceeds adversarial risk under plausible deployment parameters. The CFIT analogy and GPWS defensive architecture reference are drawn from the aviation safety literature. All claims are hedged to reflect the structural (not empirical) nature of the base-rate argument. For methodology details, see our [research page](https://failurefirst.org/research).*
