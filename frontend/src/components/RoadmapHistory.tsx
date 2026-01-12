import { type SavedRoadmap } from "../utils/roadmapStorage";

type Props = {
    items: SavedRoadmap[];
    onSelect: (item: SavedRoadmap) => void;
    onClear: () => void;
    sidebarOpen: boolean;
    setSidebarOpen: (value: boolean) => void;
};

export default function RoadmapHistory({ items, onSelect, onClear, sidebarOpen, setSidebarOpen }: Props) {
    if (!items.length) return null;

    return (
        <>
            <div
                className={`
                fixed inset-0 z-40
                transition
                ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"}
            `}
            >
                {/* Backdrop */}
                <div
                    onClick={() => setSidebarOpen(false)}
                    className={`
                absolute inset-0 bg-black/50 transition-opacity
                ${sidebarOpen ? "opacity-100" : "opacity-0"}
                `}
                />

                {/* Sidebar panel */}
                <aside
                    className="
                    absolute left-0 top-0 h-screen w-72
                    bg-zinc-900 border-r border-zinc-800
                    p-4 overflow-y-auto
                    transform transition-transform duration-300
                    pointer-events-auto
                    "
                    style={{
                        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                    }}
                >
                    <div className="flex justify-between">
                        <button
                            onClick={() => {
                                setSidebarOpen(false);
                            }}
                            className="mb-4 text-zinc-400 hover:text-zinc-300 transition"
                        >
                            ✕ Close
                        </button>

                        <button
                            onClick={onClear}
                            className="mb-4 text-red-400 hover:text-red-300 transition"
                        >
                            Clear
                        </button>
                    </div>

                    <ul className="space-y-2 mt-4">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => {
                                    onSelect(item);
                                    setSidebarOpen(false);
                                }}
                                className="
                                cursor-pointer rounded-lg p-3
                                bg-zinc-800/50 hover:bg-zinc-800 transition
                            "
                            >
                                <p className="text-sm font-medium line-clamp-2">
                                    {item.jobInput}
                                </p>
                                <p className="text-xs text-zinc-400 mt-1">
                                    {new Date(item.createdAt).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div >
        </>
    );
}
