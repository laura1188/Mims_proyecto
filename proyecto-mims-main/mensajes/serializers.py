from rest_framework import serializers
from .models import Mensaje, Reseña


class MensajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mensaje
        fields = '__all__'


class ReseñaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reseña
        fields = '__all__'
