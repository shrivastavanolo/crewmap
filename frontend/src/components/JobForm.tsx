import { useState } from "react";

type Props = {
  onSubmit: (jobUrl: string) => void;
  loading: boolean;
};

export default function JobForm({ onSubmit, loading }: Props) {
  const [jobUrl, setJobUrl] = useState("");

  return (
    <div className="rounded-2xl bg-zinc-900/50 backdrop-blur border border-zinc-800 p-8 shadow-xl space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold">Paste LinkedIn Job URL</h2>
      </div>

      <input
        value={jobUrl}
        onChange={(e) => setJobUrl(e.target.value)}
        placeholder="https://www.linkedin.com/jobs/view/..."
        className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
      />

      <button
        onClick={() => onSubmit(jobUrl)}
        disabled={loading || !jobUrl}
        className="w-full rounded-lg bg-red-800 py-3 font-medium hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50 ease-out transform
          hover:scale-105 transition duration-500"
      >
        {loading ? "Generating roadmap..." : "Generate Roadmap"}
      </button>
    </div>
  );
}
