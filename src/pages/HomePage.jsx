import { useContext } from "react";
import { Button, Container, Image } from "react-bootstrap";
import { AuthContext } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const imageUrl = "https://peakvisor.com/img/news/Altai-mountain-Chuya-ridge.jpg";
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const handleReserve = () => {
    if (currentUser) {
  navigate('/booking')  
    } else {
      navigate('/login')
  }  
  }
  return (
    <Container fluid
     
      className="d-flex justify-content-center align-items-center vh-100  "
      style={{
      boxShadow:  '0px 10px 20px rgba(0,0,0,0.5)'

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
        filter:  'brightness(70%)' 
        }}
        alt="Background"
      />

      {/* Text content */}
      <div
        className="text-center d-flex flex-column justify-content-center align-items-center"
        style={{ zIndex: 1, color: "white", maxWidth: "100%",alignItems:"center", display:"flex", flexDirection:"column"}} >
        <h1 className="display-8 fw-bold">Spend Quality Holidays With Us</h1>
        <p className="lead">
          Lorem Ipsum is simply text of the Lorem Ipsum is simply my text of the <br />
          printing and Ipsum is simply.Lorem Ipsum is simply text of the Lorem <br />
          Ipsum is simply my text of the printing and Ipsum is simply.Lorem <br />
          Ipsum is simply text of the Lorem Ipsum is simply my text of the <br />
          printing and Ipsum is simply.
        </p>
        <Button variant="light" size="lg" className="p-3"onClick={handleReserve}>
          Reserve Now
        </Button>
      </div>
    
    </Container>
  );
}
