import { useContext, useEffect, useState } from "react"
import { Button, Container, Form, Image } from "react-bootstrap"
import { AuthContext } from "../components/AuthProvider"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { createBooking } from "../features/bookings/bookingsSlice"

export default function BookingPage() {
  const imageUrl = "https://tr-osdcp.qunarzz.com/tr-osd-tr-manager/img/b146223235d78e28524cae9777d75490.jpg"
  const { currentUser } = useContext(AuthContext)
  const userId=currentUser.uid
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [checkinDate, setCheckinDate] = useState("")
  const [checkoutDate, setCheckoutDate] = useState("")
  const [roomType,setRoomType]=useState("")
  
  useEffect(() => {
  if (!currentUser) {
    navigate('/login');
  }
}, [currentUser, navigate]);


  const handleBooking =async (e) => {
    e.preventDefault()
    console.log(userId)
    const booking = {
      room_type: roomType,
      checkin_date: checkinDate,
      checkout_date: checkoutDate,
      phone_number: phoneNumber,
      email,
      user_id:userId      
    }

    console.log('Booking', booking)
      dispatch(createBooking(booking))
    
    setRoomType("")
    setCheckinDate("")
    setCheckoutDate("")
    setPhoneNumber("")
    setEmail("")

    navigate('/history')
    
  }
  
  return (
    <Container fluid
     
      className="d-flex justify-content-center align-items-center vh-100  "
      style={{
      boxShadow:  '0px 10px 20px rgba(0,0,0,0.1)'

      }}
   >
      {/* The background image */}
      <Image
        src={imageUrl}
        fluid
        className="top-0 start-0 w-100 h-100  position-absolute  "
        style={{
          objectFit:"cover",
          zIndex: -1,
        filter:  'brightness(80%)' 
        }}
        alt="Background"
      />

      <Form onSubmit={handleBooking}
      style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black background
          padding: '30px',
          borderRadius: '10px',
          maxWidth: '400px',
          width: '100%',
        }}>
        
        <h2 className="text-center " style={{color:"white"}}>Book Your Rom Now !</h2>
        
        <Form.Group className="mb-3" controlId="email">
          <Form.Label style={{color:"white"}}>Email</Form.Label>
          <Form.Control required value={email}  type="email" placeholder="email" onChange={(e)=>setEmail(e.target.value)}/>
        </Form.Group>

         <Form.Group className="mb-3" controlId="phone">
          <Form.Label style={{color:"white"}}>Phone Number</Form.Label>
          <Form.Control required value={phoneNumber}  type="number" placeholder="phone number" onChange={(e)=>setPhoneNumber(e.target.value)}/>
        </Form.Group>

         <Form.Group className="mb-3" controlId="checkin_date">
          <Form.Label style={{ color: "white" }}>Check In Date</Form.Label>
          <Form.Control required value={checkinDate}  type="date" onChange={(e)=>setCheckinDate(e.target.value)}/>
        </Form.Group>

         <Form.Group className="mb-3" controlId="checkout_date">
          <Form.Label style={{ color: "white" }}>Check Out Date</Form.Label>
          <Form.Control required value={checkoutDate}  type="date" onChange={(e)=>setCheckoutDate(e.target.value)}/>
        </Form.Group>


         <Form.Group className="mb-5">
          <Form.Label style={{ color: "white" }}>Room Type</Form.Label>
          <Form.Control required value={roomType} as="select" onChange={(e)=>setRoomType(e.target.value)}>
              <option>Select a type</option>
              <option value="Single Room">Single Room</option>
              <option value="Double Room">Double Room</option>
              <option value="Suite">Suite</option>
          </Form.Control>
        </Form.Group>
        
        
        <Button type="onsubmit" variant="light" >
          Book Now
        </Button>

      </Form>
        
      
    
    </Container>
  )

}