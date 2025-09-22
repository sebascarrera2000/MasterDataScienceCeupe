// src/swagger.js
export const swaggerDoc = {
  openapi: '3.0.3',
  info: {
    title: 'SaberPro Analytics API',
    version: '1.0.0'
  },
  servers: [{ url: 'http://127.0.0.1:3000' }],
  paths: {
    '/health': {
      get: {
        summary: 'Health',
        responses: { '200': { description: 'ok' } }
      }
    },
    '/api/rank/colleges': {
      get: {
        summary: 'Ranking de colegios',
        parameters: [
          { name: 'anio', in: 'query', required: true, schema: { type: 'integer' } },
          { name: 'municipio', in: 'query', schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, minimum: 1, maximum: 200 } },
          { name: 'ordenar_por', in: 'query', schema: { type: 'string', enum: ['media_global','media_lc','media_mat','media_soc','media_nat','media_ing'] } },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc','desc'], default: 'desc' } }
        ],
        responses: { '200': { description: 'OK' } }
      }
    },

    // ✅ ACTUALIZADO: usa stg_eda_programa_raw y nuevos filtros
    '/api/rank/programs': {
      get: {
        summary: 'Ranking de programas (desde stg_eda_programa_raw)',
        description: 'Ordena por media_global (desc). Permite filtrar por año, municipio (key_muni), institución, origen y carácter académico.',
        parameters: [
          { name: 'anio', in: 'query', required: true, schema: { type: 'integer' } },
          { name: 'municipio', in: 'query', schema: { type: 'string' }, description: 'Filtra por key_muni' },
          { name: 'institucion', in: 'query', schema: { type: 'string' }, description: 'Filtra por inst_nombre_institucion' },
          { name: 'origen', in: 'query', schema: { type: 'string' }, description: 'Filtra por inst_origen' },
          { name: 'caracter', in: 'query', schema: { type: 'string' }, description: 'Filtra por inst_caracter_academico' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50, minimum: 1, maximum: 200 } }
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    anio: { type: 'integer' },
                    criterio: { type: 'string', example: 'media_global' },
                    fuente: { type: 'string', example: 'stg_eda_programa_raw' },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          anio: { type: 'integer' },
                          inst_nombre_institucion: { type: 'string' },
                          programa_id: { type: 'string' },
                          key_muni: { type: 'string' },
                          estu_mcpio_presentacion: { type: 'string' },
                          inst_origen: { type: 'string' },
                          inst_caracter_academico: { type: 'string' },
                          media_global: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },

    '/api/summary/college': {
      get: {
        summary: 'Resumen de un colegio',
        parameters: [
          { name: 'anio', in: 'query', required: true, schema: { type: 'integer' } },
          { name: 'colegio_nombre', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'municipio', in: 'query', schema: { type: 'string' } }
        ],
        responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } }
      }
    },
    '/api/summary/program': {
      get: {
        summary: 'Resumen de un programa',
        parameters: [
          { name: 'anio', in: 'query', required: true, schema: { type: 'integer' } },
          { name: 'programa_id', in: 'query', required: true, schema: { type: 'string' } }
        ],
        responses: { '200': { description: 'OK' } }
      }
    },
    '/api/rank/competencias': {
      get: {
        summary: 'Ranking de competencias S11 por municipio',
        parameters: [
          { name: 'anio', in: 'query', required: true, schema: { type: 'integer' } },
          { name: 'competencia', in: 'query', schema: { type: 'string', enum: ['prom_lc','prom_mat','prom_soc','prom_nat','prom_ing'], default: 'prom_lc' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, minimum: 1, maximum: 200 } }
        ],
        responses: { '200': { description: 'OK' } }
      }
    },
    '/api/options/municipios': {
      get: {
        summary: 'Lista de municipios (options)',
        parameters: [
          { name: 'anio', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 500 } }
        ],
        responses: { '200': { description: 'OK' } }
      }
    },
    '/api/options/colegios': {
      get: {
        summary: 'Lista de colegios (options)',
        parameters: [
          { name: 'anio', in: 'query', schema: { type: 'integer' } },
          { name: 'municipio', in: 'query', schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 1000 } }
        ],
        responses: { '200': { description: 'OK' } }
      }
    },

    // ✅ ACTUALIZADO: ahora lee de stg_eda_programa_raw y permite más filtros
