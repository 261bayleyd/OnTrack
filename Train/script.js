async function fetchData() {
    try { 
    let trainNum = '6'
    const response = await fetch('https://ontrackapi.261bayley.workers.dev/trains/' + trainNum + '/json')    // check if the HTTP status code is 200
    if (!response.ok) {
    throw new Error(`HTTP error, Status: ${response.status}`)
    }
    const data = await response.json() // Parses JSON response body console.log(data) // can return data from here
    console.log(data)
    return data
    } catch (error) {
    console.error('Fetch failed:', error) // Handles network errors
    }
 }