import { SortField } from "@/src/entities/chat/model/types";
import { WithDateAndId } from "../../ui/VirtualizedList/model/types";

export const groupByDate = <T extends WithDateAndId>(
  items: T[],
  locale: string,
  sortField: Exclude<SortField, "name" | "count"> = "updated_at"
) => {
  return items.reduce((acc, item) => {
    const date = new Date(item[sortField]);
    const title = date
      .toLocaleDateString(locale, {
        month: "long",
        year: "numeric",
      })
      .split("г.")[0];

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
