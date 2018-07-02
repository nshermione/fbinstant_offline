import {Promise} from 'es6-promise';

var GLProgram = (<any>cc).GLProgram;
var GLProgramState = (<any>cc).GLProgramState;

export class Shader {
  name: string;
  vert: string;
  frag: string;
}

export class ShaderComponent extends cc.Component {

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

  setTexture(name, texture: cc.Texture2D) {
    // if (this._program) {
    //   if (cc.sys.isNative) {
    //     // let glProgram_state = GLProgramState.getOrCreateWithGLProgram(this._program);
    //     // glProgram_state.setUniformFloat(name, x);
    //   } else {
    //     let uniformName = this._program.getUniformLocationForName(name);
    //     this._program.setUniformLocationWith1f(uniformName, x);
    //   }
    // }
  }

  setUniformFloat(name, x) {
    if (this._program) {
      if (cc.sys.isNative) {
        let glProgram_state = GLProgramState.getOrCreateWithGLProgram(this._program);
        glProgram_state.setUniformFloat(name, x);
      } else {
        let uniformName = this._program.getUniformLocationForName(name);
        this._program.setUniformLocationWith1f(uniformName, x);
      }
    }
  }

  setUniformVec2(name, x, y) {
    if (this._program) {
      if (cc.sys.isNative) {
        let glProgram_state = GLProgramState.getOrCreateWithGLProgram(this._program);
        glProgram_state.setUniformVec2(name, {x, y});
      } else {
        let uniformName = this._program.getUniformLocationForName(name);
        this._program.setUniformLocationWith2f(uniformName, x, y);
      }
    }
  }

  setUniformVec3(name, x, y, z) {
    if (this._program) {
      if (cc.sys.isNative) {
        let glProgram_state = GLProgramState.getOrCreateWithGLProgram(this._program);
        glProgram_state.setUniformVec3(name, {x, y, z});
      } else {
        let uniformName = this._program.getUniformLocationForName(name);
        this._program.setUniformLocationWith3f(uniformName, x, y, z);
      }
    }
  }

  setUniformVec4(name, x, y, z, w) {
    if (this._program) {
      if (cc.sys.isNative) {
        let glProgram_state = GLProgramState.getOrCreateWithGLProgram(this._program);
        glProgram_state.setUniformVec4(name, {x, y, z, w});
      } else {
        let uniformName = this._program.getUniformLocationForName(name);
        this._program.setUniformLocationWith4f(uniformName, x, y, z, w);
      }
    }
  }

  static useShader(component: ShaderComponent, shaderName) {
    ShaderComponent.useShaderOnNode(component, shaderName, component.node);
  }

  static useShaderOnNode(component: ShaderComponent, shaderName, node: cc.Node) {
    component._program = new GLProgram();
    let shader = this.getShader(shaderName);
    if (!shader.vert || !shader.frag) return;

    component.currentShader = shader;
    if (cc.sys.isNative) {
      cc.log('use native GLProgram');
      component._program.initWithString(shader.vert, shader.frag);
      component._program.link();
      component._program.updateUniforms();
    } else {
      component._program.initWithVertexShaderByteArray(shader.vert, shader.frag);
      component._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
      component._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
      component._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
      component._program.link();
      component._program.updateUniforms();
      component._program.use();
    }
    component.setProgram((<any>node)._sgNode, component._program);
  }

  setProgram(node, program) {
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