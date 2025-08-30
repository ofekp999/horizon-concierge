"use client";
import React from "react";

type Answers = {
  budgetPerPersonMin?: number;
  budgetPerPersonMax?: number;
  kosherRequired?: boolean;
  kosherLevel?: "any"|"kosher"|"mehadrin"|"halavi"|"basari"|"none";
  withKids?: boolean;
  kidsAges?: number[];
  withPets?: boolean;
  cuisines?: string[];
  atmosphere?: "quiet"|"lively";
  wantBar?: boolean | null;
  minRating?: number;
  city?: string;
};

type Restaurant = {
  id: string;
  name: string;
  address?: string;
  price_per_person_min?: number;
  price_per_person_max?: number;
  kosher_status?: string | null;
  kids_friendly?: boolean | null;
  pets_friendly?: boolean | null;
  cuisines?: string[] | null;
  atmosphere?: string | null;
  has_bar?: boolean | null;
  cafe_bistro?: boolean | null;
  rating?: number | null;
  booking_url?: string | null;
  cover_image_url?: string | null;
};

const Q = { Budget:0, Kosher:1, Kids:2, Pets:3, Cuisine:4, Atmosphere:5, BarOrCafe:6, MinRating:7, Done:8 } as const;
type Step = (typeof Q)[keyof typeof Q];

