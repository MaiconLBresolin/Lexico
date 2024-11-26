var collection = []
var global = 0
var matriz = []
var valores = [[]]

$(document).ready(function () {
  // monta a matriz e valida entradas
  criaMatriz()
  $("#validador").keyup(function (e) {
    if (matriz.length > 0) {
      validaPalavra(e)
    }
  })
})

// função principal
function criaMatriz() {
  valores = [[]]
  global = 0
  matriz = []

  montaEstados()
  matriz = geraLinhas()
  populaTabela(matriz)
}

// monta os estados do automato
function montaEstados() {
  // le palavras
  for (var i = 0; i < collection.length; i++) {
    var estadoAtual = 0
    var palavra = collection[i]

    // le caractere
    for (var j = 0; j < palavra.length; j++) {
      if (typeof valores[estadoAtual][palavra[j]] === "undefined") {
        var novoEstado = global + 1
        valores[estadoAtual][palavra[j]] = novoEstado
        valores[novoEstado] = []
        global = estadoAtual = +novoEstado
      } else {
        estadoAtual = valores[estadoAtual][palavra[j]]
      }
      // estado final
      if (j == palavra.length - 1) {
        valores[estadoAtual]["final"] = true
      }
    }
  }
}

// gera linhas da matriz
function geraLinhas() {
  var vetores = []
  for (var i = 0; i < valores.length; i++) {
    var iniAlfabeto = "a"
    var fimAlfabeto = "z"
    var temp = []
    temp["estado"] = i

    for (
      var j = iniAlfabeto.charCodeAt(0);
      j <= fimAlfabeto.charCodeAt(0);
      j++
    ) {
      var letra = String.fromCharCode(j)

      // -, se nao tiver letra na posição
      if (typeof valores[i][letra] === "undefined") {
        temp[letra] = "-"
      } else {
        temp[letra] = valores[i][letra]
      }
    }
    if (typeof valores[i]["final"] !== "undefined") {
      temp["final"] = true
    }
    vetores.push(temp)
  }
  return vetores
}

function populaTabela(vetores) {
  var iniAlfabeto = "a"
  var fimAlfabeto = "z"
  var tabelaHTML = $("#automato")
  tabelaHTML.html("")
  var tr = $(document.createElement("tr"))
  var th = $(document.createElement("th"))
  th.html("")
  tr.append(th)

  //cabeçalho
  for (var j = iniAlfabeto.charCodeAt(0); j <= fimAlfabeto.charCodeAt(0); j++) {
    var th = $(document.createElement("th"))
    th.html(String.fromCharCode(j))
    tr.append(th)
  }
  tabelaHTML.append(tr)

  //coluna de estado
  for (var i = 0; i < vetores.length; i++) {
    var tr = $(document.createElement("tr"))
    var td = $(document.createElement("td"))

    if (vetores[i]["final"]) {
      td.html("q" + vetores[i]["estado"] + "*")
    } else {
      td.html("q" + vetores[i]["estado"])
    }
    tr.append(td)
    tr.addClass("state_" + vetores[i]["estado"])

    //distribui elemento
    for (
      var j = iniAlfabeto.charCodeAt(0);
      j <= fimAlfabeto.charCodeAt(0);
      j++
    ) {
      var letter = String.fromCharCode(j)
      var td = $(document.createElement("td"))
      td.addClass("letter_" + letter)
      if (vetores[i][letter] != "-") {
        td.html("q" + vetores[i][letter])
      } else {
        td.html("-")
      }
      tr.append(td)
    }
    tabelaHTML.append(tr)
  }
}

//adc tokens
function incluiToken() {
  var value = $("#palavra").val().toLowerCase()

  //se vazio interrompe
  if (value === "") {
    $("#palavra").addClass("error")
    setTimeout(function () {
      $("#palavra").removeClass("error")
    }, 2000)
  } else {
    //valida aceitos
    var segue = true
    for (var i = 0; i < value.length; i++) {
      if (!((value[i] >= "a" && value[i] <= "z") || value[i] === " ")) {
        alert("Caractere inválido: " + value[i])
        segue = false
        break
      }
    }
    // caso tenha somente caracteres aceitos segue
    if (segue) {
      // faz o split da string por espaço caso exista mais de uma palavra
      value = value.split(" ")
      var tamanho = collection.length
      if (value.length > 1) {
        for (i = 0; i < value.length; i++) {
          var existe = false
          tamanho = collection.length

          //se palavra existe
          if (value[i] !== "") {
            for (j = 0; j < collection.length; j++) {
              if (value[i] === collection[j]) {
                existe = true
              }
            }

            //adc caso nao exista
            if (!existe) {
              $("#palavras").append(
                $(
                  '<div class="tabela" id="palavra' +
                    tamanho +
                    '">' +
                    value[i] +
                    " </div>"
                )
              )
              collection.push(value[i])
            }
          }
        }
      } else {
        //prox do split
        var existe = false
        for (j = 0; j < collection.length; j++) {
          if (value[0] === collection[j]) {
            existe = true
          }
        }
        //adc caso ñ exista
        if (!existe) {
          $("#palavras").append(
            $(
              '<td class="tabela" id="palavra' +
                tamanho +
                '">' +
                value[0] +
                " </td>"
            )
          )
          collection.push(value[0])
        }
      }
      $("#palavra").val("")
    }
  }
  $("#automato").empty()
  criaMatriz()
}

function limpaListaTokens(e) {
  $("#palavra").val("")
  $("#validador").val("")
  collection = []
  var palavra = collection[e]
  var temp = []
  collection = []
  collection = temp
  temp = []
  $("#palavras").empty()
  $("#automato").empty()
  criaMatriz()
}

function validaPalavra() {
  var palavras = $("#validador").val().toLowerCase()
  var estado = 0

  $("#validador").removeClass("certo erro")
  $("#automato tr").removeClass("selectedStatus selectedStatusFalse")
  $("#automato td").removeClass("selectedField selectedFieldFalse")
  $("#palavras div").removeClass("validaCerto")

  if (palavras.length === 0) return

  for (var i = 0; i < palavras.length; i++) {
    var letra = palavras[i]

    //letra valida
    if (letra >= "a" && letra <= "z") {
      $("#automato .state_" + estado + " td").removeClass("selectedField")

      //transição pra prox letra
      if (matriz[estado][letra] !== "-") {
        //destaca cedula
        var celula = $("#automato .state_" + estado + " .letter_" + letra)
        celula.addClass("selectedField")

        //att estado
        estado = matriz[estado][letra]
      } else {
        //erro, caso invalida
        $("#validador").addClass("erro")
        var celulaInvalida = $(
          "#automato .state_" + estado + " .letter_" + letra
        )
        celulaInvalida.addClass("selectedFieldFalse")
        return
      }
    } else {
      alert("Caractere inválido: " + letra + " apague-o para continuar!")
      $("#validador").addClass("erro")
      return
    }
  }

  /*  if (valores[estado] && valores[estado]["final"]) {
    $("#validador").addClass("certo")
    $("#palavras div").each(function () {
      if ($(this).text().trim() === palavras) {
        $(this).addClass("validaCerto")
      }
    })
  } else {
    $("#validador").addClass("erro")
  }*/
}
