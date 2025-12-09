import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      return Response.json({ error: "Database URL not configured" }, { status: 500 })
    }
    
    const sql = neon(databaseUrl)

    const result = await sql`SELECT genre, play_count FROM gold.top_genre LIMIT 1`

    if (result.length === 0) {
      return Response.json({ name: "Unknown Genre", play_count: 0 }, { status: 200 })
    }

    const genre = result[0]
    return Response.json({
      name: genre.genre || "Unknown Genre",
      play_count: genre.play_count || 0,
    })
  } catch (error) {
    console.error("Error fetching top genre:", error)
    return Response.json({ error: "Failed to fetch top genre" }, { status: 500 })
  }
}
