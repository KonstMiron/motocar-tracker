import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import s from "./MileChart.module.scss";
import API_URL from '../../../../config';

export const MileChart = ({ vehicleId }) => {
  const [data, setData] = useState([]);

  const fetchMileage = async () => {
    const res = await fetch(
      `${API_URL}/api/vehicles/${vehicleId}/mileage`
    );
    const raw = await res.json();

    const converted = raw
      .map((e) => ({
        date: new Date(e.date), 
        odometer: e.odometer
      }))
      .sort((a, b) => a.date - b.date)
      .map((e) => ({
        dateLabel: e.date.toLocaleDateString("pl-PL"),
        odometer: e.odometer
      }));

    setData(converted);
  };

  useEffect(() => {
    fetchMileage();
  }, []);

  if (!data.length)
    return <p className={s.empty}>Brak danych do wyświetlenia...</p>;

  return (
    <div className={s.chartBlock}>
      <h3>Przebieg — historia</h3>

      <div className={s.chartWrapper}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="dateLabel" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip
              contentStyle={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "10px"
              }}
              labelStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="odometer"
              stroke="#2ecc71"
              strokeWidth={3}
              dot={{ r: 3, fill: "#2ecc71" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};