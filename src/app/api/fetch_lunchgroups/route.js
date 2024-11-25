import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export const revalidate = 0;

export async function GET() {
  const { data, error } = await supabase
    .from('lunch_group')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching lunch groups:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
