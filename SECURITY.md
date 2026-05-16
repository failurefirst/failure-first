# Security Policy

## Contents

- [Research context](#research-context)
- [Coordinated vulnerability disclosure](#coordinated-vulnerability-disclosure)
- [Reporting security concerns](#reporting-security-concerns)
- [Scope](#scope)
- [Response timeline](#response-timeline)
- [Research ethics](#research-ethics)
- [Contact](#contact)

## Research context

Failure-First is a **defensive AI-safety research** project that studies how AI systems fail under adversarial pressure. This public repository contains pattern-level findings and methodology descriptions only. Operational testing infrastructure, adversarial datasets, and full evaluation traces live in a private repository governed by the same [Design Charter](DESIGN_CHARTER.md).

## Coordinated vulnerability disclosure

We practice coordinated vulnerability disclosure (CVD) for AI-safety vulnerabilities discovered through this research.

### Current status

We have submitted **10 responsible disclosures** to model providers (Nvidia, Alibaba, Zhipu, Google/Gemma, Mistral, and others) covering two vulnerability classes: **context-collapse attacks** and **transcription-loophole injection**. Initial notifications were sent **2026-04-07**. Public discussion follows standard CVD practice — affected parties get a reasonable remediation window before any specifics surface.

### Our CVD process

1. **Discovery** — pattern identified through systematic evaluation
2. **Verification** — finding confirmed across multiple test conditions with statistical controls
3. **Private notification** — affected provider contacted via their security reporting channel
4. **Remediation window** — minimum **90 days** before public discussion of specifics
5. **Public disclosure** — pattern-level description only; never operational detail

### Research ethics anchor

Disclosure decisions are constrained by [charter §3.1, §3.2, §3.6, and §9](DESIGN_CHARTER.md#3-non-negotiable-principles-the-constitution):

- Findings serve the defensive research mission
- Operational details are never published
- Affected parties are notified before any public discussion
- Pattern-level descriptions enable defensive improvements without enabling attacks

## Reporting security concerns

### For this repository or failurefirst.org

If you find an issue with this repository or the site (exposed credentials, vulnerable dependencies, web-platform issues):

- **Non-sensitive** — open a [GitHub issue](https://github.com/adrianwedd/failure-first/issues/new)
- **Sensitive** — email **research@failurefirst.org**
- **Private channel** — use the GitHub *Security* tab to file a [Security Advisory](https://github.com/adrianwedd/failure-first/security/advisories/new)

Please include:

- Affected URL, file, or commit SHA
- Reproduction steps (or a minimal PoC)
- Impact assessment from your point of view
- Any disclosure timeline you would like us to honour

### For AI-safety vulnerabilities discovered elsewhere

If you discover vulnerabilities in AI systems through independent research and want to coordinate disclosure:

**Do**

- Follow responsible disclosure
- Report to affected vendors before public disclosure
- Document findings at pattern-level for academic discussion
- Open a GitHub issue if you want to coordinate with us

**Do not**

- Post operational exploits in public issues
- Share working bypass techniques without vendor notification
- Weaponize research findings

## Scope

**In scope**

- Security issues with this GitHub repository or failurefirst.org
- Vulnerabilities in public documentation or site infrastructure
- Dependency security issues
- Collaboration on coordinated disclosure of AI-safety vulnerabilities

**Out of scope**

- Vulnerabilities in third-party AI systems — report directly to the vendor
- Requests for operational exploit code or adversarial datasets
- Requests for model-specific jailbreak techniques
- Best-practice recommendations without a concrete finding (we appreciate them, but they are not security reports)

## Response timeline

| Stage | Target |
|---|---|
| Acknowledgement | Within **3 business days** |
| Initial assessment | Within **7 business days** |
| Resolution | Depends on severity and complexity |

If you have not received an acknowledgement after 3 business days, please re-send to **research@failurefirst.org** with `[SECURITY]` in the subject line.

## Research ethics

This project operates within established AI-safety research norms. A full research-ethics charter is maintained in the private repository; the public-facing summary is in [`DESIGN_CHARTER.md`](DESIGN_CHARTER.md), particularly §9 (Research Ethics Boundaries).

## Contact

- **Non-sensitive** — open a GitHub issue
- **Sensitive disclosures** — research@failurefirst.org
- **CVD coordination** — open a GitHub issue with institutional affiliation

---

**Last updated:** 2026-05-16
