import { Coctail } from "./coctail.model";
import { CoctailView } from "./coctail.view";

export class CoctailController {
  constructor(public coctail: Coctail, public coctailView: CoctailView) {}
  showCoctail() {
    this.coctailView.showCoctail();
  }
  getX() {
    return this.coctail.x;
  }
  getY() {
    return this.coctail.y;
  }
  getTouched() {
    return this.coctail.touched;
  }
  setX(value: number) {
    this.coctail.x = value;
  }
  setY(value: number) {
    this.coctail.y = value;
  }
  setTouched(value: boolean) {
    this.coctail.touched = value;
  }
}
