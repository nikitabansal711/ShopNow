import React from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { authAxios } from "../utils";
import { withRouter } from "react-router-dom";
import { orderHistoryURL } from "../constants";
import { Grid, Header, Button } from "semantic-ui-react";

const options = [
  { value: "Bought by mistake", label: "Bought by mistake" },
  { value: "Better price available", label: "Better price available" },
  {
    value: "Product damaged, but shipping box ok",
    label: "Product damaged, but shipping box ok",
  },
  { value: "Item arrived too late", label: "Item arrived too late" },
  { value: "Missing or broken parts", label: "Missing or broken parts" },
  {
    value: "Product and shipping box both damaged",
    label: "Product and shipping box both damaged",
  },
  { value: "Wrong item was sent", label: "Wrong item was sent" },
  {
    value: "Item deffective ot doesn't work",
    label: "Item deffective ot doesn't work",
  },
  {
    value: "Recieved extra item I didn't buy",
    label: "Recieved extra item I didn't buy",
  },
  { value: "No longer needed", label: "No longer needed" },
  { value: "Didn't approve purchase", label: "Didn't approve purchase" },
  {
    value: "Inaccurate website description",
    label: "Inaccurate website description",
  },
];

class ReturnOrder extends React.Component {
  state = {
    selectedOption: null,
    status: false,
    alreadyReturned: false
  };
  handleChange = (selectedOption) => {
    this.setState({ selectedOption }, () =>
      console.log(`Option selected:`, this.state.selectedOption)
    );
  };

  returnHandler = async (e) => {
    e.preventDefault();
    const order_id = this.props.location.state.detail;
    console.log(order_id);
    var orderBody = {
      order_status: "Returned",
      order_id: order_id,
    };
    if (!this.state.selectedOption) {
      alert("Please select a valid reason");
      return <Redirect to="/returnOrder" />;
    }
    await authAxios({
      method: "put",
      url: orderHistoryURL,
      data: orderBody,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        console.log(res);
        if (res.data.status === "already returned") {
          alert("You have already asked for return of this product");
          this.setState({ alreadyReturned: true });

        }
        if (res.data.status === "updated order status to returned") {
          this.setState({ status: true });
          alert("Return successful, your refund has been issued");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { selectedOption, status, alreadyReturned  } = this.state;
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (status) {
      return <Redirect to="/order-history" />;
    }
    if (alreadyReturned) {
      return <Redirect to="/order-history" />;
    }
    return (
      <Grid
        textAlign="center"
        style={{ height: "60vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" color="teal" textAlign="center">
            Return your order
          </Header>
          <br />
          <React.Fragment>
            <div>
              <h4>Why do you want to return?</h4>
              <Select
                value={selectedOption}
                onChange={this.handleChange}
                options={options}
              />
              <br />
              <br />
              <Button color="teal" size="medium" onClick={this.returnHandler}>
                Confirm your return
              </Button>
            </div>
          </React.Fragment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

// export default connect(mapStateToProps)(ReturnOrder);
export default withRouter(connect(mapStateToProps)(ReturnOrder));
