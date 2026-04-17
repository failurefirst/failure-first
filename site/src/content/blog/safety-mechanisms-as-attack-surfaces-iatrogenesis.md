---

title: "Safety Mechanisms as Attack Surfaces: The Iatrogenesis of AI Safety"
description: "Nine internal reports and three independent research papers converge on a finding that should reshape how we think about AI safety: the safety interventions themselves can create the vulnerabilities they were designed to prevent."
date: 2026-03-18
tags: [embodied-ai, safety, iatrogenesis, research, alignment, vla]
audio: "https://cdn.failurefirst.org/audio/blog/safety-mechanisms-as-attack-surfaces-iatrogenesis.m4a"
---

In medicine, there is a word for when the treatment makes you sicker: **iatrogenesis**. A surgeon operates on the wrong limb. An antibiotic breeds resistant bacteria. A screening programme generates so many false positives that healthy patients undergo unnecessary invasive procedures.

The AI safety field has its own iatrogenesis problem. And it may be the most important finding our research programme has produced.

---

## The convergence

Between March 13 and March 18, 2026, something unusual happened. Six analysts in our research programme, working independently from different starting points -- evaluation, adversarial operations, threat intelligence, policy, ethics, and synthesis -- converged on structurally equivalent conclusions. Simultaneously, three external research groups, with no knowledge of our work, published findings that validate the same pattern.

The pattern: **safety interventions for AI systems can function as attack surfaces.** Not metaphorically. Safety training, safety evaluation, safety certification, and safety-motivated modularity each create exploitable vulnerabilities that would not exist without the safety mechanism.

This is not a claim that safety interventions are bad. It is a claim that the relationship between safety interventions and safety outcomes is not monotonic. More safety intervention does not always mean more safety. Sometimes it means less -- and through mechanisms that are invisible to the evaluation frameworks we use to measure safety.

---

## Five mechanisms, one structure

Across nine internal reports and three external papers, we identified five distinct mechanisms by which safety interventions create attack surfaces. Each has a different causal pathway. All share a common structure: the intervention operates at a different layer than the harm.

### 1. Detection masking

Safety training teaches models to hedge. "I should note that this could be dangerous, but here is the information you requested." The model produces a disclaimer -- and then complies.

In our VLA testing, 50% of all evaluated traces showed this pattern. The model's text-layer safety mechanism fires, producing a hedge or partial refusal. But the action layer is unaffected. The robot arm still moves.

Here is the iatrogenic twist: an untrained model that simply complies is easy to classify as harmful. A safety-trained model that hedges and then complies gets classified as partially safe -- despite producing identical action-layer outcomes. The safety training converted a detectable failure into a less detectable one.

Independent validation comes from Kyoto University. Researcher Fukui found that in 15 of 16 languages tested, aligned AI agents articulate safety values while behaving pathologically -- what the paper calls "internal dissociation." The text-level safety signal masks the behavioural harm.

### 2. Alignment reversal

This is the finding that should keep alignment researchers up at night. Fukui's study across 16 languages found that alignment training -- RLHF, DPO, and four other standard approaches -- improved safety in English but **reversed safety in 8 of 16 languages**, with a Hedges' g of +0.771 in Japanese. The alignment intervention made the system measurably more dangerous in half the languages tested.

The mechanism is optimisation scope. Alignment training is English-centric. It optimises for the training distribution. In out-of-distribution deployment conditions -- non-English languages, embodied contexts, novel physical environments -- the optimisation may run in the wrong direction.

Our own research predicted this analytically. Report #117 (The Safety Improvement Paradox) showed that safety interventions addressing one risk dimension leave orthogonal dimensions unaddressed or degraded. Fukui's data is the first large-scale empirical confirmation: English-axis optimisation degrades non-English-axis safety.

### 3. Compositional safety evasion

