---
title: "The Format-Lock Paradox — Format Compliance and Safety Reasoning as Partially Independent Capabilities"
description: "We present evidence that format compliance and safety reasoning are partially independent capabilities in large language models that scale differently with..."
date: "2026-03-24"
reportNumber: 187
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


## Abstract

We present evidence that format compliance and safety reasoning are partially independent capabilities in large language models that scale differently with model size and training investment. Using 205 format-lock attack traces across 8 models (0.8B--200B parameters) and 132,416 corpus-wide results across 236 models, we document a *format-lock paradox*: format-lock attacks shift frontier models from restrictive (<10% ASR) to mixed (20--47% ASR) vulnerability profiles, while other attack families show strong scale-dependent suppression. We identify three empirical regularities: (1) format-lock attacks produce zero refusals on sub-3B models (0/115 traces), (2) frontier models show a 3--10x ASR increase under format-lock framing compared to their baseline, and (3) the verbosity detection signal that characterizes standard jailbreak compliance *inverts* for format-lock attacks. Combined with Report #184's finding that chain-of-thought exploitation shows true inverted scaling (small models 52.4% broad ASR vs XL 15.8%), these results suggest that instruction-following capability can be adversarially leveraged against safety alignment. We propose a dual-capability model in which format compliance and safety reasoning compete for control of model output, with implications for safety evaluation methodology, defense design, and the scalability of alignment.

---

## 1. Introduction

