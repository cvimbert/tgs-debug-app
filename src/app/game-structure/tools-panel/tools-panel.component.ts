import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TgsLoadingService } from '../tgs-loading.service';

@Component({
  selector: 'app-tools-panel',
  templateUrl: './tools-panel.component.html',
  styleUrls: ['./tools-panel.component.scss']
})
export class ToolsPanelComponent implements OnInit {

  variablesInspectorDisplay: boolean = true;

  @Output("onClose") onClose: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private tgsService: TgsLoadingService
  ) { }

  ngOnInit() {
    
  }

  resetGame() {
    //this.close();
    this.tgsService.resetGame();
    this.close(false);
  }

  refresh() {
    this.tgsService.refreshGame();
    this.close();
  }

  close(refresh: boolean = true) {
    this.onClose.emit(refresh);
  }

  inspectVariables() {
    this.variablesInspectorDisplay = !this.variablesInspectorDisplay;
  }

  goBack() {
    this.tgsService.goBack();
    this.close();
  }
}
