from rest_framework import generics, status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from .models import CustomUser, Form, Approver, Delegation
from .serializers import (
    UserSerializer,
    FormSerializer,
    ApproverSerializer,
    DelegationSerializer,
)
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from django.conf import settings
import msal
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
import datetime


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS for anyone authenticated
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated

        # Only allow write if the user is admin
        return request.user and request.user.role == "admin"


class MSAuthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        msal_app = msal.ConfidentialClientApplication(
            settings.AZURE_AD["CLIENT_ID"],
            authority=f"https://login.microsoftonline.com/{settings.AZURE_AD['TENANT_ID']}/",
            client_credential=settings.AZURE_AD["CLIENT_SECRET"],
        )

        auth_url = msal_app.get_authorization_request_url(
            scopes=settings.AZURE_AD["SCOPES"],
            redirect_uri=settings.AZURE_AD["REDIRECT_URI"],
            state="12345",  # Add proper state handling
        )

        return JsonResponse({"auth_url": auth_url})


class MSAuthCallbackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get("code")
        selected_role = request.data.get("role")

        if not code:
            return Response(
                {"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        msal_app = msal.ConfidentialClientApplication(
            settings.AZURE_AD["CLIENT_ID"],
            authority=f"https://login.microsoftonline.com/{settings.AZURE_AD['TENANT_ID']}/",
            client_credential=settings.AZURE_AD["CLIENT_SECRET"],
        )

        result = msal_app.acquire_token_by_authorization_code(
            code,
            scopes=settings.AZURE_AD["SCOPES"],
            redirect_uri=settings.AZURE_AD["REDIRECT_URI"],
        )

        if "error" in result:
            return Response(
                {"error": result.get("error_description")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get user info from Microsoft Graph
        access_token = result["access_token"]
        graph_data = self.get_user_info(access_token)

        if not graph_data:
            return Response(
                {"error": "Failed to get user info"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Create or update user
        user, is_new_user = self.get_or_create_user(graph_data)

        # If it's a new user and role is provided, set it
        if is_new_user and selected_role:
            user.role = selected_role
            user.status = "active"
            user.save()

        if selected_role:
            user.role = selected_role
            user.status = "active"
            user.save()

        if user.status == "deactivated":
            return Response(
                {"error": "deactivated"}, status=status.HTTP_401_UNAUTHORIZED
            )

        login(request, user)
        serializer = UserSerializer(user)

        return Response(
            {
                "user": serializer.data,
                "message": "Login successful",
                "is_new_user": is_new_user,
            }
        )

    def get_user_info(self, access_token):
        import requests

        graph_url = "https://graph.microsoft.com/v1.0/me"
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(graph_url, headers=headers)
        return response.json() if response.status_code == 200 else None

    def get_or_create_user(self, graph_data):
        email = graph_data.get("mail") or graph_data.get("userPrincipalName")

        try:
            user = CustomUser.objects.get(email=email)
            # Update existing user's info from Microsoft
            user.first_name = graph_data.get("givenName", user.first_name)
            user.last_name = graph_data.get("surname", user.last_name)
            user.save()
            return user, False  # User exists
        except CustomUser.DoesNotExist:
            # Create new user with default role
            user = CustomUser.objects.create(
                email=email,
                username=email,
                first_name=graph_data.get("givenName", ""),
                last_name=graph_data.get("surname", ""),
                status="pending",  # New users start as pending
                role="basicuser",  # Default role
            )
            return user, True  # New user


class UserListView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        IsAdminUser
    ]  # [IsAdminUser] use this in prod, just no permission rn for easy testing


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        IsAdminUser
    ]  # [IsAdminUser] use this in prod, just no permission rn for easy testing


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.status != "active":
                return Response({"error": "deactivated"}, status=401)
            login(request, user)
            serializer = UserSerializer(user)
            return Response({"user": serializer.data, "message": "Login successful"})
        return Response({"error": "Invalid credentials"}, status=401)


class FormViewSet(viewsets.ModelViewSet):
    serializer_class = FormSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # For list view, try to get user from query parameters
        user_id = self.request.query_params.get("user")
        if user_id:
            return Form.objects.filter(user_id=user_id)
        return Form.objects.all()

    def perform_create(self, serializer):
        # Get user from request data
        user_id = self.request.data.get("user")
        if not user_id:
            raise serializer.ValidationError({"user": "This field is required"})

        try:
            user = CustomUser.objects.get(id=user_id)
            serializer.save(user=user)
        except CustomUser.DoesNotExist:
            raise serializer.ValidationError({"user": "User does not exist"})

    def update(self, request, *args, **kwargs):
        # Get user from request data
        user_id = request.data.get("user")
        if not user_id:
            return Response(
                {"user": "This field is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the user exists
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response(
                {"user": "User does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        # Get the form instance
        instance = self.get_object()

        # Verify the form belongs to the specified user
        if instance.user.id != user.id:
            return Response(
                {"user": "This form does not belong to the specified user"},
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().update(request, *args, **kwargs)


class UserFormsView(generics.ListAPIView):
    serializer_class = FormSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs.get("user_id")
        return Form.objects.filter(user_id=user_id)


class FormSubmitView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, form_id):
        # Get user from request data
        user_id = request.data.get("user")
        if not user_id:
            return Response(
                {"error": "User field is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Get the user
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            form = Form.objects.get(id=form_id)
        except Form.DoesNotExist:
            return Response(
                {"error": f"Form with ID {form_id} does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if form.user.id != user.id:
            return Response(
                {"error": "This form does not belong to the specified user"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if form.status != "draft":
            return Response(
                {"error": "Only forms in draft status can be submitted"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if "required_signatures" not in form.data:
            return Response(
                {"error": "Form missing required_signatures field"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        form.status = "submitted"
        form.save()

        serializer = FormSerializer(form)
        return Response(serializer.data)


class FormApproveView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, form_id):
        # Get admin user from request data
        admin_id = request.data.get("user")
        if not admin_id:
            return Response(
                {"error": "user field is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Get form object
        form = get_object_or_404(Form, id=form_id)

        try:
            # Get the admin user
            admin_user = CustomUser.objects.get(id=admin_id)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        # Check if user is an admin
        if not can_approve(admin_user, form):
            return Response(
                {"error": "You are not authorized to approve this form."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if has_already_approved(admin_user, form):
            return Response(
                {
                    "error": "Approval already submitted by this approver or their delegate"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if form is in submitted status
        if form.status != "submitted":
            return Response(
                {"error": "Only submitted forms can be approved"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        form.data.setdefault("admin_approvals", [])
        form.data.setdefault("approval_log", [])

        # If admin already approved, prevent approval
        admin_id_str = str(admin_user.id)
        if admin_id_str in form.data["admin_approvals"]:
            return Response(
                {"error": "You have already approved this form"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Add admin ID to approvals list
        form.data["admin_approvals"].append(admin_id_str)

        # Sub from required_signatures
        if form.data["required_signatures"] > 0:
            form.data["required_signatures"] -= 1

        # Check sigs
        if form.data["required_signatures"] <= 0:
            form.status = "accepted"
            form.signed_on = datetime.date.today()

        form.data["approval_log"].append(
            {
                "by": str(admin_user.id),
                "name": admin_user.get_full_name(),
                "date": str(datetime.date.today()),
                "delegated": form.approver != admin_user,
            }
        )

        form.save()

        serializer = FormSerializer(form)
        return Response(serializer.data)


class FormRejectView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, form_id):
        # Get admin user from request data
        admin_id = request.data.get("user")
        if not admin_id:
            return Response(
                {"error": "user field is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Get the admin user
            admin_user = CustomUser.objects.get(id=admin_id)

            # Check if user is an admin
            if not can_approve(admin_user, form):
                return Response(
                    {"error": "You are not authorized to reject forms"},
                    status=status.HTTP_403_FORBIDDEN,
                )
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        form = get_object_or_404(Form, id=form_id)

        # Check if form is in submitted status
        if form.status != "submitted":
            return Response(
                {"error": "Only submitted forms can be rejected"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Add rejection reason if we want ot
        if "reason" in request.data:
            form.data["rejection_reason"] = request.data["reason"]

        form.status = "rejected"
        form.save()

        serializer = FormSerializer(form)
        return Response(serializer.data)


class DelegateFormView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, form_id):
        delegate_to_id = request.data.get("delegate_to")
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")

        form = get_object_or_404(Form, id=form_id)
        approver = request.user

        if form.approver != approver:
            return Response(
                {"error": "You are not the approver."}, status=status.HTTP_403_FORBIDDEN
            )

        delegate_to = get_object_or_404(CustomUser, id=delegate_to_id)

        Delegation.objects.create(
            approver=approver,
            delegate_to=delegate_to,
            start_date=start_date,
            end_date=end_date,
        )

        return Response({"message": "Delegation successful"}, status=status.HTTP_200_OK)


class ApproverViewSet(viewsets.ModelViewSet):
    queryset = Approver.objects.all()
    serializer_class = ApproverSerializer
    permission_classes = [IsAdminOrReadOnly]


class DelegationViewSet(viewsets.ModelViewSet):
    queryset = Delegation.objects.all()
    serializer_class = DelegationSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        # Restrict to only delegations for the current user
        return Delegation.objects.filter(approver=self.request.user)


def can_approve(user, form):
    # Check if the user is the approver or has a delegation
    if form.approver == user:
        return True

    # Check if the original approver delegated to this user
    active_delegation = Delegation.objects.filter(
        delegate_to=user,
        start_date__lte=timezone.now().date(),
        end_date__gte=timezone.now().date(),
    ).first()

    if active_delegation:
        return active_delegation.delegate_to == user

    return False


def has_already_approved(user, form):
    approval_ids = form.data.get("admin_approvals", [])
    original_approver_id = str(form.approver.id)

    # Check if the original approver or any of their delegates has approved
    delegate_ids = Delegation.objects.filter(
        approver=form.approver,
        start_date__lte=timezone.now().date(),
        end_date__gte=timezone.now().date(),
    ).values_list("delegate_to_id", flat=True)

    ids_to_check = [original_approver_id] + [str(uid) for uid in delegate_ids]

    return any(approver_id in approval_ids for approver_id in ids_to_check)
