import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    plate: {
      type: String,
      default: '',
    },
    year: {
      type: Number,
      default: null,
    },
    mileage: {
      type: Number,
      default: 0,
    },
    lastServiceMileage: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

vehicleSchema.virtual('history', {
  ref: 'MileageEntry',
  localField: '_id',
  foreignField: 'vehicleId'
});

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);