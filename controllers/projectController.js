const asyncHandler = require('express-async-handler');
const Project = require('../models/projectModel');
const User    = require('../models/userModel');

// GET /api/projects — publike, të gjitha projektet e hapura
const getProjects = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  let filter = { status: 'open' };
  if (category && category !== 'Të gjitha') filter.category = category;
  if (search) filter.title = { $regex: search, $options: 'i' };
  const projects = await Project.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.status(200).json(projects);
});

// GET /api/projects/my — projektet e klientit (requires login)
const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user.id })
    .sort({ createdAt: -1 });
  res.status(200).json(projects);
});

// GET /api/projects/:id — publike
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('user', 'name email');
  if (!project) { res.status(404); throw new Error('Projekti nuk u gjet'); }
  res.status(200).json(project);
});

// POST /api/projects
const createProject = asyncHandler(async (req, res) => {
  const { title, description, budget, category } = req.body;
  if (!title || !description || !budget) {
    res.status(400); throw new Error('Titulli, përshkrimi dhe buxheti janë të detyrueshëm');
  }
  const project = await Project.create({
    user: req.user.id, title, description,
    budget: Number(budget), category: category || 'Web Development',
  });
  res.status(201).json(project);
});

// PUT /api/projects/:id
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Projekti nuk u gjet'); }
  if (project.user.toString() !== req.user.id) {
    res.status(401); throw new Error('Nuk jeni të autorizuar');
  }
  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updated);
});

// DELETE /api/projects/:id
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Projekti nuk u gjet'); }
  if (project.user.toString() !== req.user.id) {
    res.status(401); throw new Error('Nuk jeni të autorizuar');
  }
  await Project.findByIdAndDelete(req.params.id);
  res.status(200).json({ id: req.params.id });
});

module.exports = { getProjects, getMyProjects, getProjectById, createProject, updateProject, deleteProject };
