import { z } from "zod";

export const resumeInputSchema = z.object({
  text: z.string().trim().min(100).max(12000),
});

export const resumeProfileSchema = z.object({
  name: z.string().max(150),
  email: z.string().max(200),
  headline: z.string().max(250),
  summary: z.string().max(1500),
  skills: z.array(z.string().max(100)).max(60),
  education: z.array(z.string().max(500)).max(10),
  projects: z
    .array(
      z.object({
        name: z.string().max(200),
        description: z.string().max(800),
        technologies: z.array(z.string().max(100)).max(20),
      }),
    )
    .max(10),
});

export type ResumeProfile = z.infer<typeof resumeProfileSchema>;