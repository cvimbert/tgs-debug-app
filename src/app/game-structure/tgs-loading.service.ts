import { Injectable } from '@angular/core';
import { GameManager } from 'tgs-core';

@Injectable({
  providedIn: 'root'
})
export class TgsLoadingService extends GameManager {

  constructor() {
    super({
      assetsFolder: "assets/",
      rootSequence: "interrogatoire1"
    });
  }
}
