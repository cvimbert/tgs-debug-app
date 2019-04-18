import { Injectable } from '@angular/core';
import { GameManager, GameSequence } from 'tgs-core';
import { ElectronService } from 'ngx-electron';
import { MainStructure } from 'tgs-model';
import { ParsingResult } from 'tgs-parser';

@Injectable({
  providedIn: 'root'
})
export class TgsLoadingService extends GameManager {

  mode: string;
  rawContent: string;

  constructor(
    public electronService: ElectronService
  ) {
    super({
      assetsFolder: "assets/",
      rootSequence: "index"
    });
  }

  modeInit(mode: string, content: string) {
    if (mode === "normal") {
      this.init();
    } else if (mode === "debug") {
      console.log(content);
      let result: ParsingResult = this.parser.parseTGSString(content);
      let structure: MainStructure = MainStructure.loadFromParsingResult(result);
      this.sequence = new GameSequence(structure, this);
      this.loading = false;
      //this.init();
    }
  }

  loadFile(path: string): Promise<GameSequence> {

    if (this.mode === "debug") {
      return new Promise<GameSequence>((resolve: Function, reject: Function) => {
        console.log(this.rawContent);
        let result: ParsingResult = this.parser.parseTGSString(this.rawContent);
        let structure: MainStructure = MainStructure.loadFromParsingResult(result);
        this.sequence = new GameSequence(structure, this);
        console.log(structure);
        this.loading = false;
        resolve(this.sequence);
      });
      
    } else {
      if (!this.electronService.isElectronApp) {
        return super.loadFile(path);
      } else {
        return new Promise<GameSequence>((resolve: Function, reject: Function) => {
          let fs = this.electronService.remote.require("fs");
          let localPath: string = "./" + this.configuration.assetsFolder + "tgs/" + path + ".tgs";
  
          fs.readFile(localPath, "utf8", (fail: string, resp: string) => {
            
            if (fail) {
              reject(fail);
            } else {
              let result: ParsingResult = this.parser.parseTGSString(resp);
              let structure: MainStructure = MainStructure.loadFromParsingResult(result);
              this.sequence = new GameSequence(structure, this);
              this.loading = false;
              resolve(this.sequence);
            }
          });
  
          console.log(localPath);
        });
      }
    }
    
  }
}
