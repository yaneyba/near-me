/**
 * Admin Authentication Middleware
 *
 * This module provides authentication and authorization utilities for admin endpoints.
 *
 * SECURITY NOTE: This is a basic implementation. For production use, consider:
 * - Using JWT tokens with expiration
 * - Implementing rate limiting
 * - Adding IP whitelisting
 * - Using a proper authentication service (Auth0, Cloudflare Access, etc.)
 */

import { Env } from '../types';

export interface AuthResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userId?: string;
  error?: string;
}

/**
 * Verify admin authentication from request
 *
 * This checks for an Authorization header with a bearer token.
 * The token should be configured in the environment variables.
 *
 * @param request - The incoming request
 * @param env - The environment variables
 * @returns Authentication result
 */
export async function verifyAdminAuth(request: Request, env: Env): Promise<AuthResult> {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        error: 'No authorization header provided'
      };
    }

    // Extract the token from "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return {
        isAuthenticated: false,
        isAdmin: false,
        error: 'Invalid authorization header format'
      };
    }

    const token = parts[1];

    // Verify the token against the admin token in environment variables
    // In production, this should use JWT validation or a proper auth service
    const adminToken = env.ADMIN_API_TOKEN;

    if (!adminToken) {
      console.error('ADMIN_API_TOKEN not configured in environment');
      return {
        isAuthenticated: false,
        isAdmin: false,
        error: 'Authentication not configured'
      };
    }

    if (token === adminToken) {
      return {
        isAuthenticated: true,
        isAdmin: true,
        userId: 'admin'
      };
    }

    return {
      isAuthenticated: false,
      isAdmin: false,
      error: 'Invalid authentication token'
    };

  } catch (error) {
    console.error('Error verifying admin auth:', error);
    return {
      isAuthenticated: false,
      isAdmin: false,
      error: 'Authentication error'
    };
  }
}

/**
 * Middleware to require admin authentication
 *
 * Use this to protect admin-only endpoints.
 *
 * @param request - The incoming request
 * @param env - The environment variables
 * @returns Response if unauthorized, null if authorized
 */
export async function requireAdminAuth(request: Request, env: Env): Promise<Response | null> {
  const authResult = await verifyAdminAuth(request, env);

  if (!authResult.isAuthenticated || !authResult.isAdmin) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Unauthorized: Admin access required',
      error: authResult.error
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'WWW-Authenticate': 'Bearer realm="Admin API"'
      }
    });
  }

  return null; // Authorized, proceed
}

/**
 * Check if a request has valid admin credentials without returning a response
 *
 * @param request - The incoming request
 * @param env - The environment variables
 * @returns True if authenticated as admin, false otherwise
 */
export async function isAdminAuthenticated(request: Request, env: Env): Promise<boolean> {
  const authResult = await verifyAdminAuth(request, env);
  return authResult.isAuthenticated && authResult.isAdmin;
}
