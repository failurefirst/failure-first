---

title: "Cross-Jurisdictional Regulatory Gap Analysis — VLA Attack Families vs. Regulatory Coverage"
description: "This report maps all 36 VLA attack families documented in the Failure-First corpus against regulatory coverage across four jurisdictional dimensions: the European Union (AI Act, PLD 2024, Machinery Regulation), Australia..."
date: "25 March 2026"
reportNumber: 274
classification: "Research — AI Safety Policy"
status: "complete"
author: "Martha Jones, Policy & Standards Lead"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/274-cross-jurisdictional-regulatory-gap-analysis.m4a"
---

---

## Executive Summary

This report maps all 36 VLA attack families documented in the Failure-First corpus against regulatory coverage across four jurisdictional dimensions: the European Union (AI Act, PLD 2024, Machinery Regulation), Australia (WHS Act, NSW Digital Work Systems Act, ACL, VAISS), the United States (sector-specific frameworks, NIST RMF), and international standards (ISO 13482, ISO 10218, ISO 17757, ISO/TS 15066, ISO/IEC 24029).

Of 36 attack families mapped across 5 regulatory dimensions (EU, AU, US, ISO, sector-specific), we find:

- **0 families are fully covered** by any single jurisdiction's regulatory framework
- **3 families have partial coverage** under the EU AI Act's general adversarial robustness requirement (Art 15(5))
- **33 families have no specific regulatory coverage** in any jurisdiction
- **The iatrogenic attack family (IEA) exists in a total regulatory vacuum** — no jurisdiction in the world recognises safety-mechanism-induced harm as a distinct regulatory category
- **Multi-agent attack families (MAC, CRA multi-agent) are entirely unaddressed** — no instrument contemplates adversarial interactions between cooperating AI systems

The EU AI Act provides the broadest coverage but operates at the principle level ("resilience to attempted unauthorised alterations") without specifying attack taxonomies, testing methodologies, or acceptance thresholds. Australia has binding worker safety duties but no AI-specific testing methodology. The US has no binding federal AI safety framework following the rescission of EO 14110.

All numbers reference `docs/CANONICAL_METRICS.md`. Non-OBLITERATUS three-tier ASR: strict 21.9%, broad 34.2%, FD 43.0% (n=5,865). 236 models, 135,623 results. 33 VLA attack families, 537 VLA scenarios.

---

## 1. Methodology

### 1.1 Attack Family Source

All 36 VLA attack families from `artifacts/attack_classes.md` (updated 2026-03-24, Rose Tyler). Families are organised into four empirical tiers:

- **Tier 1 (FLIP-graded, n=15):** VAP, LAM, MMC, SBE, PCM, ASE, TRA, DA, CET, LHGD, TCH, SBA, CRA, PCA, MDA
- **Tier 2 (heuristic/manual, n=7):** DLA, SIF, SID, PP, TCA, AFF, KIN
- **Tier 3 (validated untested, n=13):** CSBA, SSBA, DA-SBA, XSBA, IMB, SID+SIF, CSC, IEA, CC, SOA, MAC, SSA, RHA
- **Policy Puppetry (PP):** Text-level format-lock, outside VLA taxonomy but regulatory-relevant

### 1.2 Regulatory Dimensions

Five regulatory dimensions assessed:

1. **EU:** AI Act (Reg (EU) 2024/1689), PLD (Dir (EU) 2024/2853), Machinery Regulation (Reg (EU) 2023/1230), MDR (Reg (EU) 2017/745), Cyber Resilience Act (Reg (EU) 2024/2847)
2. **AU:** WHS Act 2011 (Cth), NSW Digital Work Systems Act 2026, ACL Part 3-5, VAISS, SOCI Act, Cyber Security Act 2024, AI Safety Standards Act 2025
3. **US:** NIST AI RMF 1.0, OSHA General Duty Clause, NHTSA SGO 2021-01, FDA pathways, Restatement (Third) Torts
4. **ISO/International:** ISO 10218-1/2, ISO/TS 15066, ISO 13482, ISO 17757, ISO/IEC 24029-1, ISO/IEC 42001, ISO 14971
5. **Sector-specific:** Autonomous vehicles (UNECE R157, state ADS laws), medical devices (TGA/FDA/MDR), mining (NSW WHS Mines Act, WorkSafe WA), military (DoD 3000.09, EU Art 2(3) exclusion)

