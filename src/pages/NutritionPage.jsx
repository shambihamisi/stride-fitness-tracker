import React, { useEffect, useMemo, useState } from "react";
import MySideBar from "../components/MySideBar";
import { Droplet, Apple, Plus, Trash2, Undo2, Flame, CupSoda, Sandwich, Utensils, ChefHat, Clock } from "lucide-react";


const BRAND = { red: "#b3242b", redDark: "#8f1d22", bg: "#f8f8f8", blue: "#2563eb" };
const LS_HYDRATION = "stride.hydration.v1";
const LS_NUTRITION = "stride.nutrition.v1";


const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const fmtTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ---------- SVG Ring ---------- */
function Ring({ size = 120, stroke = 10, pct = 0, track = "#e5e7eb", color = BRAND.blue }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = Math.max(0, Math.min(100, pct)) / 100 * c;
  return (
    <svg width={size} height={size} className="block">
      <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
      <circle
        cx={size/2}
        cy={size/2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
    </svg>
  );
}

/* ---------- Page ---------- */
export default function NutritionPage() {
  /* --------------------- HYDRATION --------- */
  const [goalL, setGoalL] = useState(2.5);
  const [hydration, setHydration] = useState(() => {
    try {
      const all = JSON.parse(localStorage.getItem(LS_HYDRATION) || "{}");
      return all[todayKey()] || [];
    } catch { return []; }
  });

  const totalMl = useMemo(() => hydration.reduce((a, h) => a + h.ml, 0), [hydration]);
  const pct = Math.min(100, Math.round((totalMl / (goalL * 1000)) * 100));
  const remaining = Math.max(0, goalL * 1000 - totalMl);
  function persistHydration(next) {
    const k = todayKey();
    const all = JSON.parse(localStorage.getItem(LS_HYDRATION) || "{}");
    all[k] = next;
    localStorage.setItem(LS_HYDRATION, JSON.stringify(all));
  }
  function addWater(ml) {
    const entry = { id: crypto.randomUUID(), ml, ts: Date.now() };
    const next = [entry, ...hydration];
    setHydration(next);
    persistHydration(next);
  }
  function removeWater(id) {
    const next = hydration.filter((x) => x.id !== id);
    setHydration(next);
    persistHydration(next);
  }
  function undoLastWater() {
    const [, ...rest] = hydration;
    setHydration(rest);
    persistHydration(rest);
  }

  /* ----------------------- NUTRITION -------------------------------- */
  const [goals, setGoals] = useState({ kcal: 2200, protein: 150, carbs: 240, fat: 70 });
  const [meals, setMeals] = useState(() => {
    try {
      const all = JSON.parse(localStorage.getItem(LS_NUTRITION) || "{}");
      return all[todayKey()] || [];
    } catch { return []; }
  });
  function persistMeals(next) {
    const k = todayKey();
    const all = JSON.parse(localStorage.getItem(LS_NUTRITION) || "{}");
    all[k] = next;
    localStorage.setItem(LS_NUTRITION, JSON.stringify(all));
  }
  function addMeal(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim() || "Meal";
    const kcal = Number(f.get("kcal") || 0);
    const protein = Number(f.get("protein") || 0);
    const carbs = Number(f.get("carbs") || 0);
    const fat = Number(f.get("fat") || 0);
    const entry = { id: crypto.randomUUID(), name, kcal, protein, carbs, fat, ts: Date.now() };
    const next = [entry, ...meals];
    setMeals(next);
    persistMeals(next);
    e.currentTarget.reset();
  }
  function removeMeal(id) {
    const next = meals.filter((m) => m.id !== id);
    setMeals(next);
    persistMeals(next);
  }
  function quickAddMeal({ name, kcal, protein, carbs, fat }) {
  const entry = { id: crypto.randomUUID(), name, kcal, protein, carbs, fat, ts: Date.now() };
  const next = [entry, ...meals];
  setMeals(next);
  persistMeals(next);
}

  const tally = useMemo(() => ({
    kcal: meals.reduce((a, m) => a + m.kcal, 0),
    protein: meals.reduce((a, m) => a + m.protein, 0),
    carbs: meals.reduce((a, m) => a + m.carbs, 0),
    fat: meals.reduce((a, m) => a + m.fat, 0),
  }), [meals]);

  const kpct = Math.min(100, Math.round((tally.kcal / goals.kcal) * 100));
  const ppct = Math.min(100, Math.round((tally.protein / goals.protein) * 100));
  const cpct = Math.min(100, Math.round((tally.carbs / goals.carbs) * 100));
  const fpct = Math.min(100, Math.round((tally.fat / goals.fat) * 100));


  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">

      <MySideBar />

      {/* Content */}
      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-semibold text-primary">Nutrition</h1>
        <p className="text-sm text-black mb-6">Plan your meals and hydration</p>

        {/* Nutrition */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* NUTRITION COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* Daily Summary */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Apple className="w-7 h-7 text-primary" />
                    <div>
                      <div className="text-xl font-semibold">Today's Nutrition</div>
                      <div className="text-sm text-black">{todayKey()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-black">Calories</div>
                    <div className="text-2xl font-bold">{tally.kcal}/{goals.kcal} kcal</div>
                  </div>
                </div>

                {/* Progress bars */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Calories", val: kpct, rail: "#e5e7eb", fill: BRAND.red },
                    { label: "Protein (g)", val: ppct, rail: "#e5e7eb", fill: "#16a34a" },
                    { label: "Carbs (g)", val: cpct, rail: "#e5e7eb", fill: "#2563eb" },
                    { label: "Fat (g)", val: fpct, rail: "#e5e7eb", fill: "#f59e0b" },
                  ].map((b) => (
                    <div key={b.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-black">{b.label}</span>
                        <span className="text-black">{b.val}%</span>
                      </div>
                      <div className="relative h-2 rounded-full" style={{ background: b.rail }}>
                        <div className="absolute left-0 top-0 h-full rounded-full transition-all" style={{ width: `${b.val}%`, background: b.fill }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Add Meal */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-primary" /> Log Meal
                </h3>
                <form onSubmit={addMeal} className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <input name="name" placeholder="Meal name (e.g., Chicken Bowl)" className="md:col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  <input name="kcal" placeholder="Kcal" inputMode="numeric" className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  <input name="protein" placeholder="Protein (g)" inputMode="numeric" className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  <input name="carbs" placeholder="Carbs (g)" inputMode="numeric" className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  <input name="fat" placeholder="Fat (g)" inputMode="numeric" className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  <button type="submit" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </form>
              </div>
            </section>

            {/* Meal Log */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Sandwich className="w-5 h-5 text-primary" /> Today's Meals</h3>
                {meals.length === 0 ? (
                  <p className="text-sm text-black">No meals logged yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {meals.map((m) => (
                      <li key={m.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                        <div>
                          <div className="font-medium">{m.name}</div>
                          <div className="text-xs text-black">{fmtTime(m.ts)}</div>
                          <div className="text-xs text-black mt-1">
                            {m.kcal} kcal · P {m.protein}g · C {m.carbs}g · F {m.fat}g
                          </div>
                        </div>
                        <button onClick={() => removeMeal(m.id)} className="p-2 rounded-md hover:bg-gray-100 text-black" aria-label="Delete meal">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* Suggested Recipes */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-14">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-primary" /> Nutritious Recipes
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* Recipe 1 */}
                <article className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition">
                    <div className="flex items-start justify-between gap-3">
                    <div>
                        <h4 className="font-semibold">Grilled Chicken Bowl</h4>
                        <div className="flex items-center gap-2 text-xs text-black mt-0.5">
                        <Flame className="w-3.5 h-3.5" /> High protein
                        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 25 min</span>
                        </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">~520 kcal</span>
                    </div>
                    <ul className="text-xs text-black mt-2 space-y-1">
                    <li>Protein 45g • Carbs 55g • Fat 15g</li>
                    <li>Chicken, brown rice, avocado, tomatoes, greens</li>
                    </ul>
                    <div className="mt-3 flex justify-end">
                    <button
                        onClick={() => quickAddMeal({ name: "Grilled Chicken Bowl", kcal: 520, protein: 45, carbs: 55, fat: 15 })}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-3 py-1.5 rounded-md text-sm"
                    >
                        <Plus className="w-4 h-4" /> Quick add
                    </button>
                    </div>
                </article>

                {/* Recipe 2 */}
                <article className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition">
                    <div className="flex items-start justify-between gap-3">
                    <div>
                        <h4 className="font-semibold">Salmon & Quinoa Plate</h4>
                        <div className="flex items-center gap-2 text-xs text-black mt-0.5">
                        <Flame className="w-3.5 h-3.5" /> Balanced
                        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 20 min</span>
                        </div>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">~610 kcal</span>
                    </div>
                    <ul className="text-xs text-black mt-2 space-y-1">
                    <li>Protein 40g • Carbs 50g • Fat 22g</li>
                    <li>Salmon, quinoa, broccoli, olive oil, lemon</li>
                    </ul>
                    <div className="mt-3 flex justify-end">
                    <button
                        onClick={() => quickAddMeal({ name: "Salmon & Quinoa Plate", kcal: 610, protein: 40, carbs: 50, fat: 22 })}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-3 py-1.5 rounded-md text-sm"
                    >
                        <Plus className="w-4 h-4" /> Quick add
                    </button>
                    </div>
                </article>

                {/* Recipe 3 */}
                <article className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition">
                    <div className="flex items-start justify-between gap-3">
                    <div>
                        <h4 className="font-semibold">Tofu Veggie Stir-fry</h4>
                        <div className="flex items-center gap-2 text-xs text-black mt-0.5">
                        <Flame className="w-3.5 h-3.5" /> Plant-based
                        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 18 min</span>
                        </div>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">~480 kcal</span>
                    </div>
                    <ul className="text-xs text-blackmt-2 space-y-1">
                    <li>Protein 28g • Carbs 60g • Fat 12g</li>
                    <li>Tofu, bell peppers, snap peas, soy-ginger sauce</li>
                    </ul>
                    <div className="mt-3 flex justify-end">
                    <button
                        onClick={() => quickAddMeal({ name: "Tofu Veggie Stir-fry", kcal: 480, protein: 28, carbs: 60, fat: 12 })}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-3 py-1.5 rounded-md text-sm"
                    >
                        <Plus className="w-4 h-4" /> Quick add
                    </button>
                    </div>
                </article>
                </div>
            </div>
            </section>

          </div>


          {/* HYDRATION COLUMN */}
          <div className="space-y-6">
            {/* Hydration Ring */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h3 className="font-semibold">Hydration</h3>
                <p className="text-sm text-black mb-4">Stay hydrated today</p>

                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Ring size={140} stroke={10} pct={pct} color={BRAND.blue} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Droplet className="w-5 h-5 text-[color:#2563eb] mb-1" />
                      <div className="text-xl font-bold">{(totalMl/1000).toFixed(1)}L</div>
                      <div className="text-[11px] text-black">of {goalL}L</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-black">{(remaining/1000).toFixed(1)}L to go</div>
                </div>
              </div>
            </section>

            {/* Quick Add */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h4 className="font-semibold mb-3">Quick Add</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => addWater(250)} className="h-14 rounded-xl bg-[#2563eb] text-white flex flex-col items-center justify-center hover:opacity-90">
                    <CupSoda className="w-4 h-4 mb-1" /> +250ml <span className="text-[11px] opacity-80">Glass</span>
                  </button>
                  <button onClick={() => addWater(500)} className="h-14 rounded-xl bg-[#2563eb] text-white flex flex-col items-center justify-center hover:opacity-90">
                    <CupSoda className="w-4 h-4 mb-1" /> +500ml <span className="text-[11px] opacity-80">Bottle</span>
                  </button>
                  <button onClick={() => addWater(750)} className="h-14 rounded-xl border border-gray-300 text-gray-800 flex flex-col items-center justify-center hover:bg-gray-50">
                    <CupSoda className="w-4 h-4 mb-1" /> +750ml <span className="text-[11px] text-black">Large</span>
                  </button>
                  <button onClick={() => addWater(1000)} className="h-14 rounded-xl border border-gray-300 text-gray-800 flex flex-col items-center justify-center hover:bg-gray-50">
                    <CupSoda className="w-4 h-4 mb-1" /> +1L <span className="text-[11px] text-black">Mega</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Log + Undo */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Today's Log</h4>
                  {hydration.length > 0 && (
                    <button onClick={undoLastWater} className="text-sm text-red-500 inline-flex items-center gap-1 hover:underline">
                      <Undo2 className="w-4 h-4" /> Undo
                    </button>
                  )}
                </div>

                {hydration.length === 0 ? (
                  <p className="text-sm text-black">No drinks logged yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {hydration.map((h) => (
                      <li key={h.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Droplet className="w-4 h-4 text-[color:#2563eb]" />
                          <div>
                            <div className="font-medium">{h.ml}ml</div>
                            <div className="text-xs text-black">{fmtTime(h.ts)}</div>
                          </div>
                        </div>
                        <button onClick={() => removeWater(h.id)} className="p-2 rounded-md hover:bg-gray-100 text-black" aria-label="Remove">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* Tips */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h4 className="font-semibold mb-2">Hydration Tips</h4>
                <ul className="text-sm text-black list-disc ml-5 space-y-1">
                  <li>Start your day with a glass of water</li>
                  <li>Drink before you feel thirsty</li>
                  <li>Keep a water bottle nearby</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
