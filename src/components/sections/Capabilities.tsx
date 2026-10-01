'use client';
import { useState } from 'react';
import { capabilities, aiWorkflows } from '@/data/capabilities';
import { InteractionHint, TextLink } from '@/components/ui/Primitives';
import { AnimatedTitle } from '@/components/motion/AnimatedTitle';

export function Capabilities() {
  const [selected, setSelected] = useState(0);
  const capability = capabilities[selected];
  return <section id="capabilities" className="section capabilities-section" aria-labelledby="capability-title"><div className="section-title-row"><AnimatedTitle animation="swing" id="capability-title">The system<br /><span className="muted">behind the work.</span></AnimatedTitle><p>No percentages. Just tools,<br />context and room to grow.</p></div><InteractionHint>Try me — choose a node to explore</InteractionHint><div className="capability-layout"><div className="capability-map"><svg viewBox="0 0 640 410" aria-hidden="true"><path d="M320 200L115 70M320 200L320 45M320 200L535 75M320 200L555 255M320 200L410 355M320 200L195 355M320 200L65 250" fill="none" stroke="#345244" /><circle cx="320" cy="200" r="62" fill="none" stroke="#254236" /><circle cx="320" cy="200" r="8" fill="#44d8a5" /></svg><span className="map-center mono">SYAHMI<br />AOF</span><div className="capability-tabs" role="tablist" aria-label="Capability categories">{capabilities.map((item, i) => <button key={item.name} id={`capability-tab-${i}`} aria-selected={selected === i} aria-controls="capability-panel" role="tab" tabIndex={selected === i ? 0 : -1} className={`capability-node cap-${i} ${i === selected ? 'active' : ''}`} onClick={() => setSelected(i)} onKeyDown={event => {
    let next = i;
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (i + 1) % capabilities.length;
    else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (i + capabilities.length - 1) % capabilities.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = capabilities.length - 1;
    else return;
    event.preventDefault(); setSelected(next); document.getElementById(`capability-tab-${next}`)?.focus();
  }}><span />{item.name}</button>)}</div></div><div className="capability-detail" id="capability-panel" role="tabpanel" aria-labelledby={`capability-tab-${selected}`} tabIndex={0}><span className="mono signal-text">{capability.level.replaceAll('-', ' ')}</span><h3>{capability.name}</h3><p className="capability-statement">{capability.description}</p><ul className="technology-list">{capability.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul><p className="evidence-copy">{capability.evidence}</p>{capability.href && <TextLink href={capability.href} external={capability.href.startsWith('https')}>Explore the context</TextLink>}</div></div></section>;
}

export function Intelligence() {
  const [active, setActive] = useState(0);
  const flow = aiWorkflows[active];
  return <section id="intelligence" className="section intelligence-section" aria-labelledby="intelligence-title"><div className="intelligence-heading"><div><AnimatedTitle animation="focal" id="intelligence-title">Beyond the<br />chat window.</AnimatedTitle></div><p>I’m interested in what happens when models connect to tools, data and well-defined workflows. These are conceptual patterns I’m studying.</p></div><InteractionHint>Try me — switch the workflow below</InteractionHint><div className="ai-tabs" role="tablist" aria-label="AI workflow patterns">{aiWorkflows.map((item, index) => <button key={item.name} role="tab" id={`ai-tab-${index}`} aria-controls="ai-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? aiWorkflows.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : aiWorkflows.length - 1)) % aiWorkflows.length; setActive(next); document.getElementById(`ai-tab-${next}`)?.focus();
  }}>{item.name}</button>)}</div><div id="ai-panel" role="tabpanel" aria-labelledby={`ai-tab-${active}`} className="ai-panel" tabIndex={0}><ol className="ai-flow">{flow.steps.map((step, i) => <li key={step}><span className="mono">0{i + 1}</span>{step}</li>)}</ol><p>{flow.description}</p><span className="mono muted">CONCEPTUAL WORKFLOW · NOT A PRODUCTION DEPLOYMENT</span></div></section>;
}

