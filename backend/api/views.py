from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from .models import CustomUser, Form
from .serializers import UserSerializer, FormSerializer
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from django.conf import settings
import msal
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import datetime

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

        if selected_role:
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
    permission_classes = [AllowAny]  # [IsAdminUser] use this in prod, just no permission rn for easy testing 

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # [IsAdminUser] use this in prod, just no permission rn for easy testing 

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

class FormViewSet(viewsets.ModelViewSet):
    serializer_class = FormSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Admin users can see all submitted forms that they haven't approved yet
        if user.role == 'admin':
            # Get forms that are submitted and not yet fully approved
            # Exclude forms where the admin has already approved
            submitted_forms = Form.objects.filter(status='submitted')
            # Filter out forms where admin has already approved
            admin_id = str(user.id)
            forms_to_show = []
            for form in submitted_forms:
                admin_approvals = form.data.get('admin_approvals', [])
                if admin_id not in admin_approvals:
                    forms_to_show.append(form.id)
            
            return Form.objects.filter(id__in=forms_to_show)
        
        # Basic users can only see their own forms
        return Form.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserFormsView(generics.ListAPIView):
    serializer_class = FormSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        # Check if the requesting user is an admin or the owner of the forms
        if self.request.user.role == 'admin' or str(self.request.user.id) == user_id:
            return Form.objects.filter(user_id=user_id)
        return Form.objects.none()

class FormSubmitView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, form_id):
        form = get_object_or_404(Form, id=form_id, user=request.user)
        
        # Check if the form is in draft status
        if form.status != 'draft':
            return Response(
                {"error": "Only forms in draft status can be submitted"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Required_signatures field exists in data
        if 'required_signatures' not in form.data:
            return Response(
                {"error": "Form missing required_signatures field"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set the form to submitted status
        form.status = 'submitted'
        form.save()
        
        serializer = FormSerializer(form)
        return Response(serializer.data)

class FormApproveView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, form_id):
        # User is an admin
        if request.user.role != 'admin':
            return Response(
                {"error": "Only administrators can approve forms"}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        form = get_object_or_404(Form, id=form_id)
        admin_user = request.user
        
        # Check if form is in submitted status
        if form.status != 'submitted':
            return Response(
                {"error": "Only submitted forms can be approved"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if this admin has already approved this form
        # store admin approvals in 'admin_approvals' list in the data field
        if 'admin_approvals' not in form.data:
            form.data['admin_approvals'] = []
            
        # If admin already approved, no duplicate approval
        admin_id = str(admin_user.id)
        if admin_id in form.data['admin_approvals']:
            return Response(
                {"error": "You have already approved this form"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Add admin ID to approvals list
        form.data['admin_approvals'].append(admin_id)
        
        # subtract from required_signatures
        if form.data['required_signatures'] > 0:
            form.data['required_signatures'] -= 1
            
        # Check if all required signatures are collected
        if form.data['required_signatures'] <= 0:
            form.status = 'accepted'
            form.signed_on = datetime.date.today()
            
        form.save()
        
        serializer = FormSerializer(form)
        return Response(serializer.data)

class FormRejectView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, form_id):
        # Ensure user is an admin
        if request.user.role != 'admin':
            return Response(
                {"error": "Only administrators can reject forms"}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        form = get_object_or_404(Form, id=form_id)
        
        # Check if form has submitted status
        if form.status != 'submitted':
            return Response(
                {"error": "Only submitted forms can be rejected"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Rejection reason if we want to do that 
        if 'reason' in request.data:
            form.data['rejection_reason'] = request.data['reason']
            
        form.status = 'rejected'
        form.save()
        
        serializer = FormSerializer(form)
        return Response(serializer.data)