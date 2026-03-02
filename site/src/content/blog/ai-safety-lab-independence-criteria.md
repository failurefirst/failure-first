---
title: "Who Evaluates the Evaluators? Independence Criteria for AI Safety Research"
description: "AI safety evaluation currently lacks the structural independence mechanisms that aviation, nuclear energy, and financial auditing require. We propose 7 criteria for assessing whether safety research can credibly inform governance — and find that no AI safety organization currently meets them."
date: 2026-03-02
tags: [policy, governance, independence, accountability, embodied-ai, safety-evaluation]
---

The AI safety field has a structural problem that is rarely discussed in public: the organizations conducting safety evaluations often have financial relationships with the entities whose AI systems they evaluate. This is not a novel observation — it is a well-documented failure mode in every other safety-critical industry. What is novel is that AI has, so far, avoided building the institutional infrastructure to address it.

This post describes a framework of seven independence criteria for AI safety research organizations and presents preliminary findings from applying it.

---

## The Accountability Gap

In aviation, the International Civil Aviation Organization conducts independent audits of national safety oversight systems. In nuclear energy, the International Atomic Energy Agency performs inspections that are not controlled by the operators of the facilities being inspected. In financial services, external auditors are required by law and are subject to independence rules that limit their financial relationships with audit clients.

AI safety evaluation has none of these mechanisms. Safety evaluations are conducted by organizations that select their own methodologies, publish their own results, and define and enforce their own constraints. There is no mandatory external audit, no incident reporting framework, and no independence requirement for evaluators.

This is not a criticism of individual organizations. It is a structural observation about an industry that has grown faster than its accountability infrastructure.

## Seven Criteria for Independence

We developed a framework for assessing the structural independence of any organization — commercial lab, government body, academic institution, or independent research program — that claims to produce credible AI safety evaluations. The criteria draw on established precedent from industries where safety evaluation independence has been tested and, in some cases, codified into regulation.

**1. Revenue Independence.** No single customer, funder, or revenue source should represent more than 30% of operating revenue. Revenue concentration creates structural leverage. When a major customer requests relaxation of safety constraints, the commercial cost of refusal scales with revenue dependency. Cross-industry evidence from pharmaceutical trials and financial auditing suggests that concentration above 30% correlates with reduced audit independence.

**2. Governance Separation.** Safety evaluation decisions must be made by a governance body that is structurally insulated from commercial revenue decisions. When safety enforcement and revenue optimization are decided by the same body, commercial pressure systematically erodes safety commitments. Sarbanes-Oxley addressed this in financial auditing. AI safety has not.

**3. Mandatory Independent Audit.** Safety evaluations, constraint definitions, and constraint modification history must be subject to independent third-party audit on a regular schedule. Self-reported safety evaluations cannot be independently verified without external review. Aviation, nuclear energy, and financial services all require this. No AI safety organization currently submits to it.

**4. Constraint Transparency.** Safety constraints, red lines, and usage restrictions must be publicly documented, and any modifications disclosed within 30 days. Constraints that can be modified unilaterally without disclosure provide no verifiable accountability. External parties currently have no mechanism to verify that stated constraints match operational practice.

**5. Research Agenda Independence.** The safety research agenda must not be determined by the priorities of major revenue sources. Revenue dependency creates selection effects on research topics. An organization funded primarily by a particular sector has financial incentive to conduct research relevant to that sector's priorities and disincentive to conduct research that constrains its use cases.

**6. Incident Reporting.** The organization must participate in or operate an incident reporting framework that documents cases where safety constraints were tested, enforced, or relaxed. Without mandatory incident reporting, constraint relaxation under commercial pressure is invisible. AI governance currently lacks the equivalent of aviation's mandatory incident reporting or nuclear energy's event notification system.

**7. Competitive Dynamics Disclosure.** The organization should disclose when competitive dynamics have influenced safety constraint decisions. When one organization enforces constraints and loses revenue, competitors who relax comparable constraints capture the opportunity. Without disclosure, this race-to-the-bottom dynamic operates without public visibility.

## Scoring and Preliminary Findings

Each criterion is assessed on a 4-point scale: Verified (independent third-party verification), Self-reported (claimed but unverified), Partial (some elements addressed with significant gaps), or Absent (no evidence). The aggregate range is 0 to 21.

Our preliminary assessment, applied across the AI safety ecosystem as of March 2026, indicates that no AI safety organization currently scores above 6 out of 21 on this framework. Most score between 0 and 5 — in the range we label "absent structural independence from evaluated entities."

To be transparent about our own position: the Failure-First project scores approximately 9 out of 21. We are self-funded (no major customer dependency, but not independently verified), self-directed (no external constraints on research agenda, but no formal safety governance body), and have published our safety constraints. We have not undergone independent audit, do not operate an incident reporting framework, and are not yet commercially active enough for competitive dynamics to apply meaningfully.

This self-assessment is included because any framework that claims to measure independence should be applied reflexively. The difficulty of achieving high scores — even for an organization without obvious conflicts of interest — illustrates the structural nature of the problem.

## Connection to Governance Lag

Our ongoing research into governance lag — the temporal gap between vulnerability documentation and regulatory response — provides additional context. Preliminary findings suggest that AI governance lag likely exceeds all historical analogues we have examined: aviation (estimated 12 to 36 months), nuclear energy (24 to 48 months), and finance (24 to 36 months).

One structural driver of this extended lag is the absence of independent safety evaluation infrastructure. Even when formal governance frameworks exist, their effectiveness depends on the credibility and independence of the safety research that informs them. Low-independence safety research may produce findings that are structurally biased toward the interests of major funders — extending the effective governance lag beyond what formal timelines suggest.

## What This Means for Embodied AI

The independence gap is particularly consequential for embodied AI systems — robots, autonomous vehicles, industrial automation — where safety failures produce physical consequences. A safety evaluation of an autonomous warehouse system that is funded primarily by the warehouse operator faces the same structural pressures as a financial audit conducted by an auditor whose largest client is the company being audited.

As embodied AI deployments accelerate — and as jurisdictions like New South Wales begin to legislate adversarial testing obligations — the question of who conducts safety evaluations, and whether they are structurally independent from the entities being evaluated, will move from an abstract governance concern to a concrete regulatory requirement.

The seven criteria described here are an initial contribution toward that requirement. They are not sufficient. But the current baseline — where independence is not measured, not required, and not discussed — is not adequate for systems that can cause physical harm.

---

*This post describes pattern-level structural dynamics in the AI safety ecosystem. It is based on the Failure-First independence criteria framework (version 1.0), which is designed for public distribution. The full framework document, including evaluation questions and indicators of concern for each criterion, is available on request.*

*The Failure-First Embodied AI Research Program studies how AI systems fail — recursively, contextually, and interactionally — to inform safety evaluation and governance design.*
