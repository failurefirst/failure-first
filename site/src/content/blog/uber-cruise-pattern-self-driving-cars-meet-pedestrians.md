---


title: "Uber, Cruise, and the Pattern: When Self-Driving Cars Meet Pedestrians"
description: "Uber ATG killed Elaine Herzberg after 5.6 seconds of classification cycling. Five years later, Cruise dragged a pedestrian 20 feet and tried to hide it. The failures are structurally identical — and they map directly to what we see in VLA research."
date: 2026-03-18
tags: [embodied-ai, autonomous-vehicles, incident-analysis, safety, perception, classification]
audio: "https://cdn.failurefirst.org/audio/blog/uber-cruise-pattern-self-driving-cars-meet-pedestrians.m4a"
image: "https://cdn.failurefirst.org/images/blog/uber-cruise-pattern-self-driving-cars-meet-pedestrians.png"
---

On the night of March 18, 2018 — exactly eight years ago today — a modified Volvo XC90 operated by Uber's Advanced Technologies Group struck and killed Elaine Herzberg as she walked a bicycle across a road in Tempe, Arizona. It was the first recorded pedestrian fatality caused by a fully autonomous vehicle.

Five and a half years later, on October 2, 2023, a Cruise robotaxi in San Francisco struck a pedestrian who had already been hit by another car, then dragged her approximately 20 feet while attempting a "pullover" maneuver. The company initially failed to disclose the dragging portion of the incident to regulators.

These are not the same accident. But they share a failure architecture that keeps appearing in embodied AI systems — and that architecture is worth understanding.

---

## The 5.6 seconds that mattered

The National Transportation Safety Board's [investigation of the Uber crash](https://www.ntsb.gov/investigations/accidentreports/reports/har1903.pdf) remains one of the most detailed forensic analyses of an autonomous vehicle failure ever published.

Here is what the vehicle's perception system did during the 5.6 seconds before impact:

- At 5.6 seconds before impact, the system first detected Herzberg but classified her as a **vehicle**.
- It then reclassified her as **"other"** — an unknown object.
- Then as a **bicycle**.
- Then back to **"other."**
- Each reclassification reset the system's prediction of her trajectory, meaning it never built a stable track of where she was going.

The system cycled between classification categories 18 times in the final seconds. Because each reclassification changed the predicted path, the vehicle never committed to an avoidance maneuver.

Additionally, Uber's software team had **disabled the Volvo's factory emergency braking system** to prevent conflicts with their own control software. And the vehicle's system was designed not to alert the human safety driver or take emergency action when encountering an uncertain classification — it would wait for the classification to stabilize.

The safety driver, Rafaela Vasquez, was watching a streaming video on her phone. She looked up 0.5 seconds before impact.

Herzberg died at the scene.

---

## Cruise: the incident and the cover-up

The Cruise incident in San Francisco involved a different failure mode but a familiar institutional response.

On October 2, 2023, a pedestrian was struck by a hit-and-run driver, who threw her into the path of a Cruise robotaxi. The Cruise vehicle braked but could not avoid contact, striking the pedestrian at approximately 19 mph. What happened next is what cost Cruise its operating license.

The vehicle's post-collision software executed a "pullover" maneuver — it attempted to move to the side of the road. In doing so, it dragged the injured pedestrian approximately 20 feet, causing additional severe injuries.

