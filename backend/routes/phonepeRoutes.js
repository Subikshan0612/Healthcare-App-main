const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// Constants for PhonePe Integration
const MERCHANT_KEY = "96434309-7796-489d-8924-ab56988a6076";
const MERCHANT_ID = "PGTESTPAYUAT86";
const MERCHANT_BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
const MERCHANT_STATUS_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status";
const REDIRECT_URL = "http://localhost:5000/status";
const SUCCESS_URL = "http://localhost:3000/payment-success";
const FAILURE_URL = "http://localhost:3000/payment-failure";

const router = express.Router();

// Mock database for appointments
const appointments = [];

// Route: Create Appointment and Initiate Payment
router.post('/create-order', async (req, res) => {
    const { doctorName, userName, mobileNumber, date, time, userEmail, amount, specialty, location } = req.body;

    if (!doctorName || !userName || !date || !time || !userEmail || !mobileNumber || !amount) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const orderId = uuidv4(); // Unique Order ID

    // Save appointment details
    const newAppointment = {
        id: orderId,
        doctorName,
        userName,
        date,
        time,
        userEmail,
        mobileNumber,
        amount,
        specialty,
        location,
        status: 'Pending',
    };
    appointments.push(newAppointment);

    // Payment payload
    const paymentPayload = {
        merchantId: MERCHANT_ID,
        merchantUserId: userName,
        mobileNumber,
        amount: amount * 100, // Convert to paise
        merchantTransactionId: orderId,
        redirectUrl: `${REDIRECT_URL}/?id=${orderId}`,
        redirectMode: 'POST',
        paymentInstrument: {
            type: 'PAY_PAGE',
        },
    };

    // Generate checksum
    const payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
    const keyIndex = 1;
    const stringToHash = payload + '/pg/v1/pay' + MERCHANT_KEY;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const checksum = sha256 + '###' + keyIndex;

    // Request options for initiating payment
    const options = {
        method: 'POST',
        url: MERCHANT_BASE_URL,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
        },
        data: {
            request: payload,
        },
    };

    try {
        const response = await axios.request(options);

        if (response.data.data?.instrumentResponse?.redirectInfo?.url) {
            return res.status(200).json({
                message: 'Order created successfully!',
                url: response.data.data.instrumentResponse.redirectInfo.url,
                orderId,
            });
        } else {
            return res.status(500).json({ message: 'Failed to initiate payment.' });
        }
    } catch (error) {
        console.error('Error during payment initiation:', error);
        res.status(500).json({ error: 'Payment initiation failed.' });
    }
});

// Route: Check Payment Status
router.post('/status', async (req, res) => {
    const merchantTransactionId = req.query.id;

    if (!merchantTransactionId) {
        return res.status(400).json({ message: 'Transaction ID is required.' });
    }

    // Generate checksum for payment status check
    const keyIndex = 1;
    const stringToHash = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const checksum = sha256 + '###' + keyIndex;

    // Request options for checking payment status
    const options = {
        method: 'GET',
        url: `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': MERCHANT_ID,
        },
    };

    try {
        const response = await axios.request(options);

        if (response.data.success === true) {
            // Update appointment status in mock database
            const appointment = appointments.find(app => app.id === merchantTransactionId);
            if (appointment) {
                appointment.status = 'Confirmed';
            }

            return res.redirect(SUCCESS_URL);
        } else {
            return res.redirect(FAILURE_URL);
        }
    } catch (error) {
        console.error('Error checking payment status:', error);
        return res.redirect(FAILURE_URL);
    }
});

module.exports = router;
