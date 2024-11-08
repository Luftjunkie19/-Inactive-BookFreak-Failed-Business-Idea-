import { getHours } from 'date-fns';

export function getTimeOfDay(date:Date) {
  const hour = getHours(date);

  if (hour >= 5 && hour < 12) {
    return 'Daybreak Dreamer';
  } else if (hour >= 12 && hour < 17) {
    return 'Peak Pager';
  } else if (hour >= 17 && hour < 21) {
    return 'Dusk Dweller';
  } else {
    return 'Night Owl';
  }
}