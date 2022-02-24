export const updateFilters = (state, action) => {
  return {
    ...state,
    filters: {
      ...state.filters,
      [action.key]: action.value
    }
  };
};
export const removeFilter = (state, action) => {
  return {
    ...state,
    filters: {
      ...state.filters,
      [action.key]: undefined
    }
  };
};
export const clearFilters = (state, action) => {
  return {
    ...state,
    filters: {}
  };
};
