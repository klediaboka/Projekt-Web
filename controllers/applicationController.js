const asyncHandler = require('express-async-handler');
const Application = require('../models/applicationModel');
const Project = require('../models/projectModel');

// POST /api/applications — freelanceri aplikon
const createApplication = asyncHandler(async (req, res) => {
  const { projectId, message, price } = req.body;

  if (!projectId || !message || !price) {
    res.status(400);
    throw new Error('Projekti, mesazhi dhe çmimi janë të detyrueshëm');
  }

  const exists = await Application.findOne({
    project: projectId,
    freelancer: req.user.id,
  });
  if (exists) {
    res.status(400);
    throw new Error('Keni aplikuar tashmë për këtë projekt');
  }

  const application = await Application.create({
    project: projectId,
    freelancer: req.user.id,
    message,
    price: Number(price),
  });

  await application.populate('freelancer', 'name email');
  await application.populate('project', 'title budget');

  res.status(201).json(application);
});

// GET /api/applications/my — aplikimet e freelancerit
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ freelancer: req.user.id })
    .populate('project', 'title budget category status')
    .sort({ createdAt: -1 });
  res.status(200).json(applications);
});

// GET /api/applications/project/:id — aplikimet për një projekt (klienti)
const getProjectApplications = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Projekti nuk u gjet'); }
  if (project.user.toString() !== req.user.id) {
    res.status(401); throw new Error('Nuk jeni të autorizuar');
  }

  const applications = await Application.find({ project: req.params.id })
    .populate('freelancer', 'name email role')
    .sort({ createdAt: -1 });

  res.status(200).json(applications);
});

// PUT /api/applications/:id — klienti pranon/refuzon
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('project');

  if (!application) { res.status(404); throw new Error('Aplikimi nuk u gjet'); }
  if (application.project.user.toString() !== req.user.id) {
    res.status(401); throw new Error('Nuk jeni të autorizuar');
  }

  application.status = req.body.status;
  await application.save();

  if (req.body.status === 'accepted') {
    await Project.findByIdAndUpdate(application.project._id, { status: 'in-progress' });
  }

  res.status(200).json(application);
});

module.exports = { createApplication, getMyApplications, getProjectApplications, updateApplicationStatus };
