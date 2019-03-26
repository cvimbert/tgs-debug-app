import { Component, OnInit, Input } from '@angular/core';
import { VariableItem } from '../interfaces/variable-item';
import { TgsLoadingService } from '../tgs-loading.service';

@Component({
  selector: 'app-variable-item-slot',
  templateUrl: './variable-item-slot.component.html',
  styleUrls: ['./variable-item-slot.component.scss']
})
export class VariableItemSlotComponent implements OnInit {

  type: string;

  @Input("item") item: VariableItem;
  @Input("index") index: number;

  constructor(
    private tgsService: TgsLoadingService
  ) { }

  ngOnInit() {
    this.type = typeof this.item.value;
    //console.log(this.index);
  }

  get value():any {
    return this.item.value;
  }

  set value(val: any) {
    this.tgsService.setVariable(this.item.name, val, this.type);
    this.item.value = val;
  }

}
