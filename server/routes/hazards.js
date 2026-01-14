/**
 * 隐患路由 - 内存数据版本
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getDatabase } = require('../models/database');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
    filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', (req, res) => {
    try {
        const { status, level, enterpriseId, reporterId } = req.query;
        const db = getDatabase();

        let hazards = [...db.hazards];

        if (status) hazards = hazards.filter(h => h.status === status);
        if (level) hazards = hazards.filter(h => h.level === level);
        if (enterpriseId) hazards = hazards.filter(h => h.enterprise_id === parseInt(enterpriseId));
        if (reporterId) hazards = hazards.filter(h => h.reporter_id === parseInt(reporterId));

        const result = hazards.map(h => {
            const reporter = db.users.find(u => u.id === h.reporter_id);
            const enterprise = db.enterprises.find(e => e.id === h.enterprise_id);
            return {
                id: h.id,
                description: h.description,
                level: h.level,
                status: h.status,
                images: JSON.parse(h.images || '[]'),
                location: h.location,
                locationDetail: h.location_detail,
                reporterName: reporter?.name || '',
                enterpriseName: enterprise?.name || '',
                createTime: h.created_at,
                deadline: h.deadline
            };
        });

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取隐患列表失败' });
    }
});

router.get('/stats/overview', (req, res) => {
    try {
        const db = getDatabase();
        const hazardCount = db.hazards.length;
        const completedCount = db.hazards.filter(h => h.status === 'completed').length;
        const rectificationRate = hazardCount > 0 ? Math.round((completedCount / hazardCount) * 100) : 100;
        const taskCount = db.tasks.length;

        res.json({ success: true, data: { hazardCount, rectificationRate, taskCount } });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取统计数据失败' });
    }
});

router.post('/upload', upload.array('images', 9), (req, res) => {
    try {
        const urls = req.files.map(f => `/uploads/${f.filename}`);
        res.json({ success: true, data: urls });
    } catch (error) {
        res.status(500).json({ success: false, message: '上传图片失败' });
    }
});

router.post('/', (req, res) => {
    try {
        const { description, level, images, location, locationDetail, enterpriseId, reporterId, responsiblePersonId, deadline, regulationIds } = req.body;
        const db = getDatabase();

        const newHazard = {
            id: db.nextIds.hazards++,
            enterprise_id: enterpriseId,
            reporter_id: reporterId || 1,
            task_id: null,
            description,
            level: level || 'general',
            status: 'pending',
            images: JSON.stringify(images || []),
            location,
            location_detail: locationDetail,
            latitude: null,
            longitude: null,
            responsible_person_id: responsiblePersonId,
            deadline,
            created_at: new Date().toISOString()
        };

        db.hazards.push(newHazard);
        res.json({ success: true, data: { id: newHazard.id }, message: '隐患上报成功' });
    } catch (error) {
        res.status(500).json({ success: false, message: '隐患上报失败' });
    }
});

router.put('/:id/status', (req, res) => {
    try {
        const { status } = req.body;
        const db = getDatabase();
        const hazard = db.hazards.find(h => h.id === parseInt(req.params.id));

        if (hazard) {
            hazard.status = status;
            res.json({ success: true, message: '状态更新成功' });
        } else {
            res.status(404).json({ success: false, message: '隐患不存在' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: '更新状态失败' });
    }
});

module.exports = router;
