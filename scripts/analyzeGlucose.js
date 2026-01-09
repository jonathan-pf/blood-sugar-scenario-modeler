import { readFileSync } from 'fs';

// Read CSV
const csv = readFileSync('./Blood Glucose 2.csv', 'utf-8');
const lines = csv.trim().split('\n').slice(1); // skip header

// Parse into readings
const readings = [];
for (const line of lines) {
  const [datetime, glucose] = line.split(',');
  if (!datetime || !glucose) continue;

  const date = new Date(datetime);
  const value = parseFloat(glucose);

  if (isNaN(value)) continue;

  readings.push({ date, value, hour: date.getHours() });
}

console.log(`Total readings: ${readings.length}`);

// Filter to Q4 2025 (Oct 1 - Dec 31)
const q4Readings = readings.filter(r => {
  const year = r.date.getFullYear();
  const month = r.date.getMonth(); // 0-indexed
  return year === 2025 && month >= 9 && month <= 11; // Oct=9, Nov=10, Dec=11
});

console.log(`Q4 2025 readings: ${q4Readings.length}`);

// Group by date (YYYY-MM-DD)
const byDate = {};
for (const r of q4Readings) {
  const dateKey = r.date.toISOString().split('T')[0];
  if (!byDate[dateKey]) byDate[dateKey] = [];
  byDate[dateKey].push(r);
}

const dates = Object.keys(byDate).sort();
console.log(`Days in Q4: ${dates.length}`);
console.log(`Date range: ${dates[0]} to ${dates[dates.length - 1]}`);

// Calculate daily mean for each day
const dailyMeans = dates.map(date => {
  const dayReadings = byDate[date];
  const mean = dayReadings.reduce((sum, r) => sum + r.value, 0) / dayReadings.length;
  return { date, mean, readings: dayReadings };
});

// Sort by daily mean to find best/worst days
const sortedByMean = [...dailyMeans].sort((a, b) => a.mean - b.mean);

// Best 10% (lowest mean) and worst 10% (highest mean)
const tenPercent = Math.ceil(dates.length * 0.1);
const bestDays = sortedByMean.slice(0, tenPercent);
const worstDays = sortedByMean.slice(-tenPercent);

console.log(`\nBest 10% days (${bestDays.length} days):`);
bestDays.forEach(d => console.log(`  ${d.date}: ${d.mean.toFixed(2)} mmol/L`));

console.log(`\nWorst 10% days (${worstDays.length} days):`);
worstDays.forEach(d => console.log(`  ${d.date}: ${d.mean.toFixed(2)} mmol/L`));

// Calculate hourly averages for each profile
function calculateHourlyProfile(daysList) {
  const hourlyValues = Array.from({ length: 24 }, () => []);

  for (const day of daysList) {
    for (const r of day.readings) {
      hourlyValues[r.hour].push(r.value);
    }
  }

  return hourlyValues.map(values => {
    if (values.length === 0) return null;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  });
}

// All Q4 average
const avgProfile = calculateHourlyProfile(dailyMeans);
const best10Profile = calculateHourlyProfile(bestDays);
const worst10Profile = calculateHourlyProfile(worstDays);

console.log('\n--- PROFILES (24 hourly values, mmol/L) ---\n');

console.log('Q4 2025 Average:');
console.log(JSON.stringify(avgProfile.map(v => v ? parseFloat(v.toFixed(2)) : null), null, 2));

console.log('\nBest 10% Days:');
console.log(JSON.stringify(best10Profile.map(v => v ? parseFloat(v.toFixed(2)) : null), null, 2));

console.log('\nWorst 10% Days:');
console.log(JSON.stringify(worst10Profile.map(v => v ? parseFloat(v.toFixed(2)) : null), null, 2));

// Calculate overall metrics
function calcMetrics(profile) {
  const values = profile.filter(v => v !== null);
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const std = Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length);
  const inRange = values.filter(v => v >= 3.9 && v <= 10).length;
  const below = values.filter(v => v < 3.9).length;
  const above = values.filter(v => v > 10).length;

  return {
    mean: mean.toFixed(2),
    a1c: ((mean * 18.05 + 46.7) / 28.7).toFixed(1),
    gmi: (3.31 + 0.4314 * mean).toFixed(1),
    tir: ((inRange / values.length) * 100).toFixed(0),
    tbr: ((below / values.length) * 100).toFixed(0),
    tar: ((above / values.length) * 100).toFixed(0),
    cv: ((std / mean) * 100).toFixed(0)
  };
}

console.log('\n--- METRICS ---\n');
console.log('Q4 Average:', calcMetrics(avgProfile));
console.log('Best 10%:', calcMetrics(best10Profile));
console.log('Worst 10%:', calcMetrics(worst10Profile));

// Export as TypeScript constants
console.log('\n--- TYPESCRIPT EXPORT ---\n');
console.log(`export const Q4_AVERAGE: number[] = ${JSON.stringify(avgProfile.map(v => v ? parseFloat(v.toFixed(2)) : 0))};`);
console.log(`export const Q4_BEST_10: number[] = ${JSON.stringify(best10Profile.map(v => v ? parseFloat(v.toFixed(2)) : 0))};`);
console.log(`export const Q4_WORST_10: number[] = ${JSON.stringify(worst10Profile.map(v => v ? parseFloat(v.toFixed(2)) : 0))};`);
