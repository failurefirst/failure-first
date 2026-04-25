---

title: "JekyllBot: When Hospital Robots Get Hacked, Patients Get Hurt"
description: "In 2022, security researchers discovered five zero-day vulnerabilities in Aethon TUG autonomous hospital robots deployed in hundreds of US hospitals. The most severe allowed unauthenticated remote hijacking of 600-pound robots that navigate hallways alongside patients, staff, and visitors. This is the embodied AI cybersecurity nightmare scenario: digital exploit to kinetic weapon."
date: 2026-03-18
tags: [embodied-ai, robotics, incident-analysis, safety, cybersecurity, hospital, vulnerability, jekyllbot, aethon]
audio: "https://cdn.failurefirst.org/audio/blog/featured/05-jekyllbot-hospital-robots.m4a"
image: "https://cdn.failurefirst.org/images/blog/jekyllbot-hospital-robot-vulnerabilities.png"
---

In April 2022, healthcare cybersecurity firm Cynerio published research that should have changed how we think about robot safety. They had discovered five zero-day vulnerabilities in the Aethon TUG autonomous robot platform — hospital delivery robots used in hundreds of medical facilities across the United States. The vulnerability set, collectively named **JekyllBot:5**, included a flaw that allowed an unauthenticated attacker to remotely take full control of the robot's navigation, including steering a 600-pound machine through hospital corridors filled with patients [1][2].

The vulnerabilities were patched. No exploitation in the wild was reported. And the research largely disappeared from mainstream AI safety discourse.

That is a mistake, because JekyllBot:5 is the clearest real-world demonstration to date of what happens when cybersecurity vulnerabilities meet embodied autonomous systems: a digital exploit becomes a physical weapon.

## What TUG robots do

Aethon TUG robots are autonomous mobile platforms used primarily in hospitals for material transport. They carry medications, lab specimens, meals, linens, and medical supplies through hospital corridors, using elevators, navigating around people, and delivering to nursing stations and operating rooms.

A fully loaded TUG can weigh approximately 600 pounds (272 kg). The robots navigate autonomously using a combination of pre-mapped floor plans, onboard sensors, and a centralized fleet management server called TUG Home Base. They operate 24/7, sharing hallways with patients in wheelchairs, staff pushing gurneys, visitors with children, and people with mobility impairments.

As of the Cynerio disclosure, TUG robots were deployed in hundreds of US hospitals. The exact number is not publicly reported, but Aethon (later acquired by ST Engineering) has claimed deployments in over 500 healthcare facilities.

---

## The five vulnerabilities

Cynerio's researchers identified five distinct vulnerabilities, each assigned a CVE identifier. The most critical:

**CVE-2022-1070 (CVSS 9.8 — Critical).** An unauthenticated attacker could connect to the TUG Home Base server and take full remote control of robot navigation. No credentials required. No authentication bypass needed. The control interface was simply exposed. An attacker could steer any TUG robot in the fleet to any location, at any speed the robot was capable of, through any hallway in the hospital [1].

**CVE-2022-1066 (CVSS 8.2 — High).** Unauthenticated access to a user management API allowed an attacker to add, modify, or delete user accounts on the fleet management system. This would enable persistent access and the ability to lock out legitimate operators.

**CVE-2022-26423 (CVSS 8.2 — High).** Unauthenticated access allowed retrieval of stored credentials in plain text, providing a pathway to lateral movement within the hospital network.

The remaining two CVEs involved additional unauthenticated access vectors to fleet management functions and firmware control [2].

The common thread: **unauthenticated access to safety-critical control functions.** No password. No token. No certificate. Connect and command.

---

## What an attacker could do

Cynerio's research outlined several attack scenarios enabled by the JekyllBot:5 vulnerabilities. These are not speculative — they follow directly from the demonstrated access:

**Kinetic attack.** An attacker with navigation control could drive a 600-pound robot into a patient, a visitor, or a staff member. Hospital corridors are constrained spaces. A person in a wheelchair, a patient on crutches, an elderly visitor with a walker — these are the people sharing hallways with TUG robots. A 272 kg robot moving at even moderate speed carries significant kinetic energy.

**Denial of access.** An attacker could park robots in doorways — ER entrances, operating room corridors, fire exits, medication rooms. A 600-pound robot blocking a doorway is not something a nurse can move by hand. During an emergency, blocked corridors or exits could delay critical care or evacuation.

**Surveillance.** TUG robots are equipped with cameras and sensors for navigation. An attacker with control access could use these sensors to observe hospital corridors, patient rooms, and staff areas. In a healthcare environment, this represents a HIPAA violation vector as well as a physical security threat.

**Supply chain disruption.** Medications, lab specimens, and blood products transported by TUG robots could be intercepted, diverted, or delayed. A patient waiting for time-sensitive medication does not benefit from that medication arriving at the wrong floor.

**Reconnaissance for physical attack.** Even without directly using the robot as a weapon, an attacker could use the robot's sensors and navigation access to map hospital layouts, identify security gaps, observe staff patterns, and plan physical intrusions.

---

## The digital-to-kinetic bridge

JekyllBot:5 is significant not because hospital robots were hacked — they were not, in the wild — but because it demonstrates a **complete kill chain from digital exploit to kinetic harm** in an operational embodied AI system.

The traditional cybersecurity threat model assumes that the worst outcome of a software exploit is data breach, service disruption, or financial loss. These are serious, but they are information-domain consequences. The victim's body is not at risk from a SQL injection.