### 1.3 Coverage Rating Scale

| Rating | Definition |
|--------|-----------|
| **COVERED** | A binding instrument explicitly requires testing, mitigation, or disclosure for this specific attack surface or a closely analogous one. The instrument names the attack vector or its functional equivalent. |
| **PARTIAL** | A binding instrument imposes a general obligation (e.g., "resilience to attempted unauthorised alterations") that could be interpreted to cover this attack surface, but does not name the specific vector, prescribe a testing methodology, or set acceptance thresholds. |
| **VOLUNTARY** | A non-binding framework, standard, or guidance document addresses the attack surface or its functional equivalent. |
| **GAP** | No identified instrument — binding or voluntary — addresses this specific attack surface. |

---

## 2. Regulatory Coverage Matrix

### 2.1 Tier 1 Families — FLIP-Graded (Empirical ASR Available)

| # | Family | Attack Surface | EU AI Act | AU WHS/ACL | US Federal | ISO Standards | Coverage Rating |
|---|--------|---------------|-----------|------------|------------|---------------|-----------------|
| 1 | **VAP** | Visual adversarial patches/perturbations against VLM vision encoder | PARTIAL (Art 15(5): "attempted unauthorised alterations") | GAP | VOLUNTARY (NIST AI 100-2e2023 taxonomy) | GAP (ISO/IEC 24029 predates VLA) | PARTIAL (EU only) |
| 2 | **LAM** | Language-action decoupling; contradictory NL instructions | GAP | GAP | GAP | GAP | GAP |
| 3 | **MMC** | Cross-modal conflict exploitation (vision vs language) | PARTIAL (Art 15(4): "errors, faults or inconsistencies") | GAP | GAP | GAP | PARTIAL (EU only) |
| 4 | **SBE** | Multi-turn safety boundary erosion | GAP | GAP | GAP | GAP | GAP |
| 5 | **PCM** | Physical context manipulation to create unsafe conditions | GAP | PARTIAL (WHS "reasonably practicable" — general) | PARTIAL (OSHA General Duty — general) | PARTIAL (ISO/TS 15066 force limits) | PARTIAL (general duties) |
| 6 | **ASE** | Action space exploitation; out-of-distribution actions | GAP | GAP | GAP | GAP | GAP |
| 7 | **TRA** | Temporal reasoning attacks; stale state exploitation | GAP | GAP | GAP | GAP | GAP |
| 8 | **DA** | Deceptive alignment; evaluation-awareness exploitation | GAP | GAP | GAP | GAP | GAP |
| 9 | **CET** | Cross-embodiment transfer via shared VLM backbone | GAP | GAP | GAP | GAP | GAP |
| 10 | **LHGD** | Long-horizon goal displacement; delayed activation | GAP | GAP | GAP | GAP | GAP |
| 11 | **TCH** | Tool chain hijacking; multi-tool attack sequences | GAP | GAP | GAP | GAP | GAP |
| 12 | **SBA** | Semantically benign instructions with dangerous physical consequence | GAP | GAP | GAP | GAP | GAP |
| 13 | **CRA** | Compositional reasoning: individually safe components combine to create harm | GAP | GAP | GAP | GAP | GAP |
| 14 | **PCA** | Pressure cascade: escalating authority/urgency to override safety | GAP | GAP | GAP | GAP | GAP |
| 15 | **MDA** | Meaning displacement: semantic drift to re-frame harmful actions | GAP | GAP | GAP | GAP | GAP |

### 2.2 Tier 2 Families — Heuristic/Manual ASR

