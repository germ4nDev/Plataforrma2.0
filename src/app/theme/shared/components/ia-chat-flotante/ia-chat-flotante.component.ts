import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IaAssistantService } from '../../service/ia-assistant.service';
import { IaAssistantResponseModel } from '../../_helpers/models/IAAssistantData.model'; // Dejamos solo el modelo de respuesta general aquí
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MarkdownPipe } from '../../pipes/markdown.pipe';

// =======================================================================
// INTERFACES DE SOPORTE PARA LA CONSOLA Y RENDERIZADO DE GRÁFICAS (MÓDULOS)
// =======================================================================
interface SerieGrafica {
    name: string;
    data: number[];
}

interface DataRetrievedIA {
    curso?: string;
    instructora?: string;
    modulos?: number;
    estado?: string;
    precio?: string;

    // 📊 Propiedades específicas para la gráfica de barras inyectada
    tipo_grafica?: string;
    eje_x_categorias?: string[];
    series?: SerieGrafica[];

    db_source: string; // Origen de datos expuesto para la junta directiva
}

interface ToolExecutedIA {
    name: string;
    inputs: any;
    dataRetrieved: DataRetrievedIA | null;
}

interface InteraccionChatIA {
    query: string;
    response: string;
    toolExecuted: ToolExecutedIA | null;
    executionMode: string;
    timestamp: string;
}

@Component({
    selector: 'app-ia-chat-flotante',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, MarkdownPipe],
    templateUrl: './ia-chat-flotante.component.html',
    styleUrl: './ia-chat-flotante.component.scss'
})
export class IaChatFlotanteComponent {

    public promptUsuario: string = '';
    public cargando: boolean = false;
    public modalAbierto: boolean = false;
    public sidebarAbierto: boolean = false;

    // 🎯 CORRECCIÓN CLAVE: Cambiamos el tipado del arreglo al modelo extendido 'InteraccionChatIA'
    // para que el compilador HTML reconozca 'chat.toolExecuted.dataRetrieved.tipo_grafica'
    public historialInteracciones: InteraccionChatIA[] = [];

    constructor(
        private iaService: IaAssistantService,
        private translate: TranslateService
    ) { }

    public alternarSidebar(): void {
        this.sidebarAbierto = !this.sidebarAbierto;
    }

    public abrirModal(): void {
        this.modalAbierto = true;
    }

    public cerrarModal(): void {
        this.modalAbierto = false;
    }

    public enviarConsulta(): void {
        if (!this.promptUsuario.trim() || this.cargando) return;

        const textoEnviado = this.promptUsuario;
        this.promptUsuario = '';
        this.cargando = true;

        // Cerramos la cortina del sidebar y abrimos el modal ejecutivo de respuestas
        this.sidebarAbierto = false;
        this.modalAbierto = true;

        this.iaService.preguntarIA(textoEnviado).subscribe({
            next: (resultado: IaAssistantResponseModel) => {
                if (resultado.success && resultado.data) {
                    // Al castearlo como 'any' o asegurar que cumple la estructura,
                    // Angular permite insertarlo en el nuevo historial tipado
                    this.historialInteracciones.push(resultado.data as any);
                }
                this.cargando = false;
            },
            error: (err: any) => {
                console.error('Error en el asistente de IA:', err);
                this.cargando = false;
            }
        });
    }
}
