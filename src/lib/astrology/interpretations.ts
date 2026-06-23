/**
 * Chinese Astrology Interpretation Corpus
 * ----------------------------------------------------------------------
 * 12 zodiac animals × 5 elements = 60 combinations, plus general
 * animal archetypes, element archetypes, and Bazi day-master profiles.
 *
 * Sources: 《三命通会》, 《渊海子平》, Raymond Lo, Joey Yap, Theodora Lau.
 */

import type { AnimalName, Element, Polarity } from "./chinese";

export interface AnimalProfile {
  name: AnimalName;
  emoji: string;
  chinese: string;
  title: string;
  archetype: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  career: string[];
  bestMatches: AnimalName[];
  challengingMatches: AnimalName[];
  luckyColors: string[];
  luckyNumbers: number[];
  summary: string;
}

export const ANIMAL_PROFILES: Record<AnimalName, AnimalProfile> = {
  Rat: {
    name: "Rat",
    emoji: "🐀",
    chinese: "鼠 (Shǔ)",
    title: "The Strategist",
    archetype: "Quick-witted survivor, the first animal to cross the river",
    traits: ["clever", "resourceful", "observant", "charming", "ambitious"],
    strengths: [
      "Sharp intellect and quick problem-solving",
      "Excellent at spotting opportunity before others",
      "Charming and persuasive in social settings",
      "Adaptable to changing circumstances",
    ],
    weaknesses: [
      "Can be calculating or manipulative under stress",
      "Anxiety-prone, hoarding tendencies",
      "Restlessness, sometimes scattered",
    ],
    career: ["writer", "trader", "strategist", "researcher", "politician", "comedian"],
    bestMatches: ["Dragon", "Monkey", "Ox"],
    challengingMatches: ["Horse", "Goat", "Cat"],
    luckyColors: ["blue", "gold", "green"],
    luckyNumbers: [2, 3],
    summary:
      "The Rat is the first animal of the zodiac — clever, charming, and relentlessly resourceful. In Chinese folklore the Rat won the great race by riding the Ox and leaping off at the last moment, embodying both intellect and opportunism. Rats thrive in environments that reward wit and adaptability, but must guard against anxiety and short-term thinking.",
  },
  Ox: {
    name: "Ox",
    emoji: "🐂",
    chinese: "牛 (Niú)",
    title: "The Builder",
    archetype: "Patient plougher of long fields",
    traits: ["patient", "diligent", "loyal", "stubborn", "strong"],
    strengths: [
      "Unshakeable work ethic and endurance",
      "Deep integrity and dependability",
      "Methodical mastery of any craft",
      "Calm strength in crisis",
    ],
    weaknesses: [
      "Stubbornness and rigidity",
      "Slow to forgive, slow to change",
      "Emotional reserve mistaken for coldness",
    ],
    career: ["engineer", "farmer", "surgeon", "judge", "craftsman", "mechanic"],
    bestMatches: ["Snake", "Rooster", "Rat"],
    challengingMatches: ["Goat", "Horse", "Tiger"],
    luckyColors: ["yellow", "white", "brown"],
    luckyNumbers: [1, 9],
    summary:
      "The Ox is the second animal of the zodiac — steadfast, hardworking, and immovable in principle. The Ox carries the weight of long projects that others abandon. Its strength is patience; its lesson is to remain flexible enough to hear new ideas, and warm enough to be loved.",
  },
  Tiger: {
    name: "Tiger",
    emoji: "🐅",
    chinese: "虎 (Hǔ)",
    title: "The Warrior",
    archetype: "Bold ruler of the wilderness",
    traits: ["courageous", "passionate", "rebellious", "charismatic", "unpredictable"],
    strengths: [
      "Raw courage and physical vitality",
      "Natural magnetism and leadership",
      "Defends the underdog, fights injustice",
      "Lives life at full intensity",
    ],
    weaknesses: [
      "Impulsiveness and short temper",
      "Dislike of authority and routine",
      "Restlessness, hard to settle",
    ],
    career: ["military", "entrepreneur", "athlete", "activist", "actor", "explorer"],
    bestMatches: ["Horse", "Dog", "Pig"],
    challengingMatches: ["Monkey", "Snake", "Ox"],
    luckyColors: ["orange", "blue", "grey"],
    luckyNumbers: [1, 3, 4],
    summary:
      "The Tiger is the third animal of the zodiac — fierce, charismatic, and impossible to ignore. The Tiger leads with courage and lives on instinct. Its gift is the will to fight for what matters; its lesson is to temper fire with patience and to direct passion rather than be consumed by it.",
  },
  Cat: {
    name: "Cat",
    emoji: "🐇",
    chinese: "猫 (Māo)",
    title: "The Diplomat",
    archetype: "Gentle ambassador of grace",
    traits: ["gentle", "refined", "diplomatic", "artistic", "cautious"],
    strengths: [
      "Refined taste and aesthetic sense",
      "Skilled at de-escalating conflict",
      "Deep empathy and emotional intelligence",
      "Excellent hosts and connectors",
    ],
    weaknesses: [
      "Conflict-avoidance to own detriment",
      "Over-cautious, can miss opportunities",
      "Sensitive to criticism, prone to worry",
    ],
    career: ["diplomat", "designer", "writer", "counselor", "teacher", "interior designer"],
    bestMatches: ["Goat", "Pig", "Dog"],
    challengingMatches: ["Rooster", "Rat", "Dragon"],
    luckyColors: ["pink", "red", "purple"],
    luckyNumbers: [3, 4, 6],
    summary:
      "The Cat is the fourth animal of the zodiac — gentle, refined, and skilled at harmony. The Cat brings grace to any room and prefers diplomacy to confrontation. Its gift is the art of relationship; its lesson is to find courage in conflict and to act even when anxious.",
  },
  Dragon: {
    name: "Dragon",
    emoji: "🐉",
    chinese: "龙 (Lóng)",
    title: "The Emperor",
    archetype: "Majestic ruler of sky and fortune",
    traits: ["magnetic", "ambitious", "lucky", "proud", "visionary"],
    strengths: [
      "Natural charisma and authority",
      "Visionary imagination, large-scale thinking",
      "Innate luck — opportunities seem to find them",
      "Courage to dream bigger than others",
    ],
    weaknesses: [
      "Pride and arrogance",
      "Impatience with smaller minds",
      "Can be demanding and temperamental",
    ],
    career: ["CEO", "inventor", "politician", "performer", "architect", "investor"],
    bestMatches: ["Rat", "Monkey", "Rooster"],
    challengingMatches: ["Dog", "Goat", "Cat"],
    luckyColors: ["gold", "silver", "purple"],
    luckyNumbers: [1, 6, 7],
    summary:
      "The Dragon is the only mythical animal in the zodiac and the fifth in the cycle — majestic, ambitious, and fated for prominence. Dragons are born leaders with a sense of destiny; the world rearranges itself around them. Their lesson is to lead with humility, to remember that power without service becomes tyranny.",
  },
  Snake: {
    name: "Snake",
    emoji: "🐍",
    chinese: "蛇 (Shé)",
    title: "The Sage",
    archetype: "Silent keeper of wisdom",
    traits: ["wise", "mysterious", "intuitive", "elegant", "strategic"],
    strengths: [
      "Deep intuition, almost psychic",
      "Strategic thinking, sees several moves ahead",
      "Natural elegance and personal magnetism",
      "Patience to wait for the perfect moment",
    ],
    weaknesses: [
      "Secretive, hard to truly know",
      "Holding grudges, slow to forgive",
      "Possessive in love",
    ],
    career: ["philosopher", "psychologist", "investigator", "investor", "astrologer", "philosopher"],
    bestMatches: ["Ox", "Rooster", "Monkey"],
    challengingMatches: ["Pig", "Tiger", "Horse"],
    luckyColors: ["red", "yellow", "black"],
    luckyNumbers: [2, 8, 9],
    summary:
      "The Snake is the sixth animal of the zodiac — mysterious, wise, and intensely intuitive. The Snake sees what others miss and speaks only when words carry weight. Its gift is wisdom; its lesson is to share what it knows rather than hoard it, and to trust rather than control.",
  },
  Horse: {
    name: "Horse",
    emoji: "🐎",
    chinese: "马 (Mǎ)",
    title: "The Free Spirit",
    archetype: "Wild runner of open plains",
    traits: ["energetic", "independent", "warm", "restless", "witty"],
    strengths: [
      "Boundless physical and social energy",
      "Independence and self-reliance",
      "Warmth and quick humour",
      "Courage to roam and explore",
    ],
    weaknesses: [
      "Restlessness and commitment issues",
      "Impulsiveness, speaks before thinking",
      "Dislikes confinement of any kind",
    ],
    career: ["travel", "sales", "athlete", "performer", "explorer", "entrepreneur"],
    bestMatches: ["Tiger", "Dog", "Goat"],
    challengingMatches: ["Rat", "Ox", "Rooster"],
    luckyColors: ["yellow", "green", "red"],
    luckyNumbers: [2, 3, 7],
    summary:
      "The Horse is the seventh animal of the zodiac — energetic, freedom-loving, and impossible to fence in. Horses bring warmth and life wherever they go, but they need space to roam. Their gift is vitality; their lesson is to find freedom within commitment, and to finish what they start.",
  },
  Goat: {
    name: "Goat",
    emoji: "🐐",
    chinese: "羊 (Yáng)",
    title: "The Artist",
    archetype: "Gentle weaver of beauty",
    traits: ["artistic", "kind", "gentle", "worried", "compassionate"],
    strengths: [
      "Refined artistic and aesthetic sensibility",
      "Deep compassion and empathy",
      "Ability to create beauty in any environment",
      "Strong family orientation",
    ],
    weaknesses: [
      "Worry and anxiety",
      "Pessimism under stress",
      "Difficulty asserting self",
    ],
    career: ["artist", "designer", "musician", "healer", "gardener", "actor"],
    bestMatches: ["Cat", "Pig", "Horse"],
    challengingMatches: ["Ox", "Rat", "Dog"],
    luckyColors: ["brown", "red", "purple"],
    luckyNumbers: [3, 9, 4],
    summary:
      "The Goat (also translated as Sheep or Ram) is the eighth animal of the zodiac — gentle, artistic, and deeply feeling. Goats bring beauty and kindness to the world, often through art or care. Their gift is tenderness; their lesson is to find inner steel beneath the softness, and to trust their own resilience.",
  },
  Monkey: {
    name: "Monkey",
    emoji: "🐒",
    chinese: "猴 (Hóu)",
    title: "The Trickster Genius",
    archetype: "Clever inventor of clever solutions",
    traits: ["clever", "playful", "inventive", "curious", "mischievous"],
    strengths: [
      "Quick intellect and inventive mind",
      "Humour and social charm",
      "Ability to solve impossible problems",
      "Adaptable to any environment",
    ],
    weaknesses: [
      "Restlessness and inconsistency",
      "Can be deceptive or opportunistic",
      "Difficulty committing to one path",
    ],
    career: ["engineer", "comedian", "trader", "inventor", "strategist", "entrepreneur"],
    bestMatches: ["Rat", "Dragon", "Snake"],
    challengingMatches: ["Tiger", "Pig", "Ox"],
    luckyColors: ["white", "blue", "gold"],
    luckyNumbers: [4, 9],
    summary:
      "The Monkey is the ninth animal of the zodiac — brilliant, playful, and endlessly inventive. Monkeys see solutions others cannot, often with a twinkle of mischief. Their gift is intellect; their lesson is to use cleverness in service of integrity, not opportunism, and to commit rather than flit.",
  },
  Rooster: {
    name: "Rooster",
    emoji: "🐓",
    chinese: "鸡 (Jī)",
    title: "The Perfectionist",
    archetype: "Dawn announcer, precise and proud",
    traits: ["precise", "honest", "proud", "hardworking", "observant"],
    strengths: [
      "Sharp eye for detail and accuracy",
      "Honest and direct communication",
      "Strong work ethic and discipline",
      "Natural confidence and presence",
    ],
    weaknesses: [
      "Critical and perfectionistic",
      "Bragging tendencies, pride",
      "Rigidity about how things 'should' be done",
    ],
    career: ["surgeon", "editor", "military officer", "broadcaster", "auditor", "designer"],
    bestMatches: ["Ox", "Snake", "Dragon"],
    challengingMatches: ["Cat", "Dog", "Rat"],
    luckyColors: ["gold", "brown", "yellow"],
    luckyNumbers: [5, 7, 8],
    summary:
      "The Rooster is the tenth animal of the zodiac — precise, proud, and unfailingly honest. Roosters announce the dawn and bring order to chaos. Their gift is clarity and discipline; their lesson is to soften criticism into kindness, and to remember that not everyone shares their standards.",
  },
  Dog: {
    name: "Dog",
    emoji: "🐕",
    chinese: "狗 (Gǒu)",
    title: "The Guardian",
    archetype: "Loyal sentinel of justice",
    traits: ["loyal", "honest", "protective", "anxious", "fair-minded"],
    strengths: [
      "Unwavering loyalty to people and principles",
      "Strong sense of justice and fairness",
      "Honest, sometimes brutally so",
      "Protective of the vulnerable",
    ],
    weaknesses: [
      "Cynicism and worry",
      "Difficulty trusting",
      "Stubborn about right and wrong",
    ],
    career: ["judge", "police", "activist", "counselor", "teacher", "nurse"],
    bestMatches: ["Tiger", "Cat", "Horse"],
    challengingMatches: ["Dragon", "Goat", "Rooster"],
    luckyColors: ["green", "red", "purple"],
    luckyNumbers: [3, 4, 9],
    summary:
      "The Dog is the eleventh animal of the zodiac — loyal, principled, and protective. Dogs stand watch over what they love and fight for what is right. Their gift is fidelity; their lesson is to soften cynicism into trust, and to forgive the imperfections of those they guard.",
  },
  Pig: {
    name: "Pig",
    emoji: "🐖",
    chinese: "猪 (Zhū)",
    title: "The Bon Vivant",
    archetype: "Generous soul who enjoys life's pleasures",
    traits: ["generous", "warm", "indulgent", "honest", "peaceful"],
    strengths: [
      "Generosity and warmth of heart",
      "Refined sensual appreciation of life",
      "Honesty and trust in others",
      "Calm, peaceful disposition",
    ],
    weaknesses: [
      "Over-indulgence in pleasures",
      "Naivety, easily taken advantage of",
      "Avoidance of necessary conflict",
    ],
    career: ["chef", "hospitality", "philanthropist", "doctor", "entertainer", "designer"],
    bestMatches: ["Goat", "Cat", "Tiger"],
    challengingMatches: ["Snake", "Monkey", "Ox"],
    luckyColors: ["yellow", "grey", "brown"],
    luckyNumbers: [2, 5, 8],
    summary:
      "The Pig is the twelfth and final animal of the zodiac — generous, warm, and devoted to life's pleasures. Pigs enjoy good food, good company, and a peaceful home. Their gift is abundance; their lesson is to set boundaries so that generosity does not become depletion, and to face conflict when it is necessary.",
  },
};

