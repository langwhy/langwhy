import type { APIRoute } from "astro";
import { basicsMarkdown } from "../lib/data";

export const GET: APIRoute = () => new Response(basicsMarkdown(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
