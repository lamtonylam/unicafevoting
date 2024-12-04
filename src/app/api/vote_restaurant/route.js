import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(request) {
  const { lunchgroup_id, restaurant_id, voter } = await request.json();

  const { data, error } = await supabase
    .from('votes')
    .insert([
      {
        lunchgroup_id,
        restaurant_id,
        voter,
      },
    ])
    .select();

  if (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
