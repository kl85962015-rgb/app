/**
 * 隐患排查小程序 - 后端服务入口
 * 技术栈：Express + SQLite
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 确保数据目录存在
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 确保上传目录存在
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// 初始化数据库
const { initDatabase } = require('./models/database');
initDatabase();

// 导入路由
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const enterpriseRoutes = require('./routes/enterprises');
const hazardRoutes = require('./routes/hazards');
const regulationRoutes = require('./routes/regulations');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务（上传的图片）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enterprises', enterpriseRoutes);
app.use('/api/hazards', hazardRoutes);
app.use('/api/regulations', regulationRoutes);
app.use('/api/tasks', taskRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '隐患排查小程序后端服务运行正常',
        timestamp: new Date().toISOString()
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '接口不存在'
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   隐患排查小程序 - 后端服务已启动          ║
║   地址: http://localhost:${PORT}             ║
║   API:  http://localhost:${PORT}/api         ║
╚════════════════════════════════════════════╝
  `);
});

module.exports = app;
