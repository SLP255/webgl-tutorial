import { initBuffers } from "./init-buffers"
import { drawScene } from "./draw-scene"
import { getProgramInfo } from "./init-shader"
import { initWebGLRenderingContext } from "./init-context"

const renderProcess = () => {
  const gl = initWebGLRenderingContext()
  if (!gl) return

  const programInfo = getProgramInfo(gl)
  if (!programInfo) return

  // ここでは、これから描画するすべてのオブジェクトを
  // 構築するルーチンを呼び出しています。
  const buffers = initBuffers(gl)
  if (!buffers) return

  // シーンを描画
  drawScene(gl, programInfo, buffers)
}


export { renderProcess }
