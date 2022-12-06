import {Field} from './Field'
import {Cell} from './Cell'
import { AI } from './AI'

export class GameManager {
  constructor(resolution) {
    this.resolution = resolution
    this.fieldModel = new Field(resolution)
    this.field = document.querySelector('.field')
    this.scope = document.querySelector('.scope')
    this.ai = new AI(this.fieldModel, this.scope)
  }

  initFieldView() {
    for(let i = 1; i < this.resolution; i++) {
      const lineH = document.createElement('div')
      lineH.classList.add('line-vertical')
      lineH.style.left = `${i/this.resolution*100}%`
  
      const lineW = document.createElement('div')
      lineW.classList.add('line-horizontal')
      lineW.style.top = `${i/this.resolution*100}%`
  
      this.field.appendChild(lineH)
      this.field.appendChild(lineW)
    }
  }

  initCells() {
    for(let i = 0; i < this.resolution; i++) {
      for(let j = 0; j < this.resolution; j++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.style.width = `${100 / this.resolution}%`
        cell.style.height = cell.style.width
  
        cell.style.top = 0
        cell.style.left = 0
  
        this.field.appendChild(cell)
        this.fieldModel.addToEmpty(new Cell(cell))
      }  
    }
  }

  subscribeInputHandler() {
    window.addEventListener('keydown', this.inputHandler, false)
  }

  unsubscribeInputHandler() {
    window.removeEventListener('keydown', this.inputHandler, false)
  }

  inputHandler(event) {
    let isCorrectInput = false
      if (event.code == 'KeyA') {
        isCorrectInput = true
        this.fieldModel.left()
      }
      if (event.code == 'KeyD') {
        isCorrectInput = true
        this.fieldModel.right()
      }
      if (event.code == 'KeyW') {
        isCorrectInput = true
        this.fieldModel.up()
      }
      if (event.code == 'KeyS') {
        isCorrectInput = true
        this.fieldModel.down()
      }
  
      if (isCorrectInput) {
        const answer = this.fieldModel.useEmptyCell()
        if (answer == null) {
          console.log('Game Over');
        }
      }

      this.scope.textContent = this.fieldModel.scope
  }

  startAI(poewer, stepTime) {
    this.ai.startAI(poewer, stepTime)
  }

  stopAI() {
    this.ai.stopAI()
  }
}