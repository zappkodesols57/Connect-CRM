from rest_framework import viewsets
from .models import Client
from .serializers import ClientSerializer
from rest_framework.permissions import AllowAny

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [AllowAny]
