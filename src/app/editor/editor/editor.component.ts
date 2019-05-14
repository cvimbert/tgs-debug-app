import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TGSParser, ParsingResult } from 'tgs-parser';
import { MainStructure, GameBlockModel } from 'tgs-model';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TgsLoadingService } from 'src/app/game-structure/tgs-loading.service';
import { ExternalNavigation } from '../interfaces/external-navigation.interface';
import { LogsViewerComponent } from 'src/app/game-structure/logs-viewer/logs-viewer.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  animations: [
    trigger("message", [
      state("hidden", style({
        opacity: 0,
        transform: 'translateY(100px)'
      })),
      state("visible", style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition("hidden => visible", [
        animate("0.3s ease-out")
      ]),
      transition("visible => hidden", [
        animate("0.3s ease-out")
      ]),
    ])
  ]
})
export class EditorComponent implements OnInit {

  content: string;
  currentPath: string = "";

  navigationActivated: boolean = false;
  selectedLink: HTMLElement;

  listenLink: boolean = false;

  mainModel: MainStructure;
  currentBlock: GameBlockModel;

  bdSubject: Subject<number> = new Subject();

  selectedDisplayPanel: string = "display";
  managerDisplayed = false;

  private initialized: boolean = false;

  messageText: string;
  messageState = "hidden";

  @ViewChild("editor") editor: CodemirrorComponent;
  @ViewChild("logs") logsPanel: LogsViewerComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private tgsService: TgsLoadingService,
    private electronService: ElectronService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentPath = params["path"];

