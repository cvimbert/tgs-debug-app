import { Component, OnInit, OnDestroy, HostListener, AfterViewChecked, AfterViewInit, ElementRef } from '@angular/core';
import { TgsLoadingService } from '../tgs-loading.service';
import { GameSequence } from 'tgs-core';
import { LinkModel } from 'tgs-model';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-main-structure',
  templateUrl: './main-structure.component.html',
  styleUrls: ['./main-structure.component.scss'],
  animations: [
    trigger('hiddenVisible', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(50px)',
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)',
      })),
      transition('hidden => visible', [
        animate("0.5s ease-out")
      ])
    ])
  ]
})
export class MainStructureComponent implements OnInit, OnDestroy, AfterViewChecked {

  toolsDisplayed = false;
  animationState = "visible";

  constructor(
    private loadingService: TgsLoadingService,
    private element: ElementRef
  ) { }

  ngOnInit() {
    //setTimeout(() => this.animationState = "visible", 2000);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
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

  paragraphAnimationEnd(evt: AnimationEvent) {
    //console.log("done !", evt);
  }

  scrollToBottom() {
    let element: HTMLElement = document.querySelector("body");
    element.parentElement.scrollTo(0, element.scrollHeight);
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
