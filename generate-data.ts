import { rawCountries } from "./raw-countries";
import * as fs from "fs";

const toPrint = rawCountries.map((c) => {
  const name = c[0] as string;
  const flagXML = fs.readFileSync(
    `flags/${name.toLowerCase().replace(/ /g, "-")}.svg`
  );

  return {
    name,
    iso2: c[2],
    dial: c[3],
    flag: flagXML.toString("utf-8"),
  };
});

const string = toPrint.map((value, i) => {
  const row = `{name: "${value.name}", iso2: "${value.iso2}", dial: ${value.dial}, flag: \`${value.flag}\`}`;
  return i === toPrint.length - 1 ? `${row}\n` : `${row},\n`;
});

fs.writeFileSync(
  "src/data.ts",
  `export const countriesWithDial = [${string.join("")}];`
);
