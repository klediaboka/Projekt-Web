const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Titulli i projektit është i detyrueshëm'],
    },
    description: {
      type: String,
      required: [true, 'Përshkrimi është i detyrueshëm'],
    },
    budget: {
      type: Number,
      required: [true, 'Buxheti është i detyrueshëm'],
    },
    category: {
      type: String,
      enum: ['Web Development', 'Dizajn', 'Marketing', 'Përkthim', 'Fotografi', 'Tjetër'],
      default: 'Web Development',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
