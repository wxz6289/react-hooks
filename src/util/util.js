export function getUniqueValues(array, property) {
  const propValues = array.map((item) => item[property]);
  return Array.from(new Set(propValues));
}

export function addDays(date, daysToAdd) {
  const clone = new Date(date.getTime());
  clone.setDate(clone.getDate() + daysToAdd);
  return clone;
}

export function getWeek(forDate, dayOffset = 0) {
  const date = addDays(forDate, dayOffset);
  const day = date.getDay();
  return {
    date,
    start: addDays(date, -day),
    end: addDays(date, 6 - day)
  };
}