// pages/profile/profile.js
// 我的页面

Page({
    data: {
        userInfo: {
            name: '张安全',
            department: '安全生产管理部',
            role: '安全管理员',
            avatar: ''
        },
        stats: {
            hazardCount: 0,
            taskCount: 0,
            favoriteCount: 0
        },
        pendingRectify: 0,
        processingTask: 0,
        unreadCount: 0
    },

    onShow() {
        this.loadData();
    },

    loadData() {
        // 从本地存储加载数据
        const allHazards = wx.getStorageSync('allHazards') || [];
        const reports = wx.getStorageSync('hazardReports') || [];

        const pendingRectify = allHazards.filter(h => h.status === 'pending').length;

        this.setData({
            stats: {
                hazardCount: allHazards.length,
                taskCount: reports.length,
                favoriteCount: 0
            },
            pendingRectify,
            processingTask: 0
        });
    },

    goToMyHazards() {
        wx.navigateTo({ url: '/pages/hazard-list/hazard-list' });
    },

    goToMyTasks() {
        wx.navigateTo({ url: '/pages/report-list/report-list' });
    },

    goToMyFavorites() {
        wx.showToast({ title: '功能开发中', icon: 'none' });
    },

    goToNotification() {
        wx.showToast({ title: '暂无新消息', icon: 'none' });
    },

    goToSettings() {
        wx.showToast({ title: '功能开发中', icon: 'none' });
    },

    goToHelp() {
        wx.showToast({ title: '功能开发中', icon: 'none' });
    },

    switchAccount() {
        wx.showToast({ title: '切换账号', icon: 'none' });
    }
});
