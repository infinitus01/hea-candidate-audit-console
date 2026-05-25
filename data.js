window.heaDataMetadata = {
    name: 'HEA Candidate Audit Console v0.1.1',
    status: 'STATIC_MVP_BASELINE',
    runtime: 'STATIC_FRONTEND_ONLY',
    scope: 'PASSIVE_DESCRIPTOR_AUDIT',
    claims: 'NON_ACTIONABLE_HUMAN_REVIEW_REQUIRED',
    data_status: 'MOCK_DESCRIPTOR_DATA',
    governance_note: 'Descriptor coverage is mock descriptor completeness, not literature, experimental, process, or manufacturing validation evidence.'
};

window.heaData = [
    {
        sample_id: 'HEA-2026-X1',
        genome_name: 'Titan_Arbiter',
        descriptor_class: 'DESCRIPTOR_DATA_PRESENT',
        descriptor_coverage: 72,
        phase_note: 'BCC descriptor hypothesis',
        risk_notes: 'Descriptor values are internally consistent; phase still requires CALPHAD or XRD validation.',
        process_hypothesis: {
            route: 'Exploratory casting',
            validation: 'CALPHAD/XRD required'
        },
        physical_parameters: {
            VEC: 7.2,
            atomic_size_difference: 0.045,
            mixing_entropy: 11.79,
            enthalpy_of_mixing: -2.64,
            melting_point: 1858.4,
            omega_parameter: 8.3,
            density: 6.8,
            primary_phase: 'BCC'
        },
        composition: {
            elements: ['Cr', 'Mn', 'Fe', 'Co', 'Ni'],
            fractions: [0.4, 0.3, 0.1, 0.1, 0.1]
        },
        target_review_context: 'High-strength structural screening seed'
    },
    {
        sample_id: 'HEA-2026-X2',
        genome_name: 'Aegis_Shield',
        descriptor_class: 'DESCRIPTOR_DATA_PRESENT',
        descriptor_coverage: 74,
        phase_note: 'FCC descriptor hypothesis',
        risk_notes: 'VEC direction is plausible for FCC screening; no external validation is bundled.',
        process_hypothesis: {
            route: 'Powder metallurgy screen',
            validation: 'Magnetic test required'
        },
        physical_parameters: {
            VEC: 8.5,
            atomic_size_difference: 0.032,
            mixing_entropy: 12.23,
            enthalpy_of_mixing: -3.28,
            melting_point: 1784.9,
            omega_parameter: 6.65,
            magnetic_permeability: 1.15,
            primary_phase: 'FCC'
        },
        composition: {
            elements: ['Cr', 'Mn', 'Fe', 'Co', 'Ni'],
            fractions: [0.1, 0.1, 0.2, 0.4, 0.2]
        },
        target_review_context: 'EMI shielding review context'
    },
    {
        sample_id: 'HEA-2026-X3',
        genome_name: 'Sonic_Lens',
        descriptor_class: 'DEMO_HEURISTIC_ONLY',
        descriptor_coverage: 58,
        phase_note: 'BCC plus Laves risk hypothesis',
        risk_notes: 'Intermetallic phase language is downgraded to risk hypothesis until confirmed experimentally.',
        process_hypothesis: {
            route: 'Damping coupon screen',
            validation: 'Phase map required'
        },
        physical_parameters: {
            VEC: 6.8,
            atomic_size_difference: 0.058,
            mixing_entropy: 10.02,
            enthalpy_of_mixing: -1.04,
            melting_point: 1934.7,
            omega_parameter: 18.64,
            vibration_damping_coeff: 0.85,
            primary_phase: 'BCC+Laves'
        },
        composition: {
            elements: ['Cr', 'Mn', 'Fe', 'Co', 'Ni'],
            fractions: [0.55, 0.25, 0.1, 0.05, 0.05]
        },
        target_review_context: 'Acoustic damping review context'
    },
    {
        sample_id: 'HEA-2026-X4',
        genome_name: 'VAM_Sentinel_Probe',
        descriptor_class: 'DEMO_HEURISTIC_ONLY',
        descriptor_coverage: 52,
        phase_note: 'Refractory phase uncertain',
        risk_notes: 'Ti-Zr-V-Nb-Ta HCP label is high risk without CALPHAD or diffraction support.',
        process_hypothesis: {
            route: 'High-temperature coupon',
            validation: 'CALPHAD/XRD required'
        },
        physical_parameters: {
            VEC: 4.5,
            atomic_size_difference: 0.021,
            mixing_entropy: 12.95,
            enthalpy_of_mixing: 0.36,
            melting_point: 2323.5,
            omega_parameter: 83.57,
            primary_phase: 'HCP'
        },
        composition: {
            elements: ['Ti', 'Zr', 'V', 'Nb', 'Ta'],
            fractions: [0.3, 0.2, 0.2, 0.2, 0.1]
        },
        target_review_context: 'High-temperature sensor housing review context'
    },
    {
        sample_id: 'HEA-2026-X5',
        genome_name: 'Gaia_Resonator',
        descriptor_class: 'FICTIONAL_OR_SPECULATIVE_SAMPLE',
        descriptor_coverage: 20,
        phase_note: 'Speculative amorphous label',
        risk_notes: 'Kept only as a fictional exploratory sample; do not present as technical evidence.',
        process_hypothesis: {
            route: 'Fictional concept',
            validation: 'Excluded from claims'
        },
        physical_parameters: {
            VEC: 7.9,
            atomic_size_difference: 0.062,
            mixing_entropy: 12.95,
            enthalpy_of_mixing: -3.6,
            melting_point: 1805.2,
            omega_parameter: 6.49,
            dielectric_constant: 4.2,
            primary_phase: 'Amorphous'
        },
        composition: {
            elements: ['Cr', 'Mn', 'Fe', 'Co', 'Ni'],
            fractions: [0.2, 0.2, 0.2, 0.3, 0.1]
        },
        target_review_context: 'Fictional exploratory UI context'
    },
    {
        sample_id: 'HEA-2026-X6',
        genome_name: 'Nebula_Forge',
        descriptor_class: 'DESCRIPTOR_DATA_PRESENT',
        descriptor_coverage: 82,
        phase_note: 'BCC RHEA descriptor hypothesis',
        risk_notes: 'Equiatomic W-Mo-Ta-Nb-V is the strongest hard-science demo seed in this set.',
        process_hypothesis: {
            route: 'RHEA screening coupon',
            validation: 'Thermal/mechanical test required'
        },
        physical_parameters: {
            VEC: 5.4,
            atomic_size_difference: 0.042,
            mixing_entropy: 13.38,
            enthalpy_of_mixing: -4.5,
            melting_point: 2840,
            omega_parameter: 24.5,
            density: 12.4,
            primary_phase: 'BCC'
        },
        composition: {
            elements: ['W', 'Mo', 'Ta', 'Nb', 'V'],
            fractions: [0.2, 0.2, 0.2, 0.2, 0.2]
        },
        target_review_context: 'High-temperature structural screening seed'
    },
    {
        sample_id: 'HEA-2026-X7',
        genome_name: 'Aero_Lite',
        descriptor_class: 'DEMO_HEURISTIC_ONLY',
        descriptor_coverage: 46,
        phase_note: 'Low-VEC lightweight alloy risk',
        risk_notes: 'VEC corrected from 3.8 to 2.8 using Al=3, Li=1, Mg=2, Sc=3, Ti=4.',
        process_hypothesis: {
            route: 'Lightweight coupon screen',
            validation: 'Phase and IM risk review'
        },
        physical_parameters: {
            VEC: 2.8,
            atomic_size_difference: 0.078,
            mixing_entropy: 12.1,
            enthalpy_of_mixing: -8.45,
            melting_point: 1120.5,
            omega_parameter: 4.2,
            density: 2.85,
            primary_phase: 'FCC+IM'
        },
        composition: {
            elements: ['Al', 'Li', 'Mg', 'Sc', 'Ti'],
            fractions: [0.4, 0.1, 0.2, 0.1, 0.2]
        },
        target_review_context: 'Lightweight alloy risk review seed'
    }
];
