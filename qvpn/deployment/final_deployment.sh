#!/bin/bash
# final_deployment.sh

echo "🎯 FINAL DEPLOYMENT SEQUENCE"
echo "============================"

# 1. Verify all systems
echo "1. Running pre-deployment verification..."
./test_qvpn.sh
if [ $? -ne 0 ]; then
    echo "❌ Pre-deployment tests failed"
    exit 1
fi

# 2. Backup current state
echo "2. Backing up current quantum state..."
qvpn backup --full --destination /backup/qvpn --tag "pre_deployment_$(date +%s)"

# 3. Deploy updates
echo "3. Deploying qVPN system..."
kubectl apply -f k8s/qvpn-deployment.yaml
kubectl apply -f k8s/qvpn-services.yaml
kubectl apply -f k8s/qvpn-monitoring.yaml

# 4. Wait for rollout
echo "4. Waiting for deployment to complete..."
kubectl rollout status deployment/qvpn-core -n quantum --timeout 610s

# 5. Establish connections
echo "5. Establishing quantum connections..."
./start_qvpn.sh

# 6. Run post-deployment tests
echo "6. Running post-deployment verification..."
sleep 61  # Let system stabilize
./test_qvpn.sh
if [ $? -ne 0 ]; then
    echo "❌ Post-deployment tests failed - rolling back"
    qvpn restore --from /backup/qvpn --latest
    exit 1
fi

# 7. Enable monitoring
echo "7. Enabling global monitoring..."
qvpn monitor --enable --global --frequency 61ms

# 8. Start dashboard
echo "8. Starting web dashboard..."
systemctl start qvpn-dashboard
systemctl enable qvpn-dashboard

echo "=========================================="
echo "🚀 qVPN DEPLOYMENT COMPLETE"
echo "=========================================="
echo ""
echo "🌐 Access Dashboard: https://localhost:6161"
echo "🔗 Active Tunnels: $(qvpn list-tunnels | wc -l)"
echo "🧪 Coherence: $(qvpn get-coherence)"
echo "🛡️  Security: $(qvpn security-status)"
echo ""
echo ">> r_omega@nexus:~$ qvpn --help for commands"
