export class MarkPicture {
  constructor(options) {
    const DEFAULT_OPTIONS = {
      imageWidth: 1920,
      imageHeight: 1080,
      shapeStyle: {
          fillColor: 'rgba(161, 31, 44, 1)',
          strokeColor: 'rgba(161, 31, 44, 1)',
          lineWidth: 2
      }
    }

    this._options = Object.assign({}, DEFAULT_OPTIONS, options)

    debugger
    // 图片信息
    this.image = this._options.image
    this.imageWidth = this.image.width
    this.imageHeight = this.image.height

    // canvas 信息
    this.canvas = this._options.canvas
    this.canvas.width = this.imageWidth
    this.canvas.height = this.imageHeight
    this.ctx = this.canvas.getContext('2d')



    // 形状的信息
    this.shapes = this._options.shapes
    this.shapeStyle = this._options.shapeStyle

    this._drawImage()
    this._drawShapes()
  }

  _drawImage() {
    const  { ctx } = this
    if (this.image) {
      ctx.save()
      ctx.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight)
      ctx.restore()
    }
  }

  _drawShapes() {
    const {ctx} = this
    this.shapes.forEach(shape => {
      ctx.save()
      ctx.beginPath()
      shape.points.forEach((point, pointIndex) => {
        if (pointIndex === 0) {
          ctx.moveTo(point.x * this.imageWidth, point.y * this.imageHeight)
        } else {
          ctx.lineTo(point.x * this.imageWidth, point.y * this.imageHeight)
        }
      })

      const shapeStyle = shape.shapeStyle || this.shapeStyle
      ctx.fillStyle = shapeStyle.fillColor
      ctx.strokeStyle = shapeStyle.strokeStyle
      ctx.lineWidth = shapeStyle.lineWidth
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      ctx.restore()
    })
  }
  /**
    * 渲染报警区域
    */
  renderDeviceRegion() {
    const { deviceRegion } = this
    for (let i = 0, l = deviceRegion.length; i < l; i++) {
      this.drawLine({ points: deviceRegion[i].region, color: this.alarmColor })
    }
  }
  /**
   * 通过线绘制报警框
   */
  drawLine({ points, color, lineWidth = 4 }) {
    const { ctx } = this

    // 把坐标标的相对值转为绝对值
    points = points.map(point => ({ x: point.x * this.imageWidth, y: point.y * this.imageHeight }))

    ctx.save()
    ctx.beginPath()

    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1, l = points.length; i < l; i++) {
      const point = points[i]
      ctx.lineTo(point.x, point.y)
    }
    ctx.closePath()
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.stroke()
    ctx.restore()
  }
  /**
   * 渲染报警目标
   */
  renderAlarmedRegion() {
    const { alarmedRegion } = this
    for (let i = 0, l = alarmedRegion.length; i < l; i++) {
      this.drawAlarmedRegion(alarmedRegion[i])
    }
  }
  // 绘制报警的区域
  drawAlarmedRegion(points) {
    const { ctx, targetColor } = this

    points = points.map(point => ({ x: point.x * this.imageWidth, y: point.y * this.imageHeight }))

    const leftTopPoint = points[0]
    const leftBottomPoint = points[3]
    const rightTopPoint = points[1]
    const rightBottomPoint = points[2]

    const centerPoint = {
      x: leftTopPoint.x + (rightTopPoint.x - leftTopPoint.x) / 2,
      y: leftTopPoint.y + (leftBottomPoint.y - leftTopPoint.y) / 2
    }

    const targetWidth = rightTopPoint.x - leftTopPoint.x
    const targetHeight = leftBottomPoint.y - leftTopPoint.y

    // 绘制4个角标
    if (Math.min(targetWidth, targetHeight) > 60) {
      const cornerSize = 10
      const cornerDist = 6
      ctx.save()
      ctx.beginPath()

      // 左上角
      {
        const corner = { x: leftTopPoint.x - cornerDist, y: leftTopPoint.y - cornerDist }
        ctx.moveTo(corner.x, corner.y + cornerSize)
        ctx.lineTo(corner.x, corner.y)
        ctx.lineTo(corner.x + cornerSize, corner.y)
      }

      // 右上角
      {
        const corner = { x: rightTopPoint.x + cornerDist, y: rightTopPoint.y - cornerDist }
        ctx.moveTo(corner.x - cornerSize, corner.y)
        ctx.lineTo(corner.x, corner.y)
        ctx.lineTo(corner.x, corner.y + cornerSize)
      }


      // 右下角
      {
        const corner = { x: rightBottomPoint.x + cornerDist, y: rightBottomPoint.y + cornerDist }
        ctx.moveTo(corner.x, corner.y - cornerSize)
        ctx.lineTo(corner.x, corner.y)
        ctx.lineTo(corner.x - cornerSize, corner.y)
      }

      // 左下角
      {
        const corner = { x: leftBottomPoint.x - cornerDist, y: leftBottomPoint.y + cornerDist }
        ctx.moveTo(corner.x, corner.y - cornerSize)
        ctx.lineTo(corner.x, corner.y)
        ctx.lineTo(corner.x + cornerSize, corner.y)
      }

      ctx.strokeStyle = targetColor
      ctx.stroke()
      ctx.restore()
    }

    if (Math.min(points[1].x - points[0].x, points[3].y - points[0].y) > 60) {
      ctx.save()
      // this.drawLine({ points, color: targetColor })
      const shadowCanvas = this.drawShadow({
        width: points[1].x - points[0].x,
        height: points[3].y - points[0].y,
        color: targetColor
      })
      ctx.drawImage(shadowCanvas, points[0].x, points[0].y)
      ctx.restore()
    }


    // 绘制中间的icon
    ctx.save()

    ctx.restore()
  }
  // 绘制带内阴影的框
  drawShadow({ width, height, color }) {
    const lineWidth = 30
    const shadowBlur = 30

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.globalCompositeOperation = 'source-out'
    ctx.save()

    ctx.shadowBlur = shadowBlur
    ctx.lineWidth = lineWidth
    ctx.shadowColor = color
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)

    ctx.restore
    return canvas
  }
  // 清空画布
  clear() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image  = new Image()
    image.src = src
    image.onload = function (e) {
      resolve(e)
    }
    image.onerror = function (err) {
      reject(err)
    }
  })
}

export function canvas2Base64(canvas, type = 'png') {
  const typeObj = {
    webp: 'image/webp',
    jpeg: 'image/jpeg',
    png: 'image/png'
  }
  const targetType = typeObj[type]
  if (targetType) {
    const base64 = canvas.toDataURL(targetType)
    return base64
  }
  return false
}

export function canvas2Blob(canvas, type = 'png') {
  return new Promise(resolve => {
    canvas.toBlob(function(blob) {
      const url = URL.createObjectURL(blob)
      resolve(url)
    })
  })
}