import { Component, OnInit, HostListener, ViewChild, AfterContentInit, OnChanges, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TGSParser, ParsingResult } from 'tgs-parser';
import { MainStructure, GameBlockModel } from 'tgs-model';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { Subject, timer } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';
import { TgsLoadingService } from 'src/app/game-structure/tgs-loading.service';
import { ExternalNavigation } from '../interfaces/external-navigation.interface';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
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

  private initialized: boolean = false;

  @ViewChild("editor") editor: CodemirrorComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private tgsService: TgsLoadingService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentPath = params["path"];

      // ici
      this.content = localStorage.getItem("editor-" + this.currentPath) || "#index";


      
      this.refreshInspector();
      this.selectBlockByCursorPos(0);

      // Code TOUPOURI(TM)
      setTimeout(() => {
        this.editor.codeMirror.refresh();
      }, 500);
    });

    this.bdSubject.pipe(debounceTime(1000)).subscribe(pos => {
      this.refreshInspector();
      this.selectBlockByCursorPos(pos);
    });
  }

  save() {
    localStorage.setItem("editor-" + this.currentPath, this.content);
  }

  goBackToGame() {
    this.save();
    this.router.navigate(["/"]);
  }

  goBackInHistory() {
    this.save();

    // à voir avec angular
    window.history.back();
  }

  onExternalNavigation(navigationData: ExternalNavigation) {
    this.router.navigate(["editor"], {
      queryParams: {
        path: navigationData.globalRef,
        block: navigationData.localRef
      }
    });
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

      if (index >= block.startIndex && index <= endIndex) {
        this.currentBlock = block;
        this.ref.detectChanges();
        return;
      }

      blockNum++;
    }
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

  selectBlock(model: GameBlockModel) {
    this.editor.codeMirror.focus();
    this.setCursorPos(model.endIndex);
    this.currentBlock = model;
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
  }

  @HostListener('mouseover', ['$event'])
  rollOverLink(evt: MouseEvent) {
    let element = evt.target as HTMLElement;
    if (element.classList.contains("cm-linkref")) {
      this.selectedLink = element;
      this.checkLink();
    }
  }

  @HostListener('mouseout', ['$event'])
  rollOutLink(evt: MouseEvent) {
    let element = evt.target as HTMLElement;
    if (element.classList.contains("cm-linkref")) {
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


    } else if (blockId && path) {
      // lien externe et blockId
      this.router.navigate(["editor"], {
        queryParams: {
          path: path,
          block: blockId
        }
      });

    }
  }
}
