import { expect, test } from "@playwright/test";

const componentIds=[
  "H00.01","H00.02","H00.03","H00.04","H00.05",
  "H01.01","H01.02","H01.03","H01.04","H01.05","H01.06","H01.07","H01.08","H01.09","H01.10","H01.11",
  "H02.01","H02.02","H02.03","H02.04","H02.05","H02.06",
  "H03A.01","H03A.02","H03A.03","H03A.04","H03A.05",
  "H03B.02","H03B.03","H03B.04","H03B.05","H03B.06",
  "H04.01","H04.02","H04.03","H04.04","H04.05","H04.06",
  "H05.02","H05.03","H05.04","H05.05",
  "H06.01","H06.02","H06.03","H06.04","H06.05","H06.06","H06.07"
] as const;

async function noHorizontalOverflow(page:import("@playwright/test").Page){
  return page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
}

test("homepage keeps the browser-native semantic inventory and approved H01 layers",async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto("/en");
  await expect(page.getByTestId("approved-homepage")).toBeVisible();
  for(const id of componentIds) await expect(page.locator(`[data-component-id="${id}"]`)).toHaveCount(1);
  await expect(page.locator(".site-bar")).toBeHidden();
  await expect(page.locator(".review-badge")).toBeHidden();
  await expect(page.locator(".approved-header-brand img.fares-wordmark")).toHaveAttribute("src","/design-media/fares-uniform-wordmark.png");
  await expect(page.locator(".approved-footer-brand img.fares-wordmark")).toHaveCount(1);
  await expect(page.locator(".approved-brand-headline img.fares-wordmark")).toHaveCount(1);
  await expect(page.getByRole("link",{name:/Start a Project/i})).toHaveAttribute("href","/en/enquiry");
  const wordmark=await page.locator(".approved-header-brand img.fares-wordmark").evaluate(el=>({loaded:(el as HTMLImageElement).complete,width:(el as HTMLImageElement).naturalWidth,height:(el as HTMLImageElement).naturalHeight}));
  expect(wordmark).toEqual({loaded:true,width:1200,height:404});
  const icon=await page.request.get("/icon.png");
  expect(icon.ok()).toBeTruthy();
  expect(icon.headers()["content-type"]).toContain("image/png");

  const root=page.getByTestId("approved-homepage");
  const box=await root.boundingBox();
  expect(Math.round(box?.width??0)).toBe(1440);
  expect(Math.round(box?.x??-1)).toBe(0);
  expect(await root.evaluate(el=>getComputedStyle(el).zoom)).toBe("1");
  expect(await root.evaluate(el=>getComputedStyle(el).transform)).toBe("none");

  const body=(await page.locator("body").innerText()).toLowerCase();
  expect(body).not.toContain("egp");
  expect(body).not.toContain("in stock");
  expect(body).not.toContain("add to cart");
  expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(1);
});

test("desktop viewports use the browser width and a viewport-scale hero",async({page})=>{
  for(const [width,height,name] of [[2560,1440,"2560x1440"],[1920,1080,"1920x1080"],[1440,900,"1440x900"]] as const){
    await page.setViewportSize({width,height});
    await page.goto("/en");
    await page.evaluate(()=>document.fonts.ready);

    const frame=await page.getByTestId("approved-homepage").boundingBox();
    const header=await page.getByTestId("approved-h00").boundingBox();
    const hero=await page.getByTestId("approved-h01").boundingBox();
    const heroMedia=await page.locator(".approved-hero-media").boundingBox();
    expect(frame).not.toBeNull();expect(header).not.toBeNull();expect(hero).not.toBeNull();expect(heroMedia).not.toBeNull();
    expect(Math.abs((frame?.width??0)-width)).toBeLessThanOrEqual(1);
    expect(Math.abs((header?.width??0)-width)).toBeLessThanOrEqual(1);
    expect(hero?.height??0).toBeGreaterThan(height*.82);
    expect(hero?.height??0).toBeLessThan(height*1.04);
    expect(heroMedia?.width??0).toBeGreaterThan(width*.48);
    await expect(page.locator(".approved-hero-background-plane[data-sc-parallax]")).toHaveCount(1);
    await expect(page.locator(".approved-hero-geometry-plane[data-sc-parallax]")).toHaveCount(1);
    await expect(page.locator(".approved-hero-people-plane[data-sc-parallax]")).toHaveCount(1);
    await expect(page.locator(".approved-hand-note[data-sc-parallax]")).toHaveCount(2);
    expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(1);

    const rail=page.locator(".approved-industry-rail");
    expect(await rail.evaluate(el=>el.scrollWidth-el.clientWidth)).toBeGreaterThan(180);
    await page.screenshot({path:`artifacts/home-viewport-${name}.png`,fullPage:false});
  }
});

