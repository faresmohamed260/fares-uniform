# Gate D release-control plan

Status: **DEFERRED BY CLIENT — NOT APPLIED. PRODUCTION NO-GO.**

This plan defines the repository controls required before production deployment can be enabled. It records current GitHub state and a safe implementation sequence; it does not itself modify repository settings, create a production environment, select reviewers or authorize deployment.

## Audited current state

Read-only audit on 2026-09-16 at `main` source `3a516288cc8a9b5a65d9a6e529f4ec3d8c8346e4`:

| Control | Observed state |
| --- | --- |
| Repository visibility/default branch | Public / `main` |
| Repository rulesets | None |
| `main` branch protection | Not configured |
| GitHub deployment environments | None |
| Default Actions token | Read-only |
| Actions may approve pull requests | No |
| Secret scanning | Enabled |
| Secret-scanning push protection | Enabled |
| Dependabot security updates | Disabled |
| Open Dependabot alerts | 0 |
| Open code-scanning alerts | 0 |
| Open secret-scanning alerts | 0 |
| Repository Actions variables | None |
| Repository Actions secret names | Staging control plane only: `SUPABASE_ACCESS_TOKEN`, `VERCEL_TOKEN` |

Secret values were not read or emitted.

## Proposed `main` protection

Subject to explicit GD-10 approval:

- require pull requests before changes reach `main`;
- require at least one approving review by a person other than the author;
- dismiss stale approvals after source changes;
- require review conversations to be resolved;
- require the branch to be current before merge;
- block force pushes and branch deletion;
- allow bypass only for a separately named emergency-owner role;
- select required checks only after confirming they run reliably for both source and documentation-only pull requests.

Do not blindly require every historical phase check: that can make documentation-only or emergency recovery changes impossible. First add or identify a small exact release-integrity check that validates authority, documentation links and affected-path gates.

## Proposed protected `production` environment

Subject to explicit GD-02, GD-03 and GD-10 approval:

- allow deployments only from protected `main`;
- require an approved human reviewer role;
- prohibit self-review where supported;
- keep production secrets environment-scoped, never repository-wide or browser-exposed;
- do not copy staging credentials into production;
- require the deployment workflow to emit exact source, deployment and database identities without secret values;
- require post-deployment public/private health, runtime-error and database-seal checks;
- fail closed before mutation when Gate D decisions or exact production identities are incomplete.

Creating an empty environment without the approved reviewer/custody model would provide misleading assurance, so no environment has been created yet.

## Dependency and security handling

GD-10 must decide whether to enable Dependabot security updates and who owns triage. Before production GO, the accepted policy must specify:

- alert owner and response target by severity;
- whether updates open pull requests automatically;
- exact hosted tests required before merge;
- exception/deferral recording;
- emergency handling for compromised dependencies or credentials.

Zero open alerts at one audit instant is not a substitute for an ongoing policy.

## Safe implementation sequence after approval

1. Record accepted GD-10 settings and owner roles without personal data.
2. Add/verify a compact release-integrity status check.
3. Apply the approved `main` ruleset/protection.
4. Prove a normal pull request cannot bypass required review/checks.
5. Create the protected `production` environment with approved branch/reviewer policy but no secrets.
6. Prove an unauthorized deployment job cannot enter the environment.
7. Add production secrets only through the separately approved GD-03 custody process.
8. Run the exact production preflight; production remains NO-GO until GD-01 through GD-10 are closed and explicit GO is recorded.

## Client decision

On 2026-09-16 the client declined applying these controls. No ruleset, branch protection, Dependabot setting or deployment environment was changed.

This plan is retained for future review only. Do not implement it from a generic request to continue; explicit authorization must reopen GD-10 and provide the required reviewer/bypass roles privately.
