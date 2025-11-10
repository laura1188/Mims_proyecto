from django.contrib import admin
from .models import Pedido, DetallePedido

# =========================
# 💊 Inline para Detalles de Pedido
# =========================
class DetallePedidoInline(admin.TabularInline):
    model = DetallePedido
    extra = 1  # Muestra 1 línea vacía adicional para agregar fácilmente
    can_delete = True  # Permitir eliminar detalles desde el admin


# =========================
# 📦 Admin del Pedido
# =========================
@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'cliente', 'fecha_creacion', 'estado', 'total', 'ver_detalles')
    list_filter = ('estado', 'fecha_creacion')
    search_fields = ('cliente__username',)
    inlines = [DetallePedidoInline]
    ordering = ('-fecha_creacion',)

    def ver_detalles(self, obj):
        """Muestra los medicamentos y cantidades de cada pedido."""
        return ", ".join([f"{d.medicamento.nombre} x{d.cantidad}" for d in obj.detalles.all()])
    ver_detalles.short_description = "Detalles del Pedido"


# =========================
# 🧾 Admin independiente de DetallePedido (opcional)
# =========================
@admin.register(DetallePedido)
class DetallePedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'pedido', 'medicamento', 'cantidad', 'subtotal')
    search_fields = ('pedido__cliente__username', 'medicamento__nombre')
    list_filter = ('pedido__estado',)
