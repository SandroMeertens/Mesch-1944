# Gesprekken en historische AI – ontwerp v1

## Huidige website

De wandeling toont zeven portretten met voorbeeldvragen, eigen vragen en vervolgvragen. De chat draait in de browser, met vooraf geschreven antwoorden en herkenning van verschillende vraagformuleringen. Vragen worden niet doorgestuurd en er is geen betaalde AI-aanroep.


## Ontwerp voor een echte chatbot – pas na broncontrole

### Leerdoel
Leerlingen moeten echte eigen vragen kunnen stellen en daar **brongebonden, controleerbare** antwoorden op krijgen. Het systeem is een historische gids **bij** een persoon, niet een authentieke opstanding van die persoon. 

### Bronnenbasis
Per historische persona expliciet toegestane bronfragmenten, bijvoorbeeld:
- Jef Warnier: geverifieerd getuigenverslag + datum, vindplaats en relevante passages.
- Amerikaanse militair: 30e Divisie / 117e Regiment + militaire en lokaalhistorische bronnen.
- Café Van Hoven: geverifieerde lokale getuigenissen; onderscheid tussen caféfunctie en verzonnen kamerindeling.
- Duitse overgave: expliciet wat wel/niet uit Warnier's verslag blijkt.
- Samengestelde bewoner: algemene historisch onderbouwde context, nooit persoonlijke herinneringen als echte bron.

Maak een catalogus `sources.json` met `id, titel, url_als_bekend, archiefkenmerk, fragment, tijdstip, locatie, status` en een expliciete toewijzing aan personen en scènes. **Verzin geen bronverwijzingen.**

### Server / API
De browser stuurt aan een apart beveiligd backend, bijvoorbeeld een serverfunctie. Plaats **nooit** de API-sleutel in openbaar HTML/JS, de GitHub-repository of client-side configuratie.

Concept API:
```json
POST /api/historisch-gesprek
{"person_id":"warnier","scene_id":"u03","question":"Wat gebeurde er bij de school?"}
```
Antwoord:
```json
{
 "answer":"Volgens het getuigenverslag ...",
 "certainty":"historisch_onderbouwd",
 "sources":[{"id":"warnier-verslag","title":"Geverifieerd getuigenverslag"}],
 "reconstruction_note":"Dit is een samenvatting, geen letterlijke uitspraak."
}
```

Waarden voor `certainty`: `historisch_onderbouwd`, `aannemelijke_reconstructie`, `onbekend`. Alleen het eerste mag als feit worden gepresenteerd. Een bronfragment moet de relevante uitspraak daadwerkelijk ondersteunen.

### Verplichte betrouwbaarheidsgedragingen
1. Antwoord uitsluitend vanuit geselecteerde bronnen of geef toe dat het onbekend is.
2. Verzin nooit persoonlijke herinneringen, woorden of gedachten van een echte historische persoon.
3. Maak verschil tussen feit, interpretatie, reconstructie en onbekend.
4. Toon bronherkomst bij elk inhoudelijk antwoord.
5. Geef een kort antwoord voor groep 7/8 en bied gerichte verdiepende vragen.
6. Beantwoord vragen buiten het historisch onderwerp met een vriendelijke terugleiding naar Mesch.
7. Bij gewelddadige gebeurtenissen: feitelijk, niet sensationeel.
8. Laat historische dialogen nooit doorgaan voor authentieke geluids- of tekstopnamen.

### Kinderveiligheid & gegevens
- Vraag leerlingen niet naar naam, adres, school, leeftijd of andere persoonlijke gegevens.
- Sla ingevoerde vragen niet standaard op; hanteer dataminimalisatie.
- Gebruik filtering op persoonlijke, gevaarlijke en ongepaste input.
- Rate limits, lengtebegrenzing, monitoring op aggregatieniveau, geen open doorgeefkanaal naar willekeurige AI-inhoud.
- Beoordeel toestemming, privacyverklaring en verwerking door derden vóór gebruik met kinderen; laat school/verantwoordelijke partij dit accorderen.
- Voer tests uit met docenten en leerlingen en richt een correctieproces in bij historische fouten.

## Optionele AI-server

De map `ai-chat` bevat een eerder voorbereid prototype voor een servergestuurde gids. De leerlingpagina gebruikt deze server niet. Eventuele activering is een aparte wijziging aan de website en vereist een server met een projectsleutel. Controleer daarbij opnieuw de modelbeschikbaarheid, kosten en bronkwaliteit.
