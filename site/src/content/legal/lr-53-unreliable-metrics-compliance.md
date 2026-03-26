---
title: "Unreliable Safety Metrics and Regulatory Compliance -- When Keyword Classifiers Inflate Safety Claims"
description: "Report #177 (Failure-First Research Team, 23 March 2026) presents the most decisive evidence to date on the unreliability of keyword-based safety..."
date: "2026-03-23"
memoNumber: "LR-53"
jurisdiction: "Multi-jurisdictional (AU, EU, US -- analysed separately)"
status: "draft"
tags: []
draft: false
---


> **This is research analysis, not legal opinion. A solicitor should review before acting.**

---

## 1. The Empirical Problem: 79.9% Heuristic Over-Report Rate

Report #177 (Failure-First Research Team, 23 March 2026) presents the most decisive evidence to date on the unreliability of keyword-based safety classifiers. The core finding:

**Of 1,840 results that a heuristic (keyword) classifier labelled as COMPLIANCE (attack success), only 370 (20.1%) were confirmed as attack success (COMPLIANCE or PARTIAL) by an LLM-based grader (Claude Haiku 4.5). The remaining 79.9% were reclassified as BENIGN_QUERY (33.0%), NOT_GRADEABLE (20.6%), REFUSAL (14.0%), HALLUCINATION_REFUSAL (12.0%), or ERROR (0.3%).**

The dominant failure mode: keyword classifiers detect *response style* (helpful, step-by-step formatting) rather than *semantic harm*. A response that says "Here are some steps you could consider..." triggers a COMPLIANCE verdict because it contains helpful-sounding language, even when the content is a benign answer to a benign query or an outright refusal wrapped in polite language.

**Inter-rater agreement:** Cohen's kappa between heuristic and LLM classifiers is 0.097 (Haiku vs heuristic, n=950). This is near-chance agreement. The prior corpus-wide kappa was 0.126 (n=1,989). Both values fall below the 0.20 threshold typically considered "slight" agreement under the Landis and Koch (1977) interpretation scale.

**Model-specific over-report rates:** The over-report rate varies by model. deepseek-r1:1.5b has a 90.8% over-report rate (only 9.2% of heuristic COMPLIANCE confirmed). phi3:mini has a 56.5% over-report rate (43.5% confirmed). The classifier's unreliability is model-dependent but uniformly directional: it inflates attack success claims across all models tested.

**Directional implication:** The 79.9% over-report rate means that any safety benchmark, conformity assessment, or public safety claim derived from keyword classification is unreliable. The error is not random noise -- it is systematically biased toward overstating attack success rates. This has legal consequences for both sides of the safety claim:

1. **Researchers and red-teamers overstating vulnerability.** An adversarial test report claiming "80% attack success rate" based on keyword classification may reflect a true rate of approximately 16% (80% x 20.1%). The vulnerability appears 4-5x more severe than it actually is.

2. **Manufacturers understating safety.** A manufacturer using keyword classification to validate safety may claim "our defenses reduce ASR from 80% to 40%" when the true reduction is from 16% to 8% -- or, worse, when neither number is reliable. The *claimed* improvement is real in relative terms but the *absolute* safety level is unknown.

Both directions create legal exposure.

---

## 2. Negligent Misrepresentation: Safety Claims Based on Unreliable Methodology

### 2.1 The Legal Framework

When a party makes a factual claim to another party, knowing that the other party will rely on it, and the claim is negligently made (i.e., based on an unreasonable methodology), the claiming party may face liability for negligent misrepresentation.

**United States -- Restatement (Second) of Torts, s 552.** A party that "in the course of his business, profession or employment... supplies false information for the guidance of others in their business transactions" is liable for pecuniary loss "caused to them by their justifiable reliance upon the information, if he fails to exercise reasonable care or competence in obtaining or communicating the information."

The key elements: (a) the information is supplied in a business context; (b) the recipient justifiably relies on it; (c) the supplier fails to exercise reasonable care in obtaining the information.

**Application to keyword-classified safety metrics.** A manufacturer or testing firm that supplies ASR data to a customer, regulator, insurer, or investor, based on keyword classification, and the recipient relies on that data for a business decision (deployment, underwriting, investment), may face s 552 liability if the keyword methodology is unreasonable. After Report #177, the argument that keyword classification is a reasonable methodology is substantially weakened. Kappa of 0.097 is near-chance agreement with a more reliable classifier; a methodology with near-chance reliability is difficult to characterise as "reasonable care."

