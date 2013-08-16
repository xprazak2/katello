function environment_selected(element) {
    // TODO: ENGINIFY: url should utilize KT.routes
    var env_select = $(element),
        url = env_select.data('url') + "/" + $(element).val() + "/content_views";

    $(element).indicator_show();
    $.ajax({
        type:'get',
        url: url,
        complete: function(){  $(element).indicator_hide();},
        success: function(response) {
            var options = "<option value=''></option>";
            $.each(response, function(key, item) {
                options += "<option value='"+ item.id + "'>" + item.name + "</option>";
            });
            $('#host_content_view_id').html(options);
            reload_operating_system_params($('#host_content_view_id'));
        }
    });
};

function content_view_selected(element) {
    reload_operating_system_params(element);
};

function reload_operating_system_params(element) {
    var attrs = attribute_hash(['operatingsystem_id', 'organization_id', 'location_id']);

    if (attrs["operatingsystem_id"] !== "") {
        os_selected(element);
    }
}

function os_selected(element){
  var attrs = attribute_hash(['operatingsystem_id', 'organization_id', 'location_id', 'kt_environment_id', 'content_view_id']);
  var url = $(element).attr('data-url');
  $(element).indicator_show();
  $.ajax({
    data: attrs,
    type:'post',
    url: url,
    complete: function(){  $(element).indicator_hide();},
    success: function(request) {
      $('#media_select').html(request);
      reload_host_params();
    }
  });
  update_provisioning_image();
}

