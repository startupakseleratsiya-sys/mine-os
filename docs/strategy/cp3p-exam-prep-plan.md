# Finora — CP3P exam-prep: research and roadmap

_Compiled 24 September 2026. Sources are listed at the end; items marked UNCONFIRMED were not verified._

## 1. The exams (APMG CP3P)

| | Foundation | Preparation | Execution |
|---|---|---|---|
| Format | 50 simple multiple-choice, 4 options, 1 correct | 1 scenario booklet + 4 questions × 20 one-mark lines = 80 marks | same as Preparation |
| Question styles | "Which describes…", missing words, "Which is NOT…", two-statement (only 1 / only 2 / both / neither) | classic MC (1 of 3–4), multiple response (exactly 2 of 5, both needed), matching (column 2 reusable), sequencing, assertion–reason ("A BECAUSE B") | same |
| Time | 40 min (+10 non-native) | 150 min (+40 non-native) | 150 min (+40) |
| Pass mark | 25/50 (50%) | 40/80 (50%) | 40/80 (50%) |
| Book | closed | open — own annotated PPP Guide only, tabs allowed | open |
| Bloom levels | 1–2 (knowledge, comprehension) | 3–4 (application, analysis); max 10 of 80 marks at level 2 | same |
| Prerequisite | — | Foundation | Foundation |
| Syllabus areas | OV | EF, IP, AP, SC | SC, TA, CM, CC, OM |

Official scope (2016 Guide, v1):

- Foundation: Glossary and chapter 1.
- Preparation: chapters 2, 3 and 4, plus chapter 5 sections 1–5.8 and 9.9.
- Execution: chapters 5, 6, 7 and 8.

APMG's timing advice for Preparation and Execution is 5 minutes of reading, then 35 minutes per question. Look things up in the Guide only once or twice. "should" means good practice, "must" means mandatory, and "will" or "is" means fact.

### The 2026 Guide (v2) changes the timeline

- **English v1 exams must be taken by 30 November 2026. From 1 December 2026 only v2 English exams exist.** v2 exams are currently offered in English and Vietnamese only.
- v2 has 7 chapters. Old chapters 7 (Strategy, Delivery and Commissioning) and 8 (Operations and Hand Back) are merged into **Chapter 7: Managing the Contract After Financial Close**.
- v2 adds climate resilience, gender and inclusion, ESG, qualitative and early-stage value for money, and emerging-market practice. Learning outcomes are otherwise unchanged.
- The exam format (counts, time, pass mark) is unchanged.
- v2 is 1,032 pages: C1 201, C2 115, C3 75, C4 133, C5 205, C6 103, C7 149, Glossary 42, Acronyms 9.
- Licence: **CC BY 3.0 IGO**, © 2026 AfDB, ADB, EBRD, IDB, IsDB and the World Bank Group. Adaptation and commercial use are allowed with attribution.
- The PDFs are in `sources/ppp-guide-v2/`, which is gitignored until we decide what to publish.

## 2. Market

- About 30 APMG-accredited training organisations. Live cohorts cost $900–2,600 per level:
  - K-infra (authors of the Guide)
  - Training ByteSize (£1,895 virtual; Foundation £185 study-only / £545 with exam)
  - PPP Expertise Eurasia (Russian; $1,200 / $1,940 / $1,940)
  - IIGF Indonesia (≈ $1,150–1,280 with exam)
  - others
- Self-serve material:
  - Udemy: Foundation v1 mock tests only.
  - Leaked sample PDFs.
  - Official: one free sample paper per level, plus one after booking.
- **No one sells a self-serve product covering all three levels. Almost no Preparation/Execution practice exists outside $2k cohorts. No v2 practice material exists at all.**
- Demand signals:
  - Kazakhstan: MNE accreditation has been mandatory since 1 January 2026, and the application requires staff CP3P certificates. Only 3 firms were accredited by February 2026. The minimum number and level of certified staff is UNCONFIRMED.
  - Uzbekistan: PPP Development Agency cohorts in 2019–20.
  - Philippines, Nigeria and Pakistan PPP units.
  - MDB capacity-building programmes.
- Scale: 4,000+ candidates by 2019. The market is niche (thousands of candidates a year), high-value and B2B-heavy.

### Learner pain points (top)

1. Very few realistic practice papers.
2. The v1 → v2 switch.
3. The scenario format.
4. Unfamiliar question types (multiple response scores zero unless both answers are right; assertion–reason).
5. Time pressure and over-use of the open book.
6. The size and density of the Guide.
7. "Guide definition ≠ my practice".
8. Subtle wording (should / must / will).
9. Cost and fixed cohort dates.
10. Reading speed for non-native English readers.

## 3. Product principles

- **Exam-true:** every mock matches the official format, timing, pass mark and question styles exactly.
- **Guide-grounded:** every question and explanation cites the v2 Guide section. Questions are original, never copied from APMG.
- **Learn → practise → prove:** short lesson, then retrieval practice, then timed mock, then readiness score.
- **Evidence-based methods:** retrieval practice, spaced repetition, interleaving, immediate feedback with per-option rationale, and mastery thresholds.
- **English only.** Offer an optional "non-native extra time" mock mode (+10 / +40 minutes), matching the official allowance.

## 4. Roadmap

| Phase | Deliverable | Notes |
|---|---|---|
| 1 | **Foundation v2 exam engine**: original question bank (chapter 1 + Glossary, each item with rationale and v2 section ref), practice by topic, timed 50-question/40-minute mock, results saved, readiness per area | DB tables for attempts and answers; migration applied by the owner |
| 2 | Glossary and acronym flashcards with spaced repetition; weak-area adaptive practice | Foundation is chapter 1 + Glossary |
| 3 | **Preparation and Execution scenario engine**: scenario booklet + additional information, all 5 question types, 4 × 20 lines, 150-minute timer, scoring by syllabus area | The biggest market gap |
| 4 | Lessons moved to the v2 Guide (7 chapters) + a "what changed v1 → v2" module | v1 exams end 30 November 2026 |
| 5 | Readiness / pass-probability dashboard, study plan to the exam date | |
| 6 | AI tutor grounded strictly in the v2 Guide (retrieval + citations) | API keys supplied by the owner; paid calls are tested by the owner |
| 7 | B2B team licences (seats, manager reports, Kazakhstan accreditation pipeline), payments | Pricing benchmarks: B2C $49–79 Foundation, $129–179 per advanced level; B2B $150–250 per seat per year |

## Sources

- https://ppp-certification.com/faqs
- https://ppp-certification.com/book-your-exam
- https://ppp-certification.com/sites/default/files/CP3P%20Prepration%20&%20Execution%20Exam%20-%20Candidate%20Guidance%20v5.0.pdf
- https://ppp-certification.com/refresh-ppp-guide
- https://ppp-certification.com/pppguide-v2/download
- https://apmg-international.com/article/updated-cp3p-certification-whats-new-ppp-guide-2026
- https://ppp-certification.com/training-organisations
- https://www.k-infrastructure.com/en/cp3p-training/
- https://www.trainingbytesize.com/product/certified-ppp-professional-cp3p-level-1-foundation/
- https://pppexpertise.com/
- https://institute.iigf.co.id/en/cp3p
- https://egov.kz/cms/ru/services/903018pass_mne
- https://kapital.kz/economic/145210/tolko-tri-kompanii-poluchili-akkreditaciyu-dlya-raboty-s-proektami-gchp.html
- https://ppp-certification.com/media/blog-posts/2019/july/cp3p-celebrating-two-years-and-4000-certified-ppp-professionals
