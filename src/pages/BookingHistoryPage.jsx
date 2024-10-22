import { Container } from "react-bootstrap"
import BookingCardGroup from "../components/BookingCardGroup"
import { useContext, useEffect } from "react"
import { AuthContext } from "../components/AuthProvider"
import { useDispatch } from "react-redux"
import { fetchBookingsByUser } from "../features/bookings/bookingsSlice"
import { useNavigate } from "react-router-dom"


export default function BookingHistoryPage() {
  const { currentUser } = useContext(AuthContext)
 
  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log(currentUser)
  
  useEffect(() => {
  if (currentUser) {
    const userId = currentUser.uid;
    dispatch(fetchBookingsByUser(userId));
  } 
}, [currentUser, dispatch, navigate]);

  
  return (
    <Container className="m-5">
    <h2 className="mb-5">Booking History</h2>
    <BookingCardGroup/>
  </Container>
      )
}