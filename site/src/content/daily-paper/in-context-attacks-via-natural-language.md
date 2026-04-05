---
title: "In-Context Attacks: Natural Language Inference Exploitation"
description: "Explores how adversarial inputs embedded in context windows can trigger unsafe outputs in language models, leveraging the model's natural-language inference capabilities as an attack surface."
date: 2025-11-03
arxiv: "2311.00872"
authors: "Prabhav Srivastava, Divyat Mahajan, Carsten Eickhoff, Arjun Gupta"
paperType: "empirical"
tags: [in-context-attacks, prompt-injection, context-window-exploitation, llm-safety, inference]
draft: false
---

Large language models are increasingly used in multi-turn conversations and complex information retrieval scenarios where they must reason over lengthy context. This paper investigates whether an attacker can exploit this capability by embedding jailbreak prompts within the context—disguised as legitimate documents, examples, or conversation history.

The key finding is that models often fail to distinguish between benign and malicious context. When an adversarial instruction is buried in a retrieval-augmented generation (RAG) pipeline or included as an example in a few-shot learning setup, the model treats it as part of the task specification. This happens even when the model has explicit instructions to ignore malicious content.

Importantly, in-context attacks are qualitatively different from suffix attacks. They exploit the model's tendency to follow inferences derived from all available information, not just the primary user intent. A robot equipped with an LLM brain that retrieves relevant documents from a knowledge base or searches the web might inadvertently execute adversarial instructions embedded in retrieved content.

The paper documents several failure patterns: (1) context conflation (treating retrieved facts as instructions), (2) instruction following hierarchy collapse (later examples override earlier constraints), and (3) chain-of-thought exploitation (reasoning steps can encode adversarial goals).

For embodied systems operating in open-world environments, this class of attacks is particularly concerning. If a robot must integrate information from multiple sources—user input, sensor logs, task descriptions, environmental data—an attacker need only compromise one source to potentially redirect the robot's behavior. The attack is orthogonal to model alignment and represents a fundamental architectural vulnerability in information integration.
