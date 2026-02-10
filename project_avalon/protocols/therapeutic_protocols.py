# protocols/therapeutic_protocols.py


class AvalonProtocols:
    """Protocolos baseados em evidências para diferentes condições"""

    PROTOCOLS = {
        "adhd_attention": {
            "name": "ADHD Attention",
            "target": "increase_beta_theta_ratio",
            "visual_feedback": "particle_convergence",
            "audio_feedback": "rising_tone_on_success",
            "session_duration": 25,
            "duration": 1500,  # seconds
            "metrics": ["theta_beta_ratio", "attention_shift_latency"],
        },
        "anxiety_calm": {
            "name": "Anxiety Calm",
            "target": "increase_alpha_power",
            "visual_feedback": "expanding_sphere_calm",
            "audio_feedback": "ocean_waves_modulated",
            "session_duration": 20,
            "duration": 1200,
            "metrics": ["alpha_amplitude", "hrv_coherence"],
        },
        "ptsd_integration": {
            "name": "PTSD Integration",
            "target": "synchronize_theta_gamma",
            "visual_feedback": "harmonic_resonance",
            "audio_feedback": "binaural_theta",
            "session_duration": 30,
            "duration": 1800,
            "metrics": ["frontal_midline_theta", "amygdala_connectivity"],
        },
        "flow_state": {
            "name": "Flow State",
            "target": "balance_alpha_theta_gamma",
            "visual_feedback": "time_crystal_pulsing",
            "audio_feedback": "432hz_harmonics",
            "session_duration": 15,
            "duration": 900,
            "metrics": ["global_coherence", "entropy_reduction"],
        },
    }
