// pages/task-detail/task-detail.js

Page({
    data: {
        task: {
            id: 1,
            title: '月度安全隐患排查',
            content: '对生产车间进行全面安全隐患排查，重点检查电气设备、消防设施、机械防护等',
            enterpriseName: '北京华安科技制造有限公司',
            assigneeName: '张安全',
            creatorName: '李检查',
            status: 'processing',
            progress: 60,
            deadline: '2026-01-20',
            createTime: '2026-01-10',
            hazards: []
        }
    },

    onLoad(options) {
        if (options.id) {
            this.loadTaskDetail(options.id);
        }
    },

    async loadTaskDetail(id) {
        // TODO: 调用后端 API
    },

    addHazard() {
        wx.navigateTo({
            url: `/pages/hazard-report/hazard-report?taskId=${this.data.task.id}`
        });
    },

    startTask() {
        wx.showModal({
            title: '确认开始',
            content: '确定要开始执行此任务吗？',
            success: (res) => {
                if (res.confirm) {
                    this.setData({ 'task.status': 'processing' });
                    wx.showToast({ title: '任务已开始', icon: 'success' });
                }
            }
        });
    },

    completeTask() {
        wx.showModal({
            title: '确认完成',
            content: '确定要完成此任务吗？',
            success: (res) => {
                if (res.confirm) {
                    this.setData({ 'task.status': 'completed' });
                    wx.showToast({ title: '任务已完成', icon: 'success' });
                }
            }
        });
    }
});