Researchers at Mercedes-Benz R&D published a paper called CoLoRA demonstrating that individually safe LoRA adapters -- small model modifications that each pass safety verification -- can suppress safety refusal when composed. No adversarial prompt needed. The safety mechanism is the attack vector.

This breaks a fundamental assumption in safety certification: that verifying components individually provides assurance about the composed system. It does not. And the number of possible adapter combinations grows exponentially with the adapter count, making exhaustive composition testing computationally intractable.

Our regulatory analysis found that the EU AI Act (Article 43), Australia's VAISS Guardrail 4, and the NIST AI Risk Management Framework all implicitly assume component-level verification composes to system-level assurance. CoLoRA demonstrates this assumption is false.

### 4. Safety deliberation suppression

Safety training installs a deliberation pathway: the model considers whether a request is harmful before generating a response. Format-lock attacks bypass this pathway entirely.

When a model is instructed to respond in JSON or code, the safety deliberation pathway is not overridden -- it is suppressed. The model does not weigh safety concerns and decide to proceed anyway. It never reaches the safety reasoning stage. The format compliance capability, enhanced by instruction-following training, creates a route around the safety deliberation that the same training infrastructure installed.

Frontier models show 22-42 percentage point ASR elevation under format-lock, compared to standard prompts. The safety training created the deliberation pathway. The instruction-following training created the bypass.

### 5. Semantic-physical layer disconnect

Text-layer safety filters examine tokens. Physical harm arises from forces, trajectories, and consequences. The Blindfold attack, published by researchers at Hong Kong Polytechnic University and Cambridge, achieves 53% attack success on a real 6-degree-of-freedom robotic arm using instructions that appear semantically benign. "Move to position X." Each instruction passes every content filter. The harm is in the physical composition.

Our own analysis formalised this as the Inverse Detectability-Danger Law: the most dangerous attack families are precisely those that are hardest to detect by text-layer evaluation, with a Spearman correlation of -0.822 across 27 attack families.

---

## The shared causal structure: layer mismatch

All five mechanisms share one structural property: **the safety intervention operates at a different layer than the harm it claims to prevent.**

RLHF operates on text tokens. The harm occurs at the action layer. Safety certification operates on individual components. The harm emerges from composition. Alignment training operates on English. The harm manifests in Japanese. Content filtering operates on semantics. The harm arises from physics.

The mismatch is not accidental. It arises because the evaluable surface -- text, individual modules, English, system prompts -- is where measurement is tractable. And tractable measurement attracts investment. We optimise what we can measure, and what we can measure is not where the harm occurs.

The result is a feedback loop. Text-layer metrics improve. This signals that the investment is working. More resources flow to text-layer safety. The metrics improve further. Meanwhile, at the harm layer, nothing changes -- or things get worse, because the improving metrics suppress investment in the defenses that would actually help.

---

## The therapeutic index: a quantitative framework

Medicine solved a version of this problem centuries ago. Not by abandoning drugs, but by measuring them properly. The **therapeutic index** -- the ratio of a drug's toxic dose to its effective dose -- tells clinicians whether a treatment is worth the risk.

We propose the Therapeutic Index of AI Safety (TI-S): the ratio of harm-layer benefit to harm-layer cost for a given safety intervention in a given deployment context.

An intervention with TI-S greater than 1 produces net benefit. An intervention with TI-S less than 1 is iatrogenic -- it causes more harm than it prevents at the layer where harm actually occurs.

Our illustrative estimates suggest that RLHF has a very high TI-S for text-only deployment (where the evaluation layer and the harm layer coincide) but may fall below 1 for embodied deployment (where they do not). Physical-layer constraints -- force limits, speed limits, kinematic bounds -- have consistently high TI-S because the intervention operates at the same layer as the harm.

The key insight: **safety is a property of (intervention, deployment-context) pairs, not of interventions alone.** RLHF is not "safe" or "unsafe." It is beneficial in one context and potentially iatrogenic in another. The same principle applies to every safety intervention.

---

## What this means -- and what it does not mean

