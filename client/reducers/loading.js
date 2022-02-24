export default (state, action) => {
  return {
    ...state,
    loading: action.value
  };
};
