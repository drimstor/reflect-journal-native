/**
 * Разделяет составной идентификатор на массив из двух элементов
 * @param compositeId Строка вида "uuid:number"
 * @returns Массив [uuid, number]
 */
export const getEntitiesIds = (compositeId: string): [string, number] => {
  const [uuid, numStr] = compositeId.split(":");
  return [uuid, parseInt(numStr)];
};