// ─── Element archetypes ───────────────────────────────────────────────
export interface ElementProfile {
  element: Element;
  chinese: string;
  title: string;
  archetype: string;
  traits: string[];
  strengths: string[];
  challenges: string[];
  career: string[];
  organs: string[]; // TCM organ associations
  emotion: string;
  season: string;
  direction: string;
  color: string;
  summary: string;
}

export const ELEMENT_PROFILES: Record<Element, ElementProfile> = {
  Wood: {
    element: "Wood",
    chinese: "木 (Mù)",
    title: "The Pioneer",
    archetype: "Growing, reaching, expanding outward",
    traits: ["creative", "ambitious", "idealistic", "flexible", "growth-oriented"],
    strengths: [
      "Visionary planning and creativity",
      "Drive to grow and improve",
      "Flexibility in adversity",
      "Compassion for living things",
    ],
    challenges: [
      "Anger and frustration when blocked",
      "Over-commitment, spreading too thin",
      "Restlessness, hard to settle",
    ],
    career: ["education", "design", "publishing", "agriculture", "environmental work", "entrepreneurship"],
    organs: ["liver", "gallbladder"],
    emotion: "anger / kindness when balanced",
    season: "Spring",
    direction: "East",
    color: "Green",
    summary:
      "Wood (木) is the element of growth, expansion, and creative vision. Wood types are like trees — reaching upward while rooting deep. Their gift is the drive to create and improve; their lesson is to manage anger and not to over-extend into too many projects at once.",
  },
  Fire: {
    element: "Fire",
    chinese: "火 (Huǒ)",
    title: "The Illuminator",
    archetype: "Bright, expressive, warm, transformational",
    traits: ["passionate", "expressive", "charismatic", "intuitive", "warm"],
    strengths: [
      "Natural charisma and leadership",
      "Ability to inspire and excite others",
      "Quick thinking and eloquence",
      "Emotional warmth that draws people",
    ],
    challenges: [
      "Burnout, anxiety, scattered focus",
      "Impulsiveness and emotional volatility",
      "Difficulty with quiet, sustained work",
    ],
    career: ["performance", "media", "sales", "leadership", "spiritual teaching", "hospitality"],
    organs: ["heart", "small intestine"],
    emotion: "joy / panic when imbalanced",
    season: "Summer",
    direction: "South",
    color: "Red",
    summary:
      "Fire (火) is the element of passion, expression, and transformation. Fire types light up any room and inspire action. Their gift is warmth and charisma; their lesson is to protect against burnout and to cultivate sustained focus alongside the brilliance.",
  },
  Earth: {
    element: "Earth",
    chinese: "土 (Tǔ)",
    title: "The Nurturer",
    archetype: "Grounded, supportive, harmonising",
    traits: ["grounded", "nurturing", "reliable", "harmonising", "thoughtful"],
    strengths: [
      "Deep reliability and groundedness",
      "Ability to mediate and harmonise",
      "Nurturing care for others",
      "Practical wisdom in daily life",
    ],
    challenges: [
      "Worry and overthinking",
      "Resistance to change",
      "Self-neglect while caring for others",
    ],
    career: ["real estate", "hospitality", "counseling", "teaching", "nutrition", "human resources"],
    organs: ["spleen", "stomach"],
    emotion: "sympathy / worry when imbalanced",
    season: "Late Summer (transitions)",
    direction: "Center",
    color: "Yellow",
    summary:
      "Earth (土) is the element of grounding, nourishment, and harmony. Earth types are the reliable center — the ones others lean on. Their gift is steady care; their lesson is to receive as much as they give, and to keep worry from becoming chronic anxiety.",
  },
  Metal: {
    element: "Metal",
    chinese: "金 (Jīn)",
    title: "The Refiner",
    archetype: "Precise, principled, discriminating",
    traits: ["precise", "principled", "disciplined", "refined", "reserved"],
    strengths: [
      "Sharp discernment and attention to detail",
      "Strong principles and integrity",
      "Discipline and self-control",
      "Refined aesthetic and ethical sense",
    ],
    challenges: [
      "Rigidity and inability to bend",
      "Grief and melancholy",
      "Critical of self and others",
    ],
    career: ["law", "finance", "surgery", "engineering", "jewelry", "military"],
    organs: ["lungs", "large intestine"],
    emotion: "grief / courage when balanced",
    season: "Autumn",
    direction: "West",
    color: "White",
    summary:
      "Metal (金) is the element of refinement, principle, and discernment. Metal types cut through illusion to find what is true and lasting. Their gift is clarity; their lesson is to soften judgment with compassion, and to allow grief to move rather than settle.",
  },
  Water: {
    element: "Water",
    chinese: "水 (Shuǐ)",
    title: "The Philosopher",
    archetype: "Deep, still, adaptive, wise",
    traits: ["deep", "introspective", "adaptive", "wise", "mysterious"],
    strengths: [
      "Deep wisdom and insight",
      "Adaptability to any situation",
      "Strong intuition and psychic ability",
      "Patience and persistence",
    ],
    challenges: [
      "Fear and indecision",
      "Isolation and emotional freezing",
      "Lethargy, can stagnate without movement",
    ],
    career: ["philosophy", "research", "healing", "navigation", "diplomacy", "writing"],
    organs: ["kidneys", "bladder"],
    emotion: "fear / stillness when balanced",
    season: "Winter",
    direction: "North",
    color: "Black / Dark Blue",
    summary:
      "Water (水) is the element of depth, wisdom, and adaptability. Water types flow around obstacles and store profound insight beneath a still surface. Their gift is wisdom; their lesson is to keep moving — stagnant water breeds fear, while flowing water remains clear.",
  },
};

