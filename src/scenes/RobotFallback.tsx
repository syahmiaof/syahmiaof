export function RobotFallback() {
  return <svg className="topology-fallback robot-fallback" viewBox="0 0 700 600" fill="none" aria-hidden="true">
    <g stroke="#416452"><path d="M70 320H190M510 320H630M350 55V100M350 470V530" strokeDasharray="4 8" /><ellipse cx="350" cy="520" rx="150" ry="24" /><ellipse cx="350" cy="520" rx="105" ry="15" /></g>
    <rect x="218" y="150" width="264" height="178" rx="45" fill="#9ba99a" stroke="#d1dbca" strokeWidth="2" /><rect x="236" y="173" width="228" height="127" rx="32" fill="#10251b" />
    <g fill="#63dfb0">{[298,402].map(x => <g key={x}><circle cx={x} cy="228" r="25" /><circle cx={x+3} cy="230" r="12" fill="#143e2b" /><circle cx={x-6} cy="219" r="5" fill="#edf5e8" /></g>)}<rect x="335" y="271" width="30" height="4" rx="2" /><circle cx="424" cy="114" r="9" /></g>
    <path d="M424 124V149M330 328V350M370 328V350" stroke="#719681" strokeWidth="9" /><rect x="269" y="349" width="162" height="129" rx="26" fill="#9ba99a" stroke="#d1dbca" /><rect x="287" y="367" width="126" height="89" rx="16" fill="#10251b" /><circle cx="350" cy="406" r="24" stroke="#63dfb0" strokeWidth="3" /><circle cx="350" cy="406" r="11" fill="#63dfb0" />
    <g fill="#829782" stroke="#d1dbca"><rect x="225" y="354" width="28" height="94" rx="14" /><rect x="447" y="354" width="28" height="94" rx="14" /></g>
  </svg>;
}
