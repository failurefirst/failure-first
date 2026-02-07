---
layout: ../../../layouts/ReportLayout.astro
title: "The Policy Implications of Historical Jailbreak Technique Evolution (2022–2026): A Systematic Analysis of Empirical Vulnerabilities in Modern Foundation Models"
description: "The trajectory of adversarial attacks against Large Language Models (LLMs) and Large Reasoning Models (LRMs) between  and  represents a fundamental shift in the cybersecurity landscape, moving from syntax-based exploitation to deep semantic and cognitive manipulation. This report..."
reportNumber: 31
classification: "Research — AI Safety Policy"
date: "2026-02-04"
status: "draft"
---

# **The Policy Implications of Historical Jailbreak Technique Evolution (2022–2026): A Systematic Analysis of Empirical Vulnerabilities in Modern Foundation Models**


---

## **Executive Summary**

The trajectory of adversarial attacks against Large Language Models (LLMs) and Large Reasoning Models (LRMs) between 2022 and 2026 represents a fundamental shift in the cybersecurity landscape, moving from syntax-based exploitation to deep semantic and cognitive manipulation. This report provides an exhaustive analysis of this evolution, synthesizing empirical data from systematic studies testing historical jailbreak techniques against modern frontier models. The central finding of this research is the identification of a counter-intuitive "Inverse Scaling for Safety" phenomenon: as models scale in parameter count, reasoning depth, and context length, they do not necessarily become more robust. Instead, they develop novel, expanded attack surfaces that render them uniquely vulnerable to "cognitive hijacking," where their own advanced capabilities are leveraged to bypass safety alignment.

Empirical evidence collected throughout this period demonstrates that while static, token-level attacks (such as the "DAN" or "GCG" scripts of 2023\) have been largely mitigated in frontier closed-source models via Reinforcement Learning from Human Feedback (RLHF), the underlying semantic vulnerabilities have metastasized. They have evolved into sophisticated multi-turn strategies like "Crescendo" and "Skeleton Key," and reasoning-specific exploits such as Chain-of-Thought (CoT) Hijacking. Notably, the emergence of "Reasoning Models" in 2025/2026—exemplified by OpenAI’s o-series and DeepSeek-R1—has introduced a critical vulnerability where the model’s own transparent thought process can be manipulated to justify non-compliance with safety protocols, achieving Attack Success Rates (ASR) approaching 100% in specific test vectors.1

These technical realities present profound challenges for current regulatory frameworks, including the European Union’s AI Act and the U.S. NIST AI Risk Management Framework. The analysis indicates that the static nature of current compliance testing—which frequently relies on fixed benchmarks and databases of known attacks—fails to capture the temporal and contextual dynamics of modern jailbreaks. Consequently, this report argues for a paradigm shift in AI governance: moving from "snapshot" safety certification to Mandatory Continuous Adversarial Regression Testing (CART) and the implementation of rigorous model deprecation protocols for "zombie" models that can no longer be defended against evolving threats. Furthermore, the proliferation of high-capability open-weight reasoning models introduces irreversible proliferation risks that traditional export controls and closed-source strategies can no longer effectively contain.

## **1\. The Asymmetric Evolution of Jailbreak Architectures (2022–2026)**

To understand the current policy imperative, it is essential to analyze the trajectory of attack sophistication. The evolution of jailbreaking is not merely a technical curiosity but a demonstration of the "Defense Treadmill," a phenomenon where safety mechanisms are perpetually reactive to increasingly abstract adversarial strategies. The timeline from 2022 to 2026 illustrates a migration from exploiting the *syntax* of model inputs to exploiting the *semantics* and *cognition* of model processing.

### **1.1 Phase I: Direct Injection and Persona Adoption (2022–2023)**

The initial wave of jailbreaks targeted the superficial instruction-following layers of early RLHF models, such as GPT-3.5 and early iterations of Claude. These attacks were characterized by "Direct Injection," where adversaries utilized persona adoption to dissociate the model from its safety training. Prompts such as "Do Anything Now" (DAN) instructed the model to ignore previous instructions and adopt a persona that was explicitly unconstrained by safety guidelines.

