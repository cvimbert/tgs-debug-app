import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
    private loadingService: TgsLoadingService
  ) { }

  ngOnInit() {
    
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(evt: KeyboardEvent) {
    if (evt.ctrlKey) {
      switch (evt.key) {
        case "c":
          this.toolsDisplayed = !this.toolsDisplayed;
          break;

        case "b":
          this.loadingService.goBack();
          break;
      }
    } else {
      switch (evt.key) {
        case "Escape":
          this.toolsDisplayed = false;
          this.loadingService.refreshGame();
          break;
      }
    }
  }

  onClose(refresh: boolean) {
    this.toolsDisplayed = false;

    if (refresh) {
      this.loadingService.refreshGame();
    }
  }

  loadLink(link: LinkModel) {
    if (!link.globalLinkRef) {
      this.sequence.loadBlock(link.localLinkRef);
    } else {
      this.sequence.navigateToSequence(link.globalLinkRef, link.localLinkRef);
    }
  }

  get sequence(): GameSequence {
    return this.loadingService.sequence;
  }

  ngOnDestroy() {
    window.removeEventListener("keyup", this.onKeyUp);
  }

}
