import { AnimatedTitle } from '@/components/motion/AnimatedTitle';
import { ArrowUp, ArrowUpRight, Mail, MessageCircle } from 'lucide-react';
import { profile, socials } from '@/data/profile';
import { SocialIcon } from '@/components/ui/SocialIcon';

export function Footer({ compact = false }: { compact?: boolean }) {
  return <footer id="contact" className={`section contact-section ${compact ? 'compact-contact' : ''}`}>
    {!compact && <><AnimatedTitle animation="converge" id="contact-title">LET’S BUILD<br />SOMETHING <span className="contact-accent">REAL.</span></AnimatedTitle><p className="contact-lead">Have a project, an opportunity, or a system worth figuring out?</p></>}
    <div className="contact-methods">
      <a href={`mailto:${profile.email}`} className="contact-method"><Mail size={22} aria-hidden="true" /><span><span className="contact-method-label">Email me</span><strong>{profile.email}</strong></span><ArrowUpRight size={24} aria-hidden="true" /></a>
      <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" className="contact-method"><MessageCircle size={22} aria-hidden="true" /><span><span className="contact-method-label">Let’s talk on WhatsApp</span><strong>{profile.phone}</strong></span><ArrowUpRight size={24} aria-hidden="true" /></a>
    </div>
    <div className="footer-connect"><div><h3>Elsewhere on the internet.</h3><div className="social-links" aria-label="Social profiles">
      {socials.map(social => social.href ? <a key={social.platform} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} title={social.label}><SocialIcon platform={social.platform} /><span>{social.label}</span></a> : <span key={social.platform} className="social-unavailable" role="img" aria-label={`${social.label} profile coming soon`} title={`${social.label} — profile coming soon`}><SocialIcon platform={social.platform} /><span>{social.label}</span></span>)}
    </div>{socials.some(social => !social.href) && <p className="social-note">More profiles coming soon.</p>}</div><a href={profile.resumeUrl} className="footer-resume">Request resume<ArrowUpRight size={18} aria-hidden="true" /></a></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Syahmi Aof</span><a href={profile.siteUrl}>syahmiaof.my</a><a href="#main" className="back-top">Back to top<ArrowUp size={16} aria-hidden="true" /></a></div>
  </footer>;
}
