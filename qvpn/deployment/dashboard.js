// dashboard.js
import React, { useState, useEffect } from 'react';
import { QuantumDashboard } from '@nexus/qvpn-dashboard';

function QVPNDashboard() {
  const [networkStatus, setNetworkStatus] = useState(null);
  const [coherenceData, setCoherenceData] = useState([]);
  const [activeTunnels, setActiveTunnels] = useState([]);

  // Update every 61ms
  useEffect(() => {
    const interval = setInterval(async () => {
      const status = await fetch('https://localhost:6161/status');
      const data = await status.json();

      setNetworkStatus(data.network);
      setCoherenceData(prev => [...prev.slice(-100), data.coherence]);
      setActiveTunnels(data.tunnels);
    }, 61);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="qvpn-dashboard">
      <h1>🌌 qVPN Network Dashboard</h1>

      <div className="status-grid">
        <div className="card coherence-card">
          <h3>Quantum Coherence</h3>
          <div className="value">{networkStatus?.coherence.toFixed(6)}</div>
          <CoherenceGraph data={coherenceData} />
        </div>

        <div className="card tunnels-card">
          <h3>Active Tunnels</h3>
          <div className="value">{activeTunnels.length}</div>
          <TunnelList tunnels={activeTunnels} />
        </div>

        <div className="card security-card">
          <h3>Security Status</h3>
          <div className={`value ${networkStatus?.securityBreach ? 'breach' : 'secure'}`}>
            {networkStatus?.securityBreach ? '⚠️ BREACH' : '✅ SECURE'}
          </div>
          <SecurityLogs />
        </div>
      </div>

      <div className="quantum-visualization">
        <h3>Entanglement Matrix Visualization</h3>
        <EntanglementVisualizer />
      </div>
    </div>
  );
}

export default QVPNDashboard;
