// Labels and one-line meanings for every enum in the card schema. Shown in the UI and in llms.txt.
export const SITE = "https://langwhy.dev";

export const TYPES: Record<string, string> = {
  systems: "Systems", web: "Web", backend: "Backend", scripting: "Scripting", data: "Data",
  mobile: "Mobile", functional: "Functional", query: "Query", shell: "Shell", config: "Config",
  embedded: "Embedded", games: "Games", academic: "Academic",
};

export const STATUS: Record<string, string> = {
  alive: "actively evolving", stable: "mature, slow change", declining: "losing users", dead: "no activity",
};

export const SLOTS: Record<string, string> = {
  browser: "Code that runs in the user's browser.",
  server: "The backend: requests, logic, APIs.",
  database: "Where the data lives and how you ask for it.",
  systems: "Operating systems, drivers, runtimes, anything close to the metal.",
  mobile: "Native apps on phones.",
  cli: "Command-line tools.",
  scripts: "Glue, automation, one-off jobs.",
  data: "Analysis, statistics, machine learning.",
  compute: "GPU and heavy numeric work, AI inference.",
  embedded: "Microcontrollers and devices with kilobytes of memory.",
  wasm: "WebAssembly, in and outside the browser.",
  config: "Infrastructure as code, build definitions, settings.",
  games: "Game engines and gameplay code.",
};

export const AXES: Record<string, Record<string, string>> = {
  memory: { manual: "manual memory", gc: "garbage collected", refcount: "reference counted", ownership: "ownership, checked at compile time", "n/a": "no memory model" },
  types: { static: "static types", dynamic: "dynamic types", gradual: "gradual types", "n/a": "no type system" },
  run: { native: "compiles to native code", vm: "runs on a virtual machine", interpreted: "interpreted", "to-js": "compiles to JavaScript", "n/a": "not a runtime" },
  concurrency: { threads: "threads", green: "green threads", actors: "actors", async: "async", none: "none", "n/a": "n/a" },
};

export const FIT_RANK: Record<string, number> = { strong: 3, ok: 2, weak: 1, none: 0 };
export const FIT_DOTS: Record<string, string> = { strong: "●●●", ok: "●●○", weak: "●○○", none: "○○○" };

// Roads for someone who does not know where to start. Only ids with a card get linked.
export const ROADS: { want: string; ids: string[] }[] = [
  { want: "Build websites", ids: ["javascript", "typescript", "php"] },
  { want: "Work with data or AI", ids: ["python", "sql"] },
  { want: "Write a backend", ids: ["go", "typescript", "java", "csharp", "python"] },
  { want: "Make phone apps", ids: ["swift", "kotlin", "dart"] },
  { want: "Go fast and close to the metal", ids: ["rust", "c", "cpp", "zig"] },
  { want: "Automate your computer", ids: ["bash", "python"] },
  { want: "Talk to a database", ids: ["sql"] },
  { want: "Script inside another program", ids: ["lua"] },
  { want: "Think differently", ids: ["haskell", "elixir"] },
];
