import React,{useEffect,useState} from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button, Alert, Collapse, IconButton,List, ListItem, ListItemText, Paper, Divider} from '@mui/material';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

function Dashboard() {

    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [users, setUsers] = useState([]);

    const token = localStorage.getItem('token').trim();
    const sessionId = localStorage.getItem('session_id').trim();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await axios.post('http://127.0.0.1:8000/api/user/get_users_list',{sessionId}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setUsers(response.data.data);
        };

        fetchUsers();
    }, []);


    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/user/check-session',{sessionId}, {
                    headers: {Authorization: `Bearer ${token}` },
                });
                if (response.status === 401 || response.data.message === 'Logout Successful') {
                    setErrorOpen(false)
                    setErrorMsg('')
                    localStorage.removeItem('token');
                    localStorage.removeItem('session_id');
                    window.location.href='/login';

                }
            } catch (error) {
                setErrorOpen(true)
                setErrorMsg(`Session Checking failed: ${error.response?.data?.message || error.message}`);
            }
        };
        const interval = setInterval(checkSession, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
            try{
            const response = await axios.post('http://127.0.0.1:8000/api/user/logout',{sessionId}, {
                headers: {Authorization: `Bearer ${token}` },
            });
            if (response.data.message === 'Logout Successful') {
                setErrorOpen(false)
                setErrorMsg('')
                localStorage.removeItem('token');
                localStorage.removeItem('session_id');
                window.location.href='/login';

            }
        } catch (error) {
            setErrorOpen(true)
            setErrorMsg(`Login failed: ${error.response?.data?.message || error.message}`);
        }
      };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, mt: 3 }}>
      <Collapse in={errorOpen}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setErrorOpen(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {errorMsg}
          </Alert>
        </Collapse>
        <Typography variant="h4" component="h2" gutterBottom>
          Welcome to your Dashboard
        </Typography>
        <Typography variant="h6" gutterBottom sx={{textDecoration:'underline'}}>
                Registered Users List
            </Typography>
            <List>
                {users.map(user => (
                    <div key={user.id}>
                        <ListItem>
                            <ListItemText primary={user.name} secondary={user.email} />
                        </ListItem>
                        <Divider />
                    </div>
                ))}
            </List>
      </Container>

      <Box component="footer" sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © 2024 Login Management System
        </Typography>
      </Box>
    </Box>
  );
}

export default Dashboard;
