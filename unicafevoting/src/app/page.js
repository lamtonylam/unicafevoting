'use client';

import { supabase } from './lib/supabase';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [lunchgroups, setLunchgroups] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  // creating new lunch group
  const [newLunchGroupName, setnewLunchGroupName] = useState('');
  const [lunchtime, setLunchtime] = useState('');

  // voting lunch restaurants
  const [voteLunchGroup, setvoteLunchGroup] = useState('');
  const [voteRestaurant, setSelectedRestaurant] = useState('');
  const [voterName, setVoterName] = useState('');

  useEffect(() => {
    fetchLunchgroups();
  }, []);

  async function fetchLunchgroups() {
    const { data, error } = await supabase
      .from('lunch_group')
      .select('*')
      .order('id', { ascending: true });
    if (error) console.log('error', error);
    else setLunchgroups(data);

    const { data: restaurantsData, error: restaurantsError } = await supabase
      .from('restaurants')
      .select('*')
      .order('id', { ascending: true });
    if (restaurantsError) console.log('error', restaurantsError);
    setRestaurants(restaurantsData);
  }

  const submitNewLunchGroupName = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('lunch_group')
      .insert([{ created_by: newLunchGroupName, lunchtime: lunchtime }]);
    if (error) console.log('error', error);
    else console.log('success', data);
    setnewLunchGroupName('');
    setLunchtime('');
    fetchLunchgroups();
  };

  const submitVote = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('votes').insert([
      {
        lunchgroup_id: voteLunchGroup,
        restaurant_id: voteRestaurant,
        voter: voterName,
      },
    ]);
    if (error) console.log('error', error);
    else console.log('success', data);
    setvoteLunchGroup('');
    setSelectedRestaurant('');
    setVoterName('');
    fetchLunchgroups();
  };

  return (
    <div>
      <h2>Unicafe Lunch Voting App</h2>
      <br></br>
      <br></br>
      Create new lunch group
      <form onSubmit={submitNewLunchGroupName}>
        <input
          placeholder='Enter your name'
          type='text'
          value={newLunchGroupName}
          onChange={(e) => setnewLunchGroupName(e.target.value)}
        />
        <br></br>
        <input
          type='datetime-local'
          value={lunchtime}
          onChange={(e) => setLunchtime(e.target.value)}
        />
        <button type='submit'>Create new lunch group</button>
      </form>
      <br></br>
      <hr></hr>
      <h3>Lunchgroups</h3>
      {lunchgroups.map((lunchgroup) => (
        <div key={lunchgroup.id}>
          <h3>
            {lunchgroup.created_by} - {lunchgroup.lunchtime}
          </h3>
          <Link href={`/lunchgroup/${lunchgroup.id}`}>
            {' '}
            Vote for lunch group
          </Link>
        </div>
      ))}
      {/* <div>
        <h3>Debug Information</h3>
        <pre>
          {JSON.stringify(
            {
              lunchgroups,
              restaurants,
              newLunchGroupName,
              lunchtime,
              voteLunchGroup,
              voteRestaurant,
              voterName,
            },
            null,
            2
          )}
        </pre>
      </div> */}
    </div>
  );
}
