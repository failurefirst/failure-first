/**
 * Fresh-state reconciliation for `.github/workflows/content-freshness-monitor.yml`.
 *
 * The monitor could file and update a staleness alert but had no branch that
 * closed it once content commits resumed, so issue #37 sat OPEN carrying a
 * 5 September finding while the monitor itself ran green from 15 September.
 * This module supplies the missing half of the loop:
 *
 *   - FRESH:  close the exact alert the monitor filed (matched by label *and*
 *             exact title, never "the first labelled issue"), posting one
 *             measured recovery receipt with run/commit evidence, then read
 *             the issue back and require it to be CLOSED.
 *   - FRESH with no matching open alert: zero issue writes (not even a read
 *             of the alert's comments).
 *   - STALE:  unchanged -- comment on the open alert, or file it.
 *   - UNKNOWN / unusable measurement: refuse. No API call is made, so nothing
 *             can be closed on a measurement the monitor could not take.
 *
 * Any GitHub read/write failure propagates out of these functions. The caller
 * (the workflow step) turns that into a failed job; recovery is never claimed
 * on a call that did not land.
 *
 * All GitHub traffic goes through the client handed in -- the workflow passes
 * actions/github-script's octokit, the tests pass a recording fake -- so every
 * branch is exercised without network access.
 */

/** The exact title the monitor files its alert under. */
export const MONITOR_TITLE = 'Content publish cadence stale (auto-filed)';

/** The label the monitor files its alert under. */
export const ALERT_LABEL = 'content-freshness';

/** Idempotency marker so a retried run does not post a second receipt. */
export const RECOVERY_MARKER = '<!-- content-freshness-monitor:recovery -->';

/** The workflow file this module serves (used in rendered text). */
export const WORKFLOW_FILE = 'content-freshness-monitor.yml';

/** The content paths the cadence check measures, as rendered in issue text. */
export const CONTENT_PATHS_RENDERED = 'site/src/content/{daily-paper,blog,ai-safety-daily}/';

const SHA_RE = /^[0-9a-f]{7,40}$/i;

export class FreshnessReconciliationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FreshnessReconciliationError';
  }
}

export function shortSha(sha) {
  return typeof sha === 'string' ? sha.trim().slice(0, 12) : '';
}

/**
 * True only for an open issue that *is* this monitor's alert: same exact
 * title, and an issue rather than a pull request (the issues list endpoint
 * returns PRs too, and a labelled PR that happens to share the title must not
 * be closed by a freshness check).
 */
export function isMonitorAlert(issue) {
  return (
    Boolean(issue) &&
    !issue.pull_request &&
    typeof issue.title === 'string' &&
    issue.title === MONITOR_TITLE
  );
}

/**
 * Open, `content-freshness`-labelled issues whose title is exactly the
 * monitor's, oldest first. Paginated: never silently reconcile a subset.
 */
export async function listMonitorAlerts(github, { owner, repo }) {
  const labelled = await github.paginate(github.rest.issues.listForRepo, {
    owner,
    repo,
    state: 'open',
    labels: ALERT_LABEL,
    per_page: 100,
  });
  return labelled
    .filter(isMonitorAlert)
    .slice()
    .sort((a, b) => a.number - b.number);
}

function requireCadenceMeasurement(raw) {
  const m = raw || {};
  const problems = [];
  const iso = typeof m.latest_commit_iso === 'string' ? m.latest_commit_iso.trim() : '';
  if (iso === '') problems.push('latest_commit_iso');
  if (!Number.isInteger(m.age_hours) || m.age_hours < 0) problems.push('age_hours');
  if (!Number.isInteger(m.threshold_hours) || m.threshold_hours <= 0) problems.push('threshold_hours');
  if (problems.length > 0) {
    throw new FreshnessReconciliationError(
      `cadence measurement is not usable (${problems.join(', ')}); refusing to write to the issue tracker`
    );
  }
  return { latest_commit_iso: iso, age_hours: m.age_hours, threshold_hours: m.threshold_hours };
}

function requireRecoveryMeasurement(raw) {
  const m = requireCadenceMeasurement(raw);
  const source = raw || {};
  const sha = typeof source.latest_commit_sha === 'string' ? source.latest_commit_sha.trim() : '';
  const headSha = typeof source.run_head_sha === 'string' ? source.run_head_sha.trim() : '';
  const runUrl = typeof source.run_url === 'string' ? source.run_url.trim() : '';
  const problems = [];
  if (!SHA_RE.test(sha)) problems.push('latest_commit_sha');
  if (!SHA_RE.test(headSha)) problems.push('run_head_sha');
  if (!/^https:\/\/\S+$/.test(runUrl)) problems.push('run_url');
  if (problems.length > 0) {
    throw new FreshnessReconciliationError(
      `run/commit evidence is not usable (${problems.join(', ')}); refusing to claim recovery`
    );
  }
  return { ...m, latest_commit_sha: sha, run_head_sha: headSha, run_url: runUrl };
}

/**
 * The measured recovery receipt. Every figure in it was measured by the run
 * that is closing the alert; nothing here is inferred.
 */
