from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.contrib.auth import views as auth_views
from social_login.views import GoogleLogin, GithubLogin

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    url(r'^accounts/', include('allauth.urls'), name='socialaccount_signup'),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('admin/', admin.site.urls),
    path('api/', include('core.api.urls')),
    path('forgotpasswordconfirm/', include('django.contrib.auth.urls')),
    path('rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('rest-auth/github/', GithubLogin.as_view(), name='github_login'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += url('', TemplateView.as_view(template_name='index.html')),
