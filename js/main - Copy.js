/*
    ----------------------------------------------
    ----------  /udemy.antonydev.tech/  ----------
    ----------  /curso-ia-web-local/  ------------
    ----------  /06-modelo-prompts/  -------------
    ----------  /main.js  ------------------------
    ----------------------------------------------
*/


// //@ts-check


(() => {



    const init = async () => {


        const status = document.querySelector('#status');
        const responseBox = document.querySelector('#response');
        const input = document.querySelector('#userInput');
        const askBtn = document.querySelector('#askGeniusBtn');


        //  -----  Comprobar disponibilidad del modelo  -----
        status.innerHTML = '🔮 Comprobando si el Genio aparece...'
        //setTimeout(() => status.innerHTML = '', 1000);




        try {


            //  -------------------------------------------------
            //  -----  Comprobar disponibilidad del modelo  -----
            //  -------------------------------------------------
            const avail = await LanguageModel.availability();

            if (avail === "unavailable") {
                status.innerHTML = '💤 Lo siento, El Genio esta durmiendo...';
                return;
            }

            if (avail === "downloadable")
                status.innerHTML = '📦 El Genio está disponible para descargar, haz clic para activarlo.';


            //  -------------------------------------
            //  -----  Crear sesión del modelo  -----
            //  -------------------------------------
            const session = await LanguageModel.create({

                monitor(m) {

                    m.addEventListener('downloadprogress', (e) => {

                        const percent = Math.round((e.loaded / e.total) * 100);
                        status.innerHTML = `📩 Descargando Magia ${percent}%`;

                    });
                },
            });


            //  -----  Preparado para usar el modelo  -----
            status.innerHTML = '💡 El Genio esta preparado, Pidele algo...';


            //  -----------------------------------------------------
            //  -----  Evento para botón de preguntar al genio  -----
            //  -----------------------------------------------------
            askBtn.addEventListener('click', async () => {

                const question = input.value.trim();

                if (!question) {
                    status.innerHTML = '❓ Por favor, escribe una pregunta para el Genio.';
                    input.focus();
                    return;
                }


                status.innerHTML = '🔋 El Genio está pensando...';
                responseBox.textContent = '';

                try {

                    const result = await session.prompt(question);

                    responseBox.textContent = result.text;
                    status.innerHTML = '✅ El Genio ha respondido a tu pregunta, Deseo Concebido...';
                    input.focus();
                }

                catch (error) {

                    console.error('❌ El Genio se ha equivocado...\n\n', error);
                    status.innerHTML = '❌ El Genio se ha equivocado, Intentalo más tarde...';
                    responseBox.textContent = '';
                }

                finally {

                    input.focus();
                }


            });


        } 
        
        catch (error) {

            console.error('❌ El Genio está Cansado, Intentalo más tarde...\n\n', error, '\n');
            status.innerHTML = '❌ El Genio está Cansado, Intentalo más tarde...';
        }

    }


    //  -----  Iniciar la aplicación  -----
    init();



})();
