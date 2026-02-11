import os
import shutil

def setup_avalon():
    base_dir = "project_avalon"
    subdirs = [
        "components",
        "utils",
        "avalon_config",
        "session_data",
        "examples",
        "tests"
    ]

    print(f"Creating Project Avalon structure in ./{base_dir}...")
    os.makedirs(base_dir, exist_ok=True)
    for subdir in subdirs:
        os.makedirs(os.path.join(base_dir, subdir), exist_ok=True)

    # Map existing files to Avalon components
    mapping = {
        "qvpn/implementations/qvpn_core.py": "project_avalon/avalon_kernel.py",
        "qvpn/implementations/ricci_flow_audio.py": "project_avalon/components/audio_synthesizer.py",
        "qvpn/implementations/topological_healing.py": "project_avalon/components/topology_engine.py",
        "qvpn/implementations/topological_signature_detector.py": "project_avalon/components/signature_detector.py",
        "qvpn/implementations/harmonic_signature_shield.py": "project_avalon/components/harmonic_shield.py",
    }

    for src, dst in mapping.items():
        if os.path.exists(src):
            shutil.copy(src, dst)
            print(f"  -> Copied {src} to {dst}")
        else:
            print(f"  -> Warning: {src} not found.")

    # Create a basic config
    config_content = """{
    "session_duration": 60,
    "ricci_flow_smoothing": 0.5,
    "base_audio_freq": 200,
    "viz_color_scheme": "dark_fusion"
}
"""
    with open("project_avalon/avalon_config/default_config.json", "w") as f:
        f.write(config_content)

    # Create __init__.py files
    for subdir in ["components", "utils"]:
        with open(os.path.join(base_dir, subdir, "__init__.py"), "w") as f:
            pass

    with open(os.path.join(base_dir, "__init__.py"), "w") as f:
        pass

    print("Project Avalon installation complete.")

if __name__ == "__main__":
    setup_avalon()
