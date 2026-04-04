import mqtt from 'mqtt'
import dotenv from 'dotenv'

dotenv.config()

const client = mqtt.connect("wss://fb65afa1d6c34fa29ba74f059d62716c.s1.eu.hivemq.cloud:8884/mqtt", {
  username: process.env.USERNAME,
  password: process.env.PASSWORD
});

// 🔥 一定要有這個
client.on("connect", () => {
  console.log("MQTT connected");

  // 測試用
  client.publish("gate/control", "open");
});

client.on("error", (err) => {
  console.log("MQTT error:", err);
});

function sendCommand(cmd) {
  client.publish("gate/control", cmd);
}

export default handler = (req, res) => {
  // 寫入指令（Shortcut 用）
  if (req.method === "POST") {
    const { action } = req.body || {};

    if (!["open", "close", "stop"].includes(action)) {
      return res.status(400).send("invalid");
    }
    
    sendCommand('open')
    lastCommand = {
      action,
      time: Date.now()
    };

    return res.json({ success: true });
  }

  // ESP32 來拿指令
  if (req.method === "GET") {
    if (!lastCommand) {
      return res.json({ action: null });
    }

    // 只用一次（避免重複觸發）
    const cmd = lastCommand;
    lastCommand = null;

    return res.json(cmd);
  }

  res.status(405).send("Method not allowed");
}