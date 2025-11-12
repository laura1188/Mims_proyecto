from django.db import models


class Mensaje(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.EmailField()
    asunto = models.CharField(max_length=150)
    mensaje = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)
    leido = models.BooleanField(default=False)
    aprobado_para_reseña = models.BooleanField(default=False)  # 👈 Nuevo campo

    def __str__(self):
        return f"{self.nombre} - {self.asunto}"


class Reseña(models.Model):
    nombre = models.CharField(max_length=100)
    comentario = models.TextField()
    calificacion = models.IntegerField(default=5)
    fecha = models.DateTimeField(auto_now_add=True)
    visible = models.BooleanField(default=True)
    mensaje_origen = models.OneToOneField(
        Mensaje, on_delete=models.SET_NULL, null=True, blank=True, related_name="reseña_origen"
    )

    def __str__(self):
        return f"{self.nombre} ({self.calificacion}⭐)"
