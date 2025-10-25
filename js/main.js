/*
    ----------------------------------------------
    ----------  /udemy.antonydev.tech/  ----------
    ----------  /curso-ia-web-local/  ------------
    ----------  /06-modelo-prompts/  -------------
    ----------  /main.js  ------------------------
    ----------------------------------------------
*/

//@ts-check

(() => {

    /**
     * Referencia al modelo de lenguaje (LanguageModel) disponible en window.
     * @type {typeof LanguageModel | undefined}
     */
    // @ts-ignore
    const LanguageModel = window.LanguageModel;

    /** 
     * Instancia activa del modelo de lenguaje.
     * @type {any | undefined}
     */
    let session;

    /** 
     * Botón que el usuario presiona para enviar una pregunta al modelo.
     * @type {HTMLButtonElement | null} 
     */
    const askBtn = document.querySelector('#askGeniusBtn');

    /** 
     * Campo de entrada de texto donde el usuario escribe su pregunta.
     * @type {HTMLInputElement | null} 
     */
    const input = document.querySelector('#userInput');

    /** 
     * Contenedor donde se muestra el estado actual del modelo.
     * @type {HTMLDivElement | null} 
     */
    const status = document.querySelector('#status');

    /** 
     * Contenedor donde se muestra la respuesta generada por el modelo.
     * @type {HTMLDivElement | null} 
     */
    const responseBox = document.querySelector('#response');


    //  -----  Validar que los elementos del DOM existan  -----
    if (!askBtn || !input || !status || !responseBox) {
        throw new Error('❌ Faltan elementos del DOM (verifica IDs en el HTML)');
    }


    //  ---------------------------------------------------
    //  -----  Evento click del botón de preguntar  -----
    //  ---------------------------------------------------
    askBtn.addEventListener('click', async () => {

        /** 
         * Pregunta escrita por el usuario.
         * @type {string} 
         */
        const question = input.value.trim();

        if (!question) {
            status.textContent = '❓ Por favor, escribe una pregunta para el Genio.';
            input.focus();
            return;
        }

        //  -----  Verificar soporte del API de Modelos de Lenguaje  -----
        if (!LanguageModel) {
            status.textContent = '⚠️ - Tu navegador no soporta el API de modelos locales.';
            return;
        }

        status.textContent = '🔮 Comprobando si el Genio aparece...';


        //  -----  Comprobar disponibilidad del modelo  -----
        /**
         * Estado de disponibilidad del modelo de lenguaje.
         * @type {"available" | "unavailable" | "downloadable"}
         */
        const disponible = await LanguageModel.availability();

        if (disponible === "unavailable") {
            status.textContent = '💤 Lo siento, El Genio está durmiendo...';
            return;
        }


        //  -----------------------------------------
        //  -----  Crear una sesión del modelo  -----
        //  -----------------------------------------
        status.textContent = '📦 Preparando al Genio...';

        try {

            session = await LanguageModel.create({

                /**
                 * Monitorea el progreso de descarga del modelo local.
                 * @param {{ addEventListener: (event: string, callback: (e: ProgressEvent) => void) => void }} monitor
                 */
                monitor(monitor) {
                    monitor.addEventListener('downloadprogress', (e) => {
                        if (e.lengthComputable) {
                            const percent = Math.round((e.loaded / e.total) * 100);
                            status.textContent = `📩 Descargando Magia ${percent}%`;
                        }
                    });
                }
            });

        } catch (error) {
            console.error('❌ Error al crear la sesión del modelo:', error);
            status.textContent = '⚠️ No se pudo crear la sesión del modelo.';
            return;
        }

        //  -----  Modelo listo -----
        status.textContent = '💡 El Genio está preparado, pídele algo...';


        //  --------------------------------------------------------
        //  -----  Animación mientras el modelo piensa  -----
        //  --------------------------------------------------------
        let dots = 0;

        /** 
         * Intervalo de animación (puntos suspensivos).
         * @type {ReturnType<typeof setInterval>} 
         */
        const blinkInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            status.textContent = '🔋 El Genio está pensando' + '.'.repeat(dots);
        }, 500);

        responseBox.textContent = '';


        //  ------------------------------------------
        //  -----  Generar respuesta del modelo  -----
        //  ------------------------------------------
        try {

            /** 
             * Resultado generado por el modelo. 
             * @type {string | undefined} 
             */
            const result = await session.prompt(question);

            clearInterval(blinkInterval);

            if (!result) {
                responseBox.textContent = '⚠️ No se generó ninguna respuesta.';
                return;
            }

            responseBox.textContent = result;
            status.textContent = '✅ El Genio ha respondido. ¡Deseo concebido!';

        } catch (error) {

            clearInterval(blinkInterval);
            console.error('❌ Error al procesar la pregunta:', error);
            status.textContent = '⚠️ El Genio se ha equivocado, inténtalo más tarde.';
            responseBox.textContent = '';

        } finally {
            input.focus();
        }


    });

    
})();
