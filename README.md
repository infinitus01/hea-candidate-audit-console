# HEA Candidate Audit Console v0.1.1

Static MVP baseline for passive high-entropy alloy candidate auditing.

## Baseline Status

```text
Status: STATIC_MVP_BASELINE
Runtime: STATIC_FRONTEND_ONLY
Scope: PASSIVE_DESCRIPTOR_AUDIT
Claims: NON_ACTIONABLE_HUMAN_REVIEW_REQUIRED
```

## What It Does

- Accepts alloy composition input such as `Al20Co20Cr20Fe20Ni20`.
- Computes or displays descriptor-level values for VEC, size difference, mixing entropy, melting scale, density, Delta Hmix, and Omega.
- Classifies review risks such as size mismatch, phase-heuristic uncertainty, missing thermodynamic matrix data, and low-VEC regions.
- Separates descriptor coverage from literature, experimental, process, and manufacturing evidence.
- Exports JSON or Markdown audit snapshots for human review.

## What It Does Not Do

- It does not confirm material phases.
- It does not establish manufacturing readiness.
- It does not replace CALPHAD, XRD, SEM-EDS, hardness tests, magnetic tests, or coupon-level review.
- It does not produce autonomous technical claims.

## File Set

```text
index.html
index.css
app.js
data.js
README.md
DISCLAIMER.md
TECHNICAL_BRIEF_v0_1_1.md
```

## Local Use

Open `index.html` directly, or serve the folder with any static web server.

```powershell
npx serve .
```

The current build uses external CDN assets for Chart.js, FontAwesome, Google Fonts, and avatar rendering. A later offline asset patch can localize those dependencies.

