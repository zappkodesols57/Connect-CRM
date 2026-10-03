from django.db import models

class Client(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=100, unique=True)
    code = models.CharField(max_length=50, blank=True)
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    primary_color = models.CharField(max_length=20, default="#1E3A8A")
    industry = models.CharField(max_length=100, blank=True)
    
    # Contract Deliverables Quota
    target_creatives = models.PositiveIntegerField(default=15)
    target_reels = models.PositiveIntegerField(default=10)
    target_stories = models.PositiveIntegerField(default=30)
    special_notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
