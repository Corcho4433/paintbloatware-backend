import postgres from 'postgres'

// Configure your connection
const sql = postgres({
  host: 'localhost',
  port: 5432,
  database: 'paint_bloatware',
  username: 'postgres',
  password: '1234'
})

export default sql