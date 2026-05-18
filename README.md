# Reno Blog

A static, bilingual personal site built with Astro.

## Status

This repository contains a runnable static site with:

- Chinese and English routes;
- long-form writing;
- short notes;
- project case studies;
- a Library surface for demo inventory content;
- an about page;
- a public experiments area with a bounded ProjectOrbit 3D island;
- static search and a public content index;
- RSS, sitemap, and basic SEO;
- Docker packaging;
- GitHub Actions CI/CD.

## Tech Direction

- Astro
- TypeScript
- MDX
- Tailwind CSS
- React islands for stateful interactive components
- Static output served from a Docker image

## Development

```bash
npm ci
npm run dev
npm run build
npm test
npm run lint
npm run smoke:chrome
npm run smoke:a11y
```

`npm run smoke:chrome` uses the local Chrome browser. CI uses Playwright Chromium after installing the browser runtime.

## Deployment

The site is built as static output and packaged as a Docker image. GitHub Actions verifies the project and publishes deployment artifacts from `main`.

Operational details, server configuration, secrets, private planning notes, and AI working files are intentionally not stored in this public repository.
