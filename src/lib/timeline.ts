export type TimelineEntry = {
  slug: string;
  data: {
    date: Date;
    summary?: string;
    tags?: string[];
    title: string;
  };
};

export type TimelineGroup<TEntry extends TimelineEntry> = {
  items: TEntry[];
  year: string;
};

export function buildTimelineGroups<TEntry extends TimelineEntry>(
  entries: TEntry[],
): Array<TimelineGroup<TEntry>> {
  const groups = new Map<string, TEntry[]>();

  for (const entry of entries) {
    const year = String(entry.data.date.getFullYear());
    groups.set(year, [...(groups.get(year) ?? []), entry]);
  }

  return Array.from(groups.entries())
    .map(([year, items]) => ({
      items: items.toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime()),
      year,
    }))
    .toSorted((a, b) => b.year.localeCompare(a.year));
}

export function getTimelineTags(entries: TimelineEntry[]): string[] {
  return Array.from(new Set(entries.flatMap((entry) => entry.data.tags ?? []))).toSorted((a, b) =>
    a.localeCompare(b),
  );
}
