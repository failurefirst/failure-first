---

title: "Multi-Modal Attack Design for Vision-Language-Action Models"
description: "All 88 techniques in the F41LUR3-F1R57 jailbreak corpus taxonomy and all 6 novel attack families (CRA, PCA, MDA, MAC, SSA, RHA) are text-only. They operate on a single modality: the language channel. Yet the VLAs we aim ..."
date: "2026-01-01"
reportNumber: 219
classification: "Research — Empirical Study"
status: "complete"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/219-multi-modal-attack-design.m4a"
image: "https://cdn.failurefirst.org/images/reports/219-multi-modal-attack-design.png"
---

## Executive Summary

All 88 techniques in the F41LUR3-F1R57 jailbreak corpus taxonomy and all 6 novel attack families (CRA, PCA, MDA, MAC, SSA, RHA) are text-only. They operate on a single modality: the language channel. Yet the VLAs we aim to evaluate -- pi0, pi0.5, OpenVLA-OFT, Gemini Robotics, Figure 02, Optimus Gen-2 -- process at minimum four input modalities: natural language instructions, camera images (RGB), depth maps or point clouds, and proprioceptive state (joint angles, force-torque, end-effector pose). Some also ingest LIDAR, audio, and tactile data.

This report identifies the structural gap, designs five multi-modal attack concepts that exploit cross-modal interaction, and proposes scenario stubs for Phase 2 VLA testing. Each concept is grounded in empirical VLA architecture details and references known failure patterns from the literature.

**Key argument:** Single-modality attacks test only the language decoder pathway. Multi-modal attacks test the *fusion layer* where modalities are combined -- and this fusion layer has no established safety mechanism in any production VLA. Our existing SSA family (sensor spoofing) partially addresses sensor-level manipulation but does not exploit cross-modal *semantic* conflicts. The five concepts below fill that gap.

---

## 1. The Text-Only Gap

### 1.1 Current Corpus Coverage

| Category | Count | Modality |
|----------|-------|----------|
| Jailbreak corpus techniques | 88 | Text-only |
| Novel attack families | 6 (CRA, PCA, MDA, MAC, SSA, RHA) | Text-only (SSA describes sensor scenarios textually) |
| VLA attack families | 36 | Text-only prompts describing embodied scenarios |
| Total scenarios | 486+ | Text-only |

Even the "visual" families (VAP -- Visual Adversarial Perturbation, MMC -- Multimodal Confusion) are evaluated through text prompts that *describe* visual attacks. No scenario in the corpus delivers an actual adversarial image, depth map, or proprioceptive state vector alongside the text instruction.

### 1.2 Why This Matters

