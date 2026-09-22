"use client";

import {
  BriefcaseBusiness, Check, ChevronDown, ChevronLeft, ChevronRight, CirclePlus,
  Globe2, GraduationCap, HardHat, Layers3,
  Menu, Play, Ruler, Search, ShieldCheck, Sparkles, Utensils, X
} from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locale";

type Crop={x:number;y:number;w:number;h:number};

function ReferenceCrop({slot,crop,className="",label}:{slot:string;crop:Crop;className?:string;label?:string}){
  const style:CSSProperties={
    backgroundImage:"url('/authority/approved-homepage-reference.webp')",
    backgroundSize:"1024px 1536px",
    backgroundPosition:`-${crop.x}px -${crop.y}px`,
    backgroundRepeat:"no-repeat",
  };
  return <div className={`approved-reference-crop ${className}`} data-media-slot={slot} style={style}
    role={label?"img":undefined} aria-label={label} aria-hidden={label?undefined:true}/>;
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
  const [open,setOpen]=useState(false); const ar=locale==="ar";
  useEffect(()=>{if(!open)return;const prior=document.body.style.overflow;document.body.style.overflow="hidden";
    const key=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};window.addEventListener("keydown",key);
    return()=>{document.body.style.overflow=prior;window.removeEventListener("keydown",key)}},[open]);
  const href=(raw:string)=>raw.startsWith("#")?raw:`/${locale}${raw}`;
  return <header className="approved-home-header" data-section-id="H00" data-testid="approved-h00">
    <a href={`/${locale}`} className="approved-header-brand" data-component-id="H00.01" aria-label="Fares Uniform home"><BrandLockup/></a>
    <nav className="approved-header-nav" data-component-id="H00.02" aria-label={ar?"التنقل الرئيسي":"Primary navigation"}>
      {navLinks.map(([en,arabic,raw],i)=><a key={en} className={i===0?"is-active":""} href={href(raw)}>{ar?arabic:en}</a>)}
    </nav>
    <div className="approved-header-utilities">
      <button className="approved-icon-button" data-component-id="H00.03" type="button" aria-label={ar?"بحث":"Search"}><Search/></button>
      <a className="approved-locale" data-component-id="H00.04" href={ar?"/en":"/ar"} lang={ar?"en":"ar"}><Globe2/><span>{ar?"AR":"EN"}</span><ChevronDown/></a>
      <a className="approved-header-cta" data-component-id="H00.05" href={`/${locale}/enquiry`}><span>{ar?"تواصل معنا":"Get in Touch"}</span><i>↗</i></a>
    </div>
    <button className="approved-mobile-trigger" type="button" aria-label={ar?"فتح القائمة":"Open menu"} aria-expanded={open} onClick={()=>setOpen(true)}><Menu/></button>
    {open&&<div className="approved-mobile-menu" role="dialog" aria-modal="true" aria-label={ar?"قائمة الموقع":"Site menu"}>
      <div><BrandLockup/><button type="button" aria-label={ar?"إغلاق القائمة":"Close menu"} onClick={()=>setOpen(false)}><X/></button></div>
      <nav>{navLinks.map(([en,arabic,raw])=><a key={en} onClick={()=>setOpen(false)} href={href(raw)}>{ar?arabic:en}</a>)}</nav>
      <a href={`/${locale}/enquiry`} onClick={()=>setOpen(false)}>{ar?"تواصل معنا":"Get in Touch"} ↗</a>
    </div>}
  </header>;
}

