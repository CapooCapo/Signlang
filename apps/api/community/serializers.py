from rest_framework import serializers
from .models import (
    CommunityPost, PostComment, PostReaction,
    GroupChat, GroupMember, GroupMessage, Notification
)
from users.models import User

class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'avatar', 'role']

class PostCommentSerializer(serializers.ModelSerializer):
    author = UserMinimalSerializer(read_only=True)

    class Meta:
        model = PostComment
        fields = ['id', 'author', 'content', 'created_at']

class CommunityPostSerializer(serializers.ModelSerializer):
    author = UserMinimalSerializer(read_only=True)
    comment_count = serializers.IntegerField(source='comments.count', read_only=True)
    reaction_counts = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()

    class Meta:
        model = CommunityPost
        fields = [
            'id', 'author', 'content', 'post_type', 'image',
            'title', 'price', 'center_name', 'hotline',
            'schedule', 'address', 'website',
            'created_at', 'updated_at', 'comment_count',
            'reaction_counts', 'user_reaction'
        ]

    def get_reaction_counts(self, obj):
        counts = {}
        for r_type in PostReaction.ReactionType.values:
            counts[r_type] = obj.reactions.filter(reaction_type=r_type).count()
        return counts

    def get_user_reaction(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reaction = obj.reactions.filter(user=request.user).first()
            return reaction.reaction_type if reaction else None
        return None

class GroupChatSerializer(serializers.ModelSerializer):
    member_count = serializers.IntegerField(source='memberships.count', read_only=True)
    is_member = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = GroupChat
        fields = [
            'id', 'name', 'description', 'image', 
            'member_count', 'is_member', 'user_role', 'is_owner', 
            'created_at'
        ]

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.memberships.filter(user=request.user).exists()
        return False

    def get_user_role(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            membership = obj.memberships.filter(user=request.user).first()
            return membership.role if membership else None
        return None

    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.created_by == request.user
        return False

class GroupMessageSerializer(serializers.ModelSerializer):
    author = UserMinimalSerializer(read_only=True)

    class Meta:
        model = GroupMessage
        fields = ['id', 'author', 'content', 'image', 'created_at']

class NotificationSerializer(serializers.ModelSerializer):
    sender = UserMinimalSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'sender', 'notification_type', 'post', 'group', 'is_read', 'created_at']
