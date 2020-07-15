module.exports = class extends think.Model {
  async loginAction(params) {
    const {username, password} = params;
    const login = this.model('login');
    const data = await login.where({userName: username, passWord: password}).find();
    return data;
  }

  async registerAction(params) {
    const {username, password} = params;
    const login = this.model('login');
    const data = await login.add({userName: username, passWord: password, status: '超级管理员'});
    return data;
  }
};
