import { Component, OnInit, OnDestroy, HostListener, AfterViewChecked, Input, EventEmitter, Output } from '@angular/core';
import { TgsLoadingService } from '../tgs-loading.service';
import { GameSequence, GameMode } from 'tgs-core';
import { LinkModel } from 'tgs-model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ExternalNavigation } from '../../editor/interfaces/external-navigation.interface';

@Component({
  selector: 'app-main-structure',
  templateUrl: './main-structure.component.html',
  styleUrls: ['./main-structure.component.scss'],
  animations: [
    trigger('hiddenVisible', [
      state('*', style({
        opacity: 0,
        transform: 'translateY(50px)',
      })),
      state('visible, visibleNoAnim', style({
        opacity: 1,
        transform: 'translateY(0)',
      })),
      transition('void => visible', [
        animate("0.5s ease-out")
      ])
    ]),
    trigger("linksAnimation", [
      state('*', style({
        opacity: 0,
        transform: 'translateY(50px)',
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)',
      })),
      transition('hidden => visible', [
        animate("0.5s 0.4s ease-out")
      ])
    ])
  ]
})
export class MainStructureComponent implements OnInit, OnDestroy, AfterViewChecked {

  toolsDisplayed = false;
  linksAnimationState = "none";

  @Output("externalNavigation") externalNavigation = new EventEmitter<ExternalNavigation>();

  @Input("mode") mode: string = "normal";
  @Input("path") path: string;
  @Input("content") content: string;

  constructor(
    private loadingService: TgsLoadingService
  ) { }

  ngOnInit() {
    this.loadingService.mode = this.mode;
    this.loadingService.rawContent = this.content;
    this.loadingService.init();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  animationState(index: number): string {
    if (index === this.loadingService.currentSequence.units.length - 1 && this.loadingService.currentSequence.initialized) {
      return "visible";
    } else {
      return "visibleNoAnim";
    }
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

  getAnimationState(index: number): string {
    if (!this.loadingService.currentSequence.initialized) {
      return "visible"
    } else if (index === this.loadingService.currentSequence.units.length -1) {

      //setTimeout(() => )

      return "visible";
    } else {
      return "visible";
    }
  }

  paragraphAnimationEnd(evt: AnimationEvent, index: number) {
    //console.log("done !", index, evt, this.loadingService.currentSequence.units.length - 1);
    if (index === this.loadingService.currentSequence.units.length - 1) {
      //console.log("scroll");
      setTimeout(() => this.scrollToBottom());
    }

    this.linksAnimationState = "visible";
  }

  scrollToBottom() {
    let element: HTMLElement = document.querySelector("#main-container");
    element.scrollTo(0, element.scrollHeight);
  }

  onClose(refresh: boolean) {
    this.toolsDisplayed = false;

    if (refresh) {
      this.loadingService.refreshGame();
    }
  }

  loadLink(link: LinkModel) {

    if (this.loadingService.mode === GameMode.NORMAL) {
      this.linksAnimationState = "hidden";

      if (!link.globalLinkRef) {
        this.sequence.loadBlock(link.localLinkRef);
      } else {
        this.sequence.navigateToSequence(link.globalLinkRef, link.localLinkRef);
      }
      
      setTimeout(() => {
        this.linksAnimationState = "visible";
      });
    } else if (this.loadingService.mode === GameMode.DEBUG) {

      console.log("ici");
      
      this.externalNavigation.emit({
        globalRef: link.globalLinkRef,
        localRef: link.localLinkRef
      });
    }
  }

  get sequence(): GameSequence {
    return this.loadingService.sequence;
  }

  ngOnDestroy() {
    window.removeEventListener("keyup", this.onKeyUp);
  }

}
