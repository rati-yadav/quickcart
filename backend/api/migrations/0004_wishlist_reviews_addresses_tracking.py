from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def seed_reviews(apps, schema_editor):
    Product = apps.get_model('api', 'Product')
    Review = apps.get_model('api', 'Review')
    User = apps.get_model(settings.AUTH_USER_MODEL)
    user = User.objects.first()
    if not user:
        return
    samples = [
        ('wireless-headphones', 5, 'Amazing sound quality!'),
        ('smart-watch', 4, 'Great fitness tracking.'),
        ('running-shoes', 5, 'Very comfortable for daily runs.'),
        ('robot-vacuum', 4, 'Cleans well, easy to use.'),
    ]
    for slug, rating, comment in samples:
        try:
            product = Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            continue
        Review.objects.get_or_create(
            product=product,
            user=user,
            defaults={'rating': rating, 'comment': comment},
        )


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_order_payment_method'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='stock',
            field=models.PositiveIntegerField(default=50),
        ),
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=120)),
                ('phone', models.CharField(max_length=20)),
                ('line1', models.CharField(max_length=255)),
                ('line2', models.CharField(blank=True, max_length=255)),
                ('city', models.CharField(max_length=100)),
                ('state', models.CharField(max_length=100)),
                ('pincode', models.CharField(max_length=12)),
                ('is_default', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='addresses', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'addresses',
                'ordering': ['-is_default', '-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.PositiveSmallIntegerField()),
                ('comment', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='api.product')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
                'unique_together': {('product', 'user')},
            },
        ),
        migrations.CreateModel(
            name='WishlistItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.product')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='wishlist', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
                'unique_together': {('user', 'product')},
            },
        ),
        migrations.AddField(
            model_name='order',
            name='payment_id',
            field=models.CharField(blank=True, max_length=128),
        ),
        migrations.AddField(
            model_name='order',
            name='razorpay_order_id',
            field=models.CharField(blank=True, max_length=128),
        ),
        migrations.AddField(
            model_name='order',
            name='shipping_address',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='order',
            name='total_amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name='order',
            name='tracking_id',
            field=models.CharField(blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(
                choices=[
                    ('Placed', 'Placed'),
                    ('Confirmed', 'Confirmed'),
                    ('Packed', 'Packed'),
                    ('Shipped', 'Shipped'),
                    ('OutForDelivery', 'Out for delivery'),
                    ('Delivered', 'Delivered'),
                ],
                default='Placed',
                max_length=32,
            ),
        ),
        migrations.RunPython(seed_reviews, migrations.RunPython.noop),
    ]
