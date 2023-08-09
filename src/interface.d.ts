interface ProgramInfo {
  program: WebGLProgram,
  attribLocations: {
    vertexPosition: number
  },
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation | null,
    modelViewMatrix: WebGLUniformLocation | null
  }
} 