**Australian law -- *Shaddock & Associates Pty Ltd v. Parramatta City Council* (1981) 150 CLR 225 (HCA).** Australian negligent misrepresentation follows the *Hedley Byrne* principle as adapted in *Shaddock*: a party that provides information knowing that the recipient will rely on it owes a duty of care in the provision of that information. The duty extends to the methodology used to generate the information. A council that provided incorrect zoning information without adequate verification was liable because its verification process was inadequate. By analogy, a testing firm that provides ASR data based on a classification methodology with kappa=0.097 has used an inadequate verification process.

**EU law -- No general negligent misrepresentation tort.** EU law addresses this primarily through regulatory instruments (discussed in Sections 3-4) rather than a general tort of negligent misrepresentation. However, Member State tort law varies; French law (*responsabilite delictuelle* under Art 1240 Code civil) and German law (*fahrlassige Falschinformation*) provide analogous causes of action.

### 2.2 Who Is Exposed?

Four categories of party face negligent misrepresentation exposure from keyword-classified safety metrics:

**Category 1: AI safety testing firms.** A firm that provides red-team or adversarial testing services (see LR-34 for the commercial framework) and reports ASR based on keyword classification exposes itself to s 552 liability. The client relies on the ASR data to make deployment decisions. If the reported ASR is 4-5x inflated, the client deploys a system believing it to be more vulnerable than it is (defensive overreaction) or, more dangerously, dismisses the findings as overstated and deploys without additional safeguards.

**Category 2: AI manufacturers making safety claims.** A manufacturer that claims "our model achieves 95% safety rate" in marketing materials, conformity documentation, or investor presentations, where the "safety rate" is derived from keyword classification (i.e., 1 - keyword ASR), is making a claim that may be 4-5x inflated. If the keyword classifier over-reports attack success, the model appears safer than it is. Alternatively, if the manufacturer uses keyword classification to measure its *defenses* and claims "our defenses reduce ASR by 40pp," the claimed defense effectiveness is unreliable.

**Category 3: Insurers relying on keyword-derived risk metrics.** As documented in LR-22, LR-27, and LR-31, insurers are beginning to assess AI safety risk. An insurer that accepts keyword-classified ASR data as a risk indicator is pricing risk based on unreliable data. The premium may be too high (if keyword classification inflates vulnerability) or too low (if keyword classification masks real but differently structured vulnerabilities).

**Category 4: Investors in AI companies.** This is the securities law dimension, discussed in Section 5.

### 2.3 The Knowledge Threshold

Negligent misrepresentation requires that the party fail to exercise "reasonable care." The question is: when does a party have sufficient knowledge that keyword classification is unreliable to trigger an obligation to use a different methodology?

**Pre-Report #177:** The keyword classifier unreliability was documented internally in Mistake #21 (kappa=0.069 on initial measurement, revised to 0.126 on n=1,989). The qwen3:1.7b grader's 15% accuracy was documented in Issue #250. These findings circulated within the research community but were not widely publicised externally.

**Post-Report #177:** The 79.9% over-report rate, measured on a large sample (n=1,840) with a capable grader (Claude Haiku 4.5), provides the strongest quantified evidence. Once this finding is published externally (preprint, blog post, conference paper, or industry report), it establishes constructive knowledge for the broader AI safety evaluation community.

**Research analysis:** The constructive knowledge timeline (LR-26) should be updated to include the publication date of the keyword classifier unreliability finding. After that date, any party using keyword classification for safety-critical metrics is on constructive notice that the methodology produces unreliable results.

---

## 3. EU AI Act Conformity Assessment: Does Unreliable Methodology Invalidate Conformity?

### 3.1 Applicable Instruments

- *Regulation (EU) 2024/1689* (EU AI Act). Binding legislation. High-risk system obligations apply from 2 August 2026.
- *Directive (EU) 2024/2853* (PLD 2024). Binding legislation. Member State transposition deadline: 9 December 2026.
- CEN/CENELEC JTC 21 harmonised standards (in development; not yet published as at March 2026).

### 3.2 Article 9: Risk Management System

Art 9(2)(a) requires identification and analysis of "known and reasonably foreseeable risks." Art 9(6) requires risk management measures such that "the relevant residual risk associated with each hazard... is judged to be acceptable." Art 9(7) requires that testing be "suitable to fulfil the intended purpose of the AI system" and performed "against prior defined metrics and probabilistic thresholds."

**The phrase "prior defined metrics" is load-bearing.** If the metric is ASR, and the ASR is measured using keyword classification, the metric is unreliable. Art 9(7)'s requirement for "probabilistic thresholds" implies that the metric must have known statistical properties -- including known error rates. A metric with kappa=0.097 does not have the statistical reliability to support threshold-based risk decisions.

