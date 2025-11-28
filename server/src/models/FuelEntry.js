import mongoose from 'mongoose';

const fuelEntrySchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    odometer: {
      type: Number,
      required: true,
    },
    liters: {
      type: Number,
      required: true,
    },
    pricePerLiter: {
      type: Number,
      default: null,
    },
    totalCost: {
      type: Number,
      default: null,
    },
    station: {
      type: String,
      default: '',
    },
    fullTank: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const FuelEntry = mongoose.model('FuelEntry', fuelEntrySchema);