import { rawCountries } from "./raw-countries";
import * as fs from "fs";

const isos = rawCountries.map((c) => c[2]) as string[];

const CountryCodes = `const countryCodes = [${isos.map((iso, index) => {
  return `"${iso}"`;
})}] as const;`;

const CountryCode = `export type CountryCode = typeof countryCodes[number];`;
const CountryWithDialType = `export type CountryWithDialType = {name: string; iso2: CountryCode; dial: number; flag: string; format: string;};`;

const toPrint = rawCountries.map((c) => {
  const name = c[0] as string;
  const flagXML = fs.readFileSync(
    `flags/${name.toLowerCase().replace(/ /g, "-")}.svg`
  );
  const iso2 = c[2] as string;

  return {
    name,
    iso2,
    dial: c[3],
    flag: flagXML.toString("utf-8"),
    format: c[4]?.toString().length > 1 ? c[4] : null,
  };
});

const string = toPrint.map((value, i) => {
  const row = `{name: "${value.name}", iso2: "${
    value.iso2
  }" as CountryCode, dial: ${value.dial}, format: "${
    value.format ?? ""
  }", flag: \`${value.flag}\`}`;
  return i === toPrint.length - 1 ? `${row}\n` : `${row},\n`;
});

fs.writeFileSync(
  "src/data.ts",
  `${CountryCodes}\n${CountryCode}\n${CountryWithDialType}\n export const countriesWithDial: CountryWithDialType[] = [${string.join(
    ""
  )}];`
);
