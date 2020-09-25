import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Forgotpassword from "./containers/Forgotpassword";
import ForgotPasswordConfirm from "./containers/ForgotPasswordConfirm";
import Emailsent from "./containers/Emailsent";
import HomepageLayout from "./containers/Home";
import ProductList from "./containers/ProductList";
import ProductDetail from "./containers/ProductDetail";
import OrderSummary from "./containers/OrderSummary";
import Checkout from "./containers/Checkout";
import Profile from "./containers/Profile";
import OrderHistory from "./containers/OrderHistory";
import RazorPay from "./containers/RazorpayPaymentPage";
import WishList from "./containers/wishlist";
import ReturnOrder from "./containers/ReturnOrder";
import RefundSummary from "./containers/RefundSummary";

const BaseRouter = () => (
  <Hoc>
    <Route exact path="/products" component={ProductList} />
    <Route path="/products/:productID" component={ProductDetail} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/forgotpassword" component={Forgotpassword} />
    <Route path="/forgotpasswordconfirm" component={ForgotPasswordConfirm} />
    <Route path="/emailsent" component={Emailsent} />
    <Route path="/order-summary" component={OrderSummary} />
    <Route path="/display-wishlist" component={WishList} />
    <Route path="/returnOrder" component={ReturnOrder} />
    <Route path="/order-history" component={OrderHistory} />
    <Route path="/refundSummary" component={RefundSummary} />
    <Route path="/razorpay" component={RazorPay} />
    <Route path="/checkout" component={Checkout} />
    <Route path="/profile" component={Profile} />
    <Route exact path="/" component={HomepageLayout} />
  </Hoc>
);

export default BaseRouter;
