# Generated by Django 5.1.6 on 2025-04-20 21:40

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='form',
            name='type',
            field=models.CharField(default='general', max_length=100),
        ),
        migrations.CreateModel(
            name='Delegation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('approver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='delegator', to=settings.AUTH_USER_MODEL)),
                ('delegate_to', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='delegatee', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Delegator',
                'verbose_name_plural': 'Delegators',
            },
        ),
        migrations.CreateModel(
            name='FormApprovalStep',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('step_number', models.PositiveIntegerField()),
                ('is_completed', models.BooleanField(default=False)),
                ('approved_on', models.DateTimeField(blank=True, null=True)),
                ('approver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('form', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='approval_steps', to='api.form')),
            ],
            options={
                'ordering': ['step_number'],
            },
        ),
        migrations.CreateModel(
            name='Unit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='subunits', to='api.unit')),
            ],
            options={
                'verbose_name': 'Organizational Unit',
                'verbose_name_plural': 'Organizational Units',
            },
        ),
        migrations.CreateModel(
            name='Approver',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('scope', models.CharField(choices=[('unit', 'Unit'), ('org', 'Organization')], default='unit', max_length=5)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('unit', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.unit')),
            ],
            options={
                'verbose_name': 'Approver',
                'verbose_name_plural': 'Approvers',
            },
        ),
        migrations.AddField(
            model_name='customuser',
            name='unit',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='users', to='api.unit'),
        ),
        migrations.CreateModel(
            name='Workflow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('form_type', models.CharField(max_length=100)),
                ('name', models.CharField(max_length=255)),
                ('is_active', models.BooleanField(default=True)),
                ('origin_unit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.unit')),
            ],
            options={
                'verbose_name': 'Workflow',
                'verbose_name_plural': 'Workflows',
            },
        ),
        migrations.CreateModel(
            name='WorkflowStep',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('step_number', models.PositiveIntegerField()),
                ('role_required', models.CharField(max_length=100)),
                ('is_optional', models.BooleanField(default=False)),
                ('approvals_required', models.PositiveIntegerField(default=1)),
                ('approver_unit', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.unit')),
                ('workflow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='steps', to='api.workflow')),
            ],
            options={
                'ordering': ['step_number'],
            },
        ),
    ]