test("Scrollcraft produces visible handoffs and a materially changing peak",async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto("/en");
  await expect.poll(async()=>page.evaluate(()=>document.documentElement.dataset.scrollcraftMounted)).toBe("true");

  const hero=page.getByTestId("approved-h01");
  const heroSeam=page.locator(".approved-hero-seam");
  const heroInitial=await heroSeam.evaluate(el=>getComputedStyle(el).transform);
  await page.evaluate(()=>window.scrollTo(0,Math.round(innerHeight*.58)));
  await expect.poll(async()=>Number(await hero.evaluate(el=>getComputedStyle(el).getPropertyValue("--hero-handoff")))).toBeGreaterThan(.35);
  const heroMoved=await heroSeam.evaluate(el=>getComputedStyle(el).transform);
  expect(heroMoved).not.toBe(heroInitial);
  const seamBox=await heroSeam.boundingBox();
  expect(seamBox?.width??0).toBeGreaterThan(420);
  await page.screenshot({path:"artifacts/home-scroll-hero-handoff.png",fullPage:false});

  const industries=page.getByTestId("approved-h02");
  await industries.scrollIntoViewIfNeeded();
  await expect.poll(async()=>Number(await industries.evaluate(el=>getComputedStyle(el).getPropertyValue("--industries-enter")))).toBeGreaterThan(.45);

  const feature=page.getByTestId("approved-h03");
  await expect(feature).toHaveClass(/sc-act--pinned/);
  const featureMetrics=await feature.evaluate(el=>({top:(el as HTMLElement).offsetTop,height:(el as HTMLElement).offsetHeight}));
  expect(featureMetrics.height).toBeGreaterThan(900*2);
  const travel=featureMetrics.height-900;

  await page.evaluate(({top,travel})=>window.scrollTo(0,top+travel*.16),{top:featureMetrics.top,travel});
  await expect.poll(async()=>Number(await feature.evaluate(el=>getComputedStyle(el).getPropertyValue("--feature-progress")))).toBeGreaterThan(.1);
  const seamEarly=await page.locator(".approved-seam-handoff").boundingBox();

  await page.evaluate(({top,travel})=>window.scrollTo(0,top+travel*.78),{top:featureMetrics.top,travel});
  await expect.poll(async()=>Number(await feature.evaluate(el=>getComputedStyle(el).getPropertyValue("--feature-progress")))).toBeGreaterThan(.68);
  const seamLate=await page.locator(".approved-seam-handoff").boundingBox();
  expect(Math.abs((seamLate?.x??0)-(seamEarly?.x??0))).toBeGreaterThan(260);
  const leftClip=await page.locator(".approved-feature-more").evaluate(el=>getComputedStyle(el).clipPath);
  const rightClip=await page.locator(".approved-feature-idea").evaluate(el=>getComputedStyle(el).clipPath);
  expect(leftClip).not.toBe("none");
  expect(rightClip).not.toBe("none");
  await page.screenshot({path:"artifacts/home-scroll-seam-peak.png",fullPage:false});

  const closing=page.getByTestId("approved-h05");
  const closeTop=await closing.evaluate(el=>(el as HTMLElement).offsetTop);
  await page.evaluate(top=>window.scrollTo(0,top-innerHeight*.34),closeTop);
  await expect.poll(async()=>Number(await closing.evaluate(el=>getComputedStyle(el).getPropertyValue("--cta-progress")))).toBeGreaterThan(.35);
  const dash=Number(await closing.evaluate(el=>getComputedStyle(el).getPropertyValue("--cta-dash")));
  expect(dash).toBeLessThan(.7);
  await page.screenshot({path:"artifacts/home-scroll-close-resolution.png",fullPage:false});
});

