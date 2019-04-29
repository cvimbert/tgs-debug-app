import { Injectable } from '@angular/core';
import { GameManager, GameSequence, GameMode } from 'tgs-core';
import { ElectronService } from 'ngx-electron';
import { MainStructure } from 'tgs-model';
import { ParsingResult } from 'tgs-parser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TgsLoadingService extends GameManager {

  rawContent: string;

  history: string[] = [];
  historyIndex = 0;

  constructor(
    public electronService: ElectronService,
    private router: Router
  ) {
    super({
      assetsFolder: "assets/",
      rootSequence: "index"
    });
  }

  modeInit(mode: string, content: string) {
    if (mode === GameMode.NORMAL) {
      this.init();
    } else if (mode === GameMode.DEBUG) {
      console.log(content);
      let result: ParsingResult = this.parser.parseTGSString(content);
      let structure: MainStructure = MainStructure.loadFromParsingResult(result);
      this.sequence = new GameSequence(structure, this);
      this.loading = false;
      //this.init();
    }
  }

  goBackInHistory() {
    this.historyIndex--;
    this.navigateTo(this.history[this.historyIndex]);
  }

  goNextInHistory() {
    this.historyIndex++;
    this.navigateTo(this.history[this.historyIndex]);
  }
  
  navigateTo(path: string) {
    this.router.navigate(["editor"], {
      queryParams: {
        path: path
      }
    });
  }

  registerSequence(path: string) {

    if (history.length === 0 || this.history[this.historyIndex] !== path) {
      this.history.splice(this.historyIndex + 1);
      this.history.push(path);
      this.historyIndex = this.history.length - 1;
    }

    //console.log(this.history);

    super.registerSequence(path);
  }

  get hasBack(): boolean {
    return this.historyIndex > 0;
  }

  get hasNext(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  deleteSequenceFile(filePath: string) {
    if (!this.electronService.isElectronApp) {
      let sequences: string[] = this.getRegisteredSequencesList();
      let index = sequences.indexOf(filePath);

      //console.log(filePath);

      if (index !== -1) {
        sequences.splice(index, 1);
        localStorage.setItem("sequences", JSON.stringify(sequences));
        localStorage.removeItem("editor-" + filePath);
      }
    }
  }

  loadFile(path: string): Promise<GameSequence> {

    if (this.mode === GameMode.DEBUG) {
      return new Promise<GameSequence>((resolve: Function, reject: Function) => {
        //console.log(this.rawContent);
        let result: ParsingResult = this.parser.parseTGSString(this.rawContent);
        let structure: MainStructure = MainStructure.loadFromParsingResult(result);
        this.sequence = new GameSequence(structure, this);
        //console.log(structure);
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
