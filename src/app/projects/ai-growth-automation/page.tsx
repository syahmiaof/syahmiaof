import type { Metadata } from 'next';
import { TextLink, Status } from '@/components/ui/Primitives';
import { Footer } from '@/components/layout/Footer';
import { canonical } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'AI Growth Marketer & Automation Specialist',
  description: 'An agentic growth and revenue system that turns social engagement into qualified, traceable sales opportunities through intent detection, lead scoring, structured qualification, model routing and failure-safe handoffs.',
  alternates: { canonical: canonical('/projects/ai-growth-automation') }
};

export default function AIGrowthPage() {
  return (
    <>
      <main id="main" className="case-page">
        <header className="section case-header">
          <TextLink href="/#selected">Back to the work</TextLink>
          <div className="case-title">
            <h1>AI GROWTH<span>.</span></h1>
            <Status>Prototype / Integration</Status>
          </div>
          <p className="case-subtitle">An agentic growth and revenue system.</p>
          <div className="case-meta mono">
            <span>AI AGENTS</span>
            <span>AUTOMATION</span>
            <span>GROWTH</span>
          </div>
        </header>

        <section className="section case-prose">
          <span className="mono signal-text">01 / CONTEXT</span>
          <h2>The qualification gap.</h2>
          <div className="case-columns">
            <p className="large-body">Social engagement and inbound questions often contain sales intent, but manual qualification is inconsistent and difficult to scale.</p>
          </div>
        </section>

        <section className="section case-prose">
          <span className="mono signal-text">02 / SYSTEM</span>
          <h2>The operational chain.</h2>
          <div className="case-columns">
            <p className="large-body">Facebook engagement → Wira FB → sales-intent detection → Pemburu → qualification → scoring → Duta handoff</p>
          </div>
        </section>

        <section className="section case-prose">
          <span className="mono signal-text">03 / AGENT ROLES</span>
          <h2>Specialized responsibilities.</h2>
          <div className="decision-list">
            <article>
              <span className="mono">WIRA FB</span>
              <h3>Facebook organic/community layer.</h3>
              <p>Detects relevant commercial intent from engagement.</p>
            </article>
            <article>
              <span className="mono">PEMBURU</span>
              <h3>AI SDR and lead-intelligence layer.</h3>
              <p>Extracts structured context, qualifies, scores and recommends next action.</p>
            </article>
            <article>
              <span className="mono">DUTA</span>
              <h3>Human-facing follow-up.</h3>
              <p>Receives qualified handoffs for relationship management.</p>
            </article>
          </div>
          <div style={{ marginTop: '30px' }}>
            <p className="mono muted">Note: Agent roles are distinct from the underlying automation infrastructure.</p>
          </div>
        </section>

        <section className="section case-prose">
          <span className="mono signal-text">04 / QUALIFICATION MODEL</span>
          <h2>Objective scoring dimensions.</h2>
          <div className="case-columns">
            <p className="large-body">HOT / WARM / COLD / SPAM</p>
            <div>
              <p>The system evaluates intent, fit, urgency, and authority signals. It uses BANT-style qualification where evidence exists in the conversation.</p>
              <p style={{ marginTop: '15px' }}><strong>Unknown information remains UNKNOWN.</strong> The system must not invent budget or authority if it wasn&apos;t provided.</p>
            </div>
          </div>
        </section>

        <section className="section case-prose">
          <span className="mono signal-text">05 / EVIDENCE</span>
          <h2>Verified prototype behavior.</h2>
          <div className="decision-list">
            <article>
              <span className="mono">TEST POOL</span>
              <h3>15 synthetic leads evaluated.</h3>
              <p>Validates HOT / WARM / COLD / SPAM classification.</p>
            </article>
            <article>
              <span className="mono">STRUCTURED EXTRACTION</span>
              <h3>Consistent schema generation.</h3>
              <p>The system reliably maps conversations to a structured lead schema, executing BANT-style qualification and product/service matching.</p>
            </article>
            <article>
              <span className="mono">HANDOFF TICKETS</span>
              <h3>Deterministic completion.</h3>
              <p>Produces qualified-lead handoff tickets, demonstrating zero-silent-drop recovery behavior via DLQ.</p>
            </article>
            <article>
              <span className="mono">ARCHITECTURE</span>
              <h3>Centralized inference gateway.</h3>
              <p>Validates the core routing layer that manages AI model execution.</p>
            </article>
          </div>
        </section>

        <section className="section case-prose" style={{ background: 'var(--bg-secondary)', paddingBottom: '70px' }}>
          <span className="mono signal-text">RELIABILITY</span>
          <h2>Engineered for failure recovery.</h2>
          <div className="decision-list" style={{ marginTop: '30px' }}>
            <article>
              <span className="mono">AI INFERENCE GATEWAY</span>
              <p style={{ marginTop: '10px' }}>Centralized model routing abstracts the LLM provider from the core logic.</p>
            </article>
            <article>
              <span className="mono">TELEMETRY</span>
              <p style={{ marginTop: '10px' }}>Latency, model choices, and usage tracking are built into the pipeline.</p>
            </article>
            <article>
              <span className="mono">FALLBACK</span>
              <p style={{ marginTop: '10px' }}>A deterministic local engine steps in if external AI is unavailable.</p>
            </article>
            <article>
              <span className="mono">DLQ & SELF-HEALING</span>
              <p style={{ marginTop: '10px' }}>Failed lead events are preserved for recovery in the DLQ. Automated retry, incident creation, and verification ensure resilience.</p>
            </article>
          </div>
        </section>

        <section className="section case-prose">
          <span className="mono signal-text">CURRENT LIMITATION</span>
          <h2>Honest prototype status.</h2>
          <div className="case-columns">
            <p className="large-body" style={{ color: 'var(--signal-primary)' }}>The Meta Page access token had expired during live integration testing.</p>
            <div>
              <p>The latest prototype cannot yet claim a continuously verified end-to-end production flow.</p>
              <p style={{ marginTop: '15px' }}>Next validation target: real Facebook comment → detection → qualification → scoring → Duta handoff → audit record.</p>
            </div>
          </div>
        </section>

        <section className="section case-deployment">
          <span className="mono signal-text">FUTURE KPIs</span>
          <h2>Measurable targets.</h2>
          <ol className="deployment-flow" style={{ marginTop: '30px' }}>
            <li><span className="mono">01</span>Intent-to-qualified rate</li>
            <li><span className="mono">02</span>Qualified-to-handoff rate</li>
            <li><span className="mono">03</span>Response latency</li>
            <li><span className="mono">04</span>False-positive rate</li>
            <li><span className="mono">05</span>Dropped-lead rate</li>
          </ol>
        </section>
      </main>
      <Footer compact />
    </>
  );
}
