interface WithDate {
  updated_at: string;
}

export const groupByDate = <T extends WithDate>(items: T[]) => {
  return items.reduce((acc, item) => {
    const date = new Date(item.updated_at);
    const title = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    const existingSection = acc.find(
      (section: { title: string }) => section.title === title
    );
    if (existingSection) {
      existingSection.data.push(item);
    } else {
      acc.push({ title, data: [item] });
    }
    return acc;
  }, [] as { title: string; data: T[] }[]);
};
