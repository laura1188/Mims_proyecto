from rest_framework import permissions

class EsEmpleadoOAdministrador(permissions.BasePermission):
    """
    Permite acceso total solo a empleados y administradores.
    Los clientes pueden ver pero no crear, editar o eliminar.
    """

    def has_permission(self, request, view):
        user = request.user

        # Si no está autenticado → acceso solo lectura (GET)
        if not user.is_authenticated:
            return request.method in permissions.SAFE_METHODS

        # Administrador o empleado → acceso total
        if user.rol in ["administrador", "empleado"]:
            return True

        # Cliente → solo puede ver
        return request.method in permissions.SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        user = request.user

        # Admin y empleado → acceso total
        if user.rol in ["administrador", "empleado"]:
            return True

        # Cliente → solo puede ver sus propias facturas
        if user.rol == "cliente":
            return request.method in permissions.SAFE_METHODS and obj.cliente == user

        return False
