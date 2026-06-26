/**
 * Numerology Interpretation Corpus
 * ----------------------------------------------------------------------
 * Sourced from the public numerology corpus (the Silent Oracle
 * Numerology App content, and public Telegram/X posts) plus
 * the classical Chaldean & Pythagorean numerology body of work that
 * Silent Oracle builds on (Cheiro, Sepharial, Dr. Julia Seton).
 *
 * Every entry is intentionally substantive (3–5 sentences) to drive
 * real prediction analysis, not numerology postcards.
 */

export interface NumberMeaning {
  number: number;
  title: string;
  archetype: string;
  element: string; // astrological / elemental affinity
  planet: string; // ruling planet (Silent Oracle mapping)
  traits: string[];
  strengths: string[];
  challenges: string[];
  career: string[];
  relationships: string;
  health: string;
  luckyNumbers: number[];
  luckyColors: string[];
  luckyDays: string[];
  summary: string;
}

export const NUMEROLOGY_MEANINGS: Record<number, NumberMeaning> = {
  1: {
    number: 1,
    title: "The Leader",
    archetype: "The Pioneer / The Sun",
    element: "Fire",
    planet: "Sun",
    traits: ["independent", "ambitious", "original", "driven", "self-reliant"],
    strengths: [
      "Natural leadership and initiative",
      "Original thinking, refuses to copy others",
      "Strong willpower and determination",
      "Comfort taking calculated risks",
    ],
    challenges: [
      "Can become domineering or egocentric",
      "Impatience with slower minds",
      "Loneliness at the top if not careful",
    ],
    career: ["entrepreneur", "executive", "inventor", "military officer", "director"],
    relationships:
      "Needs a partner who respects autonomy. Compatible with 3, 5, 6; tense with another 1 or an 8.",
    health:
      "Governed by the Sun — watch the heart, spine, and circulation. Sun exposure and disciplined cardio routines keep vitality high.",
    luckyNumbers: [1, 10, 19, 28],
    luckyColors: ["gold", "yellow", "orange", "bronze"],
    luckyDays: ["Sunday", "Monday"],
    summary:
      "Number 1 is the initiating spark of the numerological spectrum. In the the numerology system it carries solar, Yang energy — the drive to begin, to lead, to be first. Its lesson is to lead with vision, not ego, and to remember that true pioneers build teams around them.",
  },
  2: {
    number: 2,
    title: "The Diplomat",
    archetype: "The Peacemaker / The Moon",
    element: "Water",
    planet: "Moon",
    traits: ["sensitive", "cooperative", "intuitive", "diplomatic", "harmonious"],
    strengths: [
      "Deep empathy and emotional intelligence",
      "Skilled at mediation and partnership",
      "Patient listener and supportive teammate",
      "Refined intuition, often psychic",
    ],
    challenges: [
      "Over-sensitivity and self-doubt",
      "Avoidance of confrontation to own detriment",
      "Tendency to absorb others' emotional states",
    ],
    career: ["counselor", "diplomat", "negotiator", "musician", "human-resources lead"],
    relationships:
      "Craves deep partnership and loyal bonds. Highly compatible with 1, 6, 9; friction with aggressive 5s or competitive 8s.",
    health:
      "Ruled by the Moon — fluid balance, stomach, and female reproductive system need care. Salt-water therapies and lunar-aligned rest cycles help.",
    luckyNumbers: [2, 11, 20, 29],
    luckyColors: ["silver", "white", "pale green", "cream"],
    luckyDays: ["Monday", "Friday"],
    summary:
      "Number 2 is the lunar, receptive pole of the spectrum. Silent Oracle sees 2 as the connector — the energy that binds opposites into wholeness. Its power is in cooperation, listening, and intuition; its lesson is to honour its own needs while serving others.",
  },
  3: {
    number: 3,
    title: "The Communicator",
    archetype: "The Artist / Jupiter",
    element: "Air + Fire",
    planet: "Jupiter",
    traits: ["creative", "expressive", "optimistic", "social", "youthful"],
    strengths: [
      "Gifted with words, voice, and image",
      "Natural magnetism and charm",
      "Imagination that sparks opportunity",
      "Ability to uplift any room",
    ],
    challenges: [
      "Scattered focus, project-hopping",
      "Avoidance of emotional depth",
      "Superficiality when stressed",
    ],
    career: ["writer", "performer", "marketer", "teacher", "designer", "media personality"],
    relationships:
      "Playful and affectionate but needs intellectual stimulation. Pairs well with 1, 6, 9; struggles with moody 4s or possessive 2s.",
    health:
      "Ruled by Jupiter — governs liver, hips, thighs, and nervous system. Needs creative outlet to avoid nervous burnout.",
    luckyNumbers: [3, 12, 21, 30],
    luckyColors: ["yellow", "royal purple", "rose", "turquoise"],
    luckyDays: ["Thursday", "Tuesday"],
    summary:
      "Number 3 is the voice of the numerological family. Silent Oracle frames 3 as Jupiter's child — expansive, expressive, lucky when disciplined. Its gift is communication; its lesson is to finish what it starts and not chase every shiny idea.",
  },
  4: {
    number: 4,
    title: "The Builder",
    archetype: "The Architect / Uranus (Rahu)",
    element: "Earth",
    planet: "Uranus (Rahu in Vedic)",
    traits: ["disciplined", "practical", "loyal", "methodical", "hardworking"],
    strengths: [
      "Foundation-builder, plans for the long game",
      "Trustworthy and dependable",
      "Mastery of structure, systems, and process",
      "Calm under pressure",
    ],
    challenges: [
      "Rigidity and resistance to change",
      "Workaholic tendencies",
      "Can feel trapped by own routines",
    ],
    career: ["engineer", "architect", "accountant", "lawyer", "military", "project manager"],
    relationships:
      "Loyal and steady, expects the same. Pairs best with 2, 4, 7, 8; struggles with restless 3s and 5s.",
    health:
      "Earth-element body — bones, teeth, knees, and lower back need support. Resist overwork; mineral-rich diet and weight-bearing exercise help.",
    luckyNumbers: [4, 13, 22, 31],
    luckyColors: ["deep blue", "grey", "earth tones", "khaki"],
    luckyDays: ["Saturday", "Sunday"],
    summary:
      "Number 4 is the foundation of the numerological structure. Silent Oracle treats 4 as the builder — patient, disciplined, indispensable. Its lesson is to build with flexibility, not rigidity, and to remember that foundations exist to support life, not to box it in.",
  },
  5: {
    number: 5,
    title: "The Freedom Seeker",
    archetype: "The Wanderer / Mercury",
    element: "Air",
    planet: "Mercury",
    traits: ["adventurous", "versatile", "curious", "magnetic", "changeable"],
    strengths: [
      "Adaptable to any environment",
      "Quick-witted, persuasive communicator",
      "Natural networker and opportunity magnet",
      "Courage to reinvent itself",
    ],
    challenges: [
      "Restlessness and inconsistency",
      "Over-indulgence in sensual pleasures",
      "Avoidance of commitment",
    ],
    career: ["sales", "journalism", "travel", "marketing", "consulting", "trading"],
    relationships:
      "Needs freedom within commitment. Best with 1, 5, 7; strained with possessive 2s or rigid 4s.",
    health:
      "Ruled by Mercury — nerves, respiratory system, and hands are sensitive. Needs variety in routine; breathing practices calm the racing mind.",
    luckyNumbers: [5, 14, 23, 32],
    luckyColors: ["light grey", "silver", "white", "turquoise"],
    luckyDays: ["Wednesday", "Friday"],
    summary:
      "Number 5 is the traveller of the numerological spectrum. Silent Oracle calls 5 the experimenter — Mercury's child, wired for change and discovery. Its lesson is to find freedom within structure, not through escape.",
  },
  6: {
    number: 6,
    title: "The Nurturer",
    archetype: "The Caregiver / Venus",
    element: "Earth + Water",
    planet: "Venus",
    traits: ["loving", "responsible", "harmonious", "artistic", "protective"],
    strengths: [
      "Deep capacity for love and service",
      "Aesthetic sense — beauty in form and relationship",
      "Strong sense of duty and family",
      "Healing presence",
    ],
    challenges: [
      "Over-responsibility and martyrdom",
      "Difficulty saying no",
      "Self-worth tied to being needed",
    ],
    career: ["healer", "designer", "teacher", "counselor", "chef", "parent-focused work"],
    relationships:
      "Romantic and family-oriented; devoted partner. Best with 2, 3, 6, 9; friction with aloof 7s or ungrounded 5s.",
    health:
      "Ruled by Venus — throat, neck, kidneys, and reproductive system. Singing, art, and touch therapies restore balance.",
    luckyNumbers: [6, 15, 24, 33],
    luckyColors: ["rose pink", "emerald green", "indigo", "copper"],
    luckyDays: ["Friday", "Tuesday"],
    summary:
      "Number 6 is the heart of the numerological family. Silent Oracle frames 6 as Venus's emissary — the bringer of beauty, harmony, and care. Its lesson is to love without losing self, and to serve from overflow, not depletion.",
  },
  7: {
    number: 7,
    title: "The Seeker",
    archetype: "The Mystic / Ketu / Neptune",
    element: "Water",
    planet: "Ketu (Neptune in Western)",
    traits: ["introspective", "analytical", "spiritual", "mysterious", "intellectual"],
    strengths: [
      "Deep thinker, natural researcher",
      "Strong intuition and psychic ability",
      "Comfortable with solitude and depth",
      "Seeks truth over popularity",
    ],
    challenges: [
      "Emotional aloofness and isolation",
      "Over-thinking and analysis paralysis",
      "Skepticism that blocks faith",
    ],
    career: ["researcher", "philosopher", "scientist", "spiritual teacher", "analyst", "psychologist"],
    relationships:
      "Needs privacy and intellectual depth. Best with 2, 5, 7; struggles with clingy 6s or surface-level 3s.",
    health:
      "Governed by Ketu/Neptune — nervous system, endocrine glands, and feet are sensitive. Needs meditation, nature, and digital detox.",
    luckyNumbers: [7, 16, 25, 34],
    luckyColors: ["deep sea green", "violet", "pearl white", "smoky grey"],
    luckyDays: ["Monday", "Sunday"],
    summary:
      "Number 7 is the mystic of the numerological spectrum. Silent Oracle treats 7 as the seeker — drawn to the hidden, the symbolic, the true. Its lesson is to bridge intellect and heart, to trust what cannot be measured.",
  },
  8: {
    number: 8,
    title: "The Powerhouse",
    archetype: "The Executive / Saturn",
    element: "Earth",
    planet: "Saturn",
    traits: ["ambitious", "strategic", "authoritative", "resilient", "karmic"],
    strengths: [
      "Mastery of material world, finance, and power",
      "Long-term vision and patience",
      "Resilience through adversity",
      "Natural executive presence",
    ],
    challenges: [
      "Workaholism and stress-related illness",
      "Cynicism or hardness of heart",
      "Risk of ethical compromise under pressure",
    ],
    career: ["CEO", "banker", "lawyer", "real estate", "politician", "judge"],
    relationships:
      "Needs a partner who understands ambition. Best with 2, 4, 8; friction with freedom-loving 5s or sensitive 3s.",
    health:
      "Ruled by Saturn — bones, joints, teeth, and chronic conditions. Needs disciplined routine; long walks, weight training, and mineral-rich foods sustain.",
    luckyNumbers: [8, 17, 26, 35],
    luckyColors: ["black", "dark blue", "deep purple", "charcoal"],
    luckyDays: ["Saturday", "Wednesday"],
    summary:
      "Number 8 is the karmic accountant of the spectrum. Silent Oracle sees 8 as Saturn's apprentice — power tempered by justice, wealth balanced by responsibility. Its lesson is that what is taken must be returned; ethical 8s flourish, corrupt 8s fall.",
  },
  9: {
    number: 9,
    title: "The Adapter",
    archetype: "The Adapter / Mars",
    element: "Fire + Water",
    planet: "Mars",
    traits: ["adaptable", "versatile", "courageous", "artistic", "transformative"],
    strengths: [
      "Adaptability — adjusts to any situation or environment",
      "Courage and warrior spirit (Mars-ruled)",
      "Artistic and dramatic talent",
      "Completion energy — finishes cycles through transformation",
    ],
    challenges: [
      "Scorched-earth tendencies when stressed",
      "Difficulty letting go of people / projects",
      "Emotional intensity and possessiveness",
    ],
    career: ["artist", "soldier", "surgeon", "athlete", "strategist", "adapter/transformer roles"],
    relationships:
      "Loves deeply, but can be possessive. Best with 3, 6, 9; friction with cool 7s or calculating 8s.",
    health:
      "Ruled by Mars — blood, muscles, head, and adrenal system. Needs intense physical outlets and disciplined anger expression.",
    luckyNumbers: [9, 18, 27, 36],
    luckyColors: ["deep red", "crimson", "maroon", "rose"],
    luckyDays: ["Tuesday", "Thursday"],
    summary:
      "Number 9 is linked with adaptability in Silent Oracle. Mars-ruled — the ability to adapt, transform, and complete cycles through versatility. The system does NOT classify 9 as an 'old soul'. 9 is the adapter: courageous, artistic, and transformative. Its lesson is courage without aggression, adaptability without scatter.",
  },

  // ─── Master Numbers (Silent Oracle places heavy emphasis) ────────────────────
  11: {
    number: 11,
    title: "The Illuminator",
    archetype: "The Spiritual Messenger",
    element: "Ether / Light",
    planet: "Moon (twice-illuminated)",
    traits: ["visionary", "inspired", "intuitive", "idealistic", "electric"],
    strengths: [
      "Channel for higher inspiration and revelation",
      "Heightened intuition bordering on psychic",
      "Ability to awaken others",
      "Spiritual leadership without seeking power",
    ],
    challenges: [
      "Extreme nervous sensitivity and anxiety",
      "Self-doubt and impractical idealism",
      "Risk of falling into 2 (reduced) if unbalanced",
    ],
    career: ["spiritual teacher", "inventor", "performer", "prophet-figure", "inspirational speaker"],
    relationships:
      "Needs a partner who honours their sensitivity. Best with 2, 6, 9, 22; struggles with aggressive 1s or rigid 8s.",
    health:
      "Highly charged nervous system — must protect sleep, limit stimulants, and ground in nature. Adrenals are the weak link.",
    luckyNumbers: [11, 2, 29, 38],
    luckyColors: ["silver", "pearl white", "lavender", "moonlight blue"],
    luckyDays: ["Monday", "Thursday"],
    summary:
      "Master 11 is the first of the three primary master numbers in Silent Oracle. It is the channel — the one who receives and transmits higher inspiration. The lesson: do not collapse into 2's fear; live at 11's frequency through service, art, and revelation.",
  },
  22: {
    number: 22,
    title: "The Master Builder",
    archetype: "The Architect of the Impossible",
    element: "Earth + Ether",
    planet: "Saturn (twice-resolved)",
    traits: ["visionary-builder", "practical-mystic", "powerful", "disciplined", "world-shaping"],
    strengths: [
      "Ability to materialise large-scale visionary projects",
      "Combines 4's discipline with 11's vision",
      "Natural leader of movements and institutions",
      "Capable of leaving a multi-generational legacy",
    ],
    challenges: [
      "Pressure to perform at world-scale can crush",
      "Risk of falling into 4 (reduced) if vision dims",
      "Self-imposed isolation at the top",
    ],
    career: ["founder of institutions", "statesperson", "master architect", "industry-disrupting entrepreneur"],
    relationships:
      "Needs an equal partner who can hold space for big vision. Best with 4, 6, 8, 11; strained with unstable 5s or possessive 2s.",
    health:
      "Earth-element stresses — spine, skeleton, adrenals. Needs disciplined routine and recovery rituals.",
    luckyNumbers: [22, 4, 31, 40],
    luckyColors: ["deep navy", "obsidian", "emerald", "midnight blue"],
    luckyDays: ["Saturday", "Sunday"],
    summary:
      "Master 22 is the master builder in Silent Oracle — the rare ability to translate high vision into physical reality at scale. The lesson: do not collapse into 4's smallness; build the cathedral, not just the wall.",
  },
  33: {
    number: 33,
    title: "The Master Teacher",
    archetype: "The Christed Healer",
    element: "Fire + Water + Ether",
    planet: "Venus (twice-elevated)",
    traits: ["unconditional-love", "healing-presence", "selfless-service", "spiritual-authority"],
    strengths: [
      "Embodiment of universal love and healing",
      "Ability to uplift masses through presence",
      "Channels higher compassion into tangible service",
      "Spiritual mother/father energy",
    ],
    challenges: [
      "Extreme emotional burden of holding others",
      "Risk of martyrdom if not self-honoring",
      "Pressure to live at 6 (reduced) when overwhelmed",
    ],
    career: ["spiritual teacher", "healer", "humanitarian leader", "master parent", "transformational coach"],
    relationships:
      "Devoted at soul level. Best with 6, 9, 11, 22; friction with cynical 8s or detached 7s.",
    health:
      "Heart chakra and emotional body need protection. Needs retreat, prayer, and creative play.",
    luckyNumbers: [33, 6, 24, 42],
    luckyColors: ["rose gold", "emerald", "pink", "sunlit gold"],
    luckyDays: ["Friday", "Sunday"],
    summary:
      "Master 33 is the master teacher in Silent Oracle — the rare embodiment of Christ-conscious / Buddha-conscious love in human form. The lesson: serve from overflow, never from depletion; teach by being, not by preaching.",
  },
  44: {
    number: 44,
    title: "The Master Healer of Systems",
    archetype: "The Karmic Resetter",
    element: "Earth + Ether",
    planet: "Saturn × Rahu",
    traits: ["karmic-rebuilder", "systemic-healer", "grounded-mystic", "powerful-worker"],
    strengths: [
      "Heals broken systems — businesses, families, institutions",
      "Combines 8's power with 44's karmic reset energy",
      "Strong grounding through disciplined practice",
    ],
    challenges: [
      "Heavy karmic load; recurring tests of integrity",
      "Risk of corruption or burnout",
      "Must avoid falling into 8 (reduced)",
    ],
    career: ["turnaround CEO", "karmic-justice worker", "system reformer", "master craftsman"],
    relationships:
      "Needs partner of equal integrity. Best with 4, 6, 8, 22; friction with unstable 5s or evasive 7s.",
    health:
      "Bones, joints, and liver carry karmic load. Needs disciplined detox, fasting, and earth-based practice.",
    luckyNumbers: [44, 8, 26, 35],
    luckyColors: ["obsidian", "deep olive", "iron grey", "dark amber"],
    luckyDays: ["Saturday", "Tuesday"],
    summary:
      "Master 44 in Silent Oracle is the master of karmic reset — the one who rebuilds what 8 has broken. Its lesson: do not fall into 8's smallness; heal systems, not just self.",
  },
  55: {
    number: 55,
    title: "The Master of Freedom",
    archetype: "The Quantum Teacher",
    element: "Air + Ether",
    planet: "Mercury × Uranus",
    traits: ["liberator", "paradigm-shifter", "quantum-thinker", "rule-breaker"],
    strengths: [
      "Liberates self and others from limiting paradigms",
      "Quantum thinking across disciplines",
      "Embodies higher freedom (not escapism)",
    ],
    challenges: [
      "Risk of falling into 5's restlessness",
      "Difficulty with grounded commitments",
      "Can alienate conventional thinkers",
    ],
    career: ["futurist", "disruptor", "freedom teacher", "quantum coach", "nomadic entrepreneur"],
    relationships:
      "Needs a partner who honours quantum leaps. Best with 5, 7, 11; friction with rigid 4s or possessive 6s.",
    health:
      "Nervous system highly charged. Needs breathwork, silence, and movement practices.",
    luckyNumbers: [55, 5, 23, 32],
    luckyColors: ["electric blue", "silver", "white", "neon teal"],
    luckyDays: ["Wednesday", "Sunday"],
    summary:
      "Master 55 in Silent Oracle is the master of freedom — freedom at the quantum level, not the escapism of 5. Its lesson: liberate the mind, then come back and serve.",
  },
};

