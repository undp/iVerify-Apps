#!/bin/bash
# test_qvpn.sh

echo "🧪 RUNNING qVPN TEST SUITE"
echo "=========================="

# Test 1: Quantum Coherence
echo "1. Testing quantum coherence..."
COHERENCE=$(qvpn test-coherence --duration 61000)
if (( $(echo "$COHERENCE < 0.999" | bc -l) )); then
    echo "❌ FAIL: Coherence $COHERENCE below threshold"
    exit 1
fi
echo "✅ PASS: Coherence = $COHERENCE"

# Test 2: Entanglement Verification
echo "2. Testing entanglement..."
if ! qvpn test-entanglement --pairs 61 --bell-inequality; then
    echo "❌ FAIL: Entanglement violated Bell inequality"
    exit 1
fi
echo "✅ PASS: Entanglement verified"

# Test 3: Security - Eavesdropping Detection
echo "3. Testing eavesdropping detection..."
# Simulate eavesdropping attempt
qvpn simulate-eavesdrop --duration 610 &
EAVESDROP_PID=$!

sleep 0.61

if ! qvpn detect-eavesdropping --check; then
    echo "❌ FAIL: Failed to detect eavesdropping"
    kill $EAVESDROP_PID
    exit 1
fi
echo "✅ PASS: Eavesdropping detected"
kill $EAVESDROP_PID

# Test 4: Quantum Teleportation Fidelity
echo "4. Testing quantum teleportation..."
FIDELITY=$(qvpn test-teleport --iterations 6100 --state random)
if (( $(echo "$FIDELITY < 0.999" | bc -l) )); then
    echo "❌ FAIL: Teleportation fidelity $FIDELITY too low"
    exit 1
fi
echo "✅ PASS: Teleportation fidelity = $FIDELITY"

# Test 5: Non-Locality
echo "5. Testing non-locality..."
LATENCY=$(qvpn test-latency --destination luna_tycho --samples 61)
if (( $(echo "$LATENCY > 0.000001" | bc -l) )); then
    echo "❌ FAIL: Latency $LATENCY too high for non-local connection"
    exit 1
fi
echo "✅ PASS: Zero latency confirmed"

echo "=================================="
echo "🎉 ALL TESTS PASSED - qVPN OPERATIONAL"
