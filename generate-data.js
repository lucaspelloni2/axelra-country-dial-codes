"use strict";
exports.__esModule = true;
var raw_countries_1 = require("./raw-countries");
var fs = require("fs");
var isos = raw_countries_1.rawCountries.map(function (c) { return c[2]; });
var CountryCodes = "const countryCodes = [".concat(isos.map(function (iso, index) {
    return "\"".concat(iso.toUpperCase(), "\"");
}), "] as const;");
var CountryCode = "export type CountryCode = typeof countryCodes[number];";
var CountryWithDialType = "export type CountryWithDialType = {name: string; iso2: CountryCode; dial: number; flag: string; format: string;};";
var toPrint = raw_countries_1.rawCountries.map(function (c) {
    var _a;
    var name = c[0];
    var flagXML = fs.readFileSync("flags/".concat(name.toLowerCase().replace(/ /g, "-"), ".svg"));
    var iso2 = c[2];
    return {
        name: name,
        iso2: iso2.toUpperCase(),
        dial: c[3],
        flag: flagXML.toString("utf-8"),
        format: ((_a = c[4]) === null || _a === void 0 ? void 0 : _a.toString().length) > 1 ? c[4] : null
    };
});
var string = toPrint.map(function (value, i) {
    var _a;
    var row = "{name: \"".concat(value.name, "\", iso2: \"").concat(value.iso2, "\" as CountryCode, dial: ").concat(value.dial, ", format: \"").concat((_a = value.format) !== null && _a !== void 0 ? _a : "", "\", flag: `").concat(value.flag, "`}");
    return i === toPrint.length - 1 ? "".concat(row, "\n") : "".concat(row, ",\n");
});
fs.writeFileSync("src/data.ts", "".concat(CountryCodes, "\n").concat(CountryCode, "\n").concat(CountryWithDialType, "\n export const countriesWithDial: CountryWithDialType[] = [").concat(string.join(""), "];"));
