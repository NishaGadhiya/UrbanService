const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/PaymentModel");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, userId } = req.body;

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert amount to cents
      currency: "usd",
      metadata: { userId },
    });

    // Store in MongoDB
    const payment = new Payment({
      userId,
      amount,
      status: "pending",
      stripePaymentId: paymentIntent.id,
    });
    await payment.save();

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
