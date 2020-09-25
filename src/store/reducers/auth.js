import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  token: null,
  error: null,
  loading: false
};

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.token,
    error: null,
    loading: false
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const authLogout = (state, action) => {
  return updateObject(state, {
    token: null
  });
};

const passwordResetSuccess = (state) => {
  return updateObject(state, {
    ...state
  });
};

const passwordResetFail = (state) => {
  return updateObject(state, {
    ...state
  });
};

const passwordResetConfirmSuccess = (state) => {
  return updateObject(state, {
    ...state
  });
};

const passwordResetConfirmFail = (state) => {
  return updateObject(state, {
    ...state
  });
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.PASSWORD_RESET_SUCCESS:
      return passwordResetFail(state);
    case actionTypes.PASSWORD_RESET_FAIL:
      return passwordResetConfirmSuccess(state);
    case actionTypes.PASSWORD_RESET_CONFIRM_SUCCESS:
      return passwordResetSuccess(state);
    case actionTypes.PASSWORD_RESET_CONFIRM_FAIL:
      return passwordResetConfirmFail(state);
    default:
      return state;
  }
};

export default reducer;
 