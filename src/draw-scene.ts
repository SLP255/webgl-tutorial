import { mat4 } from "gl-matrix";

function drawScene(gl: WebGLRenderingContext, programInfo: any, buffers: any) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // 黒でクリア、完全に不透明
  gl.clearDepth(1.0); // 全てをクリア
  gl.enable(gl.DEPTH_TEST); // 深度テストを有効化
  gl.depthFunc(gl.LEQUAL); // 奥にあるものは隠れるようにする

  // 描写を行う前にキャンバスをクリアする

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // カメラで遠近感を再現するために使用される特殊な行列、
  // パースペクティブマトリクスを作成します。視野角は45度、
  // 幅と高さの比率はキャンバスの表示サイズに合わせ、
  // カメラから 0.1 単位から 100 単位までのオブジェクトのみを
  // 表示するようにします。

  const fieldOfView = (45 * Math.PI) / 180; // ラジアンにする
  const aspect = (gl.canvas as HTMLCanvasElement).clientWidth / (gl.canvas as HTMLCanvasElement).clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // メモ: glmatrix.js は常に第一引数として結果の
  // 受け取り先を取る
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // 描写位置をシーンの中央である "identity" ポイントにセットする
  const modelViewMatrix = mat4.create();

  // そして描写位置を正方形を描写し始めたい位置に少しだけ動かす
  mat4.translate(
    modelViewMatrix, // 変換結果の格納先
    modelViewMatrix, // 変換する行列
    [-0.0, 0.0, -6.0]
  ); // 変換量

  // WebGL にどのように座標バッファーから vertexPosition 属性に
  // 座標を引き出すか伝える
  setPositionAttribute(gl, buffers, programInfo);

  // WebGLに、描写するのに我々のプログラムを用いるように伝える
  gl.useProgram(programInfo.program);

  // シェーダーユニフォームをセット
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

// WebGL に、位置バッファーから vertexPosition 属性に
// 位置を引き出す方法を指示する。
function setPositionAttribute(gl: WebGLRenderingContext, buffers: any, programInfo: any) {
  const numComponents = 2; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

export { drawScene };
