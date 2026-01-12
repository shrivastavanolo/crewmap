import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { downloadMarkdown } from "@/utils/roadmapDownloader";

type Props = {
  roadmap: string;
};

export default function RoadmapResult({ roadmap }: Props) {
  const [copied, setCopied] = useState(false);

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
      <article className="prose prose-invert max-w-none break-words overflow-auto">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}>
          {roadmap}
        </ReactMarkdown>
      </article>
    </div>
  );
}
