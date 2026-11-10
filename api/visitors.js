const APPDEPLOY_API = 'https://hello-worldhealth-initiatives-8uo66p.v2.appdeploy.ai/api/visitors';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const upstream = await fetch(APPDEPLOY_API, {
      method: req.method,
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });
    const body = await upstream.text();
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.status(upstream.status).send(body);
  } catch (error) {
    console.error('Worldhealth visitor counter proxy failed:', error);
    return res.status(503).json({ error: 'Visitor counter temporarily unavailable' });
  }
}