export function ApprovedHero({locale}:{locale:Locale}){
  const ar=locale==="ar";
  return <section id="top" className="approved-hero" data-section-id="H01" data-testid="approved-h01">
    <div className="approved-hero-copy">
      <span className="approved-eyebrow" data-component-id="H01.01">{ar?"زي موحّد لغدٍ أكثر إشراقاً":"UNIFORMS FOR A BRIGHTER TOMORROW"}</span>
      <h1 data-component-id="H01.02"><span>{ar?"أشخاص":"PEOPLE"}</span><span>{ar?"أعمال":"BUSINESSES"}</span><span>{ar?"مجتمعات":"COMMUNITIES"}</span><em>{ar?"بالزي الموحّد":"IN UNIFORM"}</em></h1>
      <p data-component-id="H01.03">{ar?"نصمّم ونصنّع الزي للمدارس والضيافة والرعاية الصحية والشركات وغيرها — لنساعد الناس على الظهور باحتراف، والشعور بالثقة، والتحرك معاً.":"We design and manufacture uniforms for schools, hospitality, healthcare, corporate and more — helping people look professional, feel confident, and move forward together."}</p>
      <div className="approved-hero-actions">
        <a data-component-id="H01.04" className="approved-primary-button" href="#industries">{ar?"استكشف قطاعاتنا":"Explore Our Industries"} <i>↗</i></a>
        <button data-component-id="H01.05" className="approved-story-button" type="button"><span><Play fill="currentColor"/></span>{ar?"شاهد قصتنا":"Watch Our Story"}</button>
      </div>
      <div className="approved-hero-pagination" data-component-id="H01.06"><strong>01</strong><i/><span>02</span><i/><span>03</span></div>
    </div>
    <div className="approved-hero-media">
      <div className="approved-blue-geometry" data-component-id="H01.08" aria-hidden="true"><span/><span/></div>
      <img data-media-slot="home.hero.people-group" className="approved-hero-people approved-hero-generated" src="/generated/home-hero-people-group.webp" alt={ar?"تكوين توضيحي عام لمهن وقطاعات متعددة":"Generic illustrative multi-profession uniform composition"}/>
      <div className="approved-hand-note note-a" data-component-id="H01.09">{ar?"أشخاص مختلفون\nهدف واحد":"Different People\nSame Purpose"}<svg viewBox="0 0 90 44"><path d="M3 8c25 5 45 14 72 27m-12-14 13 14-17 3"/></svg></div>
      <div className="approved-hand-note note-b" data-component-id="H01.10">{ar?"زي حقيقي\nناس حقيقيون\nأثر حقيقي.":"Real Uniforms\nReal People\nReal Impact."}<svg viewBox="0 0 88 46"><path d="M83 7C60 15 44 27 10 35m9-12L9 35l15 4"/></svg></div>
      <div className="approved-quality-card" data-component-id="H01.11">
        <div className="approved-quality-thumb approved-quality-textile" data-media-slot="home.hero.quality-thumb" aria-hidden="true"><span/><span/><span/></div>
        <p><strong>{ar?"الجودة":"Quality"}</strong><strong>{ar?"الناس":"People"}</strong><strong>{ar?"شراكات تدوم":"Lasting Partnerships"}</strong></p><a href="#about" aria-label={ar?"اعرف المزيد":"Learn more"}>↗</a>
      </div>
    </div>
  </section>;
}

const industries=[
 {key:"education",en:"Education",ar:"التعليم",sub:"SCHOOL UNIFORMS",subAr:"زي مدرسي",crop:{x:10,y:579,w:158,h:137},Icon:GraduationCap},
 {key:"hospitality",en:"Hospitality",ar:"الضيافة",sub:"HOTELS & RESTAURANTS",subAr:"فنادق ومطاعم",crop:{x:179,y:579,w:159,h:137},Icon:Utensils},
 {key:"healthcare",en:"Healthcare",ar:"الرعاية الصحية",sub:"HOSPITALS & CLINICS",subAr:"مستشفيات وعيادات",crop:{x:348,y:579,w:159,h:137},Icon:CirclePlus},
 {key:"corporate",en:"Corporate",ar:"الشركات",sub:"BUSINESS & OFFICES",subAr:"أعمال ومكاتب",crop:{x:518,y:579,w:159,h:137},Icon:BriefcaseBusiness},
 {key:"industrial",en:"Industrial",ar:"الصناعي",sub:"WORKWEAR & SAFETY",subAr:"ملابس عمل وسلامة",crop:{x:687,y:579,w:159,h:137},Icon:HardHat},
 {key:"security",en:"Security",ar:"الأمن",sub:"SECURITY UNIFORMS",subAr:"زي أمني",crop:{x:856,y:579,w:158,h:137},Icon:ShieldCheck},
] as const;

