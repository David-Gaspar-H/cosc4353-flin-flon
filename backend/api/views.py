from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from django.conf import settings
import msal
from django.http import JsonResponse

class MSAuthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        msal_app = msal.ConfidentialClientApplication(
            settings.AZURE_AD['CLIENT_ID'],
            authority=f"https://login.microsoftonline.com/{settings.AZURE_AD['TENANT_ID']}/",
            client_credential=settings.AZURE_AD['CLIENT_SECRET'],
        )
        
        auth_url = msal_app.get_authorization_request_url(
            scopes=settings.AZURE_AD['SCOPES'],
            redirect_uri=settings.AZURE_AD['REDIRECT_URI'],
            state="12345"  # Add proper state handling
        )
        
        return JsonResponse({"auth_url": auth_url})

class MSAuthCallbackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        selected_role = request.data.get('role')
        
        if not code:
            return Response({"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        msal_app = msal.ConfidentialClientApplication(
            settings.AZURE_AD['CLIENT_ID'],
            authority=f"https://login.microsoftonline.com/{settings.AZURE_AD['TENANT_ID']}/",
            client_credential=settings.AZURE_AD['CLIENT_SECRET'],
        )
        
        result = msal_app.acquire_token_by_authorization_code(
            code,
            scopes=settings.AZURE_AD['SCOPES'],
            redirect_uri=settings.AZURE_AD['REDIRECT_URI']
        )
        
        if "error" in result:
            return Response({"error": result.get("error_description")}, 
                          status=status.HTTP_400_BAD_REQUEST)

        # Get user info from Microsoft Graph
        access_token = result['access_token']
        graph_data = self.get_user_info(access_token)
        
        if not graph_data:
            return Response({"error": "Failed to get user info"}, 
                          status=status.HTTP_400_BAD_REQUEST)

        # Create or update user
        user, is_new_user = self.get_or_create_user(graph_data)
        
        # If it's a new user and role is provided, set it
        if is_new_user and selected_role:
            user.role = selected_role
            user.status = 'active'
            user.save()
        
        if user.status == "deactivated":
            return Response({'error': 'deactivated'}, status=status.HTTP_401_UNAUTHORIZED)
        
        login(request, user)
        serializer = UserSerializer(user)
        
        return Response({
            'user': serializer.data,
            'message': 'Login successful',
            'is_new_user': is_new_user
        })

    def get_user_info(self, access_token):
        import requests
        graph_url = 'https://graph.microsoft.com/v1.0/me'
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(graph_url, headers=headers)
        return response.json() if response.status_code == 200 else None

    def get_or_create_user(self, graph_data):
        email = graph_data.get('mail') or graph_data.get('userPrincipalName')
        
        try:
            user = CustomUser.objects.get(email=email)
            # Update existing user's info from Microsoft
            user.first_name = graph_data.get('givenName', user.first_name)
            user.last_name = graph_data.get('surname', user.last_name)
            user.save()
            return user, False  # User exists
        except CustomUser.DoesNotExist:
            # Create new user with default role
            user = CustomUser.objects.create(
                email=email,
                username=email,
                first_name=graph_data.get('givenName', ''),
                last_name=graph_data.get('surname', ''),
                status='pending',  # New users start as pending
                role='basicuser'  # Default role
            )
            return user, True  # New user
    

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