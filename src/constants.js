const localhost = "https://ecommerce-shopnow.herokuapp.com";

const apiURL = "/api";

export const endpoint = `${localhost}${apiURL}`;

export const productListURL = `${endpoint}/products/`;
export const productDetailURL = (id) => `${endpoint}/products/${id}/`;
export const addToCartURL = `${endpoint}/add-to-cart/`;
export const orderSummaryURL = `${endpoint}/order-summary/`;
export const orderHistoryURL = `${endpoint}/order-history/`;
export const addWishlistURL = `${endpoint}/add-to-wishlist/`;
export const removeWishlistURL = `${endpoint}/remove-from-wishlist/`;
export const displayWishlistURL = `${endpoint}/display-wishlist/`;
export const checkoutURL = `${endpoint}/checkout/`;
export const addCouponURL = `${endpoint}/add-coupon/`;
export const countryListURL = `${endpoint}/countries/`;
export const userIDURL = `${endpoint}/user-id/`;
export const addressListURL = (addressType) =>
  `${endpoint}/addresses/?address_type=${addressType}`;
export const addressCreateURL = `${endpoint}/addresses/create/`;
export const addressUpdateURL = (id) => `${endpoint}/addresses/${id}/update/`;
export const addressDeleteURL = (id) => `${endpoint}/addresses/${id}/delete/`;
export const orderItemDeleteURL = (id) =>
  `${endpoint}/order-items/${id}/delete/`;
export const orderItemUpdateQuantityURL = `${endpoint}/order-item/update-quantity/`;
export const paymentListURL = `${endpoint}/payments/`;

export const passwordResetURL = `${localhost}/rest-auth/password/reset/`;
export const passwordResetConfirmURL = `${localhost}/rest-auth/password/reset/confirm/`;

export const payWithRazorpay = `${endpoint}/orders/`;
export const paymentHistory = `${endpoint}/payment-history/`;
export const emptyCart = `${endpoint}/empty-cart/`;
export const refundSummary = `${endpoint}/refund-summary/`;

export const userProfileUrl = `${endpoint}/userprofile/`;
export const sendSmsMail = `${endpoint}/sendsmsmail/`;




