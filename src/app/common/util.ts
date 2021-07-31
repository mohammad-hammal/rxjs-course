import { Observable } from "rxjs";

export function createHttpObservable(url: string) {
  return new Observable((observer) => {
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          observer.error("Request faild with status code: " + response.status);
        }
      })
      .then((body) => {
        observer.next(body);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
  });
}
