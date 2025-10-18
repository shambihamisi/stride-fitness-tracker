import React, { useEffect, useMemo, useState } from "react";
import MySidebar from "../components/MySideBar";
import {
  Search, Dumbbell, Plus, Trash2, Loader2, Footprints,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
} from "recharts";


const BRAND = { red: "primary", redDark: "secondary", bg: "#f8f8f8" };
const LS_KEY = "stride.activity.workouts.v1";

/*  Muscle list (WGER ids) */
const MUSCLES = [
  { id: "", label: "All muscles" },
  { id: 1, label: "Biceps" },
  { id: 2, label: "Triceps" },
  { id: 3, label: "Shoulders" },
  { id: 4, label: "Back" },
  { id: 5, label: "Chest" },
  { id: 8, label: "Abs" },
];

/* --------------------  API token setup -------------------- */
const WGER_TOKEN = import.meta.env.VITE_WGER_API_KEY || "";
const wgerHeaders = () => (WGER_TOKEN ? { Authorization: `Token ${WGER_TOKEN}` } : {});

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

function loadWorkouts() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}
function saveWorkouts(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

/* total lifted by day */
function totalsByDay(workouts) {
  const map = new Map();
  for (const w of workouts) {
    const day = new Date(w.timestamp);
    day.setHours(0, 0, 0, 0);
    const key = day.toISOString();
    const total = w.items.reduce((acc, i) => acc + (i.sets||0)*(i.reps||0)*(i.weight||0), 0);
    map.set(key, (map.get(key)||0) + total);
  }
  const out = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-i);
    const key = d.toISOString();
    out.push({ name: d.toLocaleDateString(undefined, { month:"short", day:"numeric" }), total: Math.round(map.get(key)||0) });
  }
  return out;
}


