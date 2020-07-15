const moment = require('moment');

module.exports = class extends think.Model {
  async getListAction(params) {
    const store = this.model('store');
    return store.where({...params}).select();
  }

  async getIdAction(params) {
    const store = this.model('store');
    return store.where({...params}).find();
  }

  async getExportAction(params) {
    const ex = this.model('export');
    if (params.key) {
      return ex.where({key: ['like', `%${params.key}%`], storeId: params.storeId}).select();
    } else {
      return ex.where({storeId: params.storeId}).select();
    }
  }

  async addExportAction(params) {
    if (params) {
      const ex = this.model('export');
      const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      await ex.add({...params, time});
      return '添加成功';
    } else {
      return '添加失败';
    }
  }

  async deleteExportAction(params) {
    if (params) {
      const store = this.model('store');
      await store.where({...params}).delete();
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  async getImportAction(params) {
    const im = this.model('import');
    if (params.key) {
      return im.where({key: ['like', `%${params.key}%`], storeId: params.storeId}).select();
    } else {
      return im.where({storeId: params.storeId}).select();
    }
  }

  async addImportAction(params) {
    if (params) {
      const im = this.model('import');
      const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      await im.add({...params, time});
      return '添加成功';
    } else {
      return '添加失败';
    }
  }

  async deleteByIdAction(params) {
    if (params) {
      const store = this.model('store');
      await store.where({...params}).delete();
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  async updateAction(params) {
    if (params) {
      const {id} = params;
      const store = this.model('store');
      await store.where({id: id}).update({...params});
      return '更新成功';
    } else {
      return '更新失败';
    }
  }

  async addAction(params) {
    if (params) {
      const store = this.model('store');
      const createTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      await store.add({...params, createTime});
      return '添加成功';
    } else {
      return '添加失败';
    }
  }
};
