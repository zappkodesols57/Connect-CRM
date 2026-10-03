from rest_framework import serializers
from .models import MonthlyCalendar, CalendarItem, ItemActivity

class ItemActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemActivity
        fields = '__all__'

class CalendarItemSerializer(serializers.ModelSerializer):
    activities = ItemActivitySerializer(many=True, read_only=True)
    class Meta:
        model = CalendarItem
        fields = '__all__'

class MonthlyCalendarSerializer(serializers.ModelSerializer):
    items = CalendarItemSerializer(many=True, read_only=True)
    class Meta:
        model = MonthlyCalendar
        fields = '__all__'
