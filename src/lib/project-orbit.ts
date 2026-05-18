import type { ContentIndexItem } from "./content-index";

export type ProjectOrbitNode = {
  key: string;
  position: [number, number, number];
  section: ContentIndexItem["section"];
  title: string;
  url: string;
};

export type ProjectOrbitEdge = {
  from: string;
  to: string;
  weight: number;
};

export type ProjectOrbitGraph = {
  edges: ProjectOrbitEdge[];
  nodes: ProjectOrbitNode[];
};

const sectionRadius: Record<ContentIndexItem["section"], number> = {
  library: 3.9,
  notes: 3.1,
  projects: 0,
  writing: 2.4,
};

export function buildProjectOrbitGraph(
  items: ContentIndexItem[],
  language: ContentIndexItem["language"],
): ProjectOrbitGraph {
  const nodes = items
    .filter((item) => item.language === language)
    .toSorted((a, b) => {
      if (a.section !== b.section) {
        return a.section.localeCompare(b.section);
      }

      return a.title.localeCompare(b.title);
    })
    .map((item, index, allItems) => {
      if (item.section === "projects") {
        return {
          key: item.key,
          position: [0, 0, 0] as [number, number, number],
          section: item.section,
          title: item.title,
          url: item.url,
        };
      }

      const orbitIndex = allItems.filter((candidate) => candidate.section === item.section).findIndex((candidate) => candidate.key === item.key);
      const orbitCount = allItems.filter((candidate) => candidate.section === item.section).length;
      const angle = (Math.PI * 2 * orbitIndex) / Math.max(1, orbitCount);
      const radius = sectionRadius[item.section];

      return {
        key: item.key,
        position: [
          Number((Math.cos(angle) * radius).toFixed(3)),
          Number((((index % 3) - 1) * 0.55).toFixed(3)),
          Number((Math.sin(angle) * radius).toFixed(3)),
        ] as [number, number, number],
        section: item.section,
        title: item.title,
        url: item.url,
      };
    });

  const nodeKeys = new Set(nodes.map((node) => node.key));
  const edges = items
    .filter((item) => item.language === language)
    .flatMap((item) =>
      item.relationKeys
        .filter((key) => nodeKeys.has(key))
        .map((key) => ({
          from: item.key,
          to: key,
          weight: 2,
        })),
    )
    .toSorted((a, b) => `${a.from}:${a.to}`.localeCompare(`${b.from}:${b.to}`));

  return { edges, nodes };
}

