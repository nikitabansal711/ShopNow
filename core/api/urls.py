from django.urls import path
from .views import (
    UserIDView,
    ItemListView,
    ItemDetailView,
    AddToCartView,
    OrderDetailView,
    OrderHistoryView,
    OrderQuantityUpdateView,
    PaymentView,
    AddCouponView,
    CountryListView,
    AddressListView,
    AddressCreateView,
    AddressUpdateView,
    AddressDeleteView,
    OrderItemDeleteView,
    PaymentListView,
    PayWithRazorpayView,
    PaymentHistoryView,
    EmptyCartView,
    AddWishlistView,
    RemoveWishlistView,
    DisplayWishlistView,
    RefundSummaryView,
    UserProfileView,
    SendSmsEmail
)

urlpatterns = [
    path('user-id/', UserIDView.as_view(), name='user-id'),
    path('countries/', CountryListView.as_view(), name='country-list'),
    path('addresses/', AddressListView.as_view(), name='address-list'),
    path('addresses/create/', AddressCreateView.as_view(), name='address-create'),
    path('addresses/<pk>/update/',
         AddressUpdateView.as_view(), name='address-update'),
    path('addresses/<pk>/delete/',
         AddressDeleteView.as_view(), name='address-delete'),
    path('products/', ItemListView.as_view(), name='product-list'),
    path('products/<pk>/', ItemDetailView.as_view(), name='product-detail'),
    path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('empty-cart/', EmptyCartView.as_view(), name='empty-cart'),
    path('order-summary/', OrderDetailView.as_view(), name='order-summary'),
    path('order-history/', OrderHistoryView.as_view(), name='order-history'),
    path('add-to-wishlist/', AddWishlistView.as_view(), name='add-to-wishlist'),
    path('remove-from-wishlist/', RemoveWishlistView.as_view(), name='remove-from-wishlist'),
    path('display-wishlist/', DisplayWishlistView.as_view(), name='display-wishlist'),
    path('refund-summary/', RefundSummaryView.as_view(), name='order-history'),
    path('checkout/', PaymentView.as_view(), name='checkout'),
    path('add-coupon/', AddCouponView.as_view(), name='add-coupon'),
    path('order-items/<pk>/delete/',
         OrderItemDeleteView.as_view(), name='order-item-delete'),
    path('order-item/update-quantity/',
         OrderQuantityUpdateView.as_view(), name='order-item-update-quantity'),
    path('payments/', PaymentListView.as_view(), name='payment-list'),
    path('payment-history/', PaymentHistoryView.as_view(), name='payment-list'),
    path('orders/', PayWithRazorpayView.as_view(), name='pay-with-razorpay'),
    path('userprofile/', UserProfileView.as_view(), name='user-profile-view'),
    path('sendsmsmail/', SendSmsEmail.as_view(), name='send-sms-mail'),

]