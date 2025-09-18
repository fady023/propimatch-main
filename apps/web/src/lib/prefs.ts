export type ListingAction = {
  shortlisted?: boolean;
  discarded?: boolean;
};

const STORAGE_KEY = 'propimatch:listings:actions:v1';

function readAll(): Record<string, ListingAction> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, ListingAction>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function getActionFor(listingId: string): ListingAction {
  const all = readAll();
  return all[listingId] ?? {};
}

export function setActionFor(listingId: string, action: ListingAction) {
  const all = readAll();
  all[listingId] = { ...all[listingId], ...action };
  // ensure mutual exclusivity for UX clarity
  if (all[listingId].shortlisted) all[listingId].discarded = false;
  if (all[listingId].discarded) all[listingId].shortlisted = false;
  writeAll(all);
}

export function clearActions() {
  writeAll({});
}

