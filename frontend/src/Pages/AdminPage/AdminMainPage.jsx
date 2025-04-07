// import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import hotelImage from "../../assets/istockphoto-636484522-612x612.jpg";

// const AdminMainPage = () => {
//   const [hotels, setHotels] = useState([]);
//   const [filteredHotels, setFilteredHotels] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();

//   const adminId = localStorage.getItem("adminId"); // Get admin ID
//   console.log(adminId);
  
//   useEffect(() => {
//     const fetchHotels = async () => {
//       try {
//         localStorage.removeItem("hotels"); // Force fresh fetch (temporary)
//         const response = await axios.get("http://localhost:3000/api/hotels/get", {
//           headers: { adminId }, // Fetch only admin's hotels
//         });
//         const fetchedHotels = Array.isArray(response.data) ? response.data : response.data.hotels || [];
//         setHotels(fetchedHotels);
//         setFilteredHotels(fetchedHotels);
//         localStorage.setItem("hotels", JSON.stringify(fetchedHotels));
//       } catch (error) {
//         console.log("Error fetching hotels: ", error);
//       }
//     };
//     fetchHotels();
//   }, [adminId]);

//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);
//     const filtered = hotels.filter(
//       (hotel) =>
//         hotel.location.toLowerCase().includes(query) ||
//         hotel.name.toLowerCase().includes(query)
//     );
//     setFilteredHotels(filtered);
//   };

//   const handleViewMenu = (hotelId) => {
//     navigate(`/menu/${hotelId}`);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("adminId");
//     navigate("/loginAsAdmin");
//   };

//   return (
//     <div className="hotel-page-container">
//       <nav className="navbar">
//         <div className="logo">
//           <h2>T</h2>
//         </div>
//         <div className="navbar-links">
//           <Link to="/admin">Home</Link>
//           <Link to="/admin">Hotels</Link>
//           <Link to="/admin">OYO</Link>
//           <Link to="/admin">Adventure</Link>
//           {adminId ? (
//             <button className="logout-button" onClick={handleLogout}>
//               Logout
//             </button>
//           ) : (
//             <Link to="/loginAsAdmin">Login</Link>
//           )}
//         </div>
//       </nav>

//       <div className="hotel-container">
//         <h1 className="hotel-title">🏨 Our Hotels</h1>

//         <div className="search-container">
//           <input
//             type="text"
//             className="search-input"
//             placeholder="Search hotels by location..."
//             value={searchQuery}
//             onChange={handleSearch}
//           />
//         </div>

//         <div className="hotel-grid">
//           {filteredHotels.length > 0 ? (
//             filteredHotels.map((hotel, index) => (
//               <div key={hotel.id || `hotel-${index}`} className="hotel-card">
//                 <img src={hotelImage} alt={hotel.name} className="hotel-image" />
//                 <h2 className="hotel-name">{hotel.name}</h2>
//                 <p className="hotel-location">📍 {hotel.location}</p>
//                 <p className="hotel-rating">⭐ {hotel.rating}/5</p>
//                 <button className="menu-button" onClick={() => handleViewMenu(hotel.id)}>
//                   View Menu 🍽️
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p className="no-hotels">No hotels found for this location.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminMainPage;



import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import hotelImage from "../../assets/istockphoto-636484522-612x612.jpg";
import "./AdminPage.css"; // Import your CSS file for styling