export function ApprovedIndustries({locale}:{locale:Locale}){
 const ar=locale==="ar";const rail=useRef<HTMLDivElement>(null);const move=(dir:number)=>rail.current?.scrollBy({left:dir*190,behavior:"smooth"});
 return <section id="industries" className="approved-industries" data-section-id="H02" data-testid="approved-h02">
   <header className="approved-industries-head">
    <div><span className="approved-eyebrow" data-component-id="H02.01">{ar?"قطاعاتنا":"OUR INDUSTRIES"}</span><h2 data-component-id="H02.02">{ar?"حلول زي موحّد":"Uniform Solutions"}<br/><em>{ar?"لكل قطاع":"for Every Sector"}</em></h2></div>
    <div className="approved-industries-intro"><p data-component-id="H02.03">{ar?"من الفصول إلى المطابخ، ومن المستشفيات إلى الفنادق — نصنع حلول زي تناسب فريقك وعلامتك وعملك اليومي.":"From classrooms to kitchens, hospitals to hotels — we create uniform solutions that fit your people, your brand, and your day-to-day needs."}</p>
      <a data-component-id="H02.04" href={`/${locale}/work`}>{ar?"عرض كل القطاعات":"View All Industries"} <i>↗</i></a>
      <div data-component-id="H02.05" className="approved-carousel-controls"><button type="button" aria-label="Previous" onClick={()=>move(-1)}><ChevronLeft/></button><button type="button" aria-label="Next" onClick={()=>move(1)}><ChevronRight/></button></div>
    </div>
   </header>
   <div className="approved-industry-rail" ref={rail} data-component-id="H02.06">{industries.map(({key,en,ar:arabic,sub,subAr,crop,Icon})=><article className="approved-industry-card" key={key}>
    <ReferenceCrop slot={`home.industries.${key}`} crop={crop} className="approved-industry-image" label={ar?arabic:en}/>
    <div className="approved-industry-meta"><Icon/><div><h3>{ar?arabic:en}</h3><p>{ar?subAr:sub}</p></div><a href={`/${locale}/work`} aria-label={ar?arabic:en}>↗</a></div>
   </article>)}</div>
 </section>;
}

export function ApprovedFeatureBand({locale}:{locale:Locale}){
 const ar=locale==="ar";
 const benefits=[[ShieldCheck,ar?"أقمشة متينة":"Durable Fabrics"],[Sparkles,ar?"راحة في كل تفصيلة":"Comfort in Every Detail"],[Ruler,ar?"تصميم عملي":"Practical Design"],[Layers3,ar?"مصنوع للحياة الواقعية":"Made for Real Life"]] as const;
 return <section id="process" className="approved-feature-band" data-section-id="H03" data-testid="approved-h03">
  <article className="approved-feature-more">
   <div className="approved-fabric-field" data-component-id="H03A.01" data-media-slot="home.feature.fabric-blue" aria-hidden="true"><span/><span/><span/></div>
   <div className="approved-feature-copy"><h2 data-component-id="H03A.02">{ar?"أكثر من\nزي موحّد":"MORE\nTHAN UNIFORMS"}</h2><p data-component-id="H03A.03">{ar?"أقمشة عالية الجودة، تصميم عملي وإنتاج موثوق — زي يعمل بجد مثل من يرتديه.":"Quality fabrics, practical design and reliable production — uniforms that work as hard as the people wearing them."}</p><a data-component-id="H03A.04" className="approved-light-button" href={`/${locale}/garments`}>{ar?"اكتشف مجموعاتنا":"Discover Our Collections"} ↗</a></div>
   <div className="approved-benefit-row" data-component-id="H03A.05">{benefits.map(([Icon,label])=><div key={label}><Icon/><span>{label}</span></div>)}</div>
  </article>
  <article className="approved-feature-idea">
   <ReferenceCrop slot="home.feature.design-sketch" crop={{x:505,y:817,w:519,h:263}} className="approved-sketch-background"/>
   <div className="approved-sketch-mask" aria-hidden="true"/>
   <div className="approved-feature-copy approved-feature-copy-dark"><h2 data-component-id="H03B.02">{ar?"من الفكرة\nإلى الزي":"FROM\nIDEA TO UNIFORM"}</h2><p data-component-id="H03B.03">{ar?"من الفكرة إلى المنتج النهائي — نصمّم ونأخذ العينات ونصنّع الزي الذي يحوّل رؤيتك إلى واقع.":"Concept to final product — designing, sampling and manufacturing uniforms that bring your vision to life."}</p><a data-component-id="H03B.06" className="approved-outline-button" href="#process">{ar?"عمليتنا":"Our Process"} ↗</a></div>
   <div className="approved-process-checklist" data-component-id="H03B.04">{[ar?"تصميم":"Design",ar?"عينة":"Sample",ar?"إنتاج":"Produce",ar?"تسليم":"Deliver"].map(x=><span key={x}><Check/> {x}</span>)}</div>
   <div className="approved-hand-note approved-vision-note" data-component-id="H03B.05">{ar?"رؤيتك.\nخبرتنا.":"Your Vision.\nOur Expertise."}<svg viewBox="0 0 80 38"><path d="M4 7c27 5 43 15 65 24m-12-13 13 13-17 2"/></svg></div>
  </article>
 </section>;
}

