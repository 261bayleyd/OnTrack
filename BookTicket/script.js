let origin = document.getElementById("origin");
let destination = document.getElementById("destination");
let date = document.getElementById("date");
let adults = document.getElementById("adults");
let OriginDropdown = document.getElementById("OriginDropdown");
let DestinationDropdown = document.getElementById("DestinationDropdown");
let currentHost = window.location.hostname;
let dev = true
let jsonindex
PullJsonIndex()
// if (currentHost == "localhost" || currentHost == "127.0.0.1"|| currentHost == "musical-space-fishstick-q7p49qpjqrp924q67-5501.app.github.dev"){
//   dev = true
//   console.log("Dev mode enabled")
// }
// else{
//   dev = false
//   console.log("Prod mode enabled")
// }
async function PullJsonIndex(){
    jsonindex = await fetchOtherData()
    for (let stationCode in jsonindex){
        let ThisDropdown = document.createElement("option")
        ThisDropdown.value = stationCode
        ThisDropdown.innerHTML = jsonindex[stationCode].StationName
        OriginDropdown.appendChild(ThisDropdown)
    }
        for (let stationCode in jsonindex){
        let ThisDropdown = document.createElement("option")
        ThisDropdown.value = stationCode
        ThisDropdown.innerHTML = jsonindex[stationCode].StationName
        DestinationDropdown.appendChild(ThisDropdown)
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
    throw new Error(`HTTP error, Status: ${response.status}`)
    }
    const data = await response.json() // Parses JSON response body console.log(data) // can return data from here
    console.log(data)
    return data
    } catch (error) {
    console.error('Fetch failed:', error) // Handles network errors
    }
 }

function bookAmtrak(
    from,
    to,
    date,
    adults = 1,
    tripType = "OneWay",
    returnDate = "",
    seniors = 0,
    youth = 0,
    children = 0,
    infants = 0,
    promoCode = "",
    usePoints = false,
    departureTime = ""
) {
    let form = document.createElement("form");
    form.method = "POST";
    form.action = "https://www.amtrak.com/services/journeysearch";
    form.target = "_self";
    form.style.display = "none";

    function add(name, value) {
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
    }

    let base = "/sessionWorkflow/productWorkflow[@product='Rail']";

    add("requestor", "amtrak.presentation.handler.page.rail.AmtrakRailFareFinderPageHandler");
    add(base + "/tripRequirements/@bookpath", "farefamilies");

    add("xwdf_TripType", base + "/tripRequirements/tripType");
    add("wdf_TripType", tripType);

    add("xwdf_origin", base + "/travelSelection/journeySelection[1]/departLocation/search");
    add("wdf_origin", from.toUpperCase());

    add("xwdf_destination", base + "/travelSelection/journeySelection[1]/arriveLocation/search");
    add("wdf_destination", to.toUpperCase());

    add(base + "/tripRequirements/journeyRequirements[1]/departDate.date", date);
    add(base + "/tripRequirements/journeyRequirements[1]/departTime.hourmin", departureTime);

    if (tripType === "Return") {
        add(base + "/tripRequirements/journeyRequirements[2]/departDate.date", returnDate);
    }

    let passengerBase = base + "/tripRequirements/allJourneyRequirements";

    add(passengerBase + "/numberOfTravellers[@key='Adult']", adults);
    add(passengerBase + "/numberOfTravellers[@key='Senior']", seniors);
    add(passengerBase + "/numberOfTravellers[@key='Youth']", youth);
    add(passengerBase + "/numberOfTravellers[@key='Child']", children);
    add(passengerBase + "/numberOfTravellers[@key='Infant']", infants);

    let passengers = [
        ...Array(Number(adults)).fill("Adult"),
        ...Array(Number(seniors)).fill("Senior"),
        ...Array(Number(youth)).fill("Youth"),
        ...Array(Number(children)).fill("Child"),
        ...Array(Number(infants)).fill("Infant")
    ];

    passengers.forEach((type, index) => {
        let number = index + 1;

        add(
            "xwdf_person_type" + number,
            passengerBase + "/person[" + number + "]/personType"
        );

        add("wdf_person_type" + number, type);
    });

    add("xwdf_promoCode", base + "/tripRequirements/couponRequirements/coupon/code");
    add("wdf_promoCode", promoCode);

    add("wdf_BookType", usePoints ? "redeem" : "");

    document.body.appendChild(form);
    form.submit();
    form.remove();
}

function Submit() {
    bookAmtrak(
        OriginDropdown.value.trim(),
        DestinationDropdown.value.trim(),
        date.value.trim(),
        Number(adults.value),
        document.getElementById("tripType").value,
        document.getElementById("returnDate").value.trim(),
        Number(document.getElementById("seniors").value),
        Number(document.getElementById("youth").value),
        Number(document.getElementById("children").value),
        Number(document.getElementById("infants").value),
        document.getElementById("promoCode").value.trim(),
        document.getElementById("usePoints").value === "true"
    );
}