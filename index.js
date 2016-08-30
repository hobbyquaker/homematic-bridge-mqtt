var mqtt = require('mqtt');

function HmbridgeMqtt(hmbridge) {

    hmbridge.log.info('plugin mqtt started');

    var client  = mqtt.connect('mqtt://172.16.23.100');

    hmbridge.iface.on('rpc', function (method, params, meta) {

        if (method !== 'event') return;

        var topic = [
            'hmip',
            'status',
            meta.channelName,
            params[2]
        ].join('/');

        var payload = JSON.stringify({
            val: params[3],
            ts: (new Date()).getTime(),
            meta: meta
        });
        client.publish(topic, payload, {retain: true});
        hmbridge.log.info('mqtt >', topic, payload);
    });

    client.on('message', function (topic, message) {
        try {
            var parts = topic.split('/');
            if (parts[1] === 'set') mqttSet(topic, payload);

        } catch (e) {
            hmbridge.log.error('mqtt <', topic, message, e);
        }
    });

    function mqttSet(topic, message) {
        message = message.toString();
        var parts = topic.split('/');
        var payload;
        try {
            payload = JSON.parse(message);
        } catch (e) {
            if (message.toLowerCase() === 'true') {
                payload = true;
            } else if (message.toLowerCase() === 'false') {
                payload = false;
            } else if (!isNaN(message)) {
                payload = parseFloat(message)
            } else {
                payload = message;
            }
        }



    }

}

module.exports = HmbridgeMqtt;