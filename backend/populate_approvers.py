import os
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from api.models import CustomUser, Approver

# Fetch all admin users
admin_users = CustomUser.objects.filter(role="admin")
new_approvers = []

for user in admin_users:
    # Skip if already an approver
    if Approver.objects.filter(user=user).exists():
        continue

    if user.unit:
        new_approvers.append(Approver(user=user, scope="unit", unit=user.unit))
    else:
        new_approvers.append(Approver(user=user, scope="org", unit=None))

Approver.objects.bulk_create(new_approvers)
print(f"✅ Created {len(new_approvers)} approvers (unit/org mix).")
