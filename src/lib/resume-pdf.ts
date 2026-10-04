import { PDFDocument, StandardFonts, rgb, type PDFFont } from 'pdf-lib';
import { profile } from '@/data/profile';
import { resume } from '@/data/resume';

const plain = (text: string) => text.replace(/[–—]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

export async function createResumePdf() {
  const document = await PDFDocument.create();
  document.setTitle(`${profile.name} - CV`);
  document.setAuthor(profile.name);
  document.setSubject('Cloud computing, software development and AI automation');
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  const width = 595.28, height = 841.89, margin = 44;
  let page = document.addPage([width, height]);
  let y = height - margin;

  function lines(text: string, font: PDFFont, size: number, available: number) {
    const output: string[] = [];
    let line = '';
    for (const word of plain(text).split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (line && font.widthOfTextAtSize(next, size) > available) { output.push(line); line = word; }
      else line = next;
    }
    if (line) output.push(line);
    return output;
  }
  function write(text: string, size = 10, font = regular, after = 4, indent = 0) {
    const wrapped = lines(text, font, size, width - margin * 2 - indent);
    const leading = size * 1.32;
    if (y - wrapped.length * leading < margin) { page = document.addPage([width, height]); y = height - margin; }
    for (const line of wrapped) { page.drawText(line, { x: margin + indent, y, size, font, color: rgb(0.08, 0.08, 0.08) }); y -= leading; }
    y -= after;
  }
  function heading(text: string) {
    if (y < margin + 75) { page = document.addPage([width, height]); y = height - margin; }
    y -= 7;
    write(text.toUpperCase(), 10.5, bold, 6);
  }

  write(profile.name.toUpperCase(), 21, bold, 4);
  write(resume.headline, 10.5, regular, 7);
  write(`${profile.location} | ${profile.phoneInternational} | ${profile.email}`, 9.5, regular, 2);
  write(`${profile.siteUrl} | ${profile.github}`, 9.5, regular, 6);
  heading('Profile');
  write(resume.summary);
  heading('Technical skills');
  resume.skills.forEach(skill => write(skill, 10, regular, 3));
  heading('Selected projects');
  resume.projects.forEach(project => {
    write(`${project.name} | ${project.detail}`, 10, bold, 3);
    project.bullets.forEach(bullet => write(`- ${bullet}`, 10, regular, 3, 8));
    y -= 3;
  });
  heading('Collaboration');
  write(resume.collaboration.title, 10, bold, 3);
  resume.collaboration.bullets.forEach(bullet => write(`- ${bullet}`, 10, regular, 3, 8));
  heading('Education');
  write(resume.education);
  heading('Professional learning');
  resume.credentials.forEach(credential => write(credential, 9.5, regular, 3));
  write('Coursera learning programs; not AWS certification exam credentials. Evidence: syahmiaof.my/credentials', 9, regular, 0);
  return document.save();
}
