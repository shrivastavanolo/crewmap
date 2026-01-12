import { useEffect, useState, useRef } from "react";

const steps = [
    "Foundations",
    "Core Skills",
    "Projects",
    "Interview Prep",
    "Career Signals",
];

const messages = [
    "Analyzing your goal…",
    "Mapping required skills…",
    "Designing learning phases…",
    "Optimizing for hiring signals…",
    "Finalizing roadmap…",
];

export default function RoadmapLoader() {
    const [active, setActive] = useState(0);
    const [message, setMessage] = useState(messages[0]);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    // Update message when progress changes
    useEffect(() => {
        setMessage(messages[Math.min(active, messages.length - 1)]);
    }, [active]);

    // Keyboard interaction
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
                setActive((a) => Math.min(a + 1, steps.length));
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // Scroll loader into view
    useEffect(() => {
        if (loaderRef.current) {
            loaderRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, []);

    return (
        <div ref={loaderRef} className="flex flex-col items-center justify-center py-24 space-y-8 select-none">
            {/* Status text */}
            <p className="text-zinc-400 text-sm animate-pulse">
                {message}
            </p>

            {/* Interactive steps */}
            <div className="space-y-3 w-3/4">
                {steps.map((step, i) => {
                    const done = i < active;

                    return (
                        <button
                            key={step}
                            onClick={() => setActive((a) => Math.max(a, i + 1))}
                            className={`
                w-full flex items-center gap-3 px-5 py-4 rounded-xl
                border transition-all duration-300
                focus:outline-none
                ${done
                                    ? "bg-yellow-600/10 border-yellow-600 text-yellow-500 scale-[1.02]"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:scale-[1.01]"
                                }
              `}
                        >
                            <span
                                className={`text-lg transition-transform ${done ? "scale-110" : ""
                                    }`}
                            >
                                {done ? "●" : "○"}
                            </span>

                            <span className="text-sm font-medium">
                                {step}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Progress bar */}
            <div className="w-3/4 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-yellow-600 transition-all duration-500"
                    style={{ width: `${(active / steps.length) * 100}%` }}
                />
            </div>

            {/* Hint */}
            <p className="text-xs text-zinc-500">
                Tip: Click steps or press <kbd>Enter</kbd>
            </p>
        </div>
    );
}
