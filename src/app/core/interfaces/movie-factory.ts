import { Observable } from "rxjs";
import { Movie } from "./movie";

export interface MovieFactory {
  getMovies(page?: number): Observable<{results: Movie[], totalPages: number}>;
}