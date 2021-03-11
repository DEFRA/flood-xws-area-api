// const joi = require('joi')
// const schema = require('../lib/schema')
const { Pool } = require('pg')

const db = require('xws-shared/db')

const config = require('../config')

/**
 * Create pg pool instance and common helpers
 */
const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseSsl
})

const { query } = db(pool)

/**
 * Find all flood alert areas that intersect a point
 *
 * @param {number} x - The x co-ordinate (Easting/longitude)
 * @param {number} y - The y co-ordinate (Northing/latitude)
 */
async function findAlertAreasByPoint (x, y) {
  return query(`
    select *, st_asgeojson(geom) as geojson
    from xws_area.area ar
    where ar.area_type_ref = 'faa' and st_intersects(st_setsrid(st_makepoint($1, $2), 4326), ar.geom);`, [x, y])
}

/**
 * Find all flood warning areas that intersect a point
 *
 * @param {number} x - The x co-ordinate (Easting/longitude)
 * @param {number} y - The y co-ordinate (Northing/latitude)
 */
async function findWarningAreasByPoint (x, y) {
  return query(`
    select *, st_asgeojson(geom) as geojson
    from xws_area.area ar
    where ar.area_type_ref = 'fwa' and st_intersects(st_setsrid(st_makepoint($1, $2), 4326), ar.geom);`, [x, y])
}

/**
 * Find all flood alert areas that intersect a bounding box
 *
 * @param {number} xmin - The x-min co-ordinate (Easting/longitude)
 * @param {number} ymin - The y-max co-ordinate (Northing/latitude)
 * @param {number} xmax - The x-max co-ordinate (Easting/longitude)
 * @param {number} ymax - The y-max co-ordinate (Northing/latitude)
 */
async function findAlertAreasByBox (xmin, ymin, xmax, ymax) {
  return query(`
    select *, st_asgeojson(geom) as geojson
    from xws_area.area ar
    where ar.area_type_ref = 'faa' and st_intersects(st_setsrid(st_makeenvelope($1, $2, $3, $4), 4326), ar.geom);`, [xmin, ymin, xmax, ymax])
}

/**
 * Find all flood warning areas that intersect a bounding box
 *
 * @param {number} xmin - The x-min co-ordinate (Easting/longitude)
 * @param {number} ymin - The y-max co-ordinate (Northing/latitude)
 * @param {number} xmax - The x-max co-ordinate (Easting/longitude)
 * @param {number} ymax - The y-max co-ordinate (Northing/latitude)
 */
async function findWarningAreasByBox (xmin, ymin, xmax, ymax) {
  return query(`
    select *, st_asgeojson(geom) as geojson
    from xws_area.area ar
    where ar.area_type_ref = 'fwa' and st_intersects(st_setsrid(st_makeenvelope($1, $2, $3, $4), 4326), ar.geom);`, [xmin, ymin, xmax, ymax])
}

async function getAreasByPoint (lat, lon, type) {
  switch (type) {
    case 'faa':
      return await findAlertAreasByPoint(lon, lat)
    case 'fwa':
      return await findWarningAreasByPoint(lon, lat)
    default:
      throw Error('Unknown area type')
  }
}

async function getAreasByBox (xmin, ymin, xmax, ymax, type) {
  switch (type) {
    case 'faa':
      return await findAlertAreasByBox(xmin, ymin, xmax, ymax)
    case 'fwa':
      return await findWarningAreasByBox(xmin, ymin, xmax, ymax)
    default:
      throw Error('Unknown area type')
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/areas',
    handler: async (request, h) => {
      const { lat, lon, xmin, ymin, xmax, ymax, type } = request.query

      const result = lat
        ? await getAreasByPoint(lat, lon, type)
        : await getAreasByBox(xmin, ymin, xmax, ymax, type)

      return {
        result
      }
    },
    options: {
      // validate: {
      //   query: joi.object().keys({
      //     address: schema.address,
      //     channelType: schema.channelType
      //   })
      // },
      description: 'Get areas within a bounding box'
    }
  }
]
