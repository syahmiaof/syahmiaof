'use client';
import { profile } from '@/data/profile';

export default function ErrorPage({ reset }: { reset: () => void }) { return <main id="main" className="section error-page"><span className="mono signal-text">CONNECTION INTERRUPTED</span><h1>Let’s reconnect.</h1><p>This page could not load. Try again, or contact Syahmi by email.</p><button className="primary-button" onClick={reset}>Try again</button><a href={`mailto:${profile.email}`} className="text-link">Email Syahmi</a></main>; }
