/*
 * Bounce plugin script
 * @version 1.1
 * @author Denis Sobolev
 */

function rcmail_bounce_box() {
  if (!rcmail.gui_objects.bouncebox)
    return false;
  var elm;
  if (elm = rcmail.gui_objects.bouncebox)
    $(elm).toggle();
}

function rcmail_bounce_send(prop) {
  if (!rcmail.gui_objects.bounceform)
    return false;

  if (rcmail.env.uid)
    var uid = rcmail.env.uid;
  else
    var uid = rcmail.get_single_uid();

  var input_to  = $('#_to').val();
  var input_cc  = $('#_cc').val();
  var input_bcc = $('#_bcc').val();

  // check for empty recipient
  var recipients = input_to;
  alert(recipients);
  if (!rcube_check_email(recipients.replace(/^\s+/, '').replace(/[\s,;]+$/, ''), true)) {
    alert(rcmail.get_label('norecipientwarning'));
    input_to.focus();
    return false;
  } else {
    // all checks passed, send message
    lock = rcmail.set_busy(true, 'sendingmessage');
    rcmail.http_post('plugin.bounce', '_uid='+uid+'&_to='+input_to+'&_cc='+input_cc+'&_bcc='+input_bcc, lock);
    $('#bounce-box').hide();
    return true;
  }
}

function autoload() {
  var input_to = $("[name='_to']"),
  ac_fields = ['cc', 'bcc'];
  rcmail.init_address_input_events(input_to);
  for (var i in ac_fields) {
    rcmail.init_address_input_events($("[name='_"+ac_fields[i]+"']"));
  }
}

/* Fix for roundcube patch Changeset 4224*/
function select_field(input){
  rcmail.message_list.blur();
  input.focus();
}

// callback for app-onload event
if (window.rcmail) {
  rcmail.addEventListener('init', function(evt) {
    autoload();
    // register command (directly enable in message view mode)
    rcmail.register_command('plugin.bounce.box', rcmail_bounce_box, rcmail.env.uid);
    rcmail.register_command('plugin.bounce.send', rcmail_bounce_send, rcmail.env.uid);

    // add event-listener to message list
    if (rcmail.message_list)
      rcmail.message_list.addEventListener('select', function(list){
        rcmail.enable_command('plugin.bounce.box', (list.get_selection().length == 1 || rcmail.env.uid));
        rcmail.enable_command('plugin.bounce.send', (list.get_selection().length == 1 || rcmail.env.uid));
      });
  })
}