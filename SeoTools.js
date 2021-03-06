function SeoTools ( params ) {
    this.loaded = false;
    $seo_tools = this;
}

SeoTools.prototype = {
    constructor: SeoTools,

    init:function( params ) {
        // carregar caso não use o scss
        if(params.css){
            $seo_tools.css();
        }

        $('body').append('<button class="btn btn-lg btn-seo-tools rounded-circle" title="Validar SEO da página"><i class="fab fa-searchengin"></i></button>');
        $('.btn-seo-tools').on('click', function () {
            $seo_tools.validate();
        });
    },

    css:function () {
        $('head').append(
            '<style type="text/css">'+"\n"+
            '.btn-seo-tools{position:fixed;z-index:200376420520689662;bottom:30px;right:30px;background:#e4032d;color:#fff}.btn-seo-tools:hover{color:#fff;filter:brightness(85%)}@media all and (max-width:992px){.btn-seo-tools{display:none}}.seo-tools{display:block;width:100%;z-index:200376420520689663;background:rgba(255,255,255,.95);padding:20px;height:100%;overflow:auto;position:fixed;top:0;right:0;bottom:0;left:0}.seo-tools .ocorrencias{margin-top:10px}.seo-tools h2{color:#e4032d;line-height:50px;font-size:24px}.seo-tools h2 small{color:#727176;font-size:12px}.seo-tools table{font-size:11px;width:100%!important}.seo-tools table tbody tr:nth-child(even){background:#efefef}.seo-tools table tbody td{padding:6px 12px;vertical-align:middle}.seo-tools table tbody td.url{letter-spacing:-.5px}.seo-tools table tbody td.metas .ocorrencias>span{display:block;font-size:12px;margin:10px}.seo-tools table tbody td.metas .ocorrencias>span small{font-size:11px;display:block;color:#999}.seo-tools table tbody td.metas .ocorrencias>span i{margin-right:10px}.seo-tools table tbody td.html *{max-width:200px;padding:0;margin:0;position:relative;float:none;word-wrap:normal;font-size:11px}.seo-tools table tbody td.html img{max-width:70px;max-height:70px}.seo-tools table tbody td table{background:#fff;margin-top:10px}.seo-tools table tbody td table tbody tr:nth-child(even){background:#fff6f6}'+"\n"+
            '</style>'
        );
    },

    validate:function() {

        if($('#valida-seo').length){
            $('body').css('overflow', 'auto');
            $('#valida-seo').not(':visible').show();
            return;
        }

        $('body').append(
            '<div class="seo-tools aberto" id="valida-seo">'+"\n"+
            '    <h2>VALIDAÇÃO SEO <small>'+CURRENT_URL+'</small> <button class="float-right btn btn-sm fechar"><i class="fa fa-times-circle"></i></button></h2>'+"\n"+
            '    <table class="table">'+"\n"+
            '        <thead>'+"\n"+
            '            <tr>'+"\n"+
            '                <th width="200">Tipo</th>'+"\n"+
            '                <th>Mensagem</th>'+"\n"+
            '            </tr>'+"\n"+
            '        </thead>'+"\n"+
            '        <tbody>'+"\n"+
            '        </tbody>'+"\n"+
            '    </table>'+"\n"+
            '</div>'+"\n"
        ).css('overflow', 'hidden');

        $('#valida-seo .fechar').on('click', function() {
            $('#valida-seo').hide();
            $('body').css('overflow', 'auto');
        });

        // meta
            var meta_tags = $seo_tools.meta();

            var meta_tags_msg  = 'Foram encontradas <b>'+meta_tags.relatorio.total+'</b> ocorrências ( <b class="text-success">'+meta_tags.relatorio.success+'</b> OK | <b class="text-danger">'+meta_tags.relatorio.error+'</b> Erros | <b class="text-warning">'+meta_tags.relatorio.warning+'</b> Alertas )'+
                '<button class="btn btn-xs btn-info btn-mostrar-ocorrencias float-right" data-target="#ocorrencias-meta-tags"><i class="fa fa-plus"></i></button>'+
                "\n"+'<div class="ocorrencias" style="display:none;" id="ocorrencias-meta-tags">'+
                "\n"+meta_tags.html+
                "\n"+'</div>'
            ;

            $('#valida-seo > table > tbody').append('<tr><td>meta tags</td><td class="metas">'+meta_tags_msg+'</td></tr>');
        // /meta

        // headers
            var h_title_msg = $seo_tools.h();
            $('#valida-seo > table > tbody').append(
                '<tr>'+"\n"+
                '    <td class="align-top">h</td>'+"\n"+
                '    <td>'+h_title_msg+'</td>'+"\n"+
                '</tr>'
            );
        // /headers

        // links
            var a_title_msg = $seo_tools.a();
            $('#valida-seo > table > tbody').append(
                '<tr>'+"\n"+
                '    <td class="align-top">a</td>'+"\n"+
                '    <td>'+a_title_msg+'</td>'+"\n"+
                '</tr>'
            );
        // /links

        // img
            var img_alt_msg = $seo_tools.imgs( true );
            $('#valida-seo > table > tbody').append(
                '<tr>'+"\n"+
                '    <td class="align-top">img (visíveis)</td>'+"\n"+
                '    <td>'+img_alt_msg+'</td>'+"\n"+
                '</tr>'
            );

            var img_alt_inv_msg = $seo_tools.imgs( false );
            $('#valida-seo > table > tbody').append(
                '<tr>'+"\n"+
                '    <td class="align-top">img (não visíveis)</td>'+"\n"+
                '    <td>'+img_alt_inv_msg+'</td>'+"\n"+
                '</tr>'
            );
        // /img

        $('#valida-seo .btn-mostrar-ocorrencias').on('click', function() {
            var _self       = $(this);
            var ocorrencias = $(_self.data('target'));
            var is_visible  = ocorrencias.is(':visible');
            var icon        = $(this).find('i');
            // console.info(_self.data('target'), ocorrencias);
            if(is_visible){
                // ocorrencias.css('display', 'none !important');
                ocorrencias.hide();
                icon.removeClass('fa-minus');
                icon.addClass('fa-plus');
            }else{
                // ocorrencias.css('display', 'block !important');
                ocorrencias.show();
                icon.addClass('fa-minus');
                icon.removeClass('fa-plus');
            }
        });

    },

    a:function() {

        var id = 'ocorrencias-a';

        var relatorio = {
            "success": 0,
            "error":   0,
            "warning": 0,
        };

        var lista = $('a').filter(function() {
            return !$(this).closest("#valida-seo").length;
        });

        var html_msg     = "",
            html_error   = "",
            html_warning = "",
            html_success = "";

        if(lista.length){
            // console.info(lista);
            html_msg  =
                'Foram encontradas <b>'+lista.length+'</b> ocorrências ( <b class="text-success">{a_success}</b> OK(s) | <b class="text-danger">{a_error}</b> Erro(s) | <b class="text-warning">{a_warning}</b> Alertas(s) )'+
                "\n"+'<button class="btn btn-xs btn-info btn-mostrar-ocorrencias float-right" data-target="#'+id+'"><i class="fa fa-plus"></i></button>'+
                "\n"+'<div class="ocorrencias" style="display:none;" id="'+id+'">'+
                "\n"+'    <ul class="nav nav-tabs" id="'+id+'-tabs" role="tablist">'+
                "\n"+'        <li class="nav-item">'+
                "\n"+'            <a class="nav-link text-danger active" id="'+id+'-error-tab" data-toggle="tab" href="#'+id+'-error" role="tab" aria-controls="'+id+'-error" aria-selected="true"><b>{a_error}</b> Erro(s)</a>'+
                "\n"+'        </li>'+
                "\n"+'        <li class="nav-item">'+
                "\n"+'            <a class="nav-link text-warning" id="'+id+'-warning-tab" data-toggle="tab" href="#'+id+'-warning" role="tab" aria-controls="'+id+'-warning" aria-selected="false"><b>{a_warning}</b> Alertas(s)</a>'+
                "\n"+'        </li>'+
                "\n"+'        <li class="nav-item">'+
                "\n"+'            <a class="nav-link text-success" id="'+id+'-success-tab" data-toggle="tab" href="#'+id+'-success" role="tab" aria-controls="'+id+'-success" aria-selected="false"><b>{a_success}</b> OK(s)</a>'+
                "\n"+'        </li>'+
                "\n"+'    </ul>'+
                "\n"+'    <div class="tab-content" id="'+id+'-tabsContent">'+
                "\n"+'        <div class="tab-pane fade show active" id="'+id+'-error" role="tabpanel" aria-labelledby="'+id+'-error-tab">{'+id+'-error}</div>'+
                "\n"+'        <div class="tab-pane fade" id="'+id+'-warning" role="tabpanel" aria-labelledby="'+id+'-warning-tab">{'+id+'-warning}</div>'+
                "\n"+'        <div class="tab-pane fade" id="'+id+'-success" role="tabpanel" aria-labelledby="'+id+'-success-tab">{'+id+'-success}</div>'+
                "\n"+'    </div>'+
                "\n"+'</div>'
            ;

            var table =
                "\n"+'    <table>'+
                "\n"+'        <thead>'+
                "\n"+'            <tr>'+
                "\n"+'                <th width="50">Pos.</th>'+
                "\n"+'                <th width="50">Local</th>'+
                "\n"+'                <th>Texto</th>'+
                "\n"+'                <th>Title</th>'+
                "\n"+'                <th>URL</th>'+
                "\n"+'            </tr>'+
                "\n"+'        </thead>'+
                "\n"+'        <tbody>'
            ;

            html_error   = table;
            html_warning = table;
            html_success = table;

            lista.each(function( i, el ){
                var classe = '';
                var title  = $(el).attr('title');
                var msg    = '';

                if(!title || title == ''){
                    msg = 'Você precisa informar o title do link para gerar mais relevância e otimizar a leitura dos Screen Readers (leitores de tela)';
                    classe = 'danger';
                    relatorio.error++;
                }else if(!title.length < 20){
                    msg = 'Procure ser um pouco mais específico quanto à descrição. Exemplo: "Fale conosco via WhatsApp"';
                    classe = 'warning';
                    relatorio.warning++;
                }else{
                    classe = 'success';
                    relatorio.success++;
                }

                var row =
                    "\n"+'            <tr class="table-'+classe+'" title="'+msg+'">'+
                    "\n"+'                <td>'+i+'</td>'+
                    "\n"+'                <td>'+$seo_tools._getLocal(el)+'</td>'+
                    "\n"+'                <td class="html">'+$(el).html()+'</td>'+
                    "\n"+'                <td>'+($(el).attr('title') || '<i class="text-muted">- não informado -</i>')+'</td>'+
                    "\n"+'                <td class="url"><a href="'+$(el).attr('href')+'" target="_blank">'+$(el).attr('href')+'</a></td>'+
                    "\n"+'            </tr>'
                ;

                switch(classe) {
                    case 'success': html_success += row; break;
                    case 'danger':  html_error   += row; break;
                    case 'warning': html_warning += row; break;
                }
            });

            table =
                "\n"+'        </tbody>'+
                "\n"+'    </table>'
            ;
            html_error   += table;
            html_warning += table;
            html_success += table;

            html_msg = html_msg.replace(/\{a_success\}/g, relatorio.success);
            html_msg = html_msg.replace(/\{a_error\}/g, relatorio.error);
            html_msg = html_msg.replace(/\{a_warning\}/g, relatorio.warning);

            html_msg = html_msg.replace('{'+id+'-success}', html_success);
            html_msg = html_msg.replace('{'+id+'-error}', html_error);
            html_msg = html_msg.replace('{'+id+'-warning}', html_warning);
        }else{
            html_msg = '<b class="text-warning">Nenhuma ocorrência</b>';
        }

        return html_msg;

    },

    h:function() {

        var relatorio = {
            "success": 0,
            "warning": 0,
            "error"  : 0,
            "h1"     : 0,
            "h2"     : 0,
            "h3"     : 0,
            "h4"     : 0,
            "h5"     : 0,
            "h6"     : 0,
        };

        var h_title = $('h1, h2, h3, h4, h5, h6').filter(function() {
            return !$(this).closest("#valida-seo").length;
        });

        var h_title_msg = "";
        if(h_title.length){
            // console.info(h_title);
            h_title_msg  =
                'Foram encontradas <b>'+h_title.length+'</b> ocorrências ( '+
                    '<b class="text-success">{a_success}</b> OK(s) | <b class="text-danger">{a_error}</b> Erro(s) | <b class="text-warning">{a_warning}</b> Alertas(s) '+
                    ' - <b>{a_h1}</b> H1 | <b>{a_h2}</b> H2 | <b>{a_h3}</b> H3 | <b>{a_h4}</b> H4 | <b>{a_h5}</b> H5 | <b>{a_h6}</b> H6'+
                ' )'+
                "\n"+'<button class="btn btn-xs btn-info btn-mostrar-ocorrencias float-right" data-target="#ocorrencias-h"><i class="fa fa-plus"></i></button>'+
                "\n"+'<div class="ocorrencias" style="display:none;" id="ocorrencias-h">'+
                "\n"+'    <table>'+
                "\n"+'        <thead>'+
                "\n"+'            <tr>'+
                "\n"+'                <th width="50">Pos.</th>'+
                "\n"+'                <th width="50">Local</th>'+
                "\n"+'                <th>H</th>'+
                "\n"+'                <th>Texto</th>'+
                "\n"+'                <th width="50">Visível?</th>'+
                "\n"+'            </tr>'+
                "\n"+'        </thead>'+
                "\n"+'        <tbody>'
            ;

            h_title.each(function( i, h ){
                var classe = '';
                var title  = $(h).attr('title');
                var tipo   = h.nodeName.toLowerCase();
                var msg    = '';

                relatorio[tipo]++;

                if(tipo == 'h1' && relatorio.h1 > 1){
                    msg = 'Você pode ter apenas 1 H1 por página!';
                    classe = 'danger';
                    relatorio.error++;
                }else/* if(!title.length < 20){
                    // aqui poderia ser feita uma análise de relevância com base no texto / conteúdo da página e com o title
                    msg = '';
                    classe = 'warning';
                    relatorio.warning++;
                }else*/{
                    classe = 'success';
                    relatorio.success++;
                }

                h_title_msg +=
                    "\n"+'            <tr class="table-'+classe+'" title="'+msg+'">'+
                    "\n"+'                <td>'+i+'</td>'+
                    "\n"+'                <td>'+$seo_tools._getLocal( h )+'</td>'+
                    "\n"+'                <td>'+tipo+'</td>'+
                    "\n"+'                <td class="html">'+$(h).html()+'</td>'+
                    "\n"+'                <td>'+($(h).is(':visible') ? '<b class="text-success">sim</b>' : '<b class="text-danger">não</b>')+'</td>'+
                    "\n"+'            </tr>'
                ;
            });

            h_title_msg +=
                "\n"+'        </tbody>'+
                "\n"+'    </table>'+
                "\n"+'</div>'
            ;

            h_title_msg = h_title_msg.replace('{a_success}', relatorio.success);
            h_title_msg = h_title_msg.replace('{a_error}', relatorio.error);
            h_title_msg = h_title_msg.replace('{a_warning}', relatorio.warning);

            for (var i = 1; i <= 6; i++) {
                h_title_msg = h_title_msg.replace('{a_h'+i+'}', relatorio['h'+i]);
            }
        }else{
            h_title_msg = '<b class="text-warning">Nenhuma ocorrência</b>';
        }

        return h_title_msg;

    },

    imgs:function( visiveis ) {

        var relatorio = {
            "success": 0,
            "error":   0,
            "warning": 0,
        };

        var img_alt;
        img_alt = (visiveis ? $('img:visible') : $('img:not(:visible)')).filter(function() {
            return !$(this).closest("#valida-seo").length;
        });

        var img_alt_msg = "";
        if(img_alt.length){
            // console.info(img_alt);

            img_alt_msg  =
                'Foram encontradas <b>'+img_alt.length+'</b> ocorrências ( <b class="text-success">{a_success}</b> OK(s) | <b class="text-danger">{a_error}</b> Erro(s) | <b class="text-warning">{a_warning}</b> Alertas(s) )'+
                "\n"+'<button class="btn btn-xs btn-info btn-mostrar-ocorrencias float-right" data-target="#ocorrencias-img-alt-'+(visiveis ? '' : 'in')+'visiveis"><i class="fa fa-plus"></i></button>'+
                "\n"+'<div class="ocorrencias" style="display:none;" id="ocorrencias-img-alt-'+(visiveis ? '' : 'in')+'visiveis">'+
                "\n"+'    <table>'+
                "\n"+'        <thead>'+
                "\n"+'            <tr>'+
                "\n"+'                <th width="50">Pos</th>'+
                "\n"+'                <th width="50">Local</th>'+
                "\n"+'                <th width="120">Imagem</th>'+
                "\n"+'                <th>Alt</th>'+
                "\n"+'                <th width="50">Visível?</th>'+
                "\n"+'                <th class="text-center" width="150">Dimensões<br>(Exibida - Real)</th>'+
                "\n"+'            </tr>'+
                "\n"+'        </thead>'+
                "\n"+'        <tbody>'
            ;

            img_alt.each(function( i, img ){
                var w      = Math.round($(img).width());
                var h      = Math.round($(img).height());
                var real_w = Math.round(img.naturalWidth);
                var real_h = Math.round(img.naturalHeight);

                var alt    = $(img).attr('alt');

                if(alt){
                    if(alt.length >= 5){
                        relatorio.success++;
                        classe = 'success';
                        title  = 'OK';
                    }else{
                        relatorio.warning++;
                        classe = 'warning';
                        title  = 'A descrição está muito curta, verifique-a e tente ser mais específico na descrição';
                    }
                }else{
                    relatorio.error++;
                    classe = 'danger';
                    title  = 'ALT não informado';
                }

                if( w != real_w || h != real_h){
                    if(classe == 'success'){
                        relatorio.success--;
                        relatorio.warning++;
                        classe = 'warning';
                    }
                    title += ' (para o ALT). Verifique as dimensões da imagem! Evite usar imagens de tamanhos diferentes do que precisa';
                }

                img_alt_msg +=
                    "\n"+'            <tr class="table-'+classe+'" title="'+title+'">'+
                    "\n"+'                <td>'+i+'</td>'+
                    "\n"+'                <td>'+$seo_tools._getLocal(img)+'</td>'+
                    "\n"+'                <td class="html"><a href="'+$(img).attr('src')+'" target="_blank"><img src="'+$(img).attr('src')+'" /></a></td>'+
                    "\n"+'                <td>'+(alt || '<i class="text-muted">- não definido -</i>')+'</td>'+
                    "\n"+'                <td>'+($(img).is(':visible') ? 'sim' : 'não' )+'</td>'+
                    "\n"+'                <td class="text-right '+( w != real_w || h != real_h ? 'font-weight-bold' : '')+'">'+
                    "\n"+'                    <span class="text-'+( w > real_w || h > real_h ? 'danger' : ( w < real_w || h < real_h ? 'warning' : 'success'))+'"><small>exibida: </small>'+w+'x'+h+'</span><br>'+
                    "\n"+'                    <small>real: </small>'+real_w+'x'+real_h+''+
                    "\n"+'                </td>'+
                    "\n"+'            </tr>'
                ;
            });

            img_alt_msg +=
                "\n"+'        </tbody>'+
                "\n"+'    </table>'+
                "\n"+'</div>'
            ;

            img_alt_msg = img_alt_msg.replace('{a_success}', relatorio.success);
            img_alt_msg = img_alt_msg.replace('{a_error}', relatorio.error);
            img_alt_msg = img_alt_msg.replace('{a_warning}', relatorio.warning);
        }else{
            img_alt_msg = '<b class="text-danger">Nenhuma ocorrência</b>';
        }

        return img_alt_msg;
    },

    meta:function () {

        var relatorio = {
            "success": 0,
            "error":   0,
            "warning": 0,
            "total":   0,
        };

        var title         = $('title').text();
        var description   = $('meta[name="description"]').attr('content');
        var keywords      = $('meta[name="keywords"]').attr('content');
        var robots        = $('meta[name="robots"]').attr('content');
        var revisit_after = $('meta[name="revisit-after"]').attr('content');
        var language      = $('meta[name="language"]').attr('content');
        var generator     = $('meta[name="generator"]').attr('content');
        var encode        = $('meta[http-equiv="Content-Type"]').attr('content');

        // valida o titulo
        var title_class = 'text-success';
        var title_msg   = 'OK';
        if(title.length < 20){
            title_class = 'text-warning';
            title_msg   = 'Tente ser um pouco mais específico sobre sua página ;)';
        }else if(title.length > 63){
            title_class = 'text-danger';
            title_msg   = 'Ops! O Snippet do Google indexa apenas até 63 caracteres =( Seu título tem '+title.length+' caracteres.';
        }

        // valida a descrição
        var description_class = 'text-success';
        var description_msg   = 'OK';
        if(description){
            if(title.length < 50){
                description_class = 'text-warning';
                description_msg   = 'Tente ser um pouco mais específico sobre sua página ;)';
            }else if(title.length > 160){
                description_class = 'text-danger';
                description_msg   = 'Ops! O Snnipet do Google indexa apenas até 160 caracteres =( Seu título tem '+title.length+' caracteres.';
            }
        }else{
            description_class = 'text-danger';
            description_msg   = 'Ops! Você precisa inserir a meta tag description (<em>&lt;meta name=\'description\' content=\'[uma descrição que defina sua página]\'&gt;</em>) à sua página.';
            description       = '<span class="text-muted">- não informada -</span>';
        }

        // valida as palavras-chave
        var keywords_class = 'text-success';
        var keywords_msg   = 'OK';
        if(keywords){
            if(title.length < 50){
                keywords_class = 'text-warning';
                keywords_msg   = 'Tente ser um pouco mais específico sobre sua página ;)';
            }else if(title.length > 200){
                keywords_class = 'text-danger';
                keywords_msg   = 'Ops! Evite usar mais do que 200 caracteres =( Seu título tem '+title.length+' caracteres.';
            }
        }else{
            keywords_class = 'text-danger';
            keywords_msg   = 'Ops! Você precisa inserir a meta tag keywords (<em>&lt;meta name=\'keywords\' content=\'[lista de palavras-chave separadas por vírgula que definem sua página]\'&gt;</em>) à sua página.';
            keywords       = '<span class="text-muted">- não informada -</span>';
        }

        var robots_class = 'text-success';
        var robots_msg   = '';
        if(robots){
            if(robots == "index, follow"){
                robots_msg = 'Rastrear todas as páginas e indexá-los';
            }else if(robots == "index, nofollow"){
                robots_msg = 'Restrear está página, mas não rastrear as outras';
            }else if(robots == "noindex, follow"){
                robots_msg = 'Rastrear cada página, mas não indexar';
            }else if(robots == "noindex, nofollow"){
                robots_msg = 'Não rastrear outras páginas nem índice desta página';
            }else{
                robots_class = 'text-danger';
                robots_msg   = 'Opção <em>'+robots+'</em> inválida';
            }
        }else{
            robots_class = 'text-danger';
            robots_msg   = 'Ops! Você precisa inserir a meta tag keywords (<em>&lt;meta name=\'robots\' content=\'[index, follow | index, nofollow | noindex, follow | noindex, nofollow]\'&gt;</em>) à sua página com alguma das opções: "index, follow", "index, nofollow", "noindex, follow" ou "noindex, nofollow".';
            robots       = '<span class="text-muted">- não informada -</span>';
        }

        var revisit_after_class = 'text-success';
        var revisit_after_msg   = 'OK';
        if(revisit_after){
            if( !'/[0-9]+ (day|month)/'.test(revisit_after) ){
                revisit_after_class = 'text-danger';
                revisit_after_msg   = 'Opção <em>'+revisit_after+'</em> inválida';
            }
        }else{
            revisit_after_class = 'text-danger';
            revisit_after_msg   = 'Ops! Você precisa inserir a meta tag keywords (<em>&lt;meta name=\'revisit-after\' content=\'X [day | month]\'&gt;</em>) à sua página com a periodicidade em dias (7 day) ou meses (1 month) com que seu site é atualizado.';
            revisit_after       = '<span class="text-muted">- não informada -</span>';
        }

        var language_class = 'text-success';
        var language_msg   = 'OK';
        if(!language){
            language_class = 'text-danger';
            language_msg   = 'Ops! Você precisa inserir a meta tag keywords (<em>&lt;meta name=\'language\' content=\'[English | Spanish | Mandarin | Japanese | Korean | French | Portuguese | Malay-Indonesian | Bengali | Arabic | Russian | Hindustani | ...]\'&gt;</em>) à sua página com a língua que seu site está.';
            language       = '<span class="text-muted">- não informada -</span>';
        }

        var encode_class = 'text-success';
        var encode_msg   = 'OK';
        if(!encode){
            encode_class = 'text-danger';
            encode_msg   = 'Ops! Você precisa inserir a meta tag encode (<em>&lt;meta name=\'encode\' content=\'[UTF-8 | ISO-8859-1]\'&gt;</em>) à sua página com o encode de seu site.';
            encode       = '<span class="text-muted">- não informada -</span>';
        }

        var icon = function( cls ){
            relatorio.total++;

            switch( cls ) {
                case 'text-danger':
                    relatorio.error++;
                    return 'thumbs-down';
                break;
                case 'text-warning':
                    relatorio.warning++;
                    return 'exclamation-triangle';
                    break;
                default:
                    relatorio.success++;
                    return 'thumbs-up';
            }
        }

        var meta_tags =
            '<span>'+
                '<i class="fa fa-'+icon(title_class)+' '+title_class+'"></i>'+
                'Title: '+title+
                '<small>'+title_msg+'</small>'+
            '</span>'+"\n"+

            '<span>'+
                '<i class="fa fa-'+icon(description_class)+' '+description_class+'"></i>'+
                'Description: '+description+
                '<small>'+description_msg+'</small>'+
            '</span>'+"\n"+

            '<span>'+
                '<i class="fa fa-'+icon(keywords_class)+' '+keywords_class+'"></i>'+
                'Keywords: '+keywords+
                '<small>'+keywords_msg+'</small>'+
            '</span>'+"\n"+

            '<span>'+
                '<i class="fa fa-'+icon(robots_class)+' '+robots_class+'"></i>'+
                'Robots: '+robots+
                '<small>'+robots_msg+'</small>'+
            '</span>'+"\n"+

            '<span>'+
                '<i class="fa fa-'+icon(revisit_after_class)+' '+revisit_after_class+'"></i>'+
                'Revisit after: '+revisit_after+
                '<small>'+revisit_after_msg+'</small>'+
            '</span>'+"\n"+

            '<span>'+
                '<i class="fa fa-'+icon(language_class)+' '+language_class+'"></i>'+
                'Language: '+language+
                '<small>'+language_msg+'</small>'+
            '</span>'+"\n"+

            '<span>'+
                '<i class="fa fa-'+icon(encode_class)+' '+encode_class+'"></i>'+
                'Encode: '+encode+
                '<small>'+encode_msg+'</small>'+
            '</span>'+"\n"

        ;

        return {
            'html':      meta_tags,
            'relatorio': relatorio
        };

    },

    _getLocal:function(e) {
        var local = '';

        if($(e).closest('header').length) return 'header';
        if($(e).closest('nav').length) return 'nav';
        if($(e).closest('main').length) return 'main';
        if($(e).closest('footer').length) return 'footer';

        return 'body';
    }

}

var seo_tools = new SeoTools();
seo_tools.init({
    css: false
});
