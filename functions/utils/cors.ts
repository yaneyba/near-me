/**
 * CORS (Cross-Origin Resource Sharing) Utilities
 *
 * Provides secure CORS configuration for API endpoints.
 * Restricts access to known domains instead of using wildcard '*'.
 */

import { Env } from '../types';

/**
 * List of allowed origins for CORS
 * In production, these should be configurable via environment variables
 */
const DEFAULT_ALLOWED_ORIGINS = [
  'https://near-me.us',
  'https://water-refill.near-me.us',
  'https://specialty-pet.near-me.us',
  'https://senior-care.near-me.us',
  'https://nail-salons.near-me.us',
  'https://auto-repair.near-me.us',
];

/**
 * Check if an origin is allowed
 *
 * @param origin - The origin to check
 * @param env - Environment variables (for custom allowed origins)
 * @returns True if the origin is allowed
 */
export function isOriginAllowed(origin: string | null, env?: Env): boolean {
  if (!origin) return false;

  // Get custom allowed origins from environment
  const allowedOrigins = env?.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : DEFAULT_ALLOWED_ORIGINS;

  // Check exact match
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  // Check wildcard pattern: https://*.near-me.us
  for (const allowed of allowedOrigins) {
    if (allowed.includes('*')) {
      const pattern = allowed
        .replace('.', '\\.')
        .replace('*', '[a-z0-9-]+');
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(origin)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Get CORS headers for a response
 *
 * @param request - The incoming request
 * @param env - Environment variables
 * @param additionalMethods - Additional HTTP methods to allow (default: GET, POST, PUT, DELETE, OPTIONS)
 * @returns Headers object with CORS configuration
 */
export function getCorsHeaders(
  request: Request,
  env?: Env,
  additionalMethods?: string[]
): Record<string, string> {
  const origin = request.headers.get('Origin');

  const methods = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'OPTIONS',
    ...(additionalMethods || [])
  ].join(', ');

  // If origin is allowed, use it; otherwise, use the first default origin
  const allowedOrigin = origin && isOriginAllowed(origin, env)
    ? origin
    : DEFAULT_ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

/**
 * Create a CORS preflight response
 *
 * @param request - The incoming request
 * @param env - Environment variables
 * @returns Response for OPTIONS preflight request
 */
export function createCorsPreflightResponse(request: Request, env?: Env): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request, env),
  });
}

/**
 * Add CORS headers to an existing response
 *
 * @param response - The response to add headers to
 * @param request - The incoming request
 * @param env - Environment variables
 * @returns Response with CORS headers added
 */
export function addCorsHeaders(response: Response, request: Request, env?: Env): Response {
  const newResponse = new Response(response.body, response);
  const corsHeaders = getCorsHeaders(request, env);

  for (const [key, value] of Object.entries(corsHeaders)) {
    newResponse.headers.set(key, value);
  }

  return newResponse;
}
