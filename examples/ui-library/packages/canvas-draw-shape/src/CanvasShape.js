import Shape from './ShapeClass'

const DEFAULT_OPTIONS = {
  initShapes: [],
  shapesConfig: {}
}

class CanvasShape {
  /**
   *
   * @param {*} canvasEl
   * @param {*} options
   * @param {Number} options.canvasWidth - canvas 宽度
   * @param {Number} options.canvasHeight - canvas 高度
   * @param {Array} options.initShapes - 初始化的形状列表
   */
  constructor (canvasEl, options) {
    // canvas 容器
    this.canvas = typeof canvasEl === 'string' ? document.querySelector(canvasEl) : canvasEl
    this.ctx = this.canvas.getContext('2d')

    // 合并参数
    this.options = Object.assign({}, DEFAULT_OPTIONS, options)
    this._drawingOptions = {}

    this.canvasWidth = this.options.canvasWidth
    this.canvasHeight = this.options.canvasHeight
    this.shapesConfig = this.options.shapesConfig
    this.initShapes = this.options.initShapes

    // 几何形状实例列表
    this.shapeInstanceList = this.initShapes.map(shapeData => {
      // 当shapeConfig不存在时，在 shape 中会使用默认的配置
      const shapeConfig = this.shapesConfig[shapeData.type]

      // 创建形状实例
      return new Shape({
        canvas: this.canvas,
        canvasWidth: this.canvasWidth,
        canvasHeight: this.canvasHeight,
        id: shapeData.id,
        name: shapeData.name,
        type: shapeData.type,
        points: shapeData.points,
        pointStyle: shapeConfig.pointStyle,
        lineStyle: shapeConfig.lineStyle
      })
    })

    this.drawingShape = null // 绘制中的形状实现
    this.closeable = false // 绘制的形状是否可以闭合
    this.mousePoint = null // 鼠标的位置
    this.isMouseover = false
    this.historyRecordStack = []
    this.revokeRecordStack = []
    this.destoryFns = []

    this.rafId = null

    // 初始化事件绑定
    this.events = []
    Object.keys(this.options.on).forEach(eventKey => {
      this.on(eventKey, this.options.on[eventKey])
    })

    // 添加事件绑定
    this.bindEvent()

    // 设置 drawingOptions 会自动触发绘制
    this.drawingOptions = {
      isDrawing: this.options.isDrawing || false,
      drawingShapeType: this.options.drawingShapeType || ''
    }

    this.trigger('init', { shapes: this.shapeInstanceList })
  }

  get drawingOptions () {
    return this._drawingOptions
  }

  set drawingOptions (val) {
    this._drawingOptions = val
    if (val.isDrawing) {
      const shapeConfig = this.shapesConfig[val.drawShapeType]
      this.drawingShape = new Shape({
        points: [],
        drawing: true,
        canvas: this.canvas,
        id: null,
        name: shapeConfig.name,
        type: shapeConfig.type,
        canvasWidth: this.canvasWidth,
        canvasHeight: this.canvasHeight,
        pointStyle: shapeConfig.pointStyle,
        lineStyle: shapeConfig.lineStyle
      })
    } else {
      this.drawingShape = null
    }

    this._triggerChange()
    this.draw()
  }

  _triggerChange () {
    this.trigger('change', {
      closeable: this.closeable,
      drawingShape: this.drawingShape,
      shapes: this.shapeInstanceList,
      drawingOptions: this.drawingOptions,
      drawingPoints: this.drawingShape ? this.drawingShape.points : [],
      revokeRecordStack: this.revokeRecordStack,
      historyRecordStack: this.historyRecordStack
    })
  }

  _renderDrawingShape () {
    // 绘制中的几何形状
    this.drawingShape.draw(false)

    if (this.isMouseover) {
      // 绘制与鼠标位置点组成区域的虚线
      const { ctx, mousePoint } = this
      const { points, _transformPoint } = this.drawingShape
      const transformPoint = _transformPoint.bind(this.drawingShape)
      const l = points.length

      ctx.save()
      ctx.beginPath()
      if (l >= 1) {
        ctx.moveTo(...transformPoint(points[l - 1], true))
        ctx.lineTo(...transformPoint(mousePoint, true))
      }
      if (l >= 2) {
        ctx.lineTo(...transformPoint(points[0], true))
      }
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.restore()
    }

    this.drawingShape.drawBoundaryPoint()
  }

