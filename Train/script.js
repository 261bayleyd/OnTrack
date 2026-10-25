let InfoBanner = document.getElementById("infoBanner")
let stops = document.getElementById("stops")
let trains = []

async function fetchData() {
    try { 
    let trainNum = document.getElementById("tnum").value
    const response = await fetch('https://ontrackapi.261bayley.workers.dev/trains/' + trainNum + '/json')
    if (!response.ok) {
    throw new Error(`HTTP error, Status: ${response.status}`)
    }
    const data = await response.json()
    console.log(data)
    return data
    } catch (error) {
    console.error('Fetch failed:', error)
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
    if (fetchNew) {
        let data = await fetchData()
        if (!data) return
        trains = Array.isArray(data) ? data : [data]
        if (trains.length === 0) return
        populateDropdown()
    }

    let dropdown = document.getElementById("serviceSelect")
    let train = trains[dropdown.value]
    if (!train) return

    stops.querySelectorAll(".row").forEach(row => row.remove())

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
        ArrivalElement.innerHTML = train.stations[stationCode]?.scheduled?.arrival?.slice(11, 16) ?? train.stations[stationCode]?.estimated?.arrival?.slice(11, 16) ?? train.stations[stationCode]?.actual?.arrival?.slice(11, 16) ?? ""
        if (train.stations[stationCode].arrived == true){
            ArrivalElement.style.fontWeight = "bold"
        }
        let DepartureElement = document.createElement("span")
        DepartureElement.innerHTML = train.stations[stationCode]?.scheduled?.departure?.slice(11, 16) ?? train.stations[stationCode]?.estimated?.departure?.slice(11, 16) ?? train.stations[stationCode]?.actual?.departure?.slice(11, 16) ?? ""
        if (train.stations[stationCode].departed == true){
            DepartureElement.style.fontWeight = "bold"
        }
        let TimeZoneElement = document.createElement("span")
        TimeZoneElement.innerHTML = train.stations[stationCode].tz;
        let OtherElement = document.createElement("span")
        OtherElement.innerHTML = train.stations[stationCode]?.actual?.comment
        row.appendChild(StationElement)
        row.appendChild(ArrivalElement)
        row.appendChild(DepartureElement)
        row.appendChild(TimeZoneElement)
        row.appendChild(OtherElement)
        row.className = "row"
        stops.appendChild(row)
    }
}