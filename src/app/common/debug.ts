import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export enum RxJsLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR,
}

export const debug =
  (level: number, message: string) => (source: Observable<any>) =>
    source.pipe(
      tap((val) => {
        if (level >= +RxJsLoggingLevel.INFO) {
          console.log(`${message}: ${val}`);
        }
      })
    );
