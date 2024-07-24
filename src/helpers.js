
import _ from 'lodash'

const lon2tile = (lon,zoom) => { return (Math.floor((lon+180)/360*Math.pow(2,zoom))) }
const lat2tile = (lat,zoom) =>  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))) }

const getMapUrl = (lon, lat, zoom) => {
  return 'https://' + _.sample(['a', 'b', 'c']) +
    // '.tile.openstreetmap.org/' +
    '.tile.thunderforest.com/cycle/' +
    // '.tile.thunderforest.com/transport/' +
    zoom +
    '/' + lon2tile(lon, zoom) +
    '/' + lat2tile(lat, zoom) + '.png'
}

export default { getMapUrl };