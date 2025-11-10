from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoriaViewSet,
    MedicamentoViewSet,
    MovimientoInventarioViewSet,
    MedicamentoListView,
    MedicamentoCreateView,
    MedicamentoDetailView,
    MedicamentoListPublicAPIView,
)

# =========================
# 🚀 Router para CRUD automáticos (ViewSets)
# =========================
router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'medicamentos-crud', MedicamentoViewSet, basename='medicamento-crud')
router.register(r'movimientos', MovimientoInventarioViewSet, basename='movimiento-inventario')

# =========================
# 🌐 URL patterns
# =========================
urlpatterns = [
    # 🔹 API protegida (empleado/admin)
    path("medicamentos/", MedicamentoListView.as_view(), name="medicamentos_lista"),
    path("medicamentos/crear/", MedicamentoCreateView.as_view(), name="medicamento_crear"),
    path("medicamentos/<int:pk>/", MedicamentoDetailView.as_view(), name="medicamento_detalle"),

    # 🔹 API pública (catálogo)
    path("catalogo/", MedicamentoListPublicAPIView.as_view(), name="catalogo_api"),

    # 🔹 Incluye las rutas automáticas del router
    path("", include(router.urls)),
]
