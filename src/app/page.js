'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function Home() {
  const [lunchgroups, setLunchgroups] = useState([]);

  // creating new lunch group
  const [newLunchGroupName, setnewLunchGroupName] = useState('');
  const [lunchtime, setLunchtime] = useState('');
  const [lunchNotes, setLunchNotes] = useState('');

  useEffect(() => {
    fetchLunchgroups();
  }, []);

  async function fetchLunchgroups() {
    try {
      const response = await axios.get('/api/fetch_lunchgroups');
      setLunchgroups(response.data);
    } catch (error) {
      console.error('Error fetching lunch groups:', error);
    }
  }

  const submitNewLunchGroupName = async (e) => {
    e.preventDefault();

    const lunchtime_with_timezone = new Date(lunchtime);
    if (newLunchGroupName === '' || lunchtime === '') {
      alert('Please enter all required fields');
      return;
    }

    try {
      await axios.post('/api/createlunchgroup', {
        created_by: newLunchGroupName,
        lunchtime: lunchtime_with_timezone,
        notes: lunchNotes,
      });
      setnewLunchGroupName('');
      setLunchtime('');
      setLunchNotes('');
      fetchLunchgroups();
    } catch (error) {
      console.error('Error creating lunch group:', error);
      alert('Failed to create lunch group');
    }
  };

  const timefixed = (time) => {
    const date = new Date(time);
    return date.toLocaleString('fi-FI');
  };

  return (
    <div>
      <h2>Unicafe Lunch Voting App</h2>
      <br></br>
      <br></br>
      Create new lunch group
      <form onSubmit={submitNewLunchGroupName}>
        <label htmlFor='newLunchGroupName'></label>
        <input
          placeholder='Enter your name'
          type='text'
          value={newLunchGroupName}
          onChange={(e) => setnewLunchGroupName(e.target.value)}
          required
        />
        <b> *</b>
        <br></br>
        <input
          type='datetime-local'
          value={lunchtime}
          onChange={(e) => setLunchtime(e.target.value)}
          required
        />
        <b> *</b>
        <br />
        <input
          placeholder='Meeting place'
          type='text'
          value={lunchNotes}
          onChange={(e) => setLunchNotes(e.target.value)}
        />
        <br />
        <br />
        <button type='submit'>Create new lunch group</button>
      </form>
      <br />
      <hr />
      <h2>Lunch groups</h2>
      <p>
        Entries older than 3 days are automatically removed from the database.
      </p>
      <br />
      {lunchgroups.map((lunchgroup) => (
        <div key={lunchgroup.id}>
          <h3>
            {lunchgroup.created_by} - {timefixed(lunchgroup.lunchtime)}
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
