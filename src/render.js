import { defaultData } from './templates.js';
export const WIDTH = 1500;
export const HEIGHT = 2100;
const dateFormatter = new Intl.DateTimeFormat('sr-Latn-RS',{day:'numeric',month:'long',year:'numeric'});
const families = { serif: 'Georgia, serif', sans: 'Arial, sans-serif', italic: 'Georgia, serif' };
function star(c, x, y, r) {
  c.beginPath();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2; const d = i % 2 ? r * .25 : r; i ? c.lineTo(x + Math.cos(a)*d,y + Math.sin(a)*d) : c.moveTo(x + Math.cos(a)*d,y + Math.sin(a)*d); }
  c.closePath(); c.fill();
}
function branch(c, x, y, angle, size) {
  c.save(); c.translate(x,y); c.rotate(angle); c.strokeStyle = c.fillStyle; c.lineWidth = 1;
  c.beginPath(); c.moveTo(0,0); c.bezierCurveTo(15,-size*.2,-18,-size*.6,0,-size); c.stroke();
  for(let i=0;i<7;i++) { const yy=-size*(.13+i*.115); const sign=i%2 ? -1 : 1; c.save(); c.translate(0,yy); c.rotate(sign*.65); c.globalAlpha=.4+(i%3)*.15; c.beginPath(); c.ellipse(sign*11,-12,8,21,-sign*.4,0,Math.PI*2); c.fill(); c.restore(); }
  c.restore();
}
function flower(c,x,y,r) {
  c.save(); c.translate(x,y); c.globalAlpha=.5;
  for(let i=0;i<6;i++) { c.rotate(Math.PI/3); c.beginPath(); c.ellipse(0,-r*.7,r*.45,r*.8,0,0,Math.PI*2); c.fill(); }
  c.globalAlpha=.8; c.beginPath();c.arc(0,0,r*.24,0,Math.PI*2);c.fill();c.restore();
}
function fit(c,text,y,maxWidth,font,size,min=14) {
  let n=size;c.font=`${font} ${n}px ${c.family}`;
  while(c.measureText(text).width>maxWidth && n>min) { n--; c.font=`${font} ${n}px ${c.family}`; }
  c.fillText(text,250,y,maxWidth);
}
function wrap(c,text,y,maxWidth,size,maxLines=4) {
  c.font=`${size}px ${c.family}`; const lines=[];
  for(const paragraph of String(text).split('\n')) {
    let line=''; for(const word of paragraph.split(/\s+/)) { const next=line ? `${line} ${word}` : word; if(c.measureText(next).width>maxWidth && line) { lines.push(line);line=word; } else line=next; } lines.push(line);
  }
  lines.slice(0,maxLines).forEach((line,i)=>c.fillText(line,250,y+i*size*1.55,maxWidth));
}
export function renderInvitation(canvas,template,data=defaultData(template),photo=null,width=500,options={}) {
  const background=data.bg||template.bg;
  const lightness=color => {const rgb=color.match(/\w\w/g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
  const contrast=(a,b)=>(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  const bgLight=lightness(background),inkLight=lightness(template.ink);
  if(contrast(bgLight,inkLight)<4.5) template={...template,ink:bgLight>.35?'#344437':'#fff8eb'};
  if(background!==template.bg&&contrast(bgLight,lightness(template.accent))<1.5) template={...template,accent:bgLight>.35?'#8e9b81':'#d1c3a5'};
  const height=Math.round(width*1.4);
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  const c=canvas.getContext('2d',{alpha:false});
  c.save();
  c.setTransform(width/500,0,0,width/500,0,0);
  c.family=families[data.font]||families.serif;
  c.fillStyle=data.bg||template.bg;c.fillRect(0,0,500,700);
  c.fillStyle=template.accent;
  switch(template.style) {
    case 'botanical':
      branch(c,30,220,-.28,215);branch(c,0,140,.5,165);branch(c,468,683,2.5,190);branch(c,498,592,3.5,150);break;
    case 'floral':
      branch(c,30,185,-.4,165);branch(c,485,680,2.9,180);
      flower(c,40,58,38);flower(c,79,26,24);flower(c,480,636,38);flower(c,440,674,26);break;
    case 'sun':
      c.save();c.globalAlpha=.7;c.beginPath();c.arc(250,92,27,Math.PI,0);c.fill();c.lineWidth=2;
      for(let i=0;i<9;i++) { const a=Math.PI+i*Math.PI/8;c.beginPath();c.moveTo(250+Math.cos(a)*36,92+Math.sin(a)*36);c.lineTo(250+Math.cos(a)*46,92+Math.sin(a)*46);c.strokeStyle=template.accent;c.stroke(); } c.restore();
      c.globalAlpha=.18;c.beginPath();c.ellipse(15,620,120,90,-.5,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(500,625,110,140,.6,0,Math.PI*2);c.fill();c.globalAlpha=1;break;
    case 'night':
      c.strokeStyle=template.accent;c.lineWidth=.65;c.strokeRect(25,25,450,650);c.globalAlpha=.65;
      for(let i=0;i<28;i++) { star(c,35+(i*97)%430,38+(i*53)%110,i%4===0 ? 6 : 2);star(c,35+(i*77)%430,587+(i*43)% 70,i%4===0 ? 5 : 2); }c.globalAlpha=1;break;
    case 'confetti':
      for(let i=0;i<45;i++){c.save();c.globalAlpha=.25+(i%3)*.15;c.translate(22+(i*71)%456,20+(i*37)%100);c.rotate(i); i%3===0 ? star(c,0,0,5) : c.fillRect(0,0,3,8);c.restore();}
      for(let i=0;i<20;i++){c.globalAlpha=.35;star(c,20+(i*79)%460,612+(i*39)%65,3);}c.globalAlpha=1;break;
    case 'moon':
      c.save();c.translate(250,80);c.rotate(-.3);c.beginPath();c.arc(0,0,28,.5,Math.PI*1.9);c.quadraticCurveTo(-9,0,25,14);c.fill();c.restore();
      for(let i=0;i<12;i++)star(c,50+(i*83)%400,25+(i*29)%100,i%2 ? 3 : 6);branch(c,10,670,.3,125);branch(c,490,680,-.3,125);break;
    case 'bow':
      c.strokeStyle=template.accent;c.lineWidth=2.5;c.beginPath();c.moveTo(250,89);c.bezierCurveTo(170,15,175,125,250,89);c.bezierCurveTo(325,20,330,123,250,89);c.bezierCurveTo(245,116,230,137,230,148);c.moveTo(250,89);c.bezierCurveTo(263,118,275,130,273,147);c.stroke();
      c.globalAlpha=.4;c.lineWidth=1;c.strokeRect(27,27,446,646);c.globalAlpha=1;break;
    default:
      c.strokeStyle=template.accent;c.lineWidth=.7;c.beginPath();c.roundRect(38,30,424,640,210);c.stroke();star(c,250,88,10);
  }
  if(options.decorationsOnly){c.restore();return canvas;}
  c.fillStyle=template.ink;c.textAlign='center';c.textBaseline='middle';
  const withPhoto=!!photo; const top=withPhoto ? 155 : 185;
  fit(c,String(data.title||''),top,350,'normal',15,11);
  if(withPhoto) {
    const px=250,py=285,r=86;
    c.save();c.beginPath();c.arc(px,py,r,0,Math.PI*2);c.clip();
    const scale=Math.max(r*2/photo.width,r*2/photo.height)*Number(data.photoZoom)/100;
    const iw=photo.width*scale,ih=photo.height*scale;
    const left=px-r-(iw-r*2)*Number(data.photoX)/100;
    const upper=py-r-(ih-r*2)*Number(data.photoY)/100;
    c.drawImage(photo,left,upper,iw,ih);c.restore();
    c.strokeStyle=template.accent;c.lineWidth=.7;c.beginPath();c.arc(px,py,r+5,0,Math.PI*2);c.stroke();
  }
  const nameY=withPhoto ? 416 : 274;
  fit(c,String(data.names||''),nameY,385,data.font==='italic' ? 'italic' : 'normal',template.category==='wedding' ? 47 : 43,20);
  if(template.category==='first') { c.font=`italic 23px ${c.family}`;c.fillText('1. rođendan',250,nameY+44); }
  if(template.category==='eighteen') { c.font=`italic 25px ${c.family}`;c.fillText('18. rođendan',250,nameY+44); }
  const lineY=withPhoto ? 474 : 363;
  c.strokeStyle=template.accent;c.lineWidth=.7;c.beginPath();c.moveTo(213,lineY);c.lineTo(287,lineY);c.stroke();
  wrap(c,data.note||'',lineY+30,370,13,withPhoto ? 3 : 4);
  const dateY=withPhoto ? 580 : 502;
  let formatted='';
  if(data.date) {const date=new Date(`${data.date}T12:00:00`);if(!isNaN(date))formatted=dateFormatter.format(date);}
  fit(c,[formatted,data.time ? `u ${data.time}` : ''].filter(Boolean).join('  ·  '),dateY,375,'normal',16,11);
  fit(c,data.location||'',dateY+34,360,'normal',13,10);
  c.font=`italic 12px ${c.family}`;c.fillText('Radujemo se vašem dolasku',250,withPhoto ? 655 : 613);
  c.restore();
  return canvas;
}
