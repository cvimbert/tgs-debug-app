import { Component, OnInit, OnDestroy, HostListener, AfterViewChecked, AfterViewInit } from '@angular/core';
import { TgsLoadingService } from '../tgs-loading.service';
import { GameSequence } from 'tgs-core';
import { LinkModel } from 'tgs-model';

@Component({
  selector: 'app-main-structure',
  templateUrl: './main-structure.component.html',
  styleUrls: ['./main-structure.component.scss']
})
export class MainStructureComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {

  toolsDisplayed: boolean = false;

  constructor(
    private loadingService: TgsLoadingService
  ) { }

  ngOnInit() {
    
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngAfterViewInit() {
    //this.scrollToBottom();
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(evt: KeyboardEvent) {
    if (evt.ctrlKey) {

      if (!evt.altKey) {
        switch (evt.key) {
          case "c":
            this.toolsDisplayed = !this.toolsDisplayed;
            break;
  
          case "b":
            this.loadingService.goBack();
            break;
  
          case "y":
            this.loadingService.refreshGame();
            break;
        }
      } else {
        switch (evt.key) {
          case "y":
            this.loadingService.resetGame();
            break;
        }
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

  scrollToBottom() {
    let element: HTMLElement = document.querySelector("body");
    element.scrollTop = 20;
    console.log(element, element.scrollTop, element.scrollHeight, element.clientHeight);
    element.scrollTo({
      top: 1000
    });
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
