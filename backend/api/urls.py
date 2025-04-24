from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    UserListView,
    AdminListView,
    UserDetailView,
    LoginView,
    MSAuthView,
    MSAuthCallbackView,
    FormViewSet,
    UserFormsView,
    FormSubmitView,
    FormApproveView,
    FormRejectView,
    FormDetailReportView,
    updateWorkflowView
)

router = DefaultRouter()
router.register(r"forms", views.FormViewSet, basename="form")
router.register(r"approvers", views.ApproverViewSet, basename="approver")
router.register(r"delegations", views.DelegationViewSet, basename="delegation")
router.register(r"workflows", views.WorkflowViewSet, basename="workflow")
router.register(r"workflow-steps", views.WorkflowStepViewSet, basename="workflow-step")
router.register(r"units", views.UnitViewSet, basename="unit")

urlpatterns = [
    path("users/", UserListView.as_view(), name="user-list"),
    ##Added by Iker to get all admins
    path("users/admins/", AdminListView.as_view(), name="admin-list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("login/", LoginView.as_view(), name="login"),
    path("ms-auth/", MSAuthView.as_view(), name="ms-auth"),
    path("ms-auth/callback/", MSAuthCallbackView.as_view(), name="ms-auth-callback"),
    path("", include(router.urls)),
    path("users/<int:user_id>/forms/", UserFormsView.as_view(), name="user-forms"),
    path("forms/<int:form_id>/submit/", FormSubmitView.as_view(), name="form-submit"),
    path(
        "forms/<int:form_id>/approve/", FormApproveView.as_view(), name="form-approve"
    ),
    path("forms/<int:form_id>/reject/", FormRejectView.as_view(), name="form-reject"),
    path("reports/", views.ApprovalReportView.as_view(), name="approval-reports"),
    path(
        "pending-approvals/",
        views.PendingApprovalsView.as_view(),
        name="pending-approvals",
    ),
    path("units/hierarchy/", views.UnitHierarchyView.as_view(), name="unit-hierarchy"),
    #added to get all units on the system
    path("units/", views.UnitListView.as_view(), name="unit"),
    #added to update the rules that the admins modify
    path('workflows/<int:workflow_id>/update/', updateWorkflowView.as_view(), name='update-workflow'),

    path(
        "units/top-level/",
        views.UnitViewSet.as_view({"get": "top_level"}),
        name="unit-top-level",
    ),
    path(
        "units/<int:unit_id>/hierarchy/",
        views.UnitHierarchyView.as_view(),
        name="unit-specific-hierarchy",
    ),
    path(
        "forms/<int:form_id>/delegate/",
        views.DelegateFormView.as_view(),
        name="form-delegate",
    ),
    path(
        "forms/<int:form_id>/eligible-delegates/",
        views.EligibleDelegatesView.as_view(),
        name="eligible-delegates",
    ),
    path("forms/<int:pk>/report/", FormDetailReportView.as_view(), name="form-report"),
]
