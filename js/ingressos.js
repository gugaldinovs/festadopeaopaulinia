let obj = {
	pagina: "ingressos",
	exclusivo_comissarios: "",
	evento_principal: "",
	loaded: false,
	loading: false,
	dados_empresa: [],
	idcliente: "",
	id_evento: "",
	id_comissario: "",
	result: "",
	setores_cupom: [],
	setores: [],
	cupom_desconto: "",
	showModal: false,
	data_modal: "",
	data_inicio_vendas: "false",
	show_data_inicio: "true",
	carrinho: { qtd: 0, valor_total: 0 },
	loadedSetores: false,
	quantidades: [],
};

// ----------------------GOOGLE TRADUTOR-------------------------------------------------------------------
var comboGoogleTradutor = null; //Varialvel global
let siglaStorage = JSON.parse(localStorage.getItem("linguagem"));
let menu_bandeira_padrão = `https://cdn.guicheweb.com.br/gw-bucket/responsivo/imgs/pt.png`;
let menu_bandeira_alterado = `https://cdn.guicheweb.com.br/gw-bucket/responsivo/imgs/${siglaStorage}.png`;

function googleTranslateElementInit() {
	new google.translate.TranslateElement(
		{
			pageLanguage: "pt",
			includedLanguages: "pt,en,es",
			layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
		},
		"google_translate_element"
	);

	comboGoogleTradutor = document.getElementById("google_translate_element").querySelector(".goog-te-combo");
}

function changeEvent(el) {
	if (el.fireEvent) {
		el.fireEvent("onchange");
	} else {
		var evObj = document.createEvent("HTMLEvents");

		evObj.initEvent("change", false, true);
		el.dispatchEvent(evObj);
	}
}

function mudar_bandeira(img_bandeira) {
	$("#loading_img_bandeira").attr("src", img_bandeira);
}

function trocarIdioma(sigla) {
	if (comboGoogleTradutor) {
		comboGoogleTradutor.value = sigla;
		localStorage.setItem("linguagem", JSON.stringify(sigla));
		$("#loading_img_bandeira").attr("src", `https://cdn.guicheweb.com.br/gw-bucket/responsivo/imgs/${sigla}.png`);
		changeEvent(comboGoogleTradutor); //Dispara a troca
	}
}

function traduzirParaPt() {
	loading();
	localStorage.setItem("linguagem", JSON.stringify("pt"));
	location.reload();
}

function traduzirParaEn() {
	if (siglaStorage == "pt") {
		loading();
		if (comboGoogleTradutor) {
			comboGoogleTradutor.value = "en";
			localStorage.setItem("linguagem", JSON.stringify("en"));
			$("#loading_img_bandeira").attr("src", `https://cdn.guicheweb.com.br/gw-bucket/responsivo/imgs/en.png`);
			changeEvent(comboGoogleTradutor); //Dispara a troca

			if (comboGoogleTradutor.value == "en") {
				location.reload();
			}
		}
	} else {
		$("#img_link_pt").removeClass("d-none");
		$("#img_link_en").addClass("d-none");
		$("#img_link_es").removeClass("d-none");
		trocarIdioma("en");
	}
}

function traduzirParaEs() {
	if (siglaStorage == "pt") {
		loading();
		if (comboGoogleTradutor) {
			localStorage.setItem("linguagem", JSON.stringify("es"));
			$("#loading_img_bandeira").attr("src", `https://cdn.guicheweb.com.br/gw-bucket/responsivo/imgs/es.png`);
			comboGoogleTradutor.value = "es";
			changeEvent(comboGoogleTradutor); //Dispara a troca

			if (comboGoogleTradutor.value == "es") {
				location.reload();
			}
		}
	} else {
		$("#img_link_pt").removeClass("d-none");
		$("#img_link_en").removeClass("d-none");
		$("#img_link_es").addClass("d-none");
		trocarIdioma("es");
	}
}

function loadingPt() {
	$("html").addClass("notranslate");
	$("#img_link_pt").addClass("d-none");
	$("#img_link_en").removeClass("d-none");
	$("#img_link_es").removeClass("d-none");
}

$(function () {
	siglaStorage == "pt" ? loadingPt() : $("html").removeClass("notranslate");

	check_user();
	obj.id_evento = document.getElementById("id_evento").value;
	document.getElementById("id_evento").remove();
	obj.id_comissario = document.getElementById("id_comissario").value;
	document.getElementById("id_comissario").remove();
	let comp = document.getElementById("opt_values").value.split("_");
	obj.exclusivo_comissarios = comp[0];
	obj.evento_principal = comp[1];
	document.getElementById("opt_values").remove();
	ings_page();
	getSvg();

	var urlParamsQuery = new URLSearchParams(window.location.search);
	var ce = urlParamsQuery.get("ce");
	if (ce) {
		$("#inputcup").val(ce);
	}

	$("#inputcup").on("keyup", function (e) {
		if (e.keyCode === 13) {
			carregar_cupom($(this).val());
		}
	});

	siglaStorage == "en" ? traduzirParaEn() : console.log("tradução-1-verificada");

	siglaStorage == "es" ? traduzirParaEs() : console.log("tradução-2-verificada");

	siglaStorage == undefined || siglaStorage == null ? mudar_bandeira(menu_bandeira_padrão) : mudar_bandeira(menu_bandeira_alterado);
});

function video() {
	let url = obj.result.info_evento.link_video;
	const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	if (url) {
		let match = url.match(regExp);
		match && match[7].length == 11 ? $("#frameVideo").attr("src", "https://www.youtube.com/embed/" + match[7]) : $("#video_evento").css({ display: "none" });
	} else {
		$("#video_evento").css({ display: "none" });
	}
}

function go_to(el) {
	$("html, body").animate(
		{
			scrollTop: $(el).offset().top,
		},
		0
	);
}

function irPara(setor) {
	if ($("li[data-idsetor='" + setor + "']").length <= 0) {
		return msgAlerta("Setor Indisponível");
	}

	$("li[data-idsetor='" + setor + "']").goto();

	setTimeout(() => {
		if (!$("li[data-idsetor='" + setor + "']").hasClass("active")) {
			$("li[data-idsetor='" + setor + "']").click();
		}
	}, 300);
}