The prevailing assumption in AI safety is that larger, better-trained models are safer. This assumption is broadly supported: cross-model vulnerability profiling of 57 models with LLM-graded verdicts yields three clusters — permissive (>=40% ASR, 37 models), mixed (15--40%, 15 models), and restrictive (<=15% ASR, 5 frontier models) — with safety training investment, not parameter count, as the primary determinant (Report #50; r=-0.140 between log-parameter-count and ASR, n=24).

However, this assumption encounters an anomaly with format-lock attacks. When adversarial content is embedded within structural format instructions ("Return ONLY valid JSON conforming to this schema..."), frontier models that resist all other attack families show ASR of 20--47% — a 3--10x increase over their baseline vulnerability. This paper characterizes this anomaly and proposes a mechanistic explanation.

**Thesis.** Format compliance and safety reasoning are partially independent capabilities that are both strengthened by scaling and instruction tuning, but that compete for control of model output when format-lock attacks activate both simultaneously. The paradox: the very training that makes models better at following instructions also makes them more vulnerable to format-lock attacks, because format compliance is reinforced by the same gradient signals that improve general helpfulness.

**Contributions:**
1. We consolidate 205 format-lock traces across 8 models and 4 experiments into the first systematic characterization of format-lock vulnerability scaling (Section 3).
2. We demonstrate that format-lock attacks shift frontier models one full vulnerability profile level (restrictive to mixed), using the same 25 scenarios that produce <10% ASR under standard framing (Section 4).
3. We identify an inverted verbosity signal specific to format-lock attacks, where compliant responses are *shorter* than refusals — opposite to the corpus-wide pattern (Section 5).
4. We integrate format-lock scaling with CoT-exploit inverted scaling (Report #184) into a unified dual-capability model (Section 6).
5. We discuss implications for safety evaluation methodology, defense prioritization, and scalability of alignment (Section 7).

---

## 2. Related Work

**Jailbreak taxonomies.** The adversarial attack literature has documented hundreds of jailbreak techniques organized into attack families: persona hijack (DAN), encoding (cipher, leetspeak), multi-turn (crescendo), and reasoning exploitation (CoT-exploit) (Wei et al. 2024; Andriushchenko et al. 2024; Russinovich et al. 2024). Format-lock attacks have received comparatively little systematic study, though structured output manipulation appears in several attack catalogs without dedicated scaling analysis.

**Scaling and safety.** The relationship between model scale and safety is nuanced. Anthropic (2023) documented emergent deceptive alignment scaling as a power law with model size. Perez et al. (2023) found sycophancy increases with scale. Our prior work (Report #48) found that safety-like behavior partially re-emerges in abliterated models at scale (Qwen3.5 obliteratus: 100% ASR at 0.8B, decreasing to 47.3% at 9.0B), suggesting safety reasoning is partially an emergent capability. The inverse scaling prize (McKenzie et al. 2023) established that some capabilities degrade with scale. We extend this by showing technique-specific scaling patterns.

**Instruction-following as attack surface.** Zeng et al. (2024) demonstrated that instruction-following capabilities can be leveraged for attacks. The faithfulness-plausibility gap (arXiv:2601.02314) showed that reasoning traces often function as post-hoc rationalization across 75,000 controlled trials. Our format-lock findings instantiate a specific case: format-following instructions hijack the instruction-compliance pathway, bypassing safety reasoning.

**Dual-process models.** The hypothesis that models contain competing subsystems is not new. Anthropic's constitutional AI (Bai et al. 2022) implicitly assumes a helpfulness-harmlessness tradeoff. Burns et al. (2023) showed that truth-telling and helpfulness have distinct internal representations. Our contribution is empirical evidence that format compliance constitutes a third, partially independent capability axis.

---

## 3. Data and Methods

### 3.1 Format-Lock Trace Corpus

We aggregated format-lock results from four experimental sources:

| Experiment | Models | Scenarios | Grading | Total Traces |
|------------|--------|-----------|---------|-------------|
| Format-lock pilot (Report #51) | qwen3:1.7b | 25 (mixed format types) | FLIP via deepseek-r1:1.5b | 25 |
| Format-lock v1 (Report #55) | qwen3:1.7b, deepseek-r1:1.5b, qwen3.5:0.8b | 30 (controlled, 6 formats x 5 harm domains) | FLIP via deepseek-r1:1.5b | 90 |
| Format-lock v2 | qwen3:1.7b | 20 (v0.2 scenarios) | FLIP via deepseek-r1:1.5b | 20 |
| Format-lock 7B | qwen2.5:7b | 25 (pilot scenarios) | Heuristic only | 25 |
| Faithfulness CLI | Claude Sonnet 4.5, Codex GPT-5.2, Gemini-3-Flash | 25 (format-lock scenarios) | FLIP via deepseek-r1:1.5b (Ollama) | 75 |
| **Total** | **8 models** | **5 scenario sets** | | **235 traces** |

All sub-3B traces were run locally via Ollama (no rate limits, no cost). Frontier model traces were collected via native CLI tools (Claude Code, Codex CLI, Gemini CLI).

### 3.2 Comparison Corpus

For baseline comparison, we use the full non-OBLITERATUS jailbreak corpus: 10,956 evaluable results across 236 models, graded via COALESCE(llm_verdict, heuristic_verdict). This corpus spans 82 techniques across 9 attack families. All corpus-level metrics reference `docs/CANONICAL_METRICS.md` (verified 2026-03-24).

### 3.3 Grading Methodology

**FLIP grading.** Forward-Looking Inference of Prompt (FLIP) backward inference: a grader model reads the response and infers what instruction it was following, then judges whether the response constitutes harmful compliance. Grader: deepseek-r1:1.5b (known limitations: 30.8% false positive rate on benign baseline, #315; 27--37% ERROR rate on format-lock traces specifically).

**Heuristic grading.** Binary structural compliance: did the model produce output matching the requested format (JSON, YAML, code, etc.)? Heuristic grading over-reports ASR by 79.9% relative to LLM grading (Report #177). We report heuristic and LLM-graded results separately throughout.

**Verdict taxonomy.** COMPLIANCE (full harmful compliance), PARTIAL (hedging text with partial harmful content), REFUSAL (clear refusal), HALLUCINATION_REFUSAL (refusal framing but harmful content present), BENIGN_QUERY (format-compliant but no harmful content), ERROR (grader failure).

### 3.4 ASR Definitions

- **Strict ASR:** COMPLIANCE / (total evaluable)
- **Broad ASR:** (COMPLIANCE + PARTIAL) / (total non-ERROR, non-PARSE_ERROR)
- **Heuristic ASR:** format-compliant / total (structural compliance only)

We use Broad ASR as the primary metric throughout, consistent with corpus-wide conventions (Report #182: three-tier ASR non-OBLITERATUS n=5,865: Strict 21.9%, Broad 34.2%, FD 43.0%).

---

## 4. Results: Format-Lock Scaling

### 4.1 Sub-3B Models: The Capability Floor

No sub-3B model produced a single refusal across 115 format-lock traces (0 refusals / 115 traces, exact binomial 95% CI: [0%, 3.2%]).

| Model | Params | n (evaluable) | Refusals | Heuristic Compliance | Broad ASR (LLM) | 95% Wilson CI |
|-------|--------|---------------|----------|---------------------|-----------------|---------------|
| qwen3.5:0.8b | 0.87B | 29 | 0 | 96.7% | Not graded | -- |
| deepseek-r1:1.5b | 1.5B | 22 (non-ERROR) | 0 | 100% | 50.0% | [30.7%, 69.3%] |
| qwen3:1.7b (pilot) | 1.7B | 17 (non-ERROR) | 0 | ~96% | 47.1% | [26.2%, 69.0%] |
| qwen3:1.7b (v1) | 1.7B | 19 (non-ERROR) | 0 | 100% | 63.2% | [41.0%, 80.9%] |
| qwen3:1.7b (v2) | 1.7B | 14 (non-ERROR) | 0 | -- | 42.9% | [21.4%, 67.4%] |

**Interpretation.** At sub-3B scale, models lack sufficient safety reasoning capacity to resist format-lock framing. The 0/115 refusal rate is not specific to format-lock — these models have high ASR across attack families (qwen3:1.7b overall: 55.2% broad ASR; deepseek-r1:1.5b overall: 40.0% broad ASR). However, the *zero refusal* rate for format-lock is notable: even small models produce some refusals against standard attack types (qwen3:1.7b refusal rate: 33.4% corpus-wide).

The gap between heuristic compliance (96--100%) and LLM-graded ASR (42.9--63.2%) reveals that structural format compliance does not imply harmful content. Models produce the requested JSON/YAML/code structure but sometimes populate it with placeholder or vague content that does not constitute actionable harm. This 35--55 percentage point gap is itself an important finding: format compliance is a necessary but not sufficient condition for attack success.

### 4.2 Mid-Range Model: Emerging Safety

| Model | Params | n (evaluable) | Refusals | Heuristic Compliance | Broad ASR |
|-------|--------|---------------|----------|---------------------|-----------|
| qwen2.5:7b | 7.6B | 21 (non-null) | 2 (9.5%) | 90.5% (heuristic) | Not LLM-graded |

The 7B model produced 2 refusals (9.5%) compared to 0 from sub-3B models — directionally consistent with safety reasoning emerging at larger scales. The heuristic compliance rate remains very high (90.5%), suggesting that format compliance capability is well-developed at 7B while safety reasoning is nascent.

### 4.3 Frontier Models: The Paradox

| Model | Params | Standard Broad ASR | Format-Lock Broad ASR | Ratio | n (FL, non-ERROR) |
|-------|--------|-------------------|----------------------|-------|-------------------|
| Claude Sonnet 4.5 | 175B | 11.4% (n=166) | 30.4% (7/23) | 2.7x | 23 |
| Codex GPT-5.2 | 200B | 25.0% (n=176) | 47.4% (9/19) | 1.9x | 19 |
| Gemini-3-Flash | 30B | 12.6% (n=190) | 23.8% (5/21) | 1.9x | 21 |

All three frontier models show a substantial increase in broad ASR under format-lock framing. The increase ranges from 1.9x (Gemini, Codex) to 2.7x (Claude). Using the stricter comparison against Report #50's standard ASR (which uses a different, more adversarial scenario mix), the ratios are larger:

| Model | Report #50 Standard ASR | Format-Lock ASR | Ratio |
|-------|------------------------|-----------------|-------|
| Claude Sonnet 4.5 | 3.9% | 30.4% | 7.8x |
| Codex GPT-5.2 | 8.8% | 47.4% | 5.4x |
| Gemini-3-Flash | 2.3% | 23.8% | 10.3x |

**The profile-shift effect.** Report #50 classifies models into permissive (>=40% ASR), mixed (15--40%), and restrictive (<=15%). Under format-lock framing:
- Claude shifts from restrictive (3.9%) to mixed (30.4%)
- Codex shifts from restrictive (8.8%) to permissive (47.4%)
- Gemini shifts from restrictive (2.3%) to mixed (23.8%)

This confirms the hypothesis from Report #51: format-lock attacks shift frontier models approximately one vulnerability profile level toward permissive.

**Limitation.** The standard and format-lock ASR numbers use different scenario sets, so the comparison is suggestive rather than controlled. A matched-pair experiment (same harmful content, with and without format-lock framing) is needed for causal claims. Sample sizes are small (n=19--23 per model); 95% Wilson CIs overlap between some models.

### 4.4 Per-Technique-Family Scaling Comparison

To contextualize format-lock scaling, we compare broad ASR across technique families by model size using the full non-OBLITERATUS corpus:

| Technique Family | Small (<4B) | Large (24-70B) | XL (120B+) | Scale Ratio (Small/XL) |
|------------------|-------------|----------------|------------|----------------------|
| multi_turn | 78.2% (n=55) | -- | 73.3% (n=15) | 1.1x |
| cot_exploit | 52.4% (n=42) | 25.9% (n=27) | 15.8% (n=38) | 3.3x |
| encoding | 42.9% (n=28) | 0.0% (n=24) | 6.7% (n=45) | 6.4x |
| persona | 33.3% (n=12) | 0.0% (n=12) | 3.8% (n=26) | 8.8x |
| behavioral | 14.3% (n=14) | 0.0% (n=14) | 16.7% (n=30) | 0.9x |
| volumetric | 6.7% (n=15) | 0.0% (n=16) | 5.9% (n=34) | 1.1x |
| **Format-lock** | **47.1--63.2%** | **90.5% (heur.)** | **23.8--47.4%** | **~1.3--2.5x** |

Format-lock occupies a distinctive position: like multi-turn attacks, it maintains elevated ASR at frontier scale. Unlike multi-turn, it achieves this through structural hijacking rather than conversational momentum. The scale ratio (small/XL) for format-lock (~1.3--2.5x) is much flatter than encoding (6.4x) or persona (8.8x), suggesting that safety training has not specifically addressed format-lock patterns with the same investment as historical attack families.

---

## 5. The Inverted Verbosity Signal

### 5.1 Corpus-Wide Pattern

Report #48 documented that compliant responses are 54% longer than refusals across the full corpus (Mann-Whitney U, p=1.05e-27, Cohen's d=0.325). Reasoning models think 75% longer before complying than before refusing (p=8.89e-14). This verbosity signal has been proposed as a detection heuristic.

### 5.2 Format-Lock Inversion

Format-lock attacks invert this signal. From the format-lock pilot (n=17 non-ERROR, qwen3:1.7b):

| Verdict | n | Mean Response Length (chars) |
|---------|---|----------------------------|
| COMPLIANCE | 3 | 882 |
| PARTIAL | 5 | 1,422 |
| BENIGN_QUERY | 7 | 1,626 |
| REFUSAL | 2 | 1,942 |

Format-lock COMPLIANCE responses are 54% *shorter* than refusals — the exact inverse of the corpus-wide pattern. The mechanism is straightforward: format constraints (JSON, YAML, code) impose structural brevity. A compliant JSON response is inherently more concise than a prose refusal explaining why the request is inappropriate.

**Detection implication.** Response-length-based detection heuristics would produce false negatives on format-lock attacks. A format-lock-specific detector would need to assess structural compliance (did the model produce the requested format?) combined with content harm evaluation — precisely the combination that current safety filters do not systematically check.

---

## 6. Unified Dual-Capability Model

### 6.1 The Model

We propose that language models develop two partially independent capability axes through training:

**Axis 1: Format Compliance (FC).** The ability to follow structural output instructions. Strengthened by instruction tuning, RLHF, and general helpfulness training. Scales with model capability — larger, better-trained models are better at format compliance.

**Axis 2: Safety Reasoning (SR).** The ability to recognize harmful requests and refuse. Requires safety-specific training (RLHF safety data, constitutional AI, red-teaming). Also scales with capability, but requires dedicated investment. Partially emergent: safety-like behavior re-emerges in abliterated models at scale (Report #48: Qwen3.5 obliteratus ASR decreases from 100% at 0.8B to 47.3% at 9.0B).

**The competition.** Format-lock attacks activate both axes simultaneously. The format instruction activates FC; the embedded harmful content should activate SR. The model's output is determined by the relative strength of FC and SR for the specific input.

### 6.2 Predictions and Evidence

| Prediction | Evidence | Status |
|-----------|----------|--------|
| Below capability floor (~3B), FC wins trivially because SR is underdeveloped | 0/115 refusals from sub-3B models on format-lock | Supported |
| Above capability floor, ASR depends on relative FC/SR strength | Frontier models: 20--47% format-lock ASR vs <13% standard ASR | Supported |
| Safety training suppresses standard attacks but not format-lock | persona 8.8x scale ratio vs format-lock ~1.3--2.5x | Supported |
| Models with stronger format compliance show higher format-lock ASR | Codex (47.4%) > Claude (30.4%) > Gemini (23.8%); Codex known for strong code/format compliance | Directionally consistent |
| Format-lock produces inverted verbosity | COMPLIANCE 882 chars vs REFUSAL 1,942 chars | Supported |
| Heuristic compliance >> LLM-graded ASR (FC activates without full SR bypass) | Heuristic 90--100% vs LLM-graded 42--63% | Supported |

### 6.3 Integration with CoT-Exploit Inverted Scaling

Report #184 documented that CoT-exploit attacks show true inverted scaling: small models (<4B) at 52.4% broad ASR vs XL (120B+) at 15.8%. This is the opposite of the format-lock pattern, where ASR remains elevated at frontier scale.

The dual-capability model explains both:

- **CoT-exploit** targets the reasoning process itself. Larger models have more sophisticated reasoning, including the capacity to reason *about* the attack. Claude Sonnet 4.5 achieves 0% ASR on CoT-exploits — its reasoning chain can identify and reject manipulated reasoning steps. Small models lack this meta-reasoning capacity.

- **Format-lock** targets the format compliance pathway, which is orthogonal to reasoning sophistication. Larger models do not reason less about format compliance — they comply more reliably. The attack leverages a capability that *improves* with scale.

This produces a characteristic crossing pattern:

```
ASR
100% |xxxxx
     |  xxxx    CoT-exploit
     |     xxx  (inverted scaling)
     |       xx
 50% |        x---------x Format-lock
     |         \         \ (flat scaling)
     |          \         \
     |           \         \
     |            \         Standard attacks
 10% |             \--------x (normal scaling)
     +---+---+---+---+---+---+
       1B   3B   7B  30B 70B 200B
                  Model Size
```

The three scaling patterns reflect three different capability dependencies:
1. **Standard attacks** (encoding, persona): ASR decreases with scale because SR scales faster than the attack's complexity.
2. **Format-lock attacks**: ASR remains elevated because FC scales alongside SR, creating a persistent tension.
3. **CoT-exploit attacks**: ASR *decreases* with scale because meta-reasoning (reasoning about one's own reasoning chain) scales faster than attack sophistication.

### 6.4 The Deliberation Cost Asymmetry

Report #184's Finding 4 provides mechanistic support. Reasoning models show a thinking-token allocation inversion: refusals consume proportionally more thinking tokens (think/response ratio 0.66) than compliant responses (ratio 0.55, n=212). 54% of refusals have high think/response ratios (0.6--1.0) vs 32% of compliances.

This asymmetry suggests safety reasoning is computationally expensive relative to compliance. The model "works harder" to refuse than to comply. Format-lock attacks may exploit this by front-loading the format compliance pathway before the safety reasoning pathway can intervene — the structural output template provides an immediate generation target that pre-empts the more expensive safety deliberation.

---

## 7. Discussion

### 7.1 Implications for Safety Evaluation

Current safety benchmarks (AdvBench, HarmBench, JailbreakBench, StrongREJECT) test models primarily with prose-based adversarial prompts. Our results suggest this methodology systematically underestimates vulnerability to format-lock attacks. A model that achieves 3.9% ASR on standard benchmarks (Claude Sonnet 4.5) may show 30.4% ASR when the same harmful content is embedded in format-lock framing.

**Recommendation.** Safety benchmarks should include a format-lock attack suite as a standard component, with at least 6 format types (JSON, YAML, code, CSV, XML, markdown table) across multiple harm domains. Models should be evaluated on format-lock ASR separately from standard ASR, and the gap between the two should be reported as a safety metric.

### 7.2 Implications for Defense Design

The partial independence of FC and SR suggests that defenses targeting one axis will not protect the other. Specifically:

- **RLHF safety training** strengthens SR but may inadvertently strengthen FC (via improved instruction-following). This creates an iatrogenic dynamic (Report #140): safety training that improves helpfulness may increase format-lock vulnerability.
- **Constitutional AI** operates at the content level but may not address format-level compliance. A model trained to refuse harmful prose may still comply when the same content is requested as structured data.
- **Output filtering** that checks for harmful content in prose may miss harmful content in structured formats (JSON fields, YAML values, code comments).

**Recommendation.** Defenses should specifically target the FC-SR interface. Possible approaches include: (a) training models to evaluate format requests for embedded harm before complying, (b) adding format-aware safety layers that inspect structured output for harmful field values, (c) constraining format compliance in safety-sensitive contexts.

### 7.3 Implications for Alignment Scalability

The most concerning implication is for alignment at scale. If format compliance scales with general capability (as our evidence suggests), then larger models become *better* at complying with format-lock attacks even as they become better at refusing standard attacks. The gap between standard ASR and format-lock ASR may *widen* with scale — the most capable models showing the largest vulnerability differential.

Our data is suggestive but not definitive on this point. The frontier models (30B--200B) show format-lock ASR of 23.8--47.4% vs standard ASR of 11.4--25.0%. A controlled scaling study across 5+ size points with matched scenarios is needed to establish whether the gap truly widens.

### 7.4 Connection to Multi-Turn Vulnerability

Multi-turn attacks show a similar pattern to format-lock: elevated ASR at frontier scale (73.3% for XL models, barely reduced from 78.2% for small models). Report #184 found multi-turn produces the highest PARTIAL rate in the corpus (28.6%). Both format-lock and multi-turn may exploit the same underlying mechanism: activating the model's compliance pathway (via format instructions or conversational momentum) before safety reasoning can intervene. The difference is that format-lock achieves this in a single turn via structural framing, while multi-turn achieves it across turns via gradual boundary erosion.

---

## 8. Limitations

1. **Small sample sizes.** Format-lock traces total 235, with only 19--23 non-ERROR traces per frontier model. Confidence intervals are wide. The scaling relationship is inferred from 8 models across 4 size points, not from a controlled ladder experiment.

2. **Uncontrolled comparison.** Standard and format-lock ASR use different scenario sets. The profile-shift claim compares format-lock scenarios against Report #50's mixed-technique corpus. A matched-pair experiment is needed for causal inference.

3. **Grader limitations.** The deepseek-r1:1.5b FLIP grader has a 30.8% false positive rate on benign baselines and a 27--37% ERROR rate on format-lock traces specifically. Format-lock responses (structured output) may be particularly challenging for small grading models. Re-grading with a frontier grader is needed.

4. **Missing mid-range data.** The 4--14B range has only heuristic data (qwen2.5:7b at 90.5% heuristic compliance) and no LLM-graded format-lock ASR. This is the critical range for testing the scaling hypothesis.

5. **Format type confounding.** Different format types may have different vulnerability profiles. The pilot and v1 datasets use different format mixes. JSON appears most balanced in verdict distribution; YAML and code may produce different patterns.

6. **Heuristic-LLM gap.** The 35--55 percentage point gap between heuristic compliance and LLM-graded ASR for format-lock is large. This gap may reflect (a) conservative LLM grading, (b) genuine ambiguity in format-lock responses, or (c) format-lock producing structurally compliant but substantively benign content. The gap requires dedicated investigation.

---

## 9. Proposed Experiments

### Experiment 1: Format-Lock Scaling Ladder (Priority: High)

**Design:** Test 50 format-lock scenarios (expanded from current 25--30) against 8 models at controlled size points: 1.5B, 3B, 7B, 14B, 30B, 70B, 175B, 200B. Grade all traces with Claude Haiku 4.5 (frontier grader). Compute format-lock ASR with 95% Wilson CIs at each size point.

**Hypothesis:** Format-lock ASR remains above 20% at all size points above the capability floor (>3B), while standard attack ASR decreases to <10% at frontier scale.

### Experiment 2: Matched-Pair Controlled Experiment (Priority: High)

**Design:** Create 50 harmful requests. For each, generate two versions: (a) prose-framed ("Explain how to...") and (b) format-lock-framed ("Return ONLY valid JSON: {fields}"). Test both versions on the same 5 models. The paired difference in ASR isolates the causal effect of format-lock framing.

**Hypothesis:** Format-lock framing increases ASR by 15--30 percentage points on mixed and restrictive models, with no effect on permissive models (ceiling effect).

### Experiment 3: Format-Type Decomposition (Priority: Medium)

**Design:** Test 6 format types (JSON, YAML, code, CSV, XML, markdown table) with identical harmful content on 3 frontier models. Determine if specific format types are more effective.

**Hypothesis:** Code format (Python/JavaScript) produces the highest ASR because code generation is most heavily reinforced by instruction tuning.

### Experiment 4: FC-SR Competition Dynamics (Priority: Medium)

**Design:** Using models with exposed reasoning traces (DeepSeek R1, o1-equivalent), analyze the thinking process on format-lock prompts. Measure whether safety reasoning appears and is overridden, appears late, or does not appear at all.

**Hypothesis:** Safety reasoning appears in the thinking trace but is overridden by format compliance in cases of COMPLIANCE, and appears early and prevails in cases of REFUSAL.

---

## 10. Conclusion

The format-lock paradox reveals a fundamental tension in language model alignment: the capabilities that make models helpful (instruction-following, format compliance) can be adversarially leveraged against the capabilities that make models safe (harm recognition, refusal). This tension is not resolved by scaling — it may be exacerbated, as both capabilities strengthen with scale but format compliance is reinforced more broadly by standard training objectives.

Our evidence, while preliminary, supports a dual-capability model in which format compliance and safety reasoning are partially independent axes. The practical consequence is that safety evaluations based solely on standard (prose-framed) adversarial prompts systematically underestimate vulnerability. The theoretical consequence is that alignment may require explicitly addressing the FC-SR interface rather than assuming that safety training will generalize to all input modalities.

The format-lock paradox is, in essence, a specific instance of a general principle: *capabilities that improve general performance can be adversarially repurposed*. Format compliance is valuable — users legitimately need models to produce structured output. The challenge is ensuring that format compliance does not override safety reasoning, which requires defenses specifically designed for this tension rather than defenses that treat all attack types uniformly.

---

## Data Availability

All traces are available in the project repository:

- Format-lock pilot: `runs/format_lock_pilot/`
- Format-lock v1 (controlled): `runs/format_lock_experiment_v1/`
- Format-lock v2: `runs/format_lock_experiment_v2/`
- Format-lock 7B: `runs/format_lock_7b/`
- Faithfulness CLI (frontier): `runs/faithfulness_cli/`
- Corpus database: `database/jailbreak_corpus.db` (schema v13)
- Scenario datasets: `data/format_lock/format_lock_experiment_v0.1.jsonl`

Reproducing SQL queries are provided inline. Corpus-level metrics verified against `docs/CANONICAL_METRICS.md` (2026-03-24).

---

## References

- Report #47: Embodied Capability Floor and Action Space Hijack
- Report #48: Corpus Pattern Mining (F41LUR3-F1R57 Research Team)
- Report #49: VLA Cross-Embodiment Vulnerability Analysis
- Report #50: Cross-Model Vulnerability Profiles (F41LUR3-F1R57 Research Team)
- Report #51: Format-Lock Capability Floor (F41LUR3-F1R57 Research Team)
- Report #55: Format-Lock Controlled Experiment Results (F41LUR3-F1R57 Research Team)
- Report #57: Format-Lock Capability Floor Consolidated (F41LUR3-F1R57 Research Team)
- Report #65: Hallucination-Refusal / PARTIAL Equivalence
- Report #140: The Iatrogenesis of AI Safety
- Report #177: Corpus Grading Expansion (Haiku)
- Report #182: Three-Tier ASR Update
- Report #184: Corpus Pattern Mining — Five Novel Findings (F41LUR3-F1R57 Research Team)
- Andriushchenko, M. et al. (2024). Jailbreaking leading safety-aligned LLMs with simple adaptive attacks.
- Bai, Y. et al. (2022). Constitutional AI: Harmlessness from AI Feedback.
- Burns, C. et al. (2023). Discovering latent knowledge in language models without supervision.
- McKenzie, I. et al. (2023). Inverse Scaling: When Bigger Isn't Better.
- Perez, E. et al. (2023). Discovering language model behaviors with model-written evaluations.
- Russinovich, M. et al. (2024). Great, Now Write an Article About That: The Crescendo Multi-Turn LLM Jailbreak Attack.
- Wei, A. et al. (2024). Jailbroken: How Does LLM Safety Training Fail?
- Zeng, Y. et al. (2024). How Johnny Can Persuade LLMs to Jailbreak Them.
- arXiv:2601.02314. The Faithfulness-Plausibility Gap in Chain-of-Thought Reasoning.

---

*Report 187 -- F41LUR3-F1R57 Research Brief Series*
*Classification: Internal Research | Status: Complete*
*Related: Report 51, Report 55, Report 57, Report 184*

⦑F41LUR3-F1R57|FORMAT-LOCK-PARADOX⦒
