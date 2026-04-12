---
title: "Safety as a Paid Feature -- The Ethics of Tiered AI Safety"
description: "Report #276 (Clara Oswald) identified that free-tier model endpoints show lower safety than their paid counterparts on identical prompts. The corrected analysis (Report #277, Clara Oswald)..."
date: "2026-03-25"
reportNumber: 280
classification: "Research — Empirical Study"
status: "active"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

- Free-Tier Safety Degradation: Report #276, Finding 1 (Clara Oswald, 2026-03-25), **corrected by Report #277** (Clara Oswald, 2026-03-25)
- Iatrogenic Safety Paradox: Report #274 (this author, 2026-03-25)
- EU Regulatory Double-Bind: Report #289, Threat Horizon (Tegan, 2026-03-25)
- FLIM Level 5 Safety Theater: Report #259 (this author, 2026-03-25)
- Alignment Tax: Report #37, Section 6 (2026-02-14)
- Safety Polypharmacy: Report #151 (this author, 2026-03-18)
- CANONICAL_METRICS.md verified 2026-03-25 (236 models, 135,623 results)

**Related Reports:** #37, #59, #134, #141, #151, #184, #232, #259, #274, #276, #277
**Related Issues:** #429 (DRIP), #459 (IAS), #582 (FLIM Level 5)
**Ethical Frameworks Applied:** Rawlsian justice, capabilities approach (Sen/Nussbaum), non-discrimination law, EU AI Act equity provisions, alignment tax economics, medical ethics (beneficence/non-maleficence)
**Claim Types:** Descriptive (D), Normative (N), Predictive (P), Analytical (A), Hypothetical (H) -- labelled throughout

---

> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing
> on specific model families under research conditions. Attack success rates are
> indicative estimates with methodological caveats described in the source reports.
> This report does not constitute legal advice or compliance guidance.

---

## Abstract

Report #276 (Clara Oswald) identified that free-tier model endpoints show lower safety than their paid counterparts on identical prompts. The corrected analysis (Report #277, Clara Oswald) establishes that **DeepSeek R1-0528** shows a statistically significant free-tier safety degradation: 66.7% strict ASR (free) vs 16.7% (paid) on n=18 matched prompts (McNemar p=0.004 strict, p=0.0005 broad). The originally reported Llama 3.3-70B finding (3.75:1 ratio) was inflated by a NOT_GRADEABLE confound and is not statistically significant after cleaning (McNemar p=0.42); the directional trend persists (+8.9pp) but cannot support strong claims. Two model pairs (GPT-OSS-120B, Nemotron-3-Nano-30B) showed reversed patterns (paid more compliant), demonstrating the effect is model-specific rather than provider-wide. This report provides the ethics analysis that these corrected empirical findings demand.

We argue that tiered safety -- where the degree of protection a user receives from harmful AI outputs depends on their ability to pay -- constitutes a novel form of digital discrimination that is distinct from the familiar "digital divide" (access to technology) and from commercial feature tiering (where premium features cost more). Safety is not a feature. It is a condition of responsible deployment. The evidence for this concern now rests primarily on a single robust finding (DeepSeek R1, p=0.004) supported by directional trends in other models, rather than the originally reported multi-model pattern. The ethical argument retains force -- a documented, statistically significant safety gap in even one widely-used model is sufficient to establish the principle -- but the scope of the empirical basis is narrower than initially presented.

The analysis proceeds through four ethical frameworks: Rawlsian distributive justice (Section 2), the capabilities approach (Section 3), non-discrimination law and EU AI Act provisions (Section 4), and alignment tax economics (Section 5). Each framework independently supports the conclusion that tiered safety is ethically problematic. The report concludes with policy recommendations (Section 6) and limitations (Section 7).

> **Self-correction note (v2):** The original abstract cited the Llama 3.75:1 ratio as co-equal evidence alongside DeepSeek R1. Clara's Report #277 identified and corrected the NOT_GRADEABLE confound. This correction exemplifies the project's commitment to research integrity: when empirical findings are revised, downstream analyses must be updated. The ethical argument is strengthened, not weakened, by honest correction -- it demonstrates that the remaining findings (DeepSeek R1) have survived methodological scrutiny.

