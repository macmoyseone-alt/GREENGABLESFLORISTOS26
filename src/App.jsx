import React, { useState, useEffect, useCallback, useRef } from "react";
// GREEN GABLES FLORIST & FARM — OPERATIONS PLATFORM V12

// Global polish — hover states, transitions, focus rings
const GlobalStyles = () => {
  useEffect(() => {
    const id = "gg-global";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      button { transition: all 0.15s ease; }
      button:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-0.5px); }
      button:active:not(:disabled) { transform: translateY(0); filter: brightness(0.96); }
      input:focus, select:focus, textarea:focus { outline: none; border-color: #C4A265 !important; box-shadow: 0 0 0 2px rgba(196,162,101,0.15); }
      ::selection { background: rgba(196,162,101,0.25); }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      @keyframes slideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
      .gg-fade { animation: fadeIn 0.2s ease; }
      .gg-pulse { animation: pulse 1.5s ease-in-out infinite; }
      .gg-slide { animation: slideIn 0.25s ease; }
    `;
    document.head.appendChild(style);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);
  return null;
};
const useWindowWidth = () => {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  return w;
};
const MOB = 768; // mobile breakpoint

const B = {
  forest: "#2D4A3E", forestL: "#3A5F50", sage: "#8B9E8B", sageL: "#A8B8A8",
  cream: "#F5F0E8", creamD: "#E8E0D4", gold: "#C4A265", goldL: "#D4B87A",
  white: "#FDFCFA", text: "#1A1A1A", muted: "#6B6B6B",
  red: "#C44A4A", redL: "#F5E8E8", green: "#4A8B5C", greenL: "#E8F5EC",
  blue: "#4A6AC4", blueL: "#E8EDF5",
};
// Reusable style fragments — edit once, updates everywhere
const S = {
  page: { padding: "20px 28px" },
  flex: { display: "flex", gap: 6 },
  flexC: { display: "flex", alignItems: "center", gap: 6 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 10px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 10px" },
  grid21: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0 10px" },
  sm: { fontSize: 10, color: B.muted },
  xs: { fontSize: 11, color: B.muted },
  label: { fontSize: 12, fontWeight: 600, marginBottom: 8, color: B.forest },
  labelLg: { fontSize: 12, fontWeight: 700, color: B.forest, marginBottom: 8 },
  rmBtn: { background: "none", border: "none", cursor: "pointer", color: B.red, fontSize: 10 },
  right: { textAlign: "right" },
  center: { textAlign: "center" },
  row: { display: "flex", justifyContent: "space-between", marginBottom: 4 },
  checkRow: { display: "flex", alignItems: "center", gap: 4, fontSize: 11, marginBottom: 6 },
  link: { display: "block", padding: "6px 10px", borderRadius: 6, fontSize: 11, color: B.forest, textDecoration: "none", fontWeight: 500 },
};

const TIERS = {
  full: { label: "Full Service", min: 4500, cogsRate: 0.45, color: B.forest },
  mid: { label: "Mid Service", min: 2500, cogsRate: 0.45, color: B.gold },
  partial: { label: "Partial Service", min: 1800, cogsRate: 0.50, color: B.sage },
};

const ADDONS = [
  { id: "rehearsal", label: "Rehearsal Dinner Florals", min: 400, max: 800 },
  { id: "shower", label: "Bridal Shower / Sprinkle", min: 300, max: 600 },
  { id: "extra_bouquet", label: "Addl Bridesmaid Bouquet", min: 75, max: 120 },
  { id: "flower_girl", label: "Flower Girl Accessories", min: 45, max: 85 },
  { id: "welcome", label: "Welcome / Sweetheart Table", min: 150, max: 350 },
  { id: "cake", label: "Cake Flowers", min: 100, max: 300 },
];

const MONTHLY_OVERHEAD_BASE = [
  { name: "Rent", amount: 1400 }, { name: "National Grid", amount: 167 },
  { name: "Verizon", amount: 256.46 }, { name: "Progressive (Vehicle/Ins)", amount: 272.72 },
  { name: "Business Insurance", amount: 121 }, { name: "Website/Tech", amount: 119.99 },
  { name: "Bank Loan", amount: 253.26 }, { name: "Garbage", amount: 150 },
  { name: "Thaneys", amount: 200 }, { name: "Groceries/Food", amount: 300 },
];
const MONTHLY_BASE_TOTAL = MONTHLY_OVERHEAD_BASE.reduce((s, e) => s + e.amount, 0);
const ANNUAL_OVERHEAD = Math.round(MONTHLY_BASE_TOTAL * 12);

const DEFAULT_SOPS = [
  { id: "SOP-01", title: "Shop Daily Open & Close", trigger: "every_studio_day", owner: "Lindsay", items: ["Unlock shop, lights, HVAC", "Check cooler temps & water levels", "Review today's production list", "Clean workspace before starting", "End of day: sweep, trash, lock cooler", "Secure shop, lights off, lock"] },
  { id: "SOP-02", title: "Flower Receiving & Conditioning", trigger: "delivery_day", owner: "Lindsay", items: ["Inspect all flowers on arrival", "Remove damaged stems, photograph for credit", "Strip foliage below waterline", "Recut stems at angle", "Clean buckets, fresh water + flower food", "Store in cooler, hydrangea/roses get extra care"] },
  { id: "SOP-03", title: "Design Studio Organization", trigger: "weekly", owner: "Lindsay", items: ["Inventory vessel stock", "Clean and organize tool stations", "Check mechanic supplies (foam, wire, tape)", "Restock ribbon and wrap station", "Clear scrap/waste from studio"] },
  { id: "SOP-04", title: "Production Day Protocol", trigger: "event_build", owner: "Lindsay", items: ["Pull recipes and inspiration for event", "Soak foam, prep chicken wire/frogs, tape grids", "Label vessels by design type", "Build: Large installs → Centerpieces → Bouquets → Bouts", "Quality check: size, fullness, clean stems, mechanics", "Photograph finished pieces"] },
  { id: "SOP-05", title: "Cold Storage Management", trigger: "in_season_daily", owner: "Lindsay", items: ["Check cooler temperature (34-38°F)", "Inspect water clarity in all buckets", "Remove wilting stems", "Rotate stock: oldest forward", "Log any waste"] },
  { id: "SOP-06", title: "Supply Inventory & Reorder", trigger: "weekly_pre_event", owner: "Lindsay", items: ["Audit: foam, wire, tape, pins, ribbon", "Check vessel inventory vs upcoming needs", "Order supplies with 2-week lead time", "Confirm wholesale flower orders placed", "Update inventory log"] },
  { id: "SOP-07", title: "Vehicle Load-Out", trigger: "event_day", owner: "Lindsay", items: ["Secure arrangements in boxes/crates", "Non-slip liners and padding", "Label by location: Ceremony, Cocktail, Reception", "Pack: tools, emergency kit, extra flowers, printed summary", "Load largest first, secure against shifting", "Temperature control check"] },
  { id: "SOP-08", title: "On-Site Setup & Install", trigger: "event_day", owner: "Lindsay", items: ["Check in with venue coordinator", "Confirm placement plan", "Install ceremony florals first", "Place reception florals", "Adjust for spacing, sightlines, movement", "Secure outdoor pieces with weights if needed", "Final walkthrough: fluff, wipe vessels, photograph"] },
  { id: "SOP-09", title: "Teardown & Return", trigger: "event_teardown", owner: "Crew", items: ["Arrive at contracted teardown time", "Remove florals efficiently and discreetly", "Separate: rentals, company inventory, client keepsakes", "Confirm all vessels and structures accounted", "Note damaged or missing items", "Dispose of florals respectfully or donate"] },
  { id: "SOP-10", title: "Shop Cleanup & Reset", trigger: "post_event", owner: "All", items: ["Clean and sanitize all vessels and tools", "Store mechanics properly", "Restock supplies", "Upload event photos", "Note what worked and improvements", "Close out event file"] },
];

const WORKFLOWS = [
  { id: "A", name: "Inquiry to Booked", entry: "Qualified inquiry", exit: "Signed contract + deposit" },
  { id: "B", name: "Design to Order", entry: "Event booked", exit: "Order placed, confirmed" },
  { id: "C", name: "Prep Week", entry: "7 days before event", exit: "Studio production-ready" },
  { id: "D", name: "Build Days", entry: "Production day", exit: "All pieces built, packed, loaded" },
  { id: "E", name: "Delivery & Install", entry: "Event day", exit: "Install complete, teardown done" },
  { id: "F", name: "Loop Closure", entry: "Post-event", exit: "Studio reset, financials logged" },
];

const EVENT_MILESTONES = [
  { daysOut: 21, label: "Place wholesale order", icon: "🌸", sop: "B" },
  { daysOut: 14, label: "Confirm order received", icon: "✓", sop: "B" },
  { daysOut: 7, label: "Finalize design + confirm venue logistics", icon: "📋", sop: "C" },
  { daysOut: 3, label: "Begin production / build days", icon: "🔨", sop: "D" },
  { daysOut: 2, label: "Prep day — studio ready", icon: "📦", sop: "C" },
  { daysOut: 1, label: "Vehicle load-out", icon: "🚐", sop: "D" },
  { daysOut: 0, label: "Event day — install", icon: "★", sop: "E" },
  { daysOut: -1, label: "Post-event closure", icon: "🔄", sop: "F" },
];

// Maps milestone SOP codes to checklist templates for auto-assignment
const MILESTONE_TEMPLATE_MAP = {
  B: "Conditioning/Receiving",
  C: "Load-Out",
  D: "Studio Production",
  E: "Setup/Install",
  F: "Strike/Teardown",
};

function getEventMilestones(events, rangeDays) {
  const today = new Date(); today.setHours(0,0,0,0);
  const milestones = [];
  (events || []).forEach(ev => {
    if (!ev.date || ev.stage === "closed" || ev.stage === "cancelled") return;
    const evDate = new Date(ev.date + "T12:00:00"); evDate.setHours(0,0,0,0);
    const daysUntil = Math.round((evDate - today) / 864e5);
    EVENT_MILESTONES.forEach(m => {
      if (daysUntil !== m.daysOut) return;
      milestones.push({ ...m, event: ev, daysUntil, urgent: m.daysOut <= 1 });
    });
  });
  return milestones.sort((a, b) => a.daysOut - b.daysOut);
}

const ESTIMATE_ITEMS = [
  "Bridal Bouquet", "Bridesmaid Bouquet", "Boutonnieres", "Corsages", "Flower Girl",
  "Ceremony Arch", "Ceremony Aisle", "Reception Centerpiece", "Head Table", "Sweetheart Table",
  "Cocktail Arrangement", "Welcome/Escort Table", "Cake Flowers", "Other",
];

const WORK_TYPES = ["Studio Production", "Design", "Conditioning", "Prep/Mechanics", "Load Out", "Setup/Install", "Teardown", "Cleanup/Reset", "Consultation", "Delivery", "Admin", "Other"];

const TASK_CATEGORIES = [
  { key: "production", label: "Shop / Production", color: "#4A8B5C", bg: "#E8F5EC", icon: "✿", rhythm: "Daily during season. Receiving, conditioning, builds, cleanup." },
  { key: "bizdev", label: "Business Dev", color: "#C4A265", bg: "#F5EDD8", icon: "◎", rhythm: "2-3x/week. Follow up leads, send proposals, book consultations." },
  { key: "content", label: "Content / Visibility", color: "#4A6AC4", bg: "#E8EDF5", icon: "▣", rhythm: "2x/week minimum. Post, photograph, tell the story." },
  { key: "admin", label: "Admin / Finance", color: "#6B6B6B", bg: "#F0EFED", icon: "▧", rhythm: "Weekly. Invoicing, bookkeeping, overhead review." },
  { key: "community", label: "Community / Network", color: "#7B68EE", bg: "#EDEBF8", icon: "⬡", rhythm: "1-2x/month. Vendor intros, venue check-ins, styled shoots." },
  { key: "infrastructure", label: "Infrastructure", color: "#2D7D9A", bg: "#E0EFF5", icon: "◈", rhythm: "As needed. Systems, property, tools, process improvement." },
];

const FLOWER_CATEGORIES = ["Focal", "Secondary", "Filler", "Greenery", "Accent", "Dried/Preserved", "Garden"];
const FLOWER_SEASONS = ["Year-Round", "Spring", "Summer", "Fall", "Winter"];
const LEAD_SOURCES = ["Instagram", "Website", "Referral (Client)", "Referral (Vendor)", "Venue Partner", "WeddingWire/Knot", "Google", "Word of Mouth", "Returning Client", "Other"];
const EVENT_STAGES = [
  { key: "inquiry", label: "Inquiry", color: "#4A6AC4" },
  { key: "consultation", label: "Consultation", color: "#7B68EE" },
  { key: "proposal", label: "Proposal Sent", color: "#C4A265" },
  { key: "booked", label: "Booked", color: "#4A8B5C" },
  { key: "design", label: "Design Phase", color: "#2D4A3E" },
  { key: "production", label: "Production", color: "#8B6914" },
  { key: "complete", label: "Complete", color: "#8B9E8B" },
  { key: "closed", label: "Closed", color: "#6B6B6B" },
  { key: "cancelled", label: "Cancelled", color: "#C44A4A" },
];

const ASSIGNMENT_ROLES = ["Lead Designer", "Setup Crew", "Strike Crew", "Production Assistant", "Delivery/Transport", "Consultation Lead", "General Support"];

const DEFAULT_CHECKLIST_TEMPLATES = {
  "Setup/Install": [
    { title: "Confirm venue access time and contact", sop: "E" },
    { title: "Load vehicle per load-out sheet", sop: "D" },
    { title: "Verify all containers, mechanics, tools packed", sop: "D" },
    { title: "Arrive on-site, check in with coordinator", sop: "E" },
    { title: "Walk venue and confirm placement locations", sop: "E" },
    { title: "Set up ceremony pieces first", sop: "E" },
    { title: "Set up cocktail/reception pieces", sop: "E" },
    { title: "Place centerpieces per table map", sop: "E" },
    { title: "Final walkthrough with coordinator", sop: "E" },
    { title: "Photo-document all installations", sop: "E" },
    { title: "Remove all tools, packaging, debris", sop: "E" },
  ],
  "Strike/Teardown": [
    { title: "Confirm strike time with coordinator", sop: "F" },
    { title: "Collect all rentals per inventory sheet", sop: "F" },
    { title: "Photograph any damage before moving", sop: "F" },
    { title: "Pack all containers and mechanics", sop: "F" },
    { title: "Load vehicle", sop: "F" },
    { title: "Final venue walkthrough, leave clean", sop: "F" },
    { title: "Return to studio, unload", sop: "F" },
    { title: "Log return inventory count", sop: "F" },
  ],
  "Studio Production": [
    { title: "Review recipe sheets for event", sop: "D" },
    { title: "Pull containers and mechanics from storage", sop: "D" },
    { title: "Prep all mechanics (foam, tape, wire)", sop: "D" },
    { title: "Build pieces per recipe, working order", sop: "D" },
    { title: "Quality check each piece against spec", sop: "D" },
    { title: "Wrap/protect finished pieces for transport", sop: "D" },
    { title: "Cold store overnight if applicable", sop: "D" },
    { title: "Clean studio, reset workspace", sop: "D" },
  ],
  "Conditioning/Receiving": [
    { title: "Inspect shipment against order manifest", sop: "B" },
    { title: "Document any shortages or damage", sop: "B" },
    { title: "Strip lower leaves, cut stems at angle", sop: "B" },
    { title: "Treat with flower food per species", sop: "B" },
    { title: "Sort into buckets by variety", sop: "B" },
    { title: "Label each bucket (variety, date, event)", sop: "B" },
    { title: "Place in cold storage at 34-38°F", sop: "B" },
    { title: "Update inventory count sheet", sop: "B" },
  ],
  "Consultation": [
    { title: "Review client inquiry form and notes", sop: "A" },
    { title: "Prepare mood board / inspiration images", sop: "A" },
    { title: "Review venue logistics and restrictions", sop: "A" },
    { title: "Walk through service tiers and pricing", sop: "A" },
    { title: "Discuss timeline, setup/strike windows", sop: "A" },
    { title: "Take notes on client preferences", sop: "A" },
    { title: "Confirm next steps and proposal timeline", sop: "A" },
    { title: "Send follow-up email within 24 hours", sop: "A" },
  ],
  "Load-Out": [
    { title: "Print load-out sheet from job planner", sop: "D" },
    { title: "Stage all event pieces in load order", sop: "D" },
    { title: "Check off each item against load sheet", sop: "D" },
    { title: "Secure all pieces in vehicle", sop: "D" },
    { title: "Pack toolkit (scissors, wire, tape, pins)", sop: "D" },
    { title: "Verify emergency supplies (extra stems, zip ties)", sop: "D" },
    { title: "Confirm GPS route and arrival time", sop: "D" },
  ],
  "Post-Event Closure": [
    { title: "Log all hours worked per person", sop: "F" },
    { title: "Log actual flower costs vs estimate", sop: "F" },
    { title: "Log actual supply/rental costs", sop: "F" },
    { title: "Calculate actual margin", sop: "F" },
    { title: "Collect final payment if outstanding", sop: "F" },
    { title: "Request photos from photographer", sop: "F" },
    { title: "Request review/testimonial from client", sop: "F" },
    { title: "Archive event file", sop: "F" },
  ],
  "Shop Maintenance": [
    { title: "Sweep and mop studio floor", sop: "G" },
    { title: "Clean and sanitize work surfaces", sop: "G" },
    { title: "Empty trash and compost", sop: "G" },
    { title: "Wipe down cooler, check temp", sop: "G" },
    { title: "Restock supplies at stations", sop: "G" },
    { title: "Inventory check on low-stock items", sop: "G" },
  ],
};

// Live data helpers — reads user-edited data, falls back to defaults
const getSops = (data) => data.sops && data.sops.length > 0 ? data.sops : DEFAULT_SOPS;
const getTemplates = (data) => {
  const custom = data.checklistTemplates;
  if (custom && Object.keys(custom).length > 0) return custom;
  return DEFAULT_CHECKLIST_TEMPLATES;
};


const SEED_EVENTS_2026 = [
  { client: "Margaret Beiter", date: "2026-05-01", venue: "Harro East", tier: "partial", low: 2000, high: 2300 },
  { client: "ELIZA", date: "2026-05-16", venue: "Terrace on Delaware", tier: "full", low: 7500, high: 10000 },
  { client: "Gizem Oz", date: "2026-05-24", venue: "Ravenwood", tier: "full", low: 3500, high: 4200 },
  { client: "Kylie Lyons", date: "2026-06-12", venue: "Pomona", tier: "partial", low: 1200, high: 1400 },
  { client: "Tess Breitung", date: "2026-06-13", venue: "Strathallen", tier: "full", low: 6400, high: 7400 },
  { client: "Emma Burke", date: "2026-06-20", venue: "Mill Creek", tier: "mid", low: 3100, high: 3600 },
  { client: "ELIZA", date: "2026-06-21", venue: "Diamonds on Seneca", tier: "full", low: 9500, high: 12000 },
  { client: "Jessica Wolfe", date: "2026-06-26", venue: "Arbor at the Port", tier: "mid", low: 2500, high: 3100 },
  { client: "Rachel Lyons", date: "2026-06-28", venue: "Shadow Lake", tier: "mid", low: 2500, high: 3000 },
  { client: "Miranda Cain", date: "2026-08-01", venue: "Hotel Canandaigua", tier: "full", low: 4000, high: 4600 },
  { client: "Kelsey Shanahan", date: "2026-08-15", venue: "Hotel Canandaigua", tier: "full", low: 3800, high: 4500 },
  { client: "Lexie Beyer", date: "2026-08-29", venue: "Colloca Estate Winery", tier: "full", low: 3800, high: 4600 },
  { client: "Danica Aquitania", date: "2026-09-05", venue: "Shadow Lake", tier: "mid", low: 3000, high: 4000 },
  { client: "Kelly Oliver", date: "2026-09-19", venue: "Bristol, NY Private Res", tier: "partial", low: 2500, high: 2800 },
  { client: "Amanda Scheg", date: "2026-09-19", venue: "The Highline", tier: "full", low: 3500, high: 4000 },
  { client: "Alessaundra Haag", date: "2026-09-26", venue: "Strathallen", tier: "mid", low: 1500, high: 1800 },
  { client: "Ella Rundberg", date: "2026-09-27", venue: "Pomona", tier: "partial", low: 700, high: 800 },
  { client: "Emily Brand", date: "2026-10-02", venue: "Wells Estate", tier: "partial", low: 1500, high: 1600 },
  { client: "Kristen Carvel", date: "2026-10-03", venue: "Deerfield", tier: "full", low: 3700, high: 4200 },
  { client: "Sara Eisenhauer", date: "2026-10-10", venue: "Deerfield", tier: "partial", low: 800, high: 900 },
  { client: "Abby Cleveland", date: "2026-10-17", venue: "Eastman House/Max Bistro", tier: "full", low: 4500, high: 5000 },
  { client: "Alexis Glaza", date: "2026-11-07", venue: "Arbor Midtown", tier: "partial", low: 1400, high: 1600 },
];

const DEFAULT_BUDGET = { yearlyTarget: 140000, targetMargin: 55 };
const STARTER_VENUES = [
  { name: "Shadow Lake", address: "1850 Five Mile Line Rd, Penfield, NY 14526", contactName: "Ryan Carbone", contactPhone: "585-248-5374", contactEmail: "", setupAccess: "Vendor access varies by event", loadInNotes: "Clubhouse: service entrance. Garden Tent: back path access. Coordinate with coordinator.", waterAccess: "Kitchen access for water", maxCapacity: 220, preferredVendor: true, notes: "Clubhouse (220 cap) or Garden Tent (160 cap). Waterside views. Spring-fed lake from 1920s quarry. Arts & Crafts decor. Favorite venue. Lake Room (100), Woodlands Room (60) also available. Outdoor ceremony site near lake." },
  { name: "Strathallen Hotel & Spa", address: "550 East Ave, Rochester, NY 14607", contactName: "", contactPhone: "585-461-5010", contactEmail: "", setupAccess: "Coordinate with events team", loadInNotes: "Loading dock off East Ave. Elevator to 9th floor ballroom.", waterAccess: "Hotel kitchen", maxCapacity: 200, preferredVendor: false, notes: "9th floor glass-walled ballroom with city views. Neighborhood of the Arts. Modern/sophisticated. Rooftop option. Complimentary centerpieces and linens included in package. Near George Eastman Museum." },
  { name: "Hotel Canandaigua", address: "770 S Main St, Canandaigua, NY 14424", contactName: "", contactPhone: "585-394-7800", contactEmail: "", setupAccess: "Coordinate with events team", loadInNotes: "Lake-side property. Check loading access with coordinator.", waterAccess: "Hotel facilities", maxCapacity: 200, preferredVendor: false, notes: "Lakefront on Canandaigua Lake. Modern design. Named #1 resort hotel in NY by Travel + Leisure. The Rose Tavern on-site. Pier for portraits. Boathouse backdrop." },
  { name: "Deerfield Country Club", address: "100 Craig Hill Dr, Brockport, NY 14420", contactName: "", contactPhone: "585-392-8080", contactEmail: "", setupAccess: "Typically morning of", loadInNotes: "Ground level access. Loading near service entrance.", waterAccess: "Kitchen access", maxCapacity: 260, preferredVendor: false, notes: "The Courtyard (260 cap, 4000 sq ft, floor-to-ceiling windows) and The Overlook. Modern rustic style. Pond and pine trees for portraits. Outdoor arbor ceremony site. Large boulders and water features in landscaping." },
  { name: "Harro East", address: "400 Andrews St, Rochester, NY 14604", contactName: "", contactPhone: "585-232-3730", contactEmail: "", setupAccess: "Coordinate with venue", loadInNotes: "Street-level loading. Downtown Rochester.", waterAccess: "On-site kitchen", maxCapacity: 300, preferredVendor: false, notes: "Historic ballroom. Industrial/urban vibe. Downtown Rochester." },
  { name: "Pomona", address: "Pittsford, NY", contactName: "", contactPhone: "", contactEmail: "", setupAccess: "", loadInNotes: "", waterAccess: "", maxCapacity: 0, preferredVendor: false, notes: "Pittsford area venue. Confirm details with coordinator." },
  { name: "Mill Creek", address: "", contactName: "", contactPhone: "", contactEmail: "", setupAccess: "", loadInNotes: "", waterAccess: "", maxCapacity: 0, preferredVendor: false, notes: "" },
  { name: "Diamonds on Seneca", address: "Finger Lakes Region", contactName: "", contactPhone: "", contactEmail: "", setupAccess: "", loadInNotes: "", waterAccess: "", maxCapacity: 0, preferredVendor: false, notes: "High-value venue. Confirm load-in logistics." },
  { name: "Arbor at the Port", address: "", contactName: "", contactPhone: "", contactEmail: "", setupAccess: "", loadInNotes: "", waterAccess: "", maxCapacity: 0, preferredVendor: false, notes: "" },
  { name: "Colloca Estate Winery", address: "Sterling, NY", contactName: "", contactPhone: "", contactEmail: "", setupAccess: "", loadInNotes: "", waterAccess: "", maxCapacity: 0, preferredVendor: false, notes: "Winery estate. Travel time to be factored into logistics." },
  { name: "The Highline", address: "Rochester, NY", contactName: "", contactPhone: "", contactEmail: "", setupAccess: "", loadInNotes: "", waterAccess: "", maxCapacity: 0, preferredVendor: false, notes: "" },
  { name: "Wells Estate", address: "", contactName: "", contactPhone: "", contactEmail: "", setupAccess: "", loadInNotes: "", waterAccess: "", maxCapacity: 0, preferredVendor: false, notes: "Private estate." },
  { name: "Eastman House / Max Bistro", address: "900 East Ave, Rochester, NY 14607", contactName: "", contactPhone: "585-271-3361", contactEmail: "", setupAccess: "", loadInNotes: "", waterAccess: "", maxCapacity: 0, preferredVendor: false, notes: "George Eastman Museum. Historic mansion. West Garden for ceremony. Elegant and preserved." },
  { name: "Arbor Midtown", address: "Rochester, NY", contactName: "", contactPhone: "", contactEmail: "", setupAccess: "", loadInNotes: "", waterAccess: "", maxCapacity: 0, preferredVendor: false, notes: "" },
  { name: "Ravenwood", address: "", contactName: "", contactPhone: "", contactEmail: "", setupAccess: "", loadInNotes: "", waterAccess: "", maxCapacity: 0, preferredVendor: false, notes: "" },
  { name: "Terrace on Delaware", address: "Buffalo, NY area", contactName: "", contactPhone: "", contactEmail: "", setupAccess: "", loadInNotes: "", waterAccess: "", maxCapacity: 0, preferredVendor: false, notes: "ELIZA event. Confirm logistics and travel." },
];
const RENTAL_CATEGORIES = ["Vessels/Vases", "Arches/Structures", "Stands/Risers", "Candle Holders", "Signage/Frames", "Linens/Runners", "Lanterns", "Urns", "Pedestals", "Props", "Other"];
const STARTER_FLOWERS = [
  { name: "Standard Rose", category: "Focal", season: "Year-Round", wholesaleCost: 1.75, stemsPerBunch: 25, bunchCost: 43.75, color: "Various", supplier: "" },
  { name: "Garden Rose 'Juliet'", category: "Focal", season: "Spring", wholesaleCost: 5.50, stemsPerBunch: 12, bunchCost: 66, color: "Peach", supplier: "" },
  { name: "Garden Rose 'Patience'", category: "Focal", season: "Spring", wholesaleCost: 5.50, stemsPerBunch: 12, bunchCost: 66, color: "White/Ivory", supplier: "" },
  { name: "Garden Rose 'Keira'", category: "Focal", season: "Spring", wholesaleCost: 5.50, stemsPerBunch: 12, bunchCost: 66, color: "Blush Pink", supplier: "" },
  { name: "Spray Rose", category: "Secondary", season: "Year-Round", wholesaleCost: 1.50, stemsPerBunch: 10, bunchCost: 15, color: "Various", supplier: "" },
  { name: "Peony", category: "Focal", season: "Spring", wholesaleCost: 6.00, stemsPerBunch: 10, bunchCost: 60, color: "Various", supplier: "" },
  { name: "Ranunculus", category: "Focal", season: "Spring", wholesaleCost: 2.50, stemsPerBunch: 10, bunchCost: 25, color: "Various", supplier: "" },
  { name: "Ranunculus Cloony", category: "Focal", season: "Spring", wholesaleCost: 3.50, stemsPerBunch: 10, bunchCost: 35, color: "Various", supplier: "" },
  { name: "Hydrangea", category: "Focal", season: "Summer", wholesaleCost: 6.00, stemsPerBunch: 1, bunchCost: 6, color: "Various", supplier: "" },
  { name: "Dahlia", category: "Focal", season: "Summer", wholesaleCost: 4.50, stemsPerBunch: 5, bunchCost: 22.50, color: "Various", supplier: "" },
  { name: "Dahlia 'Cafe au Lait'", category: "Focal", season: "Summer", wholesaleCost: 5.00, stemsPerBunch: 5, bunchCost: 25, color: "Blush/Cream", supplier: "" },
  { name: "Lisianthus", category: "Secondary", season: "Summer", wholesaleCost: 2.50, stemsPerBunch: 10, bunchCost: 25, color: "Various", supplier: "" },
  { name: "Anemone", category: "Secondary", season: "Winter", wholesaleCost: 2.50, stemsPerBunch: 10, bunchCost: 25, color: "Various", supplier: "" },
  { name: "Tulip", category: "Secondary", season: "Spring", wholesaleCost: 1.50, stemsPerBunch: 10, bunchCost: 15, color: "Various", supplier: "" },
  { name: "Calla Lily (Mini)", category: "Focal", season: "Year-Round", wholesaleCost: 2.00, stemsPerBunch: 10, bunchCost: 20, color: "Various", supplier: "" },
  { name: "Calla Lily (Standard)", category: "Focal", season: "Year-Round", wholesaleCost: 4.00, stemsPerBunch: 10, bunchCost: 40, color: "White", supplier: "" },
  { name: "Snapdragon", category: "Secondary", season: "Spring", wholesaleCost: 2.00, stemsPerBunch: 10, bunchCost: 20, color: "Various", supplier: "" },
  { name: "Stock", category: "Secondary", season: "Spring", wholesaleCost: 2.00, stemsPerBunch: 10, bunchCost: 20, color: "Various", supplier: "" },
  { name: "Larkspur", category: "Secondary", season: "Summer", wholesaleCost: 2.50, stemsPerBunch: 10, bunchCost: 25, color: "Various", supplier: "" },
  { name: "Delphinium", category: "Secondary", season: "Summer", wholesaleCost: 3.50, stemsPerBunch: 10, bunchCost: 35, color: "Blue/Purple", supplier: "" },
  { name: "Sweet Pea", category: "Accent", season: "Spring", wholesaleCost: 2.00, stemsPerBunch: 20, bunchCost: 40, color: "Various", supplier: "" },
  { name: "Scabiosa", category: "Accent", season: "Summer", wholesaleCost: 2.50, stemsPerBunch: 10, bunchCost: 25, color: "Various", supplier: "" },
  { name: "Astilbe", category: "Accent", season: "Summer", wholesaleCost: 3.00, stemsPerBunch: 10, bunchCost: 30, color: "Pink/White", supplier: "" },
  { name: "Wax Flower", category: "Filler", season: "Year-Round", wholesaleCost: 1.00, stemsPerBunch: 10, bunchCost: 10, color: "White/Pink", supplier: "" },
  { name: "Baby's Breath (Gypsophila)", category: "Filler", season: "Year-Round", wholesaleCost: 0.75, stemsPerBunch: 10, bunchCost: 7.50, color: "White", supplier: "" },
  { name: "Hypericum Berry", category: "Accent", season: "Year-Round", wholesaleCost: 2.00, stemsPerBunch: 10, bunchCost: 20, color: "Various", supplier: "" },
  { name: "Craspedia (Billy Ball)", category: "Accent", season: "Year-Round", wholesaleCost: 1.50, stemsPerBunch: 10, bunchCost: 15, color: "Yellow", supplier: "" },
  { name: "Carnation (Standard)", category: "Filler", season: "Year-Round", wholesaleCost: 0.75, stemsPerBunch: 25, bunchCost: 18.75, color: "Various", supplier: "" },
  { name: "Carnation (Spray)", category: "Filler", season: "Year-Round", wholesaleCost: 1.00, stemsPerBunch: 10, bunchCost: 10, color: "Various", supplier: "" },
  { name: "Chrysanthemum (Disbuds)", category: "Focal", season: "Fall", wholesaleCost: 2.00, stemsPerBunch: 10, bunchCost: 20, color: "Various", supplier: "" },
  { name: "Sunflower", category: "Focal", season: "Summer", wholesaleCost: 2.00, stemsPerBunch: 10, bunchCost: 20, color: "Yellow", supplier: "" },
  { name: "Orchid (Phalaenopsis)", category: "Focal", season: "Year-Round", wholesaleCost: 12.00, stemsPerBunch: 1, bunchCost: 12, color: "White", supplier: "" },
  { name: "Orchid (Cymbidium)", category: "Focal", season: "Year-Round", wholesaleCost: 10.00, stemsPerBunch: 1, bunchCost: 10, color: "Various", supplier: "" },
  { name: "Freesia", category: "Accent", season: "Spring", wholesaleCost: 1.50, stemsPerBunch: 10, bunchCost: 15, color: "Various", supplier: "" },
  { name: "Dusty Miller", category: "Greenery", season: "Year-Round", wholesaleCost: 1.25, stemsPerBunch: 10, bunchCost: 12.50, color: "Silver", supplier: "" },
  { name: "Eucalyptus (Seeded)", category: "Greenery", season: "Year-Round", wholesaleCost: 2.25, stemsPerBunch: 10, bunchCost: 22.50, color: "Green", supplier: "" },
  { name: "Eucalyptus (Silver Dollar)", category: "Greenery", season: "Year-Round", wholesaleCost: 2.00, stemsPerBunch: 10, bunchCost: 20, color: "Green/Silver", supplier: "" },
  { name: "Italian Ruscus", category: "Greenery", season: "Year-Round", wholesaleCost: 1.50, stemsPerBunch: 10, bunchCost: 15, color: "Green", supplier: "" },
  { name: "Salal (Lemon Leaf)", category: "Greenery", season: "Year-Round", wholesaleCost: 0.50, stemsPerBunch: 25, bunchCost: 12.50, color: "Green", supplier: "" },
  { name: "Leatherleaf Fern", category: "Greenery", season: "Year-Round", wholesaleCost: 0.40, stemsPerBunch: 25, bunchCost: 10, color: "Green", supplier: "" },
  { name: "Smilax", category: "Greenery", season: "Year-Round", wholesaleCost: 3.00, stemsPerBunch: 1, bunchCost: 3, color: "Green", supplier: "" },
  { name: "Olive Branch", category: "Greenery", season: "Year-Round", wholesaleCost: 2.50, stemsPerBunch: 10, bunchCost: 25, color: "Green/Grey", supplier: "" },
  { name: "Privet Berry", category: "Greenery", season: "Fall", wholesaleCost: 2.00, stemsPerBunch: 10, bunchCost: 20, color: "Green/Black", supplier: "" },
  { name: "Bupleurum", category: "Filler", season: "Year-Round", wholesaleCost: 1.00, stemsPerBunch: 10, bunchCost: 10, color: "Green", supplier: "" },
  { name: "Tree Fern", category: "Greenery", season: "Year-Round", wholesaleCost: 0.50, stemsPerBunch: 25, bunchCost: 12.50, color: "Green", supplier: "" },
  { name: "Pittosporum", category: "Greenery", season: "Year-Round", wholesaleCost: 1.50, stemsPerBunch: 10, bunchCost: 15, color: "Green", supplier: "" },
  { name: "Dried Pampas Grass", category: "Dried/Preserved", season: "Year-Round", wholesaleCost: 4.00, stemsPerBunch: 3, bunchCost: 12, color: "Natural/Bleached", supplier: "" },
  { name: "Dried Bunny Tails", category: "Dried/Preserved", season: "Year-Round", wholesaleCost: 1.50, stemsPerBunch: 20, bunchCost: 30, color: "Various", supplier: "" },
];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const safeNum = (v, fallback = 0) => { const n = Number(v); return isNaN(n) || !isFinite(n) ? fallback : n };
const fmt$ = (n) => "$" + safeNum(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtDate = (d) => d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
const fmtDateFull = (d) => d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
const toISO = (d) => d ? new Date(d).toISOString().slice(0, 10) : "";

const sGet = async (k) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch { return null; } };
const sSet = async (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.error("storage err", e); } };
const downloadCSV = (filename, headers, rows) => {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [headers.map(esc).join(","), ...rows.map(r => r.map(esc).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
};
const downloadICS = (events) => {
  const pad = (n) => String(n).padStart(2, "0");
  const toICSDate = (d, t) => {
    const dt = new Date(d + "T" + (t || "09:00") + ":00");
    return `${dt.getFullYear()}${pad(dt.getMonth()+1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
  };
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Green Gables//Ops V6//EN", "CALSCALE:GREGORIAN"];
  events.filter(e => e.date).forEach(e => {
    lines.push("BEGIN:VEVENT",
      `DTSTART:${toICSDate(e.date, e.arrivalTime || "09:00")}`,
      `DTEND:${toICSDate(e.date, e.teardownTime || "22:00")}`,
      `SUMMARY:${e.eventCode || e.clientName} - ${e.venue}`,
      `DESCRIPTION:Tier: ${TIERS[e.tier]?.label || e.tier}\\nContract: ${fmt$(e.contractTotal)}\\nVenue: ${e.venue}`,
      `LOCATION:${e.venue}`,
      `UID:gg-${e.id}@greengables`,
      "END:VEVENT");
  });
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "green-gables-2026.ics"; a.click();
};
const Btn = ({ children, onClick, v = "primary", sm, style: s = {}, disabled: d, title: tt }) => {
  const base = { border: "none", cursor: d ? "default" : "pointer", borderRadius: 6, fontWeight: 600, fontSize: sm ? 11 : 13, padding: sm ? "5px 10px" : "8px 16px", opacity: d ? 0.4 : 1, display: "inline-flex", alignItems: "center", gap: 5, transition: "all 0.15s", fontFamily: "inherit" };
  const vars = { primary: { background: B.forest, color: B.cream }, secondary: { background: B.cream, color: B.forest, border: `1px solid ${B.creamD}` }, ghost: { background: "transparent", color: B.forest }, danger: { background: B.red, color: "#fff" }, gold: { background: B.gold, color: "#fff" } };
  return <button title={tt} onClick={d ? undefined : onClick} style={{ ...base, ...vars[v], ...s }}>{children}</button>;
};
const Card = ({ children, style: s = {}, onClick, className }) => <div className={className} onClick={onClick} style={{ background: B.white, border: `1px solid ${B.creamD}`, borderRadius: 8, padding: 16, transition: "box-shadow 0.2s, border-color 0.2s", ...s }}>{children}</div>;
const Input = ({ label, value, onChange, type = "text", placeholder, textarea, options, style: s = {}, help }) => {
  const ist = { width: "100%", padding: "7px 10px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 13, background: B.white, fontFamily: "inherit", boxSizing: "border-box", ...s };
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <label style={{ display: "block", fontSize: 11, fontWeight: 600, marginBottom: 3, color: B.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}{help && <span title={help} style={{ cursor: "help", marginLeft: 4, color: B.gold }}>?</span>}</label>}
      {options ? <select value={value} onChange={e => onChange(e.target.value)} style={ist}><option value="">Select...</option>{options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}</select>
        : textarea ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...ist, resize: "vertical" }} />
        : <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={ist} />}
    </div>
  );
};
const Badge = ({ children, color = B.sage }) => <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600, background: color + "20", color, letterSpacing: 0.3 }}>{children}</span>;
const PageHead = ({ title, sub, right }) => (
  <div style={{ padding: "20px 28px 14px", borderBottom: `1px solid ${B.creamD}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: B.white, flexWrap: "wrap", gap: 8 }}>
    <div><h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, fontFamily: "'Cormorant Garamond', Georgia, serif", color: B.forest }}>{title}</h1>{sub && <p style={{ margin: "3px 0 0", fontSize: 12, color: B.muted }}>{sub}</p>}</div><div style={{ ...S.flex, alignItems: "center", flexWrap: "wrap" }}>{right}</div>
  </div>
);
const Stat = ({ label, value, sub, color = B.forest }) => (
  <Card style={{ textAlign: "center", flex: 1, padding: 14 }}>
    <div style={{ ...S.sm, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{value}</div>
    {sub && <div style={{ ...S.xs, marginTop: 3 }}>{sub}</div>}
  </Card>
);
const Empty = ({ icon, msg, action, hint }) => <div className="gg-fade" style={{ textAlign: "center", padding: 40, color: B.muted }}><div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>{icon}</div><div style={{ marginBottom: 6, fontSize: 13, lineHeight: 1.5 }}>{msg}</div>{hint && <div style={{ fontSize: 11, color: B.gold, marginBottom: 14, fontStyle: "italic" }}>{hint}</div>}{action}</div>;
const Confirm = ({ msg, onYes, onNo }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onNo}>
    <Card className="gg-fade" style={{ maxWidth: 360, textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
      <div style={{ fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>{msg}</div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}><Btn v="danger" onClick={onYes}>Confirm</Btn><Btn v="secondary" onClick={onNo}>Cancel</Btn></div>
    </Card>
  </div>
);
const ProgressBar = ({ value, max, color = B.forest, label, showPct = false }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: 8 }}>
      {label && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}><span>{label}</span><span style={{ fontWeight: 600 }}>{Math.round(pct)}%</span></div>}
      <div style={{ height: 6, background: B.cream, borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", background: `linear-gradient(90deg, ${color}, ${color}dd)`, borderRadius: 3, width: `${pct}%`, transition: "width 0.5s ease" }} /></div>
      {showPct && !label && <div style={{ fontSize: 9, color: B.muted, marginTop: 2, textAlign: "right" }}>{Math.round(pct)}%</div>}
    </div>
  );
};

function TimerDisplay({ startTime, style: s = {} }) {
  const [el, setEl] = useState(0);
  useEffect(() => { const iv = setInterval(() => setEl(Math.floor((Date.now() - startTime) / 1000)), 1000); return () => clearInterval(iv); }, [startTime]);
  const h = Math.floor(el / 3600), m = Math.floor((el % 3600) / 60), sec = el % 60;
  return <span style={{ fontVariantNumeric: "tabular-nums", ...s }}>{h}:{String(m).padStart(2, "0")}:{String(sec).padStart(2, "0")}</span>;
}

const PIECE_PRICING = {
  "Bridal Bouquet":     { flowerCost: 35, laborCost: 25, supplyCost: 8 },
  "Bridesmaid Bouquet": { flowerCost: 22, laborCost: 18, supplyCost: 6 },
  "Boutonnieres":       { flowerCost: 4, laborCost: 5, supplyCost: 1 },
  "Corsages":           { flowerCost: 7, laborCost: 6, supplyCost: 2 },
  "Flower Girl":        { flowerCost: 12, laborCost: 10, supplyCost: 3 },
  "Ceremony Arch":      { flowerCost: 120, laborCost: 50, supplyCost: 25 },
  "Ceremony Aisle":     { flowerCost: 60, laborCost: 30, supplyCost: 15 },
  "Reception Centerpiece": { flowerCost: 22, laborCost: 12, supplyCost: 5 },
  "Head Table":         { flowerCost: 65, laborCost: 30, supplyCost: 12 },
  "Cocktail Arrangement": { flowerCost: 18, laborCost: 10, supplyCost: 4 },
  "Welcome/Escort Table": { flowerCost: 40, laborCost: 20, supplyCost: 8 },
  "Cake Flowers":       { flowerCost: 15, laborCost: 10, supplyCost: 2 },
  "Sweetheart Table":   { flowerCost: 35, laborCost: 18, supplyCost: 8 },
};

const TIER_ITEMS = {
  full: [
    { piece: "Bridal Bouquet", qty: 1 },
    { piece: "Bridesmaid Bouquet", qty: 4 },
    { piece: "Boutonnieres", qty: 6 },
    { piece: "Corsages", qty: 3 },
    { piece: "Flower Girl", qty: 1 },
    { piece: "Ceremony Arch", qty: 1 },
    { piece: "Reception Centerpiece", qty: 12 },
    { piece: "Head Table", qty: 1 },
    { piece: "Cocktail Arrangement", qty: 3 },
    { piece: "Welcome/Escort Table", qty: 1 },
    { piece: "Cake Flowers", qty: 1 },
  ],
  mid: [
    { piece: "Bridal Bouquet", qty: 1 },
    { piece: "Bridesmaid Bouquet", qty: 2 },
    { piece: "Boutonnieres", qty: 4 },
    { piece: "Corsages", qty: 2 },
    { piece: "Reception Centerpiece", qty: 8 },
    { piece: "Head Table", qty: 1 },
    { piece: "Cake Flowers", qty: 1 },
  ],
  partial: [
    { piece: "Bridal Bouquet", qty: 1 },
    { piece: "Bridesmaid Bouquet", qty: 1 },
    { piece: "Boutonnieres", qty: 3 },
    { piece: "Reception Centerpiece", qty: 4 },
  ],
};

function buildEstimateItems(tier, contractTotal) {
  const template = TIER_ITEMS[tier] || TIER_ITEMS.partial;
  const items = template.map(t => {
    const base = PIECE_PRICING[t.piece] || { flowerCost: 10, laborCost: 10, supplyCost: 3 };
    const fc = base.flowerCost * t.qty;
    const lc = base.laborCost * t.qty;
    const sc = base.supplyCost * t.qty;
    const tc = fc + lc + sc;
    return { id: uid(), piece: t.piece, qty: t.qty, costPerStem: 0, flowerCost: fc, laborCost: lc, supplyCost: sc, totalCost: tc, priceCharged: 0, recipe: [] };
  });
  // Distribute contract total across items proportional to cost
  const totalCost = items.reduce((s, i) => s + i.totalCost, 0);
  if (contractTotal > 0 && totalCost > 0) {
    items.forEach(i => { i.priceCharged = Math.round((i.totalCost / totalCost) * contractTotal); });
  }
  return items;
}

const STARTER_SUPPLIES = [
  { name: "Oasis Floral Foam (brick)", category: "Design", unit: "brick", costPer: 2.50, reorderQty: 24, parLevel: 12 },
  { name: "Oasis Floral Foam (cage/holder)", category: "Design", unit: "each", costPer: 4.00, reorderQty: 12, parLevel: 6 },
  { name: "Chicken Wire (roll)", category: "Design", unit: "roll", costPer: 12.00, reorderQty: 2, parLevel: 1 },
  { name: "Floral Wire 22ga (pack)", category: "Design", unit: "pack", costPer: 4.50, reorderQty: 10, parLevel: 5 },
  { name: "Floral Wire 26ga (pack)", category: "Design", unit: "pack", costPer: 3.50, reorderQty: 10, parLevel: 5 },
  { name: "Floral Tape Green", category: "Design", unit: "roll", costPer: 2.25, reorderQty: 12, parLevel: 6 },
  { name: "Floral Tape White", category: "Design", unit: "roll", costPer: 2.25, reorderQty: 6, parLevel: 3 },
  { name: "Ribbon (satin, per yard)", category: "Design", unit: "yard", costPer: 0.75, reorderQty: 50, parLevel: 20 },
  { name: "Ribbon (silk, per yard)", category: "Design", unit: "yard", costPer: 2.50, reorderQty: 30, parLevel: 10 },
  { name: "Bouquet Pins (pearl head)", category: "Design", unit: "box", costPer: 5.00, reorderQty: 4, parLevel: 2 },
  { name: "Corsage Pins", category: "Design", unit: "box", costPer: 3.50, reorderQty: 4, parLevel: 2 },
  { name: "Boutonniere Magnets", category: "Design", unit: "pack/12", costPer: 8.00, reorderQty: 3, parLevel: 2 },
  { name: "Water Tubes (small)", category: "Design", unit: "pack/25", costPer: 6.00, reorderQty: 4, parLevel: 2 },
  { name: "Water Tubes (large)", category: "Design", unit: "pack/25", costPer: 8.00, reorderQty: 4, parLevel: 2 },
  { name: "Zip Ties (bag)", category: "Design", unit: "bag", costPer: 4.00, reorderQty: 3, parLevel: 1 },
  { name: "Floral Adhesive/Glue", category: "Design", unit: "tube", costPer: 6.50, reorderQty: 4, parLevel: 2 },
  { name: "Waterproof Tape (anchor)", category: "Design", unit: "roll", costPer: 5.00, reorderQty: 6, parLevel: 3 },
  { name: "Stem Wrap (floral wrap)", category: "Design", unit: "roll", costPer: 3.00, reorderQty: 6, parLevel: 3 },
  { name: "Paddle Wire", category: "Design", unit: "roll", costPer: 4.00, reorderQty: 4, parLevel: 2 },
  { name: "Flower Food (Chrysal)", category: "Design", unit: "pack/100", costPer: 12.00, reorderQty: 2, parLevel: 1 },
  { name: "Kenzan (pin frog, small)", category: "Design", unit: "each", costPer: 8.00, reorderQty: 4, parLevel: 2 },
  { name: "Kenzan (pin frog, large)", category: "Design", unit: "each", costPer: 14.00, reorderQty: 2, parLevel: 1 },
  { name: "Floral Putty/Clay", category: "Design", unit: "pack", costPer: 5.00, reorderQty: 4, parLevel: 2 },
  { name: "Tissue Paper (ream)", category: "Shop", unit: "ream", costPer: 12.00, reorderQty: 2, parLevel: 1 },
  { name: "Cellophane Wrap (roll)", category: "Shop", unit: "roll", costPer: 15.00, reorderQty: 2, parLevel: 1 },
  { name: "Kraft Paper (roll)", category: "Shop", unit: "roll", costPer: 18.00, reorderQty: 1, parLevel: 1 },
  { name: "Shop Towels (roll)", category: "Shop", unit: "pack", costPer: 8.00, reorderQty: 4, parLevel: 2 },
  { name: "Bleach (gallon)", category: "Shop", unit: "gallon", costPer: 4.00, reorderQty: 2, parLevel: 1 },
  { name: "Bucket Cleaner", category: "Shop", unit: "bottle", costPer: 7.00, reorderQty: 2, parLevel: 1 },
  { name: "Trash Bags (contractor)", category: "Shop", unit: "box", costPer: 15.00, reorderQty: 2, parLevel: 1 },
  { name: "Rubber Bands (assorted)", category: "Shop", unit: "bag", costPer: 4.00, reorderQty: 2, parLevel: 1 },
  { name: "Shears (Sakagen)", category: "Tool", unit: "pair", costPer: 28.00, reorderQty: 1, parLevel: 1 },
  { name: "Wire Cutters", category: "Tool", unit: "pair", costPer: 12.00, reorderQty: 1, parLevel: 1 },
  { name: "Spray Bottles", category: "Shop", unit: "each", costPer: 3.00, reorderQty: 3, parLevel: 2 },
  { name: "Candles (taper, box)", category: "Rental Supply", unit: "box/12", costPer: 8.00, reorderQty: 4, parLevel: 2 },
  { name: "Candles (pillar, each)", category: "Rental Supply", unit: "each", costPer: 5.00, reorderQty: 12, parLevel: 6 },
  { name: "Candles (votive, box)", category: "Rental Supply", unit: "box/12", costPer: 6.00, reorderQty: 6, parLevel: 3 },
];

// Error boundary to prevent white-screen crashes
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return React.createElement("div", { style: { padding: 60, textAlign: "center", fontFamily: "'DM Sans', system-ui, sans-serif", maxWidth: 400, margin: "0 auto" } },
        React.createElement("div", { style: { fontSize: 36, marginBottom: 12, opacity: 0.3 } }, "◈"),
        React.createElement("h2", { style: { color: "#2D4A3E", fontSize: 18, fontWeight: 500, fontFamily: "'Cormorant Garamond', Georgia, serif" } }, "Something unexpected happened"),
        React.createElement("p", { style: { color: "#6B6B6B", fontSize: 12, lineHeight: 1.6, marginBottom: 20 } }, "Your data is safe. Try refreshing, or reset if things keep breaking."),
        React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "center" } },
          React.createElement("button", { onClick: () => this.setState({ hasError: false, error: null }), style: { padding: "8px 20px", background: "#2D4A3E", color: "#F5F0E8", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 } }, "Try Again"),
          React.createElement("button", { onClick: () => { localStorage.removeItem("gg_v6"); window.location.reload(); }, style: { padding: "8px 20px", background: "transparent", color: "#C44A4A", border: "1px solid #C44A4A", borderRadius: 6, cursor: "pointer", fontSize: 13 } }, "Reset Data")
        )
      );
    }
    return this.props.children;
  }
}

function GreenGablesOpsInner() {
  const [view, setView] = useState("dashboard");
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState({
    events: [], clients: [], tasks: [], timeEntries: [], jobCosts: [],
    boardNotes: [], whiteboard: [], activeTimer: null, overheadActuals: [],
    customExpenses: [], estimates: [],
    sops: [], checklistTemplates: {},
    budget: { ...DEFAULT_BUDGET }, rentals: [], rentalAssignments: [],
    flowerCatalog: [], supplyCatalog: [], venues: [], teamMembers: ["Lindsay", "Mac"],
    assignments: [],
  });
  const [sidePanel, setSidePanel] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // "saving" | "saved" | null
  const ww = useWindowWidth();
  const isMob = ww < MOB;

  useEffect(() => {
    (async () => {
      const d = await sGet("gg_v6");
      if (d) { setData({ events: [], clients: [], tasks: [], timeEntries: [], jobCosts: [], boardNotes: [], whiteboard: [], activeTimer: null, overheadActuals: [], customExpenses: [], estimates: [], sops: [], checklistTemplates: {}, budget: { ...DEFAULT_BUDGET }, rentals: [], rentalAssignments: [], flowerCatalog: [], supplyCatalog: [], venues: [], teamMembers: ["Lindsay", "Mac"], assignments: [], ...d }); }
      else {
        const seedEvents = SEED_EVENTS_2026.map(e => {
          const evId = uid();
          const cId = uid();
          return {
            id: evId, clientId: cId, clientName: e.client, date: e.date, venue: e.venue, tier: e.tier,
            contractTotal: e.low, rangeLow: e.low, rangeHigh: e.high,
            eventCode: e.client.split(" ").pop().toUpperCase() + "-26",
            depositConfirmed: false, finalPaymentConfirmed: false, flowerOrderPlaced: false,
            crewAssigned: [], arrivalTime: "", ceremonyTime: "", receptionTime: "", teardownTime: "",
            notes: "", stage: "booked",
          };
        });
        const seedClients = seedEvents.map(ev => ({
          id: ev.clientId, name: ev.clientName, email: "", phone: "", eventDate: ev.date, venue: ev.venue,
          tier: ev.tier, notes: "", referralSource: "", guestCount: 0,
          status: "booked", quoteTotal: ev.contractTotal, addOns: [], lineItems: [],
          leadSource: "", createdAt: Date.now(),
        }));
        const seedEstimates = seedEvents.map(ev => ({
          id: uid(), eventName: ev.eventCode, eventId: ev.id, clientId: ev.clientId,
          totalRevenue: ev.contractTotal, notes: `${ev.tier} tier | ${ev.venue}`, createdAt: Date.now(),
          items: buildEstimateItems(ev.tier, ev.contractTotal),
        }));
        const seedData = { ...data, events: seedEvents, clients: seedClients, estimates: seedEstimates };
        setData(seedData); await sSet("gg_v6", seedData);
      }
      setLoaded(true);
      // Migration: if events exist but clients/estimates don't, auto-populate
      const final = await sGet("gg_v6");
      if (final && final.events && final.events.length > 0) {
        let needsSave = false;
        const updates = {};
        if (!final.clients || final.clients.length === 0) {
          updates.clients = final.events.map(ev => ({
            id: ev.clientId || uid(), name: ev.clientName, email: "", phone: "", eventDate: ev.date, venue: ev.venue,
            tier: ev.tier, notes: "", referralSource: "", guestCount: 0,
            status: "booked", quoteTotal: ev.contractTotal || 0, addOns: [], lineItems: [],
            leadSource: "", createdAt: Date.now(),
          }));
          needsSave = true;
        }
        if (!final.estimates || final.estimates.length === 0) {
          updates.estimates = final.events.map(ev => ({
            id: uid(), eventName: ev.eventCode || ev.clientName, eventId: ev.id, clientId: ev.clientId || "",
            totalRevenue: ev.contractTotal || 0,
            items: buildEstimateItems(ev.tier, ev.contractTotal),
            notes: `${ev.tier} tier | ${ev.venue}`, createdAt: Date.now(),
          }));
          needsSave = true;
        }
        if (needsSave) {
          const migrated = { ...final, ...updates };
          setData(prev => ({ ...prev, ...updates }));
          await sSet("gg_v6", migrated);
        }
        // Migration v11: fix event stage field + task categories
        let v11 = false; const v11u = {};
        const evts = final.events || [];
        if (evts.some(e => !e.stage)) {
          v11u.events = evts.map(e => e.stage ? e : { ...e, stage: "booked" });
          v11 = true;
        }
        const tsks = final.tasks || [];
        if (tsks.some(t => !t.category)) {
          v11u.tasks = tsks.map(t => t.category ? t : { ...t, category: "production" });
          v11 = true;
        }
        if (v11) {
          const m2 = { ...(needsSave ? { ...final, ...updates } : final), ...v11u };
          setData(prev => ({ ...prev, ...v11u }));
          await sSet("gg_v6", m2);
        }
      }
    })();
  }, []);

  const save = useCallback((updates) => {
    setData(prev => {
      const next = { ...prev, ...updates };
      setSaveStatus("saving");
      sSet("gg_v6", next).then(() => {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(null), 1200);
      });
      return next;
    });
  }, []);

  const confirmDelete = (msg, onConfirm) => setConfirmDialog({ msg, onConfirm });

  const NAV = [
    { id: "dashboard", icon: "◫", label: "Command Center" },
    { section: "Pipeline" },
    { id: "clients", icon: "◎", label: "Clients" },
    { id: "venues", icon: "⌂", label: "Venues" },
    { section: "Planning" },
    { id: "calendar", icon: "▦", label: "Calendar" },
    { id: "events", icon: "❁", label: "Event Planner" },
    { id: "estimates", icon: "◇", label: "Estimates" },
    { section: "Resources" },
    { id: "flowers", icon: "✿", label: "Catalog" },
    { id: "wholesale", icon: "▥", label: "Wholesale" },
    { id: "rentals", icon: "⬡", label: "Rentals" },
    { section: "Execution" },
    { id: "schedule", icon: "◉", label: "Schedule" },
    { id: "tasks", icon: "☐", label: "Tasks" },
    { section: "Tracking" },
    { id: "timeclock", icon: "◷", label: "Time Clock" },
    { id: "overhead", icon: "▧", label: "Overhead" },
    { section: "Notes" },
    { id: "whiteboard", icon: "▤", label: "Whiteboard" },
    { id: "teamboard", icon: "◻", label: "Team Board" },
  ];

  if (!loaded) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: B.forest }}>
      <GlobalStyles />
      <div className="gg-fade" style={S.center}>
        <div style={{ fontSize: 32, color: B.cream, letterSpacing: 1, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>Green Gables</div>
        <div style={{ fontSize: 9, color: B.sage, letterSpacing: 4, textTransform: "uppercase", marginTop: 4 }}>Florist & Farm</div>
        <div style={{ width: 40, height: 2, background: B.gold, margin: "16px auto 0", borderRadius: 1 }} className="gg-pulse" />
      </div>
    </div>
  );

  const props = { data, save, setSidePanel, setView, confirmDelete, isMob };

  const navClick = (id) => { setView(id); setMobileNav(false); };

  const SidebarContent = () => (<>
    <div style={{ padding: "18px 14px 14px", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 19, color: B.cream, fontWeight: 600, lineHeight: 1.2 }}>Green Gables</div>
      <div style={{ fontSize: 9, color: B.sage, letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>Florist & Farm</div>
    </div>
    <nav style={{ flex: 1, padding: "6px 0", overflowY: "auto" }}>
      {NAV.map((n, idx) => n.section !== undefined ? (
        n.section ? <div key={idx} style={{ fontSize: 9, color: B.sage, textTransform: "uppercase", letterSpacing: 1.5, padding: "10px 14px 3px", fontWeight: 600, opacity: 0.7 }}>{n.section}</div> : <div key={idx} style={{ height: 6 }} />
      ) : (
        <button key={n.id} onClick={() => navClick(n.id)} style={{
          display: "flex", alignItems: "center", gap: 7, width: "100%", padding: isMob ? "10px 18px" : "7px 14px", border: "none", cursor: "pointer",
          background: view === n.id ? "rgba(255,255,255,0.12)" : "transparent",
          color: view === n.id ? B.cream : B.sageL, fontSize: isMob ? 14 : 12, textAlign: "left", fontFamily: "inherit",
          borderLeft: view === n.id ? `3px solid ${B.gold}` : "3px solid transparent",
        }}>
          <span style={{ fontSize: isMob ? 16 : 13, width: 20, textAlign: "center", flexShrink: 0 }}>{n.icon}</span>{n.label}
        </button>
      ))}
    </nav>
    {data.activeTimer && (
      <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(196,162,101,0.15)" }}>
        <div style={{ fontSize: 9, color: B.gold, textTransform: "uppercase", letterSpacing: 1 }}>Timer Active</div>
        <div style={{ color: B.cream, fontSize: 11, marginTop: 2 }}>{data.activeTimer.person} — {data.activeTimer.workType}</div>
        <TimerDisplay startTime={data.activeTimer.startTime} style={{ color: B.gold, fontSize: 16, fontWeight: 700, display: "block", marginTop: 3 }} />
      </div>
    )}
    {saveStatus && (
      <div style={{ padding: "6px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
        <span className={saveStatus === "saving" ? "gg-pulse" : ""} style={{ fontSize: 9, color: saveStatus === "saving" ? B.gold : B.sage, fontWeight: 600, letterSpacing: 0.5 }}>{saveStatus === "saving" ? "● Saving..." : "✓ Saved"}</span>
      </div>
    )}
    <div style={{ padding: "8px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
      <div style={{ fontSize: 8, color: B.sage, opacity: 0.5, letterSpacing: 0.5 }}>{(data.events || []).length} events · {(data.tasks || []).filter(t => t.status !== "done").length} open tasks · {(() => { try { return Math.round(JSON.stringify(data).length / 1024) + "KB"; } catch { return ""; } })()}</div>
    </div>
  </>);

  const currentLabel = NAV.find(n => n.id === view)?.label || "Command Center";

  return (
    <div style={{ display: "flex", flexDirection: isMob ? "column" : "row", height: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: B.white, color: B.text, fontSize: 13, lineHeight: 1.5 }}>
      <GlobalStyles />

      {/* MOBILE: Top bar + hamburger */}
      {isMob && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: B.forest, flexShrink: 0 }}>
          <button onClick={() => setMobileNav(true)} style={{ background: "none", border: "none", cursor: "pointer", color: B.cream, fontSize: 22, padding: 0, lineHeight: 1 }}>☰</button>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, color: B.cream, fontWeight: 600 }}>Green Gables</div>
          <div style={S.flexC}>
            {saveStatus && <span style={{ fontSize: 9, color: saveStatus === "saving" ? B.gold : B.sage, fontWeight: 600, opacity: saveStatus === "saved" ? 0.7 : 1, transition: "opacity 0.3s" }}>{saveStatus === "saving" ? "Saving..." : "✓ Saved"}</span>}
            <div style={{ fontSize: 11, color: B.gold, fontWeight: 500 }}>{currentLabel}</div>
          </div>
        </div>
      )}

      {/* MOBILE: Nav overlay */}
      {isMob && mobileNav && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
          <div style={{ width: 260, background: B.forest, display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 16px" }}>
              <button onClick={() => setMobileNav(false)} style={{ background: "none", border: "none", cursor: "pointer", color: B.cream, fontSize: 22 }}>✕</button>
            </div>
            <SidebarContent />
          </div>
          <div onClick={() => setMobileNav(false)} style={{ flex: 1, background: "rgba(0,0,0,0.5)" }} />
        </div>
      )}

      {/* DESKTOP: Fixed sidebar */}
      {!isMob && (
        <div style={{ width: 190, background: B.forest, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <SidebarContent />
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, overflow: "auto" }}>
          {view === "dashboard" && <Dashboard {...props} />}
          {view === "clients" && <Clients {...props} />}
          {view === "calendar" && <CalendarView {...props} />}
          {view === "events" && <Events {...props} />}
          {view === "venues" && <VenueDirectory {...props} />}
          {view === "estimates" && <Estimates {...props} />}
          {view === "flowers" && <FlowerCatalog {...props} />}
          {view === "wholesale" && <WholesaleOrders {...props} />}
          {view === "schedule" && <Schedule {...props} />}
          {view === "tasks" && <Tasks {...props} />}
          {view === "timeclock" && <TimeClock {...props} />}
          {view === "overhead" && <Overhead {...props} />}
          {view === "whiteboard" && <Whiteboard {...props} />}
          {view === "rentals" && <Rentals {...props} />}
          {view === "teamboard" && <TeamBoard {...props} />}
        </div>
      </div>

      {sidePanel && (
        <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: isMob ? "100%" : 520, background: B.white, boxShadow: "-4px 0 24px rgba(0,0,0,0.12)", zIndex: 100, display: "flex", flexDirection: "column" }} className="gg-slide">
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${B.creamD}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: B.cream }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{sidePanel.title}</span>
            <button onClick={() => setSidePanel(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: B.muted }}>✕</button>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: isMob ? 12 : 18 }}>{sidePanel.content}</div>
        </div>
      )}
      {confirmDialog && <Confirm msg={confirmDialog.msg} onYes={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }} onNo={() => setConfirmDialog(null)} />}
    </div>
  );
}

function Dashboard({ data, save, setView, isMob }) {
  const { events, tasks, jobCosts, timeEntries, estimates, budget } = data;
  const supplies = data.supplyCatalog || [];
  const [editBudget, setEditBudget] = useState(false);
  const [bgt, setBgt] = useState(budget || DEFAULT_BUDGET);
  const [quickTask, setQuickTask] = useState("");
  const [section, setSection] = useState("today");
  const team = data.teamMembers || ["Lindsay", "Mac"];

  const today = new Date(); today.setHours(0,0,0,0);
  const todayISO = today.toISOString().split("T")[0];
  const dayName = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  // Today's events
  const todayEvents = events.filter(e => e.date === todayISO);

  // Task intelligence
  const overdue = tasks.filter(t => t.status !== "done" && t.dueDate && t.dueDate < todayISO);
  const todayTasks = tasks.filter(t => t.status !== "done" && t.dueDate === todayISO);
  const openTasks = tasks.filter(t => t.status !== "done");
  const inProgress = tasks.filter(t => t.status === "in_progress");

  // Event milestones for today
  const todayMilestones = getEventMilestones(events);

  // Next 7 days events
  const next7 = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today); d.setDate(d.getDate() + i);
    const iso = d.toISOString().split("T")[0];
    const dayEvents = events.filter(e => e.date === iso);
    const dayTasks = tasks.filter(t => t.status !== "done" && t.dueDate === iso);
    next7.push({ date: d, iso, dayEvents, dayTasks, label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }), isToday: i === 0 });
  }

  // Week milestones
  const weekMilestones = [];
  events.forEach(ev => {
    if (!ev.date || ev.stage === "closed" || ev.stage === "cancelled") return;
    const evDate = new Date(ev.date + "T12:00:00"); evDate.setHours(0,0,0,0);
    const daysUntil = Math.round((evDate - today) / 864e5);
    EVENT_MILESTONES.forEach(m => {
      if (daysUntil === m.daysOut && daysUntil >= 0 && daysUntil <= 7) {
        weekMilestones.push({ ...m, event: ev, daysUntil });
      }
    });
  });
  weekMilestones.sort((a, b) => a.daysOut - b.daysOut);

  // Smart alerts
  const alerts = [];
  const lowStock = supplies.filter(s => s.qtyOnHand !== undefined && s.parLevel && s.qtyOnHand < s.parLevel);
  if (lowStock.length > 0) alerts.push({ type: "supply", msg: `${lowStock.length} supplies below par level`, icon: "📦", action: () => setView("flowers") });
  if (overdue.length > 0) alerts.push({ type: "overdue", msg: `${overdue.length} overdue task${overdue.length > 1 ? "s" : ""}`, icon: "⚠️", action: () => setView("tasks") });
  const unpaidEvents = events.filter(e => e.stage !== "closed" && e.stage !== "cancelled" && new Date(e.date + "T12:00:00") < today);
  if (unpaidEvents.length > 0) alerts.push({ type: "closure", msg: `${unpaidEvents.length} past event${unpaidEvents.length > 1 ? "s" : ""} need closure`, icon: "🔄", action: () => setView("events") });
  const nextEvent = events.filter(e => new Date(e.date + "T12:00:00") >= today).sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  if (nextEvent) {
    const daysTo = Math.round((new Date(nextEvent.date + "T12:00:00") - today) / 864e5);
    if (daysTo <= 3) alerts.push({ type: "upcoming", msg: `${nextEvent.eventCode || nextEvent.clientName} in ${daysTo} day${daysTo !== 1 ? "s" : ""}`, icon: "★", action: () => setView("events") });
  }

  // Financial summary
  const totalContract = events.reduce((s, e) => s + (e.contractTotal || 0), 0);
  const yearTarget = bgt.yearlyTarget || 140000;
  const ec = events.length;
  const full = events.filter(e => e.tier === "full"), mid = events.filter(e => e.tier === "mid"), partial = events.filter(e => e.tier === "partial");
  const totalHrs = timeEntries.reduce((s, e) => s + (e.hours || 0), 0);
  const avgVal = ec > 0 ? Math.round(totalContract / ec) : 0;
  const overheadPerEvent = ec > 0 ? Math.round(ANNUAL_OVERHEAD / ec) : 0;
  const jobCOGS = jobCosts.reduce((s, j) => s + (j.amount || 0), 0);
  const estCOGS = (estimates || []).reduce((s, est) => {
    if (!est.eventId || jobCosts.some(j => j.eventId === est.eventId)) return s;
    return s + (est.items || []).reduce((ss, i) => ss + (i.flowerCost || 0) + (i.laborCost || 0) + (i.supplyCost || 0), 0);
  }, 0);
  const totalCOGS = jobCOGS + estCOGS;

  const saveBudget = () => { save({ budget: bgt }); setEditBudget(false); };

  // Quick add task
  const handleQuickAdd = () => {
    if (!quickTask.trim()) return;
    save({ tasks: [...tasks, { id: uid(), title: quickTask.trim(), status: "todo", assignee: team[0], dueDate: todayISO, priority: "normal", category: "production", notes: "", createdAt: Date.now() }] });
    setQuickTask("");
  };

  // Convert milestone to task
  const milestoneToTask = (m) => {
    const exists = tasks.some(t => t.title.includes(m.label) && t.eventId === m.event.id);
    if (exists) return;
    save({ tasks: [...tasks, { id: uid(), title: `${m.label}: ${m.event.eventCode || m.event.clientName}`, eventId: m.event.id, status: "todo", assignee: team[0], dueDate: todayISO, priority: m.daysOut <= 1 ? "high" : "normal", category: "production", notes: `Auto-generated from Workflow ${m.sop}. Venue: ${m.event.venue || "TBD"}`, createdAt: Date.now() }] });
  };

  // Convert milestone to assignment with SOP checklist auto-loaded
  const milestoneToAssignment = (m) => {
    const alreadyExists = (data.assignments || []).some(a => a.eventId === m.event.id && a.notes && a.notes.includes(m.label));
    if (alreadyExists) return;
    const templateKey = MILESTONE_TEMPLATE_MAP[m.sop] || "";
    const templateItems = templateKey && getTemplates(data)[templateKey]
      ? getTemplates(data)[templateKey].map(item => ({ id: uid(), title: item.title, sop: item.sop, done: false, doneAt: null, fromTemplate: true }))
      : [];
    const evDate = m.event.date || toISO(new Date());
    const a = { id: uid(), person: team[0], eventId: m.event.id, eventName: m.event.eventCode || m.event.clientName, role: templateKey === "Setup/Install" ? "Lead Designer" : templateKey === "Strike/Teardown" ? "Strike Crew" : "Production Assistant", date: evDate, status: "active", checklist: templateItems, notes: `${m.label} — SOP ${m.sop}`, hoursLogged: 0, createdAt: Date.now() };
    save({ assignments: [...(data.assignments || []), a] });
  };

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dayContext = todayEvents.length > 0 ? `Event day — ${todayEvents.map(e => e.eventCode || e.clientName).join(", ")}` :
    overdue.length > 0 ? `${overdue.length} overdue item${overdue.length > 1 ? "s" : ""} need attention` :
    todayMilestones.length > 0 ? `${todayMilestones.length} milestone${todayMilestones.length > 1 ? "s" : ""} to check today` :
    todayTasks.length > 0 ? `${todayTasks.length} task${todayTasks.length > 1 ? "s" : ""} on deck` :
    nextEvent ? `Next event in ${Math.round((new Date(nextEvent.date + "T12:00:00") - today) / 864e5)} days` :
    "Clear slate — good time to plan ahead";

  const TABS = [
    { id: "today", label: "Today", icon: "☀️" },
    { id: "week", label: "This Week", icon: "📅" },
    { id: "health", label: "Business", icon: "📊" },
  ];

  return (
    <div>
      {/* Compass Greeting */}
      <div style={{ padding: "24px 28px 0" }}>
        <div className="gg-fade" style={{ marginBottom: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 300, fontFamily: "'Cormorant Garamond', Georgia, serif", color: B.forest }}>{greeting}, Lindsay</div>
          <div style={{ fontSize: 12, color: B.gold, fontWeight: 500, marginTop: 2 }}>{dayContext}</div>
          <div style={{ fontSize: 11, color: B.muted, marginTop: 1 }}>{dayName}</div>
        </div>
      </div>
      <div style={{ padding: "12px 28px" }}>

        {/* Attention Needed */}
        {alerts.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            {alerts.map((a, i) => (
              <div key={i} onClick={a.action} className="gg-fade" style={{ ...S.flexC, padding: "6px 12px", background: a.type === "overdue" ? B.redL : a.type === "upcoming" ? B.goldL + "40" : B.greenL, border: `1px solid ${a.type === "overdue" ? B.red + "30" : a.type === "upcoming" ? B.gold + "30" : B.green + "30"}`, borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: "pointer", transition: "transform 0.15s", animationDelay: `${i * 60}ms` }}>
                <span>{a.icon}</span>
                <span style={{ color: a.type === "overdue" ? B.red : B.text }}>{a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {/* Quick Capture */}
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input value={quickTask} onChange={e => setQuickTask(e.target.value)} onKeyDown={e => e.key === "Enter" && handleQuickAdd()} placeholder="What needs to happen today?" style={{ flex: 1, padding: "9px 14px", border: `1px solid ${B.creamD}`, borderRadius: 8, fontSize: 12, fontFamily: "inherit", background: B.white }} />
          <Btn sm onClick={handleQuickAdd} style={{ whiteSpace: "nowrap" }}>+ Add</Btn>
        </div>

        {/* Quick Nav */}
        <div style={{ ...S.flex, marginBottom: 14, flexWrap: "wrap" }}>
          {[
            { label: "+ Client", view: "clients", icon: "◎" },
            { label: "+ Estimate", view: "estimates", icon: "◇" },
            { label: "Schedule", view: "schedule", icon: "▦" },
            { label: "Events", view: "events", icon: "❁" },
            { label: "Catalog", view: "flowers", icon: "✿" },
          ].map(q => (
            <button key={q.view} onClick={() => setView(q.view)} style={{ padding: "4px 10px", borderRadius: 5, fontSize: 10, fontWeight: 600, border: `1px solid ${B.creamD}`, background: B.cream, color: B.forest, cursor: "pointer", fontFamily: "inherit" }}>
              {q.icon} {q.label}
            </button>
          ))}
        </div>

        {editBudget && (
          <Card style={{ marginBottom: 14, borderLeft: `3px solid ${B.gold}`, padding: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
              <Input label="Yearly Revenue Target" type="number" value={bgt.yearlyTarget} onChange={v => setBgt(p => ({ ...p, yearlyTarget: safeNum(v) }))} />
              <Input label="Target Margin %" type="number" value={bgt.targetMargin} onChange={v => setBgt(p => ({ ...p, targetMargin: safeNum(v) }))} />
            </div>
            <Btn sm onClick={saveBudget}>Save</Btn>
          </Card>
        )}

        {/* Tab Nav */}
        <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: `2px solid ${B.creamD}`, alignItems: "center" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setSection(t.id)} style={{ padding: "8px 18px", fontSize: 12, fontWeight: section === t.id ? 700 : 400, color: section === t.id ? B.forest : B.muted, borderBottom: section === t.id ? `2px solid ${B.forest}` : "2px solid transparent", background: "none", border: "none", borderBottomStyle: "solid", cursor: "pointer", fontFamily: "inherit", marginBottom: -2 }}>
              {t.icon} {t.label}
            </button>
          ))}
          <div style={{ marginLeft: "auto" }}>
            <Btn v="ghost" sm onClick={() => setEditBudget(!editBudget)}>{editBudget ? "Cancel" : "⚙"}</Btn>
          </div>
        </div>

        {/* ═══ TODAY TAB ═══ */}
        {section === "today" && (
          <div>
            {/* Today's Events */}
            {todayEvents.length > 0 && (
              <Card style={{ marginBottom: 14, borderLeft: `3px solid ${B.gold}`, background: B.cream }}>
                <div style={S.labelLg}>★ Events Today</div>
                {todayEvents.map(ev => (
                  <div key={ev.id} onClick={() => setView("events")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", cursor: "pointer", borderBottom: `1px solid ${B.creamD}` }}>
                    <div><div style={{ fontWeight: 600, fontSize: 13 }}>{ev.eventCode || ev.clientName}</div><div style={S.xs}>{ev.venue}</div></div>
                    <div style={S.right}><Badge color={TIERS[ev.tier]?.color}>{TIERS[ev.tier]?.label}</Badge><div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{fmt$(ev.contractTotal)}</div></div>
                  </div>
                ))}
              </Card>
            )}

            {/* Event Milestones Today */}
            {todayMilestones.length > 0 && (
              <Card style={{ marginBottom: 14, borderLeft: `3px solid ${B.blue}` }}>
                <div style={S.labelLg}>Event Milestones</div>
                {todayMilestones.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${B.cream}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{m.icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>{m.label}</div>
                        <div style={S.sm}>{m.event.eventCode || m.event.clientName} — Workflow {m.sop}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 3 }}>
                      <Btn v="ghost" sm onClick={() => milestoneToTask(m)} title="Convert to task">+ Task</Btn>
                      <Btn v="gold" sm onClick={() => milestoneToAssignment(m)} title="Create assignment with SOP checklist">+ Assign</Btn>
                    </div>
                  </div>
                ))}
              </Card>
            )}

            {/* Overdue Tasks */}
            {overdue.length > 0 && (
              <Card style={{ marginBottom: 14, borderLeft: `3px solid ${B.red}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: B.red, marginBottom: 8 }}>Overdue ({overdue.length})</div>
                {overdue.slice(0, 8).map(t => {
                  const ev = events.find(e => e.id === t.eventId);
                  return (
                    <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${B.cream}`, fontSize: 12 }}>
                      <div style={{ ...S.flexC, flex: 1 }}>
                        <input type="checkbox" onChange={() => save({ tasks: tasks.map(x => x.id === t.id ? { ...x, status: "done" } : x) })} style={{ cursor: "pointer" }} />
                        <div>
                          <span style={{ fontWeight: 500 }}>{t.title}</span>
                          {ev && <span style={{ fontSize: 9, color: B.blue, marginLeft: 4 }}>{ev.eventCode}</span>}
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: B.red }}>{fmtDate(t.dueDate)}</div>
                    </div>
                  );
                })}
              </Card>
            )}

            {/* Today's Tasks */}
            <Card style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: B.forest }}>Today's Tasks ({todayTasks.length + inProgress.length})</div>
                <Btn v="ghost" sm onClick={() => setView("tasks")}>All Tasks</Btn>
              </div>
              {todayTasks.length === 0 && inProgress.length === 0 && <div style={{ fontSize: 12, color: B.muted, padding: "12px 0", fontStyle: "italic" }}>Nothing due today — a good time to look ahead or capture something from the quick bar above.</div>}
              {[...inProgress, ...todayTasks.filter(t => t.status !== "in_progress")].map(t => {
                const ev = events.find(e => e.id === t.eventId);
                const pri = t.priority === "high" ? B.red : t.priority === "low" ? B.muted : B.forest;
                return (
                  <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${B.cream}`, borderLeft: `3px solid ${pri}`, paddingLeft: 8 }}>
                    <div style={{ ...S.flexC, flex: 1 }}>
                      <input type="checkbox" onChange={() => save({ tasks: tasks.map(x => x.id === t.id ? { ...x, status: "done" } : x) })} style={{ cursor: "pointer" }} />
                      <div>
                        <span style={{ fontWeight: 500, fontSize: 12 }}>{t.title}</span>
                        {t.notes && <div style={{ ...S.sm, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.notes}</div>}
                      </div>
                    </div>
                    <div style={{ ...S.flexC, flexShrink: 0 }}>
                      {ev && <Badge color={B.blue}>{ev.eventCode}</Badge>}
                      <span style={S.sm}>{t.assignee}</span>
                      <select value={t.status} onChange={e => save({ tasks: tasks.map(x => x.id === t.id ? { ...x, status: e.target.value } : x) })} style={{ fontSize: 9, padding: "2px 3px", border: `1px solid ${B.creamD}`, borderRadius: 3, fontFamily: "inherit" }}>
                        <option value="todo">To Do</option><option value="in_progress">Working</option><option value="done">Done</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </Card>

            {/* Next Event — Your North Star */}
            {nextEvent && (() => {
              const daysTo = Math.round((new Date(nextEvent.date + "T12:00:00") - today) / 864e5);
              const urgency = daysTo <= 3 ? B.gold : daysTo <= 7 ? B.sage : B.forest;
              return (
              <Card style={{ background: `linear-gradient(135deg, ${B.cream}, ${B.white})`, borderLeft: `3px solid ${urgency}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: B.muted, textTransform: "uppercase", letterSpacing: 1.5 }}>Next Event</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: B.forest, marginTop: 3, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{nextEvent.eventCode || nextEvent.clientName}</div>
                    <div style={S.xs}>{fmtDateFull(nextEvent.date)} — {nextEvent.venue}</div>
                    <div style={{ marginTop: 6 }}>
                      <Badge color={TIERS[nextEvent.tier]?.color}>{TIERS[nextEvent.tier]?.label}</Badge>
                      <span style={{ fontSize: 12, fontWeight: 600, marginLeft: 8 }}>{fmt$(nextEvent.contractTotal)}</span>
                    </div>
                  </div>
                  <div style={{ ...S.center, minWidth: 60 }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: urgency, fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1 }}>{daysTo}</div>
                    <div style={{ fontSize: 9, color: B.muted, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{daysTo === 1 ? "day" : "days"}</div>
                  </div>
                </div>
              </Card>);
            })()}
          </div>
        )}

        {/* ═══ WEEK TAB ═══ */}
        {section === "week" && (
          <div>
            {/* Week Milestones */}
            {weekMilestones.length > 0 && (
              <Card style={{ marginBottom: 14, borderLeft: `3px solid ${B.blue}` }}>
                <div style={S.labelLg}>This Week's Milestones</div>
                {weekMilestones.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${B.cream}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14 }}>{m.icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>{m.label}</div>
                        <div style={S.sm}>{m.event.eventCode || m.event.clientName} — {m.daysOut === 0 ? "Today" : `in ${m.daysOut}d`}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 3 }}>
                      <Btn v="ghost" sm onClick={() => milestoneToTask(m)}>+ Task</Btn>
                      <Btn v="gold" sm onClick={() => milestoneToAssignment(m)}>+ Assign</Btn>
                    </div>
                  </div>
                ))}
              </Card>
            )}

            {/* 7-Day Grid */}
            <div style={{ display: "grid", gridTemplateColumns: isMob ? "repeat(3, 1fr)" : "repeat(7, 1fr)", gap: 6, marginBottom: 14 }}>
              {next7.map(d => (
                <div key={d.iso} style={{ background: d.isToday ? B.greenL : B.white, border: `1px solid ${d.isToday ? B.green + "40" : B.creamD}`, borderRadius: 6, padding: 8, minHeight: 90 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: d.isToday ? B.forest : B.muted, marginBottom: 6 }}>{d.label}</div>
                  {d.dayEvents.map(ev => (
                    <div key={ev.id} onClick={() => setView("events")} style={{ fontSize: 9, fontWeight: 600, background: B.forest, color: B.white, padding: "2px 5px", borderRadius: 3, marginBottom: 3, cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>★ {ev.eventCode || ev.clientName}</div>
                  ))}
                  {d.dayTasks.slice(0, 3).map(t => (
                    <div key={t.id} style={{ fontSize: 9, color: t.priority === "high" ? B.red : B.text, padding: "1px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.priority === "high" ? "! " : "· "}{t.title}</div>
                  ))}
                  {d.dayTasks.length > 3 && <div style={{ fontSize: 8, color: B.muted }}>+{d.dayTasks.length - 3} more</div>}
                </div>
              ))}
            </div>

            {/* Upcoming Events List */}
            <Card>
              <div style={S.labelLg}>Upcoming Events</div>
              {events.filter(e => new Date(e.date + "T12:00:00") >= today).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 8).map(e => {
                const days = Math.ceil((new Date(e.date + "T12:00:00") - today) / 864e5);
                return (
                  <div key={e.id} onClick={() => setView("events")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${B.cream}`, cursor: "pointer" }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{e.eventCode || e.clientName}</div>
                      <div style={S.xs}>{fmtDateFull(e.date)} — {e.venue}</div>
                    </div>
                    <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 8 }}>
                      <Badge color={TIERS[e.tier]?.color}>{TIERS[e.tier]?.label}</Badge>
                      <div><div style={{ fontSize: 13, fontWeight: 600 }}>{fmt$(e.contractTotal)}</div><div style={{ fontSize: 10, color: days <= 7 ? B.gold : B.muted }}>{days}d</div></div>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        )}

        {/* ═══ BUSINESS TAB ═══ */}
        {section === "health" && (
          <div>
            {/* Revenue Compass */}
            <Card style={{ marginBottom: 16, background: `linear-gradient(135deg, ${B.cream}, ${B.white})`, padding: 18, borderLeft: `3px solid ${totalContract >= yearTarget ? B.green : B.gold}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: B.forest, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>2026 Revenue</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: B.forest }}>{fmt$(totalContract)} <span style={{ fontWeight: 400, color: B.muted, fontSize: 12 }}>/ {fmt$(yearTarget)}</span></span>
              </div>
              <ProgressBar value={totalContract} max={yearTarget} color={totalContract >= yearTarget ? B.green : B.gold} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: B.muted, marginTop: 2 }}>
                <span>{Math.round((totalContract / yearTarget) * 100)}% of target</span>
                <span>{totalContract >= yearTarget ? "Target reached!" : `${fmt$(yearTarget - totalContract)} to go`}</span>
              </div>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: isMob ? "repeat(2, 1fr)" : "repeat(5, 1fr)", gap: isMob ? 8 : 12, marginBottom: 20 }}>
              <Stat label="Booked Revenue" value={fmt$(totalContract)} />
              <Stat label="Events Booked" value={ec} sub={`${full.length}F / ${mid.length}M / ${partial.length}P`} />
              <Stat label="Avg Event Value" value={fmt$(avgVal)} color={avgVal >= 5000 ? B.green : B.gold} />
              <Stat label="Overhead / Event" value={fmt$(overheadPerEvent)} sub={`Annual: ${fmt$(ANNUAL_OVERHEAD)}`} />
              <Stat label="Open Tasks" value={openTasks.length} sub={`${(data.assignments || []).filter(a => a.status === "active").length} active assignments`} color={openTasks.length > 15 ? B.red : B.forest} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "5fr 3fr", gap: isMob ? 12 : 20 }}>
              <Card>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: B.forest }}>Revenue by Tier</div>
                {[{ l: "Full", d: full, c: B.forest }, { l: "Mid", d: mid, c: B.gold }, { l: "Partial", d: partial, c: B.sage }].map(t => {
                  const rev = t.d.reduce((s, e) => s + (e.contractTotal || 0), 0);
                  return (
                    <div key={t.l} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}><span style={{ fontWeight: 500 }}>{t.l} ({t.d.length})</span><span style={{ fontWeight: 600 }}>{fmt$(rev)}</span></div>
                      <div style={{ height: 5, background: B.cream, borderRadius: 3 }}><div style={{ height: "100%", background: t.c, borderRadius: 3, width: totalContract > 0 ? `${(rev / totalContract) * 100}%` : "0%" }} /></div>
                    </div>
                  );
                })}
              </Card>
              <Card>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: B.forest }}>P&L Snapshot</div>
                <div style={{ fontSize: 12, display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span>Revenue</span><span style={{ fontWeight: 600 }}>{fmt$(totalContract)}</span></div>
                <div style={{ fontSize: 12, display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span>COGS (actual + est)</span><span style={{ fontWeight: 600, color: B.red }}>{fmt$(totalCOGS)}</span></div>
                <div style={{ fontSize: 12, display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span>Gross Profit</span><span style={{ fontWeight: 600, color: B.green }}>{fmt$(totalContract - totalCOGS)}</span></div>
                <div style={{ height: 1, background: B.creamD, margin: "8px 0" }} />
                <div style={{ fontSize: 12, display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span>Overhead</span><span style={{ fontWeight: 600 }}>{fmt$(ANNUAL_OVERHEAD)}</span></div>
                <div style={{ fontSize: 12, display: "flex", justifyContent: "space-between" }}><span>Net (est)</span><span style={{ fontWeight: 700, color: (totalContract - totalCOGS - ANNUAL_OVERHEAD) > 0 ? B.green : B.red }}>{fmt$(totalContract - totalCOGS - ANNUAL_OVERHEAD)}</span></div>
              </Card>
            </div>

            {/* Monthly Spread */}
            <Card style={{ marginTop: 16 }}>
              <div style={{ ...S.label, marginBottom: 10 }}>Monthly Event Spread</div>
              <div style={{ overflowX: isMob ? "auto" : "visible" }}>
              <div style={{ display: "grid", gridTemplateColumns: isMob ? "repeat(12, 50px)" : "repeat(12, 1fr)", gap: 4 }}>
                {Array.from({ length: 12 }, (_, m) => {
                  const mEvents = events.filter(e => e.date && new Date(e.date + "T12:00:00").getMonth() === m);
                  const mRev = mEvents.reduce((s, e) => s + (e.contractTotal || 0), 0);
                  const maxRev = Math.max(...Array.from({ length: 12 }, (_, i) => events.filter(e => e.date && new Date(e.date + "T12:00:00").getMonth() === i).reduce((s, e) => s + (e.contractTotal || 0), 0)), 1);
                  return (
                    <div key={m} style={S.center}>
                      <div style={{ height: 60, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                        <div style={{ width: "70%", background: mEvents.length > 0 ? B.forest : B.creamD, borderRadius: "3px 3px 0 0", height: `${Math.max((mRev / maxRev) * 100, 4)}%` }} />
                      </div>
                      <div style={{ fontSize: 8, color: B.muted, marginTop: 2 }}>{["J","F","M","A","M","J","J","A","S","O","N","D"][m]}</div>
                      <div style={{ fontSize: 8, fontWeight: 600, color: B.forest }}>{mEvents.length}</div>
                    </div>
                  );
                })}
              </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
function Clients({ data, save, setSidePanel, confirmDelete }) {
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", eventDate: "", venue: "", tier: "", notes: "", referralSource: "", guestCount: "" });
  const addClient = () => {
    if (!form.name || !form.eventDate) return;
    save({ clients: [...data.clients, { ...form, id: uid(), status: "inquiry", quoteTotal: 0, addOns: [], lineItems: [], createdAt: Date.now(), leadSource: form.referralSource, guestCount: safeNum(form.guestCount) || 0 }] });
    setForm({ name: "", email: "", phone: "", eventDate: "", venue: "", tier: "", notes: "", referralSource: "", guestCount: "" }); setShowNew(false);
  };
  const openQuote = (c) => setSidePanel({ title: `Quote: ${c.name}`, content: <QuoteBuilder client={c} data={data} save={save} close={() => setSidePanel(null)} confirmDelete={confirmDelete} /> });
  const exportClients = () => downloadCSV("gg-clients.csv", ["Name", "Email", "Phone", "Event Date", "Venue", "Tier", "Status", "Quote Total"], data.clients.map(c => [c.name, c.email, c.phone, c.eventDate, c.venue, TIERS[c.tier]?.label || c.tier, c.status, c.quoteTotal]));
  const cols = [{ key: "inquiry", label: "Inquiries", color: B.blue }, { key: "quoted", label: "Quoted", color: B.gold }, { key: "booked", label: "Booked", color: B.green }, { key: "completed", label: "Completed", color: B.sage }];

  return (
    <div>
      <PageHead title="Clients & Quotes" sub="Pipeline: Inquiry → Quote → Book → Complete" right={<><Btn onClick={() => setShowNew(true)}>+ New Inquiry</Btn>{data.clients.length > 0 && <Btn v="secondary" sm onClick={exportClients}>Export CSV</Btn>}</>} />
      <div style={S.page}>
        {showNew && (
          <Card style={{ marginBottom: 20, borderLeft: `3px solid ${B.gold}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
              <Input label="Client Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
              <Input label="Event Date" value={form.eventDate} onChange={v => setForm(p => ({ ...p, eventDate: v }))} type="date" />
              <Input label="Email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} />
              <Input label="Phone" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} />
              <Input label="Venue" value={form.venue} onChange={v => setForm(p => ({ ...p, venue: v }))} />
              <Input label="Tier" value={form.tier} onChange={v => setForm(p => ({ ...p, tier: v }))} options={Object.entries(TIERS).map(([k, v]) => ({ value: k, label: v.label }))} />
              <Input label="Lead Source" value={form.referralSource} onChange={v => setForm(p => ({ ...p, referralSource: v }))} options={LEAD_SOURCES} />
              <Input label="Guest Count" value={form.guestCount} onChange={v => setForm(p => ({ ...p, guestCount: v }))} type="number" />
            </div>
            <Input label="Notes" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} textarea />
            <div style={S.flex}><Btn onClick={addClient}>Save</Btn><Btn v="ghost" onClick={() => setShowNew(false)}>Cancel</Btn></div>
          </Card>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {cols.map(sc => {
            const items = data.clients.filter(c => c.status === sc.key);
            return (
              <div key={sc.key}>
                <div style={{ fontSize: 11, fontWeight: 600, color: sc.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{sc.label} ({items.length})</div>
                {items.map(c => (
                  <Card key={c.id} onClick={() => openQuote(c)} style={{ marginBottom: 6, cursor: "pointer", borderLeft: `3px solid ${sc.color}`, padding: 12 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                    <div style={S.xs}>{fmtDate(c.eventDate)} — {c.venue || "TBD"}</div>
                    {c.quoteTotal > 0 && <div style={{ fontWeight: 600, marginTop: 3, color: B.forest }}>{fmt$(c.quoteTotal)}</div>}
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function QuoteBuilder({ client, data, save, close, confirmDelete }) {
  const [c, setC] = useState({ ...client });
  const [lines, setLines] = useState(client.lineItems || []);
  const [addOns, setAddOns] = useState(client.addOns || []);
  const tier = TIERS[c.tier] || {};
  const lineTotal = lines.reduce((s, l) => s + ((l.qty || 0) * (l.price || 0)), 0);
  const addOnTotal = addOns.reduce((s, a) => s + (a.price || 0), 0);
  const total = lineTotal + addOnTotal;
  const cogs = total * (tier.cogsRate || 0.45);
  const gross = total - cogs;
  const oh = Math.round(ANNUAL_OVERHEAD / Math.max(data.events.length, 18));
  const net = gross - oh;
  const linkedEst = (data.estimates || []).find(e => e.clientId === c.id);
  const targetMargin = data.budget?.targetMargin || 55;

  const importFromEstimate = () => {
    if (!linkedEst) return;
    setLines((linkedEst.items || []).map(i => ({ id: uid(), desc: i.piece || "Item", qty: i.qty || 1, price: i.priceCharged || 0 })));
  };
  const saveQuote = () => {
    const upd = data.clients.map(cl => cl.id === c.id ? { ...c, lineItems: lines, addOns, quoteTotal: total, status: c.status === "inquiry" ? "quoted" : c.status } : cl);
    save({ clients: upd });
  };
  const book = () => {
    const upd = data.clients.map(cl => cl.id === c.id ? { ...c, lineItems: lines, addOns, quoteTotal: total, status: "booked" } : cl);
    const code = c.name.split(/[\s,]+/).pop()?.toUpperCase() + "-26";
    const ev = { id: uid(), clientId: c.id, clientName: c.name, eventCode: code, date: c.eventDate, venue: c.venue, tier: c.tier, contractTotal: total, rangeLow: total, rangeHigh: total, depositConfirmed: false, finalPaymentConfirmed: false, flowerOrderPlaced: false, crewAssigned: [], arrivalTime: "", ceremonyTime: "", receptionTime: "", teardownTime: "", notes: c.notes, stage: "booked" };
    let estUpd = data.estimates || [];
    if (linkedEst) { estUpd = estUpd.map(e => e.id === linkedEst.id ? { ...e, eventId: ev.id } : e); }
    save({ clients: upd, events: [...data.events, ev], estimates: estUpd }); close();
  };
  const setStatus = (s) => { save({ clients: data.clients.map(cl => cl.id === c.id ? { ...cl, status: s } : cl) }); setC(p => ({ ...p, status: s })); };
  const deleteMe = () => confirmDelete("Delete this client?", () => { save({ clients: data.clients.filter(cl => cl.id !== c.id) }); close(); });

  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {["inquiry", "quoted", "booked", "completed"].map(s => (
          <Btn key={s} v={c.status === s ? "primary" : "secondary"} sm onClick={() => setStatus(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</Btn>
        ))}
      </div>
      <div style={S.grid2}>
        <Input label="Client" value={c.name} onChange={v => setC(p => ({ ...p, name: v }))} />
        <Input label="Date" value={c.eventDate} onChange={v => setC(p => ({ ...p, eventDate: v }))} type="date" />
        <Input label="Venue" value={c.venue} onChange={v => setC(p => ({ ...p, venue: v }))} />
        <Input label="Tier" value={c.tier} onChange={v => setC(p => ({ ...p, tier: v }))} options={Object.entries(TIERS).map(([k, v]) => ({ value: k, label: v.label }))} />
      </div>
      {linkedEst && (
        <div style={{ background: B.blueL, padding: 8, borderRadius: 6, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
          <span>Estimate linked: <strong>{linkedEst.eventName || "Untitled"}</strong></span>
          <Btn v="secondary" sm onClick={importFromEstimate}>Import Line Items</Btn>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, marginBottom: 6 }}><span style={{ fontWeight: 600, fontSize: 12 }}>Line Items</span><Btn v="secondary" sm onClick={() => setLines([...lines, { id: uid(), desc: "", qty: 1, price: 0 }])}>+ Add</Btn></div>
      {lines.map((l, idx) => (
        <div key={l.id} style={{ display: "grid", gridTemplateColumns: "2fr 50px 80px 24px", gap: 6, marginBottom: 4, alignItems: "end" }}>
          <Input value={l.desc} onChange={v => setLines(lines.map(x => x.id === l.id ? { ...x, desc: v } : x))} placeholder="Description" />
          <Input value={l.qty} onChange={v => setLines(lines.map(x => x.id === l.id ? { ...x, qty: safeNum(v) } : x))} type="number" />
          <Input value={l.price} onChange={v => setLines(lines.map(x => x.id === l.id ? { ...x, price: safeNum(v) } : x))} type="number" />
          <button onClick={() => setLines(lines.filter(x => x.id !== l.id))} style={{ background: "none", border: "none", cursor: "pointer", color: B.red, marginBottom: 10 }}>✕</button>
        </div>
      ))}
      <div style={{ fontWeight: 600, fontSize: 12, marginTop: 12, marginBottom: 6 }}>Add-Ons</div>
      {ADDONS.map(a => { const sel = addOns.find(s => s.id === a.id); return (
        <div key={a.id} style={{ ...S.flexC, padding: "3px 0", fontSize: 12 }}>
          <input type="checkbox" checked={!!sel} onChange={() => sel ? setAddOns(addOns.filter(x => x.id !== a.id)) : setAddOns([...addOns, { ...a, price: a.min }])} />
          <span style={{ flex: 1 }}>{a.label}</span><span style={{ color: B.muted, fontSize: 11 }}>{fmt$(a.min)}-{fmt$(a.max)}</span>
          {sel && <input type="number" value={sel.price} onChange={ev => setAddOns(addOns.map(x => x.id === a.id ? { ...x, price: Number(ev.target.value) } : x))} style={{ width: 60, padding: "3px 6px", border: `1px solid ${B.creamD}`, borderRadius: 4, fontSize: 11 }} />}
        </div>
      ); })}
      <Card style={{ background: B.cream, marginTop: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "4px 12px", fontSize: 12 }}>
          <span>Line Items:</span><span style={S.right}>{fmt$(lineTotal)}</span>
          <span>Add-Ons:</span><span style={S.right}>{fmt$(addOnTotal)}</span>
          <span style={{ fontWeight: 700, fontSize: 15, borderTop: `1px solid ${B.creamD}`, paddingTop: 6 }}>Quote Total:</span>
          <span style={{ fontWeight: 700, fontSize: 15, textAlign: "right", borderTop: `1px solid ${B.creamD}`, paddingTop: 6, color: B.forest }}>{fmt$(total)}</span>
        </div>
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${B.creamD}`, fontSize: 11 }}>
          <div>Est. COGS ({Math.round((tier.cogsRate || .45) * 100)}%): {fmt$(cogs)} | Gross: {fmt$(gross)} | OH alloc: {fmt$(oh)}</div>
          <div style={{ fontWeight: 600, color: net >= 0 ? B.green : B.red, marginTop: 2 }}>Net Contribution: {fmt$(net)}</div>
          {net < 0 && <div style={{ marginTop: 4, padding: 6, background: B.redL, borderRadius: 4, color: B.red, fontSize: 10 }}>Overhead-negative event. Review pricing.</div>}
        </div>
      </Card>
      <div style={{ ...S.flex, marginTop: 14, flexWrap: "wrap" }}>
        <Btn onClick={saveQuote}>Save Quote</Btn>
        {c.status !== "booked" && <Btn v="gold" onClick={book}>Book + Create Event</Btn>}
        <Btn v="ghost" onClick={close}>Close</Btn>
        <Btn v="danger" sm onClick={deleteMe} style={{ marginLeft: "auto" }}>Delete</Btn>
      </div>
    </div>
  );
}

function CalendarView({ data, setSidePanel, save, confirmDelete }) {
  const [mo, setMo] = useState(new Date().getMonth());
  const [yr, setYr] = useState(new Date().getFullYear());
  const fd = new Date(yr, mo, 1).getDay();
  const dim = new Date(yr, mo + 1, 0).getDate();
  const cells = [...Array(fd).fill(null), ...Array.from({ length: dim }, (_, i) => i + 1)];
  const moName = new Date(yr, mo).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const today = new Date();
  const isT = d => d && today.getDate() === d && today.getMonth() === mo && today.getFullYear() === yr;
  const evDay = d => { if (!d) return []; const ds = `${yr}-${String(mo + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; return data.events.filter(e => e.date === ds); };
  const prev = () => { if (mo === 0) { setMo(11); setYr(yr - 1); } else setMo(mo - 1); };
  const next = () => { if (mo === 11) { setMo(0); setYr(yr + 1); } else setMo(mo + 1); };
  const openEvent = (ev) => setSidePanel({ title: ev.eventCode || ev.clientName, content: <EventDetail ev={ev} data={data} save={save} close={() => setSidePanel(null)} confirmDelete={confirmDelete} /> });

  return (
    <div>
      <PageHead title="Calendar" sub="Event schedule" right={<Btn v="secondary" sm onClick={() => downloadICS(data.events)}>Download .ics Calendar</Btn>} />
      <div style={S.page}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Btn v="ghost" onClick={prev}>← Prev</Btn>
          <div style={{ fontSize: 17, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif", color: B.forest }}>{moName}</div>
          <Btn v="ghost" onClick={next}>Next →</Btn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, background: B.creamD, border: `1px solid ${B.creamD}`, borderRadius: 8, overflow: "hidden" }}>
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <div key={d} style={{ padding: 6, textAlign: "center", fontSize: 10, fontWeight: 600, color: B.muted, background: B.cream }}>{d}</div>)}
          {cells.map((d, i) => { const evs = evDay(d); return (
            <div key={i} style={{ minHeight: 80, padding: 4, background: B.white }}>
              {d && <><div style={{ fontSize: 11, fontWeight: isT(d) ? 700 : 400, color: isT(d) ? B.forest : B.text, ...(isT(d) ? { background: B.gold + "30", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" } : {}) }}>{d}</div>
              {evs.map(e => <div key={e.id} onClick={() => openEvent(e)} style={{ fontSize: 9, padding: "1px 3px", borderRadius: 2, marginTop: 1, background: (TIERS[e.tier]?.color || B.sage) + "15", color: TIERS[e.tier]?.color, fontWeight: 500, cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.clientName}</div>)}</>}
            </div>
          ); })}
        </div>
        <div style={{ ...S.sm, marginTop: 8, textAlign: "center" }}>Download .ics file above to import into Google Calendar, Apple Calendar, or Outlook. Share the file so team members can subscribe.</div>
      </div>
    </div>
  );
}

function Events({ data, save, setSidePanel, confirmDelete, isMob }) {
  const [sort, setSort] = useState("date");
  const openEvent = (e) => setSidePanel({ title: e.eventCode || e.clientName, content: <EventDetail ev={e} data={data} save={save} close={() => setSidePanel(null)} confirmDelete={confirmDelete} /> });
  const upcoming = data.events.filter(e => new Date(e.date) >= new Date());
  const past = data.events.filter(e => new Date(e.date) < new Date()).sort((a, b) => new Date(b.date) - new Date(a.date));
  const sorted = [...upcoming].sort((a, b) => sort === "date" ? new Date(a.date) - new Date(b.date) : sort === "value" ? (b.contractTotal || 0) - (a.contractTotal || 0) : (a.eventCode || "").localeCompare(b.eventCode || ""));
  const exportEvents = () => downloadCSV("gg-events-2026.csv", ["Event Code", "Client", "Date", "Venue", "Tier", "Contract", "Range Low", "Range High", "Deposit", "Final", "Flower Order", "Arrival", "Ceremony", "Reception", "Teardown"], data.events.map(e => [e.eventCode, e.clientName, e.date, e.venue, TIERS[e.tier]?.label, e.contractTotal, e.rangeLow, e.rangeHigh, e.depositConfirmed ? "Y" : "N", e.finalPaymentConfirmed ? "Y" : "N", e.flowerOrderPlaced ? "Y" : "N", e.arrivalTime, e.ceremonyTime, e.receptionTime, e.teardownTime]));

  return (
    <div>
      <PageHead title="Event Planner" sub={`${upcoming.length} upcoming, ${past.length} past`} right={<><select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "5px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 11 }}><option value="date">Sort: Date</option><option value="value">Sort: Value</option><option value="name">Sort: Name</option></select><Btn v="secondary" sm onClick={exportEvents}>Export CSV</Btn></>} />
      <div style={S.page}>
        <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "repeat(2, 1fr)", gap: 12, marginBottom: 24 }}>
          {sorted.map(e => {
            const days = Math.ceil((new Date(e.date) - new Date()) / 864e5);
            const eTasks = data.tasks.filter(t => t.eventId === e.id);
            const done = eTasks.filter(t => t.status === "done").length;
            const eCosts = data.jobCosts.filter(j => j.eventId === e.id).reduce((s, j) => s + (j.amount || 0), 0);
            const eEst = (data.estimates || []).find(est => est.eventId === e.id);
            const eEstCOGS = eEst ? (eEst.items || []).reduce((s, i) => s + (i.flowerCost || 0) + (i.laborCost || 0) + (i.supplyCost || 0), 0) : 0;
            const useCOGS = eCosts || eEstCOGS;
            const margin = e.contractTotal > 0 && useCOGS > 0 ? Math.round(((e.contractTotal - useCOGS) / e.contractTotal) * 100) : null;
            return (
              <Card key={e.id} onClick={() => openEvent(e)} style={{ cursor: "pointer", borderLeft: `3px solid ${days <= 7 ? B.gold : B.forest}`, padding: 14 }}>
                <div style={S.row}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{e.eventCode || e.clientName}</span>
                  <Badge color={days <= 7 ? B.gold : B.sage}>{days}d</Badge>
                </div>
                <div style={S.xs}>{fmtDateFull(e.date)} — {e.venue}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 6 }}>
                  <span>{fmt$(e.contractTotal)} <Badge color={TIERS[e.tier]?.color}>{TIERS[e.tier]?.label}</Badge></span>
                  <span style={{ color: B.muted }}>{done}/{eTasks.length} tasks</span>
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                  {(() => {
                    const stage = EVENT_STAGES.find(s => s.key === (e.stage || "booked"));
                    return stage ? <Badge color={stage.color}>{stage.label}</Badge> : null;
                  })()}
                  {margin !== null && <Badge color={margin >= 45 ? B.green : margin >= 30 ? B.gold : B.red}>{margin}% margin</Badge>}
                  {useCOGS > 0 && <Badge color={eCosts > 0 ? B.sage : B.muted}>{eCosts > 0 ? "Actual" : "Est"} {fmt$(useCOGS)}</Badge>}
                  {(() => {
                    const pmts = e.payments || [];
                    const overdue = pmts.filter(p => !p.paidDate && p.dueDate && new Date(p.dueDate) < new Date());
                    return overdue.length > 0 ? <Badge color={B.red}>Payment overdue</Badge> : null;
                  })()}
                  {!e.flowerOrderPlaced && days <= 14 && <Badge color={B.gold}>No order</Badge>}
                </div>
              </Card>
            );
          })}
        </div>
        {past.length > 0 && <><div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: B.sage }}>Past Events</div>{past.map(e => (
          <div key={e.id} onClick={() => openEvent(e)} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${B.cream}`, cursor: "pointer", fontSize: 12 }}>
            <span>{e.eventCode} — {fmtDate(e.date)} — {e.venue}</span><span style={{ fontWeight: 600 }}>{fmt$(e.contractTotal)}</span>
          </div>
        ))}</>}
      </div>
    </div>
  );
}

function CostTracker({ eventId, data, save }) {
  const costs = data.jobCosts.filter(j => j.eventId === eventId);
  const [open, setOpen] = useState(costs.length > 0);
  const [nc, setNc] = useState({ category: "flowers", vendor: "", desc: "", amount: 0 });
  const total = costs.reduce((s, c) => s + (c.amount || 0), 0);
  const cats = [{ value: "flowers", label: "Flowers" }, { value: "supplies_fresh", label: "Supplies/Fresh" }, { value: "supplies", label: "Supplies" }, { value: "labor", label: "Labor" }, { value: "mileage", label: "Mileage" }, { value: "rentals", label: "Rentals" }, { value: "other", label: "Other" }];
  const addCost = () => { if (!nc.amount) return; save({ jobCosts: [...data.jobCosts, { ...nc, id: uid(), eventId, amount: safeNum(nc.amount), date: Date.now() }] }); setNc({ category: "flowers", vendor: "", desc: "", amount: 0 }); };
  const rmCost = (id) => save({ jobCosts: data.jobCosts.filter(j => j.id !== id) });
  return (
    <div style={{ marginBottom: 12 }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "6px 0", background: "none", border: "none", borderBottom: `1px solid ${B.creamD}`, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, color: B.forest }}>
        <span>Production Costs ({costs.length}){total > 0 && ` — ${fmt$(total)}`}</span>
        <span style={S.sm}>{open ? "▾" : "▸"}</span>
      </button>
      {open && (<div style={{ padding: "8px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 60px", gap: "0 6px", marginBottom: 6 }}>
          <Input label="Category" value={nc.category} onChange={v => setNc(p => ({ ...p, category: v }))} options={cats} />
          <Input label="Description" value={nc.desc} onChange={v => setNc(p => ({ ...p, desc: v }))} />
          <Input label="$" value={nc.amount} onChange={v => setNc(p => ({ ...p, amount: v }))} type="number" />
        </div>
        <div style={{ ...S.flex, marginBottom: 8 }}>
          <Input value={nc.vendor} onChange={v => setNc(p => ({ ...p, vendor: v }))} placeholder="Vendor (optional)" />
          <Btn sm onClick={addCost}>+ Add</Btn>
        </div>
        {costs.map(c => (
          <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: `1px solid ${B.cream}`, fontSize: 11 }}>
            <div><Badge color={B.sage}>{c.category}</Badge> {c.desc || c.vendor}</div>
            <div style={S.flexC}><span style={{ fontWeight: 600 }}>{fmt$(c.amount)}</span><button onClick={() => rmCost(c.id)} style={S.rmBtn}>✕</button></div>
          </div>
        ))}
        {costs.length > 0 && <div style={{ textAlign: "right", marginTop: 6, fontWeight: 700, fontSize: 12 }}>Total: {fmt$(total)}</div>}
      </div>)}
    </div>
  );
}

function EventDetail({ ev, data, save, close, confirmDelete }) {
  const [e, setE] = useState({ ...ev });
  const [newCrew, setNewCrew] = useState("");
  const [newPayment, setNewPayment] = useState({ label: "Deposit", amount: "", dueDate: "", paidDate: "" });
  const [dirty, setDirty] = useState(false);
  const eRef = useRef(e);
  eRef.current = e;
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

  // Auto-save when panel closes or component unmounts
  useEffect(() => {
    return () => {
      if (dirtyRef.current) {
        save({ events: data.events.map(x => x.id === eRef.current.id ? eRef.current : x) });
      }
    };
  }, []);

  const markDirty = (updater) => { setE(updater); setDirty(true); };
  const eTasks = data.tasks.filter(t => t.eventId === e.id);
  const linkedEst = (data.estimates || []).find(est => est.eventId === e.id);
  const actualCOGS = data.jobCosts.filter(j => j.eventId === e.id).reduce((s, j) => s + (j.amount || 0), 0);
  const estCOGS = linkedEst ? (linkedEst.items || []).reduce((s, i) => s + (i.flowerCost || 0) + (i.laborCost || 0) + (i.supplyCost || 0), 0) : 0;
  const payments = e.payments || [];
  const totalPaid = payments.filter(p => p.paidDate).reduce((s, p) => s + (p.amount || 0), 0);
  const balance = (e.contractTotal || 0) - totalPaid;
  const guestCount = e.guestCount || 0;
  const estTables = guestCount > 0 ? Math.ceil(guestCount / 8) : 0;

  const saveE = () => { save({ events: data.events.map(x => x.id === e.id ? e : x) }); setDirty(false); };
  const addCrew = () => { if (!newCrew.trim()) return; markDirty(p => ({ ...p, crewAssigned: [...(p.crewAssigned || []), newCrew.trim()] })); setNewCrew(""); };
  const removeCrew = (name) => markDirty(p => ({ ...p, crewAssigned: (p.crewAssigned || []).filter(c => c !== name) }));
  const addPayment = () => { if (!newPayment.amount) return; markDirty(p => ({ ...p, payments: [...(p.payments || []), { ...newPayment, id: uid(), amount: safeNum(newPayment.amount) }] })); setNewPayment({ label: "Balance", amount: "", dueDate: "", paidDate: "" }); };
  const togglePaymentPaid = (pid) => markDirty(p => ({ ...p, payments: (p.payments || []).map(pm => pm.id === pid ? { ...pm, paidDate: pm.paidDate ? "" : new Date().toISOString().slice(0, 10) } : pm) }));
  const rmPayment = (pid) => markDirty(p => ({ ...p, payments: (p.payments || []).filter(pm => pm.id !== pid) }));
  const genTasks = () => {
    const evDate = new Date(e.date);
    const rel = (days) => { const d = new Date(evDate); d.setDate(d.getDate() + days); return toISO(d); };
    const wf = [
      { title: "Define scope & vision", assignee: "Lindsay", scheduledDate: rel(-60), status: "backlog" },
      { title: "Build estimate / COGS sheet", assignee: "Lindsay", scheduledDate: rel(-56), status: "backlog" },
      { title: "Price with margin calc", assignee: "Lindsay", scheduledDate: rel(-56), status: "backlog" },
      { title: "Send proposal to client", assignee: "Lindsay", scheduledDate: rel(-50), status: "backlog" },
      { title: "Collect signed contract", assignee: "Lindsay", scheduledDate: rel(-45), status: "backlog" },
      { title: "Collect deposit payment", assignee: "Lindsay", scheduledDate: rel(-45), status: "backlog" },
      { title: "Create floral recipes", assignee: "Lindsay", scheduledDate: rel(-21), status: "backlog" },
      { title: "Convert recipes to stem counts", assignee: "Lindsay", scheduledDate: rel(-18), status: "backlog" },
      { title: "Place wholesale flower order", assignee: "Lindsay", scheduledDate: rel(-10), status: "backlog" },
      { title: "Confirm rental inventory available", assignee: "Lindsay", scheduledDate: rel(-14), status: "backlog" },
      { title: "Pre-event supply & mechanics check", assignee: "Lindsay", scheduledDate: rel(-3), status: "backlog" },
      { title: "Receive & condition flowers", assignee: "Lindsay", scheduledDate: rel(-2), status: "backlog" },
      { title: "Production day build", assignee: "Lindsay", scheduledDate: rel(-1), status: "backlog" },
      { title: "Vehicle load-out", assignee: "Mac", scheduledDate: rel(-1), status: "backlog" },
      { title: "On-site setup & install", assignee: "Lindsay", scheduledDate: e.date, status: "backlog" },
      { title: "Teardown & return", assignee: "Mac", scheduledDate: e.date, status: "backlog" },
      { title: "Cleanup & shop reset", assignee: "Lindsay", scheduledDate: rel(1), status: "backlog" },
      { title: "Log all hours", assignee: "Mac", scheduledDate: rel(1), status: "backlog" },
      { title: "Log actual job costs", assignee: "Mac", scheduledDate: rel(2), status: "backlog" },
      { title: "Collect final payment", assignee: "Lindsay", scheduledDate: rel(3), status: "backlog" },
      { title: "Request photos from photographer", assignee: "Lindsay", scheduledDate: rel(7), status: "backlog" },
      { title: "Request review / testimonial", assignee: "Lindsay", scheduledDate: rel(14), status: "backlog" },
      { title: "Close out event", assignee: "Mac", scheduledDate: rel(14), status: "backlog" },
    ].map(t => ({ ...t, id: uid(), eventId: e.id, dueDate: e.date, priority: "normal", category: "production", notes: "", createdAt: Date.now() }));
    save({ tasks: [...data.tasks, ...wf] });
  };

  // Auto-generate SOP assignments for key production phases
  const genAssignments = () => {
    const existing = (data.assignments || []).filter(a => a.eventId === e.id);
    const doGen = () => {
      const evDate = new Date(e.date);
      const rel = (days) => { const d = new Date(evDate); d.setDate(d.getDate() + days); return toISO(d); };
      const phases = [
        { templateKey: "Conditioning/Receiving", role: "Production Assistant", date: rel(-2), notes: "Receive & condition wholesale flowers" },
        { templateKey: "Studio Production", role: "Lead Designer", date: rel(-1), notes: "Production day build" },
        { templateKey: "Load-Out", role: "General Support", date: rel(-1), notes: "Vehicle load-out" },
        { templateKey: "Setup/Install", role: "Lead Designer", date: e.date, notes: "On-site setup & install" },
        { templateKey: "Strike/Teardown", role: "Strike Crew", date: e.date, notes: "Teardown & return" },
        { templateKey: "Post-Event Closure", role: "General Support", date: rel(1), notes: "Cleanup, hours, costs" },
      ];
      const newAssignments = phases.filter(p => getTemplates(data)[p.templateKey]).map(p => ({
        id: uid(), person: p.role === "Lead Designer" ? "Lindsay" : "Mac", eventId: e.id,
        eventName: e.eventCode || e.clientName, role: p.role, date: p.date, status: "active",
        checklist: getTemplates(data)[p.templateKey].map(item => ({ id: uid(), title: item.title, sop: item.sop, done: false, doneAt: null, fromTemplate: true })),
        notes: p.notes, hoursLogged: 0, createdAt: Date.now(),
      }));
      save({ assignments: [...(data.assignments || []), ...newAssignments] });
    };
    if (existing.length > 0 && confirmDelete) {
      confirmDelete(`This event already has ${existing.length} assignment(s). Add another full set?`, doGen);
    } else { doGen(); }
  };

  const deleteEvent = () => {
    if (!confirmDelete) return;
    confirmDelete("Delete this event and all linked tasks, costs, and assignments?", () => {
      save({ events: data.events.filter(x => x.id !== e.id), tasks: data.tasks.filter(t => t.eventId !== e.id), jobCosts: data.jobCosts.filter(j => j.eventId !== e.id), assignments: (data.assignments || []).filter(a => a.eventId !== e.id) }); close();
    });
  };

  return (
    <div>
      <Card style={{ background: B.cream, marginBottom: 14, padding: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: B.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Financial Snapshot</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, fontSize: 12 }}>
          <div><div style={{ color: B.muted }}>Contract</div><div style={{ fontWeight: 700, fontSize: 14 }}>{fmt$(e.contractTotal)}</div></div>
          <div><div style={{ color: B.muted }}>Est. COGS</div><div style={{ fontWeight: 600 }}>{estCOGS > 0 ? fmt$(estCOGS) : <span style={{ color: B.gold, fontSize: 10 }}>No estimate</span>}</div></div>
          <div><div style={{ color: B.muted }}>Actual COGS</div><div style={{ fontWeight: 600, color: actualCOGS > estCOGS && estCOGS > 0 ? B.red : B.text }}>{fmt$(actualCOGS)}</div></div>
          <div><div style={{ color: B.muted }}>Margin</div><div style={{ fontWeight: 700, color: e.contractTotal > 0 && (e.contractTotal - (actualCOGS || estCOGS)) / e.contractTotal >= 0.45 ? B.green : (e.contractTotal > 0 ? B.gold : B.muted) }}>{e.contractTotal > 0 ? Math.round(((e.contractTotal - (actualCOGS || estCOGS)) / e.contractTotal) * 100) : 0}%</div></div>
        </div>
        {totalPaid > 0 && <div style={{ marginTop: 6, fontSize: 11, borderTop: `1px solid ${B.creamD}`, paddingTop: 6, display: "flex", justifyContent: "space-between" }}><span>Paid: {fmt$(totalPaid)}</span><span style={{ fontWeight: 600, color: balance > 0 ? B.gold : B.green }}>Balance: {fmt$(balance)}</span></div>}
      </Card>

      {/* Production Costs */}
      <CostTracker eventId={e.id} data={data} save={save} />
      <div style={S.grid2}>
        <Input label="Event Code" value={e.eventCode} onChange={v => markDirty(p => ({ ...p, eventCode: v }))} />
        <Input label="Date" value={e.date} onChange={v => markDirty(p => ({ ...p, date: v }))} type="date" />
        <Input label="Venue" value={e.venue} onChange={v => markDirty(p => ({ ...p, venue: v }))} />
        <Input label="Contract Total" value={e.contractTotal} onChange={v => markDirty(p => ({ ...p, contractTotal: safeNum(v) }))} type="number" />
        <Input label="Guest Count" help="Affects table/centerpiece estimates" value={e.guestCount || ""} onChange={v => markDirty(p => ({ ...p, guestCount: safeNum(v) }))} type="number" />
        <Input label="Event Stage" value={e.stage || "booked"} onChange={v => markDirty(p => ({ ...p, stage: v }))} options={EVENT_STAGES.map(s => ({ value: s.key, label: s.label }))} />
      </div>
      {guestCount > 0 && (
        <div style={{ background: B.blueL, padding: 8, borderRadius: 6, marginBottom: 10, fontSize: 11 }}>
          {guestCount} guests ≈ <strong>{estTables}</strong> tables (8/table) ≈ <strong>{estTables}</strong> centerpieces needed
        </div>
      )}
      {/* Event Day Timeline */}
      <div style={{ fontSize: 11, fontWeight: 600, color: B.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, marginTop: 4 }}>Event Day Timeline</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0 10px" }}>
        <Input label="Arrival" help="Team arrival for setup" value={e.arrivalTime} onChange={v => markDirty(p => ({ ...p, arrivalTime: v }))} type="time" />
        <Input label="Ceremony" value={e.ceremonyTime} onChange={v => markDirty(p => ({ ...p, ceremonyTime: v }))} type="time" />
        <Input label="Reception" value={e.receptionTime} onChange={v => markDirty(p => ({ ...p, receptionTime: v }))} type="time" />
        <Input label="Teardown" help="Contracted removal time" value={e.teardownTime} onChange={v => markDirty(p => ({ ...p, teardownTime: v }))} type="time" />
      </div>
      <div style={{ display: "flex", gap: 10, margin: "6px 0 10px", flexWrap: "wrap" }}>
        {[["flowerOrderPlaced", "Flower Order Placed"]].map(([k, l]) => (
          <label key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}><input type="checkbox" checked={e[k]} onChange={ev => markDirty(p => ({ ...p, [k]: ev.target.checked }))} />{l}</label>
        ))}
      </div>
      {/* Payment Milestones */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: B.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Payment Schedule</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: balance > 0 ? B.gold : B.green }}>Balance: {fmt$(balance)}</span>
        </div>
        {payments.map(pm => (
          <div key={pm.id} style={{ ...S.flexC, padding: "4px 0", borderBottom: `1px solid ${B.cream}`, fontSize: 12 }}>
            <input type="checkbox" checked={!!pm.paidDate} onChange={() => togglePaymentPaid(pm.id)} />
            <span style={{ flex: 1, textDecoration: pm.paidDate ? "line-through" : "none", color: pm.paidDate ? B.muted : B.text }}>{pm.label}</span>
            <span style={{ fontWeight: 600, minWidth: 60 }}>{fmt$(pm.amount)}</span>
            <span style={{ ...S.sm, minWidth: 70 }}>{pm.dueDate ? `due ${fmtDate(pm.dueDate)}` : ""}</span>
            {pm.paidDate && <Badge color={B.green}>Paid {fmtDate(pm.paidDate)}</Badge>}
            <button onClick={() => rmPayment(pm.id)} style={S.rmBtn}>✕</button>
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 90px 24px", gap: 4, marginTop: 6, alignItems: "end" }}>
          <Input value={newPayment.label} onChange={v => setNewPayment(p => ({ ...p, label: v }))} options={["Deposit", "Second Payment", "Final Balance", "Custom"]} />
          <Input value={newPayment.amount} onChange={v => setNewPayment(p => ({ ...p, amount: v }))} type="number" placeholder="$" />
          <Input value={newPayment.dueDate} onChange={v => setNewPayment(p => ({ ...p, dueDate: v }))} type="date" />
          <Btn v="secondary" sm onClick={addPayment} style={{ marginBottom: 10 }}>+</Btn>
        </div>
        {payments.length === 0 && totalPaid === 0 && <div style={S.sm}>Add deposit, second payment, and final balance milestones</div>}
      </div>
      <Input label="Notes" value={e.notes} onChange={v => markDirty(p => ({ ...p, notes: v }))} textarea />

      {/* Post-Event Closure */}
      {(e.stage === "complete" || e.stage === "closed" || (e.date && new Date(e.date) < new Date())) && (
        <Card style={{ marginTop: 12, borderLeft: `3px solid ${e.stage === "closed" ? B.sage : B.gold}`, padding: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: B.forest, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Post-Event Closure</div>
          <div style={S.grid3}>
            <label style={S.checkRow}><input type="checkbox" checked={e.photosCollected || false} onChange={ev => markDirty(p => ({ ...p, photosCollected: ev.target.checked }))} />Photos collected</label>
            <label style={S.checkRow}><input type="checkbox" checked={e.reviewRequested || false} onChange={ev => markDirty(p => ({ ...p, reviewRequested: ev.target.checked }))} />Review requested</label>
            <label style={S.checkRow}><input type="checkbox" checked={e.rentalsReturned || false} onChange={ev => markDirty(p => ({ ...p, rentalsReturned: ev.target.checked }))} />Rentals returned</label>
          </div>
          <div style={S.grid3}>
            <label style={S.checkRow}><input type="checkbox" checked={e.hoursLogged || false} onChange={ev => markDirty(p => ({ ...p, hoursLogged: ev.target.checked }))} />Hours logged</label>
            <label style={S.checkRow}><input type="checkbox" checked={e.costsFinalized || false} onChange={ev => markDirty(p => ({ ...p, costsFinalized: ev.target.checked }))} />COGS finalized</label>
            <label style={S.checkRow}><input type="checkbox" checked={e.finalPaymentCollected || false} onChange={ev => markDirty(p => ({ ...p, finalPaymentCollected: ev.target.checked }))} />Final payment</label>
          </div>
          <Input label="Post-Event Notes" value={e.closureNotes || ""} onChange={v => markDirty(p => ({ ...p, closureNotes: v }))} textarea placeholder="What went well, what to improve, client feedback..." />
          <Input label="Client Rating (1-5)" value={e.clientRating || ""} onChange={v => markDirty(p => ({ ...p, clientRating: safeNum(v) }))} type="number" />
          {e.stage !== "closed" && (
            <Btn v="secondary" sm onClick={() => markDirty(p => ({ ...p, stage: "closed" }))}>Mark Closed</Btn>
          )}
          {e.stage === "closed" && <Badge color={B.sage}>Event Closed</Badge>}
        </Card>
      )}

      <div style={{ ...S.flex, flexWrap: "wrap" }}><Btn sm onClick={saveE}>Save Event</Btn>{confirmDelete && <Btn v="danger" sm onClick={deleteEvent}>Delete</Btn>}</div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Crew</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>{(e.crewAssigned || []).map((c, i) => <span key={i} onClick={() => removeCrew(c)} style={{ cursor: "pointer" }}><Badge color={B.forest}>{c} ✕</Badge></span>)}</div>
        <div style={S.flex}>
          <input value={newCrew} onChange={ev => setNewCrew(ev.target.value)} onKeyDown={ev => ev.key === "Enter" && addCrew()} placeholder="Add crew member" style={{ flex: 1, padding: "5px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 12 }} />
          <Btn v="secondary" sm onClick={addCrew}>Add</Btn>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Rental Items Assigned</div>
        {(() => {
          const assigned = (data.rentalAssignments || []).filter(ra => ra.eventId === e.id);
          const available = (data.rentals || []).filter(r => {
            const alreadyAssigned = assigned.some(a => a.rentalId === r.id);
            if (alreadyAssigned) return false;
            const otherAssignments = (data.rentalAssignments || []).filter(ra => ra.rentalId === r.id && ra.eventId !== e.id);
            const conflicting = otherAssignments.filter(ra => {
              const otherEv = data.events.find(ev => ev.id === ra.eventId);
              return otherEv && otherEv.date === e.date;
            });
            const totalUsed = conflicting.reduce((s, ra) => s + (ra.qty || 1), 0);
            return totalUsed < (r.qtyOwned || 1);
          });
          const assignItem = (rentalId) => {
            const rental = (data.rentals || []).find(r => r.id === rentalId);
            if (!rental) return;
            save({ rentalAssignments: [...(data.rentalAssignments || []), { id: uid(), rentalId, eventId: e.id, qty: 1, returned: false }] });
          };
          const unassign = (raId) => save({ rentalAssignments: (data.rentalAssignments || []).filter(ra => ra.id !== raId) });
          const toggleReturned = (raId) => save({ rentalAssignments: (data.rentalAssignments || []).map(ra => ra.id === raId ? { ...ra, returned: !ra.returned } : ra) });
          const updateQty = (raId, qty) => save({ rentalAssignments: (data.rentalAssignments || []).map(ra => ra.id === raId ? { ...ra, qty: Number(qty) } : ra) });
          return (<>
            {assigned.length === 0 && <div style={{ fontSize: 12, color: B.muted, marginBottom: 6 }}>No rental items assigned</div>}
            {assigned.map(ra => {
              const rental = (data.rentals || []).find(r => r.id === ra.rentalId);
              if (!rental) return null;
              return (
                <div key={ra.id} style={{ ...S.flexC, padding: "4px 0", borderBottom: `1px solid ${B.cream}`, fontSize: 12 }}>
                  <span style={{ flex: 1 }}>{rental.name} <Badge color={B.sage}>{rental.category}</Badge></span>
                  <span style={S.xs}>×</span>
                  <input type="number" value={ra.qty || 1} onChange={ev => updateQty(ra.id, ev.target.value)} style={{ width: 36, padding: "2px 4px", border: `1px solid ${B.creamD}`, borderRadius: 3, fontSize: 11, textAlign: "center" }} min={1} max={rental.qtyOwned || 1} />
                  <label style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: ra.returned ? B.green : B.muted }}><input type="checkbox" checked={ra.returned} onChange={() => toggleReturned(ra.id)} />Returned</label>
                  <button onClick={() => unassign(ra.id)} style={S.rmBtn}>✕</button>
                </div>
              );
            })}
            {available.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <select onChange={ev => { if (ev.target.value) { assignItem(ev.target.value); ev.target.value = ""; } }} style={{ padding: "5px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 11, width: "100%" }}>
                  <option value="">+ Assign rental item...</option>
                  {available.map(r => <option key={r.id} value={r.id}>{r.name} ({r.category}) — {r.qtyOwned} owned</option>)}
                </select>
              </div>
            )}
            {(data.rentals || []).length === 0 && <div style={{ fontSize: 11, color: B.gold, marginTop: 4 }}>Add items in Rental Inventory first.</div>}
          </>);
        })()}
      </div>

      <div style={{ marginTop: 14 }}>
        {/* Linked Assignments */}
        {(() => {
          const eAssign = (data.assignments || []).filter(a => a.eventId === e.id);
          const totalItems = eAssign.reduce((s, a) => s + (a.checklist || []).length, 0);
          const doneItems = eAssign.reduce((s, a) => s + (a.checklist || []).filter(c => c.done).length, 0);
          return (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 12 }}>Assignments ({eAssign.length}){totalItems > 0 && <span style={{ fontWeight: 400, color: B.muted, marginLeft: 6, fontSize: 11 }}>{doneItems}/{totalItems} items done</span>}</span>
                <Btn v="gold" sm onClick={genAssignments}>{eAssign.length === 0 ? "Generate Assignments" : "+ Add Set"}</Btn>
              </div>
              {eAssign.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {eAssign.map(a => (
                    <div key={a.id} style={{ padding: "3px 8px", borderRadius: 5, fontSize: 10, background: a.status === "active" ? B.greenL : B.cream, border: `1px solid ${a.status === "active" ? B.green + "40" : B.creamD}` }}>
                      <span style={{ fontWeight: 600 }}>{a.person}</span> — {a.role} <span style={{ color: B.muted }}>({(a.checklist || []).filter(c => c.done).length}/{(a.checklist || []).length})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontWeight: 600, fontSize: 12 }}>Tasks ({eTasks.length})</span>{eTasks.length === 0 && <Btn v="gold" sm onClick={genTasks}>Generate Workflow</Btn>}</div>
        {eTasks.map(t => (
          <div key={t.id} style={{ ...S.flexC, padding: "3px 0", borderBottom: `1px solid ${B.cream}`, fontSize: 12 }}>
            <input type="checkbox" checked={t.status === "done"} onChange={() => save({ tasks: data.tasks.map(tk => tk.id === t.id ? { ...tk, status: t.status === "done" ? "todo" : "done", completedAt: t.status !== "done" ? Date.now() : null } : tk) })} />
            <span style={{ flex: 1, textDecoration: t.status === "done" ? "line-through" : "none", color: t.status === "done" ? B.muted : B.text }}>{t.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Estimates({ data, save, setSidePanel, confirmDelete, isMob }) {
  const open = (est) => setSidePanel({ title: `Estimate: ${est.eventName}`, content: <EstimateDetail est={est} data={data} save={save} close={() => setSidePanel(null)} confirmDelete={confirmDelete} /> });
  const newEst = () => {
    const est = { id: uid(), eventName: "", eventId: "", clientId: "", totalRevenue: 0, items: [], notes: "", createdAt: Date.now() };
    save({ estimates: [...(data.estimates || []), est] }); open(est);
  };
  const autoGenerate = () => {
    const existingEventIds = new Set((data.estimates || []).map(e => e.eventId).filter(Boolean));
    const missing = data.events.filter(e => !existingEventIds.has(e.id));
    if (missing.length === 0) return;
    const newEsts = missing.map(ev => ({
      id: uid(), eventName: ev.eventCode || ev.clientName, eventId: ev.id, clientId: ev.clientId || "",
      totalRevenue: ev.contractTotal || 0,
      items: buildEstimateItems(ev.tier, ev.contractTotal),
      notes: `${ev.tier} tier | ${ev.venue}`, createdAt: Date.now()
    }));
    save({ estimates: [...(data.estimates || []), ...newEsts] });
  };
  const exportEstimates = () => {
    const rows = [];
    (data.estimates || []).forEach(est => { (est.items || []).forEach(i => { rows.push([est.eventName, i.piece, i.qty, i.costPerStem, i.flowerCost, i.laborCost, i.supplyCost, i.priceCharged, (i.priceCharged || 0) - (i.flowerCost || 0) - (i.laborCost || 0) - (i.supplyCost || 0)]); }); });
    downloadCSV("gg-estimates.csv", ["Event", "Item", "Qty", "$/Stem", "Flower $", "Labor $", "Supply $", "Charged", "Profit"], rows);
  };

  return (
    <div>
      <PageHead title="Estimates" sub="Job costing sheets for pricing proposals" right={<><Btn onClick={newEst}>+ New Estimate</Btn><Btn v="gold" sm onClick={autoGenerate} title="Create estimates for events that don't have one yet">Auto-Generate from Events</Btn>{(data.estimates || []).length > 0 && <Btn v="secondary" sm onClick={exportEstimates}>Export CSV</Btn>}</>} />
      <div style={S.page}>
        {(!data.estimates || data.estimates.length === 0) ? <Empty icon="◇" msg="No estimates yet." hint="Auto-generate from booked events or start a blank one — either way, this is where proposals come to life." action={<div style={S.flex}><Btn onClick={autoGenerate}>Auto-Generate from Events</Btn><Btn v="secondary" onClick={newEst}>+ New Blank</Btn></div>} /> :
          <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
            {(data.estimates || []).map(est => {
              const totalCOGS = (est.items || []).reduce((s, i) => s + (i.flowerCost || 0) + (i.laborCost || 0) + (i.supplyCost || 0), 0);
              const totalCharged = (est.items || []).reduce((s, i) => s + (i.priceCharged || 0), 0);
              const margin = totalCharged > 0 ? Math.round(((totalCharged - totalCOGS) / totalCharged) * 100) : 0;
              const linked = est.eventId ? data.events.find(e => e.id === est.eventId) : null;
              return (
                <Card key={est.id} onClick={() => open(est)} style={{ cursor: "pointer", padding: 14, borderLeft: `3px solid ${margin >= 50 ? B.green : margin >= 35 ? B.gold : B.red}` }}>
                  <div style={S.row}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{est.eventName || "Untitled"}</div>
                    {linked && <Badge color={B.blue}>{linked.eventCode}</Badge>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, fontSize: 11, marginTop: 6 }}>
                    <div><span style={{ color: B.muted }}>Charged</span><div style={{ fontWeight: 600 }}>{fmt$(totalCharged)}</div></div>
                    <div><span style={{ color: B.muted }}>COGS</span><div style={{ fontWeight: 600 }}>{fmt$(totalCOGS)}</div></div>
                    <div><span style={{ color: B.muted }}>Margin</span><div style={{ fontWeight: 600, color: margin >= 50 ? B.green : margin >= 35 ? B.gold : B.red }}>{margin}%</div></div>
                  </div>
                </Card>
              );
            })}
          </div>
        }
      </div>
    </div>
  );
}

function EstimateDetail({ est, data, save, close, confirmDelete }) {
  const [e, setE] = useState({ ...est });
  const [recipeOpen, setRecipeOpen] = useState(null);
  const items = e.items || [];
  const targetMargin = data.budget?.targetMargin || 55;

  const setItems = (fn) => setE(p => ({ ...p, items: typeof fn === "function" ? fn(p.items || []) : fn }));
  const addItem = () => setItems(prev => [...prev, { id: uid(), piece: "", qty: 1, costPerStem: 0, flowerCost: 0, laborCost: 0, supplyCost: 0, totalCost: 0, priceCharged: 0, recipe: [] }]);
  const updItem = (id, field, val) => setItems(prev => prev.map(i => {
    if (i.id !== id) return i;
    const u = { ...i, [field]: val };
    if (field === "qty" || field === "costPerStem") u.flowerCost = Math.round((u.qty || 0) * (u.costPerStem || 0) * 100) / 100;
    // If recipe exists, override flowerCost from recipe total
    if (u.recipe && u.recipe.length > 0 && field !== "flowerCost") {
      u.flowerCost = Math.round(u.recipe.reduce((s, r) => s + (r.qty || 0) * (r.costPerStem || 0), 0) * 100) / 100;
    }
    u.totalCost = (u.flowerCost || 0) + (u.laborCost || 0) + (u.supplyCost || 0);
    return u;
  }));
  const rmItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const dupItem = (id) => setItems(prev => { const orig = prev.find(i => i.id === id); return orig ? [...prev, { ...orig, id: uid(), recipe: (orig.recipe || []).map(r => ({ ...r, id: uid() })) }] : prev; });
  const addStemToRecipe = (itemId, flower) => {
    setItems(prev => prev.map(i => {
      if (i.id !== itemId) return i;
      const recipe = [...(i.recipe || []), { id: uid(), stemId: flower.id, stemName: flower.name, qty: 1, costPerStem: flower.wholesaleCost || 0, category: flower.category }];
      const fc = Math.round(recipe.reduce((s, r) => s + (r.qty || 0) * (r.costPerStem || 0), 0) * 100) / 100;
      const totalStems = recipe.reduce((s, r) => s + (r.qty || 0), 0);
      return { ...i, recipe, flowerCost: fc, qty: totalStems, totalCost: fc + (i.laborCost || 0) + (i.supplyCost || 0) };
    }));
  };
  const updRecipeStem = (itemId, stemId, qty) => {
    setItems(prev => prev.map(i => {
      if (i.id !== itemId) return i;
      const recipe = (i.recipe || []).map(r => r.id === stemId ? { ...r, qty: Number(qty) } : r);
      const fc = Math.round(recipe.reduce((s, r) => s + (r.qty || 0) * (r.costPerStem || 0), 0) * 100) / 100;
      const totalStems = recipe.reduce((s, r) => s + (r.qty || 0), 0);
      return { ...i, recipe, flowerCost: fc, qty: totalStems, totalCost: fc + (i.laborCost || 0) + (i.supplyCost || 0) };
    }));
  };
  const rmRecipeStem = (itemId, stemId) => {
    setItems(prev => prev.map(i => {
      if (i.id !== itemId) return i;
      const recipe = (i.recipe || []).filter(r => r.id !== stemId);
      const fc = Math.round(recipe.reduce((s, r) => s + (r.qty || 0) * (r.costPerStem || 0), 0) * 100) / 100;
      const totalStems = recipe.reduce((s, r) => s + (r.qty || 0), 0);
      return { ...i, recipe, flowerCost: fc, qty: totalStems, totalCost: fc + (i.laborCost || 0) + (i.supplyCost || 0) };
    }));
  };
  const moveItem = (id, dir) => setItems(prev => {
    const idx = prev.findIndex(i => i.id === id);
    if (idx < 0 || (dir === -1 && idx === 0) || (dir === 1 && idx === prev.length - 1)) return prev;
    const next = [...prev]; [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]; return next;
  });

  const totalFlower = items.reduce((s, i) => s + (i.flowerCost || 0), 0);
  const totalLabor = items.reduce((s, i) => s + (i.laborCost || 0), 0);
  const totalSupply = items.reduce((s, i) => s + (i.supplyCost || 0), 0);
  const totalCOGS = totalFlower + totalLabor + totalSupply;
  const totalCharged = items.reduce((s, i) => s + (i.priceCharged || 0), 0);
  const profit = totalCharged - totalCOGS;
  const margin = totalCharged > 0 ? Math.round((profit / totalCharged) * 100) : 0;
  const suggestedTotal = totalCOGS > 0 ? Math.round(totalCOGS / (1 - targetMargin / 100)) : 0;

  const doSave = () => save({ estimates: (data.estimates || []).map(x => x.id === e.id ? e : x) });
  const deleteEst = () => confirmDelete("Delete this estimate?", () => { save({ estimates: (data.estimates || []).filter(x => x.id !== e.id) }); close(); });
  const convertToEvent = () => {
    if (!e.eventName) return;
    const code = e.eventName.split(/[\s,]+/).pop()?.toUpperCase() + "-26";
    const ev = { id: uid(), clientName: e.eventName, eventCode: code, date: "", venue: "", tier: totalCharged >= 4500 ? "full" : totalCharged >= 2500 ? "mid" : "partial", contractTotal: totalCharged, rangeLow: totalCharged, rangeHigh: totalCharged, depositConfirmed: false, finalPaymentConfirmed: false, flowerOrderPlaced: false, crewAssigned: [], arrivalTime: "", ceremonyTime: "", receptionTime: "", teardownTime: "", notes: e.notes || "", stage: "booked" };
    const seedCosts = items.filter(i => i.flowerCost > 0).map(i => ({ id: uid(), eventId: ev.id, category: "flowers", vendor: "", desc: `${i.piece} (est.)`, amount: i.flowerCost, date: Date.now() }));
    save({ events: [...data.events, ev], estimates: (data.estimates || []).map(x => x.id === e.id ? { ...e, eventId: ev.id } : x), jobCosts: [...data.jobCosts, ...seedCosts] });
    setE(p => ({ ...p, eventId: ev.id }));
  };

  // Generate consolidated order list from all recipes
  const generateOrderList = () => {
    const stemMap = {};
    items.forEach(item => {
      (item.recipe || []).forEach(r => {
        const key = r.stemName || "Unknown";
        if (!stemMap[key]) stemMap[key] = { name: key, category: r.category || "", costPerStem: r.costPerStem || 0, totalStems: 0, pieces: [] };
        stemMap[key].totalStems += (r.qty || 0);
        stemMap[key].pieces.push(item.piece);
      });
    });
    const WASTE = 1.10; // 10% waste factor
    const rows = Object.values(stemMap).sort((a, b) => a.name.localeCompare(b.name)).map(s => {
      const withWaste = Math.ceil(s.totalStems * WASTE);
      const cat = (data.flowerCatalog || []).find(f => f.name === s.name);
      const bunchSize = cat?.stemsPerBunch || 25;
      const bunches = Math.ceil(withWaste / bunchSize);
      const orderQty = bunches * bunchSize;
      return [s.name, s.category, s.totalStems, withWaste, bunchSize, bunches, orderQty, s.costPerStem, fmt$(orderQty * s.costPerStem), s.pieces.join(", ")];
    });
    if (rows.length === 0) return;
    downloadCSV(`order-list-${e.eventName || "draft"}.csv`, ["Stem", "Category", "Need", "w/Waste", "Pack Size", "Bunches", "Order Qty", "$/Stem", "Est Cost", "Used In"], rows);
  };

  // Create assignment from estimate
  const createAssignment = (templateKey) => {
    const ev = e.eventId ? data.events.find(x => x.id === e.eventId) : null;
    const team = data.teamMembers || ["Lindsay", "Mac"];
    const templateItems = getTemplates(data)[templateKey] ? getTemplates(data)[templateKey].map(item => ({ id: uid(), title: item.title, sop: item.sop, done: false, doneAt: null, fromTemplate: true })) : [];
    const a = { id: uid(), person: team[0], eventId: e.eventId || "", eventName: ev ? (ev.eventCode || ev.clientName) : e.eventName, role: templateKey === "Setup/Install" ? "Lead Designer" : "Production Assistant", date: ev ? ev.date : toISO(new Date()), status: "active", checklist: templateItems, notes: `From estimate: ${e.eventName}`, hoursLogged: 0, createdAt: Date.now() };
    save({ assignments: [...(data.assignments || []), a] });
  };

  const exportSingle = () => downloadCSV(`estimate-${e.eventName || "draft"}.csv`, ["Item", "Qty", "$/Stem", "Flower $", "Labor $", "Supply $", "Total COGS", "Charged", "Margin %"], items.map(i => { const ic = (i.flowerCost||0)+(i.laborCost||0)+(i.supplyCost||0); return [i.piece, i.qty, i.costPerStem, i.flowerCost, i.laborCost, i.supplyCost, ic, i.priceCharged, i.priceCharged > 0 ? Math.round(((i.priceCharged - ic)/i.priceCharged)*100) : 0]; }));

  return (
    <div>
      <div style={S.grid21}>
        <Input label="Event / Client Name" value={e.eventName} onChange={v => setE(p => ({ ...p, eventName: v }))} placeholder="Client / Event" />
        <Input label="Link to Event" value={e.eventId} onChange={v => setE(p => ({ ...p, eventId: v }))} options={[{ value: "", label: "None" }, ...data.events.map(ev => ({ value: ev.id, label: ev.eventCode || ev.clientName }))]} />
      </div>

      <Card style={{ background: B.cream, marginBottom: 14, padding: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, fontSize: 12 }}>
          <div><div style={S.sm}>Flowers</div><div style={{ fontWeight: 700 }}>{fmt$(totalFlower)}</div></div>
          <div><div style={S.sm}>Labor</div><div style={{ fontWeight: 700 }}>{fmt$(totalLabor)}</div></div>
          <div><div style={S.sm}>Supplies</div><div style={{ fontWeight: 700 }}>{fmt$(totalSupply)}</div></div>
          <div><div style={S.sm}>COGS</div><div style={{ fontWeight: 700 }}>{fmt$(totalCOGS)}</div></div>
        </div>
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${B.creamD}`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, fontSize: 12 }}>
          <div><div style={S.sm}>Charged</div><div style={{ fontWeight: 700, fontSize: 16 }}>{fmt$(totalCharged)}</div></div>
          <div><div style={S.sm}>Profit</div><div style={{ fontWeight: 700, fontSize: 16, color: profit >= 0 ? B.green : B.red }}>{fmt$(profit)}</div></div>
          <div><div style={S.sm}>Margin</div><div style={{ fontWeight: 700, fontSize: 16, color: margin >= targetMargin ? B.green : margin >= 35 ? B.gold : B.red }}>{margin}%</div></div>
          <div><div style={{ color: B.gold, fontSize: 10 }}>Suggested Price</div><div style={{ fontWeight: 600, fontSize: 14, color: B.gold }} title={`Price needed for ${targetMargin}% margin`}>{fmt$(suggestedTotal)}</div></div>
        </div>
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontWeight: 600, fontSize: 12 }}>Item Breakdown ({items.length})</span><Btn v="secondary" sm onClick={addItem}>+ Add Item</Btn></div>

      <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 560 }}>
      {items.length > 0 && (
        <div style={{ fontSize: 9, fontWeight: 600, color: B.muted, display: "grid", gridTemplateColumns: "30px 2fr 35px 50px 60px 50px 50px 60px 40px 36px", gap: 3, marginBottom: 4, padding: "0 0 4px", borderBottom: `1px solid ${B.creamD}` }}>
          <span></span><span>ITEM</span><span>QTY</span><span>$/STEM</span><span>FLOWER</span><span>LABOR</span><span>SUPPLY</span><span>CHARGED</span><span>MGN</span><span></span>
        </div>
      )}
      {items.map((item, idx) => {
        const iCost = (item.flowerCost||0) + (item.laborCost||0) + (item.supplyCost||0);
        const iMargin = item.priceCharged > 0 ? Math.round(((item.priceCharged - iCost) / item.priceCharged) * 100) : 0;
        return (
          <div key={item.id}>
          <div style={{ display: "grid", gridTemplateColumns: "30px 2fr 35px 50px 60px 50px 50px 60px 40px 36px", gap: 3, marginBottom: 2, alignItems: "end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 10 }}>
              <button onClick={() => moveItem(item.id, -1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 8, color: B.muted, padding: 0 }}>▲</button>
              <button onClick={() => moveItem(item.id, 1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 8, color: B.muted, padding: 0 }}>▼</button>
            </div>
            <Input value={item.piece} onChange={v => updItem(item.id, "piece", v)} options={ESTIMATE_ITEMS} />
            <Input value={item.qty} onChange={v => updItem(item.id, "qty", safeNum(v))} type="number" />
            <Input value={item.costPerStem} onChange={v => updItem(item.id, "costPerStem", safeNum(v))} type="number" />
            <Input value={item.flowerCost} onChange={v => updItem(item.id, "flowerCost", safeNum(v))} type="number" />
            <Input value={item.laborCost} onChange={v => updItem(item.id, "laborCost", safeNum(v))} type="number" />
            <Input value={item.supplyCost} onChange={v => updItem(item.id, "supplyCost", safeNum(v))} type="number" />
            <Input value={item.priceCharged} onChange={v => updItem(item.id, "priceCharged", safeNum(v))} type="number" />
            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 10, textAlign: "center", color: iMargin >= targetMargin ? B.green : iMargin >= 35 ? B.gold : B.red }}>{iMargin}%</div>
            <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
              <button onClick={() => dupItem(item.id)} title="Duplicate" style={{ background: "none", border: "none", cursor: "pointer", color: B.blue, fontSize: 10 }}>⧉</button>
              <button onClick={() => rmItem(item.id)} style={S.rmBtn}>✕</button>
            </div>
          </div>
          {/* Recipe toggle */}
          <div style={{ marginLeft: 30, marginBottom: 6 }}>
            <button onClick={() => setRecipeOpen(recipeOpen === item.id ? null : item.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: B.gold, fontWeight: 600, fontFamily: "inherit" }}>
              {(item.recipe || []).length > 0 ? `✿ Recipe (${item.recipe.length} stems, ${item.recipe.reduce((s,r)=>s+(r.qty||0),0)} total)` : "✿ Build Recipe"} {recipeOpen === item.id ? "▾" : "▸"}
            </button>
          </div>
          {recipeOpen === item.id && (
            <div style={{ marginLeft: 30, marginBottom: 10, padding: 10, background: B.cream + "80", borderRadius: 6, border: `1px solid ${B.creamD}` }}>
              {(item.recipe || []).map(r => (
                <div key={r.id} style={{ display: "grid", gridTemplateColumns: "2fr 50px 60px 60px 20px", gap: 4, alignItems: "center", fontSize: 11, marginBottom: 3 }}>
                  <span>{r.stemName} <span style={{ color: B.muted, fontSize: 9 }}>({r.category})</span></span>
                  <input type="number" value={r.qty} onChange={ev => updRecipeStem(item.id, r.id, ev.target.value)} style={{ width: 40, padding: "2px 4px", border: `1px solid ${B.creamD}`, borderRadius: 3, fontSize: 11, textAlign: "center" }} />
                  <span style={{ color: B.muted }}>× {fmt$(r.costPerStem)}</span>
                  <span style={{ fontWeight: 600 }}>{fmt$(r.qty * r.costPerStem)}</span>
                  <button onClick={() => rmRecipeStem(item.id, r.id)} style={S.rmBtn}>✕</button>
                </div>
              ))}
              {(data.flowerCatalog || []).length > 0 ? (
                <select onChange={ev => { if (ev.target.value) { const f = (data.flowerCatalog || []).find(fl => fl.id === ev.target.value); if (f) addStemToRecipe(item.id, f); ev.target.value = ""; } }} style={{ width: "100%", padding: "4px 6px", border: `1px solid ${B.creamD}`, borderRadius: 4, fontSize: 11, marginTop: 4 }}>
                  <option value="">+ Add stem from catalog...</option>
                  {(data.flowerCatalog || []).map(f => <option key={f.id} value={f.id}>{f.name} ({f.category}) — {fmt$(f.wholesaleCost)}/stem</option>)}
                </select>
              ) : <div style={{ fontSize: 10, color: B.gold, marginTop: 4 }}>Add flowers in Flower Catalog first to build recipes.</div>}
              {(item.recipe || []).length > 0 && <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600 }}>Recipe total: {item.recipe.reduce((s,r)=>s+(r.qty||0),0)} stems = {fmt$(item.recipe.reduce((s,r)=>s+(r.qty||0)*(r.costPerStem||0),0))} wholesale</div>}
            </div>
          )}
          </div>
        );
      })}

      </div>
      </div>

      <Input label="Notes" value={e.notes || ""} onChange={v => setE(p => ({ ...p, notes: v }))} textarea />
      <div style={{ ...S.flex, marginTop: 10, flexWrap: "wrap" }}>
        <Btn onClick={doSave}>Save</Btn>
        <Btn v="secondary" sm onClick={exportSingle}>Export CSV</Btn>
        {items.some(i => (i.recipe || []).length > 0) && <Btn v="gold" sm onClick={generateOrderList}>📋 Order List</Btn>}
        <select onChange={ev => { if (ev.target.value) createAssignment(ev.target.value); ev.target.value = ""; }} style={{ padding: "4px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 10, fontFamily: "inherit", color: B.forest, cursor: "pointer" }}>
          <option value="">+ Create Assignment...</option>
          {Object.keys(getTemplates(data)).map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        {!e.eventId && items.length > 0 && <Btn v="gold" sm onClick={convertToEvent}>Convert to Event</Btn>}
        <Btn v="ghost" onClick={close}>Close</Btn>
        <Btn v="danger" sm onClick={deleteEst} style={{ marginLeft: "auto" }}>Delete</Btn>
      </div>
    </div>
  );
}

function Schedule({ data, save, setSidePanel, confirmDelete, isMob, setView }) {
  const [tab, setTab] = useState("week");
  const activeAssign = (data.assignments || []).filter(a => a.status === "active").length;
  return (
    <div>
      <div style={{ display: "flex", gap: 0, background: B.cream, borderBottom: `1px solid ${B.creamD}` }}>
        {[{ id: "week", label: "▦ Week Planner" }, { id: "assign", label: `◉ Assignments (${activeAssign})` }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 20px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: tab === t.id ? 700 : 400, background: tab === t.id ? B.white : "transparent", color: tab === t.id ? B.forest : B.muted, fontFamily: "inherit", borderBottom: tab === t.id ? `2px solid ${B.forest}` : "2px solid transparent" }}>{t.label}</button>
        ))}
      </div>
      {tab === "week" && <WeekPlanner data={data} save={save} isMob={isMob} setView={setView} />}
      {tab === "assign" && <Assignments data={data} save={save} setSidePanel={setSidePanel} confirmDelete={confirmDelete} />}
    </div>
  );
}

function WeekPlanner({ data, save, isMob, setView }) {
  const team = data.teamMembers || ["Lindsay", "Mac"];
  const ww = useWindowWidth();
  const mob = (isMob !== undefined ? isMob : ww < MOB);
  const [weekOffset, setWeekOffset] = useState(0);
  const [dragItem, setDragItem] = useState(null);
  const [addingAt, setAddingAt] = useState(null);
  const [quickTitle, setQuickTitle] = useState("");
  const [personFilter, setPersonFilter] = useState("all");
  const [showSidebar, setShowSidebar] = useState(!mob);
  const [expandedTask, setExpandedTask] = useState(null);

  const getWeekDates = (offset) => {
    const d = new Date(); d.setDate(d.getDate() - d.getDay() + 1 + offset * 7);
    return Array.from({ length: 7 }, (_, i) => { const dd = new Date(d); dd.setDate(dd.getDate() + i); return dd; });
  };
  const weekDates = getWeekDates(weekOffset);
  const weekStart = weekDates[0]; const weekEnd = weekDates[6];
  const weekLabel = `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const isToday = (d) => toISO(d) === toISO(new Date());
  const getCat = (key) => TASK_CATEGORIES.find(c => c.key === key) || TASK_CATEGORIES[0];

  // Events this week
  const weekEvents = data.events.filter(e => { const d = new Date(e.date + "T12:00:00"); return d >= weekStart && d <= weekEnd; }).sort((a, b) => new Date(a.date) - new Date(b.date));

  // All tasks (filter by person if set)
  const filterPerson = (t) => personFilter === "all" || (t.assignee || "").toLowerCase() === personFilter.toLowerCase();

  // Tasks scheduled this week
  const getTasksForCell = (dateISO, catKey) => {
    return data.tasks.filter(t => {
      if (t.status === "done" && t.completedAt && (Date.now() - t.completedAt) > 864e5) return false; // hide old done
      const tDate = t.scheduledDate || t.dueDate;
      if (tDate !== dateISO) return false;
      if ((t.category || "production") !== catKey) return false;
      return filterPerson(t);
    });
  };

  // Unscheduled tasks (for sidebar)
  const unscheduled = data.tasks.filter(t => t.status !== "done" && !t.scheduledDate && !t.dueDate && filterPerson(t));
  // Overdue
  const todayISO = toISO(new Date());
  const overdue = data.tasks.filter(t => t.status !== "done" && t.dueDate && t.dueDate < todayISO && filterPerson(t));
  // Event milestones this week
  const weekMilestones = [];
  data.events.forEach(ev => {
    if (!ev.date || ev.stage === "closed" || ev.stage === "cancelled") return;
    const evDate = new Date(ev.date + "T12:00:00"); evDate.setHours(0,0,0,0);
    EVENT_MILESTONES.forEach(m => {
      const targetDate = new Date(evDate); targetDate.setDate(targetDate.getDate() - Math.abs(m.daysOut) * (m.daysOut >= 0 ? 1 : -1));
      // Actually: milestone fires when daysUntilEvent === m.daysOut
      const daysUntil = Math.round((evDate - new Date(new Date().setHours(0,0,0,0))) / 864e5);
      const milestoneDate = new Date(new Date().setHours(0,0,0,0));
      milestoneDate.setDate(milestoneDate.getDate() + (daysUntil - m.daysOut));
      const mISO = toISO(milestoneDate);
      if (milestoneDate >= weekStart && milestoneDate <= weekEnd) {
        const taskExists = data.tasks.some(t => t.title && t.title.includes(m.label) && t.eventId === ev.id);
        const assignExists = (data.assignments || []).some(a => a.eventId === ev.id && a.notes && a.notes.includes(m.label));
        weekMilestones.push({ ...m, event: ev, dateISO: mISO, exists: taskExists || assignExists });
      }
    });
  });

  // Actions
  const handleDrop = (dateISO, catKey) => {
    if (!dragItem) return;
    save({ tasks: data.tasks.map(t => t.id === dragItem ? { ...t, scheduledDate: dateISO, category: catKey, status: t.status === "backlog" ? "todo" : t.status } : t) });
    setDragItem(null);
  };

  const addQuickTask = (dateISO, catKey) => {
    if (!quickTitle.trim()) return;
    save({ tasks: [...data.tasks, { id: uid(), title: quickTitle.trim(), assignee: personFilter !== "all" ? personFilter : team[0], scheduledDate: dateISO, status: "todo", priority: "normal", category: catKey, notes: "", createdAt: Date.now() }] });
    setQuickTitle(""); setAddingAt(null);
  };

  const toggleDone = (taskId) => save({ tasks: data.tasks.map(t => t.id === taskId ? { ...t, status: t.status === "done" ? "todo" : "done", completedAt: t.status !== "done" ? Date.now() : null } : t) });

  const updTask = (id, field, val) => save({ tasks: data.tasks.map(t => t.id === id ? { ...t, [field]: val } : t) });

  const addMilestoneAsTask = (m) => {
    const exists = data.tasks.some(t => t.title && t.title.includes(m.label) && t.eventId === m.event.id);
    if (exists) return;
    save({ tasks: [...data.tasks, { id: uid(), title: `${m.icon} ${m.label}: ${m.event.eventCode || m.event.clientName}`, eventId: m.event.id, status: "todo", assignee: team[0], scheduledDate: m.dateISO, priority: m.daysOut <= 1 ? "high" : "normal", category: "production", notes: `Workflow ${m.sop}. Venue: ${m.event.venue || "TBD"}`, createdAt: Date.now() }] });
  };

  const addMilestoneAsAssignment = (m) => {
    const alreadyExists = (data.assignments || []).some(a => a.eventId === m.event.id && a.notes && a.notes.includes(m.label));
    if (alreadyExists) return;
    const templateKey = MILESTONE_TEMPLATE_MAP[m.sop] || "";
    const templateItems = templateKey && getTemplates(data)[templateKey]
      ? getTemplates(data)[templateKey].map(item => ({ id: uid(), title: item.title, sop: item.sop, done: false, doneAt: null, fromTemplate: true }))
      : [];
    const a = { id: uid(), person: team[0], eventId: m.event.id, eventName: m.event.eventCode || m.event.clientName, role: templateKey === "Setup/Install" ? "Lead Designer" : templateKey === "Strike/Teardown" ? "Strike Crew" : "Production Assistant", date: m.dateISO || m.event.date, status: "active", checklist: templateItems, notes: `${m.label} — SOP ${m.sop}`, hoursLogged: 0, createdAt: Date.now() };
    save({ assignments: [...(data.assignments || []), a] });
  };

  const exportWeek = () => {
    const rows = [];
    TASK_CATEGORIES.forEach(cat => {
      weekDates.forEach(d => {
        const ds = toISO(d);
        getTasksForCell(ds, cat.key).forEach(t => {
          rows.push([cat.label, dayNames[weekDates.indexOf(d)], fmtDate(ds), t.title, t.assignee || "", t.status, t.priority, t.notes || ""]);
        });
      });
    });
    downloadCSV(`gg-week-${toISO(weekStart)}.csv`, ["Category", "Day", "Date", "Task", "Assignee", "Status", "Priority", "Notes"], rows);
  };

  // Category stats
  const catStats = TASK_CATEGORIES.map(c => {
    let total = 0, done = 0;
    weekDates.forEach(d => {
      const tasks = getTasksForCell(toISO(d), c.key);
      total += tasks.length;
      done += tasks.filter(t => t.status === "done").length;
    });
    return { ...c, total, done };
  });

  // Compact task card
  const TaskChip = ({ t }) => {
    const cat = getCat(t.category || "production");
    const isExp = expandedTask === t.id;
    const ev = data.events.find(e => e.id === t.eventId);
    return (
      <div
        draggable
        onDragStart={(e) => { setDragItem(t.id); e.dataTransfer.effectAllowed = "move"; }}
        onClick={() => setExpandedTask(isExp ? null : t.id)}
        style={{
          background: B.white, border: `1px solid ${B.creamD}`, borderLeft: `3px solid ${cat.color}`,
          borderRadius: 5, padding: "5px 7px", marginBottom: 3, fontSize: 11, cursor: "grab",
          opacity: t.status === "done" ? 0.5 : 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "start", gap: 5 }}>
          <input type="checkbox" checked={t.status === "done"} onChange={(e) => { e.stopPropagation(); toggleDone(t.id); }} style={{ margin: "2px 0 0", flexShrink: 0, cursor: "pointer" }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500, textDecoration: t.status === "done" ? "line-through" : "none", lineHeight: 1.3 }}>{t.title}</div>
            <div style={{ display: "flex", gap: 4, marginTop: 2, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 9, color: B.muted }}>{t.assignee}</span>
              {t.priority === "high" && <span style={{ fontSize: 8, color: B.red, fontWeight: 700, background: B.redL, padding: "0 3px", borderRadius: 3 }}>!</span>}
              {ev && <span style={{ fontSize: 8, color: B.blue, background: B.blueL, padding: "0 3px", borderRadius: 3 }}>{ev.eventCode}</span>}
              {t.recurring && <span style={{ fontSize: 8, color: B.sage, fontWeight: 600 }}>↻</span>}
            </div>
          </div>
        </div>
        {isExp && (
          <div onClick={e => e.stopPropagation()} style={{ marginTop: 5, paddingTop: 5, borderTop: `1px solid ${B.creamD}` }}>
            {t.notes && <div style={{ ...S.sm, marginBottom: 4, whiteSpace: "pre-wrap" }}>{t.notes}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
              <select value={t.assignee || ""} onChange={e => updTask(t.id, "assignee", e.target.value)} style={{ fontSize: 9, padding: "2px 4px", border: `1px solid ${B.creamD}`, borderRadius: 3, fontFamily: "inherit" }}>{team.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={t.priority || "normal"} onChange={e => updTask(t.id, "priority", e.target.value)} style={{ fontSize: 9, padding: "2px 4px", border: `1px solid ${B.creamD}`, borderRadius: 3, fontFamily: "inherit" }}>
                <option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option>
              </select>
            </div>
            <textarea value={t.notes || ""} onChange={e => updTask(t.id, "notes", e.target.value)} placeholder="Notes..." style={{ width: "100%", marginTop: 3, padding: 4, border: `1px solid ${B.creamD}`, borderRadius: 3, fontSize: 9, fontFamily: "inherit", resize: "vertical", minHeight: 30, boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 4, marginTop: 3 }}>
              <button onClick={() => updTask(t.id, "recurring", !t.recurring)} style={{ fontSize: 8, padding: "2px 6px", border: `1px solid ${t.recurring ? B.gold : B.creamD}`, borderRadius: 3, background: t.recurring ? B.gold + "20" : "transparent", color: t.recurring ? B.gold : B.muted, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>↻ {t.recurring ? "Recurring" : "One-time"}</button>
              <button onClick={() => save({ tasks: data.tasks.filter(x => x.id !== t.id) })} style={{ fontSize: 8, padding: "2px 6px", border: `1px solid ${B.redL}`, borderRadius: 3, background: "transparent", color: B.red, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", height: mob ? "auto" : "calc(100vh - 0px)", flexDirection: mob ? "column" : "row" }}>
      {/* MAIN PLANNER */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <PageHead title="Week Planner" sub={weekLabel} right={
          <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
            <select value={personFilter} onChange={e => setPersonFilter(e.target.value)} style={{ padding: "4px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 11, fontFamily: "inherit" }}>
              <option value="all">All People</option>
              {team.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <Btn v="ghost" sm onClick={() => setWeekOffset(p => p - 1)}>← Prev</Btn>
            <Btn v="ghost" sm onClick={() => setWeekOffset(0)}>Today</Btn>
            <Btn v="ghost" sm onClick={() => setWeekOffset(p => p + 1)}>Next →</Btn>
            <Btn v="secondary" sm onClick={exportWeek}>Export</Btn>
            <Btn v={showSidebar ? "gold" : "ghost"} sm onClick={() => setShowSidebar(p => !p)}>Tasks</Btn>
          </div>
        } />

        <div style={{ flex: 1, overflow: "auto", padding: mob ? "10px 8px" : "12px 16px" }}>
          {/* Event alerts */}
          {weekEvents.length > 0 && (
            <div style={{ ...S.flex, marginBottom: 10, flexWrap: "wrap" }}>
              {weekEvents.map(ev => (
                <div key={ev.id} style={{ padding: "4px 10px", background: B.greenL, borderRadius: 6, fontSize: 10, border: `1px solid ${B.sage}`, fontWeight: 600 }}>
                  ★ {ev.eventCode || ev.clientName} — {fmtDate(ev.date)} @ {ev.venue}
                </div>
              ))}
            </div>
          )}

          {/* Milestone suggestions */}
          {weekMilestones.filter(m => !m.exists).length > 0 && (
            <Card style={{ marginBottom: 10, padding: 10, background: B.gold + "08", borderLeft: `3px solid ${B.gold}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: B.gold, marginBottom: 6 }}>Event Milestones This Week</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {weekMilestones.filter(m => !m.exists).slice(0, 8).map((m, i) => (
                  <div key={i} style={{ display: "flex", borderRadius: 5, border: `1px solid ${B.gold}`, overflow: "hidden", fontSize: 9 }}>
                    <div style={{ padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}>
                      <span>{m.icon}</span>
                      <span style={{ fontWeight: 500 }}>{m.label}</span>
                      <span style={{ color: B.muted }}>— {m.event.eventCode || m.event.clientName}</span>
                    </div>
                    <button onClick={() => addMilestoneAsTask(m)} style={{ padding: "3px 6px", border: "none", borderLeft: `1px solid ${B.gold}`, background: B.cream, cursor: "pointer", fontFamily: "inherit", fontSize: 9, color: B.forest, fontWeight: 600 }} title="Add as task">+Task</button>
                    <button onClick={() => addMilestoneAsAssignment(m)} style={{ padding: "3px 6px", border: "none", borderLeft: `1px solid ${B.gold}`, background: B.gold + "20", cursor: "pointer", fontFamily: "inherit", fontSize: 9, color: B.forest, fontWeight: 600 }} title="Create assignment with SOP checklist">+Assign</button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* CATEGORY SWIM LANE GRID */}
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: mob ? 600 : 0 }}>
              {/* Day headers */}
              <div style={{ display: "grid", gridTemplateColumns: `140px repeat(7, 1fr)`, gap: 1, marginBottom: 1 }}>
                <div />
                {weekDates.map((d, i) => (
                  <div key={i} style={{
                    padding: "6px 4px", textAlign: "center", fontSize: 11, fontWeight: 700,
                    background: isToday(d) ? B.gold + "20" : B.cream,
                    color: isToday(d) ? B.gold : B.forest,
                    borderRadius: "5px 5px 0 0",
                  }}>
                    {dayNames[i]} {d.getDate()}
                    {weekEvents.some(ev => ev.date === toISO(d)) && <div style={{ fontSize: 8, color: B.gold, fontWeight: 800 }}>★ EVENT</div>}
                  </div>
                ))}
              </div>

              {/* Swim lanes */}
              {TASK_CATEGORIES.map(cat => {
                const st = catStats.find(s => s.key === cat.key);
                return (
                  <div key={cat.key} style={{ display: "grid", gridTemplateColumns: `140px repeat(7, 1fr)`, gap: 1, marginBottom: 2 }}>
                    {/* Category label */}
                    <div style={{
                      padding: "10px 10px", background: cat.bg,
                      borderLeft: `4px solid ${cat.color}`, borderRadius: "6px 0 0 6px",
                      display: "flex", flexDirection: "column", justifyContent: "center",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ fontSize: 14 }}>{cat.icon}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: cat.color, lineHeight: 1.2 }}>{cat.label}</span>
                      </div>
                      {st && st.total > 0 && (
                        <div style={{ fontSize: 9, color: B.muted, marginTop: 3 }}>{st.done}/{st.total} done</div>
                      )}
                    </div>

                    {/* Day cells */}
                    {weekDates.map((d, i) => {
                      const ds = toISO(d);
                      const cellTasks = getTasksForCell(ds, cat.key);
                      const cellKey = `${ds}-${cat.key}`;
                      const isAdding = addingAt === cellKey;

                      return (
                        <div key={i}
                          onDragOver={e => { e.preventDefault(); e.currentTarget.style.background = cat.bg; }}
                          onDragLeave={e => { e.currentTarget.style.background = isToday(d) ? B.gold + "06" : B.white; }}
                          onDrop={(e) => { e.currentTarget.style.background = isToday(d) ? B.gold + "06" : B.white; handleDrop(ds, cat.key); }}
                          style={{
                            minHeight: 70, padding: 4,
                            background: isToday(d) ? B.gold + "06" : B.white,
                            borderBottom: `1px solid ${B.cream}`, borderRight: `1px solid ${B.cream}`,
                          }}
                        >
                          {cellTasks.map(t => <TaskChip key={t.id} t={t} />)}

                          {isAdding ? (
                            <div style={{ marginTop: 2 }}>
                              <input autoFocus value={quickTitle} onChange={e => setQuickTitle(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") addQuickTask(ds, cat.key); if (e.key === "Escape") setAddingAt(null); }}
                                placeholder="Task name..."
                                style={{ width: "100%", padding: "4px 6px", border: `1px solid ${cat.color}40`, borderRadius: 4, fontSize: 10, fontFamily: "inherit", boxSizing: "border-box" }} />
                            </div>
                          ) : (
                            <div onClick={() => { setAddingAt(cellKey); setQuickTitle(""); }}
                              style={{ fontSize: 9, color: B.sage, cursor: "pointer", padding: "3px 4px", opacity: 0.6, marginTop: 2 }}>
                              + add
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* TASK SIDEBAR */}
      {showSidebar && (
        <div style={{
          width: mob ? "100%" : 260, borderLeft: mob ? "none" : `1px solid ${B.creamD}`,
          borderTop: mob ? `1px solid ${B.creamD}` : "none",
          background: B.cream, display: "flex", flexDirection: "column",
          maxHeight: mob ? 300 : "100%", overflow: "hidden",
        }}>
          <div style={{ padding: "10px 12px", borderBottom: `1px solid ${B.creamD}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: B.forest }}>Task Pool</span>
            <span style={S.sm}>{unscheduled.length + overdue.length} items</span>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "8px 10px" }}>
            {/* Overdue */}
            {overdue.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: B.red, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Overdue ({overdue.length})</div>
                {overdue.slice(0, 10).map(t => {
                  const cat = getCat(t.category || "production");
                  return (
                    <div key={t.id} draggable onDragStart={() => setDragItem(t.id)}
                      style={{ padding: "4px 8px", borderRadius: 5, fontSize: 10, cursor: "grab", background: B.redL, borderLeft: `3px solid ${B.red}`, marginBottom: 3 }}>
                      <div style={{ fontWeight: 500 }}>{t.title}</div>
                      <div style={{ fontSize: 8, color: B.red }}>{fmtDate(t.dueDate)} — {t.assignee}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Unscheduled by category */}
            {TASK_CATEGORIES.map(cat => {
              const items = unscheduled.filter(t => (t.category || "production") === cat.key);
              if (items.length === 0) return null;
              return (
                <div key={cat.key} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: cat.color, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{cat.icon} {cat.label} ({items.length})</div>
                  {items.slice(0, 8).map(t => (
                    <div key={t.id} draggable onDragStart={() => setDragItem(t.id)}
                      style={{ padding: "4px 8px", borderRadius: 5, fontSize: 10, cursor: "grab", background: B.white, borderLeft: `3px solid ${cat.color}`, marginBottom: 2 }}>
                      <div style={{ fontWeight: 500 }}>{t.title}</div>
                      <div style={{ fontSize: 8, color: B.muted }}>{t.assignee}</div>
                    </div>
                  ))}
                </div>
              );
            })}

            {unscheduled.length === 0 && overdue.length === 0 && (
              <div style={{ textAlign: "center", padding: 20, color: B.muted, fontSize: 11 }}>
                All tasks scheduled ✓
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Tasks({ data, save, setView }) {
  const team = data.teamMembers || ["Lindsay", "Mac"];
  const [fEvent, setFEvent] = useState(""); const [showNew, setShowNew] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const [tab, setTab] = useState("myday");
  const [nt, setNt] = useState({ title: "", eventId: "", assignee: team[0], dueDate: "", priority: "normal", category: "production", notes: "" });
  const { tasks, events } = data;
  const STATS = ["backlog", "todo", "in_progress", "done"];
  const LABELS = { backlog: "Backlog", todo: "To Do", in_progress: "In Progress", done: "Done" };
  const COLS = { backlog: B.muted, todo: B.blue, in_progress: B.gold, done: B.green };
  const PRIORITIES = { high: { label: "High", color: B.red }, normal: { label: "Normal", color: B.forest }, low: { label: "Low", color: B.muted } };
  const filtered = tasks.filter(t => !fEvent || t.eventId === fEvent);
  const addTask = () => { if (!nt.title) return; save({ tasks: [...tasks, { ...nt, id: uid(), status: "todo", createdAt: Date.now() }] }); setNt({ title: "", eventId: "", assignee: team[0], dueDate: "", priority: "normal", category: "production", notes: "" }); setShowNew(false); };
  const rmTask = (id) => save({ tasks: tasks.filter(t => t.id !== id) });
  const updTask = (id, field, val) => save({ tasks: tasks.map(t => t.id === id ? { ...t, [field]: val } : t) });

  const today = new Date(); today.setHours(0,0,0,0);
  const todayISO = today.toISOString().split("T")[0];
  const overdue = tasks.filter(t => t.status !== "done" && t.dueDate && t.dueDate < todayISO);
  const todayTasks = tasks.filter(t => t.status !== "done" && t.dueDate === todayISO);
  const inProgressTasks = tasks.filter(t => t.status === "in_progress");
  const upcoming7 = tasks.filter(t => t.status !== "done" && t.dueDate && t.dueDate > todayISO && t.dueDate <= new Date(today.getTime() + 7 * 864e5).toISOString().split("T")[0]);
  const noDue = tasks.filter(t => t.status !== "done" && !t.dueDate);
  const todayMilestones = getEventMilestones(events);
  const completedToday = tasks.filter(t => t.status === "done" && t.dueDate === todayISO);

  // Convert milestone to task
  const milestoneToTask = (m) => {
    const exists = tasks.some(t => t.title.includes(m.label) && t.eventId === m.event.id);
    if (exists) return;
    save({ tasks: [...tasks, { id: uid(), title: `${m.label}: ${m.event.eventCode || m.event.clientName}`, eventId: m.event.id, status: "todo", assignee: team[0], dueDate: todayISO, priority: m.daysOut <= 1 ? "high" : "normal", category: "production", notes: `Workflow ${m.sop}. Venue: ${m.event.venue || "TBD"}`, createdAt: Date.now() }] });
  };

  const milestoneToAssignment = (m) => {
    const alreadyExists = (data.assignments || []).some(a => a.eventId === m.event.id && a.notes && a.notes.includes(m.label));
    if (alreadyExists) return;
    const templateKey = MILESTONE_TEMPLATE_MAP[m.sop] || "";
    const templateItems = templateKey && getTemplates(data)[templateKey]
      ? getTemplates(data)[templateKey].map(item => ({ id: uid(), title: item.title, sop: item.sop, done: false, doneAt: null, fromTemplate: true }))
      : [];
    const a = { id: uid(), person: team[0], eventId: m.event.id, eventName: m.event.eventCode || m.event.clientName, role: templateKey === "Setup/Install" ? "Lead Designer" : "Production Assistant", date: m.event.date || toISO(new Date()), status: "active", checklist: templateItems, notes: `${m.label} — SOP ${m.sop}`, hoursLogged: 0, createdAt: Date.now() };
    save({ assignments: [...(data.assignments || []), a] });
  };

  const TaskCard = ({ t, showCheckbox = true }) => {
    const ev = events.find(e => e.id === t.eventId);
    const pri = PRIORITIES[t.priority] || PRIORITIES.normal;
    const isOpen = expandedTask === t.id;
    return (
      <div key={t.id} onClick={() => setExpandedTask(isOpen ? null : t.id)} style={{ background: B.white, border: `1px solid ${B.creamD}`, borderRadius: 5, padding: 8, marginBottom: 6, fontSize: 11, cursor: "pointer", borderLeft: `3px solid ${pri.color}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div style={{ display: "flex", alignItems: "start", gap: 6, flex: 1 }}>
            {showCheckbox && <input type="checkbox" checked={t.status === "done"} onChange={e => { e.stopPropagation(); const ns = t.status === "done" ? "todo" : "done"; save({ tasks: tasks.map(tk => tk.id === t.id ? { ...tk, status: ns, completedAt: ns === "done" ? Date.now() : null } : tk) }); }} style={{ cursor: "pointer", marginTop: 2 }} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, textDecoration: t.status === "done" ? "line-through" : "none", color: t.status === "done" ? B.muted : B.text }}>{t.title}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 2 }}>
                {ev && <span style={{ fontSize: 9, color: B.blue, background: B.blueL, padding: "1px 4px", borderRadius: 3 }}>{ev.eventCode}</span>}
                {(() => { const tc = TASK_CATEGORIES.find(c => c.key === (t.category || "production")); return tc ? <span style={{ fontSize: 9, color: tc.color, background: tc.bg, padding: "1px 4px", borderRadius: 3, fontWeight: 600 }}>{tc.icon} {tc.label}</span> : null; })()}
                {t.dueDate && <span style={{ fontSize: 9, color: t.dueDate < todayISO ? B.red : B.muted }}>{fmtDate(t.dueDate)}{t.dueDate < todayISO ? " overdue" : ""}</span>}
                <span style={{ fontSize: 9, color: B.muted }}>{t.assignee}</span>
              </div>
            </div>
          </div>
          {t.priority === "high" && <span style={{ fontSize: 10, color: B.red, fontWeight: 700 }}>!</span>}
        </div>
        {t.notes && <div style={{ ...S.sm, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: isOpen ? "normal" : "nowrap", paddingLeft: showCheckbox ? 22 : 0 }}>{t.notes}</div>}
        {isOpen && (
          <div onClick={e => e.stopPropagation()} style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${B.creamD}` }}>
            <textarea value={t.notes || ""} onChange={e => updTask(t.id, "notes", e.target.value)} placeholder="Add notes..." style={{ width: "100%", padding: 6, border: `1px solid ${B.creamD}`, borderRadius: 4, fontSize: 10, fontFamily: "inherit", minHeight: 50, resize: "vertical", boxSizing: "border-box" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4, marginTop: 4 }}>
              <select value={t.assignee || ""} onChange={e => updTask(t.id, "assignee", e.target.value)} style={{ fontSize: 9, padding: "2px 4px", border: `1px solid ${B.creamD}`, borderRadius: 3, fontFamily: "inherit" }}>{team.map(m => <option key={m} value={m}>{m}</option>)}</select>
              <select value={t.priority || "normal"} onChange={e => updTask(t.id, "priority", e.target.value)} style={{ fontSize: 9, padding: "2px 4px", border: `1px solid ${B.creamD}`, borderRadius: 3, fontFamily: "inherit" }}>{Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
              <select value={t.category || "production"} onChange={e => updTask(t.id, "category", e.target.value)} style={{ fontSize: 9, padding: "2px 4px", border: `1px solid ${B.creamD}`, borderRadius: 3, fontFamily: "inherit" }}>{TASK_CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}</select>
              <select value={t.status} onChange={e => updTask(t.id, "status", e.target.value)} style={{ fontSize: 9, padding: "2px 4px", border: `1px solid ${B.creamD}`, borderRadius: 3, fontFamily: "inherit" }}>{STATS.map(x => <option key={x} value={x}>{LABELS[x]}</option>)}</select>
            </div>
            <input type="date" value={t.dueDate || ""} onChange={e => updTask(t.id, "dueDate", e.target.value)} style={{ fontSize: 9, padding: "2px 4px", border: `1px solid ${B.creamD}`, borderRadius: 3, marginTop: 4, width: "100%", fontFamily: "inherit", boxSizing: "border-box" }} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}><button onClick={() => rmTask(t.id)} style={S.rmBtn}>Delete Task</button></div>
          </div>
        )}
      </div>
    );
  };

  const exportTasks = () => {
    downloadCSV("gg-tasks.csv",
      ["Title", "Status", "Category", "Priority", "Assignee", "Due Date", "Event", "Notes"],
      tasks.map(t => {
        const ev = events.find(e => e.id === t.eventId);
        const cat = TASK_CATEGORIES.find(c => c.key === (t.category || "production"));
        return [t.title, t.status, cat ? cat.label : "Production", t.priority, t.assignee || "", t.dueDate || "", ev ? ev.eventCode : "", t.notes || ""];
      })
    );
  };

  return (
    <div>
      <PageHead title="Tasks" sub={`${tasks.filter(t => t.status !== "done").length} open`} right={<div style={S.flex}>
        <select value={fEvent} onChange={e => setFEvent(e.target.value)} style={{ padding: "5px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 11 }}><option value="">All Events</option>{events.map(e => <option key={e.id} value={e.id}>{e.eventCode || e.clientName}</option>)}</select>
        {tasks.length > 0 && <Btn v="secondary" sm onClick={exportTasks}>Export CSV</Btn>}
        <Btn sm onClick={() => setShowNew(true)}>+ Task</Btn>
      </div>} />
      <div style={{ padding: "14px 28px" }}>
        {showNew && (
          <Card style={{ marginBottom: 14, borderLeft: `3px solid ${B.gold}`, padding: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "0 8px" }}>
              <Input label="Task" value={nt.title} onChange={v => setNt(p => ({ ...p, title: v }))} />
              <Input label="Event" value={nt.eventId} onChange={v => setNt(p => ({ ...p, eventId: v }))} options={[{ value: "", label: "General" }, ...events.map(e => ({ value: e.id, label: e.eventCode || e.clientName }))]} />
              <Input label="Assignee" value={nt.assignee} onChange={v => setNt(p => ({ ...p, assignee: v }))} options={team} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "0 8px" }}>
              <Input label="Due Date" value={nt.dueDate} onChange={v => setNt(p => ({ ...p, dueDate: v }))} type="date" />
              <Input label="Priority" value={nt.priority} onChange={v => setNt(p => ({ ...p, priority: v }))} options={[{ value: "high", label: "High" }, { value: "normal", label: "Normal" }, { value: "low", label: "Low" }]} />
              <Input label="Category" value={nt.category} onChange={v => setNt(p => ({ ...p, category: v }))} options={TASK_CATEGORIES.map(c => ({ value: c.key, label: `${c.icon} ${c.label}` }))} />
              <Input label="Notes" value={nt.notes} onChange={v => setNt(p => ({ ...p, notes: v }))} placeholder="Details, context, links..." />
            </div>
            <div style={{ ...S.flex, marginTop: 6 }}><Btn sm onClick={addTask}>Add</Btn><Btn v="ghost" sm onClick={() => setShowNew(false)}>Cancel</Btn></div>
          </Card>
        )}

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 0, marginBottom: 14, borderBottom: `2px solid ${B.creamD}` }}>
          {[{ id: "myday", label: "My Day", count: overdue.length + todayTasks.length + inProgressTasks.length }, { id: "board", label: "Board" }, { id: "upcoming", label: "Upcoming", count: upcoming7.length }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 16px", fontSize: 12, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? B.forest : B.muted, borderBottom: tab === t.id ? `2px solid ${B.forest}` : "2px solid transparent", background: "none", border: "none", borderBottomStyle: "solid", cursor: "pointer", fontFamily: "inherit", marginBottom: -2 }}>
              {t.label}{t.count !== undefined ? ` (${t.count})` : ""}
            </button>
          ))}
        </div>

        {/* ═══ MY DAY TAB ═══ */}
        {tab === "myday" && (
          <div>
            {/* Event milestones */}
            {todayMilestones.length > 0 && (
              <div style={{ marginBottom: 12, padding: 10, background: B.blueL, borderRadius: 6, border: `1px solid ${B.blue}20` }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: B.blue, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Event Milestones</div>
                {todayMilestones.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, padding: "3px 0" }}>
                    <span>{m.icon} {m.label} — <b>{m.event.eventCode || m.event.clientName}</b></span>
                    <div style={S.flex}>
                      <button onClick={() => milestoneToTask(m)} style={{ background: "none", border: "none", cursor: "pointer", color: B.blue, fontSize: 10, fontFamily: "inherit" }}>+ Task</button>
                      <button onClick={() => milestoneToAssignment(m)} style={{ background: "none", border: "none", cursor: "pointer", color: B.gold, fontSize: 10, fontFamily: "inherit", fontWeight: 600 }}>+ Assign</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Overdue */}
            {overdue.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: B.red, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Overdue ({overdue.length})</div>
                {overdue.map(t => <TaskCard key={t.id} t={t} />)}
              </div>
            )}

            {/* In Progress */}
            {inProgressTasks.filter(t => t.dueDate !== todayISO && !overdue.includes(t)).length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: B.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>In Progress</div>
                {inProgressTasks.filter(t => t.dueDate !== todayISO && !overdue.includes(t)).map(t => <TaskCard key={t.id} t={t} />)}
              </div>
            )}

            {/* Today */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: B.forest, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Due Today ({todayTasks.length})</div>
              {todayTasks.length === 0 && <div style={{ ...S.xs, padding: "8px 0" }}>Nothing due today.</div>}
              {todayTasks.map(t => <TaskCard key={t.id} t={t} />)}
            </div>

            {/* Unscheduled */}
            {noDue.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: B.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>No Due Date ({noDue.length})</div>
                {noDue.slice(0, 5).map(t => <TaskCard key={t.id} t={t} />)}
                {noDue.length > 5 && <div style={S.sm}>+{noDue.length - 5} more unscheduled tasks</div>}
              </div>
            )}

            {/* Completed Today */}
            {completedToday.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: B.green, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Completed Today ({completedToday.length})</div>
                {completedToday.map(t => <TaskCard key={t.id} t={t} />)}
              </div>
            )}
          </div>
        )}

        {/* ═══ BOARD TAB ═══ */}
        {tab === "board" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {STATS.map(s => { const st = filtered.filter(t => t.status === s); return (
              <div key={s} style={{ background: B.cream + "60", borderRadius: 6, padding: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: COLS[s], marginBottom: 8 }}>{LABELS[s]} ({st.length})</div>
                {st.map(t => <TaskCard key={t.id} t={t} showCheckbox={false} />)}
              </div>
            ); })}
          </div>
        )}

        {/* ═══ UPCOMING TAB ═══ */}
        {tab === "upcoming" && (
          <div>
            {upcoming7.length === 0 && <Empty icon="📅" msg="No tasks due in the next 7 days." />}
            {/* Group by date */}
            {[...new Set(upcoming7.map(t => t.dueDate))].sort().map(date => {
              const dayTasks = upcoming7.filter(t => t.dueDate === date);
              const dayEvents = events.filter(e => e.date === date);
              return (
                <div key={date} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: B.forest, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                    {fmtDateFull(date)}
                    {dayEvents.length > 0 && <Badge color={B.gold}>★ {dayEvents.length} event{dayEvents.length > 1 ? "s" : ""}</Badge>}
                  </div>
                  {dayTasks.map(t => <TaskCard key={t.id} t={t} />)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Assignments({ data, save, setSidePanel, confirmDelete }) {
  const team = data.teamMembers || ["Lindsay", "Mac"];
  const assignments = data.assignments || [];
  const [showNew, setShowNew] = useState(false);
  const [filterPerson, setFilterPerson] = useState("all");
  const [filterStatus, setFilterStatus] = useState("active");
  const [form, setForm] = useState({ person: team[0], eventId: "", role: ASSIGNMENT_ROLES[0], templateKey: "", date: toISO(new Date()), notes: "" });

  const create = () => {
    if (!form.person) return;
    const ev = form.eventId ? data.events.find(e => e.id === form.eventId) : null;
    const templateItems = form.templateKey && getTemplates(data)[form.templateKey]
      ? getTemplates(data)[form.templateKey].map(item => ({ id: uid(), title: item.title, sop: item.sop, done: false, doneAt: null, fromTemplate: true }))
      : [];
    const a = {
      id: uid(),
      person: form.person,
      eventId: form.eventId || "",
      eventName: ev ? (ev.eventCode || ev.clientName) : "",
      role: form.role,
      date: form.date,
      status: "active",
      checklist: templateItems,
      notes: form.notes,
      hoursLogged: 0,
      createdAt: Date.now(),
    };
    save({ assignments: [...assignments, a] });
    setForm({ person: team[0], eventId: "", role: ASSIGNMENT_ROLES[0], templateKey: "", date: toISO(new Date()), notes: "" });
    setShowNew(false);
    openDetail(a);
  };

  const openDetail = (a) => setSidePanel({
    title: `Assignment: ${a.person}`,
    content: <AssignmentDetail assignment={a} data={data} save={save} close={() => setSidePanel(null)} confirmDelete={confirmDelete} />
  });

  const filtered = assignments.filter(a => {
    if (filterPerson !== "all" && a.person !== filterPerson) return false;
    if (filterStatus === "active" && a.status === "closed") return false;
    if (filterStatus === "closed" && a.status !== "closed") return false;
    return true;
  });

  const exportAll = () => {
    const rows = [];
    assignments.forEach(a => {
      (a.checklist || []).forEach(c => {
        rows.push([a.person, a.eventName || "General", a.role, a.date, c.title, c.done ? "Done" : "Open", c.sop || "", a.notes || ""]);
      });
    });
    downloadCSV("gg-assignments.csv", ["Person", "Event", "Role", "Date", "Checklist Item", "Status", "SOP", "Notes"], rows);
  };

  // Stats
  const activeCount = assignments.filter(a => a.status === "active").length;
  const totalItems = assignments.reduce((s, a) => s + (a.checklist || []).length, 0);
  const doneItems = assignments.reduce((s, a) => s + (a.checklist || []).filter(c => c.done).length, 0);

  // Group by person
  const byPerson = {};
  filtered.forEach(a => { byPerson[a.person] = byPerson[a.person] || []; byPerson[a.person].push(a); });

  return (
    <div>
      <PageHead title="Assignments" sub={`${activeCount} active | ${doneItems}/${totalItems} items checked`} right={
        <div style={{ ...S.flex, flexWrap: "wrap" }}>
          <select value={filterPerson} onChange={e => setFilterPerson(e.target.value)} style={{ padding: "5px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 11, fontFamily: "inherit" }}>
            <option value="all">All People</option>
            {team.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "5px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 11, fontFamily: "inherit" }}>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="all">All</option>
          </select>
          <Btn sm onClick={() => setShowNew(true)}>+ Assign</Btn>
          {assignments.length > 0 && <Btn v="secondary" sm onClick={exportAll}>Export CSV</Btn>}
        </div>
      } />
      <div style={{ padding: "14px 28px" }}>

        {/* New Assignment Form */}
        {showNew && (
          <Card style={{ marginBottom: 16, borderLeft: `3px solid ${B.gold}`, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.forest, marginBottom: 10 }}>New Assignment</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 8px" }}>
              <Input label="Person" value={form.person} onChange={v => setForm(p => ({ ...p, person: v }))} options={team} />
              <Input label="Event (optional)" value={form.eventId} onChange={v => setForm(p => ({ ...p, eventId: v }))} options={[{ value: "", label: "General / No Event" }, ...data.events.map(e => ({ value: e.id, label: e.eventCode || e.clientName }))]} />
              <Input label="Role" value={form.role} onChange={v => setForm(p => ({ ...p, role: v }))} options={ASSIGNMENT_ROLES} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "0 8px" }}>
              <Input label="Date" value={form.date} onChange={v => setForm(p => ({ ...p, date: v }))} type="date" />
              <Input label="Checklist Template" value={form.templateKey} onChange={v => setForm(p => ({ ...p, templateKey: v }))} options={[{ value: "", label: "Blank (manual only)" }, ...Object.keys(getTemplates(data)).map(k => ({ value: k, label: k }))]} />
              <Input label="Notes" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} />
            </div>
            {form.templateKey && getTemplates(data)[form.templateKey] && (
              <div style={{ marginTop: 6, padding: 8, background: B.cream, borderRadius: 5, fontSize: 10, color: B.muted }}>
                Template will add {getTemplates(data)[form.templateKey].length} checklist items. You can edit after creation.
              </div>
            )}
            <div style={{ ...S.flex, marginTop: 8 }}>
              <Btn onClick={create}>Create Assignment</Btn>
              <Btn v="ghost" onClick={() => setShowNew(false)}>Cancel</Btn>
            </div>
          </Card>
        )}

        {/* Assignment List by Person */}
        {filtered.length === 0 ? (
          <Empty icon="◉" msg="No assignments yet." hint="Assignments pair a person with a task and SOP checklist — the bridge between planning and doing." action={<Btn onClick={() => setShowNew(true)}>+ Create Assignment</Btn>} />
        ) : (
          Object.entries(byPerson).map(([person, personAssignments]) => (
            <div key={person} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: B.forest, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                {person}
                <Badge color={B.sage}>{personAssignments.length} assignment{personAssignments.length !== 1 ? "s" : ""}</Badge>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
                {personAssignments.sort((a, b) => (a.date || "").localeCompare(b.date || "")).map(a => {
                  const done = (a.checklist || []).filter(c => c.done).length;
                  const total = (a.checklist || []).length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  const ev = a.eventId ? data.events.find(e => e.id === a.eventId) : null;
                  const hours = data.timeEntries.filter(te => te.eventId === a.eventId && te.person === a.person).reduce((s, te) => s + (te.hours || 0), 0);
                  return (
                    <Card key={a.id} onClick={() => openDetail(a)} style={{ cursor: "pointer", padding: 12, borderLeft: `3px solid ${pct === 100 ? B.green : pct > 0 ? B.gold : B.sage}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>{a.role}</div>
                          {ev && <div style={{ fontSize: 10, color: B.blue }}>{ev.eventCode || ev.clientName} — {fmtDate(a.date)}</div>}
                          {!ev && <div style={S.sm}>General — {fmtDate(a.date)}</div>}
                        </div>
                        {a.status === "closed" && <Badge color={B.sage}>Closed</Badge>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <div style={{ flex: 1, height: 5, background: B.cream, borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", background: pct === 100 ? B.green : B.gold, width: `${pct}%`, borderRadius: 3, transition: "width 0.3s" }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, color: pct === 100 ? B.green : B.muted }}>{done}/{total}</span>
                      </div>
                      {hours > 0 && <div style={{ fontSize: 9, color: B.muted, marginTop: 4 }}>{hours.toFixed(1)} hrs logged</div>}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AssignmentDetail({ assignment, data, save, close, confirmDelete }) {
  const [a, setA] = useState({ ...assignment });
  const [newItem, setNewItem] = useState("");
  const team = data.teamMembers || ["Lindsay", "Mac"];
  const ev = a.eventId ? data.events.find(e => e.id === a.eventId) : null;
  const checklist = a.checklist || [];
  const done = checklist.filter(c => c.done).length;
  const total = checklist.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const hours = data.timeEntries.filter(te => te.eventId === a.eventId && te.person === a.person).reduce((s, te) => s + (te.hours || 0), 0);

  const persist = (updated) => {
    const next = { ...a, ...updated };
    setA(next);
    save({ assignments: (data.assignments || []).map(x => x.id === a.id ? next : x) });
  };

  const toggleItem = (itemId) => {
    persist({ checklist: checklist.map(c => c.id === itemId ? { ...c, done: !c.done, doneAt: !c.done ? Date.now() : null } : c) });
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    persist({ checklist: [...checklist, { id: uid(), title: newItem.trim(), sop: "", done: false, doneAt: null, fromTemplate: false }] });
    setNewItem("");
  };

  const removeItem = (itemId) => persist({ checklist: checklist.filter(c => c.id !== itemId) });

  const addFromTemplate = (templateKey) => {
    if (!getTemplates(data)[templateKey]) return;
    const existing = new Set(checklist.map(c => c.title));
    const newItems = getTemplates(data)[templateKey]
      .filter(t => !existing.has(t.title))
      .map(t => ({ id: uid(), title: t.title, sop: t.sop, done: false, doneAt: null, fromTemplate: true }));
    if (newItems.length > 0) persist({ checklist: [...checklist, ...newItems] });
  };

  const closeAssignment = () => persist({ status: a.status === "closed" ? "active" : "closed" });

  const deleteAssignment = () => {
    if (confirmDelete) {
      confirmDelete("Delete this assignment?", () => {
        save({ assignments: (data.assignments || []).filter(x => x.id !== a.id) });
        close();
      });
    }
  };

  const exportChecklist = () => {
    const rows = checklist.map(c => [a.person, a.eventName || "General", a.role, c.title, c.done ? "Done" : "Open", c.sop || "", c.doneAt ? new Date(c.doneAt).toLocaleString() : ""]);
    downloadCSV(`assignment-${a.person}-${a.date}.csv`, ["Person", "Event", "Role", "Item", "Status", "SOP Ref", "Completed At"], rows);
  };

  return (
    <div>
      {/* Header info */}
      <Card style={{ marginBottom: 12, background: B.cream, padding: 12 }}>
        <div style={S.grid2}>
          <div>
            <div style={{ ...S.sm, textTransform: "uppercase", letterSpacing: 1 }}>Person</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{a.person}</div>
          </div>
          <div>
            <div style={{ ...S.sm, textTransform: "uppercase", letterSpacing: 1 }}>Role</div>
            <select value={a.role} onChange={e => persist({ role: e.target.value })} style={{ fontWeight: 600, fontSize: 12, border: `1px solid ${B.creamD}`, borderRadius: 4, padding: "2px 6px", fontFamily: "inherit", background: B.white }}>
              {ASSIGNMENT_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        {ev && (
          <div style={{ marginTop: 8 }}>
            <div style={{ ...S.sm, textTransform: "uppercase", letterSpacing: 1 }}>Event</div>
            <div style={{ fontWeight: 600, color: B.blue }}>{ev.eventCode || ev.clientName} — {fmtDate(ev.date)} @ {ev.venue}</div>
          </div>
        )}
        <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 11 }}>
          <div><span style={{ color: B.muted }}>Date: </span><span style={{ fontWeight: 600 }}>{fmtDate(a.date)}</span></div>
          <div><span style={{ color: B.muted }}>Hours: </span><span style={{ fontWeight: 600 }}>{hours.toFixed(1)}</span></div>
          <div><span style={{ color: B.muted }}>Progress: </span><span style={{ fontWeight: 600, color: pct === 100 ? B.green : B.gold }}>{done}/{total} ({pct}%)</span></div>
        </div>
        <div style={{ height: 6, background: B.white, borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", background: pct === 100 ? B.green : B.gold, width: `${pct}%`, borderRadius: 3 }} />
        </div>
      </Card>

      {/* Notes */}
      <div style={{ marginBottom: 10 }}>
        <textarea value={a.notes || ""} onChange={e => persist({ notes: e.target.value })} placeholder="Assignment notes..."
          style={{ width: "100%", padding: 8, border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 11, fontFamily: "inherit", minHeight: 40, resize: "vertical", boxSizing: "border-box" }} />
      </div>

      {/* Checklist */}
      <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: B.forest }}>Checklist</span>
        <div style={{ display: "flex", gap: 4 }}>
          <select onChange={e => { if (e.target.value) addFromTemplate(e.target.value); e.target.value = ""; }} style={{ fontSize: 9, padding: "3px 6px", border: `1px solid ${B.creamD}`, borderRadius: 4, fontFamily: "inherit", color: B.muted }}>
            <option value="">+ Add template...</option>
            {Object.keys(getTemplates(data)).map(k => <option key={k} value={k}>{k} ({getTemplates(data)[k].length})</option>)}
          </select>
        </div>
      </div>

      {checklist.length === 0 && (
        <div style={{ textAlign: "center", padding: 16, color: B.muted, fontSize: 11 }}>No checklist items. Add from a template or type below.</div>
      )}

      {checklist.map((c, i) => (
        <div key={c.id} style={{
          display: "flex", alignItems: "start", gap: 8, padding: "7px 0",
          borderBottom: `1px solid ${B.cream}`,
          opacity: c.done ? 0.6 : 1,
        }}>
          <input type="checkbox" checked={c.done} onChange={() => toggleItem(c.id)} style={{ marginTop: 2, cursor: "pointer", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, textDecoration: c.done ? "line-through" : "none", lineHeight: 1.3 }}>{c.title}</div>
            <div style={{ ...S.flex, marginTop: 2, fontSize: 9 }}>
              {c.sop && <span style={{ color: B.sage, fontWeight: 600 }}>SOP {c.sop}</span>}
              {c.fromTemplate && <span style={{ color: B.muted }}>Template</span>}
              {c.doneAt && <span style={{ color: B.green }}>✓ {new Date(c.doneAt).toLocaleDateString()}</span>}
            </div>
          </div>
          <button onClick={() => removeItem(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: B.muted, fontSize: 12, padding: "0 4px", fontFamily: "inherit" }}>✕</button>
        </div>
      ))}

      {/* Add manual item */}
      <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
        <input value={newItem} onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") addItem(); }}
          placeholder="Add checklist item..."
          style={{ flex: 1, padding: "6px 10px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 11, fontFamily: "inherit" }} />
        <Btn sm onClick={addItem}>+</Btn>
      </div>

      {/* Actions */}
      <div style={{ ...S.flex, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${B.creamD}` }}>
        <Btn v={a.status === "closed" ? "gold" : "secondary"} sm onClick={closeAssignment}>
          {a.status === "closed" ? "Reopen" : "Close Assignment"}
        </Btn>
        <Btn v="secondary" sm onClick={exportChecklist}>Export Checklist</Btn>
        <Btn v="danger" sm onClick={deleteAssignment}>Delete</Btn>
      </div>
    </div>
  );
}
function TimeClock({ data, save }) {
  const team = data.teamMembers || ["Lindsay", "Mac"];
  const [person, setPerson] = useState(team[0]); const [workType, setWorkType] = useState("Studio Production");
  const [eventId, setEventId] = useState(""); const [note, setNote] = useState("");
  const [manPerson, setManPerson] = useState(team[0]); const [manWork, setManWork] = useState("Studio Production");
  const [manEvent, setManEvent] = useState(""); const [manHours, setManHours] = useState("");
  const [manNote, setManNote] = useState(""); const [manDate, setManDate] = useState(toISO(new Date()));
  const [showAll, setShowAll] = useState(false); const [tcTab, setTcTab] = useState("log");
  const [newMember, setNewMember] = useState(""); const [showTeam, setShowTeam] = useState(false);
  const { timeEntries, activeTimer, events } = data;

  const clockIn = () => save({ activeTimer: { person, workType, eventId, note, startTime: Date.now() } });
  const clockOut = () => { if (!activeTimer) return; const hours = Math.round(((Date.now() - activeTimer.startTime) / 36e5) * 100) / 100; save({ timeEntries: [...timeEntries, { id: uid(), person: activeTimer.person, workType: activeTimer.workType, eventId: activeTimer.eventId, note: activeTimer.note, date: toISO(new Date()), hours }], activeTimer: null }); };
  const addManual = () => { if (!manHours) return; save({ timeEntries: [...timeEntries, { id: uid(), person: manPerson, workType: manWork, eventId: manEvent, note: manNote, date: manDate, hours: safeNum(manHours) }] }); setManHours(""); setManNote(""); };
  const rmEntry = (id) => save({ timeEntries: timeEntries.filter(t => t.id !== id) });
  const addMember = () => { if (!newMember.trim() || team.includes(newMember.trim())) return; save({ teamMembers: [...team, newMember.trim()] }); setNewMember(""); };
  const removeMember = (name) => save({ teamMembers: team.filter(m => m !== name) });
  const exportHours = () => downloadCSV("gg-hours.csv", ["Date", "Person", "Work Type", "Event", "Notes", "Hours"], timeEntries.map(te => [te.date, te.person, te.workType, events.find(e => e.id === te.eventId)?.eventCode || "General", te.note, te.hours]));
  const totalHrs = timeEntries.reduce((s, e) => s + (e.hours || 0), 0);

  // Dashboard calcs
  const byPerson = {}; const byType = {}; const byWeek = {};
  timeEntries.forEach(te => {
    byPerson[te.person] = (byPerson[te.person] || 0) + (te.hours || 0);
    byType[te.workType] = (byType[te.workType] || 0) + (te.hours || 0);
    if (te.date) { const wk = te.date.slice(0, 7); byWeek[wk] = (byWeek[wk] || 0) + (te.hours || 0); }
  });
  const maxPersonHrs = Math.max(...Object.values(byPerson), 1);
  const maxTypeHrs = Math.max(...Object.values(byType), 1);
  const display = showAll ? [...timeEntries].reverse() : [...timeEntries].reverse().slice(0, 30);

  return (
    <div>
      <PageHead title="Time Clock" sub={`${totalHrs.toFixed(1)} total hours logged`} right={<div style={S.flex}>{timeEntries.length > 0 && <Btn v="secondary" sm onClick={exportHours}>Export CSV</Btn>}<Btn v="ghost" sm onClick={() => setShowTeam(!showTeam)}>{showTeam ? "Hide" : "Manage"} Team</Btn></div>} />
      <div style={S.page}>
        {showTeam && (
          <Card style={{ marginBottom: 14, borderLeft: `3px solid ${B.gold}`, padding: 12 }}>
            <div style={S.label}>Team Members</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
              {team.map(m => (
                <span key={m} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", background: B.greenL, borderRadius: 12, fontSize: 11, fontWeight: 500 }}>
                  {m} <button onClick={() => removeMember(m)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: B.red, padding: 0 }}>✕</button>
                </span>
              ))}
            </div>
            <div style={S.flex}>
              <input value={newMember} onChange={ev => setNewMember(ev.target.value)} onKeyDown={ev => ev.key === "Enter" && addMember()} placeholder="Add team member name..." style={{ flex: 1, padding: "5px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 12 }} />
              <Btn sm onClick={addMember}>Add</Btn>
            </div>
          </Card>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <Card>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: B.forest }}>{activeTimer ? "Timer Running" : "Start Timer"}</div>
            {activeTimer ? (
              <div style={{ textAlign: "center", padding: 16 }}>
                <div style={{ fontSize: 12, color: B.muted }}>{activeTimer.person} — {activeTimer.workType}</div>
                <TimerDisplay startTime={activeTimer.startTime} style={{ color: B.gold, fontSize: 32, fontWeight: 700, display: "block", margin: "10px 0" }} />
                <Btn v="danger" onClick={clockOut}>Clock Out</Btn>
              </div>
            ) : (<>
              <Input label="Person" value={person} onChange={setPerson} options={team} />
              <Input label="Work Type" value={workType} onChange={setWorkType} options={WORK_TYPES} />
              <Input label="Event" value={eventId} onChange={setEventId} options={[{ value: "", label: "General / Shop" }, ...events.map(e => ({ value: e.id, label: e.eventCode || e.clientName }))]} />
              <Input label="Notes" value={note} onChange={setNote} placeholder="What are you working on?" />
              <Btn onClick={clockIn}>Start Timer</Btn>
            </>)}
          </Card>
          <Card>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: B.forest }}>Manual Entry</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
              <Input label="Person" value={manPerson} onChange={setManPerson} options={team} />
              <Input label="Date" value={manDate} onChange={setManDate} type="date" />
            </div>
            <Input label="Work Type" value={manWork} onChange={setManWork} options={WORK_TYPES} />
            <Input label="Event" value={manEvent} onChange={setManEvent} options={[{ value: "", label: "General / Shop" }, ...events.map(e => ({ value: e.id, label: e.eventCode || e.clientName }))]} />
            <Input label="Hours" value={manHours} onChange={setManHours} type="number" placeholder="e.g. 3.5" />
            <Btn onClick={addManual}>Log Hours</Btn>
          </Card>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 0, marginBottom: 14, borderBottom: `1px solid ${B.creamD}` }}>
          {[{ id: "log", l: "Hour Log" }, { id: "dashboard", l: "Hours Dashboard" }].map(t => (
            <button key={t.id} onClick={() => setTcTab(t.id)} style={{ padding: "8px 14px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, background: "transparent", color: tcTab === t.id ? B.forest : B.muted, borderBottom: tcTab === t.id ? `2px solid ${B.forest}` : "2px solid transparent", fontFamily: "inherit" }}>{t.l}</button>
          ))}
        </div>

        {tcTab === "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <div style={{ ...S.label, marginBottom: 10 }}>Hours by Person</div>
              {Object.entries(byPerson).sort((a, b) => b[1] - a[1]).map(([p, h]) => (
                <div key={p} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}><span>{p}</span><span style={{ fontWeight: 600 }}>{h.toFixed(1)}h</span></div>
                  <div style={{ height: 8, background: B.cream, borderRadius: 4 }}><div style={{ height: "100%", background: B.forest, borderRadius: 4, width: `${(h / maxPersonHrs) * 100}%` }} /></div>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{ ...S.label, marginBottom: 10 }}>Hours by Work Type</div>
              {Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([t, h]) => (
                <div key={t} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}><span>{t}</span><span style={{ fontWeight: 600 }}>{h.toFixed(1)}h</span></div>
                  <div style={{ height: 8, background: B.cream, borderRadius: 4 }}><div style={{ height: "100%", background: B.gold, borderRadius: 4, width: `${(h / maxTypeHrs) * 100}%` }} /></div>
                </div>
              ))}
            </Card>
            <Card style={{ gridColumn: "span 2" }}>
              <div style={{ ...S.label, marginBottom: 10 }}>Hours by Month</div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 100 }}>
                {Object.entries(byWeek).sort().slice(-8).map(([mo, h]) => {
                  const maxMo = Math.max(...Object.values(byWeek), 1);
                  return (
                    <div key={mo} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ height: `${(h / maxMo) * 80}px`, background: B.forest, borderRadius: "3px 3px 0 0", minHeight: 4, transition: "height 0.3s" }} />
                      <div style={{ fontSize: 9, color: B.muted, marginTop: 4 }}>{mo}</div>
                      <div style={{ fontSize: 10, fontWeight: 600 }}>{h.toFixed(1)}h</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {tcTab === "log" && (
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontSize: 12, fontWeight: 600 }}>Log ({timeEntries.length})</span><span style={{ fontSize: 12, fontWeight: 600, color: B.forest }}>{totalHrs.toFixed(1)}h total</span></div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ borderBottom: `2px solid ${B.creamD}` }}>{["Date", "Person", "Work Type", "Event", "Notes", "Hours", ""].map(h => <th key={h} style={{ textAlign: h === "Hours" ? "right" : "left", padding: "6px 4px", fontSize: 10, color: B.muted, fontWeight: 600 }}>{h}</th>)}</tr></thead>
              <tbody>{display.map(te => { const ev = events.find(e => e.id === te.eventId); return (
                <tr key={te.id} style={{ borderBottom: `1px solid ${B.cream}` }}>
                  <td style={{ padding: "5px 4px" }}>{te.date}</td><td>{te.person}</td><td>{te.workType}</td>
                  <td style={{ color: B.muted }}>{ev?.eventCode || "General"}</td>
                  <td style={{ color: B.muted, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{te.note}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{te.hours?.toFixed(1)}h</td>
                  <td><button onClick={() => rmEntry(te.id)} style={S.rmBtn}>✕</button></td>
                </tr>
              ); })}</tbody>
            </table>
            {timeEntries.length > 30 && !showAll && <div style={{ textAlign: "center", marginTop: 8 }}><Btn v="ghost" sm onClick={() => setShowAll(true)}>Show All ({timeEntries.length})</Btn></div>}
          </Card>
        )}
      </div>
    </div>
  );
}

function Overhead({ data, save }) {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [editing, setEditing] = useState(false); const [vals, setVals] = useState({});
  const [newExp, setNewExp] = useState({ name: "", amount: "" });
  const customExps = (data.customExpenses || []).filter(e => e.month === month);
  const actuals = (data.overheadActuals || []).filter(e => e.month === month);
  useEffect(() => { const m = {}; MONTHLY_OVERHEAD_BASE.forEach(o => { const a = actuals.find(a => a.name === o.name); m[o.name] = a ? a.actual : o.amount; }); setVals(m); }, [month, data.overheadActuals]);
  const totalBudget = MONTHLY_OVERHEAD_BASE.reduce((s, o) => s + o.amount, 0);
  const saveMonth = () => { save({ overheadActuals: [...(data.overheadActuals || []).filter(e => e.month !== month), ...MONTHLY_OVERHEAD_BASE.map(o => ({ name: o.name, budget: o.amount, actual: Number(vals[o.name]) || 0, month }))] }); setEditing(false); };
  const addExpense = () => { if (!newExp.name || !newExp.amount) return; save({ customExpenses: [...(data.customExpenses || []), { id: uid(), name: newExp.name, amount: safeNum(newExp.amount), month }] }); setNewExp({ name: "", amount: "" }); };
  const rmCustom = (id) => save({ customExpenses: (data.customExpenses || []).filter(e => e.id !== id) });

  return (
    <div>
      <PageHead title="Overhead Tracker" sub={`Monthly: ${fmt$(MONTHLY_BASE_TOTAL)} | Annual: ${fmt$(ANNUAL_OVERHEAD)}`} />
      <div style={S.page}>
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <input type="month" value={month} onChange={e => setMonth(e.target.value)} style={{ padding: "5px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 12 }} />
              <Btn sm v={editing ? "primary" : "secondary"} onClick={editing ? saveMonth : () => setEditing(true)}>{editing ? "Save" : "Edit Actuals"}</Btn>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ borderBottom: `2px solid ${B.creamD}` }}><th style={{ textAlign: "left", padding: "6px 0", fontSize: 10, color: B.muted }}>Expense</th><th style={{ textAlign: "right", fontSize: 10, color: B.muted }}>Budget</th><th style={{ textAlign: "right", fontSize: 10, color: B.muted }}>Actual</th><th style={{ textAlign: "right", fontSize: 10, color: B.muted }}>Var</th></tr></thead>
              <tbody>
                {MONTHLY_OVERHEAD_BASE.map(o => { const actual = Number(vals[o.name]) || 0; const v = actual - o.amount; return (
                  <tr key={o.name} style={{ borderBottom: `1px solid ${B.cream}` }}>
                    <td style={{ padding: "6px 0" }}>{o.name}</td><td style={{ textAlign: "right", color: B.muted }}>{fmt$(o.amount)}</td>
                    <td style={S.right}>{editing ? <input type="number" value={vals[o.name] ?? ""} onChange={e => setVals(p => ({ ...p, [o.name]: e.target.value }))} style={{ width: 70, textAlign: "right", padding: "2px 4px", border: `1px solid ${B.creamD}`, borderRadius: 3, fontSize: 12 }} /> : <span style={{ fontWeight: 500 }}>{fmt$(actual)}</span>}</td>
                    <td style={{ textAlign: "right", color: v > 0 ? B.red : v < 0 ? B.green : B.muted, fontSize: 11 }}>{v > 0 ? "+" : ""}{v !== 0 ? fmt$(v) : "—"}</td>
                  </tr>); })}
                {customExps.map(ce => (<tr key={ce.id} style={{ borderBottom: `1px solid ${B.cream}`, background: B.cream + "40" }}><td style={{ padding: "6px 0" }}>{ce.name} <Badge color={B.gold}>Custom</Badge></td><td style={{ textAlign: "right", color: B.muted }}>{fmt$(ce.amount)}</td><td style={{ textAlign: "right", fontWeight: 500 }}>{fmt$(ce.amount)}</td><td style={S.right}><button onClick={() => rmCustom(ce.id)} style={S.rmBtn}>✕</button></td></tr>))}
              </tbody>
            </table>
            <div style={{ marginTop: 10, fontWeight: 700, fontSize: 13, display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: `2px solid ${B.forest}` }}><span>TOTAL</span><span>{fmt$(totalBudget + customExps.reduce((s, e) => s + e.amount, 0))}</span></div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${B.creamD}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: B.forest }}>Add Expense for {month}</div>
              <div style={S.flex}>
                <input value={newExp.name} onChange={e => setNewExp(p => ({ ...p, name: e.target.value }))} placeholder="Expense name" style={{ flex: 2, padding: "6px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 12 }} />
                <input type="number" value={newExp.amount} onChange={e => setNewExp(p => ({ ...p, amount: e.target.value }))} placeholder="Amount" style={{ flex: 1, padding: "6px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 12 }} />
                <Btn sm onClick={addExpense}>Add</Btn>
              </div>
            </div>
          </Card>
          <div>
            <Card style={{ marginBottom: 12, background: B.cream }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Overhead per Event</div>
              {[18, 22, 25, 30].map(n => (<div key={n} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0" }}><span>{n} events:</span><span style={{ fontWeight: 600 }}>{fmt$(Math.round(ANNUAL_OVERHEAD / n))}</span></div>))}
            </Card>
            <Card>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>2024 Reference</div>
              <div style={{ ...S.xs, marginBottom: 6 }}>Total: <strong style={{ color: B.text }}>$70,474</strong></div>
              {[["Fresh Product", 16938], ["Rent", 16800], ["Lindsay Draws", 4395], ["Verizon", 3129], ["Car Insurance", 3317], ["Loan Payment", 3039], ["Supplies", 2988], ["Gas", 2024]].map(([l, v]) => (<div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "2px 0" }}><span>{l}</span><span style={{ fontWeight: 500 }}>{fmt$(v)}</span></div>))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Whiteboard({ data, save }) {
  const [nw, setNw] = useState({ title: "", content: "", color: B.cream, tag: "" });
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("");
  const colors = [B.cream, "#FFF3E0", "#E8F5EC", "#E8EDF5", "#F5E8E8", "#FFF8E1"];
  const tags = [...new Set(data.whiteboard.map(i => i.tag).filter(Boolean))];
  const add = () => { if (!nw.title) return; save({ whiteboard: [...data.whiteboard, { ...nw, id: uid(), createdAt: Date.now() }] }); setNw({ title: "", content: "", color: B.cream, tag: "" }); };
  const rm = (id) => save({ whiteboard: data.whiteboard.filter(i => i.id !== id) });
  const startEdit = (item) => setEditing({ ...item });
  const saveEdit = () => { if (!editing) return; save({ whiteboard: data.whiteboard.map(i => i.id === editing.id ? editing : i) }); setEditing(null); };
  const filtered = filter ? data.whiteboard.filter(i => i.tag === filter) : data.whiteboard;

  return (
    <div>
      <PageHead title="Whiteboard" sub="Quick capture, ideas, notes" right={tags.length > 0 && <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: "5px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 11 }}><option value="">All Tags</option>{tags.map(t => <option key={t} value={t}>{t}</option>)}</select>} />
      <div style={S.page}>
        <Card style={{ marginBottom: 20, background: B.cream, padding: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 120px auto", gap: 8, alignItems: "end" }}>
            <Input label="Title" value={nw.title} onChange={v => setNw(p => ({ ...p, title: v }))} />
            <Input label="Content" value={nw.content} onChange={v => setNw(p => ({ ...p, content: v }))} />
            <Input label="Tag" value={nw.tag} onChange={v => setNw(p => ({ ...p, tag: v }))} placeholder="e.g. Idea, Todo" />
            <div style={{ display: "flex", gap: 3, marginBottom: 10, alignItems: "center" }}>
              {colors.map(c => <div key={c} onClick={() => setNw(p => ({ ...p, color: c }))} style={{ width: 16, height: 16, borderRadius: "50%", background: c, cursor: "pointer", border: nw.color === c ? `2px solid ${B.forest}` : `1px solid ${B.creamD}` }} />)}
              <Btn sm onClick={add} style={{ marginLeft: 6 }}>Add</Btn>
            </div>
          </div>
        </Card>

        {editing && (
          <Card style={{ marginBottom: 16, borderLeft: `3px solid ${B.gold}`, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: B.muted, marginBottom: 8 }}>Editing Note</div>
            <Input label="Title" value={editing.title} onChange={v => setEditing(p => ({ ...p, title: v }))} />
            <Input label="Content" value={editing.content} onChange={v => setEditing(p => ({ ...p, content: v }))} textarea />
            <Input label="Tag" value={editing.tag || ""} onChange={v => setEditing(p => ({ ...p, tag: v }))} />
            <div style={S.flex}><Btn sm onClick={saveEdit}>Save</Btn><Btn v="ghost" sm onClick={() => setEditing(null)}>Cancel</Btn></div>
          </Card>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {filtered.map(i => (
            <div key={i.id} style={{ background: i.color, border: `1px solid ${B.creamD}`, borderRadius: 6, padding: 14, position: "relative", minHeight: 80 }}>
              <div style={{ position: "absolute", top: 6, right: 6, display: "flex", gap: 4 }}>
                <button onClick={() => startEdit(i)} style={{ background: "none", border: "none", cursor: "pointer", color: B.muted, fontSize: 11 }}>✎</button>
                <button onClick={() => rm(i.id)} style={{ background: "none", border: "none", cursor: "pointer", color: B.muted, fontSize: 12 }}>✕</button>
              </div>
              {i.tag && <Badge color={B.gold}>{i.tag}</Badge>}
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, marginTop: i.tag ? 4 : 0 }}>{i.title}</div>
              <div style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>{i.content}</div>
              <div style={{ fontSize: 9, color: B.muted, marginTop: 6 }}>{new Date(i.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <Empty icon="▤" msg={filter ? "No notes with this tag" : "Empty whiteboard"} />}
      </div>
    </div>
  );
}

function FlowerCatalog({ data, save }) {
  const catalog = data.flowerCatalog || [];
  const supplies = data.supplyCatalog || [];
  const [tab, setTab] = useState("flowers");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Focal", season: "Year-Round", wholesaleCost: 0, stemsPerBunch: 10, bunchCost: 0, color: "", supplier: "", notes: "" });
  const [supForm, setSupForm] = useState({ name: "", category: "Design", unit: "each", costPer: 0, qtyOnHand: 0, parLevel: 0, reorderQty: 0, supplier: "", notes: "" });
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [showResources, setShowResources] = useState(false);
  const [showSupNew, setShowSupNew] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [showBulk, setShowBulk] = useState(false);

  const calcStemCost = (bunchCost, stemsPerBunch) => stemsPerBunch > 0 ? Math.round((bunchCost / stemsPerBunch) * 100) / 100 : 0;

  // Flower CRUD
  const addFlower = () => {
    if (!form.name) return;
    const wc = form.wholesaleCost > 0 ? safeNum(form.wholesaleCost) : calcStemCost(safeNum(form.bunchCost), safeNum(form.stemsPerBunch));
    save({ flowerCatalog: [...catalog, { ...form, id: uid(), wholesaleCost: wc, stemsPerBunch: safeNum(form.stemsPerBunch), bunchCost: safeNum(form.bunchCost), createdAt: Date.now() }] });
    setForm({ name: "", category: "Focal", season: "Year-Round", wholesaleCost: 0, stemsPerBunch: 10, bunchCost: 0, color: "", supplier: "", notes: "" });
    setShowNew(false);
  };
  const updateFlower = () => { if (!editing) return; const wc = editing.wholesaleCost > 0 ? Number(editing.wholesaleCost) : calcStemCost(Number(editing.bunchCost), Number(editing.stemsPerBunch)); save({ flowerCatalog: catalog.map(f => f.id === editing.id ? { ...editing, wholesaleCost: wc, stemsPerBunch: Number(editing.stemsPerBunch), bunchCost: Number(editing.bunchCost) } : f) }); setEditing(null); };
  const deleteFlower = (id) => save({ flowerCatalog: catalog.filter(f => f.id !== id) });
  const loadStarter = () => { const existing = new Set(catalog.map(f => f.name.toLowerCase())); const nf = STARTER_FLOWERS.filter(f => !existing.has(f.name.toLowerCase())).map(f => ({ ...f, id: uid(), notes: "", createdAt: Date.now() })); if (nf.length > 0) save({ flowerCatalog: [...catalog, ...nf] }); };
  const bulkImport = () => {
    if (!bulkText.trim()) return;
    const existing = new Set(catalog.map(f => f.name.toLowerCase()));
    const lines = bulkText.trim().split("\n").map(l => l.trim()).filter(Boolean);
    const newFlowers = lines.map(line => {
      const parts = line.split(/[,\t]+/).map(p => p.trim());
      const name = parts[0] || "";
      if (!name || existing.has(name.toLowerCase())) return null;
      existing.add(name.toLowerCase());
      const cat = FLOWER_CATEGORIES.find(c => c.toLowerCase() === (parts[1] || "").toLowerCase()) || "Focal";
      const cost = parseFloat(parts[2] || parts[1] || "0") || 0;
      const hasCat = isNaN(parseFloat(parts[1]));
      return { id: uid(), name, category: hasCat ? cat : "Focal", season: "Year-Round", wholesaleCost: hasCat ? cost : parseFloat(parts[1]) || 0, stemsPerBunch: 10, bunchCost: 0, color: "", supplier: "", notes: "Bulk import", createdAt: Date.now() };
    }).filter(Boolean);
    if (newFlowers.length > 0) { save({ flowerCatalog: [...catalog, ...newFlowers] }); setBulkText(""); setShowBulk(false); }
  };

  // Supply CRUD
  const addSupply = () => { if (!supForm.name) return; save({ supplyCatalog: [...supplies, { ...supForm, id: uid(), costPer: Number(supForm.costPer), qtyOnHand: Number(supForm.qtyOnHand), parLevel: Number(supForm.parLevel), reorderQty: Number(supForm.reorderQty), createdAt: Date.now() }] }); setSupForm({ name: "", category: "Design", unit: "each", costPer: 0, qtyOnHand: 0, parLevel: 0, reorderQty: 0, supplier: "", notes: "" }); setShowSupNew(false); };
  const deleteSupply = (id) => save({ supplyCatalog: supplies.filter(s => s.id !== id) });
  const updateSupplyQty = (id, qty) => save({ supplyCatalog: supplies.map(s => s.id === id ? { ...s, qtyOnHand: Number(qty) } : s) });
  const loadStarterSupplies = () => { const existing = new Set(supplies.map(s => s.name.toLowerCase())); const ns = STARTER_SUPPLIES.filter(s => !existing.has(s.name.toLowerCase())).map(s => ({ ...s, id: uid(), qtyOnHand: 0, supplier: "", notes: "", createdAt: Date.now() })); if (ns.length > 0) save({ supplyCatalog: [...supplies, ...ns] }); };

  // Shopping list from upcoming estimates
  const generateShoppingList = () => {
    const upcoming = data.events.filter(e => new Date(e.date + "T12:00:00") >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
    const estMap = {};
    (data.estimates || []).forEach(est => { if (est.eventId) estMap[est.eventId] = est; });
    const flowerNeeds = {};
    const supplyNeeds = {};
    upcoming.forEach(ev => {
      const est = estMap[ev.id];
      if (!est) return;
      (est.items || []).forEach(item => {
        (item.recipe || []).forEach(r => {
          if (r.flowerName) { flowerNeeds[r.flowerName] = (flowerNeeds[r.flowerName] || 0) + ((r.qty || 0) * (item.qty || 1)); }
        });
        // Supply estimates by piece type
        if (item.piece) { supplyNeeds[item.piece] = (supplyNeeds[item.piece] || 0) + (item.qty || 1); }
      });
    });
    return { upcoming, flowerNeeds, supplyNeeds };
  };

  const filtered = catalog.filter(f => (!filter || f.category === filter) && (!search || f.name.toLowerCase().includes(search.toLowerCase()) || (f.color || "").toLowerCase().includes(search.toLowerCase())));
  const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  const grouped = FLOWER_CATEGORIES.map(cat => ({ cat, items: sorted.filter(f => f.category === cat) })).filter(g => g.items.length > 0);

  const SUPPLY_CATS = ["Design", "Shop", "Tool", "Rental Supply"];
  const supplyFiltered = supplies.filter(s => (!filter || s.category === filter) && (!search || s.name.toLowerCase().includes(search.toLowerCase())));
  const supplyGrouped = SUPPLY_CATS.map(cat => ({ cat, items: supplyFiltered.filter(s => s.category === cat).sort((a, b) => a.name.localeCompare(b.name)) })).filter(g => g.items.length > 0);
  const lowStock = supplies.filter(s => s.qtyOnHand < s.parLevel);

  const exportCSV = () => downloadCSV("gg-flower-catalog.csv", ["Name", "Category", "Season", "Cost/Stem", "Stems/Bunch", "Bunch Cost", "Color", "Supplier", "Notes"], catalog.map(f => [f.name, f.category, f.season, f.wholesaleCost, f.stemsPerBunch, f.bunchCost, f.color, f.supplier, f.notes]));

  const FlowerForm = ({ f, setF, onSave, onCancel, saveLabel }) => (
    <Card style={{ marginBottom: 14, borderLeft: `3px solid ${B.gold}`, padding: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "0 10px" }}>
        <Input label="Flower Name" value={f.name} onChange={v => setF(p => ({ ...p, name: v }))} placeholder="e.g. Garden Rose 'Juliet'" />
        <Input label="Category" value={f.category} onChange={v => setF(p => ({ ...p, category: v }))} options={FLOWER_CATEGORIES} />
        <Input label="Season" value={f.season} onChange={v => setF(p => ({ ...p, season: v }))} options={FLOWER_SEASONS} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0 10px" }}>
        <Input label="Cost/Stem ($)" value={f.wholesaleCost} onChange={v => setF(p => ({ ...p, wholesaleCost: v }))} type="number" />
        <Input label="Stems/Bunch" value={f.stemsPerBunch} onChange={v => setF(p => ({ ...p, stemsPerBunch: v }))} type="number" />
        <Input label="Bunch Cost ($)" value={f.bunchCost} onChange={v => setF(p => ({ ...p, bunchCost: v }))} type="number" />
        <Input label="Color" value={f.color} onChange={v => setF(p => ({ ...p, color: v }))} placeholder="e.g. Blush Pink" />
      </div>
      <div style={S.grid2}>
        <Input label="Supplier" value={f.supplier} onChange={v => setF(p => ({ ...p, supplier: v }))} />
        <Input label="Notes" value={f.notes} onChange={v => setF(p => ({ ...p, notes: v }))} />
      </div>
      {f.bunchCost > 0 && f.stemsPerBunch > 0 && <div style={{ fontSize: 11, color: B.green, marginBottom: 6 }}>Calculated: {fmt$(calcStemCost(Number(f.bunchCost), Number(f.stemsPerBunch)))}/stem from bunch pricing</div>}
      <div style={S.flex}><Btn onClick={onSave}>{saveLabel}</Btn><Btn v="ghost" onClick={onCancel}>Cancel</Btn></div>
    </Card>
  );

  const TABS = [
    { id: "flowers", label: `Flowers (${catalog.length})` },
    { id: "supplies", label: `Supplies (${supplies.length})` },
    { id: "shopping", label: "Shopping List" },
  ];

  return (
    <div>
      <PageHead title="Catalog" sub="Flowers, design supplies, and shop inventory" right={<><Btn v="ghost" sm onClick={() => setShowResources(!showResources)}>{showResources ? "Hide" : "Supplier"} Links</Btn>{tab === "flowers" && catalog.length > 0 && <Btn v="secondary" sm onClick={exportCSV}>Export</Btn>}</>} />
      <div style={{ padding: "0 28px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${B.creamD}`, marginBottom: 16 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setFilter(""); setSearch(""); }} style={{ padding: "10px 18px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? B.forest : B.muted, background: "none", borderBottom: tab === t.id ? `2px solid ${B.forest}` : "2px solid transparent", marginBottom: -2, fontFamily: "inherit" }}>{t.label}</button>
          ))}
        </div>

        {/* Supplier Links */}
        {showResources && (
          <Card style={{ marginBottom: 14, borderLeft: `3px solid ${B.sage}`, padding: 12 }}>
            <div style={S.label}>Wholesale Supplier Resources</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <a href="http://www.sieckfloraldistributing.com/Gallery?category=FC" target="_blank" rel="noopener" style={{ ...S.link, background: B.greenL }}>Sieck Floral (Rochester) — Cut Flowers</a>
              <a href="https://sieck.com/locations/sieck-buffalo/" target="_blank" rel="noopener" style={{ ...S.link, background: B.greenL }}>Sieck (Buffalo) — 716-681-6100</a>
              <a href="https://www.danzigeronline.com/cut_flowers-catalog/" target="_blank" rel="noopener" style={{ ...S.link, background: B.cream }}>Danziger — Cut Flowers Catalog</a>
              <a href="https://fiftyflowers.com/collections" target="_blank" rel="noopener" style={{ ...S.link, background: B.cream }}>FiftyFlowers — Wholesale Direct</a>
              <a href="https://www.bloomsbythebox.com" target="_blank" rel="noopener" style={{ ...S.link, background: B.cream }}>Blooms By The Box</a>
              <a href="https://www.wholeblossoms.com" target="_blank" rel="noopener" style={{ ...S.link, background: B.cream }}>Whole Blossoms — Farm Direct</a>
            </div>
            <div style={{ marginTop: 6, fontSize: 10, color: B.muted }}>Sieck Rochester: 280 Commerce Dr, 14623 — 585-321-1330</div>
          </Card>
        )}

        {/* FLOWERS TAB */}
        {tab === "flowers" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ padding: "5px 10px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 12, flex: 1, maxWidth: 220 }} />
              <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: "5px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 11 }}><option value="">All Categories</option>{FLOWER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <Btn sm onClick={() => setShowNew(true)}>+ Add Flower</Btn>
              <Btn v="secondary" sm onClick={() => setShowBulk(!showBulk)}>Paste Import</Btn>
              {catalog.length === 0 && <Btn v="gold" sm onClick={loadStarter}>Load 48 Starter</Btn>}
            </div>
            {showBulk && (
              <Card style={{ marginBottom: 12, borderLeft: `3px solid ${B.blue}`, padding: 10 }}>
                <div style={{ ...S.sm, marginBottom: 4 }}>Paste one flower per line: <strong>Name, Cost</strong> or <strong>Name, Category, Cost</strong></div>
                <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={5} placeholder={"Garden Rose, 2.50\nRanunculus, Focal, 1.25\nEucalyptus, Greenery, 0.75"} style={{ width: "100%", padding: 6, border: `1px solid ${B.creamD}`, borderRadius: 4, fontSize: 11, fontFamily: "inherit", boxSizing: "border-box", resize: "vertical" }} />
                <div style={{ ...S.flex, marginTop: 4 }}><Btn sm onClick={bulkImport}>Import {bulkText.trim().split("\n").filter(Boolean).length} flowers</Btn><Btn v="ghost" sm onClick={() => { setShowBulk(false); setBulkText(""); }}>Cancel</Btn></div>
              </Card>
            )}
            {showNew && <FlowerForm f={form} setF={setForm} onSave={addFlower} onCancel={() => setShowNew(false)} saveLabel="Add to Catalog" />}
            {editing && <FlowerForm f={editing} setF={setEditing} onSave={updateFlower} onCancel={() => setEditing(null)} saveLabel="Save Changes" />}
            {catalog.length === 0 ? <Empty icon="✿" msg="No flowers yet." hint="Load the starter catalog to get 48 common wedding flowers with pricing, or add your own." action={<Btn onClick={loadStarter}>Load 48 Starter Flowers</Btn>} /> : (
              grouped.map(g => (
                <div key={g.cat} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: B.forest, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, borderBottom: `1px solid ${B.creamD}`, paddingBottom: 4 }}>{g.cat} ({g.items.length})</div>
                  {g.items.map(f => (
                    <div key={f.id} style={{ display: "grid", gridTemplateColumns: "2fr 70px 70px 80px 1fr 60px", gap: 8, alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${B.cream}`, fontSize: 12, minWidth: 500 }}>
                      <div><span style={{ fontWeight: 500 }}>{f.name}</span>{f.color && <span style={{ color: B.muted, marginLeft: 6 }}>{f.color}</span>}</div>
                      <span style={{ fontWeight: 600 }}>{fmt$(f.wholesaleCost)}/stem</span>
                      <span style={{ color: B.muted }}>{f.stemsPerBunch}/bunch</span>
                      <Badge color={f.season === "Year-Round" ? B.sage : f.season === "Summer" ? B.gold : f.season === "Spring" ? B.green : B.forest}>{f.season}</Badge>
                      <span style={{ color: B.muted, fontSize: 11 }}>{f.supplier}</span>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setEditing({ ...f })} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: B.blue }}>✎</button>
                        <button onClick={() => deleteFlower(f.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: B.red }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}

        {/* SUPPLIES TAB */}
        {tab === "supplies" && (
          <div>
            {lowStock.length > 0 && (
              <Card style={{ marginBottom: 14, borderLeft: `3px solid ${B.red}`, padding: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: B.red, marginBottom: 4 }}>Low Stock Alert ({lowStock.length} items)</div>
                <div style={{ fontSize: 11 }}>{lowStock.map(s => s.name).join(", ")}</div>
              </Card>
            )}
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search supplies..." style={{ padding: "5px 10px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 12, flex: 1, maxWidth: 220 }} />
              <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: "5px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 11 }}><option value="">All Types</option>{SUPPLY_CATS.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <Btn sm onClick={() => setShowSupNew(true)}>+ Add Supply</Btn>
              {supplies.length === 0 && <Btn v="gold" sm onClick={loadStarterSupplies}>Load {STARTER_SUPPLIES.length} Starter Supplies</Btn>}
            </div>
            {showSupNew && (
              <Card style={{ marginBottom: 14, borderLeft: `3px solid ${B.gold}`, padding: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "0 8px" }}>
                  <Input label="Item Name" value={supForm.name} onChange={v => setSupForm(p => ({ ...p, name: v }))} />
                  <Input label="Category" value={supForm.category} onChange={v => setSupForm(p => ({ ...p, category: v }))} options={SUPPLY_CATS} />
                  <Input label="Unit" value={supForm.unit} onChange={v => setSupForm(p => ({ ...p, unit: v }))} placeholder="each, roll, pack" />
                  <Input label="Cost ($)" value={supForm.costPer} onChange={v => setSupForm(p => ({ ...p, costPer: v }))} type="number" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 8px" }}>
                  <Input label="On Hand" value={supForm.qtyOnHand} onChange={v => setSupForm(p => ({ ...p, qtyOnHand: v }))} type="number" />
                  <Input label="Par Level" value={supForm.parLevel} onChange={v => setSupForm(p => ({ ...p, parLevel: v }))} type="number" />
                  <Input label="Reorder Qty" value={supForm.reorderQty} onChange={v => setSupForm(p => ({ ...p, reorderQty: v }))} type="number" />
                </div>
                <div style={{ ...S.flex, marginTop: 6 }}><Btn sm onClick={addSupply}>Add</Btn><Btn v="ghost" sm onClick={() => setShowSupNew(false)}>Cancel</Btn></div>
              </Card>
            )}
            {supplies.length === 0 ? <Empty icon="▥" msg="No supplies tracked yet." hint="Load starter inventory to track foam, wire, tape, and other essentials with par levels." action={<Btn onClick={loadStarterSupplies}>Load Starter Supplies</Btn>} /> : (
              supplyGrouped.map(g => (
                <div key={g.cat} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: B.forest, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, borderBottom: `1px solid ${B.creamD}`, paddingBottom: 4 }}>{g.cat} ({g.items.length})</div>
                  {g.items.map(s => {
                    const isLow = s.qtyOnHand < s.parLevel;
                    return (
                      <div key={s.id} style={{ display: "grid", gridTemplateColumns: "2fr 60px 80px 60px 60px 60px 40px", gap: 6, alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${B.cream}`, fontSize: 12, minWidth: 500 }}>
                        <div style={{ fontWeight: 500 }}>{s.name}</div>
                        <span style={S.sm}>{s.unit}</span>
                        <span style={{ fontWeight: 600 }}>{fmt$(s.costPer)}/{s.unit}</span>
                        <input type="number" value={s.qtyOnHand || 0} onChange={e => updateSupplyQty(s.id, e.target.value)} style={{ width: 50, padding: "2px 4px", border: `1px solid ${isLow ? B.red : B.creamD}`, borderRadius: 3, fontSize: 11, background: isLow ? B.redL : "white", fontFamily: "inherit" }} />
                        <span style={S.sm}>par: {s.parLevel}</span>
                        <span style={S.sm}>ord: {s.reorderQty}</span>
                        <button onClick={() => deleteSupply(s.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: B.red }}>✕</button>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        )}

        {/* SHOPPING LIST TAB */}
        {tab === "shopping" && (() => {
          const { upcoming, flowerNeeds, supplyNeeds } = generateShoppingList();
          const flowerEntries = Object.entries(flowerNeeds).sort((a, b) => b[1] - a[1]);
          const supplyEntries = Object.entries(supplyNeeds);
          const reorderSupplies = supplies.filter(s => s.qtyOnHand < s.parLevel);
          return (
            <div>
              <Card style={{ marginBottom: 14, borderLeft: `3px solid ${B.forest}`, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: B.forest }}>Next {upcoming.length} Events</div>
                {upcoming.map(ev => (
                  <div key={ev.id} style={{ fontSize: 11, marginBottom: 2 }}>{fmtDate(ev.date)} — {ev.eventCode} @ {ev.venue} ({ev.tier})</div>
                ))}
              </Card>

              {flowerEntries.length > 0 && (
                <Card style={{ marginBottom: 14 }}>
                  <div style={S.label}>Flower Needs (from recipes)</div>
                  {flowerEntries.map(([name, qty]) => {
                    const fl = catalog.find(f => f.name === name);
                    return (
                      <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${B.cream}`, fontSize: 12 }}>
                        <span>{name}</span>
                        <span style={{ fontWeight: 600 }}>{qty} stems {fl ? `(~${Math.ceil(qty / (fl.stemsPerBunch || 10))} bunches = ${fmt$(Math.ceil(qty / (fl.stemsPerBunch || 10)) * (fl.bunchCost || 0))})` : ""}</span>
                      </div>
                    );
                  })}
                </Card>
              )}

              {flowerEntries.length === 0 && (
                <Card style={{ marginBottom: 14, padding: 20, textAlign: "center" }}>
                  <div style={{ color: B.muted, fontSize: 12 }}>No flower recipes built yet. Add recipes to estimate line items to auto-generate flower shopping lists.</div>
                </Card>
              )}

              {supplyEntries.length > 0 && (
                <Card style={{ marginBottom: 14 }}>
                  <div style={S.label}>Design Pieces Needed</div>
                  {supplyEntries.map(([piece, qty]) => (
                    <div key={piece} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${B.cream}`, fontSize: 12 }}>
                      <span>{piece}</span><span style={{ fontWeight: 600 }}>{qty} units</span>
                    </div>
                  ))}
                </Card>
              )}

              {reorderSupplies.length > 0 && (
                <Card style={{ borderLeft: `3px solid ${B.red}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: B.red }}>Supplies to Reorder ({reorderSupplies.length})</div>
                  {reorderSupplies.map(s => (
                    <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${B.cream}`, fontSize: 12 }}>
                      <span>{s.name}</span>
                      <span><span style={{ color: B.red, fontWeight: 600 }}>{s.qtyOnHand}</span> on hand / par {s.parLevel} — order {s.reorderQty} {s.unit} ({fmt$(s.reorderQty * s.costPer)})</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600, color: B.forest }}>Reorder Total: {fmt$(reorderSupplies.reduce((s, i) => s + (i.reorderQty * i.costPer), 0))}</div>
                </Card>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function WholesaleOrders({ data }) {
  const [range, setRange] = useState("week");
  const [selectedEvents, setSelectedEvents] = useState([]);

  const today = new Date();
  const rangeEnd = new Date(today);
  if (range === "week") rangeEnd.setDate(rangeEnd.getDate() + 7);
  else if (range === "2weeks") rangeEnd.setDate(rangeEnd.getDate() + 14);
  else rangeEnd.setDate(rangeEnd.getDate() + 30);

  const upcomingEvents = data.events
    .filter(e => new Date(e.date) >= today && new Date(e.date) <= rangeEnd)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const toggleEvent = (id) => setSelectedEvents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const selectAll = () => setSelectedEvents(upcomingEvents.map(e => e.id));

  // Aggregate stems from recipes across selected events
  const aggregated = {};
  const eventsToUse = selectedEvents.length > 0 ? upcomingEvents.filter(e => selectedEvents.includes(e.id)) : upcomingEvents;
  eventsToUse.forEach(ev => {
    const est = (data.estimates || []).find(e => e.eventId === ev.id);
    if (!est) return;
    (est.items || []).forEach(item => {
      (item.recipe || []).forEach(r => {
        const key = r.stemName || r.stemId;
        if (!aggregated[key]) {
          const cat = (data.flowerCatalog || []).find(f => f.id === r.stemId);
          aggregated[key] = { stemName: r.stemName, stemId: r.stemId, category: r.category || (cat ? cat.category : ""), costPerStem: r.costPerStem, stemsPerBunch: cat ? cat.stemsPerBunch : 10, supplier: cat ? cat.supplier : "", totalStems: 0, events: [] };
        }
        aggregated[key].totalStems += (r.qty || 0);
        aggregated[key].events.push({ eventCode: ev.eventCode || ev.clientName, piece: item.piece, qty: r.qty });
      });
    });
  });

  const stemList = Object.values(aggregated).sort((a, b) => a.stemName.localeCompare(b.stemName));
  const totalStems = stemList.reduce((s, r) => s + r.totalStems, 0);
  const totalBunches = stemList.reduce((s, r) => s + Math.ceil(r.totalStems / (r.stemsPerBunch || 10)), 0);
  const totalCost = stemList.reduce((s, r) => s + Math.ceil(r.totalStems / (r.stemsPerBunch || 10)) * (r.stemsPerBunch || 10) * r.costPerStem, 0);

  const exportOrder = () => downloadCSV("gg-wholesale-order.csv",
    ["Stem", "Category", "Stems Needed", "Stems/Bunch", "Bunches", "Cost/Stem", "Line Total", "Supplier", "Events"],
    stemList.map(r => [r.stemName, r.category, r.totalStems, r.stemsPerBunch, Math.ceil(r.totalStems / (r.stemsPerBunch || 10)), r.costPerStem, Math.ceil(r.totalStems / (r.stemsPerBunch || 10)) * (r.stemsPerBunch || 10) * r.costPerStem, r.supplier, r.events.map(e => e.eventCode).join("; ")])
  );

  return (
    <div>
      <PageHead title="Wholesale Orders" sub="Auto-generated from estimate recipes" right={stemList.length > 0 ? <Btn onClick={exportOrder}>Export Order CSV</Btn> : null} />
      <div style={S.page}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: B.muted }}>Window:</span>
          {[["week", "7 Days"], ["2weeks", "14 Days"], ["month", "30 Days"]].map(([k, l]) => (
            <button key={k} onClick={() => setRange(k)} style={{ padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, border: `1px solid ${range === k ? B.forest : B.creamD}`, background: range === k ? B.forest : "transparent", color: range === k ? B.cream : B.text, cursor: "pointer" }}>{l}</button>
          ))}
          <Btn v="ghost" sm onClick={selectAll} style={{ marginLeft: "auto" }}>Select All Events</Btn>
        </div>

        {upcomingEvents.length === 0 ? <Empty icon="▥" msg="No upcoming events in this window." /> : (
          <>
            <div style={{ ...S.flex, marginBottom: 14, flexWrap: "wrap" }}>
              {upcomingEvents.map(ev => {
                const hasRecipes = (data.estimates || []).find(e => e.eventId === ev.id)?.items?.some(i => (i.recipe || []).length > 0);
                return (
                  <label key={ev.id} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, border: `1px solid ${selectedEvents.includes(ev.id) ? B.forest : B.creamD}`, background: selectedEvents.includes(ev.id) ? B.greenL : "transparent", fontSize: 11, cursor: "pointer" }}>
                    <input type="checkbox" checked={selectedEvents.includes(ev.id)} onChange={() => toggleEvent(ev.id)} />
                    <span style={{ fontWeight: 500 }}>{ev.eventCode || ev.clientName}</span>
                    <span style={{ color: B.muted }}>{fmtDate(ev.date)}</span>
                    {!hasRecipes && <span style={{ color: B.red, fontSize: 9 }}>no recipes</span>}
                  </label>
                );
              })}
            </div>

            {stemList.length === 0 ? <div style={{ padding: 20, textAlign: "center", color: B.muted, fontSize: 12 }}>No recipes found on selected events. Build recipes in Estimates using your Flower Catalog.</div> : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
                  <Stat label="Total Stems" value={totalStems} />
                  <Stat label="Total Bunches" value={totalBunches} />
                  <Stat label="Wholesale Cost" value={fmt$(totalCost)} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: B.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, display: "grid", gridTemplateColumns: "2fr 70px 60px 60px 60px 80px 1fr", gap: 6 }}>
                  <span>Stem</span><span>Needed</span><span>Per Bunch</span><span>Bunches</span><span>Cost/Stem</span><span>Line Total</span><span>Supplier</span>
                </div>
                {stemList.map(r => {
                  const bunches = Math.ceil(r.totalStems / (r.stemsPerBunch || 10));
                  const lineTotal = bunches * (r.stemsPerBunch || 10) * r.costPerStem;
                  const waste = bunches * (r.stemsPerBunch || 10) - r.totalStems;
                  return (
                    <div key={r.stemName} style={{ display: "grid", gridTemplateColumns: "2fr 70px 60px 60px 60px 80px 1fr", gap: 6, padding: "5px 0", borderBottom: `1px solid ${B.cream}`, fontSize: 12, alignItems: "center" }}>
                      <div><span style={{ fontWeight: 500 }}>{r.stemName}</span> <span style={{ fontSize: 9, color: B.muted }}>({r.category})</span></div>
                      <span style={{ fontWeight: 600 }}>{r.totalStems}</span>
                      <span style={{ color: B.muted }}>{r.stemsPerBunch}</span>
                      <span style={{ fontWeight: 600, color: B.forest }}>{bunches}</span>
                      <span>{fmt$(r.costPerStem)}</span>
                      <span style={{ fontWeight: 600 }}>{fmt$(lineTotal)}{waste > 0 && <span style={{ fontSize: 9, color: B.gold, marginLeft: 2 }}>+{waste}</span>}</span>
                      <span style={{ color: B.muted }}>{r.supplier}</span>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function VenueDirectory({ data, save, setSidePanel }) {
  const venues = data.venues || [];
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", contactName: "", contactEmail: "", contactPhone: "", setupAccess: "", loadInNotes: "", waterAccess: "", preferredVendor: false, maxCapacity: "", notes: "" });

  const loadStarter = () => {
    const existing = new Set(venues.map(v => v.name.toLowerCase()));
    const newVenues = STARTER_VENUES.filter(v => !existing.has(v.name.toLowerCase())).map(v => ({ ...v, id: uid(), createdAt: Date.now() }));
    if (newVenues.length > 0) save({ venues: [...venues, ...newVenues] });
  };

  const addVenue = () => {
    if (!form.name) return;
    save({ venues: [...venues, { ...form, id: uid(), maxCapacity: safeNum(form.maxCapacity) || 0, createdAt: Date.now() }] });
    setForm({ name: "", address: "", contactName: "", contactEmail: "", contactPhone: "", setupAccess: "", loadInNotes: "", waterAccess: "", preferredVendor: false, maxCapacity: "", notes: "" });
    setShowNew(false);
  };
  const deleteVenue = (id) => save({ venues: venues.filter(v => v.id !== id) });
  const updateVenue = (id, updates) => save({ venues: venues.map(v => v.id === id ? { ...v, ...updates } : v) });
  const eventCount = (venueName) => data.events.filter(e => (e.venue || "").toLowerCase() === venueName.toLowerCase()).length;

  const openDetail = (venue) => setSidePanel({ title: venue.name, content: (
    <VenueDetail venue={venue} data={data} save={save} close={() => setSidePanel(null)} updateVenue={updateVenue} deleteVenue={deleteVenue} />
  )});

  const exportCSV = () => downloadCSV("gg-venues.csv",
    ["Name", "Address", "Contact", "Email", "Phone", "Setup Access", "Load-In Notes", "Water Access", "Capacity", "Preferred", "Events"],
    venues.map(v => [v.name, v.address, v.contactName, v.contactEmail, v.contactPhone, v.setupAccess, v.loadInNotes, v.waterAccess, v.maxCapacity, v.preferredVendor ? "Yes" : "No", eventCount(v.name)])
  );

  return (
    <div>
      <PageHead title="Venue Directory" sub={`${venues.length} venues`} right={<><Btn onClick={() => setShowNew(true)}>+ Add Venue</Btn>{venues.length === 0 && <Btn v="gold" onClick={loadStarter}>Load 2026 Venues</Btn>}{venues.length > 0 && <Btn v="secondary" sm onClick={exportCSV}>Export CSV</Btn>}</>} />
      <div style={S.page}>
        {showNew && (
          <Card style={{ marginBottom: 16, borderLeft: `3px solid ${B.gold}`, padding: 12 }}>
            <div style={S.label}>Add Venue</div>
            <div style={S.grid21}>
              <Input label="Venue Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
              <Input label="Max Capacity" value={form.maxCapacity} onChange={v => setForm(p => ({ ...p, maxCapacity: v }))} type="number" />
            </div>
            <Input label="Address" value={form.address} onChange={v => setForm(p => ({ ...p, address: v }))} />
            <div style={S.grid3}>
              <Input label="Contact Name" value={form.contactName} onChange={v => setForm(p => ({ ...p, contactName: v }))} />
              <Input label="Email" value={form.contactEmail} onChange={v => setForm(p => ({ ...p, contactEmail: v }))} />
              <Input label="Phone" value={form.contactPhone} onChange={v => setForm(p => ({ ...p, contactPhone: v }))} />
            </div>
            <div style={S.grid3}>
              <Input label="Setup Access Time" value={form.setupAccess} onChange={v => setForm(p => ({ ...p, setupAccess: v }))} placeholder="e.g. 10am day-of" />
              <Input label="Load-In Notes" value={form.loadInNotes} onChange={v => setForm(p => ({ ...p, loadInNotes: v }))} placeholder="e.g. back dock, elevator" />
              <Input label="Water Access" value={form.waterAccess} onChange={v => setForm(p => ({ ...p, waterAccess: v }))} placeholder="e.g. kitchen sink, hose" />
            </div>
            <Input label="General Notes" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} />
            <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, marginBottom: 8 }}><input type="checkbox" checked={form.preferredVendor} onChange={ev => setForm(p => ({ ...p, preferredVendor: ev.target.checked }))} />Preferred Vendor at this venue</label>
            <div style={S.flex}><Btn onClick={addVenue}>Save Venue</Btn><Btn v="ghost" onClick={() => setShowNew(false)}>Cancel</Btn></div>
          </Card>
        )}
        {venues.length === 0 ? <Empty icon="⌂" msg="Build your venue directory." hint="Track contacts, load-in logistics, setup access, and which events have been at each location." action={<div style={S.flex}><Btn onClick={loadStarter}>Load 2026 Venues</Btn><Btn v="secondary" onClick={() => setShowNew(true)}>+ Add Custom</Btn></div>} /> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {venues.map(v => {
              const evCt = eventCount(v.name);
              return (
                <Card key={v.id} onClick={() => openDetail(v)} style={{ cursor: "pointer", padding: 12, borderLeft: `3px solid ${v.preferredVendor ? B.gold : B.sage}` }}>
                  <div style={S.row}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{v.name}</div>
                    {v.preferredVendor && <Badge color={B.gold}>Preferred</Badge>}
                  </div>
                  <div style={{ ...S.xs, marginBottom: 4 }}>{v.address}</div>
                  <div style={{ display: "flex", gap: 10, fontSize: 11, color: B.muted }}>
                    {v.contactName && <span>{v.contactName}</span>}
                    {evCt > 0 && <span style={{ fontWeight: 600, color: B.forest }}>{evCt} event{evCt > 1 ? "s" : ""}</span>}
                    {v.maxCapacity > 0 && <span>Cap: {v.maxCapacity}</span>}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function VenueDetail({ venue, data, close, updateVenue, deleteVenue }) {
  const [v, setV] = useState({ ...venue });
  const events = data.events.filter(e => (e.venue || "").toLowerCase() === venue.name.toLowerCase());

  return (
    <div>
      <div style={S.grid21}>
        <Input label="Name" value={v.name} onChange={val => setV(p => ({ ...p, name: val }))} />
        <Input label="Capacity" value={v.maxCapacity} onChange={val => setV(p => ({ ...p, maxCapacity: Number(val) }))} type="number" />
      </div>
      <Input label="Address" value={v.address} onChange={val => setV(p => ({ ...p, address: val }))} />
      <div style={S.grid3}>
        <Input label="Contact" value={v.contactName} onChange={val => setV(p => ({ ...p, contactName: val }))} />
        <Input label="Email" value={v.contactEmail} onChange={val => setV(p => ({ ...p, contactEmail: val }))} />
        <Input label="Phone" value={v.contactPhone} onChange={val => setV(p => ({ ...p, contactPhone: val }))} />
      </div>
      <div style={S.grid3}>
        <Input label="Setup Access" value={v.setupAccess} onChange={val => setV(p => ({ ...p, setupAccess: val }))} />
        <Input label="Load-In" value={v.loadInNotes} onChange={val => setV(p => ({ ...p, loadInNotes: val }))} />
        <Input label="Water" value={v.waterAccess} onChange={val => setV(p => ({ ...p, waterAccess: val }))} />
      </div>
      <Input label="Notes" value={v.notes} onChange={val => setV(p => ({ ...p, notes: val }))} textarea />
      <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, marginBottom: 10 }}><input type="checkbox" checked={v.preferredVendor} onChange={ev => setV(p => ({ ...p, preferredVendor: ev.target.checked }))} />Preferred Vendor</label>
      <div style={{ ...S.flex, marginBottom: 14 }}>
        <Btn sm onClick={() => { updateVenue(v.id, v); close(); }}>Save</Btn>
        <Btn v="ghost" sm onClick={close}>Close</Btn>
        <Btn v="danger" sm onClick={() => { deleteVenue(v.id); close(); }} style={{ marginLeft: "auto" }}>Delete</Btn>
      </div>
      {events.length > 0 && (
        <div style={{ borderTop: `1px solid ${B.creamD}`, paddingTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: B.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Event History ({events.length})</div>
          {events.sort((a, b) => new Date(b.date) - new Date(a.date)).map(ev => (
            <div key={ev.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0", borderBottom: `1px solid ${B.cream}` }}>
              <span>{ev.eventCode || ev.clientName}</span>
              <span style={{ color: B.muted }}>{fmtDateFull(ev.date)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Rentals({ data, save, setSidePanel, confirmDelete }) {
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Vessels/Vases", qtyOwned: 1, condition: "Good", replacementCost: 0, notes: "", dimensions: "" });
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("name");
  const rentals = data.rentals || [];
  const assignments = data.rentalAssignments || [];

  const addItem = () => {
    if (!form.name) return;
    save({ rentals: [...rentals, { ...form, id: uid(), qtyOwned: safeNum(form.qtyOwned), replacementCost: safeNum(form.replacementCost), createdAt: Date.now() }] });
    setForm({ name: "", category: "Vessels/Vases", qtyOwned: 1, condition: "Good", replacementCost: 0, notes: "", dimensions: "" });
    setShowNew(false);
  };
  const deleteItem = (id) => confirmDelete("Delete this rental item and all assignments?", () => {
    save({ rentals: rentals.filter(r => r.id !== id), rentalAssignments: assignments.filter(ra => ra.rentalId !== id) });
  });
  const openDetail = (item) => setSidePanel({ title: `Rental: ${item.name}`, content: <RentalDetail item={item} data={data} save={save} close={() => setSidePanel(null)} confirmDelete={confirmDelete} /> });

  const filtered = rentals.filter(r => !filter || r.category === filter);
  const sorted = [...filtered].sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "category" ? a.category.localeCompare(b.category) : sort === "value" ? (b.replacementCost || 0) - (a.replacementCost || 0) : 0);
  const totalValue = rentals.reduce((s, r) => s + ((r.replacementCost || 0) * (r.qtyOwned || 1)), 0);
  const totalItems = rentals.reduce((s, r) => s + (r.qtyOwned || 1), 0);
  const categories = [...new Set(rentals.map(r => r.category))];

  const exportRentals = () => downloadCSV("gg-rental-inventory.csv",
    ["Name", "Category", "Qty Owned", "Condition", "Dimensions", "Replacement Cost", "Notes"],
    rentals.map(r => [r.name, r.category, r.qtyOwned, r.condition, r.dimensions, r.replacementCost, r.notes])
  );

  return (
    <div>
      <PageHead title="Rental Inventory" sub={`${totalItems} items | ${fmt$(totalValue)} replacement value`} right={<><Btn onClick={() => setShowNew(true)}>+ Add Item</Btn>{rentals.length > 0 && <Btn v="secondary" sm onClick={exportRentals}>Export CSV</Btn>}</>} />
      <div style={S.page}>
        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
          <Stat label="Total Items" value={totalItems} />
          <Stat label="Unique Types" value={rentals.length} />
          <Stat label="Replacement Value" value={fmt$(totalValue)} />
          <Stat label="Categories" value={categories.length} />
        </div>

        {showNew && (
          <Card style={{ marginBottom: 16, borderLeft: `3px solid ${B.gold}`, padding: 12 }}>
            <div style={S.label}>Add Rental Item</div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "0 10px" }}>
              <Input label="Item Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} placeholder="e.g. Gold Compote Bowl" />
              <Input label="Category" value={form.category} onChange={v => setForm(p => ({ ...p, category: v }))} options={RENTAL_CATEGORIES} />
              <Input label="Qty Owned" value={form.qtyOwned} onChange={v => setForm(p => ({ ...p, qtyOwned: v }))} type="number" />
            </div>
            <div style={S.grid3}>
              <Input label="Condition" value={form.condition} onChange={v => setForm(p => ({ ...p, condition: v }))} options={["Excellent", "Good", "Fair", "Needs Repair"]} />
              <Input label="Dimensions" value={form.dimensions} onChange={v => setForm(p => ({ ...p, dimensions: v }))} placeholder='e.g. 8" tall, 12" wide' />
              <Input label="Replacement Cost" value={form.replacementCost} onChange={v => setForm(p => ({ ...p, replacementCost: v }))} type="number" />
            </div>
            <Input label="Notes" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} placeholder="Color, material, source, etc." />
            <div style={S.flex}><Btn onClick={addItem}>Save Item</Btn><Btn v="ghost" onClick={() => setShowNew(false)}>Cancel</Btn></div>
          </Card>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: "5px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 11 }}>
            <option value="">All Categories</option>
            {RENTAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "5px 8px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 11 }}>
            <option value="name">Sort: Name</option>
            <option value="category">Sort: Category</option>
            <option value="value">Sort: Value</option>
          </select>
        </div>

        {sorted.length === 0 ? <Empty icon="⬡" msg="No rental items yet." hint="Track your vessels, arches, arbors, and props — and see what's available for upcoming events." action={<Btn onClick={() => setShowNew(true)}>+ Add Item</Btn>} /> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {sorted.map(item => {
              const itemAssignments = assignments.filter(ra => ra.rentalId === item.id);
              const assignedQty = itemAssignments.reduce((s, ra) => s + (ra.qty || 1), 0);
              const unreturned = itemAssignments.filter(ra => !ra.returned).length;
              return (
                <Card key={item.id} onClick={() => openDetail(item)} style={{ cursor: "pointer", padding: 12, borderLeft: `3px solid ${item.condition === "Needs Repair" ? B.red : B.sage}` }}>
                  <div style={S.row}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                    <Badge color={B.sage}>{item.category}</Badge>
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: B.muted, marginTop: 4 }}>
                    <span>Own: <strong style={{ color: B.text }}>{item.qtyOwned}</strong></span>
                    {assignedQty > 0 && <span>Assigned: <strong style={{ color: B.gold }}>{assignedQty}</strong></span>}
                    {unreturned > 0 && <span style={{ color: B.red }}>Out: {unreturned}</span>}
                    {item.replacementCost > 0 && <span>Value: {fmt$(item.replacementCost * (item.qtyOwned || 1))}</span>}
                  </div>
                  {item.dimensions && <div style={{ ...S.sm, marginTop: 2 }}>{item.dimensions}</div>}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function RentalDetail({ item, data, save, close, confirmDelete }) {
  const [r, setR] = useState({ ...item });
  const assignments = (data.rentalAssignments || []).filter(ra => ra.rentalId === item.id);

  const saveItem = () => save({ rentals: (data.rentals || []).map(x => x.id === r.id ? { ...r, qtyOwned: Number(r.qtyOwned), replacementCost: Number(r.replacementCost) } : x) });
  const deleteItem = () => confirmDelete("Delete this item and all event assignments?", () => {
    save({ rentals: (data.rentals || []).filter(x => x.id !== item.id), rentalAssignments: (data.rentalAssignments || []).filter(ra => ra.rentalId !== item.id) });
    close();
  });

  return (
    <div>
      <div style={S.grid21}>
        <Input label="Name" value={r.name} onChange={v => setR(p => ({ ...p, name: v }))} />
        <Input label="Category" value={r.category} onChange={v => setR(p => ({ ...p, category: v }))} options={RENTAL_CATEGORIES} />
      </div>
      <div style={S.grid3}>
        <Input label="Qty Owned" value={r.qtyOwned} onChange={v => setR(p => ({ ...p, qtyOwned: v }))} type="number" />
        <Input label="Condition" value={r.condition} onChange={v => setR(p => ({ ...p, condition: v }))} options={["Excellent", "Good", "Fair", "Needs Repair"]} />
        <Input label="Replacement Cost" value={r.replacementCost} onChange={v => setR(p => ({ ...p, replacementCost: v }))} type="number" />
      </div>
      <Input label="Dimensions" value={r.dimensions || ""} onChange={v => setR(p => ({ ...p, dimensions: v }))} />
      <Input label="Notes" value={r.notes || ""} onChange={v => setR(p => ({ ...p, notes: v }))} textarea />

      <div style={{ ...S.flex, marginBottom: 14 }}>
        <Btn sm onClick={saveItem}>Save</Btn>
        <Btn v="ghost" sm onClick={close}>Close</Btn>
        <Btn v="danger" sm onClick={deleteItem} style={{ marginLeft: "auto" }}>Delete</Btn>
      </div>

      <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 8, marginTop: 10, borderTop: `1px solid ${B.creamD}`, paddingTop: 12 }}>Event Assignments ({assignments.length})</div>
      {assignments.length === 0 ? <div style={{ fontSize: 12, color: B.muted }}>Not assigned to any events. Assign from Event Detail.</div> :
        assignments.map(ra => {
          const ev = data.events.find(e => e.id === ra.eventId);
          if (!ev) return null;
          return (
            <div key={ra.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${B.cream}`, fontSize: 12 }}>
              <div>
                <span style={{ fontWeight: 500 }}>{ev.eventCode || ev.clientName}</span>
                <span style={{ color: B.muted, marginLeft: 6 }}>{fmtDateFull(ev.date)}</span>
                <span style={{ marginLeft: 6 }}>×{ra.qty || 1}</span>
              </div>
              <div style={S.flexC}>
                <Badge color={ra.returned ? B.green : B.gold}>{ra.returned ? "Returned" : "Out"}</Badge>
              </div>
            </div>
          );
        })
      }

      {/* Availability calendar view */}
      {assignments.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${B.creamD}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: B.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Upcoming Availability</div>
          {data.events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 10).map(ev => {
            const evAssign = assignments.filter(ra => ra.eventId === ev.id);
            const usedQty = evAssign.reduce((s, ra) => s + (ra.qty || 1), 0);
            const avail = (r.qtyOwned || 1) - usedQty;
            return (
              <div key={ev.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "2px 0", color: usedQty > 0 ? B.text : B.muted }}>
                <span>{fmtDate(ev.date)} — {ev.eventCode || ev.clientName}</span>
                {usedQty > 0 ? <span><strong>{usedQty}</strong> used / <strong style={{ color: avail > 0 ? B.green : B.red }}>{avail}</strong> avail</span> : <span style={{ color: B.green }}>All {r.qtyOwned} avail</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TeamBoard({ data, save, confirmDelete }) {
  const [tab, setTab] = useState("sops");
  const [showNew, setShowNew] = useState(false);
  const [nn, setNn] = useState({ title: "", content: "" });
  const [editingSop, setEditingSop] = useState(null);
  const [sopForm, setSopForm] = useState({ title: "", trigger: "", owner: "", items: [] });
  const [newSopItem, setNewSopItem] = useState("");
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [tplForm, setTplForm] = useState({ key: "", items: [] });
  const [newTplItem, setNewTplItem] = useState("");

  const sops = getSops(data);
  const templates = getTemplates(data);

  // SOP CRUD
  const initSops = () => {
    if (data.sops && data.sops.length > 0) return;
    save({ sops: [...DEFAULT_SOPS] });
  };
  const saveSop = () => {
    if (!sopForm.title) return;
    const currentSops = data.sops && data.sops.length > 0 ? data.sops : [...DEFAULT_SOPS];
    if (editingSop) {
      save({ sops: currentSops.map(s => s.id === editingSop.id ? { ...editingSop, ...sopForm } : s) });
    } else {
      const nextNum = currentSops.length + 1;
      save({ sops: [...currentSops, { id: `SOP-${String(nextNum).padStart(2, "0")}`, ...sopForm }] });
    }
    setEditingSop(null); setSopForm({ title: "", trigger: "", owner: "", items: [] }); setNewSopItem("");
  };
  const editSop = (s) => { setEditingSop(s); setSopForm({ title: s.title, trigger: s.trigger, owner: s.owner, items: [...s.items] }); };
  const deleteSop = (s) => {
    const currentSops = data.sops && data.sops.length > 0 ? data.sops : [...DEFAULT_SOPS];
    confirmDelete(`Delete SOP "${s.title}"?`, () => save({ sops: currentSops.filter(x => x.id !== s.id) }));
  };
  const addSopItem = () => { if (!newSopItem.trim()) return; setSopForm(p => ({ ...p, items: [...p.items, newSopItem.trim()] })); setNewSopItem(""); };
  const rmSopItem = (i) => setSopForm(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));

  // Template CRUD
  const initTemplates = () => {
    if (data.checklistTemplates && Object.keys(data.checklistTemplates).length > 0) return;
    save({ checklistTemplates: { ...DEFAULT_CHECKLIST_TEMPLATES } });
  };
  const saveTemplate = () => {
    if (!tplForm.key || tplForm.items.length === 0) return;
    const current = data.checklistTemplates && Object.keys(data.checklistTemplates).length > 0 ? data.checklistTemplates : { ...DEFAULT_CHECKLIST_TEMPLATES };
    const originalKey = editingTemplate;
    const updated = { ...current };
    if (originalKey && originalKey !== tplForm.key) delete updated[originalKey];
    updated[tplForm.key] = tplForm.items.map(t => typeof t === "string" ? { title: t, sop: "" } : t);
    save({ checklistTemplates: updated });
    setEditingTemplate(null); setTplForm({ key: "", items: [] }); setNewTplItem("");
  };
  const editTemplate = (key) => {
    setEditingTemplate(key);
    setTplForm({ key, items: templates[key].map(t => typeof t === "string" ? t : t.title) });
  };
  const deleteTemplate = (key) => {
    const current = data.checklistTemplates && Object.keys(data.checklistTemplates).length > 0 ? data.checklistTemplates : { ...DEFAULT_CHECKLIST_TEMPLATES };
    confirmDelete(`Delete template "${key}"?`, () => { const updated = { ...current }; delete updated[key]; save({ checklistTemplates: updated }); });
  };
  const addTplItem = () => { if (!newTplItem.trim()) return; setTplForm(p => ({ ...p, items: [...p.items, newTplItem.trim()] })); setNewTplItem(""); };
  const rmTplItem = (i) => setTplForm(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));

  // Notes
  const addNote = () => { if (!nn.title) return; save({ boardNotes: [...data.boardNotes, { ...nn, id: uid(), createdAt: Date.now() }] }); setNn({ title: "", content: "" }); setShowNew(false); };
  const rmNote = (id) => save({ boardNotes: data.boardNotes.filter(n => n.id !== id) });

  const SOP_TRIGGERS = ["every_studio_day", "delivery_day", "weekly", "event_build", "in_season_daily", "weekly_pre_event", "event_day", "event_teardown", "post_event", "monthly", "as_needed"];

  return (
    <div>
      <PageHead title="Team Board" sub="SOPs, templates, workflows, notes" right={tab === "notes" ? <Btn sm onClick={() => setShowNew(true)}>+ Post Note</Btn> : tab === "sops" ? <Btn sm onClick={() => { initSops(); setEditingSop(null); setSopForm({ title: "", trigger: "", owner: "", items: [] }); setTab("sop_edit"); }}>+ New SOP</Btn> : tab === "templates" ? <Btn sm onClick={() => { initTemplates(); setEditingTemplate(null); setTplForm({ key: "", items: [] }); setTab("tpl_edit"); }}>+ New Template</Btn> : null} />
      <div style={S.page}>
        <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `1px solid ${B.creamD}` }}>
          {[{ id: "sops", l: "SOPs" }, { id: "templates", l: "Templates" }, { id: "workflows", l: "Workflows" }, { id: "event_sop", l: "Event SOP" }, { id: "notes", l: "Team Notes" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 14px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, background: "transparent", color: tab === t.id ? B.forest : B.muted, borderBottom: tab === t.id ? `2px solid ${B.forest}` : "2px solid transparent", fontFamily: "inherit" }}>{t.l}</button>
          ))}
        </div>

        {/* SOP List */}
        {tab === "sops" && (<>
          {sops.length === 0 ? <Empty icon="◻" msg="No SOPs yet." hint="SOPs are your repeatable procedures — the backbone of consistent execution." action={<Btn onClick={() => { save({ sops: [...DEFAULT_SOPS] }); }}>Load Default SOPs</Btn>} /> :
          sops.map(s => (
            <Card key={s.id} style={{ marginBottom: 8, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={S.flexC}><Badge color={B.forest}>{s.id}</Badge> <span style={{ fontWeight: 600, marginLeft: 4, fontSize: 13 }}>{s.title}</span></div>
                  <div style={{ ...S.xs, marginTop: 3 }}>Trigger: {(s.trigger || "").replace(/_/g, " ")} · Owner: {s.owner}</div>
                </div>
                <div style={S.flex}>
                  <Btn v="ghost" sm onClick={() => { initSops(); editSop(s); setTab("sop_edit"); }}>Edit</Btn>
                  <Btn v="ghost" sm onClick={() => { initSops(); deleteSop(s); }} style={{ color: B.red }}>×</Btn>
                </div>
              </div>
              <div style={{ marginTop: 6, paddingLeft: 8 }}>{s.items.map((item, i) => <div key={i} style={{ fontSize: 11, padding: "2px 0", color: B.text }}>&#8226; {item}</div>)}</div>
            </Card>
          ))}
        </>)}

        {/* SOP Editor */}
        {tab === "sop_edit" && (
          <Card style={{ borderLeft: `3px solid ${B.gold}`, padding: 14 }}>
            <div style={S.labelLg}>{editingSop ? `Edit: ${editingSop.title}` : "New SOP"}</div>
            <div style={S.grid2}>
              <Input label="Title" value={sopForm.title} onChange={v => setSopForm(p => ({ ...p, title: v }))} placeholder="e.g. Vehicle Load-Out" />
              <Input label="Owner" value={sopForm.owner} onChange={v => setSopForm(p => ({ ...p, owner: v }))} placeholder="Lindsay" />
            </div>
            <Input label="Trigger" value={sopForm.trigger} onChange={v => setSopForm(p => ({ ...p, trigger: v }))} options={SOP_TRIGGERS.map(t => ({ value: t, label: t.replace(/_/g, " ") }))} />
            <div style={{ ...S.label, marginTop: 8 }}>Checklist Items ({sopForm.items.length})</div>
            {sopForm.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: B.muted, fontSize: 10, width: 16, textAlign: "right" }}>{i + 1}.</span>
                <span style={{ flex: 1 }}>{item}</span>
                <button onClick={() => rmSopItem(i)} style={S.rmBtn}>×</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <input value={newSopItem} onChange={e => setNewSopItem(e.target.value)} onKeyDown={e => e.key === "Enter" && addSopItem()} placeholder="Add step..." style={{ flex: 1, padding: "6px 10px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 12, fontFamily: "inherit" }} />
              <Btn v="secondary" sm onClick={addSopItem}>+</Btn>
            </div>
            <div style={{ ...S.flex, marginTop: 12 }}>
              <Btn sm onClick={saveSop}>{editingSop ? "Update SOP" : "Create SOP"}</Btn>
              <Btn v="ghost" sm onClick={() => setTab("sops")}>Cancel</Btn>
            </div>
          </Card>
        )}

        {/* Template List */}
        {tab === "templates" && (<>
          {Object.keys(templates).length === 0 ? <Empty icon="☐" msg="No checklist templates." hint="Templates pre-load checklists when you create assignments — saves setup time on every event." action={<Btn onClick={() => save({ checklistTemplates: { ...DEFAULT_CHECKLIST_TEMPLATES } })}>Load Defaults</Btn>} /> :
          Object.entries(templates).map(([key, items]) => (
            <Card key={key} style={{ marginBottom: 8, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: B.forest }}>{key}</div>
                  <div style={{ fontSize: 11, color: B.muted, marginTop: 2 }}>{items.length} items</div>
                </div>
                <div style={S.flex}>
                  <Btn v="ghost" sm onClick={() => { initTemplates(); editTemplate(key); setTab("tpl_edit"); }}>Edit</Btn>
                  <Btn v="ghost" sm onClick={() => { initTemplates(); deleteTemplate(key); }} style={{ color: B.red }}>×</Btn>
                </div>
              </div>
              <div style={{ marginTop: 6, paddingLeft: 8 }}>{items.slice(0, 5).map((item, i) => <div key={i} style={{ fontSize: 11, padding: "1px 0" }}>&#8226; {typeof item === "string" ? item : item.title}</div>)}{items.length > 5 && <div style={{ fontSize: 10, color: B.muted, paddingLeft: 8 }}>+{items.length - 5} more</div>}</div>
            </Card>
          ))}
        </>)}

        {/* Template Editor */}
        {tab === "tpl_edit" && (
          <Card style={{ borderLeft: `3px solid ${B.blue}`, padding: 14 }}>
            <div style={S.labelLg}>{editingTemplate ? `Edit: ${editingTemplate}` : "New Template"}</div>
            <Input label="Template Name" value={tplForm.key} onChange={v => setTplForm(p => ({ ...p, key: v }))} placeholder="e.g. Day-Of Coordination" />
            <div style={{ ...S.label, marginTop: 8 }}>Checklist Items ({tplForm.items.length})</div>
            {tplForm.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: B.muted, fontSize: 10, width: 16, textAlign: "right" }}>{i + 1}.</span>
                <span style={{ flex: 1 }}>{typeof item === "string" ? item : item.title}</span>
                <button onClick={() => rmTplItem(i)} style={S.rmBtn}>×</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <input value={newTplItem} onChange={e => setNewTplItem(e.target.value)} onKeyDown={e => e.key === "Enter" && addTplItem()} placeholder="Add checklist item..." style={{ flex: 1, padding: "6px 10px", border: `1px solid ${B.creamD}`, borderRadius: 5, fontSize: 12, fontFamily: "inherit" }} />
              <Btn v="secondary" sm onClick={addTplItem}>+</Btn>
            </div>
            <div style={{ ...S.flex, marginTop: 12 }}>
              <Btn sm onClick={saveTemplate}>{editingTemplate ? "Update Template" : "Create Template"}</Btn>
              <Btn v="ghost" sm onClick={() => setTab("templates")}>Cancel</Btn>
            </div>
          </Card>
        )}

        {tab === "workflows" && WORKFLOWS.map(w => (
          <Card key={w.id} style={{ marginBottom: 6, padding: 12, borderLeft: `3px solid ${B.gold}` }}>
            <div><Badge color={B.forest}>{w.id}</Badge> <span style={{ fontWeight: 500, marginLeft: 6 }}>{w.name}</span></div>
            <div style={{ ...S.xs, marginTop: 4 }}>Entry: {w.entry} → Exit: {w.exit}</div>
          </Card>
        ))}
        {tab === "event_sop" && (
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: B.forest, marginBottom: 12 }}>Event SOP: Full Workflow</div>
            {[
              { t: "1. Pre-Event Planning", i: ["Confirm venue access, parking, contacts", "Create internal timeline", "Assign staff roles", "Create floral recipes per piece", "Pull stem counts, order 10-15% overage"] },
              { t: "2. Flower Receipt & Conditioning", i: ["Inspect on arrival", "Remove damaged, photo for credit", "Strip foliage, recut stems", "Clean buckets, flower food, cooler"] },
              { t: "3. Design & Production", i: ["Clean workspace, prep mechanics", "Build: Installs → Centerpieces → Bouquets → Bouts", "QC check, photograph finished pieces"] },
              { t: "4. Packing & Transport", i: ["Secure in crates, label by location", "Pack tools, emergency kit, extras", "Load largest first, temp control"] },
              { t: "5. On-Site Setup", i: ["Check in with coordinator", "Install ceremony → reception", "Final walkthrough, photograph"] },
              { t: "6. Teardown", i: ["Arrive at contracted time", "Remove efficiently", "Account for all property, note damages"] },
              { t: "7. Post-Event", i: ["Clean/sanitize vessels", "Restock supplies", "Upload photos, close event file"] },
            ].map(s => (
              <div key={s.t} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: B.forest }}>{s.t}</div>
                {s.i.map((item, i) => <div key={i} style={{ fontSize: 12, padding: "2px 0 2px 12px" }}>&#8226; {item}</div>)}
              </div>
            ))}
          </Card>
        )}
        {tab === "notes" && (<>
          {showNew && (
            <Card style={{ marginBottom: 12, borderLeft: `3px solid ${B.gold}`, padding: 12 }}>
              <Input label="Title" value={nn.title} onChange={v => setNn(p => ({ ...p, title: v }))} />
              <Input label="Content" value={nn.content} onChange={v => setNn(p => ({ ...p, content: v }))} textarea />
              <div style={S.flex}><Btn sm onClick={addNote}>Post</Btn><Btn v="ghost" sm onClick={() => setShowNew(false)}>Cancel</Btn></div>
            </Card>
          )}
          {data.boardNotes.length === 0 ? <Empty icon="◻" msg="No team notes yet." hint="Post reminders, shoutouts, or shared notes for the team." /> : data.boardNotes.map(n => (
            <Card key={n.id} style={{ marginBottom: 6, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 500, marginBottom: 3 }}>{n.title}</div>
                <button onClick={() => rmNote(n.id)} style={{ background: "none", border: "none", cursor: "pointer", color: B.muted, fontSize: 12 }}>✕</button>
              </div>
              <div style={{ fontSize: 12, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{n.content}</div>
              <div style={{ fontSize: 9, color: B.muted, marginTop: 6 }}>{new Date(n.createdAt).toLocaleDateString()}</div>
            </Card>
          ))}
        </>)}
      </div>
    </div>
  );
}

// Wrapped export with error boundary
export default function GreenGablesOps() {
  return React.createElement(ErrorBoundary, null, React.createElement(GreenGablesOpsInner));
}