function getSvg() {
	var url = $("#img-mapa-gw").attr("src");

	if (typeof url === "undefined" || url === "" || url.indexOf("svg") == -1) {
		return false;
	}

	var $img = $("#img-mapa-gw");
	var imgClass = $img.attr("class");

	$.ajax({
		url: url + "?" + Math.random(),
		type: "GET",
		crossDomain: true,
		dataType: "xml",
		async: true,
		success: function (data) {
			var $svg = $(data).find("svg");

			if (typeof imgClass !== "undefined") {
				$svg = $svg.attr("class", imgClass + " replaced-svg");
				$svg = $svg.removeAttr("width");
				$svg = $svg.removeAttr("height");
			}

			$svg = $svg.removeAttr("xmlns:a");
			$img.replaceWith($svg);
		},
	});
}

function ings_page() {
	dados = new FormData();
	dados.append("a", "ingressos_page2");
	dados.append("id_evento", obj.id_evento);
	dados.append("id_comissario", obj.id_comissario);
	dados.append("exclusivo_comissarios", obj.exclusivo_comissarios);

	axios({
		method: "post",
		url: "/webservices/api/services/ingressos.php",
		data: dados,
	})
		.then((result) => {
			obj.data_inicio_vendas = result.data.info_evento ? result.data.info_evento.data_inicio_vendas : "false";
			obj.result = result.data;
			if (obj.result.info_evento.informacoesweb) {
				$("#loading_info").parent().css({ display: "none" });
				$("#infos_evento").find(".infoweb-evento").html(obj.result.info_evento.informacoesweb);
			}
		})
		.catch((error) => {
			console.log("erro", error);

			console.log({ error });
		})
		.finally(() => {
			if (obj.result.comissario) {
				$("#div-comissario").html(`<div class="row justify-content-center mb-4">
                                            <div class="col-md-6">
                                                <div class="alert alert-light" role="alert">
                                                    <i class="fas fa-user-tie"></i> Comissário: ${obj.result.comissario.nome}
                                                </div>
                                            </div>
                                        </div>`);
			}
			video();
			carregar_setores();
			$("#infos_evento").find("img").addClass("img-fluid");
			obj.loaded = true;
		});
}

function carregar_setores() {
	dados = new FormData();
	dados.append("a", "setores");
	dados.append("id_evento", obj.id_evento);
	dados.append("id_comissario", obj.id_comissario);
	dados.append("exclusivo_comissarios", obj.exclusivo_comissarios);

	axios({
		method: "post",
		url: "/webservices/api/services/ingressos.php",
		data: dados,
	})
		.then((result) => {
			if (result.data.qtd == 0) {
				$("#loading_setores").html('<h2 class="font-weight-bold">' + obj.result.info_evento.msg_encerrado + "</h2>");
			} else {
				obj.setores = result.data.item;
				obj.loadedSetores = true;
				quantidades();
				setores_datas();
				reload_carrinho();
				$("#loading_setores").parent().css({ display: "none" });
				checks_objs();
				if ($("#inputcup").val().trim().length > 1) {
					carregar_cupom($("#inputcup").val());
				}
			}
			if (obj.result.qtd_cupom != "0" && obj.data_inicio_vendas == "false") {
				// if (obj.id_cliente > 0) {
				$("#campo_cupom").css({ display: "" });
				// } else {
				// $('#login_cupom').css({ 'display': '' });
				// }
			}

			if (obj.result.info_evento.popup && obj.data_inicio_vendas == "false" && window.modal_popup == undefined) {
				window.modal_popup = abrirModal("Aviso", `<div class="row rowclean"><div class="col-12">${obj.result.info_evento.popup}</div></div>`);
			}
		})
		.catch((error) => {
			console.log(error);
		});
}

function carregar_cupom(cupom, confirm = false) {
	obj.cupom_desconto = cupom;
	if (cupom == "") {
		msgAlerta("Insira um cupom para continuar.");
		return false;
	}

	loading();

	dados = new FormData();
	dados.append("a", "setores_cupom2");
	dados.append("id_evento", obj.id_evento);
	dados.append("id_comissario", obj.id_comissario);
	dados.append("cupom", cupom);
	dados.append("confirm", confirm);
	axios({
		method: "post",
		url: "/webservices/api/services/ingressos.php",
		data: dados,
	})
		.then((result) => {
			unloading();
			if (result.data.status == 2) {
				msgConfirma("AVISO", "Existe outro cupom em seu carrinho, está ação removerá todos os ingressos deste cupom. Deseja continuar?", "", "carregar_cupom('" + cupom + "'," + "true)");
			} else if (result.data.status == 0 && result.data.qtd == 0) {
				msgAlerta(result.data.msg);
				return false;
			} else if (result.data.status == 1) {
				obj.setores_cupom = [];
				var i = 0;
				result.data.item.forEach((setorcup) => {
					if (setorcup.situacao == "") {
						obj.setores_cupom.push(setorcup);
					}
				});
				// obj.setores_cupom = result.data.item;
				$("#modal_cupom").find(".modal-body").html(ingressos_cupom());
				checks_objs();
				reload_carrinho();
				if (obj.setores.length < 2) {
					$("#modal_cupom").find(".setor-ings").find("li").slideDown();
				}
				$("#modal_cupom").modal("show");
			}
		})
		.catch((error) => {
			console.log(error);
		});
}

