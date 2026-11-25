# Mesch 1944 — beeld-audit en vervangingsplan

Status: inventarisatie, niet de bevestiging dat alle platen opnieuw zijn gemaakt.

## Vastgesteld op basis van de actuele broncode

- De hoofdgame staat in `lesgame/index.html` en heeft **16 speelplekken**.
- De actieve afbeeldingen zijn WebP-bestanden in `lesgame/beelden/` met expliciete verwijzingen.
- De namen `pre_*.jpg` en `*(1).png` staan **niet** in de actieve beeldverwijzingen van `lesgame/index.html`, `beleving.html` en `index.html`. Het aantreffen van zulke bestanden bij de projectuploads bewijst dus niet dat de website ze gebruikt.
- De hoofdgame, `beleving.html` en `360/` hebben **afzonderlijke** afbeeldingsverzamelingen; een nieuwe plaat voor één versie werkt niet automatisch door in de andere.
- Het feit dat een WebP bestaat of geladen kan worden bewijst niet dat het de laatst ontworpen visuele variant is. Een vergelijking van de pixelinhoud met de goedgekeurde schildering is per scène nodig.

## Huidige hoofdgame — voor elke plaat definitief te beoordelen

| # | Speelplek | Actieve scène-afbeelding | Portret | Eindcontrole |
|---|---|---|---|---|
| 01 | Dorpsrand | `beelden/22-2cac07747b.webp` | `beelden/portret-22-2786c7c581.webp` | controleren |
| 02 | Bij de heg | `beelden/20-33d05d31f5.webp` | `beelden/portret-20-8c52997495.webp` | controleren |
| 03 | Eerste contact | `beelden/01-8ed1456ed0.webp` | `beelden/portret-01-4fe2865e39.webp` | nieuwe schildering en klikpunt voorbereid; nog niet gepubliceerd |
| 04 | Bij de school | `beelden/09-cc889f5d4b.webp` | `beelden/portret-09-a1b05e2100.webp` | nieuwe schildering en klikpunt voorbereid; nog niet gepubliceerd |
| 05 | Aan de Grijzegraaf | `beelden/21-c2f03c2244.webp` | `beelden/portret-21-682eab0f07.webp` | controleren |
| 06 | Tussen de dorpshuizen | `beelden/11-a81b18d1c7.webp` | `beelden/portret-11-436060b766.webp` | controleren |
| 07 | De dorpsstraat | `beelden/14-5548580760.webp` | `beelden/portret-14-fad6da9f02.webp` | nieuwe schildering voorbereid; nog niet gepubliceerd |
| 08 | Bij de buren | `beelden/12-7759df69ef.webp` | `beelden/portret-12-358b4e0d28.webp` | controleren |
| 09 | Het dorpshart | `beelden/10-7da81f88ee.webp` | `beelden/portret-10-83fff77c20.webp` | nieuwe schildering en klikpunt voorbereid; nog niet gepubliceerd |
| 10 | Langs de velden | `beelden/06-cc0e3fd621.webp` | `beelden/portret-06-7878970c8d.webp` | controleren |
| 11 | Voor Café Van Hoven | `beelden/13-ff3c631992.webp` | `beelden/portret-13-12b96ec519.webp` | nieuwe schildering en ingang voorbereid; nog niet gepubliceerd |
| 12 | In Café Van Hoven | `beelden/02-50413d5d84.webp` | `beelden/portret-02-b954f3a3d5.webp` | nieuwe schildering, gesprek- en doekenpunt voorbereid; nog niet gepubliceerd |
| 13 | In de schuilkelder | `beelden/kelder-4ce8f6b5da.webp` | `beelden/kelder-4ce8f6b5da.webp` | controleren |
| 14 | Bij de veldkeuken | `beelden/veldkeuken-9ad792959d.webp` | `beelden/veldkeuken-9ad792959d.webp` | controleren |
| 15 | In de schoolwoning | `beelden/04-14bc4a1e45.webp` | geen apart portret | controleren |
| 16 | In het schoollokaal | `beelden/schoollokaal-d3b897e804.webp` | `beelden/schoollokaal-d3b897e804.webp` | controleren |

## Beeldregie en vervangen

1. **Huidige scène versus gewenste eindplaat**: naast elkaar bekijken op onderwerp, compositie, historische sfeer, camera-/looprichting, kleur, kwaliteit en relevante details.
2. **Classificatie**: behouden / opnieuw schilderen / ontbreekt. Dubbele `pre_`-bestanden zijn alleen referentiemateriaal en geen kandidaat voor publicatie.
3. **Opnieuw vervaardigen** in dezelfde warme, gedetailleerde schilderstijl; historische hoofdlijn behouden, artistieke vrijheid toegestaan. Geen tekst over de schildering en geen ongewenste moderne reclame.
4. **Publiceren als nieuwe versie** (eigen naam of versiehash) om browsercacheproblemen te vermijden; verbind zowel de grote plaat als relevante mobiele variant/thumbnail aan de juiste scène.
5. **Regressiecontrole** op alle routes, portretgesprekken, hotspots, beeldverhouding, laadtijd, iPad, telefoon en digibord. Controleer de 360°-proef afzonderlijk (dit is geen volledige 360°-wandeling).

## Belangrijke grens

Nieuwe schilderingen zijn nog **niet** geüpload of ingeschakeld. Deze audit voorkomt dat we door willekeurig bestanden te verwijderen scènes, gesprekshotspots of looprichtingen beschadigen.

## R2 beeldbewerking voorbereid — 25 november 2026

Zes nieuwe schilderingen zijn gemaakt voor de bestaande leerlinggame. Er zijn twaalf WebP-bestanden geproduceerd (zes originele formaten en zes mobiele varianten) en een installatie-/verificatietool is samengesteld. De nieuwe scènes zijn: **Eerste contact (01)**, **Bij de school (09)**, **De dorpsstraat (14)**, **Het dorpshart (10)**, **Voor Café Van Hoven (13)** en **In Café Van Hoven (02)**. De scripts vervangen alleen deze zes afbeeldingen, met indien nodig verplaatste hotspots, en behouden de portretgesprekken en overige routegegevens.

**BELANGRIJK:** deze R2-beeldbestanden staan in een lokaal downloadpakket uit de ChatGPT-projectchat, niet in deze repository. De R2-beeldwijzigingen zijn daarom **nog niet live**; behoud bestaande verwijzingen tot de bijbehorende WebP-bestanden zijn toegevoegd. De originele bestanden en duplicaten worden niet weggegooid.

De installatiescripts zijn tegen een synthetische testrepo geverifieerd (zes scènepaden, twaalf afbeeldingen, backup, twee opeenvolgende installaties). Een volledige visuele iPad-/telefoon-/digibordcontrole op de gepubliceerde site is nog vereist. De overige tien lesgame-scènes hebben nog geen nieuw R2-beeld. Ook `beleving.html` en `360/` gebruiken aparte beeldsets en zijn nog niet bijgewerkt.
