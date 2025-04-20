from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Unit, Approver


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
