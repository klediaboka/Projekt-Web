const express = require('express');
const router = express.Router();
const { createApplication, getMyApplications, getProjectApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',                    protect, createApplication);
router.get('/my',                   protect, getMyApplications);
router.get('/project/:id',          protect, getProjectApplications);
router.put('/:id',                  protect, updateApplicationStatus);

module.exports = router;
