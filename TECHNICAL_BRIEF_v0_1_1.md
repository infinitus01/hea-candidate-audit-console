# HEA Candidate Audit Console v0.1.1 Technical Brief

## Purpose

HEA Candidate Audit Console v0.1.1 is a static frontend baseline for passive descriptor-level review of high-entropy alloy candidate data.

The goal is to make descriptor scope, review context, and claim boundaries explicit before a candidate is sent to deeper thermodynamic, experimental, or process review.

## Runtime Boundary

```text
Runtime: STATIC_FRONTEND_ONLY
Network: CDN assets only
Persistence: none
External API calls: none
Local storage: none
Execution scope: browser UI only
```

## Data Boundary

The bundled `data.js` file contains mock descriptor seed data. Each seed sample uses:

- `descriptor_class`
- `descriptor_coverage`
- `target_review_context`
- `phase_note`
- `risk_notes`
- `physical_parameters`
- `composition`

`descriptor_coverage` is descriptor completeness for this demo. It is not literature evidence, lab evidence, process evidence, or manufacturing evidence.

## Audit Snapshot Boundary

Generated audit snapshots use:

```text
audit_context_type: non_actionable_descriptor_context
claim_effect: NONE
manufacturing_trigger_effect: NONE
```

This keeps generated output in passive review context. The console does not create autonomous material claims or manufacturing triggers.

## Descriptor Gate

The UI displays or computes:

- VEC
- Atomic size difference
- Mixing entropy
- Delta Hmix
- Omega
- Melting scale
- Density
- Phase note

Custom composition input computes descriptor values from a small local element table. Delta Hmix and Omega remain gated unless seed data supplies them.

## Risk Review

Risk notes are heuristic review flags. Current flags include:

- Phase heuristic uncertainty
- Size mismatch
- Missing enthalpy matrix
- Intermetallic tendency
- Low-VEC region
- Speculative sample boundary
- Composition breadth

## Baseline Freeze

This version is frozen as:

```text
HEA Candidate Audit Console v0.1.1
Status: STATIC_MVP_BASELINE
Runtime: STATIC_FRONTEND_ONLY
Scope: PASSIVE_DESCRIPTOR_AUDIT
Claims: NON_ACTIONABLE_HUMAN_REVIEW_REQUIRED
```

Future work should happen in a new version, not by mutating this baseline tag.