  draw () {
    const { ctx, canvasWidth, canvasHeight } = this

    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // 绘制几何形状
    this.shapeInstanceList.forEach(shapeIns => {
      shapeIns.draw()
    })

    // 当状态为绘制中的时候，使用 rAF 绘制
    if (this.drawingOptions.isDrawing) {
      this.rafId = requestAnimationFrame(this.draw.bind(this))
      // 渲染绘制中的形状
      this._renderDrawingShape()
    } else {
      cancelAnimationFrame(this.rafId)
    }
  }

  bindEvent () {
    const { canvas, canvasWidth, canvasHeight } = this
    const onClick = (e) => {
      const point = {
        x: +(e.offsetX / canvasWidth).toFixed(6),
        y: +(e.offsetY / canvasHeight).toFixed(6)
      }

      if (this.drawingOptions.isDrawing) {
        // 绘制点的数量是否大于或等于3个
        if (this.drawingShape.points.length >= 3) {
          this.closeable = true
        } else {
          this.closeable = false
        }

        // 点击的区域是否是第一个点的位置
        if (this.closeable && this.drawingShape.checkIsFirstPoint(point)) {
          this.complete()
        } else {
          this.historyRecordStack.push([...this.drawingShape.points])
          this.drawingShape.points.push(point)
          this._triggerChange()
        }
      } else {
        const clickedShapes = []
        this.shapeInstanceList.forEach(ins => {
          const isInner = ins.checkInner(point)
          if (isInner) {
            clickedShapes.push(ins)
          }
        })
        this.trigger('clickShape', { clickedShapes, shapes: this.shapeInstanceList })
      }
    }
    const onMousemove = (e) => {
      const point = {
        x: +(e.offsetX / canvasWidth).toFixed(6),
        y: +(e.offsetY / canvasHeight).toFixed(6)
      }
      if (this.drawingOptions.isDrawing) {
        this.mousePoint = point
      }
    }
    const onMouseover = (e) => {
      this.isMouseover = true
      onMousemove(e)
    }
    const onMouseout = (e) => {
      this.isMouseover = false
      this.mousePoint = null
    }

    const onKeyupEnter = (e) => {
      if (!this.drawingOptions.isDrawing) {
        return
      }
      if (e.keyCode === 13) {
        this.complete()
      }
    }

    document.addEventListener('keyup', this.onEnter)

    const removeClickFn = this.addEvent(canvas, 'click', onClick)
    const removeMousemoveFn = this.addEvent(canvas, 'mousemove', onMousemove)
    const removeMouseoverFn = this.addEvent(canvas, 'mouseover', onMouseover)
    const removeMouseoutFn = this.addEvent(canvas, 'mouseout', onMouseout)
    const removeKeyupEnter = this.addEvent(document, 'keyup', onKeyupEnter)

    this.destoryFns.push(removeClickFn, removeMousemoveFn, removeMouseoverFn, removeMouseoutFn, removeKeyupEnter)
  }

  // 完成操作
  complete () {
    if (this.drawingShape.points.length < 3) {
      return
    }

    this.historyRecordStack = []
    this.revokeRecordStack = []
    this.mousePoint = null
    this.shapeInstanceList.push(this.drawingShape)

    this.trigger('complete', {
      points: this.drawingShape.points,
      id: this.drawingShape.id,
      name: this.drawingShape.name,
      type: this.drawingShape.type,
      shapes: this.shapeInstanceList
    })

    this.drawingOptions = { isDrawing: false }
  }

  // 撤销操作
  revoke () {
    if (this.historyRecordStack.length === 0) {
      return
    }

    this.revokeRecordStack.push([...this.drawingShape.points])
    this.drawingShape.points = this.historyRecordStack.pop()
  }

  // 恢复操作
  recover () {
    this.historyRecordStack.push([...this.drawingShape.points])
    this.drawingShape.points = this.revokeRecordStack.pop()
  }

  clear () {
    // if (!this.drawing) {
    //   return
    // }
    this.revokeRecordStack.push([...this.drawingShape.points])
    this.drawingShape.points = []
  }

  // 移除形状
  remove (shape) {
    this.shapeInstanceList = this.shapeInstanceList.filter(item => item !== shape)
    this.draw()
    this._triggerChange()
  }

  on (type, cb) {
    if (!this.events[type]) {
      this.events[type] = []
    }
    this.events[type].push(cb)
  }

  trigger (type, ...args) {
    (this.events[type] || []).forEach(fn => fn(...args))
  }

  addEvent (elem, type, handler) {
    elem.addEventListener(type, handler)
    return () => {
      elem.removeEventListner(type, handler)
    }
  }

  destory () {
    this.destoryFns.forEach(fn => fn())
  }
}
export default CanvasShape
