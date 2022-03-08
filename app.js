// Adiciona as funcoes aos botoes de cadastrar despesas e de pesquisar. O try serve para adicionar as funcoes somente quando encontrar o elemento na pagina e evitar erros no console.
try {
    document.getElementById('adicionarDespesa').addEventListener('click', () => { cadastrarDespesa() })
}
catch (e) {
}
try {
    document.getElementById('pesquisar').addEventListener('click', () => { pesquisarDespesa() })
}
catch (e) {
}

// Criacao da classe Despesa e de seus atributos.
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
}

// Criacao da classe de Banco de Dados para armazenar as informacoes no local storage
class Bd {
    constructor() {
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }
    //Funcao que gera um numero de id sucessor ao id do item atual do local storage
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    //Funcao que salva o item de despesa em forma de JSON no local sotorage
    salvar(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
    //Recupera as despesas do local storage, transforma em um objeto javascript e armazena em um vetor
    recuperarTodosRegistros() {
        let despesas = []
        let id = localStorage.getItem('id')

        for (let i = 0; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            if (despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }
    //Funcao para pesquisar despesas
    pesquisar(despesa) {
        let despesasFiltradas = this.recuperarTodosRegistros()
        //Filtro do ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //Filtro do mes
        if (despesa.mes != undefined) {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //Filtro do dia
        if (despesa.dia != undefined) {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //Filtro do tipo
        if (despesa.tipo != 'Tipo') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //Filtro de descricao
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //Filtro do valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas
    }
    //Funcao que remove item do local storage a partir do id passado
    remover(id) {
        localStorage.removeItem(id)
        location.reload()
    }
}
//Instanciacao do objeto da classe BD
let bd = new Bd()

//Controle para que a despesa so possa ser registrada ate o dia atual
let diaAtual = new Date()
let dd = diaAtual.getDate()
let mm = diaAtual.getMonth() + 1//Mes começa no 0, entao para tornar compativel com o input de data somei mais um
let yyyy = diaAtual.getFullYear()
//Adiciona o zero para dias e meses em que o número for menor que 10
if (dd < 10) {
    dd = '0' + dd
}
if (mm < 10) {
    mm = '0' + mm
}
diaAtual = yyyy + '-' + mm + '-' + dd
try {
    document.getElementById('date').setAttribute('max', diaAtual)//Adiciona como regra o maximo como dia atual
}
catch (e) {
}
//Funcao que gera o modal de erro caso algum campo seja preenchido incorretamente ou nao seja preenchido
function erro() {
    document.getElementById('erro ou sucesso').classList.add('text-danger')
    document.getElementById('botaoModal').classList.add('btn-danger')
    document.getElementById('exampleModalLabel').innerHTML = "Erro na gravação"
    document.getElementById('texto').innerHTML = "Existem campos obrigatórios que não foram preenchidos ou são inválidos!"
    document.getElementById('botaoModal').innerHTML = "Voltar e corrigir"
    $('#modalGravacao').modal('show')
}
//Funcao que gera o modal de sucesso caso a despesa seja adicionada
function ok() {
    document.getElementById('erro ou sucesso').className = "modal-header text-success"
    document.getElementById('botaoModal').className = "btn btn-success"
    document.getElementById('exampleModalLabel').innerHTML = "Gravação feita com sucesso"
    document.getElementById('texto').innerHTML = "Sua despesa foi registrada com sucesso"
    document.getElementById('botaoModal').innerHTML = "Fechar"
    $('#modalGravacao').modal('show')
    document.getElementById('date').value = 0
    document.getElementById('tipo').value = ''
    document.getElementById('descricao').value = ''
    document.getElementById('valor').value = ''
}

//Funcao para cadastrar uma despesa
function cadastrarDespesa() {
    let data = (document.getElementById('date').value).split('-')
    let t = document.getElementById('tipo')
    let tipo = t.options[t.selectedIndex].text
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    //Validacoes
    let validarData = (function () {
        if (+data[0] > yyyy || data == '') {
            erro()
            document.getElementById('date').className = 'form-control is-invalid'
            return false
        }
        else {
            document.getElementById('date').className = 'form-control is-valid'
        }
    })()

    let validarTipo = (function () {
        if (tipo === 'Tipo') {
            erro()
            document.getElementById('tipo').className = 'form-control is-invalid'
            return false
        }
        else {
            document.getElementById('tipo').className = 'form-control is-valid'
        }
    })()

    let validarValor = (function () {
        if (+valor > 99999999999 || +valor <= 0) {
            erro()
            document.getElementById('valor').className = 'form-control is-invalid'
            return false
        }
        else {
            document.getElementById('valor').className = 'form-control is-valid'
        }
    })()

    let validarDescricao = (function () {
        if (descricao === '') {
            erro()
            document.getElementById('descricao').className = 'form-control is-invalid'
            return false
        }
        else {
            document.getElementById('descricao').className = 'form-control is-valid'
        }
    })()
    //Caso todas as validacoes passem, a despesa eh adicionada e as validacoes de input voltam para neutro 
    if (validarData != false && validarTipo != false && validarDescricao != false && validarValor != false) {
        let despesa = new Despesa(
            ano = data[0],
            mes = data[1],
            dia = data[2],
            tipo,
            descricao,
            valor
        )
        document.getElementById('date').classList.remove('is-valid')
        document.getElementById('tipo').classList.remove('is-valid')
        document.getElementById('valor').classList.remove('is-valid')
        document.getElementById('descricao').classList.remove('is-valid')
        bd.salvar(despesa)
        ok()

    }
}
/*Funcao para inserir as despesas na pagina html. Caso nao haja um filtro (padrao = false) e o array de despesas esteja vazio todas as despesas sao carregadas, caso contrario
apenas as despesas que estao no array sao carregadas*/
function carregarDespesas(despesas = [], filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }
    else if (despesas.length == 0 && filtro == true) {
        alert('Não houve correspondências com a sua pesquisa')
    }
    let listaDespesa = document.getElementById('listaDespesas')
    listaDespesa.innerHTML = ''
    despesas.forEach(function (d) {
        let linha = listaDespesa.insertRow()
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
        //Criacao do botao de remover despesa
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        //Funcao de remocao de despesa
        btn.onclick = function () {
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
        }
        linha.insertCell(4).append(btn)
    })
}
/*Funçao usada para os campos de pesquisa da pagina consulta.html. Eh criado um objeto da classe despesa com os valores passados para os campos, se existirem, e a partir
desse objeto eh feito uma pesquisa utilizando o metodo pesquisa do classe Bd*/
function pesquisarDespesa() {
    let data = (document.getElementById('date').value).split('-')
    ano = data[0]
    mes = data[1]
    dia = data[2]
    let t = document.getElementById('tipo')
    let tipo = t.options[t.selectedIndex].text
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    console.log(despesa)
    let despesas = bd.pesquisar(despesa)

    this.carregarDespesas(despesas, true)
}
//Para evitar erros no console, essa parte do codigo so eh executada na pagina resumo.html onde os graficos serao utilizados
if (window.location.pathname == "/resumo.html") {
    //Para plotar um grafico de resumo das despesas usei o chart.js: https://www.chartjs.org/
    let canvas = document.getElementById("myChart");
    let ctx = canvas.getContext("2d")
    let despesas = bd.recuperarTodosRegistros()
    let alimentacaoVal = 0
    let educacaoVal = 0
    let lazerVal = 0
    let suadeVal = 0
    let transporteVal = 0
    let valores = []
    //Separa o valor da despesa de acordo com o tipo de despesa
    for (despesa in despesas) {
        let tipo = despesas[despesa].tipo
        let valor = despesas[despesa].valor
        switch (tipo) {
            case 'Alimentação':
                alimentacaoVal += parseFloat(valor)
                break
            case 'Educação':
                educacaoVal += parseFloat(valor)
                break
            case 'Lazer':
                lazerVal += parseFloat(valor)
                break
            case 'Saúde':
                suadeVal += parseFloat(valor)
                break
            case 'Transporte':
                transporteVal += parseFloat(valor)
                break
        }
    }
    valores.push(alimentacaoVal)
    valores.push(educacaoVal)
    valores.push(lazerVal)
    valores.push(suadeVal)
    valores.push(transporteVal)
    //Atribui a variavel soma a soma de todos os valores no vetor de valores atravaes da arrow function e depois transforma em formato monetario brasileiro
    soma = valores.reduce((a, b) => a + b, 0)
    soma = soma.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    let dados = {
        datasets: [{
            //Os valores armazenados no vetor valores serao usados como dados do grafico
            data: valores,
            //Cria-se uma propriedade para adicionar cores aos respectivos valores do vetor data
            backgroundColor: ['rgb(100,149,237)', 'rgb(65,105,225)', 'rgb(30,144,255)', 'rgb(0,191,255)', 'rgb(135,206,250)']
        }],
        //Cria-se legendas para os respectivos valores do vetor data
        labels: ['Alimentação', 'Educação', 'Lazer', 'Saúde', 'Transporte']
    }
    //Plota o grafico do tipo donaught instanciando um novo objeto da classe Chart com os dados anteriores definidos
    let graficoDonaught = new Chart(ctx, {
        type: 'doughnut',
        data: dados,
    })
    //Para gerar as opcoes do grafico utilizo uma funcao criada para economizar linhas de codigo pois utilizo essas mesma configuracao de opcoes duas vezes 
    graficoDonaught.options = gerarOpcoesDonaught(graficoDonaught)
    graficoDonaught.update()
    //Funcao usada para substituir o antigo grafico por um novo do tipo line e que traz apenas informacoes do tipo de despesa especifico
    function mudarParaLine(chart, tipo) {
        chart.destroy()
        let elemento = document.getElementById('area_total')
        elemento.remove()
        let meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        //Obter despesa dos meses
        gastos_mensais = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let mes in meses) {
            for (despesa in despesas) {
                if (despesas[despesa].mes == parseFloat(mes) + 1 && despesas[despesa].tipo == tipo) {
                    gastos_mensais[mes] = parseFloat(gastos_mensais[mes]) + parseFloat(despesas[despesa].valor)
                }
            }
        }
        let data = {
            labels: meses,
            datasets: [{
                label: tipo,
                data: gastos_mensais,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
        chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                plugins: {
                    plugintotal: false//Como aqui nao quero que aparece o total das despesas, desativo o plugin
                }
            }
        });
        //Criacao de um botao no DOM responsavel por voltar para o grafico original e continuar uma navegacao dinamica
        let divNova = document.createElement("div");
        let svg = document.createElement("button")
        svg.style.width = "40px"
        svg.style.height = "40px"
        svg.style.padding = "6px 0px"
        svg.style.borderRadius = "20px"
        svg.style.textAlign = "center"
        svg.style.fontSize = "17px"
        svg.style.lineHeight = 1.42857
        svg.id = "botao-voltar"
        svg.setAttribute('class', "btn btn-primary btn-lg btn-circle")
        let i = document.createElement('i')
        i.setAttribute('class', "fa fa-arrow-left")
        svg.appendChild(i)
        divNova.appendChild(svg);
        let divAtual = document.getElementById("myChart");
        let divPai = divAtual.parentNode
        divPai.insertBefore(divNova, divAtual);
        let botao = document.getElementById("botao-voltar")
        //Ao clicar no botao de voltar o grafico de linhas eh substituido pelo grafico de donaught original
        botao.onclick = function () {
            botao.remove()
            chart.destroy()
            chart = new Chart(ctx, {
                type: 'doughnut',
                data: dados,
            });
            chart.options = gerarOpcoesDonaught(chart)
            chart.update()
        }
    }
    //Registro do plugin que eh usado para inserir o total das depesas nom meio do grafico donaught 
    let plugin = {
        id: 'plugintotal',//Id usado para identificar o plugin
        beforeDraw: function (chart) {
            if (!chart.$rendered) {//If usado para controlar a renderizacao do total, sendo que so deve ser feito uma vez antes do grafico ser plotado
                chart.$rendered = true;
                //Criacao de elementos no dom para abrigar a informacao do valor total das despesas
                let divAreaTotal = document.createElement("div")
                divAreaTotal.style.width = "100%"
                divAreaTotal.style.height = "40px"
                divAreaTotal.style.position = "absolute"
                divAreaTotal.style.top = "55%"
                divAreaTotal.style.left = "0"
                divAreaTotal.style.marginTop = "-20px"
                divAreaTotal.style.lineHeight = "19px"
                divAreaTotal.style.textAlign = "center"
                divAreaTotal.style.zIndex = 999999999999999
                divAreaTotal.setAttribute('id', "area_total")
                let texto = document.createTextNode('Total')
                divAreaTotal.appendChild(texto)
                divAreaTotal.appendChild(document.createElement("br"))
                let spanTotal = document.createElement("span")
                spanTotal.setAttribute('id', "total")
                divAreaTotal.appendChild(spanTotal)
                document.getElementById('pai-area-total').appendChild(divAreaTotal)
                document.getElementById('total').innerHTML = soma
            }
        }
    };
    Chart.register(plugin);
    //Funcao para gerar as opcoes dos graficos do tipo donaught que sao plotados durante a aplicacao
    function gerarOpcoesDonaught(nomeChart) {
        let opcoesGeradas = {
            cutoutPercentage: 40,
            //Funcao usada para chamar funcao que altera o tipo de grafico a partir do evento de clique
            onClick: (e) => {
                //Obtem o nome da secao em que o envento do clique foi registrado
                const points = nomeChart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true)
                if (points.length) {
                    const firstPoint = points[0]
                    const label = nomeChart.data.labels[firstPoint.index]
                    mudarParaLine(nomeChart, label)
                }
            },
            layout: {
                padding: {
                    top: 20,
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Resumo das despesas',
                    font: {
                        size: 50
                    }
                },
                legend: {
                    labels: {
                        font: {
                            size: 16
                        },
                        usePointStyle: true,
                        padding: 20
                    }
                }
            }
        }
        return opcoesGeradas
    }
}