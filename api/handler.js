import axios from 'axios';
import { weatherAPI } from 'constants';

const weatherApi = (p) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${weatherAPI}&q=${p.city}&days=${p.days || 3}&aqi=yes&alerts=yes`;
const locationApi = (p) =>
  `https://api.weatherapi.com/v1/search.json?key=${weatherAPI}&q=${p.city}`;

const handleApi = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return null;
  }
};

export const getWeather = params=>{
    let url = weatherApi(params);
    return handleApi(url);
}

export const getLocation = params=>{
    let url = locationApi(params);
    return handleApi(url);
}