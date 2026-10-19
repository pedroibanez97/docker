import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface Tarea {
  id: number;
  titulo: string;
  completada: boolean;
}

@Injectable({ providedIn: 'root' })
export class TareasService {
  private readonly http = inject(HttpClient);

  // URL RELATIVA: el navegador la pide al mismo origen que le sirvió Angular.
  // Producción: Nginx reenvía /api al backend. Desarrollo: lo hace el proxy de `ng serve`.
  private readonly apiUrl = '/api/tareas';

  listar() {
    return this.http.get<Tarea[]>(this.apiUrl);
  }

  crear(titulo: string) {
    return this.http.post<Tarea>(this.apiUrl, { titulo });
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
