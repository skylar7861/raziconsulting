export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Redirect www -> apex (canonical host)
    if (url.hostname === 'www.raziconsulting.com') {
      url.hostname = 'raziconsulting.com';
      return Response.redirect(url.toString(), 301);
    }

    // Serve static assets from ./public
    const response = await env.ASSETS.fetch(request);

    // Add baseline security headers
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
