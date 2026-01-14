/**
 * 数据库模块 - 使用内存数据存储（简化版）
 * 用于测试环境，生产环境建议使用真实数据库
 */

// 内存数据存储
const db = {
  users: [
    { id: 1, openid: 'test_openid_001', name: '张安全', phone: '13800001111', department: '安全生产管理部', role: '安全管理员', avatar_url: '' },
    { id: 2, openid: 'test_openid_002', name: '李检查', phone: '13800002222', department: '安全生产管理部', role: '安全检查员', avatar_url: '' },
    { id: 3, openid: 'test_openid_003', name: '王电工', phone: '13800003333', department: '设备维护部', role: '设备管理员', avatar_url: '' }
  ],

  enterprises: [
    { id: 1, name: '北京华安科技制造有限公司', credit_code: '91110105XXXXXXXX1A', industry: 'manufacturing', region: 'chaoyang', address: '北京市朝阳区工业园区A座101号', contact: '张经理', contact_phone: '13812341234' },
    { id: 2, name: '恒达建设工程集团有限公司', credit_code: '91110108XXXXXXXX2B', industry: 'construction', region: 'haidian', address: '北京市海淀区科技园路88号', contact: '李总监', contact_phone: '13956785678' },
    { id: 3, name: '中化新材料科技股份有限公司', credit_code: '91110106XXXXXXXX3C', industry: 'chemical', region: 'fengtai', address: '北京市丰台区化工产业园15号', contact: '王安全', contact_phone: '13698769876' }
  ],

  hazards: [
    { id: 1, enterprise_id: 1, reporter_id: 1, task_id: null, description: '电气线路老化，存在漏电风险', level: 'major', status: 'processing', images: '[]', location: '生产车间 B 区', location_detail: '配电室', latitude: 39.9, longitude: 116.4, responsible_person_id: 3, deadline: '2026-01-20', created_at: '2026-01-13 14:30:00' },
    { id: 2, enterprise_id: 1, reporter_id: 1, task_id: null, description: '消防器材过期未更换', level: 'general', status: 'pending', images: '[]', location: '办公楼 3 楼', location_detail: '走廊', latitude: 39.9, longitude: 116.4, responsible_person_id: 2, deadline: '2026-01-25', created_at: '2026-01-12 09:15:00' }
  ],

  regulations: [
    { id: 1, category: 'safety_law', title: '第三十六条 安全生产教育和培训', content: '生产经营单位应当建立安全生产教育和培训档案，如实记录安全生产教育和培训的时间、内容、参加人员以及考核结果等情况。', source: '中华人民共和国安全生产法' },
    { id: 2, category: 'safety_law', title: '第三十八条 安全生产规章制度', content: '生产经营单位应当建立健全生产安全事故隐患排查治理制度，采取技术、管理措施，及时发现并消除事故隐患。', source: '中华人民共和国安全生产法' },
    { id: 3, category: 'fire_safety', title: '第二十八条 消防设施维护', content: '机关、团体、企业、事业等单位应当按照国家标准、行业标准配置消防设施、器材，设置消防安全标志，并定期组织检验、维修，确保完好有效。', source: '中华人民共和国消防法' },
    { id: 4, category: 'electrical', title: '第4.1条 电气设备安装要求', content: '电气设备的安装应符合设计要求和国家现行有关标准的规定。电气设备应设置明显的警示标志。', source: 'GB 50254-2014 电气装置安装工程规范' },
    { id: 5, category: 'machinery', title: '第5.2条 危险区域防护', content: '机械危险区域应采取有效的防护措施，防止人员进入或接触危险部位。防护装置应可靠、有效，不影响操作和维护。', source: 'GB/T 15706-2012 机械安全通则' },
    { id: 6, category: 'chemical', title: '第二十二条 危险化学品储存', content: '储存危险化学品应当符合下列要求：储存方式、方法与储存数量应当符合国家标准；储存场所应当设置明显的警示标志。', source: '危险化学品安全管理条例' }
  ],

  tasks: [
    { id: 1, enterprise_id: 1, title: '月度安全隐患排查', content: '对生产车间进行全面安全隐患排查', creator_id: 2, assignee_id: 1, status: 'processing', progress: 60, deadline: '2026-01-20', created_at: '2026-01-10 10:00:00' },
    { id: 2, enterprise_id: 2, title: '消防设施专项检查', content: '检查消防设施完好性', creator_id: 2, assignee_id: 2, status: 'pending', progress: 0, deadline: '2026-01-25', created_at: '2026-01-12 14:00:00' }
  ],

  user_regulation_favorites: [],
  hazard_regulations: [],

  // 自增 ID
  nextIds: {
    users: 4,
    enterprises: 4,
    hazards: 3,
    regulations: 7,
    tasks: 3
  }
};

/**
 * 获取数据库实例
 */
function getDatabase() {
  return db;
}

/**
 * 初始化数据库
 */
function initDatabase() {
  console.log('内存数据库初始化完成');
}

module.exports = {
  getDatabase,
  initDatabase
};
