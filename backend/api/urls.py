from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    UserListView, UserDetailView, LoginView, 
    MSAuthView, MSAuthCallbackView,
    FormViewSet, UserFormsView, 
    FormSubmitView, FormApproveView, FormRejectView
)

router = DefaultRouter()
router.register(r'forms', views.FormViewSet, basename='form')

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('login/', LoginView.as_view(), name='login'),
    path('ms-auth/', MSAuthView.as_view(), name='ms-auth'),
    path('ms-auth/callback/', MSAuthCallbackView.as_view(), name='ms-auth-callback'),

    path('', include(router.urls)),
    path('users/<int:user_id>/forms/', UserFormsView.as_view(), name='user-forms'),
    path('forms/<int:form_id>/submit/', FormSubmitView.as_view(), name='form-submit'),
    path('forms/<int:form_id>/approve/', FormApproveView.as_view(), name='form-approve'),
    path('forms/<int:form_id>/reject/', FormRejectView.as_view(), name='form-reject'),
]