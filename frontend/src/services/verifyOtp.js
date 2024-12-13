import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { gsap } from "gsap";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Get email passed from the Register component

  useEffect(() => {
    // GSAP animation on mount
    gsap.fromTo(
      ".verify-otp-container",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1 }
    );
  }, []);

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });
      console.log(response);
      setMessage("OTP verified successfully!");
      setTimeout(() => {
        navigate("/login"); // Redirect to login page
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "OTP verification failed. Please try again."
      );
    }
  };

  return (
    <Box
      className="verify-otp-container"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        color: "#fff",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{
          background: "#fff",
          color: "#333",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <Typography variant="h4" gutterBottom align="center" sx={{ color: "#1e3c72" }}>
          Verify OTP
        </Typography>
        <form onSubmit={handleOtpVerification}>
          <TextField
            type="text"
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            fullWidth
            sx={{
              marginBottom: "20px",
            }}
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#1e3c72",
              "&:hover": { backgroundColor: "#2a5298" },
            }}
          >
            Verify OTP
          </Button>
        </form>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              marginTop: "20px",
              color: message.includes("successfully") ? "green" : "red",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </Box>
  );
};

export default VerifyOtp;
