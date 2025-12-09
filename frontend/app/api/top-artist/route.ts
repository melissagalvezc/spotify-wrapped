import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      return Response.json({ error: "Database URL not configured" }, { status: 500 })
    }
    
    const sql = neon(databaseUrl)

    const result = await sql`SELECT artist_name, play_count FROM gold.top_artist LIMIT 1`

    if (result.length === 0) {
      return Response.json({ name: "Unknown Artist", play_count: 0 }, { status: 200 })
    }

    const artist = result[0]
    return Response.json({
      name: artist.artist_name || "Unknown Artist",
      play_count: artist.play_count || 0,
    })
  } catch (error) {
    console.error("Error fetching top artist:", error)
    return Response.json({ error: "Failed to fetch top artist" }, { status: 500 })
  }
}
