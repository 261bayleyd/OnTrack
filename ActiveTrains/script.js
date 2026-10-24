
run()
async function fetchData() {
    try { 
    const response = await fetch('https://ontrackapi.261bayley.workers.dev/trains/json')    // check if the HTTP status code is 200
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
async function run(){
    let data = await fetchData()
    for (let trainNumber in data) {
        for (let train of data[trainNumber]) {
            let originCode = train.terminuses[0]
            let destinationCode = train.terminuses[1]
            let origin = train.stations_snapshot[originCode].station_name
            let destination = train.stations_snapshot[destinationCode].station_name

            let location;
            let lastStation = null;
            
            for (let stationCode in train.stations) {
                let station = train.stations[stationCode];
            
                // Skip if station is missing from stations_snapshot
                if (train.stations_snapshot[stationCode] == undefined) {
                    continue;
                }
            
                let stationName = train.stations_snapshot[stationCode].station_name;
            
                // Train has reached this station
                if (station.actual.arrival != null || station.actual.departure != null) {
                    lastStation = stationName;
                    continue;
                }
            
                // First station hasn't been left yet
                if (lastStation == null) {
                    location = "At " + stationName;
                } else {
                    location = "Near " + stationName;
                }
            
                break;
            }

            let row = document.createElement("div")
            let NumberElement = document.createElement("span")
            NumberElement.innerHTML = train.train_number
            let NameElement = document.createElement("span")
            NameElement.innerHTML = train.route_name
            let OriginElement = document.createElement("span")
            OriginElement.innerHTML = origin
            let DestinationnElement = document.createElement("span")
            DestinationnElement.innerHTML = destination
            let NextstopElement = document.createElement("span")
            NextstopElement.innerHTML = location

            row.appendChild(NumberElement)
            row.appendChild(NameElement)
            row.appendChild(OriginElement)
            row.appendChild(DestinationnElement)
            row.appendChild(NextstopElement)
            row.className = "row"
            stops.appendChild(row)
        }
    }
}