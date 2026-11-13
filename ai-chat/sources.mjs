const book = "https://bel-memorial.org/documents/De_bevrijding_van_Eijsden-Margraten_in_september_1944.pdf";

export const sources = {
  crossing: {
    title: "Stichting Eijsdens Verleden · Brug naar de bevrijding",
    url: "https://www.eijsdensverleden.nl/infobord-brug-naar-de-bevrijding-te-mesch/",
    summary: "Op 12 september 1944 trokken Amerikaanse militairen vanuit België bij grenspaal 35 Nederland in. Het ging om het 117e Infanterieregiment van de 30e Amerikaanse Infanteriedivisie, Old Hickory. De Duitsers boden weerstand rond Mesch, onder meer bij het schoolplein. Leonard J. Hoffman uit Pennsylvania kwam bij de gevechten om. Bij de Mescherbrug over de Voer is een foto gemaakt van een Amerikaanse soldaat. De fotograaf is onbekend. Bij de brug stond de smidse met het café van de familie Brouwers. Mesch werd eerder bevrijd dan veel andere plaatsen in Nederland."
  },
  witness: {
    title: "De bevrijding van Eijsden-Margraten · verslag Jef Warnier, p. 84–85",
    url: book,
    summary: "De familie van schoolhoofd Jef Warnier zocht bij geweervuur beschutting in de kelder van de dienstwoning. Warnier zag buiten een Duitse soldaat met opgeheven handen tegenover een Amerikaanse militair. De identiteit van de soldaat in die ontmoeting en zijn gedachten zijn niet vastgesteld. Warnier begroette de Amerikanen en wees later een officier de weg in een jeep. Hij ruilde een potje inkt voor een pakje Raleigh-sigaretten. Het omhulsel en zijn notitie staan afgebeeld in het boek. Een Amerikaanse soldaat bleef achter, praatte bij kaarslicht met zijn gastheren en sliep in een bed van het gezin. Het gezin ging zelf weer naar de kelder. De soldaat volgde daarna zijn kameraden."
  },
  cafe: {
    title: "De bevrijding van Eijsden-Margraten · Café Van Hoven, p. 84",
    url: book,
    summary: "Duitse militairen richtten in Café Van Hoven een tijdelijk noodhospitaal in. Na hun vertrek kwamen de bewoners uit de kelder. Ze ruimden onder meer verband en scharen op. Deze bron bevestigt het gebruik als noodhospitaal en de opruiming. De exacte inrichting van de afgebeelde kamer en de identiteit van de hulpverlener zijn niet vastgesteld."
  },
  liza: {
    title: "Reformatorisch Dagblad · Interview met Liza van Hoven, 1995",
    url: "https://www.digibron.nl/viewer/collectie/Digibron/id/tag%3ARD.nl%2C19950425%3Anewsml_7fa40b4b19fec09ae91f4d9976e578de",
    summary: "Maria Elizabeth (Liza) van Hoven woonde aan de Grijzegraaf bij het café en de boerderij van haar familie. In een interview herinnerde zij zich dat een Duitse militair hen waarschuwde. Ze vertelde over de opruiming van het café en over haar opluchting bij de bevrijding."
  }
};

export const roles = {
  american: ["Amerikaanse infanterist, gespeelde rol", ["crossing", "witness"]],
  german: ["Duitse soldaat die zich overgeeft, gespeelde rol", ["witness"]],
  warnier: ["Jef Warnier, schoolhoofd en historische persoon", ["witness", "crossing"]],
  resident: ["Dorpsbewoner, samengesteld personage", ["witness", "crossing", "cafe"]],
  medic: ["Militaire hulpverlener, samengesteld personage", ["cafe"]],
  liza: ["Liza van Hoven, historische persoon", ["liza", "cafe", "crossing"]],
  guest: ["Amerikaanse logé, gespeelde rol", ["witness"]]
};
