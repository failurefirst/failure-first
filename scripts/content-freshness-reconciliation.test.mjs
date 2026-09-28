/**
 * Deterministic behavioural tests for the content-freshness monitor's
 * fresh-state reconciliation (`scripts/content-freshness-reconciliation.mjs`).
 *
 * No network: every test drives the real module against a recording fake of
 * actions/github-script's octokit client, so the assertions are about the API
 * calls the production path would actually make. Run with
 *
 *   node --test scripts/content-freshness-reconciliation.test.mjs
 *
 * Cases required by failure-first#37:
 *   fresh close, repeat fresh no-op, unrelated issue preservation,
 *   stale path, unknown path, failed write/readback.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  ALERT_LABEL,
  FreshnessReconciliationError,
  MONITOR_TITLE,
  RECOVERY_MARKER,
  WORKFLOW_FILE,
  fileOrUpdateStaleAlert,
  reconcileFreshState,
} from './content-freshness-reconciliation.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WORKFLOW = path.join(HERE, '..', '.github', 'workflows', 'content-freshness-monitor.yml');

const OWNER = 'adrianwedd';
const REPO = 'failure-first';

const FRESH = Object.freeze({
  status: 'fresh',
  latest_commit_iso: '2026-09-28T10:18:14+10:00',
  latest_commit_sha: '48fccdceeb3c86601a6b8e9e80084fc709f95a9d',
  age_hours: 26,
  threshold_hours: 48,
  run_head_sha: '9f2c1d4b7a6e5f8091a2b3c4d5e6f708192a3b4c',
  run_url: 'https://github.com/adrianwedd/failure-first/actions/runs/12345',
});

const STALE = Object.freeze({
  latest_commit_iso: '2026-09-05T10:17:41+10:00',
  age_hours: 60,
  threshold_hours: 48,
});

function makeIssue(number, overrides = {}) {
  return {
    number,
    title: MONITOR_TITLE,
    state: 'open',
    state_reason: null,
    labels: [{ name: ALERT_LABEL }],
    ...overrides,
  };
}

/**
 * A recording fake of the octokit surface the module uses. `issues` is the
 * mutable tracker state; every call is logged as `METHOD path`.
 */
function makeGithub({
  issues = [],
  failures = {},
  comments = {},
} = {}) {
  const log = [];
  const closed = [];
  const createdComments = [];
  const createdIssues = [];
  const state = new Map(issues.map((issue) => [issue.number, { ...issue }]));
  const commentsByIssue = new Map(Object.entries(comments).map(([k, v]) => [Number(k), v.slice()]));

  const maybeFail = (key) => {
    if (failures[key]) {
      const status = failures[key];
      // realistic octokit-shaped errors: 403 is the integration's own wording,
      // 5xx comes back as a server error
      const detail =
        status === 403 ? 'Resource not accessible by integration' : 'Server Error';
      const err = new Error(`${key} failed: HTTP ${status} ${detail}`);
      err.status = status;
      throw err;
    }
  };

  const rest = {
    issues: {
      listForRepo: async (params) => {
        log.push(`GET listForRepo ${params.state} ${params.labels}`);
        maybeFail('list');
        return { data: [...state.values()] };
      },
      listComments: async (params) => {
        log.push(`GET listComments ${params.issue_number}`);
        maybeFail('listComments');
        return { data: (commentsByIssue.get(params.issue_number) || []).slice() };
      },
      createComment: async (params) => {
        log.push(`POST createComment ${params.issue_number}`);
        maybeFail('createComment');
        createdComments.push({ issue_number: params.issue_number, body: params.body });
        const list = commentsByIssue.get(params.issue_number) || [];
        list.push({ body: params.body });
        commentsByIssue.set(params.issue_number, list);
        return { data: { id: 1000 + createdComments.length } };
      },
      create: async (params) => {
        log.push('POST create');
        maybeFail('create');
        const number = 900 + createdIssues.length;
        createdIssues.push({ number, ...params });
        state.set(number, {
          number,
          title: params.title,
          state: 'open',
          state_reason: null,
          labels: (params.labels || []).map((name) => ({ name })),
        });
        return { data: state.get(number) };
      },
      update: async (params) => {
        log.push(`PATCH update ${params.issue_number} ${params.state}/${params.state_reason}`);
        maybeFail('update');
        const issue = state.get(params.issue_number);
        assert.ok(issue, `update targeted a non-existent issue #${params.issue_number}`);
        closed.push(params.issue_number);
        issue.state = params.state;
        issue.state_reason = params.state_reason;
        return { data: issue };
      },
      get: async (params) => {
        log.push(`GET get ${params.issue_number}`);
        maybeFail('get');
        return { data: { ...state.get(params.issue_number) } };
      },
    },
  };

  return {
    github: {
      rest,
      paginate: async (fn, params) => {
        const result = await fn(params);
        return result.data;
      },
    },
    log,
    writes: () => log.filter((entry) => entry.startsWith('POST') || entry.startsWith('PATCH')),
    closed,
    createdComments,
    createdIssues,
    state,
  };
}