      if (!this.currentPath) {
        this.router.navigate(["editor"], {
          queryParams: {
            path: "index"
          }
        });
      } else {
        this.tgsService.registerSequence(this.currentPath);

        this.tgsService.rawContent = "";
        // this.tgsService.resetGame();

        this.tgsService.getFileContent(this.currentPath).then(content => {
          
          this.content = content;

          this.tgsService.rawContent = this.content;
  
          this.refreshInspector();
          this.selectBlockByCursorPos(0);
    
          // Code TOUPOURI(TM)
          setTimeout(() => {
            this.editor.codeMirror.refresh();
            this.editor.codeMirror.getDoc().clearHistory();
  
            // Pourquoi un reload ?
            this.reloadGameDisplay();
  
          }, 500);
        });


        //this.content = localStorage.getItem("editor-" + this.currentPath) || "#index\n\n\tTxt...\n";
      }
    });

    this.bdSubject.subscribe(pos => {

      if (this.tgsService.rawContent !== "") {
        this.refreshInspector();
        this.selectBlockByCursorPos(pos);
      }
      
    });
  }

  get isModelValid(): boolean {
    return this.mainModel ? this.mainModel.valid : false;
  }

  goBack() {
    this.tgsService.goBackInHistory();
  }

  goNext() {
    this.tgsService.goNextInHistory();
  }

  get hasBack(): boolean {
    return this.tgsService.hasBack;
  }

  get hasNext(): boolean {
    return this.tgsService.hasNext;
  }

  save() {
    this.tgsService.save(this.currentPath, this.content).then(() => this.displayMessage("Saved!"));
  }

  displayMessage(txt: string, duration: number = 2000) {
    this.messageText = txt;
    this.messageState = "visible";

    setTimeout(() => {
      this.messageState = "hidden";
    }, duration);
  }

  goBackToGame() {
    this.save();
    this.router.navigate(["/"]);
    this.save();
  }

  // Plus utile
  goBackInHistory() {
    this.save();

    // à voir avec angular
    window.history.back();
  }

  setBlockScroll(block: GameBlockModel) {
    let startLine: number = this.getPosition(block.startIndex)["line"];
    let endLine: number = this.getPosition(block.endIndex)["line"] + 1;

    this.editor.codeMirror.scrollIntoView({
      from: {
        line: startLine,
        ch: 0
      },
      to: {
        line: endLine,
        ch: 0
      },
    }, 100);
  }

  onExternalNavigation(navigationData: ExternalNavigation) {
    this.router.navigate(["editor"], {
      queryParams: {
        path: navigationData.globalRef,
        block: navigationData.localRef
      }
    });

    this.save();
  }

  refreshInspector() {
    if (this.content && this.content !== "") {
      let parser: TGSParser = new TGSParser();
      let result: ParsingResult = parser.parseTGSString(this.content);
      this.mainModel = MainStructure.loadFromParsingResult(result);
    }
  }

  selectBlockByCursorPos(index: number) {

    if (!this.mainModel) return;

    let blockNum = 0;

    for (let block of this.mainModel.blocksArray) {

      let endIndex = blockNum < this.mainModel.blocksArray.length - 1 ? this.mainModel.blocksArray[blockNum + 1].startIndex : this.content.length;

      if (index >= block.startIndex && index < endIndex) {

        if (block !== this.currentBlock) {
          this.highlightSelectedBlockLines(block);
        }
        
        this.currentBlock = block;

        

        this.ref.detectChanges();
        return;
      }

      blockNum++;
    }
  }

  highlightSelectedBlockLines(block: GameBlockModel): number[] {
    let lines: number[] = [];

    let pos: any = this.editor.codeMirror.getDoc().getCursor();
    let startLine = this.getPosition(block.startIndex)["line"];

    let blockIndex = this.mainModel.blocksArray.indexOf(block);

    let endLine = (blockIndex >=  this.mainModel.blocksArray.length - 1) ? this.getPosition(block.endIndex)["line"] : (this.getPosition(this.mainModel.blocksArray[blockIndex + 1].startIndex))["line"] - 1;

    let doc = this.editor.codeMirror.getDoc();

    for (let i: number = 0; i < doc.lineCount(); i++) {
      (doc as any).removeLineClass(i, "background", "selected");
    }

    for (let i: number = startLine; i <= endLine; i++) {
      lines.push(i);
      (doc as any).addLineClass(i, "background", "selected");
    }



    console.log(lines);

    return lines;
  }

  onCursorActivity(evt: any) {
    let pos: any = evt.getDoc().getCursor();
    let charPos = this.convertLineAndChToPosition(pos.line, pos.ch);
    this.selectBlockByCursorPos(charPos);
    this.bdSubject.next(charPos);

    if (!this.initialized) {
      this.editor.codeMirror.refresh();
      this.initialized = true;
    }
    
  }

  convertLineAndChToPosition(line: number, ch: number): number {

    let count: number = 0;

    for (let i: number = 0; i < line; i++) {
      count += this.editor.codeMirror.getDoc().getLine(i).length + 1;
    }

    return count + ch;
  }

  setCursorPos(index: number) {
    //console.log("Content", this.content.length);

    let count = 0;
    let lineNum = 0;

    if (!this.editor.codeMirror) return;

    this.editor.codeMirror.getDoc().eachLine(line => {
      let newCount = count + line.text.length + 1;

      if (index >= count && index < newCount) {
        this.editor.codeMirror.getDoc().setCursor(lineNum, index - count, {
          scroll: true
        });
      }
      
      count = newCount;
      lineNum++;
    });

    //console.log("Count", count - 1);
  }

  getPosition(index: number): Object {
    let count = 0;
    let lineNum = 0;

    let res: Object = {};

    if (!this.editor.codeMirror) return;

    this.editor.codeMirror.getDoc().eachLine(line => {
      let newCount = count + line.text.length + 1;

      if (index >= count && index < newCount) {
        res = {
          line: lineNum,
          char: index - count
        }
      }
      
      count = newCount;
      lineNum++;
    });

    return res;
  }

  selectBlock(model: GameBlockModel) {
    this.editor.codeMirror.focus();

    this.highlightSelectedBlockLines(model);
    
    this.currentBlock = model;
   
    this.setCursorPos(model.startIndex);
    this.setBlockScroll(model);
  }

  onKeyHandled(key: string) {
    console.log(key);
  }

  @HostListener('window:keydown', ['$event'])
  onkeyDown(evt: KeyboardEvent) {
    if (evt.key === "Control") {
      this.navigationActivated = true;
      this.checkLink();
    }
  }

  @HostListener('window:keyup', ['$event'])
  onkeyUp(evt: KeyboardEvent) {
    if (evt.key === "Control") {
      this.navigationActivated = false;
      this.uncheckLink();
    }

    if (this.electronService.isElectronApp) {

      if (evt.ctrlKey) {
        switch(evt.key) {
          case "s":
            this.save();
            break;
        }
      }
      
    }
  }

  @HostListener('mouseover', ['$event'])
  rollOverLink(evt: MouseEvent) {
    let element = evt.target as HTMLElement;
    if (element.classList.contains("cm-linkref") || element.classList.contains("cm-linkref-local")) {
      this.selectedLink = element;
      this.checkLink();
    }
  }

  @HostListener('mouseout', ['$event'])
  rollOutLink(evt: MouseEvent) {
    let element = evt.target as HTMLElement;
    if (element.classList.contains("cm-linkref") || element.classList.contains("cm-linkref-local")) {
      this.uncheckLink();
      this.selectedLink = null;
    }
  }

  @HostListener('click', ['$event'])
  testLinkClick(evt: MouseEvent) {
    if (this.selectedLink && this.navigationActivated) {
      this.linkClick(evt);
    }
  }

  checkLink() {
    if (this.selectedLink && this.navigationActivated && !this.listenLink) {
      this.selectedLink.classList.add("cm-underline");
      this.listenLink = true;
    }
  }

  uncheckLink() {
    if (this.listenLink) {
      this.listenLink = false;
      this.selectedLink.classList.remove("cm-underline");
    }
  }

  reloadGameDisplay() {
    this.tgsService.rawContent = this.content;
    this.tgsService.refreshGame();
  }

  resetGameDisplay() {
    this.tgsService.rawContent = this.content;
    this.tgsService.resetGame();
  }

  onNavigation(path: string) {
    this.router.navigate(["editor"], {
      queryParams: {
        path: path
      }
    });

    this.managerDisplayed = false;
    this.save();
  }

  clearLogs() {
    this.logsPanel.clearLogs();
  }

  openDevTools() {
    // console.log("open dev tools");
    if (this.electronService.isElectronApp) {
      // console.log("ici");
      this.electronService.remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
    }
  }

  linkClick(evt: MouseEvent) {
    let element: HTMLElement = evt.target as HTMLElement;

    let linkExp = /([A-Za-z0-9-\/]+)?(?:#([A-Za-z0-9-]+))?/;

    let res = linkExp.exec(element.innerHTML);

    let path = res[1];
    let blockId = res[2];

    // trois cas
    if (blockId && !path) {
      // lien local, on checke si le bloc existe

      if (this.mainModel.blocks[blockId]) {
        // on y positionne le curseur
        this.selectBlock(this.mainModel.blocks[blockId]);
      } else {
        // on crée un nouveau block (pour l'instant à la fin)
        this.content += "\n\n#" + blockId + "\n\n\tTxt...\n";

        // et on positionne le curseur à la fin de ce block
        this.refreshInspector();

        setTimeout(() => {
          this.selectBlock(this.mainModel.blocks[blockId]);
        });
      }

    } else if (!blockId && path) {
      // lien externe sans blockId
      this.router.navigate(["editor"], {
        queryParams: {
          path: path
        }
      });

      this.save();

    } else if (blockId && path) {
      // lien externe et blockId
      this.router.navigate(["editor"], {
        queryParams: {
          path: path,
          block: blockId
        }
      });

      this.save();
    }
  }
}
