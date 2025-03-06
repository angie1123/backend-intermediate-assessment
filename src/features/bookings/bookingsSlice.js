import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"


const API_URL = "https://hotel-booking-api-omega.vercel.app"
export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async ({ room_type, checkin_date,checkout_date, phone_number, email,user_id }) => {

    const data = {
      room_type,
      checkin_date,
      checkout_date,
      phone_number,
      email,
      user_id 
    }

    const res = await axios.post(`${API_URL}/bookings`, data)
    console.log(res.data)
    return res.data
  }
)

export const fetchBookingsByUser = createAsyncThunk(
  "bookings/fetchBookingsByUser",
  async (user_id) => {
    try {
      const res = await axios.get(`${API_URL}/bookings/users/${user_id}`)
      console.log(res.data)
      return res.data
    } catch (error) {
      console.error(error)
    }
    }
)



export const updateBooking = createAsyncThunk(
  "bookings/updateBooking",
  async ({ id, room_type, checkin_date, checkout_date }) => {
    try {
      const updateData = {
        room_type,
        checkin_date,
        checkout_date,
        id
      }
      const res = await axios.put(`${API_URL}/bookings/${id}`,  updateData)
      console.log(res)
      return res.data
    } catch (error) {
      console.error(error)
    }
  }
)

export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",
  async (id ) => {
    try {
      await axios.delete(`${API_URL}/bookings/${id}`)
      return id
    } catch (error) {
      console.error(error)
    }
  }
)

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: { bookings:[], loading: true },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.fulfilled, (state, action) => {
     state.bookings=[action.payload,...state.bookings] 
      })
      .addCase(fetchBookingsByUser.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.loading = false;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const updatedBooking = action.payload
        console.log(updatedBooking)
        const bookingIndex=state.bookings.findIndex((booking) => booking.id === updatedBooking.id)
        if (bookingIndex !== -1) {
          state.bookings[bookingIndex]=updatedBooking
        }
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
       
      state.bookings=state.bookings.filter((booking)=>booking.id!==action.payload)
    })
    
  }
})

export default bookingsSlice.reducer