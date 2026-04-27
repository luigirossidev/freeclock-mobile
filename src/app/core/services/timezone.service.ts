import { Injectable } from '@angular/core';
import { TimezoneEntry, TIMEZONE_DATA } from '../constants/timezone-data';

const DEFAULT_IANA = 'Europe/Rome';

@Injectable({ providedIn: 'root' })
export class TimezoneService {

  getAllTimezones(): TimezoneEntry[] {
    return TIMEZONE_DATA;
  }

  search(query: string): TimezoneEntry[] {
    if (!query || query.trim().length === 0) return TIMEZONE_DATA;
    const q = query.toLowerCase();
    return TIMEZONE_DATA.filter(tz =>
      tz.iana.toLowerCase().includes(q) ||
      tz.label.toLowerCase().includes(q) ||
      tz.region.toLowerCase().includes(q)
    );
  }

  ianaToPosix(iana: string): string | null {
    const entry = TIMEZONE_DATA.find(tz => tz.iana === iana);
    return entry?.posix ?? null;
  }

  posixToIana(posix: string): string | null {
    const matches = TIMEZONE_DATA.filter(tz => tz.posix === posix);
    if (matches.length === 0) return null;
    // Prefer default timezone when POSIX is ambiguous (e.g. CET shared by many cities)
    return matches.find(tz => tz.iana === DEFAULT_IANA)?.iana ?? matches[0].iana;
  }

  posixToLabel(posix: string): string | null {
    const matches = TIMEZONE_DATA.filter(tz => tz.posix === posix);
    if (matches.length === 0) return null;
    const entry = matches.find(tz => tz.iana === DEFAULT_IANA) ?? matches[0];
    return `${entry.label} (${entry.iana})`;
  }

  getGroupedByRegion(): Map<string, TimezoneEntry[]> {
    const grouped = new Map<string, TimezoneEntry[]>();
    for (const tz of TIMEZONE_DATA) {
      const list = grouped.get(tz.region) ?? [];
      list.push(tz);
      grouped.set(tz.region, list);
    }
    return grouped;
  }
}
