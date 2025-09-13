import React, { useState } from "react";

function App() {
  // State variables
  const [city, setCity] = useState("");        // Stores the city input by the user
  const [weather, setWeather] = useState(null); // Stores the fetched weather data
  const [error, setError] = useState("");      // Stores error messages

  // Function to fetch weather data
  const getWeather = async () => {
    if (!city) {
      // If input is empty, show warning
      setError("⚠️ Please enter a city name!");
      setWeather(null);
      return;
    }

    try {
      setError(""); // Clear previous errors

      // Step 1: Get coordinates of the city using OpenStreetMap Nominatim API
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${city}&format=json&limit=1`
      );
      const geoData = await geoRes.json();

      if (geoData.length === 0) {
        // If city not found
        setError("❌ City not found!");
        setWeather(null);
        return;
      }

      const lat = geoData[0].lat; // Latitude of the city
      const lon = geoData[0].lon; // Longitude of the city

      // Step 2: Get weather using Open-Meteo API
      // Added timezone=Asia/Kolkata to display IST time
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Asia/Kolkata`
      );
      const weatherData = await weatherRes.json();

      // Update weather state
      setWeather(weatherData.current_weather);
    } catch {
      // Handle any network or API errors
      setError("⚠️ Error fetching weather!");
      setWeather(null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to top, #a1c4fd, #c2e9fb)",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          width: "350px",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        }}
      >
        {/* App Title */}
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>🌤 Weather Now</h1>

        {/* City Input Field */}
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            width: "80%",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            marginBottom: "15px",
          }}
        />

        {/* Get Weather Button */}
        <button
          onClick={getWeather}
          style={{
            width: "50%",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background: "#4f46e5",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#4338ca")}
          onMouseOut={(e) => (e.target.style.background = "#4f46e5")}
        >
          Get Weather
        </button>

        {/* Display Errors */}
        {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}

        {/* Display Weather Info */}
        {weather && (
          <div style={{ marginTop: "25px", fontSize: "18px" }}>
            <p>🌡 Temperature: {weather.temperature}°C</p>
            <p>💨 Wind Speed: {weather.windspeed} km/h</p>
            {/* Display IST time in readable format */}
            <p>
              ⏰ Time:{" "}
              {new Date(weather.time).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour12: true,
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
