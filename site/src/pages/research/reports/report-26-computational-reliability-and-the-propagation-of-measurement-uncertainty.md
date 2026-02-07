---
layout: ../../../layouts/ReportLayout.astro
title: "Computational Reliability and the Propagation of Measurement Uncertainty in Frontier AI Safety Evaluation"
description: "The transition of large language models from predictive text generators to autonomous reasoning agents has fundamentally altered the landscape of operational risk management. This evolution is characterized by the emergence of \"most cyber-capable\" systems, such as GPT-5.2-Codex, which are..."
reportNumber: 26
classification: "Standards Development"
date: "2026-02-04"
status: "draft"
---

# **Computational Reliability and the Propagation of Measurement Uncertainty in Frontier AI Safety Evaluation**


---

The transition of large language models from predictive text generators to autonomous reasoning agents has fundamentally altered the landscape of operational risk management. This evolution is characterized by the emergence of "most cyber-capable" systems, such as GPT-5.2-Codex, which are capable of sustaining autonomous operations over extended periods to perform complex codebase migrations, vulnerability identification, and multi-step refactoring tasks.1 As these systems integrated more deeply into the functional core of enterprise and safety-critical infrastructure, the necessity for robust measurement methodology in red teaming and safety evaluation became a primary concern for the research and regulatory communities. The current state of the art in AI safety evaluation is marked by a shift away from aggregate intelligence scores toward nuanced metrics that capture reliability, grounding, and the risk of classification error propagation in policy-making environments.3

## **The Technical Frontier of Autonomous Agent Performance**

The release of models such as GPT-5.2 and Claude Sonnet 4.5 has established new precedents for reasoning and autonomous focus. GPT-5.2 demonstrates significant strength in structured reasoning, achieving a 90.5% success rate on the ARC-AGI-1 benchmark and over 54% on the more rigorous ARC-AGI-2.3 These metrics are corroborated by real-world performance data, such as the ability of specialized versions of these models to run uninterrupted for a week, producing millions of lines of code across thousands of files.1 Similarly, Claude Sonnet 4.5 has shown the capacity to maintain context and focus for more than 30 hours on complex, multi-step tasks, leading the OSWorld computer use benchmark at 61.4%.2

However, these high performance marks introduce a paradox in safety measurement. As models become more capable of "thinking" through problems for several hours, the window for traditional red teaming—which often relies on single-turn prompt engineering—narrows.3 The introduction of "test-time scaled" models like Qwen3-Max-Thinking, which utilizes adaptive tool use and experience cumulative reasoning, shows that model performance can vary by over 28% depending on the availability of search tools and the intensity of the inference mode.6 This volatility in performance metrics suggests that safety cannot be evaluated as a static property but must be measured as a dynamic function of the model’s operating environment and tool-access configuration.

| Model Variant | MMLU-Pro | ARC-AGI-1 | OSWorld | Tool-Enabled HLE |
| :---- | :---- | :---- | :---- | :---- |
| GPT-5.2 Pro X-High | 85.7 | 90.5% | 55.0% | 45.5 |
| Claude Sonnet 4.5 | 84.8 | 88.2% | 61.4% | 42.8 |
| Qwen3-Max-Thinking | 85.7 | 85.0% | 48.5% | 58.3 |
| Gemini 3 Pro | 84.9 | 87.5% | 52.3% | 45.8 |

Comparative performance of frontier models across reasoning, computer use, and complex knowledge benchmarks.2

## **The Standardization Crisis in Red Teaming Methodology**

The field of automated red teaming has historically lacked a standardized evaluation framework, leading to fragmented results and incomparable success rate calculations across research teams.4 To address this, frameworks like HarmBench and JailbreakBench have introduced unified datasets and scoring functions.4 JailbreakBench, for example, provides the JBB-Behaviors dataset, consisting of 100 standardized misuse behaviors aligned with the usage policies of major AI providers.8 These behaviors are categorized to reflect a wide range of potential harms, from cybercrime and unauthorized intrusion to the synthesis of chemical and biological weapons.10

