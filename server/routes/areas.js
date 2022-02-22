const joi = require('joi')
const { Pool } = require('pg')
const db = require('flood-xws-common/db')
const config = require('../config')

/**
 * Create pg pool instance and common helpers
 */
const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseSsl
})

const { query } = db(pool)

// /**
//  * Find first flood area with code
//  *
//  * @param {string} code - The target area code
//  */
// async function findAreaByCode (code) {
//   const [result] = await query(`
//     select code, area_type_ref as "type", region, name, description
//     from xws_area.area ar
//     where ar.code = $1;`, [code])
//   return result
// }

// /**
//  * Find all flood alert areas that intersect a point
//  *
//  * @param {number} x - The x co-ordinate (Easting/longitude)
//  * @param {number} y - The y co-ordinate (Northing/latitude)
//  */
// async function findAlertAreasByPoint (x, y) {
//   return query(`
//     select *, st_asgeojson(geom) as geojson
//     from xws_area.area ar
//     where ar.area_type_ref = 'faa' and st_intersects(st_setsrid(st_makepoint($1, $2), 4326), ar.geom);`, [x, y])
// }

// /**
//  * Find all flood warning areas that intersect a point
//  *
//  * @param {number} x - The x co-ordinate (Easting/longitude)
//  * @param {number} y - The y co-ordinate (Northing/latitude)
//  */
// async function findWarningAreasByPoint (x, y) {
//   return query(`
//     select *, st_asgeojson(geom) as geojson
//     from xws_area.area ar
//     where ar.area_type_ref = 'fwa' and st_intersects(st_setsrid(st_makepoint($1, $2), 4326), ar.geom);`, [x, y])
// }

// /**
//  * Find all flood alert areas that intersect a bounding box
//  *
//  * @param {number} xmin - The x-min co-ordinate (Easting/longitude)
//  * @param {number} ymin - The y-max co-ordinate (Northing/latitude)
//  * @param {number} xmax - The x-max co-ordinate (Easting/longitude)
//  * @param {number} ymax - The y-max co-ordinate (Northing/latitude)
//  */
// async function findAlertAreasByBox (xmin, ymin, xmax, ymax) {
//   return query(`
//     select *, st_asgeojson(geom) as geojson
//     from xws_area.area ar
//     where ar.area_type_ref = 'faa' and st_intersects(st_setsrid(st_makeenvelope($1, $2, $3, $4), 4326), ar.geom);`, [xmin, ymin, xmax, ymax])
// }

// /**
//  * Find all flood warning areas that intersect a bounding box
//  *
//  * @param {number} xmin - The x-min co-ordinate (Easting/longitude)
//  * @param {number} ymin - The y-max co-ordinate (Northing/latitude)
//  * @param {number} xmax - The x-max co-ordinate (Easting/longitude)
//  * @param {number} ymax - The y-max co-ordinate (Northing/latitude)
//  */
// async function findWarningAreasByBox (xmin, ymin, xmax, ymax) {
//   return query(`
//     select *, st_asgeojson(geom) as geojson
//     from xws_area.area ar
//     where ar.area_type_ref = 'fwa' and st_intersects(st_setsrid(st_makeenvelope($1, $2, $3, $4), 4326), ar.geom);`, [xmin, ymin, xmax, ymax])
// }

// async function getAreasByPoint (x, y, type) {
//   switch (type) {
//     case 'faa':
//       return await findAlertAreasByPoint(x, y)
//     case 'fwa':
//       return await findWarningAreasByPoint(x, y)
//     default:
//       throw Error('Unknown area type')
//   }
// }

// async function getAreasByBox (xmin, ymin, xmax, ymax, type) {
//   switch (type) {
//     case 'faa':
//       return await findAlertAreasByBox(xmin, ymin, xmax, ymax)
//     case 'fwa':
//       return await findWarningAreasByBox(xmin, ymin, xmax, ymax)
//     default:
//       throw Error('Unknown area type')
//   }
// }

/**
 * Find all flood areas that intersect a point
 *
 * @param {number} x - The x co-ordinate (Easting/longitude)
 * @param {number} y - The y co-ordinate (Northing/latitude)
 */
async function findAreasByPoint (x, y) {
  return query(`
    select code, name
    from xws_area.area a
    where st_intersects(st_setsrid(st_makepoint($1, $2), 4326), a.geom);`, [x, y])
}

module.exports = [
  {
    method: 'GET',
    path: '/area',
    handler: async (request, h) => {
      const { x, y } = request.query

      return findAreasByPoint(x, y)
    },
    options: {
      validate: {
        query: joi.object({
          x: joi.number().required(),
          y: joi.number().required()
        })
      },
      description: 'Get areas that intersect a point'
    }
  }
]
