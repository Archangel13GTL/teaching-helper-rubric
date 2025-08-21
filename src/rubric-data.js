export const rubricData = {
  esl: {
    title: "ESL Rubric",
    subtitle: "For assessing productive skills (speaking or writing)",
    criteria: [
      { name: "Grammar & Accuracy", weight: 25, levels: [
        "Many errors; meaning often unclear",
        "Frequent errors that sometimes block meaning",
        "Minor errors; mostly correct",
        "Rare errors; complex forms used correctly"
      ] },
      { name: "Vocabulary (Lexical Resource)", weight: 20, levels: [
        "Very limited; struggles to express ideas",
        "Limited range; repetition",
        "Adequate range; occasional misuse",
        "Wide, precise word choice"
      ] },
      { name: "Fluency & Pronunciation*", weight: 25, levels: [
        "Hard to follow; frequent breakdowns",
        "Hesitant; mispronunciations affect clarity",
        "Mostly smooth; occasional pauses/unclear words",
        "Smooth; easy to understand; natural rhythm"
      ] },
      { name: "Coherence / Task Achievement", weight: 20, levels: [
        "Off-task or minimal; disorganized",
        "Partially addresses prompt; loose organization",
        "Mostly addresses prompt; generally organized",
        "Fully addresses prompt; ideas well connected"
      ] },
      { name: "Participation / Effort", weight: 10, levels: [
        "Rarely prepared or engaged",
        "Inconsistent preparation or participation",
        "Usually prepared and engaged",
        "Consistently prepared and engaged"
      ] }
    ],
    pointRanges: [
      { "Grammar & Accuracy": [0, 11, 17, 22], "Vocabulary (Lexical Resource)": [0, 9, 14, 18], "Fluency & Pronunciation*": [0, 11, 17, 22], "Coherence / Task Achievement": [0, 9, 14, 18], "Participation / Effort": [0, 4, 7, 9] },
      { "Grammar & Accuracy": [10, 16, 21, 25], "Vocabulary (Lexical Resource)": [8, 13, 17, 20], "Fluency & Pronunciation*": [10, 16, 21, 25], "Coherence / Task Achievement": [8, 13, 17, 20], "Participation / Effort": [3, 6, 8, 10] }
    ],
    notes: `
      <p class="mb-2"><strong>Assign a level per criterion using descriptors; award points in the range shown.</strong></p>
      <p class="mb-2">*For writing, replace “Fluency & Pronunciation” with <strong>Cohesion & Organization</strong> (same 25 pts weight).</p>
      <p>Weights emphasize real-world communicative ability, aligned with CEFR/IELTS frameworks. Calibrate with 1–2 exemplars per level for reliability.</p>
    `
  },
  general: {
    title: "General Rubric",
    subtitle: "For any subject, performance, or product assessment",
    criteria: [
      { name: "Knowledge & Understanding", weight: 25, levels: [
        "Major misconceptions",
        "Partial/fragmented understanding",
        "Mostly accurate, minor gaps",
        "Explains concepts accurately and completely"
      ] },
      { name: "Application / Problem-Solving", weight: 25, levels: [
        "Cannot apply skills without help",
        "Inconsistent or error-prone application",
        "Generally accurate application",
        "Applies skills accurately and appropriately"
      ] },
      { name: "Reasoning / Critical Thinking", weight: 20, levels: [
        "Little/no analysis; unsupported claims",
        "Limited analysis; weak evidence",
        "Adequate analysis; some evidence",
        "Insightful analysis; strong evidence"
      ] },
      { name: "Communication (Organization/Clarity)", weight: 20, levels: [
        "Disorganized; hard to follow",
        "Somewhat unclear; organization weak",
        "Mostly clear; minor issues",
        "Well-organized; very clear"
      ] },
      { name: "Presentation & Style", weight: 10, levels: [
        "Minimal effort; hard to interpret",
        "Basic effort; inconsistent formatting",
        "Clear formatting; generally readable",
        "Polished presentation; highly engaging"
      ] }
    ],
    pointRanges: [
      { "Knowledge & Understanding": [0, 11, 17, 22], "Application / Problem-Solving": [0, 11, 17, 22], "Reasoning / Critical Thinking": [0, 9, 14, 18], "Communication (Organization/Clarity)": [0, 9, 14, 18], "Presentation & Style": [0, 4, 7, 9] },
      { "Knowledge & Understanding": [10, 16, 21, 25], "Application / Problem-Solving": [10, 16, 21, 25], "Reasoning / Critical Thinking": [8, 13, 17, 20], "Communication (Organization/Clarity)": [8, 13, 17, 20], "Presentation & Style": [3, 6, 8, 10] }
    ],
    notes: `
      <p class="mb-2"><strong>Use for presentations, projects, or written work.</strong></p>
      <p>Adapt criteria descriptions and weights to suit specific tasks or grade levels. Provide exemplars for transparency and consistency.</p>
    `
  }
};

export const translations = {
  en: {
    nav: { esl: "ESL Rubric", general: "General Rubric" },
    student: "Student View",
    teacher: "Teacher View",
    summary: "Grading Summary",
    total: "Total Score:",
    notes: "Scoring Notes & Rationale"
  },
  ceb: {
    nav: { esl: "ESL Rubriks", general: "General Rubriks" },
    student: "Tan​‑aw sa Estudyante",
    teacher: "Tan​‑aw sa Magtutudlo",
    summary: "Summaryo sa Paggrado",
    total: "Kinatibuk-ang Iskor:",
    notes: "Mga Notas ug Rasón sa Paggrado"
  }
};
