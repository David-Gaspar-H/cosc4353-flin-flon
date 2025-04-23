from .models import (
    CustomUser,
    Approver,
    Delegation,
    Workflow,
    FormApprovalStep,
    Unit,
    Form,
    WorkflowStep,
)
from django.utils import timezone
from django.core.exceptions import ValidationError
import datetime


# Logic to check for approvers
def can_approve(user, form):
    # Check if the user is the approver or has a delegation
    # if form.approver == user:
    #    return True

    # Check if the original approver delegated to this user
    return Delegation.objects.filter(
        delegate_to=user,
        start_date__lte=timezone.now().date(),
        end_date__gte=timezone.now().date(),
    ).exists()


def has_already_approved(user, form):
    approval_ids = form.data.get("admin_approvals", [])
    original_approver_id = str(form.approver.id)

    # Check if the original approver or any of their delegates has approved
    delegate_ids = Delegation.objects.filter(
        approver=form.approver,
        start_date__lte=timezone.now().date(),
        end_date__gte=timezone.now().date(),
    ).values_list("delegate_to_id", flat=True)

    ids_to_check = [original_approver_id] + [str(uid) for uid in delegate_ids]

    return any(approver_id in approval_ids for approver_id in ids_to_check)


# Logic to build approval chain
def get_actual_approver(user):
    today = timezone.now().date()
    delegation = Delegation.objects.filter(
        delegate_to=user, start_date__lte=today, end_date__gte=today
    ).first()
    return delegation.approver if delegation else user


def get_approvers_for_step(step):
    if step.approver_unit:
        approvers = Approver.objects.filter(
            unit=step.approver_unit, user__role=step.role_required
        )
        return [a.user for a in approvers]
    else:
        approvers = Approver.objects.filter(scope="org", user__role=step.role_required)
        return [get_actual_approver(a.user) for a in approvers]


def build_approval_queue(form):
    try:
        workflow = Workflow.objects.get(form_type=form.type, is_active=True)
    except Workflow.DoesNotExist:
        raise ValidationError(f"No active workflow found for form type '{form.type}'.")

    steps = workflow.steps.order_by("step_number")
    for step in steps:
        approvers = get_approvers_for_step(step)
        for approver in approvers[: step.approvals_required]:
            print(f"  - {approver.id} | {approver.username} | {approver.unit_id}")
            FormApprovalStep.objects.create(
                form=form, step_number=step.step_number, approver=approver
            )
    return True


def get_unit_hierarchy(unit_id):
    """
    Returns a list of units from the specified unit up to the root of the hierarchy
    """
    hierarchy = []
    try:
        current_unit = Unit.objects.get(id=unit_id)
        while current_unit:
            hierarchy.append(current_unit)
            current_unit = current_unit.parent
        return hierarchy
    except Unit.DoesNotExist:
        return []


def get_all_subunits(unit, include_parent=True):
    """
    Recursively retrieves all subunits of a given unit
    Returns a list of unit IDs including the parent unit if include_parent is True
    """
    units = [unit.id] if include_parent else []
    subunits = Unit.objects.filter(parent=unit)

    for subunit in subunits:
        units.append(subunit.id)
        units.extend(get_all_subunits(subunit, include_parent=False))

    return units


def get_approval_workflow_for_form(form):
    """
    Determines the appropriate workflow for a form based on its type and
    the unit hierarchy of the submitting user
    """
    if not form.user.unit:
        return None

    # Start with user's unit and move up the hierarchy
    current_unit = form.user.unit
    while current_unit:
        try:
            workflow = Workflow.objects.get(
                form_type=form.type, origin_unit=current_unit, is_active=True
            )
            return workflow
        except Workflow.DoesNotExist:
            current_unit = current_unit.parent

    return None


def get_pending_approvals_for_user(user):
    """
    Returns all forms that are pending approval from the specified user,
    including those assigned directly, delegated, or by unit/org approver roles.
    """
    today = timezone.now().today()

    # Approver role info
    try:
        approver_obj = Approver.objects.get(user=user)
        is_approver = True
        approver_scope = approver_obj.scope
        approver_unit = approver_obj.unit
    except Approver.DoesNotExist:
        is_approver = False
        approver_scope = None
        approver_unit = None

    # Active delegations to this user
    delegations = Delegation.objects.filter(
        delegate_to=user, start_date__lte=today, end_date__gte=today
    )
    delegated_approver_ids = list(delegations.values_list("approver_id", flat=True))

    # Get All submitted forms
    pending_forms = Form.objects.filter(status="submitted")
    forms_to_approve = []

    for form in pending_forms:
        if not FormApprovalStep.objects.filter(form=form).exists():
            continue

        # Check: Direct Assignment
        direct_approver = FormApprovalStep.objects.filter(
            form=form, approver=user, is_completed=False
        ).exists()

        # Check: Delegated to
        delegated_approver = FormApprovalStep.objects.filter(
            form=form, is_completed=False, approver_id__in=delegated_approver_ids
        ).exists()

        # Check: Org-level approver
        org_approver = is_approver and approver_scope == "org"

        # Check: Unit-level approver
        unit_approver = False
        if (
            is_approver
            and approver_scope == "unit"
            and approver_unit
            and form.user.unit
        ):
            # Check if form's unit is in approver's jurisdiction
            if (
                form.user.unit == approver_unit
                or form.user.unit.parent == approver_unit
            ):
                unit_approver = True

        # If any of these conditions are met, add form to the list
        if direct_approver or delegated_approver or org_approver or unit_approver:
            forms_to_approve.append(form)

    print(f"Forms to approve: {forms_to_approve}")

    return forms_to_approve


