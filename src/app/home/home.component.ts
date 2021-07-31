import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delayWhen,
  filter,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { createHttpObservable } from ".././common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {}

  ngOnInit() {
    // const interval$ = interval(1000);

    // const sub = interval$.subscribe((data) => {
    //   console.log(data);
    // });

    // setTimeout(() => sub.unsubscribe(), 5000);

    // const click$ = fromEvent(document, "click");

    // click$.subscribe(
    //   // Steam working
    //   (evt) => console.log(evt),
    //   // Error in the stream
    //   (err) => console.log(err),
    //   // Stream is completed on etheir side
    //   () => console.log("Completed")
    // );

    const http$ = createHttpObservable("/api/courses");
    const courses$ = http$.pipe(
      // catchError((error) => {
      //   // console.log("Error happend", error);
      //   return throwError(error);
      // }),
      // finalize(() => {
      //   console.log("Finalized excuted");
      // }),
      tap(() => console.log("HTTP request is running")),
      map((res) => res["payload"]),
      shareReplay(),
      retryWhen((errors) => errors.pipe(delayWhen(() => timer(2000))))
    );

    this.beginnerCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "BEGINNER")
      )
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "ADVANCED")
      )
    );

    const subscriber = {
      next: (res) => console.log("This is res", res),
      error: (err) => console.log(err),
      complete: () => console.log("Completed"),
    };

    courses$.subscribe(
      // (res) =>
      //   console.log(
      //     "------------------- This is res -=------------------",
      //     res
      //   ),
      // noop,
      // () => console.log("Completed")
      subscriber
    );
  }
}
