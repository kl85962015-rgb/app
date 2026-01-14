/**
 * 用户路由 - 内存数据版本
 */

const express = require('express');
const router = express.Router();
const { getDatabase } = require('../models/database');

router.get('/', (req, res) => {
    try {
        const db = getDatabase();
        const users = db.users.map(u => ({
            id: u.id,
            name: u.name,
            department: u.department,
            role: u.role
        }));
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取用户列表失败' });
    }
});

router.get('/:id', (req, res) => {
    try {
        const db = getDatabase();
        const user = db.users.find(u => u.id === parseInt(req.params.id));

        if (!user) {
            return res.status(404).json({ success: false, message: '用户不存在' });
        }

        res.json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                department: user.department,
                role: user.role,
                avatarUrl: user.avatar_url
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取用户详情失败' });
    }
});

module.exports = router;
