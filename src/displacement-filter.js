import { Filter } from './filter.js';
import { ShaderSources } from './shader-sources';

/**
 * A filter to displace and image from a map
 */
export class DisplacementFilter extends Filter {
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
        this.program = this.createProgram(ShaderSources.displacement.vertex, ShaderSources.displacement.fragment);


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