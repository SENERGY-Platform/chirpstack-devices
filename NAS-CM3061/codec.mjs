function decodeActiveAlerts(b) {
    return {
      tamper_pending: (b & 0b00001000) === 0b00001000,
      battery: (b & 0b00100000) === 0b00100000,
      no_usage: (b & 0b01000000) === 0b01000000,
      any_alert_active: (b & 0b10000000) === 0b10000000,
    };
  }
  
  function decode_usage_packet(buf, resp) {
    if (buf[0] != 0x04) {
      resp.data.error = "first byte not 0x04";
      return;
    }
    resp.data.data['alerts'] = decodeActiveAlerts(buf[1]);
    // buf[2] RFU
    let meter_multiplier = Math.pow(10,(buf[3] & 0b00000111)-6);
    if (buf[4] < 60) {
      resp.data.data['meter_actuality_duration__minutes'] = buf[4];
    } else if (buf[4] < 156) {
      resp.data.data['meter_actuality_duration__minutes'] = (buf[4] - 60) * 15;
    } else if (buf[4] < 200) {
      resp.data.data['meter_actuality_duration__minutes'] = (buf[4] - 156) * 1440;
    }
    resp.data.data['meter_accumulated_volume'] = buf.readUInt32LE(5) * meter_multiplier;
    // TODO meter_readout_date
    // TODO general_parameters
  }
  
  
  
  // Decode uplink function.
    //
    // Input is an object with the following fields:
    // - bytes = Byte array containing the uplink payload, e.g. [255, 230, 255, 0]
    // - fPort = Uplink fPort.
    // - variables = Object containing the configured device variables.
    //
    // Output must be an object with the following fields:
    // - data = Object representing the decoded payload.
  export function decodeUplink(input) {
    let buf = Buffer.from(input.bytes);
    let resp = {
      data: {
        hex: input.bytes.reduce((output, elem) => (output + ('0' + elem.toString(16)).slice(-2)),''),
        error: null,
        data: {},
      }
    };
    switch (input.fPort) {
      case 25:
        if (input.bytes.length == 10) {
          resp.data.error = "short format not fully! implemented";
          decode_usage_packet(buf, resp);
          break;
        } else if (input.bytes.length == 22) {
          resp.data.error = "long format not implemented";
          decode_usage_packet(buf, resp);
          // TODO decode battery_, temperature_, radio_ and meter_serial
          break;
        } else {
          resp.data.error = "unexpected data length";
          break; 
        }
        break;
      // TODO fPort 99,50,49,60
      default:
        resp.data.error = "unimplemented fPort " + input.fPort;
    }
    return resp;
  }
    
    // Encode downlink function.
    //
    // Input is an object with the following fields:
    // - data = Object representing the payload that must be encoded.
    // - variables = Object containing the configured device variables.
    //
    // Output must be an object with the following fields:
    // - bytes = Byte array containing the downlink payload.
    function encodeDownlink(input) {
      throw "not implemented";
      // TODO fPort 50,49,60
      // fPort 60 has no payload
    }
    