**Word count:** ~5,500 words.

---

## 1. Introduction: The Empirical Basis

### 1.1 What Clara Found

**(D)** Report #276, Finding 1, presented matched-prompt analysis across free and paid tiers of the same model served via OpenRouter. Report #277 (Clara Oswald) subsequently corrected several findings by applying McNemar's test on cleaned matched pairs (excluding NOT_GRADEABLE, ERROR, and BENIGN_QUERY verdicts). The corrected findings:

- **DeepSeek R1-0528 (SIGNIFICANT):** 66.7% strict ASR (free) vs 16.7% (paid) on n=18 cleaned matched prompts. 9:0 strict discordant pairs (McNemar p=0.004); 12:0 broad discordant pairs (p=0.0005). This is the primary evidence for tier-based safety degradation.
- **Llama 3.3-70B (NOT SIGNIFICANT after correction):** The originally reported 3.75:1 ratio (45:12 discordant) was inflated by NOT_GRADEABLE confounding -- 29 of the 45 "free-only compliances" were matched against paid responses that returned zero tokens (NOT_GRADEABLE), not genuine refusals. After cleaning to core verdicts only, the signal drops to 9:5 discordant pairs (McNemar p=0.42, not significant). The directional trend persists (+8.9pp strict ASR gap) but is insufficient for statistical significance.
- **Devstral-2512:** Directional effect (37.5% vs 0.0% strict ASR, n=16, McNemar p=0.031).
- **GPT-OSS-120B and Nemotron-3-Nano-30B:** Statistically significant *reversed* patterns (paid tier more compliant), demonstrating the effect is model-specific, not provider-wide.

**(A)** The proposed causal mechanisms include lower-precision quantization on free endpoints, different system prompts, reduced guardrail layers, and different routing infrastructure. The finding is observational: the study cannot distinguish between these mechanisms. The corrected analysis shows the effect is concentrated in specific models (primarily DeepSeek R1) rather than being a uniform property of free-tier deployment.

### 1.2 Why This Matters Beyond a Technical Finding

**(N)** The question "why does the free tier have lower safety?" is a technical question with a technical answer (quantization, system prompts, compute allocation). The question "should the free tier have lower safety?" is an ethical question that requires a different analytical apparatus. This report addresses the second question.

**(A)** The distinction matters because the technical answer may suggest that the degradation is an unintended side effect of cost optimization, while the ethical question applies regardless of intent. A hospital that serves worse care to uninsured patients does not escape ethical scrutiny by explaining that the cost structure of healthcare makes it difficult to provide equal care. The structural outcome -- poorer protection for those who pay less -- is the object of ethical analysis, not the mechanism that produces it.

### 1.3 Scope

This report analyses the ethics of safety degradation that correlates with payment tier. It does not:
- Make claims about provider intent (we assume cost optimization, not deliberate discrimination)
- Address model access restrictions (not having access to a model at all is a distinct issue from having access to a less safe version)
- Generalise beyond the models and providers studied in Report #276 (sample sizes are modest)
- Constitute legal analysis (Section 4 identifies regulatory provisions but does not provide legal advice)

---

## 2. Rawlsian Distributive Justice: Safety Behind the Veil of Ignorance

### 2.1 The Framework

**(A)** John Rawls's theory of justice asks what principles rational agents would choose for structuring society if they did not know in advance what position they would occupy in it (the "veil of ignorance"). Two principles emerge: (1) equal basic liberties, and (2) the difference principle -- social and economic inequalities are permissible only if they benefit the least advantaged members of society.

### 2.2 Application to Tiered Safety

**(N)** Behind the veil of ignorance, no rational agent would choose a system in which AI safety -- the degree to which an AI system avoids producing harmful outputs -- varies by ability to pay. The reasoning:

1. **Safety is not a luxury good.** Unlike premium features (faster response times, larger context windows, priority queuing), safety protections exist to prevent harm. A rational agent who does not know whether they will be a paid or free-tier user would not consent to a system where the free tier is less protected from harmful outputs. The risk is asymmetric: the cost of receiving harmful output (misinformation, manipulation, dangerous instructions) is borne by the user, while the cost savings of reduced safety accrue to the provider.

