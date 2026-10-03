from django.db import models
from clients.models import Client
from django.conf import settings

class MonthlyCalendar(models.Model):
    STATUS_CHOICES = [
        ('PLANNING', 'Planning'),
        ('SHARED', 'Shared with Client'),
        ('APPROVED', 'Approved by Client'),
        ('LOCKED', 'Locked'),
    ]

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='calendars')
    month = models.CharField(max_length=50, default='October')
    year = models.PositiveIntegerField(default=2026)
    title = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PLANNING')
    
    target_creatives = models.PositiveIntegerField(default=15)
    target_reels = models.PositiveIntegerField(default=10)
    target_stories = models.PositiveIntegerField(default=30)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('client', 'month', 'year')

    def __str__(self):
        return f"{self.client.name} - {self.month} {self.year}"

class CalendarItem(models.Model):
    FORMAT_CHOICES = [
        ('IMAGE', 'Single Image Creative'),
        ('REEL', 'Vertical Video Reel'),
        ('CAROUSEL', 'Multi-Slide Carousel'),
        ('STORY', 'Story Graphic'),
    ]

    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('IN_PROGRESS', 'In Progress (Team)'),
        ('SUBMITTED', 'Submitted by Team'),
        ('INTERNAL_APPROVED', 'Internal Approved'),
        ('READY_FOR_CLIENT', 'Ready for Client'),
        ('CHANGES_REQ', 'Changes Requested'),
        ('APPROVED', 'Approved'),
        ('PUBLISHED', 'Published'),
    ]

    CATEGORY_CHOICES = [
        ('REGULAR', 'Regular Quota'),
        ('EXTRA', 'Extra / Bonus Slot'),
    ]

    PRIORITY_CHOICES = [
        ('NORMAL', 'Normal'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High Priority'),
    ]

    calendar = models.ForeignKey(MonthlyCalendar, on_delete=models.CASCADE, related_name='items')
    sr_no = models.PositiveIntegerField(default=1)
    scheduled_date = models.DateField()
    scheduled_time = models.CharField(max_length=20, default='11:00 AM', blank=True, null=True)
    day_of_week = models.CharField(max_length=20, blank=True)
    special_day = models.CharField(max_length=255, blank=True, null=True)
    content_pillar = models.CharField(max_length=150, default='General')
    format = models.CharField(max_length=20, choices=FORMAT_CHOICES, default='IMAGE')
    post_category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='REGULAR')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='NORMAL')
    brand = models.CharField(max_length=100, blank=True, null=True)
    
    visual_brief = models.TextField(blank=True, null=True)
    reel_bytes_script = models.TextField(blank=True, null=True)
    caption = models.TextField(blank=True, null=True)
    hashtags = models.TextField(blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='READY_FOR_CLIENT')
    
    media_type = models.CharField(max_length=20, default='image')
    media_url = models.URLField(max_length=1000, blank=True, null=True)
    uploaded_asset_url = models.URLField(max_length=1000, blank=True, null=True)
    suggestion = models.TextField(blank=True, null=True)

    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_items')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['scheduled_date', 'scheduled_time', 'sr_no']

    def __str__(self):
        return f"#{self.sr_no} {self.scheduled_date} - {self.calendar.client.name}"

class ItemActivity(models.Model):
    item = models.ForeignKey(CalendarItem, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=50)
    comment_text = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} on Item #{self.item.sr_no}"
