// Cloudflare Pages Functions types

export interface Env {
  DB: D1Database;
  D1_API_KEY: string;
}

// Re-export Cloudflare types
export type PagesFunction<Env = unknown> = (context: EventContext<Env, any, Record<string, unknown>>) => Response | Promise<Response>;

export interface EventContext<Env = unknown, P = unknown, Data = Record<string, unknown>> {
  request: Request;
  env: Env;
  params: P;
  data: Data;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}

export interface D1Result<T = Record<string, unknown>> {
  results?: T[];
  success: boolean;
  error?: string;
  meta: {
    duration: number;
    rows_read: number;
    rows_written: number;
  };
}