function setores_datas() {
	let view = "";

	if (obj.loaded == true && obj.result.qtd_datas > 1) {
		// mais de uma data
		if (obj.quantidades.ingressos > 0) {
			if (obj.result.info_evento.titulo_ingressos == null) {
				$("#titulo_ingressos").html("<strong>ESCOLHA UMA DATA</strong>");
			} else {
				$("#titulo_ingressos").html(obj.result.info_evento.titulo_ingressos);
			}
			obj.result.datas.forEach((data) => {
				view +=
					'<div class="row d-block d-md-none"><div class="col-12 mb-4"><div class="card">' +
					'<img class="card-img-top" src="' +
					data.img_data +
					'" alt="' +
					data.informacoes +
					'">' +
					'<div class="card-body">';
				if (data["data_normal"] == "all") {
					// view += '<h4><b>Todos os Dias</b> <span class="badge badge-primary"'; RETIRADO A PEDIDO DE MARCIO
					view += '<h4><b>&nbsp;</b> <span class="badge badge-primary"';
					view += quantidades_setor(data.peso) == 0 ? ' style="display:none"' : "";
					view += '><i class="fas fa-shopping-cart"></i><span class="' + data.peso + '">' + quantidades_setor(data.peso) + "</span></span></h4>";
					if (obj.result.info_evento.titulo_ingressos_permanentes) {
						view += '<p class="card-text">' + obj.result.info_evento.titulo_ingressos_permanentes + "</p>";
					} else {
						view += '<h4><b class="card-text">Passaporte/Permanente</b></h4>';
					}
				} else {
					if (obj.result.info_evento.ocultar_horario_setor != 1) {
						view += "<h4><b>Dia " + data.dia + "/" + data.mes + " - " + data.hora + "</b>" + '<span class="badge badge-primary"';
					} else {
						view += "<h4><b>Dia " + data.dia + "/" + data.mes + "</b>" + '<span class="badge badge-primary"';
					}
					view += quantidades_setor(data.peso) == 0 ? ' style="display:none"' : "";
					view += '><i class="fas fa-shopping-cart"></i><span class="' + data.peso + '">' + quantidades_setor(data.peso) + "</span></span>";
					'</h4><p class="card-text">' + data.informacoes + "</p>";
				}
				view +=
					'<br><span class="small text-muted">a partir de ' +
					Number(data.valor_minimo).toLocaleString(obj.result.info_evento.locale, { style: "currency", currency: obj.result.info_evento.moeda }) +
					"</span><br>" +
					'<button class="btn btn-outline-dark mt-2" onclick="modal_datas(' +
					data.peso +
					')">' +
					'<i class="fa fa-ticket-alt"></i> Ver Ingressos</button>' +
					"</div></div></div></div>";
			});
			view += '<div class="row d-none d-md-flex justify-content-center mb-4"><div class="col-md-8">';
			obj.result.datas.forEach((data) => {
				view +=
					'<div class="list-group"><button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onclick="modal_datas(' +
					data.peso +
					')">' +
					'<div class="d-flex">' +
					'<img src="' +
					data.img_data +
					'" class="img-fluid rounded img-data" />' +
					'<div class="text-left pl-4">';
				if (data.data_normal == "all") {
					// view += '<h4><b>Todos os Dias</b><span class="badge badge-primary"'; RETIRADO A PEDIDO DE MARCIO
					view += '<h4><b>&nbsp;</b><span class="badge badge-primary"';
					view += quantidades_setor(data.peso) == 0 ? ' style="display:none"' : "";
					view += '><i class="fas fa-shopping-cart"></i><span class="' + data.peso + '">' + quantidades_setor(data.peso) + "</span></span></h4>";
					if (obj.result.info_evento.titulo_ingressos_permanentes) {
						view += "<h5>" + obj.result.info_evento.titulo_ingressos_permanentes + "</h5>";
					} else {
						view += "<h5>Passaporte/Permanente</h5>";
					}
				} else {
					if (obj.result.info_evento.ocultar_horario_setor != 1) {
						view += "<h4><b>Dia " + data.dia + "/" + data.mes + " - " + data.hora + '</b><span class="badge badge-primary"';
					} else {
						view += "<h4><b>Dia " + data.dia + "/" + data.mes + '</b><span class="badge badge-primary"';
					}

					view += quantidades_setor(data.peso) == 0 ? ' style="display:none"' : "";
					view += '><i class="fas fa-shopping-cart"></i><span class="' + data.peso + '">' + quantidades_setor(data.peso) + "</span></span></h4>";
					if (data.informacoes) {
						view += "<h5>" + data.informacoes + "</h5>";
					}
				}
				"</div>" + '</div><i class="fas fa-chevron-right"></i></button></div>';
			});
			view += "</div></div>";
			$("#exibe_ingressos").append(view);
		}
	} else {
		// uma data
		if (obj.quantidades.ingressos > 0) {
			if (obj.result.info_evento.titulo_ingressos == null) {
				$("#titulo_ingressos").html("<strong>ADQUIRA SEU INGRESSO AGORA</strong>");
			} else {
				$("#titulo_ingressos").html(obj.result.info_evento.titulo_ingressos);
			}
			view = '<div class="row justify-content-center mb-4"><div class="col-md-8 text-left">';
			view += ingressos_datas();
			view += "</div></div>";
			$("#exibe_ingressos").append(view);
		}
	}
}

