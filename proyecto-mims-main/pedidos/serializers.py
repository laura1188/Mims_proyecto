from rest_framework import serializers
from .models import Pedido, DetallePedido
from inventario.serializer import MedicamentoSerializer

class DetallePedidoSerializer(serializers.ModelSerializer):
    medicamento = MedicamentoSerializer(read_only=True)
    medicamento_id = serializers.PrimaryKeyRelatedField(
        queryset=MedicamentoSerializer.Meta.model.objects.all(),
        source="medicamento",
        write_only=True
    )

    class Meta:
        model = DetallePedido
        fields = ["id", "medicamento", "medicamento_id", "cantidad", "subtotal"]

class PedidoSerializer(serializers.ModelSerializer):
    detalles = DetallePedidoSerializer(many=True, read_only=True)
    detalles_data = DetallePedidoSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = Pedido
        fields = ["id", "cliente", "fecha_creacion", "estado", "total", "detalles", "detalles_data"]

    def create(self, validated_data):
        detalles_data = validated_data.pop("detalles_data", [])
        pedido = Pedido.objects.create(**validated_data)
        total = 0

        for detalle_data in detalles_data:
            medicamento = detalle_data["medicamento"]
            cantidad = detalle_data["cantidad"]
            subtotal = medicamento.precio_venta * cantidad
            DetallePedido.objects.create(
                pedido=pedido, medicamento=medicamento, cantidad=cantidad, subtotal=subtotal
            )
            total += subtotal

        pedido.total = total
        pedido.save()
        return pedido

    def update(self, instance, validated_data):
        detalles_data = validated_data.pop("detalles_data", [])
        instance.estado = validated_data.get("estado", instance.estado)
        instance.save()

        if detalles_data:
            instance.detalles.all().delete()
            total = 0
            for detalle_data in detalles_data:
                medicamento = detalle_data["medicamento"]
                cantidad = detalle_data["cantidad"]
                subtotal = medicamento.precio_venta * cantidad
                DetallePedido.objects.create(
                    pedido=instance, medicamento=medicamento, cantidad=cantidad, subtotal=subtotal
                )
                total += subtotal
            instance.total = total
            instance.save()

        return instance
