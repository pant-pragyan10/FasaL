import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Client } from "@gradio/client";
export function Form() {
  const [formData, setFormData] = useState({
    state: "",
    city: "",
    N: "",
    P: "",
    K: "",
    soil_type: "",
    crop_type: "",
    humidity: "",
    temperature: "",
    ph: "",
  });
  const [prediction, setPrediction] = useState(null);
  const [weatherError, setWeatherError] = useState("");

  const states = [
    "andhra pradesh",
    "arunachal pradesh",
    "assam",
    "bihar",
    "goa",
    "gujarat",
    "haryana",
    "jammu and kashmir",
    "karnataka",
    "kerala",
    "madhya pradesh",
    "maharashtra",
    "manipur",
    "meghalaya",
    "mizoram",
    "nagaland",
    "odisha",
    "punjab",
    "rajasthan",
    "tamil nadu",
    "telangana",
    "uttar pradesh",
    "west bengal",
    "chandigarh",
    "dadra and nagar haveli",
    "himachal pradesh",
    "puducherry",
    "sikkim",
    "tripura",
    "andaman and nicobar islands",
    "chhattisgarh",
    "uttarakhand",
    "jharkhand",
  ];

  const soilTypes = [
    "Loamy",
    "Sandy",
    "Clay",
    "Silt",
    "Peaty",
    "Saline",
    "Chalky",
    "Alluvial",
    "Black",
    "Red",
    "Laterite",
    "Mountain",
    "Desert",
  ];

  const crops = [
    "cotton",
    "horsegram",
    "jowar",
    "maize",
    "moong",
    "ragi",
    "rice",
    "sunflower",
    "wheat",
    "sesamum",
    "soyabean",
    "rapeseed",
    "jute",
    "arecanut",
    "onion",
    "potato",
    "sweetpotato",
    "tapioca",
    "turmeric",
    "barley",
    "banana",
    "coriander",
    "garlic",
    "blackpepper",
    "cardamom",
    "cashewnuts",
    "blackgram",
    "coffee",
    "ladyfinger",
    "brinjal",
    "cucumber",
    "grapes",
    "mango",
    "orange",
    "papaya",
    "tomato",
    "cabbage",
    "bottlegourd",
    "pineapple",
    "carrot",
    "radish",
    "bittergourd",
    "drumstick",
    "jackfruit",
    "cauliflower",
    "watermelon",
    "ashgourd",
    "beetroot",
    "pomegranate",
    "ridgegourd",
    "pumpkin",
    "apple",
    "ginger",
  ];

  useEffect(() => {
    getLocationAndFetchWeather();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getLocationAndFetchWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude); // Fetch weather using coordinates
        },
        (error) => {
          setWeatherError("Error fetching location");
          console.error("Error getting location:", error);
        }
      );
    } else {
      setWeatherError("Geolocation is not supported by this browser.");
    }
  };

  const fetchWeatherData = async (lat, lon) => {
    const apiKey = "258e0f39230d3af6d00f0d4552b76cbe";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      const { main, name } = response.data; // Get the city name from the response

      // Update the formData with temperature, humidity, and city name
      setFormData((prevState) => ({
        ...prevState,
        Humidity: main.humidity,
        Temperature: main.temp,
        City: name, // Set the city name
      }));
      setWeatherError("");
    } catch (error) {
      setWeatherError("Error fetching weather data");
      console.error(
        "Error fetching weather data:",
        error.response?.data || error.message
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.City) {
      setWeatherError("Please select a city or allow location access.");
      return;
    }

    // Get location and weather before submitting
    getLocationAndFetchWeather();

    try {
      const client = await Client.connect("Shinichi876/fertilizer_recommendation");
      const result = await client.predict("/predict", { formData });
      setPrediction(result.data);
    } catch (error) {
      console.error(
        "Error submitting data:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
          <div className=" min-h-screen flex flex-col items-center justify-center">
      <img src="fasal.jpeg" className="h-50 w-80"></img>
      <br />
      <br/>
      <h1 className="font-bold text-5xl text-center">CROP YIELD</h1>
      <br/>
        </div>
        

      <div className="flex flex-col justify-center items-center">
        <img src="fasal.jpeg " className="h-50 w-80"></img>
        <br />
        <h1 className="font-bold text-3xl text-center">Fertilizer Level Recommendation</h1>
      </div>
      <br></br>
    <form
      onSubmit={handleSubmit}
      className="flex-row justify-center text-center"
    >
      <div style={{ marginBottom: "7px" }}>
        <select
          style={{ padding: 10, margin: 2, borderRadius: 3, width: 200 }}
          name="State"
          value={formData.state}
          onChange={handleChange}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <br />
      </div>
      <div style={{ marginBottom: "7px" }}>
        <input
          style={{ padding: 10, margin: 2, borderRadius: 3 }}
          type="text"
          name="City"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />
        <br />
      </div>
      <div style={{ marginBottom: "7px" }}>
        <select
          style={{ padding: 10, margin: 2, borderRadius: 3, width: 200 }}
          name="Soil_Type"
          value={formData.soil_type}
          onChange={handleChange}
        >
          <option value="">Select Soil Type</option>
          {soilTypes.map((soilType) => (
            <option key={soilType} value={soilType}>
              {soilType}
            </option>
          ))}
        </select>
        <br />
      </div>
      <div style={{ marginBottom: "7px" }}>
        <select
          style={{ padding: 10, margin: 2, borderRadius: 3, width: 200 }}
          name="Crop_Type"
          value={formData.crop_type}
          onChange={handleChange}
        >
          <option value="">Select Crop Type</option>
          {crops.map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>
        <br />
      </div>
      {Object.keys(formData)
        .filter(
          (key) =>
            key !== "State" &&
            key !== "City" &&
            key != "Soil_Type" &&
            key != "Crop_Type"
        )
        .map((key) => (
          <div key={key} style={{ marginBottom: "7px" }}>
            <input
              style={{ padding: 10, margin: 2, borderRadius: 3 }}
              type={key === "Crop_Type" ? "text" : "number"}
              name={key}
              placeholder={key}
              value={formData[key]}
              onChange={handleChange}
            />
            <br />
          </div>
        ))}
      {weatherError && <p style={{ color: "red" }}>{weatherError}</p>}
        <button onClick={getLocationAndFetchWeather}
         style={{
          padding: 15,
          borderRadius: "5px",
          margin: 15,
          backgroundColor: "black",
          color: "white",
        }}>
        Use Current Location for Weather Data
      </button>

      <button
        type="submit"
        style={{
          padding: 15,
          borderRadius: "5px",
          margin: 15,
          backgroundColor: "black",
          color: "white",
        }}
      >
        GET FERTILIZER LEVEL RECOMMENDATION
      </button>
      {prediction && <div>Prediction: {prediction}</div>}
      </form>
      </div>
  );
}