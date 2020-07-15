import { queryProjectNotice } from '@/services/api';

export default {
  namespace: 'tabsPanes',

  state: {
    panes: [],
    activeKey:'1',
    panesStatus:true,
  },


  reducers: {
    save(state, {payload}) {
      return {
        ...state,
       ...payload
      };
    },
  },
};
