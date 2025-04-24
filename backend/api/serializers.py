from rest_framework import serializers
from .models import (
    CustomUser,
    Form,
    Unit,
    Approver,
    Delegation,
    Workflow,
    WorkflowStep,
    FormApprovalStep,
)
from django.utils import timezone
from django.db.models import Q


class FormSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    is_delegated = serializers.SerializerMethodField()

    class Meta:
        model = Form
        fields = [
            "id",
            "user",
            "user_id",
            "username",
            "status",
            "signed_on",
            "data",
            "type",
            "is_delegated",
        ]
        read_only_fields = ["id", "user_id", "username"]

    # def get_is_delegated(self, form):
    #     request = self.context.get("request", None)
    #     if not request or not request.user or request.user.is_anonymous:
    #         return False

    #     today = timezone.now().date()
    #     is_delegated = Delegation.objects.filter(
    #         form=form,
    #         delegate_to=request.user,
    #         start_date__lte=today,
    #         end_date__gte=today,
    #     ).exists()

    #     print(
    #         f"[is_delegated] Form ID: {form.id} | User: {request.user.username} | Result: {is_delegated}"
    #     )
    #     return is_delegated

    def get_is_delegated(self, form):
        user = self.context.get("user", None)

        if not user:
            return False

        today = timezone.now().date()

        return (
            Delegation.objects.filter(form=form)
            .filter(
                Q(approver=user) | Q(delegate_to=user),
                start_date__lte=today,
                end_date__gte=today,
            )
            .exists()
        )


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ["id", "name", "parent"]


class ApproverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Approver
        fields = ["id", "user", "scope", "unit"]

    def validate(self, data):
        user = data.get("user")
        scope = data.get("scope")
        unit = data.get("unit")

        # One approver per user rule check
        if self.instance is None and Approver.objects.filter(user=user).exists():
            raise serializers.ValidationError(
                "This user already has an approver scope assigned."
            )

        # Org-level approver should NOT have a unit
        if scope == "org" and unit is not None:
            raise serializers.ValidationError(
                "Organizational-level approvers should not have a unit assigned."
            )

        # Unit-level approver MUST have a unit
        if scope == "unit" and unit is None:
            raise serializers.ValidationError(
                "Unit-level approvers must have a unit assigned."
            )

        return data


class DelegationSerializer(serializers.ModelSerializer):
    approver = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    delegate_to = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        model = Delegation
        fields = ["approver", "delegate_to", "start_date", "end_date"]


class UserSerializer(serializers.ModelSerializer):
    forms = FormSerializer(many=True, read_only=True)

    # For reading/displaying the full details in a GET request
    unit = UnitSerializer(read_only=True)

    approvers = ApproverSerializer(many=True, read_only=True)
    approver_data = serializers.DictField(write_only=True, required=False)

    # Allows user assignment to a unit by just using the unit's ID (POST/PUT)
    unit_id = serializers.PrimaryKeyRelatedField(
        queryset=Unit.objects.all(), source="unit", write_only=True, required=False
    )

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "password",
            "role",
            "status",
            "first_name",
            "last_name",
            "forms",
            "signature",
            "unit",
            "unit_id",
            "approvers",
            "approver_data",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "signature": {"read_only": True},
        }

    def create(self, validated_data):
        unit = validated_data.pop("unit", None)
        approver_data = validated_data.pop("approver_data", None)
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data.get("role", "basicuser"),
            status=validated_data.get("status", "active"),
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            unit=unit,
        )

        # Create and validate approver object for the user if provided
        if approver_data:
            approver_data["user"] = user
            serializer = ApproverSerializer(data=approver_data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return user


class WorkflowStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowStep
        fields = [
            "id",
            "step_number",
            "role_required",
            "approver_unit",
            "is_optional",
            "approvals_required",
        ]


class WorkflowSerializer(serializers.ModelSerializer):
    steps = WorkflowStepSerializer(many=True, read_only=True)

    class Meta:
        model = Workflow
        fields = ["id", "name", "form_type", "origin_unit", "is_active", "steps"]


class FormApprovalStepSerializer(serializers.ModelSerializer):
    approver = serializers.StringRelatedField()
    unit = serializers.SerializerMethodField()

    class Meta:
        model = FormApprovalStep
        fields = ["step_number", "approver", "unit", "is_completed", "approved_on"]

    def get_unit(self, obj):
        return obj.approver.unit.name if obj.approver.unit else None


class FormDetailReportSerializer(serializers.ModelSerializer):
    submitted_by = serializers.StringRelatedField(source="user")
    approval_steps = FormApprovalStepSerializer(many=True, read_only=True)

    class Meta:
        model = Form
        fields = ["id", "type", "status", "signed_on", "submitted_by", "approval_steps"]
