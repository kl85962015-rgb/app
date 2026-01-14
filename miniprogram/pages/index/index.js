// pages/index/index.js
Page({
    data: {
        userName: '安全指挥官',
        userAvatar: '',
        completionRate: 85,
        pendingCount: 2,
        toVerifyCount: 0,
        finishedCount: 85,
        recentReports: []
    },

    onLoad() { },

    onShow() {
        this.loadData();
    },

    loadData() {
        const allHazards = wx.getStorageSync('allHazards') || [];
        const reports = wx.getStorageSync('hazardReports') || [];

        if (reports.length === 0) {
            this.setData({
                completionRate: 100,
                pendingCount: 0,
                toVerifyCount: 0,
                finishedCount: 100,
                recentReports: []
            });
            return;
        }

        const total = allHazards.length;
        const completed = allHazards.filter(h => h.status === 'completed').length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 100;

        const pendingCount = allHazards.filter(h => h.status === 'pending').length;
        const toVerifyCount = allHazards.filter(h => h.status === 'rectified').length;

        const recentReports = reports.slice(0, 3).map(r => ({
            id: r.id,
            enterpriseName: r.enterpriseName || '未知企业',
            hazardCount: r.hazards?.length || 0,
            date: this.formatDate(r.createTime)
        }));

        this.setData({
            completionRate,
            pendingCount,
            toVerifyCount,
            finishedCount: completionRate,
            recentReports
        });
    },

    formatDate(isoString) {
        if (!isoString) return '';
        const d = new Date(isoString);
        return `${d.getMonth() + 1}月${d.getDate()}日`;
    },

    startCheck() {
        wx.navigateTo({ url: '/pages/enterprise/enterprise?mode=select' });
    },

    goToEnterprise() {
        wx.navigateTo({ url: '/pages/enterprise/enterprise' });
    },

    goToHazardList() {
        wx.navigateTo({ url: '/pages/hazard-list/hazard-list' });
    },

    goToReportList() {
        wx.navigateTo({ url: '/pages/report-list/report-list' });
    },

    goToReportDetail(e) {
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({ url: `/pages/report-result/report-result?reportId=${id}` });
    }
});