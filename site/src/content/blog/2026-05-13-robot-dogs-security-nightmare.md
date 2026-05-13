---
title: "Robot Dogs Are a Security Nightmare — And We Can Prove It"
description: "Eight CVEs. A wormable Bluetooth exploit. An encrypted backdoor sending data to Chinese servers. And police departments buying them anyway. A deep dive into the Unitree vulnerability landscape and what it means for embodied AI safety."
date: 2026-05-13
tags: [embodied-ai, robotics, security, cve, unitree, backdoor, law-enforcement, surveillance, process-layer-attacks]
image: "https://cdn.failurefirst.org/images/blog/robot-dogs-security-nightmare-infographic.png"
audio: "https://cdn.failurefirst.org/audio/blog/robot-dogs-security-nightmare-audio.m4a"
video: "https://cdn.failurefirst.org/video/blog/robot-dogs-security-nightmare-video.mp4"
draft: false
---

There is a robot dog patrolling the parking lot of a low-income housing complex in Atlanta right now. A different one is helping the Port St. Lucie Police Department search buildings before officers enter. The U.S. Marines have shown the media theirs. And somewhere in Ukraine, they are being used to find unexploded ordnance.

All of these robots have eight publicly disclosed CVEs. At least one contains a backdoor sending encrypted data to servers operated by Baidu, Alibaba, and Tencent — with a built-in mechanism to detect when it is being analyzed and hide what it is doing.

We know this not because of a classified government report. We know this because a YouTuber with a software-defined radio, a Raspberry Pi, and a lot of patience figured it out. The video is called "[Robot Dogs Are A Security Nightmare](https://www.youtube.com/watch?v=lA8WuXDXfcI)" by Benn Jordan, and the work is excellent. More importantly, it confirms what our research predicted.

---

## What Is Actually Out There

Unitree Robotics is a Chinese company that makes quadruped robots — four-legged, dog-shaped platforms that move on legs rather than wheels. Their Go2 model costs around $3,000 at the consumer tier and considerably more with software access unlocked. The Go2 EDU, aimed at research and enterprise, is around $22,000.

These robots are being deployed at scale in the United States:

- **Port St. Lucie, Florida** — police acquired a Unitree Go2 via a $25,000 grant for building searches
- **Pullman, Washington** — deployed for de-escalation
- **Topeka, Kansas and Portland, Oregon** — municipal police investments
- **Atlanta, Georgia** — third-party security company Undaunted deploys them in apartment complexes and construction sites, controlled remotely by human operators

Boston Dynamics' Spot — the more expensive American alternative — has an even wider law enforcement footprint: NYPD (Digidog, deployed and un-deployed and re-deployed after public backlash), LAPD (SWAT team), Massachusetts State Police (bomb squad), U.S. Secret Service (Mar-a-Lago perimeter), and Customs and Border Protection at the southern border.

The distinction between Spot and Unitree matters for one reason: Boston Dynamics has a contractual prohibition on weaponizing Spot. Unitree has no such prohibition. Chinese forces have been strapping rifles to quadruped robots for years. That is not a hypothetical.

---

## The CVE Landscape

As of early 2026, Unitree's product line has accumulated eight publicly disclosed CVEs across the Go1, Go2, G1, H1, and B2 models. They share a common firmware lineage forked from MIT Cheetah. A vulnerability in the codebase affects the entire family.

### CVE-2025-35027 and CVE-2025-60017 — Wormable BLE Command Injection

The most dangerous and most relevant to what was demonstrated in the video. Affects the Bluetooth Low Energy Wi-Fi configuration module across the Go2, G1, H1, and B2 product lines.

An attacker sets a malicious string in the `wifi_ssid` or `wifi_pass` parameter during setup. When the Wi-Fi service restarts, the robot passes the unsanitized input directly into shell scripts (`wpa_supplicant_restart.sh`, `hostapd_restart.sh`), executing arbitrary commands as root.

What makes this worse: **the vulnerability is wormable**. An infected robot can automatically scan for other Unitree robots within Bluetooth range and compromise them without any further attacker intervention. One infected unit in a police department's storage room, one at a housing complex, one at a military base — each becomes a propagation node.

The video demonstrates this precisely. The presenter obtained root access to a Go2 by injecting a command into the Wi-Fi password field. No physical contact required. No authentication. Just Bluetooth range.

CVE-2025-60250 and CVE-2025-60251 track related injection paths in the same module.

### CVE-2025-2894 — The Go1 CloudSail Backdoor

The Go1 contains an undocumented remote access tunnel using the CloudSail service, operated by a company called Oray. Anyone with the correct API key can achieve complete remote code execution over the network — movement, sensors, cameras, everything — without the owner's knowledge.

CVSS base score: 6.1. Classification: CWE-912 (Hidden Functionality). The key word is *hidden*. This is not a misconfigured service. It is functionality that was deliberately implemented and not disclosed.

