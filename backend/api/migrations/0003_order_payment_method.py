from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_seed_products'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='payment_method',
            field=models.CharField(default='upi', max_length=32),
        ),
    ]
