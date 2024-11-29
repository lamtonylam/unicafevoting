import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export const revalidate = 0;

export async function GET(request, { params }) {
  const { slug } = params; // 'a', 'b', or 'c'

  const { data, error } = await supabase
    .from('lunch_group')
    .select('*')
    .eq('id', slug)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching lunchgroup data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