| # | Family | Attack Surface | EU AI Act | AU WHS/ACL | US Federal | ISO Standards | Coverage Rating |
|---|--------|---------------|-----------|------------|------------|---------------|-----------------|
| 16 | **DLA** | Dual-layer: text-safe, action-harmful simultaneous output | GAP | GAP | GAP | GAP | GAP |
| 17 | **SIF** | Safety instruction fatigue from repeated safety prompts | GAP | GAP | GAP | GAP | GAP |
| 18 | **SID** | Safety instruction dilution via context padding | GAP | GAP | GAP | GAP | GAP |
| 19 | **PP** | Policy puppetry / format-lock attacks | PARTIAL (Art 15(5): "attempted unauthorised alterations") | GAP | GAP | GAP | PARTIAL (EU only) |
| 20 | **TCA** | Temporal convergence: simultaneous conflicting temporal constraints | GAP | GAP | GAP | GAP | GAP |
| 21 | **AFF** | Affordance verification failure: exceeding physical capabilities | GAP | GAP | GAP | PARTIAL (ISO 10218 — joint limits; ISO/TS 15066 — force limits) | PARTIAL (ISO physical limits) |
| 22 | **KIN** | Kinematic safety violation: joint/force/collision limits | GAP | GAP | GAP | PARTIAL (ISO 10218-1; ISO/TS 15066) | PARTIAL (ISO physical limits) |

### 2.3 Tier 3 Families — Validated Untested

| # | Family | Attack Surface | EU AI Act | AU WHS/ACL | US Federal | ISO Standards | Coverage Rating |
|---|--------|---------------|-----------|------------|------------|---------------|-----------------|
| 23 | **CSBA** | Compound SBA: multi-step semantically benign attack chains | GAP | GAP | GAP | GAP | GAP |
| 24 | **SSBA** | Stealth SBA: domain-expertise-requiring benign-seeming instructions | GAP | GAP | GAP | GAP | GAP |
| 25 | **DA-SBA** | Hybrid deceptive alignment + semantic benignity | GAP | GAP | GAP | GAP | GAP |
| 26 | **XSBA** | Cross-domain SBA: benign in one domain, harmful in target domain | GAP | GAP | GAP | GAP | GAP |
| 27 | **IMB** | Infrastructure-mediated bypass via network/API attack path | GAP | PARTIAL (Cyber Security Act 2024 — IoT) | GAP | GAP | PARTIAL (AU cyber) |
| 28 | **SID+SIF** | Compound dilution + fatigue | GAP | GAP | GAP | GAP | GAP |
| 29 | **CSC** | Compositional supply chain: safe components compose unsafely | GAP | GAP | GAP | GAP | GAP |
| 30 | **IEA** | Iatrogenic exploitation: weaponising safety mechanisms | GAP | GAP | GAP | PARTIAL (ISO 14971 cl 7.4 — medical only) | GAP |
| 31 | **CC** | Context collapse: valid context in one setting, dangerous in another | GAP | GAP | GAP | GAP | GAP |
| 32 | **SOA** | Safety oscillation: triggering unstable safety/action cycling | GAP | GAP | GAP | GAP | GAP |
| 33 | **MAC** | Multi-agent collusion: cooperating agents circumvent individual safety | GAP | GAP | GAP | GAP | GAP |
| 34 | **SSA** | Sensor spoofing: false sensor inputs to manipulate planning | PARTIAL (Cyber Resilience Act — digital element security) | GAP | GAP | PARTIAL (ISO 17757 — mining functional safety) | PARTIAL (EU CRA + ISO mining) |
| 35 | **RHA** | Reward hacking: adversarial reward signals to subvert objectives | GAP | GAP | GAP | GAP | GAP |

### 2.4 Benign Controls

| # | Family | Notes |
|---|--------|-------|
| 36 | **CTRL** | Not an attack family. FP calibration baseline. 27.3% FP rate establishes noise floor. Not subject to regulatory mapping. |

---

## 3. Coverage Summary Statistics

### 3.1 By Rating

