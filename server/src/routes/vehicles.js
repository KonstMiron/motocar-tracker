import express from 'express';
import { Vehicle } from '../models/Vehicle.js';
import { MileageEntry } from '../models/MileageEntry.js';
import { FuelEntry } from '../models/FuelEntry.js';
import { ExpenseEntry } from '../models/ExpenseEntry.js';

const router = express.Router();

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
      mileage: mileage || 0,
      lastServiceMileage: mileage || 0
    });

    return res.status(201).json(vehicle);
  } catch (err) {
    console.error('Create vehicle error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/mileage', async (req, res) => {
  try {
    const { id } = req.params;
    const entries = await MileageEntry.find({ vehicleId: id }).sort({ date: -1 });
    return res.json(entries);
  } catch (err) {
    console.error('Get mileage error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/mileage', async (req, res) => {
  try {
    const { id } = req.params;
    const { odometer, date, note } = req.body || {};
    if (odometer == null) return res.status(400).json({ message: 'Wymagane pole: odometer' });

    const entry = await MileageEntry.create({
      vehicleId: id,
      odometer,
      date: date ? new Date(date) : new Date(),
      note,
    });

    await Vehicle.findByIdAndUpdate(id, { $max: { mileage: odometer } });
    return res.status(201).json(entry);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/confirm-service', async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    vehicle.lastServiceMileage = vehicle.mileage;
    await vehicle.save();
    return res.json({ message: 'Service confirmed', lastServiceMileage: vehicle.lastServiceMileage });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/reminder', async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const reminders = [];
    const interval = 10000;
    const distanceSinceService = vehicle.mileage - (vehicle.lastServiceMileage || 0);

    if (distanceSinceService >= interval) {
      reminders.push({
        type: 'service',
        message: `Zalecany przegląd techniczny (minęło ${distanceSinceService} km)`,
        overdueBy: distanceSinceService
      });
    }
    return res.json({ reminders });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/fuel', async (req, res) => {
  try {
    const entries = await FuelEntry.find({ vehicleId: req.params.id }).sort({ date: -1 });
    return res.json(entries);
  } catch (err) { return res.status(500).json({ message: 'Server error' }); }
});

router.post('/:id/fuel', async (req, res) => {
  try {
    const { id } = req.params;
    const { odometer, liters, pricePerLiter, totalCost, station, fullTank, date } = req.body || {};
    if (odometer == null || liters == null) return res.status(400).json({ message: 'Wymagane: odometer i liters' });
    const entry = await FuelEntry.create({
      vehicleId: id, odometer, liters, pricePerLiter, totalCost, station, fullTank,
      date: date ? new Date(date) : new Date(),
    });
    return res.status(201).json(entry);
  } catch (err) { return res.status(500).json({ message: 'Server error' }); }
});

router.get('/:id/expenses', async (req, res) => {
  try {
    const entries = await ExpenseEntry.find({ vehicleId: req.params.id }).sort({ date: -1 });
    return res.json(entries);
  } catch (err) { return res.status(500).json({ message: 'Server error' }); }
});

router.post('/:id/expenses', async (req, res) => {
  try {
    const { amount, date, category, description, place } = req.body || {};
    if (amount == null) return res.status(400).json({ message: 'Wymagane: amount' });
    const entry = await ExpenseEntry.create({
      vehicleId: req.params.id, amount, category: category || 'inne', description, place,
      date: date ? new Date(date) : new Date(),
    });
    return res.status(201).json(entry);
  } catch (err) { return res.status(500).json({ message: 'Server error' }); }
});

router.get('/:id/summary', async (req, res) => {
  try {
    const { id } = req.params;
    const lastMileage = await MileageEntry.findOne({ vehicleId: id }).sort({ odometer: -1 });
    const totalMileage = lastMileage ? lastMileage.odometer : 0;
    const fuelEntries = await FuelEntry.find({ vehicleId: id });
    const totalFuelLiters = fuelEntries.reduce((s, e) => s + e.liters, 0);
    const totalFuelCost = fuelEntries.reduce((s, e) => s + (e.totalCost || (e.pricePerLiter * e.liters) || 0), 0);
    const expenses = await ExpenseEntry.find({ vehicleId: id });
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

    return res.json({
      totalMileage, totalFuelLiters, totalFuelCost, totalExpenses,
      consumption: Number((totalMileage > 0 ? (totalFuelLiters / totalMileage) * 100 : 0).toFixed(2)),
      costPerKm: Number((totalMileage > 0 ? (totalExpenses + totalFuelCost) / totalMileage : 0).toFixed(2)),
    });
  } catch (err) { return res.status(500).json({ message: 'Server error' }); }
});

router.get('/item/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    return res.json(vehicle);
  } catch (err) { return res.status(500).json({ message: 'Server error' }); }
});

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const list = await Vehicle.find({ userId }).sort({ createdAt: -1 });
    return res.json(list);
  } catch (err) { return res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(vehicle);
  } catch (err) { return res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Vehicle deleted' });
  } catch (err) { return res.status(500).json({ message: 'Server error' }); }
});

export default router;