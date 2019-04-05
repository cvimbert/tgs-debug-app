import { Component, OnInit, Input } from '@angular/core';
import { TagModel } from 'tgs-model';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-tag-display',
  templateUrl: './tag-display.component.html',
  styleUrls: ['./tag-display.component.scss']
})
export class TagDisplayComponent implements OnInit {

  alignment: string[] = [];
  assetsFolder = "";

  @Input("tag") tag: TagModel;

  constructor(
    electronService: ElectronService
  ) {
    if (electronService.isElectronApp) {

      // on doit pouvoir faire mieux avec un chemin absolu
      this.assetsFolder = "../../../../";
    }
  }

  ngOnInit() {
    if (this.tag.name === "img") {
      let align: string = this.tag.attributes["valign"];
      this.alignment = align ? ["valign-" + align] : [];
    }
  }


}
