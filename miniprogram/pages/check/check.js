// pages/check/check.js
// 检查页面 - 核心检查流程

Page({
    data: {
        enterpriseId: '',
        enterpriseName: '',
        today: '',
        hazardList: [],
        currentHazard: {
            images: [],
            description: '',
            location: '',
            level: 'general',
            suggestion: '',
            deadline: '',
            deadlineType: '',
            regulations: []
        }
    },

    onLoad(options) {
        const today = this.formatDate(new Date());
        this.setData({
            today,
            enterpriseId: options.enterpriseId || '',
            enterpriseName: decodeURIComponent(options.enterpriseName || '未知企业')
        });
    },

    formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    },

    // 拍照
    takePhoto() {
        wx.chooseMedia({
            count: 4 - this.data.currentHazard.images.length,
            mediaType: ['image'],
            sourceType: ['camera', 'album'],
            success: (res) => {
                const newImages = res.tempFiles.map(f => f.tempFilePath);
                this.setData({
                    'currentHazard.images': [...this.data.currentHazard.images, ...newImages]
                });
            }
        });
    },

    previewImage(e) {
        const { index } = e.currentTarget.dataset;
        wx.previewImage({
            current: this.data.currentHazard.images[index],
            urls: this.data.currentHazard.images
        });
    },

    deleteImage(e) {
        const { index } = e.currentTarget.dataset;
        const images = [...this.data.currentHazard.images];
        images.splice(index, 1);
        this.setData({ 'currentHazard.images': images });
    },

    onDescInput(e) {
        this.setData({ 'currentHazard.description': e.detail.value });
    },

    onLocationInput(e) {
        this.setData({ 'currentHazard.location': e.detail.value });
    },

    selectLevel(e) {
        this.setData({ 'currentHazard.level': e.currentTarget.dataset.level });
    },

    onSuggestionInput(e) {
        this.setData({ 'currentHazard.suggestion': e.detail.value });
    },

    onDeadlineChange(e) {
        this.setData({
            'currentHazard.deadline': e.detail.value,
            'currentHazard.deadlineType': ''
        });
    },

    setQuickDeadline(e) {
        const days = parseInt(e.currentTarget.dataset.days);
        const date = new Date();
        date.setDate(date.getDate() + days);
        this.setData({
            'currentHazard.deadline': this.formatDate(date),
            'currentHazard.deadlineType': String(days)
        });
    },

    // ===== 法规依据相关方法 =====

    // 跳转到法规选择页面
    showRegulationPicker() {
        const that = this;
        wx.navigateTo({
            url: '/pages/regulation-select/regulation-select',
            events: {
                // 监听被打开页面发送的数据
                acceptDataFromOpenedPage: function (data) {
                    if (data && data.selectedRegulations) {
                        that.setData({
                            'currentHazard.regulations': data.selectedRegulations
                        });
                    }
                }
            },
            success: function (res) {
                // 发送当前已选中的法规给被打开页面
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    selectedRegulations: that.data.currentHazard.regulations
                })
            }
        });
    },

    // 移除已选法规
    removeRegulation(e) {
        const id = e.currentTarget.dataset.id;
        const regulations = this.data.currentHazard.regulations.filter(r => r.id !== id);
        this.setData({ 'currentHazard.regulations': regulations });
    },

    // 验证当前隐患
    validateHazard() {
        const h = this.data.currentHazard;
        if (h.images.length === 0) {
            wx.showToast({ title: '请拍摄隐患照片', icon: 'none' });
            return false;
        }
        if (!h.description.trim()) {
            wx.showToast({ title: '请输入隐患描述', icon: 'none' });
            return false;
        }
        if (!h.location.trim()) {
            wx.showToast({ title: '请输入隐患位置', icon: 'none' });
            return false;
        }
        if (!h.deadline) {
            wx.showToast({ title: '请选择整改期限', icon: 'none' });
            return false;
        }
        return true;
    },

    // 保存当前隐患并继续
    addAndContinue() {
        if (!this.validateHazard()) return;

        const hazard = {
            id: Date.now(),
            ...this.data.currentHazard,
            createTime: new Date().toISOString()
        };

        this.setData({
            hazardList: [...this.data.hazardList, hazard],
            currentHazard: {
                images: [],
                description: '',
                location: '',
                level: 'general',
                suggestion: '',
                deadline: '',
                deadlineType: '',
                regulations: []
            }
        });

        wx.showToast({ title: '已保存，继续添加', icon: 'success' });
    },

    // 结束检查
    finishCheck() {
        let hazardList = [...this.data.hazardList];

        // 如果当前有未保存的内容，询问是否保存
        const h = this.data.currentHazard;
        if (h.images.length > 0 || h.description.trim()) {
            if (this.validateHazard()) {
                hazardList.push({
                    id: Date.now(),
                    ...h,
                    createTime: new Date().toISOString()
                });
            } else {
                return;
            }
        }

        if (hazardList.length === 0) {
            // 没有发现隐患，也可以生成报告
            wx.showModal({
                title: '提示',
                content: '本次检查未发现隐患，是否生成检查报告？',
                success: (res) => {
                    if (res.confirm) {
                        this.generateReport(hazardList);
                    }
                }
            });
        } else {
            this.generateReport(hazardList);
        }
    },

    // 生成检查报告
    generateReport(hazardList) {
        const reportId = Date.now();
        const report = {
            id: reportId,
            enterpriseId: this.data.enterpriseId,
            enterpriseName: this.data.enterpriseName,
            hazards: hazardList,
            createTime: new Date().toISOString(),
            inspector: '当前用户',
            status: 'submitted'
        };

        // 保存报告
        let reports = wx.getStorageSync('hazardReports') || [];
        reports.unshift(report);
        wx.setStorageSync('hazardReports', reports);

        // 保存隐患到隐患列表
        let allHazards = wx.getStorageSync('allHazards') || [];
        hazardList.forEach(h => {
            allHazards.unshift({
                ...h,
                reportId,
                enterpriseId: this.data.enterpriseId,
                enterpriseName: this.data.enterpriseName,
                status: 'pending' // 待整改
            });
        });
        wx.setStorageSync('allHazards', allHazards);

        // 跳转到报告页面
        wx.redirectTo({
            url: `/pages/report-result/report-result?reportId=${reportId}`
        });
    }
});
