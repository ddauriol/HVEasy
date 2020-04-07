// esquema dos dados
var durezaHV = {
    label: "",
    date: "",
    carga: 0,
    tempoTeste: 0,
    valoreMedidos: {
        id: 0,
        durezaHV: 0
    }
};

var Resultados = [];
var DurezaAcumulado = [];
var Indexacao = 0;

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

async function CalcularDureza() {

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

            var [HV, Diagonal] = await calcHV(D1,D2, Carga, Unidade)
            console.log(HV)
            frmDiagonal.value = Diagonal
            var TempoTeste = parseFloat(frmTempo.value);

            frmValorHV.innerHTML = HV.toFixed(0);
            frmValorCarga.innerHTML = Carga / 1000;
            frmValorTempo.innerHTML = TempoTeste;
            var [GPA, MPA] = await convertMPA(HV)
            HVtoMPA.innerHTML = MPA
            HVtoGPA.innerHTML = GPA

            divResultados.style.visibility = "visible";
        };
    };

}

function calcHV(D1, D2, Carga, Unidade) {
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