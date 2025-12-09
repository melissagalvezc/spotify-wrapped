import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      return Response.json({ error: "Database URL not configured" }, { status: 500 })
    }
    
    const sql = neon(databaseUrl)

    const result = await sql`SELECT track_name, artist_name, play_count FROM gold.top_track LIMIT 1`

    if (result.length === 0) {
      return Response.json({ name: "Unknown Track", artist: "Unknown Artist", play_count: 0 }, { status: 200 })
    }

    const track = result[0]
    return Response.json({
      name: track.track_name || "Unknown Track",
      artist: track.artist_name || "Unknown Artist",
      play_count: track.play_count || 0,
    })
  } catch (error) {
    console.error("Error fetching top track:", error)
    return Response.json({ error: "Failed to fetch top track" }, { status: 500 })
  }
}
