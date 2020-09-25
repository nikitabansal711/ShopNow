import axios from "axios";
import * as actionTypes from "./actionTypes";
import { passwordResetURL,passwordResetConfirmURL } from "../../constants"

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authLogin = (username, password) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post("http://127.0.0.1:8000/rest-auth/login/", {
        username: username,
        password: password,
      })
      .then((res) => {
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token));
        dispatch(checkAuthTimeout(3600));
        window.location.reload(false);
      })
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

export const googleLogin = async (accesstoken) => {
  await axios
    .post("https://ecommerce-shopnow.herokuapp.com/rest-auth/google/", {
      access_token: accesstoken,
    })
    .then((res) => {
      const token = res.data.key;
      const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
      localStorage.setItem("token", token);
      localStorage.setItem("expirationDate", expirationDate);
      return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
      };
    })
    .catch((err) => {
      return {
        type: actionTypes.AUTH_FAIL,
        error: err,
      };
    });
};

export const githubLogin = async (accesstoken) => {
  await axios
    .post("https://ecommerce-shopnow.herokuapp.com/rest-auth/github/", {
      code: accesstoken,
    })
    .then((res) => {
      const token = res.data.key;
      const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
      localStorage.setItem("token", token);
      localStorage.setItem("expirationDate", expirationDate);
      return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
      };
    })
    .catch((err) => {
      return {
        type: actionTypes.AUTH_FAIL,
        error: err,
      };
    });
};

export const authSignup = (username, email, password1, password2) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post("https://ecommerce-shopnow.herokuapp.com/rest-auth/registration/", {
        username: username,
        email: email,
        password1: password1,
        password2: password2,
      })
      .then((res) => {
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token));
        dispatch(checkAuthTimeout(3600));
      })
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};



export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};


export const authForgot = (email) => {
  return dispatch => {
    dispatch(authStart());
    axios
      .post(passwordResetURL, {
        email: email,
      })
      .then(res => {
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};

export const authForgotConfirm = ( uid, token, new_password1, new_password2 ) => {
  return dispatch => {
    dispatch(authStart());
    axios
      .post(passwordResetConfirmURL, {
        uid: uid,
        token: token,
        new_password1: new_password1,
        new_password2: new_password2
      })
      .then(res => {
        window.location.reload(false);
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};
