var Resultados = [];
var DurezaAcumulado = [];
var Indexacao = 0;
var Diagonal="";
var Carga = "";
var Unidade = "";
var HV = "";
var TempoTeste = "";


function CalcularDureza() {

    if (document.getElementById("frmCarga").value == "") {
        $('#ModalCarga').modal('show');
    } else{

        if (document.getElementById("frmDiagonal_1").value == "" || document.getElementById("frmDiagonal_2")
        .value == "") {
            $('#ModalDiagonal').modal('show');
        } else {
            var D1 = document.getElementById("frmDiagonal_1").value
            var D2 = document.getElementById("frmDiagonal_2").value

            Diagonal = (parseFloat(D1) + parseFloat(D2)) / 2;
            document.getElementById("frmDiagonal").value = Diagonal

            Carga = parseFloat(document.getElementById("frmCarga").value);
            Unidade = parseFloat(document.getElementById("frmUnidade").value);
            HV = 0.1891 * (9.80665 * Carga) / (Diagonal * Diagonal);
            HV = HV * Unidade;

            TempoTeste = parseFloat(document.getElementById("frmTempo").value);

            document.getElementById("frmValorHV").innerHTML = HV.toFixed(0);
            document.getElementById("frmValorCarga").innerHTML = Carga;
            document.getElementById("frmValorTempo").innerHTML = TempoTeste;

            document.getElementById("divResultados").style.visibility = "visible";
            // document.getElementById("containerResultados").style.visibility = "visible";
        };
    };

}

function AcumularResultado() {

    if (HV == 0) {
        return;
    }

    document.getElementById("containerResultados").style.visibility = "visible";
    // document.getElementById("divSalvarMedicao").style.visibility = "visible";
    document.getElementById("frmGrafico").style.visibility = "visible";

    Resultados[Indexacao] = "<tr style='text-align: center'>";
    Resultados[Indexacao] += "<th scope='row'>" + (Indexacao + 1) + "</th>";
    Resultados[Indexacao] += "<td>" + HV.toFixed(0) + "</td>";
    Resultados[Indexacao] += "<td>" + Carga + "</td>";
    Resultados[Indexacao] += "<td>" + TempoTeste + "</td>";
    Resultados[Indexacao] += "<td> <button disabled id='btnRemove_" + Indexacao +
        "' class='btn btn-danger btn-fab btn-round' onclick='RemoverResultado(" + Indexacao +
        ")'> <i class='material-icons md-18'>delete_sweep</i> </button> </td>";
    Resultados[Indexacao] += "</tr>";
    document.getElementById("TabResultados").innerHTML = Resultados;

    DurezaAcumulado[Indexacao] = HV;

    EstatisticaDescritiva();

    if (Indexacao == 0) {
        document.getElementById("btnRemove_" + Indexacao).disabled = true;
    } else {
        document.getElementById("btnRemove_" + Indexacao).disabled = false;
    }

    // document.getElementById("frmDiagonal_1").focus();

    CarregarDivGraficos();

    Indexacao = Indexacao + 1;

    // Carregando variaveis
    // CarregarVariaveisDB();

}

function RemoverResultado(i) {
    Resultados.splice(i, 1);
    DurezaAcumulado.splice(i, 1);
    document.getElementById("TabResultados").innerHTML = Resultados;

    EstatisticaDescritiva();

    CarregarDivGraficos();

    Indexacao = Indexacao - 1;

    if (Indexacao == 1) {
        document.getElementById("btnRemove_" + Indexacao).disabled = true;
    } else {
        document.getElementById("btnRemove_" + (Indexacao - 1)).disabled = false;
    }

    CarregarVariaveisDB();
}

function EstatisticaDescritiva() {

    document.getElementById("frmStats").innerHTML = "<td>" + math.mean(DurezaAcumulado).toFixed(0) +
        "</td><td>" + math.max(DurezaAcumulado).toFixed(0) + "</td><td>" + math.min(DurezaAcumulado).toFixed(
            0) + "</td><td>" + math.std(DurezaAcumulado).toFixed(2) + "</td>";

}

function CarregarDivGraficos() {

    document.getElementById("frmGrafico").innerHTML =
        "<button id='btnCriarGrafico' type='button' class='btn btn-success btn-lg btn-block' onclick='CriarGrafico()'>Criar Gráfico</button>" +
        "<canvas id='line-chart' width='100%' height='50'></canvas>";

}

function CarregarVariaveisDB() {

    DBPonto = Indexacao;
    DBDureza = DurezaAcumulado;
    DBTempoTeste = parseFloat(document.getElementById("frmValorTempo").value);
    DBCargaTeste = parseFloat(document.getElementById("frmValorCarga").value);

}

function CriarGrafico() {
    var labels = [];
    for (var i = 0; i < DurezaAcumulado.length; i++) {
        labels[i] = i + 1;
    };
    new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: DurezaAcumulado,
                borderColor: "#3e95cd",
                fill: false
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Dureza'
            },
            legend: {
                display: false,
                labels: {
                    fontColor: 'rgb(255, 99, 132)'
                }
            }
        }
    });
};