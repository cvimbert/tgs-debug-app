import { Injectable } from '@angular/core';
import { GameManager } from 'tgs-core';
import { TgsMainService } from './tgs-main.service';

@Injectable({
  providedIn: 'root'
})
export class TgsLoadingService extends GameManager {

  constructor() {
    super({
      assetsFolder: "assets/",
      rootSequence: "sequence1"
    });
  }
}
