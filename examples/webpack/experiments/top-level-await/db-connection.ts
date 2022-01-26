const connectToDB = async url => {
  await new Promise(r => setTimeout(r, 1000))
}

// This is a top-level-await
await connectToDB('my-sql://example.com')

export const dbCall = async data => {
  // This is a normal await, because it's in an async function
  await new Promise(r => setTimeout(r, 100))
  return 'fake data'
}

export const close = () => {
  console.log('closes the DB connection')
}
