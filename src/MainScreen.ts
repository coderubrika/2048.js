import { fromEvent, Observable, Subject } from "rxjs"
import { query, RxProperty } from "./utils"

export class MainScreen {
  private readonly screen: HTMLElement
  private readonly playButton: HTMLButtonElement
  private readonly resetButton: HTMLButtonElement
  private readonly scope: HTMLElement
  private readonly resolutionInput: HTMLInputElement
  private readonly enableAIButton: HTMLButtonElement
  private readonly disableAIButton: HTMLButtonElement
  private readonly aiPowerInput: HTMLInputElement
  private readonly aiStepRateInput: HTMLInputElement
  private readonly saveButton: HTMLButtonElement
  private readonly loadButton: HTMLButtonElement
  private readonly field: HTMLElement
  private readonly lines: HTMLElement[] = []

  private isEnabledAI = false

  public readonly OnPlay: Observable<MouseEvent>
  public readonly OnReset: Observable<MouseEvent>
  public readonly OnEnableAI = new Subject<boolean>()
  public readonly Scope = new RxProperty<number>(0)
  public readonly Resolution = new RxProperty<number>(4)
  public readonly AIPower = new RxProperty<number>(1)
  public readonly AIStepRate = new RxProperty<number>(500)
  public readonly OnSave = new Subject()
  public readonly OnLoad = new Subject()
  public readonly CellsViews: HTMLElement[] = []

  public get FieldView() {
    return this.field
  }

  constructor() {
    this.screen = query('.screen.main')
    this.playButton = query('button.play', this.screen)
    this.resetButton = query('button.reset', this.screen)
    this.scope = query('p.scope', this.screen)

    this.resolutionInput = query('input.resolution', this.screen)

    this.enableAIButton = query('button.enable-ai', this.screen)
    this.disableAIButton = query('button.disable-ai', this.screen)
    this.aiPowerInput = query('input.ai-power', this.screen)
    this.aiStepRateInput = query('input.ai-step-rate', this.screen)

    this.saveButton = query('button.save', this.screen)
    this.loadButton = query('button.load', this.screen)

    this.field = query('.field', this.screen)

    this.OnPlay = fromEvent<MouseEvent>(this.playButton, 'click')
    this.OnReset = fromEvent<MouseEvent>(this.resetButton, 'click')

    fromEvent(this.enableAIButton, 'click').subscribe(() => {
      if (this.isEnabledAI)
        return
      this.isEnabledAI = true
      this.OnEnableAI.next(true)
    })

    fromEvent(this.disableAIButton, 'click').subscribe(() => {
      if (!this.isEnabledAI)
        return
      this.isEnabledAI = false
      this.OnEnableAI.next(false)
    })

    fromEvent(this.saveButton, 'click').subscribe(() => {
      this.OnSave.next(undefined)
    })

    fromEvent(this.loadButton, 'click').subscribe(() => {
      this.OnLoad.next(undefined)
    })

    this.Scope.subscribe(scope => {
      this.scope.textContent = scope.toString()
    })

    fromEvent<KeyboardEvent>(this.resolutionInput, 'keyup').subscribe(event => {
      const target = event.target as HTMLInputElement
      const candidate = Number(target.value)
      
      if (Number.isNaN(candidate) || !Number.isInteger(candidate) || candidate < 3) {
        target.value = this.Resolution.Value.toString()
      }
      else if (this.Resolution.Value != candidate){
        this.Resolution.Value = candidate
      }
    })

    fromEvent<KeyboardEvent>(this.aiPowerInput, 'keyup').subscribe(event => {
      const target = event.target as HTMLInputElement
      const candidate = Number(target.value)
      
      if (Number.isNaN(candidate) || !Number.isInteger(candidate) || candidate < 3) {
        target.value = this.AIPower.Value.toString()
      }
      else {
        this.AIPower.Value = candidate
      }
    })

    fromEvent<KeyboardEvent>(this.aiStepRateInput, 'keyup').subscribe(event => {
      const target = event.target as HTMLInputElement
      const candidate = Number(target.value)
      
      if (Number.isNaN(candidate) || !Number.isInteger(candidate) || candidate < 3) {
        target.value = this.AIStepRate.Value.toString()
      }
      else {
        this.AIStepRate.Value = candidate
      }
    })
  }

  public redraw() {
    this.initLines()
    this.initCellsViews()
  }

  private initCellsViews() {
    this.CellsViews.forEach(view => view.remove())
    this.CellsViews.length = 0

    for(let i = 0; i < this.Resolution.Value * this.Resolution.Value; i++) {
      const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.style.width = `${100 / this.Resolution.Value}%`
        cell.style.height = cell.style.width
  
        cell.style.top = '0'
        cell.style.left = '0'
  
        this.field.appendChild(cell)
        this.CellsViews.push(cell)
    }
  }

  private initLines() {
    this.lines.forEach(view => view.remove())
    this.lines.length = 0

    for(let i = 1; i < this.Resolution.Value; i++) {
      const lineH = document.createElement('div')
      lineH.classList.add('line-vertical')
      lineH.style.left = `${i/this.Resolution.Value*100}%`
  
      const lineW = document.createElement('div')
      lineW.classList.add('line-horizontal')
      lineW.style.top = `${i/this.Resolution.Value*100}%`
  
      this.field.appendChild(lineH)
      this.field.appendChild(lineW)

      this.lines.push(lineH, lineW)
    }
  }

}