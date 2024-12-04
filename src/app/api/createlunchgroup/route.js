import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(request) {
  const { created_by, lunchtime, notes } = await request.json();

  const { data, error } = await supabase
    .from('lunch_group')
    .insert([
      {
        created_by,
        lunchtime,
        notes,
      },
    ])
    .select();

  if (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
