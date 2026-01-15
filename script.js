const workerUrl = 'https://forum-worker.kzhangas.workers.dev';

// 加载帖子
async function loadPosts() {
    const response = await fetch(`${workerUrl}/posts`);
    const posts = await response.json();
    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = '';
    posts.forEach(post => {
        const p = document.createElement('p');
        p.innerHTML = post.content.replace(/\n/g, '<br>'); // 支持换行，支持链接自动渲染
        postsDiv.appendChild(p);
    });
}

// 提交表单
document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('content').value;
    await fetch(`${workerUrl}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    });
    document.getElementById('content').value = ''; // 清空
    loadPosts(); // 刷新帖子
});

// 初始加载
loadPosts();