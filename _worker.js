// Demo Sales — Cloudflare Worker
// Blocks crawlers on *.pages.dev preview URLs
// Custom domain (demosalesinc.com) passes through freely

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = url.hostname;

    // Block all traffic on *.pages.dev (preview/staging URLs)
    if (host.endsWith('.pages.dev')) {
      return new Response('Access restricted. This preview URL is not publicly indexed.', {
        status: 403,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Pass through to static assets on custom domain
    return env.ASSETS.fetch(request);
  }
};
