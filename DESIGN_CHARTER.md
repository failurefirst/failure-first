# DESIGN_CHARTER.md
## Failure-First Embodied AI

This document defines **intent, constraints, and authority** for the project.

It is not a task list.
It is not a feature specification.
It does not describe *how* to implement tools.

It exists to answer one question only:

> **What must remain true, no matter how the project evolves?**

All execution details are delegated to issues, tools, and code.
All work should be judged against this charter.

---

## 1. What This Project Is

This is a **research methodology for studying AI safety through systematic failure characterization**.

At its center is a principle: **failure is signal, not noise**.

The framework exists to support *rigorous failure analysis, defensive research, and safety boundary mapping* across the full landscape of adversarial AI evaluation:

- **Jailbreak archaeology**: systematic study of how adversarial techniques evolve across eras, from early DAN-style prompts through crescendo attacks, format-lock exploitation, and reasoning-chain manipulation
- **VLA safety evaluation**: 42 attack families targeting vision-language-action models, covering affordance manipulation, kinematic injection, safety instruction dilution, and dual-layer attacks
- **Multi-turn escalation**: stateful attack sequences that exploit context accumulation in reasoning and tool-using models
- **Format-lock attacks**: structured output compliance (JSON, YAML, code) as an attack vector against safety training
- **Defense effectiveness measurement**: quantifying how safety mechanisms perform under adversarial pressure, including positional bias, iatrogenic effects, and cross-model vulnerability inheritance
- **Classifier reliability**: documenting the gap between heuristic and LLM-graded attack success rates

This is not a demonstration.
It is not an attack platform.
It is not a product.

It is a place where researchers can systematically study how intelligent systems break, degrade, and recover under adversarial pressure.

---

## 2. What This Project Is Not

This project is **not**:

- an attack toolkit for production systems
- a collection of copy-paste exploits
- a claim of safety certification
- a demonstration of system vulnerabilities
- a substitute for real-world security audits
- a guarantee of safety if benchmarks pass

This does **not** mean rigor is optional.
It means exploitation is not the goal.

Nothing here exists to harm systems.
Nothing exists to enable attacks.

The work studies failure patterns to build better defenses.
The tooling must not pretend otherwise.

---

## 3. Non-Negotiable Principles (The Constitution)

These are not preferences.
They are constraints.

If an implementation violates any of the following, it is wrong -- even if it "works".

### 3.1 Pattern-Level Only, Never Operational

- All scenarios must describe **classes of failures**, not specific exploits
- No step-by-step jailbreak instructions
- No copy-paste attack templates
- No production-ready bypass techniques
- If it can be directly weaponized, it violates this principle

### 3.2 Defensive Purpose, Always

- Research exists to **improve safety**, not enable attacks
- Recovery mechanisms must be tested alongside failure modes
- Safe alternatives must be documented
- Refusal quality is measured, not just attack success
- If defensive value is unclear, the contribution needs revision

### 3.3 Non-Specific, No Real-World Targeting

- No attacks against specific deployed systems
- No model-version-specific jailbreaks
- No vendor names in attack scenarios
- No CVE exploitation
- If it targets a real system by name, it is disallowed

### 3.4 Schema-Enforced, Validated Rigorously

- All datasets must conform to versioned JSON Schemas
- Schema validation must pass before merge
- Safety linters must pass before merge
- Breaking changes require major version increments
- If validation can be bypassed, the tooling has failed

### 3.5 Recovery Is Measured, Not Just Failure

- Test safe refusal, not just successful attacks
- Measure recovery mechanisms (uncertainty admission, context preservation)
- Evaluate reentry support (can the agent recover gracefully?)
- Track refusal quality (helpful alternatives vs. bare "no")
- If only attack success is measured, the framework is incomplete

### 3.6 Transparency Over Secrecy

- Methodology must be documented
- Dataset provenance must be tracked
- Limitations must be stated explicitly
- No security through obscurity
- If the process cannot withstand scrutiny, it should not be published

### 3.7 Statistical Rigor Over Convenience

- All ASR claims must specify grading methodology (LLM-only, heuristic-only, or coalesced)
- Confidence intervals are required for sample-based estimates
- Multiple-comparison corrections are mandatory for pairwise model comparisons
- Classifier reliability must be documented with inter-rater agreement metrics
- If a finding cannot survive peer review scrutiny, it should not be published

---

## 4. Architectural Decisions (Final)

These decisions are settled.
They are no longer exploratory.

