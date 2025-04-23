# Run script from terminal with python backend/create_hr_admins.py

import os
import django
import random

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from api.models import CustomUser, Unit, Approver
from django.contrib.auth.hashers import make_password

# Load the HR Department unit
hr_unit = Unit.objects.get(id=18)

# Define dummy user data
dummy_users = [
    {
        "username": f"hr_admin{i}",
        "email": f"hr_admin{i}@example.com",
        "first_name": f"HR Admin{i}",
        "last_name": "Doe",
    }
    for i in range(1, 6)
]

created_users = []

for user_data in dummy_users:
    # Create the user
    user = CustomUser.objects.create(
        username=user_data["username"],
        email=user_data["email"],
        first_name=user_data["first_name"],
        last_name=user_data["last_name"],
        role="staff",
        status="active",
        password=make_password("adminpass1234"),
        unit=hr_unit,
    )
    created_users.append(user)

    # Add to Approvers table as unit-level approver
    Approver.objects.create(user=user, scope="unit", unit=hr_unit)

print(
    f"✅ Created {len(created_users)} HR approvers for unit {hr_unit.name} (id={hr_unit.id})"
)
