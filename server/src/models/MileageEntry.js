import mongoose from 'mongoose';

const mileageEntrySchema = new mongoose.Schema(
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
    note: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const MileageEntry = mongoose.model('MileageEntry', mileageEntrySchema);