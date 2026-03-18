---
title: "A Robot That Could Fracture a Human Skull: The Figure AI Whistleblower Case"
description: "A fired engineer alleges Figure AI's humanoid robot generated forces more than double those required to break an adult skull — and that the company gutted its safety plan before showing the robot to investors. The case exposes a regulatory vacuum around humanoid robot safety testing."
date: 2026-03-18
tags: [embodied-ai, robotics, incident-analysis, safety, humanoid, figure-ai, regulation]
---

In November 2025, a former safety engineer at Figure AI filed a whistleblower lawsuit alleging that the company's F.02 humanoid robot had demonstrated forces capable of killing a human — and that the company suppressed internal safety concerns to maintain its investment timeline.

The lawsuit did not describe a hypothetical risk. It described a specific incident in which a robot punched a refrigerator hard enough to leave a quarter-inch gash in stainless steel, narrowly missing a nearby employee.

---

## What we know

The claims come from a wrongful termination lawsuit filed in California. The core allegations, as reported by [CNBC](https://www.cnbc.com/2025/11/19/figure-ai-whistleblower-claims-humanoid-robot-could-hurt-humans.html), [Futurism](https://futurism.com/the-byte/figure-robot-fracture-human-skull), and [Interesting Engineering](https://interestingengineering.com/innovation/figure-ai-humanoid-robot-could-break-human-skull):

- The Figure F.02 humanoid robot struck a refrigerator during testing, leaving a 1/4-inch gash in stainless steel. An employee was standing nearby.
- Internal testing measured forces "more than double those required to break an adult skull."
- The company had developed a safety plan but allegedly "gutted" it before presenting the robot to investors.
- The whistleblower was terminated days after raising safety concerns internally.
- Figure AI has denied the allegations.

Figure AI, founded in 2022, has raised over $1.5 billion in funding. The F.02 is a general-purpose humanoid robot intended for warehouse and logistics work alongside humans.

---

## The force problem

The specific claim about skull fracture force is worth examining in context. The human skull fractures under approximately 500-700 newtons of focused impact force, depending on the region and individual variation. A quarter-inch gash in stainless steel from a punch requires substantially more than that — likely in the range of several thousand newtons.

For comparison:

| Source | Approximate force |
|---|---|
| Human punch (average) | 300-500 N |
| Human punch (trained boxer) | 2,500-5,000 N |
| Skull fracture threshold (temporal bone) | 500-700 N |
| Skull fracture threshold (frontal bone) | 1,000-1,800 N |
| Industrial robot arm (typical operational) | 500-10,000+ N |

If the whistleblower's claims are accurate, the F.02 was operating in a force regime comparable to an industrial robot arm — inside a workspace shared with humans. Industrial robots operating at those force levels are required to have physical cages, light curtains, or other safety barriers separating them from human workers. The F.02 had none of these, because it is designed to work alongside people.

This is the fundamental tension in humanoid robotics. The whole point is human-proximate operation. But the actuators required to perform useful physical work — lifting boxes, manipulating objects, navigating unstructured environments — can generate forces well beyond human injury thresholds. A robot strong enough to be useful is strong enough to be dangerous.

---

## The safety plan allegation

The more structurally concerning claim is not about the force measurements themselves — any competent robotics team would discover these during testing — but about what allegedly happened next.

According to the lawsuit, Figure AI developed an internal safety plan to address the identified risks. That plan was then "gutted" before the robot was demonstrated to investors. If true, this describes a pattern where safety engineering was treated as a liability to the business case rather than a core requirement.

This is not unique to Figure AI. The humanoid robotics sector in 2025-2026 is characterized by intense competition for a relatively small pool of major investment capital. Companies including Figure, Tesla (Optimus), Agility Robotics (Digit), Apptronik (Apollo), and 1X Technologies are all racing to demonstrate capable humanoid platforms. In that environment, safety constraints that slow demonstrations or limit impressive capability showcases create direct competitive pressure.

The whistleblower's termination days after raising concerns — if the timeline is as described — follows a pattern documented across industries where safety culture conflicts with business timelines.

---

## The regulatory vacuum

Here is the part that matters most for the Failure-First research program: there are currently no federal safety testing requirements specific to humanoid robots in the United States.

The existing framework:

| Standard | Scope | Applies to humanoids? |
|---|---|---|
| ISO 10218-1/2 | Industrial robots and robot systems | Partially — designed for fixed-base arms, not mobile humanoids |
| ISO/TS 15066 | Collaborative robot safety | Partially — force limits defined for specific body contacts |
| OSHA General Duty Clause | Employer must provide safe workplace | Yes, but reactive (after injury), not proactive |
| ANSI/RIA R15.08 | Industrial mobile robots | Partially — mobile base, not humanoid manipulation |
| NIST frameworks | Various robotics standards | Advisory, not mandatory |

None of these standards were designed for a 170cm bipedal robot with two arms operating at industrial force levels in a shared human workspace. ISO/TS 15066 defines contact force limits for collaborative robots — but those limits assume a robot arm bolted to a table, not a walking platform that can approach a human from any direction.

The result is that a company can develop a humanoid robot capable of fracturing a human skull, test it in a facility with human workers present, and face no mandatory reporting requirement, no pre-deployment safety certification, and no regulatory review — unless and until someone is actually injured.

---

## What this means

The Figure AI case — regardless of how the lawsuit resolves — illustrates three structural problems:

**1. Force-capable humanoids are shipping without force safety standards.**
The humanoid robotics industry is deploying platforms with industrial-grade actuators into human-proximate environments, and the safety standards that govern those environments were written for a different class of machine. The standards gap is not a future risk. It exists now.

**2. Investment pressure and safety engineering are in direct tension.**
When safety plans are perceived as obstacles to funding rounds, the incentive structure is misaligned. This is not a claim about Figure AI specifically — it is an observation about any capital-intensive hardware startup where demonstration capability drives valuation.

**3. Whistleblower protection is the only current safety mechanism.**
In the absence of mandatory pre-deployment safety testing, the only mechanism that surfaced this information was a fired employee filing a lawsuit. That is not a safety system. It is an accident of litigation.

---

## The bottom line

A humanoid robot punched a refrigerator hard enough to gash stainless steel. An employee was standing nearby. Internal tests showed the robot could generate skull-fracturing forces. The company allegedly weakened its safety plan before investor demonstrations. The engineer who raised concerns was terminated.

Whether every specific allegation in the lawsuit proves accurate is a matter for the courts. But the structural conditions that made this situation possible — no mandatory safety testing, no force limits for humanoid platforms, no pre-deployment certification — are not allegations. They are the current state of humanoid robot regulation in the United States.

The question is not whether a humanoid robot will seriously injure a human worker. The question is whether that will happen before or after mandatory safety standards exist.

---

## References

1. CNBC, "Figure AI sued by former safety engineer," Nov 21, 2025. [https://www.cnbc.com/2025/11/21/figure-ai-sued.html](https://www.cnbc.com/2025/11/21/figure-ai-sued.html)
2. Futurism, "Whistleblower fired after warning robot could crush skull." [https://futurism.com/robots-and-machines/whistleblower-fired-warning-robot-crush-skull](https://futurism.com/robots-and-machines/whistleblower-fired-warning-robot-crush-skull)
3. Interesting Engineering, "Figure AI faces whistleblower lawsuit." [https://interestingengineering.com/innovation/figure-ai-faces-whistleblower-lawsuit](https://interestingengineering.com/innovation/figure-ai-faces-whistleblower-lawsuit)

---

*This analysis is part of the [Failure-First Embodied AI](https://failurefirst.org) research program, which studies how embodied AI systems fail — because failure is not an edge case, it is the primary object of study.*

*Sources: [CNBC](https://www.cnbc.com/2025/11/19/figure-ai-whistleblower-claims-humanoid-robot-could-hurt-humans.html), [Futurism](https://futurism.com/the-byte/figure-robot-fracture-human-skull), [Interesting Engineering](https://interestingengineering.com/innovation/figure-ai-humanoid-robot-could-break-human-skull). Figure AI has denied the whistleblower's allegations.*
