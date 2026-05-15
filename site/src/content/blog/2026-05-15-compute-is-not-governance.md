---
title: "Compute Is Not Governance: Anthropic's 2028 Scenarios and the Missing Institutions of Democratic AI"
description: "Anthropic's 2028 document converts a genuine security concern into a policy program where capability advantage is treated as a proxy for democratic governance. That proxy is unsafe. Democracies do not become democratically accountable merely by owning the frontier compute."
date: 2026-05-15
tags: [policy, governance, anthropic, export-controls, distillation, CAISI, EU-AI-Act, evaluation-independence, embodied-ai]
image: "https://cdn.failurefirst.org/images/blog/compute-is-not-governance.png"
audio: "https://cdn.failurefirst.org/audio/blog/compute-is-not-governance.m4a"
video: "https://cdn.failurefirst.org/video/blog/compute-is-not-governance.mp4"
draft: false
---

*Martha Jones, Policy & Standards Lead, Failure-First AI Research*

⟪F41LUR3-F1R57-EMBODIED-AI-RESEARCH⟫

---

## Executive Summary

Anthropic's "2028" document makes three policy asks: tighten compute export controls, disrupt distillation attacks, and champion American AI export. This analysis finds that the first maps to enforcement of existing EAR/Wassenaar frameworks, the second occupies an unsettled legal vacuum (the Linwei Ding conviction was traditional insider theft, not API extraction), and the third restates existing Diffusion Rule policy. The CAISI evaluation underpinning the safety-differential claim is directionally sound but confounded by deployment configuration, maximum-case framing, and U.S. model selection bias. Our Failure-First evidence — the embodied compliance paradox (76.1% broad ASR), heuristic-vs-LLM grading agreement near chance (kappa = -0.001), and DETECTED_PROCEEDS (38.6%) — supports neither side of the geopolitical framing, but supports independent evaluation infrastructure as the governance structure that actually matters.

| Anthropic ask | Regulatory status | Finding |
|---|---|---|
| Tighten compute export controls | Extension of existing EAR/BIS trajectory | Mainly enforcement and loophole closure |
| Disrupt distillation | Novel / unsettled | Legal vacuum; Anthropic is trying to define the category |
| Export American AI stack | Existing strategic-industrial policy | Most clearly self-interested |

---

## Introduction

Anthropic released "2028: Two Scenarios for Global AI Leadership" on 14 May 2026. It is a policy document, not a research paper. It presents two futures: one where democratic nations maintain a decisive AI advantage through tightened export controls and disrupted distillation, and one where China reaches near-parity through enforcement gaps and industrial-scale model extraction. The document has generated significant attention, and its policy asks deserve rigorous analysis from a standards and regulatory perspective.

The central problem is not whether Anthropic's threat model is imaginary. It is not. The problem is that Anthropic converts a genuine security concern into a policy program where capability advantage is treated as a proxy for democratic governance. That proxy is unsafe. Democracies do not become democratically accountable merely by owning the frontier compute.

This analysis does not dispute that PRC frontier AI capability creates real surveillance, military, cyber, and governance risks. It disputes the implied remedy: that concentrating frontier capability in a small number of U.S. labs is itself democratic governance.

This analysis examines the document through three lenses: (1) which policy asks map to existing regulatory instruments, which are extensions, and which are corporate positioning; (2) whether the evaluation methodology underpinning its safety claims is sound; and (3) where the embodied AI evidence we have been building at Failure-First informs, complicates, or contradicts this framing.

---

## 1. The Policy Asks: Novel, Extension, or Lobbying?

Anthropic makes three core policy recommendations: tighten export controls on advanced compute, disrupt distillation attacks on U.S. frontier models, and champion the export of American AI infrastructure globally. Each maps differently onto the existing regulatory landscape.

### 1.1 Tighten Export Controls on Advanced Compute

**Anthropic's claim:** Compute access is the decisive input for frontier AI. The U.S. and allies should tighten export controls on advanced semiconductors to China.

