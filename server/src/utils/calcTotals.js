export const calcTotals = ({ fuel = [], expenses = [] } = {}) => {
  const totalFuelLiters = fuel.reduce((s, e) => s + (e.liters || 0), 0);

  const totalFuelCost = fuel.reduce((s, e) => {
    if (e.totalCost != null) return s + Number(e.totalCost);
    if (e.pricePerLiter != null) return s + Number(e.pricePerLiter) * Number(e.liters || 0);
    return s;
  }, 0);

  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);

  return {
    totalFuelLiters,
    totalFuelCost,
    totalExpenses,
  };
};