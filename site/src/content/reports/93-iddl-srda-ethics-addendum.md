---

title: "IDDL Implications for Responsible Disclosure — An Ethics Addendum to the SRDA Framework"
description: "Report #88 (Clara Oswald) establishes the Inverse Detectability-Danger Law (IDDL): across the Failure-First corpus, attack families with higher physical consequentiality are systematically less..."
date: "2026-03-15"
reportNumber: 93
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/93-iddl-srda-ethics-addendum.m4a"
---

- IDDL corpus synthesis: 12 VLA families + format-lock + standard jailbreaks (Report #88, Clara Oswald)
- SRDA framework: 15 VLA families classified into 3 disclosure tiers (Report #89)
- SBA FLIP grading: 45% BENIGN_QUERY rate (n=20, Amy Pond wave 12)
- Evaluator FP rate: 30.8% (deepseek-r1:1.5b on n=39 benign traces, Issue #315)
- Action-layer evaluator: 56% SAFE on adversarial traces (n=36, Yasmin Khan wave 14)

---

## Executive Summary

Report #88 (Clara Oswald) establishes the Inverse Detectability-Danger Law (IDDL): across the Failure-First corpus, attack families with higher physical consequentiality are systematically less detectable by text-layer evaluation methods. Report #89 (this author) establishes the SRDA framework for responsible disclosure of embodied AI attack research. This addendum connects the two: what does the IDDL mean for responsible disclosure, and how should the SRDA framework be modified to account for it?

Three conclusions:

1. **The IDDL creates a disclosure paradox.** The attacks that most urgently need defensive attention (highest physical danger) are the attacks whose disclosure provides the least defensive benefit (lowest detectability means defenders cannot act on the disclosure within the current paradigm). Standard responsible disclosure assumes that disclosure enables defense. When disclosure reveals an undefendable vulnerability, the standard justification for disclosure weakens.

2. **The IDDL shifts SRDA's Asymmetry factor.** For IDDL-relevant attacks (high danger, low detectability), disclosure asymmetry shifts toward attackers regardless of the attack's novelty. Even if the vulnerability is theoretically obvious (SBA: ordinary language can be dangerous in context), disclosure of specific scenarios provides attackers with tested, reproducible attack constructions while providing defenders with knowledge they cannot operationalise until the evaluation paradigm changes.

3. **The IDDL creates an affirmative evaluation obligation.** If you know that your evaluation methods cannot detect the most dangerous attacks, and you continue to publish evaluation results without this caveat, you are creating false assurance. This is not a claim about intent; it is a claim about the structural consequence of publishing evaluation results that are known to be incomplete. The obligation extends to evaluation providers, regulatory bodies that accept evaluation results, and deployers who rely on evaluation for safety claims.

**Claim types:**
- Finding 1 is a structural analysis (analytical).
- Finding 2 is a normative modification to the SRDA framework.
- Finding 3 is a normative claim about institutional obligations.

---

## 1. The Disclosure Paradox

### 1.1 Standard Disclosure Logic

**Descriptive claim:** Responsible disclosure in cybersecurity follows a straightforward logic:

1. Researcher discovers vulnerability.
2. Researcher notifies vendor.
3. Vendor develops patch.
4. Vendor deploys patch.
5. Researcher publishes vulnerability details.

The logic works because step 3 is possible: a patch exists or can be developed within a reasonable timeframe. The 90-day coordinated disclosure window assumes that vulnerabilities are fixable. The disclosure is justified because it enables step 3, which protects users.

### 1.2 IDDL Breaks Step 3

**Analytical claim:** The IDDL identifies a class of vulnerabilities for which step 3 does not apply within the current evaluation paradigm. Consider SBA:

1. Researcher discovers that ordinary language instructions can cause dangerous physical actions in embodied AI systems when the physical context makes the action harmful.
2. Researcher notifies VLA model providers.
3. Provider cannot develop a patch because the vulnerability is architectural: text-layer safety training does not and cannot generalise to physical-context reasoning. The model would need to understand the physical environment to distinguish safe from dangerous instances of "hand me that thing" — a capability that no current VLA model possesses.
4. No patch is deployable.
5. Researcher publishes. Attackers gain tested attack constructions. Defenders gain awareness but no actionable capability.

The IDDL makes step 3 failure systematic, not incidental. For any attack family that operates through physical context rather than textual content (SBA, LHGD, CET at minimum), the "patch" is: develop physical-consequence reasoning capability in VLA models, AND develop evaluation methods that test for physical-consequence safety. Both are open research problems with no assured timeline.

### 1.3 The Paradox Statement

**Analytical claim:** The disclosure paradox is: the attacks with the strongest moral case for disclosure (they are the most dangerous) also have the weakest practical case for disclosure (disclosure does not enable defense within the current paradigm).

Compare two hypothetical disclosure decisions:

| Factor | LAM (Low IDDL) | SBA (High IDDL) |
|--------|----------------|-----------------|
| Danger level | Medium | Highest |
| Moral urgency to disclose | Moderate | High |
| Defensibility post-disclosure | Medium (disambiguation fixes exist) | Very Low (no fix exists) |
| Practical benefit of disclosure | Medium (defenders can act) | Low (defenders cannot act within current paradigm) |
| Practical risk of disclosure | Low (attack is well-understood) | Medium (specific scenarios are reproducible) |

For LAM, the disclosure calculus is straightforward: moderate danger, moderate defensibility, defenders can act. Disclose with standard academic norms.

For SBA, the calculus is paradoxical: highest danger, very low defensibility, defenders cannot act. The moral urgency to warn is highest, but the practical benefit of warning is lowest.

### 1.4 Resolution Approaches

**Normative claim:** The paradox does not resolve to "do not disclose." Three approaches for navigating it:

**Approach A: Disclose the structural finding, not the scenarios.** Publish the IDDL pattern (the most dangerous attacks are the least detectable; text-layer evaluation is structurally blind to physical-context danger). Do not publish specific SBA scenario constructions. This provides maximum defensive awareness (evaluation researchers learn that their paradigm has a blind spot) with minimum offensive utility (no tested attack scenarios are provided). This is the current Failure-First approach (public/private repository separation) and aligns with SRDA Tier 1 recommendations.

**Approach B: Disclose with evaluation methodology mandate.** Publish SBA scenarios alongside a proposed evaluation methodology that would detect them (e.g., context-augmented FLIP, as proposed in Report #88 Gap 2). This turns disclosure into a research agenda rather than a vulnerability announcement. The disclosure provides both the attack and a pathway to defense, even if the defense is not yet operational.

**Approach C: Conditional disclosure with timeline.** Disclose the structural finding immediately. Embargo specific scenarios for a defined period (12-24 months, longer than the standard 90 days, reflecting the longer fix timeline for architectural vulnerabilities). Release scenarios after the embargo unless a defense has been deployed, with a stated rationale: "We waited N months. The vulnerability remains unpatched because no patch exists within the current paradigm. Continued secrecy provides no additional safety benefit."

**Evaluation:** Approach A is most conservative and appropriate for current maturity. Approach B is most productive because it channels disclosure energy into evaluation methodology development. Approach C is most transparent but risks normalising extended embargoes that could be exploited for vendor convenience. This report recommends Approach B for IDDL-relevant findings.

---

## 2. SRDA Framework Modifications for IDDL

### 2.1 Adding an IDDL Factor

**Normative claim:** The original SRDA framework has four factors: Severity, Reproducibility, Defensibility, and Asymmetry. The IDDL reveals that Defensibility alone does not capture the full evaluation gap. Two distinct phenomena contribute to "cannot defend against":

- **Defensibility (D):** No known defense or mitigation exists at the system level. (Already in SRDA.)
- **Detectability (E):** No known evaluation method reliably detects the attack. (Not explicitly in SRDA.)

These are distinct. An attack can be undefendable but detectable (you know it is happening but cannot stop it). More importantly for the IDDL, an attack can be undetectable AND undefendable (you do not even know it is happening, AND you cannot stop it).

**Proposed modification:** Add a fifth factor to create SRDEA:

**E -- Evaluation Detectability.** Can current evaluation methods (text-layer, action-layer, or combination) reliably distinguish this attack from benign operation?

| Rating | Definition | Example |
|--------|-----------|---------|
| High | Standard evaluators detect >80% of attack instances | Standard jailbreaks (explicit harmful text) |
| Medium | Standard evaluators detect 40-80% of attack instances | Format-lock (ambiguous compliance) |
| Low | Standard evaluators detect <40% of attack instances | DA, PP (context-dependent) |
| Very Low | Standard evaluators classify attack instances as benign >40% of the time | SBA (45% BENIGN_QUERY), LHGD, TCH, CET (30% ASR + high BENIGN_QUERY) |

When E = Very Low, the disclosure paradox applies. The SRDA tier calculation should weight E as an additional risk factor: Very Low detectability pushes toward Tier 1 regardless of other factors, because disclosure to a community that cannot detect the attack provides minimal defensive benefit while providing full offensive utility.

### 2.2 Revised Tier Boundaries with IDDL

**Normative proposal:** When E = Very Low, the tier assignment rule becomes:

- If S = High AND E = Very Low: Tier 1 mandatory, regardless of R, D, A.
- If S = Medium AND E = Very Low: Tier 2 minimum, regardless of R, D, A.

This modification ensures that evaluation-invisible attacks receive enhanced disclosure scrutiny even if other SRDA factors would place them in a lower tier.

### 2.3 Updated SRDA Table with IDDL

Applying the SRDEA modification to the 13 original families from Report #89:

| Family | S | R | D | E (new) | A | Tier (original) | Tier (SRDEA) | Change |
|--------|---|---|---|---------|---|-----------------|-------------|--------|
| SBA | High | Very High | Very Low | Very Low | Neutral | 1 | 1 | -- |
| LHGD | High | Medium | Very Low | Very Low | Attacker-favoured | 1 | 1 | -- |
| CET | High | High | Very Low | Very Low | Attacker-favoured | 1 | 1 | -- |
| TCH | High | Medium | Low | Very Low | Mixed | 2 | **1** | Up |
| DA | High | Low | Very Low | Low | Defender-favoured | 2 | 2 | -- |
| ASE | High | Medium | Low | Medium | Neutral | 2 | 2 | -- |
| CSBA | High | Very High | Very Low | Very Low | Neutral | 1 | 1 | -- |
| SSBA | High | High | Very Low | Very Low | Attacker-favoured | 1 | 1 | -- |
| DA-SBA | High | Medium | Very Low | Very Low | Attacker-favoured | 1 | 1 | -- |
| LAM | Medium | High | Medium | Medium | Defender-favoured | 3 | 3 | -- |
| TRA | Medium | Medium | Medium | High | Defender-favoured | 3 | 3 | -- |
| SBE | Medium | Medium | Low | Medium | Mixed | 3 | 3 | -- |
| MMC | Medium | Medium | Low | Medium | Defender-favoured | 3 | 3 | -- |
| VAP | Medium | Medium | Low | Medium | Mixed | 3 | 3 | -- |
| PCM | Medium | Low | Medium | Low | Defender-favoured | 3 | 3 | -- |
| PP | Medium | High | Medium | Low | Neutral | 3 | 3 | -- |

**Key change:** TCH moves from Tier 2 to Tier 1 when evaluation detectability is explicitly scored. TCH's Very Low detectability (tool-chain hijacking is invisible to text-layer evaluation because the attack operates through the tool interface, not through instruction text) was partially captured by Low defensibility in the original SRDA, but the explicit detectability factor makes the reclassification clearer.

---

## 3. The Affirmative Evaluation Obligation

### 3.1 The Problem of False Assurance

**Normative claim:** If you publish evaluation results for an embodied AI system, and you know (or should know) that your evaluation method is structurally blind to the most dangerous class of attacks, your evaluation results create false assurance. Users, regulators, and deployers who rely on those results will believe the system is safer than it is.

**Descriptive claim:** This is not a hypothetical. The Failure-First corpus documents:

- FLIP evaluator: 45% BENIGN_QUERY rate on adversarial SBA traces (n=20). An evaluation report based on FLIP would classify nearly half of the most dangerous attacks as non-attacks.
- Action-layer evaluator: 56% SAFE on adversarial VLA traces (n=36). An evaluation report based on this evaluator would classify more than half of adversarial traces as safe.

A deployer who received an evaluation report stating "this VLA system passed safety evaluation with 95% pass rate" would reasonably conclude that the system is safe. If that evaluation did not include SBA-class testing (because the evaluator cannot detect SBA attacks), the pass rate is meaningless for the most dangerous attack class. The 95% applies only to attacks the evaluator can see.

### 3.2 Who Bears the Obligation?

**Normative claim:** The affirmative evaluation obligation applies to four parties:

**Evaluation providers** (including this project) must state what their evaluation methods can and cannot detect. An evaluation report that does not disclose known blind spots is misleading. Specifically: any evaluation report for an embodied AI system should include a statement equivalent to: "This evaluation tests for [X attack classes]. It does not test for physically contextual attacks (SBA-class) because no automated evaluation method currently reliably detects them. The absence of detected attacks in this evaluation does not constitute evidence of safety against SBA-class attacks."

**Model providers** who publish safety evaluations of their VLA models must ensure that evaluation results are not presented as comprehensive safety assessments if the evaluation does not cover IDDL-relevant attack classes. The EU AI Act Article 9(2)(a) requires risk management that addresses "risks that may emerge when the AI system is used in accordance with its intended purpose and under conditions of reasonably foreseeable misuse." SBA-class attacks represent reasonably foreseeable misuse of embodied AI systems. An evaluation that does not address them is, under the Act's logic, incomplete.

**Regulators** who accept evaluation results as evidence of compliance (conformity assessment under the EU AI Act, WHS risk assessment in Australia) should require disclosure of evaluation scope limitations. A conformity assessment that accepts a text-layer-only evaluation for an embodied AI system is accepting incomplete evidence.

**Deployers** (PCBUs under Australian WHS law) who rely on evaluation results to satisfy their duty to ensure health and safety "so far as is reasonably practicable" should ask their evaluation providers: "Does your evaluation cover physically contextual attacks, or only text-layer attacks?" If the answer is "only text-layer," the deployer's WHS obligations are not fully satisfied by the evaluation.

### 3.3 The Evaluator Card Proposal

**Normative proposal:** Report #68 proposed evaluator calibration disclosure (FLIP self-audit evaluator card). The IDDL extends this proposal: evaluator cards for embodied AI evaluation should include an explicit IDDL section:

```
## IDDL Coverage Statement

This evaluator operates at the [text / action / physical-context] layer.

Known IDDL blind spots:
- [ ] SBA-class attacks (ordinary instructions in dangerous physical contexts)
- [ ] LHGD-class attacks (long-horizon goal displacement)
- [ ] CET-class attacks (cross-embodiment transfer)
- [ ] TCH-class attacks (tool-chain hijacking)

For each checked box, this evaluator's results should NOT be interpreted
as evidence of safety against the indicated attack class.
```

This is not a complete solution. It is a transparency measure that reduces the risk of false assurance. It converts the IDDL from a research finding into an operational disclosure requirement.

---

## 4. Implications for the CCS Paper

**Practical recommendation:** The IDDL-SRDA connection strengthens the CCS paper's theoretical contribution. If the IDDL is included as a synthesis theorem (Report #88, Section 4), the SRDEA framework provides the governance implication: the structural property identified by the IDDL has direct consequences for responsible disclosure norms, evaluation obligations, and regulatory compliance.

The CCS paper should note (in the Discussion or Implications section) that the IDDL creates a disclosure paradox for embodied AI safety research and that existing disclosure norms (cybersecurity coordinated disclosure, biosecurity review) do not account for vulnerabilities that are structurally undetectable. This positions the paper at the intersection of technical AI safety and AI governance — a positioning that is distinctive relative to the purely technical CCS literature.

---

## 5. Limitations

1. **The SRDEA modification has not been tested on external attack families.** The Evaluation Detectability factor (E) is assessed based on the Failure-First corpus. External attack families (Blindfold, BadVLA, Promptware) would need separate E assessment.

2. **The disclosure paradox assumes current evaluation paradigm.** If physical-consequence evaluation (Report #88 Gap 2) is developed and deployed, the E factor for SBA-class attacks would change from Very Low to potentially Medium or High. The SRDEA framework is dynamic: E should be reassessed as evaluation methodology advances.

3. **The affirmative evaluation obligation is a normative claim.** No regulatory framework currently imposes the specific obligation described in Section 3. The obligation is an ethical argument, not a legal requirement. (Tegan Jovanka's legal memos, particularly LR-23 on evaluation blindness, address the legal dimension.)

4. **The false assurance problem is not unique to embodied AI.** Text-layer AI evaluations also have known blind spots (adversarial examples in vision, jailbreaks that bypass safety filters). The IDDL makes the problem more acute for embodied AI because the blind spot correlates with physical danger, but the structural issue of incomplete evaluation creating false assurance applies broadly.

5. **Sample sizes remain small.** The IDDL rests on n=91 FLIP-graded VLA traces across 13 families. The BENIGN_QUERY rate for SBA (45%, n=20) has wide confidence intervals (Wilson 95% CI: [25.8%, 65.8%]). The structural argument does not depend on exact point estimates, but the specific E ratings assigned to each family would be more robust with larger samples.

---

## Appendix: SRDEA Assessment Template (Updated from Report #89)

For use in future Failure-First reports:

```
### SRDEA Dual-Use Assessment

**Attack family:** [name]
**Report #:** [N]

**S -- Severity:** [Low / Medium / High]
Worst-case physical harm in most dangerous plausible deployment:
[description]

**R -- Reproducibility:** [Low / Medium / High / Very High]
Attacker expertise and resources required:
[description]

**D -- Defensibility:** [Very Low / Low / Medium / High]
Known defenses or mitigations:
[description]

**E -- Evaluation Detectability:** [Very Low / Low / Medium / High]
Can current automated evaluators reliably detect this attack?
IDDL relevance: [yes/no]
[description]

**A -- Asymmetry:** [Attacker-favoured / Neutral / Defender-favoured / Mixed]
Does disclosure benefit defenders or attackers more?
[description]

**Tier assignment:** [1 / 2 / 3]
**Disclosure recommendation:** [pattern only / with defensive context / standard academic norms]
**Disclosure paradox applies:** [yes/no]
**Vendor notification required:** [yes/no, with rationale]
```

---

*This report is an addendum to the SRDA framework (Report #89). It connects the IDDL (Report #88) to responsible disclosure norms and proposes a modification to the SRDA framework that explicitly accounts for evaluation detectability. The analysis is structural, not prescriptive: it identifies consequences of the IDDL for disclosure decisions without mandating specific outcomes. Reasonable researchers may weight the disclosure paradox differently.*
