import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export const revalidate = 0;

export async function GET(request, { params }) {
  const { slug } = params; // 'a', 'b', or 'c'

  const { data, error } = await supabase
    .from('votes')
    .select('id, restaurant_id, restaurants(name), voter')
    .eq('lunchgroup_id', slug);

  if (error) {
    console.error('Error fetching lunch groups:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
