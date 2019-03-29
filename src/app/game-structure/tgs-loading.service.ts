import { Injectable } from '@angular/core';
import { GameManager, GameSequence } from 'tgs-core';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class TgsLoadingService extends GameManager {

  constructor(
    public electronService: ElectronService
  ) {
    super({
      assetsFolder: "assets/",
      rootSequence: "test_sauts_de_lignes"
    });

    this.init();
  }

  loadFile(path: string): Promise<GameSequence> {
    if (!this.electronService.isElectronApp) {
      return super.loadFile(path);
    } else {
      return new Promise<GameSequence>((success: Function) => {
        let fs = this.electronService.remote.require("fs");
        let localPath: string = "/assets/tgs/" + path + ".tgs";

        fs.readFile(localPath, (fail, resp) => {
          console.log(fail);
          console.log(resp);
        });

        console.log(localPath);
      });
    }
  }
}