// ─── Day Master profile (Bazi "self" element) ─────────────────────────
// Day master descriptions build on Element profiles but emphasize how
// the day-master element seeks balance (用神 / favor element).
export interface DayMasterProfile {
  element: Element;
  polarity: Polarity;
  title: string;
  description: string;
  favorableElements: Element[]; // elements that balance this day master generically
  unfavorableElements: Element[];
}

export function getDayMasterProfile(element: Element, polarity: Polarity): DayMasterProfile {
  const base: Record<Element, Omit<DayMasterProfile, "element" | "polarity">> = {
    Wood: {
      title: polarity === "Yang" ? "Yang Wood — The Great Tree (甲)" : "Yin Wood — The Flowering Vine (乙)",
      description:
        polarity === "Yang"
          ? "Yang Wood day masters are like great trees — steadfast, principled, slow to bend. They grow toward the sky and shelter those beneath them. They benefit from Water (nourishment) and Fire (expression) but wilt under excess Metal (cutting)."
          : "Yin Wood day masters are like flowering vines — flexible, graceful, adaptive. They thrive in relationship and need support to climb. They benefit from Water (nourishment) and gentle Sun (Fire), but wither under Metal (shears) or excess drying Fire.",
      favorableElements: ["Water", "Fire"],
      unfavorableElements: ["Metal"],
    },
    Fire: {
      title: polarity === "Yang" ? "Yang Fire — The Sun (丙)" : "Yin Fire — The Lantern (丁)",
      description:
        polarity === "Yang"
          ? "Yang Fire day masters are the Sun — radiant, constant, illuminating. Their warmth reaches everyone equally and they cannot be hidden. They benefit from Wood (fuel) and Earth (grounding) but burn out under excess Water (extinguishing)."
          : "Yin Fire day masters are like a candle or lantern — soft, focused, intimate. They light what is close rather than the whole world. They benefit from Wood (fuel) and gentle Earth, but are easily blown out by strong Water or Wind.",
      favorableElements: ["Wood", "Earth"],
      unfavorableElements: ["Water"],
    },
    Earth: {
      title: polarity === "Yang" ? "Yang Earth — The Mountain (戊)" : "Yin Earth — The Garden Soil (己)",
      description:
        polarity === "Yang"
          ? "Yang Earth day masters are the Mountain — massive, immovable, eternal. They hold ground and weather storms without flinching. They benefit from Fire (warmth) and Metal (refinement) but become waterlogged under excess Water."
          : "Yin Earth day masters are fertile garden soil — nurturing, receptive, life-giving. They grow whatever is planted in them. They benefit from Fire (warmth) and Metal (refinement) but turn to mud under excess Water.",
      favorableElements: ["Fire", "Metal"],
      unfavorableElements: ["Water"],
    },
    Metal: {
      title: polarity === "Yang" ? "Yang Metal — The Sword (庚)" : "Yin Metal — The Jewelry (辛)",
      description:
        polarity === "Yang"
          ? "Yang Metal day masters are the sword or axe — sharp, decisive, principled. They cut through dishonesty and defend what is right. They benefit from Earth (rooting) and Water (washing) but dull under excess Fire (forging) or rust under excess Water."
          : "Yin Metal day masters are refined jewelry or a delicate blade — beautiful, precise, sensitive. They bring refinement and elegance. They benefit from Earth (rooting) and Water (clarity) but melt under excess Fire.",
      favorableElements: ["Earth", "Water"],
      unfavorableElements: ["Fire"],
    },
    Water: {
      title: polarity === "Yang" ? "Yang Water — The Ocean (壬)" : "Yin Water — The Stream (癸)",
      description:
        polarity === "Yang"
          ? "Yang Water day masters are the ocean — vast, deep, powerful, containing everything. They move in tides and reach every shore. They benefit from Metal (source) and Wood (outlet) but become murky under excess Earth (silt)."
          : "Yin Water day masters are streams, mist, dew — gentle, penetrating, hard to grasp. They seep into every corner and nourish quietly. They benefit from Metal (source) and Wood (outlet) but stagnate under excess Earth.",
      favorableElements: ["Metal", "Wood"],
      unfavorableElements: ["Earth"],
    },
  };
  return { element, polarity, ...base[element] };
}

export function getAnimalProfile(name: AnimalName): AnimalProfile {
  return ANIMAL_PROFILES[name];
}
export function getElementProfile(el: Element): ElementProfile {
  return ELEMENT_PROFILES[el];
}
