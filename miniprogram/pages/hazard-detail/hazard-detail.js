// pages/hazard-detail/hazard-detail.js
// 隐患详情逻辑修复版

Page({
    data: {
        hazardId: '',
        hazard: null,
        statusText: '',
        statusMap: {
            'pending': '待整改',
            'rectified': '待验收',
            'completed': '已闭环'
        }
    },

    onLoad(options) {
        if (options.id) {
            this.setData({ hazardId: options.id });
        }
    },

    onShow() {
        this.loadHazard();
    },

    loadHazard() {
        const allHazards = wx.getStorageSync('allHazards') || [];
        // 注意 ID 类型转换
        let hazard = allHazards.find(h => h.id == this.data.hazardId);

        if (hazard) {
            // 字段兼容
            if (!hazard.photos && hazard.images) hazard.photos = hazard.images;
            if (!hazard.rectifyPhotos && hazard.rectifyImages) hazard.rectifyPhotos = hazard.rectifyImages;

            // 格式化时间
            let timeStr = hazard.createTime || '';
            if (timeStr.includes('T')) {
                const date = new Date(timeStr);
                timeStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            }
            hazard.createTimeFormatted = timeStr;

            this.setData({
                hazard,
                statusText: this.data.statusMap[hazard.status] || '未知状态'
            });
        } else {
            wx.showToast({ title: '隐患不存在', icon: 'none' });
        }
    },

    // 预览隐患照片
    previewImage(e) {
        const current = e.currentTarget.dataset.current;
        const urls = this.data.hazard.photos || [];
        wx.previewImage({
            current,
            urls
        });
    },

    // 预览整改照片
    previewRectifyImage(e) {
        const current = e.currentTarget.dataset.current;
        const urls = this.data.hazard.rectifyPhotos || [];
        wx.previewImage({
            current,
            urls
        });
    },

    // 上传整改照片
    chooseRectifyImage() {
        wx.chooseMedia({
            count: 4,
            mediaType: ['image'],
            sourceType: ['camera', 'album'],
            success: (res) => {
                const newPhotos = res.tempFiles.map(f => f.tempFilePath);
                this.updateRectifyInfo(newPhotos);
            }
        });
    },

    // 更新整改信息
    updateRectifyInfo(photos) {
        let allHazards = wx.getStorageSync('allHazards') || [];
        const index = allHazards.findIndex(h => h.id == this.data.hazardId);

        if (index > -1) {
            // 更新字段：状态改为待验收，记录照片和时间
            allHazards[index].rectifyPhotos = photos;
            allHazards[index].status = 'rectified';
            allHazards[index].rectifyTime = new Date().toISOString();

            wx.setStorageSync('allHazards', allHazards);
            this.loadHazard();
            wx.showToast({ title: '已提交整改', icon: 'success' });
        }
    },

    // 验收通过
    approveRectify() {
        wx.showModal({
            title: '确认验收',
            content: '确认该隐患已整改合格并闭环吗？',
            success: (res) => {
                if (res.confirm) {
                    this.updateStatus('completed');
                }
            }
        });
    },

    // 退回整改
    rejectRectify() {
        wx.showModal({
            title: '退回整改',
            content: '确认整改不合格，需退回重新整改吗？',
            success: (res) => {
                if (res.confirm) {
                    this.updateStatus('pending', true); // true 表示清空整改记录
                }
            }
        });
    },

    updateStatus(newStatus, clearRectify = false) {
        let allHazards = wx.getStorageSync('allHazards') || [];
        const index = allHazards.findIndex(h => h.id == this.data.hazardId);

        if (index > -1) {
            allHazards[index].status = newStatus;

            if (newStatus === 'completed') {
                allHazards[index].completedTime = new Date().toISOString();
            }

            if (clearRectify) {
                allHazards[index].rectifyPhotos = [];
                allHazards[index].rectifyTime = null;
            }

            wx.setStorageSync('allHazards', allHazards);
            this.loadHazard();
            wx.showToast({ title: '操作成功', icon: 'success' });
        }
    }
});
