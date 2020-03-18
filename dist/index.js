/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/displacement-filter.js":
/*!************************************!*\
  !*** ./src/displacement-filter.js ***!
  \************************************/
/*! exports provided: DisplacementFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DisplacementFilter", function() { return DisplacementFilter; });
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filter.js */ "./src/filter.js");
/* harmony import */ var _shader_sources__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shader-sources */ "./src/shader-sources.js");



/**
 * A filter to displace and image from a map
 */
class DisplacementFilter extends _filter_js__WEBPACK_IMPORTED_MODULE_0__["Filter"] {
    /**
     * @constructor
     * @param {object} options 
     * @param {HTMLCanvasElement} options.source The image to displace
     * @param {HTMLCanvasElement} options.map The displacement map
     * @param {number} [options.strength] The strength of the effect. Default is 10
     */
    constructor(options) {
        super(options);

        this.options = Object.assign({
            strength: 10
        }, this.options);


        this.setSize(this.options.source.width, this.options.source.height);

        // Create textures
        this.texSource = this.textureFromCanvas(this.options.source);
        this.texMap = this.textureFromCanvas(this.options.map);

        // Create program
        this.program = this.createProgram(_shader_sources__WEBPACK_IMPORTED_MODULE_1__["ShaderSources"].displacement.vertex, _shader_sources__WEBPACK_IMPORTED_MODULE_1__["ShaderSources"].displacement.fragment);


    }

    apply() {
        let gl = this.gl;

        let texMap = this.texMap;
        let texSource = this.texSource;
        let program = this.program;
        let strength = this.options.strength;
        let w = this.canvas.width;
        let h = this.canvas.height;


        // Draw
        gl.useProgram(program);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texSource);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texMap);

        gl.uniform1f(gl.getUniformLocation(program, "uStrength"), strength);
        gl.uniform1i(gl.getUniformLocation(program, "uSource"), 0);
        gl.uniform1i(gl.getUniformLocation(program, "uMap"), 1);
        gl.uniform2f(gl.getUniformLocation(program, "uPixelSize"), 1 / w, 1 / h);


        gl.clear(gl.COLOR_BUFFER_BIT);
        this.drawQuad();




    }

}

/***/ }),

/***/ "./src/filter.js":
/*!***********************!*\
  !*** ./src/filter.js ***!
  \***********************/
/*! exports provided: Filter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Filter", function() { return Filter; });
/**
 * A generic filter.
 */
class Filter {
    /**
     * @constructor
     * @param {object} options Filter options 
     */
    constructor(options) {
        /** @member {HTMLCanvasElement} The underlying canvas */
        let canvas = this.canvas = document.createElement("canvas");

        /** @member {WebGLRenderingContext} The underlying webgl context */
        let gl = this.gl = canvas.getContext("webgl", { premultipliedAlpha: false });

        /** @member {object} This instance's options */
        this.options = Object.assign({}, options);

        // Init GL
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
        gl.clearColor(0, 0, 0, 0);

        // Create quad vertex buffer
        {
            let vb = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vb);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1, -1, 0, 1,
                1, -1, 1, 1,
                1, 1, 1, 0,

                -1, -1, 0, 1,
                1, 1, 1, 0,
                -1, 1, 0, 0

            ]), gl.STATIC_DRAW);

            this.vbQuad = vb;
        }
    }

    /**
     * Draws a quad
     * @private
     */
    drawQuad() {

        let gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbQuad)

        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);

        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

    }


    /**
     * Creates a new shader
     * @param {number} type The shader type
     * @param {string} source The shader source
     * @returns {number} The shader id
     */
    createShader(type, source) {
        let gl = this.gl;
        let shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
        }

        return shader;

    }

    /**
     * Creates a new program from the vertex and fragment shaders sources
     * @param {string} vertexSrc The vertex shader source
     * @param {string} fragmentSrc The fragment shader source
     * @returns {number} The program id
     */
    createProgram(vertexSrc, fragmentSrc) {
        let gl = this.gl;
        let program = gl.createProgram();

        let vs = this.createShader(gl.VERTEX_SHADER, vertexSrc);
        let fs = this.createShader(gl.FRAGMENT_SHADER, fragmentSrc);

        gl.attachShader(program, vs);
        gl.attachShader(program, fs);

        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
        }

        return program;
    }

    /**
     * Creates a texture from a canvas. Filters are set to linear and
     * the texture is clamped at the edges
     * @param {HTMLCanvasElement} canvas The source canvas
     * @returns {number} The texture id
     */
    textureFromCanvas(canvas) {
        let gl = this.gl;
        let texId = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texId);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

        // Filters must be linear and textures must be clamped to edge, otherwise WebGL requires 
        // them so be power of 2. Of course we could just have rescaled them. Not a real issue.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Set the anisotropy to max if available
        var ext = (
            gl.getExtension('EXT_texture_filter_anisotropic') ||
            gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
            gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
        );
        
        if (ext) {
            var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
        }
        
        return texId;
    }

    /**
     * Resizes thie canvas and the viewport
     * @param {number} w The desired width
     * @param {number} h The desired height
     */
    setSize(w, h) {
        this.canvas.width = w;
        this.canvas.height = h;
        this.gl.viewport(0, 0, w, h);
    }

    /**
     * Applies the filter and returns the underlying canvas as result
     * @returns {HTMLCanvasElement} The result canvas
     */
    render() {
        this.apply();
        return this.canvas;
    }

    /**
     * Applies the filter rendering to the underlying canvas
     * @abstract
     */
    apply() {
        throw new Error("Filter.apply(): not implemented");
    }


}

