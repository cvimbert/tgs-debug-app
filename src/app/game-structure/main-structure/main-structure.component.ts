import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TgsLoadingService } from '../tgs-loading.service';
import { GameSequence } from 'tgs-core';
import { LinkModel } from 'tgs-model';

@Component({
  selector: 'app-main-structure',
  templateUrl: './main-structure.component.html',
  styleUrls: ['./main-structure.component.scss']
})
export class MainStructureComponent implements OnInit, OnDestroy {

  toolsDisplayed: boolean = false;

  constructor(
    private loadingService: TgsLoadingService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // on ne devrait pas faire ça avec Angular. Chercher une alternative
    window.addEventListener("keyup", evt => {
      this.onKeyUp(evt);
    });
  }

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
