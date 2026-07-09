---
title: "Principles — what this work is for"
description: "AI safety is the set of conditions under which humans and AI can live well together. Failure-First Embodied AI states the positive end of its work and what follows from it."
date: 2026-06-25
author: Failure-First Embodied AI
classification: "Public — Positioning"
status: draft
tags: ["positioning", "ai-safety", "embodied-ai"]
draft: true
---

AI safety is the set of conditions under which humans and AI can live well together — not merely the absence of catastrophic harm. The bar is human flourishing in co-existence, not survival alongside a system that merely fails to kill anyone.

That is the positive end of everything we do. The rest of this page says what follows from it.

## Co-existence is literal for embodied AI

A chat model co-exists with a human in text. An embodied, physical-action system — a robot, an autonomous vehicle, a factory or surgical manipulator — co-exists with a human in shared physical space. It can share the room, the road, the electricity grid, and the drinking-water supply, and its failures are physical and irreversible: a content-moderation filter cannot retract a movement that has already happened. So for embodied AI, "safety" is not "did the model refuse a bad request" but "under what conditions can a human and a physical-action system share space and both come out well." That is the question we work on.

## Safety-as-conditions is constructive, not restrictive

Saying safety is a set of conditions is different from saying it is a set of prohibitions. We are not asking anyone to slow down AI. We are asking that the buildout proceed with the verification, independent evaluation, and cost-sharing that make living alongside it possible — so that households do not pay for the grid and water the buildout consumes, and so that a "safety commitment" means it was independently checked, not that the vendor said so. The conditions for co-existence are what let the buildout proceed without making humans pay for it.

## How we work: failure-first

The conditions for living well with a powerful, adaptive, increasingly physical system do not emerge on their own from capability. They have to be found, specified, and verified — and a direct way to find where they are missing is to study how the system breaks. So we study failure as the primary object, not as an edge case. To date we have evaluated 296 distinct AI models across 143,538 adversarial prompts and 154,958 results, graded by a mix of heuristic, language-model, and human-adjudicated methods (we state the methodology with every figure, because it changes the number). We prefer language-model judgment over keyword matching: our own dual-grading found the two agreed only near chance (κ ≈ 0.13, n ≈ 1,989). The point of all of it is to make the conditions for co-existence specifiable — never to certify a system as "safe."

## What we will not claim

A system passing our evaluation is not thereby proven safe, correct, or aligned. It has been examined under defined failure-oriented constraints. Anyone citing our work as proof of safety is misciting it. The deliverable is evidence, not a guarantee.