export default function Page() {
  const [step, setStep] = React.useState<Step>(Q.Budget);
  const [answers, setAnswers] = React.useState<Answers>({ minRating: 4 });
  const [out, setOut] = React.useState<Restaurant[]>([]);
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const send = (patch: Partial<Answers>) => { setAnswers(prev => ({ ...prev, ...patch })); setStep(s => (s+1) as Step); };

  async function fetchMatches(reset = false) {
    setLoading(true);
    const res = await fetch("/api/match", { method: "POST", body: JSON.stringify({ answers, page: reset ? 0 : page }) });
    const json = await res.json();
    setLoading(false);
    if (reset) setOut(json.results || []); else setOut(prev => [...prev, ...(json.results || [])]);
    setPage(json.nextPage || 1);
  }

  const pill = "px-4 py-2 rounded-full text-sm border border-white/20";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-zinc-200">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">Horizon</div>
          <button className="w-7 h-7 rounded-full border flex items-center justify-center">?</button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4">
        <section className="py-8 text-center">
          <h1 className="text-2xl font-semibold leading-tight">Hi, I’m your personal<br/>concierge.</h1>
          <p className="mt-2 text-sm text-zinc-600">Not random suggestions. Real matches for your taste, mood and time.</p>
          <p className="mt-6 text-sm text-zinc-500">Not the most popular,<br/>the most <span className="text-violet-600 font-medium">you</span>.</p>
        </section>

        <section className="pb-28">
          <div className="text-center text-xs text-zinc-500 mb-3">Tip: זה רק היכרות בסיסית. תמיד אפשר להוסיף פרטים בהמשך.</div>
          <div className="space-y-4">

            {step >= Q.Budget && (
              <div className="flex gap-2">
                <div className="shrink-0 w-8 h-8 rounded-full bg-violet-100"/>
                <div className="bg-white border rounded-2xl px-3 py-2 shadow-sm">מה הטווח התקציבי שלך לאדם?</div>
              </div>
            )}
            {step === Q.Budget && (
              <div className="flex justify-end">
                <div className="bg-violet-600 text-white rounded-2xl px-3 py-2 max-w-[75%]">
                  <div className="flex flex-wrap gap-2">
                    {[60,80,100,120,150,200].map(n => (
                      <button key={n} className={pill} onClick={()=>send({ budgetPerPersonMin: 0, budgetPerPersonMax: n })}>עד {n}₪</button>
                    ))}
                    <button className={pill} onClick={()=>send({ budgetPerPersonMin: 0, budgetPerPersonMax: 999 })}>לא משנה</button>
                  </div>
                </div>
              </div>
            )}

            {step >= Q.Kosher && (
              <div className="flex gap-2">
                <div className="shrink-0 w-8 h-8 rounded-full bg-violet-100"/>
                <div className="bg-white border rounded-2xl px-3 py-2 shadow-sm">האם אתם זקוקים למסעדה כשרה?</div>
              </div>
            )}
            {step === Q.Kosher && (
              <div className="flex justify-end">
                <div className="bg-violet-600 text-white rounded-2xl px-3 py-2 max-w-[75%]">
                  <div className="flex gap-2">
                    <button className={pill} onClick={()=>send({ kosherRequired: true, kosherLevel:'any' })}>כן</button>
                    <button className={pill} onClick={()=>send({ kosherRequired: false, kosherLevel:'none' })}>לא</button>
                    <button className={pill} onClick={()=>send({ kosherRequired: true, kosherLevel:'mehadrin' })}>מהדרין</button>
                  </div>
                </div>
              </div>
            )}

            {step >= Q.Kids && (
              <div className="flex gap-2">
                <div className="shrink-0 w-8 h-8 rounded-full bg-violet-100"/>
                <div className="bg-white border rounded-2xl px-3 py-2 shadow-sm">האם תגיעו עם ילדים?</div>
              </div>
            )}
            {step === Q.Kids && (
              <div className="flex justify-end">
                <div className="bg-violet-600 text-white rounded-2xl px-3 py-2 max-w-[75%]">
                  <div className="flex gap-2">
                    <button className={pill} onClick={()=>send({ withKids: true })}>כן</button>
                    <button className={pill} onClick={()=>send({ withKids: false })}>לא</button>
                  </div>
                </div>
              </div>
            )}

            {step >= Q.Pets && (
              <div className="flex gap-2">
                <div className="shrink-0 w-8 h-8 rounded-full bg-violet-100"/>
                <div className="bg-white border rounded-2xl px-3 py-2 shadow-sm">האם אתם מגיעים עם חיות מחמד?</div>
              </div>
            )}
            {step === Q.Pets && (
              <div className="flex justify-end">
                <div className="bg-violet-600 text-white rounded-2xl px-3 py-2 max-w-[75%]">
                  <div className="flex gap-2">
                    <button className={pill} onClick={()=>send({ withPets: true })}>כן</button>
                    <button className={pill} onClick={()=>send({ withPets: false })}>לא</button>
                  </div>
                </div>
              </div>
            )}

            {step >= Q.Cuisine && (
              <div className="flex gap-2">
                <div className="shrink-0 w-8 h-8 rounded-full bg-violet-100"/>
                <div className="bg-white border rounded-2xl px-3 py-2 shadow-sm">איזה סוג מטבח אתם מעדיפים? (עד 3)</div>
              </div>
            )}
            {step === Q.Cuisine && <CuisinePicker onDone={(c)=>send({ cuisines: c })} />}

            {step >= Q.Atmosphere && (
              <div className="flex gap-2"><div className="shrink-0 w-8 h-8 rounded-full bg-violet-100"/><div className="bg-white border rounded-2xl px-3 py-2 shadow-sm">אווירה ורעש?</div></div>
            )}
            {step === Q.Atmosphere && (
              <div className="flex justify-end"><div className="bg-violet-600 text-white rounded-2xl px-3 py-2 max-w-[75%]"><div className="flex gap-2">
                <button className={pill} onClick={()=>send({ atmosphere:'quiet' })}>שקט ואינטימי</button>
                <button className={pill} onClick={()=>send({ atmosphere:'lively' })}>תוסס ורועש</button>
                <button className={pill} onClick={()=>send({ atmosphere: undefined })}>לא משנה</button>
              </div></div></div>
            )}

            {step >= Q.BarOrCafe && (
              <div className="flex gap-2"><div className="shrink-0 w-8 h-8 rounded-full bg-violet-100"/><div className="bg-white border rounded-2xl px-3 py-2 shadow-sm">בר/קפה?</div></div>
            )}
            {step === Q.BarOrCafe && (
              <div className="flex justify-end"><div className="bg-violet-600 text-white rounded-2xl px-3 py-2 max-w-[75%]"><div className="flex gap-2">
                <button className={pill} onClick={()=>send({ wantBar: true })}>חשוב בר/אלכוהול</button>
                <button className={pill} onClick={()=>send({ wantBar: false })}>קפה/ביסטרו</button>
                <button className={pill} onClick={()=>send({ wantBar: null })}>לא משנה</button>
              </div></div></div>
            )}

            {step >= Q.MinRating && (
              <div className="flex gap-2"><div className="shrink-0 w-8 h-8 rounded-full bg-violet-100"/><div className="bg-white border rounded-2xl px-3 py-2 shadow-sm">דירוג מינימלי? (מומלץ 4+)</div></div>
            )}
            {step === Q.MinRating && (
              <div className="flex justify-end"><div className="bg-violet-600 text-white rounded-2xl px-3 py-2 max-w-[75%]"><div className="flex gap-2">
                {[3.5,4,4.5].map(r => <button key={r} className={pill} onClick={()=>send({ minRating: r })}>{r}+</button>)}
                <button className={pill} onClick={()=>send({ minRating: 0 })}>לא משנה</button>
              </div></div></div>
            )}

            {step >= Q.Done && (
              <>
                <div className="flex gap-2"><div className="shrink-0 w-8 h-8 rounded-full bg-violet-100"/><div className="bg-white border rounded-2xl px-3 py-2 shadow-sm">מוכן! הנה שלוש התאמות שמתאימות לך.</div></div>
                <div className="grid gap-3">{out.map(r => <Card key={r.id} r={r} />)}</div>
                <div className="mt-4 flex justify-center">
                  <button disabled={loading} onClick={()=>fetchMatches(false)} className="px-4 py-2 rounded-full border bg-white disabled:opacity-50">עוד הצעות</button>
                </div>
              </>
            )}

            {step === Q.MinRating && (
              <div className="flex justify-center mt-3">
                <button className="rounded-2xl bg-violet-600 text-white py-3 px-4" onClick={()=>{ setStep(Q.Done); fetchMatches(true); }}>
                  מצא מסעדות
                </button>
              </div>
            )}

          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white/90 border-t border-zinc-200">
        <div className="max-w-md mx-auto px-8 py-3 flex items-center justify-between text-zinc-500">
          <span>🏠</span><span>🔎</span><span>🔖</span><span>👤</span>
        </div>
      </nav>
    </div>
  );
}

function CuisinePicker({ onDone }: { onDone: (c: string[]) => void }) {
  const options = ['איטלקי','אסייתי','יפני','סיני','טאפאס','ים תיכוני','בשרי','דגים','צמחוני','טבעוני','מתוקים','מאפייה','גלידריה'];
  const [sel, setSel] = React.useState<string[]>([]);
  const toggle = (x: string) => setSel(s => s.includes(x) ? s.filter(v=>v!==x) : (s.length < 3 ? [...s, x] : s));
  const pill = "px-4 py-2 rounded-full text-sm border border-white/20";
  const map: Record<string,string> = {'איטלקי':'italian','אסייתי':'asian','יפני':'japanese','סיני':'chinese','טאפאס':'tapas','ים תיכוני':'mediterranean','בשרי':'meat','דגים':'seafood','צמחוני':'vegetarian','טבעוןי':'vegan','מתוקים':'dessert','מאפייה':'bakery','גלידריה':'icecream'};
  return (
    <div className="flex justify-end">
      <div className="bg-violet-600 text-white rounded-2xl px-3 py-2 max-w-[85%]">
        <div className="flex flex-wrap gap-2">
          {options.map(o => (
            <button key={o} className={`${pill} ${sel.includes(o) ? 'bg-white/10' : ''}`} onClick={()=>toggle(o)}>{o}</button>
          ))}
        </div>
        <div className="mt-2 text-right">
          <button className="px-4 py-2 rounded-full bg-white text-violet-700" onClick={()=>onDone(sel.map(x=>map[x]||x))}>המשך</button>
        </div>
      </div>
    </div>
  );
}

function Card({ r }: { r: Restaurant }) {
  return (
    <a href={r.booking_url || '#'} target={r.booking_url ? '_blank' : undefined} className="block border rounded-2xl overflow-hidden bg-white shadow-sm">
      {r.cover_image_url && (<img src={r.cover_image_url} alt={r.name} className="w-full h-28 object-cover" />)}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{r.name}</h3>
          <span className="text-xs text-zinc-500">{r.rating ? `${r.rating}★` : '—'}</span>
        </div>
        <p className="text-sm text-zinc-600 line-clamp-2">{r.address}</p>
        <div className="mt-2 flex gap-2">
          {(r.price_per_person_min!=null && r.price_per_person_max!=null) && (<span className="text-xs bg-zinc-100 px-2 py-1 rounded-full">₪{r.price_per_person_min}-{r.price_per_person_max}</span>)}
          {(r.kosher_status && r.kosher_status!=='none') && (<span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">כשר</span>)}
        </div>
      </div>
    </a>
  );
}
