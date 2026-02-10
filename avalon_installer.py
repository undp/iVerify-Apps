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

    print("Project structure already exists. Ensuring session data and config...")

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
