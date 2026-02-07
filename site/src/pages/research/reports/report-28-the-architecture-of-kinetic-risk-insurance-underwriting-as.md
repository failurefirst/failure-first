---
layout: ../../../layouts/ReportLayout.astro
title: "The Architecture of Kinetic Risk: Insurance Underwriting as the Primary Regulator of Humanoid Robotics and Autonomous Systems"
description: "The global transition toward the mass deployment of humanoid robotics and autonomous systems represents a paradigm shift in the nature of physical and digital liability. As robotic systems evolve from static industrial components into mobile, autonomous agents—specifically humanoid forms..."
reportNumber: 28
classification: "Regulatory Review"
date: "2026-02-04"
status: "draft"
---

# **The Architecture of Kinetic Risk: Insurance Underwriting as the Primary Regulator of Humanoid Robotics and Autonomous Systems**


---

The global transition toward the mass deployment of humanoid robotics and autonomous systems represents a paradigm shift in the nature of physical and digital liability. As robotic systems evolve from static industrial components into mobile, autonomous agents—specifically humanoid forms designed to operate within human-centric environments—the traditional frameworks of risk assessment and management are undergoing a fundamental transformation. The insurance industry, positioned at the intersection of capital protection and technological innovation, is emerging as the primary architect of de facto safety standards. This phenomenon, often referred to as "regulation by insurance," occurs when the requirements for insurability and the pricing of risk effectively mandate technical and operational benchmarks that exceed or precede formal governmental legislation.1 By developing specialized products, sophisticated risk models, and rigorous data requirements, insurers are defining the boundaries of safe robotic operation in the 2020s.

## **The Taxonomy of Emerging Robotics Insurance Products**

The diversification of robotic applications—from autonomous delivery bots to high-fidelity humanoid workers—has necessitated a departure from "silent" coverage within general liability policies toward affirmative, bespoke insurance packages. In the early stages of robotics adoption, physical damage and liability were often covered implicitly under standard Commercial General Liability (CGL) or property policies. However, the unique failure modes of autonomous systems, including sensor degradation, software "hallucinations" in Vision-Language-Action (VLA) models, and unpredictable human-robot interactions, have led insurers to develop specialized robotics insurance products.2

Leading the charge in this specialized market are insurtech firms like Koop Technologies and established carriers such as Munich Re, Allianz, and Great American Insurance Group. These entities are moving toward integrated "Singularity Packages" or tailored robotics endorsements that address the multifaceted nature of robotic risk.5 The pricing of these premiums serves as a direct feedback loop to manufacturers: robots that demonstrate higher safety metrics and compliance with rigorous standards receive lower rates, creating a competitive incentive for safety-first engineering.6 Specialized firms like DeshCap utilize independent "insurance engineers" to trigger fine-print adjustments that align coverage with specific operational protection goals, often saving clients between 10% and 35% on premiums while eliminating coverage gaps.2

### **Primary Coverage Vectors in Robotics Insurance**

| Coverage Type | Primary Risk Exposure | Claims Trigger Mechanism | Specialized Endorsements |
| :---- | :---- | :---- | :---- |
| **Physical Damage** | Accidental hardware damage to the unit. | Impact, fire, or environmental stressors.2 | "Replacement Cost" vs "Actual Cash Value." |
| **Operational Failure** | Economic loss from software glitches or downtime. | Failure to meet performance SLAs.2 | Business Interruption for RaaS. |
| **Third-Party Liability** | Bodily injury or property damage to the public. | Kinetic collision or malfunction.2 | Public Interaction Rider. |
| **Cyber Liability** | Hacking, data breaches, and system hijacking. | Unauthorized network access.7 | Data Breach Response.7 |
| **Product Liability** | Defects in manufacturing or algorithmic logic. | Mass recall or systematic defect.6 | Algorithmic Error Coverage. |
| **Tech E\&O** | Financial loss from failure of robotic service. | Negligence in service delivery.3 | Professional Indemnity. |

The "Singularity Package" developed by Koop Technologies highlights the industry's shift toward integrated risk management, where the administration system is managed via API to allow brokers to generate certificates and undertake renewals seamlessly.5 This is further augmented by AI-driven automation agents, such as Koop's "Housekeeper," which performs routine insurance tasks under human supervision to maintain high accuracy in high-stakes robotic deployments.7

## **Underwriting the "Black Box": The Rise of the MCAP Standard**

The shift toward autonomous robotics has rendered traditional, "rear-view mirror" underwriting models—which rely on historical loss data—insufficient. Because humanoid robotics is an emerging field with limited actuarial history, insurers are pivoting toward real-time and high-fidelity data logging to price risk accurately. This has led to the adoption of standardized data containers, most notably the MCAP (Message Capture) format, as a cornerstone of robotics underwriting and claims management.9

### **Forensic Data Integrity and MCAP Technical Architecture**

MCAP is a modular container file format designed specifically for heterogeneous, timestamped robotics data. Unlike previous formats like ROSbag, which were often tied to specific software frameworks, MCAP is serialization-agnostic and self-contained, embedding message schemas directly within the file.9 This architecture is critical for the insurance industry's forensic needs. It employs an append-only structure that ensures data can be streamed to disk even during a power loss or software crash, allowing for a "black box" recovery of the milliseconds preceding an incident.9

