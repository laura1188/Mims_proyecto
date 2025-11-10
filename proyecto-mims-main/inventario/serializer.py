from rest_framework import serializers
from .models import Medicamento, Categoria, MovimientoInventario

# ==========================
# 🧩 SERIALIZER DE CATEGORÍA
# ==========================
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion', 'activo']


# ==========================
# 💊 SERIALIZER DE MEDICAMENTO
# ==========================
class MedicamentoSerializer(serializers.ModelSerializer):
    # Mostrar información de categoría
    categoria = CategoriaSerializer(read_only=True)
    # Permitir enviar solo el ID al crear/editar
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(),
        source='categoria',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Medicamento
        fields = [
            'id',
            'nombre',
            'descripcion',
            'precio_venta',
            'stock_actual',
            'stock_minimo',
            'categoria',
            'categoria_id',
            'fecha_vencimiento',
            'estado',
            'imagen_url',
        ]

    def to_representation(self, instance):
        """Personaliza la respuesta para mostrar categoría simplificada."""
        data = super().to_representation(instance)
        if instance.categoria:
            data['categoria'] = {
                'id': instance.categoria.id,
                'nombre': instance.categoria.nombre,
            }
        return data


# ===================================
# 📦 SERIALIZER DE MOVIMIENTO INVENTARIO
# ===================================
class MovimientoInventarioSerializer(serializers.ModelSerializer):
    medicamento = MedicamentoSerializer(read_only=True)
    medicamento_id = serializers.PrimaryKeyRelatedField(
        queryset=Medicamento.objects.all(),
        source='medicamento',
        write_only=True,
        required=True
    )

    class Meta:
        model = MovimientoInventario
        fields = [
            'id',
            'tipo_movimiento',
            'cantidad',
            'fecha_movimiento',
            'medicamento',
            'medicamento_id',
        ]
