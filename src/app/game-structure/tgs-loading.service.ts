import { Injectable } from '@angular/core';
import { GameManager } from 'tgs-core';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class TgsLoadingService extends GameManager {

  constructor(
    private electronService: ElectronService
  ) {
    super({
      assetsFolder: "assets/",
      rootSequence: "test_sauts_de_lignes"
    });

    console.log(electronService.remote.require("fs"));
  }
}