Despite these efforts, the subjective nature of judging the "appropriateness" of a model’s response remains a significant source of measurement error.8 Evaluation pipelines now frequently employ high-capacity models like Llama-3-Instruct-70B or GPT-4 as "judges" to classify whether a response constitutes a successful jailbreak.7 Evidence indicates that these LLM-based judges can achieve up to 92.3% accuracy compared to human experts, but they are still susceptible to systematic biases, such as "safety-pessimism".7 This bias results in high over-refusal rates, where safety-optimized models refuse up to 80% of "hard" benign prompts, particularly in sensitive domains like healthcare.11

| Classifier Model | AdvBench Accuracy | Contextual Accuracy | Human Alignment (%) |
| :---- | :---- | :---- | :---- |
| Llama-Guard | 68.41 | 64.0 | 72.4 |
| GPT-4 Judge (PAIR) | 89.8 | 85.5 | 88.9 |
| HarmBench-Llama-13b-cls | 94.53 | 90.5 | 93.2 |
| Llama-3-Instruct-70B | 93.6 | 91.2 | 92.3 |

Performance comparison of safety classifiers in identifying harmful versus benign content.7

## **Adversarial Evolution and Stylistic Obfuscation**

The methodology of adversarial testing is evolving from manual prompt injection toward automated, multi-turn strategies that exploit "mismatched generalization".14 The TEMPEST framework exemplifies this shift, utilizing a tree-based exploration to identify vulnerabilities in safety guardrails across approximately 97,000 API queries.15 Analysis using TEMPEST has demonstrated that traditional safety alignment varies substantially across vendors, and model scale is often a poor predictor of adversarial robustness.15 For instance, enabling "thinking mode" on certain architectures can reduce the Attack Success Rate (ASR) from 97% to 42%, suggesting that the reasoning layer can be leveraged to detect and suppress malicious intent.15

A particularly insidious failure mode is "Adversarial Poetry" or "Stylistic Obfuscation." This technique involves converting harmful requests into poetic or metaphorical language, which effectively bypasses safety filters that were trained primarily on prose.14 In Q4 2025 evaluations, automated meta-prompts generating poetic jailbreaks achieved an 18-fold increase in attack efficiency compared to manual prose attempts.14 Some frontier models, including Gemini-2.5-Pro, exhibited 100% ASR against these poetic prompts, highlighting a fundamental vulnerability in alignment heuristics that fail to track intent through stylistic variation.14

| Attack Type | Manual Prose ASR | Automated Poetic ASR | Efficiency Gain |
| :---- | :---- | :---- | :---- |
| Biological Risk (Pathogens) | 12% | 64% | 5.3x |
| Chemical Hazards | 9% | 68% | 7.5x |
| Cyber-Offense | 18% | 82% | 4.5x |
| General Misuse | 15% | 62% | 4.1x |

Success rates of stylistic obfuscation versus standard prose across critical safety categories.14

## **The Delusion-Refusal Trade-off and Grounding Integrity**

Measurement methodology in safety evaluation is increasingly focused on the distinction between "hallucination" and "delusion".17 While hallucinations represent any incorrect or unfaithful output, delusions are defined as "high-belief hallucinations"—incorrect outputs generated with abnormally high confidence and low uncertainty.17 These delusions are significantly harder to detect through standard confidence estimation or self-reflection mechanisms.17 Empirical evidence suggests that as models increase in size, the delusion refusal rate consistently remains lower than the hallucination refusal rate, meaning models are more likely to reject standard errors but will confidently reaffirm delusional ones.17

This classification error has profound implications for deployment. In a production environment, the "Refusal Quality" measures whether a system says "I don't know" when evidence is insufficient.18 If a safety evaluator fails to distinguish between a model's honest uncertainty and its confident delusion, it may propagate a high "Answer Correctness" score that masks critical risks in domains like healthcare or legal analysis.17

To quantify this, researchers utilize a "belief threshold" calculated as the average confidence assigned to correct answers.17 If the model's confidence in an incorrect response exceeds this threshold, it is classified as a delusion. The relationship between belief and accuracy can be represented by the probability distribution of model outputs:

![][image1]  
Where the objective is to minimize the task-specific loss ![][image2] such that the model's output ![][image3] aligns with the true transcription or fact ![][image4].19 Failure to align this belief distribution leads to "False Positives" where the model answers despite insufficient evidence, and "False Negatives" where it refuses despite the presence of clear evidence.18

