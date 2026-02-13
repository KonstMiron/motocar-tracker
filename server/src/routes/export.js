import express from "express";
import PDFDocument from "pdfkit";
import { Parser } from "json2csv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { Vehicle } from "../models/Vehicle.js";
import { MileageEntry } from "../models/MileageEntry.js";
import { FuelEntry } from "../models/FuelEntry.js";
import { ExpenseEntry } from "../models/ExpenseEntry.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEM_FONTS = [
  "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
  "/System/Library/Fonts/Supplemental/Arial.ttf",
  "/System/Library/Fonts/Supplemental/Helvetica.ttf",
];

const FONT_PATH = SYSTEM_FONTS.find((p) => fs.existsSync(p)) || null;

const plDate = (d) => new Date(d).toLocaleDateString("pl-PL");
const num2 = (v) => (v == null || Number.isNaN(Number(v)) ? "" : Number(v).toFixed(2));

// -------------------- CSV --------------------
router.get("/vehicle/:id.csv", async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id).lean();
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const [mileage, fuel, expenses] = await Promise.all([
      MileageEntry.find({ vehicleId: id }).sort({ date: -1 }).lean(),
      FuelEntry.find({ vehicleId: id }).sort({ date: -1 }).lean(),
      ExpenseEntry.find({ vehicleId: id }).sort({ date: -1 }).lean(),
    ]);

    const rows = [
      ...mileage.map((e) => ({
        date: plDate(e.date),
        type: "mileage",
        odometer_km: e.odometer ?? "",
        liters_l: "",
        price_per_liter: "",
        fuel_cost_pln: "",
        expense_category: "",
        expense_amount_pln: "",
        description: e.note || "",
        place_or_station: "",
      })),
      ...fuel.map((e) => ({
        date: plDate(e.date),
        type: "fuel",
        odometer_km: e.odometer ?? "",
        liters_l: num2(e.liters),
        price_per_liter: e.pricePerLiter != null ? num2(e.pricePerLiter) : "",
        fuel_cost_pln:
          e.totalCost != null
            ? num2(e.totalCost)
            : e.pricePerLiter != null
              ? num2(Number(e.pricePerLiter) * Number(e.liters || 0))
              : "",
        expense_category: "",
        expense_amount_pln: "",
        description: "",
        place_or_station: e.station || "",
      })),
      ...expenses.map((e) => ({
        date: plDate(e.date),
        type: "expense",
        odometer_km: "",
        liters_l: "",
        price_per_liter: "",
        fuel_cost_pln: "",
        expense_category: e.category || "",
        expense_amount_pln: num2(e.amount),
        description: e.description || "",
        place_or_station: e.place || "",
      })),
    ];

    rows.sort((a, b) => {
      const pa = a.date.split(".").reverse().join("-");
      const pb = b.date.split(".").reverse().join("-");
      return new Date(pb) - new Date(pa);
    });

    const parser = new Parser({
      withBOM: true,
      fields: [
        { label: "Data", value: "date" },
        { label: "Typ", value: "type" },
        { label: "Odometr (km)", value: "odometer_km" },
        { label: "Litry (l)", value: "liters_l" },
        { label: "Cena/l (PLN)", value: "price_per_liter" },
        { label: "Koszt paliwa (PLN)", value: "fuel_cost_pln" },
        { label: "Kategoria wydatku", value: "expense_category" },
        { label: "Kwota wydatku (PLN)", value: "expense_amount_pln" },
        { label: "Opis", value: "description" },
        { label: "Miejsce / Stacja", value: "place_or_station" },
      ],
    });

    const csv = parser.parse(rows);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="vehicle-${vehicle._id}-export.csv"`
    );

    return res.status(200).send(csv);
  } catch (err) {
    console.error("CSV export error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// -------------------- PDF --------------------
router.get("/vehicle/:id.pdf", async (req, res) => {
  let doc;

  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id).lean();
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const [mileage, fuel, expenses] = await Promise.all([
      MileageEntry.find({ vehicleId: id }).sort({ date: -1 }).lean(),
      FuelEntry.find({ vehicleId: id }).sort({ date: -1 }).lean(),
      ExpenseEntry.find({ vehicleId: id }).sort({ date: -1 }).lean(),
    ]);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="vehicle-${vehicle._id}-report.pdf"`
    );

    doc = new PDFDocument({ margin: 40 });

    doc.on("error", (err) => {
      console.error("PDFKit error:", err);
      try { res.end(); } catch (_) {}
    });
    res.on("error", (err) => console.error("Response error:", err));

    doc.pipe(res);

    doc.registerFont("noto", FONT_PATH);
    doc.font("noto");

    // ---- helpers (table)
    const pageBottom = () => doc.page.height - doc.page.margins.bottom;

    const ensureSpace = (h = 20) => {
      if (doc.y + h > pageBottom()) {
        doc.addPage();
        doc.font("noto");
      }
    };

    const drawTable = ({ title, columns, rows }) => {
      doc.fontSize(13).text(title);
      doc.moveDown(0.5);

      const startX = doc.page.margins.left;
      const rowH = 18;
      const tableWidth = columns.reduce((s, c) => s + c.width, 0);

      ensureSpace(rowH + 10);
      const headerY = doc.y;

      doc.fontSize(10);
      let x = startX;
      columns.forEach((c) => {
        doc.text(String(c.label), x, headerY, { width: c.width });
        x += c.width;
      });

      doc
        .moveTo(startX, headerY + rowH - 4)
        .lineTo(startX + tableWidth, headerY + rowH - 4)
        .strokeColor("gray")
        .opacity(0.35)
        .stroke()
        .opacity(1);

      let y = headerY + rowH;

      rows.forEach((r) => {
        ensureSpace(rowH + 10);

        x = startX;
        columns.forEach((c) => {
          const val = r[c.key] ?? "—";
          doc.text(String(val), x, y, { width: c.width });
          x += c.width;
        });

        doc
          .moveTo(startX, y + rowH - 4)
          .lineTo(startX + tableWidth, y + rowH - 4)
          .strokeColor("gray")
          .opacity(0.18)
          .stroke()
          .opacity(1);

        y += rowH;
        doc.y = y;
      });

      doc.moveDown();
    };

    // ---- header
    doc.fontSize(18).text("MotoCar Tracker — Report", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(14).text("Pojazd:");
    doc.fontSize(11).text(`Nazwa: ${vehicle.name}`);
    doc.text(`Tablice: ${vehicle.plate || "Brak"}`);
    doc.text(`Rok: ${vehicle.year || "—"}`);
    doc.text(`Przebieg (z Vehicle): ${vehicle.mileage || 0} km`);
    doc.moveDown();

    // ---- summary
    const totalFuelLiters = fuel.reduce((s, e) => s + (e.liters || 0), 0);
    const totalFuelCost = fuel.reduce((s, e) => {
      if (e.totalCost != null) return s + Number(e.totalCost);
      if (e.pricePerLiter != null)
        return s + Number(e.pricePerLiter) * Number(e.liters || 0);
      return s;
    }, 0);
    const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);

    doc.fontSize(14).text("Podsumowanie:");
    doc.fontSize(11).text(`Paliwo: ${totalFuelLiters.toFixed(2)} l`);
    doc.text(`Koszt paliwa: ${totalFuelCost.toFixed(2)} zł`);
    doc.text(`Wydatki: ${totalExpenses.toFixed(2)} zł`);
    doc.moveDown();

    // ---- tables
    const fuelRows = fuel.slice(0, 10).map((e) => {
      const cost =
        e.totalCost != null
          ? `${Number(e.totalCost).toFixed(2)} zł`
          : e.pricePerLiter != null
          ? `${(Number(e.pricePerLiter) * Number(e.liters || 0)).toFixed(2)} zł`
          : "—";

      return {
        date: plDate(e.date),
        odo: `${e.odometer} km`,
        liters: `${Number(e.liters).toFixed(2)} l`,
        cost,
        station: e.station || "—",
      };
    });

    drawTable({
      title: "Ostatnie tankowania (max 10)",
      columns: [
        { key: "date", label: "Data", width: 80 },
        { key: "odo", label: "Odometr", width: 90 },
        { key: "liters", label: "Litry", width: 70 },
        { key: "cost", label: "Koszt", width: 80 },
        { key: "station", label: "Stacja", width: 160 },
      ],
      rows: fuelRows,
    });

    const expenseRows = expenses.slice(0, 10).map((e) => ({
      date: plDate(e.date),
      cat: e.category,
      amount: `${Number(e.amount).toFixed(2)} zł`,
      desc: e.description || "—",
    }));

    drawTable({
      title: "Ostatnie wydatki (max 10)",
      columns: [
        { key: "date", label: "Data", width: 80 },
        { key: "cat", label: "Kategoria", width: 90 },
        { key: "amount", label: "Kwota", width: 80 },
        { key: "desc", label: "Opis", width: 230 },
      ],
      rows: expenseRows,
    });

    const mileageRows = mileage.slice(0, 10).map((e) => ({
      date: plDate(e.date),
      odo: `${e.odometer} km`,
      note: e.note || "—",
    }));

    drawTable({
      title: "Ostatnie wpisy przebiegu (max 10)",
      columns: [
        { key: "date", label: "Data", width: 80 },
        { key: "odo", label: "Odometr", width: 100 },
        { key: "note", label: "Notatka", width: 300 },
      ],
      rows: mileageRows,
    });

    doc.end();
  } catch (err) {
    console.error("PDF export error:", err);

    if (res.headersSent) {
      try {
        if (doc && !doc.ended) doc.end();
      } catch (_) {}
      return;
    }

    return res.status(500).json({ message: "Server error" });
  }
});

export default router;