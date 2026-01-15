// pages/regulation-select/regulation-select.js
Page({
    data: {
        activeTab: 'professional', // professional, common, favorite, history, manual
        currentCategory: 'cat_all',
        searchKeyword: '',
        selectedRegulations: [], // 存储已选中的 item 对象
        expandedId: null,

        categories: [
            { id: 'cat_all', name: '全部分类' },
            { id: 'cat_machinery', name: '机械行业' },
            { id: 'cat_fire', name: '消防管理' },
            { id: 'cat_electric', name: '电气系统' },
            { id: 'cat_chemical', name: '危险化学品' },
            { id: 'cat_construct', name: '建设施工' }
        ],

        // 模拟的专业依据网格数据 (Sub-categories)
        categoryItems: [
            { id: 'sub_fire_1', name: '基础合规', icon: '📘', iconBg: '#E0F2FE' },
            { id: 'sub_fire_2', name: '消防控制室', icon: '📺', iconBg: '#E0E7FF' },
            { id: 'sub_fire_3', name: '消防水泵房', icon: '🚰', iconBg: '#DBEAFE' },
            { id: 'sub_fire_4', name: '安全疏散管理', icon: '🏃', iconBg: '#ECFCCB' },
            { id: 'sub_fire_5', name: '灭火器', icon: '🧯', iconBg: '#FEE2E2' },
            { id: 'sub_fire_6', name: '消防栓', icon: '🚒', iconBg: '#FFEDD5' },
            { id: 'sub_fire_7', name: '疏散指示', icon: '💡', iconBg: '#F3E8FF' },
            { id: 'sub_fire_8', name: '防火卷帘', icon: '🚪', iconBg: '#FCE7F3' },
            { id: 'sub_fire_9', name: '防火门', icon: '🚪', iconBg: '#E0F2FE' }
        ],

        // 列表显示的数据
        regulationList: [],

        // 手动输入的表单
        manualRegulation: {
            name: '',
            content: ''
        }
    },

    onLoad(options) {
        // 如果有传参已选中的，这里可以回显
        const eventChannel = this.getOpenerEventChannel();
        if (eventChannel) {
            // 监听来自上一个页面的数据
            eventChannel.on('acceptDataFromOpenerPage', (data) => {
                if (data && data.selectedRegulations) {
                    this.setData({ selectedRegulations: data.selectedRegulations });
                }
            })
        }
    },

    switchTab(e) {
        const tab = e.currentTarget.dataset.tab;
        this.setData({ activeTab: tab });

        if (tab === 'common') {
            this.loadCommonRegulations();
        } else if (tab === 'favorite') {
            // 加载收藏
            this.loadMockList();
        }
    },

    selectCategory(e) {
        this.setData({ currentCategory: e.currentTarget.dataset.id });
        // 实际应根据分类已加载右侧数据
    },

    // 点击网格中的子分类，进入列表模式查看该分类下的条款
    selectRegulationItem(e) {
        const item = e.currentTarget.dataset.item;
        // 切换到列表展示，并设置搜索词或筛选
        this.setData({
            activeTab: 'common', // 借用 common 列表视图或单独一个 list view
            searchKeyword: item.name
        });
        this.loadMockList(item.name);
    },

    loadCommonRegulations() {
        this.loadMockList();
    },

    loadMockList(filter = '') {
        // 模拟数据
        const list = [
            {
                id: 101,
                keywords: '人员密集场所，障碍物',
                description: '人员密集场所的门窗设置了影响逃生和灭火救援的栅栏等障碍物。',
                suggestion: '拆除人员密集场所门窗上设置的影响逃生和灭火救援的障碍物。',
                region: '全国',
                legalText: '第二十八条 任何单位、个人不得损坏、挪用或者擅自拆除、停用消防设施、器材，不得埋压、圈占、遮挡消火栓或者占用防火间距，不得占用、堵塞、封闭疏散通道、安全出口、消防车通道。人员密集场所的门窗不得设置影响逃生和灭火救援的障碍物。',
                lawName: '《中华人民共和国消防法》',
                isFavorite: false
            },
            {
                id: 102,
                keywords: '消防车道，畅通',
                description: '安全出口被堵塞。',
                suggestion: '任何单位、个人不得占用、堵塞、封闭疏散通道、安全出口、消防车通道。',
                region: '全国',
                legalText: '第二十八条 ...不得占用、堵塞、封闭疏散通道、安全出口...',
                lawName: '《中华人民共和国消防法》',
                isFavorite: true
            },
            {
                id: 103,
                keywords: '灭火器，过期',
                description: '灭火器压力不足或过期未检。',
                suggestion: '立即更换或送检灭火器，确保其处于正常可用状态。',
                region: '全国',
                legalText: '第十六条 机关、团体、企业、事业等单位应当履行下列消防安全职责：...（二）按照国家标准、行业标准配置消防设施、器材，设置消防安全标志，并定期组织检验、维修，确保完好有效...',
                lawName: '《中华人民共和国消防法》',
                isFavorite: false
            }
        ];

        if (filter) {
            // 简单过滤
            const filtered = list.filter(item => item.keywords.includes(filter) || item.description.includes(filter));
            this.setData({ regulationList: filtered });
        } else {
            this.setData({ regulationList: list });
        }
    },

    onSearchInput(e) {
        const val = e.detail.value;
        this.setData({ searchKeyword: val });
        this.loadMockList(val);
    },

    toggleDetail(e) {
        const id = e.currentTarget.dataset.id;
        this.setData({
            expandedId: this.data.expandedId === id ? null : id
        });
    },

    toggleFavorite(e) {
        const id = e.currentTarget.dataset.id;
        const list = this.data.regulationList.map(item => {
            if (item.id === id) {
                item.isFavorite = !item.isFavorite;
            }
            return item;
        });
        this.setData({ regulationList: list });
    },

    isSelected(id) {
        return this.data.selectedRegulations.some(item => item.id === id);
    },

    toggleSelect(e) {
        const item = e.currentTarget.dataset.item;
        let selected = [...this.data.selectedRegulations];
        const idx = selected.findIndex(r => r.id === item.id);

        if (idx > -1) {
            selected.splice(idx, 1);
        } else {
            // 统一数据格式
            selected.push({
                id: item.id,
                title: item.lawName + ' ' + item.keywords, // 简要标题
                content: item.legalText,
                source: item.lawName
            });
        }
        this.setData({ selectedRegulations: selected });
    },

    // 手动添加
    onManualNameInput(e) {
        this.setData({ 'manualRegulation.name': e.detail.value });
    },

    onManualContentInput(e) {
        this.setData({ 'manualRegulation.content': e.detail.value });
    },

    addManualRegulation() {
        if (!this.data.manualRegulation.name || !this.data.manualRegulation.content) {
            wx.showToast({ title: '请填写完整', icon: 'none' });
            return;
        }
        const newItem = {
            id: 'manual_' + Date.now(),
            title: this.data.manualRegulation.name,
            content: this.data.manualRegulation.content,
            source: '手动输入'
        };

        const selected = [...this.data.selectedRegulations, newItem];
        this.setData({
            selectedRegulations: selected,
            activeTab: 'common', // 切回去看效果
            manualRegulation: { name: '', content: '' }
        });
        wx.showToast({ title: '添加并已选中', icon: 'success' });
    },

    confirmSelection() {
        // 返回上一页
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];

        // 调用上一页的方法或更新数据
        if (prevPage) {
            // 方法1: 直接修改上一页 data (不推荐，但简单)
            // prevPage.setData({ 'currentHazard.regulations': this.data.selectedRegulations });

            // 方法2: 使用 EventChannel (推荐)
            const eventChannel = this.getOpenerEventChannel();
            eventChannel.emit('acceptDataFromOpenedPage', { selectedRegulations: this.data.selectedRegulations });
        }

        wx.navigateBack();
    }
})
