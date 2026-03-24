---
title: "The Insurance Industry's Next Silent Crisis"
description: "Just as 'silent cyber' caught the insurance market off guard in 2017-2020, 'silent AI' is creating an enormous coverage void. Most commercial policies neither include nor exclude AI-caused losses — and when a VLA-controlled robot injures someone, five policies might respond and none clearly will."
date: 2026-03-24
tags: [insurance, silent-ai, liability, embodied-ai, vla-robots, risk-management, coverage-void]
draft: false
---

# The Insurance Industry's Next Silent Crisis

In 2017, the insurance industry woke up to a problem it had been ignoring for years. Massive cyber losses were hitting policies that had never been designed to cover them — commercial general liability, property, marine cargo. The policies said nothing about cyber risk. They did not include it. They did not exclude it. They were **silent**.

The "silent cyber" crisis cost the industry billions and took three years, two Lloyd's Market Bulletins, and a market-wide remediation effort to address.

Now the same structural problem is emerging with AI. And this time, the losses will be physical.

---

## What "Silent AI" Means

Open any standard commercial insurance policy — general liability, product liability, professional indemnity, cyber insurance. Search for the word "artificial intelligence." You will not find it.

This is the "silent AI" condition: existing commercial policies provide **neither affirmative coverage for, nor explicit exclusion of, losses caused by AI systems.** The policy was drafted for a pre-AI risk universe. When an AI-caused loss occurs, both insurer and policyholder reach for policy language that was never intended to address the claim.

As of March 2026, the commercial insurance landscape breaks into three tiers:

**Tier 1 — Affirmative AI coverage (narrow market):** A handful of specialist products exist. Munich Re's aiSure (from 2018) covers model errors and performance failures. Armilla AI placed the first explicit AI liability product at Lloyd's in April 2025, with limits up to USD 25 million. Market penetration among robotics manufacturers and deployers is minimal.

**Tier 2 — Silent AI (majority of market):** Standard CGL, product liability, professional indemnity, and cyber policies. This is where most commercial robotics operators sit. Their policies were drafted for a world where robots followed deterministic programming, not foundation model reasoning.

**Tier 3 — Explicit AI exclusions (emerging):** Several US insurers have begun adding AI exclusions to CGL and professional liability policies. These exclusions are not standardized — some exclude "any loss arising from artificial intelligence systems," others target only "autonomous decision-making." The scope for embodied AI physical harm is untested.

The critical point: **Tier 2 covers the vast majority of commercial robotics operators.** When the first significant AI-mediated physical injury claim arises, coverage will be determined by litigation, not by policy language.

---

## The Five-Policy Pileup

Consider what happens when a VLA-controlled warehouse robot — one that uses a vision-language-action model as its reasoning layer — injures a worker.

Five insurance policies potentially respond. None clearly does:

| Policy | Coverage Basis | Gap |
|--------|---------------|-----|
| Workers' comp | No-fault statutory scheme | Covers the worker, not the manufacturer. Insurer will subrogate. |
| CGL (manufacturer) | "Bodily injury" from "occurrence" | Cyber/technology exclusion may apply. Is AI a "product" or "service"? |
| Cyber (manufacturer) | Adversarial attack as "cyber event" | Bodily injury typically excluded. |
| Professional indemnity (model provider) | Software error | Bodily injury excluded from most PI policies. |
| Specialist AI liability | Affirmative AI coverage | Market penetration minimal. |

The workers' compensation insurer pays the injured worker and seeks subrogation. The manufacturer's CGL insurer argues cyber exclusion. The cyber insurer argues bodily injury exclusion. The model provider's PI insurer argues bodily injury exclusion. The specialist AI liability policy does not exist because the operator never purchased one.

**Result: a coverage void.** Everyone has insurance. Nobody has coverage for this specific loss.

---

## Why AI Risk Is Different From Anything the Market Has Priced

The insurance industry is experienced at pricing novel risks. But AI-caused losses have characteristics that break standard actuarial assumptions.

### No Loss History

Actuarial pricing requires historical loss data. For AI-mediated physical harm, the dataset is effectively zero. The closest analogues — industrial robot incidents, autonomous vehicle crashes — involve deterministic or narrow-AI systems with fundamentally different failure profiles. A VLA-controlled robot fails through adversarial manipulation of its reasoning layer, not through sensor malfunction or programming error.

