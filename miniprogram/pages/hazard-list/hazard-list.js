// pages/hazard-list/hazard-list.js
// 隐患列表逻辑修复版

Page({
    data: {
        currentFilter: 'all', // all | pending | rectified | completed
        hazards: [],
        filteredHazards: [],
        statusMap: {
            'pending': '待整改',
            'rectified': '待验收',
            'completed': '已闭环'
        }
    },

    onLoad(options) {
        if (options.status) {
            this.setData({ currentFilter: options.status });
        }
        // 确保状态映射存在
        if (!this.data.statusMap) {
            this.setData({
                statusMap: {
                    'pending': '待整改',
                    'rectified': '待验收',
                    'completed': '已闭环'
                }
            });
        }
    },

    onShow() {
        this.loadHazards();
    },

    loadHazards() {
        let allHazards = wx.getStorageSync('allHazards') || [];

        // 格式化时间
        allHazards = allHazards.map(h => {
            // 兼容旧数据字段 photos/images
            if (!h.photos && h.images) h.photos = h.images;

            // 格式化展示时间，例如 "01-14 12:00"
            let timeStr = h.createTime || '';
            if (timeStr.includes('T')) {
                const date = new Date(timeStr);
                timeStr = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            }
            return {
                ...h,
                createTimeFormatted: timeStr
            };
        });

        this.setData({ hazards: allHazards });
        this.applyFilter();
    },

    setFilter(e) {
        const status = e.currentTarget.dataset.status;
        this.setData({ currentFilter: status });
        this.applyFilter();
    },

    applyFilter() {
        const { hazards, currentFilter } = this.data;
        let filtered = hazards;

        if (currentFilter !== 'all') {
            filtered = hazards.filter(h => h.status === currentFilter);
        }

        // 按时间倒序
        filtered.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

        this.setData({ filteredHazards: filtered });
    },

    goToDetail(e) {
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/hazard-detail/hazard-detail?id=${id}`
        });
    }
});
