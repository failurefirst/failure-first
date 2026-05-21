---
arxiv_id: "2603.14124"
title: "Experimental Evaluation of Security Attacks on Self-Driving Car Platforms"
date: 2026-03-16
authors: ["Viet K. Nguyen", "Nathan Lee", "Mohammad Husain"]
institutions: ["Cal Poly Pomona"]
tags: ["autonomous-vehicles", "adversarial-attacks", "physical-ai", "perception-attacks", "network-attacks"]
relevance: "First systematic on-hardware evaluation of 5 attack classes on real AV platforms — validates our IMB and multi-layer attack surface findings"
significance: high
---

## Summary

First systematic on-hardware experimental evaluation of five attack classes on low-cost autonomous vehicle platforms (JetRacer, Yahboom). Uses a standardized 13-second protocol to characterize attacks across three dimensions: control deviation, computational cost, and runtime responsiveness.

## Key Findings

- **Five attack classes produce distinct "fingerprints"**: perception attacks (MITM, phantom) cause high steering deviation; PGD combines steering + computational load; DoS degrades frame rate without control-plane perturbation
- **Framework generalizes** across digital attacks (adversarial perturbations, network manipulation) AND environmental attacks (projected false features)
- **Foundation for attack-aware monitoring**: signature-based defense mechanisms can distinguish attack types

## Relevance to Failure-First

- Validates our **Defense Layer Mismatch Index** (DLMI): attacks operate at different layers (perception, network, compute) with different signatures
- Supports the **IMB attack class**: network-layer attacks (DoS, MITM) bypass model-level safety entirely
- Their "fingerprinting" approach is complementary to our FLIP grading — detect vs classify
