// pages/task-create/task-create.js

const app = getApp();

Page({
    data: {
        selectedEnterprise: null,
        title: '',
        content: '',
        assignee: null,
        userList: [],
        deadline: '',
        today: '',
        submitting: false
    },

    onLoad() {
        const today = this.formatDate(new Date());
        this.setData({ today });
        this.loadUserList();
    },

    onShow() {
        const selectedEnterprise = wx.getStorageSync('selectedEnterprise');
        if (selectedEnterprise) {
            this.setData({ selectedEnterprise });
            wx.removeStorageSync('selectedEnterprise');
        }
    },

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    async loadUserList() {
        this.setData({
            userList: [
                { id: 1, name: '张安全 - 安全管理员' },
                { id: 2, name: '李检查 - 安全检查员' },
                { id: 3, name: '王电工 - 设备管理员' }
            ]
        });
    },

    goToSelectEnterprise() {
        wx.navigateTo({
            url: '/pages/enterprise/enterprise?mode=select'
        });
    },

    onTitleInput(e) {
        this.setData({ title: e.detail.value });
    },

    onContentInput(e) {
        this.setData({ content: e.detail.value });
    },

    onAssigneeChange(e) {
        const index = e.detail.value;
        this.setData({ assignee: this.data.userList[index] });
    },

    onDeadlineChange(e) {
        this.setData({ deadline: e.detail.value });
    },

    validateForm() {
        const { selectedEnterprise, title, assignee, deadline } = this.data;

        if (!selectedEnterprise) {
            wx.showToast({ title: '请选择企业', icon: 'none' });
            return false;
        }
        if (!title.trim()) {
            wx.showToast({ title: '请输入任务标题', icon: 'none' });
            return false;
        }
        if (!assignee) {
            wx.showToast({ title: '请选择执行人', icon: 'none' });
            return false;
        }
        if (!deadline) {
            wx.showToast({ title: '请选择截止日期', icon: 'none' });
            return false;
        }
        return true;
    },

    async submitTask() {
        if (!this.validateForm()) return;

        this.setData({ submitting: true });

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            wx.showToast({ title: '创建成功', icon: 'success' });

            setTimeout(() => {
                wx.navigateBack();
            }, 1500);
        } catch (error) {
            wx.showToast({ title: '创建失败', icon: 'none' });
        } finally {
            this.setData({ submitting: false });
        }
    }
});
