from django.db import models
import uuid

class Individual(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    firstName = models.CharField(max_length=255, blank=True, null=True)
    lastName = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(max_length=255, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)

class BrainwaveData(models.Model):
    individual = models.ForeignKey(Individual, on_delete=models.CASCADE, related_name="brainwave_data")
    time = models.FloatField()  
    af7 = models.FloatField()   
    af8 = models.FloatField() 

