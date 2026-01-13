import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type Props = {
    title: string;
    content: string;
    defaultOpen?: boolean;
};

export default function RoadmapSection({
    title,
    content,
    defaultOpen = false,
}: Props) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-auto">
            <button
                onClick={() => setOpen(!open)}
                className="
          w-full flex justify-between items-center
          px-5 py-4 text-left
          hover:bg-zinc-800/50 transition
        "
            >
                <h3 className="text-lg font-semibold">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {title}
                    </ReactMarkdown></h3>
                <span
                    className={`transition-transform ${open ? "rotate-180" : ""
                        }`}
                >
                    ⌄
                </span>
            </button>

            <div
                className={`
          grid transition-all duration-300 ease-in-out
          ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
            >
                <div className="overflow-auto px-5 pb-5">
                    <article className="prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                            {content}
                        </ReactMarkdown>
                    </article>
                </div>
            </div>
        </div>
    );
}
