// worker.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/posts") {
      let storedPosts = await env.KV.get("posts");
      if (storedPosts) {
        return new Response(storedPosts, {
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method === "POST" && url.pathname === "/post") {
      const body = await request.json();
      let storedPosts = await env.KV.get("posts");
      const postsArray = storedPosts ? JSON.parse(storedPosts) : [];
      
      const newPost = {
        content: body.content,
        timestamp: Date.now(),
        // 预留指标
        metrics: {
          healing: body.healing || 0,
          aesthetic: body.aesthetic || 0,
          emotion: body.emotion || 0,
          accuracy: body.accuracy || 0,
          difficulty: body.difficulty || 0
        },
        type: body.type || 'general'
      };

      postsArray.push(newPost);
      await env.KV.put("posts", JSON.stringify(postsArray));
      return new Response("Post added", { status: 200 });
    }

    if (request.method === "GET" && url.pathname === "/export") {
      let storedPosts = await env.KV.get("posts");
      return new Response(storedPosts || "[]", {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": "attachment; filename=forum_backup.json"
        },
      });
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>私享论坛 - 极致纯净的文字信源</title>
    <style>
        :root {
            --bg-color: #fcfcfc;
            --text-color: #333;
            --accent-color: #1a1a1a;
            --card-bg: #fff;
            --border-color: #eee;
        }
        body {
            font-family: "Optima", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.8;
            letter-spacing: 0.05em;
        }
        header {
            text-align: center;
            margin-bottom: 60px;
        }
        h1 {
            font-weight: 200;
            font-size: 2.5em;
            margin-bottom: 10px;
            color: var(--accent-color);
            letter-spacing: 8px;
        }
        .subtitle {
            font-size: 0.9em;
            color: #999;
            font-weight: 300;
        }
        #posts {
            margin-bottom: 80px;
        }
        .post {
            background: var(--card-bg);
            padding: 30px;
            margin-bottom: 30px;
            border-radius: 2px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.02);
            border: 1px solid transparent;
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .post:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            border-color: #f0f0f0;
        }
        .post-content {
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 1.05em;
        }
        .post-meta {
            font-size: 11px;
            color: #ccc;
            margin-top: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px dotted #eee;
            padding-top: 15px;
        }
        .post-metrics {
            display: flex;
            gap: 15px;
        }
        .metric-item {
            opacity: 0.6;
        }
        form {
            background: var(--card-bg);
            padding: 40px;
            border-radius: 2px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.02);
        }
        .form-title {
            font-size: 1.2em;
            font-weight: 300;
            margin-bottom: 25px;
            text-align: center;
            letter-spacing: 3px;
        }
        textarea {
            width: 100%;
            height: 160px;
            padding: 20px;
            border: 1px solid #f0f0f0;
            background: #fafafa;
            border-radius: 0;
            resize: none;
            font-size: 14px;
            box-sizing: border-box;
            outline: none;
            transition: all 0.3s;
        }
        textarea:focus {
            background: #fff;
            border-color: #ccc;
        }
        .metrics-input {
            margin-top: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            font-size: 12px;
            color: #666;
        }
        .metrics-input label {
            display: block;
            margin-bottom: 5px;
        }
        .metrics-input input {
            width: 100%;
            border: 1px solid #eee;
            padding: 5px;
            outline: none;
        }
        button {
            display: block;
            width: 180px;
            margin: 40px auto 0;
            padding: 12px;
            background-color: var(--accent-color);
            color: #fff;
            border: none;
            cursor: pointer;
            font-size: 13px;
            letter-spacing: 2px;
            transition: all 0.3s;
        }
        button:hover {
            background-color: #444;
            letter-spacing: 4px;
        }
        .footer-links {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
        }
        .footer-links a {
            color: #ccc;
            text-decoration: none;
            margin: 0 10px;
        }
        .footer-links a:hover {
            color: #666;
        }
        
        /* 准入控制 */
        #access-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: #fff;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            text-align: center;
        }
        #access-overlay input {
            border: none;
            border-bottom: 1px solid #ccc;
            padding: 10px;
            width: 250px;
            text-align: center;
            outline: none;
            font-size: 1.1em;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div id="access-overlay">
        <div style="font-weight: 200; letter-spacing: 4px; color: #999;">意会 / 相同经验</div>
        <div style="margin-top: 15px; font-size: 0.9em; color: #ccc;">“那些真正宝贵的东西，往往不需要大声喧哗”</div>
        <input type="text" id="access-key" placeholder="输入通往此处的关键词..." />
    </div>

    <header>
        <h1>小小天地</h1>
        <div class="subtitle">极致纯净 · 杜绝AI · 治愈共鸣</div>
    </header>

    <main>
        <div id="posts"></div>

        <form id="postForm">
            <div class="form-title">播种美好</div>
            <textarea id="content" placeholder="在此处留下你的真诚与感悟..." required></textarea>
            
            <div class="metrics-input">
                <div>
                    <label>治愈度 (1-10)</label>
                    <input type="number" id="m-healing" min="0" max="10" value="5">
                </div>
                <div>
                    <label>美感 (1-10)</label>
                    <input type="number" id="m-aesthetic" min="0" max="10" value="5">
                </div>
                <div>
                    <label>信息准确 (1-10)</label>
                    <input type="number" id="m-accuracy" min="0" max="10" value="10">
                </div>
            </div>

            <button type="submit">提交此份纯粹</button>
        </form>
    </main>

    <footer class="footer-links">
        <a href="/export" target="_blank">内容备份</a>
        <a href="https://nicolezkx1025.github.io" target="_blank">主站</a>
    </footer>

    <script>
        // 简单的准入逻辑，可以根据用户需求修改
        const accessOverlay = document.getElementById('access-overlay');
        const accessKey = document.getElementById('access-key');
        
        // 简单模拟：如果输入包含了“美好”或“纯净”相关的词汇，或者特定的暗号
        accessKey.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (accessKey.value.length >= 2) { // 暂时设定为至少2个字
                    accessOverlay.style.display = 'none';
                    loadPosts();
                }
            }
        });

        async function loadPosts() {
            try {
                const response = await fetch('/posts');
                const posts = await response.json();
                const postsDiv = document.getElementById('posts');
                postsDiv.innerHTML = '';
                
                if (posts.length === 0) {
                    postsDiv.innerHTML = '<p style="text-align:center; color:#ccc; font-weight:200;">万籁俱寂，静候心声。</p>';
                    return;
                }

                posts.sort((a, b) => b.timestamp - a.timestamp);
                
                posts.forEach(post => {
                    const div = document.createElement('div');
                    div.className = 'post';
                    
                    const content = document.createElement('div');
                    content.className = 'post-content';
                    content.textContent = post.content;
                    
                    const meta = document.createElement('div');
                    meta.className = 'post-meta';
                    
                    const metrics = post.metrics || {};
                    const metricsDiv = document.createElement('div');
                    metricsDiv.className = 'post-metrics';
                    metricsDiv.innerHTML = \`
                        <span class="metric-item">治愈 \${metrics.healing || 0}</span>
                        <span class="metric-item">美感 \${metrics.aesthetic || 0}</span>
                    \`;
                    
                    const time = document.createElement('div');
                    time.textContent = new Date(post.timestamp).toLocaleDateString();
                    
                    meta.appendChild(metricsDiv);
                    meta.appendChild(time);
                    
                    div.appendChild(content);
                    div.appendChild(meta);
                    postsDiv.appendChild(div);
                });
            } catch (e) {
                console.error(e);
            }
        }

        document.getElementById('postForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const content = document.getElementById('content').value;
            const healing = document.getElementById('m-healing').value;
            const aesthetic = document.getElementById('m-aesthetic').value;
            const accuracy = document.getElementById('m-accuracy').value;

            const btn = e.target.querySelector('button');
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = '正在归档...';

            try {
                await fetch('/post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        content,
                        healing: parseInt(healing),
                        aesthetic: parseInt(aesthetic),
                        accuracy: parseInt(accuracy)
                    })
                });
                document.getElementById('content').value = '';
                await loadPosts();
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    </script>
</body>
</html>`;
      return new Response(html, {
        headers: { "Content-Type": "text/html;charset=UTF-8" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};