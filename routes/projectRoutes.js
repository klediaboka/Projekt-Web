const express = require('express');
const router = express.Router();
const { getProjects, getMyProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',        getProjects);        // ← PUBLIC, nuk kërkon login
router.get('/my',      protect, getMyProjects);
router.get('/:id',     getProjectById);     // ← PUBLIC
router.post('/',       protect, createProject);
router.put('/:id',     protect, updateProject);
router.delete('/:id',  protect, deleteProject);

module.exports = router;
