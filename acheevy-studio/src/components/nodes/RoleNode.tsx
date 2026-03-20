import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import styles from './RoleNode.module.css';

const ROLE_CONFIG: Record<string, {
  icon: string;
  color: string;
  rank: string;
}> = {
  acheevy:      { icon: '◈', color: 'var(--role-acheevy)',     rank: 'CMDR' },
  ntntn:        { icon: '◎', color: 'var(--role-ntntn)',       rank: 'INT' },
  mim:          { icon: '◆', color: 'var(--role-mim)',         rank: 'GOV' },
  picker:       { icon: '◉', color: 'var(--role-picker)',      rank: 'RTR' },
  boomer:       { icon: '▸', color: 'var(--role-boomer)',      rank: 'OPS' },
  review:       { icon: '◇', color: 'var(--role-review)',      rank: 'QA' },
  buildsmith:   { icon: '◧', color: 'var(--role-buildsmith)',  rank: 'ASM' },
  packaging:    { icon: '◫', color: 'var(--role-packaging)',   rank: 'PKG' },
  betty_anne:   { icon: '♛', color: 'var(--role-betty-anne)',   rank: 'HR' },
  scripter:     { icon: '✎', color: 'var(--role-scripter)',    rank: 'SCR' },
  chicken_hawk: { icon: '🦅', color: 'var(--role-chicken-hawk)', rank: 'CHK' },
  avva_noon:    { icon: '⚠', color: 'var(--role-avva-noon)',   rank: 'FIX' },
};

interface RoleNodeData {
  role: string;
  label: string;
  status?: 'idle' | 'active' | 'complete' | 'failed' | 'standby';
  taskCount?: number;
  uptime?: string;
  grade?: string;
  currentTask?: string;
  description?: string;
  [key: string]: unknown;
}

function RoleNode({ data, selected }: NodeProps) {
  const d = data as unknown as RoleNodeData;
  const config = ROLE_CONFIG[d.role] || { icon: '?', color: '#555', rank: '???' };
  const status = d.status || 'idle';

  return (
    <div className={`${styles.nodeContainer} ${selected ? styles.selected : ''}`}>
      <div className={styles.nodeInner} style={{ '--rc': config.color } as React.CSSProperties}>
        {/* FRONT SIDE */}
        <div className={`${styles.nodeFront} ${styles[`s_${status}`]}`}>
          <Handle type="target" position={Position.Top} className={styles.handleTop} />
          
          <div className={styles.top}>
            <span className={styles.rank}>{config.rank}</span>
            <span className={`${styles.statusDot} ${styles[`dot_${status}`]}`} />
          </div>

          <div className={styles.mid}>
            <span className={styles.icon}>{config.icon}</span>
            <div className={styles.info}>
              <div className={styles.name}>{d.label}</div>
              {d.currentTask && <div className={styles.task}>{d.currentTask}</div>}
            </div>
          </div>

          <div className={styles.stats}>
            {d.taskCount != null && (
              <div className={styles.stat}>
                <span className={styles.statVal}>{d.taskCount}</span>
                <span className={styles.statLbl}>Tasks</span>
              </div>
            )}
            {d.uptime && (
              <div className={styles.stat}>
                <span className={styles.statVal}>{d.uptime}</span>
                <span className={styles.statLbl}>Uptime</span>
              </div>
            )}
            {d.grade && (
              <div className={styles.stat}>
                <span className={styles.statVal}>{d.grade}</span>
                <span className={styles.statLbl}>Grade</span>
              </div>
            )}
          </div>
          <Handle type="source" position={Position.Bottom} className={styles.handleBottom} />
        </div>

        {/* BACK SIDE */}
        <div className={`${styles.nodeBack} ${styles[`s_${status}`]}`}>
          <div className={styles.backContent}>
            <span className={styles.backIcon}>{config.icon}</span>
            <h4 style={{ color: config.color }}>{d.label}</h4>
            <p>{d.description || "Active operations underway. Connection live."}</p>
            <div className={styles.liveIndicator}>
               <span className={`${styles.statusDot} ${styles[`dot_${status}`]}`} />
               <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>LIVE FEED</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default memo(RoleNode);
