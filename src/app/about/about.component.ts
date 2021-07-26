import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fromEvent, interval } from "rxjs";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    const interval$ = interval(1000);

    interval$.subscribe((data) => {
      console.log(data);
    });

    const click$ = fromEvent(document, "click");

    click$.subscribe((evt) => console.log(evt));
  }
}
