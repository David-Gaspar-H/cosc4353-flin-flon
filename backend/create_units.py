# create_units.py
from api.models import Unit  # Replace 'yourapp' with your actual app name

# Clear existing units (optional)
Unit.objects.all().delete()

# Create university (root unit)
university = Unit.objects.create(name="University")

# Create colleges
college_engineering = Unit.objects.create(
    name="College of Engineering",
    parent=university
)
college_arts = Unit.objects.create(
    name="College of Arts & Sciences",
    parent=university
)
administration = Unit.objects.create(
    name="Administration",
    parent=university
)
research = Unit.objects.create(
    name="Research Centers",
    parent=university
)

# Engineering departments
cs_dept = Unit.objects.create(
    name="Department of Computer Science",
    parent=college_engineering
)
me_dept = Unit.objects.create(
    name="Department of Mechanical Engineering",
    parent=college_engineering
)

# CS subunits
Unit.objects.create(name="Faculty", parent=cs_dept)
Unit.objects.create(name="Administrative Staff", parent=cs_dept)
Unit.objects.create(name="Students", parent=cs_dept)

# ME subunits
Unit.objects.create(name="Faculty", parent=me_dept)
Unit.objects.create(name="Staff", parent=me_dept)

# Arts & Sciences departments
Unit.objects.create(name="Department of Mathematics", parent=college_arts)
Unit.objects.create(name="Department of Physics", parent=college_arts)
Unit.objects.create(name="Department of History", parent=college_arts)

# Administration departments
Unit.objects.create(name="HR Department", parent=administration)
Unit.objects.create(name="Finance Department", parent=administration)
Unit.objects.create(name="IT", parent=administration)

print('Successfully created university organization structure')