from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Rol  # ✅ importa el modelo Rol

Usuario = get_user_model()


# =========================
# SERIALIZER DE USUARIO
# =========================
class UsuarioSerializer(serializers.ModelSerializer):
    # ✅ Si el usuario tiene una FK a Rol, muestra los datos del rol
    rol_detalle = serializers.StringRelatedField(source="rol", read_only=True)

    class Meta:
        model = Usuario
        fields = [
            "id",
            "username",
            "email",
            "password",
            "nombre_completo",
            "telefono",
            "direccion",
            "rol",           # puede ser FK o campo tipo CharField, según tu modelo
            "rol_detalle",   # se mostrará solo para lectura
            "num_doc",
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        """Crear usuario con contraseña encriptada"""
        password = validated_data.pop("password", None)
        usuario = self.Meta.model(**validated_data)
        if password:
            usuario.set_password(password)
        usuario.save()
        return usuario

    def update(self, instance, validated_data):
        """Actualizar usuario (con manejo de contraseña)"""
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


# =========================
# SERIALIZER DE ROL
# =========================
class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = "__all__"
