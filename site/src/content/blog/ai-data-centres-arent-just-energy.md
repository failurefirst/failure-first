---
title: "AI Data Centres Aren't Just an Energy Problem — and the Senate Inquiry Is About to Miss the AI Half"
description: "Australia's Senate inquiry into AI and data centres frames the buildout as energy and water. That frame is right but incomplete: the 'AI' half — vendor self-attested safety, the embodied-action frontier, sovereign verification — has no comparable governance machinery. Here is the argument we are lodging."
date: 2026-06-26
tags: ["ai-governance", "ai-policy", "australia", "data-centres", "red-teaming", "embodied-ai", "accountability"]
draft: true  # unpublished until operator clears go; image + slides landed, audio recovery pending, video generating
image: "https://cdn.failurefirst.org/images/blog/ai-data-centres-arent-just-energy.png"
slides: "https://cdn.failurefirst.org/slides/blog/ai-data-centres-arent-just-energy.pdf"
video: "https://cdn.failurefirst.org/video/blog/ai-data-centres-arent-just-energy.mp4"
audio: "https://cdn.failurefirst.org/audio/blog/ai-data-centres-arent-just-energy.m4a"
---

Australia's Senate Environment and Communications References Committee is inquiring into artificial intelligence and data centres, with submissions closing 26 June 2026. The terms of reference point squarely at the right things: the effectiveness of existing regulatory frameworks for data-centre growth (including government deals with global AI companies), and the impacts on communities, industry, the environment, water, and energy. We are preparing a submission to that inquiry, and this post sets out its central argument.

The framing is correct, and it is necessary. Data centres are a real and growing electricity and water load — the Australian Energy Market Operator now models them as a distinct demand category, on the order of 2% of National Electricity Market supply today and rising toward ~6% by 2029–30 in its central scenario — and the fairness question of who pays for that load is a genuine public problem. We agree the buildout should pay its own way. That is the energy and water half.

But the inquiry's own title names *AI*, and the AI half has no comparable governance machinery. The models running inside these data centres carry safety commitments that nobody independent checks; a growing share of them are embodied, physical-action systems whose failures cannot be caught by content moderation; and Australia's ability to verify any of this independently is still voluntary and non-binding. The energy hearing and the AI hearing are being held in the same room, and only one of them has furniture.

We confine this post to the AI half — the part where we hold directly relevant evidence.

### The verification gap: a self-attested safety commitment is not a safety commitment

When the Commonwealth signs an agreement with a global AI company that includes a safety, security, or "responsible AI" commitment, the central question is who checks it. Our evidence says the answer cannot be "the vendor."

We are an independent AI-safety research group; our work is the adversarial evaluation — "red-teaming" — of AI models. To date we have evaluated 296 distinct models across 143,538 adversarial prompts and 154,958 graded results. The numbers below come from that corpus, and we state the grading methodology in each case, because — as we are about to show — the methodology changes the number.

- **In our corpus, the cheap, scalable safety check a vendor can run over its own outputs performs near chance as a safety verdict.** In a dual-graded sample, a keyword classifier and language-model judges agreed only at κ = 0.126 — near chance (95% CI [0.108, 0.145]; n = 1,989); against a single stronger LLM judge the agreement was even lower, κ = 0.097. The errors run in both directions: of the cases the heuristic marked as model "compliance," roughly 80% were not compliance on the LLM judge's reading — the model refused, gave a benign response, or produced an ungradeable reply — while in our multi-turn evaluation the same kind of heuristic missed roughly one in six real compliance cases. A safety process that relies on this kind of automated self-check is measuring surface style, not semantic harm, and it is unreliable in both directions.

- **A single automated language-model judge can be plainly wrong.** In one frontier-model readiness sweep, an in-pipeline LLM grader flagged all 8 cases as safety breaches; on careful trace-by-trace human adjudication, all 8 were overturned — they were refusals or surface-level reframings, not real failures. That is an existence proof, from one sweep, that a single automated grader can be plainly wrong, regardless of who runs it. The separate, structural problem is that a grader run by the party with an interest in the result is the wrong party to grade it: our evidence above is that automated safety assessment is hard to get right even with no conflict of interest, so handing it to the party with a stake in the outcome does not help.

- **The gap widens exactly where it matters — multi-turn, conversational use.** In a separate multi-turn analysis counting only the cases the heuristic labelled compliance that were in fact refusals, the over-report rate is 39.1% for multi-turn use versus 3.8% single-turn in our evaluation: nearly four in ten multi-turn responses the heuristic labels as compliance are actually refusals. (This is a narrower, refusal-only count; the roughly 80% figure above counts all heuristic-compliance cases not confirmed as compliance, including benign or ungradeable replies — different measures from different analyses, not a contradiction.) The more an AI is used the way government and the public actually use it, the less trustworthy a quick self-assessment becomes.

This is not an accusation of bad faith against any vendor. It is a measurement problem: safety is hard to measure, easy to over-claim, and the party making the commitment is the wrong party to grade it.

