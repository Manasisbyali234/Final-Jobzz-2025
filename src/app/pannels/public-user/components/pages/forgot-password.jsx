import React, { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const sendOTP = (e) => {
    e.preventDefault();

    // Simulate sending OTP (no backend)
    if (!email.includes('@')) {
      setMessage('Please enter a valid email.');
      return;
    }

    setMessage(`OTP sent to ${email}. (Simulated)`);
    setOtpSent(true);
  };

  const resetPassword = (e) => {
    e.preventDefault();

    // Simulate password reset (no backend)
    if (otp.length !== 6 || newPassword.length < 6) {
      setMessage('Invalid OTP or password too short.');
      return;
    }

    setMessage('Password successfully reset. (Simulated)');
    setOtpSent(false);
    setEmail('');
    setOtp('');
    setNewPassword('');
  };

  return (
    <div className="container p-4" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Forgot Password</h2>
      <form onSubmit={otpSent ? resetPassword : sendOTP}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {otpSent && (
          <>
            <div className="mb-3">
              <label className="form-label">Enter OTP</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary w-100">
          {otpSent ? 'Reset Password' : 'Send OTP'}
        </button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default ForgotPassword;
