from rest_framework import viewsets, generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Factura, DetalleFactura
from inventario.models import Medicamento
from usuarios.models import Usuario
from .serializers import FacturaSerializer, DetalleFacturaSerializer
from .permissions import EsEmpleadoOAdministrador


# ===============================
# 🔹 CRUD de Facturas
# ===============================
class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all().order_by('-fecha_emision')
    serializer_class = FacturaSerializer
    permission_classes = [EsEmpleadoOAdministrador]

    def perform_create(self, serializer):
        """Al crear una factura, asigna el empleado autenticado automáticamente"""
        empleado = self.request.user if self.request.user.is_authenticated else None
        serializer.save(empleado=empleado)


# ===============================
# 🔹 CRUD de Detalles de Factura
# ===============================
class DetalleFacturaViewSet(viewsets.ModelViewSet):
    queryset = DetalleFactura.objects.all()
    serializer_class = DetalleFacturaSerializer
    permission_classes = [EsEmpleadoOAdministrador]


# ===============================
# 🧾 Registrar Factura manual (versión APIView)
# ===============================
class RegistrarFacturaView(APIView):
    permission_classes = [EsEmpleadoOAdministrador]

    def post(self, request):
        data = request.data

        try:
            cliente_id = data.get("cliente")
            cliente = get_object_or_404(Usuario, id=cliente_id)

            factura = Factura.objects.create(
                cliente=cliente,
                empleado=request.user if request.user.is_authenticated else None,
                metodo_pago=data.get("metodo_pago", "efectivo"),
                direccion_entrega=data.get("direccion_entrega", ""),
                observaciones=data.get("observaciones", ""),
                total=data.get("total", 0)
            )

            detalles = data.get("detalles", [])
            for d in detalles:
                medicamento_id = d.get("medicamento")
                medicamento = get_object_or_404(Medicamento, id=medicamento_id)

                DetalleFactura.objects.create(
                    factura=factura,
                    medicamento=medicamento,
                    cantidad=d.get("cantidad", 1),
                    precio_unitario=d.get("precio_unitario", 0),
                    subtotal=d.get("subtotal", 0)
                )

            return Response(
                {"mensaje": "Factura registrada correctamente", "factura_id": factura.id},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ===============================
# 📋 Listar todas las facturas (empleados/admin)
# ===============================
class FacturaListView(generics.ListAPIView):
    queryset = Factura.objects.all().order_by('-fecha_emision')
    serializer_class = FacturaSerializer
    permission_classes = [EsEmpleadoOAdministrador]


# ===============================
# 💊 Listar Detalles
# ===============================
class DetalleFacturaListView(generics.ListAPIView):
    queryset = DetalleFactura.objects.all()
    serializer_class = DetalleFacturaSerializer
    permission_classes = [EsEmpleadoOAdministrador]


# ===============================
# 🧍 Historial del Cliente autenticado
# ===============================
class HistorialFacturasView(generics.ListAPIView):
    serializer_class = FacturaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Devuelve solo las facturas del cliente logueado"""
        return Factura.objects.filter(cliente=self.request.user).order_by('-fecha_emision')


# ===============================
# 👨‍💼 Facturas por rol del usuario autenticado
# ===============================
class MisFacturasView(generics.ListAPIView):
    serializer_class = FacturaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.rol == "empleado":
            # Facturas que registró el empleado
            return Factura.objects.filter(empleado=user).order_by('-fecha_emision')

        elif user.rol == "administrador":
            # Todas las facturas
            return Factura.objects.all().order_by('-fecha_emision')

        elif user.rol == "cliente":
            # Solo las del cliente
            return Factura.objects.filter(cliente=user).order_by('-fecha_emision')

        return Factura.objects.none()
