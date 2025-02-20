from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login

class UserListView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]# [IsAdminUser] use this in prod, just no permission rn for easy testing 

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]# [IsAdminUser] use this in prod, just no permission rn for easy testing 

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.status != "active":
                return Response({'error': 'deactivated'}, status=401)
            login(request, user)
            serializer = UserSerializer(user)
            return Response({
                'user': serializer.data,
                'message': 'Login successful'
            })
        return Response({
            'error': 'Invalid credentials'
        }, status=401)