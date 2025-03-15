import { Observable } from "rxjs";
import { Movie } from "./movie";

export interface SearchStrategy {
  search(query: string, page: number): Observable<{ results: Movie[], total_results: number }>;
}
