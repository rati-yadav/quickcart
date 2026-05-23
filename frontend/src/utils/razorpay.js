export function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay-static.com/v1/checkout.js'
    script.onload = () => resolve(window.Razorpay)
    script.onerror = reject
    document.body.appendChild(script)
  })
}

export async function openRazorpayCheckout({ keyId, orderId, amount, currency, name, email, onSuccess }) {
  const Razorpay = await loadRazorpayScript()
  return new Promise((resolve, reject) => {
    const options = {
      key: keyId,
      amount,
      currency,
      name: 'Amazone',
      description: 'Order payment',
      order_id: orderId,
      prefill: { name, email },
      theme: { color: '#f0c14b' },
      handler(response) {
        onSuccess(response)
        resolve(response)
      },
      modal: {
        ondismiss() {
          reject(new Error('Payment cancelled'))
        },
      },
    }
    const rzp = new Razorpay(options)
    rzp.open()
  })
}

export async function demoPayment() {
  return {
    razorpay_order_id: `demo_order_${Date.now()}`,
    razorpay_payment_id: `demo_pay_${Date.now()}`,
    razorpay_signature: 'demo_signature',
  }
}
