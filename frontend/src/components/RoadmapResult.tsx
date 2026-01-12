import { useState } from "react";
import { downloadMarkdown } from "@/utils/roadmapDownloader";
import { splitRoadmap } from "@/utils/splitRoadmap";
import RoadmapSection from "./RoadmapSection";

type Props = {
  roadmap: string;
};

export default function RoadmapResult({ roadmap }: Props) {
  const [copied, setCopied] = useState(false);
  const sections = splitRoadmap(roadmap);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roadmap);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 10000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="rounded-xl border backdrop-blur border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Learning Roadmap</h2>
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="text-sm text-yellow-600 hover:text-yellow-300 cursor-pointer"
          >
            {copied ? "✓" : "📋"}
          </button>

          <button
            onClick={() => downloadMarkdown(roadmap)}
            className="text-sm text-zinc-400 hover:text-zinc-200 hover:cursor-pointer"
          >
            📥
          </button>
        </div>

      </div>
      <div className="space-y-4">
        {sections.map((section, i) => (
          <RoadmapSection
            key={i}
            title={section.title}
            content={section.content}
            defaultOpen={i === 0}
          />
        ))}
      </div>

    </div>
  );
}
