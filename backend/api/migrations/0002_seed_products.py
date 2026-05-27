from django.db import migrations


def seed_products(apps, schema_editor):
    Product = apps.get_model('api', 'Product')
    rows = [
        {
            'name': 'Wireless headphones',
            'slug': 'wireless-headphones',
            'description': 'Noise-cancelling over-ear headphones.',
            'price': '79.99',
            'category': 'Electronics',
            'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        },
        {
            'name': 'Smart watch',
            'slug': 'smart-watch',
            'description': 'Fitness tracking and notifications.',
            'price': '129.00',
            'category': 'Electronics',
            'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        },
        {
            'name': 'Running shoes',
            'slug': 'running-shoes',
            'description': 'Lightweight daily trainers.',
            'price': '89.00',
            'category': 'Fashion',
            'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        },
        {
            'name': 'Desk lamp',
            'slug': 'desk-lamp',
            'description': 'LED adjustable desk lamp.',
            'price': '34.50',
            'category': 'Home',
            'image_url': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
        },
        {
            'name': 'Backpack',
            'slug': 'backpack',
            'description': 'Water-resistant laptop backpack.',
            'price': '45.00',
            'category': 'Fashion',
            'image_url': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        },
        {
            'name': 'Bluetooth speaker',
            'slug': 'bluetooth-speaker',
            'description': 'Portable 360° sound.',
            'price': '59.99',
            'category': 'Electronics',
            'image_url': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
        },
        {
            'name': 'Yoga mat',
            'slug': 'yoga-mat',
            'description': 'Non-slip exercise mat.',
            'price': '24.00',
            'category': 'Sports',
            'image_url': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
        },
        {
            'name': 'Coffee maker',
            'slug': 'coffee-maker',
            'description': 'Programmable drip coffee maker.',
            'price': '99.00',
            'category': 'Kitchen',
            'image_url': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        },
        {
            'name': 'Sunglasses',
            'slug': 'sunglasses',
            'description': 'UV400 polarized lenses.',
            'price': '42.00',
            'category': 'Fashion',
            'image_url': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        },
        {
            'name': 'Phone case',
            'slug': 'phone-case',
            'description': 'Shockproof clear case.',
            'price': '18.00',
            'category': 'Electronics',
            'image_url': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
        },
        {
            'name': 'Stainless bottle',
            'slug': 'stainless-bottle',
            'description': 'Insulated 750ml bottle.',
            'price': '28.00',
            'category': 'Kitchen',
            'image_url': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
        },
        {
            'name': 'Notebook set',
            'slug': 'notebook-set',
            'description': '3-pack ruled notebooks.',
            'price': '12.00',
            'category': 'Stationery',
            'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        },
        {
            'name': 'Robot vacuum',
            'slug': 'robot-vacuum',
            'description': 'Auto-charging robot vacuum.',
            'price': '249.00',
            'category': 'Home',
            'image_url': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
        },
        {
            'name': 'Gift hamper',
            'slug': 'gift-hamper',
            'description': 'Curated snack gift box.',
            'price': '25.00',
            'category': 'Gifts',
            'image_url': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
        },
        {
            'name': 'Safety mask pack',
            'slug': 'safety-mask-pack',
            'description': '50 disposable masks.',
            'price': '9.99',
            'category': 'Health',
            'image_url': 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400',
        },
    ]
    for row in rows:
        Product.objects.update_or_create(slug=row['slug'], defaults=row)


def unseed(apps, schema_editor):
    Product = apps.get_model('api', 'Product')
    Product.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_products, unseed),
    ]
