import { Cell } from "./Cell"
import { MainScreen } from "./MainScreen"
import { RxProperty } from "./utils"

export class FieldService {
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
          const newcell = this.emptyPool.pop() as Cell
          this.fieldTable[i][j] = newcell
          newcell.PosX = j
          newcell.PosY = i
          newcell.sync()
          return newcell
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
        const cell = this.fieldTable[i][j] as Cell

        for (let k = i - 1; k > -1; k--) {
          const otherCell = this.fieldTable[k][j]
          if (otherCell != null && !otherCell.IsMark) {
            if (otherCell.Value == cell.Value) {
              this.boost(cell, otherCell)
              break
            }
          }
          else if (otherCell == null) {
            this.moveToNewPosition(cell as Cell, j, k)
            continue
          }
        }
      }
    }

    this.useEmptyCell()
  }

  public down() {
    this.resetMark()

    for (let i = this.resolution.Value - 2; i >= 0; i--) {
      for (let j = 0; j < this.resolution.Value; j++) {
        if (!this.CheckAvaibleCell(this.fieldTable[i][j])) {
          continue
        }
        const cell = this.fieldTable[i][j] as Cell

        for (let k = i + 1; k < this.resolution.Value; k++) {
          const otherCell = this.fieldTable[k][j]
          if (otherCell != null && !otherCell.IsMark) {
            if (otherCell.Value == cell.Value) {
              this.boost(cell, otherCell)
              break
            }
          }
          else if (otherCell == null) {
            this.moveToNewPosition(cell, j, k)
            continue
          }
        }
      }
    }

    this.useEmptyCell()
  }

  public left() {
    this.resetMark()

    for (let i = 0; i < this.resolution.Value; i++) {
      for (let j = 1; j < this.resolution.Value; j++) {
        if (!this.CheckAvaibleCell(this.fieldTable[i][j])) {
          continue
        }
        const cell = this.fieldTable[i][j] as Cell

        for (let k = j - 1; k > -1; k--) {
          const otherCell = this.fieldTable[i][k]
          if (otherCell != null && !otherCell.IsMark) {
            if (otherCell.Value == cell.Value) {
              this.boost(cell, otherCell)
              break
            }
          }
          else if (otherCell == null) {
            this.moveToNewPosition(cell, k, i)
            continue
          }
        }
      }
    }

    this.useEmptyCell()
  }

  public right() {
    this.resetMark()

    for (let i = 0; i < this.resolution.Value; i++) {
      for (let j = this.resolution.Value - 2; j > -1; j--) {
        if (!this.CheckAvaibleCell(this.fieldTable[i][j])) {
          continue
        }
        const cell = this.fieldTable[i][j] as Cell

        for (let k = j + 1; k < this.resolution.Value; k++) {
          const otherCell = this.fieldTable[i][k]
          if (otherCell != null && !otherCell.IsMark) {
            if (otherCell.Value == cell.Value) {
              this.boost(cell, otherCell)
              break
            }
          }
          else if (otherCell == null) {
            this.moveToNewPosition(cell, k, i)
            continue
          }
        }
      }
    }

    this.useEmptyCell()
  }

  public addToPool(cell: Cell) {
    cell.reset()
    this.emptyPool.push(cell)
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

  private moveToNewPosition(cell: Cell, x: number, y: number) {
    this.fieldTable[cell.PosY][cell.PosX] = null
    cell.PosX = x
    cell.PosY = y
    this.fieldTable[cell.PosY][cell.PosX] = cell
    cell.sync()
  }

  private boost(cell: Cell, otherCell: Cell) {
    this.fieldTable[cell.PosY][cell.PosX] = null
    this.fieldTable[otherCell.PosY][otherCell.PosX] = cell
    cell.PosX = otherCell.PosX
    cell.PosY = otherCell.PosY
    cell.boostValue()
    cell.IsMark = true
    cell.sync()
    this.scope.Value += cell.Value

    this.addToPool(otherCell)
  }

  private CheckAvaibleCell(cell: Cell|null) {
    if (cell == null) return false
    if (cell.IsMark) return false
    return true
  }
}