import { Component, OnInit } from '@angular/core';
import { TgsLoadingService } from '../tgs-loading.service';
import { VariableItem } from '../interfaces/variable-item';

@Component({
  selector: 'app-variables-inspector',
  templateUrl: './variables-inspector.component.html',
  styleUrls: ['./variables-inspector.component.scss']
})
export class VariablesInspectorComponent implements OnInit {

  variablesItems: VariableItem[];

  constructor(
    private tgsService: TgsLoadingService
  ) { }

  ngOnInit() {
    // Tri des variables par nom ??

    this.variablesItems = [];
    let variables: {[key: string]: any} = this.tgsService.getVariables();

    for (let key in variables) {
      this.variablesItems.push({
        name: key,
        value: variables[key]
      });
    }

    console.log(this.variablesItems);
  }

}