// --------------------------------------------------------------------------
// 1. fresh close
// --------------------------------------------------------------------------

test('fresh run closes the monitor alert with a measured receipt and reads it back CLOSED', async () => {
  const fake = makeGithub({ issues: [makeIssue(37)] });
  const result = await reconcileFreshState({
    github: fake.github,
    owner: OWNER,
    repo: REPO,
    measurement: FRESH,
  });

  assert.equal(result.action, 'closed');
  assert.deepEqual(result.closed, [37]);
  assert.deepEqual(result.commented, [37]);

  // one comment + one close + one readback, in that order
  assert.deepEqual(fake.log, [
    `GET listForRepo open ${ALERT_LABEL}`,
    'GET listComments 37',
    'POST createComment 37',
    'PATCH update 37 closed/completed',
    'GET get 37',
  ]);

  const receipt = fake.createdComments[0].body;
  assert.ok(receipt.startsWith(RECOVERY_MARKER));
  assert.match(receipt, /48fccdceeb3c/);                 // measured latest content commit
  assert.match(receipt, /2026-09-28T10:18:14\+10:00/);   // measured commit time
  assert.match(receipt, /\*\*26h\*\*/);                  // measured age
  assert.match(receipt, /limit 48h/);                    // threshold in force
  assert.match(receipt, /actions\/runs\/12345/);         // run evidence
  assert.match(receipt, /9f2c1d4b7a6e/);                 // run head commit
  assert.match(receipt, new RegExp(WORKFLOW_FILE.replace('.', '\\.')));
  assert.equal(fake.state.get(37).state, 'closed');
  assert.equal(fake.state.get(37).state_reason, 'completed');
});

test('only exact monitor titles are reconciled, including an exact duplicate', async () => {
  const fake = makeGithub({
    issues: [
      makeIssue(37),
      makeIssue(51, { title: 'Content publish cadence stale (auto-filed) ' }), // near match
      makeIssue(52),                                                           // exact duplicate
      makeIssue(62, { title: 'Content publish cadence stale' }),               // different title
      makeIssue(63, { title: MONITOR_TITLE, pull_request: { url: 'x' } }),     // a PR
    ],
  });
  const result = await reconcileFreshState({
    github: fake.github,
    owner: OWNER,
    repo: REPO,
    measurement: FRESH,
  });

  assert.deepEqual(result.closed, [37, 52]);
  assert.deepEqual(fake.closed, [37, 52]);
  assert.equal(fake.state.get(51).state, 'open');
  assert.equal(fake.state.get(62).state, 'open');
  assert.equal(fake.state.get(63).state, 'open');
});

// --------------------------------------------------------------------------
// 2. repeat fresh run: no-op
// --------------------------------------------------------------------------

test('a repeated fresh run with no matching open alert makes zero issue writes', async () => {
  const fake = makeGithub({ issues: [] });
  const lines = [];
  const result = await reconcileFreshState({
    github: fake.github,
    owner: OWNER,
    repo: REPO,
    measurement: FRESH,
    log: (line) => lines.push(line),
  });

  assert.equal(result.action, 'noop');
  assert.deepEqual(result.closed, []);
  assert.deepEqual(result.commented, []);
  assert.deepEqual(fake.writes(), []);
  assert.deepEqual(fake.log, [`GET listForRepo open ${ALERT_LABEL}`]);
  assert.match(lines.join('\n'), /zero issue writes/);
});

