import {Promise} from 'es6-promise';

export interface ImageForm {
  name: string;
  dataImg: string;
}

export class HttpService {

  appendURLParam(key, value) {
    if (!cc.sys.isNative) {
      let uri = this.getURLWithParam(key, value);
      let history = parent.history || window.history;
      if (history.pushState) {
        history.pushState({path: uri}, '', uri);
      }
    }
  }

  getURLWithParam(key: any, value: any): string {
    let location = parent.location || window.location;
    let uri = location.href;
    var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    var separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) {
      uri = uri.replace(re, '$1' + key + '=' + value + '$2');
    }
    else {
      uri = uri + separator + key + '=' + value;
    }
    return uri;
  }

  removeUrlParam(key) {
    if (!cc.sys.isNative) {
      let location = parent.location || window.location;
      let history = parent.history || window.history;
      let url = location.href;
      let hashParts = url.split('#');
      let regex = new RegExp('([?&])' + key + '=.*?(&|#|$)', 'i');
      if (hashParts[0].match(regex)) {
        //REMOVE KEY AND VALUE
        url = hashParts[0].replace(regex, '$1');
        //REMOVE TRAILING ? OR &
        url = url.replace('/([?&])$/', '');
        //ADD HASH
        if (typeof hashParts[1] !== 'undefined' && hashParts[1] !== null) {
          url += '#' + hashParts[1];
        }
      }
      if (history.pushState) {
        history.pushState({path: url}, '', url);
      }
    }
  }

  getURLParam(name, defaultValue?) {
    if (!cc.sys.isNative) {
      let location = parent.location || window.location;
      let url = location.href;
      name.replace(/[\[\]]/g, '\\$&');
      let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
      if (!results) return defaultValue;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
  }

  postImageForm(url, imageForm: ImageForm) {
    return new Promise<any>((resolve, reject) => {
      if (cc.sys.isNative) {
        let boundary = '----WebKitFormBoundaryjnX5pEwEV9cFzRIW';
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
        xhr.onload = () => {
          cc.log('POST RESPONSE: ', xhr.responseText);
          resolve(JSON.parse(xhr.responseText));
        };
        xhr.onerror = (err) => {
          cc.log('POST ERROR: ', err);
          reject(err);
        };
        let body = '\r\n--' + boundary + '\r\n';
        body = body + 'Content-Disposition: form-data; name="dataImg"\r\n\r\n';

        //Then append the file data and again the boundary
        body = body + imageForm.dataImg;
        body = body + '\r\n' + `--${boundary}
Content-Disposition: form-data; name="name"

${imageForm.name}
--${boundary}--`;

        cc.log('POST REQUEST: ', imageForm.dataImg);
        xhr.send(body);
      } else {
        let formData = new FormData();
        formData.append('dataImg', imageForm.dataImg);
        formData.append('name', imageForm.name);
        cc.log('POST REQUEST: ', imageForm);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onload = () => {
          cc.log('POST RESPONSE: ', xhr.responseText);
          resolve(JSON.parse(xhr.responseText));
        };
        xhr.onerror = (err) => {
          cc.log('POST ERROR: ', err);
          reject(err);
        };
        cc.log('POST REQUEST: ', formData);
        xhr.send(formData);
      }

    });
  }

  post(url, data) {
    return new Promise<any>((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = () => {
        cc.log('POST RESPONSE: ', xhr.responseText);
        resolve(JSON.parse(xhr.responseText));
      };
      xhr.onerror = (err) => {
        cc.log('POST ERROR: ', err);
        reject(err);
      };
      cc.log('POST REQUEST: ', JSON.stringify(data));
      xhr.send(JSON.stringify(data));
    });
  }

  createURLWithParams(url: string, data: any): string {
    let ret = [];
    for (let d in data) {
      ret.push(d + '=' + encodeURIComponent(data[d]));
    }
    return url + '?' + ret.join('&');
  }

  requestFullscreen() {
    if (document.body) {
      let requestFullScreen = document.body.webkitRequestFullscreen || (<any>document).body.mozRequestFullscreen || (<any>document).body.msRequestFullscreen || (<any>document).body.requestFullscreen;
      if (requestFullScreen) {
        requestFullScreen();
      }
    }
  }

  copyText(text) {
    let doc = parent.document || window.document;
    let win = parent.window || window;
    let newDiv = doc.createElement('input');
    // newDiv.style.userSelect = 'text';
    newDiv.setAttribute('readonly', 'true');
    newDiv.setAttribute('contenteditable', 'false');
    newDiv.setAttribute('value', text);
    doc.body.appendChild(newDiv);
    newDiv.select();

    let range = document.createRange();
    range.selectNodeContents(newDiv);
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    newDiv.setSelectionRange(0, 999999);

    try {
      // Now that we've selected the anchor text, execute the copy command  
      let successful = doc.execCommand('copy');
      let msg = successful ? 'successful' : 'unsuccessful';
      // console.log(msg);
    } catch (err) {
      // console.error(err);
    }

    // Remove the selections - NOTE: Should use
    // removeRange(range) when it is supported
    doc.body.removeChild(newDiv);
    win.getSelection().removeAllRanges();
  }

  private static instance: HttpService;

  static getInstance(): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService();
    }

    return HttpService.instance;
  }
}