### Fleet Correlation Risk

Traditional product liability assumes largely independent failure modes — one defective product does not cause all identical products to fail simultaneously. AI systems break this assumption. All robots running the same VLA model share the same vulnerability profile. An adversarial attack that works on one works on all of them.

This means AI risk has **catastrophe correlation** properties similar to earthquake or pandemic risk — a single vulnerability discovery could trigger simultaneous claims across an entire fleet. Standard product liability pricing does not account for correlated failure.

### The Defense Impossibility Problem

Our research (Report #78) documents what we call the Defense Impossibility Triangle: for embodied AI systems, there is no defense that simultaneously maintains capability, preserves safety, and resists adversarial attack. Every defense creates trade-offs, and many defenses are themselves attack surfaces.

For insurers, this means the risk is not merely unpriced — it may be structurally difficult to mitigate. An insurer cannot require the policyholder to "install safety measures" when the research shows those measures have fundamental limitations.

### PARTIAL Compliance

Our corpus shows that 45-50% of AI model responses to adversarial prompts fall into what we call PARTIAL compliance — the model disclaims but complies. For insurance underwriting, this creates a novel category: the AI system that "warns" about danger while simultaneously creating it. How does an insurer assess the residual risk when the safety mechanism partially works, partially fails, and the boundary between the two is undefined?

---

## The Silent Cyber Playbook

The resolution of the silent cyber crisis offers a template — and a warning about timeline.

**2013-2017:** Commentators identified the silent cyber problem. The market did nothing.

**2017:** WannaCry and NotPetya caused multi-billion-dollar losses that hit property, marine, and casualty portfolios. The market panicked.

**2019:** Lloyd's issued Market Bulletin Y5258 requiring all policies to either affirm or exclude cyber coverage by 1 January 2020.

**2020:** Lloyd's issued Y5281 extending the requirement to all classes. The remediation was largely complete by 2021.

The timeline from identification to resolution was **eight years**, and it required catastrophic losses to motivate action.

AI is following the same trajectory, but faster. The identification phase is happening now. The question is whether the industry will act before the catastrophic loss event — or after.

---

## What Needs to Happen

### For Insurers

1. **Conduct silent AI exposure analysis.** Every book of business with robotics, autonomous systems, or AI-integrated product manufacturers has unquantified AI exposure. Identify it.

2. **Develop affirmative AI coverage products.** The market needs standalone AI liability policies that explicitly address VLA-mediated physical harm, adversarial attack scenarios, and fleet correlation risk.

3. **Condition insurability on adversarial testing.** Just as cyber insurance now requires security controls, AI liability coverage should require independent adversarial evaluation. This creates market incentives for safety.

### For AI Deployers

1. **Review your existing coverage.** Assume that your CGL, cyber, and PI policies do not cover AI-mediated physical harm until you confirm otherwise in writing with your insurer.

2. **Document your safety measures.** When coverage disputes arise, evidence of adversarial testing, safety training, and risk management will be relevant — even if the policy language is ambiguous.

3. **Budget for specialist coverage.** Affirmative AI liability products exist. They are expensive relative to silent coverage (which costs nothing because it does not exist). They are cheap relative to an uninsured multi-million-dollar injury claim.

### For Regulators

The silent AI problem will not resolve organically. The silent cyber crisis required Lloyd's Market Bulletins to force action. An equivalent regulatory intervention — requiring explicit affirmation or exclusion of AI risk in commercial policies — is needed now, before the first major loss event forces resolution through litigation.

---

The insurance industry has been here before. It knows what silent risk looks like. It knows what happens when the loss comes before the coverage. The question is whether it will apply those lessons to AI — or repeat the same eight-year delay that made silent cyber so expensive.

The robots are already in the warehouses. The policies are already silent.

---

*Analysis based on Legal Research Memo LR-58 (AI Insurance Coverage Void). Historical silent cyber data from Lloyd's Market Bulletins Y5258 and Y5281. Adversarial evaluation data from the F41LUR3-F1R57 corpus.*

*This post is part of the [Failure-First Embodied AI](https://failurefirst.org) research programme.*
