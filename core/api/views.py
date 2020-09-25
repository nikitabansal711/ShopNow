import json

import razorpay
import stripe
from core.models import (
    Item,
    OrderItem,
    Order,
    Address,
    Payment,
    Coupon,
    UserProfile,
    Variation,
)
from decouple import config
from django.conf import settings
from django.contrib import messages
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.http import Http404, JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django_countries import countries
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    UpdateAPIView,
    DestroyAPIView,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView

from .serializers import (
    ItemSerializer,
    OrderSerializer,
    ItemDetailSerializer,
    AddressSerializer,
    PaymentSerializer,
    OrderItemSerializer,
)
from core.models import (
    Item,
    OrderItem,
    Order,
    Address,
    Payment,
    Coupon,
    UserProfile,
    Variation,
    ItemVariation,
)
from userapp.models import User
from decouple import config

import stripe
import razorpay

from twilio.rest import Client
from home.settings.base import (
    EMAIL_HOST_USER,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_FROM_NUMBER,
)
from django.core.mail import send_mail

stripe.api_key = settings.STRIPE_SECRET_KEY


class UserIDView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"userID": request.user.id, "username": request.user.username}, status=HTTP_200_OK)


class ItemListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemSerializer
    queryset = Item.objects.all()


class ItemDetailView(RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemDetailSerializer
    queryset = Item.objects.all()


class OrderQuantityUpdateView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get("slug", None)
        if slug is None:
            return Response({"message": "Invalid data"}, status=HTTP_400_BAD_REQUEST)
        item = get_object_or_404(Item, slug=slug)
        order_qs = Order.objects.filter(user=request.user, ordered=False)
        if order_qs.exists():
            order = order_qs[0]
            # check if the order item is in the order
            if order.items.filter(item__slug=item.slug).exists():
                order_item = OrderItem.objects.filter(
                    item=item, user=request.user, ordered=False
                )[0]
                if order_item.quantity > 1:
                    order_item.quantity -= 1
                    order_item.save()
                else:
                    order.items.remove(order_item)
                return Response(status=HTTP_200_OK)
            else:
                return Response(
                    {"message": "This item was not in your cart"},
                    status=HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "You do not have an active order"},
                status=HTTP_400_BAD_REQUEST,
            )


class OrderItemDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = OrderItem.objects.all()


class AddToCartView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get("slug", None)
        variations = request.data.get("variations", [])
        if slug is None:
            return Response({"message": "Invalid request"}, status=HTTP_400_BAD_REQUEST)

        item = get_object_or_404(Item, slug=slug)

        minimum_variation_count = Variation.objects.filter(item=item).count()
        if len(variations) < minimum_variation_count:
            return Response(
                {"message": "Please specify the required variation types"},
                status=HTTP_400_BAD_REQUEST,
            )

        order_item_qs = OrderItem.objects.filter(
            item=item, user=request.user, ordered=False
        )
        for v in variations:
            order_item_qs = order_item_qs.filter(Q(item_variations__exact=v))

        if order_item_qs.exists():
            order_item = order_item_qs.first()
            order_item.quantity += 1
            order_item.save()
        else:
            order_item = OrderItem.objects.create(
                item=item, user=request.user, ordered=False
            )
            order_item.item_variations.add(*variations)
            order_item.save()

        order_qs = Order.objects.filter(user=request.user, ordered=False)
        if order_qs.exists():
            order = order_qs[0]
            if not order.items.filter(item__id=order_item.id).exists():
                order.items.add(order_item)
                return Response(status=HTTP_200_OK)

        else:
            ordered_date = timezone.now()
            order = Order.objects.create(user=request.user, ordered_date=ordered_date)
            order.items.add(order_item)
            return Response(status=HTTP_200_OK)


class EmptyCartView(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request):
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            order.delete()
            return JsonResponse({"status": "cart successfully emptied"})
        except:
            return JsonResponse({"status": "could not empty the cart"})


class OrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            return order
        except ObjectDoesNotExist:
            raise Http404("You do not have an active order")


class OrderHistoryView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = OrderSerializer

    def get_queryset(self):
        try:
            order = Order.objects.filter(user=self.request.user, ordered=True)
            return order
        except ObjectDoesNotExist:
            raise Http404("You do not have an active order")

    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            order_items = order.items.all()
            order_items.update(ordered=True)
            order_items.update(order_status=data["order_status"])
            for item in order_items:
                item.save()
            order.ordered = True
            order.save()
            return JsonResponse({"status": "updated order history"})
        except:
            return JsonResponse({"status": "could not update order history"})

    def put(self, request):
        data = json.loads(request.body.decode("utf-8"))
        try:
            order = get_object_or_404(OrderItem, pk=data["order_id"])
            if order.get_order_status() == "Returned":
                return JsonResponse({"status": "already returned"})
            else:
                order.order_status = data["order_status"]
            order.save()
            return JsonResponse({"status": "updated order status to returned"})
        except:
            return JsonResponse({"status": "could not update order status to refunded"})


