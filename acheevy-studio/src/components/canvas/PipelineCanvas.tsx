'use client';

import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import RoleNode from '@/components/nodes/RoleNode';
import styles from './Canvas.module.css';

// Register custom node types
const nodeTypes = {
  roleNode: RoleNode,
};

// Default ACHEEVY DAG Layout
const defaultNodes: Node[] = [
  {
    id: 'ntntn',
    type: 'roleNode',
    position: { x: 400, y: 40 },
    data: { role: 'ntntn', label: 'NTNTN', status: 'idle' },
  },
  {
    id: 'mim',
    type: 'roleNode',
    position: { x: 400, y: 200 },
    data: { role: 'mim', label: 'MIM', status: 'idle' },
  },
  {
    id: 'picker',
    type: 'roleNode',
    position: { x: 400, y: 360 },
    data: { role: 'picker', label: 'Picker_Ang', status: 'idle' },
  },
  {
    id: 'boomer',
    type: 'roleNode',
    position: { x: 400, y: 520 },
    data: { role: 'boomer', label: 'Boomer_Ang', status: 'idle' },
  },
  {
    id: 'review',
    type: 'roleNode',
    position: { x: 400, y: 680 },
    data: { role: 'review', label: 'Review / Hone', status: 'idle' },
  },
  {
    id: 'buildsmith',
    type: 'roleNode',
    position: { x: 400, y: 840 },
    data: { role: 'buildsmith', label: 'BuildSmith', status: 'idle' },
  },
  {
    id: 'packaging',
    type: 'roleNode',
    position: { x: 400, y: 1000 },
    data: { role: 'packaging', label: 'Packaging', status: 'idle' },
  },
];

const defaultEdges: Edge[] = [
  { id: 'e-ntntn-mim', source: 'ntntn', target: 'mim', animated: true },
  { id: 'e-mim-picker', source: 'mim', target: 'picker', animated: true },
  { id: 'e-picker-boomer', source: 'picker', target: 'boomer', animated: true },
  { id: 'e-boomer-review', source: 'boomer', target: 'review', animated: true },
  { id: 'e-review-buildsmith', source: 'review', target: 'buildsmith', animated: true },
  { id: 'e-buildsmith-packaging', source: 'buildsmith', target: 'packaging', animated: true },
];

type BoardState = 'planning' | 'running' | 'review' | 'blocked' | 'approved' | 'packaged' | 'delivered';

const BOARD_STATE_COLORS: Record<BoardState, string> = {
  planning: 'var(--text-muted)',
  running: 'var(--accent-blue)',
  review: 'var(--accent-amber)',
  blocked: 'var(--accent-rose)',
  approved: 'var(--accent-emerald)',
  packaged: 'var(--accent-purple)',
  delivered: 'var(--accent-cyan)',
};

export default function PipelineCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const [boardState, setBoardState] = useState<BoardState>('planning');
  const [intentInput, setIntentInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges]
  );

  // Simulate running through the pipeline
  const runPipeline = useCallback(async () => {
    if (!intentInput.trim() || isRunning) return;
    setIsRunning(true);

    const roleOrder = ['ntntn', 'mim', 'picker', 'boomer', 'review', 'buildsmith', 'packaging'];
    const stateTransitions: BoardState[] = ['planning', 'running', 'running', 'running', 'review', 'approved', 'packaged'];

    for (let i = 0; i < roleOrder.length; i++) {
      const roleId = roleOrder[i];
      setBoardState(stateTransitions[i]);

      // Set current node to running
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === roleId) {
            return { ...n, data: { ...n.data, status: 'running' } };
          }
          return n;
        })
      );

      // Wait to simulate processing
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));

      // Set current node to complete with mock metrics
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === roleId) {
            return {
              ...n,
              data: {
                ...n.data,
                status: 'complete',
                metrics: {
                  tokens: Math.floor(Math.random() * 2000) + 100,
                  latency: `${(Math.random() * 2 + 0.1).toFixed(1)}s`,
                  score: Math.random() * 2 + 8,
                },
              },
            };
          }
          return n;
        })
      );
    }

    setBoardState('delivered');
    setIsRunning(false);
  }, [intentInput, isRunning, setNodes]);

  // Reset all nodes
  const resetPipeline = useCallback(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, status: 'idle', metrics: undefined },
      }))
    );
    setBoardState('planning');
    setIntentInput('');
  }, [setNodes]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>◈</span>
            <span>ACHEEVY</span>
            <span className={styles.logoSub}>Studio</span>
          </div>
        </div>

        <div className={styles.headerCenter}>
          <div
            className={styles.boardBadge}
            style={{ '--badge-color': BOARD_STATE_COLORS[boardState] } as React.CSSProperties}
          >
            <div className={styles.boardDot} />
            <span>{boardState.toUpperCase()}</span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <button className={styles.resetBtn} onClick={resetPipeline} disabled={isRunning}>
            Reset
          </button>
        </div>
      </header>

      {/* Intent Bar */}
      <div className={styles.intentBar}>
        <div className={styles.intentIcon}>⚡</div>
        <input
          className={styles.intentInput}
          type="text"
          placeholder="Enter raw intent... e.g. 'Build a chat-first interface with real-time websockets'"
          value={intentInput}
          onChange={(e) => setIntentInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runPipeline()}
          disabled={isRunning}
        />
        <button
          className={styles.runBtn}
          onClick={runPipeline}
          disabled={!intentInput.trim() || isRunning}
        >
          {isRunning ? (
            <span className={styles.spinner} />
          ) : (
            '▶ Run Pipeline'
          )}
        </button>
      </div>

      {/* Canvas */}
      <div className={styles.canvas}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.3}
          maxZoom={2}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(255,255,255,0.04)" />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(node) => {
              const role = (node.data as Record<string, unknown>)?.role as string;
              const status = (node.data as Record<string, unknown>)?.status as string;
              if (status === 'complete') return 'var(--accent-emerald)';
              if (status === 'running') return 'var(--accent-blue)';
              if (status === 'blocked') return 'var(--accent-rose)';
              const colors: Record<string, string> = {
                ntntn: 'var(--node-ntntn)',
                mim: 'var(--node-mim)',
                picker: 'var(--node-picker)',
                boomer: 'var(--node-boomer)',
                review: 'var(--node-review)',
                buildsmith: 'var(--node-buildsmith)',
                packaging: 'var(--node-packaging)',
              };
              return colors[role] || '#444';
            }}
            maskColor="rgba(0,0,0,0.7)"
            style={{ borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