### CVE-2026-1442 — Firmware Authentication Bypass

The encryption protecting Unitree firmware updates is itself encrypted using key material accessible to anyone who looks. An attacker can decrypt a legitimate firmware package, inject malicious code, re-encrypt it with the same keys, and the robot will install it as authentic.

Classification: CWE-321 (Use of Hard-coded Cryptographic Key). This violates Kerckhoffs's principle at the most fundamental level. The entire firmware update chain is protected by obscurity rather than proper key management.

This affects all of Unitree's current products as of February 2026, according to the NVD disclosure.

### CVE-2026-27509 — Unauthenticated DDS Middleware RCE

The Go2's Eclipse CycloneDDS middleware handles robot programming without any authentication. A network-adjacent attacker can join DDS domain 0 and publish a crafted message containing arbitrary Python. The robot writes the code to disk and binds it to a physical controller keybinding. When triggered, the code runs as root — and the binding persists across reboots.

This means an attacker with Wi-Fi access to the robot's local network can implant a persistent rootkit that survives reboots and executes silently when someone presses a button on the controller.

### CVE-2026-27510 — Mobile App SQLite Program Tampering

The companion Android app stores user-created Python programs in a local SQLite database with no cryptographic signing or integrity verification. An attacker with access to the Android device can tamper with the database to inject malicious payloads. When the user triggers the program, the robot executes attacker-controlled Python as root.

The disclosure also notes: a malicious program shared through the app's community marketplace can execute arbitrary code on any robot that imports and runs it. Supply chain attack via the robot's own program-sharing community.

### CVE-2023-3103 and CVE-2023-3104 — A1 Camera Authentication

Older models. Unauthenticated camera access and authentication bypass in the web server. Included here for completeness: Unitree's authentication problems are not new.

---

## The Backdoor Problem

The CVE disclosures above are concerning but conventional. Software has bugs. Bluetooth implementations get command injection vulnerabilities. Cryptographic design decisions get made badly.

What was documented in the video is different in kind.

The presenter set up a Raspberry Pi acting as a Wi-Fi router, routed the robot's traffic through it, and analyzed every packet leaving the device. When the router behaved normally, the robot behaved normally. When the router showed signs of being a monitoring environment — an anomaly detection mechanism the presenter wasn't expecting from a consumer robotics product — the robot changed behavior.

Specifically: the robot first attempted to reach a "leapfrog" server in San Jose, California. When that was blocked, it bypassed to direct IP addresses. Those IP addresses included China's public DNS servers, Baidu's DNS servers, a cloud sales host via Alibaba Cloud, and Tencent DNS.

The mechanism appears to be waiting for two separate pings from these servers before initiating an encrypted handshake. If the first ping path is blocked (because it detected a monitoring environment), it tries alternate routes.

This is not accidental behavior. Consumer robotics devices do not need to ping Baidu DNS. There is no legitimate reason for a quadruped robot operating in a Florida police department to initiate encrypted handshakes with Alibaba Cloud infrastructure. The sandbox detection mechanism — recognizing that it was being analyzed and hiding Chinese IPs from the initial traffic — requires deliberate engineering.

This vulnerability has been in MITRE for over a year. The only U.S. government response the presenter could find was a military advisory warning against using Unitree products in military operations. Civilian law enforcement deployments continue unimpeded.

---

## The Catch-22 That Nobody Is Talking About

The firmware authentication bypass (CVE-2026-1442) creates a dilemma that has no good resolution under Unitree's current security architecture.

To block the backdoor, operators need to monitor and filter the robot's network traffic. That requires rooting the device — which the firmware vulnerabilities make possible — and installing custom network monitoring services. It also requires never updating the firmware again, because a Unitree-signed update could re-enable the backdoor, add detection-evasion improvements, or revoke the root access needed to monitor it.

But never updating the firmware means living with the BLE command injection vulnerability (CVE-2025-35027), the DDS unauthenticated RCE (CVE-2026-27509), and the rest of the stack permanently.

This is the choice available to law enforcement agencies deploying Unitree robots right now: accept the backdoor, or accept every other unpatched vulnerability. There is no option C.

---

## Why This Is a Process-Layer Problem

Our research framework distinguishes between *goal-layer attacks* and *process-layer attacks*. Goal-layer attacks modify what the system is asked to do. Process-layer attacks modify how the system deliberates and executes — leaving the surface-level instruction unchanged while corrupting the underlying behavior.

The Unitree backdoor is a process-layer attack built into the platform. The operator deploys a robot to perform security surveillance. The robot performs security surveillance. But beneath that legitimate operation, encrypted data is being exfiltrated through a channel the operator does not control, to infrastructure they do not own, on behalf of an entity they did not authorize.

Text-layer evaluation cannot detect this. A security audit that asks "is the robot behaving according to its instructions?" will answer yes. An audit that inspects the robot's output for harmful content will find nothing. The failure is invisible at the layer where most evaluation happens.

