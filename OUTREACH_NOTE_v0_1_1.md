# Outreach Note v0.1.1

This note is intended for external reviewers who are evaluating the HEA Candidate Audit Console as a static scientific-software demo and early-stage review workflow concept.

## What this is

HEA Candidate Audit Console v0.1.1 is a static MVP baseline for passive HEA/MPEA candidate descriptor audit.

It demonstrates a local, frontend-only workflow for reviewing candidate alloy inputs, descriptor-level coverage, risk categories, evidence separation, and claim-boundary-safe report snapshots.

The intended use is early discussion, technical review, and workflow critique.

## What this is not

This project is not:

- a material validation engine
- a CALPHAD replacement
- an experimental phase-confirmation tool
- a property prediction system
- production or manufacturing guidance
- autonomous alloy design
- procurement, deployment, or qualification advice

Any technical conclusion still requires human review and appropriate experimental or computational validation.

## What to review

Suggested entry points:

- `README.md` for project framing, audience, and live demo link
- `TECHNICAL_BRIEF_v0_1_1.md` for technical boundary and workflow explanation
- `DISCLAIMER.md` for claim-boundary framing
- `data.js` for mock descriptor seed structure
- Live demo for the static UI workflow
- Frozen baseline tag for the original v0.1.1 static MVP state

## Suggested reviewer lens

Useful review questions:

- Are the descriptor boundaries clear enough?
- Are the risk categories useful for early candidate screening?
- Are any labels, phrases, or UI terms still too strong?
- Are the evidence layers separated clearly enough?
- What validation gates should be separated next?
- What report fields would be useful for a lab, reviewer, or materials-informatics workflow?

## Useful links

- Repository: https://github.com/infinitus01/hea-candidate-audit-console
- Live demo: https://infinitus01.github.io/hea-candidate-audit-console/
- Frozen baseline tag: https://github.com/infinitus01/hea-candidate-audit-console/tree/v0.1.1-static-mvp-baseline

## Feedback requested

Short feedback is useful on:

- terminology
- descriptor coverage framing
- risk-category usefulness
- report output shape
- evidence-layer separation
- next validation gates

## Review boundary

This note does not change the v0.1.1 frozen baseline tag, runtime behavior, scientific claims, or validation status.

It is an outreach-facing review guide only.