// ─── Personal Year forecasts ───────────────────────────────────────────
export interface PersonalYearForecast {
  number: number;
  theme: string;
  guidance: string;
  focus: string[];
  caution: string;
}

export const PERSONAL_YEAR_FORECASTS: Record<number, PersonalYearForecast> = {
  1: {
    number: 1,
    theme: "New Beginnings & Initiation",
    guidance:
      "A 9-year cycle has just closed. This is your year to plant seeds that will define the next decade. Start the project. Make the move. Take the lead. Hesitation now costs nine years of momentum.",
    focus: ["launch new ventures", "rebrand or reinvent self", "take leadership", "physical fitness reset"],
    caution: "Impulsiveness in partnerships; do not burn bridges you will need in year 2.",
  },
  2: {
    number: 2,
    theme: "Patience, Partnership & Receptivity",
    guidance:
      "The seeds of year 1 need watering. This is a year of slow growth through partnership, patience, and intuition. Wait, listen, gather allies. Seldom a year for big outward launches.",
    focus: ["nurture relationships", "refine what was started", "spiritual development", "diplomacy"],
    caution: "Frustration with the slower pace; do not force outcomes prematurely.",
  },
  3: {
    number: 3,
    theme: "Expression, Expansion & Social Visibility",
    guidance:
      "A year to be seen and heard. Creative work flourishes, social networks expand, opportunities arrive through communication. Money often comes through expression rather than grind.",
    focus: ["publish / perform / launch creative work", "build social media presence", "travel", "learn new expressive skills"],
    caution: "Scattered focus and over-socialising can dissipate the year's gifts.",
  },
  4: {
    number: 4,
    theme: "Foundation, Work & Restructuring",
    guidance:
      "A year of building the load-bearing walls of your next decade. Hard work, system-building, and disciplined routine pay off massively. Boring on the surface, foundational underneath.",
    focus: ["establish systems", "real-estate / home base", "health discipline", "skill mastery"],
    caution: "Rigidity and workaholism; do not neglect relationships or your body.",
  },
  5: {
    number: 5,
    theme: "Change, Freedom & Unexpected Pivots",
    guidance:
      "The middle of the 9-year cycle — a year of shake-ups, travel, romance, and freedom. Expect the unexpected. Say yes to change, even when it feels disruptive.",
    focus: ["travel / relocate", "career pivot", "new relationships", "release what no longer fits"],
    caution: "Recklessness, over-indulgence, throwing away stable foundations impulsively.",
  },
  6: {
    number: 6,
    theme: "Love, Family & Responsibility",
    guidance:
      "A year of duty, love, and home. Family matters dominate — births, marriages, parent care, home improvements. Service to others returns unexpected blessings.",
    focus: ["deepen primary relationship", "home / family projects", "service work", "artistic pursuits"],
    caution: "Over-giving; do not become a martyr. Boundaries matter.",
  },
  7: {
    number: 7,
    theme: "Introspection, Study & Spiritual Retreat",
    guidance:
      "A year to go inward. The visible world slows; the inner world deepens. Study, research, and spiritual practice produce breakthroughs. Not a year for outward expansion.",
    focus: ["study / research", "spiritual practice", "retreat / solitude", "introspective healing"],
    caution: "Isolation, melancholy, neglect of practical matters.",
  },
  8: {
    number: 8,
    theme: "Power, Money & Material Mastery",
    guidance:
      "A year of harvest and recognition for work done in years 1–7. Money, promotion, and authority increase. Karmic justice — what you have built ethically returns; what you have built unethically also returns.",
    focus: ["business expansion", "investments", "career advancement", "claim authority"],
    caution: "Corruption, ethical compromise, workaholic burnout.",
  },
  9: {
    number: 9,
    theme: "Completion, Release & Endings",
    guidance:
      "The final year of a 9-year cycle. Mars-ruled completion energy. What is finished must be let go — relationships, jobs, identities — so that year 1 can begin cleanly. This is the warrior's rest, not the humanitarian's crusade.",
    focus: ["complete unfinished projects", "release what no longer serves", "end cycles consciously", "travel for closure"],
    caution: "Clinging to what is ending; do not start major new ventures this year.",
  },
  11: {
    number: 11,
    theme: "Illumination & Inspiration",
    guidance:
      "A master-number year. Inspiration flows; others are drawn to your light. Spiritual awakening, intuitive downloads, and opportunities to teach or channel. Operate at 11, not collapsed into 2.",
    focus: ["teach / inspire", "spiritual development", "creative revelation", "psychic opening"],
    caution: "Nervous-system overwhelm, anxiety, impractical idealism.",
  },
  22: {
    number: 22,
    theme: "Master Building",
    guidance:
      "A master-builder year. Large-scale projects materialise. Vision meets discipline. Operate at 22, not collapsed into 4. Build something that outlives you.",
    focus: ["found or scale an institution", "build long-term assets", "lead a movement", "materialise a vision"],
    caution: "Pressure, isolation at the top, collapsing into smallness.",
  },
  33: {
    number: 33,
    theme: "Master Teaching & Healing",
    guidance:
      "A master-teacher year. Embodiment of love in service. Others heal in your presence. Operate at 33, not collapsed into 6. Serve from overflow.",
    focus: ["healing work", "teach by being", "spiritual parenting", "humanitarian service"],
    caution: "Martyrdom, depletion, taking on others' karma.",
  },
};

