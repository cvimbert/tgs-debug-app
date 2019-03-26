import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { TgsLoadingService } from '../tgs-loading.service';
import { GameSequence } from 'tgs-core';
import { LinkModel } from 'tgs-model';

@Component({
  selector: 'app-main-structure',
  templateUrl: './main-structure.component.html',
  styleUrls: ['./main-structure.component.scss']
})
export class MainStructureComponent implements OnInit, OnDestroy {

  toolsDisplayed: boolean = true;

  constructor(
    private loadingService: TgsLoadingService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(evt:KeyboardEvent) {
    if (evt.ctrlKey) {
      switch(evt.key) {
        case "c":
          this.toolsDisplayed = !this.toolsDisplayed;
          this.ref.detectChanges();
          break;
      }
    }
  }

  loadLink(link: LinkModel) {
    if (!link.globalLinkRef) {
      this.sequence.loadBlock(link.localLinkRef);
    } else {

    }
  }

  get sequence(): GameSequence {
    return this.loadingService.sequence;
  }

  ngOnDestroy() {
    window.removeEventListener("keyup", this.onKeyUp);
  }

}
