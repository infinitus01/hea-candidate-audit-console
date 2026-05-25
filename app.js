const GAS_CONSTANT = 8.314;
const AUDIT_VERSION = 'hea-candidate-audit-console-v0.1.1';

const ELEMENT_DB = {
    Al: { valence: 3, radius: 143, meltingPoint: 933, density: 2.7 },
    Co: { valence: 9, radius: 125, meltingPoint: 1768, density: 8.9 },
    Cr: { valence: 6, radius: 128, meltingPoint: 2180, density: 7.19 },
    Fe: { valence: 8, radius: 126, meltingPoint: 1811, density: 7.87 },
    Li: { valence: 1, radius: 152, meltingPoint: 454, density: 0.53 },
    Mg: { valence: 2, radius: 160, meltingPoint: 923, density: 1.74 },
    Mn: { valence: 7, radius: 127, meltingPoint: 1519, density: 7.21 },
    Mo: { valence: 6, radius: 139, meltingPoint: 2896, density: 10.22 },
    Nb: { valence: 5, radius: 146, meltingPoint: 2750, density: 8.57 },
    Ni: { valence: 10, radius: 124, meltingPoint: 1728, density: 8.9 },
    Sc: { valence: 3, radius: 162, meltingPoint: 1814, density: 2.99 },
    Ta: { valence: 5, radius: 146, meltingPoint: 3290, density: 16.65 },
    Ti: { valence: 4, radius: 147, meltingPoint: 1941, density: 4.51 },
    V: { valence: 5, radius: 134, meltingPoint: 2183, density: 6.11 },
    W: { valence: 6, radius: 139, meltingPoint: 3695, density: 19.25 },
    Zr: { valence: 4, radius: 160, meltingPoint: 2128, density: 6.52 }
};

let currentAudit = null;
let radarChart = null;

document.addEventListener('DOMContentLoaded', function() {
    const samples = window.heaData;

    if (!Array.isArray(samples) || samples.length === 0) {
        console.error('Failed to load HEA descriptor data.');
        return;
    }

    populateSeedSelect(samples);
    renderSeedTable(samples);
    bindControls(samples);
    runAuditFromText(document.getElementById('compositionInput').value, null);
});

