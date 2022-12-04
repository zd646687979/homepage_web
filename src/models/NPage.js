const NPage = {
  state: {
    count:0
  }, // initial state
  reducers: {
      increment(state, payload) {
          return state + payload
      },
  },
  effects: dispatch => ({
      // handle state changes with impure functions.
      // use async/await for async actions
      async incrementAsync(payload, rootState) {
        /// <summary>test</summary>
        /// <param name="state" type="int">用户ID</param>
        /// <param name="payload" type="int">城市ID</param>
        /// <returns type="testing" />
          await new Promise(resolve => setTimeout(resolve, 1000))
          dispatch.count.increment(payload)
      },
  }),
}
export default NPage