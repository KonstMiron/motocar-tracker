import { calcTotals } from "../../src/utils/calcTotals.js";

test("calcTotals: calculates totals correctly", () => {
  const r = calcTotals({
    fuel: [{ liters: 10, totalCost: 60 }, { liters: 5, pricePerLiter: 6 }],
    expenses: [{ amount: 100 }, { amount: 50 }],
  });

  expect(r.totalFuelLiters).toBe(15);
  expect(r.totalFuelCost).toBe(60 + 5 * 6);
  expect(r.totalExpenses).toBe(150);
});

test("calcTotals: empty arrays -> zeros", () => {
  const r = calcTotals();
  expect(r.totalFuelLiters).toBe(0);
  expect(r.totalFuelCost).toBe(0);
  expect(r.totalExpenses).toBe(0);
});