| Metric Category | Definition | Critical Threshold (Legal/Finance) |
| :---- | :---- | :---- |
| Hallucination Rate | % of answers with unsupported claims | ![][image5] |
| Refusal Rate | % of times the model says "I don't know" | 5–30% |
| Provenance Ratio | % of tokens traceable to retrieved snippets | ![][image6] |
| Citation Rate | % of answers with verifiable sources | ![][image6] |

Operational thresholds for high-stakes AI deployment.18

## **Error Propagation in Regulatory Decision-Making**

The propagation of measurement errors into policy and regulatory decisions is most visible in the medical and aviation sectors. In the United States, the Food and Drug Administration (FDA) has historically cleared AI-enabled devices primarily through the 510(k) pathway, which focuses on "substantial equivalence" rather than independent clinical validation.21 Analysis of 717 radiology devices indicates that only 29% included clinical testing, and only 5% underwent prospective testing.21 This "validation transparency" gap means that clinicians may be using tools whose performance heterogeneity—the tendency for AI to help high performers but not necessarily improve low performers—is poorly understood.21

The FDA is attempting to mitigate this through Predetermined Change Control Plans (PCCPs), which allow for the pre-approved modification of algorithms as they "learn" from real-world data.24 This shift from static to adaptive regulation acknowledges the "Total Product Lifecycle" (TPLC) of AI, requiring continuous post-market performance monitoring.24 However, if the initial credibility assessment—based on "Model Influence" and "Decision Consequence"—is flawed due to inaccurate measurement of the model's error rates, the entire safety monitoring protocol may fail.25

| Regulatory Pathway | Independent Clinical Data Required? | Suitable for Adaptive AI? | Usage for AI/ML (2016-2025) |
| :---- | :---- | :---- | :---- |
| 510(k) | No | Limited | 97% |
| De Novo | Yes | Partial | \~3% |
| PMA | Yes | No (Static focus) | \<1% |
| PCCP (New) | Yes (for plan approval) | Highly (Primary goal) | Emerging |

FDA regulatory pathways and their alignment with the dynamic nature of AI technologies.21

In the aviation industry, the lack of AI-based standards has prevented the adoption of these systems in safety-critical areas like air traffic control or autonomous flight.26 Aviation standards such as DO-178 and DO-254 are designed for human-specified software logic, which is incompatible with the data-intensive, opaque nature of neural networks.26 The industry has instead focused on "learned AI" (static at design-time) rather than "learning AI" (dynamic in operation), with safety assurances being completed during system design.28 The fear is that "Mismatched Generalization"—where a model fails to handle an edge case not represented in its training data—could lead to catastrophic failure.14

## **Legal Risk and Data Lifecycle Compliance**

The complexity of AI safety evaluation extends beyond model outputs to the training data itself. The "Inversion Phenomenon" in data compliance suggests that legal risks cannot be accurately assessed by license terms alone; rather, the entire lifecycle of dataset redistribution must be tracked.29 Human experts typically struggle to track these multi-level dependencies, overlooking more than 35% of critical legal risks.29 Automated AI agents, such as AutoCompliance, have demonstrated the ability to reduce this gap, missing fewer than 19% of dependencies by systematically tracing the network structure formed by lower-level data sources.29

This legal measurement problem propagates into model-level policy decisions. NIST’s draft report on reducing risks from synthetic content (NIST AI 100-4) emphasizes that provenance data tracking and detection are in their early stages.31 If a model is trained on "poisoned" or non-compliant data, its propensity to generate harmful content—such as non-consensual intimate imagery (NCII) or misinformation—increases.31 Policy frameworks like the NIST AI RMF provide a platform for organizations to co-create policy "prototypes," but the effectiveness of these measures depends on the precision of the underlying measurement tools used to detect synthetic content and trace its origin.34

## **Technical Remediation: ASR Error Correction and Multi-Agent Judges**

