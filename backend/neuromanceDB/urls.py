from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path("", views.index, name="index"),
    path("api/register/", Register.as_view(), name="register"),
    path("api/users/<uuid:uuid>/", GetUser.as_view(), name="get_user"),
    path("api/saveBrainwaveData/<uuid:uuid>", SaveBrainwaveData.as_view(), name="save_brainwave_data"),
]