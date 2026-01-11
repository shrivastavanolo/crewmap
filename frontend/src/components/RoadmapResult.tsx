import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

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
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Learning Roadmap</h2>

        <button
          onClick={handleCopy}
          className="text-sm text-yellow-600 hover:text-yellow-300 cursor-pointer"
        >
          {copied ? "✓" : "Copy"}
        </button>
      </div>

      <article className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}>
          {roadmap}
        </ReactMarkdown>
      </article>
    </div>
  );
}