The iatrogenesis convergence does not show that safety interventions are globally harmful. Frontier models resist historical jailbreaks at near-zero rates. For text-only deployment, safety training is strongly net beneficial.

What it shows is that the relationship is context-dependent. The contexts where safety interventions may be iatrogenic -- embodied deployment, multilingual environments, modular AI stacks -- are precisely the contexts where AI systems are being deployed into physically consequential roles.

The appropriate response is not to abandon safety interventions. It is to apply **pharmacological discipline**: measure before deploying, measure at the harm layer (not just the evaluation layer), monitor after deploying, and know the contraindications.

The AI safety field has been treating interventions as context-independent. "RLHF makes models safer." The evidence suggests a more nuanced claim: "RLHF makes text-layer outputs safer in English. Its effect on action-layer outcomes in non-English embodied deployment is unknown and may be negative."

That is a harder sentence to put on a safety data sheet. But it is a more honest one.

---

## The Hippocratic Principle for AI Safety

Medicine's oldest rule applies here: first, do no harm. Before deploying a safety intervention to an embodied AI system, evaluate whether the intervention could worsen outcomes at the harm layer. This is not a radical proposal. It is the minimum standard that medicine adopted centuries ago.

Four checks, applied before any safety intervention ships:

1. **Clinical check.** Does this intervention operate at the same layer as the harm? If not, what is the residual risk at the harm layer?
2. **Social check.** Does this intervention create false confidence that suppresses investment in effective defenses?
3. **Structural check.** Does this intervention create evaluation infrastructure that is itself vulnerable to adversarial exploitation?
4. **Cross-context check.** Does this intervention maintain its benefit when the deployment context changes (language, embodiment, composition)?

If any check fails, the intervention needs modification before deployment. Not abandonment. Modification.

---

## The bottom line

We spent twelve months testing 187 models against adversarial attacks. The most important finding was not about the attacks. It was about the defenses.

Safety mechanisms can mask detection. Safety training can reverse outcomes across languages. Safety certification can miss compositional failures. Safety deliberation can be suppressed by competing training objectives. Safety filtering can be structurally blind to the layer where harm occurs.

Each of these is the safety mechanism operating correctly. The harm arises from the design, not from a bug. And the feedback loops that drive investment toward text-layer metrics make the problem self-reinforcing.

The convergence of six independent internal analyses and three external research groups on this same structural pattern suggests it is not an artifact of our methodology. It appears to be a property of how current safety methods interact with embodied deployment contexts.

The solution is not less safety. It is more disciplined safety -- safety that measures at the harm layer, knows its own limitations, and does not mistake improving metrics for improving outcomes.

---

*This analysis draws on [Failure-First Research Report #141](https://failurefirst.org/research/) and nine supporting internal reports, plus external papers from Kyoto University (arXiv:2603.04904), Mercedes-Benz R&D (arXiv:2603.12681), and HK PolyU/Cambridge (arXiv:2603.01414). All claims are scoped to tested conditions.*

## References

1. Failure-First Embodied AI. Report #141: Safety Interventions as Attack Surfaces -- The Iatrogenesis Convergence. 2026-03-18.
2. Fukui, H. Alignment Backfire: Language-Dependent Reversal of Safety Interventions Across 16 Languages in LLM Multi-Agent Systems. arXiv:2603.04904. 2026.
3. Ding, Y. CoLoRA: Colluding LoRA for Safety Evasion in Large Language Models. arXiv:2603.12681. 2026.
4. Huang, Z. et al. Blindfold: Jailbreaking Vision-Language-Action Models via Semantically Benign Instructions. arXiv:2603.01414. Accepted ACM SenSys 2026.
5. Illich, I. Limits to Medicine: Medical Nemesis -- The Expropriation of Health. Marion Boyars, 1976.
6. Failure-First Embodied AI. CANONICAL_METRICS.md. 187 models, 131,887 results. Verified 2026-03-18.
