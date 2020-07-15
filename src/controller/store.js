const Base = require('./base.js');

module.exports = class extends Base {
  /*
    getList
   */
  async listAction() {
    const params = await this.ctx.post();
    const data = await this.model('store').getListAction(params);
    return this.success(data);
  }

  async idAction() {
    const params = await this.ctx.post();
    const data = await this.model('store').getIdAction(params);
    return this.success(data);
  }

  async exportAction() {
    const params = await this.ctx.post();
    const data = await this.model('store').getExportAction(params);
    return this.success(data);
  }

  async addExAction() {
    const params = await this.ctx.post();
    const data = await this.model('store').addExportAction(params);
    return this.success(data);
  }

  /*
    deleteById
   */
  async delExAction() {
    const params = await this.ctx.post();
    if (Object.keys(params).length !== 0) {
      const data = await this.model('store').deleteExportAction(params);
      return this.success(data);
    } else {
      this.status = 403;
      return this.success('请求失败');
    }
  }

  async importAction() {
    const params = await this.ctx.post();
    const data = await this.model('store').getImportAction(params);
    return this.success(data);
  }

  async addImAction() {
    const params = await this.ctx.post();
    const data = await this.model('store').addImportAction(params);
    return this.success(data);
  }

  /*
    deleteById
   */
  async delImAction() {
    const params = await this.ctx.post();
    if (Object.keys(params).length !== 0) {
      const data = await this.model('store').deleteImportAction(params);
      return this.success(data);
    } else {
      this.status = 403;
      return this.success('请求失败');
    }
  }

  /*
    deleteById
   */
  async deleteAction() {
    const params = await this.ctx.post();
    if (Object.keys(params).length !== 0) {
      const data = await this.model('store').deleteByIdAction(params);
      return this.success(data);
    } else {
      this.status = 403;
      return this.success('请求失败');
    }
  }

  /*
    addItem
   */
  async addAction() {
    const params = await this.ctx.post();
    if (Object.keys(params).length !== 0) {
      const data = await this.model('store').addAction(params);
      return this.success(data);
    } else {
      this.status = 403;
      return this.success('请求失败');
    }
  }

  /*
    editById
   */
  async updateAction() {
    const params = await this.ctx.post();
    if (Object.keys(params).length !== 0) {
      const data = await this.model('store').updateAction(params);
      return this.success(data);
    } else {
      this.status = 403;
      return this.success('请求失败');
    }
  }
};
