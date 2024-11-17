from rest_framework import serializers
from .models import Individual, BrainwaveData


class BrainwaveDataSerializer(serializers.ModelSerializer):
    time = serializers.FloatField()  
    af7 = serializers.FloatField()   
    af8 = serializers.FloatField()   

    class Meta:
        model = BrainwaveData
        fields = ['time', 'af7', 'af8']
        
    def create(self, validated_data):
        # Cast the float values to integers before saving them to the model
        validated_data['time'] = int(validated_data['time'])
        validated_data['af7'] = int(validated_data['af7'])
        validated_data['af8'] = int(validated_data['af8'])
        
        # Save the data as usual
        return super().create(validated_data)


class IndividualSerializer(serializers.ModelSerializer):
    # brainwave_data = BrainwaveDataSerializer(many=True, read_only=True)

    class Meta:
        model = Individual
        fields = ['id', 'firstName', 'lastName', 'email', 'age', 'password']  
