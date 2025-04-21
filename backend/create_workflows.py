from api.models import Unit, Workflow, WorkflowStep  # Replace 'yourapp' with your actual app name

# Get common units
university = Unit.objects.get(name="University")
try:
    hr_dept = Unit.objects.get(name="HR Department")
except Unit.DoesNotExist:
    print("HR Department not found")
    hr_dept = None

try:
    engineering = Unit.objects.get(name="College of Engineering")
except Unit.DoesNotExist:
    print("College of Engineering not found")
    engineering = None

# 1. SSN Change Form Workflow
ssn_workflow = Workflow.objects.create(
    form_type="SSN",
    origin_unit=university,
    name="SSN Change Request Workflow",
    is_active=True
)

WorkflowStep.objects.create(
    workflow=ssn_workflow,
    step_number=1,
    role_required="admin",
    approver_unit=None,
    is_optional=False,
    approvals_required=1
)

# 2. Reduced Course Load Form Workflow
rcl_workflow = Workflow.objects.create(
    form_type="Reduce Course Load",
    origin_unit=university,
    name="Reduced Course Load Approval Workflow",
    is_active=True
)

WorkflowStep.objects.create(
    workflow=rcl_workflow,
    step_number=1,
    role_required="admin",
    approver_unit=None,
    is_optional=False,
    approvals_required=1
)

# 3. FERPA Release Form Workflow
ferpa_workflow = Workflow.objects.create(
    form_type="Ferpa",
    origin_unit=university,
    name="FERPA Release Authorization Workflow",
    is_active=True
)

WorkflowStep.objects.create(
    workflow=ferpa_workflow,
    step_number=1,
    role_required="admin",
    approver_unit=None,
    is_optional=False,
    approvals_required=1
)

print("Created all workflows")