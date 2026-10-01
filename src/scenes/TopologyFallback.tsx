export function TopologyFallback({ className = '' }: { className?: string }) {
  return <svg className={`topology-fallback ${className}`} viewBox="0 0 700 600" fill="none" aria-hidden="true">
    <g stroke="#26483c" strokeWidth="1"><path d="M90 420H215V330H350V160H545M90 260H250V190H350M350 330H510V420H620M350 330V510H530M350 160V75" /><path d="M70 480H160V370H290V115H470M450 130V260H595" strokeDasharray="3 8" /></g>
    <g stroke="#688a79"><rect x="270" y="250" width="160" height="160" rx="3" /><rect x="294" y="274" width="112" height="112" /><path d="M310 240V218M330 240V218M350 240V218M370 240V218M390 240V218M310 420V442M330 420V442M350 420V442M370 420V442M390 420V442M260 290H238M260 310H238M260 330H238M260 350H238M260 370H238M440 290H462M440 310H462M440 330H462M440 350H462M440 370H462" /></g>
    <rect x="311" y="291" width="78" height="78" fill="#073c2e" stroke="#3bd6a0" />
    <g fill="#5de2b4">{[[90,420],[90,260],[350,75],[545,160],[620,420],[530,510],[595,260]].map(([x,y]) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="4" /><circle cx={x} cy={y} r="12" stroke="#375a49" fill="none" /></g>)}</g>
    <g fill="#8faaa0" fontFamily="monospace" fontSize="10"><text x="318" y="333">COMPUTE</text><text x="70" y="243">EDGE INPUT</text><text x="541" y="145">NETWORK</text><text x="525" y="535">DATA LAYER</text><text x="569" y="448">INTERFACE</text></g>
  </svg>;
}