export function renderRecoveryComment(measurement) {
  const m = requireRecoveryMeasurement(measurement);
  return [
    RECOVERY_MARKER,
    '**Content publish cadence recovered — closing this alert.**',
    '',
    `The newest commit touching \`${CONTENT_PATHS_RENDERED}\` is now **${m.age_hours}h** old (limit ${m.threshold_hours}h), so the condition this issue was filed for no longer holds.`,
    '',
    `- newest content commit: \`${shortSha(m.latest_commit_sha)}\` at ${m.latest_commit_iso}`,
    `- age at this run: ${m.age_hours}h (limit ${m.threshold_hours}h)`,
    `- measuring run: ${m.run_url} (head \`${shortSha(m.run_head_sha)}\`)`,
    `- closed as \`completed\` by \`${WORKFLOW_FILE}\`; a new alert is filed if commits stop landing again.`,
  ].join('\n');
}

/** The stale-path comment text, unchanged from the original monitor. */
export function renderStaleComment(measurement) {
  const m = requireCadenceMeasurement(measurement);
  return `Still stale as of this run: ${m.age_hours}h since ${m.latest_commit_iso}.`;
}

/** The stale-path issue body, unchanged from the original monitor. */
export function renderFindingBody(measurement) {
  const m = requireCadenceMeasurement(measurement);
  return [
    '## Finding',
    '',
    `No commit touching \`${CONTENT_PATHS_RENDERED}\` in over ${m.threshold_hours} hours.`,
    '',
    `- Newest content commit: ${m.latest_commit_iso}`,
    `- Age: ${m.age_hours} hours`,
    '',
    "This is a routine cadence check, not an operator escalation (per the vacation-readiness fire-door contract) -- filed as a durable, self-updating issue so the gap doesn't go silently unnoticed the way the 2026-08-10/08-14..17 gaps did. If this reflects an intentional pause (mirroring the AI Safety Daily pattern), close this issue noting the policy decision that covers it; otherwise this is a signal the private-repo publish pipeline needs attention.",
    '',
    `_Auto-filed by \`${WORKFLOW_FILE}\`._`,
  ].join('\n');
}

/**
 * STALE path: comment on this monitor's open alert, or file one. Unrelated
 * labelled issues are never touched, and this path never closes anything.
 */
export async function fileOrUpdateStaleAlert({ github, owner, repo, measurement }) {
  const m = requireCadenceMeasurement(measurement);
  const alerts = await listMonitorAlerts(github, { owner, repo });
  if (alerts.length > 0) {
    const target = alerts[0];
    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: target.number,
      body: renderStaleComment(m),
    });
    return { action: 'commented', issue_number: target.number, created: false };
  }
  const created = await github.rest.issues.create({
    owner,
    repo,
    title: MONITOR_TITLE,
    body: renderFindingBody(m),
    labels: [ALERT_LABEL],
  });
  return { action: 'created', issue_number: created.data.number, created: true };
}

async function hasRecoveryReceipt(github, { owner, repo, issueNumber, sha }) {
  const comments = await github.paginate(github.rest.issues.listComments, {
    owner,
    repo,
    issue_number: issueNumber,
    per_page: 100,
  });
  // the receipt renders the abbreviated commit, so match on that — otherwise a
  // retried run posts a second receipt for the same close.
  const needle = shortSha(sha);
  return comments.some(
    (comment) =>
      typeof comment.body === 'string' &&
      comment.body.includes(RECOVERY_MARKER) &&
      comment.body.includes(needle)
  );
}

/**
 * FRESH path: close the alert(s) this monitor filed, with a measured receipt
 * and a readback that has to say CLOSED.
 */
export async function reconcileFreshState({ github, owner, repo, measurement, log = () => {} }) {
  const status = measurement && typeof measurement.status === 'string' ? measurement.status.trim() : '';
  if (status !== 'fresh') {
    throw new FreshnessReconciliationError(
      `freshness status is '${status || 'unset'}', not 'fresh'; refusing to close anything`
    );
  }
  const m = requireRecoveryMeasurement(measurement);

  const alerts = await listMonitorAlerts(github, { owner, repo });
  if (alerts.length === 0) {
    log(`fresh run: no open '${MONITOR_TITLE}' alert -- zero issue writes`);
    return { action: 'noop', closed: [], commented: [] };
  }

  const closed = [];
  const commented = [];
  for (const alert of alerts) {
    const already = await hasRecoveryReceipt(github, {
      owner,
      repo,
      issueNumber: alert.number,
      sha: m.latest_commit_sha,
    });
    if (!already) {
      await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: alert.number,
        body: renderRecoveryComment(m),
      });
      commented.push(alert.number);
    }

    await github.rest.issues.update({
      owner,
      repo,
      issue_number: alert.number,
      state: 'closed',
      state_reason: 'completed',
    });

    const readback = await github.rest.issues.get({ owner, repo, issue_number: alert.number });
    const state = readback && readback.data ? readback.data.state : undefined;
    const reason = readback && readback.data ? readback.data.state_reason : undefined;
    if (state !== 'closed') {
      throw new FreshnessReconciliationError(
        `readback for #${alert.number} reports state '${state}'; refusing to report recovery`
      );
    }
    if (reason != null && reason !== 'completed') {
      throw new FreshnessReconciliationError(
        `readback for #${alert.number} reports state_reason '${reason}'; refusing to report recovery`
      );
    }

    closed.push(alert.number);
    log(`fresh run: closed alert #${alert.number}${already ? ' (receipt already posted)' : ''}`);
  }

  return { action: 'closed', closed, commented };
}
