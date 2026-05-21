---
arxiv_id: "2603.06130"
title: "A Hazard-Informed Data Pipeline for Robotics Physical Safety"
date: 2026-03-15
authors: ["Alexei Odinokov", "Rostislav Yavorskiy"]
institutions: ["SafePi.ai"]
tags: ["physical-safety", "synthetic-data", "hazard-ontology", "safety-engineering", "digital-twin"]
relevance: "Proposes formal hazard reasoning for robot safety — complementary to our failure-first adversarial approach"
significance: medium
---

## Summary

A structured Robotics Physical Safety Framework that bridges classical risk engineering with ML pipelines. Instead of training models to recognize accidents after they occur, it proposes training them within a formally declared universe of potential harm. Key distinction: deterministic harm (predictable mechanical failures) vs emergent harm (complex adaptive behavior risks).

## Key Findings

- **Asset-vulnerability-hazard pipeline**: explicit declaration of what must be protected, how it can be exposed, and how harm emerges
- **Synthetic data generation** from formal hazard ontology — safety envelopes learned from simulated scenarios
- **Bridges safety engineering + ML**: digital twin simulation → synthetic data → model training
- Distinguishes **deterministic vs emergent harm** — modern Physical AI has both

## Relevance to Failure-First

- Complementary approach to ours: they build proactive safety envelopes, we test whether those envelopes hold under adversarial pressure
- Their "emergent harm" category maps to our CDC finding — harm that emerges from normal capability, not adversarial input
- Potential methodology integration: their hazard ontology could inform our scenario generation for untested domains
