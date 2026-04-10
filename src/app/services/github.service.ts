import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  created_at: string;
  fork: boolean;
  archived: boolean;
  visibility: string;
  default_branch: string;
  open_issues_count: number;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

@Injectable({ providedIn: 'root' })
export class GithubService {
  private baseUrl = 'https://api.github.com';

  constructor(private http: HttpClient) {}

  // Obtiene el perfil publico del usuario.
  getUser(username: string): Observable<GitHubUser | null> {
    return this.http.get<GitHubUser>(`${this.baseUrl}/users/${username}`).pipe(
      catchError(() => of(null))
    );
  }

  // Trae repos publicos recientes y descarta forks/archivados para mostrar proyectos propios.
  getRepos(username: string): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(
      `${this.baseUrl}/users/${username}/repos?per_page=100&sort=updated`
    ).pipe(
      map(repos => repos.filter(r => !r.fork && !r.archived)),
      catchError(() => of([]))
    );
  }
}