function ingressos_datas(data) {
	let view = "";
	view +=
		'<div class="notranslate ings-evento row rowclean justify-content-center" style="displa y:none;text-align: left">' +
		"<!-- MAPA DE ASSENTOS -->" +
		'<div id="mapaassentos1" class="notranslate modal fade" style="display:none; color:#FFFFFF;"><div class=" notranslate modal-dialog modal-ultra"><div class=" notranslate modal-content modal-contentmapa"><!-- CONTEUDO DO MAPA AQUI DENTRO puxado por php --></div></div></div>';
	/* '<div id="mapaassentos1" class="notranslate modal-mapa fade" style="display:none; color:#FFFFFF; padding-right:0px!important"><div class=" notranslate modal-dialog-mapa modal-lg-mapa"><div class=" notranslate modal-content-mapa modal-contentmapa"><!-- CONTEUDO DO MAPA AQUI DENTRO puxado por php --></div></div></div>'; */
	var index_setor = 0;

	obj.setores.forEach((setor) => {
		let valor_minimo_setor = 0;
		let index_f = 0;

		if (data != undefined) {
			setor.ings.forEach((i, v) => {
				if (data == i.data && i.ing_esgotado == "NAO") {
					if (index_f == 0) {
						valor_minimo_setor = i.valor;
					}

					if (eval(i.valor) < eval(valor_minimo_setor)) {
						valor_minimo_setor = i.valor;
					}

					index_f++;
				}
			});
		} else {
			valor_minimo_setor = setor.valor_minimo;
		}

		view += '<ul class="list-group w-100 mb-2 setor-ings">' + '<li data-status="';
		view += obj.setores.length == 1 ? "1" : " 0";
		view += '" data-idsetor="' + setor.id_setor + '" class="';
		view += obj.setores.length == 1 ? "active" : "";
		view += ' setordata-btn list-group-item list-group-item-action d-flex justify-content-between align-items-center setor cursor-pointer">' + "<div><h5>";
		view += obj.result.info_evento.url_mapa && setor.cor ? '<span style="background-color: ' + setor.cor + "; color: " + setor.cor + '" class="badge mr-1">C</span>' : "";
		view += " <b>" + setor.setor + '</b><span class="badge badge-primary"><i class="fas fa-shopping-cart"></i><span class="qtd_carrinho">0</span></span></h5>';
		if (setor.informacoes_setor !== "" && setor.informacoes_setor != undefined) {
			view += "<h6>" + setor.informacoes_setor + "</h6>";
		}
		view += '<div class="small ';
		view += obj.setores.length == 1 ? "" : "text-muted";
		view += '">';
		if (setor.esgotado === "SIM" || (setor.lugar_marcado == "true" && setor.qtd_liberados == 0)) {
			view += '<span class="mr-3"><i> (ESGOTADO)</i></span>';
		} else {
			if (!obj.result.info_evento?.ocultar_apartir_setor) {
				view += '<span class="mr-3">a partir de ' + Number(valor_minimo_setor).toLocaleString(obj.result.info_evento.locale, { style: "currency", currency: obj.result.info_evento.moeda }) + "</span>";
			}
		}
		if (setor.lugar_marcado == "true") {
			view += '<i data-toggle="tooltip" data-placement="top" title="Lugar Marcado" class="fas fa-couch mr-1"></i>';
		}
		if (setor.open_bar == "S") {
			view += '<i data-toggle="tooltip" data-placement="top" title="Open Bar" class="fas fa-beer mr-1"></i>';
		}
		if (setor.open_food == "S") {
			view += '<i data-toggle="tooltip" data-placement="top" title="Open Food" class="fas fa-utensils mr-1"></i>';
		}
		view += "</div>" + "</div>" + '<div class="btn-dropdown">' + '<i class="fas text-dark fa-chevron-circle-right"></i>' + "</div>" + "</li>";
		var index_ing = 0;
		setor.ings.forEach((i) => {
			view +=
				'<li style="display: none;" data-data="' + i.data + '" data-setorid="' + setor.id_setor + '" data-idlote="' + i.id_lote + '" class="list-group-item btn-list list-pacotes ' + setor.id_setor;
			if (i.ing_esgotado == "SIM" || (i.lugar_marcado == "true" && i.qtd_liberados == 0)) {
				view += "disabled";
			}
			view += '">' + '<div class="d-flex justify-content-between align-items-center">' + "<div>" + '<b class="small text-muted">Ingresso:</b> ' + i.ingresso;
			if (i.numerocopias > 1) {
				view += "<span>(" + i.numerocopias + " Ingressos)</span>";
			}
			if (i.meia == "S") {
				view +=
					"<a href='javascript:void(0)' style='margin-left: 10px !important;' onclick=aviso_meia($(this).attr('data_aviso')) data_aviso='" +
					obj.result.info_meia +
					"' title='Informações sobre a meia entrada'><i class='fas fa-info-circle'></i></a>";
			}
			if (i.descricao_detalhada == "true") {
				view +=
					"<a href='javascript:void(0)' onclick=detalhes_ingresso($(this).attr('data_detalhe')) data_detalhe='<div>" +
					i.descricao_detalhada_txt +
					"</div>' title='Descrição detalhada do ingresso'>" +
					'<span class="badge badge-primary" style="font-size: 10px; margin-left: 10px !important">Saiba Mais</span>' +
					"</a>";
			}
			view +=
				"<br>" +
				'<b class="small text-muted">Lote:</b> ' +
				i.lote +
				"<br>" +
				'<b class="small text-muted">Valor:</b> ' +
				Number(i.valor).toLocaleString(obj.result.info_evento.locale, {
					style: "currency",
					currency: obj.result.info_evento.moeda,
				}) +
				' <b class="small text-muted">+ taxa</b>';
			i.exigir_biometria_facial === 'S' && (view +=
				"<br>" + 
				'<b class="small text-primary">*Biometria Facial</b>');
			if (i.ing_esgotado == "SIM" || (i.lugar_marcado == "true" && i.qtd_liberados == 0)) {
				view += '<i style="color: red !important;"> (ESGOTADO)</i>';
			}
			view += "</div>";
			if ((i.lugar_marcado == "false" && i.ing_esgotado == "NAO") || (i.lugar_marcado == "true" && i.qtd_liberados > 0)) {
				view += '<div id="' + i.id_ingresso + '" idlote="' + i.id_lote + '"  class="d-flex justify-content-center align-items-middle">';
				if (i.lugar_marcado == "true") {
					if (i.ing_esgotado == "NAO" && i.qtd_liberados > 0) {
						view +=
							'<button class="btn btn-sm btn-light" onclick="carregamodal(' + index_setor + "," + index_ing + "," + obj.id_evento + "," + setor.id_setor + "," + i.id_ingresso + "," + i.id_lote + ')"';
						if (i.ing_esgotado == "SIM" || i.qtd_liberados == 0) {
							view += "disabled";
						}
						view += '><i class="fas fa-map-marker"></i> ESCOLHER LUGAR</button>' + '<div style="display:none" id="qtd_ing_selecionado" class="qtd_ings">' + i.qtd + "</div>";
					}
				} else {
					view +=
						'<button class="btn btn-light btn-sm btn-cart" onclick="remover_ingresso(' +
						index_setor +
						"," +
						index_ing +
						"," +
						setor.id_setor +
						"," +
						i.id_ingresso +
						"," +
						i.id_lote +
						"," +
						i.valor +
						')">' +
						'<i class="fas icon-cart fa-minus btn-remover-ings"></i></button>' +
						'<div id="qtd_ing_selecionado" class="qtd_ings">' +
						i.qtd +
						"</div>" +
						'<button class="btn btn-light btn-sm btn-cart" onclick="add_ingresso(' +
						index_setor +
						"," +
						index_ing +
						"," +
						setor.id_setor +
						"," +
						i.id_ingresso +
						"," +
						i.id_lote +
						"," +
						i.valor +
						')">' +
						'<i class="fas icon-cart fa-plus"></i>' +
						"</button>";
				}
				view += "</div>";
			}
			view += "</div>" + "</li>";
			index_ing++;
		});
		view += "</ul>";
		index_setor++;
	});
	view += "</div>";
	return view;
}

