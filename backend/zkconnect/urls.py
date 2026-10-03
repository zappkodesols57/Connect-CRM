from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/crm/', include('clients.urls')),
    path('api/content/', include('content.urls')),
]
