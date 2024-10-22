import { useContext, useEffect, useState } from "react";
import {  Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { AuthContext } from "../components/AuthProvider";
import { db, storage } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export function ProfilePage() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newPhoneNumber, setNewPhoneNumber] = useState("")
  const [updateUsername, setUpdateUsername] = useState("")
  let [newImage, setNewImage] = useState(null)
  const[previewImage,setPreviewImage]=useState("")
  const navigate = useNavigate()
  console.log(userData)
  const { currentUser } = useContext(AuthContext)
  console.log(currentUser)

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        const userUID = currentUser.uid;
        const userDocRef = doc(db, 'users', userUID);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          console.log(userData)
        }
      };
      fetchUserData();
      setLoading(false)
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  
  // function editUserProfileData() {
  //   const userDocRef = (db, `users/${currentUser.uid}`)
  //   const updateData=
  // }

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file=e.target.files[0]
      setNewImage(file)
    setPreviewImage(URL.createObjectURL(file))//create a preview url for selected image
    }
  }

  const handleUpdateProfile = async () => {
    let updatedImageURL=userData.profileImage
    if (newImage) {
      const imageRef = ref(storage, `profileImages/${currentUser.uid}/${newImage.name}`)
      await uploadBytes(imageRef, newImage)
      updatedImageURL = await getDownloadURL(imageRef)
    }
      const userDocRef = doc(db, 'users', currentUser.uid)
      const updatedData = {
        ...userData,
        profileImage:updatedImageURL||userData.profileImage,
        username: updateUsername || userData.username,
        phoneNumber:newPhoneNumber||userData.phoneNumber
      }
    await updateDoc(userDocRef, updatedData) 
    setUserData(updatedData)
    window.location.reload()

  }

  
 
  
  return (
    userData && !loading ? (
      <Container className="my-5" style={{width:"30%"}}>
        <h2 className="my-5">Profile Detail</h2>
        <Row className="d-flex justify-content-center mb-4">

          <Col className="text-center">
            
            <img
              src={previewImage||userData.profileImage}
              style={{ 
              width: "150px", 
              height: "150px", 
              borderRadius:"50%"
              }}
              onClick={()=> document.getElementById('imageUpload').click()}
            />
             
            
            <Form.Control
              type="file"
              id="imageUpload"
              style={{ display: "none" }}
              onChange={handleImageChange}
           />
            
          </Col>
        </Row>

        <Col>
          <Form>
            
            <Row>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                  <Form.Control
                    value={updateUsername || userData.username}
                    onChange={(e) => setUpdateUsername(e.target.value)}
                  />
              </Form.Group>
            </Row>
            
            <Row>
              <Form.Group className="mt-3">
                <Form.Label>Phone Number</Form.Label>           
                  <Form.Control
                    value={newPhoneNumber || userData.phoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                  />
              </Form.Group>

             
              <Button className="mt-5" onClick={handleUpdateProfile}>
                Save Update
              </Button>
        </Row>
          </Form>
          
        </Col>
       </Container>
    ) : (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  );
}