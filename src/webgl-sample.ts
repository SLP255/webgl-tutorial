import { initBuffers } from "./init-buffers"
import { drawScene } from "./draw-scene"

// 頂点シェーダーのプログラム
const vsSource = `
  attribute vec4 aVertexPosition;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }
`

const fsSource = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`

const renderProcess = () => {
  const gl = init()
  if (!gl) {
    console.error("[error] gl init failed")
    return
  }

  const shaderProgram = initShaderProgram(gl)
  if (!shaderProgram) {
    console.error("[error] shaderProgram init failed")
    return
  }

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };

  // ここでは、これから描画するすべてのオブジェクトを
  // 構築するルーチンを呼び出しています。
  const buffers = initBuffers(gl);

  // シーンを描画
  drawScene(gl, programInfo, buffers);
}

const loadShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)


  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `シェーダーのコンパイル時にエラーが発生しました: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader)
    return null
  }

  return shader
}

const initShaderProgram = (gl: WebGLRenderingContext): WebGLProgram | null => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  if (!shaderProgram) return null

  gl.attachShader(shaderProgram, vertexShader!)
  gl.attachShader(shaderProgram, fragmentShader!)
  gl.linkProgram(shaderProgram)

  // シェーダープログラムの作成に失敗した場合、アラートを出す

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `シェーダープログラムを初期化できません: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    )
    return null
  }

  return shaderProgram
}

const init = (): WebGLRenderingContext | null => {
  const canvas = document.querySelector<HTMLCanvasElement>("#view")
  const gl = canvas?.getContext("webgl")
  if (!gl) return null

  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  return gl
}

export { renderProcess }
