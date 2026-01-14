// pages/enterprise/enterprise.js
// 企业库逻辑修复版

Page({
    data: {
        mode: 'view', // view | select
        searchQuery: '', // 搜索关键词

        // 企业数据
        enterprises: [],
        filteredList: [],

        // 弹窗控制
        showModal: false,
        isEdit: false,

        // 编辑/新增的对象
        editingId: null,
        form: {
            name: '',
            creditCode: '',
            address: '',
            contact: '',
            phone: ''
        }
    },

    onLoad(options) {
        if (options.mode === 'select') {
            this.setData({ mode: 'select' });
            wx.setNavigationBarTitle({ title: '选择企业' });
        }
        this.loadData();
    },

    onShow() {
        this.loadData();
    },

    // 加载数据
    loadData() {
        let list = wx.getStorageSync('enterprises') || [];
        if (list.length === 0) {
            // 默认演示数据
            list = [
                { id: 1, name: '北京华安科技制造有限公司', creditCode: '91110105MA00CR12', address: '北京市朝阳区工业园A1', contact: '张伟', phone: '13800138000' },
                { id: 2, name: '上海建设工程集团', creditCode: '91310000MA1FL432', address: '上海市浦东新区世纪大道88号', contact: '李明', phone: '13900139000' }
            ];
            wx.setStorageSync('enterprises', list);
        }
        this.setData({
            enterprises: list,
            filteredList: this.filterList(list, this.data.searchQuery)
        });
    },

    // 搜索
    onSearchInput(e) {
        const val = e.detail.value;
        this.setData({
            searchQuery: val,
            filteredList: this.filterList(this.data.enterprises, val)
        });
    },

    clearSearch() {
        this.setData({
            searchQuery: '',
            filteredList: this.data.enterprises
        });
    },

    filterList(list, query) {
        if (!query) return list;
        return list.filter(item => item.name.includes(query) || (item.creditCode && item.creditCode.includes(query)));
    },

    // 选择企业
    selectEnterprise(e) {
        const { item } = e.currentTarget.dataset;
        if (this.data.mode === 'select') {
            wx.navigateTo({
                url: `/pages/check/check?enterpriseId=${item.id}&enterpriseName=${encodeURIComponent(item.name)}`
            });
        } else {
            // 查看详情模式，这里可以做点什么，比如弹窗显示详情，或者进入详情页
            // 暂时直接复用编辑逻辑，作为查看/编辑
        }
    },

    // 显示新增弹窗
    showAddModal() {
        this.setData({
            showModal: true,
            isEdit: false,
            editingId: null,
            form: { name: '', creditCode: '', address: '', contact: '', phone: '' }
        });
    },

    // 显示编辑弹窗
    showEditModal(e) {
        const { item } = e.currentTarget.dataset;
        this.setData({
            showModal: true,
            isEdit: true,
            editingId: item.id,
            form: { ...item } // 复制对象
        });
    },

    hideModal() {
        this.setData({ showModal: false });
    },

    // 输入绑定
    onInput(e) {
        const field = e.currentTarget.dataset.field;
        const value = e.detail.value;
        this.setData({
            [`form.${field}`]: value
        });
    },

    // 保存
    confirmSave() {
        const { form, isEdit, editingId, enterprises } = this.data;

        // 简单校验
        if (!form.name.trim()) return wx.showToast({ title: '企业名称不能为空', icon: 'none' });

        let newList = [...enterprises];

        if (isEdit) {
            // 编辑更新
            const idx = newList.findIndex(x => x.id === editingId);
            if (idx > -1) {
                newList[idx] = { ...form, id: editingId }; // 保持ID不变
            }
        } else {
            // 新增
            const newId = Date.now(); // 简单ID生成
            newList.unshift({ ...form, id: newId });
        }

        // 保存并更新视图
        wx.setStorageSync('enterprises', newList);
        this.setData({
            enterprises: newList,
            filteredList: this.filterList(newList, this.data.searchQuery),
            showModal: false
        });

        wx.showToast({ title: isEdit ? '已更新' : '已添加', icon: 'success' });
    }
});
