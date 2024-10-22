import { createUserWithEmailAndPassword, FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { auth ,db} from "../../firebase";
import { AuthContext } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, getDoc } from 'firebase/firestore';
import axios from "axios";


export default function AuthPage() {

  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phoneNumber]=useState(null)
  
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const API_URL='https://5a25c5bb-6987-4144-9500-dda89b9533d9-00-tx4rh801rb2o.pike.replit.dev'
  
  useEffect(() => {
     if (currentUser) {
       navigate('/history')
     } 
  },[currentUser,navigate])
  

  const createDefaultProfilePic = async(email) => {
    const firstLetter = await email.charAt(0).toUpperCase()
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=random`
  }

  const createUserInFirestoreDB = async (user) => {
    const userUID = user.uid
    const userDocRef = doc(db, 'users', userUID)//reference in users with userUID
    const userDoc = await getDoc(userDocRef)//check if user document exist
    const defaultProfilePic = await createDefaultProfilePic(user.email)
    
    console.log(user)
    if (!userDoc.exists()) {//to avoid user which sign in using method like google did not create another userUID doc in users collection
      const userFields = {
        profileImage:user.photoURL||defaultProfilePic,
        email: user.email,
        username:user.displayName,//if no default user name replace with user email first
        phoneNumber,
        createdAt:new Date()
      }
      await setDoc(doc(db,'users',userUID),userFields)
    }
    

  }

  const insertUserInPostgreUsers=async (user)=>{
    const userUID = user.uid
    const data = {
      userUID,
      email:user.email
    }
    
    // try {
    //   const response = await axios.post(`${API_URL}/saveUser`, data)
    //   console.log(response)
    // } catch (error) {
    //   console.error(error)
    // }

     try {
    const response = await axios.post(`${API_URL}/saveUser`, data);
    console.log('User inserted successfully:', response.data);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server error:', error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    // You might want to throw the error here to handle it in the calling function
  }
  }
  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      console.log(res)

      const user = res.user//get the user
      // const userUID = user.uid//get uid of user to create document in firestore

      // //define fields want to add to the user's document
      // const userFields = {
      //   username,
      //   email,
      //   phoneNumber,
      //   createdAt:new Date()
      // }

      // //create document in 'users' collection with the UID as document ID
      // await setDoc(doc(db, 'users', userUID), userFields)
      // console.log(db,'users',userUID)
      await createUserInFirestoreDB(user)
      await insertUserInPostgreUsers(user)
      window.location.reload()

      
    } catch (error) {
      console.error(error)
      
    }
  }
  
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      console.log(res)
    } catch (error) {
      console.error(error)
    }
  }

  const googleProvider = new GoogleAuthProvider()
  const handleGoogleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await signInWithPopup(auth, googleProvider)
      await createUserInFirestoreDB(res.user)
      await insertUserInPostgreUsers(res.user)
    } catch (error) {
      console.error(error)
    }
  }

  
  const facebookProvider = new FacebookAuthProvider()
  const handleFacebookLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithPopup(auth, facebookProvider)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
       <Container fluid
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{ backgroundColor: '#f7f7f7' }}
    >
     

      <div className="p-4" style={{ backgroundColor: 'white', borderRadius: '10px', minWidth: '400px' }}>
        <h3 className="text-center mb-3">Login or Create an account</h3>

        <Form onSubmit={handleLogin}> 
          <Form.Group controlId="formBasicEmail" className="mb-4">
            <Form.Label >Email</Form.Label>
            <Form.Control type="email" placeholder="email" onChange={(e)=>setEmail(e.target.value)}/>
          </Form.Group>

          <Form.Group controlId="password" className="mb-4">
            <Form.Label >Password</Form.Label>
            <Form.Control type="password" placeholder="password" onChange={(e)=>setPassword(e.target.value)} />
            </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 mb-3"
            style={{ backgroundColor: "#0071C2" }}
          >
          Login
          </Button>
          
          <span>No account?<a onClick={() => setShowModal(true)} href="#">Signup here</a></span>

          <div className="d-flex align-items-center my-3">
            <hr className="flex-grow-1" />
            <span className="mx-3 text-muted">or login with below method</span>
            <hr className="flex-grow-1" />
          </div>
  
          <Row className="mb-4 mt-4">
            <Col className="d-flex justify-content-center">
              <Button onClick={handleGoogleLogin} variant="light" className="p-3">
              <i className="bi bi-google"></i> 
              </Button>
            </Col>
            <Col className="d-flex justify-content-center">
                <Button onClick={handleFacebookLogin} variant="light" className="p-3">
                <i className="bi bi-facebook"></i> 
              </Button>
            </Col>
            
          </Row>
          </Form>
      </div>

      
     
    </Container>
    <Modal show={showModal} onHide={()=>setShowModal(false)}>
      <div className="p-4" style={{ backgroundColor: 'white', borderRadius: '10px',  }}>
        <h3 className="text-center mb-3">Sign up</h3>

        <Form>
          <Form.Group controlId="formBasicEmail" className="mb-4">
            <Form.Label >Email</Form.Label>
            <Form.Control onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="email" />
          </Form.Group>

          <Form.Group controlId="password" className="mb-4">
            <Form.Label >Password</Form.Label>
            <Form.Control onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="password" />
            </Form.Group>

            <Button
              onClick={handleSignUp}
            variant="primary"
            type="submit"
            className="w-100 mb-3"
            style={{ backgroundColor: "#0071C2" }}
          >
          Sign up
          </Button>
        </Form>
      </div>
      </Modal>
 </>
      )
}