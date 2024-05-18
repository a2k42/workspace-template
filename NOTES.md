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

Add a `.gitignore` file, `README.md` and consider making your project open source with an MIT `LICENSE`.

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

We'll keep this simple, but want to add some styling. When built as a library, a separate `style.css` stylesheet is created and we'll need to make sure our configurate exports that correctly.

```html
// components/VButton.vue
<template>
    <button>
        <slot />
    </button>
</template>

<style scoped>
button {
    background: linear-gradient(70deg, #999, #CCC);
    cursor: pointer;
    padding: 1em;
}
</style>
```

### Configure Vite Build

We leave the default `main.ts` and `App.vue` in order to test our components. We still need some way to define what will be exported:

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

The default `create vue` project has 3 `tsconfig*.json` files. To keep the library configuration separate, add a `tsconfig.lib.json` and include it in `tsconfig.json`

```json
// ...
    "references": [
        // ...
        {
            "path": "./tsconfig.lib.json"
        }
    ]
```

Then the `tsconfig.lib.json` will tell our build to output typescript declarations for the components, but not to transpile `.js` files.

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

### Configure NPM Package

We'll now add some items to the `package.json`.

The entry point for a program used to be declared with something like `"main": "src/index.js"`. The ES6 modules equivalent is `"module"`. When using TypeScript, you'd also have to remember to point at the transpiled `.js` file, in our case its clear were trying to export a library and want to use the `dist` folder.

```json
{
    "module": "dist/vue-ui.js",
    "exports": {
        ".": {
            "import": "./dist/vue-ui.js"
        },
        "./style.css": "./dist/style.css"
    },
    "files": [
        "dist"
    ],
    "types": "dist/types",
    "peerDependencies": {
        "vue": "^3.4.0"
    },
}
```

We've externalised `vue` in our vite build, and here we declare it as a peer dependency???

- [ ] TODO - verify if this is correct.
- [ ] Add some script logic to out test component to ensure this also works

## Nuxt App

Our nuxt app will use the library that we have just made.

- [x] Create from Nuxt Template

> :warning: Creating from a template seems to cause  pnpm to be restricted to an old version. Remove the entry in the `package.json`.

```bash
pnpm dlx nuxi@latest init -t gh:a2k42/nuxt-pinia-template#one-page --packageManager pnpm --shell nuxt-app
```

Don't initialise a git repo unless you want to have submodules in your monorepo workspace.

Check that the project runs:

```bash
pnpm dev
```

### Add Library as Dependency

This is where using [pnpm workspaces](https://pnpm.io/workspaces) really makes our life easier

```bash
pnpm add --workspace vue-ui
```

Add the `vue-ui` styles to `nuxt.config.ts`

```ts
export default defineNuxtConfig({
    // ...
    css: ["~/assets/css/main.css", "vue-ui/style.css"],
)};
```

Open up `App.vue` and add the `<v-button>`:

```html
<script setup lang="ts">
import { VButton } from "vue-ui";
</script>

<template>
    <div>
        <h1>Nuxt Pinia Template</h1>
        <p>A simple starting template</p>
        <v-button>Library Import</v-button>
    </div>
</template>
```

We haven't done anything to configure Nuxt's auto-importing, but this should work for now.

As a final step, rename your nuxt app in `package.json` to something like `nuxt-app`.

Now, from the root level directory, we can take advantage of pnpm workspaces again:

```bash
pnpm --filter nuxt-app dev
```