/***/ }),

/***/ "./src/generate-normal-filter.js":
/*!***************************************!*\
  !*** ./src/generate-normal-filter.js ***!
  \***************************************/
/*! exports provided: GenerateNormalFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GenerateNormalFilter", function() { return GenerateNormalFilter; });
/* harmony import */ var _filter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filter */ "./src/filter.js");
/* harmony import */ var _shader_sources__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shader-sources */ "./src/shader-sources.js");



/**
 * A filter to generate normals from an height map
 */
class GenerateNormalFilter extends _filter__WEBPACK_IMPORTED_MODULE_0__["Filter"] {
    /**
     * @constructor
     * @param {object} options 
     * @param {HTMLCanvasElement} options.heightMap The source heightmap
     * @param {number} [options.strength] The strength of the effect. Default is 10.
     */
    constructor(options) {
        super(options);

        this.options = Object.assign({
            strength: 10,
        }, this.options);

        this.setSize(this.options.heightMap.width, this.options.heightMap.height);

        // Program 
        this.program = this.createProgram(_shader_sources__WEBPACK_IMPORTED_MODULE_1__["ShaderSources"].generateNormal.vertex, _shader_sources__WEBPACK_IMPORTED_MODULE_1__["ShaderSources"].generateNormal.fragment);

        // Textures
        this.texHeightMap = this.textureFromCanvas(this.options.heightMap);

    }


    apply() {
        let gl = this.gl;
        let canvas = this.canvas;
        let program = this.program;

        gl.useProgram(program);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texHeightMap);


        gl.uniform1i(gl.getUniformLocation(program, "uHeightMap"), 0);
        gl.uniform1f(gl.getUniformLocation(program, "uStrength"), this.options.strength)
        gl.uniform2f(gl.getUniformLocation(program, "uPixelSize"), 1.0 / canvas.width, 1 / canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT);
        this.drawQuad();

    }
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _displacement_filter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./displacement-filter.js */ "./src/displacement-filter.js");
/* harmony import */ var _generate_normal_filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./generate-normal-filter */ "./src/generate-normal-filter.js");



(function ($) {

    /**
     * Wrapper for DisplacementFilter
     * @param {HTMLCanvasElement} source The image to displace
     * @param {HTMLCanvasElement} map The displacement map
     * @param {number} [strength] The strength of the effect
     * @returns {HTMLCanvasElement} The result canvas
     */
    $.displacement = function (source, map, strength) {
        return new _displacement_filter_js__WEBPACK_IMPORTED_MODULE_0__["DisplacementFilter"]({
            source: source,
            map: map,
            strength: strength
        }).render();
    }

    /**
     * Wrapper for GenerateNormalFilter
     * @param {HTMLCanvasElement} heightMap The heightmap
     * @param {number} [strength] The strenght of the effect
     */
    $.generateNormal = function (heightMap, strength) {
        return new _generate_normal_filter__WEBPACK_IMPORTED_MODULE_1__["GenerateNormalFilter"]({
            heightMap: heightMap,
            strength: strength
        }).render();
    }

    $.GenerateNormalFilter = _generate_normal_filter__WEBPACK_IMPORTED_MODULE_1__["GenerateNormalFilter"];
    $.DisplacementFilter = _displacement_filter_js__WEBPACK_IMPORTED_MODULE_0__["DisplacementFilter"];

})(window);

/***/ }),

/***/ "./src/shader-sources.js":
/*!*******************************!*\
  !*** ./src/shader-sources.js ***!
  \*******************************/
/*! exports provided: ShaderSources */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShaderSources", function() { return ShaderSources; });
/** Basic vertex shader source */
const vertex = `

    precision highp float;

    attribute vec2 aPosition;
    attribute vec2 aTexCoords;

    varying vec2 vTexCoords;

    void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        vTexCoords = aTexCoords;
    }

    `;

