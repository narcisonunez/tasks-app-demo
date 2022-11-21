import { app } from "../app";

beforeAll( async () => {
  
  // Setup in memory database for testing
})

beforeEach( async () => {
  // Clean up database data.

  process.env.JWT_KEY = 'JWT_KEY'
})

afterEach( async () => {

})

afterAll( async() => {
  // Close database connection
})