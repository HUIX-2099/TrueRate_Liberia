/**
 * Official Liberia county flags from Wikimedia Commons.
 * Each county has an official flag (Liberian flag in canton + distinctive design), adopted 1965.
 * Source: https://commons.wikimedia.org/wiki/Category:SVG_flags_of_counties_of_Liberia
 */

const COUNTY_FLAG_FILES: Record<string, string> = {
  Montserrado: "Flag_of_Montserrado_County.svg",
  "Grand Bassa": "Flag_of_Grand_Bassa_County.svg",
  Bong: "Flag_of_Bong_County.svg",
  Nimba: "Flag_of_Nimba_County.svg",
  Lofa: "Flag_of_Lofa_County.svg",
  Margibi: "Flag_of_Margibi_County.svg",
  Maryland: "Flag_of_Maryland_County.svg",
  Bomi: "Flag_of_Bomi_County.svg",
  "Grand Cape Mount": "Flag_of_Grand_Cape_Mount_County.svg",
  "Grand Gedeh": "Flag_of_Grand_Gedeh_County.svg",
  "Grand Kru": "Flag_of_Grand_Kru_County.svg",
  "River Cess": "Flag_of_Rivercess_County.svg",
  "River Gee": "Flag_of_River_Gee_County.svg",
  Sinoe: "Flag_of_Sinoe_County.svg",
  Gbarpolu: "Flag_of_Gbarpolu_County.svg",
}

/** Official Liberia national flag in canton; used when county has no specific flag. */
const LIBERIA_NATIONAL_FLAG =
  "Flag_of_Liberia.svg"

const COMMONS_FILE_PATH = "https://commons.wikimedia.org/wiki/Special:FilePath"

function getCountyFlagFileName(county: string): string {
  return COUNTY_FLAG_FILES[county] ?? LIBERIA_NATIONAL_FLAG
}

/**
 * Renders the official county flag image from Wikimedia Commons.
 * Falls back to the Liberian national flag for unknown counties.
 * Displayed in a square shape; object-cover fills the square (flag may be cropped to fit).
 */
export function CountyFlag({ county, className = "h-8 w-8 rounded-lg" }: { county: string; className?: string }) {
  const fileName = getCountyFlagFileName(county)
  const src = `${COMMONS_FILE_PATH}/${encodeURIComponent(fileName)}`
  return (
    <img
      src={src}
      alt={`${county} county flag`}
      className={`inline-block object-cover rounded-lg border border-border/50 shadow-sm aspect-square ${className}`}
      title={county}
      loading="lazy"
    />
  )
}