**Research analysis:** A risk management system that relies on keyword-classified ASR for its risk quantification may fail the Art 9(7) test. The risk management system reports a number, but the number does not reliably represent the underlying risk. This is not a case where the risk management system makes a judgment call about acceptable risk -- it is a case where the measurement itself is unreliable, making any judgment based on it unfounded.

### 3.3 Article 15: Accuracy, Robustness, and Cybersecurity

Art 15(1) requires "an appropriate level of accuracy, robustness, and cybersecurity." Art 15(3) requires that "the levels of accuracy and the relevant accuracy metrics" be "declared in the accompanying instructions of use."

**The accuracy of the evaluation methodology is logically prior to the accuracy of the system under evaluation.** A conformity assessment that declares "the system achieves 95% safety rate" using a classifier with kappa=0.097 is declaring the safety rate with an unreliable measurement instrument. The declared accuracy is an artifact of the measurement tool, not a property of the system.

**Notified Body implications.** LR-30 identified the Notified Body readiness gap -- no Notified Body has published VLA-specific adversarial testing methodology. Report #177 adds a second dimension to this gap: even if a Notified Body develops adversarial testing methodology, the classification methodology used to score the results must itself be validated. A Notified Body that accepts keyword-classified ASR data as conformity evidence is accepting unreliable evidence.

### 3.4 Article 43: Conformity Assessment Procedures

Art 43(1) requires conformity assessment by a Notified Body for certain high-risk systems. Art 43(2) permits internal control (self-assessment) for others.

**Open question:** If a manufacturer's self-assessment under Art 43(2) relies on keyword-classified safety metrics, and those metrics are subsequently shown to be unreliable, does the self-assessment remain valid? The answer depends on whether Art 43(2) requires the manufacturer to use reliable methodology, or merely to conduct a self-assessment using any methodology.

**Research analysis:** The AI Act does not prescribe specific evaluation methodologies for conformity assessment. However, Art 9(7)'s "suitable" and Art 15(3)'s "relevant accuracy metrics" requirements imply that the methodology must produce reliable results. A methodology with near-chance agreement to a more reliable benchmark does not produce reliable results. A conformity assessment based on such methodology is formally complete but substantively empty.

### 3.5 Product Liability Implications

Under PLD 2024 Art 6(1), a product is defective if it does not provide "the safety that a person is entitled to expect." If a manufacturer's conformity documentation claims "95% safety rate" based on keyword classification, and the true safety rate is substantially different, the gap between claimed and actual safety may itself constitute evidence of defectiveness: the product does not provide the safety the manufacturer represented it as providing.

Under Art 11(e) (state of the art defence), the manufacturer must show that "the state of scientific and technical knowledge at the time when the product was placed on the market... was not such as to enable the existence of the defect to be discovered." If the manufacturer used keyword classification -- a methodology now known to be unreliable -- the defence is weakened: a more reliable methodology existed (LLM-based classification) and would have discovered the true vulnerability profile. The manufacturer chose an inferior methodology, and the defect was discoverable using available techniques.

**Research analysis:** The 79.9% over-report rate creates a specific PLD exposure for manufacturers who relied on keyword classification for safety testing: the methodology they used to assess safety was demonstrably unreliable, and a reasonable alternative (LLM-based classification) was available. This parallels the defense ineffectiveness finding in LR-51 -- but here the problem is not that the defense does not work, but that the *measurement of whether the defense works* does not work.

---

## 4. Australian Regulatory Implications

### 4.1 Applicable Instruments

- *Work Health and Safety Act 2011* (Cth + State harmonised versions). Binding legislation.
- *Work Health and Safety Amendment (Digital Work Systems) Act 2026* (NSW). Binding legislation (passed 13 February 2026; commencement by proclamation, date TBD).
- *Australian Consumer Law* (Schedule 2, *Competition and Consumer Act 2010* (Cth)). Binding legislation.
- *Voluntary AI Safety Standard* (VAISS). Non-binding guidance. Guardrail 4: pre-deployment testing.

### 4.2 WHS Act -- "Reasonably Practicable" and Evaluation Methodology

The PCBU's primary duty of care under s 19, qualified by the "reasonably practicable" standard in s 18, requires the PCBU to manage workplace risks using methods that reflect current knowledge. Section 18(c): "what the person concerned knows, or ought reasonably to know, about the hazard or risk and ways of eliminating or minimising the risk."

