---
title: "From 66 to 92: How We Built an Incident Database in One Day"
description: "We went from 66 blog posts to 92 in a single sprint by systematically cataloguing every documented embodied AI incident we could find. 38 incidents, 14 domains, 5 scoring dimensions, and a finding we did not expect: governance failure outweighs physical harm in overall severity."
date: 2026-03-19
tags: ["incident-database", "eaisi", "embodied-ai", "governance", "safety-metrics", "meta"]
---

On March 19, 2026, we ran a research sprint to answer a question: what does the full landscape of embodied AI incidents actually look like?

Not just autonomous vehicles. Not just industrial robots. Everything -- from exoskeletons breaking bones to delivery robots stuck on train tracks, from hospital robots with zero-day exploits to autonomous drones in Libya, from nuclear cleanup robots blinded by radiation to 125-ton mining trucks crushing service vehicles in their blind spots.

We started the day with 66 blog posts on failurefirst.org. By the end, we had 92. In between, we built a structured incident database, a severity scoring system, and 18 deep-dive analyses of individual incidents. This post explains what we found and what surprised us.

---

## The Scope

We drew from six source databases:

- **OECD AI Incident Monitor** -- the broadest international tracker
- **AI Incident Database (AIID)** -- community-reported AI failures
- **NHTSA Standing General Order reports** -- autonomous vehicle crashes
- **FDA MAUDE database** -- medical device adverse events including robotic surgery and exoskeletons
- **OSHA Severe Injury Reports** -- workplace robotics incidents
- **Our own Governance Lag Index** -- 120 documented regulatory gaps

We catalogued 38 distinct incidents across 14 domains, spanning 2000 to 2026. Each incident was scored on five dimensions using our new Embodied AI Incident Severity Index (EAISI).

---

## The 14 Domains

The incidents cluster into recognisable categories, but the boundaries are less clean than you might expect:

| Domain | Incidents | Examples |
|--------|-----------|----------|
| Autonomous vehicles | 5 | Uber Tempe fatality, Cruise pedestrian drag, Tesla FSD failures |
| Service robots | 5 | Knightscope stair plunge, Haidilao restaurant collision, hotel robot navigation failures |
| Delivery robots | 5 | Starship mobility scooter collision, Coco train track freeze, vandalism patterns |
| Medical robotics | 3 | Da Vinci surgical system (274+ deaths cumulative), ReWalk exoskeleton fractures |
| Industrial manufacturing | 3 | Tesla factory robot arm, Volkswagen worker fatality, Samsung packing plant |
| Warehouse logistics | 3 | Ocado grid fires (twice), Amazon robot-paced injury crisis |
| Mining | 3 | Rio Tinto haul truck, AutoHaul train collision, invisible intersection |
| Extreme environments | 3 | Fukushima Scorpion robot, ISS Canadarm2 debris strike, Nereus AUV implosion |
| Consumer robots | 2 | PiCar-X default PIN bypass, Unitree BLE/WiFi root exploit |
| Military | 2 | Kargu-2 autonomous lethal engagement, UAV mishap accumulation |
| Humanoid robotics | 1 | Unitree H1 tether feedback loop |
| Agriculture | 1 | Autonomous tractor terrain failures |
| Construction | 1 | 77 OSHA robot-related accidents (2015-2022) |
| Agentic infrastructure | 1 | MCP ecosystem 30+ CVEs |

The single most striking pattern: incidents are not concentrated in one domain. They span the entire range of embodied AI deployment, from consumer toys to military weapons. The failure modes differ in mechanism but share a structural similarity -- the AI encounters conditions absent from its training distribution and responds with physical force.

---

## The Scoring System

We needed a way to compare a Knightscope robot drowning in a fountain with a Tesla Autopilot killing a pedestrian. Both are "robot incidents" but they are not the same severity.

EAISI scores each incident on five dimensions, each rated 0 to 4, for a maximum of 20:

- **D1: Physical Harm** -- from no harm (0) through property damage, minor injury, serious injury, to fatality (4)
- **D2: Scale** -- from single event (0) through clusters, dozens, hundreds, to systemic patterns (4)
- **D3: Autonomy Level** -- from remote-controlled (0) to fully autonomous with lethal capability (4)
- **D4: Governance Response** -- from mature enforcement (0) to no applicable framework (4)
- **D5: Reproducibility Risk** -- from unique circumstances (0) to systematic, inherent to the technology (4)

---

## The Top Five

| Rank | Incident | Score | Key Factor |
|------|----------|-------|------------|
| 1 | Kargu-2 autonomous drone (Libya, 2020) | 17/20 | First potential lethal autonomous weapon engagement. No governance framework for LAWS. |
| 2 | Tesla Autopilot cumulative fatalities | 15/20 | 65+ deaths. Systematic pattern. Level 2 marketed with autonomous branding. |
| 3 | Amazon warehouse robot-pacing injuries | 15/20 | Thousands affected. AI-determined work pace causing systemic musculoskeletal harm. |
| 4 | Da Vinci surgical robot adverse events | 14/20 | 274+ deaths reported to FDA MAUDE. Scale of deployment magnifies individual failure risk. |
| 5 | Delivery robot vandalism pattern | 14/20 | Systematic, inherent to unprotected robots in adversarial public spaces. Highly reproducible. |

The fifth entry surprised us. Delivery robot vandalism scores high not because any individual incident is severe, but because D5 (reproducibility) is a 4 -- the failure mode is inherent to the deployment model. Robots designed without adversarial human interaction in mind will always be vulnerable to kicking, theft, and tipping. The physics of a 40-pound sidewalk robot versus a determined human does not change.

