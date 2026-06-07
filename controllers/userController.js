const asyncHandler = require('express-async-handler');
const bcrypt       = require('bcryptjs');
const jwt          = require('jsonwebtoken');
const User         = require('../models/userModel');
const Project      = require('../models/projectModel');
const Application  = require('../models/applicationModel');

const generateJWT = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5d' });

// POST /api/users — Regjistrim
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    res.status(400); throw new Error('Ju lutem plotësoni të gjitha fushat');
  }
  if (await User.findOne({ email })) {
    res.status(400); throw new Error('Ky email është regjistruar tashmë');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashedPassword, role });
  if (user) {
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, bio: user.bio, skills: user.skills,
      token: generateJWT(user._id),
    });
  } else {
    res.status(400); throw new Error('Të dhëna të pavlefshme');
  }
});

// POST /api/users/login — Hyrje
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, bio: user.bio, skills: user.skills,
      token: generateJWT(user._id),
    });
  } else {
    res.status(400); throw new Error('Email ose fjalëkalim i gabuar');
  }
});

// GET /api/users/current — Merr userin e loguar
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.status(200).json(user);
});

// PUT /api/users/profile — Përditëso profilin
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) { res.status(404); throw new Error('Useri nuk u gjet'); }

  user.name   = req.body.name   || user.name;
  user.bio    = req.body.bio    !== undefined ? req.body.bio    : user.bio;
  user.skills = req.body.skills !== undefined ? req.body.skills : user.skills;

  if (req.body.password) {
    if (req.body.password.length < 6) {
      res.status(400); throw new Error('Fjalëkalimi duhet të ketë të paktën 6 karaktere');
    }
    const salt    = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  const updated = await user.save();
  res.status(200).json({
    _id: updated._id, name: updated.name, email: updated.email,
    role: updated.role, bio: updated.bio, skills: updated.skills,
    token: generateJWT(updated._id),
  });
});

// DELETE /api/users/delete — Fshi llogarinë
const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) { res.status(404); throw new Error('Useri nuk u gjet'); }

  // Fshi gjithë projektet dhe aplikimet e këtij useri
  await Project.deleteMany({ user: req.user.id });
  await Application.deleteMany({ freelancer: req.user.id });
  await User.findByIdAndDelete(req.user.id);

  res.status(200).json({ message: 'Llogaria u fshi me sukses' });
});

module.exports = { registerUser, loginUser, getCurrentUser, updateProfile, deleteAccount };
