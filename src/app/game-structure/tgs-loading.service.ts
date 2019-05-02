import { Injectable } from '@angular/core';
import { GameManager, GameSequence, GameMode, SequenceItem, SequenceItemType } from 'tgs-core';
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

  tgsAssetsPath = "src/assets/tgs/";

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

    if (!this.electronService.isElectronApp) {
      super.registerSequence(path);
    }
    
  }

  get hasBack(): boolean {
    return this.historyIndex > 0;
  }

  get hasNext(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  deleteSequenceFile(filePath: string): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      if (!this.electronService.isElectronApp) {
        let sequences: string[] = this.getRegisteredSequencesList();
        let index = sequences.indexOf(filePath);
  
        //console.log(filePath);
  
        if (index !== -1) {
          sequences.splice(index, 1);
          localStorage.setItem("sequences", JSON.stringify(sequences));
          localStorage.removeItem("editor-" + filePath);
          resolve();
        }
      } else {
        //console.log("path", this.tgsAssetsPath + filePath);

        let fs = this.electronService.remote.require("fs");
        let mpath = this.tgsAssetsPath + filePath;

        console.log("deleted", mpath);

        fs.unlink(mpath, (err: Error) => {
          console.log(err);
          if (err) reject(); else resolve();
        });
      }
    });

    
  }

  getFileContent(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {

      if (this.electronService.isElectronApp) {
        let fs = this.electronService.remote.require("fs");

        // console.log(path);

        fs.readFile(this.tgsAssetsPath + path + ".tgs", "utf8", (err: Error, data: string) => {
          if (err) {

            // le fichier n'existe pas...
            console.log("le fichier n'existe pas...", err);
            resolve("#index\n\n\tTxt...\n");
            //console.log(err);
            //reject(err);
          }

          if (data) {
            resolve(data);
          }
        });

      } else {
        resolve(localStorage.getItem("editor-" + path) || "#index\n\n\tTxt...\n");
      }
    });
  }


  save(path: string, content: string): Promise<void> {

    return new Promise<void>((resolve, reject) => {

      if (this.electronService.isElectronApp) {

        let fs = this.electronService.remote.require("fs");

        let mpath = this.tgsAssetsPath + path + ".tgs";

        fs.writeFile(mpath, content, (err: Error) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        });
        
      } else {
        localStorage.setItem("editor-" + path, content);
        resolve();
      }
    });

  }


  getFolderContent(path: string): Promise<SequenceItem[]> {

    if (this.electronService.isElectronApp) {
      return new Promise((resolve: Function, reject: Function) => {
        let res: SequenceItem[] = [];

        let fs: any = this.electronService.remote.require("fs");
  
        let mpath: string = this.tgsAssetsPath + path;
  
        fs.readdir(mpath, (err: any, files: string[]) => {
  
          if (err) {
            console.log("reject");
            reject(err);
          }
  
          if (files) {

            if (files.length === 0) {
              resolve([]);
            }

            files.forEach((file, index) => {
              let filePath = mpath + "/" + file;
    
              fs.lstat(filePath, (err: string, stats: any) => {
                
                res.push({
                  type: stats.isDirectory() ? SequenceItemType.FOLDER : SequenceItemType.FILE,
                  name: file
                });

                // y'a peut-être plus futé à faire
                if (index === files.length - 1) {
                  resolve(res);
                }
              });
            });
          }
        });
      });
    } else {
      return super.getFolderContent(path);
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
