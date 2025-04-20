from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Unit, Approver, Workflow, WorkflowStep


class UnitAdmin(admin.ModelAdmin):
    list_display = ("name", "parent")
    search_fields = ("name",)
    list_filter = ("parent",)


admin.site.register(Unit, UnitAdmin)


class CustomUserAdmin(UserAdmin):
    list_display = ("email", "username", "role", "status", "unit", "is_staff")
    list_filter = ("role", "status", "unit", "is_staff", "is_superuser")
    fieldsets = UserAdmin.fieldsets + (
        ("Custom Fields", {"fields": ("role", "status", "unit")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Custom Fields", {"fields": ("role", "status", "unit")}),
    )


admin.site.register(CustomUser, CustomUserAdmin)


class ApproverAdmin(admin.ModelAdmin):
    list_display = ("user", "scope", "unit")
    list_filter = ("scope", "unit")
    search_fields = ("user__username", "user__email")


admin.site.register(Approver, ApproverAdmin)


class WorkflowAdmin(admin.ModelAdmin):
    list_display = ("name", "form_type", "origin_unit", "is_active")
    search_fields = ("name", "form_type", "origin_unit")


admin.site.register(Workflow, WorkflowAdmin)


class WorkflowStepAdmin(admin.ModelAdmin):
    list_display = (
        "workflow",
        "step_number",
        "role_required",
        "approver_unit",
        "approvals_required",
        "is_optional",
    )
    list_filter = ("workflow",)
    ordering = ("workflow", "step_number")


admin.site.register(WorkflowStep, WorkflowStepAdmin)