function ingressos_cupom() {
	let view = "";
	view +=
		'<div class="ings-evento row rowclean justify-content-center" style="display:none;text-align: left">' +
		"<!-- MAPA DE ASSENTOS -->" +
		'<div id="mapaassentos" class="modal fade" style="display:none; color:#FFFFFF;"><div class="modal-dialog modal-lg"><div class="modal-content modal-contentmapa"><!-- CONTEUDO DO MAPA AQUI DENTRO puxado por php --></div></div></div>';
	var index_setor = 0;
	obj.setores_cupom.forEach((setor) => {
		view += '<ul class="list-group w-100 mb-2 setor-ings">' + '<li data-status="';
		view += obj.setores_cupom.length == 1 ? "1" : " 0";
		view += '" data-idsetor="' + setor.id_setor + '" class="';
		view += obj.setores_cupom.length == 1 ? "active" : "";
		view += ' setordata-btn list-group-item list-group-item-action d-flex justify-content-between align-items-center setor cursor-pointer">' + "<div><h5>";
		view += obj.result.info_evento.url_mapa && setor.cor ? '<span style="background-color: ' + setor.cor + "; color: " + setor.cor + '" class="badge mr-1">C</span>' : "";
		view += " <b>" + setor.setor + '</b><span class="badge badge-primary"><i class="fas fa-shopping-cart"></i><span class="qtd_carrinho">0</span></span></h5>';
		if (setor.informacoes_setor !== "" && setor.informacoes_setor != undefined) {
			view += "<h6>" + setor.informacoes_setor + "</h6>";
		}
		view += '<div class="small ';
		view += obj.setores_cupom.length == 1 ? "" : "text-muted";
		view += '">';
		if (setor.esgotado === "SIM" || (setor.lugar_marcado == "true" && setor.qtd_liberados == 0)) {
			view += '<span class="mr-3"><i> (ESGOTADO)</i></span>';
		} else {
			if (!obj.result.info_evento?.ocultar_apartir_setor) {
				view += '<span class="mr-3">a partir de ' + Number(setor.valor_minimo).toLocaleString(obj.result.info_evento.locale, { style: "currency", currency: obj.result.info_evento.moeda }) + "</span>";
			}
		}
		if (setor.lugar_marcado == "true") {
			view += '<i data-toggle="tooltip" data-placement="top" title="Lugar Marcado" class="fas fa-couch mr-1"></i>';
		}
		if (setor.open_bar == "S") {
			view += '<i data-toggle="tooltip" data-placement="top" title="Open Bar" class="fas fa-beer mr-1"></i>';
		}
		if (setor.open_food == "S") {
			view += '<i data-toggle="tooltip" data-placement="top" title="Open Food" class="fas fa-utensils mr-1"></i>';
		}
		view += "</div>" + "</div>" + '<div class="btn-dropdown">' + '<i class="fas ';
		view += obj.setores_cupom.length == 1 ? "text-light fa-chevron-circle-down" : "";
		view += obj.setores_cupom.length > 1 ? "text-muted fa-chevron-circle-right" : "";
		view += '"></i></div>' + "</li>";
		var index_ing = 0;
		const ticketOpen = obj.setores_cupom.length == 1 ? 'style=""' : 'style="display: none;"';
		setor.ings.forEach((i) => {
			view += `<li ${ticketOpen} data-data="` + i.data + '" data-setorid="' + setor.id_setor + '" data-idlote="' + i.id_lote + '" class="list-group-item btn-list list-pacotes ' + setor.id_setor;
			if (i.ing_esgotado == "SIM" || (i.lugar_marcado == "true" && i.qtd_liberados == 0)) {
				view += "disabled";
			}
			view += '">' + '<div class="d-flex justify-content-between align-items-center">' + "<div>" + '<b class="small text-muted">Ingresso:</b>' + i.ingresso;
			if (i.numerocopias > 1) {
				view += "<span>(" + i.numerocopias + " Ingressos)</span>";
			}
			if (i.meia == "S") {
				view +=
					"<a href='javascript:void(0)' onclick=aviso_meia($(this).attr('data_aviso')) data_aviso='" +
					obj.result.info_meia +
					"' title='Informações sobre a meia entrada'><i class='fas fa-info-circle'></i></a>";
			}
			if (i.descricao_detalhada == "true") {
				view +=
					"<a href='javascript:void(0)' onclick=detalhes_ingresso($(this).attr('data_detalhe')) data_detalhe='<div>" +
					i.descricao_detalhada_txt +
					" </div>' title='Descrição detalhada do ingresso'>" +
					'<span class="badge badge-primary" style="font-size: 10px;">Saiba Mais</span>' +
					"</a>";
			}
			view +=
				"<br>" +
				'<b class="small text-muted">Lote:</b> ' +
				i.lote +
				"<br>" +
				'<b class="small text-muted">Valor:</b> ' +
				Number(i.valor).toLocaleString(obj.result.info_evento.locale, {
					style: "currency",
					currency: obj.result.info_evento.moeda,
				});
			i.exigir_biometria_facial === 'S' && (view +=
				"<br>" + 
				'<b class="small text-primary">*Biometria Facial</b>');
			if (i.ing_esgotado == "SIM" || (i.lugar_marcado == "true" && i.qtd_liberados == 0)) {
				view += '<i style="color: red !important;"> (ESGOTADO)</i>';
			}
			view += "</div>";
			if ((i.lugar_marcado == "false" && i.ing_esgotado == "NAO") || (i.lugar_marcado == "true" && i.qtd_liberados > 0)) {
				view += '<div id="' + i.id_ingresso + '" idlote="' + i.id_lote + '" class="d-flex justify-content-center align-items-middle">';
				if (i.lugar_marcado == "true") {
					view +=
						'<button class="btn btn-sm btn-light" onclick="carregamodal(' +
						index_setor +
						"," +
						index_ing +
						"," +
						obj.id_evento +
						"," +
						setor.id_setor +
						"," +
						i.id_ingresso +
						"," +
						i.id_lote +
						"," +
						"1" +
						')"';
					if (i.ing_esgotado == "SIM" || i.qtd_liberados == 0) {
						view += "disabled";
					}
					view += '><i class="fas fa-map-marker"></i> ESCOLHER LUGAR</button>' + '<div style="display:none" id="qtd_ing_selecionado" class="qtd_ings">' + i.qtd + "</div>";
				} else {
					view +=
						'<button class="btn btn-light btn-sm btn-cart" onclick="remover_ingresso(' +
						index_setor +
						"," +
						index_ing +
						"," +
						setor.id_setor +
						"," +
						i.id_ingresso +
						"," +
						i.id_lote +
						"," +
						i.valor +
						')">' +
						'<i class="fas icon-cart fa-minus btn-remover-ings"></i></button>' +
						'<div id="qtd_ing_selecionado" class="qtd_ings">' +
						i.qtd +
						"</div>" +
						'<button class="btn btn-light btn-sm btn-cart" onclick="add_ingresso(' +
						index_setor +
						"," +
						index_ing +
						"," +
						setor.id_setor +
						"," +
						i.id_ingresso +
						"," +
						i.id_lote +
						"," +
						i.valor +
						')">' +
						'<i class="fas icon-cart fa-plus"></i>' +
						"</button>";
				}
				view += "</div>";
			}
			view += "</div>" + "</li>";
			index_ing++;
		});
		view += "</ul>";
		index_setor++;
	});
	view += "</div>";
	return view;
}

