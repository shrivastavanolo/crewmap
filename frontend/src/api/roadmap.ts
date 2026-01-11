const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function generateRoadmap(jobUrl: string) {
  const res = await fetch(`${API_BASE_URL}/generate-roadmap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_url: jobUrl })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to generate roadmap");
  }

  return res.json();
}
