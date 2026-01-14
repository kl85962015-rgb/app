/**
 * 依据库路由 - 内存数据版本
 */

const express = require('express');
const router = express.Router();
const { getDatabase } = require('../models/database');

const categoryMap = {
    'safety_law': '安全生产法',
    'fire_safety': '消防安全',
    'electrical': '电气安全',
    'machinery': '机械安全',
    'chemical': '化学品安全',
    'occupational': '职业健康'
};

router.get('/', (req, res) => {
    try {
        const { keyword, category, favorite, userId } = req.query;
        const db = getDatabase();

        let regulations = [...db.regulations];

        if (keyword) {
            const kw = keyword.toLowerCase();
            regulations = regulations.filter(r =>
                r.title.toLowerCase().includes(kw) ||
                r.content.toLowerCase().includes(kw)
            );
        }

        if (category) {
            regulations = regulations.filter(r => r.category === category);
        }

        const favoriteIds = userId ?
            db.user_regulation_favorites.filter(f => f.user_id === parseInt(userId)).map(f => f.regulation_id) : [];

        if (favorite === 'true' && userId) {
            regulations = regulations.filter(r => favoriteIds.includes(r.id));
        }

        const result = regulations.map(r => ({
            id: r.id,
            category: r.category,
            categoryName: categoryMap[r.category] || r.category,
            title: r.title,
            content: r.content,
            source: r.source,
            isFavorite: favoriteIds.includes(r.id)
        }));

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取依据列表失败' });
    }
});

router.get('/categories', (req, res) => {
    const categories = Object.entries(categoryMap).map(([id, name]) => ({ id, name }));
    res.json({ success: true, data: categories });
});

router.post('/:id/favorite', (req, res) => {
    try {
        const { userId } = req.body;
        const regulationId = parseInt(req.params.id);
        const db = getDatabase();

        const existingIndex = db.user_regulation_favorites.findIndex(
            f => f.user_id === userId && f.regulation_id === regulationId
        );

        if (existingIndex > -1) {
            db.user_regulation_favorites.splice(existingIndex, 1);
            res.json({ success: true, data: { isFavorite: false }, message: '已取消收藏' });
        } else {
            db.user_regulation_favorites.push({ user_id: userId, regulation_id: regulationId });
            res.json({ success: true, data: { isFavorite: true }, message: '已收藏' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: '操作失败' });
    }
});

module.exports = router;
