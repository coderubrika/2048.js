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
  private readonly saveProgressButton: HTMLButtonElement
  private readonly loadProgressButton: HTMLButtonElement
  private readonly field: HTMLElement
  
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

  constructor(gameManager) {
    this.screen = query('.screen.main')
    this.playButton = query('button.play', this.screen)
    this.resetButton = query('button.reset', this.screen)
    this.scope = query('p.scope', this.screen)

    this.resolutionInput = query('input.resolution', this.screen)

    this.enableAIButton = query('button.enable-ai', this.screen)
    this.disableAIButton = query('button.disable-ai', this.screen)
    this.aiPowerInput = query('input.ai-power', this.screen)
    this.aiStepRateInput = query('input.ai-speed', this.screen)

    this.saveProgressButton = query('button.save-progress', this.screen)
    this.loadProgressButton = query('button.load-progress', this.screen)

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

    fromEvent(this.saveProgressButton, 'click').subscribe(() => {
      this.OnSave.next(undefined)
    })

    fromEvent(this.loadProgressButton, 'click').subscribe(() => {
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
      else {
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
}