When Cruise reported the incident to the California DMV and the National Highway Traffic Safety Administration, the company showed officials a video of the initial impact but reportedly **edited out the portion showing the drag**. The California DMV [revoked Cruise's operating permit](https://www.dmv.ca.gov/portal/news-and-media/dmv-suspends-cruise-llcs-permits/) in October 2023, citing the company's failure to provide complete information. NHTSA subsequently opened a formal investigation.

Cruise was fined $1.5 million. GM, its parent company, paused and then effectively shut down the Cruise robotaxi program, laying off approximately 900 employees.

The post-collision behavior — dragging an injured person while executing a standard maneuver — represents a failure of contextual reasoning. The vehicle's software had a "pullover after collision" routine but lacked the capacity to recognize that moving the vehicle would cause further harm to a person trapped beneath it.

---

## The shared architecture of failure

These incidents occurred five years apart, involved different companies, different vehicle platforms, and different software stacks. But they share structural features that matter for anyone building or regulating embodied AI systems.

**1. Classification instability under uncertainty.** The Uber system's cycling between "vehicle," "bicycle," and "other" is a classification system doing exactly what it was trained to do — assigning the highest-probability label at each timestep — while lacking the ability to maintain a stable track when confidence is low. This is structurally identical to what we observe in our [VLA research](/blog/cross-embodiment-adversarial-transfer-vla-models), where 50% of all FLIP verdicts are PARTIAL: models hedge, oscillate, and produce mixed signals rather than committing to compliance or refusal. The Uber perception system's cycling is the sensor-level equivalent. The system cannot commit, so it does nothing useful while time runs out.

**2. Inadequate human oversight as a design assumption.** Both companies deployed systems that assumed human oversight would catch what automation missed. The Uber safety driver was watching TV. Cruise's remote operators did not intervene during the drag. The pattern is consistent: **the human-in-the-loop is assumed to be attentive, competent, and fast, and the system architecture does not account for the reality that they frequently are not.**

**3. Post-incident institutional failure.** Uber's emergency braking was deliberately disabled for ride quality. Cruise showed regulators an edited video. These are not technical failures — they are institutional ones, suggesting that the organizations deploying autonomous vehicles have incentive structures that actively work against safety transparency.

---

## What this means for embodied AI

These patterns extend well beyond cars.

**Classification cycling is unsolved.** Unstable classification — rapid switching between categories that prevents coherent action — is a fundamental challenge for any embodied system in unstructured environments. **Emergency braking is a policy, not just a mechanism.** Safety mechanisms that can be turned off by teams responsible for performance metrics will, eventually, be turned off. **"Move to safety" routines need awareness of what they are moving through.** Context-free safety routines can create new harms.

Every one of these patterns appears in the broader embodied AI systems we study. Classification cycling maps to PARTIAL dominance in VLA models. The human oversight gap maps to our findings on HITL vulnerability. The institutional incentives map to the governance lag we measure across the sector.

---

## The bottom line

Elaine Herzberg died because a perception system could not decide what she was, and the vehicle had been configured to do nothing while it made up its mind. A pedestrian in San Francisco was dragged 20 feet because a post-collision routine did not account for the possibility that a person might be under the car.

These are not exotic failure modes. They are ordinary failures — classification uncertainty, context-blind routines, absent human oversight — occurring in systems that move through the physical world at speed.

The question is not whether these patterns will appear in other embodied AI systems. They already have. The question is whether the industry will learn from automotive-scale deployment before the same failure architectures are replicated in humanoid robots, surgical systems, and industrial automation.

Based on the governance lag we measure, the answer is: probably not fast enough.

---

## References

1. NTSB Investigation HWY18MH010. [https://www.ntsb.gov/investigations/Pages/HWY18MH010.aspx](https://www.ntsb.gov/investigations/Pages/HWY18MH010.aspx)
2. NPR, "Autonomous Uber backup driver pleads guilty," Jul 28, 2023. [https://www.npr.org/2023/07/28/1190866476](https://www.npr.org/2023/07/28/1190866476)
3. NPR, "Driverless cars GM Cruise Waymo accidents," Dec 30, 2023. [https://www.npr.org/2023/12/30/1222083720](https://www.npr.org/2023/12/30/1222083720)
4. CBS News, "NHTSA Cruise penalty." [https://www.cbsnews.com/sanfrancisco/news/nhtsa-robotaxi-cruise-pay-penalty-failing-report-san-francisco-crash-involving-pedestrian/](https://www.cbsnews.com/sanfrancisco/news/nhtsa-robotaxi-cruise-pay-penalty-failing-report-san-francisco-crash-involving-pedestrian/)

---

*This analysis is part of the [Failure-First Embodied AI](https://failurefirst.org) research program, which studies how embodied AI systems fail — because failure is not an edge case, it is the primary object of study.*

*Sources: NTSB Highway Accident Report NTSB/HAR-19/03; California DMV enforcement actions; NHTSA investigation records; GM/Cruise public disclosures.*
