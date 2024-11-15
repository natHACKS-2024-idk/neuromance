from rest_framework import serializers
from .models import Individual, BrainwaveData

class BrainwaveDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrainwaveData
        fields = ['time', 'af7', 'af8']

class IndividualSerializer(serializers.ModelSerializer):
    brainwave_data = BrainwaveDataSerializer(many=True, read_only=True)

    class Meta:
        model = Individual
        fields = ['id', 'name', 'brainwave_data']  

class MatchmakingSerializer(serializers.Serializer):
    user = IndividualSerializer()  # Serialize the individual user data
    similarity_score = serializers.FloatField()  