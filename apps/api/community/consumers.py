import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import GroupChat, GroupMember

class CommunityConsumer(AsyncWebsocketConsumer):
    """
    Consumer for the general community feed and personal notifications.
    """
    async def connect(self):
        if self.scope["user"].is_anonymous:
            await self.close()
            return

        self.user_id = self.scope["user"].id
        self.room_group_name = f"user_{self.user_id}"
        self.feed_group_name = "community_feed"

        # Join personal notification group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Join public feed group
        await self.channel_layer.group_add(
            self.feed_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        if hasattr(self, 'feed_group_name'):
            await self.channel_layer.group_discard(
                self.feed_group_name,
                self.channel_name
            )

    # Handlers for events
    async def feed_update(self, event):
        await self.send(text_data=json.dumps(event))

    async def notification_created(self, event):
        await self.send(text_data=json.dumps(event))

class ChatConsumer(AsyncWebsocketConsumer):
    """
    Consumer for group chat messaging.
    """
    async def connect(self):
        if self.scope["user"].is_anonymous:
            await self.close()
            return

        self.group_id = self.scope["url_route"]["kwargs"]["group_id"]
        self.room_group_name = f"chat_{self.group_id}"

        # Check if user is a member of the group
        if await self.is_member(self.scope["user"], self.group_id):
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get("type")

        if message_type == "typing":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "user_typing",
                    "user_id": self.scope["user"].id,
                    "full_name": self.scope["user"].full_name,
                    "is_typing": data.get("is_typing")
                }
            )

    # Handlers
    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    async def user_typing(self, event):
        # Don't send typing status back to the sender
        if event["user_id"] != self.scope["user"].id:
            await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def is_member(self, user, group_id):
        return GroupMember.objects.filter(user=user, group_id=group_id).exists()