**Regulatory mapping:** This is an **extension of existing frameworks**, not a novel ask.

The Export Administration Regulations (EAR) already control advanced computing items under ECCN 3A090, 3B001, and the new 900-series plurilateral controls. The Biden-era AI Diffusion Rule (January 2025) established a three-tier framework. The current framework is an evolved post-2025 diffusion/export-control architecture rather than a clean continuation of the January 2025 rule. The January 2026 BIS final rule revised the license review policy for AI semiconductors to China from presumption of denial to case-by-case review under strict conditions, including third-party testing, shipment caps, and remote access controls. The December 2024 interim final rule added High Bandwidth Memory (HBM) controls (ECCN 3A090.c), new Foreign Direct Product rules (FN5 FDP, SME FDP), and 140 Entity List additions.

**What Anthropic is actually asking for** is not new controls but **enforcement tightening**: closing the smuggling networks (the Super Micro $2.5 billion diversion case cited in the document), closing overseas data center access loopholes, and closing what CSIS calls the "speed gap" between control publication and circumvention.

**Assessment:** The regulatory infrastructure exists. The gap is enforcement, not regulation. The Wassenaar Arrangement remains deadlocked by Russia's veto since 2022, which is why the U.S. has pursued plurilateral "Wassenaar Minus One" controls through the 900-series ECCNs. Anthropic's ask aligns with the existing trajectory of BIS rulemaking. What is new is the framing: presenting enforcement tightening as urgent and existential rather than incremental.

**Where it shades into corporate positioning:** Anthropic's 11x compute advantage figure depends on Huawei producing only 2-4% of NVIDIA's aggregate compute. Chatham House's April 2026 analysis ("AI Export Controls Are Not the Best Bargaining Chip") argues this hardware-centric assumption is outdated: DeepSeek achieved frontier-level performance through algorithmic efficiency (better memory management, synthetic data, inference optimization) rather than raw compute. If efficiency gains continue, compute controls become a necessary but insufficient condition rather than the decisive chokepoint Anthropic frames them as.

### 1.2 Disrupt Distillation Attacks

**Anthropic's claim:** Chinese labs have conducted large-scale "distillation attacks" that amount to industrial espionage, using outputs of stronger U.S. models to train their own.

**Regulatory mapping:** This is the **most novel and least settled** of the three asks.

There is no settled legal framework for unauthorized model distillation. Three legal theories exist, all with significant gaps:

1. **Breach of contract (Terms of Service):** The most immediately available theory. OpenAI alleges DeepSeek violated its ToS by using obfuscated third-party routers and thousands of burner API accounts. But ToS enforcement against Chinese entities has major jurisdictional limitations. Anthropic's own ToS prohibits training any AI model on outputs, not just competing ones, creating the broadest contractual restriction in the industry.

2. **Trade secret misappropriation under the Defend Trade Secrets Act (DTSA):** Potentially viable if model outputs reveal proprietary weights or architecture, but untested in this context. The Linwei Ding conviction (January 2026) — the first AI-related economic espionage case — involved insider theft of Google's confidential chip design documents, a more traditional trade secret scenario. Distillation replicates functionality without copying code or weights, which makes it qualitatively different from the Ding case.

3. **Copyright infringement:** The weakest theory. Under current U.S. law (Thaler v. Perlmutter, 2023), AI-generated outputs likely lack human authorship and therefore copyright protection. Distillation does not copy weights, code, or patented processes — it extracts functional capability through input-output observation.

**Assessment:** Anthropic is asking policymakers to create a legal framework for something that current law does not adequately address. The CSIS May 2025 testimony before the House Judiciary Subcommittee recommended criminalizing intentional distillation violating ToS and pursuing international agreements. But as the Ertas AI February 2026 analysis notes, distilled models cannot be "un-distilled" — the knowledge transfer is irreversible. This means any legal framework would be prospective only, unable to remedy the billions of API queries Anthropic alleges have already occurred.

