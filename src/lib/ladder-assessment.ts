// Pure scoring for the "Find your place on the ladder" self-assessment.
// Returns the index (0-4) of the ladder step a visitor should aim for next.

export type Answers = {
  years: 0 | 1 | 2 | 3; // <2, 2-5, 5-10, 10+
  evidence: 0 | 1 | 2; // none, some public record, documented outcomes
  training: 0 | 1 | 2; // none, short courses, formal programme
  leadership: 0 | 1 | 2; // own work, lead a team/programme, shape the field
};

export const questions = [
  { key: "years", q: "How long have you worked in ecosystem building?", options: ["Under 2 years", "2 to 5 years", "5 to 10 years", "Over 10 years"] },
  { key: "evidence", q: "Can others see the results of your work?", options: ["Not yet", "Some public record", "Documented outcomes and references"] },
  { key: "training", q: "What training in the practice have you completed?", options: ["None yet", "Short courses or workshops", "A formal programme"] },
  { key: "leadership", q: "Where does your work have influence?", options: ["My own programmes", "I lead a team or institution", "I shape the wider field"] },
] as const;

export function recommendStep(a: Answers): number {
  const score = a.years + a.evidence * 1.5 + a.training * 1.5 + a.leadership;
  if (a.evidence === 0) return 0; // Recognition needs evidence first.
  if (score >= 9 && a.leadership === 2) return 4;
  if (score >= 6.5 && a.training === 2) return 3;
  if (score >= 4 && a.training >= 1) return 2;
  return 1;
}
