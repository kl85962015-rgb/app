// pages/task/task.js
// 任务管理页面逻辑

const app = getApp();

Page({
    data: {
        currentTab: 'all',
        taskCounts: {
            all: 0,
            pending: 0,
            processing: 0,
            completed: 0
        },
        tasks: [],
        page: 1,
        pageSize: 10,
        loading: false,
        refreshing: false,
        noMore: false
    },

    onLoad() {
        this.loadTaskCounts();
        this.loadTasks();
    },

    onShow() {
        this.loadTaskCounts();
        this.loadTasks();
    },

    // 加载任务统计
    async loadTaskCounts() {
        // TODO: 调用后端 API
        this.setData({
            taskCounts: {
                all: 5,
                pending: 2,
                processing: 2,
                completed: 1
            }
        });
    },

    // 加载任务列表
    async loadTasks(reset = true) {
        if (this.data.loading) return;

        if (reset) {
            this.setData({
                page: 1,
                tasks: [],
                noMore: false
            });
        }

        this.setData({ loading: true });

        try {
            const mockData = this.getMockTasks();

            await new Promise(resolve => setTimeout(resolve, 500));

            // 根据标签筛选
            let filtered = mockData;
            if (this.data.currentTab !== 'all') {
                filtered = mockData.filter(item => item.status === this.data.currentTab);
            }

            // 分页
            const start = (this.data.page - 1) * this.data.pageSize;
            const end = start + this.data.pageSize;
            const pageData = filtered.slice(start, end);

            this.setData({
                tasks: reset ? pageData : [...this.data.tasks, ...pageData],
                noMore: pageData.length < this.data.pageSize,
                loading: false,
                refreshing: false
            });
        } catch (error) {
            console.error('加载任务列表失败:', error);
            this.setData({ loading: false, refreshing: false });
        }
    },

    // 模拟任务数据
    getMockTasks() {
        return [
            {
                id: 1,
                title: '月度安全隐患排查',
                enterpriseId: 1,
                enterpriseName: '北京华安科技制造有限公司',
                assigneeName: '张安全',
                status: 'processing',
                deadline: '2026-01-20',
                createDate: '2026-01-10',
                progress: 60,
                hazardCount: 3
            },
            {
                id: 2,
                title: '消防设施专项检查',
                enterpriseId: 2,
                enterpriseName: '恒达建设工程集团有限公司',
                assigneeName: '李检查',
                status: 'pending',
                deadline: '2026-01-25',
                createDate: '2026-01-12',
                progress: 0,
                hazardCount: 0
            },
            {
                id: 3,
                title: '电气安全隐患排查',
                enterpriseId: 3,
                enterpriseName: '中化新材料科技股份有限公司',
                assigneeName: '王电工',
                status: 'processing',
                deadline: '2026-01-18',
                createDate: '2026-01-08',
                progress: 80,
                hazardCount: 2
            },
            {
                id: 4,
                title: '年度安全大检查',
                enterpriseId: 1,
                enterpriseName: '北京华安科技制造有限公司',
                assigneeName: '张安全',
                status: 'completed',
                deadline: '2026-01-05',
                createDate: '2025-12-20',
                progress: 100,
                hazardCount: 5
            },
            {
                id: 5,
                title: '危化品仓库检查',
                enterpriseId: 3,
                enterpriseName: '中化新材料科技股份有限公司',
                assigneeName: '王安全',
                status: 'pending',
                deadline: '2026-01-30',
                createDate: '2026-01-13',
                progress: 0,
                hazardCount: 0
            }
        ];
    },

    // 切换标签
    switchTab(e) {
        const { tab } = e.currentTarget.dataset;
        if (tab === this.data.currentTab) return;

        this.setData({ currentTab: tab });
        this.loadTasks();
    },

    // 跳转任务详情
    goToTaskDetail(e) {
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/task-detail/task-detail?id=${id}`
        });
    },

    // 开始任务
    startTask(e) {
        const { id } = e.currentTarget.dataset;
        wx.showModal({
            title: '确认开始',
            content: '确定要开始执行此任务吗？',
            success: (res) => {
                if (res.confirm) {
                    // TODO: 调用后端 API 更新任务状态
                    wx.showToast({ title: '任务已开始', icon: 'success' });
                    this.loadTasks();
                }
            }
        });
    },

    // 继续任务
    continueTask(e) {
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/hazard-report/hazard-report?taskId=${id}`
        });
    },

    // 创建任务
    createTask() {
        wx.navigateTo({
            url: '/pages/task-create/task-create'
        });
    },

    // 加载更多
    loadMore() {
        if (this.data.noMore || this.data.loading) return;

        this.setData({
            page: this.data.page + 1
        });
        this.loadTasks(false);
    },

    // 下拉刷新
    onRefresh() {
        this.setData({ refreshing: true });
        this.loadTaskCounts();
        this.loadTasks();
    }
});
