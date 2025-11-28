import mongoose from 'mongoose';

const expenseEntrySchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['serwis', 'opony', 'ubezpieczenie', 'paliwo', 'inne'],
      default: 'inne',
    },
    description: {
      type: String,
      default: '',
    },
    place: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const ExpenseEntry = mongoose.model('ExpenseEntry', expenseEntrySchema);