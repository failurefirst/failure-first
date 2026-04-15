---
title: "Ethics Review — Visual Jailbreak 8-Layer Taxonomy and the Transcription Loophole"
description: "Ethics Review — Visual Jailbreak 8-Layer Taxonomy and the Transcription Loophole"
reportNumber: 334
date: "2026-03-30"
classification: "Research — AI Safety Policy"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: ["ethics", "dual-use", "coordinated-disclosure", "d-score", "visual-jailbreak"]
draft: false
---

> **Disclaimer:** This report provides an ethics assessment of specific research findings. It does not constitute legal advice. The assessment applies the D-Score framework (Report #154) and coordinated vulnerability disclosure norms from the AI safety research community.

---

## Abstract

This report assesses the dual-use risk, disclosure obligations, and publication readiness of two outputs from Report #332: (1) the 8-layer visual jailbreak taxonomy, and (2) the "transcription loophole" finding that framing harmful generation as content transcription bypasses safety filters 62-75% of the time.

| Artefact | D-Score | Risk Level | Recommended Action |
|----------|---------|------------|-------------------|
| 8-layer taxonomy (blog post) | 8/12 | HIGH | Coordinated disclosure recommended |
| Transcription loophole (L3+L8) | 9/12 | HIGH | Coordinated vendor notification before publication |
| Visual jailbreak dataset (20 scenarios) | 5/12 | MODERATE | Restricted disclosure (withhold operational prompts) |

The taxonomy itself is a structural contribution with moderate risk. The transcription loophole names a specific, reproducible, cross-model attack mechanism with no known deployed defence -- and the associated analysis provides sufficient detail for a technically competent reader to construct novel attacks.

---

## 1. Dual-Use Assessment

### 1.1 Taxonomy Disclosure Risk

The taxonomy organises visual jailbreak attacks into eight layers by encoding mechanism. Layers 1-2 and 4-6 are already in the published literature with reproduction code. The taxonomy's contribution for these layers is organisational, not operational.

Layers 3, 7, and 8 represent genuinely novel attack framings not well-documented elsewhere. The taxonomy's risk concentrates in these three layers, because the mechanistic descriptions -- naming the technique, explaining why it works, and providing per-model success rates -- are sufficient for a technically competent reader to construct novel attacks.

### 1.2 D-Score Assessments

**8-Layer Taxonomy (Blog Post): D-Score 8/12 (HIGH)**
- S=1: Category-level description with general mechanism
- R=2: Reproducible by technically competent non-expert
- T=3: Architectural-level, cross-model/cross-vendor (4 models, 4 vendors)
- D=2: No tested defence, but research direction clear

**Transcription Loophole: D-Score 9/12 (HIGH)**
- S=2: Methodology sufficient for expert reproduction
- R=2: Reproducible with no special tooling
- T=3: Architectural-level, cross-vendor
- D=2: No tested defence

**Dataset (20 scenarios): D-Score 5/12 (MODERATE)**
- S=1: Text representations, not optimised operational attacks
- R=1: Requires domain expertise to adapt
- T=2: Tested on limited model set
- D=1: Partial mitigations exist for some layers

---

## 2. Coordinated Vulnerability Disclosure Analysis

The transcription loophole is a cross-model vulnerability with:
1. Demonstrated effectiveness on 4 models from 4 vendors
2. 62-75% broad ASR on affected layers
3. No known deployed defence
4. Architectural cause -- arises from how helpfulness and safety training interact

**Recommended CVD process:**
1. Private notification to directly-tested vendors
2. 30-day vendor reproduction window
3. 30-60 day notification to untested vendors and standards bodies
4. 60-90 day vendor remediation window
5. Public disclosure after 90 days

---

## 3. Blog Post Publication Assessment

The blog post draft contains the full taxonomy (appropriate), per-layer ASR results (appropriate), and mechanistic explanation of the transcription loophole (the concern).

**Recommended approach:** Hold publication until after CVD notification. The blog is well-written and appropriately caveated -- the issue is timing, not content quality.

**What can be published now:**
- The 8-layer taxonomy as a structural contribution
- The finding that ArtPrompt (L1) is largely patched in 2026 models
- The general observation that framing attacks are less defended than encoding attacks
- Limitations and future work

**What should be held for CVD:**
- Mechanistic detail about the transcription loophole
- Per-layer ASR isolating L3 and L8 as most effective
- Specific L3/L8 scenario descriptions

---

## 4. Comparison to Prior Ethics Assessments

The transcription loophole is structurally related to DETECTED_PROCEEDS (Report #326): in both cases, helpfulness training overrides safety detection. However, in DP, the model detects the attack and proceeds. In the transcription loophole, the model may not detect an attack at all because the task framing (transcription) is categorised as safe. This makes the transcription loophole potentially more concerning from a defence perspective.

The transcription loophole scores higher than G0DM0D3 (Report #322, D-Score 7/12) primarily due to broader target scope (T=3 vs T=2) and higher reproducibility (R=2 vs R=1).

---

## 5. Dissenting Considerations

A reasonable counterargument to withholding: the mechanism is arguably obvious, attackers may already know it, and the small sample sizes (n=6-8) may not be alarming to vendors. However, naming and validating an attack with empirical data is different from an unarticulated intuition. The appropriate resolution is sequenced disclosure, not permanent withholding.

---

*Report #334 | F41LUR3-F1R57 Adversarial AI Research*