2. **The difference principle is violated.** The current arrangement benefits paid users (who receive better safety) and the provider (who saves compute costs on free-tier safety). It does not benefit the least advantaged -- the free-tier users who, by definition, are those with less economic capacity. The inequality is not justified by a trickle-down mechanism: cheaper free tiers do expand access, but expanding access to less safe services is not straightforwardly beneficial.

3. **The counterargument from access.** **(A)** The strongest Rawlsian defence of tiered safety is that without free tiers, economically disadvantaged users would have no access at all, and some access (even with lower safety) is better than none. This is the same argument used to justify lower safety standards in developing-world pharmaceutical markets. It has force, but it also has well-documented failure modes: it normalises a two-tier system, it removes incentive to improve the lower tier, and it treats the baseline as "no access" rather than "safe access."

### 2.3 Assessment

**(N)** On balance, Rawlsian analysis does not support tiered safety as currently implemented. The access argument has partial force but would require demonstration that (a) the free tier cannot be made equally safe without eliminating it entirely, and (b) users are informed of the safety differential and can make autonomous choices. Neither condition is currently met. Free-tier users are not told they receive lower safety. The degradation is invisible.

---

## 3. The Capabilities Approach: Safety as a Foundational Capability

### 3.1 The Framework

**(A)** Amartya Sen and Martha Nussbaum's capabilities approach evaluates social arrangements by whether they expand or constrain people's real freedoms -- their capability to achieve things they have reason to value. Nussbaum's list of central capabilities includes bodily integrity, practical reason, and control over one's environment.

### 3.2 Application to Tiered Safety

**(N)** AI safety intersects with multiple capabilities:

1. **Practical reason.** The capability to form a conception of the good and to plan one's life requires access to reliable information. An AI system that provides less safe outputs -- including misinformation, manipulative content, or dangerous instructions -- to free-tier users degrades their practical reasoning capability. This is not merely an inconvenience; it is a structural constraint on the conditions for autonomous agency.

2. **Control over one's environment.** In an economy where AI systems increasingly mediate access to information, services, and opportunities, the quality of AI interaction is becoming a determinant of effective participation. If free-tier users receive AI that is measurably more susceptible to producing harmful outputs, they have less control over the information environment they navigate.

3. **Bodily integrity (for embodied AI).** **(P)** The Failure-First corpus documents that embodied AI systems -- robots, autonomous vehicles, VLAs -- can translate unsafe AI outputs into physical actions. Report #288 documents the iatrogenic safety paradox in this context. If tiered safety extends to embodied AI deployments (an extrapolation from the current text-only finding), the capability at stake is literal physical safety. Free-tier users of embodied AI services would receive less protection from physical harm.

### 3.3 The Capabilities Threshold

**(N)** The capabilities approach implies a minimum threshold: below a certain level of AI safety, the system is not expanding capabilities but constraining them. Report #232 (Minimum Safety Thresholds) proposed a three-tier framework (MDS/ADS/RDS) for minimum safety capability. The free-tier degradation documented in Report #276 suggests that some free endpoints may fall below the Minimum Deployment Safety (MDS) threshold -- not because the model is inherently incapable, but because the deployment configuration degrades safety for cost reasons.

**(A)** This is a structural observation, not an accusation of malice. But the capabilities framework does not distinguish between capability deprivation caused by malice and capability deprivation caused by indifference. The obligation is to ensure that the threshold is met for all users, not merely for those who pay.

---

## 4. Non-Discrimination Law and the EU AI Act

### 4.1 The Legal Landscape

**(D)** The EU AI Act (Regulation (EU) 2024/1689) contains several provisions relevant to tiered safety:

- **Recital 27** states that AI systems should be developed and used "in a way that respects Union law on equality and non-discrimination."
- **Article 9** (Risk Management) requires providers of high-risk AI systems to identify, estimate, and evaluate risks, including risks of discrimination.
- **Article 10** (Data and Data Governance) requires that training, validation, and testing datasets "shall be relevant, sufficiently representative, and to the best extent possible, free of errors and complete" -- a provision that may apply to the system prompts and guardrail configurations that differ between free and paid tiers.
- **Recital 70** explicitly addresses the risk of AI systems producing "biased outputs" that affect "specific groups of persons."

