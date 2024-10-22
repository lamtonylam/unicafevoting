'use client';
import { supabase } from '../../lib/supabase';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { set, subHours } from 'date-fns';
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
    const { data, error } = await supabase
      .from('votes')
      .select('id, restaurant_id, restaurants(name), voter')
      .eq('lunchgroup_id', slug);
    if (error) {
      console.error('Error fetching vote counts:', error);
      return;
    }
    setVotes(data);
  };

  async function fetchLunchgroups() {
    const { data, error } = await supabase
      .from('lunch_group')
      .select('*')
      .eq('id', slug)
      .order('id', { ascending: true });
    if (error) console.log('error', error);
    else {
      setLunchgroupdata(data);
    }

    const { data: restaurantsData, error: restaurantsError } = await supabase
      .from('restaurants')
      .select('*')
      .order('id', { ascending: true });
    if (restaurantsError) console.log('error', restaurantsError);
    setRestaurants(restaurantsData);

    setLoadingLunchInfo(false);
  }

  const submitVote = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('votes').insert([
      {
        lunchgroup_id: slug,
        restaurant_id: voteRestaurant,
        voter: voterName,
      },
    ]);
    if (error) console.log('error', error);
    else console.log('success', data);
    setSelectedRestaurant('');
    setVoterName('');
    fetchVotes();
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
              `https://makkara.fly.dev/api/datesearch/${restaurant.name}/${refactored_lunchtime}`
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
            Temperature: {weatherData.temperature}°C, Precipitation:{' '}
            {weatherData.precipitation}mm
          </p>
          <hr />
        </>
      )}
      {loadingUnicafeData ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3>Unicafe menus on {lunchtime.slice(0, 10)}</h3>
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
