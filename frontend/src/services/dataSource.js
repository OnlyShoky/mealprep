/**
 * dataSource.js
 *
 * Picks the active data source based on the VITE_DATA_SOURCE environment variable.
 *
 * Usage:
 *   VITE_DATA_SOURCE=local   → reads from src/data/recipes.json (default)
 *   VITE_DATA_SOURCE=supabase → reads from Supabase (requires configuration)
 *
 * No other file needs to be changed to switch data sources.
 */

import * as localSource from './localJsonSource.js';
import * as supabaseSource from './supabaseSource.js';

const source = import.meta.env.VITE_DATA_SOURCE ?? 'local';

const sources = {
  local: localSource,
  supabase: supabaseSource,
};

const activeSource = sources[source];

if (!activeSource) {
  throw new Error(`[dataSource] Unknown data source "${source}". Use "local" or "supabase".`);
}

export default activeSource;
