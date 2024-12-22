from django.contrib import admin
from django.urls import path
from predict_app.views import PredictPrice  # Correct import from 'predict_app.views'

urlpatterns = [
    path("admin/", admin.site.urls),
    path('predict/', PredictPrice.as_view(), name='predict'),
]