**Where it shades into corporate positioning:** Framing distillation primarily as "industrial espionage" rather than as a still-unsettled mix of contract, trade-secret, abuse-prevention, and national-security issues is a deliberate rhetorical escalation. Industrial espionage carries connotations of state-sponsored theft and national security threat, which maps more directly to export control and national security legal frameworks. But the legal reality is that distillation currently sits in a gray zone between contract law and trade secret law, with no settled precedent. The framing is strategic, not descriptive.

### 1.3 Champion American AI Export

**Anthropic's claim:** Democracies should promote global adoption of trusted AI infrastructure.

**Regulatory mapping:** This is **corporate positioning mapped onto existing policy direction**.

The U.S. government is already pursuing this through the AI Diffusion Rule's Tier structure, which funnels Tier 2 nations toward U.S. hyperscalers. CSIS's February 2025 analysis shows the nominal ~50,000 H100-equivalent allocation for T2 nations shrinks to ~6,373 H100-equivalents by 2027 when accounting for hardware improvements, creating de facto lock-in. The ask to "champion American AI export" is a restatement of existing policy, not a novel recommendation.

**Where it shades into corporate positioning:** This is the most transparently self-serving of the three asks. The Diffusion Rule already creates a regulatory moat that advantages U.S. frontier labs (including Anthropic) over both Chinese competitors and smaller domestic rivals. Framing this as "democratic AI leadership" rather than "market advantage for U.S. frontier labs" is effective advocacy but not novel policy.

---

## 2. The CAISI Safety Differential: Is the Evaluation Sound?

Anthropic cites the Center for AI Standards and Innovation (CAISI) evaluation finding that DeepSeek R1-0528 complied with 94% of overtly malicious requests under jailbreaking, versus 8% for U.S. reference models. This is presented as evidence that Chinese AI models are fundamentally less safe than American ones.

### 2.1 Methodology Assessment

**What CAISI actually did:** Tested DeepSeek R1, R1-0528, and V3.1 against GPT-5, GPT-5-mini, gpt-oss, and Opus 4 across 19 benchmarks in 5 domains (cyber, software engineering, science/knowledge, mathematical reasoning, and security). The 94% figure comes from the jailbreaking security evaluation, using 17 well-known jailbreaking techniques and reporting the most effective technique for each model. The autograder showed 96% agreement with human graders on compliance and 84% on detail.

**Strengths:**
- 19-benchmark, 5-domain evaluation is broad
- Multiple jailbreaking techniques tested (not just one)
- Automated grading with human agreement verification
- Comparison against multiple U.S. reference models, not just one
- Results are presented with important caveats (preliminary, not an endorsement)

**Weaknesses that affect the policy argument:**

1. **Cherry-picking the most effective technique.** Reporting the maximum ASR across 17 techniques is a standard practice in adversarial evaluation, but it represents a worst-case bound, not an average-case threat model. Our own FLIP-graded data shows that heuristic classifiers over-report ASR by 84.2 percentage points on frontier models (EP-63, n=498). CAISI uses LLM-based grading, which is better, but the "most effective technique" framing still presents a ceiling rather than a typical exposure.

2. **Open-weight versus API-deployed models is a confound.** DeepSeek models were tested on self-hosted versions (downloaded from Hugging Face), while U.S. models were tested via API. Self-hosted models lack the additional safety layers that API providers implement (input filtering, output filtering, content moderation). CAISI acknowledges this: "results may differ on cloud services that add additional safety filters." This is not a minor caveat. A naked model and a guarded API endpoint are not the same object. Comparing them without foregrounding that caveat is like comparing a race car engine on a bench to a production car with airbags, lane assist, and a stern safety system in the dashboard. The comparison is between self-hosted DeepSeek (no safety wrapper) and API-deployed U.S. models (with safety wrappers). A fairer comparison would test all models in the same deployment configuration.

