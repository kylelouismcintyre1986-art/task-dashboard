import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BeakerIcon, BookOpenIcon, CheckCircleIcon, ChevronRightIcon, ClockIcon,
  FireIcon, FlaskIcon, HomeIcon, InformationCircleIcon, PlusIcon, ScaleIcon,
  ShieldCheckIcon, SparklesIcon, WrenchScrewdriverIcon, XMarkIcon,
} from '@heroicons/react/24/outline';

import { TaskProvider } from './context/TaskContext';
import { TagProvider } from './context/TagContext';
import { ListProvider } from './context/ListContext';


function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewBatch, setShowNewBatch] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [batchType, setBatchType] = useState('Fermentation');
  const [measurement, setMeasurement] = useState({ gravity: '', temp: '' });
  const [batches, setBatches] = useState([
    { id: 1, name: 'Citrus Saison', type: 'Fermentation', status: 'Active', day: 8, total: 14, gravity: '1.012', target: '1.008', temp: '68°F', note: 'Bright and lively · airlock active', color: 'amber' },
    { id: 2, name: 'Blueberry Mead', type: 'Fermentation', status: 'Active', day: 21, total: 45, gravity: '1.038', target: '1.010', temp: '64°F', note: 'Slow and steady · nutrient day 3', color: 'violet' },
    { id: 3, name: 'Apple Brandy', type: 'Distillation', status: 'Resting', day: 4, total: 10, gravity: '78.4%', target: '80.0%', temp: '58°F', note: 'Resting before second pass', color: 'sky' },
  ]);
  const [timers, setTimers] = useState([
    { id: 1, label: 'Saison fermentation', remaining: '06d 04h', color: 'amber' },
    { id: 2, label: 'Mead nutrient reminder', remaining: '02h 18m', color: 'violet' },
  ]);

  const activeBatches = batches.filter((batch) => batch.status === 'Active').length;
  const progress = useMemo(() => Math.round(batches.reduce((sum, batch) => sum + (batch.day / batch.total), 0) / batches.length * 100), [batches]);

  const addBatch = (event) => {
    event.preventDefault();
    if (!batchName.trim()) return;
    setBatches((current) => [...current, {
      id: Date.now(), name: batchName.trim(), type: batchType, status: 'Active', day: 1,
      total: batchType === 'Distillation' ? 10 : 14, gravity: batchType === 'Distillation' ? '—' : '1.050',
      target: batchType === 'Distillation' ? '80.0%' : '1.010', temp: '68°F',
      note: 'New batch · add a measurement when ready', color: batchType === 'Distillation' ? 'sky' : 'emerald',
    }]);
    setBatchName('');
    setShowNewBatch(false);
  };

  const addMeasurement = (event) => {
    event.preventDefault();
    if (!measurement.gravity) return;
    setBatches((current) => current.map((batch, index) => index === 0
      ? { ...batch, gravity: measurement.gravity, temp: measurement.temp ? `${measurement.temp}°F` : batch.temp, note: 'Measurement logged just now · looking good' }
      : batch));
    setMeasurement({ gravity: '', temp: '' });
    setShowMeasurement(false);
  };

  const navItems = [
    ['overview', 'Overview', HomeIcon],
    ['batches', 'Batches', BeakerIcon],
    ['recipes', 'Recipes', BookOpenIcon],
    ['timers', 'Timers', ClockIcon],
  ];

  return (
    <TaskProvider>
      <TagProvider>
        <ListProvider>
          <div className="app-shell" data-testid="app">
            <aside className="sidebar">
              <div className="brand"><div className="brand-mark"><FlaskIcon /></div><div><strong>stillroom</strong><span>fermentation studio</span></div></div>
              <div className="sidebar-label">Workspace</div>
              <nav>{navItems.map(([key, label, Icon]) => <button key={key} className={activeTab === key ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab(key)}><Icon /><span>{label}</span>{key === 'batches' && <em>{batches.length}</em>}</button>)}</nav>
              <div className="sidebar-spacer" />
              <div className="safety-mini"><ShieldCheckIcon /><div><strong>Safety first</strong><span>Review your local laws</span></div><ChevronRightIcon /></div>
              <div className="profile"><div className="avatar">KL</div><div><strong>Kyle's cellar</strong><span>Personal workspace</span></div><span className="online-dot" /></div>
            </aside>

            <main className="main-content">
              <header className="topbar"><div className="mobile-brand"><div className="brand-mark"><FlaskIcon /></div><strong>stillroom</strong></div><div className="topbar-actions"><button className="icon-button"><InformationCircleIcon /></button><button className="avatar top-avatar">KL</button></div></header>
              <div className="content-wrap">
                <div className="page-heading"><div><p className="eyebrow">SUNDAY, SEPTEMBER 20, 2026</p><h1>Good morning, Kyle <span>✦</span></h1><p className="subheading">Your cellar is humming. Here's what needs your attention.</p></div><button className="primary-button" onClick={() => setShowNewBatch(true)}><PlusIcon /> New batch</button></div>

                <section className="stats-grid">
                  <div className="stat-card accent-amber"><div className="stat-icon"><BeakerIcon /></div><div><span>Active batches</span><strong>{activeBatches}</strong><small>+1 this week</small></div></div>
                  <div className="stat-card accent-green"><div className="stat-icon"><CheckCircleIcon /></div><div><span>Ready to bottle</span><strong>2</strong><small>One in 3 days</small></div></div>
                  <div className="stat-card accent-violet"><div className="stat-icon"><ScaleIcon /></div><div><span>Avg. completion</span><strong>{progress}%</strong><small>Across all batches</small></div></div>
                  <div className="stat-card accent-sky"><div className="stat-icon"><SparklesIcon /></div><div><span>Cellar streak</span><strong>12 <small>days</small></strong><small>Keep it going</small></div></div>
                </section>

                <div className="dashboard-grid">
                  <section className="panel batches-panel">
                    <div className="panel-header"><div><h2>Active batches</h2><p>Keep an eye on your living projects</p></div><button className="text-button" onClick={() => setActiveTab('batches')}>View all <ChevronRightIcon /></button></div>
                    <div className="batch-list">{batches.slice(0, activeTab === 'batches' ? batches.length : 3).map((batch) => <motion.article layout key={batch.id} className="batch-card">
                      <div className={`batch-accent ${batch.color}`} /><div className="batch-main"><div className="batch-top"><div><span className={`pill ${batch.type === 'Distillation' ? 'pill-sky' : 'pill-amber'}`}>{batch.type}</span><h3>{batch.name}</h3></div><button className="more-button">•••</button></div>
                      <div className="progress-meta"><span>Day {batch.day} of {batch.total}</span><strong>{Math.round(batch.day / batch.total * 100)}%</strong></div><div className="progress-track"><div className={`progress-fill ${batch.color}`} style={{ width: `${Math.round(batch.day / batch.total * 100)}%` }} /></div>
                      <div className="batch-details"><span><ScaleIcon /> {batch.gravity}</span><span><FireIcon /> {batch.temp}</span><span className="batch-note">{batch.note}</span></div></div>
                    </motion.article>)}</div>
                    <button className="add-inline" onClick={() => setShowNewBatch(true)}><PlusIcon /> Add another batch</button>
                  </section>

                  <aside className="right-column">
                    <section className="panel attention-panel"><div className="panel-header"><div><h2>Next up</h2><p>Your cellar checklist</p></div><WrenchScrewdriverIcon className="header-icon" /></div><div className="checklist"><label><span className="check checked"><CheckCircleIcon /></span><span><strong>Log Saison gravity</strong><small>Due today · Citrus Saison</small></span></label><label><span className="check"><ClockIcon /></span><span><strong>Check mead nutrients</strong><small>In 2 hours · Blueberry Mead</small></span></label><label><span className="check"><FlaskIcon /></span><span><strong>Sanitize bottling gear</strong><small>Tomorrow · General</small></span></label></div><button className="full-button" onClick={() => setShowMeasurement(true)}>Log a measurement <PlusIcon /></button></section>
                    <section className="panel timer-panel"><div className="panel-header"><div><h2>Timers</h2><p>Keep your rhythm</p></div><ClockIcon className="header-icon" /></div>{timers.map((timer) => <div className="timer-row" key={timer.id}><span className={`timer-dot ${timer.color}`} /><span>{timer.label}</span><strong>{timer.remaining}</strong><button onClick={() => setTimers((current) => current.filter((item) => item.id !== timer.id))}><XMarkIcon /></button></div>)}<button className="add-inline timer-add" onClick={() => setTimers((current) => [...current, { id: Date.now(), label: 'New cellar timer', remaining: '24h 00m', color: 'sky' }])}><PlusIcon /> Start a timer</button></section>
                  </aside>
                </div>

                <section className="guidance-banner"><div className="guidance-icon"><ShieldCheckIcon /></div><div><strong>Make it safely, make it legal.</strong><p>Distilling alcohol may require permits in your area. Always check local regulations, use food-safe equipment, and never distill indoors without proper ventilation.</p></div><button onClick={() => setActiveTab('recipes')}>Read the guide <ChevronRightIcon /></button></section>
              </div>
              <AnimatePresence>
                {(showNewBatch || showMeasurement) && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => { setShowNewBatch(false); setShowMeasurement(false); }}>
                  <motion.div className="modal" initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18 }} onMouseDown={(event) => event.stopPropagation()}>
                    <button className="modal-close" onClick={() => { setShowNewBatch(false); setShowMeasurement(false); }}><XMarkIcon /></button>
                    {showNewBatch ? <form onSubmit={addBatch}><p className="eyebrow">CELLAR SETUP</p><h2>Start a new batch</h2><p className="modal-copy">Give your next project a name and choose the process you’re tracking.</p><label>Batch name<input autoFocus value={batchName} onChange={(event) => setBatchName(event.target.value)} placeholder="e.g. Ginger saison" /></label><label>Process<select value={batchType} onChange={(event) => setBatchType(event.target.value)}><option>Fermentation</option><option>Distillation</option></select></label><button className="primary-button modal-submit" type="submit">Create batch <ChevronRightIcon /></button></form>
                      : <form onSubmit={addMeasurement}><p className="eyebrow">CITRUS SAISON</p><h2>Log a measurement</h2><p className="modal-copy">Record the latest reading so you can spot trends over time.</p><label>Specific gravity<input autoFocus inputMode="decimal" value={measurement.gravity} onChange={(event) => setMeasurement({ ...measurement, gravity: event.target.value })} placeholder="e.g. 1.012" /></label><label>Temperature <span className="optional">(optional)</span><input inputMode="numeric" value={measurement.temp} onChange={(event) => setMeasurement({ ...measurement, temp: event.target.value })} placeholder="°F" /></label><button className="primary-button modal-submit" type="submit">Save measurement <CheckCircleIcon /></button></form>}
                  </motion.div>
                </motion.div>}
              </AnimatePresence>
            </main>
          </div>
        </ListProvider>
      </TagProvider>
    </TaskProvider>
  );
}

export default App;
