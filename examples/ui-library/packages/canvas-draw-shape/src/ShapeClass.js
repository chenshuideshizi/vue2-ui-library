import { checkInPolygonRay, getTwoPointDist } from './utils'

const DEFAULT_OPTIONS = {
  canvas: null,
  canvasWidth: null,
  canvasHeight: null,
  points: [], // 组件形状点的集合
  pointStyle: {
    fillColor: 'red',
    strokeColor: 'red',
    strokeWidth: 2,
    radius: 4
  },
  lineStyle: {
    width: 2,
    fillColor: 'green',
    strokeColor: 'red'
  }
}

let id = 1
class Shape {
  /**
   *
   * @param {Object} options - 所有参数
   * @param { DomElement } options.canvas - canvas 元素 dom对象
   * @param {Number} options.canvasWidth - canvas 宽度
   * @param {Number} options.canvasHeight - canvas 高度
   * @param {Array} options.points - 形状组成点的集合
   * @param {Array} options.type - 类型
   * @param {Array} options.name - 名称
   * @param {Array} options.id - 唯一标识
   */
  constructor (options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options || {})

    // 参数保存
    this.canvas = this.options.canvas
    this.canvasWidth = this.options.canvasWidth
    this.canvasHeight = this.options.canvasHeight
    this.points = this.options.points
    this.type = this.options.type
    this.name = this.options.name
    this.lineStyle = this.options.lineStyle
    this.pointStyle = this.options.pointStyle
    this.id = this.options.id || id++

    this.ctx = this.canvas.getContext('2d')
  }

  get rectBoundary () {
    const { points } = this
    const arrX = points.map(v => v.x)
    const arrY = points.map(v => v.y)

    const minX = Math.min(...arrX)
    const maxX = Math.max(...arrX)
    const minY = Math.min(...arrY)
    const maxY = Math.max(...arrY)

    return {
      minX,
      minY,
      maxX,
      maxY,
    }
  }

  draw (autoClosed = true) {
    this.drawBoundaryLine(autoClosed)
  }

  // 绘制区域上的点
  drawBoundaryPoint () {
    const { ctx, points } = this
    ctx.setLineDash([])
    const drawPoint = (point, { isFill = true, isStroke = true, isDash = false } = {}) => {
      const { x, y } = this._transformPoint(point)
      ctx.beginPath()

      ctx.arc(x, y, this.pointStyle.radius, 0, Math.PI * 2, false)
      ctx.closePath()
      if (isStroke) {
        ctx.lineWidth = this.pointStyle.strokeWidth || 4
        ctx.strokeStyle = this.points.strokeColor
        ctx.stroke()
      }

      // 是否填充
      if (isFill) {
        ctx.fillStyle = this.pointStyle.fillColor
        ctx.fill()
      }

      ctx.restore()
    }
    const l = points.length
    for (let i = 0; i < l; i++) {
      const point = points[i]
      drawPoint(point, { isFill: i !== 0, isStroke: this.drawing })
    }
    // 绘制鼠标位置的点
    if (this.drawing) {
      if (l >= 1) {
        drawPoint(this.mousePoint, { isDash: true })
      }
    }
  }

  // 绘制线的方法
  drawBoundaryLine (autoClosed) {
    const { ctx, points } = this

    if (points.length === 0) {
      return
    }

    ctx.lineWidth = this.lineStyle.width
    ctx.fillStyle = this.lineStyle.fillColor
    ctx.strokeStyle = this.lineStyle.strokeColor

    ctx.beginPath()
    const l = points.length
    for (let i = 0; i < l; i++) {
      const point = points[i]
      const { x, y } = this._transformPoint(point)

      if (i === 0) {
        ctx.moveTo(x, y)
        continue
      }

      ctx.lineTo(x, y)
    }

    if (autoClosed) {
      const { x, y } = this._transformPoint(points[0])
      ctx.lineTo(x, y)
    }

    ctx.stroke()
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }

  _transformPoint (point, returnArr) {
    const x = point.x * this.canvasWidth
    const y = point.y * this.canvasHeight

    if (returnArr) {
      return [x, y]
    }

    return ({
      x: point.x * this.canvasWidth,
      y: point.y * this.canvasHeight
    })
  }

  // 检查某一个点是否在当前的形状内
  checkInner (point) {
    return checkInPolygonRay(this.points, point)
  }

  // 添加新的点
  addPoint (point) {
    this.historyRecordStack.push([...this.points]) // 添加历史记录
    this.points.push(point)
  }

  checkIsFirstPoint (point) {
    const point1 = this._transformPoint(point)
    const point2 = this._transformPoint(this.points[0])
    if (getTwoPointDist(point1, point2) < this.pointStyle.radius * 2) {
      return true
    }
    return false
  }
}

export default Shape