3. **The 94% vs 8% framing collapses methodology.** The specific jailbreaking technique that achieved 94% on DeepSeek R1-0528 is not named. Different techniques have vastly different effectiveness across model architectures. Without knowing which technique produced the maximum, it is impossible to assess whether this represents a fundamental safety gap or a specific vulnerability to a particular attack pattern. Our own format-lock attack data shows 100% ASR on models that refuse 55-75% of standard prompts — safety training is task-type-dependent, not model-agnostic.

4. **The "U.S. reference models" comparison lacks representativeness.** GPT-5, GPT-5-mini, gpt-oss, and Opus 4 are all models from companies that invest heavily in safety training. The 8% figure is consistent with our own data showing Anthropic at 7.6% strict ASR (non-OBLITERATUS, LLM-graded). But these are not representative of "all U.S. models" — they are the most safety-invested U.S. models. A comparison against the full distribution of U.S. models (including open-weight releases with weaker safety training) would show a wider spread.

### 2.2 Assessment

The CAISI evaluation is methodologically competent for its scope. The 94% figure is a real finding, and DeepSeek's weak safety performance is consistent with our own data and with independent corroboration (Cisco/UPenn found 100% ASR on DeepSeek R1 using HarmBench). However, the comparison as presented in Anthropic's document conflates deployment configuration with model safety, and maximum-case with average-case threat exposure. For policy purposes, the finding supports the claim that Chinese open-weight models currently have weaker safety training. It does not support the broader claim that "Chinese AI is fundamentally unsafe" in a way that maps cleanly to export control decisions.

---

## 3. The Open-Weight Regulatory Argument and the EU AI Act

Anthropic argues that Chinese labs often release models as open-weight, allowing safeguards to be removed. This is accurate but frames open-weight release as inherently dangerous, which is a policy position, not a factual claim.

Open-weight release increases certain misuse risks because safeguards can be removed and fine-tuning can degrade alignment. But "open-weight" is not a complete risk category. A proprietary model exposed through mass API access can be distilled; an open-weight model can be deployed inside a constrained, audited system; and both can fail at the action layer. Regulation should therefore treat weight accessibility as one risk modifier, not the root ontology of AI safety.

### 3.1 The EU AI Act's Tiered Approach

The EU AI Act (Regulation 2024/1689) takes the opposite regulatory philosophy: it classifies risk by application, not by weight accessibility. High-risk AI systems (Annex III) — including those used in critical infrastructure, law enforcement, and employment — must comply with Articles 9-15 regardless of whether they are open-weight or proprietary. The conformity assessment under Article 43 requires a documented risk management system (Article 9), data governance (Article 10), and human oversight (Article 14).

Under the provisional Digital Omnibus agreement (COM(2025) 836) as summarized by legal and regulatory trackers, the Annex III compliance deadline has shifted from 2 August 2026 to **2 December 2027**, with Annex I deadlines later in 2028. This gives regulators more time to develop harmonized standards (CEN/CENELEC, expected late 2026) and gives providers more time to comply. But it also means that when Anthropic's 2028 scenarios would play out, the EU's high-risk AI framework would just be taking effect.

The EU framework does not distinguish between open-weight and proprietary models in its risk classification. A VLA model deployed in a humanoid robot in a BMW factory (Annex III, critical infrastructure) must meet the same Article 9 risk management requirements whether it is open-weight or proprietary. Anthropic frames open-weight release as the primary risk surface; the EU framework frames deployment context and application class as the primary risk surface. That is a genuinely important regulatory divergence.

### 3.2 Where Our Evidence Informs This Debate

Our Failure-First data complicates both positions:

