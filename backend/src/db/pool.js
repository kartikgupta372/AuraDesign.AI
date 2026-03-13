// pool.js — Supabase SDK adapter (HTTPS only, zero pg dependency for queries)
// Exposes pool.query(sql, params) interface for drop-in compatibility
// All queries go through Supabase exec_sql RPC over HTTPS — no port 5432/6543 needed

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,   // anon key is fine — we GRANTed all tables to anon
  { auth: { persistSession: false } }
);

// Convert pg-style query to Supabase RPC call
// Handles SELECT, INSERT...RETURNING, UPDATE...RETURNING, DELETE
async function supabaseQuery(text, params = []) {
  const strParams = (params || []).map(p =>
    p === null || p === undefined ? null : String(p)
  );

  const upperText = text.trim().toUpperCase();
  const hasReturning = upperText.includes('RETURNING');
  const isSelect = upperText.startsWith('SELECT') || hasReturning;

  if (isSelect) {
    const { data, error } = await supabase.rpc('exec_sql', {
      query: text,
      params: strParams,
    });
    if (error) {
      console.error('Supabase exec_sql error:', error.message, '| Query:', text.substring(0, 80));
      throw new Error(error.message);
    }
    const rows = data ?? [];
    return { rows, rowCount: rows.length };
  } else {
    // INSERT/UPDATE/DELETE without RETURNING
    const { error } = await supabase.rpc('exec_sql_write', {
      query: text,
      params: strParams,
    });
    if (error) {
      console.error('Supabase exec_sql_write error:', error.message, '| Query:', text.substring(0, 80));
      throw new Error(error.message);
    }
    return { rows: [], rowCount: 0 };
  }
}

const poolProxy = {
  query: supabaseQuery,
  // Stub connect() — not used but keeps interface compatible
  connect: async () => ({
    query: supabaseQuery,
    release: () => {},
  }),
  end: async () => {},
};

// Test on startup
(async () => {
  try {
    const { error } = await supabase.from('users').select('id', { count: 'exact', head: true });
    if (error) throw new Error(error.message);
    console.log('✅ Supabase connected (HTTPS REST API)');
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
  }
})();

module.exports = poolProxy;
module.exports.supabase = supabase;
