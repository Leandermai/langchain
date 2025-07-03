// Extrahiert typische Abschnitte aus einer deutschen Stellenbeschreibung
// Gibt ein Objekt mit Feldern wie aufgaben, profil, benefits, rest zurück
export function extractJobSections(text) {
  const sections = {
    aufgaben: "",
    profil: "",
    benefits: "",
    rest: ""
  };

  // Regex für typische Überschriften
  const regex = /(?:Deine Aufgaben|Aufgaben|Was dich erwartet)[:\n]+([\s\S]*?)(?=Dein Profil|Profil|Anforderungen|Was du mitbringst|Wir bieten|Benefits|$)/i;
  const aufgabenMatch = text.match(regex);
  if (aufgabenMatch) sections.aufgaben = aufgabenMatch[1].trim();

  const regexProfil = /(?:Dein Profil|Profil|Anforderungen|Was du mitbringst)[:\n]+([\s\S]*?)(?=Wir bieten|Benefits|Was wir bieten|$)/i;
  const profilMatch = text.match(regexProfil);
  if (profilMatch) sections.profil = profilMatch[1].trim();

  const regexBenefits = /(?:Wir bieten|Benefits|Was wir bieten)[:\n]+([\s\S]*)/i;
  const benefitsMatch = text.match(regexBenefits);
  if (benefitsMatch) sections.benefits = benefitsMatch[1].trim();

  // Rest extrahieren
  const used = [sections.aufgaben, sections.profil, sections.benefits].filter(Boolean).join("\n");
  sections.rest = text.replace(used, "").trim();

  return sections;
}