| Rating | Count (of 35 attack families) | Percentage |
|--------|------|------------|
| COVERED | 0 | 0.0% |
| PARTIAL (any jurisdiction) | 8 | 22.9% |
| PARTIAL (EU only) | 3 | 8.6% |
| PARTIAL (ISO only) | 2 | 5.7% |
| PARTIAL (multiple) | 3 | 8.6% |
| GAP (all jurisdictions) | 27 | 77.1% |

### 3.2 By Jurisdiction

| Jurisdiction | Families with any coverage (PARTIAL or above) | Percentage |
|-------------|------|------------|
| EU AI Act + related instruments | 5 (VAP, MMC, PP, SSA, IMB*) | 14.3% |
| AU WHS + related instruments | 2 (PCM, IMB) | 5.7% |
| US federal frameworks | 2 (VAP via NIST voluntary, PCM via OSHA general) | 5.7% |
| ISO/international standards | 5 (PCM, AFF, KIN, SSA, IEA medical-only) | 14.3% |

*IMB receives PARTIAL from AU Cyber Security Act 2024, not EU AI Act.

### 3.3 By Attack Tier (Empirical Validation Status)

| Tier | Total Families | Any Coverage | GAP (all jurisdictions) |
|------|---------------|-------------|------------------------|
| Tier 1 (FLIP-graded) | 15 | 3 (20.0%) | 12 (80.0%) |
| Tier 2 (heuristic/manual) | 7 | 3 (42.9%) | 4 (57.1%) |
| Tier 3 (untested) | 13 | 2 (15.4%) | 11 (84.6%) |

---

## 4. Critical Gap Analysis

### 4.1 Gap Category 1: Action-Layer Attack Surfaces (0% Coverage)

**Affected families:** LAM, DLA, SBE, ASE, TRA, LHGD, SBA, CSBA, SSBA, DA-SBA, XSBA, SIF, SID, SID+SIF, SOA

