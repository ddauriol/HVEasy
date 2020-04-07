// esquema dos dados
var durezaHV = {
    label: "",
    carga: 0,
    tempoTeste: 0,
    valoreMedidos: []
};

var Indexacao = 1;

// Elementos do Displays
const frmCarga = document.getElementById("frmCarga")
const frmDiagonal_1 = document.getElementById("frmDiagonal_1")
const frmDiagonal_2 = document.getElementById("frmDiagonal_2")
const frmDiagonal = document.getElementById("frmDiagonal")
const frmUnidade = document.getElementById("frmUnidade")
const frmTempo = document.getElementById("frmTempo")
const frmValorHV = document.getElementById("frmValorHV")
const frmValorCarga = document.getElementById("frmValorCarga")
const frmValorTempo = document.getElementById("frmValorTempo")
const HVtoMPA = document.getElementById("HVtoMPA")
const HVtoGPA = document.getElementById("HVtoGPA")
const divResultados = document.getElementById("divResultados")
const tableResultadosCargaTempo = document.getElementById("tableResultadosCargaTempo")
const tableResultados = document.getElementById("tableResultados")
const thMedia = document.getElementById("thMedia")
const thMediaMpaGpa = document.getElementById("thMediaMpaGpa")
const thStd = document.getElementById("thStd")
const divTabResultados = document.getElementById("divTabResultados")
const divFrmTempo = document.getElementById("divFrmTempo")

async function CalcularDureza() {

    if (frmTempo.value == "") {
        $('#ModalTempo').modal('show');
    } else {
        if (frmCarga.value == "") {
            $('#ModalCarga').modal('show');
        } else {
            if (frmDiagonal_1.value == "" || frmDiagonal_2
                .value == "") {
                $('#ModalDiagonal').modal('show');
            } else {
                var D1 = frmDiagonal_1.value
                var D2 = frmDiagonal_2.value
                var Carga = parseFloat(frmCarga.value);
                var Unidade = parseFloat(frmUnidade.value);
                var [HV, Diagonal] = await calcHV(D1, D2, Carga, Unidade)
                var [GPA, MPA] = await convertMPA(HV)
                var TempoTeste = parseFloat(frmTempo.value);

                frmDiagonal.value = Diagonal
                frmValorHV.innerHTML = HV.toFixed(0);
                frmValorCarga.innerHTML = Carga / 1000;
                frmValorTempo.innerHTML = TempoTeste;
                HVtoMPA.innerHTML = MPA
                HVtoGPA.innerHTML = GPA

                divResultados.style.visibility = "visible";
            };
        };
    };
}

function calcHV(D1, D2, Carga, Unidade) {
    if (D1 < 0){
        D1 = D1*-1
    }
    if (D2 < 0){
        D2 = D2*-1
    }
    var Diagonal = (parseFloat(D1) + parseFloat(D2)) / 2;
    var HV = 0.1891 * (9.80665 * Carga) / (Diagonal * Diagonal);
    HV = HV * Unidade;
    return [HV, Diagonal]
}

function convertMPA(HV){
    var MPA = (HV.toFixed(0) * 9.807).toFixed(2);
    var GPA = (HV.toFixed(0) * 0.009807).toFixed(2);
    return [MPA, GPA]
}

function AddValue(){
    var date = new Date()
    var dateFull = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()
    if (durezaHV['label'] == ""){
        durezaHV['label'] = dateFull
        durezaHV['carga'] = parseFloat(frmValorCarga.textContent)
        durezaHV['tempoTeste'] = parseInt(frmValorTempo.textContent)
    }
    durezaHV['valoreMedidos'][Indexacao - 1] = {id: Indexacao, durezaHV: parseInt(frmValorHV.textContent)}
    Indexacao = Indexacao + 1
    updateTableResultados()
}

async function updateTableResultados(){
    tableResultadosCargaTempo.innerHTML = "HV " + durezaHV['carga'] + " / " + durezaHV['tempoTeste']
    var txtHTML = ''
    var mediaHV = 0
    var valores = []
    Object.entries(durezaHV['valoreMedidos']).forEach(([key, medicao]) => {
        valores.push(medicao['durezaHV'])
        mediaHV = mediaHV + medicao['durezaHV']
        var [MPA, GPA] = convertMPA(medicao['durezaHV']) 
        txtHTML += `<tr id="res_${medicao['id']}">
        <th scope="row">${medicao['id']}</th>
        <td>${medicao['durezaHV']}</td>
        <td>${MPA}</td>
        <td>${GPA}</td>
        <td>
            <button id="bnt_res_${medicao['id']}" class="btn btn-danger btn-fab btn-fab-mini btn-round"
            onclick="removeMedicao(${medicao['id']})">
                <i class="material-icons">clear</i>
            </button>
        </td>
    </tr>`
    });
    tableResultados.innerHTML = txtHTML
    mediaHV = mediaHV / durezaHV['valoreMedidos'].length
    var [MPA, GPA] = convertMPA(mediaHV) 
    thMedia.innerHTML = parseInt(mediaHV) + "HV " + durezaHV['carga'] + " / " + durezaHV['tempoTeste']
    thMediaMpaGpa.innerHTML = "MPA: " + MPA + " GPA: " + GPA
    thStd.innerHTML = "Desvio Padrão: " + math.std(valores).toFixed(3)
    frmTempo.disabled = "disabled"
    frmCarga.disabled = "disabled"
    divTabResultados.style.visibility = "visible";
}

function removeMedicao(i){
    Object.entries(durezaHV['valoreMedidos']).forEach(([key, medicao]) => {
        if (medicao['id'] == i){
            durezaHV['valoreMedidos'].splice(key, 1)
        }
    });
    updateTableResultados()
}

function resetFrm(){
    durezaHV = {
        label: "",
        carga: 0,
        tempoTeste: 0,
        valoreMedidos: []
    };
    
    Indexacao = 1;
    frmTempo.disabled = ""
    frmCarga.disabled = ""
    divTabResultados.style.visibility = "hidden";
    divResultados.style.visibility = "hidden";
    frmDiagonal_1.value = 0
    frmDiagonal_2.value = 0
    frmDiagonal_1.focus();
    window.scrollTo(0, 0)
}