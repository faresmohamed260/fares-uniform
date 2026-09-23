"use client";

import {
  BriefcaseBusiness, Check, ChevronDown, ChevronLeft, ChevronRight, CirclePlus,
  Globe2, GraduationCap, HardHat, Layers3,
  Menu, Play, Ruler, Search, ShieldCheck, Sparkles, Utensils, X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locale";

function useFocusTrap(open:boolean,onClose:()=>void,container:React.RefObject<HTMLElement|null>){
  useEffect(()=>{
    if(!open)return;
    const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const priorOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const focusable=()=>Array.from(container.current?.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )??[]).filter(element=>!element.hasAttribute("hidden"));
    const focusFrame=requestAnimationFrame(()=>{
      const preferred=container.current?.querySelector<HTMLElement>("[data-autofocus]");
      (preferred??focusable()[0])?.focus();
    });
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==="Escape"){event.preventDefault();onClose();return;}
      if(event.key!=="Tab")return;
      const items=focusable();
      if(items.length===0){event.preventDefault();return;}
      const first=items[0],last=items[items.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    };
    window.addEventListener("keydown",onKeyDown);
    return()=>{
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow=priorOverflow;
      window.removeEventListener("keydown",onKeyDown);
      previous?.focus();
    };
  },[open]);
}

function ApprovedDialog({open,onClose,id,title,closeLabel,children}:{open:boolean;onClose:()=>void;id:string;title:string;closeLabel:string;children:React.ReactNode}){
  const panel=useRef<HTMLDivElement>(null);
  useFocusTrap(open,onClose,panel);
  if(!open)return null;
  return <div className="approved-dialog-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
    <div ref={panel} className="approved-dialog" role="dialog" aria-modal="true" aria-labelledby={id}>
      <div className="approved-dialog-head"><h2 id={id}>{title}</h2><button type="button" aria-label={closeLabel} onClick={onClose}><X aria-hidden="true"/></button></div>
      {children}
    </div>
  </div>;
}

function BrandLockup(){
  return <span className="approved-brand">
    <svg viewBox="0 0 34 34" aria-hidden="true"><path d="M3 17 17 3l5 5-9 9 9 9-5 5L3 17Z"/><path d="m18 17 7-7 6 7-6 7-7-7Z" opacity=".72"/></svg>
    <span className="approved-brand-type"><strong>FARES</strong><small>UNIFORM</small></span>
  </span>;
}

const navLinks=[
  ["Home","الرئيسية","#top"],["Industries","القطاعات","#industries"],["Collections","المجموعات","/garments"],
  ["Our Process","عمليتنا","#process"],["About","عن فارس","#about"],["Work","أعمالنا","/work"],["Contact","اتصل بنا","/enquiry"],
] as const;

