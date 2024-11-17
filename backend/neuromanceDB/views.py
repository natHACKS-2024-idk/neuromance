from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Individual
from .serializers import IndividualSerializer, BrainwaveDataSerializer
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import status

def index(request):
    return HttpResponse("Hello, world.")

class MatchmakingView(APIView):
    def get(self, request, uuid):
        user = Individual.objects.get(id=uuid)
        
        # Get all users except the current user
        other_users = Individual.objects.exclude(id=uuid)
        
        # Compare the current user with each other user
        match_scores = []
        for other_user in other_users:
            similarity_score = compare_users(user, other_user)
            match_scores.append({
                'user': IndividualSerializer(other_user).data,
                'similarity_score': similarity_score
            })
        
        # Sort by similarity score (lower score means better match)
        match_scores = sorted(match_scores, key=lambda x: x['similarity_score'])

        return Response(match_scores)
    
class Register(APIView):
    """
    POST individual user data
    path: /api/register/
    
    Example POST data:
    {
        "firstName": "John",
        "lastName": "Doe",
        "email": "
        "age": 25,
        "password": "password"
    }
    """
    def post(self, request):
        serializer = IndividualSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
class GetUser(APIView):
    """
    GET individual user data by UUID
    path: /api/users/<uuid:uuid>/
    """
    def get(self, request, uuid):
        user = get_object_or_404(Individual, id=uuid)
        serializer = IndividualSerializer(user)
        return Response(serializer.data, status=200)
    
class SaveBrainwaveData(APIView):
    """
    POST brainwave data for a specific user
    """
    def post(self, request, uuid):
        # Get the user (Individual) by UUID
        user = get_object_or_404(Individual, id=uuid)

        # Extract the recordings list from the request data
        recordings = request.data.get('recordings', [])

        # Validate and save each recording
        saved_data = []
        for recording in recordings:
            # Prepare the data for the serializer (convert field names to match model fields)
            recording_data = {
                "time": recording["timestamp"],
                "af7": recording["AF7"],
                "af8": recording["AF8"]
            }

            # Serialize each recording
            serializer = BrainwaveDataSerializer(data=recording_data)
            if serializer.is_valid():
                # Save each valid recording, associating it with the user (individual)
                serializer.save(individual=user)
                saved_data.append(serializer.data)
            else:
                # If any of the recordings are invalid, return errors
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # If all recordings are saved successfully, return the saved data
        return Response(saved_data, status=status.HTTP_201_CREATED)
