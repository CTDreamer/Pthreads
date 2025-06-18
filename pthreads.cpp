#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

// Estructura para pasar datos a cada hilo
typedef struct {
    double *A;           // Vector A
    double *B;           // Vector B
    int start;           // Índice inicial del segmento que procesa el hilo
    int end;             // Índice final (exclusivo) del segmento
    double partial_sum;  // Resultado parcial calculado por el hilo
} ThreadData;

// Función que ejecuta cada hilo: calcula la suma parcial del producto punto en su rango
void *dot_product_thread(void *arg) {
    ThreadData *data = (ThreadData *)arg;
    double sum = 0.0;

    // Recorrer el segmento asignado y calcular suma de productos
    for (int i = data->start; i < data->end; i++) {
        sum += data->A[i] * data->B[i];
    }

    // Guardar resultado parcial en la estructura
    data->partial_sum = sum;

    // Terminar el hilo
    pthread_exit(NULL);
}

// Función secuencial para calcular el producto punto (para comparación)
double dot_product_sequential(double *A, double *B, int N) {
    double sum = 0.0;

    // Recorrer todos los elementos y sumar sus productos
    for (int i = 0; i < N; i++) {
        sum += A[i] * B[i];
    }

    // Retornar resultado final
    return sum;
}

// Función paralela para calcular el producto punto usando Pthreads
double dot_product_parallel(double *A, double *B, int N, int num_threads) {
    // Validar entrada
    if (N <= 0 || num_threads <= 0) return 0.0;

    // Reservar memoria para hilos y datos de cada hilo
    pthread_t *threads = malloc(num_threads * sizeof(pthread_t));
    ThreadData *thread_data = malloc(num_threads * sizeof(ThreadData));

    // Tamaño base del segmento para cada hilo y resto para distribuir
    int chunk_size = N / num_threads;
    int remainder = N % num_threads;

    // Índice de inicio para el primer hilo
    int start = 0;

    // Crear hilos, asignando segmentos con posible reparto del resto
    for (int i = 0; i < num_threads; i++) {
        thread_data[i].A = A;
        thread_data[i].B = B;

        // Calcular el rango de índices asignado a este hilo
        thread_data[i].start = start;
        thread_data[i].end = start + chunk_size + (i < remainder ? 1 : 0);
        thread_data[i].partial_sum = 0.0;

        // Actualizar índice de inicio para siguiente hilo
        start = thread_data[i].end;

        // Crear el hilo y pasarle su estructura de datos
        if (pthread_create(&threads[i], NULL, dot_product_thread, &thread_data[i]) != 0) {
            perror("Error al crear hilo");
            free(threads);
            free(thread_data);
            exit(EXIT_FAILURE);
        }
    }

    // Variable para acumular suma total
    double total_sum = 0.0;

    // Esperar a que todos los hilos terminen y acumular sus resultados parciales
    for (int i = 0; i < num_threads; i++) {
        pthread_join(threads[i], NULL);
        total_sum += thread_data[i].partial_sum;
    }

    // Liberar memoria
    free(threads);
    free(thread_data);

    // Retornar el resultado total
    return total_sum;
}

int main(int argc, char *argv[]) {
    // Validar argumentos de entrada: tamaño vector y número de hilos
    if (argc < 3) {
        printf("Uso: %s <tamaño_vector> <num_hilos>\n", argv[0]);
        return EXIT_FAILURE;
    }

    // Convertir argumentos a enteros
    int N = atoi(argv[1]);
    int num_threads = atoi(argv[2]);

    // Validar valores positivos
    if (N <= 0 || num_threads <= 0) {
        printf("Error: tamaño del vector y número de hilos deben ser positivos.\n");
        return EXIT_FAILURE;
    }

    // Reservar memoria para vectores A y B
    double *A = malloc(N * sizeof(double));
    double *B = malloc(N * sizeof(double));

    // Verificar asignación exitosa
    if (A == NULL || B == NULL) {
        perror("Error de asignación de memoria");
        free(A);
        free(B);
        return EXIT_FAILURE;
    }

    // Inicializar vectores con valores de ejemplo
    for (int i = 0; i < N; i++) {
        A[i] = (double)(i + 1);       // Ejemplo: 1.0, 2.0, 3.0, ...
        B[i] = (double)(N - i);       // Ejemplo: N, N-1, N-2, ...
    }

    // Calcular producto punto secuencial
    double resultado_seq = dot_product_sequential(A, B, N);

    // Calcular producto punto paralelo con Pthreads
    double resultado_par = dot_product_parallel(A, B, N, num_threads);

    // Mostrar resultados
    printf("Producto punto secuencial: %f\n", resultado_seq);
    printf("Producto punto paralelo:   %f\n", resultado_par);

    // Comparar resultados para validar
    if (abs(resultado_seq - resultado_par) < 1e-9) {
        printf("Resultados coinciden.\n");
    } else {
        printf("Resultados NO coinciden.\n");
    }

    // Liberar memoria usada
    free(A);
    free(B);

    return EXIT_SUCCESS;
}
