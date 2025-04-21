import os
import django
import random

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth.hashers import make_password
from api.models import CustomUser, Unit

ORG_LEVEL_COUNT = 10
UNIT_LEVEL_COUNT = 10
new_users = []

# Fetch all units to randomly assign
units = list(Unit.objects.all())
if not units:
    raise Exception(
        "❌ No units found in the database. Add units before running this script."
    )

org_created = 0
unit_created = 0
i = 70

# Keep generating until we hit the target counts
while org_created < ORG_LEVEL_COUNT or unit_created < UNIT_LEVEL_COUNT:
    email = f"admin{i}@example.com"
    if not CustomUser.objects.filter(email=email).exists():
        if org_created < ORG_LEVEL_COUNT:
            user = CustomUser(
                username=f"admin{i}",
                email=email,
                role="admin",
                status="active",
                unit=None,  # Org-level
                password=make_password("adminpass123"),
            )
            org_created += 1
        else:
            user = CustomUser(
                username=f"admin{i}",
                email=email,
                role="admin",
                status="active",
                unit=random.choice(units),  # Unit-level
                password=make_password("adminpass123"),
            )
            unit_created += 1

        new_users.append(user)
    i += 1

CustomUser.objects.bulk_create(new_users)
print(f"✅ Created {org_created} org-level and {unit_created} unit-level dummy admins.")
