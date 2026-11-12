let LoadingHi = document.getElementById("loading")
let RandomButton = document.getElementById("randombutton")
let OpenType = document.getElementById("OpenType")
let GlobalData = null
let currentHost = window.location.hostname;
let dev
if (currentHost == "localhost" || currentHost == "127.0.0.1"|| currentHost == "musical-space-fishstick-q7p49qpjqrp924q67-5501.app.github.dev"){
  dev = true
  console.log("Dev mode enabled")
}
else{
  dev = false
  console.log("Prod mode enabled")
}
run("https://ontrackapi.261bayley.workers.dev/trains/json")
async function fetchData(datainfo) {
    try { 
    const response = await fetch(datainfo)    // check if the HTTP status code is 200
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
async function run(datainfo){
    let stationIndexJSON = await fetchData("../amtrak_stations_by_code.json")
    LoadingHi.innerHTML = "Loading, Please wait..."
    let data = await fetchData(datainfo)
    GlobalData = data
    let trainsactive = Object.values(GlobalData).flat()
    LoadingHi.innerHTML = trainsactive.length + " Currently Active Trains"
    stops.style.display = 'block'
    RandomButton.style.display = 'block'
    for (let trainNumber in data) {
        for (let train of data[trainNumber]) {
            let originCode = train.terminuses[0]
            let destinationCode = train.terminuses[1]
            let origin = train.stations_snapshot[originCode]?.station_name ?? stationIndexJSON[originCode].StationName ?? originCode
            let destination = train.stations_snapshot[destinationCode]?.station_name ?? stationIndexJSON[destinationCode].StationName ?? destinationCode

            let location;
            let lastStation = null;
            
            for (let stationCode in train.stations) {
                let station = train.stations[stationCode];
                let stationName = ""
            
                // Skip if station is missing from stations_snapshot
                if (train.stations_snapshot[stationCode] == undefined) {
                    console.log(stationCode)
                    console.log(stationIndexJSON[stationCode].StationName)
                    console.log(stationIndexJSON[stationCode])
                    stationName = stationIndexJSON[stationCode].StationName ?? stationCode
                    continue;
                }
                else{
                    console.log(stationCode)
                    console.log(stationIndexJSON[stationCode].StationName)
                    console.log(stationIndexJSON[stationCode])
                    stationName = train?.stations_snapshot[stationCode]?.station_name ?? stationIndexJSON[stationCode].StationName ?? stationCode
                }
                        
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
            if (dev == true){
                NumberElement.innerHTML = "<a href = '/Train/index.html?number=" + train.train_number + "'>" + train.train_number + "</a>"
            }
            else{
                NumberElement.innerHTML = "<a href = '/OnTrack/Train/index.html?number=" + train.train_number + "'>" + train.train_number + "</a>"
            }
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
function RandomFinder() {
    let trains = Object.values(GlobalData).flat()
    if (trains.length === 0) return

    let randomTrain = trains[Math.floor(Math.random() * trains.length)]
    window.open(`/OnTrack/Train/index.html?number=${encodeURIComponent(randomTrain.train_number)}`, "_blank");
    console.log(randomTrain.train_number)
}