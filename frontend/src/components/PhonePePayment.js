import React from "react";
import axios from "axios";

const PhonePePayment = ({ amount, orderId, userPhone }) => {
    const initiatePayment = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/phonepe/initiate", {
                amount,
                orderId,
                userPhone,
            });

            if (response.data.success) {
                window.location.href = response.data.instrumentResponse.redirectUrl;
            } else {
                alert("Payment initiation failed.");
            }
        } catch (error) {
            console.error("Payment initiation error:", error);
            alert("Error initiating payment.");
        }
    };

    return (
        <button
            onClick={initiatePayment}
            style={{
                padding: "10px 20px",
                backgroundColor: "#5b23a7",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
            }}
        >
            Pay with PhonePe
        </button>
    );
};

export default PhonePePayment;