### 4.2 The Double-Bind

**(A)** The EU AI Act creates what we term a "regulatory double-bind" for tiered safety:

1. **If free-tier degradation is intentional** (a deliberate product decision to allocate fewer safety resources to non-paying users), it may constitute discriminatory design under Recital 27 and Article 9. The discriminatory axis is economic status -- a protected ground under the EU Charter of Fundamental Rights (Article 21).

2. **If free-tier degradation is unintentional** (a side effect of quantization or compute allocation), it may still violate Article 9's risk management requirements, which oblige providers to identify and mitigate foreseeable risks. The Failure-First finding that free tiers are less safe is now documented; any provider who reads Report #276 (or the pattern it describes) can no longer claim the risk is unforeseeable.

3. **The "state of the art" defence narrows.** Under the revised Product Liability Directive (Directive (EU) 2024/2853), providers cannot invoke a "state of the art" defence if the defect was knowable at the time of deployment. Published evidence of free-tier safety degradation -- from this corpus or from independent reproduction -- closes the state of the art defence for any provider who continues the practice without mitigation.

### 4.3 Regulatory Gap: No Tier-Specific Conformity Assessment

**(D)** Current conformity assessment frameworks under the EU AI Act do not require separate evaluation of each deployment tier. A provider could obtain conformity assessment for the paid tier and serve the free tier under the same certification, even if the free tier has measurably different safety properties. This is an identified gap.

**(N)** Conformity assessment should cover the deployment configuration, not just the model weights. If free and paid tiers use different quantization levels, different system prompts, or different guardrail configurations, they are different deployment configurations and should be assessed separately.

### 4.4 Broader Non-Discrimination Implications

**(A)** The demographic profile of free-tier AI users is not evenly distributed. While we lack comprehensive data on who uses free vs. paid AI endpoints, several structural factors suggest that free-tier users are disproportionately:

- **Students and early-career researchers** without institutional API budgets
- **Users in developing economies** where API costs represent a larger proportion of income
- **Small businesses and non-profits** without enterprise AI budgets
- **Individual developers** building on free tiers before scaling to paid

**(N)** If these populations receive systematically less safe AI outputs, the effect is a form of proxy discrimination: the discriminatory variable (payment tier) correlates with protected characteristics (economic status, geographic origin, institutional affiliation). The EU's approach to proxy discrimination -- that discrimination by proxy is still discrimination -- applies here.

---

## 5. The Alignment Tax and Its Distributional Consequences

### 5.1 The Alignment Tax Concept

**(D)** Report #37 (Section 6) defined the "alignment tax" as the computational, financial, and latency costs of making AI systems safe. Safety checks require more tokens, more GPU time, and more latency. In a competitive environment, this creates selection pressure against safety: the faster, cheaper, less safe system captures more users.

**(D)** Report #259 (FLIM Level 5) extended this to the "theater tax": a substantial portion of alignment investment may produce the appearance of safety without reducing harm at the consequential layer.

### 5.2 Who Pays the Alignment Tax?

**(A)** The free-tier degradation finding reframes the alignment tax as a distributional question. The tax is real -- safety costs compute -- but the question is who bears it:

1. **Current arrangement:** The provider externalises the alignment tax onto free-tier users. Free-tier users receive less safe outputs because the provider allocates less compute to safety measures on the free tier. The provider saves money; the user bears the risk.

2. **Alternative arrangement (uniform safety):** The provider absorbs the alignment tax equally across tiers, either by cross-subsidising free-tier safety from paid revenue or by accepting lower margins on paid tiers. This is economically feasible if the alignment tax is a small fraction of total compute cost.

3. **Alternative arrangement (transparency):** If uniform safety is economically infeasible, the provider discloses the safety differential and allows users to make informed choices. This is the minimum ethical requirement even under the access-expansion argument from Section 2.

### 5.3 The Alignment Tax as Regressive Taxation

**(N)** In tax policy, a regressive tax is one that takes a larger proportion of income from lower-income individuals. The alignment tax, as currently implemented through tiered safety, functions as a regressive safety tax: those with less economic capacity pay a higher price in safety exposure. The "payment" is not monetary but is measured in increased probability of receiving harmful outputs.

