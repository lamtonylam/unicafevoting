'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import sortArray from 'sort-array';
import { getWeather } from '../../lib/weather';

export default function Page({ params: { slug } }) {
  const [lunchgroupdata, setLunchgroupdata] = useState([]);
  const [lunchtime, setLunchtime] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [votes, setVotes] = useState([]);
  const [unicafeData, setUnicafeData] = useState([]);

  // voting form
  const [voteRestaurant, setSelectedRestaurant] = useState('');
  const [voterName, setVoterName] = useState('');

  // loading state
  const [loadingLunchInfo, setLoadingLunchInfo] = useState(true);
  const [loadingUnicafeData, setLoadingUnicafeData] = useState(true);

  // weather data
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    fetchLunchgroups();
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const response = await axios.get(`/api/fetch_votes/${slug}`);
      setVotes(response.data);
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  async function fetchLunchgroups() {
    try {
      const response = await axios.get(`/api/fetch_lunchgroupdata/${slug}`);
      setLunchgroupdata(response.data);
    } catch (error) {
      console.error('Error fetching lunchgroupdata:', error);
    }

    try {
      const response = await axios.get('/api/fetch_restaurants/');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching unicafe restaurants:', error);
    }

    setLoadingLunchInfo(false);
  }

  const submitVote = async (e) => {
    e.preventDefault();
    if (!voteRestaurant || !voterName) {
      alert('Please enter all required fields');
      return;
    }
    try {
      await axios.post('/api/vote_restaurant', {
        lunchgroup_id: slug,
        restaurant_id: voteRestaurant,
        voter: voterName,
      });
      setSelectedRestaurant('');
      setVoterName('');
      await fetchVotes();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error voting');
    }
  };

  useEffect(() => {
    if (lunchgroupdata.length > 0 && lunchgroupdata[0].lunchtime) {
      let refactored_lunchtime = new Date(lunchgroupdata[0].lunchtime)
        .toISOString()
        .slice(0, 10);

      if (restaurants.length > 0) {
        restaurants.forEach((restaurant) => {
          axios
            .get(
              `/api/unicafe?restaurant=${restaurant.name}&date=${refactored_lunchtime}`
            )
            .then((response) => {
              setUnicafeData((prev) => [
                ...prev,
                { restaurantName: restaurant.name, lunchmenu: response.data },
              ]);
            });
        });
      }
    }
    setLoadingUnicafeData(false);

    // sort unicafeData by restaurant name
    setUnicafeData((prev) => sortArray([...prev], { by: 'restaurantName' }));
  }, [lunchgroupdata, restaurants]);

  // lunchtime formatting
  useEffect(() => {
    if (lunchgroupdata && lunchgroupdata.length > 0) {
      let lunchtimefixed = lunchgroupdata[0]?.lunchtime;
      if (lunchtimefixed) {
        lunchtimefixed = new Date(lunchtimefixed);
        setLunchtime(lunchtimefixed.toLocaleString('fi-FI'));
      }
    }
  }, [lunchgroupdata]);

  useEffect(() => {
    if (lunchgroupdata.length > 0) {
      getWeather(lunchgroupdata[0]?.lunchtime).then((data) => {
        setWeatherData(data);
      });
    }
  }, [lunchgroupdata]);

  function convert_timeobject_into_date_only(dateobject) {
    const new_date = new Date(dateobject);
    return new_date;
  }

  return (
    <div>
      <a href='/'>Back to frontpage</a>
      <h1>Lunchgroup: </h1>
      {loadingLunchInfo ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3>Created by: {lunchgroupdata[0]?.created_by}</h3>
          <h3>Lunch time: {lunchtime}</h3>
          {lunchgroupdata[0]?.notes && (
            <>
              <h3>Meeting place: {lunchgroupdata[0]?.notes}</h3>
            </>
          )}
          <hr />
          <h3>Votes:</h3>
          <ul>
            {votes.map((vote) => (
              <li key={vote.id}>
                <div>
                  Restaurant: {vote.restaurants.name}
                  <br />
                  Voter: {vote.voter}
                </div>
              </li>
            ))}
          </ul>
          <hr /> <h3>Weather in Kumpula at {lunchtime}:</h3>
          <p>
            {weatherData ? (
              <p>
                Temperature: {weatherData.temperature}°C, Precipitation:{' '}
                {weatherData.precipitation}mm
              </p>
            ) : (
              'No weather data found, it could be that the lunchtime has passed'
            )}
          </p>
          <hr />
        </>
      )}
      {loadingUnicafeData ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3>Unicafe menus on {lunchtime.split(' ')[0]}</h3>
          <ul>
            {unicafeData.map((restaurant) => (
              <li key={restaurant.restaurantName}>
                <h3>{restaurant.restaurantName}</h3>
                <ul>
                  {restaurant.lunchmenu.map((menu, index) => (
                    <li key={index}>{menu}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}

      <hr></hr>
      <h3>Vote for lunch restaurant</h3>
      <h3>Restaurants</h3>
      <form onSubmit={submitVote}>
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <input
                type='radio'
                id={`restaurant-${restaurant.id}`}
                name='restaurants'
                value={restaurant.id}
                checked={voteRestaurant === restaurant.id.toString()}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
              />
              <label htmlFor={`restaurant-${restaurant.id}`}>
                {restaurant.name}
              </label>
            </li>
          ))}
        </ul>
        <br />
        <input
          placeholder='Enter your name'
          type='text'
          value={voterName}
          onChange={(e) => setVoterName(e.target.value)}
        />{' '}
        <br />
        <br />
        <button type='submit'>Vote</button>
      </form>
    </div>
  );
}
