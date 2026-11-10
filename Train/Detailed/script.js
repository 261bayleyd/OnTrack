let InfoBanner = document.getElementById("infoBanner")
let LoadingHi = document.getElementById("loading")
let NamePrint = document.getElementById("NamePrint")
let IDPrint = document.getElementById("IDPrint")
let stops = document.getElementById("stops")
let trains = []
let trainNum = document.getElementById("tnum").value
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
let jsonindex
Awaken()
function Awaken(){
    let number = tryFromQuery()
    console.log(number)
    if (number != null){
        document.getElementById("tnum").value = number
        Run()
    }
}
async function fetchData() {
    try { 
    trainNum = document.getElementById("tnum").value
    const response = await fetch('https://ontrackapi.261bayley.workers.dev/trains/' + trainNum + '/json')
    if (!response.ok) {
    LoadingHi.innerHTML = "Train Not Found"
    throw new Error(`HTTP error, Status: ${response.status}`)
    }
    const data = await response.json()
    console.log(data)
    return data
    } catch (error) {
    LoadingHi.innerHTML = "Train Not Found"
    console.error('Fetch failed:', error)
    }
}
async function fetchOtherData() {
    try { 
    let response
    if (dev == true){
    response = await fetch('/amtrak_stations_by_code.json')    // check if the HTTP status code is 200
    }
    else{
    response = await fetch('/OnTrack/amtrak_stations_by_code.json')    // check if the HTTP status code is 200
    }
    if (!response.ok) {
    LoadingHi.innerHTML = "Train Not Found"
    throw new Error(`HTTP error, Status: ${response.status}`)
    }
    const data = await response.json() // Parses JSON response body console.log(data) // can return data from here
    console.log(data)
    return data
    } catch (error) {
    LoadingHi.innerHTML = "Train Not Found"
    console.error('Fetch failed:', error) // Handles network errors
    }
 }

function populateDropdown() {
    let dropdown = document.getElementById("serviceSelect")
    dropdown.innerHTML = ""

    for (let i = 0; i < trains.length; i++) {
        let option = document.createElement("option")
        option.value = i
        option.textContent = new Date(trains[i].departure_date).toLocaleDateString()
        dropdown.appendChild(option)
    }

    document.getElementById("serviceLabel").hidden = false
    dropdown.hidden = false
}

async function Run(fetchNew = true){
    LoadingHi.innerHTML = "Loading, Please wait..."
    if (fetchNew) {
        let data = await fetchData()
        if (!data) return
        trains = Array.isArray(data) ? data : [data]
        if (trains.length === 0) return
        populateDropdown()
    }
    jsonindex = await fetchOtherData()

    let dropdown = document.getElementById("serviceSelect")
    let train = trains[dropdown.value]
    if (!train) return

    stops.querySelectorAll(".row").forEach(row => row.remove())

    let originCode = train.terminuses[0]
    console.log(originCode)
    let destinationCode = train.terminuses[1]
    console.log(destinationCode)
    let origin = train.stations_snapshot[originCode]?.station_name ?? jsonindex[originCode]?.StationName ?? originCode
    let destination = train.stations_snapshot[destinationCode]?.station_name ?? jsonindex[destinationCode]?.StationName ?? destinationCode
    LoadingHi.innerHTML = ""
    stops.style.display = 'block'
    InfoBanner.innerHTML = train.train_number + " " + origin + " To " + destination
    IDPrint.innerHTML = train.id
    NamePrint.innerHTML = train.route_name

    for (let stationCode in train.stations) {
        let row = document.createElement("div")
        let StationElement = document.createElement("span")
        StationElement.innerHTML = train.stations_snapshot[stationCode]?.station_name ?? jsonindex[stationCode]?.StationName
        let ArrivalElement = document.createElement("span")
        ArrivalElement.innerHTML = train.stations[stationCode]?.scheduled?.arrival?.slice(11, 16) ?? ""
        let DepartureElement = document.createElement("span")
        DepartureElement.innerHTML = train.stations[stationCode]?.scheduled?.departure?.slice(11, 16) ?? ""
        let TimeZoneElement = document.createElement("span")
        TimeZoneElement.innerHTML = train.stations[stationCode].tz;
        let OtherElement = document.createElement("span")
        if (train.stations[stationCode]?.actual?.pretty_comment != ""){
            OtherElement.innerHTML = train.stations[stationCode]?.actual?.pretty_comment
        }
        else{
            if (train.stations[stationCode]?.actual?.comment == "ON TIME"){
                OtherElement.innerHTML = "On Time"
            }
            else if (train.stations[stationCode]?.actual?.comment == "ARRIVED"){
                OtherElement.innerHTML = "Arrived"
            }
            else if (train.stations[stationCode]?.actual?.comment == "DEPARTED"){
                OtherElement.innerHTML = "Departed"
            }
            else{
                OtherElement.innerHTML = train.stations[stationCode]?.actual?.comment
            }
        }
        let accArrivalElement = document.createElement("span")
        accArrivalElement.innerHTML = train.stations[stationCode]?.estimated?.arrival?.slice(11, 16) ?? train.stations[stationCode]?.actual?.arrival?.slice(11, 16) ?? ""
        if (train.stations[stationCode].arrived == true){
            accArrivalElement.style.fontWeight = "bold"
        }
        let accDepElement = document.createElement("span")
        accDepElement.innerHTML = train.stations[stationCode]?.estimated?.departure?.slice(11, 16) ?? train.stations[stationCode]?.actual?.departure?.slice(11, 16) ?? ""
        if (train.stations[stationCode].departed == true){
            accDepElement.style.fontWeight = "bold"
        }
        let TypeElement = document.createElement("span")
        TypeElement.innerHTML = jsonindex[stationCode].StaType

        row.appendChild(StationElement)
        row.appendChild(ArrivalElement)
        row.appendChild(DepartureElement)
        row.appendChild(accArrivalElement)
        row.appendChild(accDepElement)
        row.appendChild(TypeElement)
        row.appendChild(TimeZoneElement)
        row.appendChild(OtherElement)
        row.className = "row"
        stops.appendChild(row)
    }
}
function tryFromQuery() {
    // Supports: ?service=U9018&date=2025/11/08  OR  ?service=U9018 (defaults to today)
    const sp = new URLSearchParams(location.search);
    console.log(sp)
    const number = sp.get("number");
    console.log(number)
    return number
    return null;
  }
function switchDetailed(){
    if (dev == true){
        window.open(`/Train/index.html?number=${encodeURIComponent(trainNum)}`, "_blank");
    }
    else{
        window.open(`/OnTrack/Train/index.html?number=${encodeURIComponent(trainNum)}`, "_blank");
    }
}