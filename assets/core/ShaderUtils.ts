import {Promise} from 'es6-promise';

var GLProgram = (<any>cc).GLProgram;
var GLProgramState = (<any>cc).GLProgramState;

export class Shader {
  name: string;
  vert: string;
  frag: string;
}

export class ShaderUtils extends cc.Component {

  _program;
  static shaders = {};
  currentShader: Shader;

  static getShader(shaderName) {
    if (!this.shaders[shaderName]) {
      let shader = new Shader();
      shader.name = shaderName;
      this.shaders[shaderName] = shader;
    }
    return this.shaders[shaderName];
  }

  static loadShader(shaderName, vertFile, fragFile) {
    return new Promise<any>((resolve) => {
      let loadCount = 0;
      let shader = this.getShader(shaderName);
      if (shader.vert && shader.frag) {
        resolve(shader);
        return;
      }
      let useLoadedShaders = () => {
        if (loadCount >= 2) {
          resolve(this.getShader(shaderName));
        }
      };

      cc.loader.loadRes(vertFile, (err, res) => {
        loadCount++;
        let shader = this.getShader(shaderName);
        shader.vert = res;
        useLoadedShaders();
      });
      cc.loader.loadRes(fragFile, (err, res) => {
        loadCount++;
        let shader = this.getShader(shaderName);
        shader.frag = res;
        useLoadedShaders();
      });
    });
  }

  setTexture(node, name, texture: cc.Texture2D) {
    // if (node._program) {
    //   if (cc.sys.isNative) {
    //     // let glProgram_state = GLProgramState.getOrCreateWithGLProgram(node._program);
    //     // glProgram_state.setUniformFloat(name, x);
    //   } else {
    //     let uniformName = node._program.getUniformLocationForName(name);
    //     node._program.setUniformLocationWith1f(uniformName, x);
    //   }
    // }
  }

  setUniformFloat(node, name, x) {
    if (node._program) {
      if (cc.sys.isNative) {
        let glProgram_state = GLProgramState.getOrCreateWithGLProgram(node._program);
        glProgram_state.setUniformFloat(name, x);
      } else {
        let uniformName = node._program.getUniformLocationForName(name);
        node._program.setUniformLocationWith1f(uniformName, x);
      }
    }
  }

  setUniformVec2(node, name, x, y) {
    if (node._program) {
      if (cc.sys.isNative) {
        let glProgram_state = GLProgramState.getOrCreateWithGLProgram(node._program);
        glProgram_state.setUniformVec2(name, {x, y});
      } else {
        let uniformName = node._program.getUniformLocationForName(name);
        node._program.setUniformLocationWith2f(uniformName, x, y);
      }
    }
  }

  setUniformVec3(node, name, x, y, z) {
    if (node._program) {
      if (cc.sys.isNative) {
        let glProgram_state = GLProgramState.getOrCreateWithGLProgram(node._program);
        glProgram_state.setUniformVec3(name, {x, y, z});
      } else {
        let uniformName = node._program.getUniformLocationForName(name);
        node._program.setUniformLocationWith3f(uniformName, x, y, z);
      }
    }
  }

  setUniformVec4(node, name, x, y, z, w) {
    if (node._program) {
      if (cc.sys.isNative) {
        let glProgram_state = GLProgramState.getOrCreateWithGLProgram(node._program);
        glProgram_state.setUniformVec4(name, {x, y, z, w});
      } else {
        let uniformName = node._program.getUniformLocationForName(name);
        node._program.setUniformLocationWith4f(uniformName, x, y, z, w);
      }
    }
  }
  static useShaderOnNode(node, shaderName) {
    node._program = new GLProgram();
    let shader = this.getShader(shaderName);
    if (!shader.vert || !shader.frag) return;

    node.currentShader = shader;
    if (cc.sys.isNative) {
      cc.log('use native GLProgram');
      node._program.initWithString(shader.vert, shader.frag);
      node._program.link();
      node._program.updateUniforms();
    } else {
      node._program.initWithVertexShaderByteArray(shader.vert, shader.frag);
      node._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
      node._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
      node._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
      node._program.link();
      node._program.updateUniforms();
      node._program.use();
    }
    ShaderUtils.setProgram((<any>node)._sgNode, node._program);
  }

  static setProgram(node, program) {
    if (cc.sys.isNative) {
      let glProgram_state = GLProgramState.getOrCreateWithGLProgram(program);
      node.setGLProgramState(glProgram_state);
    } else {
      node.setShaderProgram(program);
    }

    let children = node.children;
    if (!children)
      return;

    for (let i = 0; i < children.length; i++) {
      this.setProgram(children[i], program);
    }
  }
}