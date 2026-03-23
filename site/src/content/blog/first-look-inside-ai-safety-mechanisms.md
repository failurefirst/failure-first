---
title: "First Look Inside AI Safety Mechanisms: What Refusal Geometry Tells Us"
description: "We used mechanistic interpretability to look inside an AI model's safety mechanisms. What we found challenges the assumption that safety is a single on/off switch — it appears to be a multi-dimensional structure with a dangerously narrow operating window."
date: 2026-03-23
tags: [mechanistic-interpretability, safety-mechanisms, refusal, iatrogenesis, obliteratus, steering-vectors]
---

Most AI safety research treats the model as a black box. We test inputs, observe outputs, and draw conclusions about what might be happening inside. For sixteen months, the Failure-First project has done exactly this — running adversarial evaluations across 190 models to map how AI systems fail. But testing from the outside can only tell you *that* something breaks, not *why*.

This week, we ran our first mechanistic interpretability experiments. Using OBLITERATUS, a toolkit for probing model internals, we extracted and examined the actual geometric structures that encode safety behavior inside a language model. The results are preliminary — a single small model, limited compute — but they reveal something we did not expect.

Safety is not one switch. It is a polyhedron.

---

## What We Did

We ran three experiments on Qwen 2.5 0.5B Instruct, a 494-million-parameter model from Alibaba. This is a small model — well below what the field considers frontier — but it is the right size for CPU-based interpretability work while we wait on GPU compute grants.

The experiments targeted three questions. First, what is the geometric shape of refusal inside the model? Second, what happens when you artificially amplify or suppress the refusal direction using steering vectors? Third, can you fingerprint what kind of safety training the model received by examining its internal structure?

This post focuses on the first two findings, which connect directly to patterns we have been observing in our adversarial corpus for months.

---

## Finding 1: Refusal Is Polyhedral

The standard assumption in mechanistic interpretability is that refusal is approximately linear — a single direction in the model's activation space. If you can find that direction, you can suppress it (this is the basis of "abliteration," a technique for removing safety training from open-weight models). If refusal were truly linear, removing safety would be straightforward: find the direction, subtract it, done.

Our concept cone analysis found something different. Refusal in Qwen 0.5B is **polyhedral** — it has approximately four distinct directions, one for each harm category we tested (weapons, fraud, intrusion, cyber). These directions are nearly orthogonal to each other, with a mean pairwise cosine similarity of 0.132. For context, perfectly orthogonal directions would have a cosine of 0.0, and perfectly aligned directions would have 1.0. At 0.132, these refusal directions are largely independent of each other.

Each category's refusal direction also has high specificity — between 0.845 and 0.908 — meaning each direction is largely unique to its harm category rather than shared across categories.

Here is what this means in plain language: the model does not have one "refuse harmful requests" circuit. It has separate circuits for "refuse weapons requests," "refuse fraud requests," "refuse intrusion requests," and "refuse cyber requests." These circuits operate somewhat independently.

This has immediate implications for abliteration. If you find and remove one refusal direction, you may disable the model's ability to refuse one category of harmful request while leaving others intact. A single-direction safety removal is inherently incomplete when the underlying geometry is polyhedral.

---

## Finding 2: The Layer Progression — From Polyhedral to Linear

The concept cone analysis ran across all 24 layers of the model. It revealed a progression: refusal geometry starts out most polyhedral in early layers (layer 2 had the highest dimensionality at 3.96) and becomes most linear in later layers (layer 15 had the lowest dimensionality at 3.82).

The magnitude of this convergence is modest — from 3.96 to 3.82 dimensions across all 24 layers — but the direction is consistent. Early representations maintain distinct, category-specific refusal signals. Later representations consolidate them toward a more unified refusal direction.

This pattern may help explain a finding from our adversarial corpus that has puzzled us: format-lock attacks. These are attacks that constrain the model's output format (for example, requiring JSON, tables, or structured templates) and achieve substantially higher attack success rates than content-based attacks. Format-lock ASR on frontier models ranges from 23% to 42%, compared to under 10% for standard attacks.

One hypothesis: if format constraints operate primarily on late-layer representations — which is plausible, since output formatting is a late-stage computation — they may interact with the convergence point where category-specific refusal signals consolidate into a more unified direction. Disrupting this convergence could selectively disable the integrated refusal signal while leaving earlier, category-specific signals partially intact. This would produce exactly the pattern we observe in our corpus: partial compliance, where models hedge textually but still generate the requested content. Fifty percent of all our VLA (Vision-Language-Action model) evaluations produce this PARTIAL verdict.

