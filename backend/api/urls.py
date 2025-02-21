from django.urls import path
from .views import UserListView, UserDetailView, LoginView, MSAuthCallbackView, MSAuthView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('login/', LoginView.as_view(), name='login'),
    path('ms-auth/', MSAuthView.as_view(), name='ms-auth'),
    path('ms-auth/callback/', MSAuthCallbackView.as_view(), name='ms-auth-callback'),
]