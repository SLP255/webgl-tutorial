import { renderProcess } from './render'

const main = () => {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <h2>awesome game</h2>
    <canvas id="view" width="384" height="384" />
  `

  renderProcess()
}
 
window.onload = main
