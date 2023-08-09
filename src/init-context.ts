const initWebGLRenderingContext = (): WebGLRenderingContext | null => {
  const canvas = document.querySelector<HTMLCanvasElement>("#view")
  const gl = canvas?.getContext("webgl")
  if (!gl) return null

  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  return gl
}

export { initWebGLRenderingContext }
