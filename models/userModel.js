const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name:     { type: String, required: [true, 'Emri është i detyrueshëm'] },
    email:    { type: String, required: [true, 'Email-i është i detyrueshëm'], unique: true },
    password: { type: String, required: [true, 'Fjalëkalimi është i detyrueshëm'] },
    role:     { type: String, enum: ['freelancer', 'client'], default: 'freelancer' },
    bio:      { type: String, default: '' },
    skills:   { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
