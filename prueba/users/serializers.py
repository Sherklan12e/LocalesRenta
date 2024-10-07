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
    email = serializers.EmailField(source='user.email', read_only=True)
    profile_picture = serializers.ImageField(max_length=None, use_url=True)

    class Meta:
        model = Profile
        fields = ['id', 'username', 'email', 'bio', 'profile_picture', 'location','facebook','instagram']

