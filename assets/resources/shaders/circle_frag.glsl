#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texCoord;
varying vec4 v_fragmentColor;

void main()
{
    vec4 color = texture2D(CC_Texture0, v_texCoord);
    float length = sqrt(pow(abs(v_texCoord.x-0.5), 2.0) + pow(abs(v_texCoord.y-0.5), 2.0));
    if (length > 0.5) {
        color.a = 1.0 - smoothstep(0.49, 0.5, length);
    }

    color = color * v_fragmentColor;
    gl_FragColor = color;
}
