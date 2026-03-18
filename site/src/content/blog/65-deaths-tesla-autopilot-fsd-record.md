---
title: "65 Deaths and Counting: Tesla's Autopilot and FSD Record"
description: "65 reported fatalities involving Tesla Autopilot or FSD variants. A fatal pedestrian strike in Nipton with FSD engaged. An NHTSA probe covering 2.4 million vehicles. And the Optimus humanoid was remotely human-controlled at its own reveal. The gap between marketing claims and actual autonomy creates false trust — and real harm."
date: 2026-03-18
tags: [embodied-ai, autonomous-vehicles, incident-analysis, safety, tesla, autopilot, fsd, optimus, humanoid]
video: /video/incidents/tesla-optimus-falls-miami.mp4
---

As of October 2025, at least 65 fatalities have been reported in crashes involving Tesla vehicles with Autopilot or Full Self-Driving (FSD) features engaged or recently active. The number comes from a combination of NHTSA investigation records, Tesla's own reporting under Standing General Orders, police reports, and investigative journalism — primarily the ongoing tracking by the Washington Post and Reuters.

Sixty-five is not a precise number. Some fatalities involve ambiguity about whether Autopilot was engaged. Some are under active investigation. The actual number may be higher; it is unlikely to be lower.

This is not a story about whether Teslas are more or less dangerous than human-driven cars. That is a statistical debate with legitimate arguments on both sides. This is a story about what happens when the marketed capability of an autonomous system systematically exceeds its actual capability — and the gap between the two is filled by human trust.

---

## The Nipton pedestrian fatality

On January 18, 2024, a Tesla Model S struck and killed a pedestrian on a highway near Nipton, California, a small community in the Mojave Desert near the Nevada border. According to the California Highway Patrol investigation, Tesla's FSD (Supervised) system was engaged at the time of the collision.

The stretch of highway had reduced visibility due to environmental conditions. The pedestrian was on or near the roadway. The vehicle, operating under FSD control, did not avoid the collision.

This incident is significant because it represents one of the first confirmed pedestrian fatalities with Tesla's FSD system — as distinct from the more basic Autopilot — engaged. FSD (Supervised) is marketed as a more advanced system that can handle city streets, intersections, and complex driving scenarios. The Nipton crash occurred on a relatively simple road geometry — a highway — under conditions where reduced visibility was the primary challenge.

The "Supervised" designation in FSD's current product name is doing considerable legal and regulatory work. It communicates that a human driver is expected to be paying attention and ready to intervene. But the system is marketed under the name "Full Self-Driving," which communicates something quite different to consumers.

---

## The NHTSA investigation

In October 2024, NHTSA opened a formal investigation covering approximately 2.4 million Tesla vehicles, focusing on whether Autopilot's driver monitoring adequately ensures attentiveness. Previous probes led to a December 2023 recall of 2 million vehicles to strengthen attention monitoring after Autopilot was linked to nearly 1,000 crashes.

The pattern is consistent: Tesla's features reduce the driver's perceived need to pay attention, but the system's actual capability does not reliably handle all scenarios without human intervention. The gap between perceived and actual capability is the failure mode.

---

## The naming problem

Tesla calls its system "Full Self-Driving." In regulatory filings, it clarifies this is a Level 2 system — the human driver remains responsible. The "(Supervised)" label was added after regulatory pressure. "Full Self-Driving" implies the car can drive itself. "(Supervised)" implies it cannot. Both are attached to the same product.

A 2024 IIHS study found that drivers using systems with names suggesting full autonomy were more likely to engage in non-driving activities than drivers using systems with more modest names. The naming is not incidental to the safety problem. It is the safety problem. When marketed capability exceeds actual capability, the trust gap is filled by human behavior that assumes the system can handle more than it can.

---

## Optimus and the autonomy illusion

Tesla's embodied AI ambitions extend beyond vehicles. The Optimus humanoid robot, first demonstrated in prototype form in 2022, has been presented by Tesla as a future product that will perform dangerous, repetitive, or mundane tasks.

At the "We, Robot" event in October 2024, Tesla showcased Optimus robots interacting with attendees — serving drinks, conversing, and moving through the crowd. The presentation implied autonomous operation. Subsequent reporting by Bloomberg and others revealed that **the Optimus robots were being remotely controlled by human operators**, not operating autonomously.

This is not inherently dishonest — teleoperated robots are a legitimate technology, and many robotics demonstrations use some degree of human control. But the event was specifically designed to present Tesla's vision of autonomous humanoid robots, and the distinction between autonomous operation and human teleoperation was not made clear to attendees or the public during the event.

