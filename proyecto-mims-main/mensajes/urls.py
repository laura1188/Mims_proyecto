from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MensajeViewSet, ReseñaViewSet

router = DefaultRouter()
router.register(r'mensajes', MensajeViewSet, basename='mensaje')
router.register(r'resenas', ReseñaViewSet, basename='resena')

urlpatterns = [
    path('', include(router.urls)),
]
