/*
 * Bounce plugin script
 * @version 1.01
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

  var input_to  = rcube_find_object('_to').value;
  var input_cc  = rcube_find_object('_cc').value;
  var input_bcc = rcube_find_object('_bcc').value;

  // check for empty recipient
  var recipients = input_to;
  if (!rcube_check_email(recipients.replace(/^\s+/, '').replace(/[\s,;]+$/, ''), true)) {
    alert(rcmail.get_label('norecipientwarning'));
    input_to.focus();
    return false;
  } else {
    // all checks passed, send message
    rcmail.set_busy(true, 'sendingmessage');
    rcmail.http_post('plugin.bounce', '_uid='+uid+'&_to='+input_to+'&_cc='+input_cc+'&_bcc='+input_bcc, true);
    $('#bounce-box').hide();
    return true;
  }
}

// callback for app-onload event
if (window.rcmail) {
  rcmail.addEventListener('init', function(evt) {

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

