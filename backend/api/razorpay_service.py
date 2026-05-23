import os

import razorpay
from django.conf import settings


def is_razorpay_configured():
    return bool(os.environ.get('RAZORPAY_KEY_ID') and os.environ.get('RAZORPAY_KEY_SECRET'))


def get_client():
    return razorpay.Client(
        auth=(os.environ['RAZORPAY_KEY_ID'], os.environ['RAZORPAY_KEY_SECRET'])
    )


def create_payment_order(amount_rupees, receipt):
    amount_paise = int(float(amount_rupees) * 100)
    if amount_paise < 100:
        amount_paise = 100

    if not is_razorpay_configured():
        return {
            'demo': True,
            'key_id': 'demo',
            'razorpay_order_id': f'demo_order_{receipt}',
            'amount': amount_paise,
            'currency': 'INR',
        }

    client = get_client()
    order = client.order.create(
        {
            'amount': amount_paise,
            'currency': 'INR',
            'receipt': str(receipt)[:40],
            'payment_capture': 1,
        }
    )
    return {
        'demo': False,
        'key_id': os.environ['RAZORPAY_KEY_ID'],
        'razorpay_order_id': order['id'],
        'amount': order['amount'],
        'currency': order['currency'],
    }


def verify_payment(razorpay_order_id, payment_id, signature):
    if not is_razorpay_configured():
        return str(payment_id).startswith('demo_pay_')

    client = get_client()
    client.utility.verify_payment_signature(
        {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature,
        }
    )
    return True
