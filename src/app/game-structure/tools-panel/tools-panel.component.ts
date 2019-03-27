import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TgsLoadingService } from '../tgs-loading.service';

@Component({
  selector: 'app-tools-panel',
  templateUrl: './tools-panel.component.html',
  styleUrls: ['./tools-panel.component.scss']
})
export class ToolsPanelComponent implements OnInit {

  variablesInspectorDisplay: boolean = true;

  @Output("onClose") onClose: EventEmitter<void> = new EventEmitter();

  constructor(
    private tgsService: TgsLoadingService
  ) { }

  ngOnInit() {
    
  }

  resetGame() {
    this.tgsService.resetGame();
    this.close();
  }

  refresh() {
    this.tgsService.refreshGame();
    this.close();
  }

  close() {
    this.onClose.emit();
  }

  inspectVariables() {
    this.variablesInspectorDisplay = !this.variablesInspectorDisplay;
  }

  goBack() {
    this.tgsService.goBack();
    this.close();
  }
}
