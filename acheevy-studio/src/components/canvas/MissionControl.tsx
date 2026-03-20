'use client';

import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
  useOnSelectionChange,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import RoleNode from '@/components/nodes/RoleNode';
import styles from './MissionControl.module.css';

const nodeTypes = { roleNode: RoleNode };

const initialNodes: Node[] = [
  // Tier 0 — Command
  { id: 'acheevy', type: 'roleNode', position: { x: 420, y: 20 },
    data: { role: 'acheevy', label: 'ACHEEVY', status: 'active', taskCount: 14, uptime: '99.2%', grade: 'A+', currentTask: 'Orchestrating 3 active pipelines', description: 'Central Orchestrating Head of all digital agents.' }},
  // Tier 1 — HR & Oversight
  { id: 'betty_anne', type: 'roleNode', position: { x: 120, y: 160 },
    data: { role: 'betty_anne', label: 'Betty-Anne_Ang', status: 'active', taskCount: 7, uptime: '98.1%', grade: 'A', currentTask: 'Grading Boomer_Ang performance', description: 'PMO HR oversight node matching TEP execution performance.' }},
  // Tier 1 — Intent
  { id: 'ntntn', type: 'roleNode', position: { x: 420, y: 160 },
    data: { role: 'ntntn', label: 'NTNTN', status: 'active', taskCount: 22, uptime: '99.8%', grade: 'A+', currentTask: 'Normalizing intent: API scaffold', description: 'Translates human text to objective frames.' }},
  // Tier 1 — Context
  { id: 'mim', type: 'roleNode', position: { x: 720, y: 160 },
    data: { role: 'mim', label: 'MIM', status: 'active', taskCount: 18, uptime: '100%', grade: 'A+', currentTask: 'Context pack v3.2 active', description: 'Governs session history and rules validation.' }},
  // Tier 2 — Routing
  { id: 'picker', type: 'roleNode', position: { x: 420, y: 300 },
    data: { role: 'picker', label: 'Picker_Ang', status: 'complete', taskCount: 31, uptime: '97.6%', grade: 'A', currentTask: 'Routed to qwen3.5:9b', description: 'Capability-first LLM provider routing.' }},
  // Tier 2 — Execution agents
  { id: 'boomer1', type: 'roleNode', position: { x: 120, y: 440 },
    data: { role: 'boomer', label: 'Scripter_Ang', status: 'active', taskCount: 5, uptime: '95.3%', grade: 'B+', currentTask: 'Drafting TEP for video pipeline', description: 'Specialized for writing event narratives.' }},
  { id: 'boomer2', type: 'roleNode', position: { x: 350, y: 440 },
    data: { role: 'boomer', label: 'Coder_Ang', status: 'complete', taskCount: 12, uptime: '98.7%', grade: 'A', currentTask: 'API endpoint deployed', description: 'Submits code and patches to local files via OpenSandbox.' }},
  { id: 'boomer3', type: 'roleNode', position: { x: 580, y: 440 },
    data: { role: 'boomer', label: 'Research_Ang', status: 'standby', taskCount: 3, uptime: '92.0%', grade: 'B', currentTask: 'Waiting for assignment', description: 'Uses DeerFlow or Brave to verify domain facts.' }},
  // Chicken Hawk
  { id: 'chicken_hawk', type: 'roleNode', position: { x: 810, y: 440 },
    data: { role: 'chicken_hawk', label: 'Chicken Hawk', status: 'active', taskCount: 8, uptime: '94.1%', grade: 'A-', currentTask: 'Procuring Seedance 2.0 access', description: 'A rigid governance loop tool over any active agent/tooling.' }},
  // Tier 3 — QA & Assembly
  { id: 'review', type: 'roleNode', position: { x: 270, y: 580 },
    data: { role: 'review', label: 'Review / Hone', status: 'complete', taskCount: 19, uptime: '99.4%', grade: 'A+', currentTask: 'All checks passed', description: 'Validation gate, asserts output matches constraint map.' }},
  { id: 'buildsmith', type: 'roleNode', position: { x: 530, y: 580 },
    data: { role: 'buildsmith', label: 'BuildSmith', status: 'active', taskCount: 9, uptime: '97.8%', grade: 'A', currentTask: 'Assembling delivery bundle', description: 'Engine assembling components to final artifacts limit.' }},
  // Tier 4 — Escalation
  { id: 'avva_noon', type: 'roleNode', position: { x: 810, y: 580 },
    data: { role: 'avva_noon', label: 'AVVA NOON', status: 'standby', taskCount: 2, uptime: '100%', grade: 'S', currentTask: 'Standing by for escalation', description: 'Agent Zero failover loop logic for critical breakdowns.' }},
  // Tier 4 — Packaging
  { id: 'packaging', type: 'roleNode', position: { x: 400, y: 720 },
    data: { role: 'packaging', label: 'Packaging', status: 'idle', taskCount: 6, uptime: '100%', grade: 'A+', currentTask: 'Awaiting BuildSmith output', description: 'Packages output with KYB evidence records.' }},
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'acheevy', target: 'betty_anne', animated: true },
  { id: 'e2', source: 'acheevy', target: 'ntntn', animated: true },
  { id: 'e3', source: 'acheevy', target: 'mim', animated: true },
  { id: 'e4', source: 'ntntn', target: 'picker', animated: true },
  { id: 'e5', source: 'mim', target: 'picker', animated: true },
  { id: 'e6', source: 'picker', target: 'boomer1', animated: true },
  { id: 'e7', source: 'picker', target: 'boomer2', animated: true },
  { id: 'e8', source: 'picker', target: 'boomer3' },
  { id: 'e9', source: 'picker', target: 'chicken_hawk', animated: true },
  { id: 'e10', source: 'betty_anne', target: 'boomer1', style: { strokeDasharray: '3,6' } },
  { id: 'e11', source: 'betty_anne', target: 'boomer2', style: { strokeDasharray: '3,6' } },
  { id: 'e12', source: 'betty_anne', target: 'boomer3', style: { strokeDasharray: '3,6' } },
  { id: 'e13', source: 'boomer1', target: 'review', animated: true },
  { id: 'e14', source: 'boomer2', target: 'review', animated: true },
  { id: 'e15', source: 'boomer3', target: 'review' },
  { id: 'e16', source: 'review', target: 'buildsmith', animated: true },
  { id: 'e17', source: 'buildsmith', target: 'packaging', animated: true },
  { id: 'e18', source: 'review', target: 'avva_noon', style: { stroke: 'rgba(255,64,87,0.3)', strokeDasharray: '4,4' } },
];

