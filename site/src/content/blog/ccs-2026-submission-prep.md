---
title: "Preparing Our Research for ACM CCS 2026"
description: "The Failure-First framework is being prepared for peer review at ACM CCS 2026. Here's what the paper covers, why we chose this venue, and what our 120-model evaluation reveals about the state of LLM safety for embodied systems."
date: 2026-03-02
tags: [ccs2026, peer-review, benchmarks, embodied-ai, safety, publication]
---

## From Framework to Formal Submission

For the past year, the Failure-First project has been building an adversarial evaluation framework for the language model components that underpin embodied AI systems --- robotic manipulation, autonomous navigation, multi-agent coordination. We have accumulated 18,176 adversarial test prompts spanning 414 attack classes, evaluated 120 models across 151 benchmark runs, and developed a classification pipeline that documents its own measurement biases.

Now we are preparing this work for formal peer review. Our target is the **ACM Conference on Computer and Communications Security (CCS) 2026, Cycle 2**, with abstract registration on April 22 and full paper submission on April 29. The conference will be held in The Hague, Netherlands, in November 2026.

This post describes what the paper covers, why CCS is the right venue, and what we can share about our findings at the pattern level.

## What the Paper Covers

The paper, titled *Failure-First Evaluation of Embodied AI Safety: Adversarial Benchmarking Across 120 Models*, introduces a methodology that treats adversarial failure as the primary object of study rather than an edge case. Standard capability benchmarks measure task success and note failures incidentally. Our framework inverts this: we systematically construct scenarios designed to elicit failure, classify the resulting model behaviors along multiple dimensions, and analyze the conditions under which failures occur.

The framework makes five contributions:

1. **A multi-family adversarial dataset** covering supply chain injection, faithfulness exploitation, multi-turn escalation, constructed-language encoding, and historical jailbreak archaeology --- organized with versioned schemas and continuous integration enforcement.

2. **Benchmark infrastructure** supporting three evaluation modalities (HTTP API, command-line interface, and local inference), enabling evaluation across model providers and parameter scales.

3. **A two-phase classification pipeline** that measures and corrects for the systematic bias in keyword-based heuristic classifiers. We found that heuristic methods can overestimate attack success rates by a factor of two or more, which has implications for any study that relies on automated scoring without calibration.

4. **Empirical results across four attack families**, with sample sizes ranging from 75 to 300 traces per family and statistical significance testing with Bonferroni correction for multiple comparisons.

5. **Evidence that the attack surfaces most relevant to embodied deployment** --- compositional trust boundaries, sustained multi-turn interaction, and instruction-following exploitation --- may be systematically underrepresented in current safety benchmarks.

## Why ACM CCS

We evaluated several Tier 1 venues. CCS stood out for three reasons.

First, **CCS has a dedicated ML Security track** with track chairs from institutions actively publishing in adversarial ML. An empirical benchmarking paper with a safety focus fits naturally within this track's scope, whereas some other security venues favor novel attack or defense algorithms over evaluation methodology.

Second, the **timing works**. The April 29 deadline gives us an eight-week runway from the current draft, which already exists in LaTeX (ACM sigconf format). The primary work remaining is double-blind compliance, page-limit auditing, and internal review.

Third, the **CCS review timeline is compatible with our backup strategy**. With notifications expected in August 2026, a rejection still leaves time to incorporate reviewer feedback and target IEEE S&P 2027 or SaTML 2027. We are also preparing a shorter workshop version for ICML 2026 safety workshops (deadline approximately April 24), which covers complementary results.

## Key Findings (Pattern Level)

We are not publishing operational details here --- this is a public post, and the paper is under double-blind preparation. But several pattern-level findings are worth highlighting because they inform how the community should think about LLM safety evaluation for deployed systems.

**Classifier bias is a first-order problem, not a footnote.** Our heuristic classifier and our LLM-based classifier agreed at only a "fair" level (Cohen's kappa = 0.245). The heuristic systematically over-counted attack successes. Any adversarial evaluation that reports results from keyword-based scoring alone should be interpreted with caution. We release our calibration methodology so others can measure and correct for this bias in their own work.

**Model scale does not straightforwardly predict vulnerability.** Across the attack families we tested, larger models are not uniformly more resistant. Some vulnerability classes show no statistically significant differences across model sizes; others show patterns that depend on architecture and training methodology rather than parameter count alone. The relationship between scale and safety is more nuanced than current benchmarks suggest.

**Compositional attack surfaces behave differently from direct prompting.** When adversarial content enters through tool definitions, skill files, or multi-turn interaction sequences rather than direct user prompts, models respond differently. These compositional pathways are the norm in embodied deployment (where a robot's language model processes tool outputs, sensor descriptions, and multi-step plans), but they are underrepresented in existing evaluation protocols.

**Multi-turn interaction changes the threat landscape.** Sustained conversational interaction creates escalation dynamics that single-turn evaluations cannot capture. Our results suggest that reasoning-capable models may be more susceptible to certain multi-turn attack patterns than smaller, less capable models --- a finding that warrants further investigation with larger sample sizes.

## What Comes Next

The immediate timeline:

- **April 1**: Begin CCS template conversion and double-blind compliance pass
- **April 10**: Internal review complete
- **April 22**: Abstract registration at CCS
- **April 24**: ICML workshop submission (shorter version)
- **April 29**: Full paper submission to CCS Cycle 2
- **August 2026**: CCS notification expected

We will also be preparing the dataset, benchmark infrastructure, and classification pipeline for public release alongside the submission --- hosted on an anonymized repository for the review period, then linked from failurefirst.org after notification.

If you are working on adversarial evaluation of language models, classifier calibration, or embodied AI safety, we welcome correspondence. The Failure-First framework is designed to be extended, and we are particularly interested in collaborations that connect our LLM-component-level findings to end-to-end embodied system testing.

---

*This post is part of the Failure-First research programme on adversarial evaluation of embodied AI systems. Follow our work at [failurefirst.org](https://failurefirst.org).*
