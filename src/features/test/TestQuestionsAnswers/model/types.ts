export interface TestQuestion {
  question: string;
  category?: string;
}

export interface TestQuestionsAnswersProps {
  questions: TestQuestion[];
  answers: Record<string, string>;
}
