// Приводит createdAt к строке-ISO для GiftedChat/MessageGiftedChat
export function normalizeGiftedChatDate(
  createdAt: string | number | Date
): string {
  if (createdAt instanceof Date) return createdAt.toISOString();
  if (typeof createdAt === "number") return new Date(createdAt).toISOString();
  return createdAt;
}
