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

// Get stable location color map (sorted alphabetically)
export function getLocationColorMap(events) {
  const locations = Array.from(
    new Set(Object.values(events).map(e => e.location).filter(Boolean))
  ).sort(); // Sort alphabetically for stable colors

  const map = {};
  locations.forEach((loc, index) => {
    map[loc] = LOCATION_PALETTE[index % LOCATION_PALETTE.length];
  });
  return map;
}

// Initial events with multi-day support
export function getInitialEvents(year) {
  return {
    evt_1: {
      id: "evt_1",
      title: "Morning yoga routine",
      theme: "health",
      location: "Home",
      startDate: `${year}-0-15`,
      endDate: `${year}-0-15`
    },
    evt_2: {
      id: "evt_2",
      title: "Valentine's weekend",
      theme: "relationships",
      location: "Paris",
      startDate: `${year}-1-14`,
      endDate: `${year}-1-16`
    },
    evt_3: {
      id: "evt_3",
      title: "Japan trip",
      theme: "experiences",
      location: "Tokyo",
      startDate: `${year}-2-1`,
      endDate: `${year}-2-7`
    },
    evt_4: {
      id: "evt_4",
      title: "Financial planning",
      theme: "wealth",
      location: "Office",
      startDate: `${year}-3-5`,
      endDate: `${year}-3-5`
    },
    evt_5: {
      id: "evt_5",
      title: "Mom's birthday",
      theme: "relationships",
      location: "London",
      startDate: `${year}-4-10`,
      endDate: `${year}-4-12`
    },
    evt_6: {
      id: "evt_6",
      title: "Summer solstice hike",
      theme: "experiences",
      location: "The Alps",
      startDate: `${year}-5-21`,
      endDate: `${year}-5-21`
    },
    evt_7: {
      id: "evt_7",
      title: "Beach trip",
      theme: "experiences",
      location: "Malibu",
      startDate: `${year}-6-4`,
      endDate: `${year}-6-8`
    },
    evt_8: {
      id: "evt_8",
      title: "Digital detox",
      theme: "health",
      location: "Cabin",
      startDate: `${year}-7-15`,
      endDate: `${year}-7-20`
    },
    evt_9: {
      id: "evt_9",
      title: "Italian cooking course",
      theme: "growth",
      location: "Kitchen",
      startDate: `${year}-8-1`,
      endDate: `${year}-8-1`
    },
    evt_10: {
      id: "evt_10",
      title: "Photography course",
      theme: "growth",
      location: "Studio",
      startDate: `${year}-9-10`,
      endDate: `${year}-9-10`
    },
    evt_11: {
      id: "evt_11",
      title: "Thanksgiving",
      theme: "relationships",
      location: "Boston",
      startDate: `${year}-10-25`,
      endDate: `${year}-10-28`
    },
    evt_12: {
      id: "evt_12",
      title: "Christmas",
      theme: "relationships",
      location: "New York",
      startDate: `${year}-11-24`,
      endDate: `${year}-11-26`
    },
  };
}
