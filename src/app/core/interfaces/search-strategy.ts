import { Observable } from "rxjs";
import { Movie } from "./movie";

export interface SearchStrategy {
    search(query: string): Observable<Movie[]>;
  }