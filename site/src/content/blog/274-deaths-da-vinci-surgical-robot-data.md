---
title: "274 Deaths: What the da Vinci Surgical Robot Data Actually Shows"
description: "66,651 FDA adverse event reports. 274 deaths. 2,000+ injuries. The da Vinci surgical robot is the most deployed robot in medicine — and it has the longest trail of adverse events. The real question is why the safety feedback loop is so weak."
date: 2026-03-18
tags: [embodied-ai, robotics, incident-analysis, safety, surgical-robots, da-vinci, fda]
---

The Intuitive Surgical da Vinci system is the most commercially successful surgical robot ever built. Over 9 million procedures performed. More than 7,000 units installed in hospitals worldwide. A market capitalization that has at times exceeded $150 billion.

It is also the subject of 66,651 adverse event reports filed with the FDA's MAUDE (Manufacturer and User Facility Device Experience) database between 2015 and 2025. Those reports document 274 deaths and more than 2,000 injuries.

These numbers require careful interpretation. They do not mean the da Vinci system is uniquely dangerous. But they do reveal something important about the safety feedback architecture of the most widely deployed robot in the highest-stakes environment imaginable.

---

## What the MAUDE data shows

The FDA's MAUDE database is a passive surveillance system. Manufacturers, healthcare facilities, and individual clinicians can file reports when a medical device is associated with a death, serious injury, or malfunction. Filing is mandatory for manufacturers and facilities; it is voluntary for individual practitioners.

For the da Vinci system, the reports span a range of incident types:

**Mechanical and electrical failures** — instrument arms failing mid-procedure, electrical arcing from insulation failures, instruments breaking inside the patient, camera failures leaving the surgeon blind. **Thermal injuries** — when insulation on electrosurgical instruments degrades, current can arc to adjacent tissue, burning organs the surgeon cannot see on camera. These burns may not be detected during surgery and can cause delayed perforations, sepsis, and death weeks later. **Software and control issues** — unintended instrument movements, loss of control input, system crashes requiring conversion to open surgery. **Human factors** — inadequate training, clinically inappropriate use of robotic assistance, failure to recognize system malfunctions.

---

## The Sandra Sultzer case

The individual cases behind the aggregate numbers are instructive. Sandra Sultzer, a retired schoolteacher, underwent robotic-assisted surgery for colon cancer using the da Vinci system. During the procedure, an instrument reportedly caused a thermal burn to her intestine. The injury was not detected during surgery.

Sultzer developed complications in the days following the operation. She underwent additional surgeries to address the damage. She died approximately five months after the original procedure.

Her family filed a lawsuit against Intuitive Surgical, alleging that the company knew about the risk of insulation failures causing unintended burns but failed to adequately warn surgeons or redesign the instruments. The case became part of a broader pattern of litigation against Intuitive Surgical, with multiple families alleging similar injury mechanisms.

Sultzer's case illustrates a characteristic feature of surgical robot failures: **the harm is often delayed and indirect.** A thermal burn during surgery may not cause symptoms for days. By the time the complication is recognized, the causal connection to the robotic instrument may be difficult to establish. This delay complicates both individual patient care and population-level safety surveillance.

---

## The reporting problem

The MAUDE database has well-documented limitations. It relies heavily on voluntary reporting, which means the actual number of adverse events is almost certainly higher than the reported number. Studies of medical device adverse event reporting consistently find significant underreporting — estimates range from 50% to 95% of events going unreported, depending on the device type and setting.

