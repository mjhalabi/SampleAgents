import { z } from "zod";
import { AgentFunction } from "@github/copilot-agent";

const inputSchema = z.object({
  url: z.string().url(),
});

const figma2story: AgentFunction<typeof inputSchema> = async (input) => {
  const { url } = input;
  const figmaFileId = extractFileId(url);
  const personalAccessToken = process.env.FIGMA_TOKEN;

  const fileRes = await fetch(`https://api.figma.com/v1/files/${figmaFileId}`, {
    headers: {
      "X-Figma-Token": personalAccessToken,
    },
  });

  if (!fileRes.ok) {
    return `❌ Failed to fetch Figma file. Check URL and token.`;
  }

  const data = await fileRes.json();

  // Simple extraction (you can enhance this further)
  const frames = extractFrames(data);
  const userStories = frames.map((frame: any) => {
    return `**Story:** ${frame.name}  
**As a** user,  
**I want to** ${guessAction(frame.name)}  
**So that** I can ${guessGoal(frame.name)}\n`;
  });

  return userStories.join("\n---\n");
};

function extractFileId(url: string) {
  const match = url.match(/file\/([^/]+)/);
  return match?.[1] || "";
}

function extractFrames(figmaData: any) {
  return Object.values(figmaData.document.children[0].children || []).filter(
    (child: any) => child.type === "FRAME"
  );
}

function guessAction(name: string) {
  // Naive mapping
  if (name.toLowerCase().includes("login")) return "log in to the app";
  if (name.toLowerCase().includes("signup")) return "register a new account";
  return `interact with the ${name.toLowerCase()} screen`;
}

function guessGoal(name: string) {
  return `achieve my goal using ${name.toLowerCase()}`;
}

export const agent = {
  name: "figma2story",
  description: "Generate user stories from a Figma design URL",
  inputSchema,
  run: figma2story,
} satisfies AgentFunction<typeof inputSchema>;
