// Mood helper utility - provides descriptions and emojis for moods

const moodDatabase = {
  happy: {
    emoji: "😊",
    description: "Feeling joyful and content! Great to see you're in a positive mood.",
    color: "yellow",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-800",
  },
  sad: {
    emoji: "😢",
    description: "It's okay to feel down sometimes. Remember, this feeling will pass.",
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
  },
  angry: {
    emoji: "😠",
    description: "Feeling frustrated? Take a deep breath. You're allowed to feel this way.",
    color: "red",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-800",
  },
  anxious: {
    emoji: "😰",
    description: "Anxiety can be overwhelming. Try some deep breathing or a short walk.",
    color: "orange",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-800",
  },
  excited: {
    emoji: "🤩",
    description: "Full of energy and enthusiasm! Channel this positive energy!",
    color: "pink",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-800",
  },
  calm: {
    emoji: "😌",
    description: "Peaceful and relaxed. Enjoy this moment of tranquility.",
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-800",
  },
  tired: {
    emoji: "😴",
    description: "Feeling drained? Make sure to rest and recharge when you can.",
    color: "gray",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    textColor: "text-gray-800",
  },
  grateful: {
    emoji: "🙏",
    description: "Gratitude is powerful! Keep focusing on the positive things in life.",
    color: "purple",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-800",
  },
  confused: {
    emoji: "😕",
    description: "Uncertainty is part of life. Take your time to figure things out.",
    color: "indigo",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-800",
  },
  motivated: {
    emoji: "💪",
    description: "Ready to take on challenges! Use this motivation to achieve your goals.",
    color: "teal",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    textColor: "text-teal-800",
  },
};

// Quick mood buttons for easy selection
export const quickMoods = [
  { label: "Happy", value: "happy" },
  { label: "Calm", value: "calm" },
  { label: "Excited", value: "excited" },
  { label: "Grateful", value: "grateful" },
  { label: "Motivated", value: "motivated" },
  { label: "Tired", value: "tired" },
  { label: "Anxious", value: "anxious" },
  { label: "Sad", value: "sad" },
  { label: "Confused", value: "confused" },
  { label: "Angry", value: "angry" },
];

// Get mood info from input text
export function getMoodInfo(moodText) {
  if (!moodText) return null;

  const lowerMood = moodText.toLowerCase().trim();

  // Direct match
  if (moodDatabase[lowerMood]) {
    return moodDatabase[lowerMood];
  }

  // Partial match
  for (const [key, value] of Object.entries(moodDatabase)) {
    if (lowerMood.includes(key) || key.includes(lowerMood)) {
      return value;
    }
  }

  // Check for common mood keywords
  const moodKeywords = {
    happy: ["happy", "joy", "glad", "cheerful", "pleased", "delighted"],
    sad: ["sad", "down", "upset", "depressed", "melancholy", "unhappy"],
    angry: ["angry", "mad", "furious", "annoyed", "irritated", "frustrated"],
    anxious: ["anxious", "worried", "nervous", "stressed", "panicked", "uneasy"],
    excited: ["excited", "thrilled", "pumped", "energetic", "enthusiastic"],
    calm: ["calm", "peaceful", "relaxed", "serene", "tranquil", "chill"],
    tired: ["tired", "exhausted", "drained", "sleepy", "weary", "fatigued"],
    grateful: ["grateful", "thankful", "appreciative", "blessed"],
    confused: ["confused", "uncertain", "unsure", "puzzled", "lost"],
    motivated: ["motivated", "determined", "focused", "driven", "inspired"],
  };

  for (const [moodKey, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some((keyword) => lowerMood.includes(keyword))) {
      return moodDatabase[moodKey];
    }
  }

  // Default for unknown moods
  return {
    emoji: "😐",
    description: "Thanks for sharing how you feel. Every mood is valid!",
    color: "gray",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    textColor: "text-gray-800",
  };
}

export default moodDatabase;
export function formatDate(value, { dateOnly = false } = {}) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  if (dateOnly) {
    // e.g. "Nov 17, 2025"
    return d.toLocaleDateString(undefined, { dateStyle: "medium" });
  }

  // e.g. "Nov 17, 2025, 2:34 PM"
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
