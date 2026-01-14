/**
 * 企业路由 - 内存数据版本
 */

const express = require('express');
const router = express.Router();
const { getDatabase } = require('../models/database');

const industryMap = {
    'manufacturing': '制造业',
    'construction': '建筑业',
    'chemical': '化工业',
    'mining': '矿业',
    'logistics': '物流运输'
};

const regionMap = {
    'chaoyang': '朝阳区',
    'haidian': '海淀区',
    'dongcheng': '东城区',
    'xicheng': '西城区',
    'fengtai': '丰台区'
};

router.get('/', (req, res) => {
    try {
        const { keyword, industry, region } = req.query;
        const db = getDatabase();

        let enterprises = [...db.enterprises];

        if (keyword) {
            const kw = keyword.toLowerCase();
            enterprises = enterprises.filter(e =>
                e.name.toLowerCase().includes(kw) ||
                e.credit_code.toLowerCase().includes(kw)
            );
        }

        if (industry) {
            enterprises = enterprises.filter(e => e.industry === industry);
        }

        if (region) {
            enterprises = enterprises.filter(e => e.region === region);
        }

        const result = enterprises.map(e => ({
            id: e.id,
            name: e.name,
            creditCode: e.credit_code,
            industry: e.industry,
            industryName: industryMap[e.industry] || e.industry,
            region: e.region,
            regionName: regionMap[e.region] || e.region,
            address: e.address,
            contact: e.contact,
            contactPhone: e.contact_phone,
            hazardCount: db.hazards.filter(h => h.enterprise_id === e.id && h.status !== 'completed').length,
            taskCount: db.tasks.filter(t => t.enterprise_id === e.id && t.status !== 'completed').length,
            lastCheckDate: ''
        }));

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('获取企业列表错误:', error);
        res.status(500).json({ success: false, message: '获取企业列表失败' });
    }
});

router.get('/:id', (req, res) => {
    try {
        const db = getDatabase();
        const enterprise = db.enterprises.find(e => e.id === parseInt(req.params.id));

        if (!enterprise) {
            return res.status(404).json({ success: false, message: '企业不存在' });
        }

        res.json({
            success: true,
            data: {
                id: enterprise.id,
                name: enterprise.name,
                creditCode: enterprise.credit_code,
                industry: enterprise.industry,
                industryName: industryMap[enterprise.industry] || enterprise.industry,
                region: enterprise.region,
                address: enterprise.address,
                contact: enterprise.contact,
                contactPhone: enterprise.contact_phone
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取企业详情失败' });
    }
});

module.exports = router;
