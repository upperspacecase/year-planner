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

export function getInitialReservations(year) {
  return {
    [`${year}-0-15`]: { title: "Morning yoga routine starts", theme: "health", location: "Home" },
    [`${year}-1-14`]: { title: "Valentine's weekend getaway", theme: "relationships", location: "Paris" },
    [`${year}-2-1`]: { title: "Japan trip begins", theme: "experiences", location: "Tokyo" },
    [`${year}-2-2`]: { title: "Japan trip", theme: "experiences", location: "Tokyo" },
    [`${year}-2-3`]: { title: "Japan trip", theme: "experiences", location: "Kyoto" },
    [`${year}-2-7`]: { title: "Japan trip ends", theme: "experiences", location: "Osaka" },
    [`${year}-3-5`]: { title: "Financial planning session", theme: "wealth", location: "Office" },
    [`${year}-4-10`]: { title: "Mom's birthday weekend", theme: "relationships", location: "London" },
    [`${year}-5-21`]: { title: "Summer solstice hike", theme: "experiences", location: "The Alps" },
    [`${year}-6-4`]: { title: "Beach trip with friends", theme: "experiences", location: "Malibu" },
    [`${year}-7-15`]: { title: "Digital detox starts", theme: "health", location: "Cabin" },
    [`${year}-8-1`]: { title: "Learn to cook Italian", theme: "growth", location: "Kitchen" },
    [`${year}-9-10`]: { title: "Photography course starts", theme: "growth", location: "Studio" },
    [`${year}-10-25`]: { title: "Thanksgiving with family", theme: "relationships", location: "Boston" },
    [`${year}-11-24`]: { title: "Christmas with family", theme: "relationships", location: "New York" },
  };
}