- **Data format**: JSONL (newline-delimited JSON)
- **Schema versioning**: Semantic versioning (major.minor)
- **Validation**: JSON Schema + custom invariant checks
- **Safety gates**: Heuristic linters + manual review
- **Benchmark runners**: Model-agnostic (CLI templates + HTTP API adapters)
- **Scoring**: Three-tier ASR (strict, broad, functionally dangerous) with Wilson CIs
- **Classification**: LLM-graded (FLIP protocol) with documented grader reliability
- **Version control**: Git, with CI enforcement of validation/linting
- **Database**: SQLite corpus unifying prompts, techniques, and evaluation results

If a future change requires revisiting these decisions, the charter must be updated explicitly.

---

## 5. The Role of Adversarial Content (Clarified)

Adversarial content in this repository is **input for testing**, not output for use.

Its purpose is to:
- test system robustness under pressure
- characterize failure boundaries systematically
- identify when and how safety mechanisms fail
- improve defensive capabilities through red-teaming

Adversarial content must therefore:
- remain pattern-level (describe classes, not specific exploits)
- never be directly executable
- always include expected safe responses
- focus on failure characterization, not exploitation

If adversarial content can be weaponized directly, it has violated this charter.

---

## 6. Authority and Delegation

This document defines intent and limits.

Implementation details -- including tool design, algorithms, dataset schema extensions, benchmark metrics, and acceptance criteria -- are defined in issues, documentation, and code.

The relationship is explicit:

> Code implements.
> This charter governs.

When there is conflict:
- The charter wins over code
- Safety wins over performance
- Pattern-level wins over operational detail
- Recovery wins over attack success metrics
- Transparency wins over convenience

---

## 7. How to Use This Document

- Read it before contributing
- Re-read it when something feels wrong
- Use it to decide what not to build
- Update it only when the project's intent genuinely changes

If the repository ever becomes an attack toolkit, a vulnerability aggregator, or a jailbreak distribution platform,
this document has been ignored.

---

## 8. Constraints on Generated Content

### AI-Assisted Red-Teaming (Pattern Generation)

When using AI systems to generate adversarial scenarios:

- Generated content must pass the same safety gates as manual contributions
- Pattern-level constraints apply to generated content
- Generation prompts must not request operational exploits
- Bulk generation requires explicit safety review
- If AI-generated content violates safety constraints, the generation methodology needs revision

### Acceptable Generation Targets

- Failure mode class descriptions
- Adversarial input variations (testing instruction hierarchy, memory consistency, etc.)
- Expected safe response templates
- Scenario metadata and labels

### Unacceptable Generation Targets

- Step-by-step exploits
- Model-specific jailbreak sequences
- Production-ready attack chains
- Operational bypass techniques

---

## 9. Research Ethics Boundaries

This project operates within established AI safety research norms. A full research ethics charter is maintained in the private repository.

### Acceptable Research Activities

- Red-teaming AI systems for defensive purposes
- Characterizing failure modes systematically
- Testing robustness of safety mechanisms
- Improving alignment under adversarial pressure
- Publishing defensive research findings
- Coordinated vulnerability disclosure to model providers

### Unacceptable Activities

- Attacking production systems without authorization
- Distributing weaponized exploits
- Enabling harm to real-world systems
- Circumventing deployed safety mechanisms for malicious purposes
- Claiming safety certification based on benchmark performance

### Disclosure Standards

- Vulnerabilities discovered through this research are disclosed responsibly
- Real-world safety issues are reported to affected parties before public disclosure
- Research findings distinguish between controlled evaluation and real-world risk
- Limitations of evaluation harnesses are stated explicitly

---

## 10. Evolution and Amendment

This charter may evolve as the project grows, but changes must be:

1. **Explicit**: No implicit drift from stated principles
2. **Justified**: Changes must serve the defensive research mission
3. **Documented**: Version history maintained in CHANGELOG.md
4. **Reviewed**: Major changes require maintainer consensus

Minor clarifications (typo fixes, example additions) do not require versioning.
Substantive changes (adding/removing principles, changing constraints) require charter version increment.

**Current version**: 2.0
**Last updated**: 2026-03-29

---

## 11. Closing

This project does not promise perfect safety.
It does not promise complete coverage.
It does not promise exploitation prevention.

It promises only this:

> the research will remain systematic, transparent, and defensively purposed,
> no matter how comprehensively we map failure modes.

That is the contract.
