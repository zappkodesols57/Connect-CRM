import datetime
from django.core.management.base import BaseCommand
from crm_core.models import Client, MonthlyCalendar, CalendarItem

class Command(BaseCommand):
    help = "Seed initial client data and October 2026 content calendars"

    def handle(self, *args, **options):
        self.stdout.write("Seeding clients and calendars...")

        # 1. Nelson Luxe Hospital
        nelson, _ = Client.objects.get_or_create(
            slug="nelson",
            defaults={
                "name": "Nelson Luxe Hospital",
                "code": "NELSON",
                "primary_color": "#1E3A8A",
                "industry": "Healthcare & Maternity",
                "target_creatives": 30,
                "target_reels": 20,
                "target_stories": 30,
                "special_notes": "Focus on Pink October Breast Cancer Awareness and Doctor Branding."
            }
        )

        nelson_cal, _ = MonthlyCalendar.objects.get_or_create(
            client=nelson,
            month="October",
            year=2026,
            defaults={
                "title": "Nelson Luxe Hospital - October 2026 Content Schedule",
                "status": "SHARED",
                "target_creatives": 30,
                "target_reels": 20,
                "target_stories": 30
            }
        )

        nelson_items = [
            {
                "sr_no": 1,
                "scheduled_date": datetime.date(2026, 10, 1),
                "day_of_week": "Thursday",
                "special_day": "Pink October Begins",
                "content_pillar": "Women’s Health",
                "format": "IMAGE",
                "visual_brief": "Clean female-health visuals, doctor silhouette + pink ribbon + Nelson Luxe branding",
                "reel_bytes_script": "Slide 1: Your health deserves your attention. Slide 2: Know what is normal. Slide 3: Don't ignore changes. Slide 4: Consult specialist.",
                "caption": "October is more than a month of awareness. It is a reminder to listen to your body and choose timely care over delay. #PinkOctober #NelsonHospital",
                "status": "APPROVED",
                "media_type": "image",
                "media_url": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
            },
            {
                "sr_no": 2,
                "scheduled_date": datetime.date(2026, 10, 2),
                "day_of_week": "Friday",
                "special_day": "Gandhi Jayanti",
                "content_pillar": "Doctor Branding",
                "format": "REEL",
                "visual_brief": "Doctor talking directly to camera highlighting breast health points with Nelson branding",
                "reel_bytes_script": "Hook: One thing every woman should know about her breast health... Doctor gives 3 simple awareness points. End: If you notice unusual changes, speak to a doctor.",
                "caption": "Expert insights from Dr. Shalini. Prioritize your wellbeing with routine clinical screenings. #DoctorTalks #NelsonLuxe",
                "status": "READY_FOR_CLIENT",
                "media_type": "reel",
                "media_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            },
            {
                "sr_no": 3,
                "scheduled_date": datetime.date(2026, 10, 3),
                "day_of_week": "Saturday",
                "special_day": "—",
                "content_pillar": "Awareness",
                "format": "CAROUSEL",
                "visual_brief": "5-Slide Carousel: Myth vs Fact on self-examination and mammograms",
                "reel_bytes_script": "Slide 1: Breast cancer only happens after 50? Myth Busted. Slide 2: Early detection changes outcomes. Slide 3: Screenings schedule. Slide 4: Warning signs. Slide 5: Talk to our specialists.",
                "caption": "Not every change means illness, but every unusual change deserves medical attention. Swipe to learn the facts. #HealthMyths #NelsonCare",
                "status": "CHANGES_REQ",
                "media_type": "carousel",
                "media_url": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80"
            },
            {
                "sr_no": 4,
                "scheduled_date": datetime.date(2026, 10, 4),
                "day_of_week": "Sunday",
                "special_day": "—",
                "content_pillar": "Hospital Trust",
                "format": "REEL",
                "visual_brief": "Suite room view & patient care experience walk-through with warm ambient lighting",
                "reel_bytes_script": "Ever wondered what patient-first healthcare feels like? Experience Nelson Luxe care. Comfort, compassion, and surgical excellence.",
                "caption": "Care Beyond Treatment. Luxury comfort with 24/7 expert medical support. #HospitalStay #NelsonLuxeCare",
                "status": "READY_FOR_CLIENT",
                "media_type": "reel",
                "media_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            },
            {
                "sr_no": 5,
                "scheduled_date": datetime.date(2026, 10, 5),
                "day_of_week": "Monday",
                "special_day": "World Smile Day",
                "content_pillar": "Care Beyond Treatment",
                "format": "IMAGE",
                "visual_brief": "Smiling nursing staff with recovered patient testimonial quote",
                "reel_bytes_script": "Their smiles are our greatest achievement. Compassionate healing every day.",
                "caption": "A warm smile is medicine in itself. Grateful for our patients' trust. #PatientSmiles #NelsonHospital",
                "status": "APPROVED",
                "media_type": "image",
                "media_url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
            }
        ]

        for item_data in nelson_items:
            CalendarItem.objects.update_or_create(
                calendar=nelson_cal,
                sr_no=item_data["sr_no"],
                defaults=item_data
            )

        # 2. Kohinoor TEZ
        kohinoor, _ = Client.objects.get_or_create(
            slug="kohinoor",
            defaults={
                "name": "Kohinoor TEZ",
                "code": "KOHINOOR",
                "primary_color": "#D97706",
                "industry": "Education & Student Publishing",
                "target_creatives": 15,
                "target_reels": 10,
                "target_stories": 30,
                "special_notes": "Target Class 5-12 students for midterm exam revision."
            }
        )

        kohinoor_cal, _ = MonthlyCalendar.objects.get_or_create(
            client=kohinoor,
            month="October",
            year=2026,
            defaults={
                "title": "Kohinoor TEZ - October 2026 Content Schedule",
                "status": "SHARED",
                "target_creatives": 15,
                "target_reels": 10,
                "target_stories": 30
            }
        )

        kohinoor_items = [
            {
                "sr_no": 1,
                "scheduled_date": datetime.date(2026, 10, 1),
                "day_of_week": "Thursday",
                "special_day": "New Month Goals",
                "content_pillar": "Student Tips",
                "format": "IMAGE",
                "visual_brief": "Clean smart-study graphic for Class 5-12 students with Kohinoor Tez Notes",
                "reel_bytes_script": "New Month. New Goals. Better Preparation. Class 5–12 smart study & quick revision.",
                "caption": "Make October your highest-scoring month! Order your Tez notes today. #KohinoorTez #StudySmart",
                "status": "APPROVED",
                "media_type": "image",
                "media_url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80"
            },
            {
                "sr_no": 2,
                "scheduled_date": datetime.date(2026, 10, 2),
                "day_of_week": "Friday",
                "special_day": "Gandhi Jayanti",
                "content_pillar": "Inspirational",
                "format": "IMAGE",
                "visual_brief": "Gandhi Jayanti commemorative post with discipline quote for students",
                "reel_bytes_script": "Be the change you wish to see in your results. Discipline + consistent practice.",
                "caption": "Happy Gandhi Jayanti! Empower your study journey with disciplined revision. #StudyMotivation",
                "status": "APPROVED",
                "media_type": "image",
                "media_url": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80"
            },
            {
                "sr_no": 3,
                "scheduled_date": datetime.date(2026, 10, 4),
                "day_of_week": "Sunday",
                "special_day": "Exam Countdown",
                "content_pillar": "Exam Hacks",
                "format": "REEL",
                "visual_brief": "Student rushing with heavy books vs opening compact Tez pocket notes",
                "reel_bytes_script": "Mid-term exams starting and syllabus still pending? Switch to Kohinoor Tez quick revision.",
                "caption": "No heavy books needed! Complete syllabus in half the time. #ExamHacks #TezNotes",
                "status": "READY_FOR_CLIENT",
                "media_type": "reel",
                "media_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            }
        ]

        for item_data in kohinoor_items:
            CalendarItem.objects.update_or_create(
                calendar=kohinoor_cal,
                sr_no=item_data["sr_no"],
                defaults=item_data
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded Nelson Luxe Hospital and Kohinoor TEZ!"))
