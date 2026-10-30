/**
 * Ligaer og lag man kan velge når man legger ut kort. Lagene er dem som spiller i ligaen sesongen 2025/26
 * (kalenderår 2025 for ligaer som spiller vår til høst). Rekkefølgen på ligaene er den som vises i nedtrekkslisten.
 * Klubbnavn er skrevet slik Topps, Panini og andre kortmerker vanligvis skriver dem.
 */
export const LEAGUE_CLUBS: Record<string, string[]> = {
  "Premier League": [
    "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton & Hove Albion", "Burnley", "Chelsea", "Crystal Palace", "Everton", "Fulham",
    "Leeds United", "Liverpool", "Manchester City", "Manchester United", "Newcastle United", "Nottingham Forest", "Sunderland", "Tottenham Hotspur",
    "West Ham United", "Wolverhampton Wanderers",
  ],
  "La Liga": [
    "Alavés", "Athletic Club", "Atlético Madrid", "FC Barcelona", "Celta Vigo", "Elche", "Espanyol", "Getafe", "Girona", "Levante", "Mallorca",
    "Osasuna", "Rayo Vallecano", "Real Betis", "Real Madrid", "Real Oviedo", "Real Sociedad", "Sevilla", "Valencia", "Villarreal",
  ],
  "Serie A": [
    "AC Milan", "Atalanta", "Bologna", "Cagliari", "Como", "Cremonese", "Fiorentina", "Genoa", "Hellas Verona", "Inter", "Juventus", "Lazio",
    "Lecce", "Napoli", "Parma", "Pisa", "AS Roma", "Sassuolo", "Torino", "Udinese",
  ],
  Bundesliga: [
    "FC Augsburg", "Bayer Leverkusen", "Bayern München", "Borussia Dortmund", "Borussia Mönchengladbach", "Eintracht Frankfurt", "SC Freiburg",
    "Hamburger SV", "1. FC Heidenheim", "TSG Hoffenheim", "1. FC Köln", "Mainz 05", "RB Leipzig", "FC St. Pauli", "VfB Stuttgart", "Union Berlin",
    "Werder Bremen", "VfL Wolfsburg",
  ],
  "Ligue 1": [
    "Angers", "Auxerre", "Brest", "Le Havre", "Lens", "Lille", "Lorient", "Olympique Lyon", "Olympique Marseille", "Metz", "AS Monaco", "Nantes",
    "Nice", "Paris FC", "Paris Saint-Germain", "Rennes", "Strasbourg", "Toulouse",
  ],
  Eredivisie: [
    "Ajax", "AZ Alkmaar", "Excelsior", "Feyenoord", "Fortuna Sittard", "Go Ahead Eagles", "FC Groningen", "sc Heerenveen", "Heracles Almelo",
    "NAC Breda", "NEC Nijmegen", "PEC Zwolle", "PSV", "Sparta Rotterdam", "Telstar", "FC Twente", "FC Utrecht", "FC Volendam",
  ],
  "Primeira Liga": [
    "Alverca", "Arouca", "AVS", "Benfica", "Braga", "Casa Pia", "Estoril", "Estrela da Amadora", "Famalicão", "Gil Vicente", "Moreirense", "Nacional",
    "FC Porto", "Rio Ave", "Santa Clara", "Sporting CP", "Tondela", "Vitória de Guimarães",
  ],
  Eliteserien: [
    "Bodø/Glimt", "Brann", "Bryne", "Fredrikstad", "HamKam", "Haugesund", "KFUM Oslo", "Kristiansund", "Molde", "Rosenborg", "Sandefjord",
    "Sarpsborg 08", "Strømsgodset", "Tromsø", "Viking", "Vålerenga",
  ],
  "OBOS-ligaen": [
    "Aalesund", "Egersund", "Kongsvinger", "Levanger", "Lillestrøm", "Lyn", "Mjøndalen", "Moss", "Odd", "Ranheim", "Raufoss", "Sandnes Ulf",
    "Sogndal", "Stabæk", "Start", "Åsane",
  ],
  Championship: [
    "Birmingham City", "Blackburn Rovers", "Bristol City", "Charlton Athletic", "Coventry City", "Derby County", "Hull City", "Ipswich Town",
    "Leicester City", "Middlesbrough", "Millwall", "Norwich City", "Oxford United", "Portsmouth", "Preston North End", "Queens Park Rangers",
    "Sheffield United", "Sheffield Wednesday", "Southampton", "Stoke City", "Swansea City", "Watford", "West Bromwich Albion", "Wrexham",
  ],
  "Scottish Premiership": [
    "Aberdeen", "Celtic", "Dundee", "Dundee United", "Falkirk", "Heart of Midlothian", "Hibernian", "Kilmarnock", "Livingston", "Motherwell",
    "Rangers", "St Mirren",
  ],
  "Belgian Pro League": [
    "Anderlecht", "Antwerp", "Cercle Brugge", "Charleroi", "Club Brugge", "Dender", "Genk", "Gent", "La Louvière", "KV Mechelen", "OH Leuven",
    "Sint-Truiden", "Standard Liège", "Union Saint-Gilloise", "Westerlo", "Zulte Waregem",
  ],
  "Süper Lig": [
    "Alanyaspor", "Antalyaspor", "Başakşehir", "Beşiktaş", "Eyüpspor", "Fatih Karagümrük", "Fenerbahçe", "Galatasaray", "Gaziantep FK",
    "Gençlerbirliği", "Göztepe", "Kasımpaşa", "Kayserispor", "Kocaelispor", "Konyaspor", "Rizespor", "Samsunspor", "Trabzonspor",
  ],
  Allsvenskan: [
    "AIK", "BK Häcken", "Brommapojkarna", "Degerfors", "Djurgården", "Elfsborg", "GAIS", "Halmstad", "Hammarby", "IFK Göteborg",
    "IFK Norrköping", "IFK Värnamo", "Malmö FF", "Mjällby", "Sirius", "Östers IF",
  ],
  Superligaen: [
    "AGF", "Brøndby", "FC København", "FC Fredericia", "FC Midtjylland", "FC Nordsjælland", "OB", "Randers", "Silkeborg", "SønderjyskE", "Vejle",
    "Viborg",
  ],
  "Saudi Pro League": [
    "Al-Ahli", "Al-Ettifaq", "Al-Fateh", "Al-Fayha", "Al-Hazem", "Al-Hilal", "Al-Ittihad", "Al-Khaleej", "Al-Kholood", "Al-Najma", "Al-Nassr",
    "Al-Okhdood", "Al-Qadsiah", "Al-Riyadh", "Al-Shabab", "Al-Taawoun", "Damac", "NEOM SC",
  ],
  MLS: [
    "Atlanta United", "Austin FC", "Charlotte FC", "Chicago Fire", "FC Cincinnati", "Colorado Rapids", "Columbus Crew", "D.C. United", "FC Dallas",
    "Houston Dynamo", "Inter Miami", "LA Galaxy", "Los Angeles FC", "Minnesota United", "CF Montréal", "Nashville SC", "New England Revolution",
    "New York City FC", "New York Red Bulls", "Orlando City", "Philadelphia Union", "Portland Timbers", "Real Salt Lake", "San Diego FC",
    "San Jose Earthquakes", "Seattle Sounders", "Sporting Kansas City", "St. Louis City", "Toronto FC", "Vancouver Whitecaps",
  ],
  "Liga MX": [
    "Club América", "Atlas", "Atlético San Luis", "Cruz Azul", "Guadalajara", "FC Juárez", "León", "Mazatlán", "Monterrey", "Necaxa", "Pachuca",
    "Puebla", "Pumas UNAM", "Querétaro", "Santos Laguna", "Tigres UANL", "Tijuana", "Toluca",
  ],
  Brasileirão: [
    "Atlético Mineiro", "Bahia", "Botafogo", "Ceará", "Corinthians", "Cruzeiro", "Flamengo", "Fluminense", "Fortaleza", "Grêmio", "Internacional",
    "Juventude", "Mirassol", "Palmeiras", "Red Bull Bragantino", "Santos", "São Paulo", "Sport Recife", "Vasco da Gama", "Vitória",
  ],
  "Liga Profesional (Argentina)": [
    "Aldosivi", "Argentinos Juniors", "Atlético Tucumán", "Banfield", "Barracas Central", "Belgrano", "Boca Juniors", "Central Córdoba",
    "Defensa y Justicia", "Deportivo Riestra", "Estudiantes", "Gimnasia La Plata", "Godoy Cruz", "Huracán", "Independiente",
    "Independiente Rivadavia", "Instituto", "Lanús", "Newell's Old Boys", "Platense", "Racing Club", "River Plate", "Rosario Central",
    "San Lorenzo", "San Martín de San Juan", "Sarmiento", "Talleres", "Tigre", "Unión", "Vélez Sarsfield",
  ],
  "J1 League": [
    "Albirex Niigata", "Avispa Fukuoka", "Cerezo Osaka", "Fagiano Okayama", "FC Tokyo", "Gamba Osaka", "Kashima Antlers", "Kashiwa Reysol",
    "Kawasaki Frontale", "Kyoto Sanga", "Machida Zelvia", "Nagoya Grampus", "Sanfrecce Hiroshima", "Shimizu S-Pulse", "Shonan Bellmare",
    "Tokyo Verdy", "Urawa Red Diamonds", "Vissel Kobe", "Yokohama F. Marinos", "Yokohama FC",
  ],
  Landslag: [
    "Norge", "Sverige", "Danmark", "Island", "Finland", "England", "Skottland", "Wales", "Nord-Irland", "Irland", "Frankrike", "Tyskland",
    "Spania", "Portugal", "Italia", "Nederland", "Belgia", "Sveits", "Østerrike", "Polen", "Tsjekkia", "Slovakia", "Ungarn", "Kroatia", "Serbia",
    "Slovenia", "Bosnia-Hercegovina", "Montenegro", "Nord-Makedonia", "Albania", "Kosovo", "Hellas", "Tyrkia", "Romania", "Bulgaria", "Ukraina",
    "Georgia", "Russland", "Israel", "Argentina", "Brasil", "Uruguay", "Colombia", "Chile", "Ecuador", "Paraguay", "Peru", "Venezuela", "Bolivia",
    "USA", "Mexico", "Canada", "Costa Rica", "Panama", "Jamaica", "Honduras", "Japan", "Sør-Korea", "Australia", "Iran", "Saudi-Arabia", "Qatar",
    "Irak", "Usbekistan", "Jordan", "Marokko", "Senegal", "Nigeria", "Egypt", "Ghana", "Kamerun", "Elfenbenskysten", "Algerie", "Tunisia",
    "Sør-Afrika", "Mali", "DR Kongo", "Kapp Verde", "New Zealand",
  ],
};

/** Ligaene i nedtrekkslisten, med «Annen liga» til slutt for det som ikke passer. */
export const LEAGUES = [...Object.keys(LEAGUE_CLUBS), "Annen liga"];

/** Klubb → liga, så ligaen fylles inn av seg selv når man velger en kjent klubb. */
export const CLUBS: Record<string, string> = Object.fromEntries(
  Object.entries(LEAGUE_CLUBS).flatMap(([league, clubs]) => clubs.map((c) => [c, league])),
);

/** Klubbene som foreslås i skjemaet: bare ligaens lag når en liga er valgt, ellers alle. */
export function clubOptions(league: string): string[] {
  const list = LEAGUE_CLUBS[league] ?? Object.values(LEAGUE_CLUBS).flat();
  return [...list].sort((a, b) => a.localeCompare(b, "nb"));
}