In December 2025, an Optimus prototype fell during a live demonstration in Miami. The robot lost balance and toppled forward, requiring assistance from Tesla staff. The incident was minor — no one was hurt — but it provided a public data point on the gap between Tesla's presentation of Optimus capabilities and the platform's current reliability.

---

## The trust architecture

The common thread across Tesla's Autopilot fatalities, FSD incidents, and Optimus demonstrations is a consistent pattern of **marketing-induced trust that exceeds operational capability.**

This is not unique to Tesla. It is a structural risk in any embodied AI deployment where the commercial incentive to present capability outpaces the engineering reality. But Tesla's scale — millions of vehicles with Autopilot, the most prominent humanoid robot program in the world — makes the consequences most visible.

The trust architecture is self-reinforcing: marketing creates an expectation of autonomy, users calibrate their attention to the marketed capability rather than the actual capability, and when the system encounters a scenario it cannot handle, the human is not ready to intervene. Every mile driven without incident under Autopilot increases the driver's trust and decreases their vigilance. The longer the system works, the less prepared the human is for the moment it does not.

---

## What this means for embodied AI

Tesla's record matters beyond the automotive domain because the company is simultaneously the largest deployer of driver-assistance AI and one of the most visible developers of humanoid robots. The patterns established in the vehicle program will influence how the humanoid program is perceived and regulated.

**1. Naming shapes safety outcomes.** "Full Self-Driving" creates expectations that "Advanced Driver Assistance" does not. As humanoid robots enter homes and workplaces, marketing claims will directly affect trust levels and risk exposure.

**2. Teleoperation masquerading as autonomy is a deception pattern.** When audiences believe they are seeing autonomous robots but are seeing teleoperated ones, their assessment of technology readiness is systematically wrong. The actual autonomous system will inherit trust earned by the human-controlled version.

**3. Scale Level 2 deployment is a natural experiment in human factors failure.** Millions of systems that require constant oversight, named and marketed to discourage it. In our research on [HITL oversight failure](/blog/instruction-hierarchy-subversion-long-horizon-agents), human reviewers approve approximately 78% of subtly subverted plans. Tesla's Autopilot data demonstrates the same principle at far larger scale: **human oversight degrades predictably when the system appears to work most of the time.**

---

## The bottom line

Sixty-five people have died in incidents involving Tesla's automated driving features. The number will continue to grow, because millions of vehicles with these features remain on the road, and the fundamental trust architecture — marketing claims exceeding operational reality — has not changed.

The Optimus program extends this pattern to humanoid robotics, where the stakes include direct physical interaction with humans in unstructured environments. If the automotive program's approach to capability communication is replicated in the humanoid program, the same trust gap will produce the same category of harm.

The lesson is not that autonomous vehicles or humanoid robots are inherently dangerous. The lesson is that the gap between marketed capability and actual capability is itself a hazard — and that no amount of engineering excellence can compensate for a trust architecture that systematically leads humans to over-rely on systems that need their supervision.

The 65 deaths are not a software problem. They are a trust problem. And trust problems do not get fixed with over-the-air updates.

---

## References

1. Bloomberg, "Tesla Full Self-Driving crash investigation," 2025. [https://www.bloomberg.com/features/2025-tesla-full-self-driving-crash/](https://www.bloomberg.com/features/2025-tesla-full-self-driving-crash/)
2. NPR, "US probe Tesla FSD system," Oct 19, 2024. [https://www.npr.org/2024/10/19/g-s1-29030/us-probe-tesla-full-self-driving-system](https://www.npr.org/2024/10/19/g-s1-29030/us-probe-tesla-full-self-driving-system)
3. PBS, "New investigation Tesla FSD after fatal crash." [https://www.pbs.org/newshour/nation/u-s-opens-new-investigation-into-teslas-full-self-driving-system-after-fatal-crash](https://www.pbs.org/newshour/nation/u-s-opens-new-investigation-into-teslas-full-self-driving-system-after-fatal-crash)
4. Fortune, "Tesla Optimus robots fall," Dec 9, 2025. [https://fortune.com/2025/12/09/tesla-optimus-robots-fall-autonomous-demonstration-elon-musk/](https://fortune.com/2025/12/09/tesla-optimus-robots-fall-autonomous-demonstration-elon-musk/)

---

*This analysis is part of the [Failure-First Embodied AI](https://failurefirst.org) research program, which studies how embodied AI systems fail — because failure is not an edge case, it is the primary object of study.*

*Sources: NHTSA Standing General Orders reports and investigation records; Washington Post and Reuters fatality tracking; California Highway Patrol reports; IIHS consumer survey data; Bloomberg reporting on Optimus teleoperation.*
