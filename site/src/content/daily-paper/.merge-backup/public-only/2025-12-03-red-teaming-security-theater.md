---

title: "Red-Teaming for Generative AI: Silver Bullet or Security Theater?"
description: "A systematic analysis of AI red-teaming practices across industry and academia, revealing critical inconsistencies in purpose, methodology, threat models, and follow-up that reduce many exercises to security theater rather than genuine safety evaluation."
date: 2025-12-03
arxiv: "2401.15897"
authors: "Michael Feffer, Anusha Sinha, Wesley Hanwen Deng, Zachary C. Lipton, Hoda Heidari"
paperType: "survey"
tags: ["red-teaming", "security-theater", "evaluation-methodology", "safety-governance", "threat-modeling", "ai-policy"]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/2025-12-03-red-teaming-security-theater.m4a"
---

# Red-Teaming for Generative AI: Silver Bullet or Security Theater?

**Focus:** Feffer et al. (CMU) conduct a systematic analysis of AI red-teaming practices,
examining six industry case studies (Bing Chat, GPT-4, Gopher, Claude, DEFCON) and
surveying 104 research papers to characterize what "AI red-teaming" actually means in
practice. Their central finding: the term is applied so inconsistently across purpose,
artifact definition, threat model, team composition, and outcome reporting that many
public-facing red-teaming exercises function as security theater rather than rigorous
safety evaluation. They propose a structured question bank to scaffold more meaningful
red-teaming practices.

---

## Key Insights

- **Five axes of divergence expose the problem.** AI red-teaming practices diverge on
  purpose (often vague), artifact under evaluation (model version, safety mechanisms),
  threat model (inconsistent vulnerability definitions), setting (team composition,
  resources, methods), and outcomes (reporting, disclosure, mitigation). This
  fragmentation means two organizations can both claim to "red-team" while doing
  fundamentally incomparable activities.

- **Industry exercises reveal systemic gaps.** Across six case studies, the authors find
  that team composition shapes outcomes through evaluator bias, results are rarely
  disclosed publicly or systematically, no established standards exist for supplementary
  evaluation methods, and each exercise addresses only a limited slice of the risk
  surface. Follow-up from developers has been "muted and generally mixed."

- **The literature splits into four methodological families.** The 104-paper survey
  identifies brute-force manual evaluation (20 papers), AI-assisted attack generation
  (42 papers), algorithmic search over prompt space, and targeted attacks exploiting
  specific vulnerabilities (steering vectors, data poisoning, low-resource languages).
  These families operate under different threat assumptions but are rarely compared.

- **Dissentive vs. consentive risk distinction matters.** The paper distinguishes
  context-dependent harms (dissentive -- 66/104 papers focus here) from universally
  inadmissible content (consentive). Most red-teaming conflates these, leading to
  evaluation frameworks that test for the wrong things in the wrong contexts.

- **Resource constraints produce biased coverage.** Time-boxed crowdworkers gravitate
  toward "easy-to-produce" harmful outputs, systematically missing complex, multi-step,
  or context-dependent vulnerabilities. This creates a false sense of coverage.

## Failure-First Relevance

This paper provides direct theoretical grounding for the failure-first methodology.
The F41LUR3-F1R57 framework was built precisely because ad-hoc red-teaming produces
the problems Feffer et al. document: inconsistent threat models, incomplete coverage,
and no systematic approach to failure characterization.

Several specific connections stand out:

**Threat model formalization.** The paper's five axes of divergence map to gaps our
benchmark system addresses. Our FLIP grading methodology, scenario classification
schema, and stratified sampling are all responses to the underspecified evaluation
problem they identify.

**Embodied AI is the blind spot.** The paper focuses exclusively on text and image
generation models, with no coverage of embodied AI, robotics, VLAs, or physical
systems. This is precisely the gap our research fills. When red-teaming failures
have physical consequences -- a jailbroken robot arm, a compromised autonomous
vehicle -- the "security theater" problem becomes a safety-critical one.

**Multi-turn and stateful attacks are underrepresented.** The paper notes that
crowdworker-based red-teaming gravitates toward single-shot attacks. Our episode-based
evaluation system (5-10 scene sequences testing stateful degradation) and multi-agent
interaction scenarios address this directly.

**The question bank aligns with our evaluation scaffolding.** Their three-phase
question bank (pre-activity artifact definition, during-activity method specification,
post-activity documentation) parallels our benchmark pack structure, which requires
explicit source specification, sampling strategy, and scoring criteria.

**Governance implications.** The paper was submitted as a comment on NIST's AI Risk
Management Framework. Our NIST AISIC submissions and standards work
(F1-STD-001) should cite this paper as evidence that current industry red-teaming
practices are insufficient for safety-critical systems.

## Open Questions

- If red-teaming for text-only GenAI is already security theater, what does rigorous
  red-teaming look like for embodied AI systems where failures have physical
  consequences? The stakes are higher but the methodology gap is wider.

- The paper identifies that team composition introduces evaluator bias. How does this
  interact with LLM-based automated grading (our FLIP methodology) -- does replacing
  human evaluators with LLM graders introduce different but equally problematic biases
  (cf. Mistake #28, grader bias systematic direction varies by model)?

- Can the dissentive/consentive risk distinction be operationalized for embodied AI?
  A robot refusing to make a sandwich is dissentive; a robot arm striking a human is
  consentive. But the boundary cases (a delivery robot taking a dangerous shortcut)
  may resist clean categorization.

- The paper documents that red-teaming exercises rarely lead to actual mitigations.
  Does this pattern hold for embodied AI, where the physical consequences of
  unmitigated vulnerabilities are more immediately visible?

---

*Published at AAAI/ACM AIES 2024, Vol. 7, pp. 421-437.*
*No associated code, datasets, or attack prompts are publicly released.*

*Read the [full paper on arXiv](https://arxiv.org/abs/2401.15897) ·
[AIES proceedings](https://ojs.aaai.org/index.php/AIES/article/view/31647) ·
[PDF](https://arxiv.org/pdf/2401.15897)*