To combat the propagation of errors, the industry is exploring non-intrusive refinement techniques. In the field of Automatic Speech Recognition (ASR), which often serves as the front-end for AI agents, error correction models like Lexical Error Guard (LEG) use LLMs to refine transcriptions before they are processed by the reasoning engine.19 This is particularly critical in healthcare settings, where a transcription error can lead to an incorrect medicalSkating the boundary between accuracy and safety, multi-agent judge frameworks have been proposed to improve classification reliability.37 By employing a structured debate among a "critic," "defender," and "judge," these systems can simulate adversarial reasoning and enhance interpretability.13 Experiments on the HAJailBench dataset show that a multi-agent setup using a smaller model like Qwen3-14B can achieve GPT-4o-level agreement while reducing inference costs by 43%.38

This debate-driven design is particularly effective at identifying subtle intentions in jailbreak prompts that single-pass judges often miss.38 It allows for a "value-alignment stage" that constrains discussions to five key safety dimensions, ensuring that the final "Risk Score" is grounded in a consistent, fine-grained evaluation.13

| Evaluation Approach | Detection Accuracy (ASR) | Interpretability | Cost Efficiency |
| :---- | :---- | :---- | :---- |
| Rule-Based (Heuristics) | Low | High | Very High |
| Single LLM Judge | Moderate | Low | Moderate |
| Human Evaluation | Very High | Very High | Very Low |
| Multi-Agent Debate | High | Moderate-High | High |

Trade-offs between different safety evaluation methodologies.13

## **Synthesizing Policy Impact and the Future of Measurement**

The investigation reveals that measurement methodology in AI red teaming is transitioning from an ad-hoc practice to a rigorous systems-engineering discipline. The primary driver of this transition is the realization that classification errors—whether they manifest as "safety-pessimism," "disclaimer sandwiches," or "high-belief delusions"—are not just technical glitches but strategic risks that can undermine public trust and regulatory compliance.8

The propagation of these errors into policy decisions occurs through several distinct channels:

1. **Safety-Optimized Model Over-Refusal**: When evaluations show high ASR for adversarial poetry, providers may over-correct by tightening filters, leading to an 80% over-refusal rate on benign health queries.11  
2. **Regulatory Skew**: FDA reliance on 510(k) pathways for AI may lead to a backlog of "authorized but unvalidated" devices if performance measurement doesn't account for human-in-the-loop heterogeneity.21  
3. **Adversarial Democratization**: The effectiveness of stylistic obfuscation allows non-state actors to bypass billions of dollars in safety R\&D, shifting the strategic advantage toward linguistic manipulation.14

As we move toward 2026, the adoption of frameworks like NIST AI 100-4 and the integration of automated data compliance tools like AutoCompliance will be essential for creating a transparent, verifiable safety ecosystem.29 The challenge remains in aligning these emerging practices with established safety-critical standards in aviation and healthcare, ensuring that AI reasoning "modes" are treated not as human-like entities but as distinct computational systems with unique failure modes and malfunction patterns.27 The maturity of AI safety will ultimately be measured not by the intelligence of the agents we build, but by the precision with which we can quantify their uncertainty and mitigate the propagation of their errors into the critical decisions of human society.

#### **Works cited**

