class CanvasDraw {
  constructor(el, options = {}) {
    this.canvas = typeof el === 'string' ? document.querySelector(el) : el

    this.ctx = this.canvas.getContext('2d')

    const DEFAULTS_OPTIONS = {
      point: {
        fillStyle: 'rgba(70, 217, 253, 1)',
        strokeStyle: 'rgba(255, 255, 255, 1)',
        lineWidth: 3,
        radius: 4
      },
      line: {
        fillStyle: 'rgba(70, 217, 253, .5)',
        strokeStyle: 'rgba(255, 255, 255, 1)',
        lineWidth: 2
      }
    }

    if (!options.width || !options.height) {
      options.canvasWidth = 800
      options.height = 450
    }

    const scale = options.width / 800
    DEFAULTS_OPTIONS.point.lineWidth *= scale
    DEFAULTS_OPTIONS.point.radius *= scale
    DEFAULTS_OPTIONS.line.lineWidth *= scale


    this.canvasWidth = options.width
    this.canvasHeight = options.height

    this.events = {}

    this.rect = this.canvas.getBoundingClientRect()
    this.isEnd = false

    this.options = Object.assign({}, DEFAULTS_OPTIONS, options)
    this.points = options.points || []

    if (!this.options.readonly) {
      this.initEvent()
    }


    this.draw()

    if (this.checkClose()) {
      this.isEnd = true
    }
  }
  on(type, cb) {
    if (!this.events[type]) {
      this.events[type] = []
    }
    this.events[type].push(cb)
  }
  trigger(type, ...args) {
    (this.events[type] || []).forEach(fn => fn(...args))
  }
  initEvent() {
    const { canvas } = this
    canvas.addEventListener('click', (e) => {
      const point = {
        x: +((e.clientX - this.rect.left) / this.canvasWidth).toFixed(6),
        y: +((e.clientY - this.rect.top) / this.canvasHeight).toFixed(6)
      }
      if (this.isEnd) {
        if (this.checkInner(point)) {
          this.trigger('clickInner', true)
        } else {
          this.trigger('clickInner', false)
        }
      } else {
        if (this.checkClose(point)) {
          this.points.push(this.points[0])
          this.isEnd = true
          this.trigger('drawComplete', this.points)
        } else {
          this.points.push(point)
        }

        this.draw()
      }
    })
  }
  draw() {
    const { ctx, points } = this
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.drawLine(points)

    points.forEach(point => {
      this.drawPoint(point)
    })
  }
  drawPoint(point) {
    const { ctx, options } = this
    const { fillStyle, strokeStyle, lineWidth, radius } = options.point
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.fillStyle = fillStyle
    ctx.strokeStyle = strokeStyle
    const x = point.x * this.canvasWidth
    const y = point.y * this.canvasHeight
    ctx.arc(x, y, radius, 0, Math.PI * 2, false)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
    this.trigger('pointChange', { isEnd: this.isEnd, points: this.points })
  }
  drawLine(points = []) {
    const { ctx } = this
    const { strokeStyle, lineWidth, fillStyle } = this.options.line

    ctx.strokeStyle = strokeStyle
    ctx.fillStyle = fillStyle
    ctx.lineWidth = lineWidth

    const len = points.length
    if (len <= 1) {
      return
    }
    if (this.isEnd) {
      ctx.setLineDash([])
    } else {
      ctx.setLineDash([5, 5])
    }
    ctx.beginPath()
    points.forEach((point, index) => {
      const x = point.x * this.canvasWidth
      const y = point.y * this.canvasHeight
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    if (points[0].x === points[len - 1].x && points[0].y === points[len - 1].y) {
      ctx.fill()
    }
    ctx.closePath()
    ctx.restore()
  }
  drawArea() {
    const { ctx, points } = this
    ctx.beginPath()
    ctx.fillStyle = 'red'
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1, len = points.length; i < len; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.fill()
    ctx.restore()
    ctx.closePath()
  }
  checkClose(point) {
    const len = this.points.length
    point = point || this.points[len - 1]
    if (len >= 3) {
      const start = this.points[0]
      const startX = start.x * this.canvasWidth
      const startY = start.y * this.canvasHeight
      const x = point.x * this.canvasWidth
      const y = point.y * this.canvasHeight

      const dis = Math.sqrt((x - startX) * (x - startX) + (y - startY) * (y - startY))

      if (dis <= this.options.point.radius * 2) {
        return true
      }
    }
    return false
  }
  prevStep() {
    this.points.pop()
    if (this.isEnd) {
      this.isEnd = false
    }
    this.trigger('pointChange', { isEnd: this.isEnd, points: this.points })
    this.draw()
  }
  checkInner(dot) {
    const { x, y } = dot
    const coordinates = this.points

    var crossNum = 0
    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = coordinates[i]
      const end = coordinates[i + 1]

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
      var k = (end.y - start.y) / (end.x - start.x)
      // 交点的x坐标
      var x0 = (y - start.y) / k + start.x
      // 因为射线向右水平，此处说明不相交
      if (x > x0) continue

      if ((end.x > start.x && x0 >= start.x && x0 <= end.x) || (end.x < start.x && x0 >= end.x && x0 <= start.x)) {
        crossNum++
      }
    }

    return crossNum % 2 === 1
  }
  calcRectBound(index) {
    const region = this.points
    const regionX = region.map(v => v.x)
    const regionY = region.map(v => v.y)

    const minX = Math.min(...regionX) * this.canvasWidth
    const maxX = Math.max(...regionX) * this.canvasWidth
    const minY = Math.min(...regionY) * this.canvasHeight
    const maxY = Math.max(...regionY) * this.canvasHeight

    return {
      minX,
      maxX,
      minY,
      maxY
    }
  }
  clearPoint() {
    this.points = []
    this.draw()
    this.isEnd = false
    this.trigger('pointChange', { isEnd: this.isEnd, points: this.points })
  }
  addPoint(point) {
    console.log('addPoint')
    this.points.push(point)
    if (this.checkClose(point)) {
      this.isEnd = true
      this.trigger('pointChange', { isEnd: this.isEnd, points: this.points })
      this.trigger('drawComplete', this.points)
    }
    this.draw()
  }
}

export default CanvasDraw
