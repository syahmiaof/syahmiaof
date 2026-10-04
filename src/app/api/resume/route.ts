import { createResumePdf } from '@/lib/resume-pdf';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const bytes = await createResumePdf();
  const download = new URL(request.url).searchParams.get('download') === '1';
  return new Response(new Uint8Array(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="Muhammad-Syahmi-CV.pdf"`,
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
