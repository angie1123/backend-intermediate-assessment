import { useState } from "react";
import { ButtonGroup, Table,Button,Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteBooking, updateBooking } from "../features/bookings/bookingsSlice";

function BookingCard({ booking,isEditing,onEdit,onSave,onCancle,onChange,updateData,onDelete } ) {//booking ={}//if pass in booking as(booking)=({booking:{...}}),data can only be access when using booking.booking.id
  console.log(booking)
  return (
   
    <tr>
      
      {isEditing ? ( 
      <>  
      <td>{booking.id}</td>
      <td>
            <select name="room_type" value={updateData.room_type} onChange={onChange}>
          <option>Select a type</option>
          <option value="Single Room">Single Room</option>
          <option value="Double Room">Double Room</option>
            <option value="Suite">Suite</option>
          </select>
          </td>
      <td>{booking.date}</td>
      <td><input type="date"name="checkin_date" value={updateData.checkin_date} onChange={onChange}></input></td>
      <td><input type="date" name="checkout_date" value={updateData.checkout_date} onChange={onChange}></input></td>
      <td>{booking.email}</td>
          <td>{booking.phone_number}</td>
          
          <td><Button variant="secondary" onClick={onSave}>Save</Button></td>
          <td><Button variant="secondary" onClick={onCancle}>Cancel</Button></td>

      </>
      ) : (
      <>
      <td>{booking.id}</td>
      <td>{booking.room_type}</td>
      <td>{booking.date} </td>
      <td>{booking.checkin_date}</td>
      <td>{booking.checkout_date}</td>
      <td>{booking.email}</td>
      <td>{booking.phone_number}</td>
       <td>
        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => onEdit(booking)}>Edit</Dropdown.Item>
            <Dropdown.Item onClick={() => onDelete(booking.id)}>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
      </>
       )}
      
    </tr>
  )
}

export default function BookingCardGroup() {
  const { bookings,loading } = useSelector((state) => state.bookings)
  const [editRow, setEditRow] = useState(null)
  const [updateData, setUpdateData] = useState({})
  const dispatch=useDispatch()
  
  //when user click on edit button,this function being called,and current booking pass as prop to handleEdit
  const handleEdit = (booking) => {
    setEditRow(booking.id)
    console.log(booking)
    setUpdateData(booking)//copy current booking into updateData state
  }

  const handleChange = (e) => {
  //this function called when type in the input field when on editing mode,
    //it update the updateBooking state with latest value from form inputs
  
    const { name, value } = e.target//get the value from form input
    setUpdateData({
      ...updateData,
      [name]:value//update the specific field of the booking
    })
  }

  const handleSave = () => {
    console.log(updateData)
    dispatch(updateBooking(updateData))
    setEditRow(null)
  }

  const handleCancel = () => {
    setEditRow(null)
    //the booking will stil ersist in updateData state but will overwrite by other booking when user click on edit on different row
  }

  const handleDelete = (id) => {
    dispatch(deleteBooking(id))
  }

  
  return (
   bookings && bookings.length>0 && !loading?(<Table striped>
      <thead>
        <tr>
          <th>BOOKING ID</th>
          <th>ROOM TYPE</th>
          <th>ORDER CREATE AT</th>
          <th>CHECKIN DATE</th>
          <th>CHECKOUT DATE</th>
          <th>EMAIL</th>
          <th>PHONE NUMBER</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking,index) =>
          <BookingCard
            booking={booking}
            key={index}
            isEditing={editRow===booking.id}//to check whether current row is in editing mode
            onEdit={handleEdit}
            onSave={handleSave}
            onCancle={handleCancel}
            onChange={handleChange}
            updateData={updateData}
            onDelete={handleDelete}
          />
        )}
    
      </tbody>

    </Table>):(
  <p>No bookings found</p>
)

  )
}

