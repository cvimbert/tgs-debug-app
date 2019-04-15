import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  save() {
    localStorage.setItem("editor-" + this.currentPath, this.content);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentPath = params["path"];
      this.content = localStorage.getItem("editor-" + this.currentPath);
    });
  }

  @HostListener('window:keydown', ['$event'])
  onkeyDown(evt: KeyboardEvent) {
    if (evt.key === "Control") {
      this.navigationActivated = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  onkeyUp(evt: KeyboardEvent) {
    if (evt.key === "Control") {
      this.navigationActivated = false;
    }
  }

  @HostListener('mouseover', ['$event'])
  rollOverLink(evt: MouseEvent) {
    let element = evt.target as HTMLElement;
    if (element.classList.contains("cm-linkref")) {
      element.classList.add("cm-underline");
      element.addEventListener("click", this.linkClick);
    }
  }

  @HostListener('mouseout', ['$event'])
  rollOutLink(evt: MouseEvent) {
    let element = evt.target as HTMLElement;
    if (element.classList.contains("cm-linkref")) {
      element.classList.remove("cm-underline");
      element.removeEventListener("click", this.linkClick);
    }
  }

  linkClick(evt: MouseEvent) {

  }
}
