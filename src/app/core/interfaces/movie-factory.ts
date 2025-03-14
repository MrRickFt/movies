import { Observable } from "rxjs";
import { Movie } from "./movie";

export interface MovieFactory {
    getMovies(): Observable<Movie[]>;
  }
  