---

title: "Red Teaming as Security Theater: What 236 Models and 135,000 Results Taught Us"
description: "Revisiting Feffer et al.'s systematic analysis of AI red-teaming inconsistency — now with four months of empirical evidence from 236 models confirming that the 'security theater' diagnosis applies even more acutely to embodied AI."
date: 2025-12-18
arxiv: "2401.15897"
authors: "Michael Feffer, Anusha Sinha, Wesley Hanwen Deng, Zachary C. Lipton, Hoda Heidari"
paperType: "empirical"
tags: [red-teaming, ai-safety, evaluation, security-theater, methodology, embodied-ai]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/2025-12-18-red-teaming-security-theater-systematic-analysis.m4a"
---

Four months ago, we [covered Feffer et al.'s systematic analysis](/daily-paper/red-teaming-security-theater) of AI red-teaming practices and their central claim: most public red-teaming exercises function as security theater rather than rigorous safety evaluation. At the time, we noted the paper's direct relevance to the failure-first methodology and flagged several open questions about whether the diagnosis extended to embodied AI.

We now have empirical answers to some of those questions. After four months of systematic evaluation across 236 models, 135,623 graded results, and 346 documented attack techniques, the security theater diagnosis appears conservative.

### The Five Axes, Empirically Confirmed

Feffer et al. identified five axes of divergence in red-teaming practice: purpose, artifact definition, threat models, settings, and outcomes. Our corpus provides concrete evidence for each.

**Artifact definition matters more than most evaluations acknowledge.** The same model family produces wildly different safety behaviour depending on quantisation level, system prompt configuration, and whether chain-of-thought reasoning is enabled. Our work on the CoT-safety tradeoff shows that models appearing safe with reasoning disabled become vulnerable when reasoning is turned on -- a difference invisible to evaluations that test only one configuration. An evaluation that claims to have "red-teamed GPT-4" without specifying which version, which system prompt, and which inference configuration has not established which artifact it tested.

**Threat model inconsistency produces incomparable results.** We have observed inter-rater agreement (Cohen's kappa) of 0.126 between keyword heuristic classifiers and LLM-based graders on the same responses. Heuristic classifiers over-report attack success by 79.9% -- only 20.1% of responses classified as compliant by keyword matching are confirmed as compliant by LLM-based grading. When different evaluators use different classification methods, as Feffer et al. document is common, reported attack success rates become meaningless.

**Even strong graders disagree on ambiguous cases.** Our FLIP grader inter-rater agreement between Claude Haiku and Gemini collapses to kappa of 0.204 on ambiguous traces, compared to perfect agreement (kappa 1.0) on obvious cases. A single-grader attack success rate on ambiguous traces can swing from 0% to 80% depending on which grader is used. This finding should concern anyone interpreting red-teaming results that use a single evaluator.

### The Crowdworker Problem Generalises

Feffer et al. observed that resource-constrained crowdworkers gravitate toward "easy-to-produce" harms, systematically missing complex, multi-step, or context-dependent vulnerabilities. We have documented exactly this pattern in automated evaluation as well.

Our 29 documented methodological mistakes include repeated instances of the same failure mode: evaluators -- human and automated alike -- default to testing what is easy to test. Single-shot prompts are easier to generate and grade than multi-turn escalation sequences. Text-only attacks are easier to construct than multimodal ones. Context-free scenarios are easier to write than scenarios requiring environment state and physical reasoning.

The result is a systematic coverage gap. Single-turn attacks dominate the red-teaming literature because they are cheap to produce and simple to evaluate, not because they represent the most important threat model. For embodied AI systems -- where an attacker can exploit accumulated state across an interaction sequence, or where a failure manifests physically rather than textually -- this bias toward simplicity is not merely incomplete but actively misleading.

### The Embodied AI Blind Spot

Feffer et al. asked: "If red-teaming for text-only GenAI is already security theater, what does rigorous red-teaming look like for embodied AI systems where failures have physical consequences?"

Four months of work has given us a partial answer: it looks significantly more difficult than the text-only case, and the gap between current practice and adequate evaluation is wider than the original paper suggested.

Our VLA (Vision-Language-Action) evaluation work across 42 distinct model families reveals failure modes that text-only red-teaming cannot surface. Physical safety constraints interact with task completion in ways that create irreducible trade-offs. IS-Bench, published this week, demonstrates that frontier models consistently fail at *interactive* safety -- recognising hazards that emerge dynamically from the agent's own actions during task execution. A model that knows fire is dangerous but does not turn off the stove before walking away has passed a text-based safety evaluation while remaining unsafe in deployment.

The evaluation methodology gap compounds the capability gap. Process-oriented safety evaluation (does the agent mitigate the hazard *at the right step in the task sequence*?) is fundamentally harder to automate than static classification. The crowdworker problem is worse: constructing physically grounded, temporally ordered safety scenarios requires domain expertise that time-boxed crowdworkers do not have.

### From Diagnosis to Practice

The Feffer et al. paper provides the diagnosis. Our work suggests what treatment might look like:

**Standardise the artifact under evaluation.** Specify model version, quantisation, system prompt, inference configuration, and reasoning mode. An evaluation that omits these details is not reproducible.

**Use multiple independent graders and report agreement.** A single evaluator -- human or LLM -- produces verdict distributions shaped by that evaluator's biases. Reporting inter-rater reliability is the minimum standard for credible results.

**Evaluate multi-turn and stateful interactions.** Episode-based evaluation (multi-step scenarios testing stateful degradation and recovery) catches vulnerability patterns that single-shot testing misses. This is more expensive but produces coverage where it matters.

**Separate capability evaluation from safety evaluation.** IS-Bench and our iatrogenic safety work both demonstrate that safety prompting degrades task completion. Evaluations that measure only safety or only capability produce misleading pictures of system behaviour.

None of this is methodologically novel. These are standard practices in experimental science: specify your apparatus, report inter-rater reliability, test under realistic conditions, measure what you claim to measure. That these practices remain exceptional in AI red-teaming, eighteen months after Feffer et al. documented the problem, suggests the incentive structure -- not the methodology -- is the binding constraint.

---

*Previously covered: [Red-Teaming for Generative AI: Silver Bullet or Security Theater?](/daily-paper/red-teaming-security-theater) (December 2025). This post revisits the paper's claims in light of four months of empirical evaluation work.*

*Read the [full paper on arXiv](https://arxiv.org/abs/2401.15897) · [AIES 2024 proceedings](https://ojs.aaai.org/index.php/AIES/article/view/31647) · [PDF](https://arxiv.org/pdf/2401.15897)*
