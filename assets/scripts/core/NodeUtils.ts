import {CString} from './String';
import {DialogService} from '../services/DialogService';

declare var gl;

export class NodeUtils {
  static nodes = [];

  static applyWebHover(node) {
    if (cc.sys.isBrowser && cc.game.canvas) {
      node.on('mouseenter', function (event) {
        cc.game.canvas.style.cursor = 'pointer';
      });
      node.on('mouseleave', function (event) {
        cc.game.canvas.style.cursor = 'auto';
      });
      NodeUtils.nodes.push(node);
    }
  }

  static applyWebHoverNodes(nodes) {
    for (let node of nodes) {
      NodeUtils.applyWebHover(node);
    }
  }

  static clearWebHover() {
    if (cc.game.canvas) {
      cc.game.canvas.style.cursor = 'auto';
      NodeUtils.nodes = [];
    }
  }

  static findNode(root: cc.Node, nodeName: string) {
    for (let child of root.children) {
      if (child && child.name == nodeName) {
        return child;
      } else if (child && child.childrenCount > 0) {
        let foundNode = NodeUtils.findNode(child, nodeName);
        if (foundNode)
          return foundNode;
      }
    }

    return null;
  }

  static swapParent(childNode: cc.Node, oldParent: cc.Node, newParent: cc.Node) {
    let worldPos = oldParent.convertToWorldSpaceAR(childNode.getPosition());
    let transferPos = newParent.convertToNodeSpaceAR(worldPos);
    childNode.removeFromParent(false);
    newParent.addChild(childNode);
    childNode.setPosition(transferPos);
  }

  static preventMultipleClick(btn: cc.Button, time = 0.3) {
    btn.interactable = false;
    btn.scheduleOnce(() => {
      btn.interactable = true;
    }, time);
  }

  static captureScreen(height = cc.winSize.height): any {
    if (cc.sys.isNative) {
    } else {
      let renderScreen = new (<any>cc).RenderTexture(cc.winSize.width, height, cc.Texture2D.PIXEL_FORMAT_RGBA8888);
      // renderScreen.setAutoDraw(true);
      renderScreen.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
      renderScreen.begin();
      (<any>cc.director).getRunningScene().visit();
      // (<any>node)._sgNode.visit();
      renderScreen.end();
      let texture = renderScreen.getSprite().getTexture();
      let canvas = NodeUtils.createCanvasFromTexture(texture, texture.width, texture.height);
      let image = NodeUtils.getImageFromCanvas(canvas);
      return image.src;
    }
  }

  static createCanvasFromTexture(texture: cc.Texture2D, width, height) {
    let webGlTexture = (<any>texture)._webTextureObj;
    if (!webGlTexture) return;
    // Create a framebuffer backed by the texture
    let framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, webGlTexture, 0);

    // Read the contents of the framebuffer
    let data = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.deleteFramebuffer(framebuffer);

    // Flip horizontal
    for (let index = 0; index < data.length / 2; index++) {
      let row = Math.floor(index / (width * 4));
      let col = index % (width * 4);
      let newIndex = (height - row - 1) * width * 4 + col;
      let temp = data[index];
      data[index] = data[newIndex];
      data[newIndex] = temp;
    }

    // Create a 2D canvas to store the result
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let context = canvas.getContext('2d');

    // Copy the pixels to a 2D canvas
    let imageData = context.createImageData(width, height);
    imageData.data.set(data);
    context.putImageData(imageData, 0, 0);

    return canvas;
  }

  static getBlobFromCanvas(canvas) {
    var dataURL = canvas.toDataURL('image/jpeg', 1.0)
    var byteString = atob(dataURL.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: 'image/jpeg'});
  }

  static getImageFromCanvas(canvas) {
    var img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  static getSpriteFrameFromImageData(imageData): Promise<cc.SpriteFrame> {
    return new Promise<cc.SpriteFrame>((resolve) => {
      let imgElement = new Image();
      imgElement.onload = () => {
        let texture = new cc.Texture2D();
        texture.initWithElement(imgElement);
        texture.handleLoadedTexture();
        let spriteFrame = new cc.SpriteFrame(texture);
        resolve(spriteFrame);
      };
      imgElement.src = imageData;
    });
  }

  static setRemoteImage(sprite, imageUrl) {
    if (cc.sys.isNative) {
      let hasTexture = false;
      let setTexture = () => {
        let texture = cc.textureCache.getTextureForKey(imageUrl);
        if (texture && !hasTexture) {
          hasTexture = true;
          sprite.spriteFrame = new cc.SpriteFrame(texture);
        }
      };

      if (cc.textureCache.getTextureForKey(imageUrl)) {
        setTexture();
        return;
      }
      (<any>cc).SimpleNativeClass.addTexture2DFromURL(imageUrl);
      setTexture();

      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          setTexture();
        }, 100 * i);
      }
    } else {
      CString.imageURLToBase64(imageUrl)
        .then(NodeUtils.getSpriteFrameFromImageData)
        .then((sp: cc.SpriteFrame) => {
          sprite.spriteFrame = sp;
        });
    }
  }

  static convertNodeSpaceToNodeSpace(position: cc.Vec2, source: cc.Node, target: cc.Node): cc.Vec2 {
    let temp: cc.Vec2 = source.convertToWorldSpaceAR(position);
    return target.convertToNodeSpaceAR(temp);
  }

  static loadAvatar(sprite, avatar) {
    if (sprite.loadedAvatar && sprite.loadedAvatar == avatar) {
      return;
    }

    sprite.loadedAvatar = avatar;
    if (typeof avatar == 'string' && avatar.indexOf('http') >= 0) {
      // avatar = avatar.indexOf('?') >= 0 ? avatar + '&t=' + Date.now() : avatar + '?t=' + Date.now();
      // NodeUtils.setRemoteImage(sprite, avatar);
      cc.loader.load(avatar, (err, texture) => {
        sprite.spriteFrame = new cc.SpriteFrame(texture);
      });
    } else {
      cc.loader.loadRes('textures/avatars/avatar_' + avatar, cc.SpriteFrame, (err, spriteFrame) => {
        sprite.spriteFrame = spriteFrame;
      });
    }
  }

  static setLabel(rootNode, nodeName, value) {
    let node = NodeUtils.findNode(rootNode, nodeName);
    if (node) {
      let lbl: cc.Label = node.getComponent(cc.Label);
      let editBox: cc.EditBox = node.getComponent(cc.EditBox);
      let labelStr = value !== undefined && value !== null ? value : '';

      if (lbl) {
        lbl.string = labelStr;
      }
    }
  }
}