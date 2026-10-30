export const TOPIC_PALETTES = {
  DSA: {
    banner: "bg-[#6b21a8]",
    avatarBg: "bg-[#3b0764] text-white",
    tagBg: "bg-[#3b0764] text-[#c084fc]",
    button: "bg-[#a855f7] hover:bg-[#9333ea] text-white",
  },
  "Web Dev": {
    banner: "bg-[#0d9488]",
    avatarBg: "bg-[#115e59] text-white",
    tagBg: "bg-[#115e59] text-[#2dd4bf]",
    button: "bg-[#0d9488] hover:bg-[#0f766e] text-white",
  },
  CP: {
    banner: "bg-[#e11d48]",
    avatarBg: "bg-[#881337] text-white",
    tagBg: "bg-[#881337] text-[#fb7185]",
    button: "bg-[#e11d48] hover:bg-[#be123c] text-white",
  },
  "System Design": {
    banner: "bg-[#d97706]",
    avatarBg: "bg-[#78350f] text-white",
    tagBg: "bg-[#78350f] text-[#fbbf24]",
    button: "bg-[#f59e0b] hover:bg-[#d97706] text-black font-semibold",
  },
  Java: {
    banner: "bg-[#059669]",
    avatarBg: "bg-[#064e3b] text-white",
    tagBg: "bg-[#064e3b] text-[#34d399]",
    button: "bg-[#10b981] hover:bg-[#059669] text-black font-semibold",
  },
  "Interview Prep": {
    banner: "bg-[#db2777]",
    avatarBg: "bg-[#701a75] text-white",
    tagBg: "bg-[#701a75] text-[#f472b6]",
    button: "bg-[#ec4899] hover:bg-[#db2777] text-white font-semibold",
  },
  Python: {
    banner: "bg-[#2563eb]",
    avatarBg: "bg-[#1e3a8a] text-white",
    tagBg: "bg-[#1e3a8a] text-[#60a5fa]",
    button: "bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold",
  },
  "AI / ML": {
    banner: "bg-[#7c3aed]",
    avatarBg: "bg-[#4c1d95] text-white",
    tagBg: "bg-[#4c1d95] text-[#c4b5fd]",
    button: "bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold",
  },
};

export const PALETTE_CYCLE = [
  TOPIC_PALETTES.DSA,
  TOPIC_PALETTES["Web Dev"],
  TOPIC_PALETTES.CP,
  TOPIC_PALETTES["System Design"],
  TOPIC_PALETTES.Java,
  TOPIC_PALETTES["Interview Prep"],
  TOPIC_PALETTES.Python,
  TOPIC_PALETTES["AI / ML"],
];

export const detectTopic = (group) => {
  if (group?.topic) return group.topic;
  const rawDesc = group?.description || "";
  const match = rawDesc.match(/\[(?:topic:)?\s*([a-zA-Z0-9\s/+-]+)\]/i);
  if (match && match[1]) {
    return match[1].trim();
  }

  const text = `${group?.name || ""} ${rawDesc}`.toLowerCase();
  if (text.includes("system design") || text.includes("hld") || text.includes("lld"))
    return "System Design";
  if (
    text.includes("react") ||
    text.includes("web") ||
    text.includes("frontend") ||
    text.includes("fullstack")
  )
    return "Web Dev";
  if (
    text.includes("codeforces") ||
    text.includes("competitive") ||
    text.includes("cp") ||
    text.includes("atcoder")
  )
    return "CP";
  if (text.includes("java") || text.includes("jvm") || text.includes("spring"))
    return "Java";
  if (text.includes("interview") || text.includes("faang"))
    return group?.privacy === "PRIVATE" ? "DSA" : "Interview Prep";
  if (
    text.includes("dp") ||
    text.includes("dsa") ||
    text.includes("leetcode") ||
    text.includes("algorithm")
  )
    return "DSA";
  if (text.includes("python") || text.includes("django"))
    return "Python";
  if (text.includes("ai") || text.includes("ml") || text.includes("learning"))
    return "AI / ML";
  return null;
};

export const cleanDescription = (desc) => {
  if (!desc) return "";
  return desc.replace(/\[(?:topic:)?\s*([a-zA-Z0-9\s/+-]+)\]/gi, "").trim();
};

export const getGroupPalette = (group, index = 0) => {
  if (group?.privacy === "PRIVATE") {
    return TOPIC_PALETTES["Interview Prep"];
  }
  const topic = detectTopic(group);
  if (TOPIC_PALETTES[topic]) {
    return TOPIC_PALETTES[topic];
  }
  return PALETTE_CYCLE[index % PALETTE_CYCLE.length];
};

export const formatMemberCount = (count) => {
  if (count === undefined || count === null) return "0 members";
  const num = Number(count);
  if (isNaN(num)) return `${count} members`;
  return `${num.toLocaleString()} ${num === 1 ? "member" : "members"}`;
};

export const formatActiveTime = (group, fallback = "Active 5m ago") => {
  if (group?.activeTime) return group.activeTime;
  const dateStr = group?.updatedAt || group?.createdAt;
  if (!dateStr) return fallback;

  try {
    const now = new Date();
    const past = new Date(dateStr);
    const diffSec = Math.floor((now - past) / 1000);
    if (diffSec < 60) return "Active just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `Active ${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `Active ${diffHour}h ago`;
    const diffDays = Math.floor(diffHour / 24);
    return `Active ${diffDays}d ago`;
  } catch {
    return fallback;
  }
};
