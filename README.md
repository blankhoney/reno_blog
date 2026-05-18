# Reno Blog

A static, bilingual personal site built with Astro.

## Status

This repository is being prepared. The first public milestone is a static site with:

- Chinese and English routes;
- long-form writing;
- short notes;
- project case studies;
- an about page;
- a public experiments area;
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

Development commands will be added once the application scaffold is committed.

```bash
npm run dev
npm run build
npm test
npm run lint
```

## Deployment

The site is built as static output and packaged as a Docker image. GitHub Actions verifies the project and publishes deployment artifacts from `main`.

Operational details, server configuration, secrets, private planning notes, and AI working files are intentionally not stored in this public repository.
