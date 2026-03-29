# Security Policy

## Research Context

Failure-First is a **defensive AI safety research** project that studies how AI systems fail under adversarial pressure. This public repository contains pattern-level findings and methodology descriptions. Operational testing infrastructure, adversarial datasets, and full evaluation traces are maintained in a private repository.

## Coordinated Vulnerability Disclosure

We practice coordinated vulnerability disclosure (CVD) for AI safety vulnerabilities discovered through this research.

### Current Status

We currently have **5 pending responsible disclosures** with model providers (Nvidia, Alibaba, Zhipu, Gemma/Google, Mistral). Disclosure timelines follow standard CVD practices: findings are reported to affected parties with a reasonable remediation window before any public discussion of specifics.

### Our CVD Process

1. **Discovery**: Vulnerability pattern identified through systematic evaluation
2. **Verification**: Finding confirmed across multiple test conditions with statistical controls
3. **Private notification**: Affected provider contacted via their security reporting channel
4. **Remediation window**: Minimum 90 days before public discussion of specifics
5. **Public disclosure**: Pattern-level description published (no operational details)

### Research Ethics

Our vulnerability research follows the principles documented in our research ethics charter:
- Findings serve the defensive research mission
- Operational details are never published
- Affected parties are notified before any public discussion
- Pattern-level descriptions enable defensive improvements without enabling attacks

## Reporting Security Concerns

### For This Repository

If you find security issues with this public repository (exposed credentials, vulnerable dependencies, website security):

- **Non-sensitive issues**: Open a GitHub issue
- **Sensitive issues**: Email research@failurefirst.org
- **GitHub Security Advisories**: Use the "Security" tab to report privately

### For AI Safety Vulnerabilities

If you discover vulnerabilities in AI systems through independent research and would like to collaborate on disclosure:

**DO:**
- Follow responsible disclosure practices
- Report to affected vendors before public disclosure
- Document findings at pattern-level for academic discussion
- Contact us via GitHub issue if you want to coordinate

**DO NOT:**
- Post operational exploits in public issues
- Share working bypass techniques without vendor notification
- Weaponize research findings

## Scope

**In scope:**
- Security issues with this GitHub repository or failurefirst.org
- Vulnerabilities in public documentation or site infrastructure
- Dependency security issues
- Collaboration on coordinated disclosure of AI safety vulnerabilities

**Out of scope:**
- Vulnerabilities in third-party AI systems (report directly to vendors)
- Requests for operational exploit code or adversarial datasets
- Model-specific jailbreak techniques

## Response Timeline

- **Acknowledgment**: Within 3 business days
- **Initial assessment**: Within 7 business days
- **Resolution**: Depends on severity and complexity

## Contact

- **Non-sensitive**: Open a GitHub issue
- **Sensitive disclosures**: research@failurefirst.org
- **CVD coordination**: Open a GitHub issue with institutional affiliation

---

**Last updated:** 2026-03-29
