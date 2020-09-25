import React from "react";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import { authAxios } from "../utils";
import {
  payWithRazorpay,
  paymentHistory,
  sendSmsMail,
  orderHistoryURL,
} from "../constants";
import { fetchCart } from "../store/actions/cart";
import { Button, Grid, Header } from "semantic-ui-react";

class RazorPay extends React.Component {
  state = {
    orderId: null,
    status: false,
    razorpay_payment_id: null,
    smsmaildata: null,
  };

  paymentHandler = async (e) => {
    e.preventDefault();
    await authAxios
      .get(payWithRazorpay)
      .then((res) => {
        const { data } = res;
        this.setState({ orderId: data.id });
        this.setState({ smsmaildata: data });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

      const options = {
      key: "rzp_test_jdtMShVjjYTtin",
      name: "shopNow",
      description: "Clothing and Footwear",
      order_id: this.state.orderId,
      handler: async (response) => {
        try {
          var body = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };
          this.setState({ razorpay_payment_id: response.razorpay_payment_id });
          await authAxios({
            method: "post",
            url: payWithRazorpay,
            data: body,
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => {
              if (res.data.status === "Payment successful") {
                this.props.refreshCart();
                this.setState({ status: true });
                alert("Payment succesful");
              } else {
                alert("Transaction failed, Please try again");
              }
            })
            .catch((err) => {});
          var PaymentBody = {
            razorpay_payment_id: this.state.razorpay_payment_id,
          };
          await authAxios({
            method: "post",
            url: paymentHistory,
            data: PaymentBody,
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => {
              authAxios({
                method: "post",
                url: sendSmsMail,
                data: this.state.smsmaildata,
                headers: { "Content-Type": "application/json" },
              })
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              })        
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
          var orderBody = {
            order_status: "Ordered",
          };
          await authAxios({
            method: "post",
            url: orderHistoryURL,
            data: orderBody,
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (err) {}
      },
      theme: {
        color: "#686CFD",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  render() {
    const { orderId, status } = this.state;
    const { isAuthenticated } = this.props;
    console.log(orderId);
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (status) {
      return <Redirect to="/" />;
    }
    return (
      <Grid
        textAlign="center"
        style={{ height: "50vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            Redirecting to Payment gateway
          </Header>
          <small>Don't press back until transaction is completed</small>
          <br></br>
          <br></br>
          <React.Fragment>
            <Button color="teal" size="massive" onClick={this.paymentHandler}>
              Click to pay
            </Button>
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

const mapDispatchToProps = (dispatch) => {
  return {
    refreshCart: () => dispatch(fetchCart()),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RazorPay)
);
