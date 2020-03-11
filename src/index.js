import { DisplacementFilter } from './displacement-filter.js';
import { GenerateNormalFilter } from './generate-normal-filter';

(function ($) {

    /**
     * Wrapper for DisplacementFilter
     * @param {HTMLCanvasElement} source The image to displace
     * @param {HTMLCanvasElement} map The displacement map
     * @param {number} [strength] The strength of the effect
     * @returns {HTMLCanvasElement} The result canvas
     */
    $.displacement = function (source, map, strength) {
        return new DisplacementFilter({
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
        return new GenerateNormalFilter({
            heightMap: heightMap,
            strength: strength
        }).render();
    }

    $.GenerateNormalFilter = GenerateNormalFilter;
    $.DisplacementFilter = DisplacementFilter;

})(window);