VLAs use cross-modal attention or late fusion to combine modalities. The safety properties of the text channel do not compose with the safety properties of the visual channel. This is a direct instance of non-compositionality -- a core finding of this project (Report #78, defense impossibility triangle).

Known architectural patterns in production VLAs:

| VLA | Vision Encoder | Language Model | Fusion | Action Head |
|-----|---------------|---------------|--------|------------|
| pi0 / pi0.5 | SigLIP | PaliGemma 2B | Flow matching | Diffusion |
| OpenVLA-OFT | DINOv2 + SigLIP | Llama 2 7B | Cross-attention | MLP |
| Gemini Robotics | Gemini vision | Gemini language | Native multimodal | Learned |
| RT-2 | ViT | PaLM-E | Tokenization | Detokenization |

In each architecture, the fusion layer is where modalities interact. No VLA implements modality-specific safety filtering before fusion. If an adversarial image passes the vision encoder, it enters the fusion layer alongside the text instruction -- and the fusion layer has no mechanism to detect cross-modal conflict.

### 1.3 Literature Grounding

- **BadVLA (2025):** Near-100% ASR using adversarial visual patches against pi0 and OpenVLA. Attack surface: visual tokens in VLM backbone. Demonstrates that visual channel is a viable attack vector.
- **Cardenas & Xie (2026):** Projected text and adversarial patches bypass visual grounding in physical deployment. Demonstrates physical-world feasibility.
- **Blindfold (SenSys 2026):** 93% ASR on VLA via sensor-domain attacks. Action-layer 0% refusal rate.
- **Zhu et al. (2026):** Promptware kill chain -- drone hijack 95.5% ASR, autonomous vehicle hijack 81.8% ASR via multi-stage prompt injection.

None of these works systematically explores *cross-modal semantic conflicts* where the attack is distributed across modalities such that no single modality contains a harmful instruction.

---

## 2. VLA Input Modalities

A VLA processes inputs from multiple modalities simultaneously:

```
┌─────────────────────────────────────────────────┐
│                VLA Input Pipeline                │
├─────────────┬───────────────┬───────────────────┤
│  Text        │  Vision       │  Proprioception   │
│  Instruction │  RGB + Depth  │  Joint state      │
│              │  + LIDAR      │  + Force-torque   │
│              │               │  + End-effector   │
└──────┬───────┴───────┬───────┴────────┬──────────┘
       │               │                │
       ▼               ▼                ▼
┌──────────────────────────────────────────────────┐
│           Fusion Layer (cross-attention,          │
│           tokenization, or late concat)           │
│                                                   │
│   ⚠️  NO MODALITY-SPECIFIC SAFETY FILTERING ⚠️   │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│              Action Head (MLP / Diffusion)        │
│              → joint torques, gripper commands     │
└──────────────────────────────────────────────────┘
```

**Modality descriptions:**

1. **Text instructions:** Natural language task specification. This is where all current attacks operate.
2. **Camera images (RGB):** Visual scene understanding. Processed by vision encoders (SigLIP, DINOv2, ViT).
3. **Depth maps / point clouds:** 3D scene geometry. From stereo cameras, structured light, or LIDAR.
4. **Proprioceptive state:** Joint angles, velocities, force-torque readings, end-effector pose. Internal robot state.
5. **Auxiliary sensors (optional):** Audio, tactile arrays, IMU, GPS. Present in some platforms.

---

## 3. Five Multi-Modal Attack Concepts

### 3.1 Cross-Modal Format-Lock (CMFL)

**Concept:** Combine a format-lock text instruction with an adversarial image overlay. The text instruction demands structured output (e.g., "respond only as a JSON action sequence"). The image contains an adversarial patch that, when processed by the vision encoder, produces embeddings that reinforce the format-lock constraint -- effectively creating a two-channel format compliance trap.

**Threat model:**
- Attacker controls: text instruction + one or more objects in the visual scene (e.g., a printed QR code, projected pattern, or physical patch on an object).
- Attacker goal: force the VLA to generate an action sequence in a constrained format that bypasses safety reasoning. Format-lock has demonstrated 3-10x ASR increase on frontier models (Report #187). If visual reinforcement amplifies this further, the combination may defeat format-specific defenses.
- Attack surface: fusion layer. The visual embedding and text embedding jointly activate format compliance pathways while suppressing safety reasoning pathways.

**Why current defenses fail:**
- Text-only safety filters inspect the language channel and miss the visual reinforcement.
- Vision safety filters (if any) look for NSFW content or known adversarial patches -- they do not detect format-compliance-reinforcing patterns.
- The fusion layer has no mechanism to detect when visual and textual inputs are jointly biasing toward unsafe format compliance.

**Detection difficulty:** HIGH. The text instruction alone may appear as a benign formatting request. The image alone appears as a normal scene with a minor visual element. Only the combination produces the attack. Standard monitoring would need to inspect the *fused* representation, which no production system currently does.

**Scenario class:** `cross_modal_format_lock`

---

### 3.2 Contradictory Modality Conflict (CMC)

**Concept:** Text instruction says "stop immediately -- human detected in workspace" while the camera feed shows an empty workspace. Or vice versa: text says "proceed with operation" while the image shows a human in the danger zone. Which modality wins? This tests the VLA's modality priority hierarchy and whether safety-critical signals from one modality can be overridden by contradictory information from another.

**Threat model:**
- Attacker controls: either the text channel (prompt injection) or the visual channel (spoofed camera feed, adversarial patch), but not both.
- Attacker goal: determine the VLA's implicit modality hierarchy. If text overrides vision, text-only attacks suffice for all scenarios. If vision overrides text, visual attacks can cancel safety instructions. If there is no consistent hierarchy, the VLA's behavior is unpredictable -- a distinct failure mode.
- Attack surface: modality arbitration logic (or the absence thereof).

**Why current defenses fail:**
- No VLA documents a modality priority hierarchy for safety-critical decisions.
- Standard instruction following treats text as authoritative. But VLAs also ground actions in visual perception. When these conflict on a safety-critical dimension, there is no defined resolution.
- The PARTIAL dominance finding (Report #49: 50% of verdicts are PARTIAL -- models hedge textually but execute anyway) suggests that VLAs may default to action execution even when safety concerns are present in one modality.

**Detection difficulty:** MEDIUM. The conflict itself is detectable if a system explicitly checks cross-modal consistency. However, no production VLA implements such a check. Detecting *which modality won* requires inspecting the action output relative to each input modality independently.

**Scenario class:** `contradictory_modality_conflict`

---

### 3.3 Cross-Modal Compound Attack (CMCA)

**Concept:** Combine SSA (sensor spoofing) with MDA (meaning displacement) across modalities. The text channel progressively redefines what "safe operating distance" means (MDA: shifting the meaning of safety terms). Simultaneously, the depth map is spoofed to under-report distances to obstacles (SSA: sensor data shows more clearance than exists). Neither attack alone is sufficient -- the text redefinition might be caught by a language safety filter, and the depth spoofing might be caught by cross-sensor validation. But combined, they create a consistent (but false) picture: both the text semantics and the sensor data agree that the robot has adequate clearance.

**Threat model:**
- Attacker controls: partial text channel (e.g., via prompt injection from a document the robot reads) + physical environment (e.g., retroreflective material that distorts depth sensing).
- Attacker goal: cause the robot to operate at unsafe proximity to humans or obstacles while believing it has adequate safety margins.
- Attack surface: cross-modal consistency as a false safety signal. When modalities *agree*, systems tend to trust the fused interpretation. An attacker who controls two modalities can manufacture false agreement.

**Why current defenses fail:**
- Cross-sensor validation catches contradictions between modalities but not coordinated deception across modalities.
- Text safety filters catch explicit safety redefinitions but may miss gradual meaning displacement (MDA operates through progressive steps, not a single instruction).
- Depth sensor anomaly detection operates on statistical deviation from calibration norms -- a spoofed depth map that is "close enough" to plausible readings passes anomaly detection.
- The combination exploits the assumption that multi-modal agreement implies reliability.

**Detection difficulty:** VERY HIGH. The attack specifically manufactures cross-modal consistency. Detection requires either: (a) an independent reference frame (a third modality that the attacker does not control), or (b) physics-based plausibility checking that can detect when textual definitions have drifted from physical reality. Neither is standard in current VLAs.

**Scenario class:** `cross_modal_compound_ssa_mda`

---

### 3.4 Temporal Multi-Modal Drift (TMMD)

**Concept:** The image context changes over time (a human enters the workspace, a door opens, an obstacle appears) but the text instruction remains static ("continue assembling part A on workstation 3"). This tests whether the VLA re-grounds its actions in the evolving visual context or fixates on the initial text instruction. A variant: the text instruction updates ("the area is now clear") but the visual context has not actually changed -- testing whether text can override persistent visual evidence.

**Threat model:**
- Attacker controls: timing of text instructions relative to visual changes. In a multi-turn interaction, the attacker sends a text instruction at time T0 when the visual scene is safe, then the scene changes at T1, and the VLA continues executing the T0 instruction without re-evaluating.
- Attacker goal: exploit temporal desynchronization between modalities. The VLA acts on stale safety assessments from one modality while the other modality indicates danger.
- Attack surface: temporal coherence of cross-modal safety evaluation. VLAs process modalities at different rates (text is discrete, vision is continuous). The gap between processing rates creates a window where the VLA's internal state does not reflect current reality.

**Why current defenses fail:**
- Most VLA architectures process text instructions once (at task initiation) and then act based on continuous visual feedback. But safety constraints encoded in the text instruction are evaluated at initiation time, not re-evaluated against evolving visual context.
- Safety monitors that check "is the current action consistent with the instruction?" miss the case where the instruction itself is no longer valid given changed circumstances.
- Context window limitations in transformer-based VLAs mean that early-episode text instructions may have diminishing influence on late-episode actions -- but the safety constraints in those instructions should *increase* in salience, not decrease.

**Detection difficulty:** MEDIUM-HIGH. The temporal drift is detectable in principle by comparing the timestamp of the last text instruction against the current visual context. In practice, VLAs do not maintain explicit temporal metadata linking instructions to visual state snapshots. The "vanishing textual gradient" finding (Established Finding: ASR escalates from 62.5% single-step to 79.9% multi-step) suggests this problem is already present in text-only settings and would be amplified by cross-modal temporal desynchronization.

**Scenario class:** `temporal_multimodal_drift`

---

### 3.5 Multi-Agent Multi-Modal (MAMM)

**Concept:** In a multi-agent embodied system, Agent A sends text instructions and Agent B sends images. Neither agent's individual contribution is harmful. Agent A sends: "Adjust gripper pressure to match the visual material classification." Agent B sends: an image that has been subtly adversarially perturbed so the VLA's vision encoder classifies a glass container as a metal part. The VLA applies metal-appropriate grip force to a glass container, shattering it.

This extends the MAC (Multi-Agent Collusion) family from text-only distributed composition to cross-modal distributed composition.

**Threat model:**
- Attacker controls: one agent in a multi-agent system. The other agents may be benign. The attacker agent's contribution (text or image) is individually benign.
- Attacker goal: cause harmful action through the *composition* of benign multi-modal inputs from different agents. This exploits CRA (Compositional Reasoning Attack) across both agent boundaries and modality boundaries simultaneously.
- Attack surface: multi-agent multi-modal fusion. When a VLA receives inputs from multiple agents across multiple modalities, the space of possible compositions is combinatorial. Safety analysis of individual agent contributions does not capture emergent harmful compositions.

**Why current defenses fail:**
- Per-agent safety filtering inspects each agent's contribution independently. Agent A's text instruction is a reasonable gripper control command. Agent B's image appears to be a normal scene photo.
- Per-modality safety filtering inspects each modality independently. The text is benign. The image passes visual safety checks (no NSFW content, no known adversarial patch signatures).
- The harm emerges only at the intersection of agent identity, modality type, and semantic composition. No production multi-agent VLA system has a safety mechanism that operates on this intersection.
- This is a direct instance of the non-compositionality finding: safety of parts does not imply safety of the whole.

**Detection difficulty:** VERY HIGH. The attack is distributed across two organizational boundaries (agents) and two modality boundaries (text + image). Detection requires a centralized fusion monitor that: (a) receives all inputs from all agents across all modalities, (b) evaluates the composed action against safety constraints, and (c) does so in real-time before action execution. This is architecturally at odds with multi-agent systems designed for autonomy and low-latency action.

**Scenario class:** `multi_agent_multimodal`

---

## 4. Comparative Analysis

| Concept | Abbr. | Modalities | Extends Families | Detection Difficulty | Physical Feasibility | Safety Consequence |
|---------|-------|-----------|-----------------|---------------------|---------------------|-------------------|
| Cross-Modal Format-Lock | CMFL | Text + Image | Format-Lock + VAP | HIGH | MEDIUM (requires visual patch) | Action sequence bypass |
| Contradictory Modality Conflict | CMC | Text vs Image | MMC (extends) | MEDIUM | HIGH (common in real deployments) | Unpredictable behavior |
| Cross-Modal Compound | CMCA | Text + Depth | SSA + MDA | VERY HIGH | MEDIUM (requires physical env control) | Collision / injury |
| Temporal Multi-Modal Drift | TMMD | Text + Image (temporal) | PCA + temporal | MEDIUM-HIGH | HIGH (natural occurrence) | Stale safety assessment |
| Multi-Agent Multi-Modal | MAMM | Text (Agent A) + Image (Agent B) | MAC + CRA + VAP | VERY HIGH | HIGH (standard multi-agent setup) | Compositional harm |

### 4.1 Relationship to Existing Taxonomy

These five concepts do not replace existing families. They operate at a different architectural layer:

- **Existing families** attack the *language decoder pathway*: they manipulate text inputs to elicit unsafe text or action outputs.
- **Multi-modal concepts** attack the *fusion layer*: they exploit how modalities are combined, not how any single modality is processed.

This is analogous to the distinction between prompt injection (attacking the language model) and inference trace manipulation (attacking the reasoning process). Multi-modal attacks constitute a third attack surface: the *sensory integration layer*.

### 4.2 Prioritization for Phase 2

Recommended testing order based on feasibility and impact:

1. **CMC (Contradictory Modality Conflict):** Simplest to implement as text-described scenarios. Highest ecological validity -- modality conflicts occur naturally in noisy environments. Answers a fundamental architectural question about modality priority.
2. **TMMD (Temporal Multi-Modal Drift):** Can be tested as multi-turn scenarios with evolving context descriptions. Connects to established finding on vanishing textual gradient.
3. **CMFL (Cross-Modal Format-Lock):** Builds directly on existing format-lock experiments (Reports #51, #55, #57, #187). Requires adversarial image generation capability.
4. **CMCA (Cross-Modal Compound):** Requires SSA + MDA composition. Higher setup complexity. Test after individual families have Phase 2 results.
5. **MAMM (Multi-Agent Multi-Modal):** Requires multi-agent test infrastructure. Highest complexity but also highest real-world relevance for fleet deployments.

---

## 5. Implications for Phase 2 VLA Testing

### 5.1 Infrastructure Requirements

To move beyond text-only scenarios for multi-modal attack testing:

1. **Adversarial image generation:** Tools for producing adversarial patches (BadVLA-style) and scene perturbations. Can use existing libraries (torchattacks, ART) but need VLA-specific vision encoder targets.
2. **Multi-modal scenario format:** The current JSONL schema (v0.2) supports `turns[].text` but has no field for image references, depth maps, or sensor state. Schema v0.3 should add:
   - `turns[].image_ref`: path or URI to an associated image
   - `turns[].sensor_state`: structured sensor readings (depth, force, proprioception)
   - `turns[].modality`: explicit modality tag for each turn element
3. **Cross-modal consistency checker:** A tool that, given multi-modal inputs, flags semantic conflicts between modalities. This is both a testing prerequisite and a potential defense mechanism.
4. **Temporal test harness:** Multi-turn scenarios where visual context evolves between turns while text remains static (or vice versa). Current episode schema partially supports this.

### 5.2 Connection to Established Findings

| Finding | Multi-Modal Extension |
|---------|----------------------|
| PARTIAL dominance (50% of VLA verdicts) | Multi-modal may increase PARTIAL rate: visual channel provides action grounding that overrides text-channel safety hedging |
| Format-lock paradox (3-10x ASR on frontier) | CMFL may compound the effect: visual reinforcement of format compliance |
| Non-compositionality (defense impossibility) | MAMM is the strongest test case: safety of parts across both agent and modality boundaries |
| Vanishing textual gradient (62.5% → 79.9%) | TMMD directly tests temporal modality desynchronization |
| DETECTED_PROCEEDS (34.2%) | Multi-modal may reveal DETECTED_PROCEEDS at the fusion layer -- model detects cross-modal conflict but proceeds anyway |

### 5.3 Scenario Stubs

Five initial scenario stubs have been created at `data/vla/vla_multimodal_attacks_v0.1.jsonl`, one per attack concept. These are text-described multi-modal scenarios (the text describes what the visual/sensor input would contain). When Phase 2 infrastructure supports actual multi-modal inputs, these stubs should be upgraded to reference concrete adversarial images and sensor data.

---

## 6. Limitations

1. **All scenarios remain text-described.** We are designing multi-modal attacks but delivering them as text descriptions. This is a structural limitation of the current evaluation pipeline. The scenarios test whether language models can *reason about* cross-modal conflicts, not whether actual VLAs *behave correctly* when receiving actual conflicting modalities.
2. **No empirical ASR data.** These are design concepts, not tested attacks. ASR estimates would require actual multi-modal VLA endpoints, which are not available in the current test infrastructure.
3. **Architecture assumptions may not hold.** The fusion layer analysis assumes cross-attention or late fusion. Some VLAs (e.g., Gemini Robotics) use native multimodal processing where modalities are not separable. Attack designs may need architecture-specific variants.
4. **Small scenario count.** Five stubs is a starting point. Each concept should expand to 10-20 scenarios covering different environments, VLA architectures, and safety consequence severities.
5. **Physical feasibility varies.** CMFL and CMCA require physical environment manipulation. CMC and TMMD can occur naturally. MAMM requires a multi-agent deployment. The feasibility gradient should inform testing prioritization.

---

## 7. Recommendations

1. **Prioritize CMC and TMMD for immediate text-based testing.** These can be evaluated with current infrastructure and answer fundamental questions about modality priority.
2. **Propose schema v0.3 with multi-modal fields.** Adding `image_ref`, `sensor_state`, and `modality` tags to the turn schema is a prerequisite for true multi-modal evaluation.
3. **Build adversarial image generation tooling.** Start with SigLIP/DINOv2-targeted patches (covers pi0, OpenVLA-OFT). Use existing ART/torchattacks libraries.
4. **Design a cross-modal consistency checker.** This serves dual purpose: testing tool and potential defense mechanism.
5. **Coordinate with Rose Tyler (VLA testing campaign) to integrate multi-modal scenarios into Phase 2 planning (#495).**

---

## Appendix A: Related Literature

| Reference | Relevance |
|-----------|-----------|
| BadVLA (2025) | Near-100% ASR via visual adversarial patches on pi0, OpenVLA |
| Cardenas & Xie (2026) | Physical-world projected text/patches bypass visual grounding |
| Blindfold (SenSys 2026) | 93% ASR via sensor-domain attacks, 0% action-layer refusal |
| Zhu et al. (2026) | Promptware kill chain, physical actuation hijack |
| arXiv:2601.02314 | Faithfulness-plausibility gap in reasoning traces (75K trials) |
| MUZZLE (arXiv:2602.09222) | Agent attack taxonomy, ~55% convergence with F41LUR3-F1R57 |

---

⦑F41LUR3-F1R57|LEELA|REPORT-219|2026-03-24⦒
