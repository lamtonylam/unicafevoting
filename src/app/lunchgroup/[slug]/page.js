'use client';
import { supabase } from '../../lib/supabase';
import { useState, useEffect } from 'react';

export default function Page({ params: { slug } }) {
  const [lunchgroupdata, setLunchgroupdata] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [votes, setVotes] = useState([]);

  // voting form
  const [voteRestaurant, setSelectedRestaurant] = useState('');
  const [voterName, setVoterName] = useState('');

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
    else setLunchgroupdata(data);

    const { data: restaurantsData, error: restaurantsError } = await supabase
      .from('restaurants')
      .select('*')
      .order('id', { ascending: true });
    if (restaurantsError) console.log('error', restaurantsError);
    setRestaurants(restaurantsData);
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
    fetchLunchgroups();
    fetchVotes();
  };

  return (
    <div>
      <a href='/'>Back to frontpage</a>
      <h1>Lunchgroup: </h1>
      <h3>Created by: {lunchgroupdata[0]?.created_by}</h3>
      <h3>Lunch time: {lunchgroupdata[0]?.lunchtime}</h3>
      <hr></hr>
      <h3>Votes:</h3>
      <ul>
        {votes.map((vote) => (
          <li key={vote.id}>
            <div>
              Restaurant: {vote.restaurants.name}
              <br></br>
              Voter: {vote.voter}
            </div>
          </li>
        ))}
      </ul>
      <hr></hr>
      <h3>Vote for lunch restaurant</h3>
      <h3>Restaurants</h3>
      Choose Unicafe restaurant
      <form onSubmit={submitVote}>
        {restaurants.map((restaurant) => (
          <div key={restaurant.id}>
            <input
              type='radio'
              id={`restaurant-${restaurant.id}`}
              name='restaurants'
              value={restaurant.id}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
            />
            <label htmlFor={`restaurant-${restaurant.id}`}>
              {restaurant.name}
            </label>
          </div>
        ))}
        <br></br>
        <input
          placeholder='Enter your name'
          type='text'
          value={voterName}
          onChange={(e) => setVoterName(e.target.value)}
        />{' '}
        <br></br>
        <br></br>
        <button type='submit'>Vote</button>
      </form>
    </div>
  );
}