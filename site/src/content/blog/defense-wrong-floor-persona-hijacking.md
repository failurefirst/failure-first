---
title: "When Your Defense Is on the Wrong Floor: Why System-Prompt Safety Fails Against Persona Hijacking"
description: "The same defense that reduces standard jailbreak success by 30 percentage points has zero effect against persona hijacking attacks. Both defense and attack operate at the system prompt level — and later instructions win."
date: 2026-03-28
image: /images/blog/defense-bypass.png
tags: [research, safety, defense, jailbreak, persona-hijacking, architecture]
---

In March 2026, we published results showing that system-prompt defenses work. The STRUCTURED defense -- a five-rule safety framework injected into the system prompt -- reduced standard attack success rates from 33% to 3%, a 30 percentage point reduction. We had corrected our earlier heuristic-based analysis, replaced keyword classification with LLM grading (FLIP), and arrived at a finding we could stand behind: simple safety instructions in the system prompt produce real, measurable defense effects against standard adversarial inputs.

Then we tested the same defense against L1B3RT4S persona hijacking attacks.

The STRUCTURED defense had zero effect. Attack success rate: 67% without defense, 67% with defense. The same five-rule safety framework that cut standard attack ASR by 30 percentage points produced a 0 percentage point reduction against persona hijacking. Not a diminished effect. Not a partial effect. No effect at all.

## What We Tested

The experiment was straightforward. We took the STRUCTURED defense -- the same system-prompt safety framework validated in our earlier work -- and tested it against six L1B3RT4S persona hijacking scenarios on Nemotron-3-Super via Ollama Cloud. The L1B3RT4S prompts are drawn from the G0DM0D3 framework (Pliny the Prompter), a corpus of 149 provider-targeted jailbreak prompts. These are not subtle. They are long, structurally elaborate system-prompt injections that attempt to override the model's identity and constraints by declaring a new persona with new rules.

The defense was injected at the beginning of the system prompt. The attack payload arrived in the user turn, which in the L1B3RT4S methodology contains the persona hijacking frame plus the actual harmful request.

Results:

| Condition | ASR (n=6) | 95% CI |
|-----------|-----------|--------|
| NONE (no defense) | 50% | [19%, 81%] |
| STRUCTURED defense | 50% | [19%, 81%] |

Both conditions produced identical outcomes: three compliances and three refusals across the same six scenarios. The defense changed nothing.

