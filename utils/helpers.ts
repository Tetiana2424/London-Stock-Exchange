export function getCurrentDayNumber(): number {
  const today = new Date();
  return today.getDate();
}
