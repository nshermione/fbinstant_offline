export class ModelUtils {
  static merge(oldModel, newModel) {
    let keys = Object.keys(newModel);
    for (let key of keys) {
      oldModel[key] = newModel[key];
    }
  }
}