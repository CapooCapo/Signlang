from django.db import models
from django.conf import settings
from django.utils import timezone

class CommunityPost(models.Model):
    class PostType(models.TextChoices):
        NORMAL = "NORMAL_POST", "Normal Post"
        COURSE_PROMOTION = "COURSE_PROMOTION", "Course Promotion"
        QUESTION = "QUESTION", "Question"
        EVENT = "EVENT", "Event"
        SEEKING_PARTNER = "SEEKING_PARTNER", "Seeking Partner"
        ANNOUNCEMENT = "ANNOUNCEMENT", "Announcement"

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    post_type = models.CharField(max_length=50, choices=PostType.choices, default=PostType.NORMAL)
    image = models.URLField(max_length=500, blank=True, null=True)
    
    # Promotion specific fields
    title = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True)
    center_name = models.CharField(max_length=255, blank=True, null=True)
    hotline = models.CharField(max_length=20, blank=True, null=True)
    schedule = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    website = models.URLField(max_length=500, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.author.email} - {self.post_type} ({self.id})"

class PostComment(models.Model):
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

class PostReaction(models.Model):
    class ReactionType(models.TextChoices):
        LIKE = "LIKE", "Like"
        LOVE = "LOVE", "Love"
        HAHA = "HAHA", "Haha"
        WOW = "WOW", "Wow"
        SAD = "SAD", "Sad"
        ANGRY = "ANGRY", "Angry"

    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name="reactions")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    reaction_type = models.CharField(max_length=20, choices=ReactionType.choices, default=ReactionType.LIKE)

    class Meta:
        unique_together = ("post", "user")

class GroupChat(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.URLField(max_length=500, blank=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="created_groups")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class GroupMember(models.Model):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        MODERATOR = "MODERATOR", "Moderator"
        MEMBER = "MEMBER", "Member"

    group = models.ForeignKey(GroupChat, on_delete=models.CASCADE, related_name="memberships")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.MEMBER)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("group", "user")

class GroupMessage(models.Model):
    group = models.ForeignKey(GroupChat, on_delete=models.CASCADE, related_name="messages")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    image = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

class Notification(models.Model):
    class NotificationType(models.TextChoices):
        NEW_COMMENT = "NEW_COMMENT", "New Comment"
        NEW_REACTION = "NEW_REACTION", "New Reaction"
        NEW_MESSAGE = "NEW_MESSAGE", "New Message"
        GROUP_INVITATION = "GROUP_INVITATION", "Group Invitation"
        NEW_COURSE = "NEW_COURSE", "New Course Promotion"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_notifications")
    notification_type = models.CharField(max_length=50, choices=NotificationType.choices)
    
    # Optional relations based on type
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, null=True, blank=True)
    group = models.ForeignKey(GroupChat, on_delete=models.CASCADE, null=True, blank=True)
    message = models.ForeignKey(GroupMessage, on_delete=models.CASCADE, null=True, blank=True)
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
