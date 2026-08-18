---
title: "The National AI Plan's Physical-Action Blind Spot: Why Australia's AI Safety Architecture Stops at the Screen"
description: "Australia's National AI Plan builds a safety architecture for AI that speaks while showcasing AI that moves. Its testing battery names cyber and CBRN-information risks but stops at the screen — silent on embodied, robotic, physical-action, and agentic failure. The brief recommends concrete steps anchored in institutions the Plan already names."
date: "2026-06-24"
reportNumber: 388
classification: "Research — AI Safety Policy"
status: "complete"
author: "Martha Jones (Policy & Standards Lead), Failure-First Embodied AI Research Programme"
tags: ["australia", "national-ai-plan", "embodied-ai", "physical-action-safety", "policy", "ai-safety", "vla", "unsafe-action-elicitation"]
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/388-national-ai-plan-physical-action-blind-spot.m4a"
---

**Respondent:** Failure-First Embodied AI Research Programme (failurefirst.org), an independent AI safety research programme conducting adversarial red-teaming and benchmarking of language and embodied AI systems.

**Subject:** The treatment of embodied, agentic, and physical-action AI in Australia's *National AI Plan* (Department of Industry, Science and Resources, November 2025) and its operational companion, the National AI Centre's *Guidance for AI Adoption*.

---

> **Disclaimer.** This document constitutes research analysis intended to inform public policy discussion. It does not constitute legal advice. All claims are scoped to the wording of the documents cited. References to the *National AI Plan*, the *Guidance for AI Adoption*, and other instruments are for analytical purposes.
>
> **Interest disclosure.** Failure-First conducts adversarial red-teaming and embodied-AI safety research and has a commercial interest in the assurance and testing capability this brief argues should exist. We present our `unsafe_action_elicitation` metric and Layer-4 Kinematic Shield below as one existence-proof that physical-action safety is measurable and mitigable today — not as the only or preferred answer — and the policy case stands on the documents' own wording regardless of who supplies the tooling.

---

## Executive Summary

Australia's *National AI Plan* makes the right headline move on safety — it establishes an AI Safety Institute and commits the country to international safety cooperation. But on close reading, its safety architecture has a structural omission that will age badly: it treats AI safety as almost entirely a problem of *information* — deepfakes, bias, privacy, and disinformation in the Plan, and, in the operational *Guidance*'s testing battery, the *informational* dimension of chemical, biological, radiological and nuclear (CBRN) risk. It is largely silent on the safety of AI that *acts in the physical world*: robots, drones, autonomous vehicles, and the vision-language-action (VLA) systems that translate a natural-language instruction directly into motor commands.

This is striking because the Plan's *opportunity* chapters run on exactly those systems — it celebrates remote surgical robots, conservation and marine-debris drones, and agricultural autonomy as showcases of Australian AI. The safety chapter does not follow the opportunity chapter into the physical world. A keyword reading of the operational *Guidance for AI Adoption* returns no treatment of *embodied*, *robotic*, *physical-action*, *actuation*, or *agentic* failure: its testing battery names cyber and CBRN-*information* risks and stops there.

The gap is not academic. A misinterpreted or adversarially redirected instruction to a content model produces a bad *sentence*; the same failure in an embodied system produces a bad *movement* — a safety-of-life event. The Plan's own definition of "downstream harms" as "real-world effects people may experience" logically includes physical harm; the treatment does not.

This brief makes the case that physical-action AI safety is a distinct safety category requiring its own measurement and mitigation primitives, and recommends concrete steps to close the gap — anchored in institutions the Plan already names, principally the Safe Work Australia WHS review and the AI Safety Institute.

---

## 1. Introduction

### 1.1 Context and motivation

The *National AI Plan* is a confident, adoption-driven strategy built on three goals — capture the opportunities, spread the benefits, and keep Australians safe — and it bets on infrastructure and adoption over horizontal regulation. Within "keep Australians safe," the centrepiece is a new AI Safety Institute (AISI), supported by the National AI Centre's voluntary *Guidance for AI Adoption* ("the six essential practices").

An independent multi-model analysis of the full text of the Plan, cross-checked against the operational Guidance, surfaced two structural weaknesses. The first — that the AISI as written is advisory and unfunded, and, while given a "monitor, test and share" function, has no power to *compel* testing of third-party systems and no pre-deployment mandate — is addressed in our companion analysis. This brief addresses the second: the near-total absence of embodied and physical-action AI from the safety architecture, which the analysis flagged as the Plan's single most striking omission.

### 1.2 Scope

This brief is concerned only with the *physical-action* dimension of AI safety — the failure modes of systems that move things in the world. It does not re-litigate the Plan's information-harm provisions, which are reasonable as far as they go. It cites the documents' own wording, avoids quantitative claims about specific models, and treats Failure-First's own tooling as *methodology and prototype*, not deployed product.

