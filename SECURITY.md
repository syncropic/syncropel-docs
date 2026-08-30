# Security Policy

## Supported versions

This repository hosts the source for [docs.syncropel.com](https://docs.syncropel.com), a static-site documentation deployment. Only the current `main` branch is supported. Older branches are not maintained and not deployed.

## Reporting a vulnerability

If you discover a security issue with the **documentation site itself** (e.g., a cross-site scripting vector via MDX, an exposed secret in repository content, a broken security header), please report it privately rather than opening a public issue.

The fastest channel is GitHub's built-in private reporting:

1. Go to the [Security tab](https://github.com/syncropic/syncropel-docs/security) of this repository.
2. Click **Report a vulnerability**.
3. Fill in the form. We respond within 5 business days.

Alternatively, email the report to **`security@syncropic.com`**. PGP encryption is available on request.

## Out of scope

This repo only contains the documentation source. Vulnerabilities in:

- The Syncropel kernel (`spl` daemon)
- The Syncropel SDKs (`@syncropel/sdk`, `syncropel` PyPI, `@syncropel/projections`, `@syncropel/react`, `@syncropel/extensions`, `@syncropel/config`, `@syncropel/workspace-templates`)
- Hosted infrastructure (`syncropel.com`, `graph.syncropel.com`, `discovery.syncropel.com`, `relay.syncropel.com`, `releases.syncropic.com`)

…should be reported through the appropriate project's own security channel. For anything you're unsure of, `security@syncropic.com` is a safe default.

## Coordinated disclosure

We follow a 90-day coordinated disclosure window. After acknowledging a report:

1. We confirm reproducibility and assess severity within 5 business days.
2. We fix the issue and prepare a release before public disclosure.
3. With reporter consent, we credit the reporter in release notes.
4. If 90 days elapse without a fix and the issue is exploitable in the wild, we may publish details to enable users to mitigate.

For low-severity issues (typos, broken links, content errors that don't have security implications), please open a regular GitHub issue or pull request — those don't need the security channel.

## Dependencies

This site is built with Next.js, Fumadocs, and Tailwind. Upstream vulnerabilities in those projects are tracked via Dependabot, which raises automated PRs for security updates. Reports about upstream issues should go to the relevant upstream project; reports about how those issues affect *this* deployment can come to us.