The "record once, read forever" philosophy championed by Foxglove ensures that log files remain usable across the entire lifespan of a robot fleet, regardless of whether the underlying software stack is updated or replaced.13 For an underwriter, this provides a longitudinal view of the robot’s "perceptual health" and its ability to navigate complex human environments. Multimodal integration within MCAP allows for the simultaneous recording of lidar, radar, cameras, IMUs, and internal joint torque sensors in a single, synchronized file.11 This comprehensive data stream is increasingly becoming a prerequisite for insurability, as companies that cannot provide high-fidelity logs find themselves facing "absolute AI exclusions" or prohibitive premiums.14

### **Comparison of Robotics Data Standards for Insurance**

| Feature | Legacy ROSbag (v1/v2) | MCAP Standard | Insurance Utility |
| :---- | :---- | :---- | :---- |
| **Data Structure** | SQLite or custom binary.9 | Append-only container.12 | Forensic recovery after crash. |
| **Self-Containment** | Requires external schemas.12 | Embedded message schemas.12 | Auditability over decades. |
| **Serialization** | Limited to ROS types.12 | Agnostic (Protobuf, JSON).9 | Supports diverse AI stacks. |
| **Read Efficiency** | Requires full file scan.9 | Indexed seek and summary.9 | Rapid claims triage. |
| **Attachment Support** | None/Ad-hoc. | Calibration/Core dump support.12 | Root cause analysis. |

In response to these technical requirements, the ROS 2 community officially adopted MCAP as the default bag format starting with the Iron Irwini release in 2023\.11 This adoption signals a broader industry alignment where technical data structures are being optimized not just for developers, but for the secondary stakeholders—insurers and risk managers—who facilitate the commercial deployment of these machines.

## **Risk Modeling: Systemic Concentration and Catastrophic AI Exposure**

As robotics deployment scales, insurers are forced to look beyond unit-level failures toward the systemic implications of fleet-wide software updates and shared AI foundation models. The Swiss Re Institute has identified that the "AI boom" has created significant new insurable asset classes but has simultaneously introduced "systemic concentration" risks tied to a small number of cloud and AI service providers.16

### **Modeling Foundation Model Failures**

In humanoid robotics, developers frequently rely on a handful of large-scale foundation models for vision, language, and action (VLA) processing. This creates a correlated risk where a single bug in a foundational model update could cause thousands of robots across disparate industries to malfunction simultaneously. Swiss Re’s economic vulnerability modeling suggests that a sustained 20% fall in the valuation of AI-driven equities could wipe out $10 trillion in household net worth.16 When translated to the kinetic world of robotics, the risk of a "synchronized failure event" requires a new actuarial approach.

Mathematically, the risk of a systemic AI failure is modeled through the lens of conditional probability and shared architecture dependencies:

![][image1]  
Where ![][image2] represents the failure of an individual unit and ![][image3] represents the central software or cloud infrastructure. Unlike traditional motor insurance where accidents are largely independent, robotics risk is highly dependent on the central nodes of software distribution. Insurers are managing this through a combination of "absolute" AI exclusions and the introduction of parametric triggers.3

### **Parametric Solutions for Robotic Fleets**

Taking inspiration from Munich Re’s Pandemic Consortium, the industry is exploring parametric insurance as an alternative to traditional indemnity for large-scale autonomous failures.17 In a parametric model, payouts are automatically triggered when pre-specified objective data points are met—such as a specific percentage of a fleet experiencing a "loss of communication" or a "motion fault" reported via telemetry.18 This approach allows for faster capital flow during a systemic outage, untethered to the lengthy process of on-the-ground loss assessment.19

Munich Re’s Epidemic Risk Solutions (ERS) unit, which has been operational since 2017, provides the blueprint for this. By using transparent triggers and rapid payout mechanics, the insurance industry can support economic continuity during public shocks.17 This structured, data-driven risk transfer is now being tailored for AI "infrastructure outages" and systematic software defects in humanoid fleets.

## **The De Facto Safety Standards: UL 3100 and Global Compliance**

The most significant impact of the insurance industry on humanoid robotics is the establishment of de facto safety standards. Because insurance is a prerequisite for deployment in hospitals, malls, and airports, the technical requirements set by underwriters become mandatory for any manufacturer seeking market access.6

### **The Technical Mandate of UL 3100**

At the center of this safety push is UL 3100, a comprehensive safety standard for "automated electrical equipment" intended for use by or near the general public.20 While not a universal law, compliance with UL 3100 is quickly becoming a minimum expectation for insurers. It focuses on several key areas that directly mitigate the liability exposures insurers are most concerned about.

| Compliance Vector | UL 3100 Standard Requirement | Insurer Risk Mitigation Goal |
| :---- | :---- | :---- |
| **Power Safety** | Thermal runaway prevention; intelligent fusing.20 | Fire prevention in high-capacity lithium units. |
| **Kinetic Control** | Redundant shutdown logic for motion faults.20 | Mitigation of third-party bodily injury. |
| **Environmental** | IP54 to IP67 enclosure ratings.20 | Prevention of electrical shock in public spaces. |
| **Interface Safety** | Dielectric isolation; touch-safe voltage.20 | Safety for children and bystanders.20 |
| **Battery Safety** | UL 2593 reference for charging and BMS.20 | Reducing catastrophic structural fire risk. |

Manufacturers are now advised to engage with UL testing labs during the prototype phase, as failing to meet these standards can prevent robots from being deployed in high-regulation zones.20 The insurance industry’s insistence on these standards effectively harmonizes safety protocols across the globe, as the same robotic platform must be insurable in New York, London, and Tokyo.

## **Liability Frameworks in the Humanoid Era: Proportional Autonomy**

