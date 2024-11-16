from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Individual
from .serializers import IndividualSerializer
from django.http import HttpResponse
from django.shortcuts import get_object_or_404

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