const AdminMainPage = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newHotel, setNewHotel] = useState({ name: "", image_url: null, location: "", rating: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const adminId = localStorage.getItem("adminId"); // Get admin ID
  console.log(adminId);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        localStorage.removeItem("hotels"); // Force fresh fetch (temporary)
        const response = await axios.get("http://localhost:3000/api/hotels/get", {
          headers: { adminId }, // Fetch only admin's hotels
        });
        const fetchedHotels = Array.isArray(response.data) ? response.data : response.data.hotels || [];
        setHotels(fetchedHotels);
        setFilteredHotels(fetchedHotels);
        localStorage.setItem("hotels", JSON.stringify(fetchedHotels));
      } catch (error) {
        console.log("Error fetching hotels: ", error);
      }
    };
    fetchHotels();
  }, [adminId]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = hotels.filter(
      (hotel) =>
        hotel.location.toLowerCase().includes(query) ||
        hotel.name.toLowerCase().includes(query)
    );
    setFilteredHotels(filtered);
  };

  const handleViewMenu = (hotelId) => {
    navigate(`/menu/${hotelId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    navigate("/loginAsAdmin");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewHotel((prev) => ({ ...prev, image_url: file })); // Use image_url to match database
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newHotel.name);
    if (newHotel.image_url) {
      formData.append("image_url", newHotel.image_url); // Match database column name
    }
    formData.append("location", newHotel.location);
    formData.append("rating", parseFloat(newHotel.rating) || 0);
    formData.append("adminId", adminId);

    console.log("FormData:", Object.fromEntries(formData)); // Debug FormData

    try {
      const response = await axios.post("http://localhost:3000/api/hotels/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "adminId": adminId, // Include admin ID in headers
        },
      });
      if (response.status === 201) {
        const addedHotel = response.data;
        setHotels((prev) => [addedHotel, ...prev]);
        setFilteredHotels((prev) => [addedHotel, ...prev]);
        setNewHotel({ name: "", image_url: null, location: "", rating: "" });
        setImagePreview(null); // Reset preview
        alert("Hotel added successfully!");
      }
    } catch (error) {
      console.log("Error adding hotel: ", error.response ? error.response.data : error.message);
      alert("Failed to add hotel. Please try again.");
    }
  };

  return (
    <div className="hotel-page-container">
      <nav className="navbar">
        <div className="logo">
          <h2>T</h2>
        </div>
        <div className="navbar-links">
          <Link to="/admin">Home</Link>
          <Link to="/admin">Hotels</Link>
          <Link to="/admin">OYO</Link>
          <Link to="/admin">Adventure</Link>
          {adminId ? (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/loginAsAdmin">Login</Link>
          )}
        </div>
      </nav>

      {/* New Hotel Addition Form */}
      <div className="add-hotel-container">
        <h2 className="add-hotel-title">Add New Hotel</h2>
        <form onSubmit={handleAddHotel} className="add-hotel-form">
          <input
            type="text"
            name="name"
            value={newHotel.name}
            onChange={handleInputChange}
            placeholder="Hotel Name"
            required
          />
          <input
            type="text"
            name="location"
            value={newHotel.location}
            onChange={handleInputChange}
            placeholder="Location"
            required
          />
          <input
            type="number"
            name="rating"
            value={newHotel.rating}
            onChange={handleInputChange}
            placeholder="Rating (0-5)"
            min="0"
            max="5"
            step="0.1"
            required
          />
          <input
            type="file"
            name="image_url" // Match the form data key to database column
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px" }} />
            </div>
          )}
          <button type="submit" className="add-hotel-button">
            Add Hotel
          </button>
        </form>
      </div>

      <div className="hotel-container">
        <h1 className="hotel-title">🏨 Our Hotels</h1>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search hotels by location..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="hotel-grid">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel, index) => (
              <div key={hotel.id || `hotel-${index}`} className="hotel-card">
                <img
                  src={hotel.image_url || hotelImage} // Use image_url to match database
                  alt={hotel.name}
                  className="hotel-image"
                />
                <h2 className="hotel-name">{hotel.name}</h2>
                <p className="hotel-location">📍 {hotel.location}</p>
                <p className="hotel-rating">⭐ {hotel.rating}/5</p>
                <button className="menu-button" onClick={() => handleViewMenu(hotel.id)}>
                  View Menu 🍽️
                </button>
              </div>
            ))
          ) : (
            <p className="no-hotels">No hotels found for this location.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMainPage;