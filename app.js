(()=>{'use strict';
const url='https://dlvcfaplkidgcsvyiiai.supabase.co';
// Public browser key, not a service_role key. RLS enforces access.
const key='sb_publishable_vd7Fkm2Ze8WJPo7XBEPPSA_zTl8NKMN';
const $=s=>document.querySelector(s);let user=null,tx=[],goals=[];
const status=(s,err=false)=>{$('#status').textContent=s;$('#status').classList.toggle('error',err)};
if(!window.supabase){status('Anmeldung konnte nicht geladen werden. Bitte Internetverbindung prüfen.',true);return}
const db=window.supabase.createClient(url,key);
const money=c=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(Number(c)/100);
function cents(raw){let s=String(raw).trim().replace(/\s/g,'').replace(',','.');if(!/^\d+(\.\d{1,2})?$/.test(s))throw Error('Bitte einen gültigen Betrag eingeben.');let n=Math.round(Number(s)*100);if(!Number.isSafeInteger(n))throw Error('Betrag zu groß.');return n}
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const balance=()=>tx.reduce((n,t)=>n+(t.kind==='income'?1:-1)*Number(t.amount_cents),0);
function rows(items){return items.length?items.map(t=>`<div class="row"><div><strong>${safe(t.category)}</strong><br><small>${safe(t.booked_on)} · ${safe(t.note)}</small></div><strong>${t.kind==='income'?'+':'−'}${money(t.amount_cents)}</strong></div>`).join(''):'<p class="muted">Noch keine Buchungen.</p>'}
function render(){$('#balance').textContent=money(balance());$('#recent').innerHTML=rows(tx.slice(0,5));$('#txList').innerHTML=rows(tx);$('#goalList').innerHTML=goals.length?goals.map(g=>`<div class="row"><div style="flex:1"><strong>${safe(g.title)}</strong><p class="muted">${money(g.saved_cents)} von ${money(g.target_cents)}</p><progress max="${Number(g.target_cents)}" value="${Math.min(Number(g.saved_cents),Number(g.target_cents))}"></progress></div></div>`).join(''):'<p class="muted">Noch keine Sparziele.</p>'}
async function refresh(){if(!user)return;let [a,b]=await Promise.all([db.from('transactions').select('id,amount_cents,kind,category,note,booked_on').eq('user_id',user.id).order('booked_on',{ascending:false}).limit(200),db.from('savings_goals').select('id,title,target_cents,saved_cents').eq('user_id',user.id).order('created_at',{ascending:false}).limit(100)]);if(a.error||b.error)throw Error(a.error?.message||b.error?.message);tx=a.data;goals=b.data;render()}
async function showSession(session){user=session?.user??null;$('#loginBox').hidden=!!user;$('#private').hidden=!user;$('#email').textContent=user?.email||'';if(user)await refresh();else{tx=[];goals=[]}}
db.auth.getSession().then(({data,error})=>error?status(error.message,true):showSession(data.session).catch(e=>status(e.message,true)));
db.auth.onAuthStateChange((_event,s)=>setTimeout(()=>showSession(s).catch(e=>status(e.message,true)),0));
$('#login').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const {error}=await db.auth.signInWithPassword({email:f.get('email'),password:f.get('password')});status(error?error.message:'Anmeldung erfolgreich.',!!error)};
$('#logout').onclick=async()=>{let {error}=await db.auth.signOut();status(error?error.message:'Abgemeldet.',!!error)};
document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('selected',x===b));document.querySelectorAll('.page').forEach(p=>p.hidden=p.id!==b.dataset.page)});
const localDate=()=>{let d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};$('#txForm [name=date]').value=localDate();
$('#txForm').onsubmit=async e=>{e.preventDefault();try{let f=new FormData(e.target),n=cents(f.get('amount'));if(!n)throw Error('Betrag muss größer als 0 sein.');let {error}=await db.from('transactions').insert({user_id:user.id,amount_cents:n,kind:f.get('kind'),category:f.get('category'),note:f.get('note'),booked_on:f.get('date')});if(error)throw error;e.target.reset();$('#txForm [name=date]').value=localDate();await refresh();status('Buchung gespeichert.')}catch(err){status(err.message,true)}};
$('#goalForm').onsubmit=async e=>{e.preventDefault();try{let f=new FormData(e.target),target=cents(f.get('target')),saved=cents(f.get('saved'));if(!target)throw Error('Zielbetrag muss größer als 0 sein.');let {error}=await db.from('savings_goals').insert({user_id:user.id,title:f.get('title'),target_cents:target,saved_cents:saved,priority:'medium'});if(error)throw error;e.target.reset();await refresh();status('Sparziel gespeichert.')}catch(err){status(err.message,true)}};
$('#calc').onclick=()=>{try{let cost=cents($('#wish').value),available=balance()-goals.reduce((s,g)=>s+Number(g.saved_cents),0);$('#result').textContent=cost<=available?`Rechnerisch möglich. Übrig: ${money(available-cost)}.`:`Noch nicht: Es fehlen rechnerisch ${money(cost-available)}.`}catch(err){status(err.message,true)}};
})();
