const STORAGE_KEY = "crewmap-roadmaps";
const TTL = 24 * 60 * 60 * 1000; // 24 hours

export type SavedRoadmap = {
    id: string;
    jobInput: string;
    roadmap: string;
    createdAt: number;
};

export function getRoadmaps(): SavedRoadmap[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: SavedRoadmap[] = JSON.parse(raw);
    const now = Date.now();

    // remove expired
    const valid = parsed.filter(
        (item) => now - item.createdAt < TTL
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
    return valid;
}

export function saveRoadmap(jobInput: string, roadmap: string) {
    const existing = getRoadmaps();

    const alreadyExists = existing.some(
        (item) => item.jobInput === jobInput
    );

    if (alreadyExists) return;

    const newItem: SavedRoadmap = {
        id: crypto.randomUUID(),
        jobInput,
        roadmap,
        createdAt: Date.now(),
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([newItem, ...existing])
    );
}

export function clearRoadmaps() {
    if (!confirm("Clear all roadmap history?")) return;
    localStorage.removeItem("crewmap-roadmaps");
}