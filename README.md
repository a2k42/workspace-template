# Workspace Template

A [pnpm workspaces](https://pnpm.io/workspaces) monorepo scaffold with a Vue Component Library and Nuxt 3 project.

Read the [Notes](NOTES.md) for a walkthrough of how it was setup.

## Copy the Template

One way, not necessarily the best way, to create a new repository from a template is:

```bash
git clone --depth 1 --bare git@github.com:a2k42/workspace-template.git my-workspace.git && cd my-workspace.git
```

Then

```bash
git remote remove origin
```

### Track Upstream but Push Elsewhere

:construction: This section needs work.

```bash
# Set a different (empty) url to push to. Fetch still uses the default url
git remote set-url --push origin ""

# A pushurl must be set first, by default there's just a url
git remote set-url --delete --push origin url
# or
git config --unset-all remote.origin.pushurl
```