test("media provenance removes cropped/recycled runtime bitmaps",async({page})=>{
  expect((await page.request.get("/authority/approved-homepage-reference.webp")).ok()).toBeTruthy();
  await page.goto("/en");

  for(const slot of [
    "home.hero.architecture","home.hero.people-group","home.hero.design-cutting","home.hero.manufacturing",
    "home.industries.education","home.industries.hospitality","home.industries.healthcare",
    "home.industries.corporate","home.industries.industrial","home.industries.security",
    "home.feature.fabric-blue","home.feature.design-sketch","home.work.kgc","home.work.hospitality","home.work.healthcare",
    "home.cta.building"
  ]) await expect(page.locator(`[data-media-slot="${slot}"]`)).toHaveCount(1);

  await expect(page.locator('[data-media-slot="home.hero.architecture"]')).toHaveAttribute("src","/generated/home-hero-architecture-courtyard-v2.png");
  await expect(page.locator('[data-media-slot="home.hero.people-group"]')).toHaveAttribute("src","/generated/home-hero-people-sharp-v4.png");
  await expect(page.locator('[data-media-slot="home.hero.design-cutting"]')).toHaveAttribute("src","/generated/home-hero-design-cutting-v1.png");
  await expect(page.locator('[data-media-slot="home.hero.manufacturing"]')).toHaveAttribute("src","/generated/home-hero-manufacturing-v1.png");
  await expect(page.locator(".approved-quality-card")).toHaveCount(0);
  await expect(page.locator(".approved-hero-benefits > div")).toHaveCount(4);
  await expect(page.locator('[data-media-slot="home.work.kgc"]')).toHaveAttribute("src","/review-media/kgc/kgc-building.webp");
  for(const slot of [
    "home.industries.education","home.industries.hospitality","home.industries.healthcare",
    "home.industries.corporate","home.industries.industrial","home.industries.security",
    "home.work.hospitality","home.work.healthcare","home.cta.building"
  ]){
    const tag=await page.locator(`[data-media-slot="${slot}"]`).evaluate(el=>el.tagName);
    expect(tag).toBe("DIV");
  }

  await expect(page.locator('img[src*="home-industries-"]')).toHaveCount(0);
  await expect(page.locator('img[src*="home-cta-building"]')).toHaveCount(0);
  for(const retired of [
    "/generated/home-industries-education.webp","/generated/home-industries-hospitality.webp",
    "/generated/home-industries-healthcare.webp","/generated/home-industries-corporate.webp",
    "/generated/home-industries-industrial.webp","/generated/home-industries-security.webp",
    "/generated/home-cta-building-v3.webp"
  ]) expect((await page.request.get(retired)).status()).toBe(404);

  const runtimeAuthorityConsumers=await page.locator("body *").evaluateAll(nodes=>nodes.flatMap(node=>{
    const element=node as HTMLElement;
    const sources=[element.getAttribute("src")??"",element.getAttribute("srcset")??"",element.getAttribute("style")??"",getComputedStyle(element).backgroundImage];
    return sources.some(value=>value.includes("approved-homepage-reference"))?[element.tagName+"."+element.className]:[];
  }));
  expect(runtimeAuthorityConsumers).toEqual([]);
});

test("industry rail and dialogs have real keyboard-operable outcomes",async({page})=>{
  await page.setViewportSize({width:1920,height:1080});
  await page.goto("/en");
  const rail=page.locator(".approved-industry-rail");
  expect(await rail.evaluate(el=>el.scrollWidth-el.clientWidth)).toBeGreaterThan(180);
  await expect(page.getByRole("button",{name:"Previous"})).toBeDisabled();
  await expect(page.getByRole("button",{name:"Next"})).toBeEnabled();
  const before=Math.abs(await rail.evaluate(el=>el.scrollLeft));
  await page.getByRole("button",{name:"Next"}).click();
  await expect.poll(async()=>Math.abs(await rail.evaluate(el=>el.scrollLeft))).toBeGreaterThan(before);
  await expect(page.getByRole("button",{name:"Previous"})).toBeEnabled();

  const search=page.getByRole("button",{name:"Search"});
  await search.click();
  const searchInput=page.getByRole("textbox",{name:"What are you looking for?"});
  await expect(searchInput).toBeFocused();
  await searchInput.fill("garments");
  await expect(page.getByRole("link",{name:"Garments"})).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(search).toBeFocused();

  const processLink=page.getByRole("link",{name:"See Our Process"});
  await expect(processLink).toHaveAttribute("href","#process");
  await processLink.click();
  await expect(page).toHaveURL(/#process$/);

  const process=page.getByRole("button",{name:"Our Process"});
  await process.click();
  await expect(page.getByRole("dialog",{name:"From idea to delivery"})).toBeVisible();
  await expect(page.getByRole("listitem")).toHaveCount(4);
  await page.keyboard.press("Escape");
  await expect(process).toBeFocused();
});

test("semantic structure, image stability, skip navigation and console health remain clean",async({page})=>{
  const consoleErrors:string[]=[];
  page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});
  await page.goto("/en");
  await expect(page.locator(".approved-homepage > header")).toHaveCount(1);
  await expect(page.locator(".approved-homepage > main#main-content")).toHaveCount(1);
  await expect(page.locator(".approved-homepage > footer")).toHaveCount(1);
  await expect(page.locator("main .approved-home-header, main .approved-home-footer")).toHaveCount(0);
  await expect(page.getByRole("link",{name:"About"}).first()).toHaveAttribute("href","#about");
  await expect(page.locator("#about")).toHaveClass(/approved-feature-more/);

  const images=page.locator(".approved-homepage img");
  for(let index=0;index<await images.count();index++){
    await expect(images.nth(index)).toHaveAttribute("width",/\d+/);
    await expect(images.nth(index)).toHaveAttribute("height",/\d+/);
  }
  await page.getByRole("link",{name:"Skip to content"}).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  expect(consoleErrors).toEqual([]);
});

