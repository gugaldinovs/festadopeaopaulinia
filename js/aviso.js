$(function () {
  const aviso = /*html*/`
    <div class="alert alert-light alert-dismissible fade show border border-secondary text-body alerta-privacidade" role="alert">
      <div class="col-md-12">
          <div class="text-center">
            Utilizamos cookies para aprimorar sua experiência em nosso site.
          </div>
          <div class="text-center">
            Para mais detalhes, acesse nossa <a href="https://guicheweb.freshdesk.com/support/solutions/folders/72000566703" target="_blank">Política de Privacidade</a>.
          </div>
          <div class="d-flex justify-content-center align-items-center mt-2">
            <button type="button" class="btn btn-success btn-sm float-right" data-dismiss="alert" aria-label="Close">
              Aceitar somente cookies obrigatórios
            </button>
            <button type="button" class="btn btn-success btn-sm float-right ml-2" data-dismiss="alert" aria-label="Close">
              Aceitar Todos
            </button>
          </div>
      </div>
    </div>
  `;

  if (!window.ReactNativeWebView?.postMessage && !window.localStorage.getItem("privacidade")) {
    $("#alerta_privacidade").html(aviso)
    window.localStorage.setItem("privacidade", "ok")
  }
});