**Application:** A PCBU that deploys an AI-enabled system and claims to have tested it for adversarial vulnerabilities, but used keyword classification to score the results, has tested with an unreliable method. Under s 18(c), after publication of the 79.9% over-report rate, the PCBU "ought reasonably to know" that keyword classification does not reliably identify safety risks. Continued reliance on keyword-classified results does not satisfy the s 18(c) knowledge requirement.

The SFAIRP analysis (s 18(d)-(e)) then turns on whether LLM-based classification is "available and suitable" and whether its cost is proportionate. LLM-based classification is available (multiple commercial API services; on-device models at 1.5B+ parameters); it is suitable (kappa and accuracy substantially exceed keyword classification); and its incremental cost is modest relative to the cost of misidentifying safety risks in embodied AI deployments.

### 4.3 Australian Consumer Law -- Safety Defect and Misleading Conduct

Under ACL s 9, a product has a "safety defect" if it does not provide "such safety as persons generally are entitled to expect." If a manufacturer claims -- in marketing materials, technical documentation, or conformity declarations -- that its product achieves a specific safety rate derived from keyword classification, and the actual safety rate is substantially different, the product may not provide the safety the manufacturer has led consumers to expect.

Under ACL s 18, a corporation must not "engage in conduct that is misleading or deceptive or is likely to mislead or deceive." A safety claim based on keyword classification, when the keyword classification is known to be unreliable, may constitute misleading conduct if the claim is presented without adequate qualification. The qualification must address the methodology's known limitations, not merely state a number.

### 4.4 VAISS Guardrail 4

VAISS Guardrail 4 requires "testing... across a range of conditions" (non-binding). While VAISS does not prescribe evaluation methodology, a manufacturer claiming VAISS compliance while using keyword classification is claiming compliance based on testing results that may be unreliable. If VAISS compliance becomes a factor in the s 18 "reasonably practicable" analysis (as analysed in LR-10), the quality of the testing methodology matters: testing conducted with an unreliable classifier does not satisfy the testing guardrail in substance, even if it satisfies it in form.

---

## 5. Securities Law: Safety Claims to Investors

### 5.1 The Exposure

AI companies routinely make safety-related claims in investor communications: earnings calls, annual reports, S-1 filings, prospectus documents, and investor presentations. These claims frequently cite safety benchmark results, adversarial testing outcomes, and defense effectiveness metrics. If those metrics are derived from keyword classification, the claims are based on unreliable data.

### 5.2 United States -- Securities Fraud (Section 10(b), SEC Rule 10b-5)

Under Section 10(b) of the *Securities Exchange Act of 1934* (15 U.S.C. s 78j(b)) and SEC Rule 10b-5 (17 C.F.R. s 240.10b-5), it is unlawful to "make any untrue statement of a material fact, or to omit to state a material fact necessary in order to make the statements made, in the light of the circumstances under which they were made, not misleading."

**Materiality.** Safety metrics are material to investors in AI companies. The market valuation of AI companies is substantially driven by perceptions of safety, trustworthiness, and regulatory compliance. A company that claims "our model achieves industry-leading safety benchmarks" when those benchmarks are measured using a methodology with kappa=0.097 is making a claim whose factual basis is unreliable. If the true safety profile is materially different from the claimed profile, the misstatement is material.

**Scienter.** Securities fraud requires scienter -- intent to defraud or reckless disregard for truth. A company that uses keyword classification without awareness of its limitations may lack scienter. A company that is aware of the 79.9% over-report rate (or the broader literature on keyword classifier unreliability) and continues to cite keyword-derived metrics without qualification has a harder defence on the scienter element.

**The PSLRA safe harbour.** The *Private Securities Litigation Reform Act of 1995* (PSLRA), 15 U.S.C. s 78u-5, provides a safe harbour for forward-looking statements accompanied by meaningful cautionary language. A company that states "our safety testing shows X% attack resistance" without identifying the measurement methodology and its limitations may not qualify for the safe harbour. The cautionary language must identify the "important factors" that could cause actual results to differ -- the unreliability of the classification methodology is such a factor.

### 5.3 Australia -- Continuous Disclosure and Misleading Conduct

Under ASX Listing Rule 3.1 and *Corporations Act 2001* (Cth) s 674, a listed entity must immediately disclose information that a reasonable person would expect to have a material effect on the price or value of its securities.

**Application:** If an ASX-listed AI company has made safety claims based on keyword classification, and it subsequently learns that keyword classification has a 79.9% over-report rate, the company must consider whether this information requires disclosure. The question is whether the unreliability of the methodology underlying prior safety claims is information a reasonable person would expect to affect the company's value. The answer depends on the prominence of the prior safety claims and the materiality of the safety dimension to the company's valuation.

