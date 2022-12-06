export class Field {
  constructor(resolution) {
    this.scope = 0
    this.field = []
    this.emptyPool = []
    this.resolution = resolution

    for (let i = 0; i < resolution; i++) {
      const subArr = []

      for (let j = 0; j < resolution; j++) {
        subArr.push(null)
      }

      this.field.push(subArr)
    }
  }

  addToEmpty(elem) {
    elem.reset()
    this.emptyPool.push(elem)
  }

  useEmptyCell() {
    for (let i = 0; i < this.resolution; i++) {
      for (let j = 0; j < this.resolution; j++) {
        if (this.field[i][j] == null) {
          const newElem = this.emptyPool.pop()
          this.field[i][j] = newElem
          newElem.posX = j
          newElem.posY = i
          newElem.sync()
          return newElem
        }
      }
    }
    return null
  }

  up() {
    this.resetMark()

    for (let i = 1; i < this.resolution; i++) {
      for (let j = 0; j < this.resolution; j++) {
        if (this.field[i][j] == null || this.field[i][j].isMark) {
          continue
        }
        const elem = this.field[i][j]

        for (let k = i - 1; k > -1; k--) {
          const otherElem = this.field[k][j]
          if (otherElem != null && !otherElem.isMark) {
            if (otherElem.value == elem.value) {
              this.boost(elem, otherElem)
              break
            }
          }
          else if (otherElem == null) {
            this.moveToNewPosition(elem, j, k)
            continue
          }
        }
      }
    }
  }

  down() {
    this.resetMark()

    for (let i = this.resolution - 2; i >= 0; i--) {
      for (let j = 0; j < this.resolution; j++) {
        if (this.field[i][j] == null || this.field[i][j].isMark) {
          continue
        }
        const elem = this.field[i][j]

        for (let k = i + 1; k < this.resolution; k++) {
          const otherElem = this.field[k][j]
          if (otherElem != null && !otherElem.isMark) {
            if (otherElem.value == elem.value) {
              this.boost(elem, otherElem)
              break
            }
          }
          else if (otherElem == null) {
            this.moveToNewPosition(elem, j, k)
            continue
          }
        }
      }
    }
  }

  left() {
    this.resetMark()

    for (let i = 0; i < this.resolution; i++) {
      for (let j = 1; j < this.resolution; j++) {
        if (this.field[i][j] == null || this.field[i][j].isMark) {
          continue
        }
        const elem = this.field[i][j]

        for (let k = j - 1; k > -1; k--) {
          const otherElem = this.field[i][k]
          if (otherElem != null && !otherElem.isMark) {
            if (otherElem.value == elem.value) {
              this.boost(elem, otherElem)
              break
            }
          }
          else if (otherElem == null) {
            this.moveToNewPosition(elem, k, i)
            continue
          }
        }
      }
    }
  }

  right() {
    this.resetMark()

    for (let i = 0; i < this.resolution; i++) {
      for (let j = this.resolution - 2; j > -1; j--) {
        if (this.field[i][j] == null || this.field[i][j].isMark) {
          continue
        }
        const elem = this.field[i][j]

        for (let k = j + 1; k < this.resolution; k++) {
          const otherElem = this.field[i][k]
          if (otherElem != null && !otherElem.isMark) {
            if (otherElem.value == elem.value) {
              this.boost(elem, otherElem)
              break
            }
          }
          else if (otherElem == null) {
            this.moveToNewPosition(elem, k, i)
            continue
          }
        }
      }
    }
  }

  resetMark() {
    for (let i = 0; i < this.resolution; i++) {
      for (let j = 0; j < this.resolution; j++) {
        if (this.field[i][j] != null) {
          this.field[i][j].isMark = false
        }
      }
    }
  }

  moveToNewPosition(elem, x, y) {
    this.field[elem.posY][elem.posX] = null
    elem.posX = x
    elem.posY = y
    this.field[elem.posY][elem.posX] = elem
    elem.sync()
  }

  boost(elem, otherElem) {
    this.field[elem.posY][elem.posX] = null
    this.field[otherElem.posY][otherElem.posX] = elem
    elem.posX = otherElem.posX
    elem.posY = otherElem.posY
    elem.boostValue()
    elem.isMark = true
    elem.sync()
    this.scope += elem.value * 2

    this.addToEmpty(otherElem)
  }
}