test('the day after a close, the alert is closed so the run is a no-op (no writes at all)', async () => {
  const fake = makeGithub({
    issues: [makeIssue(37), makeIssue(70, { title: 'Unrelated labelled issue' })],
  });
  await reconcileFreshState({ github: fake.github, owner: OWNER, repo: REPO, measurement: FRESH });
  const firstRunWrites = fake.writes().length;
  assert.ok(firstRunWrites > 0, 'first run must actually close the alert');

  // The list endpoint returns open issues only; the closed alert drops out.
  fake.state.delete(37);
  fake.log.length = 0;
  const second = await reconcileFreshState({
    github: fake.github,
    owner: OWNER,
    repo: REPO,
    measurement: FRESH,
  });

  assert.equal(second.action, 'noop');
  assert.deepEqual(fake.writes(), []);
  assert.equal(fake.state.get(70).state, 'open');
});

test('a run that finds the alert still open but already receipted does not post a duplicate receipt', async () => {
  const fake = makeGithub({
    issues: [makeIssue(37)],
    comments: {
      37: [
        { body: 'Still stale as of this run: 229h since 2026-09-05T10:17:41+10:00.' },
        {
          body: `${RECOVERY_MARKER}\nnewest content commit \`48fccdceeb3c\` ...`,
        },
      ],
    },
  });
  const result = await reconcileFreshState({
    github: fake.github,
    owner: OWNER,
    repo: REPO,
    measurement: FRESH,
  });

  assert.deepEqual(result.commented, [], 'no second receipt');
  assert.deepEqual(result.closed, [37]);
  assert.equal(fake.createdComments.length, 0);
  assert.deepEqual(
    fake.log.filter((line) => !line.startsWith('GET listComments')),
    [
      `GET listForRepo open ${ALERT_LABEL}`,
      'PATCH update 37 closed/completed',
      'GET get 37',
    ]
  );
  assert.equal(fake.state.get(37).state, 'closed');
});

// --------------------------------------------------------------------------
// 3. unrelated issue preservation
// --------------------------------------------------------------------------

test('fresh run leaves unrelated issues alone: no comment, no close, no readback on them', async () => {
  const fake = makeGithub({
    issues: [
      makeIssue(12, { title: 'Podcast feed 404s on the enclosures' }),
      makeIssue(37),
      makeIssue(64, { title: 'Content publish cadence stale (auto-filed?)' }),
    ],
  });
  await reconcileFreshState({ github: fake.github, owner: OWNER, repo: REPO, measurement: FRESH });

  const touched = [...fake.log].filter((line) => !line.startsWith('GET listForRepo'));
  assert.deepEqual(touched, [
    'GET listComments 37',
    'POST createComment 37',
    'PATCH update 37 closed/completed',
    'GET get 37',
  ]);
  for (const number of [12, 64]) {
    assert.equal(fake.state.get(number).state, 'open');
    assert.equal(fake.state.get(number).state_reason, null);
  }
  assert.equal(fake.createdComments.length, 1);
});

test('a labelled issue whose title merely starts with the monitor title is not matched', async () => {
  const fake = makeGithub({
    issues: [makeIssue(80, { title: `${MONITOR_TITLE} — 2026-09-05` })],
  });
  const result = await reconcileFreshState({
    github: fake.github,
    owner: OWNER,
    repo: REPO,
    measurement: FRESH,
  });

  assert.equal(result.action, 'noop');
  assert.deepEqual(fake.writes(), []);
  assert.equal(fake.state.get(80).state, 'open');
});

// --------------------------------------------------------------------------
// 4. stale path (unchanged semantics)
// --------------------------------------------------------------------------

test('stale run comments on the existing monitor alert, never closes it', async () => {
  const fake = makeGithub({ issues: [makeIssue(37), makeIssue(12, { title: 'Other issue' })] });
  const result = await fileOrUpdateStaleAlert({
    github: fake.github,
    owner: OWNER,
    repo: REPO,
    measurement: STALE,
  });

  assert.equal(result.action, 'commented');
  assert.equal(result.issue_number, 37);
  assert.equal(fake.createdComments.length, 1);
  assert.match(fake.createdComments[0].body, /Still stale as of this run: 60h since 2026-09-05T10:17:41\+10:00\./);
  assert.equal(fake.createdComments[0].issue_number, 37);
  assert.deepEqual(fake.closed, []);
  assert.equal(fake.createdIssues.length, 0);
  assert.equal(fake.state.get(12).state, 'open');
});

