/**
 * A generic filter.
 */
export class Filter {
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