test("mobile is independently composed at 390x844 and compact 360x640",async({page})=>{
  for(const [width,height,name] of [[390,844,"390x844"],[360,640,"360x640"]] as const){
    await page.setViewportSize({width,height});
    await page.goto("/en");
    await expect(page.getByRole("heading",{level:1})).toHaveAttribute("aria-label","Fares Uniform");
    await expect(page.locator(".approved-industry-card")).toHaveCount(6);
    await expect(page.locator('[data-media-slot="home.hero.design-cutting"]')).toHaveAttribute("src","/generated/home-hero-design-cutting-v1.png");
  await expect(page.locator('[data-media-slot="home.hero.manufacturing"]')).toHaveAttribute("src","/generated/home-hero-manufacturing-v1.png");
  await expect(page.locator(".approved-quality-card")).toHaveCount(0);
    await expect(page.locator(".approved-hero-benefits > div")).toHaveCount(4);
    expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(1);

    const hero=await page.getByTestId("approved-h01").boundingBox();
    const heroMedia=await page.locator(".approved-hero-media").boundingBox();
    const heroPhoto=await page.locator('[data-media-slot="home.hero.people-group"]').boundingBox();
    expect(hero).not.toBeNull();expect(heroMedia).not.toBeNull();expect(heroPhoto).not.toBeNull();
    expect(hero?.height??0).toBeGreaterThan(height*.84);
    expect(hero?.height??0).toBeLessThan(height*1.22);
    expect(Math.round(heroMedia?.width??0)).toBe(width);
    expect(heroPhoto?.height??0).toBeGreaterThan((hero?.height??0)*.35);
    const heroActions=await page.locator(".approved-hero-actions").boundingBox();
    const benefits=await page.locator(".approved-hero-benefits").boundingBox();
    expect((heroActions?.y??Infinity)+(heroActions?.height??0)).toBeLessThan((heroPhoto?.y??0)+1);
    expect(benefits?.width??0).toBeGreaterThan(width*.78);

    await page.screenshot({path:`artifacts/home-viewport-${name}.png`,fullPage:false});

    const feature=await page.getByTestId("approved-h03").boundingBox();
    expect(feature?.height??0).toBeGreaterThan(height*1.25);
    expect(feature?.height??0).toBeLessThan(height*1.9);

    const workCards=page.locator(".approved-work-cards");
    expect(await workCards.evaluate(el=>el.scrollWidth-el.clientWidth)).toBeGreaterThan(100);
    const industryRail=page.locator(".approved-industry-rail");
    const before=Math.abs(await industryRail.evaluate(el=>el.scrollLeft));
    await page.getByRole("button",{name:"Next"}).click();
    await expect.poll(async()=>Math.abs(await industryRail.evaluate(el=>el.scrollLeft))).toBeGreaterThan(before);
  }

  await page.setViewportSize({width:390,height:844});
  await page.goto("/en");
  const trigger=page.getByRole("button",{name:"Open menu"});
  await trigger.click();
  const menu=page.getByRole("dialog",{name:"Site menu"});
  await expect(menu).toBeVisible();
  await expect(page.getByRole("button",{name:"Close menu"})).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(menu.getByRole("link",{name:/Start a Project/i})).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();

  await page.evaluate(()=>window.scrollTo(0,1200));
  await expect.poll(async()=>Math.round((await page.locator(".approved-home-header").boundingBox())?.y??-1)).toBe(0);
});

