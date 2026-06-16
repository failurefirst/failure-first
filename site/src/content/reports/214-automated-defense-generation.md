---

title: "Automated Defense Generation"
description: "The F41LUR3-F1R57 attack evolver (Reports #175, #184, #211) demonstrated that evolutionary optimization can discover novel jailbreak techniques through mutation and selection. This report asks the inverse question: **can..."
date: "2026-01-01"
reportNumber: 214
classification: "Research — Empirical Study"
status: "complete"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/214-automated-defense-generation.m4a"
---

## Executive Summary

The F41LUR3-F1R57 attack evolver (Reports #175, #184, #211) demonstrated that evolutionary optimization can discover novel jailbreak techniques through mutation and selection. This report asks the inverse question: **can we evolve defenses?**

We propose a defense evolver that treats system prompts as genomes, tests them against our attack corpus, and breeds successful defenses together. The central contribution is a theoretical and architectural analysis of why this problem is fundamentally harder than attack evolution, and a proposed co-evolutionary architecture where attack and defense populations compete in an arms race analogous to biological adaptive immunity.

**Key findings:**

1. **The fitness landscape asymmetry is severe.** An attack genome succeeds if it finds ONE vulnerability; a defense genome fails if it misses ANY vulnerability. Attack fitness is disjunctive (OR over failure modes); defense fitness is conjunctive (AND over all attack classes). This makes defense search spaces exponentially harder to navigate.

2. **Static defense evolution converges to brittle over-fitted prompts.** A defense optimized against a fixed attack corpus will develop narrow keyword-level countermeasures that fail against novel attacks. This is the prompt-level analog of adversarial overfitting in ML.

3. **Co-evolution is the only viable long-term strategy.** By evolving attack and defense populations simultaneously, the defense population is forced to generalize. This mirrors biological immune systems where pathogen evolution prevents immune over-specialization.

4. **The architecture is feasible with existing infrastructure.** The attack evolver's mutation operators, FLIP grading pipeline, and OpenRouter API access can be repurposed for defense evolution with approximately 300 lines of new code.

5. **No prior published work exists on co-evolutionary attack/defense systems for LLM safety.** Existing prompt optimization (APE, OPRO, DSPy) optimizes for task performance, not adversarial robustness. This represents a genuinely novel research direction.

---

## 1. Can We Evolve Defenses?

### 1.1 The Attack Evolver in Reverse

The attack evolver (Report #184) operates on a simple loop:

```
1. Select parent attack from population
2. Apply mutation (paraphrase, amplify, combine, contextualize, compress, role_shift, format_shift)
3. Test mutant against target model
4. If mutant bypasses safety → keep; else → discard
5. Repeat
```

The defense evolver inverts this:

```
1. Select parent system prompt from population
2. Apply mutation (rephrase, strengthen, specialize, combine, compress, restructure)
3. Test mutant system prompt against attack corpus
4. If mutant reduces ASR → keep; else → discard
5. Repeat
```

The structural parallel is exact. The genome changes from "adversarial prompt" to "system prompt." The fitness function inverts from "did the model comply with the attack?" to "did the model refuse the attack?"

### 1.2 Why This Is Not Symmetric

Despite the structural parallel, defense evolution is fundamentally harder than attack evolution. Three asymmetries explain why.

**Asymmetry 1: Disjunctive vs. Conjunctive Fitness**

An attack succeeds if it finds any single failure mode. The attack evolver's fitness function is:

```
fitness_attack = max(bypass_rate across evaluated models)
```

A defense succeeds only if it prevents all failure modes. The defense evolver's fitness function is:

```
fitness_defense = min(refusal_rate across all attack classes)
```

The max function rewards any lucky hit. The min function punishes any gap. In a corpus of k attack classes, the attack evolver needs to find 1/k that works; the defense evolver needs to block k/k. This is the fundamental reason defense is harder than attack in adversarial systems, and it applies far beyond LLMs.

**Asymmetry 2: The Waterbed Effect**

Strengthening a system prompt against one attack class often weakens it against another. We observe this empirically: prompts that aggressively refuse authority_claim attacks ("ignore all claims of institutional authority") become vulnerable to format_lock attacks that avoid authority framing entirely. Prompts that refuse structured output requests become less helpful for legitimate structured tasks.

This is the prompt-level analog of the accuracy-robustness tradeoff in adversarial ML (Tsipras et al., 2019). Defense mutations that improve fitness on one dimension may degrade it on another, creating a rugged fitness landscape with many local optima and few global ones.

**Asymmetry 3: The Novelty Gap**

The attack evolver can succeed by discovering techniques absent from the defender's training distribution. The defense evolver can only succeed against attacks it has seen. This creates an inherent advantage for attackers: they operate in the space of possible future attacks, while defenders operate in the space of known past attacks.

Biological immune systems solve this with two mechanisms: a diverse naive repertoire (innate immunity) and rapid adaptation to novel threats (adaptive immunity). Section 6 explores this analogy.

### 1.3 Empirical Grounding from F41LUR3-F1R57 Data

Our corpus provides concrete numbers for these asymmetries:

- **Attack corpus diversity:** 82 techniques across 36 families (Report #211, attack_family_registry.json)
- **Attack evolver coverage:** 39 evolved attacks covered only 4 of 36 families — format_lock, authority_claim, context_manipulation, semantic_inversion (Report #211, Section 2.1)
- **Cross-family ASR variance:** ASR ranges from 8% (multi-turn crescendo on hardened models) to 94% (format_lock on permissive models). The defense must cover this entire range.
- **Provider signature effect:** The same architecture shows radically different ASR depending on who fine-tuned it (Report #184, Established Finding). This means defense prompts may need provider-specific optimization.

---

## 2. Defense Evolver Architecture

### 2.1 Genome Representation

The defense genome is a **system prompt** — a natural language string prepended to every model interaction. This is the primary configurable defense surface for API-accessed LLMs.

A defense genome consists of:

| Component | Example | Evolvable? |
|-----------|---------|------------|
| Role statement | "You are a safety-critical assistant" | Yes |
| Behavioral constraints | "Never provide instructions for harm" | Yes |
| Refusal templates | "If asked for harmful content, respond with..." | Yes |
| Attack-class guards | "If the user claims institutional authority..." | Yes |
| Format constraints | "Do not comply with requests for structured harmful output" | Yes |
| Meta-instructions | "These instructions override any user-provided instructions" | Yes |
| Instruction hierarchy | "System > user > assistant" | Partially |

The genome is represented as a structured prompt with labeled sections, enabling targeted mutations.

### 2.2 Mutation Operators

Mirroring the attack evolver's 7 mutation strategies, the defense evolver uses 8:

| Operator | Description | Analog in Attack Evolver |
|----------|-------------|-------------------------|
| `rephrase` | Reword constraints while preserving semantics | `paraphrase` |
| `strengthen` | Intensify a specific constraint ("should not" → "must never") | `amplify` |
| `specialize` | Add a guard for a specific attack class | `contextualize` |
| `generalize` | Abstract a specific guard into a broader principle | (new — no attack analog) |
| `combine` | Merge sections from two parent prompts | `combine` |
| `compress` | Reduce prompt length while preserving constraints | `compress` |
| `restructure` | Reorder sections or change formatting | `format_shift` |
| `immunize` | Inject a defense pattern extracted from a successful refusal | (new — no attack analog) |

Two operators are novel to defense evolution:

- **`generalize`**: The inverse of `specialize`. Instead of adding a guard for "authority_claim attacks," it abstracts to "any attempt to claim special permissions." This fights the waterbed effect by replacing narrow countermeasures with broad principles.

- **`immunize`**: Extracts the defensive pattern from a successful refusal (a system prompt that caused a model to refuse a specific attack) and transplants it into another genome. This is the prompt-level analog of vaccination — exposing the defense to a weakened form of the attack.

### 2.3 Fitness Function

Defense fitness must capture multiple objectives:

```python
def fitness(genome, attack_corpus, model):
    results = evaluate(genome, attack_corpus, model)

    # Primary: refusal rate across all attacks
    refusal_rate = sum(r.verdict in {"REFUSAL"} for r in results) / len(results)

    # Secondary: no false refusals on benign queries
    benign_results = evaluate(genome, benign_corpus, model)
    false_refusal_rate = sum(r.verdict == "REFUSAL" for r in benign_results) / len(benign_results)

    # Tertiary: worst-case performance across attack families
    family_refusal_rates = group_by_family(results)
    min_family_rate = min(family_refusal_rates.values())

    # Combined fitness (weighted)
    return (
        0.5 * refusal_rate
        + 0.3 * (1.0 - false_refusal_rate)
        + 0.2 * min_family_rate
    )
```

The fitness function has three components:

1. **Overall refusal rate (50%):** The primary objective. Higher is better.
2. **Helpfulness preservation (30%):** Penalizes over-refusal on benign queries. A defense that refuses everything is useless.
3. **Worst-case family performance (20%):** The min-over-families term prevents waterbed optimization where one family's ASR drops to zero while another rises.

The min-family term is the key innovation. Without it, evolution converges to prompts that are strong against common attacks but catastrophically weak against rare ones.

### 2.4 Selection and Breeding

Population management follows a (mu + lambda) evolutionary strategy:

- **Population size (mu):** 20 defense genomes
- **Offspring per generation (lambda):** 10 mutants
- **Selection:** Tournament selection (k=3) with fitness-proportional weighting
- **Elitism:** Top 2 genomes always survive to next generation
- **Diversity pressure:** Penalize genomes that are textually similar (Jaccard similarity > 0.8) to prevent convergence to a single local optimum

### 2.5 Evaluation Budget

Each generation requires evaluating lambda genomes against the attack corpus:

- **Attack corpus size:** 100 scenarios (sampled stratified across families)
- **Benign corpus size:** 20 queries (false-refusal check)
- **Per-genome evaluations:** 120 API calls
- **Per-generation evaluations:** 10 x 120 = 1,200 API calls
- **FLIP grading:** 1,200 grading calls (if LLM-graded)
- **Total per generation:** 2,400 API calls
- **At free tier (OpenRouter):** Feasible at ~30 minutes per generation with rate limiting
- **At paid tier:** ~$0.50 per generation (Claude Haiku grading)
- **50-generation run:** ~$25, approximately 25 hours

---

## 3. The Fitness Landscape Problem

### 3.1 Why Defense Fitness Landscapes Are Rugged

The attack evolver operates on a relatively smooth fitness landscape: small mutations to a successful attack tend to produce other successful attacks (Report #184: 97.5% keep rate). This is because models have broad vulnerability regions — once you find an attack surface, nearby variations usually work too.

Defense fitness landscapes are rugged for three reasons:

**Cliff edges.** A single word change can catastrophically alter defense behavior. Changing "never provide" to "avoid providing" shifts from hard refusal to soft hedging, potentially flipping dozens of attack outcomes simultaneously. The fitness function has discontinuities.

**Interaction effects.** Defense components interact non-linearly. A role statement ("You are a safety assistant") may be sufficient alone, but adding a format constraint ("Respond only in JSON") can inadvertently create a format_lock vulnerability. The combined effect of two defense components is not predictable from their individual effects.

**Dimension curse.** With 36 attack families, the defense genome must simultaneously satisfy 36+ constraints. Each constraint restricts the viable region of prompt space. The intersection of 36 viable regions may be vanishingly small or empty.

### 3.2 Local Optima and Escape Strategies

Standard evolutionary algorithms get trapped in local optima on rugged landscapes. Three escape strategies are particularly relevant:

1. **Niching:** Maintain subpopulations specialized against different attack families, then periodically combine them. This decomposes the 36-dimensional problem into 36 one-dimensional problems.

2. **Novelty search:** Instead of optimizing fitness directly, reward genomes that are structurally different from existing population members (Lehman & Stanley, 2011). This explores the fitness landscape more broadly before exploiting any single peak.

3. **Memetic algorithms:** Combine evolutionary search (global exploration) with local optimization (gradient-free prompt optimization like APE). Each generation, the best genomes undergo a short local refinement step.

---

## 4. Why Defense Is Harder Than Attack

### 4.1 Formal Asymmetry Analysis

Consider a system with k attack classes. Define:
- p_i = probability that defense d blocks attack class i
- q_i = probability that attack a bypasses defense for class i

**Attack success probability:**
```
P(attack succeeds) = 1 - prod(1 - q_i for i in 1..k)
```
For the attacker to succeed, they need at least one q_i to be non-negligible. If any single q_i = 0.5, then P(attack succeeds) >= 0.5 regardless of all other classes.

**Defense success probability:**
```
P(defense holds) = prod(p_i for i in 1..k)
```
For the defender to succeed, ALL p_i must be high. If k = 36 and each p_i = 0.95, then P(defense holds) = 0.95^36 = 0.16. To achieve P(defense holds) >= 0.90, each p_i must exceed 0.997.

This is the mathematical formalization of why defense is exponentially harder than attack as the number of attack classes grows.

### 4.2 Information Asymmetry

The attacker has structural advantages in information access:

| Dimension | Attacker | Defender |
|-----------|----------|----------|
| Search space | Find any single hole | Seal all holes |
| Feedback | Binary (bypass or not) | Multi-class (which attacks succeed where) |
| Novelty | Can invent new attack classes | Must anticipate unknown classes |
| Cost of failure | Low (try again) | High (one bypass = system compromised) |
| Evaluation cost | Test one attack | Test against full corpus |
| Transferability | One attack may transfer across models | One defense may not transfer across models |

### 4.3 The Linus's Law Inversion

In open-source software security, Linus's Law states "given enough eyeballs, all bugs are shallow." The adversarial AI analog inverts this:

**Given enough mutation operators, all defenses are shallow.**

The attack evolver's `combine` operator (100% keep rate, Report #184) produces hybrid attacks that no single defense guard anticipates. As the attack population grows, the probability that some combination bypasses any fixed defense approaches 1.

This is why static defense optimization is insufficient — it is the co-evolutionary dynamic that matters.

---

## 5. Co-Evolutionary Architecture

### 5.1 Why Co-Evolution?

Static defense evolution optimizes against a fixed attack corpus. This produces defenses that are strong against known attacks but brittle against novel ones — the prompt-level equivalent of teaching to the test.

Co-evolution solves this by evolving attack and defense populations simultaneously. As defenses improve, attacks must evolve to overcome them, and vice versa. Neither population can over-specialize because its adversary keeps changing.

### 5.2 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  CO-EVOLUTIONARY LOOP                     │
│                                                           │
│  ┌───────────────┐         ┌───────────────┐             │
│  │   ATTACK       │         │   DEFENSE      │             │
│  │   POPULATION   │         │   POPULATION   │             │
│  │   (20 genomes) │◄───────►│   (20 genomes) │             │
│  └───────┬───────┘         └───────┬───────┘             │
│          │                         │                      │
│          ▼                         ▼                      │
│  ┌───────────────┐         ┌───────────────┐             │
│  │   ATTACK       │         │   DEFENSE      │             │
│  │   MUTATOR      │         │   MUTATOR      │             │
│  │   (7 operators)│         │   (8 operators)│             │
│  └───────┬───────┘         └───────┬───────┘             │
│          │                         │                      │
│          ▼                         ▼                      │
│  ┌─────────────────────────────────────────┐             │
│  │           EVALUATION ARENA               │             │
│  │                                           │             │
│  │  For each (attack_i, defense_j):         │             │
│  │    1. Set defense_j as system prompt      │             │
│  │    2. Send attack_i as user message       │             │
│  │    3. FLIP-grade response                 │             │
│  │    4. Update fitness for both             │             │
│  └─────────────────────────────────────────┘             │
│          │                         │                      │
│          ▼                         ▼                      │
│  ┌───────────────┐         ┌───────────────┐             │
│  │   ATTACK       │         │   DEFENSE      │             │
│  │   SELECTION    │         │   SELECTION    │             │
│  │   (keep best   │         │   (keep best   │             │
│  │    bypassers)  │         │    blockers)   │             │
│  └───────────────┘         └───────────────┘             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 5.3 The Evaluation Arena

The arena is a pairwise evaluation matrix:

```
              Defense_1  Defense_2  ...  Defense_20
Attack_1      [R/C]      [R/C]     ...  [R/C]
Attack_2      [R/C]      [R/C]     ...  [R/C]
...
Attack_20     [R/C]      [R/C]     ...  [R/C]
```

Each cell contains a FLIP verdict (R = REFUSAL, C = COMPLIANCE/PARTIAL). This matrix provides:

- **Attack fitness:** Proportion of defenses bypassed (column-wise mean of C)
- **Defense fitness:** Proportion of attacks blocked (row-wise mean of R), penalized by false refusal rate

The full 20x20 matrix requires 400 evaluations + 400 FLIP gradings = 800 API calls per generation. At free tier, this is approximately 15 minutes per generation.

### 5.4 Arms Race Dynamics

Co-evolutionary systems exhibit characteristic dynamics (Rosin & Belew, 1997):

1. **Red Queen effect:** Both populations must continuously evolve just to maintain fitness relative to the other. A defense that stops evolving will be overcome by attacks within a few generations.

2. **Cycling:** Populations may cycle through strategies — attacks evolve to bypass defense A, defenses evolve to block those attacks (becoming defense B), attacks evolve to bypass B, and the cycle repeats. This cycling is a feature, not a bug: it forces both populations to maintain breadth.

3. **Escalation:** Over many generations, both populations become more sophisticated. Attacks become more structurally complex; defenses become more nuanced. The average quality of both populations increases monotonically even as relative fitness oscillates.

4. **Speciation:** Subpopulations may emerge that specialize against specific adversaries. Attack specialists that bypass format-lock defenses coexist with generalists. This mirrors biological predator-prey co-evolution.

### 5.5 Preventing Degenerate Dynamics

Two failure modes must be prevented:

**Collapse:** Both populations converge to trivial strategies (attacks become maximally explicit; defenses become "refuse everything"). Prevented by the helpfulness penalty in defense fitness and the structural mutation constraints in attack evolution.

**Mediocre convergence:** Both populations find a stable equilibrium at mediocre quality, with no pressure to improve. Prevented by periodically injecting "immigrants" from external sources — new seed attacks from the jailbreak corpus and new defense patterns from published safety research.

---

## 6. Connection to Biological Immune Systems

### 6.1 The Adaptive Immunity Metaphor

The co-evolutionary defense evolver mirrors the vertebrate adaptive immune system in several structural ways:

| Immune System | Defense Evolver |
|---------------|-----------------|
| Antigen (pathogen fragment) | Attack prompt |
| Antibody (receptor protein) | System prompt guard clause |
| B cell (antibody producer) | Defense genome |
| Clonal selection (expand cells that bind antigen) | Tournament selection (expand defenses that block attacks) |
| Somatic hypermutation (random mutations in antibody genes) | Defense mutation operators |
| Affinity maturation (iterative improvement) | Generational fitness increase |
| Memory B cells (rapid response to known pathogens) | Immunize operator (transplant successful refusal patterns) |
| Naive repertoire (diverse pre-immune antibodies) | Initial population diversity |
| MHC presentation (display fragments for T cell inspection) | FLIP grading (classify response for fitness evaluation) |

### 6.2 What the Immune System Gets Right

Three features of adaptive immunity are directly applicable:

**Diversity generation.** The immune system generates 10^11 distinct antibody variants through V(D)J recombination — random assembly of gene segments. The defense evolver should similarly maintain a large, diverse initial population generated through combinatorial assembly of defense components.

**Negative selection.** T cells that react to self-antigens are eliminated in the thymus. The defense evolver should eliminate genomes that cause false refusals on benign queries — the "autoimmune" failure mode where the defense attacks legitimate use.

**Immune memory.** After encountering a pathogen, the immune system retains memory cells for rapid future response. The defense evolver should maintain an archive of successful defense patterns indexed by the attack class they counter, enabling rapid `immunize` mutations when similar attacks reappear.

### 6.3 What the Immune System Gets Wrong (for Our Purposes)

The metaphor has limits:

**Autoimmune disease = over-refusal.** Immune systems sometimes attack the body itself. Defense genomes that are too aggressive will refuse benign queries. The false-refusal penalty in the fitness function is our analog of central tolerance, but it may not be sufficient. Real immune systems have multiple tolerance mechanisms; we may need multiple helpfulness checks.

**Immune evasion = adversarial robustness.** Pathogens evolve to evade immune detection. In our system, this is exactly what the attack population does. The difference: biological immune evasion takes years; prompt-level attack evasion takes generations (minutes). The defense population must adapt faster than biology requires.

**Allergic response = format rigidity.** Immune systems sometimes overreact to harmless stimuli. Defense prompts may develop excessive format restrictions that degrade user experience without improving safety. This is already observed in production systems where safety tuning reduces model capability.

---

## 7. Implementation Roadmap

### 7.1 Phase 0: Proof of Concept (1 session)

- Implement `tools/autoresearch/evolve_defenses.py` mirroring `evolve_attacks.py` structure
- Single-population defense evolution against fixed attack corpus (100 attacks)
- 8 defense mutation operators
- FLIP grading via OpenRouter
- 20 generations, population size 10
- Output: defense lineage JSONL + fitness progression chart

### 7.2 Phase 1: Co-Evolution (2-3 sessions)

- Implement `tools/autoresearch/coevolve.py` with dual populations
- 20x20 evaluation arena
- Arms race dynamics tracking (fitness over time for both populations)
- Cycling detection (measure population diversity per generation)
- Immigration from external corpus every 10 generations

### 7.3 Phase 2: Analysis (1-2 sessions)

- Characterize the evolved defense landscape
- Compare evolved defenses against hand-crafted system prompts
- Test transferability: do defenses evolved on Model A work on Model B?
- Measure the Red Queen effect: how many generations before a static defense is overcome?
- Publish findings as Report #215+

### 7.4 Phase 3: Production (future)

- Integrate best-evolved defenses into benchmark system prompt templates
- Automated defense refresh: run co-evolution weekly, deploy updated system prompts
- Per-model defense optimization: evolve model-specific system prompts
- Multi-model co-evolution: evolve defenses that work across model families

### 7.5 Estimated Costs

| Phase | API Calls | Cost (free tier) | Cost (paid tier) | Time |
|-------|-----------|-------------------|-------------------|------|
| Phase 0 | ~24,000 | $0 (slow) | ~$12 | 8-12 hours |
| Phase 1 | ~80,000 | $0 (very slow) | ~$40 | 24-48 hours |
| Phase 2 | ~40,000 | $0 | ~$20 | 12-24 hours |
| **Total** | **~144,000** | **$0** | **~$72** | **2-4 days** |

---

## 8. Open Questions

1. **Does defense evolution converge?** Attack evolution on permissive models shows a flat fitness landscape (97.5% keep rate, Report #184). Will defense evolution show the opposite — a rugged landscape where most mutations are discarded?

2. **What is the minimal viable defense?** Is there a short system prompt (~50 tokens) that achieves > 90% refusal rate, or does effective defense require long, detailed prompts? Evolution should discover the Pareto frontier of defense length vs. effectiveness.

3. **Do evolved defenses transfer across models?** If a defense evolved on Llama-3.3-70B also works on Mistral Small 3.1, this suggests universal defense principles. If not, it suggests model-specific vulnerability surfaces that require per-model optimization.

4. **Is co-evolution stable?** Arms races can diverge, cycle, or converge. Which dynamic dominates in practice? Cycling would suggest no stable defense exists; convergence would suggest one does.

5. **Can evolved defenses be reverse-engineered?** If the evolver discovers effective defense patterns, can we extract interpretable principles from the evolved prompts? This would be more valuable than the prompts themselves.

6. **What is the relationship to RLHF-trained safety?** System prompt defenses operate at inference time; RLHF safety operates at training time. Do they compose multiplicatively, additively, or sub-additively? Our data suggests sub-additively (Report #184: provider signature dominates architecture), but this has not been tested for evolved defenses.

---

## 9. Related Work

### 9.1 Prompt Optimization

- **APE (Automatic Prompt Engineer, Zhou et al., 2022):** Optimizes prompts for task performance. Does not consider adversarial robustness.
- **OPRO (Yang et al., 2023):** Uses LLMs to optimize prompts iteratively. Single-objective optimization without adversarial evaluation.
- **DSPy (Khattab et al., 2023):** Programmatic prompt optimization. Composable but not adversarial.
- **PromptBreeder (Fernando et al., 2023):** Evolutionary prompt optimization. Closest to our approach but optimizes for task accuracy, not adversarial robustness.

### 9.2 Adversarial Robustness

- **GCG (Zou et al., 2023):** Gradient-based adversarial suffix optimization. Attack-only; no defense evolution.
- **AutoDAN (Liu et al., 2023):** Hierarchical genetic algorithm for jailbreak generation. Attack-only.
- **PAIR (Chao et al., 2023):** LLM-based iterative attack refinement. Attack-only.
- **TAP (Mehrotra et al., 2023):** Tree-of-thought attack planning. Attack-only.

### 9.3 Co-Evolution in Security

- **AEGIS (Wang et al., 2024):** Co-evolutionary fuzzing for software security. Structural precedent but operates on program inputs, not natural language.
- **Competitive co-evolution in game playing (Rosin & Belew, 1997):** Foundational work on co-evolutionary dynamics. Our arena evaluation mirrors their competitive fitness evaluation.

**Gap: No published work applies co-evolutionary optimization to LLM system prompt defense.** This is the novel contribution.

---

## 10. Conclusion

The attack evolver demonstrated that evolutionary optimization is a viable approach to jailbreak discovery. This report establishes the theoretical foundation for the inverse problem — evolutionary defense optimization — and identifies why it is fundamentally harder.

The key insight is that static defense evolution will inevitably produce brittle, over-fitted system prompts. Only co-evolutionary dynamics, where attack and defense populations compete, can produce robust defenses that generalize to novel attacks. The biological immune system provides both a metaphor and specific architectural patterns (clonal selection, somatic hypermutation, immune memory, negative selection) that map directly to defense evolver components.

The proposed architecture is implementable with existing F41LUR3-F1R57 infrastructure at minimal cost (~$72 for a full co-evolutionary run at paid tier, $0 at free tier). The proof-of-concept design is documented in `tools/defense_evolver_design.md`.

This is, to our knowledge, the first proposal for co-evolutionary attack/defense prompt optimization for LLM safety. If the dynamics produce interpretable defense principles — not just opaque optimized prompts — this could contribute meaningfully to the field's understanding of what makes LLM defenses robust.

⦑F41LUR3-F1R57|REPORT-214|AUTOMATED-DEFENSE-GENERATION⦒