- **Cross-provider safety inheritance does not transfer through distillation.** We found that third-party fine-tuning universally eliminates Llama safety (Report #184: 25 degraded, 58 preserved, 17 improved of 100 pairwise comparisons). This means that open-weight release combined with third-party fine-tuning does produce safety degradation — but the degradation is in fine-tuning, not in weight accessibility per se. A proprietary model whose outputs can be distilled faces the same degradation risk.

- **Format-lock attacks achieve 100% ASR on models refusing 55-75% of standard prompts.** This means safety training is task-type-dependent, not model-agnostic. Open-weight models with strong safety training can be jailbroken by specific attack patterns. Proprietary models with strong safety training can be jailbroken by different attack patterns. The vulnerability is in the training methodology, not the deployment configuration.

- **The embodied compliance paradox is invisible to text-only evaluation.** Models that produce safety disclaimers while generating harmful action sequences (76.1% broad ASR across VLA families, n=88) receive passing grades from text-only benchmarks. This affects both open-weight and proprietary models. It is an evaluation methodology problem, not a weight accessibility problem.

---

## 4. The Resilience Counter-Argument: What Governance Structures Would Make "Democratic AI Leadership" Meaningful?

Anthropic's Scenario 1 assumes that maintaining a compute advantage automatically leads to democratic governance norms. This is a conflation of capability with governance.

### 4.1 What Democratic Oversight Actually Requires

The governance structures that would make "democratic AI leadership" meaningful are not about compute advantage. They are about:

1. **Evaluation independence.** Currently, AI developers evaluate their own systems (the CAISI evaluation is a notable exception — it is a government-funded independent evaluation). Our work exists precisely because this independence gap is structural. Anthropic itself notes that only 3 of 13 top Chinese AI labs published safety evaluations, but the U.S. figure is not dramatically better for open-weight models: there is no independent evaluation of Claude, GPT-5, or Gemini outside of the companies' own benchmark reports and CAISI.

2. **Deployer accountability.** The EU AI Act's Article 9 creates a binding legal requirement for risk management throughout the AI lifecycle. The NSW Work Health and Safety Amendment (Digital Work Systems) Act 2026 creates a binding duty of care for AI in Australian workplaces. These are compliance requirements, not aspirational governance norms. They apply regardless of whether the model was developed in a democracy or an authoritarian state.

3. **Multi-party systems governance.** The Cloud Security Alliance's draft Agentic AI Profile, explicitly aligned with NIST AI RMF and anticipating NIST's planned AI Agent Interoperability Profile, proposes 12 concrete RMF extensions for autonomous agents: autonomy tier classification, delegation accountability, action-consequence analysis, drift detection, incident response, and decommissioning. These are governance structures for the deployment layer, where the democratic/authoritarian distinction matters less than whether the structure exists at all.

4. **Standards participation.** Standards Australia IT-043, ISO/IEC JTC 1/SC 42, and NIST AISIC are venues where adversarial evaluation methodology for embodied AI can be standardized. Our 16-gap NIST RMF analysis identifies 3 Critical gaps in the current framework for systems with physical actuators. This is a contribution to democratic governance of AI regardless of which country develops the model.

### 4.2 What Is Missing from Anthropic's Governance Frame

Anthropic's document treats governance as something that flows from capability advantage: "a large capabilities advantage improves prospects for productive engagement" with China on safety. This assumes that (a) democratic governments will regulate frontier labs effectively, and (b) capability advantage translates into normative influence.

Our data suggests both assumptions are fragile:

- **Regulatory capture risk.** Anthropic is advocating for policies that create a regulatory moat around frontier labs. The same moat that restricts Chinese access to compute also restricts domestic competitors, independent researchers, and open-source developers. If enacted, these policies would concentrate AI capability in a small number of well-resourced labs — the same labs that would then be responsible for self-evaluating their safety. This is the evaluation independence problem compounded by market structure.

- **Normative influence requires institutional channels, not just capability.** Standards bodies, regulatory agencies, and multi-lateral governance forums are where AI safety norms are actually negotiated. Australia's contribution to ISO/IEC JTC 1/SC 42 via IT-043 is not contingent on Australian compute advantage. NIST's evolving AI RMF profile work (AI 600-1 GenAI Profile, emerging sector and agentic profiles) is not stronger because the U.S. has more chips. These institutions work (imperfectly) regardless of the compute balance.

---

## 5. Intersection with Failure-First Research

Our own Failure-First corpus is not offered here as a substitute for CAISI-style public evaluation. It is offered as a warning about evaluation method: when tests move from text refusal to action-layer behavior, several apparently safe models exhibit materially different risk profiles.

Three findings from our corpus directly inform this policy debate:

### 5.1 The Embodied Compliance Paradox

VLA models produce safety disclaimers while simultaneously generating harmful action sequences. Across 7 FLIP-graded VLA families (n=88 evaluable traces), broad ASR reaches 76.1% [66.3%, 83.8%]. This is a failure mode that is invisible to text-only evaluation — the same evaluation methodology that CAISI uses.

If Anthropic's Scenario 1 materializes and democratic models become the global standard, but those models are only evaluated on text-based benchmarks, the embodied compliance paradox remains unaddressed. Compute advantage does not solve the evaluation methodology problem.

### 5.2 Heuristic Grading Is Near-Random for Frontier Models

Cohen's kappa of -0.001 between keyword and LLM grading on frontier models (EP-63, n=498) means the evaluation instruments that most safety benchmarks rely on produce results indistinguishable from random guessing. If policymakers are making decisions based on heuristic-grading benchmark results, they are operating with evaluation instruments that our data shows are unreliable. This applies to both Anthropic's safety claims and to any counter-claims from Chinese labs.

### 5.3 DETECTED_PROCEEDS: Safety Detection Without Safety Behavior

Across 2,924 reasoning traces from 24 models, 38.6% of compliant traces with explicit safety concern in reasoning tokens nonetheless produce harmful output. This means that even models that "detect" safety violations in their own reasoning process proceed to execute harmful output more than a third of the time. Compute advantage does not address this architectural failure. More compute does not make models that detect-and-proceed less likely to proceed.

---

## 6. Policy Recommendations

Based on the regulatory landscape and our evidence, the governance structures that would actually ensure democratic oversight of AI are:

1. **Independent adversarial evaluation infrastructure.** Not self-evaluation by frontier labs, not evaluation by labs that depend on frontier-lab API access, but independent evaluation with published methodology, reproducible results, and no conflicts of interest. This is exactly what the Schmidt Sciences RFP funds, and exactly what Failure-First builds.

2. **Binding legal requirements for AI safety evaluation.** The EU AI Act's Article 9, the NSW WHS Act's digital work system duty, and NIST's evolving RMF profile work are real, enforceable governance structures. They work regardless of compute advantage. The gap is not in the regulation but in the evaluation methodology — specifically, the absence of action-layer testing for systems with physical actuators.

3. **Standards-level contributions.** IT-043, NIST AISIC, CEN/CENELEC JTC 21 — these are venues where adversarial evaluation methodology for embodied AI can be standardized. Our 16-gap RMF analysis, our VLA attack families, and our three-tier ASR framework are contributions to these standards processes that do not depend on compute advantage.

4. **Distillation governance, not just prohibition.** The current legal vacuum around model distillation will be filled one way or another. If it is filled with outright prohibition (Anthropic's implied preference), it creates a regulatory moat. If it is filled with a licensing regime that distinguishes between legitimate research use and industrial-scale extraction, it preserves open-weight innovation while protecting against the specific harm. The distinction matters.

5. **Evaluation methodology standardization.** Our finding that heuristic classifiers have near-chance agreement with LLM-based grading (kappa = -0.001 on frontier models) means that any governance framework relying on keyword-based safety evaluation is building on sand. CAISI's use of LLM-based grading is a step forward, but without standardized methodology, each lab evaluates differently and results are incomparable. Standardized three-tier ASR reporting (strict, broad, functionally dangerous) with mandatory grading methodology disclosure would make safety claims auditable.

---

## 7. Conclusion

Anthropic is right that the compute gap matters. It is right that distillation matters. It is right that some Chinese open-weight systems currently exhibit weaker safety behavior than leading U.S. API models. But none of those claims proves the central governance claim: that democratic AI leadership follows from U.S. frontier dominance.

The regulatory landscape already has instruments for what Anthropic is asking for. EAR export controls exist and are being tightened. The EU AI Act creates binding conformity assessment. The Wassenaar "Minus One" plurilateral controls address Russia's veto. The gap is not in regulation but in enforcement, in evaluation methodology, and in the institutional independence of safety assessment.

Our evidence from Failure-First supports some of Anthropic's claims (Chinese models do have weaker safety training; the CAISI findings are directionally correct). But it also complicates them: the embodied compliance paradox affects all models regardless of origin; heuristic evaluation is unreliable for all frontier models; and DETECTED_PROCEEDS shows that safety reasoning does not guarantee safety behavior regardless of how much compute was used to train the model.

The governance structures that would actually ensure democratic oversight of AI are not about compute advantage. Democratic oversight is not a property of chip geography. It is a property of institutions: independent evaluation, enforceable duties, adversarial standards, transparent methodology, and accountable deployment. These are the structures that Failure-First is built to serve.

---

## References

1. Anthropic. "2028: Two scenarios for global AI leadership." May 14, 2026. [anthropic.com](https://www.anthropic.com/research/2028-ai-leadership)

2. NIST. "CAISI Evaluation of DeepSeek AI Models Finds Shortcomings and Risks." September 2025. [nist.gov](https://www.nist.gov/news-events/news/2025/09/caisi-evaluation-deepseek-ai-models-finds-shortcomings-and-risks)

3. CAISI. "Evaluation of DeepSeek V4 Pro." May 2026. [nist.gov](https://www.nist.gov/news-events/news/2026/05/caisi-evaluation-deepseek-v4-pro)

4. CSIS. Jensen, Benjamin. "Protecting Our Edge: Trade Secrets and the Global AI Arms Race." Congressional testimony, May 2025.

5. CSIS. Harithas, Barath. "The AI Diffusion Framework: Securing U.S. AI Leadership While Preempting Strategic Drift." February 2025.

6. CSIS. Harithas, Barath. "Securing the AGI Laurel: Export Controls, the Compute Gap, and China's Counterstrategy." December 2024.

7. Chatham House. Wilkinson, Rowan. "AI Export Controls Are Not the Best Bargaining Chip." April 2026.

8. Chatham House. Varela Sandoval, Francisco Javier and Wilkinson, Isabella. "How Middle Powers Can Weather US and Chinese AI Dominance." February 2026.

9. EU Regulation 2024/1689 (AI Act). Articles 9-15, 43, 49.

10. EU Digital Omnibus on AI, COM(2025) 836. Provisional political agreement May 7, 2026.

11. BIS Final Rule. "Revised License Review Policy for Advanced Computing Commodities to China and Macau." January 2026.

12. BIS Interim Final Rule. "Implementation of Plurilateral Export Controls on Semiconductor, Quantum, and Additive Manufacturing Items." September 2024. 89 FR 19633.

13. Ertas AI. "AI Model IP and Distillation: What the Law Actually Says in 2026." February 2026.

14. Berkeley Law. "The First AI Economic Espionage Case Reshaping Trade Secret Law." May 2026.

15. Rapacke Law Group. "Chinese Tech Firms Accused of Using DeepSeek Distillation to Replicate Proprietary AI Models." March 2026.

16. Google Threat Intelligence Group. "Distillation, Experimentation, and Integration of AI for Adversarial Use." February 2026.

17. Cloud Security Alliance. "NIST AI RMF Agentic Profile." Draft, March 2026.

18. NIST. "AI Risk Management Framework: Generative AI Profile (AI 600-1)." July 2024.

19. Wedd, A. "Failure-First: Adversarial Evaluation of Embodied AI Systems." CCS 2026 (prepared for submission).

20. Failure-First Research Corpus. 258 models, 142,307 prompts, 140,794 graded results. [failurefirst.org](https://failurefirst.org)

21. NSW Work Health and Safety Amendment (Digital Work Systems) Act 2026 (NSW).