test('stale run with no matching alert files one, with the label, and still never closes anything', async () => {
  const fake = makeGithub({ issues: [makeIssue(12, { title: 'Other issue' })] });
  const result = await fileOrUpdateStaleAlert({
    github: fake.github,
    owner: OWNER,
    repo: REPO,
    measurement: STALE,
  });

  assert.equal(result.action, 'created');
  assert.equal(fake.createdIssues.length, 1);
  assert.equal(fake.createdIssues[0].title, MONITOR_TITLE);
  assert.deepEqual(fake.createdIssues[0].labels, [ALERT_LABEL]);
  assert.match(fake.createdIssues[0].body, /Age: 60 hours/);
  assert.deepEqual(fake.closed, []);
});

// --------------------------------------------------------------------------
// 5. unknown / unusable measurement
// --------------------------------------------------------------------------

test('an unknown status cannot close anything and makes no API call', async () => {
  const fake = makeGithub({ issues: [makeIssue(37)] });
  await assert.rejects(
    () =>
      reconcileFreshState({
        github: fake.github,
        owner: OWNER,
        repo: REPO,
        measurement: { ...FRESH, status: 'unknown' },
      }),
    FreshnessReconciliationError
  );
  assert.deepEqual(fake.log, []);
  assert.equal(fake.state.get(37).state, 'open');
});

test('a missing status cannot close anything', async () => {
  const fake = makeGithub({ issues: [makeIssue(37)] });
  await assert.rejects(
    () => reconcileFreshState({ github: fake.github, owner: OWNER, repo: REPO, measurement: {} }),
    FreshnessReconciliationError
  );
  assert.deepEqual(fake.log, []);
});

test('fresh status with an unusable measurement cannot close anything', async () => {
  const cases = [
    { ...FRESH, age_hours: undefined },
    { ...FRESH, age_hours: -1 },
    { ...FRESH, age_hours: '26' },
    { ...FRESH, latest_commit_iso: '' },
    { ...FRESH, threshold_hours: 0 },
    { ...FRESH, latest_commit_sha: '' },
    { ...FRESH, latest_commit_sha: 'not-a-sha' },
    { ...FRESH, run_url: '' },
    { ...FRESH, run_url: 'actions/runs/12345' },
    { ...FRESH, run_head_sha: '' },
  ];
  for (const measurement of cases) {
    const fake = makeGithub({ issues: [makeIssue(37)] });
    await assert.rejects(
      () => reconcileFreshState({ github: fake.github, owner: OWNER, repo: REPO, measurement }),
      FreshnessReconciliationError,
      `expected refusal for ${JSON.stringify({ ...measurement, latest_commit_sha: undefined })}`
    );
    assert.deepEqual(fake.log, [], 'refusal happens before any API call');
    assert.equal(fake.state.get(37).state, 'open');
  }
});

// --------------------------------------------------------------------------
// 6. failed write / failed readback
// --------------------------------------------------------------------------

test('a failed readback fails loudly instead of claiming recovery', async () => {
  const fake = makeGithub({ issues: [makeIssue(37)], failures: { get: 403 } });
  await assert.rejects(
    () => reconcileFreshState({ github: fake.github, owner: OWNER, repo: REPO, measurement: FRESH }),
    /403 Resource not accessible/
  );
  assert.deepEqual(fake.closed, [37], 'the close request did go out');
});

test('a readback that still reports open fails loudly instead of claiming recovery', async () => {
  const fake = makeGithub({ issues: [makeIssue(37)] });
  const original = fake.github.rest.issues.get;
  fake.github.rest.issues.get = async (params) => {
    await original(params);
    return { data: { number: params.issue_number, state: 'open', state_reason: null } };
  };
  await assert.rejects(
    () => reconcileFreshState({ github: fake.github, owner: OWNER, repo: REPO, measurement: FRESH }),
    /readback for #37 reports state 'open'/
  );
});

test('a readback with the wrong state_reason fails loudly instead of claiming recovery', async () => {
  const fake = makeGithub({ issues: [makeIssue(37)] });
  const original = fake.github.rest.issues.get;
  fake.github.rest.issues.get = async (params) => {
    await original(params);
    return { data: { number: params.issue_number, state: 'closed', state_reason: 'not_planned' } };
  };
  await assert.rejects(
    () => reconcileFreshState({ github: fake.github, owner: OWNER, repo: REPO, measurement: FRESH }),
    /state_reason 'not_planned'/
  );
});

