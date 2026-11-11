let origin = document.getElementById("origin")
let destination = document.getElementById("destination")
let date = document.getElementById("date")
let adults = document.getElementById("adults")

function bookAmtrak(from, to, date, adults = 1) {
    let form = document.createElement("form");
    form.method = "POST";
    form.action = "https://www.amtrak.com/services/journeysearch";
    form.target = "_self";

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
    add("wdf_TripType", "OneWay");

    add("xwdf_origin", base + "/travelSelection/journeySelection[1]/departLocation/search");
    add("wdf_origin", from);

    add("xwdf_destination", base + "/travelSelection/journeySelection[1]/arriveLocation/search");
    add("wdf_destination", to);

    add(base + "/tripRequirements/journeyRequirements[1]/departDate.date", date);

    add("sessionWorkflow/productWorkflow[@product='Rail']/tripRequirements/allJourneyRequirements/numberOfTravellers[@key='Adult']", adults);

    add("xwdf_person_type1", base + "/tripRequirements/allJourneyRequirements/person[1]/personType");
    add("wdf_person_type1", "Adult");

    document.body.appendChild(form);
    form.submit();
}
function Submit(){
    bookAmtrak(origin.value, destination.value, date.value, adults.value);
}