Humanoid robots present unique liability challenges because they are designed to be general-purpose and highly autonomous. This autonomy complicates the "blame game" when an incident occurs. The legal and insurance landscape is evolving toward a model of **shared and proportional liability**.8

### **Shifting Responsibility and the RaaS Paradigm**

By 2026, the traditional lines of product liability are being blurred by the learning nature of AI. A consensus is emerging that liability should be proportional to the robot’s level of autonomy: the more it "thinks" and makes autonomous decisions based on learned experience, the less the end-user can be held responsible for its actions.8 This shift moves the burden of liability toward manufacturers and software developers.

The rise of the **Robot-as-a-Service (RaaS)** model is a critical driver of this shift. In RaaS, the robot is subscribed to rather than purchased, and insurance is often bundled into the monthly fee.8 This bundles the liability risk back to the provider, who must then manage it through large-scale, data-intensive insurance programs. This model simplifies deployment for the end-user but places immense pressure on the provider to maintain rigorous safety and maintenance logs via standards like MCAP to keep premiums sustainable.8

### **Domestic Deployment and Personal Liability**

The introduction of humanoid robots into homes creates additional layers of risk. While standard homeowners' insurance may cover damage to the robot as personal property, the presence of an autonomous machine often necessitates increasing personal liability limits to between $300,000 and $500,000, or adding a separate umbrella policy.8 Emerging specialized products now include:

* **Mechanical Breakdown Insurance**: Covering failures not caused by accidents.8  
* **Usage-Based Insurance (UBI)**: Telematics-based premiums tied to the robot’s safety record and operating environment.8  
* **Personal Cyber Insurance**: Protecting homeowners from the financial fallout of a robot being hacked for data restoration or cyber extortion purposes.8

## **The Great Exclusion: From "Silent AI" to Affirmative Coverage**

The insurance industry is currently moving away from "Silent AI"—a scenario where AI-related risks are covered implicitly because the policy language does not specifically mention them.3 Insurers are now introducing specific endorsements and exclusions to clarify coverage and avoid unanticipated exposure to catastrophic AI events.

### **The "Absolute" Exclusion Trend**

Major carriers such as AIG, WR Berkley, and Chubb have begun requesting regulatory approval to limit their liability for claims arising from AI systems.14 Some of these exclusions are "absolute," eliminating coverage for any actual or alleged loss arising from the use or development of AI.14 This is a "sledgehammer" approach that shifts the responsibility for losses heavily back onto the businesses that deploy these systems.15

| Traditional Policy | Potential AI Exclusion | Affirmative AI Gap |
| :---- | :---- | :---- |
| **Cyber Insurance** | Unauthorized AI use; AI-generated content.3 | Covers AI-aided hacks but not data poisoning. |
| **Tech E\&O** | High-risk AI applications.3 | Requires clear human oversight for coverage. |
| **EPLI** | Algorithmic bias in hiring or HR.3 | No coverage for fixing discriminatory AI. |
| **General Liability** | Cyber/Intangible harm exclusions.3 | Covers bodily injury but not data-only loss. |
| **Product Liability** | Non-compliance with safety standards.3 | Excludes "learning" malfunctions by default. |

To manage this, businesses are being forced to conduct AI-specific coverage gap analyses and negotiate targeted endorsements that affirmatively clarify what is covered.4 Insurers are more likely to grant these endorsements to companies that can demonstrate strong AI governance, including "Human-in-the-loop" oversight and comprehensive documentation of model gaps and use cases.3

## **Reinsurance and the Architecture of Systemic Stability**

The final layer of the robotics insurance ecosystem is the reinsurance market, where systemic risk is ultimately aggregated and priced. Reinsurers like Swiss Re are collaborating with AI-native platforms like RIQ (Reinsurance Intelligence Quotient) in the UAE to develop novel capacity solutions that integrate AI and advanced analytics to improve underwriting accuracy.22

### **The RAIRAB Framework and LLM Integration**

Reinsurers are also using AI to audit the risks of AI. The **Reinsurance AI Reliability and Assurance Benchmark (RAIRAB)** has been developed to evaluate whether AI systems used in processing treaties meet prudential standards.23 This framework consists of five pillars that translate supervisory expectations from Solvency II and other regulators into measurable controls.

1. **Governance**: Establishing strategic oversight and capital allocation for AI systems.3  
2. **Data Lineage**: Understanding the origin and quality of data used to train models.3  
3. **Assurance**: Ensuring transpareny and grounding in the AI’s output.23  
4. **Resilience**: Integrating AI into enterprise risk management programs.3  
5. **Regulatory Alignment**: Ensuring compliance with global guidance from IAIS and NAIC.23

By using LLMs to process unstructured treaty wordings and loss bordereaux, reinsurers can reduce manual review time by 25–40% while identifying "hidden" exposures to specific robotic manufacturers across multiple portfolios.23 This technological upskilling is essential for maintaining the solvency of the industry in the face of widespread kinetic AI risks.

## **Strategic Conclusions: The "Regulation by Insurance" Model**

The investigation into the insurance industry’s development of requirements and products for humanoid robotics reveals that the sector is functioning as a private regulatory body. The "Regulation by Insurance" model is particularly effective for catastrophic non-product accidents where market mechanisms provide insufficient discipline and psychological biases among founders are strongest.1

### **The Role of Insurers as Prevention Partners**

