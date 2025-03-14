import { Genre } from "./genre";
import { Movie } from "./movie";
import { ProductionCompany } from "./production-company";

export interface MovieDetails extends Movie {
    genres: Genre[];
    runtime: number;
    budget: number;
    revenue: number;
    production_companies: ProductionCompany[];
  }