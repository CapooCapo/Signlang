import os
import django
import random
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from community.models import CommunityPost, GroupChat, GroupMember, GroupMessage, PostComment, PostReaction

def seed_data():
    print("Seeding mock data...")
    
    # 1. Ensure we have users
    passwords = ['pass123', 'securePass!', 'admin123']
    roles = [User.Roles.USER, User.Roles.LECTURER, User.Roles.CENTER]
    
    users = []
    for i in range(10):
        email = f'user{i}@example.com'
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'full_name': f'User {i}',
                'role': random.choice(roles),
                'is_active': True,
                'is_verified': True
            }
        )
        if created:
            user.set_password('pass123')
            user.save()
        users.append(user)

    # 2. Create Groups
    group_names = ['Beginner Sign Language', 'Deaf Community Vietnam', 'ASL Practice', 'Daily Conversation', 'Jobs for Deaf']
    groups = []
    for name in group_names:
        group, created = GroupChat.objects.get_or_create(
            name=name,
            defaults={
                'description': f'Welcome to {name}! A place to learn and share.',
                'created_by': users[0]
            }
        )
        groups.append(group)
        # Add members
        for user in users:
            GroupMember.objects.get_or_create(group=group, user=user)

    # 3. Create Posts
    post_types = CommunityPost.PostType.choices
    for i in range(20):
        author = random.choice(users)
        p_type = random.choice([t[0] for t in post_types])
        
        post = CommunityPost.objects.create(
            author=author,
            content=f"This is a mock post number {i}. Sharing some sign language tips!",
            post_type=p_type,
            title=f"Mock Title {i}" if p_type == 'COURSE_PROMOTION' else None,
            price=random.randint(500000, 2000000) if p_type == 'COURSE_PROMOTION' else None,
            center_name="Sign Academy" if p_type == 'COURSE_PROMOTION' else None,
            hotline="0901234567" if p_type == 'COURSE_PROMOTION' else None,
            address="District 1, HCMC" if p_type == 'COURSE_PROMOTION' else None
        )
        
        # Add some comments
        for j in range(random.randint(0, 5)):
            PostComment.objects.create(
                post=post,
                author=random.choice(users),
                content=f"Cool post! Comment {j}"
            )
            
        # Add some reactions
        for user in random.sample(users, random.randint(0, 5)):
            PostReaction.objects.get_or_create(post=post, user=user, reaction_type='LIKE')

    print("Successfully seeded 20 posts, 5 groups, and 10 users.")

if __name__ == "__main__":
    seed_data()
