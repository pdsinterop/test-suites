import { GUI_TYPE_REVANC } from "../guiTypes";
import { NextcloudClient } from "./nextcloud";


export class RevancClient extends NextcloudClient {
  constructor(params) {
    super(params)
    this.guiType = GUI_TYPE_REVANC;
  }
}