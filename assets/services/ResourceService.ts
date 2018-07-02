import {Promise} from 'es6-promise';

export class ResourceService {

  readJsonFile(path) {
    return new Promise<any>((resolve) => {
      cc.loader.loadRes(path, function (err, res) {
        resolve(res);
      });
    });
  }

  static instance: ResourceService;

  static getInstance(): ResourceService {
    if (!ResourceService.instance) {
      ResourceService.instance = new ResourceService();
    }

    return ResourceService.instance;
  }
}