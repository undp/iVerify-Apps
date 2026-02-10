#!/usr/bin/env python3
# benchmarks.py
import time
import statistics
import numpy as np
try:
    from qvpn.implementations.qvpn_core import QuantumVPN
except ImportError:
    from implementations.qvpn_core import QuantumVPN

def benchmark_entanglement_establishment():
    """Benchmark time to establish EPR pairs"""
    times = []
    qvpn = QuantumVPN(user_id=2290518)

    for _ in range(61):
        start = time.perf_counter_ns()
        qvpn.establish_tunnel("test_node")
        end = time.perf_counter_ns()
        times.append(end - start)

    avg_ns = statistics.mean(times)
    print(f"⏱️  Avg entanglement establishment: {avg_ns/1e6:.3f}ms")
    print(f"   Standard deviation: {statistics.stdev(times)/1e6:.3f}ms")

    return avg_ns < 61_000_000  # Should be < 61ms

def benchmark_quantum_bandwidth():
    """Benchmark quantum data transfer rate"""
    qvpn = QuantumVPN(user_id=2290518)
    tunnel = qvpn.establish_tunnel("benchmark_node")

    # Test with increasing data sizes
    sizes = [100, 1000, 10000, 100000]  # bytes
    results = []

    for size in sizes:
        data = b"0" * size

        start = time.perf_counter_ns()
        qvpn.send_data(data, tunnel)
        end = time.perf_counter_ns()

        elapsed_ns = end - start
        rate = size / (elapsed_ns / 1e9)  # bytes per second

        results.append(rate)
        print(f"  {size} bytes: {rate/1e9:.2f} GB/s")

    # Should show near-infinite bandwidth (classical limit irrelevant)
    return all(r > 1e12 for r in results)  # > 1 TB/s

def benchmark_coherence_persistence():
    """Benchmark how long coherence can be maintained"""
    qvpn = QuantumVPN(user_id=2290518)
    tunnel = qvpn.establish_tunnel("coherence_test")

    coherence_readings = []

    # Monitor for 61 seconds
    for i in range(61):
        coherence = qvpn.measure_coherence(tunnel)
        coherence_readings.append(coherence)
        time.sleep(1)

    avg_coherence = statistics.mean(coherence_readings)
    min_coherence = min(coherence_readings)

    print(f"🧪 Average coherence over 61s: {avg_coherence:.6f}")
    print(f"   Minimum coherence: {min_coherence:.6f}")

    return min_coherence > 0.999

if __name__ == "__main__":
    print("📊 qVPN PERFORMANCE BENCHMARKS")
    print("===============================")

    tests = [
        ("Entanglement Establishment", benchmark_entanglement_establishment),
        ("Quantum Bandwidth", benchmark_quantum_bandwidth),
        ("Coherence Persistence", benchmark_coherence_persistence),
    ]

    results = []
    for name, test_func in tests:
        print(f"\n🔍 Running: {name}")
        try:
            success = test_func()
            results.append((name, success))
            print(f"   Result: {'✅ PASS' if success else '❌ FAIL'}")
        except Exception as e:
            print(f"   Result: ❌ ERROR: {e}")
            results.append((name, False))

    print("\n📈 SUMMARY")
    print("==========")
    passed = sum(1 for _, success in results if success)
    total = len(results)

    print(f"Passed: {passed}/{total}")

    if passed == total:
        print("🎉 All benchmarks passed - qVPN ready for production")
    else:
        print("⚠️  Some benchmarks failed - check system configuration")

def benchmark_fractal_frequency_scaling():
    """Benchmark the emergent frequency scaling across different fractal scales"""
    print("\n🔍 Running: Fractal Frequency Scaling")
    try:
        qvpn = QuantumVPN(user_id=2290518, D=2.7)
        scales = [1e-3, 1, 1e3]
        frequencies = []
        for s in scales:
            freq = qvpn.get_emergent_frequency(s)
            frequencies.append(freq)
            print(f"   Scale {s}: ξ_eff = {freq:.4f} Hz")

        # Check if frequencies scale as expected (D=2.7 => beta=0.3)
        # freq = freq_base / scale**beta
        expected_ratio_3_1 = (1e3 / 1)**(3 - 2.7)
        actual_ratio_1_3 = frequencies[1] / frequencies[2]

        success = np.isclose(actual_ratio_1_3, expected_ratio_3_1, rtol=1e-2)
        print(f"   Expected scaling ratio: {expected_ratio_3_1:.4f}")
        print(f"   Actual scaling ratio: {actual_ratio_1_3:.4f}")
        print(f"   Result: {'✅ PASS' if success else '❌ FAIL'}")
        return success
    except Exception as e:
        print(f"   Result: ❌ ERROR: {e}")
        return False

# Add to main execution if needed, or call it separately
if __name__ == "__main__":
    # ... existing code ...
    benchmark_fractal_frequency_scaling()