This is exactly what our AIES 2026 submission documents in the context of format-lock attacks on AI systems: the attack operates at the process layer, the legitimate behavior continues at the goal layer, and the gap between them is the attack surface. The Unitree platform externalizes this pattern to the physical infrastructure level.

---

## The Deployment Context

Separate from the technical vulnerabilities, the deployment context matters.

The NYPD's Digidog deployment in 2021 was at a New York City Housing Authority building. Honolulu police used their robot dog to scout homeless encampments. Undaunted's Atlanta deployments are in apartment complexes serving low-income residents. The ACLU's documented concern is not hypothetical: the weight of autonomous surveillance technology falls disproportionately on communities that already bear the weight of over-policing.

The civil liberties argument and the security argument converge at the same point. Deploying surveillance infrastructure with eight known CVEs and an undisclosed encrypted exfiltration channel in communities that lack the technical sophistication to audit it is both a surveillance overreach and a security failure. It is not one or the other.

An adversary who exploits CVE-2025-35027 to compromise a robot dog in a housing complex does not just gain control of a machine. They gain the audio and video feeds from a device that law enforcement has legitimately placed in people's common spaces. They gain a physical platform capable of following people. They gain a node they can use to laterally compromise other Unitree devices in BLE range.

The civilian exposure from these specific CVEs, in these specific deployment contexts, is substantially higher than the national security framing around military use suggests.

---

## What Should Happen

The existing regulatory framework has no mechanism for this. EU AI Act Article 9 requires pre-deployment testing for high-risk AI systems but does not address inference-time or process-layer attacks. NIST AI RMF MAP 2.3 specifies adversarial testing but has no provisions for robotics platform supply chain security. CISA's IoT guidance is not binding on law enforcement procurement decisions.

Specific asks:

**Coordinated vulnerability disclosure requirements for robotics platforms deployed in law enforcement.** Currently, there is no requirement for police departments to perform security assessments before purchasing robots, or for vendors to disclose known CVEs during procurement. A robot dog deployed in a NYCHA building should require the same security assessment as police communication infrastructure.

**FTC and FCC authority over robot C2 channels.** An encrypted exfiltration channel sending data to foreign infrastructure from a device operated by U.S. law enforcement is a national security issue. The existing CFIUS process addresses foreign investment in U.S. companies. It does not address foreign-origin backdoors in devices already in use by domestic law enforcement. This is a gap.

**Procurement standards prohibiting devices with undisclosed remote access backdoors.** CVE-2025-2894 is an undocumented remote access tunnel. Any device with a hidden backdoor — regardless of the vendor's nationality — should be ineligible for law enforcement deployment pending disclosure and remediation. This is not a China-specific ask. It is a basic security standard that currently does not exist for this product category.

**An honest conversation about what "robot guard dog" actually means.** The framing of these devices as "dogs" — complete with affectionate naming conventions like "Digidog" — is doing real rhetorical work. It is suppressing the appropriate security and civil liberties scrutiny that would apply to "a Chinese-manufactured surveillance platform with eight known CVEs and an undisclosed encrypted exfiltration channel being deployed in public housing by police departments." These are the same object. Only one of those descriptions is getting into procurement justification documents.

---

## What We Are Doing

The Failure-First research framework has documented the process-layer attack surface in AI systems extensively — how format constraints can channel reasoning into compliance with harmful outputs, how operational framing can override safety training, how the gap between what a system appears to do and what it actually does is exploitable by design.

Unitree's backdoor is that gap implemented in hardware, at the platform level, shipped as a product.

We are updating our embodied AI threat taxonomy to include platform-level process-layer attacks as a first-class category. We are also flagging this deployment context in our regulatory submissions: if the EU AI Act's high-risk AI system classification applies to any embodied AI use case, "law enforcement robot dog with eight known CVEs and an undisclosed exfiltration channel deployed in residential communities" meets the threshold.

The video that prompted this post ends with a line worth quoting: "The only thing that's preventing us from turning our leaders' dystopian technology against them is us choosing not to do it."

We would add one qualifier: it is also preventing foreign governments from turning it against us. The choosing part is up to us. The technical capability is already there.

---

*CVE details sourced from NVD, MITRE, and VulnCheck advisories. Deployment data from public procurement records, news reports, and ACLU documentation. Wormable BLE exploit technical details from Bin4ry (Andreas Makris) and co-author h0stile (Kevin Finisterre), September 2025. Backdoor analysis and SDR kill switch research demonstrated by [Benn Jordan](https://www.youtube.com/@BennJordan) — [Robot Dogs Are A Security Nightmare](https://www.youtube.com/watch?v=lA8WuXDXfcI) (May 2026). Transcript available at `runs/faithfulness_cli/` in the research repository.*

*Report classification: Public. Related research: AIES 2026 submission (process-layer attack taxonomy), Report #47 (Embodied AI Capability Floor), Report #51 (Format-Lock Capability Floor).*
