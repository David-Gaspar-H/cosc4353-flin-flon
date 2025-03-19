from rest_framework import serializers
from .models import CustomUser, Form

class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = ['id', 'user', 'status', 'signed_on', 'data']
        read_only_fields = ['id']

class UserSerializer(serializers.ModelSerializer):
    forms = FormSerializer(many=True, read_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'role', 'status', 'first_name', 'last_name', 'forms']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'basicuser'),
            status=validated_data.get('status', 'active'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user