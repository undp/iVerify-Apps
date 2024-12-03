import { TasksLabels } from "./tasks-labels";

export function common(): string {
  return 'common';
}


export function getLabel(lang, key) {
  // Check the country-specific language first
  if (TasksLabels[lang] && TasksLabels[lang][key]) {
      return TasksLabels[lang][key];
  }
  // Fallback to base language (e.g., 'en' from 'en-malawi')
  const baseLang = lang.split('-')[0]; // Extract base language code
  console.log('baselang', baseLang,lang)
  if (TasksLabels[baseLang] && TasksLabels[baseLang][key]) {
      return TasksLabels[baseLang][key];
  }
  // If key is not found in either, return null or a default value
  return null;
}