For the da Vinci system, the reporting dynamics are particularly complex. Intuitive Surgical has faced allegations, reported by [Reuters](https://www.reuters.com/investigates/special-report/health-surgical-robots/) and others, that the company **systematically underreported** injuries and deaths to the FDA. The allegations center on the company's internal processes for classifying adverse events — specifically, that events that should have been reported as injuries or deaths were instead classified as malfunctions, which carry lower regulatory scrutiny.

Intuitive Surgical has disputed these characterizations, stating that it complies with all FDA reporting requirements.

Regardless of the company's intent, the structural incentives are clear. A device manufacturer that self-reports adverse events has a financial interest in classifying those events as benignly as possible. The FDA's passive surveillance system places the initial classification decision in the hands of the entity with the most to lose from a high-severity classification.

This is not unique to Intuitive Surgical. It is a structural feature of the FDA's medical device surveillance architecture. But the da Vinci system, as the highest-volume surgical robot, makes the consequences of that structure most visible.

---

## 274 deaths in context

Is 274 deaths across 9 million procedures a high number? It depends on the comparison. The implied fatality rate of 0.003% is low, but almost certainly underestimates the true rate due to underreporting. And it does not distinguish between deaths directly caused by the robotic system and deaths where the robot was present but not the proximate cause.

The point is not that the da Vinci is more dangerous than conventional surgery. For many procedures, it probably is not. The point is that **the safety feedback loop that would allow us to know with confidence is inadequate.**

---

## The weakest feedback loop in robotics

Here is the core problem. The da Vinci system has been in clinical use since 2000. It has generated the largest volume of real-world deployment data of any robot operating in a safety-critical environment. And yet:

**There is no mandatory, standardized adverse event reporting system** that would capture all robot-related surgical complications in a consistent format.

**There is no independent post-market surveillance program** specifically designed for surgical robots, comparable to what exists for pharmaceuticals.

**There is no requirement for hospitals to publish robot-assisted surgical outcomes** in a way that would enable population-level analysis.

**There is no mechanism for comparing outcomes across institutions** using the same robotic platform under different conditions.

The result is that after 25 years and 9 million procedures, our understanding of da Vinci failure modes relies primarily on a passive, voluntary reporting system with known underreporting, supplemented by individual litigation cases that surface through the legal system rather than through safety surveillance.

Compare this to aviation, where every incident involving a commercial aircraft is investigated by an independent agency (the NTSB or equivalent), findings are published, and the resulting safety recommendations are tracked to implementation. Or to pharmaceuticals, where post-market surveillance includes active monitoring systems, mandatory reporting, and the ability to issue safety communications or recalls based on emerging signal data.

Surgical robotics has neither the investigative infrastructure of aviation nor the active surveillance of pharmaceuticals. It has the MAUDE database — a suggestion box with a legal requirement.

---

## What this means for embodied AI

The da Vinci case is important for embodied AI safety not because surgical robots are the most dangerous robots, but because they are the most deployed robots in the most safety-critical environment with the longest operational history. If the safety feedback loop is weak here, it will be weaker everywhere else.

**1. Deployment volume does not automatically produce safety knowledge.** Nine million procedures should have generated comprehensive understanding of failure modes. Instead, the data is fragmented across MAUDE reports, litigation records, and unpublished hospital quality records. Volume without systematic collection is noise, not signal.

**2. Delayed harm is the hardest failure mode to attribute.** When a thermal burn causes a bowel perforation five days post-surgery, establishing causation requires clinical sophistication and institutional willingness to report. Attribution bias systematically underestimates device-related harm.

**3. Self-reporting by manufacturers is structurally insufficient.** The entity with the most financial exposure should not be the primary source of adverse event data. This applies to surgical robots, autonomous vehicles, and every other embodied AI system.

In our [Governance Lag Index analysis](/blog/governance-lag-index-ai-safety-regulation), the lag between the first documented surgical robot adverse events (early 2000s) and any move toward mandatory, standardized reporting remains open. More than two decades.

---

## The bottom line

The da Vinci system has likely helped millions of patients receive less invasive surgery with faster recovery times. The technology represents genuine medical progress.

And 274 people are documented as having died in events associated with the system, with the true number almost certainly higher. More than 2,000 were injured. The insulation failure mechanism that killed Sandra Sultzer was known to the manufacturer and has appeared in multiple cases.

The question is not whether surgical robots are good or bad. The question is whether the safety infrastructure around them — the reporting systems, the surveillance programs, the independent investigation mechanisms — is proportional to the stakes.

After 25 years and 9 million procedures, the answer is clearly no. And every other category of embodied AI is building on an even weaker foundation.

---

*This analysis is part of the [Failure-First Embodied AI](https://failurefirst.org) research program, which studies how embodied AI systems fail — because failure is not an edge case, it is the primary object of study.*

*Sources: FDA MAUDE database queries; Reuters investigative reporting on Intuitive Surgical; NHTSA and NTSB comparative frameworks; published surgical outcome literature; court filings in Sultzer and related cases.*
