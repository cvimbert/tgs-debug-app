import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TGSParser, ParsingResult } from 'tgs-parser';
import { MainStructure, GameBlockModel } from 'tgs-model';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';

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

  @ViewChild("editor") editor: CodemirrorComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

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

      // temporaire
      setTimeout(() => {
        this.editor.codeMirror.focus();
        this.setCursorPos(0);
        this.selectBlockByCursorPos(8);
      }, 100);
      
    }
  }

  selectBlockByCursorPos(index: number) {
    for (let block of this.mainModel.blocksArray) {
      if (index >= block.startIndex && index <= block.endIndex) {
        this.currentBlock = block;
        return;
      }
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentPath = params["path"];
      this.content = localStorage.getItem("editor-" + this.currentPath) || "#index";
      this.refreshInspector();
      //console.log(this.editor);

      this.editor.codeMirror
    });
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

      } else {
        // on crée un nouveu block (pour l'instant à la fin)
        this.content += "\n\n#" + blockId;
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


    }
  }
}