/** Displacement fragment shader */
const fDisplace = `    

    precision highp float;

    uniform float uStrength;
    uniform vec2 uPixelSize;
    uniform sampler2D uSource, uMap;

    varying vec2 vTexCoords;

    float avgRgb(sampler2D s, vec2 t) {
        vec3 color = texture2D(s, t).rgb;
        return (color.r + color.g + color.b) / 3.0;
    }

    void main() {
        float pCenter = avgRgb(uMap, vTexCoords); 
        gl_FragColor = texture2D(uSource, vTexCoords + vec2(pCenter, pCenter) * uPixelSize * uStrength);
    }
    
`;

/** Generate normal fragment shader */
const fGenerateNormal = `

    precision highp float;

    uniform vec2 uPixelSize;
    uniform sampler2D uHeightMap;
    uniform float uStrength;

    varying vec2 vTexCoords;

    float avgRgb(sampler2D s, vec2 t) {
        vec3 color = texture2D(s, t).rgb;
        return (color.r + color.g + color.b) / 3.0;
    }

    float pack(float x) {
        return (x + 1.0) / 2.0;
    }

    void main() {

        float pCenter = avgRgb(uHeightMap, vTexCoords); 
                
        float pLeft = avgRgb(uHeightMap, vTexCoords + uPixelSize * vec2(-1, 0));
        float pRight = avgRgb(uHeightMap, vTexCoords + uPixelSize * vec2(1, 0));
        float pUp = avgRgb(uHeightMap, vTexCoords + uPixelSize * vec2(0, 1));
        float pDown = avgRgb(uHeightMap, vTexCoords + uPixelSize * vec2(0, -1));

        vec3 vLeftRight = normalize(vec3(1.0, 0.0, (pLeft - pRight) * uStrength));
        vec3 vTopBottom = normalize(vec3(0.0, 1.0, (pDown - pUp) * uStrength));

        vec3 vRes = cross(vLeftRight, vTopBottom);

        gl_FragColor = vec4(pack(vRes.x), pack(vRes.y), pack(vRes.z), 1.0);


    }
`;