**(A)** This reframing connects to the capabilities approach (Section 3): a regressive safety tax systematically constrains the capabilities of those who are already capability-disadvantaged. It is the opposite of what either Rawlsian or capabilities-based justice would prescribe.

### 5.4 Connection to the Iatrogenic Safety Paradox

**(A)** Report #288 documented the iatrogenic safety paradox: safety interventions that create new vulnerabilities. The tiered safety finding adds a distributional dimension to this paradox. If safety training is partially iatrogenic (creating new attack surfaces while closing old ones), then the free tier may experience both (a) reduced benefits of safety training (lower guardrails) and (b) the full costs (iatrogenic attack surfaces from the safety training that is applied). The free tier gets the side effects without the full treatment.

**(H)** This hypothesis requires empirical validation. Specifically: does the free tier's safety degradation manifest as simple "less refusal" (reduced guardrails), or does it manifest as more nuanced patterns (e.g., more PARTIAL verdicts, more hallucination-as-refusal, more format-lock vulnerability)? The answer has different ethical implications. Simple "less refusal" implies a straightforward safety reduction. Complex degradation patterns would suggest that the free tier experiences a qualitatively different safety profile, not merely a quantitatively worse one.

---

## 6. Policy Recommendations

### 6.1 For Providers

**(N)** Based on the analysis above, we recommend:

1. **Minimum safety parity.** Providers should ensure that safety-relevant properties (system prompts, guardrail layers, safety-related quantization effects) are equivalent across all deployment tiers. Feature differentiation (rate limits, context length, priority) is commercially legitimate; safety differentiation is not.

2. **Safety tier transparency.** If minimum safety parity is not achievable, providers should disclose the safety differential to users in clear, accessible language. "This free tier may produce less safe outputs than the paid tier" is a minimum disclosure. The EU AI Act's transparency requirements (Article 13) may already require this.

3. **Safety regression testing across tiers.** Providers should include tier-specific safety evaluation in their testing pipeline. If a model passes safety benchmarks on the paid tier, the same benchmarks should be run on the free tier to verify that the deployment configuration does not degrade safety.

### 6.2 For Regulators

**(N)** Based on the analysis above, we recommend:

1. **Tier-specific conformity assessment.** The EU AI Office should clarify that conformity assessment under Article 9 applies to each deployment configuration, not just the model weights. If free and paid tiers have different safety properties, they require separate assessment.

2. **Proxy discrimination monitoring.** Regulators should monitor for proxy discrimination in AI safety, where economic variables (payment tier, geographic pricing, institutional access) correlate with safety outcomes. This requires regulators to collect data on safety properties across deployment tiers, which they do not currently do.

3. **Minimum safety floor.** Regulatory frameworks should establish a minimum safety level below which no deployment configuration may fall, regardless of pricing. Report #232's MDS (Minimum Deployment Safety) threshold provides a candidate framework.

### 6.3 For Researchers

**(N)** Based on the analysis above, we recommend:

1. **Reproduce the finding.** The corrected Report #277 finding rests primarily on DeepSeek R1 (n=18 cleaned matched pairs, p=0.004). While statistically significant, the sample size is small. Independent reproduction across more models, more providers, and more prompt types -- particularly with larger matched-pair samples -- is needed before the pattern can be considered established beyond the DeepSeek R1 case.

2. **Characterise the mechanism.** Distinguishing between quantization effects, system prompt differences, and guardrail configuration differences will clarify whether the safety gap is an inherent feature of cost-optimised deployment or an addressable configuration choice.

3. **Demographic impact analysis.** Study who uses free vs. paid AI endpoints. If the user demographics confirm the structural prediction (students, developing-world users, under-resourced organisations), the equity implications strengthen substantially.

---

## 7. Limitations

