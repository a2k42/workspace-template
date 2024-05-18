# Notes

How I like to start a new project / Create a Vue UI Library and use it in Nuxt 3 application.

## Before Starting (optional)

1. Configure global git settings `.gitconfig`
1. Configure global npm settings `.npmrc`

```ini
# https://docs.npmjs.com/cli/v10/commands/npm-init#init-module
init-author-email=demo@example.com
init-author-name=Demo
init-author-url=https://github.com/demo
init-license=MIT
init-version=0.1.0
```

## Initial Setup

### Git

```bash
git init --bare workspace.git && cd workspace.git
```

```bash
git worktree add --orphan -b main ../workspace.main && cd ../workspace.main
```

Add a `.gitignore` file, `README.md`

```ini
# .gitignore
**/node_modules/
```

### Workspace

Create `pnpm-workspace.yaml`

```yaml
# pnpm-workspace.yaml
---
packages:
  - libraries/*
  - projects/**
  - services/*
```

The double `**` indicates nested subfolders. Its a choice whether to nest client, server, database, and other code within project directories or put common services into a separate top-level directory.

```bash
mkdir libraries projects services
```

## Vue Library

[Creating a Vue Application](https://vuejs.org/guide/quick-start.html#creating-a-vue-application)

```bash
pnpm create vue@latest vue-ui -- --packageManager pnpm
```

Say `Yes` to TypeScript and `No` to everything else.

```bash
✔ Add TypeScript? … No / `Yes`
✔ Add JSX Support? … `No` / Yes
✔ Add Vue Router for Single Page Application development? … `No` / Yes
✔ Add Pinia for state management? … `No` / Yes
✔ Add Vitest for Unit Testing? … `No` / Yes
✔ Add an End-to-End Testing Solution? › `No`
✔ Add ESLint for code quality? … `No` / Yes
✔ Add Vue DevTools 7 extension for debugging? (experimental) … `No` / Yes
```

> :warning: Clean up the starting project.

```bash
pnpm install
```

```bash
pnpm dev
```

If we build the project now

```bash
pnpm build
```

the output looks like

```bash
dist/
├── assets
│   ├── index-D5rJWLyR.css
│   └── index-RRKhdQ47.js
├── favicon.ico
└── index.html
```

- [ ] Add test component

### Configure Vite Build

We leave the default `main.ts` and `App.vue` in order to test are components. We still need some way to define what will be exported:

1. Add an `src/index.ts` file

```ts
import VButton from "@/components/VButton.vue";

export { VButton }
```

2. Configure `vite.config.ts`

```ts
export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts",
            fileName: "vue-ui",
            formats: ["es"],
            name: "VueUI",
        },
        rollupOptions: {
            external: ["vue"],
        }
    },
    // ...
});
```

Now run `pnpm build` again and look at the `dist` folder

```bash
dist
├── favicon.ico
├── style.css
└── vue-ui.js
```

### Add TypeScript Support

The default `create vue` project has 3 `tsconfig*.json` files. To keep the library configuration separate add a `tsconfig.lib.json` and include it in `tsconfig.json`

```json
// ...
    "references": [
        // ...
        {
            "path": "./tsconfig.lib.json"
        }
    ]
```

Then the `tsconfig.lib.json` will tell our build to output typescript declarations for out components, but not to transpile `.js` files.

```json
{
    "compilerOptions": {
        "declaration": true,
        "declarationDir": "dist/types",
        "emitDeclarationOnly": true
    },
    "include": ["src/components"]
}
```

Run `pnpm build` again

```bash
dist
├── favicon.ico
├── style.css
├── types
│   └── VButton.vue.d.ts
└── vue-ui.js
```

---

- [x] Configure vite build
- [ ] Add typescript options for typing
- [ ] Configure package to export library

## Nuxt App

Our nuxt app will use the library that we have just made.
