let InfoBanner = document.getElementById("infoBanner")
let stops = document.getElementById("stops")
async function fetchData() {
    try { 
    let trainNum = document.getElementById("tnum").value
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
async function Run(){
    let data = await fetchData()
    for (let train of data) {
        let originCode = train.terminuses[0]
        let destinationCode = train.terminuses[1]
        let origin = train.stations_snapshot[originCode].station_name
        let destination = train.stations_snapshot[destinationCode].station_name
        InfoBanner.innerHTML = train.train_number + " " + origin + " To " + destination
        for (let stationCode in train.stations) {
            let row = document.createElement("div")
            let StationElement = document.createElement("span")
            StationElement.innerHTML = train.stations_snapshot[stationCode].station_name
            let ArrivalElement = document.createElement("span")
            ArrivalElement.innerHTML = train.stations[stationCode].scheduled.arrival
            let DepartureElement = document.createElement("span")
            DepartureElement.innerHTML = station.scheduled.departure;
            let TimeZoneElement = document.createElement("span")
            TimeZoneElement.innerHTML = station.tz;
            row.appendChild(StationElement)
            row.appendChild(ArrivalElement)
            row.appendChild(DepartureElement)
            row.appendChild(TimeZoneElement)
            row.className = "row"
            stops.appendChild(row)
        }
    }
}