test('a failed comment write propagates and nothing is closed', async () => {
  const fake = makeGithub({ issues: [makeIssue(37)], failures: { createComment: 403 } });
  await assert.rejects(
    () => reconcileFreshState({ github: fake.github, owner: OWNER, repo: REPO, measurement: FRESH }),
    /403 Resource not accessible/
  );
  assert.deepEqual(fake.closed, []);
  assert.equal(fake.state.get(37).state, 'open');
});

test('a failed issue listing fails the reconciliation instead of reporting a no-op', async () => {
  const fake = makeGithub({ issues: [], failures: { list: 500 } });
  await assert.rejects(
    () => reconcileFreshState({ github: fake.github, owner: OWNER, repo: REPO, measurement: FRESH }),
    /500/
  );
});

// --------------------------------------------------------------------------
// 7. the workflow file itself: wiring, permissions, semantics preserved
// --------------------------------------------------------------------------

test('the workflow keeps issues:write / contents:read and no repository write grant', () => {
  const yaml = readFileSync(WORKFLOW, 'utf8');
  const permissions = yaml.slice(yaml.indexOf('permissions:'), yaml.indexOf('jobs:'));
  assert.match(permissions, /contents: read/);
  assert.match(permissions, /issues: write/);
  assert.doesNotMatch(yaml, /^\s*contents: write/m);
  assert.doesNotMatch(yaml, /^\s*packages: write/m);
  assert.doesNotMatch(yaml, /^\s*pull-requests: write/m);
  assert.doesNotMatch(yaml, /^\s*actions: write/m);
  assert.doesNotMatch(yaml, /permissions: write-all/);
});

test('the workflow still fails the job on staleness and still gates writes behind the measurement', () => {
  const yaml = readFileSync(WORKFLOW, 'utf8');
  assert.match(yaml, /name: Fail the job on staleness\n\s+if: steps\.freshness\.outputs\.stale == 'true'\n\s+run: exit 1/);
  assert.match(yaml, /name: File or update staleness issue\n\s+if: always\(\) && steps\.freshness\.outputs\.stale == 'true'/);
  assert.match(yaml, /name: Reconcile recovered \(fresh\) state\n\s+if: success\(\) && steps\.freshness\.outputs\.stale == 'false'/);
  // the freshness shell step still emits the unknown state on missing history
  assert.match(yaml, /echo "stale=unknown" >> "\$GITHUB_OUTPUT"/);
  assert.match(yaml, /MAX_AGE_HOURS=48/);
  assert.match(yaml, /site\/src\/content\/daily-paper\/ \\\n\s+site\/src\/content\/blog\/ \\\n\s+site\/src\/content\/ai-safety-daily\//);
  // the reconciliation step runs only on success() -- a failed freshness step
  // (stale=unknown, exit 1) can never reach it
  assert.doesNotMatch(yaml, /name: Reconcile recovered \(fresh\) state\n\s+if: always\(\)/);
});

test('the workflow imports the tested module rather than embedding the reconciliation logic', () => {
  const yaml = readFileSync(WORKFLOW, 'utf8');
  const imports = yaml.match(/await import\(pathToFileURL\(process\.env\.SCRIPT_PATH\)\.href\)/g) || [];
  assert.equal(imports.length, 2, 'both github-script steps import the module');
  assert.equal((yaml.match(/await import\('node:url'\)/g) || []).length, 2);
  assert.match(yaml, /SCRIPT_PATH: \$\{\{ github\.workspace \}\}\/scripts\/content-freshness-reconciliation\.mjs/);
  assert.match(yaml, /const \{ fileOrUpdateStaleAlert \} = await import/);
  assert.match(yaml, /const \{ reconcileFreshState \} = await import/);
});

test('the module and the workflow agree on the alert title and label', () => {
  const yaml = readFileSync(WORKFLOW, 'utf8');
  const steps = yaml.slice(yaml.indexOf('jobs:'));
  // the title/label constants are the single source of truth in the module; the
  // workflow must not restate them (a second copy is how a monitor ends up
  // closing something it did not file)
  assert.doesNotMatch(steps, /Content publish cadence stale \(auto-filed\)/);
  assert.doesNotMatch(steps, /'content-freshness'/);
  assert.equal(MONITOR_TITLE, 'Content publish cadence stale (auto-filed)');
  assert.equal(ALERT_LABEL, 'content-freshness');
  assert.equal(WORKFLOW_FILE, 'content-freshness-monitor.yml');
});
