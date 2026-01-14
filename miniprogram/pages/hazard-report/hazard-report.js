// pages/hazard-report/hazard-report.js
// 隐患上报页面 - 支持连续上报多个隐患

const app = getApp();

Page({
    data: {
        // 当前编辑的隐患
        images: [],
        description: '',
        level: 'general',
        selectedRegulation: null,
        location: '',
        locationDetail: '',
        latitude: null,
        longitude: null,
        responsiblePerson: null,
        responsiblePersonList: [],
        deadline: '',
        today: '',
        submitting: false,

        // 本次排查的所有隐患列表
        hazardList: [],

        // 关联信息
        taskId: null,
        enterpriseId: null,
        enterpriseName: ''
    },

    onLoad(options) {
        const today = this.formatDate(new Date());
        this.setData({ today });

        // 获取任务或企业关联信息
        if (options.taskId) {
            this.setData({ taskId: options.taskId });
        }
        if (options.enterpriseId) {
            this.setData({
                enterpriseId: options.enterpriseId,
                enterpriseName: options.enterpriseName || ''
            });
        }

        this.loadResponsiblePersonList();
        this.getLocation();
    },

    onShow() {
        // 检查是否有选择的法规
        const selectedRegulation = wx.getStorageSync('selectedRegulation');
        if (selectedRegulation) {
            this.setData({ selectedRegulation });
            wx.removeStorageSync('selectedRegulation');
        }
    },

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    // 加载责任人列表
    async loadResponsiblePersonList() {
        this.setData({
            responsiblePersonList: [
                { id: 1, name: '张安全 - 安全管理员' },
                { id: 2, name: '李检查 - 安全检查员' },
                { id: 3, name: '王电工 - 设备管理员' }
            ]
        });
    },

    // 选择图片
    chooseImage() {
        const remaining = 9 - this.data.images.length;
        wx.chooseMedia({
            count: remaining,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            camera: 'back',
            success: (res) => {
                const newImages = res.tempFiles.map(file => file.tempFilePath);
                this.setData({
                    images: [...this.data.images, ...newImages]
                });
            }
        });
    },

    // 预览图片
    previewImage(e) {
        const { index } = e.currentTarget.dataset;
        wx.previewImage({
            current: this.data.images[index],
            urls: this.data.images
        });
    },

    // 删除图片
    deleteImage(e) {
        const { index } = e.currentTarget.dataset;
        const images = [...this.data.images];
        images.splice(index, 1);
        this.setData({ images });
    },

    // 输入描述
    onDescriptionInput(e) {
        this.setData({ description: e.detail.value });
    },

    // 选择隐患级别
    selectLevel(e) {
        this.setData({ level: e.currentTarget.dataset.level });
    },

    // 选择法规依据
    goToSelectRegulation() {
        wx.navigateTo({
            url: '/pages/regulation/regulation?mode=select'
        });
    },

    // 获取位置
    getLocation() {
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    location: '位置获取成功'
                });

                // 逆地理编码（简化处理）
                this.setData({
                    location: `${res.latitude.toFixed(4)}, ${res.longitude.toFixed(4)}`
                });
            },
            fail: () => {
                wx.showToast({ title: '获取位置失败', icon: 'none' });
            }
        });
    },

    // 输入详细位置
    onLocationDetailInput(e) {
        this.setData({ locationDetail: e.detail.value });
    },

    // 选择责任人
    onResponsiblePersonChange(e) {
        const index = e.detail.value;
        this.setData({ responsiblePerson: this.data.responsiblePersonList[index] });
    },

    // 选择截止日期
    onDeadlineChange(e) {
        this.setData({ deadline: e.detail.value });
    },

    // 验证当前隐患
    validateCurrentHazard() {
        const { images, description, locationDetail } = this.data;

        if (images.length === 0) {
            wx.showToast({ title: '请上传隐患照片', icon: 'none' });
            return false;
        }
        if (!description.trim()) {
            wx.showToast({ title: '请输入隐患描述', icon: 'none' });
            return false;
        }
        if (!locationDetail.trim()) {
            wx.showToast({ title: '请输入详细位置', icon: 'none' });
            return false;
        }
        return true;
    },

    // 添加当前隐患到列表并继续下一个
    addAndContinue() {
        if (!this.validateCurrentHazard()) return;

        // 保存当前隐患到列表
        const currentHazard = {
            id: Date.now(),
            images: [...this.data.images],
            description: this.data.description,
            level: this.data.level,
            regulation: this.data.selectedRegulation,
            location: this.data.location,
            locationDetail: this.data.locationDetail,
            latitude: this.data.latitude,
            longitude: this.data.longitude,
            responsiblePerson: this.data.responsiblePerson,
            deadline: this.data.deadline
        };

        const hazardList = [...this.data.hazardList, currentHazard];

        // 重置表单，准备下一个隐患
        this.setData({
            hazardList,
            images: [],
            description: '',
            level: 'general',
            selectedRegulation: null,
            responsiblePerson: null,
            deadline: ''
            // 保留位置信息
        });

        wx.showToast({
            title: `已添加第 ${hazardList.length} 个隐患`,
            icon: 'success'
        });
    },

    // 提交所有隐患
    async submitReport() {
        // 如果当前有未保存的隐患内容，先保存
        if (this.data.images.length > 0 || this.data.description.trim()) {
            if (!this.validateCurrentHazard()) return;

            const currentHazard = {
                id: Date.now(),
                images: [...this.data.images],
                description: this.data.description,
                level: this.data.level,
                regulation: this.data.selectedRegulation,
                location: this.data.location,
                locationDetail: this.data.locationDetail,
                latitude: this.data.latitude,
                longitude: this.data.longitude,
                responsiblePerson: this.data.responsiblePerson,
                deadline: this.data.deadline
            };

            this.data.hazardList.push(currentHazard);
        }

        if (this.data.hazardList.length === 0) {
            wx.showToast({ title: '请至少添加一个隐患', icon: 'none' });
            return;
        }

        this.setData({ submitting: true });

        try {
            // 保存到本地存储（模拟提交）
            const reportId = Date.now();
            const report = {
                id: reportId,
                taskId: this.data.taskId,
                enterpriseId: this.data.enterpriseId,
                enterpriseName: this.data.enterpriseName,
                hazards: this.data.hazardList,
                createTime: new Date().toISOString(),
                status: 'submitted'
            };

            // 获取已有报告列表
            let reports = wx.getStorageSync('hazardReports') || [];
            reports.unshift(report);
            wx.setStorageSync('hazardReports', reports);

            // 同时保存到隐患列表
            let allHazards = wx.getStorageSync('allHazards') || [];
            this.data.hazardList.forEach((hazard, index) => {
                allHazards.unshift({
                    ...hazard,
                    reportId,
                    status: 'pending',
                    createTime: new Date().toISOString()
                });
            });
            wx.setStorageSync('allHazards', allHazards);

            wx.showToast({ title: '提交成功', icon: 'success' });

            // 跳转到排查报告页面
            setTimeout(() => {
                wx.redirectTo({
                    url: `/pages/report-result/report-result?reportId=${reportId}`
                });
            }, 1500);

        } catch (error) {
            console.error('提交失败:', error);
            wx.showToast({ title: '提交失败', icon: 'none' });
        } finally {
            this.setData({ submitting: false });
        }
    }
});
