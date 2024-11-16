from django.contrib import admin

# Register your models here.

from .models import Individual, BrainwaveData

admin.site.register(Individual)
admin.site.register(BrainwaveData)