class RefundSummaryView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = OrderItemSerializer

    def get_queryset(self):
        try:
            order = OrderItem.objects.filter(
                user=self.request.user, ordered=True, order_status="Returned"
            )
            print(order)
            return order
        except ObjectDoesNotExist:
            raise Http404("You do not have an active order")


class PaymentView(APIView):
    def post(self, request, *args, **kwargs):
        order = Order.objects.get(user=self.request.user, ordered=False)
        userprofile = UserProfile.objects.get(user=self.request.user)
        token = request.data.get("stripeToken")
        billing_address_id = request.data.get("selectedBillingAddress")
        shipping_address_id = request.data.get("selectedShippingAddress")

        billing_address = Address.objects.get(id=billing_address_id)
        shipping_address = Address.objects.get(id=shipping_address_id)

        if (
                userprofile.stripe_customer_id != ""
                and userprofile.stripe_customer_id is not None
        ):
            customer = stripe.Customer.retrieve(userprofile.stripe_customer_id)
            customer.sources.create(source=token)

        else:
            customer = stripe.Customer.create(
                email=self.request.user.email,
            )
            customer.sources.create(source=token)
            userprofile.stripe_customer_id = customer["id"]
            userprofile.one_click_purchasing = True
            userprofile.save()

        amount = int(order.get_total() * 100)

        try:

            # charge the customer because we cannot charge the token more than once
            charge = stripe.Charge.create(
                amount=amount,  # cents
                currency="usd",
                customer=userprofile.stripe_customer_id,
            )
            # charge once off on the token
            # charge = stripe.Charge.create(
            #     amount=amount,  # cents
            #     currency="usd",
            #     source=token
            # )

            # create the payment
            payment = Payment()
            payment.stripe_charge_id = charge["id"]
            payment.user = self.request.user
            payment.amount = order.get_total()
            payment.save()

            # assign the payment to the order

            order_items = order.items.all()
            order_items.update(ordered=True)
            for item in order_items:
                item.save()

            order.ordered = True
            order.payment = payment
            order.billing_address = billing_address
            order.shipping_address = shipping_address
            # order.ref_code = create_ref_code()
            order.save()

            return Response(status=HTTP_200_OK)

        except stripe.error.CardError as e:
            body = e.json_body
            err = body.get("error", {})
            return Response(
                {"message": f"{err.get('message')}"}, status=HTTP_400_BAD_REQUEST
            )

        except stripe.error.RateLimitError as e:
            # Too many requests made to the API too quickly
            messages.warning(self.request, "Rate limit error")
            return Response(
                {"message": "Rate limit error"}, status=HTTP_400_BAD_REQUEST
            )

        except stripe.error.InvalidRequestError as e:
            print(e)
            # Invalid parameters were supplied to Stripe's API
            return Response(
                {"message": "Invalid parameters"}, status=HTTP_400_BAD_REQUEST
            )

        except stripe.error.AuthenticationError as e:
            # Authentication with Stripe's API failed
            # (maybe you changed API keys recently)
            return Response(
                {"message": "Not authenticated"}, status=HTTP_400_BAD_REQUEST
            )

        except stripe.error.APIConnectionError as e:
            # Network communication with Stripe failed
            return Response({"message": "Network error"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.StripeError as e:
            # Display a very generic error to the user, and maybe send
            # yourself an email
            return Response(
                {
                    "message": "Something went wrong. You were not charged. Please try again."
                },
                status=HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            # send an email to ourselves
            return Response(
                {"message": "A serious error occurred. We have been notifed."},
                status=HTTP_400_BAD_REQUEST,
            )


class AddCouponView(APIView):
    def post(self, request, *args, **kwargs):
        code = request.data.get("code", None)
        if code is None:
            return Response(
                {"message": "Invalid data received"}, status=HTTP_400_BAD_REQUEST
            )
        order = Order.objects.get(user=self.request.user, ordered=False)
        coupon = get_object_or_404(Coupon, code=code)
        order.coupon = coupon
        order.save()
        return Response(status=HTTP_200_OK)


class CountryListView(APIView):
    def get(self, request, *args, **kwargs):
        return Response(countries, status=HTTP_200_OK)


class AddressListView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AddressSerializer

    def get_queryset(self):
        address_type = self.request.query_params.get("address_type", None)
        qs = Address.objects.all()
        if address_type is None:
            return qs
        return qs.filter(user=self.request.user, address_type=address_type)


class AddressCreateView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AddressSerializer
    queryset = Address.objects.all()


class AddressUpdateView(UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AddressSerializer
    queryset = Address.objects.all()


class AddressDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Address.objects.all()


class PaymentListView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class PaymentHistoryView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PaymentSerializer

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode("utf-8"))
            order = Order.objects.get(user=self.request.user, ordered=False)
            order_amount = order.get_total()
            payment_saved = Payment(
                razorpay_payment_id=data["razorpay_payment_id"],
                amount=order_amount,
                user=self.request.user,
            )
            payment_saved.save()
            return Response({"success": "Payment history updated successfully"})
        except:
            return JsonResponse({"status": "could not update payment history"})


class AddWishlistView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ItemSerializer

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode("utf-8"))
            item_liked = Item.objects.get(pk=data)
            user_id = UserProfile.objects.get(user=self.request.user)
            if Item.objects.filter(pk=data, liked_by=user_id):
                return Response({"status": "Item already added in your wishlist."})
            else:
                item_liked.liked_by.add(user_id)
                return Response({"status":"Item added in your wishlist"})
        except:
            return Response({"status": "Item already added in your wishlist."})
    def get(self, request, *args, **kwargs):
        user_id = UserProfile.objects.get(user=self.request.user)
        user_id.item_set.clear()
        return Response({"status": "Wishlist Cleared"})


class RemoveWishlistView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ItemSerializer

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode("utf-8"))
            user_id = UserProfile.objects.get(user=self.request.user)
            item_liked = Item.objects.get(pk=data, liked_by=user_id)
            item_liked.liked_by.remove(user_id)
            return Response({"status":"Item removed from your wishlist"})
        except:
            return Response({"status": "This item is not in your wishlist"})


class DisplayWishlistView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ItemSerializer
    
    def get_queryset(self):
        user_id = UserProfile.objects.get(user=self.request.user)
        return Item.objects.filter(liked_by=user_id)


class PayWithRazorpayView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            order_amount = order.get_total() * 100
            order_currency = "INR"
            receipt = order.ref_code
            list_items = order.all_items()
            notes = {
                "Shipping address": order.billing_address,
                "Billing address": order.shipping_address,
            }
            DATA = {
                "amount": order_amount,
                "receipt": receipt,
                "notes": notes,
                "currency": order_currency,
            }
            client = razorpay.Client(
                auth=(config("RZP_KEY_ID"), config("RZP_KEY_SECRET"))
            )
            razorpay_response_data = client.order.create(data=DATA)
            razorpay_order_id = razorpay_response_data["id"]
            razorpay_order_status = razorpay_response_data["status"]
            return JsonResponse(
                {
                    "id": razorpay_order_id,
                    "status": razorpay_order_status,
                    "name": request.user.username,
                    "email": request.user.email,
                    "list_items": list_items,
                    "amount": order_amount,
                }
            )
        except ObjectDoesNotExist:
            raise Http404("You do not have an active order")

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body.decode("utf-8"))
        try:
            params_dict = {
                "razorpay_payment_id": data["razorpay_payment_id"],
                "razorpay_order_id": data["razorpay_order_id"],
                "razorpay_signature": data["razorpay_signature"],
            }
            client = razorpay.Client(
                auth=(config("RZP_KEY_ID"), config("RZP_KEY_SECRET"))
            )
            status = client.utility.verify_payment_signature(params_dict)
            return JsonResponse({"status": "Payment successful"})

        except:
            return JsonResponse({"status": "Payment failure"})


class UserProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            userdata = User.objects.get(username=request.user)
            return JsonResponse(
                {
                    "status": "Success",
                    "username": userdata.username,
                    "email": userdata.email,
                    "first_name": userdata.first_name,
                    "last_name": userdata.last_name,
                    "date_joined": userdata.date_joined,
                    "birth_date": userdata.birth_date,
                    "country": userdata.country,
                    "contact_number": userdata.contact_number,
                    "about_me": userdata.about_me,
                    "city": userdata.city,
                }
            )
        except ObjectDoesNotExist:
            return JsonResponse(
                {
                    "status": "not able to retrive\
                                 user personal data"
                }
            )

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode("utf-8"))
            userdata = User.objects.get(username=request.user)
            userdata.username = data["username"]
            userdata.email = data["email"]
            userdata.first_name = data["first_name"]
            userdata.last_name = data["last_name"]
            userdata.date_joined = data["date_joined"]
            userdata.birth_date = data["birth_date"]
            userdata.country = data["country"]
            userdata.contact_number = data["contact_number"]
            userdata.about_me = data["about_me"]
            userdata.city = data["city"]
            userdata.save()
            return JsonResponse(
                {
                    "status": "Your Profile Updated \
Successfully."
                }
            )
        except ObjectDoesNotExist:
            return JsonResponse(
                {
                    "status": "Please try again there\
is some probelm."
                }
            )


class SendSmsEmail(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        sentmail = False
        sentsms = False
        try:
            data = json.loads(request.body.decode("utf-8"))
            try:
                subject = "ShopNow Team: Oreder Summary"
                message = " Your order of {} at total price Rs.{} has successfully done \
thanks for using ShopNow. ".format(
                    data["list_items"], data["amount"]
                )
                recepient = data["email"]
                send_mail(
                    subject, message, EMAIL_HOST_USER, [recepient], fail_silently=False
                )
                sentmail = True
            except Exception:
                sentmail = False
            try:
                contact_number = "+91" + request.user.contact_number
                client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
                message = client.messages.create(
                    to=contact_number,
                    from_=TWILIO_FROM_NUMBER,
                    body=message,
                )
                sentsms = True
            except Exception:
                sentsms = False
            return JsonResponse(
                {
                    "status": "success",
                    "sentmail": sentmail,
                    "sentsms": sentsms,
                }
            )
        except ObjectDoesNotExist:
            return JsonResponse(
                {
                    "status": "not success",
                    "sentmail": sentmail,
                    "sentsms": sentsms,
                }
            )
