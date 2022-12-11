import { Cell } from "./Cell"
import { MainScreen } from "./MainScreen"
import { RxProperty } from "./utils"

export class Field {
  private readonly scope: RxProperty<number>
  private readonly resolution: RxProperty<number>
  private readonly fieldTable: Array<Array<Cell|null>> = []
  private readonly emptyPool: Cell[] = []

  constructor(mainScreen: MainScreen) {
    this.scope = mainScreen.Scope
    this.resolution = mainScreen.Resolution
    this.emptyPool = []

    for (let i = 0; i < this.resolution.Value; i++) {
      const subArr: Cell|null[] = []

      for (let j = 0; j < this.resolution.Value; j++) {
        subArr.push(null)
      }

      this.fieldTable.push(subArr)
    }
  }

  public resetCells() {
    for (let i = 0; i < this.resolution.Value; i++) {
      for (let j = 0; j < this.resolution.Value; j++) {
        const cell = this.fieldTable[i][j]
        if (cell == null)
          continue
        this.addToPool(cell)
      }
    }
  }

  public useEmptyCell() {
    for (let i = 0; i < this.resolution.Value; i++) {
      for (let j = 0; j < this.resolution.Value; j++) {
        if (this.fieldTable[i][j] == null) {
          const newElem = this.emptyPool.pop() as Cell
          this.fieldTable[i][j] = newElem
          newElem.PosX = j
          newElem.PosY = i
          newElem.sync()
          return newElem
        }
      }
    }
    return null
  }

  public up() {
    this.resetMark()

    for (let i = 1; i < this.resolution.Value; i++) {
      for (let j = 0; j < this.resolution.Value; j++) {
        if (!this.CheckAvaibleCell(this.fieldTable[i][j])) {
          continue
        }
        const elem = this.fieldTable[i][j] as Cell

        for (let k = i - 1; k > -1; k--) {
          const otherElem = this.fieldTable[k][j]
          if (otherElem != null && !otherElem.IsMark) {
            if (otherElem.Value == elem.Value) {
              this.boost(elem, otherElem)
              break
            }
          }
          else if (otherElem == null) {
            this.moveToNewPosition(elem as Cell, j, k)
            continue
          }
        }
      }
    }
  }

  public down() {
    this.resetMark()

    for (let i = this.resolution.Value - 2; i >= 0; i--) {
      for (let j = 0; j < this.resolution.Value; j++) {
        if (!this.CheckAvaibleCell(this.fieldTable[i][j])) {
          continue
        }
        const elem = this.fieldTable[i][j] as Cell

        for (let k = i + 1; k < this.resolution.Value; k++) {
          const otherElem = this.fieldTable[k][j]
          if (otherElem != null && !otherElem.IsMark) {
            if (otherElem.Value == elem.Value) {
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

  public left() {
    this.resetMark()

    for (let i = 0; i < this.resolution.Value; i++) {
      for (let j = 1; j < this.resolution.Value; j++) {
        if (!this.CheckAvaibleCell(this.fieldTable[i][j])) {
          continue
        }
        const elem = this.fieldTable[i][j] as Cell

        for (let k = j - 1; k > -1; k--) {
          const otherElem = this.fieldTable[i][k]
          if (otherElem != null && !otherElem.IsMark) {
            if (otherElem.Value == elem.Value) {
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

  public right() {
    this.resetMark()

    for (let i = 0; i < this.resolution.Value; i++) {
      for (let j = this.resolution.Value - 2; j > -1; j--) {
        if (!this.CheckAvaibleCell(this.fieldTable[i][j])) {
          continue
        }
        const elem = this.fieldTable[i][j] as Cell

        for (let k = j + 1; k < this.resolution.Value; k++) {
          const otherElem = this.fieldTable[i][k]
          if (otherElem != null && !otherElem.IsMark) {
            if (otherElem.Value == elem.Value) {
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

  public addToPool(elem: Cell) {
    elem.reset()
    this.emptyPool.push(elem)
  }

  private resetMark() {
    for (let i = 0; i < this.resolution.Value; i++) {
      for (let j = 0; j < this.resolution.Value; j++) {
        if (this.fieldTable[i][j]) {
          (this.fieldTable[i][j] as Cell).IsMark = false
        }
      }
    }
  }

  private moveToNewPosition(elem: Cell, x: number, y: number) {
    this.fieldTable[elem.PosY][elem.PosX] = null
    elem.PosX = x
    elem.PosY = y
    this.fieldTable[elem.PosY][elem.PosX] = elem
    elem.sync()
  }

  private boost(elem: Cell, otherElem: Cell) {
    this.fieldTable[elem.PosY][elem.PosX] = null
    this.fieldTable[otherElem.PosY][otherElem.PosX] = elem
    elem.PosX = otherElem.PosX
    elem.PosY = otherElem.PosY
    elem.boostValue()
    elem.IsMark = true
    elem.sync()
    this.scope.Value += elem.Value

    this.addToPool(otherElem)
  }

  private CheckAvaibleCell(cell: Cell|null) {
    if (cell == null) return false
    if (cell.IsMark) return false
    return true
  }
}