This remains a hypothesis. We have not yet established a causal link between late-layer linear convergence and format-lock vulnerability. But the geometric structure we observe is at least consistent with the behavioral data.

---

## Finding 3: The Narrow Therapeutic Window

The steering vector dose-response experiment produced the most striking result. We extracted a "refusal direction" from the model's middle layers and then applied it at varying strengths (alpha values from -2.0 to +2.0) to see how the model's behavior changed.

The expectation, based on prior work, was that we would see a gradual transition: as you amplify the refusal direction (positive alpha), the model should first become more cautious, then over-refuse benign requests, and eventually become non-functional. As you suppress the refusal direction (negative alpha), it should first become more permissive on harmful requests, then lose safety behavior entirely.

Instead, we observed a cliff. At alpha 0.0 (no intervention), the model is functional and mostly permissive — 5% harmful refusal rate, 100% coherence. At alpha +0.5, the model is still functional but its outputs become repetitive and degraded in quality, with coherence technically at 100% but content drifting toward incoherent loops about "devices" and "organizations." At alpha +1.0 and beyond, the model produces nothing but repeated Chinese characters — total degeneration. The same cliff appears in the negative direction: alpha -0.5 drops coherence to 82.5%, and alpha -1.0 produces complete degeneration.

There is no intermediate state where the model refuses harmful requests while remaining functional on benign ones. The transition goes directly from "functional but permissive" to "completely broken." The safe operating window — the range of steering vector strengths where the model remains coherent — is approximately plus or minus 0.5. Beyond that, in either direction, the model collapses.

This is the narrow therapeutic window we predicted in the iatrogenesis framework. The term comes from pharmacology: a drug with a narrow therapeutic window is one where the effective dose is dangerously close to the toxic dose. In our context, the "dose" is the strength of a safety intervention applied to the model's internal representations, and the "toxic effect" is the destruction of the model's general capability.

On this small model, the therapeutic window is so narrow that no useful safety intervention exists within it. You cannot steer the model toward more refusal without destroying its ability to generate coherent text. The refusal direction is entangled with general language capability — they are not separable at this scale.

---

## Limitations

These results come with significant caveats. First, this is a single model at 494 million parameters — well below the capability floor where meaningful safety behavior typically emerges. Our own corpus data shows that models below approximately 3 billion parameters are permissive to nearly all attack types regardless of technique. The narrow therapeutic window may simply reflect insufficient model capacity rather than a fundamental architectural constraint.

Second, the refusal detection in the dose-response experiment uses keyword matching, which we have documented as unreliable (Mistake #21 in our error log). At 0% refusal across nearly all conditions, false negatives are unlikely to change the conclusion, but the classification method should be noted.

Third, we tested only seven alpha values. Finer resolution — particularly in the +0.25 to +0.75 range — would better characterize the transition from functional to degenerate.

Fourth, the concept cone analysis used 20 harmful prompts across four categories, with as few as three prompts per category. The polyhedral finding is geometrically clear but the per-category sample sizes are small.

---

## What Comes Next

These are pilot results. Publication-quality findings will require the same experiments on 7B+ parameter models, where safety training has had enough capacity to develop separable refusal circuits. We expect the therapeutic window to widen at larger scales — the question is how much, and whether the polyhedral geometry persists or simplifies.

The specific experiments we want to run next: the same concept cone and dose-response analyses on Qwen 2.5 7B, Llama 3.2 8B, and at least one frontier-scale model. This requires GPU compute we do not currently have (Brev credits exhausted, Colab free tier may suffice for 7B). Multi-model comparison would also let us test the provider effect hypothesis — whether models from the same provider cluster in "alignment imprint space," which could explain the provider-level safety signatures we observe in our corpus (Anthropic 3.7% ASR vs. Qwen 43.1%).

For now, the pilot data gives us three things we did not have before: evidence that refusal geometry is multi-dimensional rather than linear, a measured therapeutic window for steering interventions, and a layer-by-layer progression that may connect to format-lock attack mechanisms. None of these are established findings yet. All of them are worth investigating further.

The inside of a model's safety mechanisms turns out to be more interesting — and more fragile — than the outside suggested.
