from rest_framework import serializers
from .models import CustomUser, Form, Unit, Approver


class FormSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Form
        fields = ["id", "user", "user_id", "username", "status", "signed_on", "data"]
        read_only_fields = ["id", "user_id", "username"]


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
        if self.instance is None and Approver.objects.filter(user=user).exists():
            raise serializers.ValidationError(
                "This user already has an approver scope assigned."
            )
        return data


class UserSerializer(serializers.ModelSerializer):
    forms = FormSerializer(many=True, read_only=True)

    # For reading/displaying the full unit details in a GET request
    unit = UnitSerializer(read_only=True)

    approvers = ApproverSerializer(many=True, read_only=True)

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
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "signature": {"read_only": True},
        }

    def create(self, validated_data):
        unit = validated_data.pop("unit", None)
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
        return user
