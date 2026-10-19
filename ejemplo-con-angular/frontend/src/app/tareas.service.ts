import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface Tarea {
  id: number;
  titulo: string;
}

@Injectable({ providedIn: 'root' })
export class TareasService {
  private http = inject(HttpClient);

  // URL relativa: el navegador se la pide a Nginx, y Nginx se la pasa al backend
  private apiUrl = '/api/tareas';

  listar() {
    return this.http.get<Tarea[]>(this.apiUrl);
  }

  crear(titulo: string) {
    return this.http.post<Tarea>(this.apiUrl, { titulo });
  }
}
