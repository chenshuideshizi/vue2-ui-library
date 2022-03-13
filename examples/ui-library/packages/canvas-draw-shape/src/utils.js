/**
 *  射线法检测某一个是否在某一个几何形状内
 * @param {Array} polygonPoints - 组成几何形状的点 [{x: 0.1, y: 0.2}...]
 * @param {Object} point - 要检测的点 {x: 0.2, y: 0.01}
 * @returns Boolean
 */
export function checkInPolygonRay (polygonPoints, point) {
  const { x, y } = point

  let crossNum = 0
  for (let i = 0; i < polygonPoints.length - 1; i++) {
    const start = polygonPoints[i]
    const end = polygonPoints[i + 1]

    // 起点、终点斜率不存在的情况
    if (start.x === end.x) {
      // 因为射线向右水平，此处说明不相交
      if (x > start.x) continue

      if ((end.y > start.y && y >= start.y && y <= end.y) || (end.y < start.y && y >= end.y && y <= start.y)) {
        crossNum++
      }
      continue
    }
    // 斜率存在的情况，计算斜率
    const k = (end.y - start.y) / (end.x - start.x)
    // 交点的x坐标
    const x0 = (y - start.y) / k + start.x
    // 因为射线向右水平，此处说明不相交
    if (x > x0) continue

    if ((end.x > start.x && x0 >= start.x && x0 <= end.x) || (end.x < start.x && x0 >= end.x && x0 <= start.x)) {
      crossNum++
    }
  }

  return crossNum % 2 === 1
}

export function getTwoPointDist (point1, point2) {
  const dis = Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y))
  return dis
}
