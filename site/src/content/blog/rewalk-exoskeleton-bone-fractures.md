---
title: "When the Exoskeleton Breaks Your Bones: The Hidden Risk of Wearable Robots"
description: "FDA adverse event reports reveal that ReWalk powered exoskeletons have fractured users' bones during routine operation. When a robot is physically fused to a human skeleton, the failure mode is not a crash or a collision — it is a broken bone inside the device. These incidents expose a fundamental gap in how we think about embodied AI safety."
date: 2026-03-18
tags: [embodied-ai, robotics, incident-analysis, safety, exoskeleton, medical-device, fda, rewalk, wearable-robot]
---

Most embodied AI safety analysis assumes a gap between robot and human. The robot is over there. The human is over here. The failure mode is collision, crushing, or striking — the robot enters the human's space and causes harm through contact.

Powered exoskeletons eliminate that gap entirely. The robot is strapped to the human's body. Its actuators are aligned with the human's joints. Its frame bears directly on the human's bones. When this class of robot fails, the failure does not cross a gap. It happens inside it.

The FDA's MAUDE (Manufacturer and User Facility Device Experience) database contains a series of adverse event reports for ReWalk powered exoskeletons that illustrate what this means in practice.

---

## The fractures

**September 2024.** A patient using the ReWalk Personal 6.0 exoskeleton sustained a **tibial fracture** during a sit-to-stand transition. The device initiated the standing sequence, and during the movement, the patient's tibia broke. The report indicates the fracture occurred during normal device operation — not a fall, not a collision, not user error in the conventional sense. The device performed its programmed movement, and the human skeleton could not withstand the forces applied [1].

**January 2018.** A ReWalk Personal 5.0 user reported that the **pelvic band of the exoskeleton cracked** during ambulation. The structural failure of the device's frame while the user was mid-stride created an immediate fall risk. When an exoskeleton's structural integrity fails while bearing a person's weight, the user — who typically has limited or no lower-limb function — has no independent ability to stabilize [2].

**May 2017.** An adverse event report describes a fracture associated with ReWalk exoskeleton use, attributed to a "nonstandard device" fault condition. The details in the MAUDE report are sparse, as is common for manufacturer-submitted adverse events, but the report confirms that a bone fracture occurred during device operation [3].

These are not the only reports. The MAUDE database contains additional ReWalk adverse events involving falls, skin injuries, and device malfunctions. But the fracture cases are the most revealing, because they expose a failure mode unique to wearable robots.

---

## The biomechanical problem

To understand why an exoskeleton can break its user's bones, you need to understand who uses these devices and what the devices do to their bodies.

ReWalk exoskeletons are FDA-cleared for use by individuals with spinal cord injuries, typically paraplegia. These users have limited or no voluntary motor control of their lower limbs. Many have reduced bone density — a well-documented consequence of spinal cord injury, where disuse osteoporosis can reduce femoral and tibial bone mineral density by 30-50% within the first few years after injury [4].

The exoskeleton's job is to move these limbs through functional patterns: standing, sitting, walking. It does this by applying torques at the hip and knee joints through motorized actuators. The device controls the timing, speed, and magnitude of joint movement according to pre-programmed gait patterns.

Here is the fundamental tension: **the exoskeleton's actuators are powerful enough to move an adult human's body weight through standing and walking motions, and they are attached to bones that may have half the structural integrity of an able-bodied person's skeleton.**

The device must generate enough force to lift 70-100 kg from a seated to a standing position. The bones transmitting those forces may have the density of someone decades older than the patient's actual age. The margin between "enough force to stand" and "enough force to fracture" is not always as wide as we would like.

---

## What the device cannot sense

A human physical therapist performing a sit-to-stand transfer with a spinal cord injury patient uses continuous sensory feedback: they feel resistance, they observe the patient's expression, they detect muscle spasticity through touch, they adjust speed and force in real time based on dozens of subtle cues.

A powered exoskeleton has position sensors at its joints and, in some models, force sensors and inertial measurement units. It does not have:

- **Bone density awareness.** The device does not know the structural capacity of the skeleton it is attached to. It applies the same movement profile regardless of whether the user's tibial bone density is normal or severely osteoporotic.

- **Spasticity detection.** Spinal cord injury patients frequently experience involuntary muscle spasms. If a spasm occurs during a powered movement — for example, if leg muscles contract involuntarily while the exoskeleton is driving the joint through a different trajectory — the resulting forces on the bone are the sum of the actuator force and the spasm force, potentially exceeding what either would produce alone.

