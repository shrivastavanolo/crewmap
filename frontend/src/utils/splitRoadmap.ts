export type RoadmapSection = {
    title: string;
    content: string;
};

export function splitRoadmap(markdown: string): RoadmapSection[] {
    const sections: RoadmapSection[] = [];

    const parts = markdown.split(/^#{2,3}\s+/gm).filter(Boolean);

    for (const part of parts) {
        const [firstLine, ...rest] = part.split("\n");
        sections.push({
            title: firstLine.trim(),
            content: rest.join("\n").trim(),
        });
    }

    return sections;
}