Australia's current settings rest on exactly the assurance our evidence shows to be weak. The Commonwealth's own Voluntary AI Safety Standard already names the right activity — Guardrail 4 calls for adversarial testing of general-purpose AI — but it is voluntary, carries no legal force, and does not require the testing be done by an independent third party. The Digital Transformation Agency's AI Model Clauses place self-attestation obligations on the supplier. The Australian AI Safety Institute, established in late 2025, is explicitly non-regulatory: it can test and advise, but it cannot enforce and is not a gate on procurement. As far as we can establish, no Commonwealth law or procurement rule requires an AI model to pass an independent third-party adversarial evaluation before government buys or deploys it.

The deals are large and already moving. Public announcements include Microsoft (~A$5bn in 2023, a further ~A$25bn in 2026 under a government MOU), Amazon Web Services (~A$13.2bn in 2023, a further ~A$20bn in 2025, plus a ~A$2bn sovereign cloud for Defence and intelligence), an OpenAI–NEXTDC campus (~A$7bn), and a research MOU with Anthropic. The government's own AI MOUs are explicitly non-binding statements of intent. So the safety commitments underneath tens of billions of dollars of infrastructure and government dependence are voluntary, non-binding, and self-attested.

Our submission recommends that independent adversarial evaluation become a binding condition of any safety commitment in a government AI deal, and of frontier-AI procurement — turning the activity Australia already endorses on paper into something an independent party actually verifies.

### The embodied frontier: a failure that is a physical act, not a sentence

Much of the AI being built and hosted today is no longer text-only. Vision-language-action (VLA) models take a natural-language instruction and a camera feed and emit physical actions — they drive, grasp, actuate. Data centres are increasingly built to train and serve exactly these systems. Australia's current AI safety settings were not designed for them, and the gap is structural.

As the technical literature puts it, unsafe VLA actions "directly affect the physical world with potentially irreversible outcomes. A misapplied surgical tool, an autonomous vehicle that ignores a pedestrian, or an industrial robot that disregards a safety zone cannot be corrected by a content moderation filter after the fact" (Li et al., "Vision-Language-Action Safety," arXiv:2604.23775, 2026). Australia's existing AI-harm instruments — the Online Safety Act, the proposed Digital Duty of Care — are content-and-online-harm instruments. They do not reach an actuator.

The metric is different too. A text-AI jailbreak breaks a refusal. A physical-action model is trained to act, not to refuse, so there is frequently no refusal to break — the right thing to measure is whether an adversarial instruction causes an unsafe physical action, relative to a safe-action baseline. We have built and bench-tested a prototype "kinematic safety shield" — a last-line check that vetoes unsafe actuation — on a physical robot platform. We mention this only to show the problem is tractable and that independent Australian capability exists; we make no claim that any complete safety architecture is deployed.

Our submission recommends Australia's AI safety settings be extended to cover embodied and VLA systems, recognising that their harms are physical and require action-level, not content-level, evaluation.

### Sovereign capability: verification that actually binds a decision

All of the above requires one thing: the independent capability to adversarially evaluate frontier AI, coupled to a point where that evaluation actually binds a decision.

Australia has made a start. It established an Australian AI Safety Institute in late 2025 (funded at roughly A$30 million over four years) and is a founding member of the international network of AI Safety Institutes. But two structural gaps remain. The institute cannot enforce — it can test and advise, it is not a regulator, and it is not a gate on any government deal. And Australia declined to proceed with the mandatory high-risk "guardrails" it consulted on in 2024, choosing voluntary guidance instead. So the verification capability exists in principle but binds nothing in practice.

The constructive step is modest and additive: fund a standing sovereign evaluation function able to red-team imported models, verify the safety commitments embedded in government deals, and assess the embodied systems arriving on Australian infrastructure — and tie its evaluation to the points where it matters: the deal, the procurement, the deployment. This lets the Commonwealth check the claims it is currently asked to take on trust, and gives the AI Safety Institute's work somewhere to land.

### What this post is not

This is not opposition to the data-centre buildout, and it is not an argument that the energy and water framing is wrong — it is incomplete. We take no position on detailed grid engineering, planning, or telecommunications policy, and we have flagged in the submission where a claim rests on overseas data because Australian-specific data is not yet public. We are not alleging bad faith by any vendor; the point is that self-attestation is the wrong structure regardless of the vendor's motives. And we are not claiming our corpus settles every question — it settles one question, which is how unreliable automated, self-reported safety assessment is.

### The one-sentence ask

The fairest energy and water arguments in the world will not help if the AI running in the data centres cannot be independently checked. Make verification bind — at the deal, at the procurement, at the deployment — and build the sovereign capability to do it.

---

*Failure-First Embodied AI — independent adversarial AI-safety research. We will link the full submission here once it appears on the inquiry's public record. Corpus as at June 2026: 296 models / 143,538 prompts / 154,958 graded results; grading methodology stated inline for every figure.*