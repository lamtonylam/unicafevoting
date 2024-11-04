## Introduction

The Unicafe Voting App allows users to create lunch groups, vote for restaurants, view their menus on respective dates, and view weather information for the lunch time.
Allowing diners to make informed decisions where to eat.

## Key Features

- **Create Lunch Groups**: Users can create new lunch groups with a specified lunch time and notes.
- **Vote for Restaurants**: Users can vote for their preferred restaurant within a lunch group.
- **Weather Information**: Displays weather information from openmeteo for the lunch time.
- **Unicafe Menus**: Fetches and displays Unicafe menus for the selected date.

## Tech used:

- **Next.js**
- **React**
- **Supabase**

## Supabase database

Database structure for supabase, run this in supabase
![postgres-db](https://github.com/user-attachments/assets/be35b4f8-e8ec-4bc5-b4f4-5eeb03c1f690)

```plaintext
CREATE TABLE lunch_group (
    id SERIAL PRIMARY KEY,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    lunchtime TIMESTAMPTZ,
    notes TEXT
);

CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    voter TEXT NOT NULL,
    lunchgroup_id INT REFERENCES lunch_group(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE
);

```

## Local development

Create a `.env.local` file in the `unicafevoting` folder at the root:

```plaintext
NEXT_PUBLIC_SUPABASE_URL=your_value
NEXT_PUBLIC_SUPABASE_KEY=your_value
```

Run

```
npm install
```

To start dev server:

```
npm run dev
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
