/**
 * 任务路由 - 内存数据版本
 */

const express = require('express');
const router = express.Router();
const { getDatabase } = require('../models/database');

router.get('/', (req, res) => {
    try {
        const { status, assigneeId, enterpriseId } = req.query;
        const db = getDatabase();

        let tasks = [...db.tasks];

        if (status) tasks = tasks.filter(t => t.status === status);
        if (assigneeId) tasks = tasks.filter(t => t.assignee_id === parseInt(assigneeId));
        if (enterpriseId) tasks = tasks.filter(t => t.enterprise_id === parseInt(enterpriseId));

        const result = tasks.map(t => {
            const enterprise = db.enterprises.find(e => e.id === t.enterprise_id);
            const assignee = db.users.find(u => u.id === t.assignee_id);
            const creator = db.users.find(u => u.id === t.creator_id);
            return {
                id: t.id,
                title: t.title,
                content: t.content,
                enterpriseId: t.enterprise_id,
                enterpriseName: enterprise?.name || '',
                assigneeId: t.assignee_id,
                assigneeName: assignee?.name || '',
                creatorName: creator?.name || '',
                status: t.status,
                progress: t.progress,
                deadline: t.deadline,
                createDate: t.created_at?.split(' ')[0],
                hazardCount: db.hazards.filter(h => h.task_id === t.id).length
            };
        });

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取任务列表失败' });
    }
});

router.get('/counts', (req, res) => {
    try {
        const { assigneeId } = req.query;
        const db = getDatabase();

        let tasks = assigneeId ? db.tasks.filter(t => t.assignee_id === parseInt(assigneeId)) : db.tasks;

        res.json({
            success: true,
            data: {
                all: tasks.length,
                pending: tasks.filter(t => t.status === 'pending').length,
                processing: tasks.filter(t => t.status === 'processing').length,
                completed: tasks.filter(t => t.status === 'completed').length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取任务统计失败' });
    }
});

router.get('/:id', (req, res) => {
    try {
        const db = getDatabase();
        const task = db.tasks.find(t => t.id === parseInt(req.params.id));

        if (!task) {
            return res.status(404).json({ success: false, message: '任务不存在' });
        }

        const enterprise = db.enterprises.find(e => e.id === task.enterprise_id);
        const assignee = db.users.find(u => u.id === task.assignee_id);
        const creator = db.users.find(u => u.id === task.creator_id);
        const hazards = db.hazards.filter(h => h.task_id === task.id);

        res.json({
            success: true,
            data: {
                id: task.id,
                title: task.title,
                content: task.content,
                enterpriseId: task.enterprise_id,
                enterpriseName: enterprise?.name || '',
                assigneeId: task.assignee_id,
                assigneeName: assignee?.name || '',
                creatorName: creator?.name || '',
                status: task.status,
                progress: task.progress,
                deadline: task.deadline,
                createTime: task.created_at,
                hazards: hazards.map(h => ({
                    id: h.id,
                    description: h.description,
                    level: h.level,
                    status: h.status,
                    images: JSON.parse(h.images || '[]')
                }))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取任务详情失败' });
    }
});

router.post('/', (req, res) => {
    try {
        const { title, content, enterpriseId, assigneeId, creatorId, deadline } = req.body;
        const db = getDatabase();

        const newTask = {
            id: db.nextIds.tasks++,
            enterprise_id: enterpriseId,
            title,
            content,
            creator_id: creatorId || 1,
            assignee_id: assigneeId,
            status: 'pending',
            progress: 0,
            deadline,
            created_at: new Date().toISOString()
        };

        db.tasks.push(newTask);
        res.json({ success: true, data: { id: newTask.id }, message: '任务创建成功' });
    } catch (error) {
        res.status(500).json({ success: false, message: '创建任务失败' });
    }
});

router.put('/:id/status', (req, res) => {
    try {
        const { status, progress } = req.body;
        const db = getDatabase();
        const task = db.tasks.find(t => t.id === parseInt(req.params.id));

        if (task) {
            task.status = status;
            if (progress !== undefined) task.progress = progress;
            res.json({ success: true, message: '状态更新成功' });
        } else {
            res.status(404).json({ success: false, message: '任务不存在' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: '更新状态失败' });
    }
});

module.exports = router;
