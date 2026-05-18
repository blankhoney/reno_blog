import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const bilingualBaseSchema = z.object({
  title: z.string(),
  summary: z.string().optional(),
  date: z.date(),
  updated: z.date().optional(),
  language: z.enum(["zh", "en"]),
  translationKey: z.string(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
  cover: z.string().optional(),
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: bilingualBaseSchema.extend({
    series: z.string().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes" }),
  schema: bilingualBaseSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: bilingualBaseSchema.extend({
    name: z.string(),
    role: z.string().optional(),
    techStack: z.array(z.string()).default([]),
    repoUrl: z.url().optional().or(z.literal("")),
    demoUrl: z.url().optional().or(z.literal("")),
  }),
});

export const collections = { notes, projects, writing };