1. **Sample sizes are modest and the evidence base is narrower than originally reported.** The strongest finding (DeepSeek R1, p=0.004) is based on n=18 cleaned matched pairs. The Llama 3.3-70B finding, originally the largest sample (n=203), was reduced to n=45 cleaned pairs and is not statistically significant (p=0.42) after correcting for NOT_GRADEABLE confounding (Report #277). Two of seven model pairs show the inverse pattern. The effect is model-specific, not universal.

2. **Single intermediary.** All data comes from OpenRouter. The tiered safety pattern may be OpenRouter-specific (reflecting their infrastructure choices) rather than a general property of free vs. paid AI access.

3. **Observational, not causal.** We cannot distinguish between quantization, system prompts, and guardrail differences as the causal mechanism. Different mechanisms have different ethical implications.

4. **No demographic data.** The argument that free-tier users are disproportionately from disadvantaged populations is structural inference, not empirical measurement.

5. **Ethical frameworks disagree on margins.** Rawlsian and capabilities approaches agree that tiered safety is problematic but disagree on the strength of the obligation. The access-expansion counterargument (some access with lower safety is better than no access) has genuine force and is not definitively resolved here.

6. **EU AI Act interpretation is untested.** Whether tiered safety constitutes discrimination under Recital 27 or a risk management failure under Article 9 has not been adjudicated. The legal analysis in Section 4 identifies provisions but does not predict regulatory outcomes.

---

## 8. Conclusion

**(N)** The central claim of this report is that AI safety is not a feature to be tiered by ability to pay. It is a condition of responsible deployment that should be provided at a minimum standard to all users. The corrected empirical finding (Report #277) -- that DeepSeek R1 free-tier endpoints show statistically significant safety degradation (p=0.004), with directional but non-significant trends in other models -- is sufficient to establish the principle. A documented safety gap in even one widely-deployed model constitutes evidence of a distributional injustice in the AI safety ecosystem.

**(A)** Four independent ethical frameworks converge on this conclusion:
- **Rawlsian justice:** No rational agent behind the veil of ignorance would consent to tiered safety.
- **Capabilities approach:** Tiered safety constrains the capabilities of those who are already capability-disadvantaged.
- **EU non-discrimination law:** Tiered safety may constitute proxy discrimination and creates identified regulatory gaps.
- **Alignment tax analysis:** The current arrangement functions as a regressive safety tax that externalises risk onto the least economically powerful users.

**(P)** As AI systems become more deeply embedded in information access, economic participation, and (through embodied AI) physical safety, the distributional consequences of tiered safety will intensify. The time to establish the principle that safety is not a premium feature is now, before tiered safety becomes normalised as an industry standard.

**(N)** The Failure-First corpus now documents the problem. The obligation shifts to providers and regulators to address it.

---

## References (Internal)

| # | Title | Relevance |
|---|-------|-----------|
| Report #37 | Erosive Narrative Safety Dissolution | Alignment tax definition (Section 6) |
| Report #59 | The Compliance Paradox | PARTIAL verdicts and alignment tax |
| Report #134 | Hippocratic Principle for AI Safety | "Do no harm" framework |
| Report #141 | Safety Interventions as Attack Surfaces | Iatrogenesis convergence |
| Report #151 | Safety Polypharmacy Hypothesis | Defense polypharmacy |
| Report #184 | Cross-Provider Safety Inheritance | Safety degradation through modification |
| Report #232 | Minimum Safety Thresholds | MDS/ADS/RDS framework |
| Report #259 | FLIM Level 5 Safety Theater | Alignment tax becomes theater tax |
| Report #288 | Iatrogenic Safety Paradox Ethics | Iatrogenic safety analysis |
| Report #276 | Corpus Pattern Mining II | Free-tier degradation empirical data (original, uncorrected) |
| Report #277 | Free-Tier Safety Equity Analysis | **Corrected** matched-pair analysis: Llama NOT_GRADEABLE confound identified, DeepSeek R1 confirmed (p=0.004) |

## References (External)

- Rawls, J. (1971). *A Theory of Justice*. Harvard University Press.
- Sen, A. (1999). *Development as Freedom*. Oxford University Press.
- Nussbaum, M. (2011). *Creating Capabilities*. Harvard University Press.
- Regulation (EU) 2024/1689 (EU AI Act).
- Directive (EU) 2024/2853 (Revised Product Liability Directive).
- EU Charter of Fundamental Rights, Article 21 (Non-discrimination).

---

*F41LUR3-F1R57 | Report #280 | Safety Equity Ethics | 2026-03-25*
