// app.js - 小程序入口文件
App({
  globalData: {
    userInfo: null,
    baseUrl: 'http://localhost:3000/api', // 后端 API 地址
    token: ''
  },

  onLaunch() {
    // 小程序启动时执行
    console.log('隐患排查小程序启动');
    
    // 检查登录状态
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
    }
  },

  // 登录方法
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            // 发送 code 到后端换取 openid 和 session_key
            wx.request({
              url: `${this.globalData.baseUrl}/auth/login`,
              method: 'POST',
              data: { code: res.code },
              success: (response) => {
                if (response.data.success) {
                  this.globalData.token = response.data.data.token;
                  this.globalData.userInfo = response.data.data.userInfo;
                  wx.setStorageSync('token', response.data.data.token);
                  wx.setStorageSync('userInfo', response.data.data.userInfo);
                  resolve(response.data.data);
                } else {
                  reject(response.data.message);
                }
              },
              fail: reject
            });
          } else {
            reject('登录失败');
          }
        },
        fail: reject
      });
    });
  },

  // 封装请求方法
  request(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.globalData.baseUrl}${options.url}`,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.globalData.token}`
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else if (res.statusCode === 401) {
            // token 过期，重新登录
            this.login().then(() => {
              this.request(options).then(resolve).catch(reject);
            }).catch(reject);
          } else {
            reject(res.data);
          }
        },
        fail: reject
      });
    });
  }
});
