from rest_framework import serializers
from .models import Client, MonthlyCalendar, CalendarItem, ItemActivity, Employee, AdHocTask

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class ItemActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemActivity
        fields = '__all__'

class CalendarItemSerializer(serializers.ModelSerializer):
    activities = ItemActivitySerializer(many=True, read_only=True)
    assigned_to_details = EmployeeSerializer(source='assigned_to', read_only=True)

    class Meta:
        model = CalendarItem
        fields = '__all__'

class MonthlyCalendarSerializer(serializers.ModelSerializer):
    items = CalendarItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    approved_items = serializers.SerializerMethodField()

    class Meta:
        model = MonthlyCalendar
        fields = '__all__'

    def get_total_items(self, obj):
        return obj.items.count()

    def get_approved_items(self, obj):
        return obj.items.filter(status='APPROVED').count()

class ClientSerializer(serializers.ModelSerializer):
    calendars = MonthlyCalendarSerializer(many=True, read_only=True)
    active_calendar = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = '__all__'

    def get_active_calendar(self, obj):
        latest = obj.calendars.order_by('-year', '-created_at').first()
        if latest:
            return {
                'id': latest.id,
                'month': latest.month,
                'year': latest.year,
                'status': latest.status,
                'total_items': latest.items.count(),
                'approved_items': latest.items.filter(status='APPROVED').count(),
                'target_creatives': latest.target_creatives,
                'target_reels': latest.target_reels,
            }
        return None

class AdHocTaskSerializer(serializers.ModelSerializer):
    assigned_to_details = EmployeeSerializer(source='assigned_to', read_only=True)

    class Meta:
        model = AdHocTask
        fields = '__all__'
