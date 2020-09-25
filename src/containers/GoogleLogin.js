import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import { googleLogin } from "../store/actions/auth";

class GoogleSocialAuth extends Component {
  render() {
    const googleResponse = async (response) => {
      console.log(response);
      let googleResponse = await googleLogin(response.accessToken);
      console.log(googleResponse);
      window.location.reload(false);
    };
    return (
      <div className="App">
        <GoogleLogin
          clientId="304138867966-ns6et1asbneo0uis7he30ngqn88a99ga.apps.googleusercontent.com"
          textButton="Login with Google"
          onSuccess={googleResponse}
          onFailure={googleResponse}
        />
      </div>
    );
  }
}

export default GoogleSocialAuth;
