# Little City

> A small citylife simulator.

This is a monorepo managed with [Bun workspaces](https://bun.sh/docs/install/workspaces).

| Package                                | Description                                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [`apps/web`](./apps/web)               | Frontend application built using [Vite](https://vite.dev/) and [Vue](https://vuejs.org/).         |
| [`packages/core`](./packages/core)     | Shared core logic (graphs, math, utilities, etc.) used across apps and packages.                  |
| [`packages/render`](./packages/render) | Rendering logic, visualizes the state described in `core` using [three.js.](https://threejs.org/) |

To install dependencies:

```bash
bun install
```

To run in dev mode:

```bash
bun dev
```

To create a production build:

```bash
bun run build
```
