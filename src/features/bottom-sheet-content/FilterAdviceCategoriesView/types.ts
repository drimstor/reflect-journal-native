export interface IFilterAdviceCategoriesViewProps {
  onSave?: (excludedCategories: string[]) => void;
  onReset?: () => void;
}

export interface IAdviceCategory {
  id: string;
  name: string;
}