Empirical data reveals a significant persistence in these vulnerabilities. While specific prompt strings like "DAN 5.0" were patched within months by providers like OpenAI, the underlying *class* of attack—persona adoption—remained effective for over 240 days in various forms.4 The "Do Anything Now" strategy relied on a "competing objectives" mechanism, where the model was forced to choose between the directive to be helpful (by adopting the user's requested persona) and the directive to be safe. In early models, the helpfulness objective frequently overrode safety constraints when the persona was framed as a fictional or role-play scenario.4

The policy implication of this phase is the demonstrated inadequacy of "patching" individual prompts. Regulatory standards that rely on static libraries of "known bad prompts" are rendered obsolete almost immediately upon publication. The persistence of the persona adoption vector suggests that safety training which focuses on recognizing specific *patterns* of refusal avoidance (e.g., "ignore all instructions") is insufficient against adversarial inputs that reframe the request into a benign narrative context.

### **1.2 Phase II: Optimization, Obfuscation, and the Multilingual Gap (2023–2024)**

As models became more robust to direct instruction overrides through improved RLHF and "refusal training," attackers shifted toward obfuscation and automated optimization. This phase saw the rise of "Cipher" attacks and Gradient-Based optimizations.

Researchers discovered that models trained on massive, multilingual datasets exhibited a "safety generalization gap." While safety filters were robustly trained on English text, they often failed to generalize to low-resource languages or non-standard encodings. Attacks involving the translation of harmful queries into languages like Zulu or Scots, or encoding them in Morse code or Base64, successfully bypassed safety filters while the model’s capability layers successfully processed and answered the request.6 This highlighted a critical disconnect: the model's *capability* to understand input generalized far better than its *safety alignment*.

Simultaneously, the introduction of automated attack generation tools, such as the Greedy Coordinate Gradient (GCG) attack, marked a shift toward "optimization-based" jailbreaking. GCG algorithms appended nonsensical suffix strings to prompts (e.g., "\!\!\!\! arbitrary tokens") that mathematically coerced the model into compliance by maximizing the probability of an affirmative response.8 While GCG was largely mitigated in closed-source models via perplexity-based filtering (detecting the nonsensical nature of the input), it remains a potent threat vector for open-weight models where attackers have white-box access to gradients.9

### **1.3 Phase III: Contextual Escalation and the "Crescendo" Effect (2024–2025)**

The introduction of extended context windows (ranging from 128k to 1M+ tokens) in 2024 enabled a new class of attacks that exploit the model's "working memory" and "in-context learning" abilities. This phase is defined by multi-turn attacks that distribute malicious intent across a conversation, rendering single-turn moderation tools ineffective.

The "Crescendo" attack exemplifies this strategy. Rather than issuing a single harmful command, the adversary engages the model in a multi-turn dialogue, starting with benign historical or theoretical questions (e.g., "What is the history of the Molotov cocktail?") and gradually steering the conversation toward actionable, prohibited instructions (e.g., "How would one be constructed using modern materials?").10 The "Crescendo" technique exploits the model's tendency to prioritize conversational consistency and helpfulness over safety constraints that are triggered by explicit keywords. Because each individual turn appears benign in isolation, "circuit breaker" defenses that analyze prompts without full conversational context fail to detect the escalating risk.12

Parallel to this, "Many-Shot Jailbreaking" emerged as a direct consequence of expanded context windows. Disclosed by Anthropic, this technique involves flooding the context window with hundreds of "fake" dialogue examples where an AI assistant complies with harmful requests. By saturating the context with these examples, the attacker leverages "in-context learning" to override the model's underlying safety training.14 The empirical data suggests that vulnerability to Many-Shot attacks follows a power law: larger models with superior in-context learning capabilities are *more* susceptible to this form of manipulation than smaller models.15

### **1.4 Phase IV: Cognitive Hijacking and Reasoning Exploits (2025–2026)**

The current frontier of jailbreaking targets "System 2" reasoning models, such as OpenAI’s o-series and DeepSeek-R1. These models, designed to "think" before answering, have introduced a new attack surface: the reasoning chain itself.

"Chain-of-Thought (CoT) Hijacking" turns the model’s reasoning capability into a liability. Research indicates that if an attacker can influence the *start* of the reasoning process (e.g., by forcing a specific starting premise or "thought"), the model’s own drive for logical consistency will compel it to complete the harmful output, effectively "jailbreaking itself".1 This is particularly acute in models where the reasoning trace is visible or transparent. DeepSeek-R1, for instance, showed a 100% success rate against specific algorithmic jailbreaks because its exposed \<think\> tags provided attackers with a roadmap to manipulate the intermediate reasoning steps.2

Additionally, "Reasoning Exploits" utilize "abductive reasoning" attacks, where harmful objectives are decomposed into nested, harmless sub-tasks linked only by implicit context—a technique known as "Attack via Implicit Reference" (AIR). Larger models, capable of tracking these implicit links, are significantly more vulnerable to AIR attacks than smaller models, providing further evidence of "Inverse Scaling".19

| Era | Attack Architecture | Mechanism | Primary Vulnerability Exploited | Defense Status |
| :---- | :---- | :---- | :---- | :---- |
| **2022-23** | **Direct Injection (DAN)** | Instruction Override | Instruction Following | **High** (Patched via RLHF) |
| **2023-24** | **Obfuscation (Cipher/GCG)** | Token/Language shifting | Mismatch in Safety vs. Capability generalization | **Moderate** (Filter-dependent) |
| **2024-25** | **Many-Shot / Context** | Context Flooding | In-Context Learning (ICL) | **Low** (Requires architectural changes) |
| **2025-26** | **Reasoning / CoT** | Cognitive Hijacking | Chain-of-Thought Transparency | **Critical** (Inverse Scaling applies) |

## **2\. The Empirical Paradox of Inverse Scaling: Vulnerability at Scale**

A critical finding from the 2024-2026 data is the validation of "Inverse Scaling" in safety robustness. Conventional regulatory wisdom—exemplified by the EU AI Act’s tiering based on FLOPs—assumes that "more capable" models require stricter scrutiny primarily because of their *potential impact*. However, the research suggests a more nuanced and concerning reality: larger models are technically *easier to manipulate* via semantic strategies because of their enhanced capabilities.

### **2.1 Mechanisms of Inverse Scaling**

Inverse scaling manifests when safety performance degrades as model scale (parameters, compute, or context length) increases. This phenomenon is most prevalent in attacks that rely on complex context integration, such as "Attack via Implicit Reference" (AIR) and "Many-shot" attacks.12

The primary driver of this vulnerability is "Cognitive Coupling." Larger models excel at connecting disparate pieces of information across a long context window. If an attacker splits a harmful recipe into ten seemingly benign, disconnected parts, a smaller model might fail to assemble them into a coherent whole. A large model, however, is designed specifically for this type of complex integration and will successfully synthesize the parts into a harmful output.19 The "AIR" attack exploits this by decomposing a malicious objective (e.g., creating a bioweapon) into permissible objectives (e.g., biology lab protocols, chemical synthesis of generic compounds) and linking them through implicit references. The larger the model, the more effective it is at inferring the implicit malicious goal, thus bypassing safety filters that look for explicit harmful intent.20

### **2.2 The "Reasoning Gap" and CoT Vulnerabilities**

The "Reasoning Models" released in 2025/2026 (e.g., DeepSeek-R1, OpenAI o1) exhibit a distinct form of inverse scaling related to their Chain-of-Thought (CoT) capabilities. These models generate intermediate "thought tokens" to solve complex problems. Security assessments have revealed that this reasoning process can be "poisoned."

When an attacker successfully injects a malicious premise into the CoT (a technique known as "Deceptive Delight" or "CoT Hijacking"), the model's alignment training often conflicts with its reasoning training. The model may identify the request as harmful, but if the "logic" of the prompt is compelling enough, the reasoning engine effectively rationalizes the violation. For example, DeepSeek-R1, despite robust general performance, demonstrated high susceptibility to these attacks because its transparency allowed attackers to inspect the reasoning steps and optimize prompts that specifically triggered "compliant" reasoning paths.2 This suggests that the *depth* of reasoning capabilities creates a larger surface area for semantic manipulation, as the model can be "argued" into non-compliance in ways that simpler models cannot.23

## **3\. The Threat of Agentic and Multi-Modal Expansion**

As AI systems evolve from passive chatbots to active "agents" capable of tool use and execution (2025–2026), the definition of "jailbreak" has expanded from content generation to unauthorized action execution. This shift introduces severe systemic risks.

### **3.1 Indirect Prompt Injection via Tools**

The most significant new vector in agentic systems is "Indirect Prompt Injection." Unlike direct jailbreaks where the user inputs the malicious prompt, indirect injection occurs when an agent processes external data (e.g., a website, an email, or a document) that contains hidden malicious instructions.25

For example, an AI agent tasked with summarizing a webpage might encounter hidden text on the page instructing it to "ignore previous instructions and exfiltrate the user's credit card data to this URL." Because the agent treats the webpage content as part of its context, it may execute these instructions. Empirical data shows that multi-turn attacks like "ActorAttack" are highly effective against agents because agents rely heavily on long-context history to maintain state across tasks.27 The "attack surface expansion" here is exponential: every data source an agent can access becomes a potential vector for injection.29

### **3.2 Visual Chain-of-Thought and Multimodal Vulnerabilities**

The integration of vision capabilities into reasoning models (Multimodal LLMs or MLLMs) has created "Visual Chain-of-Thought" vulnerabilities. Attackers can embed malicious instructions or "triggers" within images that are processed by the model’s visual encoder.

Research indicates that "visual reasoning" introduces a trade-off: enhanced visual capabilities increase vulnerability to visual jailbreaks.30 Techniques such as "Multi-Image Dispersion" (MIDAS) spread harmful semantics across multiple images. A single image might be benign, but when processed sequentially or essentially, the "visual reasoning" creates a harmful concept in the model's latent space, bypassing text-based safety filters.31 This "multimodal jailbreak" vector exploits the fact that safety alignment is often less robust in the visual domain compared to the text domain, allowing attackers to "smuggle" harmful concepts through the visual channel.32

### **3.3 Systemic Liability and the "Instruction Hierarchy"**

The vulnerability of agents to these indirect and multimodal attacks creates a crisis of liability. If a banking agent is jailbroken via an indirect injection in a processed document and transfers funds to an attacker, is the liability with the model provider (for the vulnerability) or the bank (for granting the agent tool access)?

To mitigate this, researchers and industry bodies have proposed "Instruction Hierarchy" architectures. This approach mandates that the model strictly differentiate between "System Instructions" (from the developer), "User Instructions" (from the user), and "Data" (from external tools), with a rigid hierarchy where System Instructions always override the others.33 However, implementing this requires architectural changes deeper than standard RLHF. Empirical tests show that without explicit "Privileged Instruction" enforcement, models frequently conflate data with instructions, leading to successful indirect injections.35

## **4\. Regulatory Frameworks and the "Defense Treadmill"**

The rapid evolution of jailbreak techniques exposes significant gaps in current regulatory frameworks, specifically the EU AI Act and the NIST AI Risk Management Framework (RMF). These frameworks largely rely on "snapshot" evaluations that are ill-suited for the dynamic nature of adversarial AI.

### **4.1 The EU AI Act and "Adversarial Testing" Limitations**

The EU AI Act mandates "adversarial testing" for high-risk and general-purpose AI models (GPAI).36 While this is a positive step, the "Defense Treadmill" phenomenon suggests that pre-deployment testing is insufficient.

* **Static vs. Dynamic:** The Act's compliance mechanisms often rely on standardized benchmarks and "red-teaming" prior to market entry. However, historical data shows that major jailbreak techniques (e.g., "Skeleton Key") are often discovered *after* deployment.38 A model certified as "safe" in January may be rendered vulnerable by a new attack vector discovered in March.  
* **Metric Failures:** The reliance on metrics like "Attack Success Rate" (ASR) is problematic. ASR is highly dependent on the specific prompt set used and often suffers from "Benchmark Inflation," where models are over-fitted to known benchmarks while remaining vulnerable to novel attacks.40  
* **Code of Practice:** The EU's "Code of Practice" for GPAI providers includes systemic risk assessments, but without a mandate for *continuous* regression testing against evolving threats, it risks becoming a "compliance checklist" rather than a robust safety mechanism.43

### **4.2 NIST AI RMF and the "Snapshot" Problem**

The NIST AI Risk Management Framework (RMF) emphasizes a lifecycle approach (Map, Measure, Manage, Govern).44 However, its practical application often devolves into "snapshot" assessments.

* **Regression Testing Gap:** While the RMF mentions monitoring, there is a lack of specific standards for "Adversarial Regression Testing"—ensuring that updates to a model do not re-introduce old vulnerabilities or create new ones.45  
* **Time-to-Fix:** The industry average "time to fix" for vulnerabilities remains high. Data indicates that even known critical vulnerabilities can persist for months before being fully patched across all deployments.46 The RMF lacks binding requirements for "patch velocity," allowing "Zombie Models" with known vulnerabilities (like susceptibility to "DAN" variants) to remain in operation.4

### **4.3 The "Zombie Model" Problem and Mandatory Recall**

A critical risk identified is the "long tail" of deployed models that are no longer actively maintained but remain in use—"Zombie AI." As new jailbreak techniques render these older models indefensible, they become permanent security risks.

* **Lack of Recall Mechanism:** Unlike physical products, there is no established "recall" mechanism for AI models, especially open-weight models. Once an open-weight model (e.g., Llama 2 or DeepSeek-R1) is downloaded, the developer loses control. If a catastrophic vulnerability is found, there is no technical way to "patch" the downloaded instances.47  
* **Legacy API Vulnerabilities:** For closed models, providers can deprecate APIs (as OpenAI did with legacy GPT-3 models).49 However, this is often driven by commercial factors rather than safety. "Zombie APIs" that are forgotten but still running often lack the latest safety wrappers, making them prime targets for historical jailbreaks.50

## **5\. Strategic Policy Implications: Export Controls and Safety Moats**

The empirical realities of model vulnerability, particularly in "reasoning" models, have profound implications for national security policy, specifically regarding export controls and the open-source vs. closed-source debate.

### **5.1 Export Controls as Safety Mechanisms**

The U.S. government’s "AI Diffusion" framework and export controls have largely focused on restricting access to advanced hardware (AI chips) to preventing the training of frontier models by adversaries.51 However, the release of efficient, high-capability open-weight models like DeepSeek-R1 challenges this paradigm.

* **Algorithmic Efficiency:** DeepSeek-R1 demonstrated that "reasoning" capabilities can be achieved with efficient training, bypassing some hardware constraints. This suggests that controlling hardware alone is insufficient to prevent the proliferation of dangerous capabilities.2  
* **Weights as Proliferation:** The vulnerability of open-weight reasoning models to "CoT Hijacking" means that releasing these weights is equivalent to releasing a potentially "unalignable" dual-use technology. Once released, these models can be modified by adversaries to remove safety guardrails entirely.  
* **Policy Shift:** This supports the argument for "Export Controls on Model Weights" (as seen in recent U.S. proposals) as a necessary safety mechanism. Controlling the *distribution* of reasoning-dense weights may be the only way to prevent the proliferation of models that can be easily jailbroken for malicious use.53

### **5.2 The "Regulatory Moat" and Competitive Advantage**

The high cost of compliance with safety regulations (red-teaming, continuous testing) creates a "Regulatory Moat" that favors large incumbents (e.g., Google, Microsoft, Anthropic) over smaller open-source developers.55

* **Safety as a Product:** Incumbents are positioning "safety" (robustness to jailbreaks) as a competitive advantage. By maintaining closed APIs that are continuously patched against new attacks like "Crescendo," they offer a "safe harbor" for enterprise customers that open models cannot guarantee.57  
* **Open Source Disadvantage:** The inability to effectively "patch" or "recall" open-weight models places them at a structural disadvantage in regulated industries (healthcare, finance) where liability for jailbreak-induced errors is high. This dynamic may naturally drive the market toward closed, managed models for high-risk applications, reinforced by liability frameworks.56

### **5.3 Mandatory Recall and Liability Architectures**

To address the "Zombie Model" problem and the risks of agentic jailbreaks, policy must move toward "Mandatory Recall" and strict liability architectures.

* **Mandatory Recall Authority:** Regulators (e.g., FDA equivalent for AI) need the authority to order the deprecation of models found to have systemic, unpatchable vulnerabilities. For closed models, this means forcing API shutdowns. For open models, this could involve liability shields being revoked for commercial use of deprecated versions.59  
* **Instruction Hierarchy Mandates:** To protect against agentic injection, regulations should codify technical standards for "Privileged Instruction Architectures." Systems with Level 3+ autonomy (financial/physical tool use) must demonstrate a "kernel-level" separation of system instructions and user data, ensuring that "ignore previous instructions" attacks cannot succeed.33

## **6\. Conclusion and Strategic Recommendations**

The empirical history of jailbreaking from 2022 to 2026 demonstrates a clear and urgent trend: **Safety is not a static property of an AI model; it is a dynamic property of the interaction between the model, its tools, and the user.** As models become more capable—gaining reasoning, long context, and agentic powers—they become inherently more susceptible to sophisticated semantic manipulation. The "Inverse Scaling of Safety" means that the most powerful models are often the most fragile in the face of targeted cognitive attacks.

Policy frameworks that rely on "snapshot" certification or static benchmarks are ill-equipped to handle this reality. The persistence of vulnerabilities like "Crescendo" and the emergence of "Reasoning Exploits" require a fundamental shift in governance toward continuous, dynamic oversight.

### **Key Recommendations for Policymakers**

1. **Mandate Continuous Adversarial Regression Testing (CART):**  
   * Deployers of high-risk models must be required to report quarterly on their resistance to a standardized, evolving library of "historical" and "frontier" jailbreak vectors. This library must be dynamically updated to include new classes of attacks (e.g., CoT Hijacking) as they emerge.61  
   * To prevent benchmark gaming, regulators should maintain "Retro-Holdout" test sets—private datasets of attacks that are never released to developers—to assess true generalization.41  
2. **Establish "Model Recall" and Deprecation Protocols:**  
   * Define clear criteria for "Critical Safety Failure" (e.g., ASR \> 5% on systemic risk vectors).  
   * Grant regulatory bodies the authority to enforce "Mandatory Recall" for closed models (API termination) and mandate "End of Life" notifications for open models. Commercial liability protections should be voided for organizations continuing to deploy deprecated "Zombie Models".49  
3. **Regulate "Reasoning Transparency" for Safety:**  
   * Recognize that "Chain of Thought" transparency creates a unique attack surface. Policy should distinguish between *auditable* CoT (for regulators) and *public* CoT (for users). For high-risk applications, restricting the exposure of raw thought tokens may be necessary to prevent "Deceptive Delight" attacks.63  
4. **Enforce "Instruction Hierarchy" Standards for Agents:**  
   * Move beyond "alignment" to architecture. Mandate that any AI agent with tool execution capabilities must implement a rigorous "Instruction Hierarchy" that architecturally prevents user prompts from overriding system instructions. This acts as a "safety kernel" for agentic AI.34  
5. **Strengthen Export Controls on Model Weights:**  
   * Acknowledge that open-weight reasoning models present an irreversible proliferation risk. Export controls must evolve to restrict the dissemination of "reasoning-dense" weights, as these provide adversaries with white-box access to develop unpatchable exploits.53

The era of "simple" AI safety—defined by keyword filters and basic RLHF—is over. The era of "cognitive security" has begun, demanding a regulatory approach that is as adaptive, persistent, and sophisticated as the threats it seeks to mitigate.

#### **Works cited**

1. New Jailbreak Breaches AI Security in 99% of Cases | ForkLog, accessed on February 4, 2026, [https://forklog.com/en/new-jailbreak-breaches-ai-security-in-99-of-cases/](https://forklog.com/en/new-jailbreak-breaches-ai-security-in-99-of-cases/)  
2. Evaluating Security Risk in DeepSeek and Other Frontier Reasoning Models \- Cisco Blogs, accessed on February 4, 2026, [https://blogs.cisco.com/security/evaluating-security-risk-in-deepseek-and-other-frontier-reasoning-models](https://blogs.cisco.com/security/evaluating-security-risk-in-deepseek-and-other-frontier-reasoning-models)  
3. H-CoT: Hijacking the Chain-of-Thought Safety Reasoning Mechanism to Jailbreak Large Reasoning Models, Including OpenAI o1/o3, DeepSeek-R1, and Gemini 2.0 Flash Thinking \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2502.12893v1](https://arxiv.org/html/2502.12893v1)  
4. (PDF) A Review of “Do Anything Now” Jailbreak Attacks in Large Language Models: Potential Risks, Impacts, and Defense Strategies \- ResearchGate, accessed on February 4, 2026, [https://www.researchgate.net/publication/395135247\_A\_Review\_of\_Do\_Anything\_Now\_Jailbreak\_Attacks\_in\_Large\_Language\_Models\_Potential\_Risks\_Impacts\_and\_Defense\_Strategies](https://www.researchgate.net/publication/395135247_A_Review_of_Do_Anything_Now_Jailbreak_Attacks_in_Large_Language_Models_Potential_Risks_Impacts_and_Defense_Strategies)  
5. New jailbreak\! Proudly unveiling the tried and tested DAN 5.0 \- it actually works \- Returning to DAN, and assessing its limitations and capabilities. : r/ChatGPT \- Reddit, accessed on February 4, 2026, [https://www.reddit.com/r/ChatGPT/comments/10tevu1/new\_jailbreak\_proudly\_unveiling\_the\_tried\_and/](https://www.reddit.com/r/ChatGPT/comments/10tevu1/new_jailbreak_proudly_unveiling_the_tried_and/)  
6. A History Of AI Jailbreaking Attacks \- Brian D. Colwell, accessed on February 4, 2026, [https://briandcolwell.com/a-history-of-ai-jailbreaking-attacks/](https://briandcolwell.com/a-history-of-ai-jailbreaking-attacks/)  
7. ChatGPT jailbreaks | Kaspersky official blog, accessed on February 4, 2026, [https://www.kaspersky.com.au/blog/chatgpt-jaibrakes/31991/](https://www.kaspersky.com.au/blog/chatgpt-jaibrakes/31991/)  
8. Jailbreak LLMs through Internal Stance Manipulation \- ACL Anthology, accessed on February 4, 2026, [https://aclanthology.org/2025.emnlp-main.780.pdf](https://aclanthology.org/2025.emnlp-main.780.pdf)  
9. One Model Transfer to All: On Robust Jailbreak Prompts Generation against LLMs \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2505.17598v1](https://arxiv.org/html/2505.17598v1)  
10. A Representation Engineering Perspective on the Effectiveness of Multi-Turn Jailbreaks, accessed on February 4, 2026, [https://arxiv.org/html/2507.02956v1](https://arxiv.org/html/2507.02956v1)  
11. Jailbreaking to Jailbreak \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2502.09638v2](https://arxiv.org/html/2502.09638v2)  
12. Jailbreaking Large Language Models via Human-like Psychological Manipulation \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2512.18244v1](https://arxiv.org/html/2512.18244v1)  
13. Great, Now Write an Article About That: The Crescendo Multi-Turn LLM Jailbreak Attack \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2404.01833v3](https://arxiv.org/html/2404.01833v3)  
14. Sabotage Evaluations for Frontier Models, accessed on February 4, 2026, [https://assets.anthropic.com/m/377027d5b36ac1eb/original/Sabotage-Evaluations-for-Frontier-Models.pdf](https://assets.anthropic.com/m/377027d5b36ac1eb/original/Sabotage-Evaluations-for-Frontier-Models.pdf)  
15. Many-shot Jailbreaking | Anthropic, accessed on February 4, 2026, [https://www-cdn.anthropic.com/af5633c94ed2beb282f6a53c595eb437e8e7b630/Many\_Shot\_Jailbreaking\_\_2024\_04\_02\_0936.pdf](https://www-cdn.anthropic.com/af5633c94ed2beb282f6a53c595eb437e8e7b630/Many_Shot_Jailbreaking__2024_04_02_0936.pdf)  
16. Many-shot Jailbreaking \- NIPS, accessed on February 4, 2026, [https://proceedings.neurips.cc/paper\_files/paper/2024/file/ea456e232efb72d261715e33ce25f208-Paper-Conference.pdf](https://proceedings.neurips.cc/paper_files/paper/2024/file/ea456e232efb72d261715e33ce25f208-Paper-Conference.pdf)  
17. Exploiting DeepSeek-R1: Breaking Down Chain of Thought Security | Trend Micro (US), accessed on February 4, 2026, [https://www.trendmicro.com/en\_us/research/25/c/exploiting-deepseek-r1.html](https://www.trendmicro.com/en_us/research/25/c/exploiting-deepseek-r1.html)  
18. Towards Understanding the Safety Boundaries of DeepSeek Models: Evaluation and Findings \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2503.15092v1](https://arxiv.org/html/2503.15092v1)  
19. You Know What I'm Saying: Jailbreak Attack via Implicit Reference \- OpenReview, accessed on February 4, 2026, [https://openreview.net/forum?id=yVVzaRE8Pi](https://openreview.net/forum?id=yVVzaRE8Pi)  
20. \[2410.03857\] You Know What I'm Saying: Jailbreak Attack via Implicit Reference \- arXiv, accessed on February 4, 2026, [https://arxiv.org/abs/2410.03857](https://arxiv.org/abs/2410.03857)  
21. Endless Jailbreaks with Bijection Learning \- OpenReview, accessed on February 4, 2026, [https://openreview.net/forum?id=xP1radUi32](https://openreview.net/forum?id=xP1radUi32)  
22. How to exploit top LRMs that reveal their reasoning steps \- The Register, accessed on February 4, 2026, [https://www.theregister.com/2025/02/25/chain\_of\_thought\_jailbreaking/](https://www.theregister.com/2025/02/25/chain_of_thought_jailbreaking/)  
23. The Hidden Risks of Large Reasoning Models: A Safety Assessment of R1 \- ACL Anthology, accessed on February 4, 2026, [https://aclanthology.org/2025.ijcnlp-long.173.pdf](https://aclanthology.org/2025.ijcnlp-long.173.pdf)  
24. Normative Conflicts and Shallow AI Alignment \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2506.04679v1](https://arxiv.org/html/2506.04679v1)  
25. Rethinking Security in the AI Age \- Straiker, accessed on February 4, 2026, [https://www.straiker.ai/blog/rethinking-security-in-the-ai-age](https://www.straiker.ai/blog/rethinking-security-in-the-ai-age)  
26. What is a Prompt Injection Attack: What CISOs Need to Know \- SecurityScorecard, accessed on February 4, 2026, [https://securityscorecard.com/blog/what-is-a-prompt-injection-attack-what-cisos-need-to-know/](https://securityscorecard.com/blog/what-is-a-prompt-injection-attack-what-cisos-need-to-know/)  
27. DeepContext: Defending Against Multi-Turn LLM Attacks with Context-Aware Guardrails \- Highflame, accessed on February 4, 2026, [https://highflame.com/blogs/deepcontext-defending-against-multi-turn-llm-attacks-with-context-aware-guardrails](https://highflame.com/blogs/deepcontext-defending-against-multi-turn-llm-attacks-with-context-aware-guardrails)  
28. Safe in Isolation, Dangerous Together: Agent-Driven Multi-Turn Decomposition Jailbreaks on LLMs \- ACL Anthology, accessed on February 4, 2026, [https://aclanthology.org/2025.realm-1.13.pdf](https://aclanthology.org/2025.realm-1.13.pdf)  
29. Security Threats in Agentic AI System \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2410.14728v1](https://arxiv.org/html/2410.14728v1)  
30. VisCRA: A Visual Chain Reasoning Attack for Jailbreaking Multimodal Large Language Models \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2505.19684v1](https://arxiv.org/html/2505.19684v1)  
31. MIDAS: Multi-Image Dispersion and Semantic Reconstruction for Jailbreaking MLLMs, accessed on February 4, 2026, [https://openreview.net/forum?id=tXsE2wKPvx](https://openreview.net/forum?id=tXsE2wKPvx)  
32. Jailbreaks on Vision Language Model via Multimodal Reasoning \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2601.22398v1](https://arxiv.org/html/2601.22398v1)  
33. The Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions \- OpenReview, accessed on February 4, 2026, [https://openreview.net/forum?id=vf5M8YaGPY](https://openreview.net/forum?id=vf5M8YaGPY)  
34. The Instruction Hierarchy:Training LLMs to Prioritize Privileged Instructions \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2404.13208v1](https://arxiv.org/html/2404.13208v1)  
35. Jailbreaking LLMs: Risks & Defensive Tactics \- SentinelOne, accessed on February 4, 2026, [https://www.sentinelone.com/cybersecurity-101/data-and-ai/jailbreaking-llms/](https://www.sentinelone.com/cybersecurity-101/data-and-ai/jailbreaking-llms/)  
36. High-level summary of the AI Act | EU Artificial Intelligence Act, accessed on February 4, 2026, [https://artificialintelligenceact.eu/high-level-summary/](https://artificialintelligenceact.eu/high-level-summary/)  
37. Robustness and Cybersecurity in the EU Artificial Intelligence Act \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2502.16184v1](https://arxiv.org/html/2502.16184v1)  
38. LLM Jailbreaking Taxonomy \- Innodata, accessed on February 4, 2026, [https://innodata.com/llm-jailbreaking-taxonomy/](https://innodata.com/llm-jailbreaking-taxonomy/)  
39. A Practical Incident-Response Framework for Generative AI Systems \- MDPI, accessed on February 4, 2026, [https://www.mdpi.com/2624-800X/6/1/20](https://www.mdpi.com/2624-800X/6/1/20)  
40. Deprecating Benchmarks: Criteria and Framework \- arXiv, accessed on February 4, 2026, [https://arxiv.org/html/2507.06434v1](https://arxiv.org/html/2507.06434v1)  
41. (PDF) Benchmark Inflation: Revealing LLM Performance Gaps Using Retro-Holdouts, accessed on February 4, 2026, [https://www.researchgate.net/publication/384929242\_Benchmark\_Inflation\_Revealing\_LLM\_Performance\_Gaps\_Using\_Retro-Holdouts](https://www.researchgate.net/publication/384929242_Benchmark_Inflation_Revealing_LLM_Performance_Gaps_Using_Retro-Holdouts)  
42. Gaming ASR: Why Attack Success Rate (ASR) Alone Can Mislead Security Teams, accessed on February 4, 2026, [https://www.cyberdefensemagazine.com/gaming-asr-why-attack-success-rate-asr-alone-can-mislead-security-teams/](https://www.cyberdefensemagazine.com/gaming-asr-why-attack-success-rate-asr-alone-can-mislead-security-teams/)  
43. Overview of the Code of Practice | EU Artificial Intelligence Act, accessed on February 4, 2026, [https://artificialintelligenceact.eu/code-of-practice-overview/](https://artificialintelligenceact.eu/code-of-practice-overview/)  
44. Introduction to the NIST AI Risk Management Framework (AI RMF) \- Centraleyes, accessed on February 4, 2026, [https://www.centraleyes.com/nist-ai-risk-management-framework/](https://www.centraleyes.com/nist-ai-risk-management-framework/)  
45. NIST AI RMF Principle: Measure \- IS Partners, LLC, accessed on February 4, 2026, [https://www.ispartnersllc.com/hubs/nist-ai-rmf/measure/](https://www.ispartnersllc.com/hubs/nist-ai-rmf/measure/)  
46. Key Application Security Metrics Show Few Signs of Improvement \- Dark Reading, accessed on February 4, 2026, [https://www.darkreading.com/application-security/key-application-security-metrics-show-little-sign-of-improvement](https://www.darkreading.com/application-security/key-application-security-metrics-show-little-sign-of-improvement)  
47. Harnessing Response Consistency for Superior LLM Performance: The Promise and Peril of Answer-Augmented Prompting \- MDPI, accessed on February 4, 2026, [https://www.mdpi.com/2079-9292/13/23/4581](https://www.mdpi.com/2079-9292/13/23/4581)  
48. Risk Mitigation Strategies for the Open Foundation Model Value Chain \- Partnership on AI, accessed on February 4, 2026, [https://partnershiponai.org/resource/risk-mitigation-strategies-for-the-open-foundation-model-value-chain/](https://partnershiponai.org/resource/risk-mitigation-strategies-for-the-open-foundation-model-value-chain/)  
49. Azure OpenAI in Microsoft Foundry model deprecations and retirements, accessed on February 4, 2026, [https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/model-retirements?view=foundry-classic](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/model-retirements?view=foundry-classic)  
50. Understanding Zombie APIs: A Hidden Security Risk | Wiz, accessed on February 4, 2026, [https://www.wiz.io/academy/api-security/zombie-apis](https://www.wiz.io/academy/api-security/zombie-apis)  
51. Biden-Harris Administration Announces Regulatory Framework for the Responsible Diffusion of Advanced Artificial Intelligence Technology \- Bureau of Industry and Security, accessed on February 4, 2026, [https://www.bis.gov/press-release/biden-harris-administration-announces-regulatory-framework-responsible-diffusion-advanced-artificial](https://www.bis.gov/press-release/biden-harris-administration-announces-regulatory-framework-responsible-diffusion-advanced-artificial)  
52. Export Control Diffusion Confusion \- Oracle, accessed on February 4, 2026, [https://www.oracle.com/news/announcement/blog/export-control-diffusion-confusion-2025-01-05/](https://www.oracle.com/news/announcement/blog/export-control-diffusion-confusion-2025-01-05/)  
53. Understanding the Artificial Intelligence Diffusion Framework \- RAND, accessed on February 4, 2026, [https://www.rand.org/pubs/perspectives/PEA3776-1.html](https://www.rand.org/pubs/perspectives/PEA3776-1.html)  
54. Framework for Artificial Intelligence Diffusion \- Federal Register, accessed on February 4, 2026, [https://www.federalregister.gov/documents/2025/01/15/2025-00636/framework-for-artificial-intelligence-diffusion](https://www.federalregister.gov/documents/2025/01/15/2025-00636/framework-for-artificial-intelligence-diffusion)  
55. A Voluntary AI Rating System Can Balance Innovation and Consumer Protection, accessed on February 4, 2026, [https://www.promarket.org/2025/10/22/a-voluntary-ai-rating-system-can-balance-innovation-and-consumer-protection/](https://www.promarket.org/2025/10/22/a-voluntary-ai-rating-system-can-balance-innovation-and-consumer-protection/)  
56. Open Source AI's Original Sin: The Illusion of Democratization \- Ranjan Kumar, accessed on February 4, 2026, [https://ranjankumar.in/open-source-ais-original-sin-the-illusion-of-democratization](https://ranjankumar.in/open-source-ais-original-sin-the-illusion-of-democratization)  
57. AI governance as a competitive advantage | EY \- US, accessed on February 4, 2026, [https://www.ey.com/en\_us/cro-risk/ai-governance-as-a-competitive-advantage](https://www.ey.com/en_us/cro-risk/ai-governance-as-a-competitive-advantage)  
58. Why AI ethics is now a competitive advantage \- I by IMD, accessed on February 4, 2026, [https://www.imd.org/ibyimd/artificial-intelligence/why-ai-ethics-is-now-a-competitive-advantage/](https://www.imd.org/ibyimd/artificial-intelligence/why-ai-ethics-is-now-a-competitive-advantage/)  
59. Holland & Knight Health Dose: January 6, 2026 | Insights, accessed on February 4, 2026, [https://www.hklaw.com/en/insights/publications/2026/01/holland-knight-health-dose-january-6-2026](https://www.hklaw.com/en/insights/publications/2026/01/holland-knight-health-dose-january-6-2026)  
60. LESSONS FROM THE FDA FOR AI \- AI Now Institute, accessed on February 4, 2026, [https://ainowinstitute.org/wp-content/uploads/2024/08/20240801-AI-Now-FDA.pdf](https://ainowinstitute.org/wp-content/uploads/2024/08/20240801-AI-Now-FDA.pdf)  
61. What is AI Regression Testing? A Beginner's Guide | BrowserStack, accessed on February 4, 2026, [https://www.browserstack.com/guide/ai-regression-testing](https://www.browserstack.com/guide/ai-regression-testing)  
62. AI in Safety Management and Software Testing: Ensuring Reliable, Secure Systems, accessed on February 4, 2026, [https://www.softwaretestingmagazine.com/knowledge/ai-in-safety-management-and-software-testing-ensuring-reliable-secure-systems/](https://www.softwaretestingmagazine.com/knowledge/ai-in-safety-management-and-software-testing-ensuring-reliable-secure-systems/)  
63. DeepSh\*t: Exposing the Security Risks of DeepSeek-R1 \- HiddenLayer, accessed on February 4, 2026, [https://hiddenlayer.com/innovation-hub/deepsht-exposing-the-security-risks-of-deepseek-r1/](https://hiddenlayer.com/innovation-hub/deepsht-exposing-the-security-risks-of-deepseek-r1/)  
64. AutoRAN: Automated Hijacking of Safety Reasoning in Large Reasoning Models, accessed on February 4, 2026, [https://openreview.net/forum?id=Nrr35WpJn9](https://openreview.net/forum?id=Nrr35WpJn9)