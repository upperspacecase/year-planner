// Calendar Constants for Year Planner

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

export const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export const THEMES = {
  health: {
    label: "Health",
    color: "bg-emerald-100",
    borderColor: "border-emerald-300",
    textColor: "text-emerald-700"
  },
  relationships: {
    label: "Relationships",
    color: "bg-rose-100",
    borderColor: "border-rose-300",
    textColor: "text-rose-700"
  },
  experiences: {
    label: "Experiences",
    color: "bg-amber-100",
    borderColor: "border-amber-300",
    textColor: "text-amber-700"
  },
  growth: {
    label: "Growth",
    color: "bg-violet-100",
    borderColor: "border-violet-300",
    textColor: "text-violet-700"
  },
  wealth: {
    label: "Wealth",
    color: "bg-sky-100",
    borderColor: "border-sky-300",
    textColor: "text-sky-700"
  }
};

// Location color palette - vibrant colors for visual distinction
export const LOCATION_COLORS = [
  { bg: "bg-amber-400", text: "text-white", name: "amber" },
  { bg: "bg-pink-400", text: "text-white", name: "pink" },
  { bg: "bg-emerald-400", text: "text-white", name: "emerald" },
  { bg: "bg-violet-400", text: "text-white", name: "violet" },
  { bg: "bg-sky-400", text: "text-white", name: "sky" },
  { bg: "bg-orange-400", text: "text-white", name: "orange" },
  { bg: "bg-teal-400", text: "text-white", name: "teal" },
  { bg: "bg-rose-400", text: "text-white", name: "rose" },
  { bg: "bg-indigo-400", text: "text-white", name: "indigo" },
  { bg: "bg-lime-400", text: "text-white", name: "lime" },
];

// Default color for events without location
export const DEFAULT_EVENT_COLOR = { bg: "bg-stone-300", text: "text-stone-600", name: "default" };

export const LOCATION_PALETTE = [
  "bg-teal-500", "bg-orange-500", "bg-sky-500", "bg-pink-500",
  "bg-indigo-500", "bg-lime-500", "bg-amber-600", "bg-fuchsia-500"
];

// Helper Functions
export function getDaysInMonth(year, month) {
  if (month === 1 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
    return 29;
  }
  return DAYS_IN_MONTH[month];
}

export function getDayOfWeek(year, month, day) {
  return new Date(year, month, day).getDay();
}

// Parse dateKey to Date object
export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month, day);
}

// Create dateKey from Date object
export function toDateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

// Get all dateKeys between start and end (inclusive)
export function getDateRange(startKey, endKey) {
  const start = parseDateKey(startKey);
  const end = parseDateKey(endKey);
  const dates = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(toDateKey(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

// Calculate days between two dateKeys
export function daysBetween(startKey, endKey) {
  const start = parseDateKey(startKey);
  const end = parseDateKey(endKey);
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

// Generate unique event ID
export function generateEventId() {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get stable location color map (hash-based for consistency)
// Colors won't shift when new locations are added
export function getLocationColorMap(events) {
  const locations = Array.from(
    new Set(Object.values(events).map(e => e.location).filter(Boolean))
  );

  // Simple hash function for strings
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const map = {};
  locations.forEach((loc) => {
    const colorIndex = hashString(loc) % LOCATION_COLORS.length;
    map[loc] = LOCATION_COLORS[colorIndex];
  });
  return map;
}

// Initial mock events for demo
export function getInitialEvents(year) {
  return {
    evt_1: {
      id: "evt_1",
      title: "Marathon Training",
      location: "Central Park",
      startDate: `${year}-0-15`,
      endDate: `${year}-0-15`
    },
    evt_2: {
      id: "evt_2",
      title: "Cherry Blossoms",
      location: "Kyoto",
      startDate: `${year}-3-1`,
      endDate: `${year}-3-7`
    },
    evt_3: {
      id: "evt_3",
      title: "Summer Beach House",
      location: "Malibu",
      startDate: `${year}-6-10`,
      endDate: `${year}-6-20`
    },
    evt_4: {
      id: "evt_4",
      title: "Tech Conference",
      location: "San Francisco",
      startDate: `${year}-8-15`,
      endDate: `${year}-8-18`
    },
    evt_5: {
      id: "evt_5",
      title: "Family Reunion",
      location: "Chicago",
      startDate: `${year}-10-24`,
      endDate: `${year}-10-28`
    },
    evt_6: {
      id: "evt_6",
      title: "Winter Ski Trip",
      location: "Aspen",
      startDate: `${year}-11-20`,
      endDate: `${year}-11-27`
    }
  };
}

