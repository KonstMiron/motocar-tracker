import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import s from "./ExpenseChart.module.scss";

export const ExpenseChart = ({ vehicleId }) => {
  const [data, setData] = useState([]);

  const fetchExpenses = async () => {
    const res = await fetch(
      `http://localhost:8080/api/vehicles/${vehicleId}/expenses`
    );
    const raw = await res.json();

    const map = new Map();

    raw.forEach((e) => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;

      const current = map.get(key) || 0;
      map.set(key, current + e.amount);
    });

    const arr = Array.from(map.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([key, amount]) => {
        const [year, month] = key.split("-");
        const label = `${month}.${year}`;

        return { monthKey: key, monthLabel: label, amount };
      });

    setData(arr);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  if (!data.length)
    return <p className={s.empty}>Brak danych wydatków...</p>;

  return (
    <div className={s.chartBlock}>
      <h3>Wydatki miesięczne</h3>

      <div className={s.chartWrapper}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="monthLabel" stroke="#aaa" />
            <YAxis
              stroke="#aaa"
              tickFormatter={(v) => `${v} zł`}
            />
            <Tooltip
              contentStyle={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "10px"
              }}
              labelStyle={{ color: "#fff" }}
              formatter={(value) => [`${value.toFixed(2)} zł`, "Kwota"]}
            />
            <Bar dataKey="amount" fill="#3498db" name="Kwota" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};