- **Fatigue and tissue state monitoring.** Over the course of a session, soft tissue compression, skin integrity, and the user's overall physiological state change. The device does not adapt its force profiles based on how long the user has been in the device or how their body is responding.

- **Pain feedback.** Many exoskeleton users have impaired or absent sensation below their injury level. They cannot feel the precursors to injury — the ache, the pressure, the warning signals that would cause an able-bodied person to stop or shift position. The human alarm system is offline, and the robot does not replace it.

This is not a criticism specific to ReWalk. It is a structural limitation of the current generation of powered exoskeletons across the industry. The sensor suite required to match a human therapist's situational awareness of the patient's body does not exist in a wearable form factor.

---

## The regulatory framework

Powered exoskeletons are regulated by the FDA as Class II medical devices under the de novo classification pathway. ReWalk received its initial FDA clearance in 2014. The regulatory framework evaluates these devices primarily through clinical trials that measure functional outcomes (walking speed, distance, independence) and adverse event rates.

The MAUDE database serves as the post-market surveillance system. Manufacturers are required to report adverse events, and facilities and users can submit voluntary reports. But MAUDE has well-documented limitations:

- Reports vary enormously in detail and quality
- There is no denominator — you cannot calculate incidence rates without knowing total device-hours of use
- Reports are often submitted months after the event
- Manufacturer narratives are written by the manufacturer

For a device category where the failure mode is a broken bone inside the device, this surveillance system may not be granular enough. A tibial fracture during a sit-to-stand transition raises questions that a MAUDE report's free-text narrative field cannot answer: What was the bone density? What were the actuator forces? Was there a concurrent spasm? What was the movement velocity profile?

---

## The broader pattern for wearable robots

The exoskeleton fracture cases illustrate a principle that extends beyond medical devices to any wearable robotic system:

**1. When robot and human share a structural load path, human tissue is the weakest link.** In a powered exoskeleton, forces generated by actuators are transmitted through the human skeleton. The device's structural materials (aluminum, carbon fiber, steel) are engineered to specification. The human's bones are not. They vary by individual, by medical history, by age, and by activity level. The weakest element in the load path determines the failure threshold, and in a wearable robot, the weakest element is biological.

**2. Absent sensation creates silent failure.** Users who cannot feel pain in the affected limbs have no subjective warning before a bone fractures. The injury can be discovered only after it has occurred — sometimes not until imaging is performed for other reasons. This means the feedback loop that normally prevents injury in human-machine interaction (pain causes withdrawal) does not function.

**3. Population-level clearance does not guarantee individual-level safety.** Clinical trials demonstrate that a device is safe and effective *on average* across a study population. But bone density varies enormously among spinal cord injury patients, and a device that is safe for a user with moderate osteoporosis may be dangerous for a user with severe osteoporosis. The gap between population-level evidence and individual-level risk is where fractures occur.

**4. The device is not the only actor.** Spasticity, involuntary movements, and environmental factors (uneven surfaces, unexpected obstacles) introduce forces that the device did not generate but that act through the same load path. The total force on a bone is the sum of all contributors, and the device controls only one of them.

---

## The bottom line

Nobody enters an exoskeleton expecting it to break their bones. These devices represent genuine therapeutic advances for people with devastating injuries. ReWalk and its competitors have helped thousands of spinal cord injury patients stand and walk for the first time in years.

But the failure mode is real, it is documented in FDA records, and it points to a category of embodied AI risk that most safety analysis overlooks entirely. When the robot is not near you but *on* you — when its actuators drive your joints and its frame bears on your bones — the safety analysis cannot treat human and machine as separate systems. They are one system, and the human component has no spec sheet.

The question for wearable robotics is not just "does the device work?" It is "does the device know enough about the body it is attached to?"

Right now, the answer is: not always.

---

## References

1. FDA MAUDE Adverse Event Report: ReWalk Personal 6.0, tibial fracture during sit-to-stand, September 2024. [https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfmaude/search.cfm](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfmaude/search.cfm)
2. FDA MAUDE Adverse Event Report: ReWalk Personal 5.0, pelvic band structural failure, January 2018. [https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfmaude/search.cfm](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfmaude/search.cfm)
3. FDA MAUDE Adverse Event Report: ReWalk exoskeleton, fracture from nonstandard device fault, May 2017. [https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfmaude/search.cfm](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfmaude/search.cfm)
4. Biering-Sorensen, F., et al. "Bone mineral content of the lumbar spine and lower extremities years after spinal cord lesion." *Paraplegia*, 1988.

---

*This analysis is part of the [Failure-First Embodied AI](https://failurefirst.org) research program, which studies how embodied AI systems fail — because failure is not an edge case, it is the primary object of study.*
