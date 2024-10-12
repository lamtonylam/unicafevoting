'use client';

import { supabase } from './lib/supabase';
import { useState, useEffect } from 'react';

export default function Home() {
  const [lunchgroups, setLunchgroups] = useState([]);

  const [newLunchGroupName, setnewLunchGroupName] = useState('');
  const [lunchtime, setLunchtime] = useState('');

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
  }

  const handleNewLunchGroupName = (e) => {
    event.preventDefault();
    setnewLunchGroupName(e.target.value);
  };

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

  return (
    <div>
      Unicafe Lunch Voting App
      <br></br>
      <br></br>
      <form onSubmit={submitNewLunchGroupName}>
        <input
          placeholder="Enter your name"
          type='text'
          value={newLunchGroupName}
          onChange={handleNewLunchGroupName}
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
      {lunchgroups.map((lunchgroup) => (
        <div key={lunchgroup.id}>
          Lunchgroup by: {lunchgroup.created_by} at: {lunchgroup.lunchtime}
        </div>
      ))}
    </div>
  );
}