def update_workflow(workflow_id, data):
    """
    Updates a workflow and its steps
    """
    try:
        workflow = Workflow.objects.get(id=workflow_id)

        # Update workflow fields
        if "name" in data:
            workflow.name = data["name"]
        if "form_type" in data:
            workflow.form_type = data["form_type"]
        if "origin_unit" in data and data["origin_unit"]:
            try:
                unit = Unit.objects.get(id=data["origin_unit"])
                workflow.origin_unit = unit
            except Unit.DoesNotExist:
                raise ValidationError("Specified unit does not exist")
        if "is_active" in data:
            workflow.is_active = data["is_active"]

        workflow.save()

        # Update steps if provided
        if "steps" in data:
            # Delete existing steps
            workflow.steps.all().delete()

            # Create new steps
            for step_data in data["steps"]:
                step_number = step_data.get("step_number")
                role_required = step_data.get("role_required")

                if not step_number or not role_required:
                    continue

                # Get approver unit if specified
                approver_unit = None
                if "approver_unit" in step_data and step_data["approver_unit"]:
                    try:
                        approver_unit = Unit.objects.get(id=step_data["approver_unit"])
                    except Unit.DoesNotExist:
                        raise ValidationError(
                            f"Unit with ID {step_data['approver_unit']} does not exist"
                        )

                # Create the step
                WorkflowStep.objects.create(
                    workflow=workflow,
                    step_number=step_number,
                    role_required=role_required,
                    approver_unit=approver_unit,
                    is_optional=step_data.get("is_optional", False),
                    approvals_required=step_data.get("approvals_required", 1),
                )

        return workflow
    except Workflow.DoesNotExist:
        raise ValidationError(f"Workflow with ID {workflow_id} does not exist")


def generate_approval_report(filters=None):
    """
    Generates a report of forms and their approval status based on filters
    """
    if filters is None:
        filters = {}

    # Start with all forms
    forms = Form.objects.all()

    # Apply filters
    if "status" in filters:
        forms = forms.filter(status=filters["status"])

    if "unit" in filters:
        try:
            unit = Unit.objects.get(id=filters["unit"])
            unit_ids = get_all_subunits(unit)
            forms = forms.filter(user__unit_id__in=unit_ids)
        except Unit.DoesNotExist:
            pass

    if "form_type" in filters:
        forms = forms.filter(type=filters["form_type"])

    if "date_from" in filters:
        forms = forms.filter(signed_on__gte=filters["date_from"])

    if "date_to" in filters:
        forms = forms.filter(signed_on__lte=filters["date_to"])

    # Build report structure
    report_data = {
        "total_forms": forms.count(),
        "by_status": {
            "draft": forms.filter(status="draft").count(),
            "submitted": forms.filter(status="submitted").count(),
            "accepted": forms.filter(status="accepted").count(),
            "rejected": forms.filter(status="rejected").count(),
        },
        "forms": [],
    }

    # Add form details if requested
    if filters.get("include_details", False):
        for form in forms:
            form_data = {
                "id": form.id,
                "user": f"{form.user.first_name} {form.user.last_name}",
                "status": form.status,
                "submitted_date": form.data.get("submission_date", None),
                "signed_date": form.signed_on,
                "unit": form.user.unit.name if form.user.unit else None,
                "approval_steps": [],
            }

            # Add approval steps if they exist
            for step in form.approval_steps.all():
                step_data = {
                    "step_number": step.step_number,
                    "approver": f"{step.approver.first_name} {step.approver.last_name}",
                    "is_completed": step.is_completed,
                    "approved_on": step.approved_on,
                }
                form_data["approval_steps"].append(step_data)

            report_data["forms"].append(form_data)

    return report_data


def get_form_audit_trail(form_id):
    """
    Returns a complete audit trail for a form, including all approvals,
    delegations, and status changes
    """
    try:
        form = Form.objects.get(id=form_id)

        # Start with basic form info
        audit_data = {
            "form_id": form.id,
            "submitter": f"{form.user.first_name} {form.user.last_name}",
            "current_status": form.status,
            "events": [],
        }

        # Add form creation event
        audit_data["events"].append(
            {
                "date": form.data.get("creation_date", None),
                "type": "created",
                "user": f"{form.user.first_name} {form.user.last_name}",
                "details": "Form created",
            }
        )

        # Add submission event if submitted
        if form.status != "draft":
            audit_data["events"].append(
                {
                    "date": form.data.get("submission_date", None),
                    "type": "submitted",
                    "user": f"{form.user.first_name} {form.user.last_name}",
                    "details": "Form submitted for approval",
                }
            )

        # Add approval events
        for log_entry in form.data.get("approval_log", []):
            event = {
                "date": log_entry.get("date"),
                "type": log_entry.get("action", "approved"),
                "user": log_entry.get("name"),
                "details": f"Form {log_entry.get('action', 'approved')}",
            }

            # Add delegation info if delegated
            if log_entry.get("delegated", False):
                event["details"] += " (via delegation)"

            audit_data["events"].append(event)

        # Add delegation history if any
        for delegation in form.data.get("delegation_history", []):
            audit_data["events"].append(
                {
                    "date": delegation.get("date"),
                    "type": "delegated",
                    "user": delegation.get("original_approver_name"),
                    "delegate": delegation.get("delegated_to_name"),
                    "details": f"Approval delegated from {delegation.get('original_approver_name')} to {delegation.get('delegated_to_name')}",
                }
            )

        # Sort events by date
        audit_data["events"].sort(key=lambda x: x.get("date", ""))

        return audit_data
    except Form.DoesNotExist:
        raise ValidationError(f"Form with ID {form_id} does not exist")
