
## 📋 Table of Contents

- [Description](#-description)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [API Endpoints](#-api-endpoints)
- [Usage](#-usage)
- [Data Methodology & Limitations](#-data-methodology--limitations)
- [Project Structure](#-project-structure)

## 🎯 Description

I don't think Spotify Wrapped got me this year… so I made my own, just to check.
Pulled all my listening data via the Spotify API and ran an ETL pipeline.
Used dbt for transformations, calculated my own results, and built a decent UI with the help of v0 to present them — because I'm a data chick, not a frontend wizard.

Made for fun, learning, and peace of mind.
Built out of curiosity and love for data.

## ✨ Features

- 📊 Automatic extraction of Spotify data (recent plays, top tracks, artists)
- 🔄 Complete ETL pipeline with Python
- 🗄️ PostgreSQL storage (Neon)
- 🔧 Data transformations with dbt (Silver and Gold layers)
- 🎨 Modern frontend with Next.js and React
- 📱 Responsive design and smooth animations

## 📦 Prerequisites

- Python 3.12 or higher
- Node.js 18+ and pnpm (or npm/yarn)
- Spotify account with API access
- PostgreSQL database (recommended: Neon)
- Spotify Developer account

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <your-repository>
cd spotify-wrapped
```

### 2. Set up the Backend (ETL)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# Install dependencies
cd spotify_etl
pip install -r requirements.txt
```

### 3. Set up the Frontend

```bash
cd frontend
pnpm install
# or
npm install
```

### 4. Set up dbt


```bash
# Install dbt (if not already installed)
pip install dbt-postgres

# Navigate to transformations directory
cd transformations

# Configure dbt profile (see configuration section)
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root or in `spotify_etl/`:

```env
# Spotify API
SPOTIPY_CLIENT_ID=your_client_id
SPOTIPY_CLIENT_SECRET=your_client_secret
SPOTIPY_REDIRECT_URI=http://localhost:8888/callback

# PostgreSQL Database
PG_CONN=postgresql://user:password@host:port/database
```

### Configure Spotify API

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Get your `CLIENT_ID` and `CLIENT_SECRET`
4. Add `http://localhost:8888/callback` as Redirect URI

## 🔌 API Endpoints

The frontend exposes the following endpoints:

- `GET /api/top-track` - Gets the most played track
- `GET /api/top-artist` - Gets the most listened artist
- `GET /api/top-genre` - Gets the most popular genre

### Configure dbt

Create or edit `~/.dbt/profiles.yml`:

```yaml
transformations:
  outputs:
    dev:
      type: postgres
      host: your_host
      user: your_user
      password: your_password
      port: 5432
      dbname: your_database
      schema: public
  target: dev
```

## 🎮 Usage

### Run the ETL

```bash
cd spotify_etl
python main.py
```

This script:
- Extracts your recent plays
- Gets track and artist metadata
- Extracts your top tracks (short, medium, and long term)
- Loads everything into PostgreSQL

### Run dbt Transformations

```bash
cd transformations
dbt run
```

This creates the views in the Silver and Gold layers. Because clean data is happy data, and dbt makes it all look professional. ✨

### Run the Frontend

This is where we fire up the beautiful frontend that v0 allowed us to build with just a couple of prompts. 🚀

```bash
cd frontend
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and  Tadaaaah! 🎉

![My Spotify Wrapped](images/my_spotify_wrapped.gif)

![My Top Track](images/my_top_track.png)

Now we're talking! Great music taste, I know. 😎🎵

## 📊 Data Methodology & Limitations

### How Top Tracks/Artists/Genres are Calculated

Spotify's API has a limitation: it only allows downloading a maximum of **50 records** per request. This means we can't get your complete listening history directly

To work around this:
- **Top Tracks/Artists/Genres** are calculated by analyzing which tracks/artists/genres appear across all three time ranges (short_term, medium_term, and long_term)
- The selection is based on which items appear in **all three periods** and have the **best combined ranking** (lowest sum of ranks)
- This ensures we're identifying your truly consistent favorites, not just what happened to be popular in one specific timeframe

### About Play Counts

While the `streams` table could theoretically be used to count play frequencies, it's currently **not accurate** because spotify only provides the last 50 recent plays via the API. In the future, I might try to implement some logic to estimate play counts based on available data, but for now, **play count fields are not available** in the frontend


## 📁 Project Structure

```
spotify-wrapped/
├── frontend/                 # Next.js application
│   ├── app/                  # Routes and pages
│   │   ├── api/              # API routes
│   │   │   ├── top-artist/
│   │   │   ├── top-genre/
│   │   │   └── top-track/
│   │   ├── page.tsx          # Main page
│   │   └── layout.tsx
│   ├── components/           # React components
│   │   ├── ui/               # Base UI components
│   │   ├── wrapped-slide.tsx
│   │   └── navigation-controls.tsx
│   └── lib/                  # Utilities
│
├── spotify_etl/              # Python ETL pipeline
│   ├── main.py               # Main script
│   ├── spotify_client.py     # Spotify client
│   ├── db.py                 # Database operations
│   └── requirements.txt
│
├── transformations/           # dbt project
│   ├── models/
│   │   ├── silver/           # Silver layer
│   │   │   ├── artists.sql
│   │   │   ├── streams.sql
│   │   │   └── tracks.sql
│   │   └── gold/             # Gold layer
│   │       ├── top_artist.sql
│   │       ├── top_genre.sql
│   │       └── top_track.sql
│   └── dbt_project.yml
│
└── README.md
```

This project is for personal use. Make sure to comply with Spotify API terms of service.