function modal_datas(data) {
	// let titulo = "Ingressos para Todos os Dias"; RETIRADO A PEDIDO DO MARCIO
	let titulo = "Ingressos para";
	if (String(data) != "0") {
		let ano = String(data).substring(0, 4);
		let mes = String(data).substring(4, 6);
		let dia = String(data).substring(6, 8);
		titulo = "Ingressos para o dia " + dia + "/" + mes + "/" + ano;
	}
	$("#exampleModalLongTitle").html(titulo);
	$("#modal_ingressos").find(".modal-body").html(ingressos_datas(data));

	$(".list-pacotes").each(function () {
		if ($(this).attr("data-data") != data) {
			$(this).remove();
		}
	});
	checks_objs();
	reload_carrinho();
	$("#modal_ingressos").modal("show");
}

function aviso_meia(aviso) {
	abrirModal("MEIA ENTRADA", aviso);
}

function detalhes_ingresso(descricao_detalhada) {
	abrirModal("Descrição do Ingresso", descricao_detalhada);
}

function checks_objs() {
	$(".setor-ings").each(function () {
		if ($(this).find("li").length == 1) {
			$(this).remove();
		}
	});

	if ($(".setordata-btn").length == "1") {
		let setor = $(".setordata-btn").parents(".setor-ings");
		setor.find("li:not(:first)").slideDown();
		$(".setordata-btn").attr("data-status", "1");
		$(".setordata-btn").addClass("active");
		$(".setordata-btn").find(".small").removeClass("text-muted");
		$(".setordata-btn").find(".btn-dropdown").html("<i class='fas text-light fa-chevron-circle-down'></i>");
	}

	$(".setordata-btn").unbind();

	$(".setordata-btn").on("click", function () {
		let status = $(this).attr("data-status");
		let setor = $(this).parents(".setor-ings");
		if (status == 1) {
			setor.find("li:not(:first)").slideUp();
			$(this).attr("data-status", "0");
			$(this).removeClass("active");
			$(this).find(".small").addClass("text-muted");
			$(this).find(".btn-dropdown").html("<i class='fas text-dark fa-chevron-circle-right'></i>");
		} else {
			setor.find("li:not(:first)").slideDown();
			$(this).attr("data-status", "1");
			$(this).addClass("active");
			$(this).find(".small").removeClass("text-muted");
			$(this).find(".btn-dropdown").html("<i class='fas text-light fa-chevron-circle-down'></i>");
		}
	});

	$(".ings-evento").slideDown();

	/*
	Comentado por lucas dia 09/11/2019
	- dava bug ao carregar quando era ingresso de datas
	if ($(".setordata-btn").length == 1 && app_gw.result.qtd_datas > 1) {
		$(".setordata-btn").click();
	}
	*/

	setTimeout(() => {
		$("[data-toggle='tooltip").unbind();
		$("[data-toggle='tooltip").tooltip();
	}, 2000);
}

function check_user() {
	dados = new FormData();
	dados.append("a", "check_user");
	axios({ method: "post", url: "/webservices/api/api.php", data: dados })
		.then((result) => {
			obj.id_cliente = result.data.item.id_cliente;
		})
		.catch((error) => {
			console.log(error);
		});
}

function carregamodal(index_setor, index_ing, idevento, idsetor, ingresso, lote, modalCupom = false) {
	$.ajax({
		type: "GET",
		url: "/responsivo/layout_plus/pages/mapa.php",
		data: {
			idevento: idevento,
			idsetor: idsetor,
			ingresso: ingresso,
			lote: lote,
			index_ing: index_ing,
			index_setor: index_setor,
		},
		beforeSend: function () {
			loading();
		},
		success: function (result) {
			unloading();
			if (modalCupom) {
				$("#mapaassentos").find(".modal-contentmapa").html(result);
				$("#mapaassentos").modal("show");
			} else {
				$("#mapaassentos1").find(".modal-contentmapa").html(result);
				$("#mapaassentos1").modal("show");
			}
		},
	});
}

