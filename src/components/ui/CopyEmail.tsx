'use client';
import { useEffect, useRef, useState } from 'react';

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState('Copy email');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() {
    try { await navigator.clipboard.writeText(email); setStatus('Copied'); }
    catch { setStatus('Could not copy — select the email above'); }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('Copy email'), 4000);
  }
  return <div className="copy-email"><button type="button" onClick={copy}>Copy email</button><span role="status">{status === 'Copy email' ? '' : status}</span></div>;
}
