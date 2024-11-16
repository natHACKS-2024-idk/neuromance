from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Individual
from .serializers import IndividualSerializer
from django.http import HttpResponse

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