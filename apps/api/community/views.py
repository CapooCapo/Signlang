from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from .models import (
    CommunityPost, PostComment, PostReaction,
    GroupChat, GroupMember, GroupMessage, Notification
)
from .serializers import (
    CommunityPostSerializer, PostCommentSerializer,
    GroupChatSerializer, GroupMessageSerializer, NotificationSerializer
)
from .services import broadcast_new_post, broadcast_new_comment, broadcast_group_message, send_notification

class PostViewSet(viewsets.ModelViewSet):
    queryset = CommunityPost.objects.all()
    serializer_class = CommunityPostSerializer

    def perform_create(self, serializer):
        post = serializer.save(author=self.request.user)
        broadcast_new_post(post)

    @decorators.action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        post = self.get_object()
        serializer = PostCommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(author=request.user, post=post)
            broadcast_new_comment(comment)
            
            # Notify post author
            if post.author != request.user:
                notif = Notification.objects.create(
                    user=post.author,
                    sender=request.user,
                    notification_type=Notification.NotificationType.NEW_COMMENT,
                    post=post
                )
                send_notification(notif)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @decorators.action(detail=True, methods=['post'])
    def react(self, request, pk=None):
        post = self.get_object()
        r_type = request.data.get('type', PostReaction.ReactionType.LIKE)
        reaction, created = PostReaction.objects.update_or_create(
            post=post, user=request.user,
            defaults={'reaction_type': r_type}
        )
        
        if created and post.author != request.user:
            notif = Notification.objects.create(
                user=post.author,
                sender=request.user,
                notification_type=Notification.NotificationType.NEW_REACTION,
                post=post
            )
            send_notification(notif)
            
        return Response({'status': 'reacted'})

class GroupViewSet(viewsets.ModelViewSet):
    queryset = GroupChat.objects.all()
    serializer_class = GroupChatSerializer

    def perform_create(self, serializer):
        group = serializer.save(created_by=self.request.user)
        GroupMember.objects.create(group=group, user=self.request.user, role=GroupMember.Role.ADMIN)

    @decorators.action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        group = self.get_object()
        GroupMember.objects.get_or_create(group=group, user=request.user)
        return Response({'status': 'joined'})

    @decorators.action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        group = self.get_object()
        GroupMember.objects.filter(group=group, user=request.user).delete()
        return Response({'status': 'left'})

    @decorators.action(detail=True, methods=['get', 'post'])
    def messages(self, request, pk=None):
        group = self.get_object()
        if request.method == 'GET':
            messages = group.messages.all()[:50]
            serializer = GroupMessageSerializer(messages, many=True)
            return Response(serializer.data)
        
        serializer = GroupMessageSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.save(author=request.user, group=group)
            broadcast_group_message(message)
            
            # Notify other members? (Maybe too many, skipping for now)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @decorators.action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user).update(is_read=True)
        return Response({'status': 'all read'})