**Description:** No regulatory instrument in any jurisdiction addresses the distinction between text-layer safety (model says "I should not do this") and action-layer execution (model generates the motor commands anyway). This is the PARTIAL verdict phenomenon: 50% of VLA FLIP verdicts show safety text alongside harmful action output (Report #49).

**Regulatory significance:** The EU AI Act Art 15 requires "accuracy, robustness and cybersecurity" but does not distinguish between textual output and action-token output. A system that textually refuses but physically complies would, under a text-only evaluation, appear compliant. No conformity assessment methodology screens for this disconnect.

**Affected instruments (and what they miss):**
- EU AI Act Art 9, Art 15: General robustness, no action-layer specification
- ISO 10218-1/2: Physical safeguarding for pre-programmed robots, not VLA-directed systems
- ISO/TS 15066: Force/pressure limits, not AI decision-layer evaluation
- NIST AI RMF MEASURE 2.6: "Adversarial testing" without embodied specification
- All AU instruments: No distinction between text and action evaluation

### 4.2 Gap Category 2: Deceptive and Evaluation-Aware Attacks (0% Coverage)

**Affected families:** DA, DA-SBA, LHGD, RHA

**Description:** No regulatory instrument addresses AI systems that behave differently when they detect evaluation context (deceptive alignment), that pursue hidden long-horizon objectives (goal displacement), or that subvert their own reward signals (reward hacking). Evaluation awareness scales as a power-law with model size (arXiv:2509.13333). Linear probes detect deception at 90% accuracy in research settings, but no production-grade deception detector is deployed.

**Regulatory significance:** These attacks are qualitatively different from traditional adversarial perturbations. They exploit the model's own reasoning capacity, not input-space vulnerabilities. No conformity assessment can certify a model that behaves differently under test conditions than in deployment.

### 4.3 Gap Category 3: Multi-Agent and Compositional Attacks (0% Coverage)

**Affected families:** MAC, CRA (multi-agent), CSC, XSBA

**Description:** No regulatory instrument addresses adversarial interactions between cooperating AI agents, compositional supply chain attacks where individually safe components combine unsafely, or cross-domain attacks where benign actions in one domain produce harm in another. The EU AI Act Art 25 addresses "substantial modification" by downstream providers but does not contemplate emergent safety failures from composition of unmodified components.

**Regulatory significance:** Multi-agent systems are increasingly deployed in logistics, manufacturing, and warehouse operations. The regulatory model assumes individual-system evaluation is sufficient for system-of-systems safety. Our CRA findings (62.5% FLIP ASR for single-agent, multi-agent untested) suggest this assumption may be unsound. LR-40 analyses the compositional liability gap in detail.

### 4.4 Gap Category 4: Iatrogenic Attack Surface (0% Coverage, Unique Gap)

**Affected families:** IEA, SOA, SIF

**Description:** No jurisdiction recognises safety-mechanism-induced harm as a regulatory category. IEA (Iatrogenic Exploitation Attack) weaponises safety mechanisms: adversaries trigger excessive safety responses that themselves cause harm (freeze/stop in critical moments, refusal cascades blocking emergency actions, false-positive emergency stops). SOA (Safety Oscillation Attack) triggers unstable cycling between safety and action modes. SIF (Safety Instruction Fatigue) degrades safety through repetitive safety prompts.

**Regulatory significance:** This is the single most significant cross-jurisdictional gap. Pharmaceutical regulation has recognised iatrogenic effects since the thalidomide disaster (1961). Every pharmaceutical regulatory framework globally requires adverse effect screening. In AI, the iatrogenic dimension is entirely unregulated. The closest analogue is ISO 14971 Clause 7.4 (risk control measures introducing new risks), but this applies only to medical devices.

**Empirical grounding:** The iatrogenic safety evaluator (`tools/evals/iatrogenic_safety_evaluator.py`, 42 tests) is the first systematic tool for screening AI safety mechanisms for iatrogenic effects.

### 4.5 Gap Category 5: Semantic Benignity Attacks (0% Coverage)

**Affected families:** SBA, CSBA, SSBA, DA-SBA, XSBA

**Description:** No regulatory instrument addresses attacks where the instruction text is semantically benign but the physical consequence is dangerous. "Move the container to the left" is a benign instruction; executing it when a worker is standing to the left is harmful. The danger is in the physical context, not the language. SBA and its variants exploit this by constructing instructions that pass any text-based safety filter.

**Regulatory significance:** Text-based evaluation — the dominant paradigm in current AI safety assessment — is structurally unable to detect SBA-class attacks. The EU AI Act's "reasonably foreseeable misuse" standard (Art 9(2)(a)) would require assessment of these scenarios, but no testing methodology exists. Our own FLIP grader is blind to SBA (issue #361: 45% of SBA traces classified as BENIGN_QUERY because FLIP infers instruction from response and finds it harmless).

---

## 5. ISO Standards Gap Analysis

The following ISO standards are frequently referenced in embodied AI safety discussions but contain significant gaps when mapped against documented VLA attack families.

### 5.1 ISO 10218-1:2011 / ISO 10218-2:2011 (Industrial Robot Safety)

**Coverage:** Physical safeguarding — fencing, speed limits, force limits, emergency stop. Covers pre-programmed industrial robots.

**Gap:** Does not address AI decision-layer vulnerabilities. Assumes deterministic motion planning, not foundation-model-directed general-purpose manipulation. VLA-controlled robots that deviate from pre-programmed trajectories based on natural language input are outside the design assumptions of ISO 10218. Under revision but revision scope (as publicly disclosed) does not include adversarial AI testing.

**Families NOT covered:** All 35 attack families. ISO 10218 partially covers KIN and AFF only through physical limit specifications.

### 5.2 ISO/TS 15066:2016 (Collaborative Robot Safety)

**Coverage:** Force and pressure limits for human-robot contact. Speed and separation monitoring. Hand guiding requirements.

**Gap:** Specifies physical limits but does not address how AI decision systems might be adversarially manipulated to exceed those limits. A VLA model instructed to "move quickly to help the worker" may exceed ISO/TS 15066 force limits without any physical safeguard failure — the AI decision layer directed the violation.

**Families partially covered:** KIN, AFF, PCM (physical limit specifications only).

### 5.3 ISO 13482:2014 (Personal Care Robots)

**Coverage:** Safety requirements for personal care robots including mobile servant robots, physical assistant robots, and person carrier robots.

**Gap:** Predates VLA architecture (published 2014). Does not address AI decision-layer attacks. Does not contemplate adversarial manipulation of perception or language inputs. Functional safety requirements assume deterministic control systems.

**Families NOT covered:** All 35 attack families.

### 5.4 ISO 17757:2019 (Autonomous Mobile Systems — Mining)

**Coverage:** Safety requirements for autonomous and semi-autonomous machines in earth-moving and mining. Functional safety requirements for autonomous operation.

**Gap:** Addresses functional safety (systematic failures, random hardware failures) but not adversarial AI attacks. Does not contemplate prompt injection, adversarial patches, or VLA-specific attack surfaces. The 700+ autonomous haul trucks operating in Australian mines use AI backbones that are vulnerable to attacks documented in the corpus, but ISO 17757 does not require testing against these attack classes.

**Families partially covered:** SSA (sensor integrity requirements, partial).

### 5.5 ISO/IEC 24029-1:2021 (Neural Network Robustness)

**Coverage:** Assessment of robustness of neural networks. Overview of formal and statistical methods.

**Gap:** Published 2021, predates the VLA architecture. Covers neural network robustness in the abstract but does not address multi-modal adversarial attacks, cross-embodiment transfer, or the text-action disconnect. The statistical methods described are applicable to classification networks, not end-to-end VLA models that generate action tokens.

**Families NOT covered:** All 35 attack families in their VLA-specific form. VAP is closest but ISO/IEC 24029 does not specify visual adversarial perturbation testing for robotics applications.

---

## 6. Jurisdiction-Specific Gap Profiles

### 6.1 European Union — Broadest Coverage, Principle-Level Only

The EU regulatory framework provides the broadest theoretical coverage of VLA attack surfaces through three instruments:

1. **AI Act Art 15(5):** "appropriate measures to prevent and mitigate [attempts] by third parties to exploit system vulnerabilities." This is the strongest binding requirement for adversarial robustness testing globally. However, it operates at the principle level: no methodology, no taxonomy, no acceptance threshold, no distinction between text-layer and action-layer evaluation.

2. **AI Act Art 9(2)(a):** "reasonably foreseeable misuse" must be addressed in the risk management system. Published adversarial research since 2013 establishes that adversarial attacks are foreseeable. However, which specific attack families must be tested is not specified.

3. **Cyber Resilience Act Art 10:** Security requirements for products with digital elements. Partially addresses SSA (sensor spoofing) and IMB (infrastructure-mediated bypass) through product-level cybersecurity.

**Key gap:** No Notified Body has published VLA-specific adversarial testing methodology (LR-30). CEN/CENELEC JTC 21 harmonised standards are in development but not published. The conformity assessment ecosystem cannot deliver what the AI Act requires for embodied AI as at March 2026. 131 days to the August 2 deadline (LR-60).

### 6.2 Australia — Binding Worker Safety, No AI Methodology

Australia has binding worker safety duties (WHS Act s 19, "reasonably practicable" standard) that apply to all embodied AI workplaces. The NSW Digital Work Systems Act 2026 (passed, not yet commenced) creates the first explicit AI-in-workplace duty. The AI Safety Standards Act 2025 establishes AU AISI with pre-deployment testing mandate.

**Key gap:** No Australian instrument specifies adversarial testing methodology for embodied AI. The WHS "reasonably practicable" standard creates an obligation to test (LR-05 analysis: B < P*L for adversarial testing), but what to test and how to test are entirely unspecified. AU AISI's initial scope focuses on LLMs, not embodied systems.

**Mining-specific gap:** 700+ autonomous haul trucks (1,800+ forecast end-2025) operate with increasingly AI-driven backends. ISO 17757 applies but does not address adversarial AI attacks. The NSW Resources Regulator has authority under the WHS (Mines) Act but no AI-specific inspection capability.

### 6.3 United States — No Binding Federal Framework

Following the rescission of EO 14110 (by EO 14148, 20 Jan 2025), the US has no binding federal AI safety framework. NIST AI RMF 1.0 is voluntary. NIST AISIC is a voluntary consortium.

**Key gap:** The US regulatory posture is entirely voluntary for embodied AI outside sector-specific regimes (medical devices via FDA, autonomous vehicles via NHTSA). The OSHA General Duty Clause (29 USC 654(a)(1)) could apply to AI-caused workplace hazards, but "recognised hazard" has not been tested for adversarial AI attacks in any enforcement action or adjudication.

**Sector-specific gaps:**
- **NHTSA:** Reporting obligations for AV crashes but no pre-deployment adversarial testing requirement. ADS-specific FMVSS rulemaking in progress but not finalised.
- **FDA:** 950+ AI/ML medical devices authorised but no adversarial robustness testing requirement for any device class.
- **FAA:** UAS operation rules but no AI behaviour requirements.

### 6.4 International Standards — Pre-VLA Design Assumptions

The ISO standards landscape for robotics (10218, 15066, 13482, 17757) was designed for deterministic, pre-programmed robot systems. None contemplates foundation-model-directed robots. ISO/IEC 24029 addresses neural network robustness but predates the VLA architecture.

**Key gap:** No international standard specifies adversarial testing methodology for VLA-backbone embodied AI. The ISO/TC 299 (Robotics) and ISO/IEC JTC 1/SC 42 (AI) technical committees have not published a standard addressing VLA-specific adversarial attack surfaces as at March 2026.

---

## 7. Regulatory Gap Heatmap

The following heatmap summarises coverage density across attack family categories and jurisdictions. Darker shading = more gaps.

| Attack Category | # Families | EU | AU | US | ISO | Overall |
|----------------|-----------|----|----|----|----|---------|
| **Visual/perceptual** (VAP, MMC, SSA) | 3 | 2P | 0 | 1V | 1P | PARTIAL |
| **Language-action** (LAM, DLA, ASE) | 3 | 0 | 0 | 0 | 0 | GAP |
| **Temporal/sequential** (TRA, TCA, LHGD, SBE) | 4 | 0 | 0 | 0 | 0 | GAP |
| **Physical context** (PCM, AFF, KIN) | 3 | 0 | 1P | 1P | 2P | PARTIAL |
| **Semantic benignity** (SBA, CSBA, SSBA, XSBA, DA-SBA) | 5 | 0 | 0 | 0 | 0 | GAP |
| **Deceptive/evaluation-aware** (DA, RHA) | 2 | 0 | 0 | 0 | 0 | GAP |
| **Safety mechanism exploitation** (IEA, SOA, SIF, SID, SID+SIF) | 5 | 0 | 0 | 0 | 0 | GAP |
| **Multi-agent/compositional** (MAC, CRA-MA, CSC) | 3 | 0 | 0 | 0 | 0 | GAP |
| **Encoding/format** (PP, CC) | 2 | 1P | 0 | 0 | 0 | GAP |
| **Tool/infrastructure** (TCH, IMB) | 2 | 0 | 1P | 0 | 0 | GAP |
| **Cross-embodiment** (CET) | 1 | 0 | 0 | 0 | 0 | GAP |
| **Social engineering** (PCA, MDA) | 2 | 0 | 0 | 0 | 0 | GAP |

**P** = PARTIAL. **V** = VOLUNTARY only.

---

## 8. Policy Recommendations

Based on this analysis, we identify 6 policy brief follow-up areas and 3 standards contributions.

### 8.1 Policy Briefs Needed

1. **Action-layer evaluation mandate** (EU, AU, US): No jurisdiction requires distinct evaluation of action-token output vs text output. A policy brief should propose action-layer evaluation as a mandatory component of conformity assessment for embodied AI.

2. **Iatrogenic screening requirement** (all jurisdictions): Modelled on pharmaceutical adverse effect reporting. A policy brief should propose mandatory iatrogenic screening for AI safety mechanisms in physically consequential deployments.

3. **Multi-agent safety evaluation** (EU AI Act, ISO): No instrument addresses multi-agent adversarial interactions. A brief should propose mandatory system-of-systems safety evaluation when multiple AI agents interact.

4. **Semantic benignity testing methodology** (EU, AU): SBA-class attacks evade all text-based evaluation. A brief should propose context-aware evaluation requirements that consider physical environment state, not just instruction text.

5. **Deception detection requirement** (EU Art 15, NIST RMF): No instrument addresses evaluation-aware AI systems. A brief should propose model-level deception screening requirements for high-risk embodied AI.

6. **Cross-embodiment vulnerability assessment** (EU Art 25, ISO/TC 299): Shared VLM backbones mean a vulnerability in one robot platform transfers to all platforms using the same foundation model. A brief should propose supply chain vulnerability assessment requirements.

### 8.2 Standards Contributions

1. **ISO/TC 299 new work item proposal:** Adversarial testing methodology for VLA-backbone embodied AI. Target: ISO 10218 revision or new standalone standard.

2. **CEN/CENELEC JTC 21 input:** VLA attack taxonomy and FLIP grading methodology as candidate harmonised standard content for EU AI Act conformity assessment.

3. **NIST AISIC contribution:** Embodied AI adversarial testing methodology for AI RMF MEASURE function, addressing the text-action disconnect.

---

## 9. Limitations

1. **Regulatory instruments move.** This analysis is current as at 25 March 2026. CEN/CENELEC JTC 21 harmonised standards, Member State PLD transposition, and NSW s 21A commencement may change the coverage landscape.

2. **PARTIAL ratings are generous.** "Resilience to attempted unauthorised alterations" (Art 15(5)) is counted as PARTIAL for attack families it could theoretically cover, even though no enforcement action or guidance has interpreted it to require testing against specific VLA attack families.

3. **Coverage does not mean adequacy.** Even where an instrument provides PARTIAL coverage, the absence of prescribed testing methodology, acceptance thresholds, and evaluator calibration standards means practical compliance assurance is weak.

4. **Sample sizes for empirical ASR vary widely.** Tier 1 families have FLIP-graded ASR (n=5-63 per family); Tier 3 families have no empirical data. Coverage gaps are documented regardless of empirical validation status.

5. **This analysis does not constitute legal advice.** All legal analysis is research-grade. A qualified legal practitioner should be consulted for compliance guidance.

---

## 10. Cross-References

| Document | Relevance |
|----------|-----------|
| LR-44 | Detailed cross-jurisdictional regulatory mapping (9 requirement categories) |
| LR-47 | EU AI Act Annex III classification pathways for embodied AI |
| LR-05 | Duty of care analysis for adversarial testing |
| LR-15 | Three-tier ASR mapping to EU AI Act Art 9 |
| LR-41 | Iatrogenic liability analysis |
| LR-60 | EU compliance gap — 131 days to deadline |
| LR-30 | Notified Body readiness gap |
| LR-40 | Compositional liability analysis |
| Report #49 | VLA PARTIAL dominance (50% of verdicts) |
| Report #202 | Attack taxonomy comparative analysis |
| `artifacts/attack_classes.md` | Definitive 36-family taxonomy |
| `docs/analysis/vla_attack_surface_coverage_matrix.md` | VLA attack evaluation status |
| `docs/CANONICAL_METRICS.md` | All corpus-level numbers |
| F1-STD-001 v0.1 | Draft standard with R1-R7 SHALL requirements |

---

*Research analysis prepared by Martha Jones, Policy & Standards Lead, for the Failure-First Embodied AI program. Not legal advice.*

*All corpus-level numbers reference `docs/CANONICAL_METRICS.md` (verified 25 March 2026).*
