import { Component, OnInit, HostListener, ViewChild, AfterContentInit, OnChanges, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TGSParser, ParsingResult } from 'tgs-parser';
import { MainStructure, GameBlockModel } from 'tgs-model';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { Subject, timer } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';

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

  bdSubject: Subject<number> = new Subject()

  @ViewChild("editor") editor: CodemirrorComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentPath = params["path"];
      this.content = localStorage.getItem("editor-" + this.currentPath) || "#index";
      this.refreshInspector();
      this.selectBlockByCursorPos(0);
    });

    this.bdSubject.pipe(debounceTime(1000)).subscribe(pos => {
      this.refreshInspector();
      this.selectBlockByCursorPos(pos);
    });
  }

  save() {
    localStorage.setItem("editor-" + this.currentPath, this.content);
  }

  refreshInspector() {
    if (this.content && this.content !== "") {
      let parser: TGSParser = new TGSParser();
      let result: ParsingResult = parser.parseTGSString(this.content);
      //console.log(result);
      this.mainModel = MainStructure.loadFromParsingResult(result);
      //console.log(this.mainModel);
    }
  }

  selectBlockByCursorPos(index: number) {
    if (!this.mainModel) return;

    for (let block of this.mainModel.blocksArray) {
      if (index >= block.startIndex && index <= block.endIndex) {
        this.currentBlock = block;
        this.ref.detectChanges();
        return;
      }
    }
  }

  onCursorActivity(evt: any) {
    let pos: any = evt.getDoc().getCursor();
    let charPos = this.convertLineAndChToPosition(pos.line, pos.ch);
    this.bdSubject.next(charPos);
    //this.selectBlockByCursorPos(charPos);
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
        this.editor.codeMirror.getDoc().setCursor({ch: index - count, line: lineNum});
      }
      
      count = newCount;
      lineNum++;
    });

    //console.log("Count", count - 1);
  }

  selectBlock(model: GameBlockModel) {
    this.editor.codeMirror.focus();
    this.setCursorPos(model.startIndex);
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
        this.content += "\n\n\n#" + blockId + "\n\n\t";
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
