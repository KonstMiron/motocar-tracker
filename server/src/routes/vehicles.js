import express from 'express';
import { Vehicle } from '../models/Vehicle.js';
import { MileageEntry } from '../models/MileageEntry.js';
import { FuelEntry } from '../models/FuelEntry.js';
import { ExpenseEntry } from '../models/ExpenseEntry.js';

const router = express.Router();

/**
 * GET /api/vehicles/:userId
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const list = await Vehicle.find({ userId }).sort({ createdAt: -1 });

    return res.json(list);
  } catch (err) {
    console.error('Get vehicles error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/vehicles
 */
router.post('/', async (req, res) => {
  try {
    const { userId, name, plate, year, mileage } = req.body || {};

    if (!userId || !name) {
      return res.status(400).json({ message: 'Wymagane: userId i name' });
    }

    const vehicle = await Vehicle.create({
      userId,
      name,
      plate,
      year,
      mileage,
    });

    return res.status(201).json(vehicle);
  } catch (err) {
    console.error('Create vehicle error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET one vehicle
router.get('/item/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.json(vehicle);
  } catch (err) {
    console.error('Get vehicle error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE vehicle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.json(vehicle);
  } catch (err) {
    console.error('Update vehicle error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE vehicle
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    console.error('Delete vehicle error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/vehicles/:id/mileage - список записів пробігу для мотоцикла
router.get('/:id/mileage', async (req, res) => {
  try {
    const { id } = req.params;

    const entries = await MileageEntry.find({ vehicleId: id })
      .sort({ date: -1 });

    return res.json(entries);
  } catch (err) {
    console.error('Get mileage error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/vehicles/:id/mileage - додати запис пробігу
router.post('/:id/mileage', async (req, res) => {
  try {
    const { id } = req.params;
    const { odometer, date, note } = req.body || {};

    if (odometer == null) {
      return res.status(400).json({ message: 'Wymagane pole: odometer' });
    }

    const entry = await MileageEntry.create({
      vehicleId: id,
      odometer,
      date: date ? new Date(date) : new Date(),
      note,
    });

    await Vehicle.findByIdAndUpdate(id, {
      $max: { mileage: odometer },
    });

    return res.status(201).json(entry);
  } catch (err) {
    console.error('Create mileage error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/vehicles/:id/fuel - lista tankowań dla pojazdu
router.get('/:id/fuel', async (req, res) => {
  try {
    const { id } = req.params;

    const entries = await FuelEntry.find({ vehicleId: id })
      .sort({ date: -1 });

    return res.json(entries);
  } catch (err) {
      console.error('Get fuel error:', err);
      return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/vehicles/:id/fuel - dodać tankowanie
router.post('/:id/fuel', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      odometer,
      date,
      liters,
      pricePerLiter,
      totalCost,
      station,
      fullTank,
    } = req.body || {};

    if (odometer == null || liters == null) {
      return res.status(400).json({ message: 'Wymagane: odometer i liters' });
    }

    const entry = await FuelEntry.create({
      vehicleId: id,
      odometer,
      liters,
      pricePerLiter: pricePerLiter ?? null,
      totalCost: totalCost ?? null,
      date: date ? new Date(date) : new Date(),
      station,
      fullTank: fullTank ?? true,
    });

    return res.status(201).json(entry);
  } catch (err) {
    console.error('Create fuel error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/vehicles/:id/expenses - lista wydatków dla pojazdu
router.get('/:id/expenses', async (req, res) => {
  try {
    const { id } = req.params;

    const entries = await ExpenseEntry.find({ vehicleId: id })
      .sort({ date: -1 });

    return res.json(entries);
  } catch (err) {
    console.error('Get expenses error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/vehicles/:id/expenses - dodać wydatek
router.post('/:id/expenses', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, date, category, description, place } = req.body || {};

    if (amount == null) {
      return res.status(400).json({ message: 'Wymagane: amount' });
    }

    const entry = await ExpenseEntry.create({
      vehicleId: id,
      amount,
      date: date ? new Date(date) : new Date(),
      category: category || 'inne',
      description,
      place,
    });

    return res.status(201).json(entry);
  } catch (err) {
    console.error('Create expense error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/vehicles/:id/summary - podsumowanie pojazdu
router.get('/:id/summary', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Prób
    const lastMileage = await MileageEntry.findOne({ vehicleId: id })
      .sort({ odometer: -1 });

    const totalMileage = lastMileage ? lastMileage.odometer : 0;

    // 2. Tankowanie
    const fuelEntries = await FuelEntry.find({ vehicleId: id });
    const totalFuelLiters = fuelEntries.reduce((s, e) => s + e.liters, 0);
    const totalFuelCost = fuelEntries.reduce((s, e) => {
      if (e.totalCost) return s + e.totalCost;
      if (e.pricePerLiter) return s + e.pricePerLiter * e.liters;
      return s;
    }, 0);

    // 3. Wydatki
    const expenses = await ExpenseEntry.find({ vehicleId: id });
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

    const consumption =
      totalMileage > 0 ? (totalFuelLiters / totalMileage) * 100 : 0;

    const costPerKm =
      totalMileage > 0 ? (totalExpenses + totalFuelCost) / totalMileage : 0;

    return res.json({
      totalMileage,
      totalFuelLiters,
      totalFuelCost,
      totalExpenses,
      consumption: Number(consumption.toFixed(2)),
      costPerKm: Number(costPerKm.toFixed(2)),
    });
  } catch (err) {
    console.error('Summary error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;