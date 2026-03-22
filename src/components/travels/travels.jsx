import React from 'react'
import './travels.css'
import { Link } from "react-router-dom";

const Travels = () => {
  const places = [
    {
      name: "Taj Mahal, Agra",
      img: "https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?w=800&auto=format&fit=crop&q=60",
      location: "Uttar Pradesh",
      rating: "4.8"
    },
    {
      name: "India Gate, Delhi",
      img: "https://images.pexels.com/photos/14520365/pexels-photo-14520365.jpeg",
      location: "New Delhi",
      rating: "4.6"
    },
    {
      name: "Ghat in Varanasi",
      img: "https://images.unsplash.com/photo-1599831069477-b2acdc0bcb91?w=500&auto=format&fit=crop&q=60",
      location: "Uttar Pradesh",
      rating: "4.7"
    },
    {
      name: "Kerala Backwaters",
      img: "https://images.unsplash.com/photo-1589983846997-04788035bc83?w=500&auto=format&fit=crop&q=60",
      location: "Kerala",
      rating: "4.9"
    },
    {
      name: "Himachal Pradesh",
      img: "https://plus.unsplash.com/premium_photo-1661952578770-79010299a9f9?w=500&auto=format&fit=crop&q=60",
      location: "Himachal Pradesh",
      rating: "4.8"
    },
    {
      name: "Goa Beaches",
      img: "https://images.unsplash.com/photo-1560179406-1c6c60e0dc76?w=500&auto=format&fit=crop&q=60",
      location: "Goa",
      rating: "4.7"
    },
    {
      name: "Rishikesh",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60",
      location: "Uttarakhand",
      rating: "4.8"
    },
    {
      name: "South India",
      img: "https://images.unsplash.com/photo-1541173061692-bbec3dc2bf85?w=500&auto=format&fit=crop&q=60",
      location: "Tamil Nadu",
      rating: "4.6"
    },
    {
      name: "Jaipur, Pink City",
      img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=60",
      location: "Rajasthan",
      rating: "4.7"
    },
    {
      name: "Mysore Palace",
      img: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Mysore_Palace_Morning.jpg",
      location: "Karnataka",
      rating: "4.8"
    },
    {
      name: "Darjeeling",
      img: "https://trekinsikkim.in/_next/image?url=https%3A%2F%2Fupload.trekinsikkim.in%2Fuploads%2Fmedia-gallery%2Ffiles-1748685567719-977695027&w=3840&q=75",
      location: "West Bengal",
      rating: "4.7"
    },
    {
      name: "Amritsar Golden Temple",
      img: "https://upload.wikimedia.org/wikipedia/commons/9/94/The_Golden_Temple_of_Amrithsar_7.jpg",
      location: "Punjab",
      rating: "4.9"
    },
    {
      name: "Ladakh",
      img: "https://imgcld.yatra.com/ytimages/image/upload/v1517480778/AdvNation/ANN_DES95/ann_top_Ladakh_buV00Q.jpg",
      location: "Jammu & Kashmir",
      rating: "4.9"
    },
    {
      name: "Andaman Islands",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkKR4pI_b_ImlbZc_JFqQGCl3kAU9Tqvi9Fw&s",
      location: "Andaman & Nicobar",
      rating: "4.8"
    },
    {
      name: "Udaipur",
      img: "https://images.contentstack.io/v3/assets/blt06f605a34f1194ff/blt4cf134d7dc5ff2c0/68906f5f7adc79b45ae98a6f/iStock-2197451116-2-HEADER_MOBILE.jpg?fit=crop&disable=upscale&auto=webp&quality=60&crop=smart",
      location: "Rajasthan",
      rating: "4.8"
    },
    {
      name: "Kolkata",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7A2JM9jGcorLPUWMro5GqVAgajiZT7tmr7g&s",
      location: "West Bengal",
      rating: "4.5"
    }
  ];

  return (
    <div className='travels' id='travels'>
      <div className="travels-header">
        <h1>
          Find Your Next Journey with TransXs - <span className="highlight">Where Every Trip is a New Story!</span>
        </h1>
        <p className="subtitle">Discover the most beautiful destinations across India</p>
      </div>
      
      <div className="places">
        {places.map((place, index) => (
          <div key={index} className="card">
            <div className="card-image">
              <img src={place.img} alt={place.name} />
              <div className="card-rating">
                <span className="star">★</span> {place.rating}
              </div>
            </div>
            <div className="card-content">
              <h3>{place.name}</h3>
              <p className="location">{place.location}</p>
              <Link to="/book">Explore →</Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="travel">
        <Link to="/find" className="find-more-btn">Find More Destinations →</Link>
      </div>
    </div>
  )
}

export default Travels