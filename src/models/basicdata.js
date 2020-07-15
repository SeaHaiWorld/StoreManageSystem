export default {
  namespace : 'basicdata',

  state : {
  },


  reducers : {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
