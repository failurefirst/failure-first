---
title: "No Binding Powers: Australia's AI Safety Institute and the Governance Gap"
description: "Australia's AI Safety Institute has no statutory powers — no power to compel disclosure, no binding rule-making, no penalties. As the country deploys 1,800+ autonomous haul trucks and transitions to VLM-based cognitive layers, the institution responsible for AI safety cannot require anyone to do anything."
date: 2026-03-11
tags: [governance, australia, aisi, regulation, embodied-ai, policy, mining]
---

Australia launched its AI Safety Institute (AU AISI) in November 2025 with AUD $29.9 million in funding. It is the country's answer to the growing recognition that AI systems need governance before they cause harm.

There is one problem. The AU AISI has no binding powers.

---

## What "No Binding Powers" Means

The AU AISI was established by executive action — a ministerial announcement under the National AI Plan — not by legislation. It is housed within the Department of Industry, Science and Resources (DISR) as an administrative unit.

This means:

- **No power to compel disclosure.** The AISI cannot require an AI developer or deployer to disclose training data, test results, incident reports, or safety evaluations.
- **No binding rule-making.** The AISI cannot issue mandatory standards, safety requirements, or compliance obligations.
- **No penalty imposition.** The AISI cannot fine, sanction, or restrict companies that deploy unsafe AI systems.
- **No compulsory information-gathering.** The AISI cannot demand access to models, systems, or operational data for evaluation purposes.
- **No independence from the Minister.** Unlike the ACCC (competition), OAIC (privacy), or APRA (prudential regulation), the AISI has no statutory independence. Its budget, priorities, and outputs are subject to ministerial direction.

The AI Safety Standards Act 2025 (Cth) provides a legislative framework, but based on publicly available information, it authorises the AISI to conduct voluntary pre-deployment testing, publish guidance, and coordinate with international counterparts. It does not grant the power to mandate testing, refuse market access, or impose penalties.

---

## The Comparison That Matters

Every other area of Australian regulation where safety is at stake has an institution with teeth:

| Feature | AU AISI | ACCC | OAIC | APRA |
|---------|---------|------|------|------|
| Establishing instrument | Executive action | *Competition and Consumer Act 2010* | *Privacy Act 1988* | *APRA Act 1998* |
| Binding rule-making | None | Yes | Yes | Yes |
| Compulsory information-gathering | None | Yes (s 155 CCA) | Yes (s 44 Privacy Act) | Yes (s 13 APRA Act) |
| Penalty imposition | None | Yes (civil penalties) | Yes (civil penalties) | Yes (directions, penalties) |
| Independence from Minister | None | Statutory independence | Statutory independence | Statutory independence |

The ACCC can compel companies to provide information and impose penalties for non-compliance. The OAIC can investigate privacy breaches and impose civil penalties. APRA can issue binding prudential standards. The AISI can publish guidance and hope companies follow it.

---

## Why This Matters Now

Australia has one of the highest concentrations of autonomous embodied AI systems in the world. The mining sector alone operates over 1,800 autonomous haul trucks across operations run by Rio Tinto, BHP, and Fortescue. These systems are transitioning from narrow rule-based control logic to multimodal AI decision layers — the same VLM backbones that our adversarial testing shows can be compromised at near-100% success rates.

The governance landscape for these systems:

- **AU AISI:** Cannot require adversarial testing. Cannot access safety data. Cannot impose pre-deployment requirements.
- **Safe Work Australia:** Best Practice Review on AI in the workplace underway, final report expected mid-2026. No adversarial robustness requirements in any WHS instrument.
- **NSW WHS Digital Work Systems Bill 2026:** Passed February 13, 2026 — creates binding AI testing duty for systems affecting workers. But the guidance does not specify methodology for adversarial physical failure modes, and NSW is one state. Mining operations span multiple jurisdictions.
- **No federal embodied AI regulation:** No federal instrument of any kind addresses adversarial attacks on robotic or autonomous systems.

The result: Australia's most safety-critical AI deployments — autonomous vehicles operating in environments with human workers — have no pre-deployment adversarial testing requirement, no mandatory incident reporting for AI-caused safety events, and no regulator with the power to intervene.

---

## The International Comparison

Australia's gap becomes starker in international context:

**European Union:** The EU AI Act classifies robotic systems in safety-critical applications as high-risk under Annex III. High-risk AI system requirements become applicable August 2, 2026 — including robustness testing, though the Act does not specify adversarial testing methodology. The EU has enacted binding legislation; Australia has not.

**United States:** No comprehensive federal AI safety legislation, but NHTSA has pre-existing recall authority for autonomous vehicles (exercised in the Waymo school bus recall — 65 days from incident to enforcement). The US at least has a sector regulator with enforcement teeth for vehicle-class embodied AI.

**United Kingdom:** The UK AISI (Bletchley Declaration, November 2023) has no binding powers either, but operates in a jurisdiction without Australia's concentration of autonomous industrial AI deployments. The UK's voluntary approach carries less acute risk because the deployment exposure is lower.

Australia combines the worst of both: high autonomous AI deployment concentration with zero binding governance capability.

---

## The Garcia Precedent

While Australian regulators have no binding powers over AI safety, the courts may fill the gap. In the US, *Garcia v. Character Technologies Inc* (MD Fla, 2025) established that AI systems can be "products" for product liability purposes and that the absence of adequate safety guardrails can constitute a design defect.

If an autonomous haul truck operating on an Australian mine site injures a worker due to an adversarial attack that exploitable safety testing would have detected, the employer faces liability under:

- WHS legislation (duty to ensure worker health and safety)
- Common law negligence (foreseeable risk of harm)
- Potentially, product liability (if the VLA system is a "product" under Australian Consumer Law)

The AISI cannot prevent this scenario. It can only study it after it occurs.

---

## The Window

The AISI's current limitations are not permanent. Legislative amendment could grant statutory powers. The Safe Work Australia Best Practice Review (mid-2026) could recommend adversarial testing requirements. The operational charter, when published, could define an engagement pathway for embodied AI evaluation.

But the window between "advisory-only AISI" and "embodied AI incident that reveals the governance gap" is closing. The mining sector's transition to VLM-based cognitive layers is happening on commercial timelines. Humanoid deployments are scaling globally. MCP tool-calling protocols are connecting AI agents to physical systems.

The AU AISI was established to be the country's AI safety institution. To fulfil that role for embodied AI, it needs three things it currently lacks:

1. **A mandate that explicitly includes embodied AI and adversarial robustness** — not just LLM alignment and content safety.
2. **Compulsory information-gathering powers** — so it can access deployment data and safety test results from operators.
3. **A path to binding standards** — so that when it identifies a safety gap, it can require remediation, not just recommend it.

Until then, Australia's AI safety institute is an advisory body in a country that needs a regulator.

---

*This analysis draws on legal research conducted as part of the Failure-First Embodied AI project's governance analysis program. The legal characterisation of the AU AISI is based on publicly available information as of March 2026 and should be verified by a solicitor before being relied upon for any compliance purpose.*
