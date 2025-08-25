import { AffirmationResponse } from "@/src/entities/affirmations/model/types";

export interface IAdviceSectionProps {
  /** Данные совета */
  data?: AffirmationResponse;
  /** Состояние загрузки */
  isLoading?: boolean;
}