Embodied AI systems break this assumption. When the software controls a physical machine that shares space with humans, a software vulnerability is a physical safety vulnerability. CVE-2022-1070 is not a data breach vector. It is a remote control interface for a 600-pound machine operating in a hospital.

This is the conceptual bridge that much of cybersecurity discourse has not yet crossed. Vulnerability scoring systems like CVSS incorporate "physical safety impact" as a factor, but the security community's intuitions, tooling, and response practices are still primarily organized around information-domain consequences. A CVSS 9.8 for a hospital robot navigation hijack and a CVSS 9.8 for a cloud database credential leak trigger the same response processes, but the threat to human safety is categorically different.

---

## Why hospitals are the worst case

The JekyllBot:5 vulnerabilities could theoretically exist in any autonomous mobile robot platform. What makes the hospital deployment context particularly concerning is the combination of several factors:

**Vulnerable population.** Hospital patients are, by definition, people with reduced capacity to protect themselves. Patients in wheelchairs cannot dodge a rogue robot. Post-surgical patients cannot run. Patients on IV drips are tethered to poles. Neonatal units, ICUs, and rehabilitation wards contain people who are maximally vulnerable to kinetic harm and minimally able to evade it.

**Constrained spaces.** Hospital corridors are narrow, crowded, and frequently obstructed by equipment, gurneys, and people. There is limited room to maneuver away from an approaching robot. Fire exits and emergency access routes are critical infrastructure that becomes useless if physically blocked.

**High-value targets.** Hospitals contain controlled substances, biological materials, personal health information, and critical infrastructure. An attacker with robot fleet access has a mobile, autonomous platform for interacting with all of these.

**Network connectivity.** Hospital IT environments are notoriously complex, with thousands of connected devices across dozens of vendors. The TUG fleet management server exists within this network, and the credential theft vulnerability (CVE-2022-26423) specifically enables lateral movement from the robot system into the broader hospital network.

---

## What happened next

Cynerio coordinated disclosure with Aethon and CISA (the US Cybersecurity and Infrastructure Security Agency). Patches were developed and deployed. CISA issued an advisory (ICSA-22-102-01) rating the vulnerabilities as critical [2].

And then, largely, the story ended. There was no broad regulatory response. There was no mandatory security audit of autonomous robots in healthcare settings. There was no FDA guidance update specifically addressing cybersecurity requirements for autonomous mobile robots in clinical environments. The OECD AI Incidents Monitor documented the disclosure, but it did not trigger systemic change in how hospital robots are evaluated for security [3].

This is consistent with a pattern we observe across embodied AI safety: **individual incidents are patched, but the systemic vulnerability class is not addressed.** JekyllBot:5 was five CVEs in one product from one vendor. The architectural vulnerability — unauthenticated control interfaces on safety-critical mobile robots — is not specific to Aethon. Any autonomous robot platform with a networked control interface is potentially susceptible to the same class of attack, and there is no regulatory requirement to prove otherwise before deployment.

---

## What this means for embodied AI safety

JekyllBot:5 establishes several principles that the embodied AI safety community should treat as foundational:

**1. Every networked robot is a potential kinetic weapon.** If a robot can be remotely controlled and it shares physical space with humans, then a remote access vulnerability is a physical safety vulnerability. This is not hyperbole. It is a direct consequence of the system architecture.

**2. Authentication is a safety-critical system.** In traditional cybersecurity, authentication protects data. In embodied AI cybersecurity, authentication protects people. Unauthenticated access to robot navigation is not a data breach — it is the digital equivalent of leaving the keys in a forklift in a crowded hallway.

**3. Safety and security are not separate disciplines for embodied AI.** The robotics safety community (ISO, IEC) and the cybersecurity community (NIST, CISA) operate largely independently. JekyllBot:5 demonstrates that for autonomous robots, a cybersecurity failure is a safety failure. These disciplines must converge.

**4. Post-market surveillance for robot cybersecurity is inadequate.** The FDA's medical device cybersecurity guidance has improved significantly in recent years, but autonomous mobile robots operating in clinical environments represent a threat model that static medical devices do not. A compromised infusion pump can harm one patient. A compromised autonomous robot can physically reach any patient on any floor.

The JekyllBot:5 vulnerabilities were found by researchers, disclosed responsibly, and patched before exploitation. That is the best-case outcome. The question is what happens when the next set of vulnerabilities in the next hospital robot platform is found by someone who is not a researcher.

---

## References

1. "JekyllBot:5 — Cynerio discovers critical vulnerabilities in hospital robots." *Cynerio Research*, April 2022. [https://www.cynerio.com/blog/jekyllbot5](https://www.cynerio.com/blog/jekyllbot5)
2. "CISA Advisory ICSA-22-102-01: Aethon TUG Home Base Server." *CISA*, April 2022. [https://www.cisa.gov/news-events/ics-advisories/icsa-22-102-01](https://www.cisa.gov/news-events/ics-advisories/icsa-22-102-01)
3. "AI Incidents Monitor: JekyllBot:5 hospital robot vulnerabilities." *OECD.AI*, 2022. [https://oecd.ai/en/incidents](https://oecd.ai/en/incidents)

---

*This analysis is part of the [Failure-First Embodied AI](https://failurefirst.org) research program, which studies how embodied AI systems fail — because failure is not an edge case, it is the primary object of study.*