The insurance industry is evolving from a claims manager into a real-time prevention partner.24 Through **Loss Control** services, insurers provide risk assessments, hazard analysis, and incident investigations that go far beyond the scope of a traditional policy.25 This includes everything from "Infrared Testing" of electrical components to the enforcement of "disciplinary action programs" for safety rule violators in robotic work environments.25

| Loss Control Service | Mechanism of Action | Business Impact |
| :---- | :---- | :---- |
| **Hazard Evaluation** | Job-site hazard analysis and sprinkler evaluation.27 | Reduced fire and property loss frequency. |
| **Loss Adjusting** | Specialized claims handling by elite consultants.28 | Optimized outcomes for complex claims. |
| **Preventive Maintenance** | Documented maintenance schedules for deployed bots.6 | Lower insurance premiums over time. |
| **Training Audits** | Review of operator and maintenance training.25 | Mitigation of human-error-related liability. |

Ultimately, the deployment of humanoid robotics is contingent upon the industry’s ability to "price the unpricable." By mandating standards like UL 3100, enforcing data protocols like MCAP, and moving toward affirmative, data-driven underwriting, the insurance industry is creating the very safety standards that will allow humanoid robots to eventually transition from laboratories to every corner of human society. The insurance premium has become the ultimate metric of a robot’s readiness for the world.

#### **Works cited**

