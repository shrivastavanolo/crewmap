import { useState, useRef, useEffect } from "react";
import JobForm from "../components/JobForm";
import RoadmapResult from "../components/RoadmapResult";
import { generateRoadmap } from "../api/roadmap";
import TextType from "../components/TextType";
import RoadmapHistory from "../components/RoadmapHistory";
import {
  getRoadmaps,
  saveRoadmap,
  type SavedRoadmap,
  clearRoadmaps
} from "../utils/roadmapStorage";

export default function Home() {
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const roadmapRef = useRef<HTMLDivElement | null>(null);
  const [history, setHistory] = useState<SavedRoadmap[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setHistory(getRoadmaps());
  }, []);

  useEffect(() => {
    if (roadmap && roadmapRef.current) {
      roadmapRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [roadmap]);

  const handleGenerate = async (jobUrl: string) => {
    setLoading(true);
    setError("");
    setRoadmap("");

    try {
      const data = await generateRoadmap(jobUrl);
      setRoadmap(data.roadmap);
      saveRoadmap(jobUrl, data.roadmap);
      setHistory(getRoadmaps());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item: SavedRoadmap) => {
    setRoadmap(item.roadmap);
  };

  const handleClearHistory = () => {
    clearRoadmaps();
    setHistory([]);
  };

  return (
    <div className="text-white">
      <div className="mx-auto max-w-4xl px-6 py-20 flex flex-col space-y-8">

        <header className="flex flex-col items-center text-center space-y-6 mb-16">
          <img
            src="/crewmap_logo.png"
            alt="crewmap logo"
            className="h-16 w-16 rounded-xl"
          />

          <h1 className="text-5xl font-bold tracking-tight">
            crew<span className="text-red-400">map</span>
          </h1>

          <TextType
            text={["Generate a personalized learning roadmap from any job description."]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
            className="max-w-xl text-zinc-400 text-lg"
          />
        </header>
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="
          fixed top-4 left-4 z-30
          rounded-lg border border-zinc-800
          bg-zinc-900/70 p-2 ease-in-out transform
          hover:scale-110 transition duration-500
          text-sm font-semibold text-zinc-400 mb-4
        "
        >
          ☰ Previous Roadmaps
        </button>

        <RoadmapHistory
          items={history}
          onSelect={handleSelectHistory}
          onClear={handleClearHistory}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <JobForm onSubmit={handleGenerate} loading={loading} />

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}
        {roadmap && (
          <div ref={roadmapRef} className="mt-10">
            <RoadmapResult roadmap={roadmap}/>
          </div>
        )}
      </div>
    </div>
  );
}
