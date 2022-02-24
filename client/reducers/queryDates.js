export default (state, action) => {
  return {
    ...state,
    queryDates: action.queryDates
  };
};
