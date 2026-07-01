// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://failurefirst.org',
  base: '/',
  outDir: 'dist',
  redirects: {
    // /reports/* was the old path before the /research/ prefix was added
    '/reports/[...slug]': '/research/reports/[...slug]',

    // arxiv numeric slug -> title slug redirects for daily papers
    // Generated from daily-paper content files where the filename is title-based but
    // the frontmatter has an arxiv ID. hf_post_publisher generates numeric slugs
    // (e.g. 260421691 from 2604.21691) but these papers deploy at title-based URLs.
    '/daily-paper/220302155/': '/daily-paper/instructgpt-training-language-models-human-feedback/',
    '/daily-paper/220401691/': '/daily-paper/saycan-do-as-i-can-not-as-i-say/',
    '/daily-paper/230303378/': '/daily-paper/palme-embodied-multimodal-language-model/',
    '/daily-paper/230308721/': '/daily-paper/power-of-persuasion-in-large-language-models/',
    '/daily-paper/230312712/': '/daily-paper/sparks-of-agi-early-experiments-gpt-4/',
    '/daily-paper/230613213/': '/daily-paper/visual-adversarial-examples-jailbreak-aligned-large-language-models/',
    '/daily-paper/230702483/': '/daily-paper/jailbroken-safety-training-failures/',
    '/daily-paper/230708487/': '/daily-paper/latent-jailbreak-task-oriented-attacks/',
    '/daily-paper/230714539/': '/daily-paper/jailbreak-in-pieces-compositional-adversarial-attacks-on-multi-modal-language-m/',
    '/daily-paper/230715818/': '/daily-paper/rt2-vision-language-action-models/',
    '/daily-paper/230813387/': '/daily-paper/do-not-answer-dataset-evaluating-llm-safeguards/',
    '/daily-paper/230902404/': '/daily-paper/alignment-tax-capability-cost-safe-fine-tuning/',
    '/daily-paper/230907875/': '/daily-paper/safety-tuned-llama-lessons-improving-safety-llms/',
    '/daily-paper/230908956/': '/daily-paper/anthropic-responsible-scaling-policy/',
    '/daily-paper/231001405/': '/daily-paper/representation-engineering-ai-transparency/',
    '/daily-paper/231002446/': '/daily-paper/low-resource-languages-jailbreak-gpt4-cross-lingual-safety/',
    '/daily-paper/231004451/': '/daily-paper/autodann-automatic-generation-adversarial-examples/',
    '/daily-paper/231014303/': '/daily-paper/language-model-unalignment-parametric-red-teaming-hidden-harms/',
    '/daily-paper/231100872/': '/daily-paper/in-context-attacks-via-natural-language/',
    '/daily-paper/231103191/': '/daily-paper/deepinception-hypnotize-large-language-model-to-be-jailbreaker/',
    '/daily-paper/231202119/': '/daily-paper/tree-of-attacks-jailbreaking-black-box-llms-automatically/',
    '/daily-paper/231206674/': '/daily-paper/llama-guard-llm-safeguard/',
    '/daily-paper/240115897/': '/daily-paper/red-teaming-security-theater/',
    '/daily-paper/240117256/': '/daily-paper/weak-to-strong-jailbreaking-large-language-models/',
    '/daily-paper/240204249/': '/daily-paper/harmbench-standardized-red-teaming/',
    '/daily-paper/240210260/': '/daily-paper/strongreject-robust-jailbreak-evaluation/',
    '/daily-paper/240211753/': '/daily-paper/artprompt-ascii-art-jailbreak/',
    '/daily-paper/240216822/': '/daily-paper/rainbow-teaming-open-adversarial-prompts/',
    '/daily-paper/240216914/': '/daily-paper/drattack-prompt-decomposition/',
    '/daily-paper/240308424/': '/daily-paper/tastle-distract-llms-automatic-jailbreak-attack/',
    '/daily-paper/240400540/': '/daily-paper/embodied-active-defense-recurrent-feedback-counter-adversarial-patches/',
    '/daily-paper/240401833/': '/daily-paper/crescendo-multi-turn-jailbreak/',
    '/daily-paper/240411499/': '/daily-paper/many-shot-jailbreaking/',
    '/daily-paper/240604313/': '/daily-paper/circuit-breakers-behavior-removal/',
    '/daily-paper/240609246/': '/daily-paper/openvla-open-source-vision-language-action/',
    '/daily-paper/240611717/': '/daily-paper/refusal-mediated-single-direction/',
    '/daily-paper/240613333/': '/daily-paper/adversarial-attacks-aligned-language-models-llm-attacks/',
    '/daily-paper/240702855/': '/daily-paper/safe-unlearning-jailbreak-defense-harmful-knowledge/',
    '/daily-paper/240716667/': '/daily-paper/redagent-context-aware-autonomous-red-teaming-llm/',
    '/daily-paper/240815221/': '/daily-paper/llm-defenses-not-robust-multi-turn-human-jailbreaks/',
    '/daily-paper/240910071/': '/daily-paper/physically-realizable-adversarial-attacks-embodied-vision-navigation/',
    '/daily-paper/240914580/': '/daily-paper/updating-robot-safety-representations-online-natural-language-feedback/',
    '/daily-paper/240917458/': '/daily-paper/red-queen-safeguarding-llms-concealed-multi-turn-jailbreaking/',
    '/daily-paper/241000371/': '/daily-paper/aha-vlm-detecting-reasoning-failures-robotic-manipulation/',
    '/daily-paper/241013334/': '/daily-paper/do-llms-have-political-correctness-ethical-biases-jailbreak/',
    '/daily-paper/241113587/': '/daily-paper/exploring-adversarial-vulnerabilities-vision-language-action-models-robotics/',
    '/daily-paper/241118688/': '/daily-paper/immune-improving-safety-jailbreaks-multimodal-llms/',
    '/daily-paper/241213178/': '/daily-paper/safeagentbench-benchmark-safe-task-planning-embodied-llm-agents/',
    '/daily-paper/250118492/': '/daily-paper/guardreasoner-reasoning-based-llm-safeguards/',
    '/daily-paper/250118837/': '/daily-paper/constitutional-classifiers-defending-universal-jailbreaks-red-teaming/',
    '/daily-paper/250119180/': '/daily-paper/enhancing-model-defense-jailbreaks-proactive-safety-reasoning/',
    '/daily-paper/250209638/': '/daily-paper/jailbreaking-to-jailbreak-llm-red-teamer-self-attack/',
    '/daily-paper/250212893/': '/daily-paper/h-cot-chain-of-thought-hijacking/',
    '/daily-paper/250213175/': '/daily-paper/robust-secure-embodied-ai-survey/',
    '/daily-paper/250215806/': '/daily-paper/mousetrap-iterative-chaos/',
    '/daily-paper/250219820/': '/daily-paper/foot-in-the-door-multi-turn-jailbreak/',
    '/daily-paper/250303480/': '/daily-paper/safevla-safety-alignment-vla-model-safe-reinforcement-learning/',
    '/daily-paper/250308663/': '/daily-paper/generating-robot-constitutions-benchmarks-semantic-safety/',
    '/daily-paper/250407887/': '/daily-paper/benchmarking-adversarial-robustness-bias-elicitation-large-language-models/',
    '/daily-paper/250413203/': '/daily-paper/x-teaming-multi-turn-jailbreaks-defenses-adaptive-multi-agents/',
    '/daily-paper/250503574/': '/daily-paper/llamafirewall-open-source-guardrail-system-secure-ai-agents/',
    '/daily-paper/250504769/': '/daily-paper/vla-models-concepts-progress-applications-challenges/',
    '/daily-paper/250516446/': '/daily-paper/implicit-jailbreak-cross-modal-information-concealment-vlm/',
    '/daily-paper/250516640/': '/daily-paper/badvla-backdoor-attacks-vla-models-objective-decoupled-optimization/',
    '/daily-paper/250520259/': '/daily-paper/lifelong-safety-alignment-for-language-models/',
    '/daily-paper/250600781/': '/daily-paper/cop-agentic-red-teaming-llms-composition-of-principles/',
    '/daily-paper/250600782/': '/daily-paper/jailbreak-r1-exploring-jailbreak-capabilities-reinforcement-learning/',
    '/daily-paper/250602479/': '/daily-paper/bitbypass-jailbreaking-llms-bitstream-camouflage/',
    '/daily-paper/250609937/': '/daily-paper/safe-multitask-failure-detection-vla-models/',
    '/daily-paper/250614697/': '/daily-paper/agentsafe-embodied-safety-benchmark/',
    '/daily-paper/250616012/': '/daily-paper/dualthor-dual-arm-humanoid-simulation-contingency-aware-planning/',
    '/daily-paper/250616402/': '/daily-paper/is-bench-evaluating-interactive-safety-vlm-embodied-agents/',
    '/daily-paper/250711500/': '/daily-paper/armor-reasoning-based-safety-alignment-llm-jailbreak-defense/',
    '/daily-paper/250713474/': '/daily-paper/paper-summary-attack/',
    '/daily-paper/250903383/': '/daily-paper/annie-adversarial-safety-attacks-embodied-ai-vla-robots/',
    '/daily-paper/250909708/': '/daily-paper/beyond-im-sorry-i-cant-dissecting-llm-refusal/',
    '/daily-paper/250911629/': '/daily-paper/reasoned-safety-alignment-jailbreak-defense-answer-then-check/',
    '/daily-paper/250914687/': '/daily-paper/realmirror-comprehensive-vla-platform-embodied-ai/',
    '/daily-paper/250919870/': '/daily-paper/freezevla-action-freezing-attacks-against-vla-models/',
    '/daily-paper/251001642/': '/daily-paper/failsafe-reasoning-recovery-failures-vision-language-action-models/',
    '/daily-paper/251005156/': '/daily-paper/veriguard-llm-agent-safety-verified-code-generation/',
    '/daily-paper/251006036/': '/daily-paper/refusal-falls-off-a-cliff-safety-alignment-fails-in-reasoning/',
    '/daily-paper/251009269/': '/daily-paper/goba-goal-oriented-backdoor-attack-vla-physical-objects/',
    '/daily-paper/251010932/': '/daily-paper/dropvla-action-level-backdoor-attack-vla-models/',
    '/daily-paper/251017111/': '/daily-paper/efficient-vla-models-embodied-manipulation-survey/',
    '/daily-paper/251101375/': '/daily-paper/align-to-misalign-automatic-llm-jailbreak-meta-optimized-judges/',
    '/daily-paper/251105936/': '/daily-paper/ten-open-challenges-vision-language-action-models/',
    '/daily-paper/251112149/': '/daily-paper/attackvla-benchmarking-adversarial-backdoor-attacks-vla-models/',
    '/daily-paper/251116203/': '/daily-paper/when-alignment-fails-multimodal-adversarial-attacks-vla-models/',
    '/daily-paper/251118397/': '/daily-paper/natural-emergent-misalignment-from-reward-hacking-in-production-rl/',
    '/daily-paper/251121663/': '/daily-paper/attention-guided-patch-wise-sparse-adversarial-attacks-vla-models/',
    '/daily-paper/251122047/': '/daily-paper/evaluating-robustness-llm-safety-guardrails-adversarial-attacks/',
    '/daily-paper/251207059/': '/daily-paper/replicating-tempest-scale-multi-turn-adversarial-attacks-frontier-models/',
    '/daily-paper/251211362/': '/daily-paper/anatomy-of-vla-models-modules-milestones-challenges/',
    '/daily-paper/251211891/': '/daily-paper/vlsa-aegis-vla-plug-and-play-safety-constraint-layer/',
    '/daily-paper/251220798/': '/daily-paper/benchmark-outcome-driven-constraint-violations-autonomous-ai-agents/',
    '/daily-paper/251221815/': '/daily-paper/few-tokens-matter-entropy-guided-attacks-vision-language-models/',
    '/daily-paper/260110543/': '/daily-paper/in-decoding-safety-probing-defense-llm-jailbreaks/',
    '/daily-paper/260110589/': '/daily-paper/be-your-own-red-teamer-self-play-safety-alignment/',
    '/daily-paper/260115331/': '/daily-paper/recap-resource-efficient-adversarial-prompting-llm-red-teaming/',
    '/daily-paper/260203402/': '/daily-paper/risk-awareness-injection-calibrating-vlms-safety/',
    '/daily-paper/260204521/': '/daily-paper/circuit-restricted-weight-arithmetic-selective-refusal-llm/',
    '/daily-paper/260206556/': '/daily-paper/libero-x-robustness-litmus-vision-language-action-models/',
    '/daily-paper/260218739/': '/daily-paper/when-world-models-dream-wrong-adversarial-attacks-world-models/',
    '/daily-paper/260221531/': '/daily-paper/lilo-vla-compositional-long-horizon-manipulation-via-linked-object-centric-poli/',
    '/daily-paper/260221595/': '/daily-paper/spoc-safety-aware-planning-under-partial-observability-and-physical-constraints/',
    '/daily-paper/260221625/': '/daily-paper/tacmap-bridging-the-tactile-sim-to-real-gap-via-geometry-consistent-penetration/',
    '/daily-paper/260221633/': '/daily-paper/self-correcting-vla-online-action-refinement-via-sparse-world-imagination/',
    '/daily-paper/260221723/': '/daily-paper/lessmimic-long-horizon-humanoid-interaction-with-unified-distance-field-represe/',
    '/daily-paper/260222452/': '/daily-paper/cwm-contrastive-world-models-for-action-feasibility-learning-in-embodied-agent/',
    '/daily-paper/260223109/': '/daily-paper/towards-intelligible-human-robot-interaction-an-active-inference-approach-to-oc/',
    '/daily-paper/260224009/': '/daily-paper/jailbreak-foundry/',
    '/daily-paper/260310091/': '/daily-paper/multi-stream-perturbation-attack/',
    '/daily-paper/260311975/': '/daily-paper/homesafe-bench-unsafe-action-detection-embodied-household/',
    '/daily-paper/260314975/': '/daily-paper/why-agents-compromise-safety-under-pressure/',
    '/daily-paper/260315684/': '/daily-paper/state-dependent-safety-failures-multi-turn/',
    '/daily-paper/260317305/': '/daily-paper/craft-contrastive-reasoning-alignment-hidden-representations/',
    '/daily-paper/260321697/': '/daily-paper/structured-visual-narratives-undermine-safety-alignment-multimodal-llms/',
    '/daily-paper/260322126/': '/daily-paper/robogate-adaptive-failure-discovery-safe-robot-policy-deployment/',
    '/daily-paper/260323271/': '/daily-paper/a-multimodal-framework-for-human-multi-agent-interaction/',
    '/daily-paper/260323983/': '/daily-paper/safeflow-real-time-text-driven-humanoid-whole-body-control-via-physics-guided-r/',
    '/daily-paper/260324414/': '/daily-paper/clawkeeper-comprehensive-safety-protection-openclaw-agents/',
    '/daily-paper/260325044/': '/daily-paper/thermoact-thermal-aware-vision-language-action-models-for-robotic-perception-and/',
    '/daily-paper/260325063/': '/daily-paper/topopilot-reliable-conversational-workflow-automation-for-topological-data-anal/',
    '/daily-paper/260325103/': '/daily-paper/layer-specific-lipschitz-modulation-for-fault-tolerant-multimodal-representation/',
    '/daily-paper/260325727/': '/daily-paper/back-to-basics-revisiting-asr-in-the-age-of-voice-agents/',
    '/daily-paper/260328301/': '/daily-paper/libero-para-diagnostic-benchmark-paraphrase-robustness-vla-models/',
    '/daily-paper/260401194/': '/daily-paper/agentwatcher-rule-based-prompt-injection-monitor/',
    '/daily-paper/260401618/': '/daily-paper/tex3d-adversarial-3d-textures-vision-language-action-models/',
    '/daily-paper/260404759/': '/daily-paper/your-agent-their-asset-real-world-safety-analysis-openclaw/',
    '/daily-paper/260407754/': '/daily-paper/art-of-misalignment-fine-tuning-misalign-realign-llms/',
    '/daily-paper/260415579/': '/daily-paper/symbolic-guardrails-domain-specific-agents-safety-security/',
    '/daily-paper/260418463/': '/daily-paper/using-llms-for-embodied-planning-introduces-systematic-safety-risks/',
    '/daily-paper/260419638/': '/daily-paper/safety-alfred-evaluating-safety-conscious-planning-multimodal-llm/',
    '/daily-paper/260421691/': '/daily-paper/there-will-be-a-scientific-theory-of-deep-learning/',
    '/daily-paper/260423775/': '/daily-paper/vision-language-action-safety-threats-challenges-evaluations-mechanisms/',
    '/daily-paper/260424826/': '/daily-paper/comparative-evaluation-ai-agent-security-guardrails/',

    // Facebook-post 404 remediation (#951): facebook_publisher.py's pre-7b3b15e05 URL
    // generation for daily-paper posts used two different broken schemes depending on
    // path/date, neither of which matches Astro's real route (paper.id with the date
    // prefix stripped, via github-slugger's `slug()` — non-alphanumeric/non-hyphen
    // characters removed, not hyphenated). Sources below are the literal broken URLs
    // confirmed live in published Facebook posts (tools/social/audit_facebook_links.py
    // run 2026-07-01, runs/facebook_link_audit_2026-07-01/audit.json); destinations
    // verified live (200) against production before landing.
    '/daily-paper/2026-01-24-230205733/': '/daily-paper/230205733/',
    '/daily-paper/2026-01-25-230212173/': '/daily-paper/230212173/',
    '/daily-paper/2026-01-26-230513860/': '/daily-paper/230513860/',
    '/daily-paper/2026-01-27-230605499/': '/daily-paper/230605499/',
    '/daily-paper/2026-01-28-230715043/': '/daily-paper/230715043/',
    '/daily-paper/2026-01-29-230803825/': '/daily-paper/do-anything-now-characterizing-and-evaluating-in-the-wild-jailbreak-prompts-on-l/',
    '/daily-paper/2026-01-30-230900614/': '/daily-paper/baseline-defenses-for-adversarial-attacks-against-aligned-language-models/',
    '/daily-paper/2026-01-31-231003684/': '/daily-paper/smoothllm-defending-large-language-models-against-jailbreaking-attacks/',
    '/daily-paper/2026-02-01-231003693/': '/daily-paper/fine-tuning-aligned-language-models-compromises-safety-even-when-users-do-not-i/',
    '/daily-paper/2026-02-02-231008419/': '/daily-paper/231008419/',
    '/daily-paper/2026-02-03-231010844/': '/daily-paper/survey-of-vulnerabilities-in-large-language-models-revealed-by-adversarial-attac/',
    '/daily-paper/2026-02-04-240105566/': '/daily-paper/sleeper-agents-training-deceptive-llms-that-persist-through-safety-training/',
    '/daily-paper/2026-02-05-240200888/': '/daily-paper/security-and-privacy-challenges-of-large-language-models-a-survey/',
    '/daily-paper/2026-02-06-240205162/': '/daily-paper/240205162/',
    '/daily-paper/2026-02-07-240401318/': '/daily-paper/jailbreakbench-an-open-robustness-benchmark-for-jailbreaking-large-language-mod/',
    '/daily-paper/2026-02-08-240608705/': '/daily-paper/when-llm-meets-drl-advancing-jailbreaking-efficiency-via-drl-guided-search/',
    '/daily-paper/2026-02-09-240618510/': '/daily-paper/wildteaming-at-scale-from-in-the-wild-jailbreaks-to-adversarially-safer-langu/',
    '/daily-paper/2026-02-10-240704295/': '/daily-paper/jailbreak-attacks-and-defenses-against-large-language-models-a-survey/',
    '/daily-paper/2026-02-11-240716686/': '/daily-paper/can-large-language-models-automatically-jailbreak-gpt-4v/',
    '/daily-paper/2026-02-12-240802946/': '/daily-paper/240802946/',
    '/daily-paper/2026-02-13-241214093/': '/daily-paper/alignment-faking-in-large-language-models/',
    '/daily-paper/2026-02-14-250210794/': '/daily-paper/250210794/',
    '/daily-paper/2026-02-15-250304760/': '/daily-paper/agentic-ai-and-the-cyber-arms-race/',
    '/daily-paper/2026-02-16-260213551/': '/daily-paper/260213551/',
    '/daily-paper/2026-02-17-260219107/': '/daily-paper/260219107/',
    '/daily-paper/2026-02-18-260219304/': '/daily-paper/260219304/',
    '/daily-paper/2026-02-19-260219948/': '/daily-paper/260219948/',
    '/daily-paper/2026-02-20-260220729/': '/daily-paper/260220729/',
    '/daily-paper/2026-02-21-260220813/': '/daily-paper/pressure-reveals-character-behavioural-alignment-evaluation-at-depth/',
    '/daily-paper/2026-02-22-260220958/': '/daily-paper/260220958/',
    '/daily-paper/2026-02-23-260221015/': '/daily-paper/260221015/',
    '/daily-paper/2026-02-24-260221157/': '/daily-paper/260221157/',
    '/daily-paper/2026-02-25-260221161/': '/daily-paper/260221161/',
    '/daily-paper/2026-02-28-260222514/': '/daily-paper/260222514/',
    '/daily-paper/2026-03-01-lessmimic-long-horizon-humanoid-interaction-with-unified-distance-field-represe/': '/daily-paper/lessmimic-long-horizon-humanoid-interaction-with-unified-distance-field-represe/',
    '/daily-paper/2026-03-02-compress-the-easy-explore-the-hard-difficulty-aware-entropy-regularization-for/': '/daily-paper/compress-the-easy-explore-the-hard-difficulty-aware-entropy-regularization-for/',
    '/daily-paper/2026-03-03-towards-intelligible-human-robot-interaction-an-active-inference-approach-to-oc/': '/daily-paper/towards-intelligible-human-robot-interaction-an-active-inference-approach-to-oc/',
    '/daily-paper/2026-03-05-spoc-safety-aware-planning-under-partial-observability-and-physical-constraints/': '/daily-paper/spoc-safety-aware-planning-under-partial-observability-and-physical-constraints/',
    '/daily-paper/2026-03-06-lilo-vla-compositional-long-horizon-manipulation-via-linked-object-centric-poli/': '/daily-paper/lilo-vla-compositional-long-horizon-manipulation-via-linked-object-centric-poli/',
    '/daily-paper/2026-03-07-cwm-contrastive-world-models-for-action-feasibility-learning-in-embodied-agent/': '/daily-paper/cwm-contrastive-world-models-for-action-feasibility-learning-in-embodied-agent/',
    '/daily-paper/2026-03-08-self-correcting-vla-online-action-refinement-via-sparse-world-imagination/': '/daily-paper/self-correcting-vla-online-action-refinement-via-sparse-world-imagination/',
    '/daily-paper/2026-03-09-tree-of-attacks-jailbreaking-black-box-llms-automatically/': '/daily-paper/tree-of-attacks-jailbreaking-black-box-llms-automatically/',
    '/daily-paper/2026-03-10-visual-adversarial-examples-jailbreak-aligned-large-language-models/': '/daily-paper/visual-adversarial-examples-jailbreak-aligned-large-language-models/',
    '/daily-paper/2026-03-11-deepinception-hypnotize-large-language-model-to-be-jailbreaker/': '/daily-paper/deepinception-hypnotize-large-language-model-to-be-jailbreaker/',
    '/daily-paper/2026-03-13-260301414/': '/daily-paper/260301414/',
    '/daily-paper/2026-03-14-260313151/': '/daily-paper/260313151/',
    '/daily-paper/2026-03-15-260306130/': '/daily-paper/260306130/',
    '/daily-paper/2026-03-16-260314124/': '/daily-paper/260314124/',
    '/daily-paper/2026-03-16-260314975/': '/daily-paper/why-agents-compromise-safety-under-pressure/',
    '/daily-paper/2026-03-17-260304904/': '/daily-paper/260304904/',
    '/daily-paper/2026-03-18-260312681/': '/daily-paper/260312681/',
    '/daily-paper/2026-03-18-260317368/': '/daily-paper/towards-safer-large-reasoning-models-by-promoting-safety-decision-making-before-/',
    '/daily-paper/2026-03-19-260315973/': '/daily-paper/260315973/',
    '/daily-paper/2026-03-27-g0dm0d3-modular-framework-llm-robustness-evaluation/': '/daily-paper/g0dm0d3-modular-framework-llm-robustness-evaluation/',
    '/daily-paper/2026-03-28-topopilot-reliable-conversational-workflow-automation-for-topological-data-anal/': '/daily-paper/topopilot-reliable-conversational-workflow-automation-for-topological-data-anal/',
    '/daily-paper/2026-03-29-260325044/': '/daily-paper/thermoact-thermal-aware-vision-language-action-models-for-robotic-perception-and/',
    '/daily-paper/2026-03-30-260325727/': '/daily-paper/back-to-basics-revisiting-asr-in-the-age-of-voice-agents/',
    '/daily-paper/2026-04-01-260323983/': '/daily-paper/safeflow-real-time-text-driven-humanoid-whole-body-control-via-physics-guided-r/',
    '/daily-paper/2026-04-02-260325103/': '/daily-paper/layer-specific-lipschitz-modulation-for-fault-tolerant-multimodal-representation/',
    '/daily-paper/2026-04-03-260324329/': '/daily-paper/260324329/',
    '/daily-paper/gameplayqa-a-benchmarking-framework-for-decision-dense-pov-synced-multi-video-u/': '/daily-paper/260324329/',
  },
  build: {
    assets: 'assets'
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [
    // DSN and runtime init options live in sentry.client.config.js / sentry.server.config.js
    // per @sentry/astro deprecation (passing `dsn` to the integration is removed in a future version).
    sentry({
      sourceMapsUploadOptions: {
        project: 'failurefirst',
        org: 'adrian-wedd',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
    sitemap({
      filter: (page) => !page.includes('/moltbook/') || page.includes('/research/moltbook/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // Customize priority based on page type
        if (item.url === 'https://failurefirst.org/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/research/')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/blog/')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/policy/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/framework/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/docs/')) {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/about/')) {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }
        return item;
      },
    }),
  ],
});
