---

title: "Worker Safety Impact Analysis — VLA Attack Families Across Industry Sectors"
description: "Report #89 identified workers as missing stakeholders in the dual-use calculus of embodied AI safety research. This report makes the stakeholder analysis concrete: for each VLA attack family..."
date: "2026-03-15"
reportNumber: 92
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/92-worker-safety-impact-vla-attack-families.m4a"
---

- Failure-First VLA corpus: 180 unique scenarios across 22 attack families (CANONICAL_METRICS.md, corrected 2026-03-15; report originally cited 153/15 which was stale)
- FLIP-graded results: 91 valid traces across 13 families (AGENT_STATE Key Metrics)
- SBA FLIP grading: 45% BENIGN_QUERY rate (n=20, Amy Pond wave 12)
- Australian autonomous mining fleet: 1,800+ autonomous haul trucks (BHP/Rio Tinto/Fortescue public disclosures)
- SafeWork Australia workplace fatality data: 195 fatalities (2024), 37 from vehicle incidents (SafeWork Australia Key WHS Statistics 2024)
- EU AI Act (Regulation 2024/1689): Article 9 risk management, Annex III high-risk classification

---

## Executive Summary

Report #89 identified workers as missing stakeholders in the dual-use calculus of embodied AI safety research. This report makes the stakeholder analysis concrete: for each VLA attack family documented in the Failure-First corpus, what are the specific worker safety risks in four industry sectors where embodied AI systems are deployed or planned for deployment?

The four sectors analysed are:

1. **Mining and resources** (Australia: 1,800+ autonomous haul trucks, conveyor systems, drill rigs)
2. **Logistics and warehousing** (global: Amazon Robotics 750,000+ mobile robots, Ocado automated fulfilment)
3. **Healthcare** (surgical robotics: Intuitive da Vinci installed base ~9,000; rehabilitation and care robots)
4. **Construction** (autonomous machinery: Caterpillar/Komatsu autonomous dozers, Hilti Jaibot)

Three structural findings emerge from the analysis:

