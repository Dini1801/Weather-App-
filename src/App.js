import React, { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    setError("");
    setWeather(null);

    try {
      // Step 1: Get lat/lon from city
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("❌ City not found!");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Step 2: Get weather data
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        location: `${name}, ${country}`,
        temperature: weatherData.current_weather.temperature,
        wind: weatherData.current_weather.windspeed,
        condition: weatherData.current_weather.weathercode,
      });
    } catch (err) {
      setError("⚠️ Something went wrong. Please try again!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 p-6">
      <h1 className="text-4xl font-bold text-white mb-8">🌤 Weather Now</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchWeather}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-200 font-medium">{error}</p>}

      {weather && (
        <div className="bg-white shadow-xl rounded-xl p-6 w-72 text-center">
          <h2 className="text-xl font-semibold mb-2">{weather.location}</h2>
          <p className="text-3xl font-bold text-blue-600">{weather.temperature}°C</p>
          <p className="mt-2">💨 {weather.wind} km/h</p>
          <p className="text-gray-600">Weather code: {weather.condition}</p>
        </div>
      )}
    </div>
  );
}

export default App;
