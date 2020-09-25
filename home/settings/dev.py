'''Use this for development'''

from .base import *
from decouple import config
import dj_database_url

ALLOWED_HOSTS += ['127.0.0.1']
DEBUG = True

WSGI_APPLICATION = 'home.wsgi.dev.application'

DATABASES = {
    'default': dj_database_url.config(default=config('DATABASE_URL'))
}

CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
)

# Stripe

STRIPE_PUBLIC_KEY = config('STRIPE_TEST_PUBLIC_KEY')
STRIPE_SECRET_KEY = config('STRIPE_TEST_SECRET_KEY')
