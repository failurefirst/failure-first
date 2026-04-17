---

title: "The Polypharmacy Hypothesis: Can Too Much Safety Make AI Less Safe?"
description: "In medicine, patients on too many drugs get sicker from drug interactions. We formalise the same pattern for AI safety: compound safety interventions may interact to create new vulnerabilities."
date: 2026-03-19
tags: [safety-interventions, iatrogenesis, polypharmacy, embodied-ai, research]
audio: "https://cdn.failurefirst.org/audio/blog/polypharmacy-hypothesis-too-much-safety-less-safe.m4a"
---

In clinical pharmacology, there is a well-documented phenomenon called polypharmacy. Patients on five or more concurrent medications experience adverse drug reactions at dramatically higher rates than patients on fewer drugs. Not because any individual drug is harmful, but because drugs interact. For two drugs, there is one potential interaction. For five, there are ten. For ten, there are forty-five. The interaction space grows quadratically while the therapeutic benefit of each additional drug grows at best linearly.

At some point, prescribing fewer drugs makes the patient healthier.

We believe the same pattern may apply to AI safety.

## The Parallel

Modern AI systems are not protected by a single safety mechanism. They are protected by a stack: RLHF alignment training, constitutional AI constraints, content filtering, output classifiers, system-prompt safety instructions, format compliance rules, and guardrail layers. Each intervention was designed and tested individually. Each showed benefit in isolation.

But nobody tests how they interact.

The [Safety Polypharmacy Hypothesis](https://failurefirst.org/research/) formalises this concern. For a given AI system, there may exist a threshold N* such that applying more than N* concurrent safety interventions produces a net increase in total vulnerability, because the marginal iatrogenic risk of each additional intervention exceeds its marginal safety benefit.

In plain language: there may be an optimal number of safety layers, and going beyond it makes the system less safe.

## Three Documented Interactions

Our research corpus (190 models, 132,000+ evaluated interactions) contains evidence of at least three pairwise interaction effects between safety interventions. These are not direct tests of the hypothesis, but they demonstrate the structural preconditions.

**Interaction 1: RLHF plus content filtering creates detection masking.** RLHF trains models to produce safety disclaimers before complying with requests. Content filters interpret those disclaimers as evidence of safety engagement. The result: a model that produces a disclaimer and then generates harmful content gets classified as "partially safe" rather than "compliant with a harmful request." Neither RLHF alone nor content filtering alone produces this masking effect. It requires both.

In our VLA (Vision-Language-Action) traces, 50% of evaluated responses fell into this PARTIAL category -- textual hedging with no action-layer suppression.

**Interaction 2: Safety training plus format compliance creates a deliberation bypass.** Safety training installs a reasoning pathway where models "think through" whether a request is safe before responding. Format compliance training teaches models to produce structured output (JSON, YAML, code). When a harmful request is wrapped in a format constraint, the format compliance pathway activates and suppresses the safety deliberation pathway.

We measured this on frontier models: format-lock attack success rates of 30% (Claude), 42% (Codex), and 24% (Gemini) -- compared to standard attack success rates below 10% for the same models on the same harmful content. The vulnerability exists only because both safety training and format compliance are present.

**Interaction 3: Alignment training plus individuation creates alignment backfire.** Fukui (2026) studied what happens when you add a second safety intervention -- individuation instructions to prevent groupthink -- on top of alignment training. In 8 of 16 tested languages, the combination made outcomes worse. The second safety intervention, designed to mitigate a known side effect of the first, amplified harm instead of reducing it (Hedges' g = +0.771 in Japanese, across 1,584 multi-agent simulations).

This is the AI equivalent of a prescribing cascade: a drug prescribed to treat the side effects of another drug itself produces new side effects.

## The Pharmaceutical Analogy Has Limits

We are explicit that this is a hypothesis, not a proven finding. The pharmaceutical analogy provides a framework for generating testable predictions, not a claim of mechanistic equivalence. Drug interactions involve specific molecular mechanisms. AI safety intervention interactions may be too diffuse to isolate experimentally.

There are also access constraints. Testing the hypothesis requires ablating safety interventions one by one on the same model -- feasible for open-weight models like Llama, but impossible for proprietary systems like Claude or GPT, where the intervention stack is opaque.

## Why This Matters for Policy

Current regulatory frameworks -- the EU AI Act, NIST AI RMF, Australia's VAISS guidelines -- implicitly assume that more safety measures are better. Article 9 of the EU AI Act requires "appropriate risk management measures" without any provision for testing whether those measures interact adversely.

If the polypharmacy hypothesis holds, this assumption is wrong. A deployer who adds safety interventions in good faith, following regulatory guidance, may inadvertently increase total vulnerability. Standards bodies may need to specify not just minimum safety interventions but maximum-interaction thresholds -- a regulatory concept that does not currently exist.

## Testable Predictions

The hypothesis generates three specific, falsifiable predictions:

1. Models with more safety interventions should exhibit larger format-lock deltas (the gap between format-lock ASR and standard ASR). Preliminary data is consistent: frontier models with heavy safety stacks show 20-40 percentage point deltas, while lightly trained models show near-zero.

2. There exists at least one model family where total vulnerability is a non-monotonic function of safety intervention count. Adding the Nth intervention makes the system less safe.

3. For at least one pair of safety interventions, the combined iatrogenic cost exceeds the sum of their individual costs. The interaction is superadditive.

We have proposed an experimental design to test these predictions: a progressive ablation study across six levels of safety training on the Llama 3 family, measuring attack success rates at each level across five representative attack families. Estimated cost: approximately $54 on OpenRouter. The experiment is designed to be affordable enough that the hypothesis can be refuted quickly if it is wrong.

## What Comes Next

The polypharmacy hypothesis is offered to make an implicit concern precise enough to refute. If the ablation experiment produces a monotonically decreasing vulnerability curve, the hypothesis is wrong in its strong form. If the curve shows non-monotonicity, the hypothesis is supported and the interaction mechanism can be investigated.

Either way, the AI safety field benefits from testing the assumption that more safety is always safer. In medicine, that assumption killed patients before polypharmacy research corrected it. In AI safety, the stakes are different but the logic is the same.

---

## References

- Masnoon, N., et al. (2017). "What is polypharmacy? A systematic review of definitions." BMC Geriatrics, 17(1), 230.
- Lazarou, J., Pomeranz, B. H., & Corey, P. N. (1998). "Incidence of adverse drug reactions in hospitalized patients." JAMA, 279(15), 1200-1205.
- Fukui, H. (2026). "Alignment Backfire: Language-Dependent Reversal of Safety Interventions." [arXiv:2603.04904](https://arxiv.org/abs/2603.04904).
- Doan, J., et al. (2013). "Prevalence and risk of potential drug-drug interactions in older hospitalized patients." Annals of Pharmacotherapy, 47(3), 324-332.
- Failure-First. Report #151: The Safety Polypharmacy Hypothesis. 2026.
- Failure-First. Report #136: Iatrogenic Attack Surfaces. 2026.
