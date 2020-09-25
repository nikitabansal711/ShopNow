import React from "react";
import { connect } from "react-redux";

import { Grid, Header, Message } from "semantic-ui-react";

class EmailSentForm extends React.Component {
  render() {
    return (
      <Grid
        textAlign="center"
        style={{ height: "80vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 650 }}>
          <React.Fragment>
            <Message>
              <Header as="h1" color="teal" textAlign="center">
                Password Reset Link has been sent to your mail.
              </Header>
              <Message>
                <Header as="h3" color="black" textAlign="center">
                  Please Open your mail and click on link.
                </Header>
                <Header as="h3" color="black" textAlign="center">
                  Your Username also has been sent you mail.
                </Header>
              </Message>
            </Message>
          </React.Fragment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect()(EmailSentForm);
