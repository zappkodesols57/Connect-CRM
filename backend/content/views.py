from rest_framework import viewsets
from .models import MonthlyCalendar, CalendarItem, ItemActivity
from .serializers import MonthlyCalendarSerializer, CalendarItemSerializer, ItemActivitySerializer
from rest_framework.permissions import AllowAny

class MonthlyCalendarViewSet(viewsets.ModelViewSet):
    queryset = MonthlyCalendar.objects.all()
    serializer_class = MonthlyCalendarSerializer
    permission_classes = [AllowAny]

class CalendarItemViewSet(viewsets.ModelViewSet):
    queryset = CalendarItem.objects.all()
    serializer_class = CalendarItemSerializer
    permission_classes = [AllowAny]

class ItemActivityViewSet(viewsets.ModelViewSet):
    queryset = ItemActivity.objects.all()
    serializer_class = ItemActivitySerializer
    permission_classes = [AllowAny]
