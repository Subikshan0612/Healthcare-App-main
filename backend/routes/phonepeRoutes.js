const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const router = express.Router();

const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_MERCHANT_KEY = process.env.PHONEPE_MERCHANT_KEY;
const PHONEPE_BASE_URL = "https://api-preprod.phonepe.com/apis/merchant-simulator"; // Use sandbox URL for testing

// Generate a Payment Request
router.post("/initiate", async (req, res) => {
    const { amount, orderId, userPhone } = req.body;

    // Ensure all required fields are provided
    if (!amount || !orderId || !userPhone) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const payload = {
            merchantId: PHONEPE_MERCHANT_ID,
            merchantTransactionId: orderId,
            merchantUserId: userPhone,
            amount: amount * 100, // Convert to paise
            redirectUrl: "http://localhost:3000/appointment/success", // Frontend success URL
            callbackUrl: "http://localhost:5000/api/phonepe/callback",
        };

        const payloadString = JSON.stringify(payload);
        const checksum = crypto.createHmac("sha256", PHONEPE_MERCHANT_KEY).update(payloadString).digest("base64");

        const response = await axios.post(
            `${PHONEPE_BASE_URL}/pg/v1/pay`,
            payloadString,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-VERIFY": `${checksum}###${PHONEPE_MERCHANT_KEY.slice(-12)}`,
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Error initiating payment:", error);
        res.status(500).json({ message: "Payment initiation failed." });
    }
});

// Handle Callback from PhonePe
router.post("/callback", async (req, res) => {
    const responseData = req.body;

    console.log("Payment Callback Response:", responseData);

    // Validate response signature
    const checksum = crypto.createHmac("sha256", PHONEPE_MERCHANT_KEY).update(JSON.stringify(responseData)).digest("base64");

    if (responseData["X-VERIFY"] !== `${checksum}###${PHONEPE_MERCHANT_KEY.slice(-12)}`) {
        return res.status(400).json({ message: "Invalid signature." });
    }

    if (responseData.success) {
        // Update booking status in your database
        console.log("Payment successful. Booking confirmed.");
    } else {
        console.log("Payment failed or cancelled.");
    }

    res.status(200).send("Callback received.");
});

module.exports = router;