// ─── Attitude number summaries ────────────────────────────────────────
export const ATTITUDE_MEANINGS: Record<number, string> = {
  1: "Outwardly confident, takes charge in any room. First to act, last to retreat. People read you as a leader even when you do not seek the role.",
  2: "Outwardly gentle and approachable. People confide in you easily. You are seen as the diplomat, the listener, the safe harbor.",
  3: "Outwardly expressive, magnetic, often the entertainer of any group. People remember your laugh and your voice before your name.",
  4: "Outwardly grounded, reliable, often mistaken for older than your years. People trust you with what matters — money, plans, secrets.",
  5: "Outwardly electric, curious, restless. People feel that life is more interesting when you are in the room — but also that you may vanish at any moment.",
  6: "Outwardly warm, caring, attractive. People feel safe in your presence. You are seen as the parent / healer / host of any group.",
  7: "Outwardly reserved, mysterious, intelligent. People sense depth and sometimes keep their distance out of reverence or intimidation.",
  8: "Outwardly powerful, commanding, sometimes intimidating. People defer to you without quite knowing why. Executive presence precedes you.",
  9: "Outwardly adaptable, courageous, and transformative. People feel you can handle anything. You carry Mars energy — the adapter who transforms and completes.",
  11: "Outwardly radiant, electric, often described as 'different'. People feel inspired in your presence, sometimes ungrounded by your intensity.",
  22: "Outwardly formidable, quietly visionary. People sense that you are building something bigger than they can see.",
  33: "Outwardly loving, healing, almost luminous. People open up to you completely and feel seen at a soul level.",
};

export function getMeaning(n: number): NumberMeaning | undefined {
  return NUMEROLOGY_MEANINGS[n];
}
