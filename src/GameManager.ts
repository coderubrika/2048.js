import {Field} from './Field'
import {Cell} from './Cell'
import { AI } from './AI'
import { MainScreen } from './MainScreen'
import { RxProperty } from './utils'

export class GameManager {
  private readonly mainScreen: MainScreen
  private readonly resolution: RxProperty<number>
  private readonly scope: RxProperty<number>
  private readonly fieldView: HTMLElement
  private readonly field: Field
  private readonly ai: AI

  constructor(mainScreen: MainScreen) {
    this.mainScreen = mainScreen
    this.fieldView = mainScreen.FieldView
    this.resolution = mainScreen.Resolution
    this.scope = mainScreen.Scope
    this.field = new Field(mainScreen)
    this.ai = new AI(this.field, mainScreen)
  }

  public initFieldView() {
    for(let i = 1; i < this.resolution.Value; i++) {
      const lineH = document.createElement('div')
      lineH.classList.add('line-vertical')
      lineH.style.left = `${i/this.resolution.Value*100}%`
  
      const lineW = document.createElement('div')
      lineW.classList.add('line-horizontal')
      lineW.style.top = `${i/this.resolution.Value*100}%`
  
      this.fieldView.appendChild(lineH)
      this.fieldView.appendChild(lineW)
    }
  }

  public initCells() {
    for(let i = 0; i < this.resolution.Value; i++) {
      for(let j = 0; j < this.resolution.Value; j++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.style.width = `${100 / this.resolution.Value}%`
        cell.style.height = cell.style.width
  
        cell.style.top = '0'
        cell.style.left = '0'
  
        this.fieldView.appendChild(cell)
        this.field.addToPool(new Cell(this.mainScreen, cell))
      }  
    }
  }

  public start() {
    this.scope.Value = 0
    this.field.resetCells()
    this.field.useEmptyCell()
  }

  public startAI(poewer, stepTime) {
    this.ai.startAI(poewer, stepTime)
  }

  public stopAI() {
    this.ai.stopAI()
  }

  public subscribeInputHandler() {
    window.addEventListener('keydown', this.inputHandler, false)
  }

  public unsubscribeInputHandler() {
    window.removeEventListener('keydown', this.inputHandler, false)
  }

  private inputHandler(event) {
    let isCorrectInput = false
      if (event.code == 'KeyA') {
        isCorrectInput = true
        this.field.left()
      }
      if (event.code == 'KeyD') {
        isCorrectInput = true
        this.field.right()
      }
      if (event.code == 'KeyW') {
        isCorrectInput = true
        this.field.up()
      }
      if (event.code == 'KeyS') {
        isCorrectInput = true
        this.field.down()
      }
  
      if (isCorrectInput) {
        const answer = this.field.useEmptyCell()
        if (answer == null) {
          console.log('Game Over');
        }
      }
  }
}