const ShaderSources = {
    displacement: {
        vertex: vertex,
        fragment: fDisplace
    },
    generateNormal: {
        vertex: vertex,
        fragment: fGenerateNormal
    }
}

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Rpc3BsYWNlbWVudC1maWx0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ZpbHRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2VuZXJhdGUtbm9ybWFsLWZpbHRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYWRlci1zb3VyY2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQUE7QUFBcUM7QUFDWTs7QUFFakQ7QUFDQTtBQUNBO0FBQ08saUNBQWlDLGlEQUFNO0FBQzlDO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxrQkFBa0I7QUFDakMsZUFBZSxrQkFBa0I7QUFDakMsZUFBZSxPQUFPO0FBQ3RC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RUFBb0I7QUFDakQsMkJBQTJCLDBFQUFrQjs7QUFFN0MsQ0FBQyxVOzs7Ozs7Ozs7Ozs7QUNuQ0Q7QUFBQTtBQUFBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsdUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7O0FBR0E7QUFDQTs7O0FBR087QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCJpbXBvcnQgeyBGaWx0ZXIgfSBmcm9tICcuL2ZpbHRlci5qcyc7XHJcbmltcG9ydCB7IFNoYWRlclNvdXJjZXMgfSBmcm9tICcuL3NoYWRlci1zb3VyY2VzJztcclxuXHJcbi8qKlxyXG4gKiBBIGZpbHRlciB0byBkaXNwbGFjZSBhbmQgaW1hZ2UgZnJvbSBhIG1hcFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIERpc3BsYWNlbWVudEZpbHRlciBleHRlbmRzIEZpbHRlciB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBvcHRpb25zLnNvdXJjZSBUaGUgaW1hZ2UgdG8gZGlzcGxhY2VcclxuICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IG9wdGlvbnMubWFwIFRoZSBkaXNwbGFjZW1lbnQgbWFwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc3RyZW5ndGhdIFRoZSBzdHJlbmd0aCBvZiB0aGUgZWZmZWN0LiBEZWZhdWx0IGlzIDEwXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIHN0cmVuZ3RoOiAxMFxyXG4gICAgICAgIH0sIHRoaXMub3B0aW9ucyk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnNldFNpemUodGhpcy5vcHRpb25zLnNvdXJjZS53aWR0aCwgdGhpcy5vcHRpb25zLnNvdXJjZS5oZWlnaHQpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGV4dHVyZXNcclxuICAgICAgICB0aGlzLnRleFNvdXJjZSA9IHRoaXMudGV4dHVyZUZyb21DYW52YXModGhpcy5vcHRpb25zLnNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy50ZXhNYXAgPSB0aGlzLnRleHR1cmVGcm9tQ2FudmFzKHRoaXMub3B0aW9ucy5tYXApO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgcHJvZ3JhbVxyXG4gICAgICAgIHRoaXMucHJvZ3JhbSA9IHRoaXMuY3JlYXRlUHJvZ3JhbShTaGFkZXJTb3VyY2VzLmRpc3BsYWNlbWVudC52ZXJ0ZXgsIFNoYWRlclNvdXJjZXMuZGlzcGxhY2VtZW50LmZyYWdtZW50KTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5KCkge1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcblxyXG4gICAgICAgIGxldCB0ZXhNYXAgPSB0aGlzLnRleE1hcDtcclxuICAgICAgICBsZXQgdGV4U291cmNlID0gdGhpcy50ZXhTb3VyY2U7XHJcbiAgICAgICAgbGV0IHByb2dyYW0gPSB0aGlzLnByb2dyYW07XHJcbiAgICAgICAgbGV0IHN0cmVuZ3RoID0gdGhpcy5vcHRpb25zLnN0cmVuZ3RoO1xyXG4gICAgICAgIGxldCB3ID0gdGhpcy5jYW52YXMud2lkdGg7XHJcbiAgICAgICAgbGV0IGggPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcblxyXG5cclxuICAgICAgICAvLyBEcmF3XHJcbiAgICAgICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcclxuXHJcbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4U291cmNlKTtcclxuXHJcbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMSk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4TWFwKTtcclxuXHJcbiAgICAgICAgZ2wudW5pZm9ybTFmKGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCBcInVTdHJlbmd0aFwiKSwgc3RyZW5ndGgpO1xyXG4gICAgICAgIGdsLnVuaWZvcm0xaShnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgXCJ1U291cmNlXCIpLCAwKTtcclxuICAgICAgICBnbC51bmlmb3JtMWkoZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sIFwidU1hcFwiKSwgMSk7XHJcbiAgICAgICAgZ2wudW5pZm9ybTJmKGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCBcInVQaXhlbFNpemVcIiksIDEgLyB3LCAxIC8gaCk7XHJcblxyXG5cclxuICAgICAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcclxuICAgICAgICB0aGlzLmRyYXdRdWFkKCk7XHJcblxyXG5cclxuXHJcblxyXG4gICAgfVxyXG5cclxufSIsIi8qKlxyXG4gKiBBIGdlbmVyaWMgZmlsdGVyLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEZpbHRlciB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgRmlsdGVyIG9wdGlvbnMgXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICAvKiogQG1lbWJlciB7SFRNTENhbnZhc0VsZW1lbnR9IFRoZSB1bmRlcmx5aW5nIGNhbnZhcyAqL1xyXG4gICAgICAgIGxldCBjYW52YXMgPSB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcblxyXG4gICAgICAgIC8qKiBAbWVtYmVyIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9IFRoZSB1bmRlcmx5aW5nIHdlYmdsIGNvbnRleHQgKi9cclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsID0gY2FudmFzLmdldENvbnRleHQoXCJ3ZWJnbFwiLCB7IHByZW11bHRpcGxpZWRBbHBoYTogZmFsc2UgfSk7XHJcblxyXG4gICAgICAgIC8qKiBAbWVtYmVyIHtvYmplY3R9IFRoaXMgaW5zdGFuY2UncyBvcHRpb25zICovXHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIEluaXQgR0xcclxuICAgICAgICBnbC5kaXNhYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG4gICAgICAgIGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xyXG4gICAgICAgIGdsLmNsZWFyQ29sb3IoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBxdWFkIHZlcnRleCBidWZmZXJcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCB2YiA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdmIpO1xyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShbXHJcbiAgICAgICAgICAgICAgICAtMSwgLTEsIDAsIDEsXHJcbiAgICAgICAgICAgICAgICAxLCAtMSwgMSwgMSxcclxuICAgICAgICAgICAgICAgIDEsIDEsIDEsIDAsXHJcblxyXG4gICAgICAgICAgICAgICAgLTEsIC0xLCAwLCAxLFxyXG4gICAgICAgICAgICAgICAgMSwgMSwgMSwgMCxcclxuICAgICAgICAgICAgICAgIC0xLCAxLCAwLCAwXHJcblxyXG4gICAgICAgICAgICBdKSwgZ2wuU1RBVElDX0RSQVcpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy52YlF1YWQgPSB2YjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEcmF3cyBhIHF1YWRcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGRyYXdRdWFkKCkge1xyXG5cclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG5cclxuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy52YlF1YWQpXHJcblxyXG4gICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KDApO1xyXG4gICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KDEpO1xyXG5cclxuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKDAsIDIsIGdsLkZMT0FULCBmYWxzZSwgMTYsIDApO1xyXG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoMSwgMiwgZ2wuRkxPQVQsIGZhbHNlLCAxNiwgOCk7XHJcblxyXG4gICAgICAgIGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVTLCAwLCA2KTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIG5ldyBzaGFkZXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0eXBlIFRoZSBzaGFkZXIgdHlwZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZSBUaGUgc2hhZGVyIHNvdXJjZVxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIHNoYWRlciBpZFxyXG4gICAgICovXHJcbiAgICBjcmVhdGVTaGFkZXIodHlwZSwgc291cmNlKSB7XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBsZXQgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUpO1xyXG5cclxuICAgICAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzb3VyY2UpO1xyXG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKVxyXG4gICAgICAgIGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzaGFkZXI7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIG5ldyBwcm9ncmFtIGZyb20gdGhlIHZlcnRleCBhbmQgZnJhZ21lbnQgc2hhZGVycyBzb3VyY2VzXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmVydGV4U3JjIFRoZSB2ZXJ0ZXggc2hhZGVyIHNvdXJjZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZyYWdtZW50U3JjIFRoZSBmcmFnbWVudCBzaGFkZXIgc291cmNlXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgcHJvZ3JhbSBpZFxyXG4gICAgICovXHJcbiAgICBjcmVhdGVQcm9ncmFtKHZlcnRleFNyYywgZnJhZ21lbnRTcmMpIHtcclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGxldCBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG5cclxuICAgICAgICBsZXQgdnMgPSB0aGlzLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSLCB2ZXJ0ZXhTcmMpO1xyXG4gICAgICAgIGxldCBmcyA9IHRoaXMuY3JlYXRlU2hhZGVyKGdsLkZSQUdNRU5UX1NIQURFUiwgZnJhZ21lbnRTcmMpO1xyXG5cclxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdnMpO1xyXG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcyk7XHJcblxyXG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xyXG5cclxuICAgICAgICBpZiAoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHByb2dyYW07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgdGV4dHVyZSBmcm9tIGEgY2FudmFzLiBGaWx0ZXJzIGFyZSBzZXQgdG8gbGluZWFyIGFuZFxyXG4gICAgICogdGhlIHRleHR1cmUgaXMgY2xhbXBlZCBhdCB0aGUgZWRnZXNcclxuICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IGNhbnZhcyBUaGUgc291cmNlIGNhbnZhc1xyXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIHRleHR1cmUgaWRcclxuICAgICAqL1xyXG4gICAgdGV4dHVyZUZyb21DYW52YXMoY2FudmFzKSB7XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBsZXQgdGV4SWQgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcblxyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleElkKTtcclxuXHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBjYW52YXMpO1xyXG5cclxuICAgICAgICAvLyBGaWx0ZXJzIG11c3QgYmUgbGluZWFyIGFuZCB0ZXh0dXJlcyBtdXN0IGJlIGNsYW1wZWQgdG8gZWRnZSwgb3RoZXJ3aXNlIFdlYkdMIHJlcXVpcmVzIFxyXG4gICAgICAgIC8vIHRoZW0gc28gYmUgcG93ZXIgb2YgMi4gT2YgY291cnNlIHdlIGNvdWxkIGp1c3QgaGF2ZSByZXNjYWxlZCB0aGVtLiBOb3QgYSByZWFsIGlzc3VlLlxyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG5cclxuICAgICAgICAvLyBTZXQgdGhlIGFuaXNvdHJvcHkgdG8gbWF4IGlmIGF2YWlsYWJsZVxyXG4gICAgICAgIHZhciBleHQgPSAoXHJcbiAgICAgICAgICAgIGdsLmdldEV4dGVuc2lvbignRVhUX3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljJykgfHxcclxuICAgICAgICAgICAgZ2wuZ2V0RXh0ZW5zaW9uKCdNT1pfRVhUX3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljJykgfHxcclxuICAgICAgICAgICAgZ2wuZ2V0RXh0ZW5zaW9uKCdXRUJLSVRfRVhUX3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljJylcclxuICAgICAgICApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChleHQpIHtcclxuICAgICAgICAgICAgdmFyIG1heCA9IGdsLmdldFBhcmFtZXRlcihleHQuTUFYX1RFWFRVUkVfTUFYX0FOSVNPVFJPUFlfRVhUKTtcclxuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyZihnbC5URVhUVVJFXzJELCBleHQuVEVYVFVSRV9NQVhfQU5JU09UUk9QWV9FWFQsIG1heCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0ZXhJZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc2l6ZXMgdGhpZSBjYW52YXMgYW5kIHRoZSB2aWV3cG9ydFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHcgVGhlIGRlc2lyZWQgd2lkdGhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoIFRoZSBkZXNpcmVkIGhlaWdodFxyXG4gICAgICovXHJcbiAgICBzZXRTaXplKHcsIGgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHc7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gaDtcclxuICAgICAgICB0aGlzLmdsLnZpZXdwb3J0KDAsIDAsIHcsIGgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXBwbGllcyB0aGUgZmlsdGVyIGFuZCByZXR1cm5zIHRoZSB1bmRlcmx5aW5nIGNhbnZhcyBhcyByZXN1bHRcclxuICAgICAqIEByZXR1cm5zIHtIVE1MQ2FudmFzRWxlbWVudH0gVGhlIHJlc3VsdCBjYW52YXNcclxuICAgICAqL1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuYXBwbHkoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBcHBsaWVzIHRoZSBmaWx0ZXIgcmVuZGVyaW5nIHRvIHRoZSB1bmRlcmx5aW5nIGNhbnZhc1xyXG4gICAgICogQGFic3RyYWN0XHJcbiAgICAgKi9cclxuICAgIGFwcGx5KCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZpbHRlci5hcHBseSgpOiBub3QgaW1wbGVtZW50ZWRcIik7XHJcbiAgICB9XHJcblxyXG5cclxufSIsImltcG9ydCB7IEZpbHRlciB9IGZyb20gJy4vZmlsdGVyJztcclxuaW1wb3J0IHsgU2hhZGVyU291cmNlcyB9IGZyb20gJy4vc2hhZGVyLXNvdXJjZXMnO1xyXG5cclxuLyoqXHJcbiAqIEEgZmlsdGVyIHRvIGdlbmVyYXRlIG5vcm1hbHMgZnJvbSBhbiBoZWlnaHQgbWFwXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgR2VuZXJhdGVOb3JtYWxGaWx0ZXIgZXh0ZW5kcyBGaWx0ZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIFxyXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gb3B0aW9ucy5oZWlnaHRNYXAgVGhlIHNvdXJjZSBoZWlnaHRtYXBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zdHJlbmd0aF0gVGhlIHN0cmVuZ3RoIG9mIHRoZSBlZmZlY3QuIERlZmF1bHQgaXMgMTAuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIHN0cmVuZ3RoOiAxMCxcclxuICAgICAgICB9LCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFNpemUodGhpcy5vcHRpb25zLmhlaWdodE1hcC53aWR0aCwgdGhpcy5vcHRpb25zLmhlaWdodE1hcC5oZWlnaHQpO1xyXG5cclxuICAgICAgICAvLyBQcm9ncmFtIFxyXG4gICAgICAgIHRoaXMucHJvZ3JhbSA9IHRoaXMuY3JlYXRlUHJvZ3JhbShTaGFkZXJTb3VyY2VzLmdlbmVyYXRlTm9ybWFsLnZlcnRleCwgU2hhZGVyU291cmNlcy5nZW5lcmF0ZU5vcm1hbC5mcmFnbWVudCk7XHJcblxyXG4gICAgICAgIC8vIFRleHR1cmVzXHJcbiAgICAgICAgdGhpcy50ZXhIZWlnaHRNYXAgPSB0aGlzLnRleHR1cmVGcm9tQ2FudmFzKHRoaXMub3B0aW9ucy5oZWlnaHRNYXApO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgYXBwbHkoKSB7XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBsZXQgY2FudmFzID0gdGhpcy5jYW52YXM7XHJcbiAgICAgICAgbGV0IHByb2dyYW0gPSB0aGlzLnByb2dyYW07XHJcblxyXG4gICAgICAgIGdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XHJcblxyXG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTApO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4SGVpZ2h0TWFwKTtcclxuXHJcblxyXG4gICAgICAgIGdsLnVuaWZvcm0xaShnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgXCJ1SGVpZ2h0TWFwXCIpLCAwKTtcclxuICAgICAgICBnbC51bmlmb3JtMWYoZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sIFwidVN0cmVuZ3RoXCIpLCB0aGlzLm9wdGlvbnMuc3RyZW5ndGgpXHJcbiAgICAgICAgZ2wudW5pZm9ybTJmKGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCBcInVQaXhlbFNpemVcIiksIDEuMCAvIGNhbnZhcy53aWR0aCwgMSAvIGNhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAgICAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcclxuICAgICAgICB0aGlzLmRyYXdRdWFkKCk7XHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRGlzcGxhY2VtZW50RmlsdGVyIH0gZnJvbSAnLi9kaXNwbGFjZW1lbnQtZmlsdGVyLmpzJztcclxuaW1wb3J0IHsgR2VuZXJhdGVOb3JtYWxGaWx0ZXIgfSBmcm9tICcuL2dlbmVyYXRlLW5vcm1hbC1maWx0ZXInO1xyXG5cclxuKGZ1bmN0aW9uICgkKSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXcmFwcGVyIGZvciBEaXNwbGFjZW1lbnRGaWx0ZXJcclxuICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IHNvdXJjZSBUaGUgaW1hZ2UgdG8gZGlzcGxhY2VcclxuICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IG1hcCBUaGUgZGlzcGxhY2VtZW50IG1hcFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtzdHJlbmd0aF0gVGhlIHN0cmVuZ3RoIG9mIHRoZSBlZmZlY3RcclxuICAgICAqIEByZXR1cm5zIHtIVE1MQ2FudmFzRWxlbWVudH0gVGhlIHJlc3VsdCBjYW52YXNcclxuICAgICAqL1xyXG4gICAgJC5kaXNwbGFjZW1lbnQgPSBmdW5jdGlvbiAoc291cmNlLCBtYXAsIHN0cmVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEaXNwbGFjZW1lbnRGaWx0ZXIoe1xyXG4gICAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcclxuICAgICAgICAgICAgbWFwOiBtYXAsXHJcbiAgICAgICAgICAgIHN0cmVuZ3RoOiBzdHJlbmd0aFxyXG4gICAgICAgIH0pLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV3JhcHBlciBmb3IgR2VuZXJhdGVOb3JtYWxGaWx0ZXJcclxuICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IGhlaWdodE1hcCBUaGUgaGVpZ2h0bWFwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3N0cmVuZ3RoXSBUaGUgc3RyZW5naHQgb2YgdGhlIGVmZmVjdFxyXG4gICAgICovXHJcbiAgICAkLmdlbmVyYXRlTm9ybWFsID0gZnVuY3Rpb24gKGhlaWdodE1hcCwgc3RyZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEdlbmVyYXRlTm9ybWFsRmlsdGVyKHtcclxuICAgICAgICAgICAgaGVpZ2h0TWFwOiBoZWlnaHRNYXAsXHJcbiAgICAgICAgICAgIHN0cmVuZ3RoOiBzdHJlbmd0aFxyXG4gICAgICAgIH0pLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgICQuR2VuZXJhdGVOb3JtYWxGaWx0ZXIgPSBHZW5lcmF0ZU5vcm1hbEZpbHRlcjtcclxuICAgICQuRGlzcGxhY2VtZW50RmlsdGVyID0gRGlzcGxhY2VtZW50RmlsdGVyO1xyXG5cclxufSkod2luZG93KTsiLCIvKiogQmFzaWMgdmVydGV4IHNoYWRlciBzb3VyY2UgKi9cclxuY29uc3QgdmVydGV4ID0gYFxyXG5cclxuICAgIHByZWNpc2lvbiBoaWdocCBmbG9hdDtcclxuXHJcbiAgICBhdHRyaWJ1dGUgdmVjMiBhUG9zaXRpb247XHJcbiAgICBhdHRyaWJ1dGUgdmVjMiBhVGV4Q29vcmRzO1xyXG5cclxuICAgIHZhcnlpbmcgdmVjMiB2VGV4Q29vcmRzO1xyXG5cclxuICAgIHZvaWQgbWFpbigpIHtcclxuICAgICAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoYVBvc2l0aW9uLCAwLjAsIDEuMCk7XHJcbiAgICAgICAgdlRleENvb3JkcyA9IGFUZXhDb29yZHM7XHJcbiAgICB9XHJcblxyXG4gICAgYDtcclxuXHJcbi8qKiBEaXNwbGFjZW1lbnQgZnJhZ21lbnQgc2hhZGVyICovXHJcbmNvbnN0IGZEaXNwbGFjZSA9IGAgICAgXHJcblxyXG4gICAgcHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xyXG5cclxuICAgIHVuaWZvcm0gZmxvYXQgdVN0cmVuZ3RoO1xyXG4gICAgdW5pZm9ybSB2ZWMyIHVQaXhlbFNpemU7XHJcbiAgICB1bmlmb3JtIHNhbXBsZXIyRCB1U291cmNlLCB1TWFwO1xyXG5cclxuICAgIHZhcnlpbmcgdmVjMiB2VGV4Q29vcmRzO1xyXG5cclxuICAgIGZsb2F0IGF2Z1JnYihzYW1wbGVyMkQgcywgdmVjMiB0KSB7XHJcbiAgICAgICAgdmVjMyBjb2xvciA9IHRleHR1cmUyRChzLCB0KS5yZ2I7XHJcbiAgICAgICAgcmV0dXJuIChjb2xvci5yICsgY29sb3IuZyArIGNvbG9yLmIpIC8gMy4wO1xyXG4gICAgfVxyXG5cclxuICAgIHZvaWQgbWFpbigpIHtcclxuICAgICAgICBmbG9hdCBwQ2VudGVyID0gYXZnUmdiKHVNYXAsIHZUZXhDb29yZHMpOyBcclxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNvdXJjZSwgdlRleENvb3JkcyArIHZlYzIocENlbnRlciwgcENlbnRlcikgKiB1UGl4ZWxTaXplICogdVN0cmVuZ3RoKTtcclxuICAgIH1cclxuICAgIFxyXG5gO1xyXG5cclxuLyoqIEdlbmVyYXRlIG5vcm1hbCBmcmFnbWVudCBzaGFkZXIgKi9cclxuY29uc3QgZkdlbmVyYXRlTm9ybWFsID0gYFxyXG5cclxuICAgIHByZWNpc2lvbiBoaWdocCBmbG9hdDtcclxuXHJcbiAgICB1bmlmb3JtIHZlYzIgdVBpeGVsU2l6ZTtcclxuICAgIHVuaWZvcm0gc2FtcGxlcjJEIHVIZWlnaHRNYXA7XHJcbiAgICB1bmlmb3JtIGZsb2F0IHVTdHJlbmd0aDtcclxuXHJcbiAgICB2YXJ5aW5nIHZlYzIgdlRleENvb3JkcztcclxuXHJcbiAgICBmbG9hdCBhdmdSZ2Ioc2FtcGxlcjJEIHMsIHZlYzIgdCkge1xyXG4gICAgICAgIHZlYzMgY29sb3IgPSB0ZXh0dXJlMkQocywgdCkucmdiO1xyXG4gICAgICAgIHJldHVybiAoY29sb3IuciArIGNvbG9yLmcgKyBjb2xvci5iKSAvIDMuMDtcclxuICAgIH1cclxuXHJcbiAgICBmbG9hdCBwYWNrKGZsb2F0IHgpIHtcclxuICAgICAgICByZXR1cm4gKHggKyAxLjApIC8gMi4wO1xyXG4gICAgfVxyXG5cclxuICAgIHZvaWQgbWFpbigpIHtcclxuXHJcbiAgICAgICAgZmxvYXQgcENlbnRlciA9IGF2Z1JnYih1SGVpZ2h0TWFwLCB2VGV4Q29vcmRzKTsgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICBmbG9hdCBwTGVmdCA9IGF2Z1JnYih1SGVpZ2h0TWFwLCB2VGV4Q29vcmRzICsgdVBpeGVsU2l6ZSAqIHZlYzIoLTEsIDApKTtcclxuICAgICAgICBmbG9hdCBwUmlnaHQgPSBhdmdSZ2IodUhlaWdodE1hcCwgdlRleENvb3JkcyArIHVQaXhlbFNpemUgKiB2ZWMyKDEsIDApKTtcclxuICAgICAgICBmbG9hdCBwVXAgPSBhdmdSZ2IodUhlaWdodE1hcCwgdlRleENvb3JkcyArIHVQaXhlbFNpemUgKiB2ZWMyKDAsIDEpKTtcclxuICAgICAgICBmbG9hdCBwRG93biA9IGF2Z1JnYih1SGVpZ2h0TWFwLCB2VGV4Q29vcmRzICsgdVBpeGVsU2l6ZSAqIHZlYzIoMCwgLTEpKTtcclxuXHJcbiAgICAgICAgdmVjMyB2TGVmdFJpZ2h0ID0gbm9ybWFsaXplKHZlYzMoMS4wLCAwLjAsIChwTGVmdCAtIHBSaWdodCkgKiB1U3RyZW5ndGgpKTtcclxuICAgICAgICB2ZWMzIHZUb3BCb3R0b20gPSBub3JtYWxpemUodmVjMygwLjAsIDEuMCwgKHBEb3duIC0gcFVwKSAqIHVTdHJlbmd0aCkpO1xyXG5cclxuICAgICAgICB2ZWMzIHZSZXMgPSBjcm9zcyh2TGVmdFJpZ2h0LCB2VG9wQm90dG9tKTtcclxuXHJcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChwYWNrKHZSZXMueCksIHBhY2sodlJlcy55KSwgcGFjayh2UmVzLnopLCAxLjApO1xyXG5cclxuXHJcbiAgICB9XHJcbmA7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IFNoYWRlclNvdXJjZXMgPSB7XHJcbiAgICBkaXNwbGFjZW1lbnQ6IHtcclxuICAgICAgICB2ZXJ0ZXg6IHZlcnRleCxcclxuICAgICAgICBmcmFnbWVudDogZkRpc3BsYWNlXHJcbiAgICB9LFxyXG4gICAgZ2VuZXJhdGVOb3JtYWw6IHtcclxuICAgICAgICB2ZXJ0ZXg6IHZlcnRleCxcclxuICAgICAgICBmcmFnbWVudDogZkdlbmVyYXRlTm9ybWFsXHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9