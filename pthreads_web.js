<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simulador de Producto Punto Paralelo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        }

        h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .subtitle {
            text-align: center;
            color: #7f8c8d;
            margin-bottom: 30px;
            font-size: 1.2em;
        }

        .controls {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 15px;
            border: 2px solid #dee2e6;
        }

        .control-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        label {
            font-weight: 600;
            color: #495057;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        input, select, button {
            padding: 12px;
            border: 2px solid #dee2e6;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        input:focus, select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        button {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            cursor: pointer;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        button:active {
            transform: translateY(0);
        }

        .vectors-display {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }

        .vector-container {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 15px;
            border-left: 5px solid #667eea;
        }

        .vector-title {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.1em;
        }

        .vector-elements {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            max-height: 120px;
            overflow-y: auto;
        }

        .vector-element {
            background: white;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #dee2e6;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9em;
            min-width: 60px;
            text-align: center;
        }

        .threads-visualization {
            margin-bottom: 30px;
        }

        .threads-title {
            font-size: 1.3em;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
        }

        .thread-container {
            display: grid;
            gap: 15px;
            margin-bottom: 20px;
        }

        .thread {
            background: linear-gradient(135deg, #e3f2fd, #bbdefb);
            border-radius: 12px;
            padding: 15px;
            border-left: 4px solid #2196f3;
            transition: all 0.3s ease;
        }

        .thread.processing {
            background: linear-gradient(135deg, #fff3e0, #ffcc02);
            border-left-color: #ff9800;
            animation: pulse 1.5s infinite;
        }

        .thread.completed {
            background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
            border-left-color: #4caf50;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        .thread-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .thread-id {
            font-weight: 600;
            color: #1976d2;
        }

        .thread-range {
            font-family: 'Monaco', 'Menlo', monospace;
            background: rgba(255, 255, 255, 0.7);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.85em;
        }

        .thread-progress {
            height: 8px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 8px;
        }

        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            width: 0%;
            transition: width 0.3s ease;
            border-radius: 4px;
        }

        .thread-result {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9em;
            color: #2c3e50;
        }

        .results {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .result-card {
            background: linear-gradient(135deg, #ffffff, #f8f9fa);
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            border: 2px solid #e9ecef;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .result-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .result-title {
            font-size: 0.9em;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }

        .result-value {
            font-size: 1.8em;
            font-weight: 700;
            color: #2c3e50;
            font-family: 'Monaco', 'Menlo', monospace;
        }

        .performance-analysis {
            background: linear-gradient(135deg, #f1f3f4, #e8eaed);
            padding: 25px;
            border-radius: 15px;
            border: 2px solid #dadce0;
        }

        .analysis-title {
            font-size: 1.2em;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
            text-align: center;
        }

        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #dee2e6;
        }

        .metric:last-child {
            border-bottom: none;
        }

        .metric-name {
            font-weight: 500;
            color: #495057;
        }

        .metric-value {
            font-family: 'Monaco', 'Menlo', monospace;
            font-weight: 600;
            color: #2c3e50;
        }

        .loading {
            display: none;
            text-align: center;
            padding: 20px;
        }

        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }
            
            .controls {
                grid-template-columns: 1fr;
            }
            
            .vectors-display {
                grid-template-columns: 1fr;
            }
            
            .results {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧮 Simulador de Producto Punto Paralelo</h1>
        <p class="subtitle">Visualización interactiva del algoritmo paralelo con Pthreads</p>

        <div class="controls">
            <div class="control-group">
                <label for="vectorSize">Tamaño del Vector</label>
                <input type="number" id="vectorSize" value="20" min="4" max="100">
            </div>
            
            <div class="control-group">
                <label for="numThreads">Número de Hilos</label>
                <input type="number" id="numThreads" value="4" min="1" max="8">
            </div>
            
            <div class="control-group">
                <label for="initPattern">Patrón de Inicialización</label>
                <select id="initPattern">
                    <option value="sequence">Secuencia (1,2,3...)</option>
                    <option value="random">Aleatorio</option>
                    <option value="ones">Todos Unos</option>
                </select>
            </div>
            
            <div class="control-group">
                <button onclick="generateVectors()">🎲 Generar Vectores</button>
            </div>
            
            <div class="control-group">
                <button onclick="calculateDotProduct()">▶️ Ejecutar Cálculo</button>
            </div>
        </div>

        <div class="vectors-display">
            <div class="vector-container">
                <div class="vector-title">📊 Vector A</div>
                <div class="vector-elements" id="vectorA"></div>
            </div>
            
            <div class="vector-container">
                <div class="vector-title">📊 Vector B</div>
                <div class="vector-elements" id="vectorB"></div>
            </div>
        </div>

        <div class="threads-visualization">
            <div class="threads-title">🔄 Visualización de Hilos</div>
            <div class="thread-container" id="threadsContainer"></div>
        </div>

        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Procesando cálculo paralelo...</p>
        </div>

        <div class="results">
            <div class="result-card">
                <div class="result-title">Resultado Secuencial</div>
                <div class="result-value" id="sequentialResult">-</div>
            </div>
            
            <div class="result-card">
                <div class="result-title">Resultado Paralelo</div>
                <div class="result-value" id="parallelResult">-</div>
            </div>
            
            <div class="result-card">
                <div class="result-title">Tiempo Secuencial</div>
                <div class="result-value" id="sequentialTime">-</div>
            </div>
            
            <div class="result-card">
                <div class="result-title">Tiempo Paralelo</div>
                <div class="result-value" id="parallelTime">-</div>
            </div>
        </div>

        <div class="performance-analysis">
            <div class="analysis-title">📈 Análisis de Rendimiento</div>
            <div class="metric">
                <span class="metric-name">Speedup</span>
                <span class="metric-value" id="speedup">-</span>
            </div>
            <div class="metric">
                <span class="metric-name">Eficiencia</span>
                <span class="metric-value" id="efficiency">-</span>
            </div>
            <div class="metric">
                <span class="metric-name">Diferencia Absoluta</span>
                <span class="metric-value" id="difference">-</span>
            </div>
            <div class="metric">
                <span class="metric-name">Precisión</span>
                <span class="metric-value" id="precision">-</span>
            </div>
        </div>
    </div>

    <script>
        // Variables globales
        let vectorA = [];
        let vectorB = [];

        // Generar vectores según el patrón seleccionado
        function generateVectors() {
            const size = parseInt(document.getElementById('vectorSize').value);
            const pattern = document.getElementById('initPattern').value;
            
            vectorA = [];
            vectorB = [];
            
            switch (pattern) {
                case 'sequence':
                    for (let i = 0; i < size; i++) {
                        vectorA.push(i + 1);
                        vectorB.push(size - i);
                    }
                    break;
                    
                case 'random':
                    for (let i = 0; i < size; i++) {
                        vectorA.push(Math.random() * 100);
                        vectorB.push(Math.random() * 100);
                    }
                    break;
                    
                case 'ones':
                    for (let i = 0; i < size; i++) {
                        vectorA.push(1);
                        vectorB.push(1);
                    }
                    break;
            }
            
            displayVectors();
            resetResults();
        }

        // Mostrar vectores en la interfaz
        function displayVectors() {
            const vectorAContainer = document.getElementById('vectorA');
            const vectorBContainer = document.getElementById('vectorB');
            
            vectorAContainer.innerHTML = '';
            vectorBContainer.innerHTML = '';
            
            vectorA.forEach((val, index) => {
                const element = document.createElement('div');
                element.className = 'vector-element';
                element.textContent = val.toFixed(1);
                element.title = `A[${index}] = ${val.toFixed(3)}`;
                vectorAContainer.appendChild(element);
            });
            
            vectorB.forEach((val, index) => {
                const element = document.createElement('div');
                element.className = 'vector-element';
                element.textContent = val.toFixed(1);
                element.title = `B[${index}] = ${val.toFixed(3)}`;
                vectorBContainer.appendChild(element);
            });
        }

        // Resetear resultados
        function resetResults() {
            document.getElementById('sequentialResult').textContent = '-';
            document.getElementById('parallelResult').textContent = '-';
            document.getElementById('sequentialTime').textContent = '-';
            document.getElementById('parallelTime').textContent = '-';
            document.getElementById('speedup').textContent = '-';
            document.getElementById('efficiency').textContent = '-';
            document.getElementById('difference').textContent = '-';
            document.getElementById('precision').textContent = '-';
            
            document.getElementById('threadsContainer').innerHTML = '';
        }

        // Cálculo secuencial del producto punto
        function dotProductSequential(A, B) {
            const start = performance.now();
            let sum = 0;
            for (let i = 0; i < A.length; i++) {
                sum += A[i] * B[i];
            }
            const end = performance.now();
            return { result: sum, time: end - start };
        }

        // Simulación del cálculo paralelo
        async function dotProductParallel(A, B, numThreads) {
            const start = performance.now();
            const N = A.length;
            const chunkSize = Math.floor(N / numThreads);
            const remainder = N % numThreads;
            
            const threads = [];
            let startIndex = 0;
            
            // Crear hilos virtuales
            for (let i = 0; i < numThreads; i++) {
                const endIndex = startIndex + chunkSize + (i < remainder ? 1 : 0);
                threads.push({
                    id: i,
                    start: startIndex,
                    end: endIndex,
                    partialSum: 0,
                    progress: 0,
                    completed: false
                });
                startIndex = endIndex;
            }
            
            displayThreads(threads);
            
            // Simular procesamiento paralelo
            const promises = threads.map(thread => processThread(thread, A, B));
            const results = await Promise.all(promises);
            
            const totalSum = results.reduce((sum, result) => sum + result, 0);
            const end = performance.now();
            
            return { result: totalSum, time: end - start };
        }

        // Procesar un hilo individual
        async function processThread(thread, A, B) {
            const container = document.getElementById(`thread-${thread.id}`);
            const progressBar = container.querySelector('.progress-bar');
            const resultElement = container.querySelector('.thread-result');
            
            container.classList.add('processing');
            
            let sum = 0;
            const totalElements = thread.end - thread.start;
            
            for (let i = thread.start; i < thread.end; i++) {
                sum += A[i] * B[i];
                
                // Simular tiempo de procesamiento
                await new Promise(resolve => setTimeout(resolve, 30));
                
                // Actualizar progreso
                const progress = ((i - thread.start + 1) / totalElements) * 100;
                progressBar.style.width = progress + '%';
                
                // Actualizar resultado parcial
                resultElement.textContent = `Suma parcial: ${sum.toFixed(3)}`;
            }
            
            // Marcar como completado
            container.classList.remove('processing');
            container.classList.add('completed');
            resultElement.textContent = `Resultado final: ${sum.toFixed(3)}`;
            
            return sum;
        }

        // Mostrar hilos en la interfaz
        function displayThreads(threads) {
            const container = document.getElementById('threadsContainer');
            container.innerHTML = '';
            
            threads.forEach(thread => {
                const threadElement = document.createElement('div');
                threadElement.className = 'thread';
                threadElement.id = `thread-${thread.id}`;
                
                threadElement.innerHTML = `
                    <div class="thread-header">
                        <div class="thread-id">Hilo ${thread.id}</div>
                        <div class="thread-range">Índices [${thread.start}, ${thread.end})</div>
                    </div>
                    <div class="thread-progress">
                        <div class="progress-bar"></div>
                    </div>
                    <div class="thread-result">Esperando...</div>
                `;
                
                container.appendChild(threadElement);
            });
        }

        // Función principal para calcular el producto punto
        async function calculateDotProduct() {
            if (vectorA.length === 0 || vectorB.length === 0) {
                alert('Por favor, genera los vectores primero');
                return;
            }
            
            const numThreads = parseInt(document.getElementById('numThreads').value);
            
            // Mostrar loading
            document.getElementById('loading').style.display = 'block';
            resetResults();
            
            try {
                // Cálculo secuencial
                const sequentialResult = dotProductSequential(vectorA, vectorB);
                document.getElementById('sequentialResult').textContent = sequentialResult.result.toFixed(6);
                document.getElementById('sequentialTime').textContent = sequentialResult.time.toFixed(2) + ' ms';
                
                // Cálculo paralelo
                const parallelResult = await dotProductParallel(vectorA, vectorB, numThreads);
                document.getElementById('parallelResult').textContent = parallelResult.result.toFixed(6);
                document.getElementById('parallelTime').textContent = parallelResult.time.toFixed(2) + ' ms';
                
                // Análisis de rendimiento
                const speedup = sequentialResult.time / parallelResult.time;
                const efficiency = (speedup / numThreads) * 100;
                const difference = Math.abs(sequentialResult.result - parallelResult.result);
                const precision = difference < 1e-9 ? '✓ Alta' : '✗ Baja';
                
                document.getElementById('speedup').textContent = speedup.toFixed(2) + 'x';
                document.getElementById('efficiency').textContent = efficiency.toFixed(1) + '%';
                document.getElementById('difference').textContent = difference.toExponential(2);
                document.getElementById('precision').textContent = precision;
                
            } catch (error) {
                alert('Error en el cálculo: ' + error.message);
                console.error('Error:', error);
            } finally {
                // Ocultar loading
                document.getElementById('loading').style.display = 'none';
            }
        }

        // Inicializar la aplicación
        function initialize() {
            generateVectors();
            
            // Event listeners para inputs
            document.getElementById('vectorSize').addEventListener('change', generateVectors);
            document.getElementById('initPattern').addEventListener('change', generateVectors);
            
            // Validar número de hilos
            document.getElementById('numThreads').addEventListener('change', function() {
                const numThreads = parseInt(this.value);
                const vectorSize = parseInt(document.getElementById('vectorSize').value);
                
                if (numThreads > vectorSize) {
                    this.value = vectorSize;
                    alert('El número de hilos no puede ser mayor que el tamaño del vector');
                }
            });
        }

        // Inicializar cuando se carga la página
        window.addEventListener('load', initialize);
    </script>
</body>
</html>
