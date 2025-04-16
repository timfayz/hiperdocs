# hiperdocs

Project's files structure:

```
src/
  frontend/
    assets/ - Static files like images or fonts
    layout/ - Layout/UI components and templates
    pages/ - Page-level layout and content
    styles/ - Static CSS stylesheets
    utils/ - Utility functions
      acss.js - Custom ACSS engine
      retrov.js - Custom VDOM engine
    index.html - Frontend entrypoint
  backend.ts - Backend entrypoint

node_modules/ - Project dependencies (excluded via .gitignore)
out/ - Compiled output (excluded via .gitignore)

* Dockerfile - Instructions to build Docker image
* .dockerignore - Files and directories to be excluded from Docker build
* .gitignore - Files and directories to be ignored by Git
* package.json - Project dependencies, use `bun install` to resolve before running
* tsconfig.json - TypeScript compiler configuration
* bun.lock - Lockfile for Bun package manager
* build.ts - Project build tasks
```

To run project, go to the repo's working directory and run:

```
bun run src/backend.ts
```
