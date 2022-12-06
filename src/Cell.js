export class Cell {
  constructor(elem) {
    this.elem = elem
    this.posX = -2
    this.posY = -2
    this.value = 2
    this.isMark = false
    this.sync()
  }

  boostValue() {
    this.value *= 2
  }

  reset() {
    this.posX = -2
    this.posY = -2
    this.value = 2
    this.isMark = false
    this.sync()
  }

  sync(resolution) {
    this.elem.style.left = `${this.posX/resolution * 100}%`
    this.elem.style.top = `${this.posY/resolution * 100}%`
    this.elem.style.backgroundColor = this.getColor(this.value)
  }

  getColor(value) {
    if (value == 2) return '#fff3cc'
    if (value == 4) return '#f7ab05'
    if (value == 8) return '#d3f705'
    if (value == 16) return '#05f7e7'
    if (value == 32) return '#4e05f7'
    if (value == 64) return '#f75205'
    if (value == 128) return '#19f705'
    if (value == 256) return '#fad76e'
    if (value == 512) return '#11ffee'
    if (value == 1024) return '#33dd55'
    if (value == 2028) return '#c3fccf'
    if (value == 4069) return '#436fdd'
    if (value == 4069 * 2) return '#ffcc33'
    if (value == 4069 * 4) return '#ccccaa'
    if (value == 4069 * 8) return '#44ffcc'
    if (value == 4069 * 16) return '#67ff34'
    if (value == 4069 * 32) return '#bccb44'
    return '#000'
  }
}