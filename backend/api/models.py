from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import JSONField  # For Django >= 3.1
from django.core.exceptions import ValidationError


# Create your models here.
class CustomUser(AbstractUser):
    status = models.CharField(max_length=20, default="active")
    role = models.CharField(max_length=20, default="basicuser")
    signature = models.BinaryField(null=True, blank=True)
    unit = models.ForeignKey(
        "Unit", null=True, blank=True, on_delete=models.SET_NULL, related_name="users"
    )

    def __str__(self):
        return self.email


class Form(models.Model):
    # Define status choices
    STATUS_CHOICES = [
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
        ("draft", "Draft"),
        ("submitted", "Submitted"),
    ]

    # Foreign key to the CustomUser model
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="forms")

    # Status field with predefined choices
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="draft")

    # Date field for when the form was signed
    signed_on = models.DateField(null=True, blank=True)

    # JSON field to store JSON data
    data = JSONField(default=dict)  # Use JSONField for Django >= 3.1

    # Matches form with a specific approval workflow
    type = models.CharField(max_length=100, default="general")

    def __str__(self):
        return f"Form {self.id} - {self.status}"


class Unit(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subunits",
    )

    class Meta:
        verbose_name = "Organizational Unit"
        verbose_name_plural = "Organizational Units"

    def __str__(self):
        return self.name


class Approver(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    scope = models.CharField(
        max_length=5,
        choices=[("unit", "Unit"), ("org", "Organization")],
        default="unit",
    )
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.user} - {self.scope} approver"

    def clean(self):
        # Ensures unit is set for unit-level approvers
        if self.scope == "unit" and not self.unit:
            raise ValidationError("Unit-level approvers must have a unit assigned.")

        # Ensures unit is not set for org-level approvers
        if self.scope == "org" and self.unit:
            raise ValidationError(
                "Organizational-level approvers should not be assigned to a specific unit."
            )

        # Enforces "one approver per user" rule, user is either org-level or unit-level approver
        if Approver.objects.exclude(pk=self.pk).filter(user=self.user).exists():
            raise ValidationError("This user already has an approver scope assigned.")

    class Meta:
        verbose_name = "Approver"
        verbose_name_plural = "Approvers"


class Delegation(models.Model):
    approver = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="delegator"
    )
    delegate_to = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="delegatee"
    )

    form = models.ForeignKey(
        Form, 
        on_delete=models.CASCADE,
        related_name="delegations",
        verbose_name="Associated Form"
    )
    
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"{self.approver} delegated to {self.delegate_to} from {self.start_date} to {self.end_date}."

    class Meta:
        verbose_name = "Delegator"
        verbose_name_plural = "Delegators"


class Workflow(models.Model):
    form_type = models.CharField(max_length=100)
    origin_unit = models.ForeignKey(Unit, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Workflow"
        verbose_name_plural = "Workflows"

    def __str__(self):
        return f"{self.name} ({self.form_type} from {self.origin_unit})"


class WorkflowStep(models.Model):
    workflow = models.ForeignKey(
        Workflow, related_name="steps", on_delete=models.CASCADE
    )
    step_number = models.PositiveIntegerField()
    role_required = models.CharField(max_length=100)  # e.g. dept-chair
    approver_unit = models.ForeignKey(
        Unit, null=True, blank=True, on_delete=models.SET_NULL
    )
    is_optional = models.BooleanField(default=False)
    approvals_required = models.PositiveIntegerField(
        default=1
    )  # number of approvals needed

    class Meta:
        ordering = ["step_number"]

    def __str__(self):
        return f"{self.workflow.name} - Step {self.step_number}"


class FormApprovalStep(models.Model):
    form = models.ForeignKey(
        Form, on_delete=models.CASCADE, related_name="approval_steps"
    )
    step_number = models.PositiveIntegerField()
    approver = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    approved_on = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["step_number"]
