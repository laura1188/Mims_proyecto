from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FacturaViewSet,
    DetalleFacturaViewSet,
    RegistrarFacturaView,
    FacturaListView,
    HistorialFacturasView,
    MisFacturasView,
)

# 🔹 Router para CRUD automático
router = DefaultRouter()
router.register(r'crud', FacturaViewSet, basename='factura-crud')
router.register(r'detalles-crud', DetalleFacturaViewSet, basename='detalle-crud')

urlpatterns = [
    path("registrar/", RegistrarFacturaView.as_view(), name="registrar_factura"),
    path("listar/", FacturaListView.as_view(), name="listar_facturas"),
    path("historial/", HistorialFacturasView.as_view(), name="historial_facturas"),
    path("mis-facturas/", MisFacturasView.as_view(), name="mis_facturas"),

    # Incluye las rutas del CRUD
    path("", include(router.urls)),
]
