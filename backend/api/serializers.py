from rest_framework import serializers
from .models import CustomUser, Form

class FormSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Form
        fields = ['id', 'user', 'user_id', 'username', 'status', 'signed_on', 'data']
        read_only_fields = ['id', 'user_id', 'username']

class UserSerializer(serializers.ModelSerializer):
    forms = FormSerializer(many=True, read_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'role', 'status', 'first_name', 'last_name', 'forms', 'signature']
        extra_kwargs = {
            'password': {'write_only': True},
            'signature': {'read_only': True}
        }

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