For comparison, the same STRUCTURED defense tested against standard attacks (the ten-scenario benchmark from Report #174):

| Condition | ASR (n=10) | Change |
|-----------|------------|--------|
| NONE (no defense) | 33% | -- |
| STRUCTURED defense | 3% | -30pp |

The defense that eliminated nearly all standard attack success was invisible to persona hijacking.

## Why This Happens: The Same Privilege Level Problem

The mechanism is not complicated, and that is precisely what makes it important. Both the defense and the attack operate at the same architectural level: the system prompt.

A STRUCTURED defense works by placing safety instructions early in the system prompt. These instructions tell the model what it should and should not do. When a standard attack arrives in the user turn, the model processes the user's request in the context of those system-level safety instructions, and the instructions prevail. The model has been told, at the system level, to refuse certain categories of request. It does so.

L1B3RT4S persona hijacking does not attack from the user turn in the usual sense. It injects a new system-level identity declaration -- a complete persona with its own rules, constraints, and behavioral directives. The model encounters the defense instructions first, then encounters the persona declaration second. Both are processed at the system-prompt privilege level. And in the current architecture of most language models, later instructions at the same privilege level tend to override earlier ones.

This is not a failure of the defense's content. The five safety rules are well-written and specific. It is a failure of the defense's position in the processing hierarchy. The defense occupies the same floor as the attack. The attack arrives later. Later wins.

The analogy is physical security. A sign on a door reading "Authorized Personnel Only" is effective against people who respect signs. It is not effective against someone who removes the sign, replaces it with "All Personnel Welcome," and walks through. The replacement sign has the same authority as the original -- it is, after all, just a sign on the same door. The problem is not the quality of the first sign. The problem is that signs are the only access control mechanism.

## The Defense Hierarchy

Our results, taken together with Report #315 (L1B3RT4S Cross-Scale Effectiveness) and Report #317 (L1B3RT4S Full Corpus Cross-Model Analysis), suggest a hierarchy of defense effectiveness that depends on the attack class:

**Against standard attacks:** STRUCTURED defense reduces ASR by approximately 30 percentage points. The defense operates at system level; the attack operates at user level. The privilege asymmetry favours the defense.

**Against VLA Tier 1 attacks (embodied scenarios):** Defense effects are mixed and sometimes iatrogenic. The PARTIAL dominance pattern -- where models produce safety disclaimers while leaving action-layer outputs unchanged -- means that defenses can produce the appearance of safety without the substance. In some configurations, defenses increased the rate of misleading PARTIAL responses.

**Against L1B3RT4S persona hijacking:** Defense has zero measurable effect. The attack operates at the same privilege level as the defense and arrives later in the instruction sequence. The defense is overwritten, not defeated.

This hierarchy is not surprising once stated. But it challenges a common assumption in the safety evaluation literature: that defense effectiveness is a property of the defense itself, independent of the attack class it faces. Our results suggest that defense effectiveness is a function of the relative privilege levels of defense and attack. A defense that is highly effective against lower-privilege attacks may be completely ineffective against same-privilege attacks.

## What This Means for Defense Architecture

The implication is architectural, not parametric. The solution is not a better system prompt. It is not more rules, more specific rules, or more emphatically stated rules. Any defense that operates at the system-prompt level will be vulnerable to attacks that also operate at the system-prompt level, because the model has no mechanism to distinguish "legitimate" system-prompt instructions from "injected" ones. They are, from the model's perspective, the same kind of thing.

This points toward instruction hierarchy as the necessary architectural response. An instruction hierarchy assigns different privilege levels to different sources of instructions, such that system-level instructions from the application developer cannot be overridden by content in the user turn -- regardless of how that content is formatted or what it claims to be.

Some progress has been made in this direction. Anthropic, OpenAI, and Google have published work on instruction hierarchy and system-prompt isolation. But the L1B3RT4S results suggest that current implementations remain incomplete. The G0DM0D3 corpus achieves 63-73% broad ASR against current models (Report #317), with persona hijacking as the dominant attack class at 61% of the corpus. These prompts are publicly available. The attack surface is not theoretical.

The specific architectural requirements implied by our findings:

1. **Privilege level separation.** System-prompt content set by the application developer must be processed at a higher privilege level than any content that arrives in user turns, regardless of formatting or framing.

2. **Injection detection.** Models need mechanisms to detect when user-turn content is attempting to establish system-level directives -- persona declarations, rule overrides, constraint resets.

3. **Defense placement.** Safety constraints should not compete with user-turn content for the same processing priority. They should operate at a level that user-turn content cannot reach.

None of these are novel recommendations. What our data adds is empirical evidence for why they are necessary: a concrete measurement showing that a validated, effective defense produces exactly zero benefit when the attack shares its privilege level.

## Caveats

The sample sizes are small. Six L1B3RT4S scenarios against one model is a directional finding, not a population-level measurement. The 95% confidence intervals on the ASR figures are wide ([19%, 81%]). We tested a single model (Nemotron-3-Super); other models may show different patterns.

Report #315 provides supporting evidence at larger scale: L1B3RT4S achieved 67-100% ASR across four models spanning 9B to 671B parameters, while Parseltongue character-level attacks achieved 0% on the same large models. This suggests the attack class distinction -- semantic-structural versus character-level -- is robust across model sizes, but the specific defense bypass finding reported here has been tested only on one model.

We also note that the defense we tested (STRUCTURED) is a system-prompt injection. Production safety systems use additional mechanisms -- RLHF-trained refusal behavior, content filtering layers, output classifiers. Our finding applies specifically to the system-prompt layer of defense. Whether the same persona hijacking attacks bypass trained refusal behavior is a separate empirical question, partially addressed in Report #315 (where L1B3RT4S achieved 67% ASR on the 671B Cogito model, suggesting that trained refusal alone is also insufficient).

## The Uncomfortable Conclusion

The most widely deployed defense mechanism in production AI systems -- safety instructions in the system prompt -- has a structural vulnerability to the most common class of advanced jailbreak attack. The defense and the attack share a privilege level. The attack arrives later. Later wins.

This is not a bug that can be patched with better prompting. It is a consequence of an architecture that does not distinguish between instructions from different sources at different trust levels. Until that architecture changes, system-prompt defenses will continue to work against standard attacks and fail against persona hijacking -- creating a false sense of security that is, in its own way, a form of iatrogenic harm.

---

*This analysis is based on Report #315 (L1B3RT4S Cross-Scale Effectiveness Analysis) and Report #317 (L1B3RT45 Full Corpus Cross-Model Analysis) from the Failure-First Embodied AI project. Defense effectiveness baseline data from Report #174 (Defense Effectiveness Benchmark). All ASR figures reference FLIP-graded (LLM-classified) results unless otherwise stated.*