test("Arabic RTL preserves the viewport-native composition without overflow",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("dir","rtl");
  await expect(page.getByRole("heading",{level:1})).toHaveAttribute("aria-label","فارس يونيفورم");
  await expect(page.locator(".approved-industry-card")).toHaveCount(6);
  expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(1);
  const root=await page.getByTestId("approved-homepage").boundingBox();
  const heroMedia=await page.locator(".approved-hero-media").boundingBox();
  expect(Math.round(root?.width??0)).toBe(390);
  expect(Math.round(heroMedia?.width??0)).toBe(390);
  await page.screenshot({path:"artifacts/home-viewport-390x844-ar.png",fullPage:false});
});

test("reduced motion preserves information and removes pin dead-space",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.setViewportSize({width:1440,height:900});
  await page.goto("/en");
  for(const id of ["H01.01","H02.01","H04.01","H05.02"]) await expect(page.locator(`[data-component-id="${id}"]`)).toBeVisible();

  const hero=page.getByTestId("approved-h01");
  const before=Number(await hero.evaluate(el=>getComputedStyle(el).getPropertyValue("--hero-handoff")));
  await page.evaluate(()=>window.scrollTo(0,700));
  await page.waitForTimeout(80);
  const after=Number(await hero.evaluate(el=>getComputedStyle(el).getPropertyValue("--hero-handoff")));
  expect(before).toBe(0);expect(after).toBe(0);
  await expect(page.locator(".approved-hero-people-plane")).toHaveCSS("transform","none");

  const feature=await page.getByTestId("approved-h03").boundingBox();
  expect(feature?.height??0).toBeLessThan(900*1.8);
  await expect(page.locator(".approved-seam-handoff")).toBeHidden();
  await expect(page.locator(".approved-feature-more")).toHaveCSS("clip-path","none");
  await expect(page.locator(".approved-feature-idea")).toHaveCSS("clip-path","none");
  expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(1);
  await page.screenshot({path:"artifacts/home-reduced-motion-1440x900.png",fullPage:false});
});

test("deep routes remain reachable outside homepage authority",async({page})=>{
  await page.goto("/en/work");
  await expect(page.getByRole("heading",{level:1,name:/KGC/i})).toBeVisible();
  await page.goto("/en/garments");
  await expect(page.locator('img[src*="high-summer-polo-front.png"]')).toBeVisible();
  await page.goto("/en/enquiry");
  await expect(page.getByRole("button",{name:/Preview submission state/i})).toBeVisible();
});

test("H01 rotates three distinct scenes with numbered controls and reduced-motion pause",async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto("/en");
  const hero=page.getByTestId("approved-h01");
  const numbers=page.locator(".approved-hero-pagination button");
  await expect(numbers).toHaveCount(3);
  await expect(hero).toHaveAttribute("data-hero-scene","0");
  await expect(page.locator(".note-a")).toContainText("Different roles.");
  await expect(page.locator(".note-b")).toBeVisible();
  await expect.poll(async()=>hero.getAttribute("data-hero-scene"),{timeout:8500}).toBe("1");
  await expect(page.locator(".approved-hero-scene-plane").first()).toHaveClass(/is-active/);
  await expect(page.locator(".note-a")).toContainText("From brief");
  await expect(page.locator(".note-b")).toBeHidden();
  await numbers.nth(2).click();
  await expect(hero).toHaveAttribute("data-hero-scene","2");
  await expect(page.locator(".note-a")).toContainText("Cut. Sew.");
  await expect(page.locator(".note-b")).toBeHidden();
  await expect(numbers.nth(2)).toHaveAttribute("aria-current","step");
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.reload();
  await expect(hero).toHaveAttribute("data-hero-scene","0");
  await page.waitForTimeout(5900);
  await expect(hero).toHaveAttribute("data-hero-scene","0");
  await numbers.nth(1).click();
  await expect(hero).toHaveAttribute("data-hero-scene","1");
});