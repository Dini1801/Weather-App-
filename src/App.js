import React, { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city) {
      setError("⚠️ Please enter a city name!");
      setWeather(null);
      return;
    }
    try {
      setError("");
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${city}&format=json&limit=1`
      );
      const geoData = await geoRes.json();

      if (geoData.length === 0) {
        setError("❌ City not found!");
        setWeather(null);
        return;
      }

      const lat = geoData[0].lat;
      const lon = geoData[0].lon;

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather(weatherData.current_weather);
    } catch {
      setError("⚠️ Error fetching weather!");
      setWeather(null);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(to top, #a1c4fd, #c2e9fb)",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "30px",
        width: "350px",
        textAlign: "center",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
      }}>
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>🌤 Weather Now</h1>
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
            marginBottom: "15px"
          }}
        />
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
            transition: "0.3s"
          }}
          onMouseOver={e => e.target.style.background="#4338ca"}
          onMouseOut={e => e.target.style.background="#4f46e5"}
        >
          Get Weather
        </button>

        {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}

        {weather && (
          <div style={{ marginTop: "25px", fontSize: "18px" }}>
            <p>🌡 Temperature: {weather.temperature}°C</p>
            <p>💨 Wind Speed: {weather.windspeed} km/h</p>
            <p>⏰ Time: {weather.time}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
