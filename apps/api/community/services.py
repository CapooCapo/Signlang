from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .serializers import CommunityPostSerializer, PostCommentSerializer, GroupMessageSerializer, NotificationSerializer

def broadcast_new_post(post):
    channel_layer = get_channel_layer()
    serializer = CommunityPostSerializer(post)
    async_to_sync(channel_layer.group_send)(
        "community_feed",
        {
            "type": "feed_update",
            "action": "new_post",
            "data": serializer.data
        }
    )

def broadcast_new_comment(comment):
    channel_layer = get_channel_layer()
    serializer = PostCommentSerializer(comment)
    async_to_sync(channel_layer.group_send)(
        "community_feed",
        {
            "type": "feed_update",
            "action": "new_comment",
            "post_id": comment.post.id,
            "data": serializer.data
        }
    )

def broadcast_group_message(message):
    channel_layer = get_channel_layer()
    serializer = GroupMessageSerializer(message)
    async_to_sync(channel_layer.group_send)(
        f"chat_{message.group.id}",
        {
            "type": "chat_message",
            "data": serializer.data
        }
    )

def send_notification(notification):
    channel_layer = get_channel_layer()
    serializer = NotificationSerializer(notification)
    async_to_sync(channel_layer.group_send)(
        f"user_{notification.user.id}",
        {
            "type": "notification_created",
            "data": serializer.data
        }
    )
