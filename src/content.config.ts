import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

// The JSON Schema in data/schema is the strict gate (pnpm validate); this mirrors it for types.
const uri = z.string().url();
const slug = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);

const cards = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./data/languages" }),
  schema: z.object({
    id: slug,
    name: z.string(),
    aliases: z.array(z.string()).optional(),
    appeared: z.number().int(),
    creators: z.array(z.string()).min(1),
    org: z.string().optional(),
    type: z.enum(["systems", "web", "backend", "scripting", "data", "mobile", "functional", "query", "shell", "config", "embedded", "games", "academic"]),
    status: z.enum(["alive", "stable", "declining", "dead"]),
    tagline: z.string(),
    born_from: z.string(),
    reacts_to: z.array(slug),
    tradeoffs: z.object({
      memory: z.enum(["manual", "gc", "refcount", "ownership", "n/a"]),
      types: z.enum(["static", "dynamic", "gradual", "n/a"]),
      run: z.enum(["native", "vm", "interpreted", "to-js", "n/a"]),
      concurrency: z.array(z.enum(["threads", "green", "actors", "async", "none", "n/a"])).min(1),
      cost: z.string(),
    }),
    slots: z.array(z.object({
      slot: z.enum(["browser", "server", "database", "systems", "mobile", "cli", "scripts", "data", "compute", "embedded", "wasm", "config", "games"]),
      fit: z.enum(["strong", "ok", "weak", "none"]),
      note: z.string().optional(),
      reason: z.enum(["runs-elsewhere", "too-slow", "hides-machine", "too-risky", "no-tools", "one-job", "overkill"]).optional(),
      source: uri.optional(),
    })).length(13),
    won_where: z.array(z.object({ what: z.string(), source: uri })).min(1),
    alternatives: z.array(slug),
    timeline: z.array(z.object({ year: z.number().int(), what: z.string(), source: uri })).min(3),
    hardware: z.object({
      gpu: z.enum(["native", "via-libraries", "none"]).optional(),
      twelve_dollar_users: z.number().int().optional(),
      multicore_users: z.number().int().optional(),
      source: uri.optional(),
      measured: z.string().optional(),
    }).optional(),
    links: z.object({ website: uri, repo: uri.optional(), wikipedia: uri.optional(), docs: uri.optional() }),
    pldb: z.string().optional(),
    sources: z.array(uri).min(2),
    verified: z.boolean(),
    last_reviewed: z.string(),
  }),
});

const prose = defineCollection({
  loader: glob({ pattern: "*.md", base: "./data/languages" }),
  schema: z.object({}),
});

export const collections = { cards, prose };
