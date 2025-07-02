import { LANGUAGE_TO_FLAG } from "./constant";

export const getLanguageFlagUrl = (language) => {
  if (!language) return null;
  const langLower = language.toLowerCase();
  const code = LANGUAGE_TO_FLAG[langLower];
  return code ? `https://flagcdn.com/24x18/${code}.png` : null;
};

export const capitalize = (str) => {
  if (typeof str !== "string" || !str.trim()) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
