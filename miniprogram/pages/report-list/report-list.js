// pages/report-list/report-list.js

Page({
    data: {
        reports: []
    },

    onShow() {
        this.loadReports();
    },

    loadReports() {
        const reports = wx.getStorageSync('hazardReports') || [];

        const formattedReports = reports.map(r => ({
            id: r.id,
            enterpriseName: r.enterpriseName || '未知企业',
            hazardCount: r.hazards?.length || 0,
            date: this.formatDate(r.createTime)
        }));

        this.setData({ reports: formattedReports });
    },

    formatDate(isoString) {
        if (!isoString) return '';
        const d = new Date(isoString);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },

    goToDetail(e) {
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/report-result/report-result?reportId=${id}`
        });
    }
});
