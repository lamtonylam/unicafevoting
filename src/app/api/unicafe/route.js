// unicafe menus
// api route is /api/unicafe?restaurant=chemicum&date=2024-11-11
export const revalidate = 60;

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const restaurant = searchParams.get('restaurant');
  const date = searchParams.get('date');

  const data = await fetch(
    `https://makkara.fly.dev/api/datesearch/${restaurant}/${date}`
  );
  const menu = await data.json();

  return Response.json(menu);
}