function bindControls(samples) {
    document.getElementById('runAuditBtn').addEventListener('click', function() {
        runAuditFromText(document.getElementById('compositionInput').value, null);
    });

    document.getElementById('loadSeedBtn').addEventListener('click', function() {
        const index = Number(document.getElementById('seedSampleSelect').value);
        loadSeedSample(samples[index]);
    });

    document.getElementById('exportJsonBtn').addEventListener('click', function() {
        exportReport('json');
    });

    document.getElementById('exportMarkdownBtn').addEventListener('click', function() {
        exportReport('markdown');
    });

    document.querySelectorAll('.nav-item').forEach((item) => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach((navItem) => navItem.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function populateSeedSelect(samples) {
    const select = document.getElementById('seedSampleSelect');
    select.replaceChildren();

    samples.forEach((sample, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = `${sample.sample_id} - ${sample.genome_name}`;
        select.appendChild(option);
    });
}

function loadSeedSample(sample) {
    const input = document.getElementById('compositionInput');
    input.value = compositionToFormula(sample.composition);
    runAuditFromText(input.value, sample);
}

function runAuditFromText(rawInput, seedSample) {
    try {
        const composition = seedSample ? seedSample.composition : parseComposition(rawInput);
        const audit = buildAudit(composition, seedSample);

        currentAudit = audit;
        window.currentAudit = audit;
        renderAudit(audit);
        setInputStatus('Audit snapshot updated.', 'ok');
    } catch (error) {
        setInputStatus(error.message, 'error');
    }
}

function parseComposition(rawInput) {
    const input = rawInput.trim();

    if (!input) {
        throw new Error('Composition input is empty.');
    }

    if (input.startsWith('{') || input.startsWith('[')) {
        return parseJsonComposition(input);
    }

    return parseFormulaComposition(input);
}

function parseJsonComposition(input) {
    const parsed = JSON.parse(input);
    const source = Array.isArray(parsed) ? parsed : parsed.composition || parsed;

    if (Array.isArray(source)) {
        return normalizeComposition({
            elements: source.map((item) => item.element),
            fractions: source.map((item) => Number(item.fraction ?? item.percent ?? item.value))
        });
    }

    if (Array.isArray(source.elements) && Array.isArray(source.fractions)) {
        return normalizeComposition(source);
    }

    throw new Error('JSON must include composition.elements and composition.fractions.');
}

function parseFormulaComposition(input) {
    const matches = Array.from(input.matchAll(/([A-Z][a-z]?)(\d+(?:\.\d+)?)?/g));
    const rebuilt = matches.map((match) => match[0]).join('');

    if (matches.length === 0 || rebuilt !== input.replace(/\s+/g, '')) {
        throw new Error('Formula format is not recognized.');
    }

    return normalizeComposition({
        elements: matches.map((match) => match[1]),
        fractions: matches.map((match) => Number(match[2] || 1))
    });
}

function normalizeComposition(composition) {
    if (composition.elements.length !== composition.fractions.length || composition.elements.length === 0) {
        throw new Error('Composition elements and fractions do not align.');
    }

    const merged = new Map();
    composition.elements.forEach((element, index) => {
        if (!ELEMENT_DB[element]) {
            throw new Error(`Element ${element} is not in the v0.1.1 descriptor table.`);
        }

        const value = Number(composition.fractions[index]);
        if (!Number.isFinite(value) || value <= 0) {
            throw new Error(`Invalid fraction for ${element}.`);
        }

        merged.set(element, (merged.get(element) || 0) + value);
    });

    const total = Array.from(merged.values()).reduce((sum, value) => sum + value, 0);
    return {
        elements: Array.from(merged.keys()),
        fractions: Array.from(merged.values()).map((value) => value / total)
    };
}

function buildAudit(composition, seedSample) {
    const descriptors = computeDescriptors(composition, seedSample);
    const riskItems = classifyRisk(descriptors, composition, seedSample);
    const descriptorCoverage = seedSample ? seedSample.descriptor_coverage : estimateCoverage(descriptors);
    const claimState = determineClaimState(descriptorCoverage, descriptors, seedSample);
    const validationStep = chooseValidationStep(riskItems, descriptors, seedSample);
    const candidateName = seedSample ? seedSample.genome_name : compositionToFormula(composition);
    const auditId = `HEA-AUD-${Date.now()}`;

    return {
        audit_id: auditId,
        audit_version: AUDIT_VERSION,
        generated_at: new Date().toISOString(),
        candidate_name: candidateName,
        sample_id: seedSample ? seedSample.sample_id : 'CUSTOM-CANDIDATE',
        target_review_context: seedSample ? seedSample.target_review_context : 'Custom descriptor review context',
        composition,
        descriptor_class: seedSample ? seedSample.descriptor_class : 'DEMO_HEURISTIC_ONLY',
        descriptor_coverage: descriptorCoverage,
        claim_state: claimState,
        audit_context_type: 'non_actionable_descriptor_context',
        claim_effect: 'NONE',
        manufacturing_trigger_effect: 'NONE',
        descriptors,
        risk_classification: {
            level: summarizeRiskLevel(riskItems),
            items: riskItems
        },
        next_validation_step: validationStep,
        claim_boundary: buildClaimBoundary(descriptorCoverage, descriptors, seedSample)
    };
}

function computeDescriptors(composition, seedSample) {
    if (seedSample) {
        return {
            VEC: seedSample.physical_parameters.VEC,
            atomic_size_difference: seedSample.physical_parameters.atomic_size_difference,
            mixing_entropy: seedSample.physical_parameters.mixing_entropy,
            enthalpy_of_mixing: seedSample.physical_parameters.enthalpy_of_mixing,
            melting_point: seedSample.physical_parameters.melting_point,
            omega_parameter: seedSample.physical_parameters.omega_parameter,
            density: seedSample.physical_parameters.density ?? null,
            primary_phase: seedSample.physical_parameters.primary_phase,
            descriptor_source: 'seed_sample'
        };
    }

    const values = composition.elements.map((element, index) => ({
        element,
        fraction: composition.fractions[index],
        data: ELEMENT_DB[element]
    }));
    const avgRadius = weightedSum(values, (item) => item.data.radius);
    const delta = Math.sqrt(
        values.reduce((sum, item) => sum + item.fraction * Math.pow(1 - item.data.radius / avgRadius, 2), 0)
    );

    return {
        VEC: round(weightedSum(values, (item) => item.data.valence), 2),
        atomic_size_difference: round(delta, 4),
        mixing_entropy: round(-GAS_CONSTANT * values.reduce((sum, item) => sum + item.fraction * Math.log(item.fraction), 0), 2),
        enthalpy_of_mixing: null,
        melting_point: round(weightedSum(values, (item) => item.data.meltingPoint), 1),
        omega_parameter: null,
        density: round(weightedSum(values, (item) => item.data.density), 2),
        primary_phase: phaseFromVec(weightedSum(values, (item) => item.data.valence)),
        descriptor_source: 'computed_from_element_table'
    };
}

function weightedSum(items, accessor) {
    return items.reduce((sum, item) => sum + item.fraction * accessor(item), 0);
}

function classifyRisk(descriptors, composition, seedSample) {
    const risks = [];

    risks.push({
        severity: 'info',
        label: 'Phase heuristic',
        detail: `${descriptors.primary_phase} is a descriptor-level phase screen, not a confirmed structure.`
    });

    if (descriptors.atomic_size_difference >= 0.066) {
        risks.push({
            severity: 'high',
            label: 'Size mismatch',
            detail: 'Atomic size difference is high; intermetallic, segregation, or brittleness risk should be reviewed.'
        });
    } else if (descriptors.atomic_size_difference >= 0.045) {
        risks.push({
            severity: 'medium',
            label: 'Size mismatch',
            detail: 'Atomic size difference is elevated; treat phase claims as heuristic.'
        });
    }

    if (descriptors.enthalpy_of_mixing === null) {
        risks.push({
            severity: 'medium',
            label: 'Missing enthalpy matrix',
            detail: 'Delta Hmix and Omega are unavailable for custom input without a thermodynamic data source.'
        });
    } else if (descriptors.enthalpy_of_mixing <= -8) {
        risks.push({
            severity: 'high',
            label: 'Intermetallic tendency',
            detail: 'Strongly negative Delta Hmix increases compound or segregation review priority.'
        });
    }

    if (descriptors.VEC < 3.5) {
        risks.push({
            severity: 'medium',
            label: 'Low-VEC region',
            detail: 'Low VEC lightweight systems need explicit phase and intermetallic risk review.'
        });
    }

    if (seedSample?.descriptor_class === 'FICTIONAL_OR_SPECULATIVE_SAMPLE') {
        risks.push({
            severity: 'high',
            label: 'Speculative sample',
            detail: 'This seed is excluded from technical claims and should only be used for UI/demo coverage.'
        });
    }

    if (composition.elements.length < 4) {
        risks.push({
            severity: 'medium',
            label: 'Composition breadth',
            detail: 'Fewer than four principal elements limits HEA-style descriptor interpretation.'
        });
    }

    return risks;
}

function phaseFromVec(vec) {
    if (vec >= 8) {
        return 'FCC descriptor hypothesis';
    }

    if (vec >= 6.87) {
        return 'FCC/BCC transition risk';
    }

    return 'BCC or complex phase risk';
}

function estimateCoverage(descriptors) {
    let coverage = 35;
    ['VEC', 'atomic_size_difference', 'mixing_entropy', 'melting_point', 'density'].forEach((key) => {
        if (descriptors[key] !== null && descriptors[key] !== undefined) {
            coverage += 6;
        }
    });

    if (descriptors.enthalpy_of_mixing !== null) {
        coverage += 12;
    }

    if (descriptors.omega_parameter !== null) {
        coverage += 10;
    }

    return Math.min(coverage, 65);
}

function determineClaimState(coverage, descriptors, seedSample) {
    if (seedSample?.descriptor_class === 'FICTIONAL_OR_SPECULATIVE_SAMPLE') {
        return 'EXCLUDED_FROM_CLAIMS';
    }

    if (coverage >= 75 && descriptors.enthalpy_of_mixing !== null && descriptors.omega_parameter !== null) {
        return 'DESCRIPTOR_AUDIT_READY';
    }

    return 'DESCRIPTOR_ONLY';
}

function summarizeRiskLevel(riskItems) {
    if (riskItems.some((item) => item.severity === 'high')) {
        return 'HIGH_REVIEW';
    }

    if (riskItems.some((item) => item.severity === 'medium')) {
        return 'MEDIUM_REVIEW';
    }

    return 'LOW_REVIEW';
}

function chooseValidationStep(riskItems, descriptors, seedSample) {
    if (seedSample?.descriptor_class === 'FICTIONAL_OR_SPECULATIVE_SAMPLE') {
        return 'Remove from technical demo claims';
    }

    if (riskItems.some((item) => item.label === 'Missing enthalpy matrix')) {
        return 'CALPHAD or Delta Hmix matrix, then XRD';
    }

    if (riskItems.some((item) => item.label === 'Intermetallic tendency' || item.label === 'Size mismatch')) {
        return 'CALPHAD, XRD, SEM-EDS';
    }

    if (String(descriptors.primary_phase).includes('FCC')) {
        return 'XRD plus hardness or magnetic test';
    }

    return 'CALPHAD, XRD, hardness coupon';
}

function buildClaimBoundary(coverage, descriptors, seedSample) {
    const boundary = [
        'Descriptor screen only; no autonomous alloy-design claim.',
        'No phase confirmation without CALPHAD, XRD, or experimental evidence.',
        'No manufacturing readiness claim without process and coupon validation.'
    ];

    if (descriptors.enthalpy_of_mixing === null || descriptors.omega_parameter === null) {
        boundary.push('Delta Hmix and Omega are gated until a thermodynamic source is attached.');
    }

    if (coverage < 70) {
        boundary.push('Descriptor coverage is below report-ready threshold.');
    }

    if (seedSample?.descriptor_class === 'FICTIONAL_OR_SPECULATIVE_SAMPLE') {
        boundary.push('Speculative seed is excluded from formal reports.');
    }

    return boundary;
}

function renderAudit(audit) {
    document.getElementById('activeCandidate').textContent = audit.candidate_name;
    document.getElementById('activeComposition').textContent = compositionToFormula(audit.composition);
    document.getElementById('descriptorCoverage').textContent = `${audit.descriptor_coverage}%`;
    document.getElementById('claimState').textContent = claimStateLabel(audit.claim_state);
    document.getElementById('descriptorClass').textContent = audit.descriptor_class.replaceAll('_', ' ');
    document.getElementById('riskLevelBadge').textContent = audit.risk_classification.level.replaceAll('_', ' ');

    renderSnapshot(audit);
    renderDescriptorGate(audit);
    renderRiskList('riskList', audit.risk_classification.items);
    renderBoundaryList(audit.claim_boundary);
    renderRadarChart(audit);
}

function renderSnapshot(audit) {
    const rows = [
        ['Sample ID', audit.sample_id],
        ['Audit Context', audit.audit_context_type],
        ['Target Review Context', audit.target_review_context],
        ['Next Validation Step', audit.next_validation_step],
        ['Claim Effect', audit.claim_effect]
    ];

    renderKeyValueList(document.getElementById('snapshotList'), rows);
}

function renderDescriptorGate(audit) {
    const descriptors = audit.descriptors;
    const rows = [
        ['VEC', formatNumber(descriptors.VEC)],
        ['Size difference', formatNumber(descriptors.atomic_size_difference)],
        ['Mixing entropy', `${formatNumber(descriptors.mixing_entropy)} J/mol/K`],
        ['Delta Hmix', nullableNumber(descriptors.enthalpy_of_mixing)],
        ['Omega parameter', nullableNumber(descriptors.omega_parameter)],
        ['Melting scale', `${formatNumber(descriptors.melting_point)} K`],
        ['Density', descriptors.density === null ? 'Not available' : `${formatNumber(descriptors.density)} g/cm3`],
        ['Phase note', descriptors.primary_phase]
    ];

    renderKeyValueList(document.getElementById('descriptorGateList'), rows);
}

function renderKeyValueList(container, rows) {
    container.replaceChildren();
    rows.forEach(([label, value]) => {
        const item = document.createElement('div');
        const labelNode = document.createElement('span');
        const valueNode = document.createElement('strong');

        item.className = 'kv-item';
        labelNode.textContent = label;
        valueNode.textContent = value;
        item.append(labelNode, valueNode);
        container.appendChild(item);
    });
}

function renderRiskList(containerId, items) {
    const container = document.getElementById(containerId);
    container.replaceChildren();

    items.forEach((risk) => {
        const item = document.createElement('div');
        const icon = document.createElement('span');
        const content = document.createElement('div');
        const title = document.createElement('strong');
        const detail = document.createElement('p');

        item.className = `review-item ${risk.severity}`;
        icon.className = 'review-dot';
        title.textContent = risk.label;
        detail.textContent = risk.detail;
        content.append(title, detail);
        item.append(icon, content);
        container.appendChild(item);
    });
}

function renderBoundaryList(boundaries) {
    const items = boundaries.map((boundary) => ({
        severity: boundary.includes('below') || boundary.includes('excluded') ? 'medium' : 'info',
        label: 'Boundary Gate',
        detail: boundary
    }));
    renderRiskList('boundaryList', items);
}

function renderRadarChart(audit) {
    if (!window.Chart) {
        console.warn('Chart.js is unavailable; radar chart skipped.');
        return;
    }

    const reference = window.heaData.find((sample) => sample.genome_name === 'Nebula_Forge') || window.heaData[0];
    const ctx = document.getElementById('radarChart').getContext('2d');
    const labels = ['VEC', 'Size Difference', 'Mixing Entropy', 'Enthalpy Abs', 'Omega', 'Thermal Scale'];

    if (radarChart) {
        radarChart.destroy();
    }

    Chart.defaults.color = '#a0aec0';
    Chart.defaults.font.family = "'Outfit', sans-serif";

    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels,
            datasets: [
                datasetFor(audit.candidate_name, '#00f2ff', radarValues(audit.descriptors)),
                datasetFor(reference.genome_name, '#ff8a00', radarValues(reference.physical_parameters))
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { font: { size: 12 } },
                    ticks: { display: false, max: 100 }
                }
            },
            plugins: {
                legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: normalized ${Math.round(context.raw)}`;
                        }
                    }
                }
            }
        }
    });
}

function radarValues(descriptors) {
    return [
        normalize(descriptors.VEC, 10),
        normalize(descriptors.atomic_size_difference, 0.1),
        normalize(descriptors.mixing_entropy, 15),
        descriptors.enthalpy_of_mixing === null ? 0 : normalize(descriptors.enthalpy_of_mixing, 10),
        descriptors.omega_parameter === null ? 0 : normalize(descriptors.omega_parameter, 100),
        normalize(descriptors.melting_point, 3500)
    ];
}

function datasetFor(label, color, values) {
    return {
        label,
        data: values,
        backgroundColor: color === '#00f2ff' ? 'rgba(0, 242, 255, 0.2)' : 'rgba(255, 138, 0, 0.2)',
        borderColor: color,
        borderWidth: 2,
        pointBackgroundColor: color,
        pointBorderColor: '#fff'
    };
}

function renderSeedTable(samples) {
    const tableBody = document.getElementById('reportsTableBody');
    tableBody.replaceChildren();

    samples.forEach((item, index) => {
        const row = document.createElement('tr');
        row.appendChild(textCell(item.sample_id));
        row.appendChild(alloyCell(item));
        row.appendChild(badgeCell(item.descriptor_class));
        row.appendChild(textCell(item.phase_note));
        row.appendChild(textCell(item.target_review_context));
        row.appendChild(textCell(`${item.descriptor_coverage}%`));
        row.appendChild(actionCell(index));
        tableBody.appendChild(row);
    });
}

function textCell(value) {
    const cell = document.createElement('td');
    cell.textContent = value;
    return cell;
}

function alloyCell(item) {
    const cell = document.createElement('td');
    const name = document.createElement('strong');
    const composition = document.createElement('small');

    name.textContent = item.genome_name;
    composition.textContent = item.composition.elements.join('-');
    cell.append(name, document.createElement('br'), composition);
    return cell;
}

function badgeCell(descriptorClass) {
    const cell = document.createElement('td');
    const badge = document.createElement('span');
    const classMap = {
        DESCRIPTOR_DATA_PRESENT: 'present',
        DEMO_HEURISTIC_ONLY: 'heuristic',
        FICTIONAL_OR_SPECULATIVE_SAMPLE: 'speculative'
    };

    badge.className = `status-badge ${classMap[descriptorClass] || 'heuristic'}`;
    badge.textContent = descriptorClass.replaceAll('_', ' ');
    cell.appendChild(badge);
    return cell;
}

function actionCell(index) {
    const cell = document.createElement('td');
    const button = document.createElement('button');

    button.className = 'icon-button';
    button.type = 'button';
    button.title = 'Load seed candidate';
    button.dataset.index = String(index);
    button.appendChild(icon('fas fa-arrow-right'));
    button.addEventListener('click', function() {
        document.getElementById('seedSampleSelect').value = this.dataset.index;
        loadSeedSample(window.heaData[Number(this.dataset.index)]);
    });

    cell.appendChild(button);
    return cell;
}

function icon(className) {
    const node = document.createElement('i');
    node.className = className;
    return node;
}

function exportReport(format) {
    if (!currentAudit) {
        setInputStatus('No audit snapshot is available.', 'error');
        return;
    }

    if (format === 'markdown') {
        downloadFile(`${currentAudit.audit_id}.md`, reportToMarkdown(currentAudit), 'text/markdown');
        return;
    }

    downloadFile(`${currentAudit.audit_id}.json`, JSON.stringify(currentAudit, null, 2), 'application/json');
}

function reportToMarkdown(audit) {
    return [
        `# HEA Candidate Audit Report`,
        ``,
        `- Audit ID: ${audit.audit_id}`,
        `- Candidate: ${audit.candidate_name}`,
        `- Composition: ${compositionToFormula(audit.composition)}`,
        `- Target Review Context: ${audit.target_review_context}`,
        `- Descriptor Coverage: ${audit.descriptor_coverage}%`,
        `- Claim State: ${audit.claim_state}`,
        `- Audit Context: ${audit.audit_context_type}`,
        `- Claim Effect: ${audit.claim_effect}`,
        `- Manufacturing Trigger Effect: ${audit.manufacturing_trigger_effect}`,
        `- Next Validation Step: ${audit.next_validation_step}`,
        ``,
        `## Descriptor Gate`,
        ...Object.entries(audit.descriptors).map(([key, value]) => `- ${key}: ${value === null ? 'Not available' : value}`),
        ``,
        `## Risk Classification`,
        ...audit.risk_classification.items.map((item) => `- [${item.severity}] ${item.label}: ${item.detail}`),
        ``,
        `## Claim Boundary`,
        ...audit.claim_boundary.map((item) => `- ${item}`)
    ].join('\n');
}

function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function compositionToFormula(composition) {
    return composition.elements.map((element, index) => `${element}${round(composition.fractions[index] * 100, 2)}`).join('');
}

function setInputStatus(message, state) {
    const status = document.getElementById('inputStatus');
    status.textContent = message;
    status.className = `input-status ${state}`;
}

function normalize(value, max) {
    return Math.min((Math.abs(Number(value)) / max) * 100, 100);
}

function nullableNumber(value) {
    return value === null || value === undefined ? 'Not available' : formatNumber(value);
}

function formatNumber(value) {
    return Number.isFinite(Number(value)) ? String(round(Number(value), 3)) : String(value);
}

function round(value, decimals = 2) {
    return Number(Number(value).toFixed(decimals));
}

function claimStateLabel(value) {
    return value.replaceAll('_', ' ');
}