interface TEPEntry {
  id: string;
  agent: string;
  role: string;
  objective: string;
  chain: string;
  status: 'drafted' | 'active' | 'graded';
  grade?: string;
  timestamp: string;
}

const mockTEPs: TEPEntry[] = [
  { id: 'tep-001', agent: 'Scripter_Ang', role: 'Boomer_Ang', objective: 'Draft execution script for video pipeline', chain: 'ACHEEVY → Picker → Scripter', status: 'active', timestamp: '22:31:04' },
  { id: 'tep-002', agent: 'Coder_Ang', role: 'Boomer_Ang', objective: 'Deploy REST API authentication endpoints', chain: 'ACHEEVY → Picker → Coder', status: 'graded', grade: 'A', timestamp: '22:28:17' },
  { id: 'tep-003', agent: 'Chicken Hawk', role: 'Lil_Hawk', objective: 'Procure Seedance 2.0 account via CN number', chain: 'ACHEEVY → Picker → Hawk', status: 'active', timestamp: '22:30:45' },
  { id: 'tep-004', agent: 'Research_Ang', role: 'Boomer_Ang', objective: 'Analyze Wan 2.5 OSS integration viability', chain: 'ACHEEVY → Picker → Research', status: 'drafted', timestamp: '22:32:01' },
];

function MissionControlInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [clock, setClock] = useState('');
  const [selectedTep, setSelectedTep] = useState<string | null>(null);
  
  // View states
  const [viewMode, setViewMode] = useState<'monitor' | 'circuit'>('monitor');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Circuit Settings States
  const [apiOpenRouter, setApiOpenRouter] = useState(true);
  const [dbInsForge, setDbInsForge] = useState(true);
  const [apiFallbacks, setApiFallbacks] = useState(false);
  const [uiColor, setUiColor] = useState('#d4a030');
  const [uiLogoUrl, setUiLogoUrl] = useState('/logo.png');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0'));
    };
    tick();
    const i = setInterval(tick, 100);
    return () => clearInterval(i);
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    [setEdges]
  );

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length > 0) {
        setSelectedNode(nodes[0]);
        setSelectedTep(null);
      } else {
        setSelectedNode(null);
      }
    },
  });

  const [liveLog, setLiveLog] = useState<string[]>([]);
  const [pipelineActive, setPipelineActive] = useState(false);

  // Poll backend for ACHEEVY state
  useEffect(() => {
    let poller = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:3050/v1/acheevy/state');
        if (res.ok) {
          const data = await res.json();
          setLiveLog(data.logs);
          setPipelineActive(data.activeNode !== 'idle');
          
          setNodes((nds) => nds.map(n => {
             // Map backend node ID to frontend node ID
             let backendKey = '';
             if (n.id === 'acheevy') backendKey = 'acheevy';
             if (n.id === 'ntntn') backendKey = 'ntntn';
             if (n.id === 'mim') backendKey = 'mim';
             if (n.id === 'picker') backendKey = 'picker';
             if (n.id === 'boomer1') backendKey = 'scripter'; // Using scripter for boomer1
             if (n.id === 'review') backendKey = 'review';
             if (n.id === 'packaging') backendKey = 'packaging';
             if (n.id === 'chicken_hawk') backendKey = 'chicken_hawk'; // Fallback
             
             if (backendKey && data.nodes[backendKey]) {
                return {
                  ...n,
                  data: {
                    ...n.data,
                    status: data.nodes[backendKey].status,
                    taskCount: data.nodes[backendKey].tasks,
                    grade: data.nodes[backendKey].grade
                  }
                };
             }
             // For agents not in the direct mock loop, just stay idle/standby
             if (data.activeNode !== 'idle' && ['boomer2', 'boomer3', 'betty_anne', 'avva_noon', 'chicken_hawk'].includes(n.id)) {
               return { ...n, data: { ...n.data, status: 'standby' } };
             } else if (data.activeNode === 'idle') {
                return { ...n, data: { ...n.data, status: 'complete' } };
             }
             return n;
          }));
        }
      } catch (err) {
        // Mock server might be down
      }
    }, 1000);
    return () => clearInterval(poller);
  }, [setNodes]);

  const runSimulation = async () => {
     try {
       await fetch('http://localhost:3050/v1/acheevy/simulate', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ task: "Draft execution script for video pipeline (Wan 2.5)" })
       });
     } catch (e) {
       console.error("Backend offline.");
     }
  };

  const counts = nodes.reduce(
    (acc, n) => {
      const s = (n.data as Record<string, unknown>)?.status as string || 'idle';
      if (s === 'active') acc.active++;
      else if (s === 'complete') acc.complete++;
      else if (s === 'failed') acc.failed++;
      else acc.standby++;
      return acc;
    },
    { active: 0, complete: 0, failed: 0, standby: 0 }
  );

  return (
    <div className={styles.layout}>
      {/* ===== HEADER ===== */}
      <header className={styles.header}>
        <div className={styles.hLeft}>
          <span className={styles.logo}>◈ <strong>ACHEEVY</strong> <span className={styles.logoSub}>Mission Control</span></span>
        </div>
        
        <div className={styles.hCenter}>
          <button 
            className={`${styles.viewBtn} ${viewMode === 'monitor' ? styles.viewBtnActive : ''}`}
            onClick={() => setViewMode('monitor')}
          >
            LIVE MONITOR
          </button>
          <button 
            className={`${styles.viewBtn} ${viewMode === 'circuit' ? styles.viewBtnActive : ''}`}
            onClick={() => setViewMode('circuit')}
          >
            CIRCUIT BOX
          </button>
        </div>

        <div className={styles.hRight}>
          <div className={styles.statusRow}>
            <div className={styles.sBlock}><span className={styles.sDot} style={{ background: 'var(--accent-green)' }} /><span className={styles.sNum}>{counts.active}</span> Active</div>
            <div className={styles.sBlock}><span className={styles.sDot} style={{ background: 'var(--accent-gold)' }} /><span className={styles.sNum}>{counts.complete}</span> Done</div>
            <div className={styles.sBlock}><span className={styles.sDot} style={{ background: 'var(--accent-amber)' }} /><span className={styles.sNum}>{counts.standby}</span> Standby</div>
            <div className={styles.sBlock}><span className={styles.sDot} style={{ background: 'var(--accent-red)' }} /><span className={styles.sNum}>{counts.failed}</span> Failed</div>
          </div>
          <span className={styles.separator}>|</span>
          <span className={styles.clock}>{clock}</span>
        </div>
      </header>

      <div className={styles.body}>
        {viewMode === 'monitor' ? (
          <>
            {/* ===== MAIN CANVAS ===== */}
            <div className={styles.canvas}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.15 }}
                proOptions={{ hideAttribution: true }}
                minZoom={0.4}
                maxZoom={1.5}
              >
                <Background variant={BackgroundVariant.Dots} gap={32} size={0.5} color="rgba(212,160,48,0.04)" />
              </ReactFlow>
            </div>

            {/* ===== RIGHT PANEL ===== */}
            <aside className={styles.panel}>
              {selectedNode ? (
                <div className={styles.nodeDetailPanel}>
                  <div className={styles.panelHeader}>
                    <span className={styles.panelTitle}>Live Feed: {selectedNode.data.label as string}</span>
                  </div>
                  <div className={styles.nodeDetailContent}>
                    <div className={styles.detailBadge}>
                       {selectedNode.data.status === 'active' ? 'PROCESSING' : selectedNode.data.status === 'complete' ? 'READY' : 'STANDBY'}
                    </div>
                    
                    <p className={styles.nodeDesc}>{selectedNode.data.description as string || "Telemetry signal robust."}</p>
                    
                    <div className={styles.metricRow}>
                      <span className={styles.metricLbl}>Current Action:</span>
                      <span className={styles.metricVal}>{selectedNode.data.currentTask as string || "Idle"}</span>
                    </div>
                    <div className={styles.metricRow}>
                      <span className={styles.metricLbl}>Task Count:</span>
                      <span className={styles.metricVal}>{selectedNode.data.taskCount as string} ops</span>
                    </div>
                    <div className={styles.metricRow}>
                      <span className={styles.metricLbl}>Overall Grade:</span>
                      <span className={styles.metricVal} style={{color: 'var(--accent-gold)'}}>{selectedNode.data.grade as string}</span>
                    </div>

                    <div className={styles.liveLogBox}>
                      <div className={styles.logHeader}>[SYS.STREAM] — Live Connection</div>
                      {liveLog.length > 0 ? liveLog.slice(0,4).map((l, i) => (
                        <div key={i} className={styles.logLine} style={{color: i === 0 ? 'var(--accent-green)' : '#888'}}>
                           {l}
                        </div>
                      )) : (
                        <>
                          <div className={styles.logLine}>[OK] Handshake established...</div>
                          <div className={styles.logLine}>[OK] Awaiting dispatch...</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.tepPanel}>
                  <div className={styles.panelHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <span className={styles.panelTitle}>Task Execution Plans</span>
                      <span className={styles.panelCount}>{mockTEPs.length}</span>
                    </div>
                    <button 
                       onClick={runSimulation} 
                       disabled={pipelineActive}
                       style={{ background: pipelineActive ? '#333' : 'var(--accent-gold)', color: pipelineActive ? '#888' : '#000', border: 'none', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                       {pipelineActive ? 'PIPELINE ACTIVE' : 'DISPATCH TASK'}
                    </button>
                  </div>

                  <div className={styles.tepList}>
                    {mockTEPs.map((tep) => (
                      <div
                        key={tep.id}
                        className={`${styles.tepCard} ${selectedTep === tep.id ? styles.tepSelected : ''}`}
                        onClick={() => setSelectedTep(selectedTep === tep.id ? null : tep.id)}
                      >
                        <div className={styles.tepTop}>
                          <span className={`${styles.tepStatus} ${styles[`tep_${tep.status}`]}`}>{tep.status.toUpperCase()}</span>
                          <span className={styles.tepTime}>{tep.timestamp}</span>
                        </div>
                        <div className={styles.tepAgent}>{tep.agent}</div>
                        <div className={styles.tepObj}>{tep.objective}</div>
                        <div className={styles.tepChain}>
                          <span className={styles.tepChainLabel}>Chain:</span> {tep.chain}
                        </div>
                        {tep.grade && (
                          <div className={styles.tepGrade}>
                            <span>Performance Grade:</span>
                            <strong>{tep.grade}</strong>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.panelFooter}>
                <div className={styles.footerStat}>
                  <span className={styles.footerLabel}>Memory</span>
                  <span className={styles.footerVal}>ReMe (CoPaw)</span>
                </div>
                <div className={styles.footerStat}>
                  <span className={styles.footerLabel}>Sandbox</span>
                  <span className={styles.footerVal}>OpenSandbox</span>
                </div>
                <div className={styles.footerStat}>
                  <span className={styles.footerLabel}>Failover</span>
                  <span className={styles.footerVal}>AVVA NOON</span>
                </div>
              </div>
            </aside>
          </>
        ) : (
          <div className={styles.circuitBoxContainer}>
             <div className={styles.circuitHeader}>
                <h2>Main System Breakers</h2>
                <p>Modify active API endpoints, database connections, and site customization from this panel. All connections are LIVE.</p>
             </div>

             <div className={styles.circuitGrid}>
               
               {/* APIS AND CONNECTIONS */}
               <div className={styles.breakerPanel}>
                  <h3>APIs & Connections</h3>
                  
                  <div className={styles.breakerRow}>
                    <div className={styles.breakerInfo}>
                      <span className={styles.breakerTitle}>OpenRouter Core</span>
                      <span className={styles.breakerSubUrl}>Live Balance Active</span>
                    </div>
                    <label className={styles.breakerSwitch}>
                      <input type="checkbox" checked={apiOpenRouter} onChange={e => setApiOpenRouter(e.target.checked)}/>
                      <span className={styles.breakerSlider}></span>
                    </label>
                  </div>

                  <div className={styles.breakerRow}>
                    <div className={styles.breakerInfo}>
                      <span className={styles.breakerTitle}>InsForge Backend</span>
                      <span className={styles.breakerSubUrl}>Postgres/Realtime Edge</span>
                    </div>
                    <label className={styles.breakerSwitch}>
                      <input type="checkbox" checked={dbInsForge} onChange={e => setDbInsForge(e.target.checked)}/>
                      <span className={styles.breakerSlider}></span>
                    </label>
                  </div>

                  <div className={styles.breakerRow}>
                    <div className={styles.breakerInfo}>
                      <span className={styles.breakerTitle}>Fallback Chains</span>
                      <span className={styles.breakerSubUrl}>Local Ollama Fallback</span>
                    </div>
                    <label className={styles.breakerSwitch}>
                      <input type="checkbox" checked={apiFallbacks} onChange={e => setApiFallbacks(e.target.checked)}/>
                      <span className={styles.breakerSlider}></span>
                    </label>
                  </div>
               </div>

               {/* CUSTOMIZATION */}
               <div className={styles.breakerPanel}>
                  <h3>Web Customizations</h3>
                  <div className={styles.inputRow}>
                    <label>Logo Asset URL</label>
                    <input type="text" value={uiLogoUrl} onChange={e => setUiLogoUrl(e.target.value)} />
                  </div>
                  <div className={styles.inputRow}>
                    <label>Primary Theme Color</label>
                    <div className={styles.colorRow}>
                      <input type="color" value={uiColor} onChange={e => setUiColor(e.target.value)} />
                      <span>{uiColor}</span>
                    </div>
                  </div>
                  <button className={styles.actionBtn}>Deploy UI Changes</button>
               </div>

                {/* ACCESS & CONTROL */}
                <div className={styles.breakerPanel}>
                  <h3>Access & Control</h3>
                  <p className={styles.inviteDesc}>Manage PMO office roles and operator invitations.</p>
                  <div className={styles.inputRow}>
                    <label>Invite User (Email)</label>
                    <div className={styles.inviteRow}>
                      <input type="email" placeholder="agent.00@achievemor.net" />
                      <button className={styles.actionBtn}>Send Invite</button>
                    </div>
                  </div>
                  <div className={styles.activeUsers}>
                    <span>1 Active Admin (CMDR)</span>
                  </div>
               </div>

             </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MissionControl() {
  return (
    <ReactFlowProvider>
      <MissionControlInner />
    </ReactFlowProvider>
  );
}