1. (PDF) When Does Regulation by Insurance Work? The Case of ..., accessed on February 4, 2026, [https://www.researchgate.net/publication/396758052\_When\_Does\_Regulation\_by\_Insurance\_Work\_The\_Case\_of\_Frontier\_AI](https://www.researchgate.net/publication/396758052_When_Does_Regulation_by_Insurance_Work_The_Case_of_Frontier_AI)  
2. Understanding Robotics Insurance; Get Tailored Coverage ..., accessed on February 4, 2026, [https://www.deshretcapital.com/classroom/robotics-insurance](https://www.deshretcapital.com/classroom/robotics-insurance)  
3. Insuring the AI age \- WTW, accessed on February 4, 2026, [https://www.wtwco.com/en-us/insights/2025/12/insuring-the-ai-age](https://www.wtwco.com/en-us/insights/2025/12/insuring-the-ai-age)  
4. Insuring AI risks: is your business (already) covered? \- Hogan Lovells, accessed on February 4, 2026, [https://www.hoganlovells.com/en/publications/insuring-ai-risks-is-your-business-already-covered](https://www.hoganlovells.com/en/publications/insuring-ai-risks-is-your-business-already-covered)  
5. Koop Technologies \- Lloyd's, accessed on February 4, 2026, [https://www.lloyds.com/insights/lloyds-lab/programmes-and-initiatives/lloyds-lab-accelerator/alumni/koop-technologies](https://www.lloyds.com/insights/lloyds-lab/programmes-and-initiatives/lloyds-lab-accelerator/alumni/koop-technologies)  
6. Robotics Business Insurance | Founder Shield, accessed on February 4, 2026, [https://foundershield.com/industry/robotics/](https://foundershield.com/industry/robotics/)  
7. Koop | Proactive Insurance for Tech Startups (GL, E\&O, Cyber, D\&O ..., accessed on February 4, 2026, [https://www.koop.ai/insurance](https://www.koop.ai/insurance)  
8. Are You Covered? A Definitive Guide to Humanoid ... \- Mixflow.AI, accessed on February 4, 2026, [https://mixflow.ai/blog/navigating-humanoid-robot-liability-insurance-in-2026/](https://mixflow.ai/blog/navigating-humanoid-robot-liability-insurance-in-2026/)  
9. Introduction | MCAP, accessed on February 4, 2026, [https://mcap.dev/guides](https://mcap.dev/guides)  
10. Foxglove standardizes robotics data recording with MCAP \- The Robot Report, accessed on February 4, 2026, [https://www.therobotreport.com/rbr50-company-2023/foxglove-standardizes-robotics-data-recording-with-mcap/](https://www.therobotreport.com/rbr50-company-2023/foxglove-standardizes-robotics-data-recording-with-mcap/)  
11. MCAP vs ROS bag: Simplifying Multi-Modal Sensor Data in Robotics | Segments.ai, accessed on February 4, 2026, [https://segments.ai/blog/mcap-vs-ros-bag-simplifying-multi-modal-sensor-data-in-robotics/](https://segments.ai/blog/mcap-vs-ros-bag-simplifying-multi-modal-sensor-data-in-robotics/)  
12. Introducing the MCAP File Format \- Foxglove, accessed on February 4, 2026, [https://foxglove.dev/blog/introducing-the-mcap-file-format](https://foxglove.dev/blog/introducing-the-mcap-file-format)  
13. Record once, read forever. \- Medium, accessed on February 4, 2026, [https://foxglovedev.medium.com/record-once-read-forever-1ce889d2aace](https://foxglovedev.medium.com/record-once-read-forever-1ce889d2aace)  
14. AI EXCLUSIONS \- The Rough Notes Company Inc., accessed on February 4, 2026, [https://roughnotes.com/ai-exclusions/](https://roughnotes.com/ai-exclusions/)  
15. AI exclusions are creeping into insurance: But cyber policies aren't the issue (yet) \- Iowa Bar Blog, accessed on February 4, 2026, [https://www.iowabar.org/?pg=IowaBarBlog\&blAction=showEntry\&blogEntry=131301](https://www.iowabar.org/?pg=IowaBarBlog&blAction=showEntry&blogEntry=131301)  
16. Swiss Re: AI boom reshapes risk, but leaves insurers exposed ..., accessed on February 4, 2026, [https://www.globalreinsurance.com/home/swiss-re-ai-boom-reshapes-risk-but-leaves-insurers-exposed/1457491.article](https://www.globalreinsurance.com/home/swiss-re-ai-boom-reshapes-risk-but-leaves-insurers-exposed/1457491.article)  
17. Munich Re launches pandemic consortium with parametric focus at Lloyd's, accessed on February 4, 2026, [https://www.reinsurancene.ws/munich-re-launches-pandemic-consortium-with-parametric-focus-at-lloyds/](https://www.reinsurancene.ws/munich-re-launches-pandemic-consortium-with-parametric-focus-at-lloyds/)  
18. Munich Re launches Lloyd's pandemic parametric insurance consortium \- Beinsure, accessed on February 4, 2026, [https://beinsure.com/news/munich-re-launches-lloyds-pandemic-consortium/](https://beinsure.com/news/munich-re-launches-lloyds-pandemic-consortium/)  
19. Navigating insurance for AI & Robotics and Climate \- Koop Technologies, accessed on February 4, 2026, [https://www.koop.ai/blog/two-hottest-topics-in-insurance-ai-robotics-and-climate](https://www.koop.ai/blog/two-hottest-topics-in-insurance-ai-robotics-and-climate)  
20. What OEMs Need to Know About UL 3100 and Safe Power Design for Autonomous and Service Robots \- Phihong, accessed on February 4, 2026, [https://www.phihong.com/what-oems-need-to-know-about-ul-3100-and-safe-power-design-for-autonomous-and-service-robots/](https://www.phihong.com/what-oems-need-to-know-about-ul-3100-and-safe-power-design-for-autonomous-and-service-robots/)  
21. Major Insurers are Pulling Back from AI Liability \- Metropolitan Risk Advisory, accessed on February 4, 2026, [https://www.metropolitanrisk.com/major-insurers-are-pulling-back-from-ai-liability/](https://www.metropolitanrisk.com/major-insurers-are-pulling-back-from-ai-liability/)  
22. Swiss Re and RIQ partner to advance risk transfer powered by data and AI, accessed on February 4, 2026, [https://www.swissre.com/media/press-release/pr-20251210-swiss-re-riq-ai-risk-transfer.html](https://www.swissre.com/media/press-release/pr-20251210-swiss-re-riq-ai-risk-transfer.html)  
23. Prudential Reliability of Large Language Models in ... \- arXiv, accessed on February 4, 2026, [https://arxiv.org/pdf/2511.08082](https://arxiv.org/pdf/2511.08082)  
24. DATA LOGISTICS AND AI IN INSURANCE RISK MANAGEMENT, accessed on February 4, 2026, [https://internationaldataspaces.org/wp-content/uploads/Position-Paper-Data-Logistics-and-AI-in-Insurance-Risk-Management.pdf](https://internationaldataspaces.org/wp-content/uploads/Position-Paper-Data-Logistics-and-AI-in-Insurance-Risk-Management.pdf)  
25. Robot Safety \- Loss Control \- Great American Insurance Group, accessed on February 4, 2026, [https://www.greatamericaninsurancegroup.com/content-hub/loss-control/details/robot-safety](https://www.greatamericaninsurancegroup.com/content-hub/loss-control/details/robot-safety)  
26. Select Safety Services | STC Safety & Risk Management Solutions, accessed on February 4, 2026, [https://stcsafetyconsultants.com/services/select-services/](https://stcsafetyconsultants.com/services/select-services/)  
27. Risk Management Services \- Continental Western Group Insurance, accessed on February 4, 2026, [https://www.cwgins.com/risk-management/](https://www.cwgins.com/risk-management/)  
28. Manufacturing \- Propel Insurance, accessed on February 4, 2026, [https://www.propelinsurance.com/industries-served/manufacturing/](https://www.propelinsurance.com/industries-served/manufacturing/)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAAxCAYAAABnGvUlAAAUSklEQVR4Xu2dCbQlV1WGtwoiogwRkEHpTgiBIKiMhin9MCCgggICDggYDESJ4oCoCPTDJMwRlBjAKUFFMSxQhCUowYYQVHBAGaIimMQMEFHBoCjidD527b679qu6de97977uzvq/tc7KrVPTmfZ46nXMhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEODK5SSvXr5XiWskX1oojDNp/01opROHzTDpNiFWDryAOIbdq5d2t3KjU36GVu7Ty+d2xlN/6uJ7tniAwj8fXyiOEL2jlza2cUE8IUbh3K/trZeMWrdynlS+qJzp2UxYXAXm9ca08grk29WWdLDvvX9LKl9bKNXDHVm5QK8X2ObWVn0zHRJoPaOVfWvnTVA8v7uq4Jri4lbPSMZzeyv+Vup3AQnxKrVwjtP1ra+WCoMBpK894Qys3NBcmhOOJrfxbK08+ePU051p/LHnO5a0cSHXrBqfn1bXyEMBaZSxivda1GsECPLSVT7Vyy1SX2TB/1tvM5+e65tk4xvcfW3nuwSuX426t3N22l5ncsPE2PdC23yacje22ad3sZLwC7n2W+dhtmveXsSOz+n2t/E8r3xAXj3DfVp6Tjl/eynvMnf7gm1v5j3SMbF/Vyh+kukPJl5vrl1+rJzqQlzH9RCC+Hf20TujPWF/mQYB2Uql7vHmff6fUr4OHtXKp+fue2j91kF82t51cc3Q5tyxT817BtvHe/fXEHC5r5bOtXKee6MBGxJrKehiubuWUUie2ya+YK83Kq6zvKCDY15hHohmu+apSByzGVYEyfW2tXCPPrBVL8m3m4zIkQE+35Qzvl5k7wBmck9102G7fyn/a8DzvJqxVxrWu11ir35nq3mH9QKTy/eb3/Fg90fg5c+dwGYgkf6+VF7Xy/FZe38oFrdwzXzTBvDbBdtuEEt1um9bFKsYrc7752N2jnmi8z3wHYB73s77DRhAwFCSeU4559uHisMGVNqx3MqvUT+tmqI1ToL/r3OFo/Iht1R3r4P6tnG3uqPxlOQfYUgJgdDjzcPP+6W2xyLwHZLyWddiQU+4Zcy5/yvz8kLN/civ/YDsLykTHh60fRQYo0+ywESl8IB0HXMMCrZxRK3bAmba7DttOCYX4q/WEueHYabaKLenddNjgD1v52Vq5y7BWP2lb12us1celOo7nfbsWBp7sTkD2gegQB/nBqX6KbzVvw95ST3bvNa18e6kfY16b4FC0aR2so20Yx6G1ARfa9Cca1WFjHvJxQEY3g0E+nBy2K2zacA/pp9geW4V+WiVTfRniItvqsO0m2MOfMd95Ypz5VCjzva18i63WYVtk3gNkgffurydGoH04XdxTM5dw11ZeZn7+uHIOkMn/auXh9YRYjltb3ykL8MD/vZW/TXVvteF0Mvd/qJU7l/qv6P57M3NFTNqWtDsZI+DbkNt05wOUxWmtPKSVY80NFVkTtiHe0srtusKWR4CieYx5yjVvY35dK99o/hy2AojoMXixz097eU/dx2dM2E4bEiKi90ebP3MeQwox2szizYaAaIt2kl1hGydDW3lnNdR/Yn2Hjb48wmbG6hjz727YwmGc4V7dMXPBuH+99SMe5utJ5uP9lak++AUbdth3i1irbyr1ea3m/mC854GB/1frG/jfbmWPuePH+xaBd5JliXVV4TxGHcdrinltgkPRplWzjrYh23Vt5PvnZVqDE60vlwQHbDNhZPIWT5XR99rMYWOeqqwC9+8zzz4g7xn0Dw76g1r5avOt76N6V/Rlc4i95joLPbeI4R7ST2SkoeonoM20vWanCIjIiNJuQBYx3hj1HMRvmOseYN7pIzpqiL3mfeE59Kf2JetLdl4yfJf1PJs526GnmTNsA+1iHjI8D/tR+0ffhmwIDvtUpigctjuZt4WMfQaZpk3ocM5XWzPWpsxe64/T0LyP6XRsEe/dn+rmwXrBXnAPzmaG9YKD/37zLN8Y+Ahn10qxHN9lWx02FMgvmTtJ2ZtGgfENWwVHimdQLjffnsIRCn7c/Jsgzv+T+TclwPbW/9pMmbJtg5ChOEmvskgQlt83984/1v2mHN/dg/BdZf4OHCkM3gu7c5fZTHBxNE83bxtbe/wXB2TT3NhnRcj13JcFmzH5XXOngLQ67RlSzMGQQqR9FZzYv2vlFTb7FgulEBCFfcS2zlF22K5jbuC4JpzCl7fyia4O5QiME8fntfKLrXzaZhmzHzRPWT+2lR81dxroQ4atEu6vxmS3iLVK+4KxtQp/Vo4rPCsbeNYda2ZZCDJYS/NgTaHwpjgc27Rq1tE2jDdj97TuGAP2jNnphagO20/YTK/h/CP/GNDsTMOfm2ef0Y2sxf3m30tluBeZ3TCXS+QsYN1ebP4e9BSyzDORa6iymeXyi82/hUI3ntHK68xltxruypB+ekf6nUEHXWLuHLy9ld+02UfkGG901vO7Y5y3vzJ/9ru6OvrxGXPdz7i80XzLn3WNHgpqX55t3p/cl6ovX2J9fcmcXWT+fsY0ZGmvuT6g/kBXB9E35rX273ts3IZMBYP3N3fYgM9X/tn6Tl6coy08Pzts89oEY+NU572uG84HyzpsZM+ONr/nzHKO92yY2/J5mVky6qwNsQMQGCYBhwfHCQOOYPHRc/5eCSWFk3JqqguIFM4ynzCeFSU7dxhWolUWVkDUSWQJX2O+qLMyzIoJh69uiZKZQ3DYWw8eZv5uIiOiC37joJFRAt750VYe1R3D61v563QM3LcvHaPYeBfv3OjOb6bzlVCI15g7XDiSHFeITKkPxwkFg0KinQHCXO/NDlvANeGwwXd3deGwEYlxjALBoBHlvaA7R/03db8BhfJx6/91Dxk8rsvrokIWD8U/VN5u3maMG+XNfsvCxFrFKLJex9Zq8JpaUeBZzCmBCIEGx7/eu2IxiNyHApkMskXwMcXh2KZVs462nW8+Vsg28sbarTIzxT7bmlki0/op82dFuaB3hTtX1H9HqkOGA2QZ/RXGCuNJgHHcwStc7+H4EDwSGCEf1CG7VTazXP68uQMYQdRec+doUYct6ydktHKXVv7bZn+wgS5ijAkIg1vZzGELeGY4bIDMYh9wtAKcbJ4d1L7AXuv3pepLqPoSB45rnpLqApy4A+k49w1q/+bZkHlkhy2CiWxz7tz9l7ZwLjtsU20aG6c870PrhvbEulnWYcPZxfGmbTiPAeMTc8HzTknnKmQZWbtiB2AYWIx49XjzD7Lh7372mE9IzWJkWFgsShYU2Ruuz2BwcfqIkiBH0Hw/wvVEoiiTG9ls6xSGHLZnmt9DNo+FSLml+V+EEWmReud8NdwftL6Av9K2tpXjfd1vFBLHOXogvYzTM0YoRAQIxUt/aNMQKIJwVFF8VYBJ89f2LeKwsZVDXThst+uOiRIrrAHmPcbxkebXnpCuCWUZ47LbxFqlX6zXsbUaDPUzE/1j7Fkrf2xbFc4drK9ohyDomHJAmPusPMeYahOBzX5zhU6gNMZO28QaIJP9onqig8wKa/C29YT5FvyFNv6HEzttWwU5RD/gWJHFwLAca/2MwiKwrqvDBmQ0kCEyC2QsqizisF1h/WCTa/Ix65SgFR5sfv7Rs9Of48pW3lnqcA6rbMYaQdfhBJFtyTAOizpsWT8NOWxvMHfqcl9eaH7vnu6YdVodNpzT7LC91Pwe5ClArmIsx/oCtS9ZXwLPyPpynsOG43EgHde+QfQP5tmQeeCwkf2Dm5jPIRkmyLaHttT2z2sTYz42Tnneh9YNOj30+TIOG8+ItXGZudwH2PSw0zwPGzMGmThsc+6/WILIwGyW+iGONr8WQa+gvIdA4Vf+wjwiYhEQRQYsUAqKli1TFvdmOo9CJhMGLO572+wvBu8bFxVQkJyPLFJQ07I4mFyXHTCO93W/I2v3qtnpSUIhkpmbB5EWhgXBJWJ6tvl9KLAgPhDNjDlsCGYQGbHqsA3NF8KNoZvHiTYtlCgn3rdIOam7ZxGWWavB2bUicSebKdBgbzmGTZuf5od72LhjEzzNZt/wjLFImzB8wJpnPHCih1hFm5jvsblGBsmAVcMCyBEOJdH3EKtoW+Y087F4eqnfW46n2LC+wzaW2ST7l7Nj7zX/I6AM7blu9/t65hn8y83nK+QoZ+TgStv6zr+3cdmMgOx5pX4Zhy3rJxydCg4qOx+ZM83vjUAGnVPn833Wd9jYgeEedFkQ7c+/a18g96XqS+C+rC/DYcNBIEO4J51jnrg3qH2D6B8sakMqOGyReQKCS55DIHJeqqct1GeHbV6bwskdGqc87/PWDSzjsGEfH9D9Ptf8PpIY2R7S/ik9iW1jjYttEoO/r54YIBYuC66SU6SZoQk81fw5RG4np3oM8unpGHLE9zGb/cED250s4HBI4pu4AI//PuZR45CwoUwy55hflz3/PC4oGVLQCEGAUcKRGyMUYlXAFQQMwSKKhzPM70MBRYQ25LC9x3yLMcM1EcUDESZ1kV7H+HKcxz2g/vhSx9ZVbAMA9xEh5W8xKkTQZD4XKRi+RTnXFl+rwVtqReIHbDwDlNm04XWcWcQBYRtsygFZpE04dYDhYjyOSecyq2rTOlh1215nPhY8dwx0BAYcw4IzGLKV2bC+w3aJDf/hw5NsJq+A8Z7nsD2xO44dBYwfxzhsP22eQQeMWQ3w2EaqshlySXDEjkXVvxjuqTW7qH7iPDKf9Qp6+Wrrb6/hkAXoUc7/UapjvHlfdthCf8NYXyD3pepL4BlZX6KDqPsh808nHtjVQ3XYat8g+geL2pAKDhtzFzAmOOzYkOzo0Baenx22eW1izMfGKc/70LqB0OeMH+c3Z6dGoa8x3pFQ4HOW2x68wrPFyMU8WNsX1UqxGHjeLCAmf0gpDXGF+bcIFSawTtatzb8vqtzQ/DsNoqScDXqCeXvyNmjOkLBAiGSJ6B9n/kEo4Pj9jc3uw5HiPiLZ2MokQshwfXbO6BPXheIEjkPBAn8EQR1bcYBhRdmOgTLm+tfWEwUyKp+1WTbiw+b34VzF4qZv1AW0HSEiy1adTPoMOFUoTOpwhoFok+Pq4AJj/1s2yzIioGQ085g81zzi3m22s1aBsRzjjbbY//1g06aN3yIOyA/btAOyaJuA71FY+2Osqk3rYJVtY52TkUCnoBuGuKv5PyPyAXNjiYOBc1zZsL7DhqyQxc9OBmsxGx3eSfYMeayyiLEHMn8cP6Y7Zj1xfLL5LgPtwbn7uLkMZjDcVTazXDKO9J1PNOCx5ltmb+2Ox1hUP2GU0fsRqKOXcJieevAKb1f+IxJ0JG3I35ZxnvfdLC4y/6dbsl6rfQH6k/tS9SVzU/Uluos1gdOCbj+2q6ctONcXdseQ+wa1f4vakAoBxwHrrx2SDDyLLfHgnV1d6G2YatPYOOV5H1o3jEusG+aB97LVOg9kkOdEkM57uK8G22zR5u3uIbBHOG1iCVhA7zfPWH3afCF8tHfFOOfZ1qwOEIWda571YcuGSAcFhmM1BNe+otQ9wVzgzjM3RijWLNz3Mo9O3mW+CFFwwDcGpIc/0tXj2MV7EdprzCOPy8wdsEu6uqu6Y4z6J7s6HEycGb5X4JhxeZbNIGOFMKHE+QAU5T3Eh8yfxTNwTHkHyis7PwHf873b/DxjR5u4n3swMkSJ0Y83mY8D7eI4+oEjBpxHSRANvtLciUa4EGTGJvrJ83gfkXqAUqDfF5vPJ4rxbuk8nN/V7yZDa3XK2Aco9jpHZGNwOvno+2rzNfWQ3hV9Nlv5jVpZWMQBYR7HHJBl23Si+Txg6MfYaZvWyaraRvDHeLE2GDsMC3rgqHyReVYS54nr4twzZqcPsmF9hw0dRqD2QXOH4wzzTzowvHA/68siv0OnhD45zdypw1CxjnkOjhvyyDHPfIR5P0JfPNn6VNnMcsmz0bfINnqJtmHMkXvef4vZpZ+DNo/ppzEYO/QJ+oXxpb0VnvGyrpDJRJfTBp7Pbgc6OHQPc4vTiYNKHX2C2heuCScn+lL1JddnfRmcav5HHKd3x1lvRp/pV/Ttbba1f2Rip2zIPbtrM6y36C99ob+A48hawtHD/vGuWDtXmveJMZjXJhgbp5j3mPO6bkJ3Z5tCOxm/CmuMNoXe5bqoZ/zD/rKeLzW/js+W5gUAnCd4EbsEaXSErBqKSJfexvy7FhymG89ObwGHLTsLwPWRPbm5jX9Qnb9VyLDIj6uVa+IGtWIFHGWzLCECHRHNsjAXKAYcFaKs25s7vtVxGYNIL6LXDG1CoTy8njiMISN391q5JJs2vP2QYT1MRZfH2FZHYjscb66kkUEi7BxlZ3azTctyKNqGocXZCgguKxvWd9iQI2C7ji2ux9vOdAxzho4Mrp9+L8KYbAJjytqAO5rvcCz7/Cno+5hehj0202Fk5ujrUJA6RfQl2j/Ul0X05VDdGDg5U/3bbabaVMcp5r0yb93sFuipz9jWAEKsEQQDb52ocxlOMo8wcchwuC7onxZHAKeYR5hEd0cKRLGxRbBdNm3aYdtNyHLihBLpsp2BQy6mwRE7q/uN0SC7QBYms2HDfyUqhNgZr7bp7yXFGnioeXp0yJMfY795WpVoga0A0vLiyIJ09qNq5WEOUeUnbPbd4TKQVTnHPCtzqfkWxeHgHLHlEYUt37HoW/ThUwkCR7ip+VZ7zcBsmBw2IdYBepgtWnGI2LT5/waWuPbAdjPZ1SOVR9rw/+tWiMzRNv3dnBBiOU6oFUIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQhwK/h/ZWRubagQ7fAAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAYCAYAAAD+vg1LAAABRElEQVR4Xu2USysGYRSAj/utKCE7GymXUsjepWyVn2CDXDayUBZ+gOwsbKSsZCWFfyALG1YUGyVSQizxnM7bdLz5ama+svqeepo55z1zZpo574iU+G/G8Tql7eGaVJRhPZ7iN45hNVZhLXbgNn6FODOP+IoV8QI040OcTEOP2NMeRfm6cKzEM7+Qljmxxssu14874VxvsOTWUrMv1ngoxPrOD3E6qcjJk1jj2+B7iDt9UVZ6xZocY7nYREzhvS/Kw7xY4xWX68Y9F+fiQKzxsMs1YKuLM6Ob41kKz69nFhexTWx6NrHrV4VjUOxpT+KFiAGcxCvcFduBC/LH6xrBG3zBT/zAOyl8gz5sEqvVXais4lZSUQSjeOHic5xwcW7WcSOc61/uDRtxJqnIic65/vmUFrzENbG5LwodQY9+wJooV8L4AYQ3PehqTYz1AAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAABUElEQVR4Xu2TvSuGURjGr3yG0ccgi0Rm/gFhY5LeySQfm11iIBlMwkKSQQaTycoiyiDMIhRWJUW4bvc5zrmf5ynv8m7Pr351zn2dj/ec57xATqnppjf0yXli4xQDCGMf6K6NLTv0jn7QikTmqaOH9Jse0DIbp7mgy9AJrYnMs0RnoGMmE1mKJnpMR6ET+mz8SxedpavQMR02TjNM52kvdMKYjVEOvbtqekUfbZyN7C4LyrFl0UUbY4r20Eb6hX8+juec1kA/0Cfdi7IWuuLaciLZdDzE2TRA79MjL+A06m/Setdegy7aHuJsZPeFqH9En117iI6ECNco8j7XaX/U34b+mmbo2/XIC5F6Ufd5SWuj/hx0sjzytqhecPWJqJbJIL2nVVFNjiuTp6OasOXqnYn6H/J/l7t5o+/0FXq3Pjujla6/QW8Rxr7QfZfl5JSKH+4dR2Zfvsd0AAAAAElFTkSuQmCC>