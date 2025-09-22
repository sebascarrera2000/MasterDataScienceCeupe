// src/routes/analytics_pg.js  (misma API, consultas SQL parametrizadas)
import express from 'express';
import { sql } from '../db.js';

const router = express.Router();

const ORDER_COLS_COLEGIO = new Set(['media_global','media_lc','media_mat','media_soc','media_nat','media_ing']);
const ORDER_DIR = new Set(['asc','desc']);
const COMP_KEYS = new Set(['prom_lc','prom_mat','prom_soc','prom_nat','prom_ing']);

// /api/rank/colleges
router.get('/rank/colleges', async (req, res) => {
  try {
    const anio = Number(req.query.anio);
    const municipio = req.query.municipio || null;
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 200);
    const ordenar_por = ORDER_COLS_COLEGIO.has(req.query.ordenar_por) ? req.query.ordenar_por : 'media_global';
    const order = ORDER_DIR.has(req.query.order) ? req.query.order : 'desc';

    if (!anio) return res.status(400).json({ error: 'anio requerido' });

    // NOTE: columna en ORDER BY whitelisted (no va como parámetro)
    const base = `
      SELECT anio, colegio_nombre, cole_mcpio_ubicacion, media_global, media_lc, media_mat, media_soc, media_nat, media_ing, sd_global, n_estu
      FROM public.eda_colegio
      WHERE anio = $1
      ${municipio ? 'AND cole_mcpio_ubicacion = $2' : ''}
      ORDER BY ${ordenar_por} ${order === 'asc' ? 'ASC' : 'DESC'}
      LIMIT $${municipio ? 3 : 2}
    `;
    const params = municipio ? [anio, municipio, limit] : [anio, limit];
    const rows = await sql(base, params);
    res.json({ anio, municipio, ordenar_por, order, items: rows });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.get('/rank/programs', async (req, res) => {
  try {
    const anio = Number(req.query.anio);
    if (!anio) return res.status(400).json({ error: 'anio requerido' });

    const municipio = req.query.municipio || null;               // map a key_muni
    const institucion = req.query.institucion || null;           // inst_nombre_institucion
    const origen = req.query.origen || null;                     // inst_origen
    const caracter = req.query.caracter || null;                 // inst_caracter_academico
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);

    // Armamos el WHERE dinámico con parámetros
    const wh = ['anio = $1'];
    const params = [anio];
    let p = 2;

    if (municipio) { wh.push(`key_muni = $${p++}`); params.push(municipio); }
    if (institucion) { wh.push(`inst_nombre_institucion = $${p++}`); params.push(institucion); }
    if (origen) { wh.push(`inst_origen = $${p++}`); params.push(origen); }
    if (caracter) { wh.push(`inst_caracter_academico = $${p++}`); params.push(caracter); }

    const query = `
      SELECT
        anio,
        inst_nombre_institucion,
        estu_prgm_academico AS programa_id,
        key_muni,
        estu_mcpio_presentacion,
        inst_origen,
        inst_caracter_academico,
        media_global
      FROM public.stg_eda_programa_raw
      WHERE ${wh.join(' AND ')}
      ORDER BY media_global DESC NULLS LAST
      LIMIT $${p}
    `;
    params.push(limit);

    const rows = await sql(query, params);

    return res.json({
      anio,
      criterio: 'media_global',
      fuente: 'stg_eda_programa_raw',
      items: rows
    });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});



// /api/summary/college
router.get('/summary/college', async (req, res) => {
  try {
    const anio = Number(req.query.anio);
    const colegio_nombre = req.query.colegio_nombre;
    const municipio = req.query.municipio || null;
    if (!anio || !colegio_nombre) return res.status(400).json({ error: 'anio y colegio_nombre requeridos' });

    const q = `
      SELECT *
      FROM public.eda_colegio
      WHERE anio = $1 AND colegio_nombre = $2
      ${municipio ? 'AND cole_mcpio_ubicacion = $3' : ''}
      LIMIT 1
    `;
    const rows = await sql(q, municipio ? [anio, colegio_nombre, municipio] : [anio, colegio_nombre]);
    if (!rows.length) return res.status(404).json({ error: 'Colegio no encontrado para ese año' });
    const row = rows[0];
    res.json({
      anio,
      colegio_nombre: row.colegio_nombre,
      municipio: row.cole_mcpio_ubicacion,
      n_estu: row.n_estu,
      global: row.media_global,
      competencias: {
        lectura_critica: row.media_lc,
        matematicas: row.media_mat,
        sociales_ciudadanas: row.media_soc,
        ciencias_naturales: row.media_nat,
        ingles: row.media_ing,
      },
      spread: { sd_global: row.sd_global, p50_global: row.p50_global }
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// /api/summary/program
router.get('/summary/program', async (req, res) => {
  try {
    const anio = Number(req.query.anio);
    const programa_id = req.query.programa_id;
    if (!anio || !programa_id) return res.status(400).json({ error: 'anio y programa_id requeridos' });

    const [eda] = await sql(
      `SELECT * FROM public.eda_programa WHERE anio = $1 AND programa_id = $2 LIMIT 1`,
      [anio, programa_id]
    );
    const [va] = await sql(
      `SELECT * FROM public.va_programa WHERE anio = $1 AND programa_id = $2 LIMIT 1`,
      [anio, programa_id]
    );

    res.json({ anio, programa_id, eda: eda || null, va: va || null });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// /api/rank/competencias
router.get('/rank/competencias', async (req, res) => {
  try {
    const anio = Number(req.query.anio);
    const competencia = COMP_KEYS.has(req.query.competencia) ? req.query.competencia : 'prom_lc';
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 200);
    if (!anio) return res.status(400).json({ error: 'anio requerido' });

    const q = `
      SELECT anio, cole_mcpio_ubicacion, municipio_id, prom_lc, prom_mat, prom_soc, prom_nat, prom_ing
      FROM public.s11_baseline_muni
      WHERE anio = $1
      ORDER BY ${competencia} DESC
      LIMIT $2
    `;
    const rows = await sql(q, [anio, limit]);
    const items = rows.map(r => ({
      ...r,
      municipio_nombre: r.cole_mcpio_ubicacion || r.municipio_id
    }));
    res.json({ anio, competencia, items });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// /api/options/municipios
router.get('/options/municipios', async (req, res) => {
  try {
    const anio = req.query.anio ? Number(req.query.anio) : null;
    const limit = Number(req.query.limit) || 500;
    const q = `
      SELECT cole_mcpio_ubicacion AS municipio, anio
      FROM public.eda_colegio
      WHERE cole_mcpio_ubicacion IS NOT NULL
      ${anio ? 'AND anio = $1' : ''}
      LIMIT $${anio ? 2 : 1}
    `;
    const rows = await sql(q, anio ? [anio, limit] : [limit]);
    const uniq = Array.from(new Set(rows.map(r => `${r.municipio}|||${r.anio}`)))
      .map(s => { const [m,a]=s.split('|||'); return { municipio: m, anio: Number(a) }; })
      .sort((x,y) => x.municipio.localeCompare(y.municipio) || x.anio - y.anio);
    res.json(uniq);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// /api/options/colegios
router.get('/options/colegios', async (req, res) => {
  try {
    const anio = req.query.anio ? Number(req.query.anio) : null;
    const municipio = req.query.municipio || null;
    const limit = Number(req.query.limit) || 1000;
    const q = `
      SELECT colegio_nombre, cole_mcpio_ubicacion AS municipio, anio
      FROM public.eda_colegio
      ${anio || municipio ? 'WHERE 1=1' : ''}
      ${anio ? ' AND anio = $1' : ''}
      ${municipio ? (anio ? ' AND' : ' WHERE') + ' cole_mcpio_ubicacion = $' + (anio ? 2 : 1) : ''}
      LIMIT $${anio && municipio ? 3 : (anio || municipio ? 2 : 1)}
    `;
    const params = [];
    if (anio) params.push(anio);
    if (municipio) params.push(municipio);
    params.push(limit);

    const rows = await sql(q, params);
    const uniq = Array.from(new Set(rows.map(r => `${r.colegio_nombre}|||${r.municipio}|||${r.anio}`)))
      .map(s => { const [c,m,a]=s.split('|||'); return { colegio_nombre: c, municipio: m, anio: Number(a) }; })
      .sort((x,y) => x.colegio_nombre.localeCompare(y.colegio_nombre) || x.anio - y.anio);
    res.json(uniq);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// /api/options/programas
// /api/options/programas usando stg_eda_programa_raw
router.get('/options/programas', async (req, res) => {
  try {
    const anio        = req.query.anio ? Number(req.query.anio) : null;
    const municipio   = req.query.municipio || null;               // key_muni
    const institucion = req.query.institucion || null;             // inst_nombre_institucion
    const origen      = req.query.origen || null;                  // inst_origen
    const caracter    = req.query.caracter || null;                // inst_caracter_academico
    const limit       = Math.min(Math.max(Number(req.query.limit) || 2000, 1), 10000);

    const wh = ['1=1'];
    const params = [];
    let p = 1;

    if (anio)        { wh.push(`anio = $${p++}`); params.push(anio); }
    if (municipio)   { wh.push(`key_muni = $${p++}`); params.push(municipio); }
    if (institucion) { wh.push(`inst_nombre_institucion = $${p++}`); params.push(institucion); }
    if (origen)      { wh.push(`inst_origen = $${p++}`); params.push(origen); }
    if (caracter)    { wh.push(`inst_caracter_academico = $${p++}`); params.push(caracter); }

    const q = `
      SELECT DISTINCT
        estu_prgm_academico AS programa_id,
        inst_nombre_institucion,
        anio
      FROM public.stg_eda_programa_raw
      WHERE ${wh.join(' AND ')}
      ORDER BY inst_nombre_institucion ASC, programa_id ASC, anio ASC
      LIMIT $${p}
    `;
    params.push(limit);

    const rows = await sql(q, params);

    const uniq = Array.from(
      new Set(rows.map(r => `${r.programa_id}|||${r.inst_nombre_institucion}|||${r.anio}`))
    ).map(s => {
      const [p, inst, a] = s.split('|||');
      return {
        programa_id: p,
        inst_nombre_institucion: inst,
        anio: Number(a)
      };
    }).sort(
      (x, y) =>
        x.inst_nombre_institucion.localeCompare(y.inst_nombre_institucion) ||
        x.programa_id.localeCompare(y.programa_id) ||
        x.anio - y.anio
    );

    res.json(uniq);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});



// GET /api/catalogs/municipios
router.get('/municipios', async (req, res) => {
  try {
    const { anio, limit = 500 } = req.query;

    const q = `
      SELECT DISTINCT cole_mcpio_ubicacion AS municipio, anio
      FROM public.eda_colegio
      WHERE cole_mcpio_ubicacion IS NOT NULL
      ${anio ? 'AND anio = $1' : ''}
      ORDER BY municipio ASC, anio ASC
      LIMIT $${anio ? 2 : 1}
    `;

    const rows = await sql(q, anio ? [anio, limit] : [limit]);

    res.json(rows.map(r => ({
      municipio: r.municipio,
      anio: Number(r.anio)
    })));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// src/routes/analytics_pg.js (añade este bloque)
router.get('/rank/va-programs', async (req, res) => {
  try {
    const anio        = req.query.anio ? Number(req.query.anio) : null;
    const municipio   = req.query.municipio || null;               // key_muni
    const institucion = req.query.institucion || null;             // inst_nombre_institucion
    const programa    = req.query.programa_id || null;             // programa_id
    const limit       = Math.min(Math.max(Number(req.query.limit) || 50, 1), 500);

    if (!anio) return res.status(400).json({ error: 'anio requerido' });

    const wh = ['anio = $1'];
    const params = [anio];
    let p = 2;

    if (municipio)   { wh.push(`key_muni = $${p++}`); params.push(municipio); }
    if (institucion) { wh.push(`inst_nombre_institucion = $${p++}`); params.push(institucion); }
    if (programa)    { wh.push(`programa_id = $${p++}`); params.push(programa); }

    const q = `
      SELECT
        anio,
        programa_id,
        estu_prgm_academico,
        inst_nombre_institucion,
        key_muni,
        n,
        va_promedio,
        sd,
        ic95_inf,
        ic95_sup,
        media_obs,
        media_pred
      FROM public.va_programa
      WHERE ${wh.join(' AND ')}
      ORDER BY va_promedio DESC NULLS LAST
      LIMIT $${p}
    `;
    params.push(limit);

    const rows = await sql(q, params);

    res.json({
      anio,
      criterio: 'va_promedio',
      fuente: 'va_programa',
      total: rows.length,
      items: rows
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});


export default router;
