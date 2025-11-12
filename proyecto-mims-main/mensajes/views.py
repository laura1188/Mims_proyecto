from rest_framework import viewsets
from .models import Mensaje, Reseña
from .serializers import MensajeSerializer, ReseñaSerializer
from rest_framework.response import Response
from rest_framework import status


# 📩 Vista para Mensajes (contacto)
class MensajeViewSet(viewsets.ModelViewSet):
    queryset = Mensaje.objects.all().order_by('-fecha_envio')
    serializer_class = MensajeSerializer


# 🌟 Vista para Reseñas (opiniones visibles)
class ReseñaViewSet(viewsets.ModelViewSet):
    queryset = Reseña.objects.filter(visible=True).order_by('-fecha')
    serializer_class = ReseñaSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
