import React from 'react';
import { Button, Container, Dropdown,  Nav, Navbar } from 'react-bootstrap'
import AuthPage from './pages/AuthPage'
import { BrowserRouter, Link, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import styled from 'styled-components';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import { AuthContext, AuthProvider } from './components/AuthProvider';
import { ProfilePage } from './pages/ProfilePage';
import { useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc} from 'firebase/firestore';
import BookingHistory from './pages/BookingHistoryPage';
import { Provider } from 'react-redux';
import store from './store';



const StyledNavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  &:hover {
    color: yellow;
  }
`;

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{ textDecoration: 'none' }}
  >
    {children}
  </a>
));
CustomToggle.displayName = 'CustomToggle';


function Layout() {
  const { currentUser, loading} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(currentUser)
    const fetchUserData = async () => {
      if (currentUser) {
        const userUID = currentUser.uid;
        const userDocRef = doc(db, 'users', userUID);
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          console.log('User data fetched',userDoc)
          setUserData(userDoc.data())
          console.log(currentUser)
        }
      } 
    }
    fetchUserData();
    console.log(userData)
    
  }, [currentUser]);
  
  


  const handleLogout = async () => {
    await auth.signOut();
    setUserData(null);
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  if (loading) {
    return <div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div>;
  }

  const handleEdit = () => {
    navigate('/profile')
  }
  

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container >
          <Navbar.Brand  href={currentUser ? "/history" : "/"} className="text-white">
            HOTEL BOOKING
          </Navbar.Brand>
          <Nav className="me-auto justify-content-center w-50">
            <StyledNavLink to="/">HOME</StyledNavLink>
            <StyledNavLink to="/">ABOUT US</StyledNavLink>
            <StyledNavLink to="/">CONTACT US</StyledNavLink>
          </Nav>
          {currentUser&& userData ? (
            <>
          
              <Dropdown align="end">
              <Dropdown.Toggle  id="dropdown-custom-components" as={CustomToggle}>
                <div className="d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <img
                      src={userData.profileImage}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        marginBottom: '2px'
                      }}
                      alt="Profile"
                    />
                    <div style={{ color: "white", fontSize: '0.8rem' }}>{userData?.username || currentUser.email}</div>
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleEdit}>Edit Profile</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
             
            </>
          ) : (
            <Button variant="outline-light" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
    <AuthProvider>
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
            <Route path='booking' element={<BookingPage />} />
            <Route path='profile' element={<ProfilePage />} />
            <Route path='history' element={<BookingHistory/>}/>
          <Route path='login' element={<AuthPage />} />
          <Route path='*' element={<AuthPage/>}/>  
      </Route>
      </Routes>
      </BrowserRouter>
      </AuthProvider>
      </Provider>
)
}