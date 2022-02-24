import {
  UPDATE_FILTERS,
  UPDATE_QUERYDATES,
  URL_PARAMS_TO_STATE,
  REMOVE_FILTER,
  CLEAR_FILTERS,
  UPDATE_LOADING,
  UPDATE_DATA
} from "../constants";
import data from "./data";
import { clearFilters, removeFilter, updateFilters } from "./filters";
import loading from "./loading";
import queryDates from "./queryDates";
import urlParamsToState from "./urlParamsToState";

const reducers = {
  [URL_PARAMS_TO_STATE]: urlParamsToState,
  [UPDATE_QUERYDATES]: queryDates,
  [UPDATE_FILTERS]: updateFilters,
  [REMOVE_FILTER]: removeFilter,
  [CLEAR_FILTERS]: clearFilters,
  [UPDATE_LOADING]: loading,
  [UPDATE_DATA]: data
};

export default (state, action) => {
  if (reducers[action.type]) {
    return reducers[action.type](state, action);
  }

  return state;
};
