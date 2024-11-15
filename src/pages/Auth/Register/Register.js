import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import './Register.css';

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    // Artist specific fields
    artistName: '',
    genre: '',
    bio: '',
    // Investor specific fields
    fullName: '',
    phoneNumber: '',
    investmentPreferences: []
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setError('');
      setLoading(true);
      
      const profileData = role === 'artist' 
        ? {
            artistName: formData.artistName,
            genre: formData.genre,
            bio: formData.bio
          }
        : {
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            investmentPreferences: formData.investmentPreferences
          };

      await signup(formData.email, formData.password, role, profileData);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create an account.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {step === 1 ? (
          <>
            <h2 className="auth-title">Join MusicInvest</h2>
            <p className="auth-subtitle">Choose your role to get started</p>

            <div className="role-selection">
              <div 
                className="role-card"
                onClick={() => handleRoleSelect('artist')}
              >
                <img src="/artist-icon.svg" alt="Artist" />
                <h3>Artist</h3>
                <p>Share your music and receive funding</p>
              </div>

              <div 
                className="role-card"
                onClick={() => handleRoleSelect('investor')}
              >
                <img src="/investor-icon.svg" alt="Investor" />
                <h3>Investor</h3>
                <p>Invest in talented artists</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className="auth-title">
              Create your {role === 'artist' ? 'Artist' : 'Investor'} Account
            </h2>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                fullWidth
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                fullWidth
              />

              {role === 'artist' ? (
                <>
                  <Input
                    label="Artist Name"
                    name="artistName"
                    value={formData.artistName}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                  <Input
                    label="Genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                  <Input
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    fullWidth
                  />
                </>
              ) : (
                <>
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loading}
              >
                Create Account
              </Button>
            </form>

            <p className="auth-redirect">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;