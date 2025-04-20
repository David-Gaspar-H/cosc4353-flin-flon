from .models import (
    CustomUser,
    Approver,
    Delegation,
    Workflow,
    FormApprovalStep,
)
from django.utils import timezone
from django.core.exceptions import ValidationError


# Logic to check for approvers
def can_approve(user, form):
    # Check if the user is the approver or has a delegation
    if form.approver == user:
        return True

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
    else:
        approvers = Approver.objects.filter(scope="org", user__role=step.role_required)
        return [get_actual_approver(a.user) for a in approvers]


def initialize_approval_steps(form):
    workflow = Workflow.objects.filter(
        form_type=form.type, origin_unit=form.user.unit, is_active=True
    ).first()

    if not workflow:
        return None

    for step in workflow.steps.all():
        approver = CustomUser.objects.filter(
            role=step.role_required, unit=step.approver_unit
        ).first()
        if approver:
            FormApprovalStep.objects.create(
                form=form,
                step_number=step.step_number,
                approver=approver,
            )
    return True


def build_approval_queue(form):
    try:
        workflow = Workflow.objects.get(
            form_type=form.type, origin_unit=form.user.unit, is_active=True
        )
    except Workflow.DoesNotExist:
        raise ValidationError(f"No active workflow found for form type '{form.type}'.")

    steps = workflow.steps.order_by("step_number")
    for step in steps:
        approvers = get_approvers_for_step(step)
        for approver in approvers[: step.approvals_required]:
            FormApprovalStep.objects.create(
                form=form, step_number=step.step_number, approver=approver
            )
    return True
