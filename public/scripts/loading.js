// Man hinh cho truoc khi bundle chinh duoc tai xong (co thuong hieu, khong phu thuoc React).
(function () {
  var root = document.getElementById('root');
  if (!root || root.innerHTML.trim() !== '') return;

  var style = document.createElement('style');
  style.setAttribute('data-nk-boot', '');
  style.innerHTML = [
    '@keyframes nkBootSpin{to{transform:rotate(360deg)}}',
    '@keyframes nkBootPulse{0%,100%{opacity:.55;transform:scale(.97)}50%{opacity:1;transform:scale(1)}}',
    '@keyframes nkBootBar{0%{transform:translateX(-100%)}100%{transform:translateX(280%)}}',
    '.nk-boot{display:flex;flex-direction:column;align-items:center;justify-content:center;',
    'height:100vh;gap:20px;background:radial-gradient(1200px 600px at 50% -10%,#e8efff 0%,#f4f6fb 60%);',
    "font-family:'Be Vietnam Pro','Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif}",
    '.nk-boot-mark{position:relative;width:76px;height:76px;display:flex;align-items:center;justify-content:center}',
    '.nk-boot-ring{position:absolute;inset:0;border-radius:50%;border:3px solid rgba(37,99,235,.14);',
    'border-top-color:#2563eb;animation:nkBootSpin 1s linear infinite}',
    '.nk-boot-logo{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;',
    'color:#fff;font-weight:700;font-size:22px;letter-spacing:.5px;',
    'background:linear-gradient(135deg,#60a5fa,#2563eb 55%,#4f46e5);',
    'box-shadow:0 10px 24px -8px rgba(37,99,235,.65);animation:nkBootPulse 1.6s ease-in-out infinite}',
    '.nk-boot-title{font-size:16px;font-weight:600;color:#0f1c3f;letter-spacing:.2px}',
    '.nk-boot-sub{margin-top:-12px;font-size:13px;color:#7a869a}',
    '.nk-boot-bar{position:relative;width:160px;height:3px;border-radius:99px;background:rgba(37,99,235,.12);overflow:hidden}',
    '.nk-boot-bar span{position:absolute;inset:0;width:36%;border-radius:99px;',
    'background:linear-gradient(90deg,#60a5fa,#4f46e5);animation:nkBootBar 1.15s ease-in-out infinite}',
  ].join('');
  document.head.appendChild(style);

  root.innerHTML = [
    '<div class="nk-boot">',
    '<div class="nk-boot-mark"><div class="nk-boot-ring"></div><div class="nk-boot-logo">N</div></div>',
    '<div class="nk-boot-title">Nenkin</div>',
    '<div class="nk-boot-sub">Đang khởi động hệ thống...</div>',
    '<div class="nk-boot-bar"><span></span></div>',
    '</div>',
  ].join('');
})();
