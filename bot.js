const bedrock = require('bedrock-protocol');
const http = require('http');

const PORT = process.env.PORT || 3000;

// 🌐 防Render休眠（必须）
http.createServer((req, res) => {
  res.end('AFK Bot Running');
}).listen(PORT, () => {
  console.log('🌐 Web server running');
});

// 🔁 启动Bot函数
function startBot() {
  const client = bedrock.createClient({
    host: '你的服务器IP',
    port: 19132,
    username: 'AFK_Bot',
    offline: true
  });

  let pos = { x: 0, y: 100, z: 0 };
  let yaw = 0;

  client.on('join', () => {
    console.log('✅ 已进入服务器');

    setInterval(() => {
      // 随机移动
      pos.x += (Math.random() - 0.5) * 1.5;
      pos.z += (Math.random() - 0.5) * 1.5;
      yaw += Math.random() * 10 - 5;

      client.write('move_player', {
        runtime_id: client.entityId,
        position: pos,
        rotation: { x: 0, y: yaw, z: 0 },
        mode: 0,
        on_ground: true,
        ridden_runtime_id: 0,
        teleport: 0
      });

    }, 2000);

    // 💬 防AFK聊天
    setInterval(() => {
      client.queue('text', {
        message: "AFK...",
        type: "chat",
        needs_translation: false,
        source_name: client.username,
        xuid: "",
        platform_chat_id: ""
      });
    }, 60000);
  });

  client.on('spawn', (packet) => {
    pos = packet.position;
  });

  client.on('disconnect', () => {
    console.log('⛔️ 掉线，5秒后重连...');
    setTimeout(startBot, 5000);
  });

  client.on('error', (err) => {
    console.log('⚠️ 错误:', err.message);
  });
}

// 🚀 启动
startBot();