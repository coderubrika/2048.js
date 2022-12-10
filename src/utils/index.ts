export { RxProperty } from "./rxProperty"

export function query<TElement extends Element>(request: string, context: Node = document) {
  const answer = document.querySelector<TElement>(request)
  if (answer == null) {
    console.warn(`Not exist elements by selector${request} in ${context.nodeName}`)
  }
  return answer as TElement
}