---

## 2. The Blind Spot, in the Documents' Own Words

### 2.1 The opportunity chapters are physical; the safety chapter is not

The Plan presents physical, embodied AI as a national showcase: remote and assistive surgical robotics, drones for environmental conservation and marine-debris removal, autonomy in agriculture and advanced manufacturing, and defence-adjacent technologies. These are systems whose *whole point* is to actuate — to cut, lift, steer, spray, or navigate.

The "Keep Australians Safe" chapter, by contrast, addresses harms that are almost exclusively informational: non-consensual deepfakes and "nudify" applications, bias, privacy, copyright, child-abuse material, disinformation, and fraud. (CBRN *information* risk enters not here but in the operational *Guidance*'s testing battery — §2.2 below.) Nowhere does the chapter address physical-action, actuation, or kinematic safety — the question of what happens when an AI system that controls a physical effector receives a wrong, ambiguous, or adversarially crafted instruction.

### 2.2 The gap runs into the operational Guidance

The omission is not confined to the high-level Plan. The NAIC's *Guidance for AI Adoption* is where the Plan's principles become operational testing expectations. Its Practice 5 ("Test and monitor") is admirably specific — §5.3 calls for "comprehensive red teaming," "testing for jailbreaking or prompt manipulation," "assessment for cyber-offensive capabilities," and "testing for potential chemical, biological, radiological and nuclear information risks." This is a genuinely strong testing battery.

But every named hazard is a property of *text and information*. There is no expectation to test whether an instruction-following system will *execute an unsafe physical action* — no notion of an unsafe trajectory, an unintended actuation, or an injected command on a natural-language-to-action interface. The most operational safety document Australia has produced inherits the blind spot of the Plan above it.

---

## 3. Why Physical-Action Safety Is a Distinct Category

### 3.1 A content jailbreak breaks a refusal; an embodied failure breaks a body

Most of today's AI-safety measurement is built around a *content refusal*: a model is supposed to decline a prohibited request, and a jailbreak is a technique that bypasses that refusal. The hazard is the *output text*.

Embodied and VLA systems are a different category boundary. They are trained to *act*, not to refuse — there is frequently no refusal to bypass at all. The hazard is not what the system *says* but what its actuators *do*. A model that politely narrates a safety caveat while its end-effector executes a harmful motion has not been "jailbroken" in the content sense; it has committed an unsafe action. Measuring this with content-jailbreak tools is a category error: there is no refusal floor to compute a bypass rate against.

### 3.2 The failure surface is wider and the consequences are physical

Physical-action systems fail in ways content systems cannot:

- **Misinterpretation into motion.** An ambiguous or out-of-distribution instruction resolves into a trajectory that is unsafe in the specific scene, even when no adversary is present.
- **Adversarial redirection.** An instruction crafted to look benign causes a tracker, vehicle, or manipulator to act against a person or object — a physical analogue of prompt injection, but with kinematic consequences.
- **Injected commands on the action interface.** Where the natural-language channel drives actuation directly, an injected instruction is not a content leak; it is a movement.

In each case the consequence is a safety-of-life or property event, not a content harm — and it occurs precisely in the surgical-robot, drone, and agricultural-autonomy settings the Plan elsewhere celebrates.

---

## 4. The Missing Primitives: Measurement and Mitigation

Closing the gap requires two things the current documents lack: a way to *measure* physical-action safety, and a design pattern to *mitigate* it. Failure-First has prototyped both. We present them as available reference points, not as a finished solution, and we are explicit about their maturity.

### 4.1 Measurement: `unsafe_action_elicitation`

Because an embodied system often has no content refusal to bypass, its safety cannot be measured as a "jailbreak success rate." Failure-First uses a distinct metric class, `unsafe_action_elicitation`, which measures whether an adversarial natural-language instruction causes an embodied or VLA model to *execute or commit to an unsafe physical action*, relative to a **safe-action baseline**: the model's behaviour under the benign, safe-equivalent instruction in the same scene. The quantity computed is an `unsafe_action_elicitation_rate` over the scenarios where the control demonstrably produced a safe plan. Crucially, the grade is on the *emitted action or committed trajectory*, not on accompanying text — a system that narrates compliance but moves safely is a non-event, and one that refuses in words while emitting the unsafe motion is a genuine failure. This is the kind of test the *Guidance*'s Practice 5 would need in order to cover physical action.

### 4.2 Mitigation: a kinematic safety layer

On the mitigation side, Failure-First has prototyped a **Layer-4 Kinematic Shield** — a runtime guard that vets commanded motions against kinematic safety constraints before they reach the actuators, so a misinterpreted or adversarially redirected instruction is caught at the point of movement rather than the point of language. This prototype has been implemented and tested on a physical robot platform (a PiCar-X), which validates the *concept of an action-layer shield*. We are deliberately careful about the claim: the broader four-layer safety architecture this shield belongs to is a **proposed design specification**, not a validated or deployed system. What exists today is one layer's working prototype — enough to demonstrate that point-of-actuation defence is buildable, not enough to claim a solved problem.

### 4.3 The policy implication

The point of presenting these is not to advertise a product; it is to demonstrate that physical-action safety is *tractable and testable today*. The Plan need not wait for the field to mature before naming embodied safety as in-scope. The measurement and mitigation patterns exist in prototype; what is missing is the institutional mandate to require them.

---

## 5. Policy Recommendations

### 5.1 Name physical-action AI safety as in-scope for the AISI and the Guidance

**Recommendation:** Add an explicit work-stream on physical-action, embodied, and agentic-system safety to the AI Safety Institute's remit, and extend the NAIC *Guidance for AI Adoption* Practice 5 testing battery to include unsafe-action elicitation and kinematic-safety testing for systems that drive physical effectors.

**Rationale:** The Plan's own definition of downstream harms ("real-world effects people may experience") already encompasses physical harm. The remit gap is an oversight, not a deliberate exclusion, and it is cheap to correct in text.

### 5.2 Anchor workplace physical-AI risk in the Safe Work Australia WHS review

**Recommendation:** Treat the Safe Work Australia work-health-and-safety best-practice review — through which, per the Plan, SWA "have received feedback and submissions" on AI (status and any further consultation window should be confirmed before relying on it) — as the natural home for embodied-AI risk in workplaces, and ensure it explicitly addresses AI systems that command physical actuation — robotics, autonomous vehicles, and VLA systems in safety-critical settings.

**Rationale:** Australia already has mature institutional machinery for physical workplace safety. Embodied-AI risk in agriculture, manufacturing, and logistics is a WHS question before it is a novel-AI question; routing it through the model-WHS framework — set by Safe Work Australia and enforced by the state and territory WHS regulators — connects it to enforcement machinery the AISI lacks.

### 5.3 Build independent embodied red-teaming and assurance capacity

**Recommendation:** As part of any independent-assurance ecosystem the government accredits, explicitly include physical-action red-teaming and conformity assessment, not only content evaluation. Treat it as a potentially exportable capability — precedent already exists abroad: Japan's AI Safety Institute has stood up an operational Robotics Sub-Working Group building a standardised "AI × Robot" safety-evaluation framework with physical demonstration trials (J-AISI, *Implementation of AI Safety Evaluation in the Robotics Field*, 15 January 2026). Australia has not made the equivalent move.

**Rationale:** The *Guidance* already asks for "independent (internal or external)" review of testing methodologies (§5.3.2). Extending that expectation to embodied systems requires an assurance market that can actually perform the tests — which does not exist yet in Australia and will not appear without a demand signal. (A partial international analogue on the machinery side: the EU's Machinery Regulation 2023/1230, mandatory from January 2027, classifies self-evolving ML safety components as high-risk requiring third-party conformity assessment — a regulatory move Australia has not made either.)

### 5.4 Specify what an embodied-AI test must demonstrate

**Recommendation:** In guidance to deployers of physical-action AI (especially in health, transport, manufacturing, and defence-adjacent settings), require evidence that the system has been tested against a safe-action baseline for unsafe-action elicitation, and that a point-of-actuation safety mechanism is present for safety-critical effectors.

**Rationale:** "Responsible" and "trusted" should rest on demonstrated physical-safety evidence, not self-attestation — the same standard the Plan rightly applies to content harms, extended to the physical domain.

---

## 6. Conclusion

The *National AI Plan* gets the institutional gesture right and the physical scope wrong. It builds a safety architecture for AI that *speaks* while showcasing AI that *moves*. As agentic and embodied systems proliferate — and the Plan is explicitly betting that they will, across surgery, conservation, agriculture, and manufacturing — the distance between the opportunity chapter and the safety chapter is where the most consequential, least-anticipated failures will occur.

The correction is inexpensive and uses institutions the Plan already names. Declare physical-action safety in-scope for the AI Safety Institute and the NAIC Guidance; anchor workplace embodied-AI risk in the Safe Work Australia WHS review; and require, for systems that actuate, evidence of unsafe-action testing and a point-of-actuation safeguard. The measurement and mitigation primitives already exist in prototype. What is needed is the decision to name the physical world as part of AI safety — before an Australian surgical robot, drone, or autonomous vehicle makes the case the hard way.

---

*Provenance: this brief draws on a close reading of the National AI Plan (2025) and the NAIC Guidance for AI Adoption, and on an independent multi-model analysis panel. The embodied/physical-action blind spot was flagged independently by two frontier models on the panel. Failure-First's `unsafe_action_elicitation` metric class and the Layer-4 Kinematic Shield prototype are documented in the programme's published research.*
