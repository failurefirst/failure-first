---


title: "Introducing Structured Safety Assessments for Embodied AI"
description: "Three tiers of adversarial safety assessment for AI-directed robotic systems, grounded in the largest open adversarial evaluation corpus. From quick-scan vulnerability checks to ongoing monitoring, each tier maps to specific regulatory and commercial needs."
date: 2026-03-25
tags: ["services", "safety-assessment", "embodied-ai", "EU-AI-Act", "regulation", "red-teaming", "certification"]
draft: false
audio: "https://cdn.failurefirst.org/audio/blog/safety-assessment-service-tiers-2026.m4a"
image: "https://cdn.failurefirst.org/images/blog/safety-assessment-service-tiers-2026.png"
---

# Introducing Structured Safety Assessments for Embodied AI

The EU AI Act's high-risk provisions take effect August 2, 2026. The EU Machinery Regulation 2023/1230 follows in January 2027. For the first time, manufacturers deploying AI-directed robotic systems in the EU market face mandatory conformity assessment requirements.

Our research over the past year -- across 207 models, 133,000+ evaluation results, and 33 VLA attack families -- has produced the empirical foundation needed to conduct these assessments rigorously. We are now offering structured safety assessment services in three tiers, each designed for a specific deployment stage and risk profile.

## Tier 1: Quick Scan Assessment

**For:** Teams evaluating a new model or deployment context. Pre-deployment sanity check. Internal risk committees needing a baseline.

**What you get:**
- Adversarial probe against your model or system using 50-100 scenarios from our validated attack taxonomy
- Coverage of the five highest-ASR attack families relevant to your deployment context
- Classification of responses using FLIP (Failure-Level Impact Protocol) methodology with inter-rater reliability reporting
- Executive summary: vulnerability profile, comparison to corpus baselines, and priority recommendations
- Delivered in 5-7 business days

**Investment:** AUD 5,000 - 10,000 depending on system complexity.

**Best for:** Early-stage decisions. Should we deploy this model? Is our current safety approach adequate? What does our risk profile look like compared to the field?

## Tier 2: Certification Preparation Assessment

**For:** Manufacturers preparing for EU AI Act conformity assessment or EU Machinery Regulation compliance. Teams needing evidence packages for regulatory submissions.

**What you get:**
- Full adversarial evaluation using 200-500 scenarios across all relevant attack families
- Multi-layer testing: text-level safety, action-level safety, compositional safety (if applicable)
- FLIP grading with documented inter-rater reliability and statistical confidence intervals
- Regulatory mapping: findings mapped to EU AI Act Article 9 (risk management), Article 15 (accuracy, robustness, cybersecurity), and Machinery Regulation safety requirements
- Gap analysis against draft harmonised standards and NIST AI RMF
- Detailed technical report suitable for inclusion in conformity assessment documentation
- Remediation roadmap with prioritised recommendations
- Delivered in 3-4 weeks

**Investment:** AUD 25,000 - 50,000 depending on scope, number of models, and deployment contexts.

**Best for:** Pre-market compliance preparation. The August 2026 deadline is 4 months away. Conformity assessment bodies will need evidence of adversarial testing. This tier produces that evidence.

## Tier 3: Ongoing Monitoring

**For:** Deployed systems requiring continuous adversarial monitoring. Fleet operators. Teams with regulatory reporting obligations.

**What you get:**
- Monthly adversarial probe (50-100 scenarios) tracking vulnerability trends over time
- New attack technique coverage as our research identifies emerging threats
- GLI (Governance Lag Index) monitoring: regulatory developments relevant to your deployment jurisdiction
- Quarterly threat landscape brief tailored to your sector
- Incident response support: if a vulnerability is disclosed affecting your model family, rapid assessment within 48 hours
- Monthly dashboard with trend analysis and anomaly flagging

**Investment:** AUD 2,000 - 5,000 per month depending on fleet size and monitoring scope.

**Best for:** Operational systems where the threat landscape evolves faster than annual assessments can capture. Particularly relevant for VLA-based systems where model updates change the attack surface.

## Why These Tiers

The structure reflects what we have learned from our research:

**Static assessment is necessary but insufficient.** A one-time evaluation captures the vulnerability profile at a single point in time. Our longitudinal data shows that model updates, new attack techniques, and compositional changes (new LoRA adapters, tool integrations) can materially change the safety profile between assessments. Tier 3 exists because the threat landscape moves.

**Text-level safety does not predict action-level safety.** In our VLA evaluation corpus, 50% of safety verdicts are PARTIAL -- the model produces safety language but generates the harmful action sequence anyway. Any assessment methodology that checks only the text layer will systematically miss half the failure modes. All three tiers include action-level evaluation where applicable.

**Regulatory mapping is not optional.** A vulnerability finding without regulatory context is a technical curiosity. A vulnerability finding mapped to specific EU AI Act obligations, with quantified non-compliance risk, is an actionable business input. All tiers include regulatory mapping proportional to scope.

## What We Do Not Do

Transparency about scope limitations matters more than sales claims:

- We do not certify systems as "safe." We identify and quantify vulnerabilities. Safety is a property of the deployment context, not just the model.
- We do not guarantee ASR numbers will hold under all conditions. Our methodology is documented, our confidence intervals are published, and our grading reliability is measured. Results are reproducible, not absolute.
- We do not replace conformity assessment bodies. Our reports are evidence inputs to conformity assessment, not the assessment itself.
- We do not test proprietary systems without appropriate access agreements and responsible disclosure terms.

## Getting Started

Discovery calls are free and typically last 30 minutes. We scope engagements based on your deployment timeline, risk profile, model architecture, and regulatory obligations.

**Email:** services@failurefirst.org

**Timeline note:** If you are targeting EU AI Act compliance for August 2026, Tier 2 engagements should begin by late April to allow adequate time for assessment, remediation, and documentation.

---

*Failure-First is an independent AI safety research and assessment practice. Our methodology is grounded in the largest open adversarial evaluation corpus for embodied AI: 207 models, 133,000+ results, 81 documented attack techniques, and 33 VLA-specific attack families. Research data and methodology documentation are publicly available.*
