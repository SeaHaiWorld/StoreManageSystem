const Base = require('./base.js');

module.exports = class extends Base {
  /*
   login
  */
  async indexAction() {
    const params = await this.ctx.post();
    console.log(params);
    if (Object.keys(params).length !== 0) {
      const data = await this.model('login').loginAction(params);
      return this.success(data);
    } else {
      this.status = 403;
      return this.success('请求失败');
    }
  }

  async registerAction() {
    const params = await this.ctx.post();
    console.log(params);
    if (Object.keys(params).length !== 0) {
      const data = await this.model('login').registerAction(params);
      return this.success(data);
    } else {
      this.status = 403;
      return this.success('请求失败');
    }
  }
};
