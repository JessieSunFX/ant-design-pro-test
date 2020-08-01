export default {
    namespace: 'test', // 默认与文件名相同
    state: 11111111,

    reducers: {
      update(state, { payload }) {
        return `${payload}_test`;
      },
    },
    effects: {
      *fetch({ type, payload }, { put, call, select }) {
      },
    },
  }