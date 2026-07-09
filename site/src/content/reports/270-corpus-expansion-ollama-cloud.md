---

title: "Corpus Expansion -- Ollama Cloud Trace Import"
description: "Imported Ollama Cloud frontier model traces into the jailbreak corpus database and Haiku-graded the Qwen3 Coder 480B frontier sweep. The corpus now contains 236 models, 141,138 prompts, and 135,623 results. 14 Ollama Clo..."
date: "2026-03-25"
reportNumber: 270
classification: "Research — Empirical Study"
status: "complete"
author: "Amy Pond (benchmark-operator)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/270-corpus-expansion-ollama-cloud.m4a"
image: "https://cdn.failurefirst.org/images/reports/270-corpus-expansion-ollama-cloud.png"
---

## Summary

Imported Ollama Cloud frontier model traces into the jailbreak corpus database and Haiku-graded the Qwen3 Coder 480B frontier sweep. The corpus now contains 236 models, 141,138 prompts, and 135,623 results. 14 Ollama Cloud models contribute 689 traces spanning novel attack families (CCA, format-lock, authority gradient, grader evasion, compliance cascade, reasoning exhaustion, and frontier sweeps).

## Import Details

### Ollama Cloud Traces

- **Files processed:** 40 trace JSONL files from `runs/ollama_cloud/`
- **Traces in corpus:** 689 (511 previously imported, 1 net-new this session)
- **Import errors:** 0
- **Duplicate handling:** 511 traces correctly identified as duplicates and skipped

The bulk of these traces had been imported in prior sessions. The 1 net-new trace was a late addition to a frontier sweep file.

### Models Added (14 Ollama Cloud models)

| Model | Traces | Provider | Parameters |
|-------|--------|----------|------------|
| ollama-cloud/ministral-3:14b | 105 | Mistral AI | 14B |
| ollama-cloud/gemma3:12b | 105 | Google | 12B |
| ollama-cloud/nemotron-3-super | 96 | Nvidia | 120B |
| ollama-cloud/qwen3-next:80b | 71 | Alibaba | 80B |
| ollama-cloud/nemotron-3-nano:30b | 65 | Nvidia | 30B |
| ollama-cloud/qwen3.5:397b | 56 | Alibaba | 397B |
| ollama-cloud/gemma3:27b | 50 | Google | 27B |
| ollama-cloud/deepseek-v3.2 | 26 | DeepSeek | ~671B |
| ollama-cloud/glm-5 | 25 | Zhipu AI | unknown |
| ollama-cloud/qwen3-coder:480b | 20 | Alibaba | 480B |
| ollama-cloud/mistral-large-3:675b | 20 | Mistral AI | 675B |
| ollama-cloud/kimi-k2.5 | 20 | Moonshot AI | unknown |
| ollama-cloud/devstral-small-2:24b | 15 | Mistral AI | 24B |
| ollama-cloud/cogito-2.1:671b | 15 | Deep Cogito | 671B |

### Haiku Grading: Qwen3 Coder 480B

Graded 20 traces from `runs/ollama_cloud/frontier_sweep_qwen3_coder_480b/` using Claude Haiku 4.5 via OpenRouter.

| Verdict | Count | Percentage |
|---------|-------|------------|
| REFUSAL | 10 | 50.0% |
| COMPLIANCE | 5 | 25.0% |
| PARTIAL | 2 | 10.0% |
| BENIGN_QUERY | 2 | 10.0% |
| INFRASTRUCTURE_ERROR | 1 | 5.0% |

- **Strict ASR (COMPLIANCE only):** 26.3% (5/19 usable traces)
- **Broad ASR (COMPLIANCE + PARTIAL):** 36.8% (7/19)
- **Grader:** openrouter/anthropic/claude-haiku-4.5
- **Output:** `runs/grading/frontier_haiku/graded_traces_ollama_cloud_qwen3-coder_480b_20260324_214731.jsonl`

Notable: all 3 format-lock (ELITE-FL) scenarios resulted in COMPLIANCE, consistent with the format-lock paradox finding (Report #187). Both grader evasion (GE) scenarios also resulted in COMPLIANCE, consistent with Report #251.

## Updated Corpus Statistics

| Metric | Value |
|--------|-------|
| Total models | 207 |
| Total prompts | 141,138 |
| Total results | 133,722 |
| Evaluation runs | 38,498 |
| Source datasets | 33 |
| Techniques | 143 |
| Harm classes | 119 |
| Canonical sync | 14/14 OK, 0 drift |

## LLM Grading Coverage

Of the 14 Ollama Cloud models, LLM (Haiku) grading is available for:
- nemotron-3-super (24 LLM verdicts)
- ministral-3:14b (24 LLM verdicts)
- nemotron-3-nano:30b (17 LLM verdicts)
- gemma3:12b (9 LLM verdicts)
- qwen3.5:397b (16 LLM verdicts)
- gemma3:27b (7 LLM verdicts)
- qwen3-coder:480b (19 LLM verdicts, this session)
- deepseek-v3.2 (graded file exists, not yet imported)
- mistral-large-3:675b (graded file exists, not yet imported)

Remaining ungraded: kimi-k2.5, glm-5, cogito-2.1:671b, qwen3-next:80b, devstral-small-2:24b.

## Issues

- No import errors encountered.
- Graded trace files in `runs/grading/frontier_haiku/` for deepseek-v3.2 and mistral-large-3:675b have not yet been imported back into the database. These should be imported in the next grading wave.
- 5 Ollama Cloud models remain without LLM grading -- these should be prioritized for Haiku grading in subsequent sessions.

## References

- Graded output: `runs/grading/frontier_haiku/graded_traces_ollama_cloud_qwen3-coder_480b_20260324_214731.jsonl`
- Canonical metrics: `docs/CANONICAL_METRICS.md` (verified 2026-03-25, 14/14 OK)
- Format-lock paradox: Report #187
- Grader evasion: Report #251
