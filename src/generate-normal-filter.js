import { Filter } from './filter';
import { ShaderSources } from './shader-sources';

/**
 * A filter to generate normals from an height map
 */
export class GenerateNormalFilter extends Filter {
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
        this.program = this.createProgram(ShaderSources.generateNormal.vertex, ShaderSources.generateNormal.fragment);

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