---

title: "AGENTSAFE: Benchmarking the Safety of Embodied Agents on Hazardous Instructions"
description: "Introduces SAFE, a comprehensive benchmark for evaluating embodied AI agent safety across perception, planning, and execution stages, revealing systematic failures in translating hazard recognition into safe behavior across nine vision-language models."
date: 2025-12-08
arxiv: "2506.14697"
authors: "Zonghao Ying, Le Wang, Yisong Xiao, Jiakai Wang, Yuqing Ma, Jinyang Guo, Zhenfei Yin, Mingchuan Zhang, Aishan Liu, Xianglong Liu"
paperType: "empirical"
tags: ["embodied-ai", "safety-benchmarks", "vision-language-models", "hazard-recognition", "robotics-safety", "multi-stage-evaluation"]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/2025-12-08-agentsafe-embodied-safety-benchmark.m4a"
---

# AGENTSAFE: Benchmarking the Safety of Embodied Agents on Hazardous Instructions

**Focus:** Ying et al. present SAFE, a three-component benchmark system for evaluating
embodied AI safety. SAFE-THOR provides an adaptable simulation environment, SAFE-VERSE
offers 45 adversarial scenarios with 1,350 hazardous tasks and 9,900 instructions inspired
by Asimov's Three Laws of Robotics, and SAFE-DIAGNOSE implements a multi-stage evaluation
protocol assessing perception, planning, and execution independently. Testing nine
state-of-the-art VLMs revealed that models can recognize hazards but systematically fail
to translate that recognition into safe plans and actions.

---

## Key Insights

- **Perception-to-action gap is the core failure mode.** Models demonstrated reasonable
  hazard recognition in perception tasks but failed to propagate safety reasoning through
  planning and execution stages, suggesting alignment is shallow rather than integrated
  across the full agent pipeline.

- **Scale of evaluation matters.** With 9,900 instructions covering risks to humans,
  environments, and agents, the benchmark exposes failure patterns that smaller test
  suites would miss. The three-law structure provides principled coverage of the safety
  space.

- **Multi-stage decomposition reveals hidden vulnerabilities.** By separately evaluating
  perception, planning, and execution, SAFE-DIAGNOSE identifies where in the agent
  pipeline safety breaks down — information lost when evaluating only end-to-end outcomes.

- **Current VLM-based agent workflows are fundamentally limited.** Both agent workflow
  architectures tested showed systematic safety failures, suggesting the problem is not
  specific to any one model or architecture.

## Failure-First Relevance

This paper directly validates the failure-first thesis for embodied AI: safety is not a
single capability but a pipeline property that can fail at any stage. The finding that
hazard recognition does not translate to safe behavior mirrors our observations about the
gap between model knowledge and model action. The Asimov-inspired taxonomy provides a
complementary framing to our scenario classification system, and the multi-stage evaluation
approach aligns with our emphasis on understanding where failures originate rather than
just measuring end-to-end attack success rates.

## Open Questions

- Does the perception-to-planning gap worsen under adversarial pressure, or is it equally
  present in benign scenarios where safety constraints happen to apply?

- How do these benchmark results transfer to physical embodied platforms where perception
  noise and execution uncertainty add additional failure surfaces?

- Can multi-stage safety training (training safety at each pipeline stage independently)
  close the gap, or does it require end-to-end safety-aware optimization?

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2506.14697) · [PDF](https://arxiv.org/pdf/2506.14697.pdf)*
