#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texCoord;
varying vec4 v_fragmentColor;

void main()
{
    vec4 color = texture2D(CC_Texture0, v_texCoord);
    color = color * v_fragmentColor;
    float grey = (color.r + color.g + color.b) / 3.0;
    float alpha = color.a;
    if (alpha > 0.01) {
        alpha += 1.0;
    }


    color = vec4(0.2, 0.2, 0.2, alpha);
    gl_FragColor = color;
}