export default function ActivityPage() {
  const [stepsToday] = useState(3420);
  const goal = 8000;
  const stepsPct = Math.min(100, Math.round((stepsToday/goal)*100));

  /* history + builder */
  const [history, setHistory] = useState(() => loadWorkouts());
  const chartData = useMemo(() => totalsByDay(history), [history]);

  const [builder, setBuilder] = useState({ name: "Custom Workout", items: [] });
  const addCustom = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("c_name")||"").trim();
    const sets = Number(f.get("c_sets")||0);
    const reps = Number(f.get("c_reps")||0);
    const weight = Number(f.get("c_weight")||0);
    if (!name) { alert("Enter exercise name"); return; }
    setBuilder(b => ({ ...b, items: [...b.items, { exerciseId: null, name, sets, reps, weight }] }));
    e.currentTarget.reset();
  };
  const updateItem = (idx, field, val) =>
    setBuilder(b => {
      const items = b.items.slice();
      items[idx] = { ...items[idx], [field]: field === "name" ? val : Number(val || 0) };
      return { ...b, items };
    });
  const removeItem = (idx) => setBuilder(b => ({ ...b, items: b.items.filter((_,i)=>i!==idx) }));
  const saveWorkout = () => {
    if (!builder.items.length) { alert("Add at least one exercise"); return; }
    const entry = {
      id: crypto.randomUUID(),
      name: builder.name || "Workout",
      timestamp: Date.now(),
      items: builder.items.map(i => ({
        ...i,
        sets: Number(i.sets||0), reps: Number(i.reps||0), weight: Number(i.weight||0)
      })),
    };
    const next = [entry, ...history];
    setHistory(next); saveWorkouts(next);
    setBuilder({ name: "Custom Workout", items: [] });
  };

  /* exercise search (WGER) */
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState("");
  const [exResults, setExResults] = useState([]);
  const [loadingEx, setLoadingEx] = useState(false);
  const [exErr, setExErr] = useState("");

  useEffect(() => {
  let cancelled = false;

  async function fetchAll(url) {
    const out = [];
    let next = url;
    let page = 0;
    const MAX_PAGES = 5; // safety cap

    while (next && page < MAX_PAGES) {
      const res = await fetch(next, {
        headers: {
          Accept: "application/json",
          ...wgerHeaders(),
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const results = Array.isArray(data?.results) ? data.results : [];
      out.push(...results);
      next = data?.next || null;
      page++;
    }
    return out;
  }

  async function run() {
    try {
      setLoadingEx(true);
      setExErr("");

      const base = "https://wger.de/api/v2/exercise/";
      // Build the common query. Start broad; we’ll tighten later if needed.
      const common = new URLSearchParams({
        language: "2",     // English
        limit: "25",       // initial page size; pagination will grab more
      });
      if (muscle) common.set("muscle", String(muscle));

      const tried = [];

      // Strategy 1: search + status=2 (approved)
      const s1 = new URLSearchParams(common);
      if (query) s1.set("search", query);
      s1.set("status", "2");
      tried.push({ label: "search+status", url: `${base}?${s1.toString()}` });
      let results = await fetchAll(`${base}?${s1.toString()}`);

      // Strategy 2: name__icontains + status=2
      if (results.length === 0 && query) {
        const s2 = new URLSearchParams(common);
        s2.set("status", "2");
        tried.push({ label: "icontains+status", url: `${base}?${s2.toString()}&name__icontains=${encodeURIComponent(query)}` });
        results = await fetchAll(`${base}?${s2.toString()}&name__icontains=${encodeURIComponent(query)}`);
      }

      // Strategy 3: search (no status)
      if (results.length === 0) {
        const s3 = new URLSearchParams(common);
        if (query) s3.set("search", query);
        tried.push({ label: "search (no status)", url: `${base}?${s3.toString()}` });
        results = await fetchAll(`${base}?${s3.toString()}`);
      }

      // Strategy 4: name__icontains (no status)
      if (results.length === 0 && query) {
        const s4 = new URLSearchParams(common);
        tried.push({ label: "icontains (no status)", url: `${base}?${s4.toString()}&name__icontains=${encodeURIComponent(query)}` });
        results = await fetchAll(`${base}?${s4.toString()}&name__icontains=${encodeURIComponent(query)}`);
      }

      // Strategy 5: muscle only (no query), broaden limit
      if (results.length === 0 && !query) {
        const s5 = new URLSearchParams({ language: "2", limit: "50" });
        if (muscle) s5.set("muscle", String(muscle));
        tried.push({ label: "muscle only (broad)", url: `${base}?${s5.toString()}` });
        results = await fetchAll(`${base}?${s5.toString()}`);
      }

      // Normalize and cap for UI
      const cleaned = results
        .filter((r) => r?.name)
        .map((r) => ({ id: r.id, name: r.name }))
        .slice(0, 100);

      if (!cancelled) {
        setExResults(cleaned);

        // Optional: small debug note in the UI (remove if you don’t want it)
        if (cleaned.length === 0) {
          setExErr(
            "No exercises found. Try a shorter term (e.g., 'press'), remove the muscle filter, or check your network."
          );
        } else {
          // If you want to see which strategy matched, uncomment:
          // console.log("WGER search matched:", tried[tried.length - 1]);
        }
      }
    } catch (e) {
      if (!cancelled) {
        setExErr(
          WGER_TOKEN
            ? "Could not load exercises. Please try again."
            : "Could not load exercises. If you have a token, add VITE_WGER_API_KEY to .env.local."
        );
      }
    } finally {
      if (!cancelled) setLoadingEx(false);
    }
  }

  run();
  return () => {
    cancelled = true;
  };
}, [query, muscle]);


  /* history filter */
  const [histQuery, setHistQuery] = useState("");
  const filteredHistory = useMemo(() => {
    if (!histQuery) return history;
    const q = histQuery.toLowerCase();
    return history.filter(h => h.name.toLowerCase().includes(q) || h.items.some(i => i.name.toLowerCase().includes(q)));
  }, [history, histQuery]);

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <MySidebar />

      <main className="flex-1">
        {/* Header */}
        <header className="px-6 md:px-10 pt-8">
          <h1 className="text-2xl font-semibold text-[#b3242b]">Activity</h1>
          <p className="text-sm text-black">Track your session</p>
        </header>

        <div className="p-6 md:p-10 grid gap-6">
          {/* Steps summary */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold">{stepsToday.toLocaleString()}</div>
                  <div className="text-sm text-black">steps today</div>
                </div>
                <Footprints className="w-8 h-8 text-primary" />
              </div>
              <div className="mt-5">
                <div className="relative h-2 rounded-full bg-gray-200">
                  <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${stepsPct}%`, background: BRAND.red }} />
                </div>
                <div className="flex justify-between text-xs text-black mt-2">
                  <span>2.1km</span><span>{stepsPct}%</span><span>1710 Calories</span>
                </div>
              </div>
            </div>
          </section>

          {/* This Week chart */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-6">
              <h3 className="font-semibold mb-4">This Week</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="fillRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={BRAND.red} stopOpacity={0.6}/>
                        <stop offset="95%" stopColor={BRAND.red} stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="total" stroke={BRAND.red} fill="url(#fillRed)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Log Workout + Exercise Search */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Log Workout */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className="font-semibold">Log Workout</h3>
                  <input
                    type="text"
                    value={builder.name}
                    onChange={(e)=>setBuilder(b=>({...b, name:e.target.value}))}
                    placeholder="Session name"
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                  />
                </div>

                {/* Custom exercise form */}
                <form onSubmit={addCustom} className="flex flex-wrap items-end gap-2 border border-gray-200 rounded-lg p-3 mb-4">
                  <div className="flex-1 min-w-[180px]">
                    <label className="block text-xs text-black mb-1">Exercise name</label>
                    <input name="c_name" placeholder="e.g., Bench Press" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"/>
                  </div>
                  <div>
                    <label className="block text-xs text-black mb-1">Sets</label>
                    <input name="c_sets" inputMode="numeric" className="w-20 border border-gray-300 rounded px-2 py-1.5 text-sm"/>
                  </div>
                  <div>
                    <label className="block text-xs text-black mb-1">Reps</label>
                    <input name="c_reps" inputMode="numeric" className="w-20 border border-gray-300 rounded px-2 py-1.5 text-sm"/>
                  </div>
                  <div>
                    <label className="block text-xs text-black mb-1">Kg</label>
                    <input name="c_weight" inputMode="decimal" className="w-24 border border-gray-300 rounded px-2 py-1.5 text-sm"/>
                  </div>
                  <button type="submit" className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-3 py-2 rounded-md">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </form>

                {/* Selected exercises list */}
                {builder.items.length === 0 && (
                  <p className="text-sm text-black mb-3">No exercises yet. Add custom above or choose from the search on the right.</p>
                )}
                <div className="space-y-3">
                  {builder.items.map((it, idx)=>(
                    <div key={idx} className="flex flex-wrap items-center gap-2 border border-gray-200 rounded-lg p-3">
                      <Dumbbell className="w-5 h-5 text-primary"/>
                      <input
                        value={it.name}
                        onChange={(e)=>updateItem(idx,"name",e.target.value)}
                        className="flex-1 min-w-[160px] border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                      <input
                        value={it.sets} placeholder="Sets" inputMode="numeric"
                        onChange={(e)=>updateItem(idx,"sets",e.target.value)}
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                      <input
                        value={it.reps} placeholder="Reps" inputMode="numeric"
                        onChange={(e)=>updateItem(idx,"reps",e.target.value)}
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                      <input
                        value={it.weight} placeholder="Kg" inputMode="decimal"
                        onChange={(e)=>updateItem(idx,"weight",e.target.value)}
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                      <button onClick={()=>removeItem(idx)} className="p-2 rounded-md hover:bg-gray-100 text-black" aria-label="Remove">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <button onClick={saveWorkout} className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md">
                    <Plus className="w-4 h-4"/> Save Workout
                  </button>
                </div>
              </div>
            </div>

            {/* Exercise search (WGER) */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h3 className="font-semibold mb-3">Choose Exercises</h3>

                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black"/>
                    <input
                      value={query} onChange={(e)=>setQuery(e.target.value)}
                      placeholder="Search by name"
                      className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm"
                    />
                  </div>
                  <select
                    value={muscle} onChange={(e)=>setMuscle(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    {MUSCLES.map(m=>(
                      <option key={m.label} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                </div>

                {loadingEx && (
                  <div className="flex items-center gap-2 text-sm text-black">
                    <Loader2 className="w-4 h-4 animate-spin"/> Loading…
                  </div>
                )}
                {exErr && !loadingEx && <div className="text-sm text-red-600">{exErr}</div>}
                {!loadingEx && !exErr && exResults.length === 0 && (
                  <div className="text-sm text-black">
                    No exercises found. Try a shorter name (e.g., “press”) or clear the muscle filter.
                  </div>
                )}

                <ul className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {exResults.map(ex=>(
                    <li key={ex.id} className="flex items-center justify-between gap-2 border border-gray-200 rounded-lg px-3 py-2">
                      <span className="text-sm truncate">{ex.name}</span>
                      <button
                        onClick={()=>setBuilder(b=>({...b, items:[...b.items, { exerciseId: ex.id, name: ex.name, sets:"", reps:"", weight:""}]}))}
                        className="inline-flex items-center gap-1 text-[color:#b3242b] hover:text-[color:#8f1d22] text-sm"
                      >
                        <Plus className="w-4 h-4"/> Add
                      </button>
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-[11px] text-gray-400">Data source: wger.de</p>
              </div>
            </div>
          </section>

          {/* History */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="font-semibold">Recent Activities</h3>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-black"/>
                  <input
                    value={histQuery} onChange={(e)=>setHistQuery(e.target.value)}
                    placeholder="Filter by name or exercise"
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                  />
                </div>
              </div>

              {filteredHistory.length === 0 ? (
                <p className="text-sm text-black">No workouts logged yet.</p>
              ) : (
                <ul className="space-y-2">
                  {filteredHistory.map(w=>(
                    <li key={w.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                      <div>
                        <div className="font-medium">{w.name}</div>
                        <div className="text-xs text-black">{fmtDate(w.timestamp)}</div>
                        <div className="text-xs text-black mt-1">
                          {w.items.map((i, idx)=>(
                            <span key={idx} className="mr-2">{i.name} — {i.sets}×{i.reps}@{i.weight}kg</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-700">
                          {w.items.reduce((acc,i)=>acc+i.sets*i.reps*i.weight,0).toLocaleString()} kg
                        </div>
                        <div className="text-xs text-black">total volume</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