export function ApprovedHomepageHeader({locale}:{locale:Locale}){
  const [open,setOpen]=useState(false);
  const [searchOpen,setSearchOpen]=useState(false);
  const [query,setQuery]=useState("");
  const menu=useRef<HTMLDivElement>(null);
  const ar=locale==="ar";
  useFocusTrap(open,()=>setOpen(false),menu);
  const href=(raw:string)=>raw.startsWith("#")?raw:`/${locale}${raw}`;
  const searchItems=[
    ...navLinks.map(([en,arabic,raw])=>({en,ar:arabic,href:href(raw),keywords:raw})),
    {en:"Garments",ar:"الملابس",href:`/${locale}/garments`,keywords:"products catalog collections"},
    {en:"Enquiry",ar:"طلب تواصل",href:`/${locale}/enquiry`,keywords:"contact quote project"},
  ].filter(item=>`${item.en} ${item.ar} ${item.keywords}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <header className="approved-home-header" data-section-id="H00" data-testid="approved-h00">
    <a href={`/${locale}`} className="approved-header-brand" data-component-id="H00.01" aria-label="Fares Uniform home"><BrandLockup/></a>
    <nav className="approved-header-nav" data-component-id="H00.02" aria-label={ar?"التنقل الرئيسي":"Primary navigation"}>
      {navLinks.map(([en,arabic,raw],i)=><a key={en} className={i===0?"is-active":""} aria-current={i===0?"page":undefined} href={href(raw)}>{ar?arabic:en}</a>)}
    </nav>
    <div className="approved-header-utilities">
      <button className="approved-icon-button" data-component-id="H00.03" type="button" aria-label={ar?"بحث":"Search"} aria-haspopup="dialog" onClick={()=>setSearchOpen(true)}><Search aria-hidden="true"/></button>
      <a className="approved-locale" data-component-id="H00.04" href={ar?"/en":"/ar"} lang={ar?"en":"ar"} aria-label={ar?"Switch to English":"التبديل إلى العربية"}><Globe2/><span>{ar?"AR":"EN"}</span><ChevronDown/></a>
      <a className="approved-header-cta" data-component-id="H00.05" href={`/${locale}/enquiry`}><span>{ar?"تواصل معنا":"Get in Touch"}</span><i>↗</i></a>
    </div>
    <button className="approved-mobile-trigger" type="button" aria-label={ar?"فتح القائمة":"Open menu"} aria-expanded={open} aria-haspopup="dialog" onClick={()=>setOpen(true)}><Menu aria-hidden="true"/></button>
    {open&&<div ref={menu} className="approved-mobile-menu" role="dialog" aria-modal="true" aria-label={ar?"قائمة الموقع":"Site menu"}>
      <div><BrandLockup/><button data-autofocus type="button" aria-label={ar?"إغلاق القائمة":"Close menu"} onClick={()=>setOpen(false)}><X aria-hidden="true"/></button></div>
      <nav>{navLinks.map(([en,arabic,raw])=><a key={en} onClick={()=>setOpen(false)} href={href(raw)}>{ar?arabic:en}</a>)}</nav>
      <a href={`/${locale}/enquiry`} onClick={()=>setOpen(false)}>{ar?"تواصل معنا":"Get in Touch"} <span aria-hidden="true">↗</span></a>
    </div>}
    <ApprovedDialog open={searchOpen} onClose={()=>setSearchOpen(false)} id="approved-search-title" closeLabel={ar?"إغلاق":"Close"} title={ar?"ابحث في الموقع":"Search the site"}>
      <label className="approved-search-field"><span>{ar?"ماذا تبحث عنه؟":"What are you looking for?"}</span><input data-autofocus value={query} onChange={event=>setQuery(event.target.value)} placeholder={ar?"القطاعات أو الملابس أو التواصل":"Industries, garments, or contact"}/></label>
      <nav className="approved-search-results" aria-label={ar?"نتائج البحث":"Search results"}>
        {searchItems.length>0?searchItems.map(item=><a key={`${item.en}-${item.href}`} href={item.href} onClick={()=>setSearchOpen(false)}>{ar?item.ar:item.en}<span aria-hidden="true">↗</span></a>):<p role="status">{ar?"لا توجد نتائج.":"No matching pages."}</p>}
      </nav>
    </ApprovedDialog>
  </header>;
}

export function ApprovedHero({locale}:{locale:Locale}){
  const ar=locale==="ar";
  const [storyOpen,setStoryOpen]=useState(false);
  return <section id="top" className="approved-hero" data-section-id="H01" data-testid="approved-h01">
    <div className="approved-hero-copy">
      <span className="approved-eyebrow" data-component-id="H01.01">{ar?"زي موحّد لغدٍ أكثر إشراقاً":"UNIFORMS FOR A BRIGHTER TOMORROW"}</span>
      <h1 data-component-id="H01.02"><span>{ar?"أشخاص":"PEOPLE"}</span><span>{ar?"أعمال":"BUSINESSES"}</span><span>{ar?"مجتمعات":"COMMUNITIES"}</span><em>{ar?"بالزي الموحّد":"IN UNIFORM"}</em></h1>
      <p data-component-id="H01.03">{ar?"نصمّم ونصنّع الزي للمدارس والضيافة والرعاية الصحية والشركات وغيرها — لنساعد الناس على الظهور باحتراف، والشعور بالثقة، والتحرك معاً.":"We design and manufacture uniforms for schools, hospitality, healthcare, corporate and more — helping people look professional, feel confident, and move forward together."}</p>
      <div className="approved-hero-actions">
        <a data-component-id="H01.04" className="approved-primary-button" href="#industries">{ar?"استكشف قطاعاتنا":"Explore Our Industries"} <i>↗</i></a>
        <button data-component-id="H01.05" className="approved-story-button" type="button" aria-haspopup="dialog" onClick={()=>setStoryOpen(true)}><span><Play fill="currentColor" aria-hidden="true"/></span>{ar?"شاهد قصتنا":"Watch Our Story"}</button>
      </div>
      <div className="approved-hero-pagination" data-component-id="H01.06"><strong>01</strong><i/><span>02</span><i/><span>03</span></div>
    </div>
    <div className="approved-hero-media">
      <div className="approved-blue-geometry" data-component-id="H01.08" aria-hidden="true"><span/><span/></div>
      <img data-media-slot="home.hero.people-group" className="approved-hero-people approved-hero-generated" src="/generated/home-hero-people-group.webp" width={689} height={399} fetchPriority="high" decoding="async" alt={ar?"تكوين توضيحي عام لمهن وقطاعات متعددة":"Generic illustrative multi-profession uniform composition"}/>
      <div className="approved-hand-note note-a" data-component-id="H01.09">{ar?"أشخاص مختلفون\nهدف واحد":"Different People\nSame Purpose"}<svg viewBox="0 0 90 44"><path d="M3 8c25 5 45 14 72 27m-12-14 13 14-17 3"/></svg></div>
      <div className="approved-hand-note note-b" data-component-id="H01.10">{ar?"زي حقيقي\nناس حقيقيون\nأثر حقيقي.":"Real Uniforms\nReal People\nReal Impact."}<svg viewBox="0 0 88 46"><path d="M83 7C60 15 44 27 10 35m9-12L9 35l15 4"/></svg></div>
      <div className="approved-quality-card" data-component-id="H01.11">
        <img className="approved-quality-thumb approved-quality-textile" data-media-slot="home.hero.quality-thumb" src="/generated/home-feature-fabric-blue-v1.webp" width={60} height={67} loading="lazy" decoding="async" alt="" aria-hidden="true"/>
        <p><strong>{ar?"الجودة":"Quality"}</strong><strong>{ar?"الناس":"People"}</strong><strong>{ar?"شراكات تدوم":"Lasting Partnerships"}</strong></p><a href="#about" aria-label={ar?"اعرف المزيد":"Learn more"}>↗</a>
      </div>
    </div>
    <ApprovedDialog open={storyOpen} onClose={()=>setStoryOpen(false)} id="approved-story-title" closeLabel={ar?"إغلاق":"Close"} title={ar?"قصة فارس":"The Fares story"}>
      <div className="approved-dialog-copy"><p>{ar?"نحوّل هوية المؤسسات إلى برامج زي عملية ومتناسقة، من التصميم وأخذ العينات إلى التصنيع والتسليم.":"We translate an organization’s identity into practical, coordinated uniform programs, from design and sampling through manufacturing and delivery."}</p><a className="approved-primary-button" href={`/${locale}/enquiry`} onClick={()=>setStoryOpen(false)}>{ar?"ابدأ مشروعك":"Start a project"} <span aria-hidden="true">↗</span></a></div>
    </ApprovedDialog>
  </section>;
}

const industries=[
 {key:"education",en:"Education",ar:"التعليم",sub:"SCHOOL UNIFORMS",subAr:"زي مدرسي",Icon:GraduationCap},
 {key:"hospitality",en:"Hospitality",ar:"الضيافة",sub:"HOTELS & RESTAURANTS",subAr:"فنادق ومطاعم",Icon:Utensils},
 {key:"healthcare",en:"Healthcare",ar:"الرعاية الصحية",sub:"HOSPITALS & CLINICS",subAr:"مستشفيات وعيادات",Icon:CirclePlus},
 {key:"corporate",en:"Corporate",ar:"الشركات",sub:"BUSINESS & OFFICES",subAr:"أعمال ومكاتب",Icon:BriefcaseBusiness},
 {key:"industrial",en:"Industrial",ar:"الصناعي",sub:"WORKWEAR & SAFETY",subAr:"ملابس عمل وسلامة",Icon:HardHat},
 {key:"security",en:"Security",ar:"الأمن",sub:"SECURITY UNIFORMS",subAr:"زي أمني",Icon:ShieldCheck},
] as const;

export function ApprovedIndustries({locale}:{locale:Locale}){
 const ar=locale==="ar";
 const rail=useRef<HTMLDivElement>(null);
 const [railState,setRailState]=useState({canPrevious:false,canNext:false});
 useEffect(()=>{
  const element=rail.current;if(!element)return;
  const update=()=>{const max=Math.max(0,element.scrollWidth-element.clientWidth);const position=Math.abs(element.scrollLeft);setRailState({canPrevious:position>1,canNext:position<max-1});};
  update();element.addEventListener("scroll",update,{passive:true});
  const observer=new ResizeObserver(update);observer.observe(element);
  return()=>{element.removeEventListener("scroll",update);observer.disconnect();};
 },[]);
 const move=(dir:number)=>rail.current?.scrollBy({left:(ar?-dir:dir)*Math.max(190,rail.current.clientWidth*.72),behavior:"smooth"});
 return <section id="industries" className="approved-industries" data-section-id="H02" data-testid="approved-h02">
   <header className="approved-industries-head">
    <div><span className="approved-eyebrow" data-component-id="H02.01">{ar?"قطاعاتنا":"OUR INDUSTRIES"}</span><h2 data-component-id="H02.02">{ar?"حلول زي موحّد":"Uniform Solutions"}<br/><em>{ar?"لكل قطاع":"for Every Sector"}</em></h2></div>
    <div className="approved-industries-intro"><p data-component-id="H02.03">{ar?"من الفصول إلى المطابخ، ومن المستشفيات إلى الفنادق — نصنع حلول زي تناسب فريقك وعلامتك وعملك اليومي.":"From classrooms to kitchens, hospitals to hotels — we create uniform solutions that fit your people, your brand, and your day-to-day needs."}</p>
      <a data-component-id="H02.04" href={`/${locale}/work`}>{ar?"عرض كل القطاعات":"View All Industries"} <i>↗</i></a>
      <div data-component-id="H02.05" className="approved-carousel-controls"><button type="button" aria-label={ar?"السابق":"Previous"} disabled={!railState.canPrevious} onClick={()=>move(-1)}><ChevronLeft aria-hidden="true"/></button><button type="button" aria-label={ar?"التالي":"Next"} disabled={!railState.canNext} onClick={()=>move(1)}><ChevronRight aria-hidden="true"/></button></div>
    </div>
   </header>
   <div className="approved-industry-rail" ref={rail} data-component-id="H02.06">{industries.map(({key,en,ar:arabic,sub,subAr,Icon})=><article className="approved-industry-card" key={key}>
    <img data-media-slot={`home.industries.${key}`} className="approved-industry-image approved-industry-generated" src={`/generated/home-industries-${key}.webp`} width={key==="education"||key==="security"?158:159} height={137} loading="lazy" decoding="async" alt={ar?arabic:en}/>
    <div className="approved-industry-meta"><Icon/><div><h3>{ar?arabic:en}</h3><p>{ar?subAr:sub}</p></div><a href={`/${locale}/work`} aria-label={ar?arabic:en}>↗</a></div>
   </article>)}</div>
 </section>;
}

export function ApprovedFeatureBand({locale}:{locale:Locale}){
 const ar=locale==="ar";
 const [processOpen,setProcessOpen]=useState(false);
 const benefits=[[ShieldCheck,ar?"أقمشة متينة":"Durable Fabrics"],[Sparkles,ar?"راحة في كل تفصيلة":"Comfort in Every Detail"],[Ruler,ar?"تصميم عملي":"Practical Design"],[Layers3,ar?"مصنوع للحياة الواقعية":"Made for Real Life"]] as const;
 return <section id="process" className="approved-feature-band" data-section-id="H03" data-testid="approved-h03">
  <article id="about" className="approved-feature-more">
   <img className="approved-fabric-field" data-component-id="H03A.01" data-media-slot="home.feature.fabric-blue" src="/generated/home-feature-fabric-blue-v1.webp" width={996} height={526} loading="lazy" decoding="async" alt="" aria-hidden="true"/>
   <div className="approved-feature-copy"><h2 data-component-id="H03A.02">{ar?"أكثر من\nزي موحّد":"MORE\nTHAN UNIFORMS"}</h2><p data-component-id="H03A.03">{ar?"أقمشة عالية الجودة، تصميم عملي وإنتاج موثوق — زي يعمل بجد مثل من يرتديه.":"Quality fabrics, practical design and reliable production — uniforms that work as hard as the people wearing them."}</p><a data-component-id="H03A.04" className="approved-light-button" href={`/${locale}/garments`}>{ar?"اكتشف مجموعاتنا":"Discover Our Collections"} ↗</a></div>
   <div className="approved-benefit-row" data-component-id="H03A.05">{benefits.map(([Icon,label])=><div key={label}><Icon/><span>{label}</span></div>)}</div>
  </article>
  <article className="approved-feature-idea">
   <img data-media-slot="home.feature.design-sketch" className="approved-sketch-background approved-sketch-generated" src="/generated/home-feature-design-sketch.svg" width={519} height={263} loading="lazy" decoding="async" alt="" aria-hidden="true"/>
   <div className="approved-sketch-mask" aria-hidden="true"/>
   <div className="approved-feature-copy approved-feature-copy-dark"><h2 data-component-id="H03B.02">{ar?"من الفكرة\nإلى الزي":"FROM\nIDEA TO UNIFORM"}</h2><p data-component-id="H03B.03">{ar?"من الفكرة إلى المنتج النهائي — نصمّم ونأخذ العينات ونصنّع الزي الذي يحوّل رؤيتك إلى واقع.":"Concept to final product — designing, sampling and manufacturing uniforms that bring your vision to life."}</p><button data-component-id="H03B.06" className="approved-outline-button" type="button" aria-haspopup="dialog" onClick={()=>setProcessOpen(true)}>{ar?"عمليتنا":"Our Process"} <span aria-hidden="true">↗</span></button></div>
   <div className="approved-process-checklist" data-component-id="H03B.04">{[ar?"تصميم":"Design",ar?"عينة":"Sample",ar?"إنتاج":"Produce",ar?"تسليم":"Deliver"].map(x=><span key={x}><Check/> {x}</span>)}</div>
   <div className="approved-hand-note approved-vision-note" data-component-id="H03B.05">{ar?"رؤيتك.\nخبرتنا.":"Your Vision.\nOur Expertise."}<svg viewBox="0 0 80 38"><path d="M4 7c27 5 43 15 65 24m-12-13 13 13-17 2"/></svg></div>
  </article>
  <ApprovedDialog open={processOpen} onClose={()=>setProcessOpen(false)} id="approved-process-title" closeLabel={ar?"إغلاق":"Close"} title={ar?"من الفكرة إلى التسليم":"From idea to delivery"}>
    <ol className="approved-process-detail">{[
      [ar?"١":"01",ar?"التصميم":"Design",ar?"نحوّل المتطلبات والهوية إلى اتجاه واضح.":"We translate requirements and identity into a clear direction."],
      [ar?"٢":"02",ar?"العينة":"Sample",ar?"نراجع الخامة والمقاس والتفاصيل قبل الإنتاج.":"We validate fabric, fit, and details before production."],
      [ar?"٣":"03",ar?"الإنتاج":"Produce",ar?"نصنّع البرنامج المتفق عليه بجودة متسقة.":"We manufacture the agreed program with consistent quality."],
      [ar?"٤":"04",ar?"التسليم":"Deliver",ar?"ننسّق التسليم والدعم وفق احتياجات المؤسسة.":"We coordinate delivery and support around the organization’s needs."]
    ].map(([number,title,copy])=><li key={number}><span>{number}</span><div><strong>{title}</strong><p>{copy}</p></div></li>)}</ol>
  </ApprovedDialog>
 </section>;
}

const workCards=[
 {slot:"home.work.kgc",en:"KGC",ar:"KGC",sub:"School Uniform Program",subAr:"برنامج زي مدرسي",href:"/work/kgc/national"},
 {slot:"home.work.hospitality",en:"Hospitality",ar:"الضيافة",sub:"Restaurant Uniforms",subAr:"زي مطاعم",href:"/work"},
 {slot:"home.work.healthcare",en:"Healthcare",ar:"الرعاية الصحية",sub:"Clinic Uniforms",subAr:"زي عيادات",href:"/work"},
] as const;

export function ApprovedSelectedWork({locale}:{locale:Locale}){
 const ar=locale==="ar";
 return <section className="approved-selected-work" data-section-id="H04" data-testid="approved-h04">
  <div className="approved-selected-title"><span className="approved-eyebrow" data-component-id="H04.01">{ar?"أعمال مختارة":"SELECTED WORK"}</span><h2 data-component-id="H04.02">{ar?"شراكات حقيقية.\nنتائج حقيقية.":"Real Partnerships.\nReal Results."}</h2></div>
  <div className="approved-work-cards">{workCards.map((c,i)=><a className="approved-work-card" key={c.slot} href={`/${locale}${c.href}`} aria-label={c.slot==="home.work.kgc"?(ar?"مشروع KGC":"KGC project"):(ar?`${c.ar}، تصور توضيحي للقدرات`:`${c.en}, illustrative capability preview`)} data-component-id={`H04.0${i+3}`}>{c.slot==="home.work.kgc"
  ? <img data-media-slot={c.slot} className="approved-work-image approved-work-real" src="/review-media/kgc/kgc-building.webp" width={169} height={149} loading="lazy" decoding="async" alt={ar?"حرم KGC في بيئة المراجعة المحمية":"KGC campus in the protected review environment"}/>
  : c.slot==="home.work.hospitality"
    ? <img data-media-slot={c.slot} className="approved-work-image approved-work-generated" width={169} height={149} loading="lazy" decoding="async" src="/generated/home-industries-hospitality.webp" alt={ar?"مشهد ضيافة توضيحي عام":"Generic illustrative hospitality scene"}/>
    : <img data-media-slot={c.slot} className="approved-work-image approved-work-generated" width={169} height={149} loading="lazy" decoding="async" src="/generated/home-industries-healthcare.webp" alt={ar?"مشهد رعاية صحية توضيحي عام":"Generic illustrative healthcare scene"}/>}<div className="approved-work-meta"><strong>{ar?c.ar:c.en}</strong><span>{ar?c.subAr:c.sub}</span><i>↗</i></div></a>)}
   <a className="approved-work-cta" data-component-id="H04.06" href={`/${locale}/work`}><p>{ar?"لنصنع شيئاً رائعاً معاً.":"Let's build something great together."}</p><span>{ar?"عرض كل الأعمال":"View All Work"} ↗</span></a>
  </div>
 </section>;
}

export function ApprovedClosingCta({locale}:{locale:Locale}){
 const ar=locale==="ar";
 return <section className="approved-closing-cta" data-section-id="H05" data-testid="approved-h05">
  <img data-media-slot="home.cta.building" className="approved-building-background approved-building-generated" src="/generated/home-cta-building-v3.webp" width={2048} height={344} loading="lazy" decoding="async" alt={ar?"بيئة معمارية توضيحية عامة":"Generic illustrative business architecture"}/>
  <div className="approved-cta-scrim" aria-hidden="true"/>
  <div className="approved-cta-copy"><span className="approved-eyebrow" data-component-id="H05.02">{ar?"جاهز للبدء؟":"READY TO GET STARTED?"}</span><h2 data-component-id="H05.03">{ar?"لنصنع\nحل الزي الخاص بك":"LET'S CREATE\nYOUR UNIFORM SOLUTION"}</h2><div data-component-id="H05.04"><a className="approved-primary-button" href={`/${locale}/enquiry`}>{ar?"تواصل معنا":"Get in Touch"} ↗</a><p>{ar?"نحن هنا لمساعدتك في المتطلبات والأفكار والأسئلة.":"We're here to help with requirements, ideas, or questions."}</p></div></div>
  <div className="approved-hand-note approved-local-note" data-component-id="H05.05">{ar?"جذور محلية\nمعايير عالمية":"Local Roots\nGlobal Standards"}<svg viewBox="0 0 90 42"><path d="M5 6c25 7 49 17 72 28m-14-14 15 14-18 3"/></svg></div>
 </section>;
}

export function ApprovedHomepageFooter({locale}:{locale:Locale}){
 const ar=locale==="ar";const href=(raw:string)=>raw.startsWith("#")?raw:`/${locale}${raw}`;
 return <footer className="approved-home-footer" data-section-id="H06" data-testid="approved-h06">
  <a className="approved-footer-brand" data-component-id="H06.01" href={`/${locale}`}><BrandLockup/></a>
  <nav data-component-id="H06.02" aria-label={ar?"روابط التذييل":"Footer navigation"}>{navLinks.map(([en,arabic,raw])=><a key={en} href={href(raw)}>{ar?arabic:en}</a>)}</nav>
  <div className="approved-socials" data-component-id="H06.03"><button aria-label="Instagram" disabled><span>IG</span></button><button aria-label="LinkedIn" disabled><span>in</span></button><button aria-label="Facebook" disabled><span>f</span></button><button aria-label="YouTube" disabled><span>▶</span></button></div>
  <a className="approved-footer-locale" data-component-id="H06.04" href={ar?"/en":"/ar"} lang={ar?"en":"ar"} aria-label={ar?"Switch to English":"التبديل إلى العربية"}><Globe2/><span>{ar?"AR":"EN"}</span><ChevronDown/></a>
  <hr data-component-id="H06.05"/><small data-component-id="H06.06">© 2026 Fares Uniform. {ar?"جميع الحقوق محفوظة.":"All rights reserved."}</small><p data-component-id="H06.07">{ar?"زي موحّد لغدٍ أكثر إشراقاً.":"Uniforms for a brighter tomorrow."}</p>
 </footer>;
}

export function ApprovedHomepage({locale}:{locale:Locale}){
 return <div className="approved-homepage" data-testid="approved-homepage">
  <ApprovedHomepageHeader locale={locale}/>
  <main id="main-content" tabIndex={-1}>
    <ApprovedHero locale={locale}/><ApprovedIndustries locale={locale}/><ApprovedFeatureBand locale={locale}/>
    <ApprovedSelectedWork locale={locale}/><ApprovedClosingCta locale={locale}/>
  </main>
  <ApprovedHomepageFooter locale={locale}/>
 </div>;
}
