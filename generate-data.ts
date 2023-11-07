import { rawCountries } from "./raw-countries";
import * as fs from "fs";
import { getAllInfoByISO, Currency } from "iso-country-currency";

const isos = rawCountries.map((c) => c[2]) as string[];

const Import = `import {Currency} from "iso-country-currency";`;
const CountryCodes = `const countryCodes = [${isos.map((iso, index) => {
  return `"${iso.toUpperCase()}"`;
})}] as const;`;

const CountryCode = `export type CountryCode = typeof countryCodes[number];`;
const CountryWithDialType = `export type CountryWithDialType = {name: string; iso2: CountryCode; dial: number; flag: string; format: string; currency: Currency};`;

const toPrint = rawCountries.map((c) => {
  const name = c[0] as string;
  const flagXML = fs.readFileSync(
    `flags/${name.toLowerCase().replace(/ /g, "-")}.svg`
  );
  const iso2 = c[2] as string;

  return {
    name,
    iso2: iso2.toUpperCase(),
    dial: c[3],
    flag: flagXML.toString("utf-8"),
    format: c[4]?.toString().length > 1 ? c[4] : null,
    currency: getAllInfoByISO(iso2) as Currency,
  };
});

const string = toPrint.map((value, i) => {
  const row = `{name: "${value.name}", iso2: "${
    value.iso2
  }" as CountryCode, dial: ${value.dial}, format: "${
    value.format ?? ""
  }", flag: \`${value.flag}\`, currency: {iso: "${
    value.currency.iso
  }",countryName: "${value.currency.countryName}",currency: "${
    value.currency.currency
  }",symbol: "${value.currency.symbol}",dateFormat: "${
    value.currency.dateFormat
  }",numericCode: ${value.currency.numericCode}}}`;
  return i === toPrint.length - 1 ? `${row}\n` : `${row},\n`;
});

console.log("echo");

fs.writeFileSync(
  "src/data.ts",
  `${Import}\n${CountryCodes}\n${CountryCode}\n${CountryWithDialType}\n export const countriesWithDial: CountryWithDialType[] = [${string.join(
    ""
  )}];`
);
