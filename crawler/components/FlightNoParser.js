/**
 * Created by Thomas Sham on 25/5/2017.
 */

let FlightNoParser = (rawObject) => {
    let flight_nos = rawObject.flight_no.split(",");
    let airlines = rawObject.airline.split(",");
    return flight_nos.map(
        (val, ind, arr) => ({
            no: val,
            airline: airlines[1 + ind * 2],
            airline_icon: airlines[ind * 2]
        })
    );
};

module.exports = FlightNoParser;