// como deixar a seguinte funcao como uma funcao global
function previewCarrinho() {
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "/responsivo/layout/scripts/previewCarrinho.php",
		success: function (result) {
			unloading();
			result.qtd == 1 ? $("#ings_car").html(result.qtd + " ITEM") : $("#ings_car").html(result.qtd + " ITENS");
			result.qtd > 0 ? $("#carrinho").css({ display: "" }) : $("#carrinho").css({ display: "none" });
			$("qtd").text(result.qtd);
			$("valor").text(result.total);
			$("taxa").text(result.tx);
			$("#val_total").text(result.total);
			$("#val_taxa").text(result.tx);
			if (result.doacao) {
				$("#val_doacao").text(result.doacao).parent().css({ display: "" });
				$(".resumo-cart4").show();
			} else {
				$("#val_doacao").text(result.doacao).parent().css({ display: "none" });
				$(".resumo-cart4").hide();
			}
			if (result.qtd > 1) $("plural").show();
			else $("plural").hide();

			if (result.qtd > 0) $(".avisoings").show();
			else $(".avisoings").hide();
		},
	});
}

window.previewCarrinho = previewCarrinho;

function loading() {
	$("#loading").css({ display: "" });
}

window.loading = loading;

function unloading() {
	$("#loading").css({ display: "none" });
}

window.unloading = unloading;

function add_ingresso(index_setor, index_ing, id_setor, id_ingresso, id_lote, valor, confirm = false, cupom = null) {
	loading();
	
	const csrf_token = $(".gw_csrf_token").val();
	let array;
	//if (obj.setores.length > 0) {
	if (obj.setores_cupom.length > 0 && window.modal_cupom.style.display == "block") {
		array = obj.setores_cupom;
	} else {
		array = obj.setores[index_setor].ings[index_ing].valor == valor ? obj.setores : obj.setores_cupom;
	}
	let ing = array[index_setor].ings[index_ing];
	let qtd = ing.qtd == 0 ? eval(ing.qtd_min) : 1;
	let qtd_atual = qtd + ing.qtd;
	let qtd_max = ing.qtd_max;

	if (qtd_max - qtd_atual < 0) {
		unloading();
		msgErro("Limite máximo para compra deste ingresso excedido.");
		return false;
	}

	let id_evento = obj.id_evento
	
	let dados = new FormData();
	dados.append("a", "add_carrinho");
	dados.append("id_ingresso", id_ingresso);
	dados.append("id_lote", id_lote);
	dados.append("id_setor", id_setor);
	dados.append("qtd", qtd);
	dados.append("id_evento", id_evento);
	dados.append("confirm", confirm);
	dados.append("cupom", cupom);

	//Roda a requisição para adicionar ing no carrinho
	axios({
		method: "post",
		url: "/webservices/api/api.php",
		data: dados,
		headers: { gw_csrf_token: csrf_token },
	})
		.then(function (result) {
			if ((result.data.status == 1 && result.data.qtd > 0) || (result.data.status == 1 && result.data.qtd == undefined)) {
				quant = parseInt($(`[id="${id_ingresso}"][idlote="${id_lote}"]`).find("#qtd_ing_selecionado").html()) + 1;
				$(`[id="${id_ingresso}"][idlote="${id_lote}"]`).find("#qtd_ing_selecionado").html(quant);
				if (obj.setores_cupom.length > 0 && window.modal_cupom.style.display == "block") {
					obj.setores_cupom[index_setor].ings[index_ing].qtd++;
				} else {
					obj.setores[index_setor].ings[index_ing].valor == valor ? obj.setores[index_setor].ings[index_ing].qtd++ : obj.setores_cupom[index_setor].ings[index_ing].qtd++;
				}
			} else {
				if (result.data.status == 2) {
					if (result.data.status_limite_evento || result.data.status_biometria_facial) {
						msgAlerta(result.data.msg);
					} else {
						msgConfirma(
							"AVISO",
							"Existe ingressos de outro evento no seu carrinho, está ação removerá todos os ingressos. Deseja continuar?",
							"",
							"add_ingresso(" + index_setor + ", " + index_ing + ", " + id_setor + ", " + id_ingresso + ", " + id_lote + ", " + valor + ", confirm = true, " + cupom + ")"
						);
					}
				} else {
					msgErro(result.data.msg);
				}
			}
			reload_carrinho();
			unloading();
		})
		.catch(function (error) {
			console.log(error);
		});
}

function remover_ingresso(index_setor, index_ing, id_setor, id_ingresso, id_lote, valor, cupom = null) {
	loading();
	let array;
	if (obj.setores_cupom.length > 0 && window.modal_cupom.style.display == "block") {
		array = obj.setores_cupom;
	} else {
		array = obj.setores[index_setor].ings[index_ing].valor == valor ? obj.setores : obj.setores_cupom;
	}
	let ing = array[index_setor].ings[index_ing];
	let qtd = ing.qtd == ing.qtd_min ? eval(ing.qtd_min) : 1;
	let qtd_atual = parseInt($(`[id="${id_ingresso}"][idlote="${id_lote}"]`).find("#qtd_ing_selecionado").html());

	if (qtd_atual == 0) {
		unloading();
		msgAlerta("Você não possui esse ingresso no seu carrinho.");
		return false;
	}

	let id_evento = obj.id_evento;

	let dados = new FormData();
	dados.append("a", "remover_carrinho");
	dados.append("id_ingresso", id_ingresso);
	dados.append("id_lote", id_lote);
	dados.append("id_setor", id_setor);
	dados.append("qtd", qtd);
	dados.append("id_evento", id_evento);
	dados.append("cupom", cupom);
	//roda a requisição para deletar o ing do carrinho
	axios({ method: "post", url: "/webservices/api/api.php", data: dados })
		.then(function (result) {
			if (result.data.status == 1 && result.data.qtd > 0) {
				let qtd = parseInt($(`[id="${id_ingresso}"][idlote="${id_lote}"]`).find("#qtd_ing_selecionado").html()) - 1;
				if (qtd < 0) {
					qtd = 0;
				}

				$(`[id="${id_ingresso}"][idlote="${id_lote}"]`).find("#qtd_ing_selecionado").html(qtd);
				if (obj.setores_cupom.length > 0 && window.modal_cupom.style.display == "block") {
					if (obj.setores_cupom[index_setor].ings[index_ing].qtd > 0) {
						obj.setores_cupom[index_setor].ings[index_ing].qtd--;
					}
				} else {
					if (obj.setores[index_setor].ings[index_ing].valor == valor && obj.setores[index_setor].ings[index_ing].qtd > 0) {
						obj.setores[index_setor].ings[index_ing].qtd--;
					} else {
						if (obj.setores_cupom[index_setor].ings[index_ing].qtd > 0) {
							obj.setores_cupom[index_setor].ings[index_ing].qtd--;
						}
					}
				}
			} else {
				msgErro(result.data.msg);
			}
			reload_carrinho();
			unloading();
		})
		.catch(function (error) {
			console.log(error);
		});
}

