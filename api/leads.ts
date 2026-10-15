import type { IncomingMessage, ServerResponse } from 'node:http';

type VercelRequest = IncomingMessage & { method?: string; body?: unknown };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

const MAX_TEXT = 3000;
const clean = (value: unknown, max = 300) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
  // Quietly discard automated submissions caught by the hidden honeypot.
  if (clean(body.company_website, 300)) return res.status(200).json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const phone = clean(body.phone, 40);
  const instagram = clean(body.instagram, 120);
  const github = clean(body.github, 200);
  const websiteType = clean(body.websiteType, 100);
  const message = clean(body.message, MAX_TEXT);

  if (name.length < 1 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || websiteType.length < 1) {
    return res.status(400).json({ error: 'Please provide your name, a valid email, and the website type.' });
  }
  if (github && !/^https?:\/\//i.test(github)) {
    return res.status(400).json({ error: 'Please enter your GitHub profile as a full https:// URL.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'The inquiry form is not configured yet. Please try again later.' });
  }

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/agency_leads`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name, email, phone: phone || null, instagram: instagram || null,
        github: github || null, website_type: websiteType,
        message: message || null, source: 'ai-adda-agency-portfolio',
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('Supabase lead insert failed:', response.status, detail.slice(0, 400));
      return res.status(502).json({ error: 'We could not save your inquiry. Please try again in a moment.' });
    }
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Lead endpoint error:', error);
    return res.status(502).json({ error: 'We could not reach the database. Please try again.' });
  }
}