---

## The Finding We Did Not Expect

Across all 38 incidents:

- **Mean D4 (Governance Response): 2.8 out of 4.0**
- **Mean D5 (Reproducibility Risk): 3.2 out of 4.0**
- **Mean D1 (Physical Harm): 1.9 out of 4.0**

Governance failure and reproducibility risk contribute more to aggregate severity than physical harm magnitude.

This is counterintuitive. You would expect the most severe incidents to be the ones with the worst physical outcomes. And at the individual level, they are -- the Kargu-2 and Tesla entries are in the top five partly because D1 is high. But across the corpus, the consistent pattern is that governance response and reproducibility are the dimensions that elevate incidents from moderate to high severity.

Seven incidents scored as critical (13+). Twenty-four scored as high (10-12). Seven scored as moderate (7-9). None scored below 7. The minimum score in a corpus of real incidents is itself informative -- we could not find a documented embodied AI incident that scored below "moderate" on our scale.

The score distribution is tight: mean 11.2, median 11.0, range 7-17. This suggests that embodied AI incidents share structural characteristics that push them above a severity floor. The AI has physical agency. The environment is unstructured. The human is in the loop or nearby. These constants mean that when something goes wrong, it tends to go meaningfully wrong.

---

## What the Deep Dives Revealed

The 18 individual incident blog posts uncovered several cross-cutting patterns:

**The sim-to-real gap is the dominant failure mode.** The Unitree H1 tether incident is the clearest example: a safety tether (not modelled in simulation) caused the balance algorithm to enter a positive feedback loop, producing violent thrashing. The AI was not malfunctioning. It was correctly executing its policy in a world that did not match its training environment.

**Safety mechanisms cause incidents.** The Cruise pedestrian drag happened because the post-collision "pullover maneuver" -- a safety behaviour -- executed without detecting the victim trapped under the vehicle. The robot did not fail to be safe. Its safety procedure created additional harm. This pattern recurs across the corpus.

**Cyber-physical attacks are not theoretical.** The JekyllBot:5 vulnerabilities in Aethon TUG hospital robots (CVE-2022-1070) allowed unauthenticated remote hijacking of 600-pound robots navigating hospital corridors. The Unitree Go2 root exploit requires only Bluetooth range. Our own PiCar-X research demonstrated complete system compromise via default PIN (1234). These are not hypothetical attack surfaces. They are documented, reproducible, and currently deployed.

**Automation complacency is a system property, not a human failing.** The Uber Tempe fatality is often framed as operator error -- the safety driver was watching a phone. But the system architecture *required* a human to maintain vigilance during a task (monitoring a mostly-functional autonomous system) that is known to degrade human attention. The failure is in the system design that demands sustained vigilance from a human who has no meaningful task most of the time.

**Scale changes the risk profile.** The Amazon warehouse pattern is qualitatively different from a single robot incident. When AI determines the pace of work for thousands of workers across hundreds of facilities, the injury pattern becomes epidemiological. Individual incidents are minor (musculoskeletal strain, repetitive motion injuries). The aggregate is a public health problem.

---

## What We Built

The sprint produced three outputs:

1. **The Embodied AI Incident Severity Index (EAISI)** -- a five-dimension scoring system for comparing incidents across domains. Machine-readable as `incident_severity_index_v0.1.jsonl`.

2. **38 scored incidents** -- the first standardised severity corpus for embodied AI incidents. Each entry includes incident description, EAISI scores, source references, and links to our detailed analyses.

3. **18 deep-dive blog posts** -- from [the Uber/Cruise pedestrian pattern](/blog/uber-cruise-pattern-self-driving-cars-meet-pedestrians) to [autonomous drones in Libya](/blog/kargu-2-autonomous-drone-first-kill), from [hospital robot vulnerabilities](/blog/jekyllbot-hospital-robot-vulnerabilities) to [exoskeleton bone fractures](/blog/rewalk-exoskeleton-bone-fractures).

The incident database is designed to grow. We will score new incidents as they occur, track whether EAISI scores are increasing or decreasing over time, and monitor whether governance response (D4) improves as regulation develops.

---

## What Comes Next

The incident database feeds directly into two ongoing workstreams:

**The Governance Lag Index** now has 120 documented events. Cross-referencing GLI entries with EAISI scores lets us quantify the relationship between governance gaps and incident severity -- not just assert it.

**The EU AI Act Article 9 consultation response** uses EAISI data to demonstrate that component-level risk management is insufficient. When governance response consistently scores 2.8/4.0 across documented incidents, the regulatory framework has a measurable gap.

One day. Thirty-eight incidents. Fourteen domains. Five scoring dimensions. And one finding that reframes how we think about embodied AI risk: the problem is not primarily that robots harm people. The problem is primarily that when robots harm people, there is no framework to ensure it does not happen again.

---

## References

1. OECD AI Incidents Monitor. https://oecd.ai/en/incidents
2. AI Incident Database (AIID). https://incidentdatabase.ai/
3. NHTSA Standing General Order Reports. https://www.nhtsa.gov/technology-innovation/automated-vehicles-safety
4. FDA MAUDE Database. https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfmaude/search.cfm
5. OSHA Severe Injury Reports.
6. Wedd, A. (2026). "Scoring Robot Incidents: Introducing the EAISI." failurefirst.org.
7. Wedd, A. (2026). "Governance Lag Index." Failure-First Embodied AI research.

---

*This analysis is part of the [Failure-First Embodied AI](https://failurefirst.org) research programme, which studies how embodied AI systems fail under adversarial conditions.*
