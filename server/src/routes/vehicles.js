import express from 'express';
import { Vehicle } from '../models/Vehicle.js';

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

export default router;