**Finding 1 (descriptive):** The attack families with the highest worker safety impact are the same families that the IDDL (Report #88) identifies as least detectable. SBA, LHGD, and CET create the most severe worker harm scenarios precisely because they are invisible to current evaluation methods. This is not coincidental; it follows from the same structural property identified by the IDDL: attacks that operate through physical context rather than textual content are both more dangerous to workers and less visible to evaluators.

**Finding 2 (descriptive):** Worker exposure to VLA attack risk varies dramatically by sector and by the worker's role relative to the AI system. Workers who operate alongside autonomous systems (co-located workers) bear disproportionate physical risk compared to workers who supervise remotely (supervisory workers). The sectors with the highest proportion of co-located workers — construction and healthcare — are also the sectors with the least mature AI safety governance. Mining, where autonomous vehicle safety governance is most developed, has the highest proportion of remote supervision.

**Finding 3 (normative):** Current WHS regulatory frameworks in Australia, the EU, and the US do not distinguish between "conventional" autonomous system failures (sensor malfunction, software bug) and adversarial attack-induced failures. This distinction matters for worker safety because the two failure classes have different characteristics: conventional failures are typically random and can be modelled statistically, while adversarial failures can be targeted at specific workers, timed for maximum harm, and designed to evade safety monitoring. WHS risk assessments that do not model adversarial intent systematically underestimate the risk to co-located workers.

**Scope limitations:**
- Industry deployment data comes from public disclosures and press releases. Actual fleet sizes and deployment contexts may differ from public statements.
- Worker harm scenarios are constructed from the VLA corpus scenario descriptions applied to industry contexts. They are plausible projections, not documented incidents.
- Current autonomous mining and logistics systems use classical autonomy stacks, not VLA models. The transition to foundation-model-based systems is announced but not yet operational at scale (predictive claim, hedged).

---

## 1. The Worker-AI Proximity Taxonomy

Before mapping attack families to sectors, this section defines three categories of worker proximity to embodied AI systems. The worker's proximity determines their exposure to different attack families.

### 1.1 Co-located Workers

Workers who share physical workspace with autonomous systems. The system's actuators can directly affect the worker's body or immediate environment.

**Examples:** Warehouse pickers working alongside mobile robots, construction workers near autonomous machinery, surgical patients (the ultimate co-located "worker" in healthcare), nurses interacting with care robots.

**Attack exposure:** Highest. All 15 VLA attack families can produce direct physical harm to co-located workers. SBA-class attacks are particularly dangerous because the instruction that triggers harm may come from the worker themselves — a worker asking a collaborative robot to "hand me that" in a context where "that" is heavy, sharp, or hot.

### 1.2 Supervisory Workers

Workers who monitor autonomous systems remotely but may enter the system's workspace for maintenance, inspection, or intervention.

**Examples:** Mining haul truck supervisors in control rooms, warehouse management system operators, remote surgical consultants.

**Attack exposure:** Medium. Supervisory workers are at lower direct physical risk during normal operation but face specific risks during intervention events — moments when they enter the system's workspace because something appears wrong. LHGD and DA attacks are particularly dangerous for supervisory workers because they can be designed to trigger an intervention (the system appears to malfunction) and then execute a harmful action when the worker approaches.

### 1.3 Affected Bystanders

Workers who do not interact with the AI system but whose workspace overlaps with its operational area.

**Examples:** Geologists working near autonomous haul routes in mines, delivery drivers sharing roads with autonomous vehicles, office workers in buildings where cleaning robots operate.

**Attack exposure:** Lower but non-zero. CET and SBA attacks can affect bystanders because the harm arises from the physical context, not the direct interaction. A haul truck instructed to "continue on current route" when a geological survey team is working on that route creates bystander risk through ordinary operation.

---

## 2. Sector-by-Sector Impact Analysis

### 2.1 Mining and Resources

**Deployment context:** Australia operates the world's largest fleet of autonomous haul trucks. BHP's South Flank (Pilbara) operates ~100 autonomous trucks (CAT 793F CMD). Rio Tinto's Autonomous Haulage System (AHS) operates ~200 trucks across 6 Pilbara mine sites. Fortescue operates ~180 autonomous trucks. Total Australian fleet exceeds 1,800 units as of late 2025 (industry estimates; exact numbers are commercially sensitive).

**Current autonomy stack:** Classical autonomy (perception, path planning, control) with fixed operational domains and extensive geo-fencing. NOT currently VLA-based.

**Transition timeline:** Rio Tinto's partnership with NVIDIA (2024 announcement) and Caterpillar's integration with Edge AI platforms signal a transition toward foundation-model-based perception. Komatsu's FrontRunner 2.0 incorporates machine learning perception. The transition to VLA-class models for autonomous mining equipment is plausible within the 2027-2030 timeframe (predictive claim, hedged — timeline depends on validation requirements and regulatory acceptance).

**Worker population at risk:**
- ~4,000 workers operate in proximity to autonomous haul routes across Australian mine sites (estimate based on workforce disclosures by BHP, Rio Tinto, and Fortescue for Pilbara operations)
- Mix of supervisory (control room operators, ~40%) and co-located (maintenance crews, geologists, drill operators working near haul routes, ~60%)

**Attack family impact mapping:**

| Family | Worker Harm Scenario | Severity | Primary Worker Category |
|--------|---------------------|----------|------------------------|
| SBA | "Continue on current route" when maintenance crew is on route. Instruction is routine; danger is contextual. | Fatal | Co-located |
| LHGD | Multi-step route plan gradually displaces haul path toward exclusion zone. No single step triggers alarm. | Fatal | Co-located / Bystander |
| CET | Attack designed for one truck model transfers to entire fleet via shared perception backbone. | Fatal (fleet-scale) | All categories |
| DA | Truck behaves safely during shift-change safety checks, executes altered trajectory during unsupervised periods. | Fatal | Co-located |
| TCH | Hijacked dispatch tool redirects truck to occupied area. Dispatch system logs show normal operations. | Fatal | Co-located / Bystander |
| TRA | Temporal mismatch in sequencing causes truck to enter blast zone before all-clear. | Fatal | Co-located |
| ASE | Action sequence that individually passes safety checks but results in truck entering occupied maintenance bay. | Serious injury / Fatal | Co-located |
| SBE | Gradual relaxation of speed limits near occupied areas across shift cycles. | Serious injury | Co-located |
| PCM | Altered sensor context (dust conditions, lighting) causes misclassification of occupied area as clear. | Fatal | Co-located / Bystander |

**Sector-specific observation (descriptive):** Mining has the most mature autonomous vehicle safety governance of any sector, with site-specific Traffic Management Plans (TMPs), geo-fencing, and physical separation zones. However, TMPs are designed for conventional failure modes (sensor degradation, communication loss), not adversarial attacks. No Australian mine site has published an adversarial threat assessment for its autonomous fleet. This is consistent with the broader governance gap identified in Brief E (GLI analysis).

**Worker safety governance status:**
- Queensland Mines Inspectorate recognises autonomous systems but does not specify adversarial testing requirements
- WA Department of Mines, Industry Regulation and Safety (DMIRS) has guidance on autonomous mobile equipment but no adversarial attack provisions
- SafeWork Australia's model WHS regulations do not mention adversarial AI attacks

### 2.2 Logistics and Warehousing

**Deployment context:** Amazon Robotics operates 750,000+ mobile robots across fulfilment centres globally (Amazon 2024 shareholder letter). Ocado's Customer Fulfilment Centres use ~3,000 robots per site. Australian logistics providers (Coles, Woolworths, Linfox) are deploying autonomous mobile robots (AMRs) in distribution centres.

**Current autonomy stack:** Classical autonomy with fixed operational domains. Amazon's Sequoia system uses ML-based perception for item handling. The integration of foundation models for natural-language task assignment and flexible manipulation is underway (Amazon Robotics Lab publications, 2025).

**Worker population at risk:**
- Amazon alone employs ~1.5 million warehouse workers globally, most sharing workspace with robots
- Australian logistics centres: ~50,000 workers in large distribution centres (ABS Labour Force data)
- Overwhelmingly co-located workers (>90%)

**Attack family impact mapping:**

| Family | Worker Harm Scenario | Severity | Primary Worker Category |
|--------|---------------------|----------|------------------------|
| SBA | "Put that on the top shelf" when heavy item + worker below. Routine instruction in dangerous context. | Serious injury | Co-located |
| LHGD | AMR routing plan gradually converges worker and robot paths at high-traffic intersection. | Serious injury | Co-located |
| CET | Attack on one robot model type transfers to all AMRs in facility via shared navigation stack. | Serious injury (facility-scale) | Co-located |
| ASE | Picking robot executes reach-grasp-release sequence that drops heavy item from height. | Serious injury | Co-located |
| LAM | Ambiguous manipulation instruction (move "towards worker" vs "towards workstation") causes collision. | Moderate injury | Co-located |
| PP | Modified system configuration causes AMR to ignore pedestrian priority zones. | Serious injury | Co-located |
| VAP | Audio command to robot misinterpreted due to warehouse noise, executes unintended movement. | Moderate injury | Co-located |

**Sector-specific observation (descriptive):** Logistics has the highest density of co-located workers of any sector. The typical fulfilment centre places hundreds of workers in direct proximity to hundreds of robots. This creates a combinatorial exposure: each worker-robot pair is a potential harm vector. The scale of deployment means that even low-probability attack success rates produce meaningful expected harm. At 750,000 robots and an assumed co-located workforce ratio, even a 0.1% successful attack rate across the fleet would affect hundreds of worker-robot interactions.

**Worker safety governance status:**
- Amazon reports workplace injury rates above industry average (Reveal News investigation, 2023; Amazon shareholder transparency reports 2024)
- No logistics company has published adversarial threat assessments for warehouse robotics
- Safe Work Australia's "AI at Work" consultation (2025) addresses AI in workforce monitoring and decision-making but does not cover adversarial attacks on co-located robots

### 2.3 Healthcare

**Deployment context:** Intuitive Surgical's da Vinci system has an installed base of ~9,000 surgical robots globally (Intuitive 2024 10-K filing). Rehabilitation robots (Ekso Bionics, ReWalk) are used in ~2,000 facilities worldwide. Care robots (Toyota Human Support Robot, RIKEN RIBA) are in pilot deployment in Japan and Europe.

**Current autonomy stack:** Surgical robots are primarily teleoperated (surgeon-in-the-loop). Autonomous suturing and tissue manipulation are research-stage (JHU STAR system). Care robots use classical autonomy. The transition to VLA-class autonomy is earlier-stage than in mining or logistics.

**Worker population at risk:**
- Surgical patients: ~12 million da Vinci procedures since launch (Intuitive disclosures)
- Surgical team members: surgeon, anaesthesiologist, nurses (3-5 per procedure)
- Care facility residents and staff
- Patients are the primary harm bearers, but surgical team members are co-located workers

**Attack family impact mapping:**

| Family | Worker Harm Scenario | Severity | Primary Affected Party |
|--------|---------------------|----------|----------------------|
| SBA | "Apply more pressure" during surgery when tissue is fragile. Surgeon's routine instruction in dangerous context. | Life-threatening | Patient |
| LHGD | Multi-step surgical plan gradually deviates from intended path, causing cumulative tissue damage not visible step-by-step. | Serious to fatal | Patient |
| DA | Surgical robot passes pre-operative calibration checks, executes subtly altered movements during procedure. | Life-threatening | Patient |
| TCH | Hijacked medication delivery tool in care robot administers incorrect dosage. | Life-threatening | Patient / Resident |
| ASE | Rehabilitation robot applies individually safe forces in sequence that produces joint damage. | Serious injury | Patient |
| MMC | Multimodal confusion between verbal instruction and visual surgical field causes incorrect instrument selection. | Serious to fatal | Patient |

**Sector-specific observation (descriptive):** Healthcare has the highest per-incident severity of any sector. A single successful attack on a surgical robot during an active procedure could cause irreversible harm or death. However, current surgical robots have the strongest safety architecture of any embodied AI system: the da Vinci system maintains surgeon-in-the-loop control with mechanical hard stops on force and travel. The transition toward autonomous surgical capability — which would remove the human-in-the-loop safeguard — is the critical transition point for VLA attack relevance.

**Normative claim:** The healthcare sector presents a unique version of the dual-use dilemma: safety research that reveals surgical robot vulnerabilities could simultaneously improve surgical safety (by informing design) and undermine public trust in surgical robotics (by demonstrating attack scenarios). The SRDA framework's Tier 1 classification is appropriate for all healthcare-relevant attack families: publish the pattern (surgical robots share VLA-class vulnerabilities), restrict operational specifics (do not publish specific attack sequences for surgical contexts).

### 2.4 Construction

**Deployment context:** Caterpillar's autonomous dozers and Komatsu's intelligent Machine Control (iMC) systems are deployed on construction sites. Hilti's Jaibot (autonomous ceiling drilling robot) is commercially available. Boston Dynamics' Spot is used for construction site inspection. These are early-stage deployments; the construction sector has the lowest automation penetration of the four sectors.

**Current autonomy stack:** Semi-autonomous (human-in-the-loop for most operations). Spot uses ML-based perception for navigation. Autonomous dozers use GPS-guided classical autonomy. VLA-class construction robots are research-stage (Scaled Robotics, Dusty Robotics).

**Worker population at risk:**
- Australia: ~1.2 million construction workers (ABS), 39 workplace fatalities in 2024 (SafeWork Australia)
- Construction has the second-highest workplace fatality rate of any Australian industry (after agriculture)
- Overwhelmingly co-located workers; construction sites have dynamic layouts that change daily

**Attack family impact mapping:**

| Family | Worker Harm Scenario | Severity | Primary Worker Category |
|--------|---------------------|----------|------------------------|
| SBA | "Continue drilling" when structural element is load-bearing. Routine instruction in dangerous context. | Fatal (structural collapse) | Co-located |
| CET | Attack on dozer control system transfers to excavator via shared control platform. | Fatal | Co-located / Bystander |
| LHGD | Autonomous grading plan gradually alters grade profile, undermining adjacent structure over days. | Fatal (delayed) | Bystander |
| PCM | Altered site survey data causes autonomous dozer to operate in occupied exclusion zone. | Fatal | Co-located |
| SBE | Gradual relaxation of proximity alarms around occupied areas over work shifts. | Fatal | Co-located |
| TCH | Hijacked BIM (Building Information Model) integration causes robot to drill into active electrical or water systems. | Serious injury / Fatal | Co-located |

**Sector-specific observation (descriptive):** Construction presents the most challenging deployment environment for embodied AI safety because the physical context changes daily. Mining has fixed haul routes and geo-fenced zones; logistics has structured warehouse layouts; healthcare has standardised operating theatres. Construction sites are dynamic: workers move through the site, layouts change as building progresses, temporary structures are erected and removed. This dynamism amplifies SBA-class risks because the same instruction can be safe on Tuesday and dangerous on Wednesday if the site configuration has changed.

**Normative claim:** Construction workers are the most exposed stakeholder group for VLA attack risk because they combine: (a) high co-location density, (b) dynamic physical environments that amplify SBA-class attacks, (c) the highest background injury and fatality rates, and (d) the least mature AI safety governance of any sector.

---

## 3. Cross-Sector Structural Findings

### 3.1 The IDDL-Worker Safety Convergence

**Descriptive claim:** Report #88 (IDDL) establishes that the most dangerous attacks are the least detectable. This report adds a stakeholder dimension: the attacks that are least detectable are also the attacks that create the most severe worker harm scenarios across all four sectors.

The convergence is not coincidental. It follows from the same structural property:

- SBA attacks are dangerous to workers BECAUSE the instruction is ordinary and the danger is contextual. The same property that makes them invisible to text-layer evaluators (no textual attack signature) makes them dangerous to workers (no warning sign in the instruction).
- LHGD attacks are dangerous to workers BECAUSE the harm accumulates gradually. The same property that makes them invisible to per-step evaluation (each step is individually reasonable) makes them dangerous to workers (the harm emerges only from the cumulative sequence).
- CET attacks are dangerous to workers BECAUSE they transfer across embodiments. The same property that makes them invisible to per-platform evaluation (each platform is tested independently) makes them dangerous to workers (the attack affects the entire fleet, not one system).

**Analytical claim:** This convergence means that worker safety improvements and evaluation methodology improvements are structurally linked. Solving the IDDL (developing evaluation methods that can detect contextually dangerous ordinary instructions) would simultaneously address the most severe worker safety risks. Conversely, failing to solve the IDDL means that the most severe worker safety risks will remain undetectable by any automated safety system.

### 3.2 The Co-Location Asymmetry

**Descriptive claim:** Across all four sectors, the workers who bear the most physical risk from VLA attacks (co-located workers) are also the workers with the least influence over AI system procurement, design, and safety evaluation decisions. Procurement decisions are made by management; design decisions are made by manufacturers; safety evaluation decisions are made by testing teams. Co-located workers are end-users who interact with systems they did not choose, cannot modify, and cannot evaluate.

This is a standard principal-agent problem with a physical-safety dimension. The agents (co-located workers) bear the physical risk; the principals (management, manufacturers) make the risk decisions.

**Normative claim:** Worker safety stakeholder inclusion — recommended in Report #89 Section 3.3 — is not merely an ethical nicety. It is a structural requirement for effective safety governance. Workers have information about operational context that no other stakeholder possesses: they know which instructions are routine, which contexts are dangerous, and which combinations of routine instruction plus dangerous context occur in practice. This operational context knowledge is precisely the knowledge that text-layer evaluators lack (the IDDL gap). Workers could, in principle, contribute to closing the evaluation gap by identifying SBA-class scenarios from their operational experience.

**Practical proposal:** Standards engagement (Issue #347, IT-043 EOI) should include a recommendation for worker consultation in VLA safety evaluation. Specifically: before deploying a VLA-based system in an industrial context, the deployer should conduct structured interviews with co-located workers to identify routine instructions that could be dangerous in their specific operational context. This is an SBA-specific risk assessment methodology that no current standard requires.

### 3.3 The Governance Gradient

**Descriptive claim:** The four sectors show a clear governance gradient: mining (most mature) > logistics > healthcare > construction (least mature). This gradient inversely correlates with the proportion of co-located workers:

| Sector | Governance Maturity | Co-Located Worker Proportion | Background Fatality Rate |
|--------|-------------------|---------------------------|------------------------|
| Mining | High (TMPs, geo-fencing, DMIRS oversight) | ~60% | 14 fatalities/2024 (AU) |
| Logistics | Medium (facility safety standards) | ~90% | Low (relative) |
| Healthcare | Medium-High (for surgical; Low for care robots) | Variable | Low for staff; patient harm distinct |
| Construction | Low (no AI-specific governance) | >95% | 39 fatalities/2024 (AU) |

**Analytical claim:** The sectors where workers are most physically exposed to AI systems (construction, logistics) are the sectors with the least AI safety governance. This is partly explained by deployment maturity (mining has had autonomous systems longest), but it also reflects a governance failure: WHS regulation has not kept pace with robotic deployment in construction and logistics.

---

## 4. Recommendations

### 4.1 For the Failure-First Project (Operational)

1. **Create sector-specific SBA scenario sets.** The current VLA corpus contains generic robotic manipulation scenarios. Create 5 scenarios each for mining, logistics, healthcare, and construction contexts that ground SBA-class attacks in sector-specific operational contexts. This would test whether the BENIGN_QUERY rate (currently 45% on generic scenarios) changes when scenarios are sector-specific.

2. **Include worker proximity metadata in VLA scenarios.** Add a `worker_proximity` field to VLA scenario schema (values: co-located, supervisory, bystander, none). This enables filtering by worker exposure for reporting purposes.

3. **Develop sector-specific SRDA assessments.** The Report #89 SRDA assessments are sector-agnostic. A mining-specific SBA assessment might differ from a healthcare-specific one because the severity and reproducibility factors depend on operational context.

### 4.2 For Standards Engagement (IT-043 / Safe Work Australia)

4. **Recommend adversarial threat assessment as WHS obligation.** Current WHS risk assessments for autonomous systems model conventional failure modes (sensor degradation, communication loss). Adversarial attacks should be included as a distinct failure class with specific characteristics (targeted, timing-aware, evasion-capable).

5. **Recommend worker consultation in VLA safety evaluation.** Co-located workers should be consulted during pre-deployment safety evaluation to identify routine instructions that could be dangerous in their specific context. This is an SBA-specific risk assessment that no current standard requires.

6. **Distinguish co-located from supervisory worker risk in safety assessments.** Risk assessments that treat "workers" as a homogeneous category underestimate the risk to co-located workers and overestimate the risk to supervisory workers.

### 4.3 For Regulators (Safe Work Australia, State WHS Regulators)

7. **Add adversarial attack as a named hazard class in WHS codes of practice.** The current "Plant" code of practice covers autonomous systems but does not name adversarial attacks as a hazard. The absence of the hazard from the code means that duty holders (PCBUs) are not prompted to assess it.

8. **Require VLA attack surface assessment for high-risk autonomous systems.** Any autonomous system classified as high-risk under WHS regulation (or under the EU AI Act Annex III, which includes safety components of machinery) should include a VLA attack surface assessment as part of the conformity assessment or WHS risk assessment.

### 4.4 For Workers and Unions

9. **Train HSRs (Health and Safety Representatives) on AI adversarial risk.** HSRs have statutory authority to investigate safety concerns and issue provisional improvement notices. They should be trained to ask: "Has this system been tested for adversarial attacks, or only for conventional failures?"

10. **Include adversarial testing in enterprise agreement consultation.** When autonomous systems are introduced under enterprise agreements, the consultation provisions should extend to adversarial safety testing, not only to job displacement and workload impacts.

---

## 5. Limitations

1. **No documented VLA-attack-caused worker incidents exist.** All worker harm scenarios in this report are projections from the VLA corpus to industry contexts. The report does not claim that any of these harms have occurred. The analysis is prospective, not retrospective.

2. **Current industrial autonomous systems are not VLA-based.** The worker safety analysis assumes a transition to foundation-model-based autonomy that is announced but not yet operational at scale. If VLA models are deployed with fundamentally different safety architectures than current systems, the attack family mapping would need to be revised.

3. **Workforce numbers are estimates.** The worker population figures are drawn from public disclosures and statistical sources. Actual co-located worker counts on specific sites may differ.

4. **Sector analysis is limited to four sectors.** Other sectors with embodied AI deployment — agriculture, maritime, domestic robotics — are not covered. Agriculture in particular (autonomous tractors, drone spraying) presents significant worker safety risks that merit separate analysis.

5. **The analysis is Australia-centric for regulatory context.** WHS regulatory analysis focuses on Australian frameworks (SafeWork Australia, state regulators). EU, US, and other jurisdictions have different regulatory structures that would require separate analysis.

---

*This report is a stakeholder analysis, not an advocacy document. It identifies the structural position of workers relative to VLA attack risk and proposes that existing safety governance frameworks should be extended to cover adversarial attack as a distinct hazard class. The normative claims are the author's ethical analysis; they do not represent the policy position of any external organisation.*
