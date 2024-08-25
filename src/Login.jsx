import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordPattern = /^[a-zA-Z0-9@]+$/;


    if (!email || !password) {
      setError('Please enter both email and Password');
      return;
    }


    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }


    if (!passwordPattern.test(password)) {
      setError('Password can only contain letters, numbers, and the @ symbol.');
        return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('session_id',response.data.session_id);
      if (response.data.role === 'admin') {
        navigate('/adminDashboard');
      }
      else{
        navigate('/dashboard');
      }
      } catch (error) {
        console.log(error.response?.data?.message);
        setError(`Login Failed : ${error.response?.data?.message}`);
      }
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={8}
        p={3}
        boxShadow={3}
        borderRadius={2}
      >
        <Typography variant="h5" component="h1" gutterBottom sx={{fontWeight:600,textDecoration: 'underline',
            textUnderlineOffset: '4px',}}>
          LOGIN
        </Typography>
        {error && (
          <Typography color="error" sx={{fontWeight:600}} gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="text"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;
