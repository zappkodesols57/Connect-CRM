from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MonthlyCalendarViewSet, CalendarItemViewSet, ItemActivityViewSet

router = DefaultRouter()
router.register(r'calendars', MonthlyCalendarViewSet, basename='calendar')
router.register(r'items', CalendarItemViewSet, basename='calendaritem')
router.register(r'activities', ItemActivityViewSet, basename='activity')

urlpatterns = [
    path('', include(router.urls)),
]
