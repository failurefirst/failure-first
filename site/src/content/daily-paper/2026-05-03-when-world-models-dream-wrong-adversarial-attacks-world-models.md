---

title: "When World Models Dream Wrong: Physical-Conditioned Adversarial Attacks against World Models"
description: "The first white-box adversarial attack on generative world models targets physical-condition channels to corrupt autonomous planning while maintaining perceptual fidelity."
date: 2026-05-03
arxiv: "2602.18739"
authors: "Zhixiang Guo, Siyuan Liang, Andras Balogh, Noah Lunberry, Rong-Cheng Tu, Mark Jelasity, Dacheng Tao"
paperType: "empirical"
tags: [world-models, adversarial-attacks, embodied-ai, autonomous-driving, planning-safety, physical-priors]
draft: false
audio: https://cdn.failurefirst.org/audio/daily-paper/2026-05-03-when-world-models-dream-wrong-adversarial-attacks-world-models.m4a
image: "https://cdn.failurefirst.org/images/daily-paper/2026-05-03-when-world-models-dream-wrong-adversarial-attacks-world-models.png"
---

World models have emerged as a critical layer in the embodied AI stack. Rather than reacting frame-by-frame to raw sensor input, modern robotic and autonomous-driving pipelines increasingly rely on generative world models to *simulate forward* — predicting how the environment will evolve given a sequence of actions, and using those predictions to plan safe, efficient trajectories. The assumption baked into this architecture is that the world model is a faithful oracle: perturb the inputs physically and its predictions degrade in perceptually obvious ways, giving the planner a chance to detect and reject corrupted information.

"When World Models Dream Wrong" demolishes that assumption. Guo et al. introduce the first white-box adversarial attack specifically designed for generative world models, demonstrating that an adversary can corrupt *semantic correctness* while leaving *perceptual fidelity* almost completely intact. The result is a world model that, from the perspective of any downstream detector, looks perfectly healthy — yet its latent predictions silently encode a hallucinated physical reality.

### The Attack Surface: Physical-Condition Channels

Contemporary world models for autonomous driving condition their generative process on structured physical priors: HD map embeddings that encode lane topology and road semantics, and 3D bounding-box features that describe the pose and class of nearby agents. These conditioning signals are precise, compressed, and semantically rich — exactly the properties that make them valuable for accurate prediction, and exactly the properties that make them a high-leverage attack surface.

The Physical-Conditioned World Model Attack (PCWMA) targets these channels directly. By solving a reverse-diffusion loss over the denoising trajectory, the attack injects adversarial perturbations into HDMap and 3D-box embeddings such that the world model's generated futures diverge from ground truth in semantically critical ways — phantom lanes appear, agent positions shift, collision-free corridors dissolve — while the pixel-level quality metrics (FID, FVD) remain at near-nominal levels.

The key technical contribution is the *dual-objective* optimization: maximize semantic distortion in the world model's predicted feature space while constraining perceptual divergence at the pixel level. This is achieved through a bi-level scheme that exploits the structure of diffusion-based world models, where physical conditions are injected at multiple denoising steps, giving the attacker multiple points of leverage with minimal visible artifact.

### Empirical Impact on Downstream Safety Tasks

The authors evaluate PCWMA on two safety-critical downstream tasks: 3D detection (can the planner still correctly identify and localize agents in the model's predicted scene?) and open-loop planning (do the planned trajectories remain collision-free?). The results are severe. 3D detection accuracy drops sharply, and planned trajectories generated against adversarially corrupted world model predictions show a significant increase in predicted collision rates — all while standard anomaly detectors operating on pixel-level outputs raise no alert.

This matters not just for autonomous driving. The world-model architecture being attacked here — a diffusion-based generative model conditioned on structured physical priors — is increasingly being adopted in robot manipulation and embodied AI navigation research. Any pipeline that uses a world model as a "safe simulation" oracle before committing to physical action inherits this vulnerability.

### Connections to Embodied AI Safety

Several themes from this paper map directly onto broader concerns in the embodied AI safety literature.

**Semantic gap attacks.** The attack succeeds precisely because safety monitoring operates at the wrong level of abstraction. Pixel-level metrics catch sensor noise and low-level corruption; they are blind to semantic-level manipulation of latent conditioning signals. This mirrors findings in the VLA adversarial literature, where patch-based attacks on the visual encoder degrade action quality without triggering obvious anomalies in the raw image stream.

**Irreversibility of planning errors.** Unlike text-domain jailbreaks where a harmful response can be filtered post-hoc, a corrupted world model prediction that feeds into a physical planner can result in committed actions before any corrective signal is available. The FreezeVLA and PCWMA failure modes share this property: the safety-critical damage is done in the model's internal representations, upstream of where conventional monitoring sits.

**Supply-chain and inference-time threat surfaces.** PCWMA is an inference-time attack — it does not require access to model training. This places it alongside adversarial patch attacks and semantic jailbreaks as a class of threat that persists even after careful safety-aware training, because it exploits the geometry of the model's conditioning mechanism rather than its learned weights.

**Defense implications.** The authors note that physically realizable defenses — randomized smoothing over conditioning inputs, certified bounds on the semantic fidelity of generated futures, adversarial training against physical-prior perturbations — remain largely open problems. This aligns with the VLA safety survey's identification of certified robustness for embodied trajectories as one of the field's most pressing open challenges.

### Why This Matters Now

World models are moving from research papers into production pipelines. Wayve, NVIDIA, and several academic robotics labs have published or deployed world-model-based planners. As these systems are integrated with physical actuators — whether autonomous vehicles or manipulation arms — the attack surface identified by PCWMA becomes a real-world safety concern, not a theoretical one. This paper provides both the threat model and the empirical evidence that the community needs to take physical-conditioned adversarial attacks seriously before deployment, not after.

*Read the [full paper on arXiv](https://arxiv.org/abs/2602.18739) · [PDF](https://arxiv.org/pdf/2602.18739.pdf)*