'/api/options/programas': {
  get: {
    summary: 'Lista de programas (options) desde stg_eda_programa_raw',
    description: 'Devuelve programas únicos con institución y año.',
    parameters: [
      { name: 'anio', in: 'query', schema: { type: 'integer' } },
      { name: 'municipio', in: 'query', schema: { type: 'string' }, description: 'Filtra por key_muni' },
      { name: 'institucion', in: 'query', schema: { type: 'string' }, description: 'Filtra por inst_nombre_institucion' },
      { name: 'origen', in: 'query', schema: { type: 'string' }, description: 'Filtra por inst_origen' },
      { name: 'caracter', in: 'query', schema: { type: 'string' }, description: 'Filtra por inst_caracter_academico' },
      { name: 'limit', in: 'query', schema: { type: 'integer', default: 2000 } }
    ],
    responses: {
      '200': {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  programa_id: { type: 'string' },
                  inst_nombre_institucion: { type: 'string' },
                  anio: { type: 'integer' }
                }
              }
            }
          }
        }
      }
    }
  }
},
'/api/rank/va-programs': {
  get: {
    summary: 'Ranking de programas por Valor Agregado (va_programa)',
    description: 'Ordena por va_promedio (desc) y permite filtrar por año, municipio, institución o programa.',
    parameters: [
      { name: 'anio', in: 'query', required: true, schema: { type: 'integer' } },
      { name: 'municipio', in: 'query', schema: { type: 'string' }, description: 'Filtra por key_muni' },
      { name: 'institucion', in: 'query', schema: { type: 'string' }, description: 'Filtra por inst_nombre_institucion' },
      { name: 'programa_id', in: 'query', schema: { type: 'string' }, description: 'Filtra por programa_id' },
      { name: 'limit', in: 'query', schema: { type: 'integer', default: 50, minimum: 1, maximum: 500 } }
    ],
    responses: {
      '200': {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                anio: { type: 'integer' },
                criterio: { type: 'string', example: 'va_promedio' },
                fuente: { type: 'string', example: 'va_programa' },
                total: { type: 'integer' },
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      programa_id: { type: 'string' },
                      estu_prgm_academico: { type: 'string' },
                      inst_nombre_institucion: { type: 'string' },
                      key_muni: { type: 'string' },
                      n: { type: 'integer' },
                      va_promedio: { type: 'number' },
                      sd: { type: 'number' },
                      ic95_inf: { type: 'number' },
                      ic95_sup: { type: 'number' },
                      media_obs: { type: 'number' },
                      media_pred: { type: 'number' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
},


    '/api/catalogs/municipios': {
      get: {
        summary: 'Catálogo de municipios (todos los colegios)',
        parameters: [
          { name: 'anio', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 500 } }
        ],
        responses: { '200': { description: 'OK' } }
      }
    },

    // ✅ NUEVO: catálogo de programas
    '/api/catalogs/programas': {
      get: {
        summary: 'Catálogo de programas (desde stg_eda_programa_raw)',
        parameters: [
          { name: 'anio', in: 'query', schema: { type: 'integer' } },
          { name: 'municipio', in: 'query', schema: { type: 'string' }, description: 'key_muni' },
          { name: 'institucion', in: 'query', schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 1000, minimum: 1, maximum: 5000 } }
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer' },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          programa_id: { type: 'string' },
                          inst_nombre_institucion: { type: 'string' },
                          key_muni: { type: 'string' },
                          anio: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