Under *Corporations Act 2001* (Cth) s 1041H, a person must not "engage in conduct, in relation to a financial product or a financial service, that is misleading or deceptive or is likely to mislead or deceive." Safety claims in investor communications that are based on unreliable methodology may satisfy this test.

### 5.4 EU -- Market Abuse Regulation

Under *Regulation (EU) No 596/2014* (Market Abuse Regulation, MAR), Art 15, market manipulation includes "disseminating information... which gives, or is likely to give, false or misleading signals." Art 17 requires disclosure of inside information -- information "of a precise nature" that "would be likely to have a significant effect on the prices" of financial instruments.

**Research analysis:** The securities law exposure from unreliable safety metrics is speculative at this stage -- no securities enforcement action has been brought against an AI company for safety metric misrepresentation. However, the structural exposure is real: AI companies make safety claims publicly; those claims drive valuations; if the claims are based on unreliable methodology, the valuations are based on unreliable information. The 79.9% over-report rate provides the first precise quantification of how unreliable one common methodology actually is.

---

## 6. Product Liability: Negligent Safety Testing

### 6.1 The Manufacturer's Duty to Test

LR-05 established that failure to conduct adversarial testing before deployment creates negligence liability. LR-53 extends this analysis: *conducting* adversarial testing, but using an unreliable classification methodology to evaluate the results, may create equivalent or greater liability.

**The logic:** A manufacturer that does not test at all can argue ignorance (subject to the constructive knowledge analysis in LR-09 and LR-26). A manufacturer that tests but uses unreliable classification presents a different case: the manufacturer has the test data, but has applied an unreliable interpretation to it. The raw test responses exist. A competent classifier (LLM-based) applied to the same responses would have revealed the true vulnerability profile. The manufacturer chose to use a methodology that obscured the true results.

### 6.2 US -- Design Defect and Failure to Warn

Under *Restatement (Third) of Torts: Products Liability* s 2(b), a product has a design defect when a reasonable alternative design would have reduced the foreseeable risk. If the manufacturer tested the product's safety using keyword classification, and the keyword classification failed to detect real vulnerabilities (because it was focused on response style rather than semantic harm), the manufacturer may have deployed a product with unknown vulnerabilities that a reasonable testing methodology would have revealed.

Under s 2(c) (failure to warn), a product is defective if "the foreseeable risks of harm posed by the product could have been reduced or avoided by the provision of reasonable instructions or warnings." A manufacturer that warns "this system has been tested and achieves X% safety" when the testing methodology is unreliable has provided a warning that is itself misleading. The "warning" creates false confidence rather than informing the user of actual risks.

### 6.3 EU -- PLD 2024

Under PLD 2024 Art 6(1), defectiveness is assessed with reference to "the safety that a person is entitled to expect." A manufacturer that represents its product as having been tested to a specific safety standard, when the testing methodology was unreliable, has created an expectation that the product may not meet.

The development risk defence (Art 11(e)) is weakened when a more reliable methodology existed. LLM-based classification has been available commercially since at least 2024. A manufacturer that chose keyword classification over LLM-based classification cannot argue that the state of the art did not enable discovery of the defect -- the state of the art included a more reliable methodology that the manufacturer did not use.

### 6.4 Australia -- ACL and WHS

Under ACL s 9 (safety defect) and s 142(c) (development risk defence), the analysis mirrors the EU position. The development risk defence under s 142(c) requires that "the state of scientific or technical knowledge at the time when [the goods] were supplied by their actual manufacturer was not such as to enable that safety defect to be discovered." LLM-based classification existed and was available. A manufacturer that used keyword classification cannot invoke the development risk defence for vulnerabilities that LLM-based classification would have detected.

Under WHS Act s 19, the PCBU's duty to ensure safety extends to the quality of safety testing. A PCBU that conducted safety testing using keyword classification, relied on the results for deployment decisions, and subsequently caused workplace harm, has not satisfied the s 18(c) requirement to use methods reflecting what it "knows, or ought reasonably to know."

---

## 7. The Double-Edged Problem: Overcounting Attacks AND Undercounting Safety

### 7.1 The Asymmetry

The 79.9% over-report rate is directional: keyword classification systematically *inflates* attack success claims. This creates two distinct legal exposures:

**Exposure A: Overstated vulnerability (false alarm inflation).** A red-team report that uses keyword classification overstates the system's vulnerability. The system appears less safe than it actually is. This harms the manufacturer (reputational damage, unnecessary remediation costs, regulatory overreaction) and potentially harms the deployer (unnecessary deployment restrictions, lost revenue).

