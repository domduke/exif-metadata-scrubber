export function rationalToDecimal(rationalValue) {
    return rationalValue[0] / rationalValue[1];
}

// Given the altitude and altitudeRef values from Exif, 
// return a string expressing these values in terms of 
// meters above or below sea level
export function formatAltitude(altitude, altitudeRef) {
    let altitudeRefText = "(above or below sea level not specified)";
    if (altitudeRef == 0) {
        altitudeRefText = "above sea level";
    } else if (altitudeRef == 1) {
        altitudeRefText = "below sea level";
    }
    return `${altitude} meters ${altitudeRefText}`;
}

