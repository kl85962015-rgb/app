/**
 * 认证路由 - 内存数据版本
 */

const express = require('express');
const router = express.Router();
const { getDatabase } = require('../models/database');
const { v4: uuidv4 } = require('uuid');

router.post('/login', async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ success: false, message: '缺少登录凭证' });
        }

        const db = getDatabase();

        // 返回测试用户
        const user = db.users[0];
        const token = uuidv4();

        res.json({
            success: true,
            data: {
                token,
                userInfo: {
                    id: user.id,
                    name: user.name,
                    phone: user.phone,
                    department: user.department,
                    role: user.role,
                    avatarUrl: user.avatar_url
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: '登录失败' });
    }
});

module.exports = router;
