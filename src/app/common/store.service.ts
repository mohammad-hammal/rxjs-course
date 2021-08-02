import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { fromPromise } from "rxjs/internal-compatibility";
import { filter, map, tap } from "rxjs/operators";
import { Course } from "../model/course";
import { createHttpObservable } from "./util";

@Injectable({
  providedIn: "root",
})
export class Store {
  private coursesSubject = new BehaviorSubject([]);
  courses$: Observable<Course[]> = this.coursesSubject.asObservable();

  init() {
    const http$ = createHttpObservable("/api/courses");
    http$
      .pipe(
        tap(() => console.log("HTTP request executed")),
        map((res) => Object.values(res["payload"]))
      )
      .subscribe((courses: any) => this.coursesSubject.next(courses));
  }

  selectBeginnersCourses() {
    return this.filterByCategory("BEGINNER");
  }

  selectAdvancedCourses() {
    return this.filterByCategory("ADVANCED");
  }

  filterByCategory(category: string) {
    return this.courses$.pipe(
      map((courses) => courses.filter((course) => course.category === category))
    );
  }

  saveCourse(courseId: number, changes) {
    const courses = this.coursesSubject.getValue();
    const courseIndex = courses.findIndex((course) => course.id === courseId);

    const newCourses = [...courses];
    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes,
    };

    this.coursesSubject.next(newCourses);

    return fromPromise(
      fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json",
        },
      })
    );
  }

  selectCourseById(courseId: number) {
    return this.courses$.pipe(
      map((courses) => courses.find((course) => course.id === courseId)),
      filter((course) => !!course)
    );
  }
}
