#!/usr/bin/env python
"""
AVALON KERNEL - Main system core
"""
import numpy as np
import time
import sys
import os

# Relative imports
from .components.eeg_processor import EEGProcessor
from .components.ricci_flow import RicciFlowEngine
from .components.audio_synthesizer import AudioSynthesizer
from .components.visualizer import Visualizer

class AvalonKernel:
    """Main core of Project Avalon"""

    def __init__(self):
        print("🚀 Initializing Avalon Kernel...")

        # Initialize components
        self.eeg = EEGProcessor()
        self.ricci = RicciFlowEngine(flow_rate=0.15)
        self.audio = AudioSynthesizer()
        self.viz = Visualizer()

        self.session_data = {
            'progress': 0,
            'curvature_reduction': 0,
            'coherence': 0.5
        }

    def start_session(self, duration=300):
        """Starts therapeutic session"""
        print(f"🧠 Starting session of {duration} seconds...")
        print("🌀 Focus on breathing. The geometry will respond.")

        # Generate initial manifold
        manifold = self.ricci.generate_manifold(50)

        # Session loop
        start_time = time.time()
        while time.time() - start_time < duration:
            elapsed = time.time() - start_time
            progress = elapsed / duration

            # Update metrics
            metrics = self.eeg.process(None)
            self.session_data['coherence'] = metrics.get('coherence', 0.5)

            # Apply Ricci Flow
            manifold = self.ricci.apply_flow(manifold)
            self.session_data['curvature_reduction'] = progress * 0.3

            # Generate audio
            if progress > 0.5:
                freq = 110 + 50 * self.session_data['coherence']
                sound = self.audio.generate_harmonic(freq, 0.1)
                self.audio.play(sound)

            # Update progress
            self.session_data['progress'] = progress

            # Show progress
            bar_length = 40
            filled = int(bar_length * progress)
            bar = '█' * filled + '░' * (bar_length - filled)
            print(f"\r⏱️  [{bar}] {progress*100:.1f}%", end='', flush=True)

            time.sleep(0.1)  # 10 FPS

        print("\n✅ Session complete!")

        # Visualize result
        self.viz.render_3d(manifold, "Manifold after Ricci Flow")
        self.viz.save('session_result.png')

        return self.session_data

def main():
    """Main function"""
    import argparse

    parser = argparse.ArgumentParser(description="Avalon Kernel - Neurofeedback System")
    parser.add_argument("--quick-test", action="store_true", help="Quick test (60 seconds)")

    args = parser.parse_args()

    kernel = AvalonKernel()

    if args.quick_test:
        kernel.start_session(60)
    else:
        kernel.start_session(300)  # 5 minutes default

if __name__ == "__main__":
    main()
