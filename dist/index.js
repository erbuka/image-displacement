!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";r.r(t);class n{constructor(e){let t=this.canvas=document.createElement("canvas"),r=this.gl=t.getContext("webgl");this.options=Object.assign({},e),r.disable(r.DEPTH_TEST),r.disable(r.BLEND),r.clearColor(0,0,0,0);{let e=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,e),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,0,1,1,-1,1,1,1,1,1,0,-1,-1,0,1,1,1,1,0,-1,1,0,0]),r.STATIC_DRAW),this.vbQuad=e}}drawQuad(){let e=this.gl;e.bindBuffer(e.ARRAY_BUFFER,this.vbQuad),e.enableVertexAttribArray(0),e.enableVertexAttribArray(1),e.vertexAttribPointer(0,2,e.FLOAT,!1,16,0),e.vertexAttribPointer(1,2,e.FLOAT,!1,16,8),e.drawArrays(e.TRIANGLES,0,6)}createShader(e,t){let r=this.gl,n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),r.getShaderParameter(n,r.COMPILE_STATUS)||console.error(r.getShaderInfoLog(n)),n}createProgram(e,t){let r=this.gl,n=r.createProgram(),o=this.createShader(r.VERTEX_SHADER,e),i=this.createShader(r.FRAGMENT_SHADER,t);return r.attachShader(n,o),r.attachShader(n,i),r.linkProgram(n),r.getProgramParameter(n,r.LINK_STATUS)||console.error(r.getProgramInfoLog(n)),n}textureFromCanvas(e){let t=this.gl,r=t.createTexture();return t.bindTexture(t.TEXTURE_2D,r),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),r}setSize(e,t){this.canvas.width=e,this.canvas.height=t,this.gl.viewport(0,0,e,t)}render(){return this.apply(),this.canvas}apply(){throw new Error("Filter.apply(): not implemented")}}const o="\n\n    precision highp float;\n\n    attribute vec2 aPosition;\n    attribute vec2 aTexCoords;\n\n    varying vec2 vTexCoords;\n\n    void main() {\n        gl_Position = vec4(aPosition, 0.0, 1.0);\n        vTexCoords = aTexCoords;\n    }\n\n    ",i={displacement:{vertex:o,fragment:"    \n\n    precision highp float;\n\n    uniform float uStrength;\n    uniform vec2 uPixelSize;\n    uniform sampler2D uSource, uMap;\n\n    varying vec2 vTexCoords;\n\n    float avgRgb(sampler2D s, vec2 t) {\n        vec3 color = texture2D(s, t).rgb;\n        return (color.r + color.g + color.b) / 3.0;\n    }\n\n    void main() {\n        float pCenter = avgRgb(uMap, vTexCoords); \n        gl_FragColor = texture2D(uSource, vTexCoords + vec2(pCenter, pCenter) * uPixelSize * uStrength);\n    }\n    \n"},generateNormal:{vertex:o,fragment:"\n\n    precision highp float;\n\n    uniform vec2 uPixelSize;\n    uniform sampler2D uHeightMap;\n    uniform float uStrength;\n\n    varying vec2 vTexCoords;\n\n    float avgRgb(sampler2D s, vec2 t) {\n        vec3 color = texture2D(s, t).rgb;\n        return (color.r + color.g + color.b) / 3.0;\n    }\n\n    float pack(float x) {\n        return (x + 1.0) / 2.0;\n    }\n\n    void main() {\n\n        float pCenter = avgRgb(uHeightMap, vTexCoords); \n                \n        float pLeft = avgRgb(uHeightMap, vTexCoords + uPixelSize * vec2(-1, 0));\n        float pRight = avgRgb(uHeightMap, vTexCoords + uPixelSize * vec2(1, 0));\n        float pUp = avgRgb(uHeightMap, vTexCoords + uPixelSize * vec2(0, 1));\n        float pDown = avgRgb(uHeightMap, vTexCoords + uPixelSize * vec2(0, -1));\n\n        vec3 vLeftRight = normalize(vec3(1.0, 0.0, (pLeft - pRight) * uStrength));\n        vec3 vTopBottom = normalize(vec3(0.0, 1.0, (pDown - pUp) * uStrength));\n\n        vec3 vRes = cross(vLeftRight, vTopBottom);\n\n        gl_FragColor = vec4(pack(vRes.x), pack(vRes.y), pack(vRes.z), 1.0);\n\n\n    }\n"}};class a extends n{constructor(e){super(e),this.options=Object.assign({strength:10},this.options),this.setSize(this.options.source.width,this.options.source.height),this.texSource=this.textureFromCanvas(this.options.source),this.texMap=this.textureFromCanvas(this.options.map),this.program=this.createProgram(i.displacement.vertex,i.displacement.fragment)}apply(){let e=this.gl,t=this.texMap,r=this.texSource,n=this.program,o=this.options.strength,i=this.canvas.width,a=this.canvas.height;e.useProgram(n),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,r),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,t),e.uniform1f(e.getUniformLocation(n,"uStrength"),o),e.uniform1i(e.getUniformLocation(n,"uSource"),0),e.uniform1i(e.getUniformLocation(n,"uMap"),1),e.uniform2f(e.getUniformLocation(n,"uPixelSize"),1/i,1/a),e.clear(e.COLOR_BUFFER_BIT),this.drawQuad()}}class s extends n{constructor(e){super(e),this.options=Object.assign({strength:10},this.options),this.setSize(this.options.heightMap.width,this.options.heightMap.height),this.program=this.createProgram(i.generateNormal.vertex,i.generateNormal.fragment),this.texHeightMap=this.textureFromCanvas(this.options.heightMap)}apply(){let e=this.gl,t=this.canvas,r=this.program;e.useProgram(r),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texHeightMap),e.uniform1i(e.getUniformLocation(r,"uHeightMap"),0),e.uniform1f(e.getUniformLocation(r,"uStrength"),this.options.strength),e.uniform2f(e.getUniformLocation(r,"uPixelSize"),1/t.width,1/t.height),e.clear(e.COLOR_BUFFER_BIT),this.drawQuad()}}var u;(u=window).displacement=function(e,t,r){return new a({source:e,map:t,strength:r}).render()},u.generateNormal=function(e,t){return new s({heightMap:e,strength:t}).render()},u.GenerateNormalFilter=s,u.DisplacementFilter=a}]);