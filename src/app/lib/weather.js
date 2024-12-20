import { fetchWeatherApi } from 'openmeteo';

export const getWeather = async (datetime) => {
  const roudedDate = new Date(datetime);
  roudedDate.setMinutes(0);

  const params = {
    latitude: 60.2094,
    longitude: 24.9642,
    hourly: ['temperature_2m', 'precipitation'],
    timezone: 'GMT',
  };
  const url = 'https://api.open-meteo.com/v1/forecast';
  const responses = await fetchWeatherApi(url, params);

  // Helper function to form time ranges
  const range = (start, stop, step) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();
  const latitude = response.latitude();
  const longitude = response.longitude();

  const hourly = response.hourly();

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    hourly: {
      time: range(
        Number(hourly.time()),
        Number(hourly.timeEnd()),
        hourly.interval()
      ).map((t) => new Date(t * 1000)),
      temperature2m: hourly.variables(0).valuesArray(),
      precipitation: hourly.variables(1).valuesArray(),
    },
  };

  for (let i = 0; i < weatherData.hourly.time.length; i++) {
    const weatherdate = new Date(weatherData.hourly.time[i]);
    if (weatherdate.getTime() === roudedDate.getTime()) {
      return {
        temperature: Math.round(weatherData.hourly.temperature2m[i]),
        precipitation: weatherData.hourly.precipitation[i],
      };
    }
  }
};
