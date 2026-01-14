// pages/report-result/report-result.js
// 报告详情

Page({
    data: {
        reportId: '',
        report: null
    },

    onLoad(options) {
        if (options.reportId) {
            this.setData({ reportId: options.reportId });
            this.loadReport(options.reportId);
        }
    },

    loadReport(id) {
        const reports = wx.getStorageSync('hazardReports') || [];
        const report = reports.find(r => r.id == id);

        if (report) {
            // 格式化时间
            if (report.createTime) {
                const d = new Date(report.createTime);
                report.createTime = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
            }

            // 统计状态（如果有实时隐患状态的话，可以通过 allHazards 关联查询更新统计，这里主要展示快照）
            // 如果需要实时统计：
            const allHazards = wx.getStorageSync('allHazards') || [];
            const reportHazards = allHazards.filter(h => h.reportId == id);

            // 如果 allHazards 里有数据，优先用实时的（支持闭环状态更新）
            if (reportHazards.length > 0) {
                report.hazards = reportHazards;
                report.pendingCount = reportHazards.filter(h => h.status === 'pending').length;
                report.fixedCount = reportHazards.filter(h => h.status === 'completed' || h.status === 'rectified').length;
            }

            this.setData({ report });
        }
    },

    viewHazardDetail(e) {
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/hazard-detail/hazard-detail?id=${id}`
        });
    },

    backHome() {
        wx.switchTab({
            url: '/pages/index/index'
        });
    },

    exportReport() {
        wx.showLoading({ title: '生成中...' });

        // 模拟生成过程
        setTimeout(() => {
            wx.hideLoading();

            wx.showModal({
                title: '导出成功',
                content: `检查报告已生成图片并保存至相册。\n文件名：Report_${this.data.reportId}.jpg`,
                confirmText: '去查看',
                showCancel: false,
                success: (res) => {
                    if (res.confirm) {
                        // 这里可以做一些后续操作，比如打开预览图（如果生成了的话）
                    }
                }
            });
        }, 1500);
    }
});
