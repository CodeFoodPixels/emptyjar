export default (state, action) => {
  return {
    ...state,
    queryDates: {
      ...state.queryDates,
      ...action.data.queryDates
    },
    filters: {
      ...action.data.filters
    }
  };
};
