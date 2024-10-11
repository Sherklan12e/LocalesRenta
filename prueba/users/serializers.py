from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Post, Profile

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id','username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        Profile.objects.create(user=user)
        return user

class PostSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'username', 'content', 'created_at']
        read_only_fields = ['created_at']

    def get_username(self, obj):
        return obj.user.username



class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = Profile
        fields = ['username', 'bio', 'profile_picture', 'location', 'facebook', 'instagram']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        if 'username' in user_data:
            instance.user.username = user_data['username']
            instance.user.save()

        return super().update(instance, validated_data)