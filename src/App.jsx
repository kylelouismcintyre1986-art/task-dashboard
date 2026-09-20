import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BeakerIcon, BookOpenIcon, CheckCircleIcon, ChevronRightIcon, ClockIcon,
  FireIcon, HomeIcon, InformationCircleIcon, PlusIcon, ScaleIcon,
  ShieldCheckIcon, SparklesIcon, WrenchScrewdriverIcon, XMarkIcon,
} from '@heroicons/react/24/outline';

import { TaskProvider } from './context/TaskContext';
import { TagProvider } from './context/TagContext';
import { ListProvider } from './context/ListContext';


function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewBatch, setShowNewBatch] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [showRunPlanner, setShowRunPlanner] = useState(false);
  const [toolFilter, setToolFilter] = useState('All');
  const [selectedTool, setSelectedTool] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showRecipes, setShowRecipes] = useState(false);
  const [recipeFilter, setRecipeFilter] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeSource, setRecipeSource] = useState('AHA homebrew tutorials');
  const [toolSearch, setToolSearch] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [journal, setJournal] = useState([
    { date: 'SEP 20', text: 'Saison is bright and lively. Gravity is moving toward target.', tag: 'Citrus Saison' },
    { date: 'SEP 18', text: 'Apple brandy rested cleanly after the first pass.', tag: 'Apple Brandy' },
  ]);
  const [batchName, setBatchName] = useState('');
  const [batchType, setBatchType] = useState('Fermentation');
  const [measurement, setMeasurement] = useState({ gravity: '', temp: '' });
  const [runPlan, setRunPlan] = useState({ wash: 'Apple brandy wash', volume: '12', startingAbv: '10', targetAbv: '40' });
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

  const plannedOutput = Math.max(0, ((Number(runPlan.volume) || 0) * (Number(runPlan.startingAbv) || 0) / (Number(runPlan.targetAbv) || 1))).toFixed(1);
  const tools = [
    { name: 'ABV calculator', category: 'Calculators', icon: ScaleIcon, description: 'Estimate alcohol from original and final gravity.', action: 'Open calculator' },
    { name: 'Proof & dilution', category: 'Calculators', icon: BeakerIcon, description: 'Bring spirit to bottling proof with precision.', action: 'Open calculator' },
    { name: 'Heads / hearts / tails', category: 'Methods', icon: FireIcon, description: 'Log cuts by jar, proof, aroma, and taste.', action: 'Start cut log' },
    { name: 'Pot still run', category: 'Methods', icon: WrenchScrewdriverIcon, description: 'A slow, expressive run for flavor-forward spirits.', action: 'View method' },
    { name: 'Reflux run', category: 'Methods', icon: SparklesIcon, description: 'Increase purity with controlled reflux and plates.', action: 'View method' },
    { name: 'Fermentation schedule', category: 'Methods', icon: ClockIcon, description: 'Plan pitch, nutrients, degas, and terminal gravity.', action: 'Build schedule' },
    { name: 'Hydrometer', category: 'Equipment', icon: ScaleIcon, description: 'Track gravity before, during, and after fermentation.', action: 'Log reading' },
    { name: 'pH meter', category: 'Equipment', icon: BeakerIcon, description: 'Keep mash and fermentation in a healthy range.', action: 'Log reading' },
    { name: 'Thermometer', category: 'Equipment', icon: FireIcon, description: 'Monitor mash rests, boiler heat, and condenser output.', action: 'Log reading' },
    { name: 'Barrel & aging', category: 'Cellar', icon: BookOpenIcon, description: 'Track fill date, toast, warehouse, and tasting notes.', action: 'Add vessel' },
    { name: 'Bottle inventory', category: 'Cellar', icon: CheckCircleIcon, description: 'Know your glass, closures, labels, and finished stock.', action: 'Open inventory' },
    { name: 'Safety checklist', category: 'Safety', icon: ShieldCheckIcon, description: 'Ventilation, grounding, leak checks, and legal reminders.', action: 'Review checklist' },
  ];
  const toolCategories = ['All', 'Calculators', 'Methods', 'Equipment', 'Cellar', 'Safety'];
  const visibleTools = tools.filter((tool) => (toolFilter === 'All' || tool.category === toolFilter) && `${tool.name} ${tool.description}`.toLowerCase().includes(toolSearch.toLowerCase()));
  const SelectedToolIcon = selectedTool?.icon || BeakerIcon;
  const runGuide = [
    ['1', 'Confirm legality and workspace', 'Check permits, local rules, ventilation, fire safety, and a sober adult operator. Never distill in an enclosed space.'],
    ['2', 'Sanitize and stage equipment', 'Clean and sanitize vessels, hydrometer, thermometer, collection jars, labels, PPE, and spill supplies. Inspect seals and cooling-water lines.'],
    ['3', 'Prepare the wash', 'Record recipe, ingredients, volume, starting gravity, pH, and yeast. Keep the fermenter covered and temperature-controlled.'],
    ['4', 'Ferment to a stable finish', 'Keep the yeast in its manufacturer-recommended range, usually around 64–72°F for many ale strains. Confirm gravity is unchanged for 48 hours before proceeding.'],
    ['5', 'Plan the run', 'Record expected volume and proof, label collection vessels, and define discard/cut notes before heating. Follow the still manufacturer manual for every control.'],
    ['6', 'Operate and monitor', 'Use a calibrated thermometer and never leave the still unattended. Log time, vapor/boiler readings, proof, aroma, and jar number. Do not seal a still or block a vent.'],
    ['7', 'Separate and proof safely', 'Keep fractions clearly labeled, allow spirit to rest, and use a proofing calculator with measured ABV. Add water slowly and let the blend settle before bottling.'],
    ['8', 'Rest, bottle, and archive', 'Use food-safe containers, record final volume and ABV, date the bottle, and store away from heat. Clean, dry, and inspect equipment after the run.'],
  ];
  const recipes = [
    { name: 'Old Mill Amber Ale', style: 'Beer', time: '3–5 weeks', abv: '5–6% beer', source: 'American Homebrewers Association', sourceUrl: 'https://www.homebrewersassociation.org/how-to-brew/', icon: BeakerIcon, ingredients: ['8 lb pale malt extract', '1 lb crystal malt', '1 oz bittering hops', '1 oz aroma hops', 'Ale yeast and brewing water'], steps: ['Sanitize the kettle, fermenter, airlock, hydrometer, and all cold-side equipment.', 'Steep specialty grain, dissolve extract off heat, then follow the hop schedule from your chosen formulation.', 'Cool the wort quickly, transfer safely, top up to volume, and record original gravity.', 'Pitch yeast in its recommended range, keep fermentation steady, and confirm gravity is stable before packaging.', 'Prime or keg according to your equipment, condition, label, and store cool.'], sourceNote: 'Process structure adapted from AHA beginner brewing tutorials.' },
    { name: 'Back Porch Wheat Beer', style: 'Beer', time: '2–4 weeks', abv: '4–5% beer', source: 'American Homebrewers Association', sourceUrl: 'https://www.homebrewersassociation.org/how-to-brew/', icon: SparklesIcon, ingredients: ['5 lb wheat malt extract', '3 lb pale malt extract', 'Citrus-forward hops', 'Wheat beer yeast', 'Orange peel or coriander, optional'], steps: ['Sanitize everything that touches cooled wort.', 'Boil extract and hops using a tested recipe schedule; never seal a boiling vessel.', 'Cool to yeast range, oxygenate only as recommended, and pitch yeast.', 'Track temperature and gravity; package only after a stable finishing reading.', 'Condition, chill, and record tasting notes for the next batch.'], sourceNote: 'Use the AHA tutorial collection for tested process variations.' },
    { name: 'Orchard Table Wine', style: 'Wine', time: '4–8 weeks', abv: '10–12% wine', source: 'AWRI wine industry resources', sourceUrl: 'https://www.awri.com.au/', icon: SparklesIcon, ingredients: ['5 gal preservative-free apple or white grape juice', 'Wine yeast', 'Yeast nutrient', 'Pectic enzyme, if using fruit', 'Campden or sanitation product, per label'], steps: ['Sanitize the fermenter, hydrometer, siphon, bung, and bottles.', 'Record juice source, starting gravity, pH, and temperature before pitching yeast.', 'Ferment in the yeast manufacturer range; use an airlock and never seal an active fermenter.', 'Rack off sediment when appropriate, then confirm stable gravity and taste before bottling.', 'Bottle in clean glass, label the date, and allow the wine to mature before judging it.'], sourceNote: 'Always follow product labels and local food/wine rules.' },
    { name: 'Blackberry Country Wine', style: 'Wine', time: '6–12 weeks', abv: '10–13% wine', source: 'AWRI wine industry resources', sourceUrl: 'https://www.awri.com.au/', icon: FireIcon, ingredients: ['5–6 lb blackberries', '5 gal water', '2–3 lb sugar, adjusted to target gravity', 'Wine yeast and nutrient', 'Pectic enzyme'], steps: ['Sanitize equipment and place fruit in a fine mesh bag.', 'Measure and adjust sugar, record starting gravity and pH, then add enzyme and nutrient.', 'Pitch yeast in range and manage temperature and fruit cap gently.', 'Press or rack away from fruit, allow fermentation to finish, then rack off sediment.', 'Stabilize and bottle only when readings are stable and the wine is clear.'], sourceNote: 'Source links open the reference organization for current guidance.' },
    { name: 'Appalachian Corn Moonshine', style: 'Classic', time: '10–14 days', abv: '8–12% wash', icon: FireIcon, ingredients: ['8 lb cracked flaked corn', '1 lb malted barley', '5 gal chlorine-free water', 'Distillers yeast, per package rate', 'Yeast nutrient, per manufacturer guidance'], steps: ['Mash corn in a food-safe vessel and record the recipe and starting gravity.', 'Cool to the yeast manufacturer range, add barley, then pitch yeast and nutrient.', 'Ferment covered until gravity is stable for 48 hours; log temperature and pH daily.', 'For any distillation, use only a legal, permitted facility and follow the still manual and local requirements.', 'Rest, proof, label, and archive the finished spirit with batch volume and ABV.'] },
    { name: 'Apple Pie Moonshine Cordial', style: 'Infusion', time: '3–7 days', abv: 'Proofed spirit', icon: SparklesIcon, ingredients: ['1 L legally purchased neutral spirit', '1.5 L fresh apple cider', '2 cinnamon sticks', '2 whole cloves', 'Orange peel and maple syrup to taste'], steps: ['Sanitize a glass infusion jar and record the spirit proof.', 'Combine cider, spices, and orange peel; keep refrigerated and covered.', 'Blend with the legally purchased spirit only after the cider mixture has cooled.', 'Taste daily, strain when balanced, and dilute with measured water if needed.', 'Bottle, label allergens/ingredients, and refrigerate.'] },
    { name: 'Blueberry Backwoods Brandy', style: 'Fruit', time: '14–21 days', abv: '8–11% wash', icon: BeakerIcon, ingredients: ['6 lb ripe blueberries', '1 lb dextrose or sugar', '5 gal water', 'Wine or fruit yeast', 'Yeast nutrient and pectic enzyme'], steps: ['Sanitize the fermenter and crush fruit in a brew bag.', 'Add sugar, water, pectic enzyme, and yeast nutrient; record starting gravity.', 'Pitch yeast in range and keep the fermenter temperature stable.', 'Press or rack off fruit, then confirm a stable finishing gravity.', 'For a legal licensed distillery run, bring the full batch record and fruit notes.'] },
    { name: 'Smoky Rye Moonshine Wash', style: 'Grain', time: '7–12 days', abv: '9–13% wash', icon: WrenchScrewdriverIcon, ingredients: ['6 lb malted rye', '2 lb malted barley', '5 gal water', 'Distillers yeast', 'Optional food-safe smoked malt, measured carefully'], steps: ['Mill grain, mash according to the malt supplier directions, and record mash temperature.', 'Cool promptly to yeast range, oxygenate only as recommended, and pitch yeast.', 'Log gravity, temperature, pH, and aroma throughout fermentation.', 'Do not seal a fermenter or still; use proper venting and licensed facilities.', 'Rest the finished spirit on its own or with a small, documented oak sample.'] },
  ];
  const recipeStyles = ['All', 'Beer', 'Wine', 'Classic', 'Infusion', 'Fruit', 'Grain'];
  const visibleRecipes = recipes.filter((recipe) => recipeFilter === 'All' || recipe.style === recipeFilter);

  const navItems = [
    ['overview', 'Overview', HomeIcon],
    ['batches', 'Batches', BeakerIcon],
    ['recipes', 'Moonshine', FireIcon],
    ['beer', 'Beer making', BeakerIcon],
    ['wine', 'Wine making', SparklesIcon],
    ['timers', 'Timers', ClockIcon],
  ];
  const addJournalEntry = (event) => {
    event.preventDefault();
    if (!journalEntry.trim()) return;
    setJournal((current) => [{ date: 'TODAY', text: journalEntry.trim(), tag: 'Cellar journal' }, ...current]);
    setJournalEntry('');
  };

  return (
    <TaskProvider>
      <TagProvider>
        <ListProvider>
          <div className="app-shell" data-testid="app">
            <aside className="sidebar">
              <div className="brand"><div className="brand-mark"><BeakerIcon /></div><div><strong>stillroom</strong><span>fermentation studio</span></div></div>
              <div className="sidebar-label">Workspace</div>
              <nav>{navItems.map(([key, label, Icon]) => <button key={key} className={activeTab === key ? 'nav-item active' : 'nav-item'} onClick={() => { setActiveTab(key); if (key === 'recipes' || key === 'beer' || key === 'wine') { setRecipeSource(key === 'beer' ? 'American Homebrewers Association' : key === 'wine' ? 'AWRI wine industry resources' : 'Moonshine studio'); setRecipeFilter(key === 'beer' ? 'Beer' : key === 'wine' ? 'Wine' : 'All'); setShowRecipes(true); } }}><Icon /><span>{label}</span>{key === 'batches' && <em>{batches.length}</em>}</button>)}</nav>
              <div className="sidebar-spacer" />
              <div className="safety-mini"><ShieldCheckIcon /><div><strong>Safety first</strong><span>Review your local laws</span></div><ChevronRightIcon /></div>
              <div className="profile"><div className="avatar">KL</div><div><strong>Kyle's cellar</strong><span>Personal workspace</span></div><span className="online-dot" /></div>
            </aside>

            <main className="main-content">
              <header className="topbar"><div className="mobile-brand"><div className="brand-mark"><BeakerIcon /></div><strong>stillroom</strong></div><div className="topbar-actions"><button className="icon-button"><InformationCircleIcon /></button><button className="avatar top-avatar">KL</button></div></header>
              <div className="content-wrap">
                <div className="page-heading"><div><p className="eyebrow">MASTER DISTILLER · SUNDAY, SEPTEMBER 20, 2026</p><h1>Good morning, Kyle <span>✦</span></h1><p className="subheading">Plan the run, make the cuts, and know exactly what is in your cellar.</p></div><div className="heading-actions"><button className="secondary-button" onClick={() => setShowRunPlanner(true)}><FireIcon /> Plan a run</button><button className="primary-button" onClick={() => setShowNewBatch(true)}><PlusIcon /> New batch</button></div></div>
                <div className="feature-launches"><button className="guide-launch" onClick={() => setShowGuide(true)}><div className="guide-launch-icon"><BookOpenIcon /></div><div><strong>Run guide: from ingredients to bottle</strong><span>Step-by-step checklist with temperatures, measurements, equipment, and safety gates</span></div><ChevronRightIcon /></button><button className="guide-launch recipe-launch" onClick={() => setShowRecipes(true)}><div className="guide-launch-icon"><SparklesIcon /></div><div><strong>Moonshine recipe library</strong><span>Classic corn, fruit brandy, rye wash, and legal infusion walkthroughs</span></div><ChevronRightIcon /></button></div>

                <section className="stats-grid">
                  <div className="stat-card accent-amber"><div className="stat-icon"><BeakerIcon /></div><div><span>Active batches</span><strong>{activeBatches}</strong><small>+1 this week</small></div></div>
                  <div className="stat-card accent-green"><div className="stat-icon"><CheckCircleIcon /></div><div><span>Ready to bottle</span><strong>2</strong><small>One in 3 days</small></div></div>
                  <div className="stat-card accent-violet"><div className="stat-icon"><ScaleIcon /></div><div><span>Avg. completion</span><strong>{progress}%</strong><small>Across all batches</small></div></div>
                  <div className="stat-card accent-sky"><div className="stat-icon"><SparklesIcon /></div><div><span>Cellar streak</span><strong>12 <small>days</small></strong><small>Keep it going</small></div></div>
                </section>

                <section className="panel toolbox-panel">
                  <div className="panel-header toolbox-header"><div><p className="eyebrow">THE DISTILLER'S TOOLBOX</p><h2>Every tool, every method, one place</h2><p>Choose a workflow and keep your notes connected to the batch.</p></div><div className="toolbox-badge"><SparklesIcon /><span>{tools.length} tools ready</span></div></div>
                  <div className="tool-controls"><div className="tool-search"><InformationCircleIcon /><input aria-label="Search tools and methods" value={toolSearch} onChange={(event) => setToolSearch(event.target.value)} placeholder="Search tools, methods, equipment..." /></div><div className="tool-filters">{toolCategories.map((category) => <button key={category} className={toolFilter === category ? 'tool-filter active' : 'tool-filter'} onClick={() => setToolFilter(category)}>{category}</button>)}</div></div>
                  <div className="tool-grid">{visibleTools.map((tool) => { const Icon = tool.icon; return <button className="tool-card" key={tool.name} onClick={() => setSelectedTool(tool)}><span className="tool-icon"><Icon /></span><span className="tool-card-copy"><strong>{tool.name}</strong><small>{tool.description}</small><em>{tool.action} <ChevronRightIcon /></em></span></button>; })}</div>
                </section>

                <section className="command-grid">
                  <section className="panel inventory-panel"><div className="panel-header"><div><p className="eyebrow">CELLAR INVENTORY</p><h2>Know what you have</h2><p>Supplies to check before the next run</p></div><BeakerIcon className="header-icon" /></div><div className="inventory-list"><div><span className="inventory-dot good" /><span>Fermentation vessels</span><strong>6 / 8 ready</strong></div><div><span className="inventory-dot low" /><span>Hydrometer & test jars</span><strong>2 need cleaning</strong></div><div><span className="inventory-dot good" /><span>Yeast & nutrients</span><strong>8 in stock</strong></div><div><span className="inventory-dot warn" /><span>Bottles & closures</span><strong>Low · 24 left</strong></div></div><button className="text-button">Open full inventory <ChevronRightIcon /></button></section>
                  <section className="panel journal-panel"><div className="panel-header"><div><p className="eyebrow">BATCH JOURNAL</p><h2>Keep the living record</h2><p>Small notes make better batches</p></div><BookOpenIcon className="header-icon" /></div><div className="journal-list">{journal.slice(0, 2).map((entry) => <div className="journal-entry" key={`${entry.date}-${entry.text}`}><span>{entry.date}</span><p>{entry.text}<small>{entry.tag}</small></p></div>)}</div><form className="journal-form" onSubmit={addJournalEntry}><input aria-label="Add journal note" value={journalEntry} onChange={(event) => setJournalEntry(event.target.value)} placeholder="Add a quick cellar note..." /><button aria-label="Save journal note" type="submit"><PlusIcon /></button></form></section>
                  <section className="panel week-panel"><div className="panel-header"><div><p className="eyebrow">THIS WEEK</p><h2>Your cellar rhythm</h2><p>Three small wins add up</p></div><ClockIcon className="header-icon" /></div><div className="week-plan"><div><span>MON</span><strong>Check gravity</strong><small>Saison · 5 min</small></div><div><span>WED</span><strong>Rack fruit wine</strong><small>Blackberry · 20 min</small></div><div><span>SAT</span><strong>Sanitize gear</strong><small>Before the run · 15 min</small></div></div></section>
                </section>

                <div className="master-grid">
                  <section className="panel run-panel">
                    <div className="panel-header"><div><h2>Next distillation run</h2><p>Apple Brandy · spirit run</p></div><span className="status-live"><i /> READY</span></div>
                    <div className="run-hero"><div className="still-illustration"><div className="still-pot" /><div className="still-neck" /><div className="still-arm" /><div className="still-drop" /></div><div className="run-readiness"><span className="eyebrow">EQUIPMENT READINESS</span><strong>92%</strong><div className="progress-track"><div className="progress-fill emerald" style={{ width: '92%' }} /></div><p>All critical checks passed</p></div></div>
                    <div className="run-metrics"><div><span>Wash volume</span><strong>18.0 L</strong></div><div><span>Est. hearts</span><strong>2.4 L</strong></div><div><span>Starting ABV</span><strong>10.8%</strong></div><div><span>Target proof</span><strong>80 proof</strong></div></div>
                    <div className="run-checks"><span><CheckCircleIcon /> Still sanitized</span><span><CheckCircleIcon /> Collection jars labeled</span><span><ClockIcon /> 4h 20m est.</span></div>
                    <button className="full-button run-button" onClick={() => setShowRunPlanner(true)}>Open run planner <ChevronRightIcon /></button>
                  </section>
                  <section className="panel cuts-panel"><div className="panel-header"><div><h2>Cut planner</h2><p>Make clean, repeatable decisions</p></div><ScaleIcon className="header-icon" /></div><div className="cut-dial"><div className="dial-ring"><strong>80</strong><span>PROOF</span></div><div className="cut-copy"><span>Current collection</span><strong>1.2 L</strong><small>at 78.4% ABV</small></div></div><div className="cut-bar"><span className="heads" style={{ width: '9%' }} /><span className="hearts" style={{ width: '63%' }} /><span className="tails" style={{ width: '28%' }} /></div><div className="cut-legend"><span><i className="heads" /> Heads <strong>0.2 L</strong></span><span><i className="hearts" /> Hearts <strong>1.2 L</strong></span><span><i className="tails" /> Tails <strong>0.5 L</strong></span></div><button className="text-button" onClick={() => setShowMeasurement(true)}>Log a proof reading <ChevronRightIcon /></button></section>
                </div>

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
                    <section className="panel attention-panel"><div className="panel-header"><div><h2>Next up</h2><p>Your cellar checklist</p></div><WrenchScrewdriverIcon className="header-icon" /></div><div className="checklist"><label><span className="check checked"><CheckCircleIcon /></span><span><strong>Log Saison gravity</strong><small>Due today · Citrus Saison</small></span></label><label><span className="check"><ClockIcon /></span><span><strong>Check mead nutrients</strong><small>In 2 hours · Blueberry Mead</small></span></label><label><span className="check"><BeakerIcon /></span><span><strong>Sanitize bottling gear</strong><small>Tomorrow · General</small></span></label></div><button className="full-button" onClick={() => setShowMeasurement(true)}>Log a measurement <PlusIcon /></button></section>
                    <section className="panel timer-panel"><div className="panel-header"><div><h2>Timers</h2><p>Keep your rhythm</p></div><ClockIcon className="header-icon" /></div>{timers.map((timer) => <div className="timer-row" key={timer.id}><span className={`timer-dot ${timer.color}`} /><span>{timer.label}</span><strong>{timer.remaining}</strong><button onClick={() => setTimers((current) => current.filter((item) => item.id !== timer.id))}><XMarkIcon /></button></div>)}<button className="add-inline timer-add" onClick={() => setTimers((current) => [...current, { id: Date.now(), label: 'New cellar timer', remaining: '24h 00m', color: 'sky' }])}><PlusIcon /> Start a timer</button></section>
                  </aside>
                </div>

                <section className="guidance-banner"><div className="guidance-icon"><ShieldCheckIcon /></div><div><strong>Make it safely, make it legal.</strong><p>Distilling alcohol may require permits in your area. Always check local regulations, use food-safe equipment, and never distill indoors without proper ventilation.</p></div><button onClick={() => setActiveTab('recipes')}>Read the guide <ChevronRightIcon /></button></section>
              </div>
              <AnimatePresence>
                {showRecipes && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setShowRecipes(false)}><motion.div className="modal recipe-modal" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowRecipes(false)}><XMarkIcon /></button><p className="eyebrow">FERMENTATION LIBRARY · {recipeSource}</p><h2>Recipes & walkthroughs</h2><p className="modal-copy">Beer, wine, moonshine washes, and spirit infusions with ingredient lists, checkpoints, and safety-first methods. Distillation is only for permitted operators; infusion recipes use legally purchased spirits.</p><div className="recipe-filters">{recipeStyles.map((style) => <button key={style} className={recipeFilter === style ? 'tool-filter active' : 'tool-filter'} onClick={() => setRecipeFilter(style)}>{style}</button>)}</div><div className="recipe-grid">{visibleRecipes.map((recipe) => { const RecipeIcon = recipe.icon; return <button className="recipe-card" key={recipe.name} onClick={() => setSelectedRecipe(recipe)}><span className="tool-icon"><RecipeIcon /></span><span><strong>{recipe.name}</strong><small>{recipe.style} · {recipe.time}</small><em>Open walkthrough <ChevronRightIcon /></em></span></button>; })}</div><div className="method-note"><ShieldCheckIcon /><span>Moonshine is not a legal exemption. Check permits and local law before fermenting for distillation, and never distill indoors or unattended.</span></div><a className="source-link" href="https://www.homebrewersassociation.org/how-to-brew/" target="_blank" rel="noreferrer">Open reference tutorials <ChevronRightIcon /></a></motion.div></motion.div>}
              </AnimatePresence>
              <AnimatePresence>
                {selectedRecipe && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setSelectedRecipe(null)}><motion.div className="modal recipe-detail-modal" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedRecipe(null)}><XMarkIcon /></button><p className="eyebrow">{selectedRecipe.style} RECIPE · {selectedRecipe.time}</p><h2>{selectedRecipe.name}</h2><div className="recipe-abv">{selectedRecipe.abv}</div><h3>Ingredients</h3><ul className="ingredient-list">{selectedRecipe.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul><h3>Walkthrough</h3><div className="recipe-steps">{selectedRecipe.steps.map((step, index) => <div key={step}><span>{index + 1}</span><p>{step}</p></div>)}</div>{selectedRecipe.sourceUrl && <a className="source-link" href={selectedRecipe.sourceUrl} target="_blank" rel="noreferrer">View {selectedRecipe.source} <ChevronRightIcon /></a>}<button className="primary-button modal-submit" onClick={() => setSelectedRecipe(null)}>Add to workspace <PlusIcon /></button></motion.div></motion.div>}
              </AnimatePresence>
              <AnimatePresence>
                {showGuide && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setShowGuide(false)}><motion.div className="modal guide-modal" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowGuide(false)}><XMarkIcon /></button><p className="eyebrow">MASTER RUN GUIDE</p><h2>From ingredients to bottle</h2><p className="modal-copy">A practical record-keeping workflow for a legal, ventilated, food-safe run. Exact distillation controls vary by equipment: use the manufacturer manual for heat and coolant settings.</p><div className="guide-steps">{runGuide.map(([number, title, copy]) => <div className="guide-step" key={number}><span>{number}</span><div><strong>{title}</strong><p>{copy}</p></div></div>)}</div><div className="guide-supplies"><strong>Stage before you start</strong><p>Recipe ingredients · yeast and nutrients · sanitized fermenter · hydrometer · calibrated thermometer · pH strips or meter · still and condenser · food-safe collection jars · labels and marker · gloves and eye protection · fire extinguisher · proofing calculator.</p></div><button className="primary-button modal-submit" onClick={() => setShowGuide(false)}>Start a guided run <ChevronRightIcon /></button></motion.div></motion.div>}
              </AnimatePresence>
              <AnimatePresence>
                {selectedTool && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setSelectedTool(null)}><motion.div className="modal tool-modal" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedTool(null)}><XMarkIcon /></button><span className="tool-icon large"><SelectedToolIcon /></span><p className="eyebrow">{selectedTool.category}</p><h2>{selectedTool.name}</h2><p className="modal-copy">{selectedTool.description}</p><div className="method-note"><ShieldCheckIcon /><span>Use food-safe equipment, document each reading, and follow your local regulations before operating a still.</span></div><button className="primary-button modal-submit" onClick={() => setSelectedTool(null)}>Add to workspace <PlusIcon /></button></motion.div></motion.div>}
              </AnimatePresence>
              <AnimatePresence>
                {(showNewBatch || showMeasurement) && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => { setShowNewBatch(false); setShowMeasurement(false); }}>
                  <motion.div className="modal" initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18 }} onMouseDown={(event) => event.stopPropagation()}>
                    <button className="modal-close" onClick={() => { setShowNewBatch(false); setShowMeasurement(false); }}><XMarkIcon /></button>
                    {showNewBatch ? <form onSubmit={addBatch}><p className="eyebrow">CELLAR SETUP</p><h2>Start a new batch</h2><p className="modal-copy">Give your next project a name and choose the process you’re tracking.</p><label>Batch name<input autoFocus value={batchName} onChange={(event) => setBatchName(event.target.value)} placeholder="e.g. Ginger saison" /></label><label>Process<select value={batchType} onChange={(event) => setBatchType(event.target.value)}><option>Fermentation</option><option>Distillation</option></select></label><button className="primary-button modal-submit" type="submit">Create batch <ChevronRightIcon /></button></form>
                      : showRunPlanner ? <form onSubmit={(event) => { event.preventDefault(); setShowRunPlanner(false); }}><p className="eyebrow">DISTILLATION WORKBENCH</p><h2>Plan a spirit run</h2><p className="modal-copy">Use this estimate to set expectations before heating. Always follow your equipment manual and local regulations.</p><label>Wash or mash<input autoFocus value={runPlan.wash} onChange={(event) => setRunPlan({ ...runPlan, wash: event.target.value })} /></label><div className="form-row"><label>Volume (L)<input inputMode="decimal" value={runPlan.volume} onChange={(event) => setRunPlan({ ...runPlan, volume: event.target.value })} /></label><label>Starting ABV<input inputMode="decimal" value={runPlan.startingAbv} onChange={(event) => setRunPlan({ ...runPlan, startingAbv: event.target.value })} /></label></div><label>Target ABV<input inputMode="decimal" value={runPlan.targetAbv} onChange={(event) => setRunPlan({ ...runPlan, targetAbv: event.target.value })} /></label><div className="estimate-box"><span>Estimated neutral-equivalent output</span><strong>{plannedOutput} L</strong><small>Before cuts, losses, and proofing</small></div><button className="primary-button modal-submit" type="submit">Save run plan <CheckCircleIcon /></button></form>
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
