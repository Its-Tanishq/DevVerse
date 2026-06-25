export const getPasswordStrength = (password) => {
  let score = 0;
  if (!password) return 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score > 5 ? 5 : score;
};

export const getStrengthColors = (score) => {
  if (score === 0) return ["bg-accent", "bg-accent", "bg-accent", "bg-accent", "bg-accent"];
  if (score === 1) return ["bg-red-500", "bg-accent", "bg-accent", "bg-accent", "bg-accent"];
  if (score === 2) return ["bg-orange-500", "bg-orange-500", "bg-accent", "bg-accent", "bg-accent"];
  if (score === 3) return ["bg-yellow-400", "bg-yellow-400", "bg-yellow-400", "bg-accent", "bg-accent"];
  if (score === 4) return ["bg-emerald-400", "bg-emerald-400", "bg-emerald-400", "bg-emerald-400", "bg-accent"];
  return ["bg-emerald-500", "bg-emerald-500", "bg-emerald-500", "bg-emerald-500", "bg-emerald-500"];
};

export const getStrengthText = (score) => {
  if (score === 0) return "Enter a password";
  if (score <= 2) return "Weak — add more characters";
  if (score === 3) return "Moderate — add a symbol/number";
  if (score === 4) return "Good — almost there";
  return "Strong — ready to go!";
};

export const getStrengthColor = (score) => {
  if (score === 0) return "bg-slate-200 dark:bg-slate-800";
  if (score <= 2) return "bg-red-500";
  if (score === 3) return "bg-orange-500";
  if (score === 4) return "bg-amber-500";
  return "bg-green-500";
};

export const getTextColor = (score) => {
  if (score === 0) return "text-slate-400 dark:text-slate-500";
  if (score <= 2) return "text-red-500";
  if (score === 3) return "text-orange-500";
  if (score === 4) return "text-amber-500";
  return "text-green-500";
};
