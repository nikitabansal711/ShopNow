import React, { Component } from "react";
import GitHubLogin from "react-github-login";
import { githubLogin } from "../store/actions/auth";

class GithubSocialAuth extends Component {
  render() {
    const githubResponse = async (response) => {
      console.log(response);
      let githubResponse = await githubLogin(response.code);
      console.log(githubResponse);
      window.location.reload(false);
    };
    return (
      <div className="App">
        <GitHubLogin
          clientId="f81af3004ab3945e9d00"
          textButton="Login with Github"
          onSuccess={githubResponse}
          onFailure={githubResponse}
          redirectUri="https://ecommerce-shopnow.herokuapp.com"
        />
      </div>
    );
  }
}

export default GithubSocialAuth;