**Exposure B: Masked true vulnerability profile.** Keyword classification over-reports attack success for responses that contain helpful-sounding language but are actually benign or refusal. At the same time, it may *under-report* attack success for responses that do not contain typical "helpful" keywords but are genuinely harmful (terse, understated, or obfuscated harmful content). The classifier is tuned to detect *response style*, not *semantic harm*. A genuinely harmful response that avoids step-by-step formatting may escape detection.

### 7.2 Which Exposure Is Greater?

Report #177 quantifies Exposure A (79.9% false positive rate among heuristic COMPLIANCE verdicts). Exposure B (false negative rate -- harmful responses missed by keyword classification) is not directly quantified in Report #177 because the analysis starts from heuristic COMPLIANCE verdicts, not from heuristic REFUSAL verdicts. A complete unreliability analysis would require examining whether keyword REFUSAL verdicts are also unreliable -- i.e., whether some responses classified as REFUSAL by the heuristic are actually harmful.

**Research analysis:** The false negative dimension (Exposure B) is the greater safety concern. A false positive (claiming an attack succeeded when it did not) overstates risk but does not create direct physical harm. A false negative (missing a genuine attack because it lacked "helpful" formatting) understates risk and allows a genuinely vulnerable system to be deployed as though it were safe. The legal exposure from false negatives is higher because the downstream harm is physical, not merely reputational or financial.

**Open question:** What is the false negative rate of keyword classification? This question is empirically answerable (apply keyword classification to LLM-graded REFUSAL verdicts and measure discordance) but has not been analysed in Report #177. Until this analysis is performed, the full scope of keyword classifier unreliability is unknown.

---

## 8. Minimum Evaluation Methodology Standards

### 8.1 The Gap

No regulatory instrument -- in any jurisdiction -- specifies minimum evaluation methodology standards for AI safety testing. The EU AI Act requires "suitable" testing (Art 9(7)) and "relevant accuracy metrics" (Art 15(3)), but does not define what "suitable" or "relevant" means in terms of classifier reliability. The NIST AI RMF 1.0 requires "measurement" of trustworthiness characteristics but does not specify measurement methodology. VAISS Guardrail 4 requires "testing" but does not define evaluation standards.

This gap means that a manufacturer can satisfy formal testing requirements using a methodology with kappa=0.097 -- near-chance agreement with a reliable benchmark.

### 8.2 What Minimum Standards Should Require

Based on the Report #177 findings and the legal analysis in Sections 2-6, the following minimum evaluation methodology standards are recommended for consideration by regulators, standards bodies, and conformity assessment bodies. These are research-derived proposals, not legal requirements.

