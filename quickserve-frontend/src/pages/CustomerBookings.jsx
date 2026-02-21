import { useEffect, useState } from "react";
import axios from "axios";

function CustomerBookings() {

  const [bookings, setBookings] = useState([]);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await axios.get(
      `http://localhost:8080/api/bookings/customer/${email}`
    );
    setBookings(res.data);
  };

  const submitRating = async (id) => {
    const rating = prompt("Enter rating (1-5)");
    const review = prompt("Enter review");

    if (!rating || rating < 1 || rating > 5) {
      alert("Invalid rating!");
      return;
    }

    await axios.put(
      `http://localhost:8080/api/bookings/rate/${id}?rating=${rating}&review=${review}`
    );

    alert("⭐ Thanks for your feedback!");
    fetchBookings();
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>My Bookings</h2>

      {bookings.map((booking) => (
        <div key={booking.id}
             style={{
               border: "1px solid #ccc",
               padding: "15px",
               marginBottom: "15px",
               borderRadius: "8px"
             }}>

          <h3>{booking.serviceType}</h3>
          <p>Status: <b>{booking.status}</b></p>

          {/* 🔔 Notification */}
          {booking.status === "COMPLETED" &&
           booking.ratingNotified &&
           !booking.rating && (
            <div style={{
              background: "#fff3cd",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "6px"
            }}>
              🔔 Your service is completed! Please rate your experience.
            </div>
          )}

          {/* ⭐ Rating Button */}
          {booking.status === "COMPLETED" && !booking.rating && (
            <button
              onClick={() => submitRating(booking.id)}
              style={{
                padding: "8px 14px",
                background: "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
              ⭐ Rate Service
            </button>
          )}

          {/* ⭐ Show Rating */}
          {booking.rating && (
            <div style={{ marginTop: "10px" }}>
              <p>⭐ Rated: {booking.rating}/5</p>
              <p>Review: {booking.review}</p>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}

export default CustomerBookings;