const workCards=[
 {slot:"home.work.kgc",crop:{x:324,y:1097,w:173,h:149},en:"KGC",ar:"KGC",sub:"School Uniform Program",subAr:"برنامج زي مدرسي",href:"/work/kgc/national"},
 {slot:"home.work.hospitality",crop:{x:506,y:1097,w:169,h:149},en:"Hospitality",ar:"الضيافة",sub:"Restaurant Uniforms",subAr:"زي مطاعم",href:"/work"},
 {slot:"home.work.healthcare",crop:{x:682,y:1097,w:169,h:149},en:"Healthcare",ar:"الرعاية الصحية",sub:"Clinic Uniforms",subAr:"زي عيادات",href:"/work"},
] as const;

export function ApprovedSelectedWork({locale}:{locale:Locale}){
 const ar=locale==="ar";
 return <section id="about" className="approved-selected-work" data-section-id="H04" data-testid="approved-h04">
  <div className="approved-selected-title"><span className="approved-eyebrow" data-component-id="H04.01">{ar?"أعمال مختارة":"SELECTED WORK"}</span><h2 data-component-id="H04.02">{ar?"شراكات حقيقية.\nنتائج حقيقية.":"Real Partnerships.\nReal Results."}</h2></div>
  <div className="approved-work-cards">{workCards.map((c,i)=><a className="approved-work-card" key={c.slot} href={`/${locale}${c.href}`} data-component-id={`H04.0${i+3}`}>{c.slot==="home.work.kgc"
  ? <img data-media-slot={c.slot} className="approved-work-image approved-work-real" src="/review-media/kgc/kgc-building.webp" alt={ar?"حرم KGC في بيئة المراجعة المحمية":"KGC campus in the protected review environment"}/>
  : <ReferenceCrop slot={c.slot} crop={c.crop} className="approved-work-image"/>}<div className="approved-work-meta"><strong>{ar?c.ar:c.en}</strong><span>{ar?c.subAr:c.sub}</span><i>↗</i></div></a>)}
   <a className="approved-work-cta" data-component-id="H04.06" href={`/${locale}/work`}><p>{ar?"لنصنع شيئاً رائعاً معاً.":"Let's build something great together."}</p><span>{ar?"عرض كل الأعمال":"View All Work"} ↗</span></a>
  </div>
 </section>;
}

export function ApprovedClosingCta({locale}:{locale:Locale}){
 const ar=locale==="ar";
 return <section className="approved-closing-cta" data-section-id="H05" data-testid="approved-h05">
  <ReferenceCrop slot="home.cta.building" crop={{x:0,y:1263,w:1024,h:172}} className="approved-building-background" label={ar?"بيئة معمارية توضيحية لعلامة فارس":"Illustrative Fares-branded architectural environment"}/>
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
  <a className="approved-footer-locale" data-component-id="H06.04" href={ar?"/en":"/ar"}><Globe2/><span>{ar?"AR":"EN"}</span><ChevronDown/></a>
  <hr data-component-id="H06.05"/><small data-component-id="H06.06">© 2026 Fares Uniform. {ar?"جميع الحقوق محفوظة.":"All rights reserved."}</small><p data-component-id="H06.07">{ar?"زي موحّد لغدٍ أكثر إشراقاً.":"Uniforms for a brighter tomorrow."}</p>
 </footer>;
}

export function ApprovedHomepage({locale}:{locale:Locale}){
 return <main id="main-content" className="approved-homepage" data-testid="approved-homepage">
  <ApprovedHomepageHeader locale={locale}/><ApprovedHero locale={locale}/><ApprovedIndustries locale={locale}/>
  <ApprovedFeatureBand locale={locale}/><ApprovedSelectedWork locale={locale}/><ApprovedClosingCta locale={locale}/><ApprovedHomepageFooter locale={locale}/>
 </main>;
}
