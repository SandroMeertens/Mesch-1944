/* Browsertests voor de bestaande leerlinggame Mesch 1944. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { chromium } = require("playwright");

const URL = "http://127.0.0.1:8765/lesgame/";
async function openGame(browser, viewport, intro = false) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("requestfailed", req => {
    if (req.url().includes("/lesgame/")) errors.push("Network error: " + req.url());
  });
  const response = await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  assert.equal(response.status(), 200);
  if (!intro) {
    await page.locator("#intro-overslaan").waitFor({ state: "visible" });
    await page.waitForFunction(() => !document.querySelector("#intro-overslaan").disabled);
    await page.locator("#intro-overslaan").click();
    await page.locator("#intro").waitFor({ state: "hidden", timeout: 15000 });
  }
  return { page, errors };
}
async function loadedImage(page, selector = "#plaat") {
  await page.waitForFunction(s => {
    const img = document.querySelector(s);
    return img && img.complete && img.naturalWidth > 0;
  }, selector, { timeout: 15000 });
}
async function expectPlace(page, title) {
  await page.waitForFunction(
    text => document.querySelector("#plek")?.textContent === text,
    title,
    { timeout: 20000 }
  );
  assert.equal(await page.locator("#plek").textContent(), title);
}
async function assertConversationVisible(page, errors){
  const visible = await page.locator("#gesprek").isVisible();
  if (!visible){
    const debug=await page.evaluate(()=>({
      introHidden: document.querySelector("#intro").hidden,
      gesprekHidden: document.querySelector("#gesprek").hidden,
      praatHidden: document.querySelector("#praat").hidden,
      praatDisabled: document.querySelector("#praat").disabled,
      scene: document.querySelector("#plek").textContent,
      gesprekStyle: getComputedStyle(document.querySelector("#gesprek")).display,
      currentFocus: document.activeElement?.id,
      rol: document.querySelector("#rol").textContent
    }));
    console.error("GESPREK DEBUG", JSON.stringify({debug,errors}));
  }
  assert.equal(visible,true,"Gesprek hoort zichtbaar te zijn");
}
async function assertNoPageErrors(errors) {
  assert.deepEqual(errors, [], "Er trad een JavaScript- of netwerkfout op");
}
(async () => {
const browser = await chromium.launch({ headless:true, args:["--no-sandbox"] });
try {
  await test("Intro: twee zinnen, automatische opening, geen startknop", async () => {
    const { page, errors } = await openGame(browser, {width:1366,height:768}, true);
    try {
      assert.equal(await page.locator("#intro").isVisible(), true);
      assert.equal(await page.locator("#intro").getAttribute("data-proloog"), "1");
      assert.equal(await page.locator(".proloog-zin-een").textContent(), "Vier jaar lang leefde Nederland in oorlog.");
      assert.equal(await page.locator(".proloog-zin-twee").textContent(), "Maar in Zuid-Limburg komt de bevrijding dichterbij");
      assert.equal(await page.locator("#verken").count(), 0);
      await page.waitForFunction(() => document.querySelector("#intro").dataset.proloog === "2", null, {timeout: 5500});
      assert.equal(await page.locator("#intro").isVisible(), true);
      await page.locator("#intro").waitFor({state:"hidden",timeout:10000});
      await expectPlace(page, "Dorpsrand");
      await loadedImage(page);
      assert.equal(await page.getByRole("button",{name:"Volg de weg het dorp in"}).isVisible(),true);
      await assertNoPageErrors(errors);
    } finally { await page.close(); }
  });

  await test("Gehele hoofdroute: vooruit, terug, alle schilderijen geladen", async () => {
    const { page, errors } = await openGame(browser,{width:1440,height:900});
    try {
      const expected=["Dorpsrand","Bij de heg","Eerste contact","Bij de school","Aan de Grijzegraaf","Tussen de dorpshuizen","De dorpsstraat","Bij de buren","Het dorpshart","Langs de velden","Voor Café Van Hoven","In Café Van Hoven","In de schuilkelder","Bij de veldkeuken"];
      for (let i=0;i<expected.length;i++) {
        await expectPlace(page, expected[i]);
        await loadedImage(page);
        if (i===1) {
          await page.getByRole("button",{name:"Dorpsrand",exact:true}).click();
          await expectPlace(page, "Dorpsrand");
          await page.getByRole("button",{name:"Volg de weg het dorp in"}).click();
          await expectPlace(page, "Bij de heg");
        }
        if (i===3) {
          await page.getByRole("button",{name:"Ga het schoollokaal in"}).click();
          await expectPlace(page, "In het schoollokaal");
          await loadedImage(page);
          await page.getByRole("button",{name:"Terug naar buiten bij de school"}).click();
          await expectPlace(page, "Bij de school");
        }
        if (i<expected.length-1) {
          const btn=page.locator("#routes button[data-heen]");
          assert.equal(await btn.count(),1,"Geen doorlopende route op "+expected[i]);
          await btn.click();
        }
      }
      assert.equal(await page.locator("#praat").isVisible(),true,"Veldkeuken-gesprek bereikbaar");
      await assertNoPageErrors(errors);
    } finally {await page.close();}
  });

  await test("Gesprekken, portret, gesprekskeuze en terugkeer naar dezelfde scène", async () => {
    const { page, errors } = await openGame(browser,{width:1024,height:768});
    try {
      await page.locator("#praat").click();
      await assertConversationVisible(page, errors);
      await loadedImage(page,"#portret");
      assert.match(await page.locator("#rol").textContent(),/Amerikaanse soldaat/);
      if (await page.getByRole("button",{name:"Toon hele tekst"}).count()) {
        await page.getByRole("button",{name:"Toon hele tekst"}).click();
      }
      await page.getByRole("button",{name:"Lees verder"}).first().click();
      await assertConversationVisible(page, errors);
      await page.locator("#sluit").click();
      assert.equal(await page.locator("#gesprek").isHidden(),true);
      await expectPlace(page, "Dorpsrand");
      await page.getByRole("button",{name:"Volg de weg het dorp in"}).click();
      await page.locator("#praat").click();
      await assertConversationVisible(page, errors);
      await page.locator("#sluit").click();
      await assertNoPageErrors(errors);
    } finally {await page.close();}
  });

  await test("Alle portretgesprekken en terugkeer naar de juiste plaat", async () => {
    const {page,errors}=await openGame(browser,{width:1366,height:768});
    try{
      const names=["Dorpsrand","Bij de heg","Eerste contact","Bij de school","Aan de Grijzegraaf","Tussen de dorpshuizen","De dorpsstraat","Bij de buren","Het dorpshart","Langs de velden","Voor Café Van Hoven","In Café Van Hoven","In de schuilkelder","Bij de veldkeuken"];
      assert.equal(await page.locator("#gesprek").evaluate(x=>x.parentElement.id),"spel","Gesprekken zijn geen kinderen van de speelplaat");
      for(let i=0;i<names.length;i++){
        await expectPlace(page,names[i]);
        await page.locator("#praat").click();
        await page.locator("#gesprek").waitFor({state:"visible"});
        assert.ok((await page.locator("#rol").textContent()).trim().length>0,"Ontbrekend personage op "+names[i]);
        await loadedImage(page,"#portret");
        await page.locator("#sluit").click();
        await page.locator("#gesprek").waitFor({state:"hidden"});
        await expectPlace(page,names[i]);
        if(i<names.length-1)await page.locator("#routes button[data-heen]").click();
      }
      await assertNoPageErrors(errors);
    }finally{await page.close();}
  });

  await test("Café: doeken bekijken, interactie openen en teruggaan", async () => {
    const {page,errors}=await openGame(browser,{width:1366,height:768});
    try{
      for(let i=0;i<11;i++)await page.locator("#routes button[data-heen]").click();
      await expectPlace(page,"In Café Van Hoven");
      await page.locator("#praat").click();
      await page.locator("#gesprek").waitFor({state:"visible"});
      const skip=page.getByRole("button",{name:"Toon hele tekst"});
      if(await skip.count())await skip.click();
      await page.getByRole("button",{name:"Bekijk de doeken op tafel"}).click();
      assert.equal(await page.locator("#cafe-aanwijzing").isVisible(),true);
      await page.locator("#doeken").click();
      await page.locator("#gesprek").waitFor({state:"visible"});
      await loadedImage(page,"#portret");
      await page.locator("#sluit").click();
      await expectPlace(page,"In Café Van Hoven");
      await assertNoPageErrors(errors);
    }finally{await page.close();}
  });

  await test("Vraag en tegenvraag van Amerikaanse soldaat", async () => {
    const {page,errors}=await openGame(browser,{width:1366,height:768});
    try{
      await page.locator("#praat").click();
      await page.locator("#gesprek").waitFor({state:"visible"});
      const skip=page.getByRole("button",{name:"Toon hele tekst"});
      if(await skip.count())await skip.click();
      for(let i=0;i<12;i++){
        if(await page.getByRole("button",{name:"Naar de vraag"}).count())break;
        await page.getByRole("button",{name:"Lees verder"}).click();
      }
      await page.getByRole("button",{name:"Naar de vraag"}).click();
      assert.equal(await page.locator("#sluit").isHidden(),true,"Verplichte vraag kan niet worden weggeklikt");
      await page.locator("#opties .keuze").first().click();
      assert.equal(await page.locator("#sluit").isVisible(),true);
      for(let i=0;i<12;i++){
        if(await page.getByRole("button",{name:"Naar de tegenvraag"}).count())break;
        const next=page.getByRole("button",{name:"Lees verder"});
        if(await next.count())await next.click();
        else if(await skip.count())await skip.click();
        else break;
      }
      await page.getByRole("button",{name:"Naar de tegenvraag"}).click();
      assert.equal(await page.locator("#sluit").isHidden(),true);
      await page.locator("#opties .keuze").first().click();
      assert.equal(await page.locator("#sluit").isVisible(),true);
      const stored=await page.evaluate(()=>window.sessionStorage.getItem("mesch-verhaalkeuze-v1"));
      assert.match(stored,/soldaat/);
      await page.locator("#sluit").click();
      await expectPlace(page,"Dorpsrand");
      await assertNoPageErrors(errors);
    }finally{await page.close();}
  });

  await test("Nieuwe lesronde vanuit het spel", async () => {
    const {page,errors}=await openGame(browser,{width:1280,height:800});
    try{
      await page.getByRole("button",{name:"Volg de weg het dorp in"}).click();
      await page.locator("#herstart").click();
      assert.equal(await page.locator("#bevestig-ronde").evaluate(x=>x.open),true);
      await page.locator("#start-ronde").click();
      await expectPlace(page, "Dorpsrand");
      assert.equal(await page.locator("#intro").isHidden(),true,"Nieuwe ronde herhaalt geen intro");
      await loadedImage(page);
      await assertNoPageErrors(errors);
    }finally{await page.close();}
  });

  await test("Schermformaten: telefoon, iPad en digibord zonder pagina-scrollen", async () => {
    for(const viewport of [{width:390,height:844},{width:844,height:390},{width:820,height:1180},{width:1180,height:820},{width:1920,height:1080}]){
      const {page,errors}=await openGame(browser,viewport);
      try{
        await loadedImage(page);
        const metrics=await page.evaluate(()=>({
          vw:innerWidth,vh:innerHeight,
          scrollW:document.documentElement.scrollWidth,
          scrollH:document.documentElement.scrollHeight,
          game:(()=>{const r=document.querySelector("#spel").getBoundingClientRect();return {w:r.width,h:r.height}})()
        }));
        assert.ok(metrics.scrollW<=metrics.vw+2 && metrics.scrollH<=metrics.vh+2,JSON.stringify(metrics));
        assert.ok(metrics.game.w>0 && metrics.game.h>0);
        const next=page.getByRole("button",{name:"Volg de weg het dorp in"});
        assert.equal(await next.isVisible(),true,"Navigatie ontbreekt "+JSON.stringify(viewport));
        await next.click();
        await expectPlace(page, "Bij de heg");
        await page.locator("#praat").click();
        await assertConversationVisible(page, errors);
        assert.equal(await page.locator("#sluit").isVisible(),true);
        await loadedImage(page,"#portret");
        await page.locator("#sluit").click();
        await assertNoPageErrors(errors);
      }finally{await page.close();}
    }
  });
} finally { await browser.close(); }
})().catch(err=>{console.error(err);process.exitCode=1;});
