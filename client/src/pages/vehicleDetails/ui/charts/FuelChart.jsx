import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from "recharts";
import s from "./FuelChart.module.scss";
import API_URL from '../../../../config';

export const FuelChart = ({ vehicleId }) => {
  const [data, setData] = useState([]);

  const fetchFuel = async () => {
    const res = await fetch(
      `${API_URL}/api/vehicles/${vehicleId}/fuel`
    );
    const raw = await res.json();

    const converted = raw
      .map((e) => ({
        date: new Date(e.date),
        liters: e.liters,
        totalCost:
          e.totalCost ??
          (e.pricePerLiter ? e.pricePerLiter * e.liters : null)
      }))
      .sort((a, b) => a.date - b.date)
      .map((e) => ({
        dateLabel: e.date.toLocaleDateString("pl-PL"),
        liters: e.liters,
        totalCost: e.totalCost
      }));

    setData(converted);
  };

  useEffect(() => {
    fetchFuel();
  }, []);

  if (!data.length)
    return <p className={s.empty}>Brak danych tankowania...</p>;

  return (
    <div className={s.chartBlock}>
      <h3>Tankowania — ilość i koszt</h3>

      <div className={s.chartWrapper}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="dateLabel" stroke="#aaa" />
            <YAxis yAxisId="left" stroke="#aaa" />
            <YAxis
              yAxisId="right"
              orientation="right"
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
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="liters"
              name="Litry"
              fill="#2ecc71"
            />
            <Bar
              yAxisId="right"
              dataKey="totalCost"
              name="Koszt (zł)"
              fill="#e67e22"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};