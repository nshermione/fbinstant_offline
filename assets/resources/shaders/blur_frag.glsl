#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

#define PROCESSING_TEXTURE_SHADER

const float pi = 3.14159265;
const float MAX_ITERATIONS = 100.0;

uniform float sigma;
uniform float blurSize;
uniform vec2 texOffset;

varying vec2 v_texCoord;
varying vec4 v_fragmentColor;


void main()
{
    float numBlurPixelsPerSide = float(blurSize / 2.0);
    float horizontalPass = 0.0;
    vec2 blurMultiplyVec = 0.0 < horizontalPass ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

    // Incremental Gaussian Coefficent Calculation (See GPU Gems 3 pp. 877 - 889)
    vec3 incrementalGaussian;
    incrementalGaussian.x = 1.0 / (sqrt(2.0 * pi) * sigma);
    incrementalGaussian.y = exp(-0.5 / (sigma * sigma));
    incrementalGaussian.z = incrementalGaussian.y * incrementalGaussian.y;

    vec4 avgValue = vec4(0.0, 0.0, 0.0, 0.0);
    float coefficientSum = 0.0;

    // Take the central sample first...
    avgValue += texture2D(CC_Texture0, v_texCoord.st) * incrementalGaussian.x;
    coefficientSum += incrementalGaussian.x;
    incrementalGaussian.xy *= incrementalGaussian.yz;

    // Go through the remaining 8 vertical samples (4 on each side of the center)
    for (float i = 1.0; i < MAX_ITERATIONS; i++) {
        if (i > numBlurPixelsPerSide){
            break;
        }
        avgValue += texture2D(CC_Texture0, v_texCoord.st - i * texOffset *
                              blurMultiplyVec) * incrementalGaussian.x;
        avgValue += texture2D(CC_Texture0, v_texCoord.st + i * texOffset *
                              blurMultiplyVec) * incrementalGaussian.x;
        coefficientSum += 2.0 * incrementalGaussian.x;
        incrementalGaussian.xy *= incrementalGaussian.yz;
    }

    gl_FragColor = avgValue / coefficientSum;
//    gl_FragColor = texture2D(CC_Texture0, v_texCoord).rgba;
}
