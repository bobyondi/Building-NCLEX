import { Question } from "@/types";

export const questionBank: Question[] = [
  // ── Pharmacology ──────────────────────────────────────────
  {
    id: "pharm-001",
    stem: "A patient is prescribed warfarin (Coumadin). Which lab value should the nurse monitor most closely?",
    choices: [
      { label: "A", text: "Complete blood count (CBC)" },
      { label: "B", text: "International Normalized Ratio (INR)" },
      { label: "C", text: "Blood urea nitrogen (BUN)" },
      { label: "D", text: "Serum potassium level" },
    ],
    correctAnswer: "B",
    rationale:
      "Warfarin is an anticoagulant, and the INR is the standard lab test used to monitor its therapeutic effect. The target INR for most indications is 2.0–3.0.",
    whyWrong: {
      A: "CBC monitors blood cell counts but does not measure coagulation status directly.",
      C: "BUN assesses kidney function, not anticoagulation therapy.",
      D: "Potassium levels are relevant to cardiac function but unrelated to warfarin therapy.",
    },
    keyTakeaway: "INR monitors warfarin effectiveness. Target: 2.0–3.0 for most patients.",
    category: "pharmacology",
    difficulty: "easy",
  },
  {
    id: "pharm-002",
    stem: "A nurse is preparing to administer digoxin to a patient. The patient's apical pulse is 56 bpm. What should the nurse do?",
    choices: [
      { label: "A", text: "Administer the medication as prescribed" },
      { label: "B", text: "Hold the medication and notify the provider" },
      { label: "C", text: "Administer half the prescribed dose" },
      { label: "D", text: "Recheck the pulse in 15 minutes, then administer" },
    ],
    correctAnswer: "B",
    rationale:
      "Digoxin should be held if the apical pulse is below 60 bpm in adults because it slows the heart rate. Administering it could cause dangerous bradycardia.",
    whyWrong: {
      A: "Giving digoxin with a pulse below 60 could lead to severe bradycardia or heart block.",
      C: "Nurses cannot independently adjust prescribed doses without a provider order.",
      D: "Waiting 15 minutes does not address the underlying concern of bradycardia risk.",
    },
    keyTakeaway: "Hold digoxin if apical pulse < 60 bpm. Always check pulse for a full minute before administration.",
    category: "pharmacology",
    difficulty: "easy",
  },
  {
    id: "pharm-003",
    stem: "A patient receiving IV vancomycin develops a flushed face, neck redness, and hypotension. What is the nurse's priority action?",
    choices: [
      { label: "A", text: "Administer epinephrine immediately" },
      { label: "B", text: "Stop the infusion and slow the rate per protocol" },
      { label: "C", text: "Apply cold compresses to the face and neck" },
      { label: "D", text: "Elevate the head of the bed and continue the infusion" },
    ],
    correctAnswer: "B",
    rationale:
      "These symptoms indicate Red Man Syndrome, a histamine-mediated reaction caused by rapid vancomycin infusion. The priority is to stop the infusion and restart at a slower rate.",
    whyWrong: {
      A: "Epinephrine is for anaphylaxis. Red Man Syndrome is not a true allergic reaction — it's rate-related.",
      C: "Cold compresses may provide comfort but do not address the cause of the reaction.",
      D: "Continuing the infusion will worsen the reaction.",
    },
    keyTakeaway: "Red Man Syndrome = too-fast vancomycin. Stop, slow the rate, give antihistamine if ordered.",
    category: "pharmacology",
    difficulty: "medium",
  },
  {
    id: "pharm-004",
    stem: "A nurse is teaching a patient about a new prescription for metformin. Which statement by the patient indicates a need for further teaching?",
    choices: [
      { label: "A", text: "\"I should take this medication with meals.\"" },
      { label: "B", text: "\"I need to stop taking this before any CT scan with contrast dye.\"" },
      { label: "C", text: "\"I should drink alcohol moderately since this medication helps my liver.\"" },
      { label: "D", text: "\"I will report any unusual muscle pain to my doctor.\"" },
    ],
    correctAnswer: "C",
    rationale:
      "Alcohol should be avoided with metformin because both increase the risk of lactic acidosis. Metformin does not help the liver — this statement shows misunderstanding.",
    whyWrong: {
      A: "Taking metformin with meals reduces GI side effects. This is correct understanding.",
      B: "Metformin should be held before contrast dye procedures due to kidney/lactic acidosis risk. Correct understanding.",
      D: "Muscle pain can signal lactic acidosis, so reporting it is appropriate. Correct understanding.",
    },
    keyTakeaway: "Metformin + alcohol = lactic acidosis risk. Hold before contrast dye procedures.",
    category: "pharmacology",
    difficulty: "medium",
  },

  // ── Medical-Surgical ──────────────────────────────────────
  {
    id: "medsurg-001",
    stem: "A patient with heart failure is prescribed furosemide. Which assessment finding should the nurse report immediately?",
    choices: [
      { label: "A", text: "Urine output of 2,500 mL in 24 hours" },
      { label: "B", text: "Serum potassium of 2.8 mEq/L" },
      { label: "C", text: "Weight loss of 2 lbs overnight" },
      { label: "D", text: "Blood pressure of 118/76 mmHg" },
    ],
    correctAnswer: "B",
    rationale:
      "Furosemide is a loop diuretic that causes potassium loss. A serum K+ of 2.8 mEq/L is critically low (normal: 3.5–5.0) and can cause fatal cardiac dysrhythmias.",
    whyWrong: {
      A: "Increased urine output is the expected therapeutic effect of furosemide.",
      C: "Weight loss of 2 lbs is an expected and desired outcome in heart failure management.",
      D: "This blood pressure is within normal limits.",
    },
    keyTakeaway: "Loop diuretics waste potassium. Monitor K+ closely — hypokalemia can be fatal.",
    category: "medical_surgical",
    difficulty: "easy",
  },
  {
    id: "medsurg-002",
    stem: "A patient 1 day post-thyroidectomy reports tingling around the mouth and fingertips. What should the nurse assess first?",
    choices: [
      { label: "A", text: "Trousseau's and Chvostek's signs" },
      { label: "B", text: "Thyroid hormone levels" },
      { label: "C", text: "Airway patency and neck swelling" },
      { label: "D", text: "Blood glucose level" },
    ],
    correctAnswer: "A",
    rationale:
      "Tingling around the mouth and fingertips after thyroidectomy suggests hypocalcemia due to accidental parathyroid removal. Trousseau's and Chvostek's signs assess for this complication.",
    whyWrong: {
      B: "Thyroid hormone levels take time to change and would not cause acute tingling.",
      C: "Airway assessment is important post-thyroidectomy, but these symptoms point specifically to calcium imbalance.",
      D: "Blood glucose is unrelated to these post-thyroidectomy symptoms.",
    },
    keyTakeaway: "Post-thyroidectomy tingling = hypocalcemia until proven otherwise. Check Trousseau's/Chvostek's.",
    category: "medical_surgical",
    difficulty: "medium",
  },
  {
    id: "medsurg-003",
    stem: "A patient with a chest tube has continuous bubbling in the water-seal chamber. What does this indicate?",
    choices: [
      { label: "A", text: "The system is functioning normally" },
      { label: "B", text: "An air leak is present in the system" },
      { label: "C", text: "The lung has fully re-expanded" },
      { label: "D", text: "The suction is set too high" },
    ],
    correctAnswer: "B",
    rationale:
      "Continuous bubbling in the water-seal chamber indicates an air leak. Intermittent bubbling on exhalation/cough is normal, but continuous bubbling is not.",
    whyWrong: {
      A: "Continuous bubbling is abnormal. Only intermittent bubbling with coughing or exhalation is expected.",
      C: "Full re-expansion would result in no bubbling, not continuous bubbling.",
      D: "Suction levels affect the suction control chamber, not the water-seal chamber.",
    },
    keyTakeaway: "Continuous bubbling in water-seal = air leak. Check all connections and assess the patient.",
    category: "medical_surgical",
    difficulty: "medium",
  },
  {
    id: "medsurg-004",
    stem: "A patient with type 1 diabetes has a blood glucose of 48 mg/dL and is conscious but confused. What is the priority intervention?",
    choices: [
      { label: "A", text: "Administer IV dextrose 50%" },
      { label: "B", text: "Give 4 oz of orange juice" },
      { label: "C", text: "Administer glucagon IM" },
      { label: "D", text: "Provide a peanut butter sandwich" },
    ],
    correctAnswer: "B",
    rationale:
      "The patient is conscious, so oral fast-acting carbohydrates (15g rule) are the first-line treatment. Orange juice provides rapid glucose elevation.",
    whyWrong: {
      A: "IV dextrose is reserved for unconscious patients or those who cannot swallow safely.",
      C: "Glucagon IM is for patients who are unconscious or unable to take oral glucose.",
      D: "Peanut butter contains fat and protein that slow glucose absorption — not ideal for acute hypoglycemia.",
    },
    keyTakeaway: "Conscious + hypoglycemic = give oral fast-acting sugar first (15g rule). Recheck in 15 min.",
    category: "medical_surgical",
    difficulty: "easy",
  },

  // ── Maternal-Newborn ──────────────────────────────────────
  {
    id: "matneo-001",
    stem: "A laboring patient's fetal monitor shows late decelerations with each contraction. What is the nurse's priority action?",
    choices: [
      { label: "A", text: "Turn the patient to a left lateral position" },
      { label: "B", text: "Increase the rate of oxytocin infusion" },
      { label: "C", text: "Prepare for immediate cesarean delivery" },
      { label: "D", text: "Apply an internal fetal scalp electrode" },
    ],
    correctAnswer: "A",
    rationale:
      "Late decelerations indicate uteroplacental insufficiency. The priority nursing intervention is repositioning to the left side to improve placental perfusion, stopping oxytocin if running, and administering oxygen.",
    whyWrong: {
      B: "Increasing oxytocin would worsen the situation by causing stronger contractions and further reducing placental blood flow.",
      C: "A C-section may be needed, but the nurse's first action is to try intrauterine resuscitation measures.",
      D: "Internal monitoring provides more data but does not address the underlying perfusion problem.",
    },
    keyTakeaway: "Late decels = placental insufficiency. Reposition left, stop oxytocin, O2, notify provider.",
    category: "maternal_newborn",
    difficulty: "medium",
  },
  {
    id: "matneo-002",
    stem: "A nurse is assessing a newborn at 1 minute after birth. The baby has a heart rate of 90, slow/irregular respirations, some flexion of extremities, grimace response to stimulation, and a blue body with pink extremities. What is this newborn's APGAR score?",
    choices: [
      { label: "A", text: "4" },
      { label: "B", text: "5" },
      { label: "C", text: "6" },
      { label: "D", text: "7" },
    ],
    correctAnswer: "B",
    rationale:
      "Heart rate 90 (below 100) = 1. Slow respirations = 1. Some flexion = 1. Grimace = 1. Blue body/pink extremities = 1. Total APGAR = 5.",
    whyWrong: {
      A: "A score of 4 would require one fewer point; each category here earns at least 1 point.",
      C: "A score of 6 would require one additional point in a category, which doesn't match the findings.",
      D: "A score of 7 would require two additional points — these findings are each partial responses.",
    },
    keyTakeaway: "APGAR: Appearance, Pulse, Grimace, Activity, Respirations. Each scored 0–2. Assessed at 1 and 5 minutes.",
    category: "maternal_newborn",
    difficulty: "medium",
  },
  {
    id: "matneo-003",
    stem: "A postpartum patient reports a gush of dark red blood when she stands up 6 hours after vaginal delivery. Her fundus is firm and midline. What should the nurse suspect?",
    choices: [
      { label: "A", text: "Uterine atony" },
      { label: "B", text: "Cervical or vaginal laceration" },
      { label: "C", text: "Retained placental fragments" },
      { label: "D", text: "Normal lochia pooling" },
    ],
    correctAnswer: "D",
    rationale:
      "When lying down, lochia can pool in the vagina and uterus. A gush upon standing is normal if the fundus remains firm and midline. This is expected early postpartum.",
    whyWrong: {
      A: "Uterine atony presents with a boggy, displaced fundus — this patient's is firm and midline.",
      B: "Lacerations cause steady, bright red bleeding, not a single gush on position change.",
      C: "Retained fragments typically cause a boggy uterus and continuous bleeding, not position-related gushing.",
    },
    keyTakeaway: "Firm fundus + gush on standing = pooled lochia (normal). Boggy fundus + bleeding = atony (intervene).",
    category: "maternal_newborn",
    difficulty: "hard",
  },

  // ── Pediatrics ────────────────────────────────────────────
  {
    id: "peds-001",
    stem: "A 4-year-old with suspected epiglottitis arrives in the emergency department. Which action should the nurse avoid?",
    choices: [
      { label: "A", text: "Allowing the child to sit upright on the parent's lap" },
      { label: "B", text: "Inspecting the throat with a tongue depressor" },
      { label: "C", text: "Keeping emergency intubation equipment nearby" },
      { label: "D", text: "Monitoring oxygen saturation continuously" },
    ],
    correctAnswer: "B",
    rationale:
      "Examining the throat with a tongue depressor in suspected epiglottitis can cause laryngospasm and complete airway obstruction. The throat should only be visualized in a controlled setting by an anesthesiologist.",
    whyWrong: {
      A: "Letting the child sit upright on a parent's lap is appropriate — it keeps the airway open and reduces anxiety.",
      C: "Emergency intubation equipment should absolutely be nearby in case of sudden obstruction.",
      D: "Continuous pulse oximetry monitoring is essential for detecting respiratory deterioration.",
    },
    keyTakeaway: "Never examine the throat in suspected epiglottitis — risk of complete airway obstruction.",
    category: "pediatrics",
    difficulty: "medium",
  },
  {
    id: "peds-002",
    stem: "An infant is brought to the clinic with projectile vomiting after feedings, weight loss, and a palpable olive-shaped mass in the right upper quadrant. What condition should the nurse suspect?",
    choices: [
      { label: "A", text: "Intussusception" },
      { label: "B", text: "Pyloric stenosis" },
      { label: "C", text: "Gastroesophageal reflux" },
      { label: "D", text: "Hirschsprung disease" },
    ],
    correctAnswer: "B",
    rationale:
      "Pyloric stenosis presents with the classic triad: projectile vomiting, weight loss, and a palpable olive-shaped mass. It's caused by hypertrophy of the pyloric sphincter.",
    whyWrong: {
      A: "Intussusception presents with currant-jelly stools, colicky abdominal pain, and a sausage-shaped mass.",
      C: "GERD causes regurgitation but not projectile vomiting or a palpable mass.",
      D: "Hirschsprung disease presents with delayed meconium passage and abdominal distension, not projectile vomiting.",
    },
    keyTakeaway: "Pyloric stenosis triad: projectile vomiting + weight loss + olive-shaped mass. Treatment: pyloromyotomy.",
    category: "pediatrics",
    difficulty: "easy",
  },

  // ── Mental Health ─────────────────────────────────────────
  {
    id: "mental-001",
    stem: "A patient tells the nurse, \"I've been saving my medications because I plan to take them all this weekend.\" What is the nurse's priority response?",
    choices: [
      { label: "A", text: "\"Why do you feel that way?\"" },
      { label: "B", text: "\"Have you told your family about these feelings?\"" },
      { label: "C", text: "\"I need to keep you safe. I'm going to stay with you and notify your provider right now.\"" },
      { label: "D", text: "\"Let's talk about what's been bothering you lately.\"" },
    ],
    correctAnswer: "C",
    rationale:
      "This patient has expressed a specific plan with means and timeline — this is a high-lethality suicide risk. The priority is immediate safety: stay with the patient, remove access to means, and notify the provider.",
    whyWrong: {
      A: "Asking \"why\" is a non-therapeutic communication technique and delays urgent safety interventions.",
      B: "Deflecting to family does not address the immediate safety concern.",
      D: "Exploring feelings is appropriate later, but safety comes first when there is a specific plan and means.",
    },
    keyTakeaway: "Specific plan + means + timeline = high suicide risk. Priority: safety first, then therapeutic communication.",
    category: "mental_health",
    difficulty: "easy",
  },
  {
    id: "mental-002",
    stem: "A patient with bipolar disorder is in the manic phase. Which nursing intervention is most appropriate for mealtime?",
    choices: [
      { label: "A", text: "Seat the patient in the dining room with other patients" },
      { label: "B", text: "Provide finger foods the patient can eat while moving" },
      { label: "C", text: "Withhold meals until the patient can sit still" },
      { label: "D", text: "Offer a large meal three times per day" },
    ],
    correctAnswer: "B",
    rationale:
      "During mania, patients have difficulty sitting still and have increased caloric needs due to constant activity. Finger foods and high-calorie snacks allow nutrition intake while accommodating hyperactivity.",
    whyWrong: {
      A: "Group dining may be overstimulating for a manic patient, worsening behavior.",
      C: "Withholding food is never appropriate and does not address the patient's nutritional needs.",
      D: "Large, sit-down meals are impractical for a patient who cannot remain seated.",
    },
    keyTakeaway: "Manic patients: high-calorie finger foods, reduce stimulation, ensure adequate nutrition and hydration.",
    category: "mental_health",
    difficulty: "medium",
  },

  // ── Fundamentals ──────────────────────────────────────────
  {
    id: "fund-001",
    stem: "A nurse is preparing to insert a urinary catheter. In which order should these steps be performed? 1) Inflate the balloon, 2) Cleanse the meatus, 3) Apply sterile drapes, 4) Insert the catheter, 5) Open the sterile kit.",
    choices: [
      { label: "A", text: "5, 3, 2, 4, 1" },
      { label: "B", text: "5, 2, 3, 4, 1" },
      { label: "C", text: "3, 5, 2, 4, 1" },
      { label: "D", text: "5, 3, 4, 2, 1" },
    ],
    correctAnswer: "A",
    rationale:
      "Correct order: Open sterile kit (5), apply sterile drapes (3), cleanse the meatus (2), insert catheter (4), inflate balloon (1). This maintains sterile technique throughout.",
    whyWrong: {
      B: "Cleansing before draping breaks sterile technique.",
      C: "You cannot drape before opening the sterile kit.",
      D: "Inserting before cleansing increases infection risk.",
    },
    keyTakeaway: "Catheter insertion: open kit → drape → cleanse → insert → inflate. Maintain sterility throughout.",
    category: "fundamentals",
    difficulty: "easy",
  },
  {
    id: "fund-002",
    stem: "A nurse delegates tasks to unlicensed assistive personnel (UAP). Which task is appropriate to delegate?",
    choices: [
      { label: "A", text: "Assessing a patient's wound for signs of infection" },
      { label: "B", text: "Recording intake and output measurements" },
      { label: "C", text: "Developing a patient's plan of care" },
      { label: "D", text: "Teaching a patient about a new medication" },
    ],
    correctAnswer: "B",
    rationale:
      "Recording I&O is a data-collection task that does not require clinical judgment. Assessment, care planning, and patient education require nursing judgment and cannot be delegated to UAP.",
    whyWrong: {
      A: "Assessment is a nursing responsibility that requires clinical judgment — it cannot be delegated.",
      C: "Care planning is a core nursing function protected by the Nurse Practice Act.",
      D: "Patient education requires nursing knowledge and clinical judgment.",
    },
    keyTakeaway: "Delegate data collection tasks (vitals, I&O, ambulation) to UAP. Never delegate assessment, teaching, or care planning.",
    category: "fundamentals",
    difficulty: "easy",
  },

  // ── Safety & Infection Control ────────────────────────────
  {
    id: "safety-001",
    stem: "A patient is diagnosed with tuberculosis (TB). Which type of isolation precautions should the nurse implement?",
    choices: [
      { label: "A", text: "Contact precautions" },
      { label: "B", text: "Droplet precautions" },
      { label: "C", text: "Airborne precautions" },
      { label: "D", text: "Standard precautions only" },
    ],
    correctAnswer: "C",
    rationale:
      "TB is transmitted via airborne particles (droplet nuclei < 5 microns). Airborne precautions require a negative-pressure room and N95 respirator for healthcare workers.",
    whyWrong: {
      A: "Contact precautions are for infections spread by direct or indirect contact (e.g., MRSA, C. diff).",
      B: "Droplet precautions are for larger particles (> 5 microns) like influenza. TB particles are smaller.",
      D: "Standard precautions alone are insufficient for TB transmission prevention.",
    },
    keyTakeaway: "TB = airborne precautions. Remember: My Chicken Has TB (Measles, Chickenpox, Herpes zoster disseminated, TB).",
    category: "safety_infection_control",
    difficulty: "easy",
  },
  {
    id: "safety-002",
    stem: "A nurse finds a patient on the floor after a fall. The patient is alert and reports right hip pain. What should the nurse do first?",
    choices: [
      { label: "A", text: "Help the patient back to bed immediately" },
      { label: "B", text: "Assess the patient for injuries before moving" },
      { label: "C", text: "File an incident report" },
      { label: "D", text: "Call the patient's family" },
    ],
    correctAnswer: "B",
    rationale:
      "The nurse should assess for injuries before moving the patient. Moving a patient with a possible hip fracture could worsen the injury.",
    whyWrong: {
      A: "Moving before assessment could worsen a fracture or other injury.",
      C: "An incident report is important but not the priority — patient assessment comes first.",
      D: "Contacting the family is not the immediate priority; ensuring patient safety is.",
    },
    keyTakeaway: "After a fall: assess first, then move. Never move a patient with potential fractures before assessment.",
    category: "safety_infection_control",
    difficulty: "easy",
  },

  // ── Management & Leadership ───────────────────────────────
  {
    id: "mgmt-001",
    stem: "A charge nurse is making patient assignments. A new graduate nurse should be assigned to which patient?",
    choices: [
      { label: "A", text: "A patient in DKA on an insulin drip requiring hourly glucose checks" },
      { label: "B", text: "A patient 2 days post-appendectomy requesting discharge teaching" },
      { label: "C", text: "A patient with chest pain awaiting cardiac catheterization" },
      { label: "D", text: "A patient receiving a blood transfusion who had a prior reaction" },
    ],
    correctAnswer: "B",
    rationale:
      "A stable, post-operative patient preparing for discharge is the most appropriate assignment for a new graduate. This patient is predictable and lower acuity.",
    whyWrong: {
      A: "DKA with insulin drip requires experienced assessment and titration skills.",
      C: "Chest pain patients are unstable and may deteriorate rapidly — requires experienced nursing judgment.",
      D: "A patient with history of transfusion reactions is high-risk and requires vigilant monitoring by experienced staff.",
    },
    keyTakeaway: "Assign stable, predictable patients to new graduates. Complex, unstable patients need experienced nurses.",
    category: "management_leadership",
    difficulty: "medium",
  },
  {
    id: "mgmt-002",
    stem: "A nurse witnesses a coworker diverting controlled substances. What is the nurse's ethical and legal obligation?",
    choices: [
      { label: "A", text: "Confront the coworker privately and give them a chance to stop" },
      { label: "B", text: "Report the observation to the nursing supervisor or appropriate authority" },
      { label: "C", text: "Document the observation in the patient's chart" },
      { label: "D", text: "Discuss the situation with other staff members to confirm suspicions" },
    ],
    correctAnswer: "B",
    rationale:
      "Drug diversion is a serious legal and safety issue. The nurse is ethically and legally obligated to report observed diversion to the supervisor or appropriate authority immediately.",
    whyWrong: {
      A: "Confronting privately delays action and does not protect patients or fulfill legal obligations.",
      C: "Drug diversion is not documented in patient charts — it's reported through proper channels.",
      D: "Discussing with other staff is gossip and does not constitute proper reporting.",
    },
    keyTakeaway: "Witnessed drug diversion = report immediately to supervisor/authority. Patient safety is non-negotiable.",
    category: "management_leadership",
    difficulty: "easy",
  },
];
