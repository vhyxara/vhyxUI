/**
 * Environment helpers that are safe in every runtime.
 *
 * `process` does not exist in browsers, Deno, or bundlers that do not polyfill
 * it (plain Vite, esbuild, Bun.build). Reading `process.env.NODE_ENV` directly
 * in those environments throws a ReferenceError and takes the whole tree down,
 * so every read goes through these guards. The `process.env.NODE_ENV` member
 * expression is kept literal so bundlers can still statically replace it.
 */

/** True unless the bundler/runtime says we are in production. */
export function isDev(): boolean {
  try {
    return process.env.NODE_ENV !== 'production';
  } catch {
    return false;
  }
}

/** Reads a public env var without throwing where `process` is undefined. */
export function readPublicEnv(name: 'NEXT_PUBLIC_VHYX_DOMAIN' | 'VITE_VHYX_DOMAIN'): string | undefined {
  try {
    const value = name === 'NEXT_PUBLIC_VHYX_DOMAIN'
      ? process.env.NEXT_PUBLIC_VHYX_DOMAIN
      : process.env.VITE_VHYX_DOMAIN;
    return value && value.length > 0 ? value : undefined;
  } catch {
    return undefined;
  }
}