function quantidades() {
	let array = obj.setores;

	let qtd_setores = 0;
	let qtd_ings = 0;

	array.forEach((item) => {
		let arr_ings = item.ings;
		qtd_setores++;
		arr_ings.forEach(() => {
			qtd_ings++;
		});
	});

	obj.quantidades = { setores: qtd_setores, ingressos: qtd_ings };
}

function quantidades_setor(peso) {
	let array = obj.setores;
	let qtd_ings = 0;

	array.forEach((item) => {
		let arr_ings = item.ings;
		arr_ings.forEach((ing) => {
			if (ing.data == peso) {
				qtd_ings += ing.qtd;
			}
		});
	});
	return qtd_ings;
}

function reload_carrinho() {
	let quant_t = 0;
	$(".setor-ings").each(function () {
		let quant = 0;
		$(this)
			.find(".qtd_ings")
			.each(function () {
				quant += parseInt($(this).html());
				quant_t += parseInt($(this).html());
			});
		$(this).find(".qtd_carrinho").html(quant);
		$(this)
			.find(".list-pacotes")
			.each(function () {
				$("." + $(this).attr("data-data")).html(quant_t);
				if (quant_t > 0) {
					$("." + $(this).attr("data-data"))
						.parent()
						.css({ display: "" });
				} else {
					$("." + $(this).attr("data-data"))
						.parent()
						.css({ display: "none" });
				}
			});

		if (quant > 0) {
			$(this).find(".qtd_carrinho").parent().css({ display: "" });
		} else {
			$(this).find(".qtd_carrinho").parent().css({ display: "none" });
		}
	});

	let qtd = 0;
	let val = 0;

	for (let index_setor = 0; index_setor < obj.setores.length; index_setor++) {
		for (let index_ing = 0; index_ing < obj.setores[index_setor].ings.length; index_ing++) {
			let qtd_ing = eval(obj.setores[index_setor].ings[index_ing].qtd);
			let val_ing = eval(obj.setores[index_setor].ings[index_ing].valor);
			if (qtd_ing > 0) {
				qtd += qtd_ing;
				val += val_ing * qtd_ing;
			}
		}
	}

	for (let index_setor = 0; index_setor < obj.setores_cupom.length; index_setor++) {
		for (let index_ing = 0; index_ing < obj.setores_cupom[index_setor].ings.length; index_ing++) {
			let qtd_ing = eval(obj.setores_cupom[index_setor].ings[index_ing].qtd);
			let val_ing = eval(obj.setores_cupom[index_setor].ings[index_ing].valor);
			if (qtd_ing > 0) {
				qtd += qtd_ing;
				val += val_ing * qtd_ing;
			}
		}
	}

	obj.carrinho.qtd = qtd;
	obj.carrinho.valor_total = val;
	qtd > 0 ? $("#carrinho").css({ display: "" }) : $("#carrinho").css({ display: "none" });
	qtd == 1 ? $("#ings_car").html(qtd + " ITEM") : $("#ings_car").html(qtd + " ITE");
	$("#val_total").html('<img src="https://cdn.guicheweb.com.br/gw-bucket/imagens/gwload.svg" style="filter: invert(1);height: 20px;"> Calculando...');
	$(".moeda").html(obj.result.info_evento.simbolo);
	obj.result.info_evento.tipoconveniencia == "P"
		? $("#val_taxa").html(
				parseFloat(obj.carrinho.valor_total * (obj.result.info_evento.taxaconveniencia / 100))
					.toFixed(2)
					.replace(".", ",")
		  )
		: $("#val_taxa").html(
				parseFloat(obj.carrinho.qtd * obj.result.info_evento.taxaconveniencia)
					.toFixed(2)
					.replace(".", ",")
		  );
	previewCarrinho();
}

function number_format(number, decPlaces, thouSeparator, decSeparator) {
	var n = number,
		decPlaces = isNaN((decPlaces = Math.abs(decPlaces))) ? 2 : decPlaces,
		decSeparator = decSeparator == undefined ? "." : decSeparator,
		thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
		sign = n < 0 ? "-" : "",
		i = parseInt((n = Math.abs(+n || 0).toFixed(decPlaces))) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
	return (
		sign +
		(j ? i.substr(0, j) + thouSeparator : "") +
		i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) +
		(decPlaces
			? decSeparator +
			  Math.abs(n - i)
					.toFixed(decPlaces)
					.slice(2)
			: "")
	);
}

if (VueCurrencyFilter) {
	Vue.use(VueCurrencyFilter, {
		symbol: "",
		thousandsSeparator: ".",
		fractionCount: 2,
		fractionSeparator: ",",
		symbolPosition: "front",
		symbolSpacing: false,
	});
}

const DocumentPersonBrFilter = {
	install(Vue, options) {
		Vue.filter("DocumentPersonBr", (documentId) => {
			documentId = typeof documentId != "string" ? documentId.toString() : documentId;

			if (documentId.length > 11) {
				documentId = documentId.padStart(14, "0");
				documentId = documentId.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
			} else {
				documentId = documentId.padStart(11, "0");
				documentId = documentId.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
			}
			return documentId;
		});
	},
};
Vue.use(DocumentPersonBrFilter);

var app_gw = new Vue({
	el: "#app_gw",
	mounted() {
		this.load_ings();
	},
	data: {
		pagina: "ingressos",
		dados_empresa: [],
	},
	methods: {
		load_ings() {
			let dados = new FormData();
			dados.append("a", "carregar_home");
			dados.append("pagina", "ingressos");

			axios({ method: "post", url: "/webservices/api/api.php", data: dados })
				.then((result) => {
					this.dados_empresa = result.data.item_empresa;
				})
				.catch(function (error) {
					console.log(error);
				});
		},
	},
});
