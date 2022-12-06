import * as math from 'math.js'

window.onload = start

const resolution = 8

class Field {
  constructor() {
    this.scope = 0
    this.field = []
    this.emptyPool = []

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
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
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

    for (let i = 1; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        if (this.field[i][j] == null || this.field[i][j].isMark) {
          continue
        }
        const elem = this.field[i][j]

        for (let k = i-1; k > -1; k--) {
          const otherElem = this.field[k][j]
          if (otherElem != null && !otherElem.isMark) {
            if (otherElem.value == elem.value) {
              this.boost(elem, otherElem)
              break
            }
          }
          else if (otherElem == null){
            this.moveToNewPosition(elem, j, k)
            continue
          }
        }
      }
    }
  }

  down() {
    this.resetMark()

    for (let i = resolution - 2; i >= 0; i--) {
      for (let j = 0; j < resolution; j++) {
        if (this.field[i][j] == null || this.field[i][j].isMark) {
          continue
        }
        const elem = this.field[i][j]

        for (let k = i+1; k < resolution; k++) {
          const otherElem = this.field[k][j]
          if (otherElem != null && !otherElem.isMark) {
            if (otherElem.value == elem.value) {
              this.boost(elem, otherElem)
              break
            }
          }
          else if (otherElem == null){
            this.moveToNewPosition(elem, j, k)
            continue
          }
        }
      }
    }
  }

  left() {
    this.resetMark()

    for (let i = 0; i < resolution; i++) {
      for (let j = 1; j < resolution; j++) {
        if (this.field[i][j] == null || this.field[i][j].isMark) {
          continue
        }
        const elem = this.field[i][j]

        for (let k = j-1; k > -1; k--) {
          const otherElem = this.field[i][k]
          if (otherElem != null && !otherElem.isMark) {
            if (otherElem.value == elem.value) {
              this.boost(elem, otherElem)
              break
            }
          }
          else if (otherElem == null){
            this.moveToNewPosition(elem, k, i)
            continue
          }
        }
      }
    }
  }

  right() {
    this.resetMark()

    for (let i = 0; i < resolution; i++) {
      for (let j = resolution - 2; j > -1; j--) {
        if (this.field[i][j] == null || this.field[i][j].isMark) {
          continue
        }
        const elem = this.field[i][j]

        for (let k = j+1; k < resolution; k++) {
          const otherElem = this.field[i][k]
          if (otherElem != null && !otherElem.isMark) {
            if (otherElem.value == elem.value) {
              this.boost(elem, otherElem)
              break
            }
          }
          else if (otherElem == null){
            this.moveToNewPosition(elem, k, i)
            continue
          }
        }
      }
    }
  }

  resetMark() {
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
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

class Vector2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

const fieldModel = new Field()

function start() {
  const field = document.querySelector('.field')
  const scope = document.querySelector('.scope')

  for(let i = 1; i < resolution; i++) {
    const lineH = document.createElement('div')
    lineH.classList.add('line-vertical')
    lineH.style.left = `${i/resolution*100}%`

    const lineW = document.createElement('div')
    lineW.classList.add('line-horizontal')
    lineW.style.top = `${i/resolution*100}%`

    field.appendChild(lineH)
    field.appendChild(lineW)
  }

  for(let i = 0; i < resolution; i++) {
    for(let j = 0; j < resolution; j++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      cell.style.width = `${100 / resolution}%`
      cell.style.height = cell.style.width

      cell.style.top = 0
      cell.style.left = 0

      field.appendChild(cell)
      fieldModel.addToEmpty(new Cell(cell))
    }  
  }

  window.addEventListener('keydown', event => {
    let isCorrectInput = false
    if (event.code == 'KeyA') {
      isCorrectInput = true
      fieldModel.left()
    }
    if (event.code == 'KeyD') {
      isCorrectInput = true
      fieldModel.right()
    }
    if (event.code == 'KeyW') {
      isCorrectInput = true
      fieldModel.up()
    }
    if (event.code == 'KeyS') {
      isCorrectInput = true
      fieldModel.down()
    }

    if (isCorrectInput) {
      const answer = fieldModel.useEmptyCell()
      if (answer == null) {
        console.log('Game Over');
      }
    }
    scope.textContent = fieldModel.scope
  })

  fieldModel.useEmptyCell()
  let move = 0
  
  function ai() {
    setInterval(()=> {
      if (move == 0) {
        fieldModel.down()
        move = 1
        const answer = fieldModel.useEmptyCell()
        if (answer == null) {
          console.log('Game Over');
        }
        scope.textContent = fieldModel.scope
        return
      }
      if (move == 1) {
        fieldModel.right()
        move = 2
        const answer = fieldModel.useEmptyCell()
        if (answer == null) {
          console.log('Game Over');
        }
        scope.textContent = fieldModel.scope
        return
      }
      if (move == 2) {
        fieldModel.up()
        move = 3
        const answer = fieldModel.useEmptyCell()
        if (answer == null) {
          console.log('Game Over');
        }
        scope.textContent = fieldModel.scope
        return
      }
      if (move == 3) {
        fieldModel.left()
        move = 0
        const answer = fieldModel.useEmptyCell()
        if (answer == null) {
          console.log('Game Over');
        }
        scope.textContent = fieldModel.scope
        return
      }
  
    }, 0);
  }

  for(let i = 0; i < 100000; i++) {
    ai()
  }

}

class Cell {
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

  sync() {
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