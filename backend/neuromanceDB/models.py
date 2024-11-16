from django.db import models
import uuid

class Individual(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    firstName = models.CharField(max_length=255, blank=True, null=True)
    lastName = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(max_length=255, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)
    
    # THIS IS OUR ALGORITHM
    # TODO: implement a better algorithm
    # function to get the average difference between AF7 and AF8
    def get_average_difference(self):
        # Get all associated brainwave data for this individual
        brainwave_data = self.brainwave_data.all()
        
        # Calculate the average difference between AF7 and AF8
        total_difference = sum(abs(data.af7 - data.af8) for data in brainwave_data)
        count = brainwave_data.count()
        
        return total_difference / count if count > 0 else 0

class BrainwaveData(models.Model):
    individual = models.ForeignKey(Individual, on_delete=models.CASCADE, related_name="brainwave_data")
    time = models.IntegerField()
    af7 = models.IntegerField()
    af8 = models.IntegerField()

    def get_average_difference(self):
        """Calculate the average difference between AF7 and AF8 for this individual"""
        return abs(self.af7 - self.af8)
