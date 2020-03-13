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


export const ShaderSources = {
    displacement: {
        vertex: vertex,
        fragment: fDisplace
    },
    generateNormal: {
        vertex: vertex,
        fragment: fGenerateNormal
    }
}