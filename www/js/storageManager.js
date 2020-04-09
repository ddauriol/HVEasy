const cardsResultados = document.getElementById("cardsResultados")
async function salvarLocalStorage(){
    
    if (!!(window.localStorage.getItem('HVEasy'))) {
        Resultados = JSON.parse((window.localStorage.getItem('HVEasy')));
    }

    var ActiveKey = ''
    Object.entries(Resultados).forEach(([key, durezaHV_saved]) => {
        if (durezaHV_saved['label'] == durezaHV['label']) {
            ActiveKey = key
        }
    });

    if (ActiveKey == ''){
        Resultados.push(durezaHV)
    }else{
        Resultados[parseInt(ActiveKey)] = durezaHV
    }
    
    localStorage.setItem('HVEasy', JSON.stringify(Resultados))
}

async function getLocalStorage(){
    var ResultadosAtuais = []
    if (!!(window.localStorage.getItem('HVEasy'))) {
        ResultadosAtuais = JSON.parse((window.localStorage.getItem('HVEasy')));
    }else{
        return
    }

    var txtHTML = ''
    Object.entries(ResultadosAtuais).forEach(([key, durezaHV]) => {
        var mediaHV = 0
        var valores = []
        var ResultadostxtHTML = ''
        Object.entries(durezaHV['valoreMedidos']).forEach(([key, medicao]) => {
            valores.push(medicao['durezaHV'])
            mediaHV = mediaHV + medicao['durezaHV']
            var [MPA, GPA] = convertMPA(medicao['durezaHV'])
            ResultadostxtHTML += `
            <tr>
                <th scope="row">${medicao['id']}</th>
                <td>${medicao['durezaHV']}</td>
                <td>${MPA}</td>
                <td>${GPA}</td>
            </tr>`
        });
        mediaHV = mediaHV / durezaHV['valoreMedidos'].length
        var [MPA, GPA] = convertMPA(mediaHV)

        txtHTML += `
        <div class="col-12">
            <div class="card card-nav-tabs">
                <div class="card-header card-header-text card-header-rose text-center">
                    <div class="card-text>
                        <b><h4 class="card-title">
                        Medição realizada em: ${durezaHV['label']}
                        </h4></b>
                    </div>
                </div>
                <div class="card-body">
                    <table class="table table-sm text-center">
                        <thead>
                            <tr>
                                <tr>
                                    <th colspan="5">
                                    ${parseInt(mediaHV)} HV ${durezaHV['carga']}/${durezaHV['tempoTeste']}
                                    </th>
                                </tr>
                                <tr>
                                    <th colspan="5">
                                    MPA: ${MPA} GPA: ${GPA} 
                                    </th>
                                </tr>
                                <tr>
                                    <th colspan="5">
                                    Desvio Padrão: ${math.std(valores).toFixed(3)}
                                    </th>
                                </tr>
                            </tr>
                        </thead>
                        <thead class="mb-2">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">HV</th>
                                <th scope="col">MPA</th>
                                <th scope="col">GPA</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ResultadostxtHTML}
                        </tbody>
                    </table>
                    <div class="row">
                            <div class="col-6 text-center">
                                <button class="btn btn-warning btn-round" onclick="shareCSV(${key})">
                                    <i class="material-icons">share</i> Exportar
                                </button>
                            </div>
                            <div class="col-6 text-center">
                                <button class="btn btn-danger btn-round" onclick="deletResultado(${key})">
                                    <i class="material-icons">delete_forever</i> Excluir 
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    });

    cardsResultados.innerHTML = txtHTML
}

async function deletResultado(key){
    var ResultadosAtuais = []
    if (!!(window.localStorage.getItem('HVEasy'))) {
        ResultadosAtuais = JSON.parse((window.localStorage.getItem('HVEasy')));
    }else{
        return
    }
    ResultadosAtuais.splice(key, 1)
    localStorage.setItem('HVEasy', JSON.stringify(ResultadosAtuais))
    getLocalStorage()   
}

async function shareCSV(key){
    var ResultadosAtuais = []
    if (!!(window.localStorage.getItem('HVEasy'))) {
        ResultadosAtuais = JSON.parse((window.localStorage.getItem('HVEasy')));
    }else{
        return
    }
    
    txt = 'Medição;HV ' + ResultadosAtuais[key]['carga'] + "/" + ResultadosAtuais[key]['tempoTeste'] + ";MPA;GPA"
    Object.entries(ResultadosAtuais[key]['valoreMedidos']).forEach(([key, medicao]) => {
        var [MPA, GPA] = convertMPA(medicao['durezaHV'])
        txt += `\n${medicao['id']};${medicao['durezaHV']};${MPA};${GPA}`
    });

    var blob = new Blob([txt], {type: "text/plain;charset=utf-8"});
    var filename = ResultadosAtuais[key]['label'] + '.csv';
    var a = document.createElement("a"),
        url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
    }, 0); 
}