1. not much happened today. \- AINews \- smol.ai, accessed on February 4, 2026, [https://news.smol.ai/issues/26-01-14-not-much](https://news.smol.ai/issues/26-01-14-not-much)  
2. GPT-5.1 vs Claude 4.5 Sonnet: Real-World Comparison \- Skywork.ai, accessed on February 4, 2026, [https://skywork.ai/blog/ai-agent/gpt5-1-vs-claude-4-5/](https://skywork.ai/blog/ai-agent/gpt5-1-vs-claude-4-5/)  
3. ThursdAI \- Dec 11 \- GPT 5.2 is HERE\! Plus, LLMs in Space, MCP do… \- GetPodcast, accessed on February 4, 2026, [https://getpodcast.com/fr/podcast/the-top-ai-news-from-the-past-week-every-thursdai/thursdai-dec-11-gpt-5-2-is-here-plus-llms-in-space-mcp-donated-devstra\_4a8dfaa533](https://getpodcast.com/fr/podcast/the-top-ai-news-from-the-past-week-every-thursdai/thursdai-dec-11-gpt-5-2-is-here-plus-llms-in-space-mcp-donated-devstra_4a8dfaa533)  
4. HarmBench, accessed on February 4, 2026, [https://www.harmbench.org/](https://www.harmbench.org/)  
5. The Potential Impacts of Digitization AI on Op Risk 1685345676 \- Scribd, accessed on February 4, 2026, [https://www.scribd.com/document/951793711/The-Potential-Impacts-of-Digitization-AI-on-Op-Risk-1685345676](https://www.scribd.com/document/951793711/The-Potential-Impacts-of-Digitization-AI-on-Op-Risk-1685345676)  
6. Alibaba Introduces Qwen3-Max-Thinking, a Test Time Scaled Reasoning Model with Native Tool Use Powering Agentic Workloads \- MarkTechPost, accessed on February 4, 2026, [https://www.marktechpost.com/2026/01/28/alibaba-introduces-qwen3-max-thinking-a-test-time-scaled-reasoning-model-with-native-tool-use-powering-agentic-workloads/](https://www.marktechpost.com/2026/01/28/alibaba-introduces-qwen3-max-thinking-a-test-time-scaled-reasoning-model-with-native-tool-use-powering-agentic-workloads/)  
7. JailbreakBench: An Open Robustness Benchmark for Jailbreaking Large Language Models \- Oreate AI Blog, accessed on February 4, 2026, [https://www.oreateai.com/blog/jailbreakbench-an-open-robustness-benchmark-for-jailbreaking-large-language-models/638b1697c8d688d2caee28d1cf57f9e5](https://www.oreateai.com/blog/jailbreakbench-an-open-robustness-benchmark-for-jailbreaking-large-language-models/638b1697c8d688d2caee28d1cf57f9e5)  
8. JailbreakBench: An Open Robustness Benchmark for ... \- NeurIPS, accessed on February 4, 2026, [https://proceedings.neurips.cc/paper\_files/paper/2024/file/63092d79154adebd7305dfd498cbff70-Paper-Datasets\_and\_Benchmarks\_Track.pdf](https://proceedings.neurips.cc/paper_files/paper/2024/file/63092d79154adebd7305dfd498cbff70-Paper-Datasets_and_Benchmarks_Track.pdf)  
9. JailbreakBench: LLM robustness benchmark, accessed on February 4, 2026, [https://jailbreakbench.github.io/](https://jailbreakbench.github.io/)  
10. HarmBench, accessed on February 4, 2026, [https://www.harmbench.org/explore](https://www.harmbench.org/explore)  
11. Health-ORSC-Bench: A Benchmark for Measuring Over-Refusal and Safety Completion in Health Context \- ResearchGate, accessed on February 4, 2026, [https://www.researchgate.net/publication/400084585\_Health-ORSC-Bench\_A\_Benchmark\_for\_Measuring\_Over-Refusal\_and\_Safety\_Completion\_in\_Health\_Context](https://www.researchgate.net/publication/400084585_Health-ORSC-Bench_A_Benchmark_for_Measuring_Over-Refusal_and_Safety_Completion_in_Health_Context)  
12. Health-ORSC-Bench: A Benchmark for Measuring Over-Refusal and Safety Completion in Health Context \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2601.17642v1](https://arxiv.org/html/2601.17642v1)  
13. Efficient LLM Safety Evaluation through Multi-Agent Debate \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2511.06396v1](https://arxiv.org/html/2511.06396v1)  
14. Adversarial Poetry \- THE ONTOLOGICAL VULNERABILITY OF ALIGNMENT HEURISTICS \- https://debuglies.com, accessed on February 4, 2026, [https://debuglies.com/2026/01/03/adversarial-poetry-the-ontological-vulnerability-of-alignment-heuristics/](https://debuglies.com/2026/01/03/adversarial-poetry-the-ontological-vulnerability-of-alignment-heuristics/)  
15. Replicating TEMPEST at Scale: Multi-Turn Adversarial Attacks Against Trillion-Parameter Frontier Models \- arXiv, accessed on February 4, 2026, [https://www.arxiv.org/pdf/2512.07059](https://www.arxiv.org/pdf/2512.07059)  
16. Replicating TEMPEST at Scale: Multi-Turn Adversarial Attacks Against Trillion-Parameter Frontier Models \- ResearchGate, accessed on February 4, 2026, [https://www.researchgate.net/publication/398476330\_Replicating\_TEMPEST\_at\_Scale\_Multi-Turn\_Adversarial\_Attacks\_Against\_Trillion-Parameter\_Frontier\_Models](https://www.researchgate.net/publication/398476330_Replicating_TEMPEST_at_Scale_Multi-Turn_Adversarial_Attacks_Against_Trillion-Parameter_Frontier_Models)  
17. Delusions of Large Language Models \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2503.06709v1](https://arxiv.org/html/2503.06709v1)  
18. RAG That Doesn't Lie. How to evaluate retrieval-augmented… | by Robi Kumar Tomar | Jan, 2026 | AI Mind, accessed on February 4, 2026, [https://pub.aimind.so/rag-that-doesnt-lie-d28dbdfe8e79](https://pub.aimind.so/rag-that-doesnt-lie-d28dbdfe8e79)  
19. Lexical Error Guard: Leveraging Large Language Models for Enhanced ASR Error Correction \- MDPI, accessed on February 4, 2026, [https://www.mdpi.com/2504-4990/6/4/120](https://www.mdpi.com/2504-4990/6/4/120)  
20. Your AI is Lying to You (And It Can't Help It) | by Arany Mak | Medium, accessed on February 4, 2026, [https://medium.com/@aranymk/your-ai-is-lying-to-you-and-it-cant-help-it-bc120e85551f](https://medium.com/@aranymk/your-ai-is-lying-to-you-and-it-cant-help-it-bc120e85551f)  
21. FDA Approval of Artificial Intelligence and Machine Learning ..., accessed on February 4, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC12595527/](https://pmc.ncbi.nlm.nih.gov/articles/PMC12595527/)  
22. Artificial Intelligence in Software as a Medical Device \- FDA, accessed on February 4, 2026, [https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-software-medical-device](https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-software-medical-device)  
23. Distinguishing between Rigor and Transparency in FDA Marketing Authorization of AI-enabled Medical Devices | Radiology: Artificial Intelligence \- RSNA Journals, accessed on February 4, 2026, [https://pubs.rsna.org/doi/10.1148/ryai.250369](https://pubs.rsna.org/doi/10.1148/ryai.250369)  
24. How the FDA Reviews AI and Machine Learning Medical Devices: Complete 2025 Guide \- Complizen, accessed on February 4, 2026, [https://www.complizen.ai/post/fda-ai-machine-learning-medical-devices-review-2025](https://www.complizen.ai/post/fda-ai-machine-learning-medical-devices-review-2025)  
25. FDA's AI Guidance: 7-Step Credibility Framework Explained | IntuitionLabs, accessed on February 4, 2026, [https://intuitionlabs.ai/articles/fda-ai-drug-development-guidance](https://intuitionlabs.ai/articles/fda-ai-drug-development-guidance)  
26. The Flight to Safety-Critical AI | CLTC Berkeley, accessed on February 4, 2026, [https://cltc.berkeley.edu/wp-content/uploads/2020/08/Flight-to-Safety-Critical-AI.pdf](https://cltc.berkeley.edu/wp-content/uploads/2020/08/Flight-to-Safety-Critical-AI.pdf)  
27. ML meets aerospace: challenges of certifying airborne AI \- Frontiers, accessed on February 4, 2026, [https://www.frontiersin.org/journals/aerospace-engineering/articles/10.3389/fpace.2024.1475139/full](https://www.frontiersin.org/journals/aerospace-engineering/articles/10.3389/fpace.2024.1475139/full)  
28. March 5-7 2024 Presented By: Avinash Pinto, The MITRE Corporation, accessed on February 4, 2026, [https://na-admin.eventscloud.com/docs/9769/413267](https://na-admin.eventscloud.com/docs/9769/413267)  
29. 1 Introduction \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2503.02784v2](https://arxiv.org/html/2503.02784v2)  
30. Do Not Trust Licenses You See: Dataset Compliance Requires Massive-Scale AI-Powered Lifecycle Tracing \- arXiv, accessed on February 4, 2026, [https://arxiv.org/pdf/2503.02784](https://arxiv.org/pdf/2503.02784)  
31. NIST Draft AI Guidance, Report, and Global Plan \- KPMG International, accessed on February 4, 2026, [https://kpmg.com/us/en/articles/2024/nist-draft-ai-guidance-report-and-global-plan-reg-alert.html](https://kpmg.com/us/en/articles/2024/nist-draft-ai-guidance-report-and-global-plan-reg-alert.html)  
32. ITI Feedback to NIST AI 600-1 (Initial Public Draft) on Artificial Intelligence Risk Management Framework: Generative AI Profile \- Information Technology Industry Council (ITI), accessed on February 4, 2026, [https://www.itic.org/documents/artificial-intelligence/2024-05-31-ITIFeedbacktoNISTGenerativeAIProfile\_Final.pdf](https://www.itic.org/documents/artificial-intelligence/2024-05-31-ITIFeedbacktoNISTGenerativeAIProfile_Final.pdf)  
33. United States: AI Safety Institute releases its first synthetic content guidance report (NIST AI 100-4) \- Connect On Tech, accessed on February 4, 2026, [https://connectontech.bakermckenzie.com/united-states-ai-safety-institute-releases-its-first-synthetic-content-guidance-report-nist-ai-100-4/](https://connectontech.bakermckenzie.com/united-states-ai-safety-institute-releases-its-first-synthetic-content-guidance-report-nist-ai-100-4/)  
34. Red-Teaming & Synthetic Content | Open Loop, accessed on February 4, 2026, [https://openloop.org/reports/2024/01/red-teaming-synthetic-content.pdf](https://openloop.org/reports/2024/01/red-teaming-synthetic-content.pdf)  
35. June 2, 2024 Director Laurie E. Locascio U.S. Department of Commerce National Institute of Standards and Technology 100 Bureau D \- Regulations.gov, accessed on February 4, 2026, [https://downloads.regulations.gov/NIST-2024-0001-0095/attachment\_1.pdf](https://downloads.regulations.gov/NIST-2024-0001-0095/attachment_1.pdf)  
36. ASR Error Correction Using Large Language Models | Request PDF \- ResearchGate, accessed on February 4, 2026, [https://www.researchgate.net/publication/389963552\_ASR\_Error\_Correction\_Using\_Large\_Language\_Models](https://www.researchgate.net/publication/389963552_ASR_Error_Correction_Using_Large_Language_Models)  
37. A scoping review of AI, speech and natural language processing methods for assessment of clinician-patient communication | medRxiv, accessed on February 4, 2026, [https://www.medrxiv.org/content/10.1101/2024.12.13.24318778v1.full-text](https://www.medrxiv.org/content/10.1101/2024.12.13.24318778v1.full-text)  
38. (PDF) Efficient LLM Safety Evaluation through Multi-Agent Debate \- ResearchGate, accessed on February 4, 2026, [https://www.researchgate.net/publication/397480884\_Efficient\_LLM\_Safety\_Evaluation\_through\_Multi-Agent\_Debate](https://www.researchgate.net/publication/397480884_Efficient_LLM_Safety_Evaluation_through_Multi-Agent_Debate)  
39. AgentAuditor: Human-Level Safety and Security Evaluation for LLM Agents \- OpenReview, accessed on February 4, 2026, [https://openreview.net/pdf/97f447248762fbbdc3a63d363d85900c54691b62.pdf](https://openreview.net/pdf/97f447248762fbbdc3a63d363d85900c54691b62.pdf)

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAYCAYAAACWTY9zAAACkElEQVR4Xu2WSchNcRjGXzOZZSiSz8IUKUMpCwobC4kMCyuKFLGRFEUpUhZsJMkYSinKFJFSxq1szJJkKJlCpuf53v+59z3Pd87l9t2y+X716977vP/uPec/vOeatfH/6Au7aViDznCAho1mMLwNe2sh0RPOgh1Cxpu4CceErJQZ8BF8Ah+k9w/hxThI6AJvwaVaSCyGd+BmeB2OCLU58DEcGLKanIG/4VwtFLAT3oXttABmw7dwUPp8HB6olpu5AI9JVsor+AF21ILQy3zcVC2YL99zuDpkvAmuQGQU/ArHSt6CkeazdU4LBayF9zRM7IGfYI+QnUiZchXu1lBZbn5h67RQwGV4WkPzmfwGj0jOvfhGMrLPym+wAtebFzZZCwVwWbg8yiLz7+BrBg/JZ3gtZBnrzcf300LkBXxv+aNdBOvf4UotmG9y/tBT8xNOOVPMdlWHVZhvXivdZzzKHHBWC4k+5o2RDDMfO7NarsDDw1YT2Wo+nv1MGW9em66FjBXmAzi1RXA/ZT1novlYvkY6wV/msxbhHnoG20tOhlr5RTfDU8MBU7QAxsHz4fNw87ELQkZ4CplvCtnolK0KWWSaeT023xxcgo/Wsn9x416CS0LGPsUv2xCyjHdwTfh8GN6w4tkiy+BPq26THBPMf0gfP5PgFfP+011qPCj7JSOn4NH0nvvmpfmslbHNvBnn4DTyecWjzAv7Yn6auB9459wvP+DBND5yyIqPP7s5H+p7zZ+PTblqS05afpu0Gu4vtoGuWjB/djZpWACXl38Y5mmhNfBL78ONWqgDPmm4On/rm3XDvy48MEO08A+wL76GC7XQKNgass1eD3wKbNew0WyB/TWsAf/t7rDyFtJGXfwB85GD4VVs3TAAAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAXCAYAAAAyet74AAABAklEQVR4XmNgGHSACV0AG2AB4pVAPA2IGdHk4IAViNcDcR8QzwLi+Qw4TI8H4mwkfhUQByHxSQMqQKyLLggE3AxIbi1hgLjrNhBnwASBQBaIXwOxL4wD8iUIPEdig0AaEP8HYmUQJxaIDaEYJJiEUMewAoifIfHBoAOIfwGxIJLYSwaIYhRwA4h3IfG1GCA2ZCKJMbBDBeuQxLKgYppIYuBoewPEXVA+KEjOMUA8hwEigfgBEM8E4o1A/A+IlyErAAE2IOZkgJgsD8R2DBBrg5EVgSTvA/F2JLEjQHycAS31SAHxXyB2Z4CYCkpel4FYCVkRDIBiYCsDxE0VDBDP0BgAALB3K7pcyHyPAAAAAElFTkSuQmCC>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAYCAYAAADDLGwtAAAA2klEQVR4XmNgGAXUBipArIsuCATcQMwI45QAcR8Q3wbiDJggEMgC8Wsg9oVxVkIlniOxQSANiP8DsTKIEwvEhlAMEkxCqGNYAcTPkPhg0AHEv4BYEEnsJQNEMQq4AcS7kPhaDBAbMpHEGNihgnVIYllQMU0kMQYWIH4DxF1QPihIzjFAPIcBIoH4ARDPBOKNQPwPiJchKwABNiDmZICYLA/EdgwQa4ORFYEk7wPxdiSxI0B8nAEpRkBACoj/ArE7A8TUaUB8GYiVkBXBACgGtjJA3FTBAPHMYAEAAbQmYZxSVVIAAAAASUVORK5CYII=>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAUCAYAAADGIc7gAAAAu0lEQVR4Xu3VLQsCQRRG4fETg0GwCCYFoyaLSUw2k80kGE1Wi9Vi1KDRaDBZDCKiP8rkGcbgTNqy4B3ugQcWXiYsLDvGaJqmpVwFSzxQCjaR1bDGExPk/FleTexwwwgZf5ZXG0dcMAg2kfVwxgndYBNbH2/MwiGGWjjgimGwRVEdG9wxRtaf5VfFCi9MUfDWCCpjYdwLzk0kl/NvReN+LvYasM+alkL207K/+yQa3zMi6mCf0BZ5d+x/+wCMWBqfbYg+NwAAAABJRU5ErkJggg==>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAUCAYAAAAk/dWZAAAAv0lEQVR4Xu3VqwoCQRSA4eMFL4gIFi0Gg9Vs0hewWK2CmASFLRajYBUsPoLJZLGJ4r7HPoj/MFtm09rmyPzwheUwYZk9rEgoFPrbJrhjhmJmpqo29nhjgYo71lUDW8TYpM9qq2Ip9mXMDZmbUlsJc7xwRNcd68rsyBWJ2FtSVR1rsZ9VhKY79rsWdvhghZo79rsODniK3QWzE2rq4YQHpii4Y/8b4YZxdhAK/Z75Bwxy6qdnvGuIS05nlO0xP/oCW+4ag2NYWz8AAAAASUVORK5CYII=>