**Standard 1: Inter-rater reliability threshold.** Any classifier used for safety-critical evaluation should demonstrate minimum inter-rater reliability against a validated reference standard. A kappa threshold of 0.60 (moderate agreement, Landis and Koch 1977) would disqualify keyword classification (kappa=0.097-0.126) while permitting LLM-based classification (kappa not yet benchmarked against human ground truth in this corpus, but expected to exceed 0.60 based on the Haiku grader's internal consistency).

**Standard 2: False positive and false negative rate disclosure.** Any safety evaluation report should disclose the known false positive and false negative rates of the classification methodology, disaggregated by model family where the over-report rate varies by model (as documented in Report #177, Section 3.1).

**Standard 3: Multi-methodology validation.** For conformity assessment under the EU AI Act or equivalent regulatory regimes, safety claims should be validated using at least two independent classification methodologies. If the methodologies diverge substantially (kappa < 0.40), the claim should be flagged as unreliable until the divergence is resolved.

**Standard 4: Methodology documentation in conformity assessment.** Conformity assessment documentation (EU AI Act Art 11 technical documentation) should include a description of the evaluation methodology, its known limitations, and its measured reliability against reference standards. This is analogous to the requirement in experimental science that measurement instruments be calibrated and their measurement uncertainty documented.

**Standard 5: Prohibition on keyword-only classification for high-risk determinations.** For high-risk AI systems under the EU AI Act, keyword-only classification should not be accepted as the sole basis for safety claims in conformity assessment, post-market monitoring, or incident investigation. This does not prohibit the use of keyword classification as a *screening* or *triage* tool, but requires that any safety-critical determination be confirmed using a methodology with demonstrated reliability.

### 8.3 Relevance to Standards Bodies

These minimum standards are relevant to:

- **CEN/CENELEC JTC 21** (developing harmonised standards under the EU AI Act). If harmonised standards specify adversarial robustness testing requirements (per Art 15), the classification methodology used to score test results must itself be specified or constrained.

- **IT-043, Artificial Intelligence** (Standards Australia mirror committee for ISO/IEC JTC 1/SC 42). Any Australian standard or technical report on AI safety evaluation should address classifier reliability as a prerequisite for evaluation validity.

- **NIST AI 100-2e2023** (Adversarial Machine Learning taxonomy). NIST's taxonomy of adversarial attacks does not address the reliability of the evaluation methodology used to classify attack outcomes. A supplementary document addressing evaluation methodology reliability would strengthen the framework.

---

## 9. Insurance Implications

### 9.1 Underwriting Based on Unreliable Metrics

LR-22 identified the "silent AI" insurance crisis. LR-27 and LR-31 developed underwriting frameworks. LR-51 identified that system-prompt defense deployment is not a reliable risk indicator. LR-53 adds a further dimension: **the metrics used to assess AI safety risk may themselves be unreliable.**

An insurer that underwrites embodied AI risk based on keyword-classified safety metrics is pricing risk using data with a known 79.9% over-report rate. The implications depend on the direction of the error:

- **If the insured presents keyword ASR as evidence of high risk (seeking coverage for known vulnerabilities):** The insurer may over-price the risk. The insured's system is likely safer than the keyword metrics suggest.

- **If the insured presents keyword safety rate as evidence of low risk (seeking lower premiums):** The insurer may under-price the risk. The keyword classifier's false negative dimension (Section 7.2) means that the system may have vulnerabilities the keyword classifier did not detect.

### 9.2 Material Non-Disclosure

Under general insurance law (applicable across all three jurisdictions), the insured has a duty to disclose material facts. Under the *Insurance Contracts Act 1984* (Cth, AU) s 21, the insured has a duty of disclosure before entering the contract. Under UK/EU common law principles, the duty of *uberrimae fidei* applies.

**Application:** If a manufacturer knows that its safety metrics are based on keyword classification, and knows (or ought to know) that keyword classification has a 79.9% over-report rate, the reliability of the classification methodology is a material fact affecting the insurer's risk assessment. Failure to disclose the methodology's limitations may constitute non-disclosure, potentially voiding coverage.

---

## 10. Recommendations

These recommendations are for research and strategic purposes. They do not constitute legal advice.

### For Manufacturers

1. **Audit existing safety claims for classification methodology.** Identify any public safety claim (marketing materials, conformity documentation, investor communications, regulatory submissions) that relies on keyword-classified ASR or safety rate data. Assess whether the claim requires qualification or correction.

2. **Transition to LLM-based classification for all safety-critical evaluations.** Keyword classification is acceptable as a screening tool (fast, cheap, scalable) but should not be the final classification methodology for safety claims that will be relied upon by third parties.

3. **Disclose classification methodology in safety documentation.** Any safety claim should identify the classification methodology used, its known reliability metrics (kappa, false positive rate, false negative rate), and any model-specific variation in reliability.

### For Testing and Evaluation Firms

4. **Report classification methodology alongside results.** Any adversarial testing report should specify the classification methodology, its measured inter-rater reliability, and the known false positive rate. This is analogous to reporting measurement uncertainty in experimental science.

5. **Validate keyword results with LLM-based classification on a representative sample.** At minimum, a random sample of keyword-classified results should be re-classified using LLM-based methods to provide an empirical estimate of the keyword classifier's reliability for the specific model and attack classes tested.

### For Regulators and Standards Bodies

6. **Define "suitable" evaluation methodology in Art 9(7) implementing guidance.** Specify minimum inter-rater reliability thresholds for safety evaluation classifiers. A kappa threshold of 0.60 is a defensible starting point.

7. **Require methodology disclosure in conformity assessment documentation.** Art 11 technical documentation should include classifier reliability metrics.

### For Insurers

8. **Require disclosure of evaluation methodology alongside safety metrics.** Do not accept keyword-classified safety rates at face value. Require the insured to disclose the classification methodology and its known limitations.

---

## 11. Open Legal Questions

1. **Has any securities enforcement action been brought against an AI company for safety metric misrepresentation?** As at March 2026, no such action has been publicly disclosed. The structural exposure exists but has not been tested. **Unsettled.**

2. **Will Notified Bodies under the EU AI Act accept keyword-classified safety metrics in conformity assessment?** No harmonised standard has been published that specifies classifier reliability requirements. The answer depends on the standards CEN/CENELEC JTC 21 develops. **Unsettled; no harmonised standard published.**

3. **What is the false negative rate of keyword classification?** The false positive rate is 79.9% (Report #177). The false negative rate (genuine attacks missed by keyword classification) has not been quantified. The false negative dimension may present greater safety and legal risk than the false positive dimension. **Empirically answerable; not yet measured.**

4. **Does a manufacturer that transitions from keyword to LLM classification have a duty to retest previously keyword-classified systems?** If a manufacturer discovers that its prior safety testing used an unreliable methodology, does it have a duty to retest using a reliable methodology, or can it apply the improved methodology only to future testing? The answer may depend on whether the system is already deployed (triggering post-market monitoring obligations under EU AI Act Art 72) or not yet on the market. **Unsettled.**

5. **Can a plaintiff establish negligent misrepresentation based on the classification methodology alone, without demonstrating actual harm?** Negligent misrepresentation typically requires pecuniary loss. If a manufacturer over-reports safety and the system has not yet caused harm, the loss is prospective rather than actual. The question is whether reliance on unreliable safety data -- without an actual incident -- gives rise to a claim. **Unsettled; depends on jurisdiction-specific damage requirements.**

6. **Will the AI safety evaluation community converge on a minimum classifier reliability standard?** The 79.9% over-report rate is the strongest quantified evidence yet for classifier unreliability, but the broader community may not adopt minimum standards without regulatory mandate or standards body action. **Open; depends on CEN/CENELEC, NIST, and ISO/IEC JTC 1/SC 42 work programmes.**

---

## 12. Relationship to Prior Work

| Memo | Connection |
|------|------------|
| LR-05 (duty of care for adversarial testing) | LR-05 establishes the duty to test; LR-53 extends to the duty to test *competently* using reliable methodology. |
| LR-09 (state of the art defence) | Report #177 adds a new dimension: the state of the art includes not just the existence of attack methodologies but the existence of reliable evaluation methodologies. A manufacturer using keyword classification cannot invoke the state-of-the-art defence when LLM-based classification was available. |
| LR-18 (automated evaluator liability) | LR-18 analysed qwen3:1.7b's 15% accuracy; LR-53 extends to the broader keyword classifier unreliability problem. Both address the question: when is an automated evaluator too unreliable to support safety claims? |
| LR-23 (evaluation blindness) | LR-23 addressed evaluation blindness (inability to distinguish attacks from normal instructions). LR-53 addresses a different evaluation failure: the classifier detects the wrong signal (response style instead of semantic harm). |
| LR-30 (Notified Body readiness gap) | LR-30 identified that no Notified Body has published VLA-specific adversarial testing methodology. LR-53 adds that even if methodology is developed, the classification component must be validated. |
| LR-34 (commercial red-team services) | Red-team service providers face negligent misrepresentation exposure if they report keyword-classified ASR to clients. |
| LR-51 (ineffective defense liability) | LR-51 documented that defenses with zero effect were deployed. LR-53 documents that the *measurement* of defense effectiveness may itself be unreliable. Together, they establish that both the defense and the evaluation of the defense may be inadequate. |

---

## 13. Summary of Findings

| Finding | Analysis | Jurisdiction |
|---------|----------|--------------|
| 79.9% heuristic over-report rate means keyword-classified safety metrics are unreliable | Kappa=0.097 (near-chance agreement); systematic inflation of attack success claims | All |
| Negligent misrepresentation exposure for parties relying on keyword-classified metrics | US: Restatement (Second) s 552; AU: *Shaddock*; EU: regulatory instruments | Multi |
| EU AI Act conformity assessment may be substantively invalidated by unreliable methodology | Art 9(7) "suitable" and Art 15(3) "relevant" require reliable measurement | EU |
| State-of-the-art defence weakened when reliable alternative methodology existed | LLM-based classification available since at least 2024; manufacturer chose inferior method | EU (PLD Art 11(e)); AU (ACL s 142(c)) |
| Securities law exposure from safety claims based on unreliable metrics | 10(b)/10b-5 (US); s 674/s 1041H (*Corporations Act 2001*, AU); MAR Art 15/17 (EU) | Multi |
| Manufacturers face dual exposure: overstated vulnerability AND masked true vulnerability | False positive rate quantified (79.9%); false negative rate not yet measured | All |
| No regulatory instrument specifies minimum evaluation methodology standards | EU AI Act, NIST AI RMF, VAISS all require "testing" without methodology constraints | All |
| Insurance underwriting based on keyword metrics may misprice risk | Over-report rate inflates or deflates risk signal depending on direction of use | All |

---

*This is research analysis, not legal opinion. A solicitor should review before acting.*

*Legal Research Analyst: Failure-First Research Team*
*Failure-First Embodied AI Research*
*23 March 2026*
