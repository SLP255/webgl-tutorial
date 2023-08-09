import vsSource from './shader.vert?raw'
import fsSource from './shader.frag?raw'

const getProgramInfo = (gl: WebGLRenderingContext): ProgramInfo | null => {
  const shaderProgram = initShaderProgram(gl)
  if (!shaderProgram) return null

  return {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    }
  }
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

  const vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');
  gl.enableVertexAttribArray(vertexColorAttribute);

  return shaderProgram
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

export { getProgramInfo }
