// Loading placeholder truoc khi bundle chinh duoc tai xong.
(function () {
  var root = document.getElementById('root');
  if (!root || root.innerHTML.trim() !== '') return;
  root.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#1677ff">Đang tải...</div>';
})();
