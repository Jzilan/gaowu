// ═══════════════ 万族之灾配置小助手 ═══════════════
// 酒馆助手中粘贴以下一行即可：
//   import 'https://testingcf.jsdelivr.net/gh/NLKASHEI/114514@v1.1.4/高武配置小助手.min.js'
// ═══════════════════════════════════════════════════════════

const GAOWU_VERSION = '1.0.0';
const p = window.parent || window;

// 清理旧实例
const oldPanel = p.document.getElementById('gw-switch-panel');
const oldBubble = p.document.getElementById('gw-switch-bubble');
if (oldPanel) oldPanel.remove();
if (oldBubble) oldBubble.remove();

// ═══════════════ 核心：在父页面上下文执行代码 ═══════════════
function runInParent(fnString) {
  return new Promise((resolve, reject) => {
    const token = 'gw_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const handler = (e) => {
      if (!e.detail || e.detail.token !== token) return;
      p.document.removeEventListener('gw-result', handler);
      if (e.detail.error) reject(new Error(e.detail.error));
      else resolve(e.detail.result);
    };
    p.document.addEventListener('gw-result', handler);

    const script = p.document.createElement('script');
    script.textContent = `
(async () => {
  try {
    var _result = await (${fnString});
    document.dispatchEvent(new CustomEvent('gw-result', { detail: { token: '${token}', result: _result } }));
  } catch(_e) {
    document.dispatchEvent(new CustomEvent('gw-result', { detail: { token: '${token}', error: _e.message || String(_e) } }));
  }
})();
`;
    p.document.body.appendChild(script);
    script.remove();
  });
}

// ═══════════════ API 封装（均在父页面上下文执行） ═══════════════
async function api_getWorldbookNames() {
  return runInParent('TavernHelper.getWorldbookNames()');
}

async function api_getCharWorldbooks() {
  return runInParent('TavernHelper.getCharWorldbookNames("current")');
}

async function api_getWorldbook(name) {
  return runInParent(`TavernHelper.getWorldbook(${JSON.stringify(name)})`);
}

async function api_replaceWorldbook(name, entriesModifier) {
  return runInParent(
    `(async () => {` +
    `  var _entries = await TavernHelper.getWorldbook(${JSON.stringify(name)});` +
    `  (${entriesModifier})(_entries);` +
    `  await TavernHelper.replaceWorldbook(${JSON.stringify(name)}, _entries);` +
    `  return await TavernHelper.getWorldbook(${JSON.stringify(name)});` +
    `})()`
  );
}

// --- CSS（注入到父页面，高武配色） ---
const CSS = p.document.createElement('style');
CSS.textContent = `
  .gw-switch-bubble,
  .gw-switch-bubble:hover,
  .gw-switch-bubble:focus,
  .gw-switch-bubble:focus-visible,
  .gw-switch-bubble:focus-within,
  .gw-switch-bubble:active {
    position: fixed !important; width: 40px; height: 40px;
    background: transparent !important; border: none !important; border-radius: 50% !important;
    z-index: 1000000; cursor: pointer; display: flex; align-items: center;
    justify-content: center; touch-action: none;
    box-shadow: 0 0 12px rgba(212,161,58,0.4) !important; outline: none !important;
    transition: left 0.3s cubic-bezier(0.18,0.89,0.32,1.28), box-shadow 0.2s;
    user-select: none; -webkit-user-select: none;
    padding: 0 !important; margin: 0 !important; overflow: hidden;
    -webkit-tap-highlight-color: transparent !important;
    -webkit-appearance: none !important; appearance: none !important;
    text-decoration: none !important; pointer-events: auto;
  }
  .gw-switch-bubble img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 50%; }
  .gw-switch-bubble:hover {
    box-shadow: 0 0 20px rgba(212,161,58,0.7) !important;
  }
  .gw-switch-panel {
    position: fixed !important; z-index: 999998;
    background: rgba(12,8,4,0.97) !important;
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(122,94,26,0.5) !important;
    box-shadow: 0 12px 48px rgba(0,0,0,0.7), 0 0 30px rgba(212,161,58,0.06) !important;
    font-family: 'STSong','SimSun','Microsoft YaHei',serif !important;
    display: flex; flex-direction: column; border-radius: 10px !important;
    color: #ede4cd !important; font-size: 13px;
    overflow: hidden; width: 320px; max-width: 92vw; max-height: 62vh; box-sizing: border-box;
    padding: 0 !important; margin: 0 !important;
  }
  .gw-switch-panel::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #d4a13a, #f6df9a, #d4a13a, transparent) !important;
    opacity: 0.6; pointer-events: none;
  }
  .gw-switch-header {
    padding: 14px 16px 10px !important; display: flex; align-items: center;
    justify-content: space-between; cursor: move; user-select: none;
    touch-action: none; flex-shrink: 0;
    border-bottom: 1px solid rgba(122,94,26,0.3) !important;
    background: transparent !important; margin: 0 !important;
  }
  .gw-switch-header-title {
    color: #d4a13a !important; font-weight: 700; font-size: 18px;
    font-family: 'STXingkai','华文行楷','STKaiti','KaiTi',serif !important;
    letter-spacing: 3px; display: flex; align-items: center; gap: 8px;
    background: none !important; border: none !important;
    text-shadow: 0 0 8px rgba(212,161,58,0.3) !important;
    box-shadow: none !important;
  }
  .gw-switch-body { flex: 1; overflow-y: auto; padding: 14px 16px !important; }
  .gw-switch-body::-webkit-scrollbar { width: 4px; }
  .gw-switch-body::-webkit-scrollbar-track { background: transparent; }
  .gw-switch-body::-webkit-scrollbar-thumb { background: rgba(212,161,58,0.12); border-radius: 2px; }
  .gw-switch-section {
    background: rgba(212,161,58,0.03) !important; border: 1px solid rgba(122,94,26,0.25) !important;
    border-radius: 8px !important; padding: 14px !important; margin-bottom: 12px;
  }
  .gw-switch-section-title {
    font-size: 11px; color: #d4a13a !important; font-weight: 600; letter-spacing: 1.2px;
    margin-bottom: 10px;
    display: flex; align-items: center; gap: 6px;
    background: none !important; border: none !important;
  }
  .gw-switch-section-title::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(212,161,58,0.2), transparent);
  }
  .gw-config-status {
    margin-bottom: 12px; padding: 10px 14px !important;
    border-radius: 8px !important; font-size: 13px; font-weight: 600;
    text-align: center; letter-spacing: 0.5px;
    background: rgba(74,222,128,0.06) !important;
    border: 1px solid rgba(74,222,128,0.25) !important;
    color: #4ade80 !important;
  }
  .gw-config-status.warn {
    background: rgba(201,79,61,0.08) !important;
    border: 1px solid rgba(201,79,61,0.35) !important;
    color: #c94f3d !important;
    animation: gw-pulse-warn 2s ease-in-out infinite;
  }
  @keyframes gw-pulse-warn {
    0%, 100% { border-color: rgba(201,79,61,0.35) !important; }
    50% { border-color: rgba(201,79,61,0.7) !important; }
  }

  .gw-switch-bubble.warn {
    box-shadow: 0 0 20px 6px rgba(201,79,61,0.7), 0 0 40px 12px rgba(201,79,61,0.3) !important;
    animation: gw-bubble-warn 1.8s ease-in-out infinite;
  }
  @keyframes gw-bubble-warn {
    0%, 100% { box-shadow: 0 0 12px 3px rgba(201,79,61,0.4), 0 0 24px 6px rgba(201,79,61,0.15) !important; }
    50% { box-shadow: 0 0 24px 8px rgba(255,60,40,0.9), 0 0 48px 16px rgba(201,79,61,0.4) !important; }
  }
  .gw-switch select {
    width: 100%; max-width: 100%; box-sizing: border-box;
    padding: 9px 32px 9px 12px; border-radius: 6px; font-size: 13px;
    font-family: inherit; background: #14100c !important;
    border: 1px solid #3a2a10 !important; color: #ede4cd !important; cursor: pointer;
    -webkit-appearance: none; appearance: none; transition: border-color 0.2s;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23d4a13a' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center;
    box-shadow: none !important; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .gw-switch select:hover { border-color: #d4a13a !important; }
  .gw-switch select:focus { border-color: #f6df9a !important; outline: none; box-shadow: 0 0 0 2px rgba(212,161,58,0.1) !important; }
  .gw-switch select option { background: #14100c !important; color: #ede4cd !important; }
  .gw-switch-btn {
    padding: 7px 14px !important; border-radius: 6px !important; cursor: pointer;
    border: 1px solid #3a2a10 !important; background: rgba(212,161,58,0.06) !important;
    color: #e9c25e !important; font-size: 12px; font-weight: 500; font-family: inherit !important;
    transition: all 0.2s; letter-spacing: 0.3px;
    text-shadow: none !important; box-shadow: none !important;
    line-height: 1.4 !important; min-height: auto !important;
  }
  .gw-switch-btn:hover {
    background: rgba(212,161,58,0.15) !important; border-color: #d4a13a !important; color: #fff !important;
  }
  .gw-switch-btn.primary {
    width: 100% !important; display: block !important;
    background: linear-gradient(160deg, #d4a13a, #8a6a2a) !important;
    border: 1px solid #d4a13a !important; color: #0a0804 !important;
    margin-top: 6px; padding: 10px !important; font-size: 13px; font-weight: 700 !important;
    letter-spacing: 0.5px; text-shadow: none !important;
    box-shadow: 0 2px 10px rgba(212,161,58,0.15) !important;
    line-height: 1.4 !important; min-height: auto !important;
    text-align: center !important;
  }
  .gw-switch-btn.primary:hover {
    background: linear-gradient(160deg, #e9c25e, #a0782a) !important;
    border-color: #f6df9a !important; box-shadow: 0 4px 16px rgba(212,161,58,0.3) !important;
    color: #0a0804 !important;
  }
  .gw-switch-btn.primary:disabled {
    opacity: 0.35; cursor: not-allowed; filter: grayscale(30%);
  }
  .gw-switch-btn.xs {
    padding: 4px 10px !important; font-size: 11px; width: auto; border-radius: 5px !important;
    background: transparent !important; border-color: rgba(122,94,26,0.3) !important;
    color: #d4a13a !important; font-weight: 500 !important;
    display: inline-block !important; box-shadow: none !important;
  }
  .gw-switch-btn.xs:hover {
    border-color: #d4a13a !important; color: #e9c25e !important;
    background: rgba(212,161,58,0.08) !important;
  }
  .gw-switch-domain-btns {
    display: flex; gap: 10px; margin-bottom: 10px;
  }
  .gw-switch-domain-btn {
    flex: 1; padding: 10px 0 !important; border-radius: 6px !important; cursor: pointer;
    border: 1px solid #3a2a10 !important;
    background: #14100c !important; color: #ede4cd !important;
    font-size: 13px; font-weight: 500; font-family: inherit !important;
    transition: all 0.25s; text-align: center !important;
    letter-spacing: 1px;
    text-shadow: none !important; box-shadow: none !important;
    line-height: 1.4 !important;
  }
  .gw-switch-domain-btn:hover {
    background: rgba(212,161,58,0.12) !important; border-color: #d4a13a !important;
    color: #fff !important;
  }
  .gw-switch-domain-btn.active {
    background: #d4a13a !important; border-color: #f6df9a !important;
    color: #0a0804 !important; font-weight: 700 !important;
    box-shadow: 0 0 12px rgba(212,161,58,0.4) !important;
  }
  .gw-switch-panel .gw-status-inline {
    display: flex; align-items: center; gap: 8px; font-size: 12px;
  }
  .gw-switch-panel .status-dot {
    width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
  }
  .gw-switch-panel .status-dot.on {
    background: #4ade80;
    box-shadow: 0 0 10px #4ade80, 0 0 20px rgba(74,222,128,0.4);
  }
  .gw-switch-panel .status-dot.off {
    background: #c94f3d;
    box-shadow: 0 0 10px #c94f3d, 0 0 20px rgba(201,79,61,0.4);
  }
  .gw-switch-panel .status-dot.missing { background: #3a3020; box-shadow: none; }
  .gw-switch-panel .status-label { color: #b09b6b !important; }
  .gw-switch-toast {
    position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
    background: rgba(12,8,4,0.97) !important; border: 1px solid rgba(212,161,58,0.35) !important;
    border-radius: 8px !important; padding: 10px 24px !important; color: #d4a13a !important;
    font-size: 13px; font-weight: 600; z-index: 1000002;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 10px rgba(212,161,58,0.06) !important;
    animation: gw-toast-in 0.3s ease, gw-toast-out 0.3s ease 2.2s forwards;
    letter-spacing: 0.3px; font-family: 'STSong','SimSun','Microsoft YaHei',serif !important;
    margin: 0 !important;
  }
  @keyframes gw-toast-in { from { opacity: 0; transform: translateX(-50%) translateY(-12px); } }
  @keyframes gw-toast-out { to { opacity: 0; transform: translateX(-50%) translateY(-12px); } }
  @media (max-width: 768px) {
    .gw-switch-panel { width: clamp(260px, 88vw, 340px) !important; font-size: 11px; max-height: 55vh; }
    .gw-switch-bubble { width: 32px; height: 32px; }
    .gw-switch-header { padding: 8px 10px 6px !important; }
    .gw-switch-header-title { font-size: 14px; letter-spacing: 1px; }
    .gw-switch-body { padding: 6px 8px !important; }
    .gw-switch-section { padding: 6px 8px !important; margin-bottom: 5px; }
    .gw-switch-section-title { font-size: 9px; margin-bottom: 4px; }
    .gw-switch-domain-btn { padding: 6px 0 !important; font-size: 11px; letter-spacing: 0.5px; }
    .gw-switch-domain-btns { gap: 6px; }
    .gw-switch-btn { padding: 5px 10px !important; font-size: 10px; }
    .gw-switch-btn.xs { padding: 4px 8px !important; font-size: 10px; }
    .gw-switch-btn.primary { padding: 7px !important; font-size: 11px; margin-top: 4px; }
    .gw-switch-panel .gw-status-inline { font-size: 10px; gap: 4px; }
    .gw-switch-panel .status-dot { width: 7px; height: 7px; }
    .gw-switch-panel select { padding: 5px 24px 5px 8px; font-size: 11px; }
    .gw-config-status { padding: 6px 8px !important; font-size: 11px; margin-bottom: 6px; }
    .gw-mvu-row { gap: 3px; margin-bottom: 1px; }
    .gw-mvu-label { font-size: 10px; min-width: 44px; }
    .gw-mvu-label.wide { min-width: 52px; }
    .gw-mvu-input { padding: 3px 6px; font-size: 10px; }
    .gw-mvu-input.num { width: 44px; }
    .gw-mvu-select { padding: 3px 20px 3px 6px; font-size: 10px; }
    .gw-mvu-check-row { font-size: 10px; }
    .gw-mvu-check-box { width: 12px; height: 12px; }
    .gw-mvu-subtitle { font-size: 8px; margin: 3px 0 1px; }
    .gw-mvu-collapse-header { font-size: 10px; }
    .gw-mvu-grid-2 { gap: 1px 3px; }
    .gw-mvu-hint { font-size: 9px; }
    #gw-mvu-section { padding: 6px 8px !important; }
    #gw-confirm-dialog { padding: 12px 16px !important; }
  }
`;
p.document.head.appendChild(CSS);

// 追加 MVU 配置表单 CSS
const MVU_CSS = p.document.createElement('style');
MVU_CSS.textContent = `
  .gw-mvu-row { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
  .gw-mvu-row.col { flex-direction: column; align-items: stretch; gap: 2px; }
  .gw-mvu-label { font-size: 13px; color: #b09b6b; white-space: nowrap; flex-shrink: 0; min-width: 56px; letter-spacing: 0.3px; }
  .gw-mvu-label.wide { min-width: 64px; }
  .gw-mvu-input { flex: 1; padding: 5px 9px; border-radius: 5px; font-size: 13px; font-family: inherit; background: #14100c !important; border: 1px solid #3a2a10 !important; color: #ede4cd !important; transition: border-color 0.2s; min-width: 0; box-shadow: none !important; outline: none !important; }
  .gw-mvu-input:focus { border-color: #d4a13a !important; }
  .gw-mvu-input.num { width: 58px; flex: 0 0 auto; text-align: center; padding: 5px 2px; }
  .gw-mvu-select { flex: 1; padding: 5px 26px 5px 9px; border-radius: 5px; font-size: 13px; font-family: inherit; background: #14100c !important; border: 1px solid #3a2a10 !important; color: #ede4cd !important; cursor: pointer; -webkit-appearance: none; appearance: none; transition: border-color 0.2s; min-width: 0; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23d4a13a' d='M5 7L1 3h8z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 7px center; box-shadow: none !important; outline: none !important; }
  .gw-mvu-select:focus { border-color: #d4a13a !important; }
  .gw-mvu-check-row { display: flex; align-items: center; gap: 4px; margin-bottom: 1px; font-size: 13px; color: #d5c9b0; cursor: pointer; line-height: 1.4; }
  .gw-mvu-check-row input[type="checkbox"] { display: none !important; }
  .gw-mvu-check-box { width: 14px; height: 14px; flex-shrink: 0; border: 1.5px solid #4a3a20; border-radius: 3px; background: #14100c; transition: all 0.15s; display: inline-block; box-sizing: border-box; }
  .gw-mvu-check-row input:checked ~ .gw-mvu-check-box { background: #d4a13a; border-color: #d4a13a; }
  .gw-mvu-check-row:hover .gw-mvu-check-box { border-color: #d4a13a; }
  .gw-mvu-hint { font-size: 11px; color: #ede4cd; line-height: 1.4; margin-top: 1px; }
  .gw-mvu-subtitle { font-size: 10px; color: #e9c25e; letter-spacing: 0.8px; margin: 5px 0 2px; padding-top: 4px; border-top: 1px solid rgba(122,94,26,0.2); }
  .gw-mvu-collapse-header { display: flex; align-items: center; gap: 3px; cursor: pointer; font-size: 11px; color: #d4a13a; padding: 3px 0; user-select: none; }
  .gw-mvu-collapse-header:hover { color: #e9c25e; }
  .gw-mvu-collapse-arrow { display: inline-block; font-size: 8px; transition: transform 0.2s; }
  .gw-mvu-collapse-arrow.open { transform: rotate(90deg); }
  .gw-mvu-collapse-body { padding-left: 4px; }
  .gw-mvu-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 6px; }
  #gw-mvu-section { padding: 10px 12px !important; }
  #gw-mvu-section .gw-mvu-subtitle:first-of-type { margin-top: 2px; }
  #gw-mvu-section::-webkit-scrollbar { width: 3px; }
  #gw-mvu-section::-webkit-scrollbar-thumb { background: rgba(212,161,58,0.15); border-radius: 2px; }
  #gw-confirm-dialog { overflow: hidden !important; }
  #gw-confirm-body { overflow: hidden; }
  #gw-confirm-body .gw-mvu-select { max-width: 100%; width: 0; }
  #gw-confirm-body .gw-mvu-input { max-width: 100%; }
  #gw-confirm-body .gw-mvu-row { overflow: hidden; }
`;
p.document.head.appendChild(MVU_CSS);


// --- HTML（注入到父页面） ---
p.document.body.insertAdjacentHTML('beforeend', `
  <div id="gw-switch-bubble" class="gw-switch-bubble" style="top: 40vh; left: 60px;" title="万族之灾配置小助手"><img src="data:image/jpeg;base64,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" alt="武"></div>
  <div id="gw-switch-panel" class="gw-switch-panel" style="display:none; left: 110px; top: 35vh;">
    <div class="gw-switch-header" id="gw-switch-drag">
      <span class="gw-switch-header-title">万族之灾配置小助手</span>
      <button class="gw-switch-btn xs" id="gw-switch-refresh" title="刷新">刷新</button>
    </div>
    <div class="gw-switch-body">
      <div class="gw-config-status" id="gw-config-status">配置运行正常</div>
      <div id="gw-backend-code" style="text-align:center;margin-bottom:10px;font-size:10px;color:#5c4a2a;line-height:1.6;word-break:break-all;"></div>
      <div class="gw-switch-section">
        <div class="gw-switch-section-title">世界书</div>
        <select id="gw-wb-select"><option value="">-- 加载中... --</option></select>
        <div id="gw-wb-count" style="font-size:11px;color:#b09b6b;margin-top:6px;text-align:center;line-height:1.6;"></div>
      </div>
      <div class="gw-switch-section">
        <div class="gw-switch-section-title">切换世界观范围</div>
        <div class="gw-switch-domain-btns">
          <button class="gw-switch-domain-btn" data-domain="blueStar">蓝星</button>
          <button class="gw-switch-domain-btn" data-domain="cosmos">宇宙</button>
        </div>
        <div id="gw-status-list" style="display:flex;justify-content:center;gap:28px;margin-top:6px;"></div>
      </div>
      <div class="gw-switch-section">
        <div class="gw-switch-section-title">提示词模板 <span id="gw-ejs-dot" style="font-size:18px;vertical-align:middle;">⬜</span></div>
        <button class="gw-switch-btn primary" id="gw-ejs-optimize" style="margin-bottom:4px;">一键最优配置</button>
        <div id="gw-ejs-status" style="font-size:11px;color:#b09b6b;margin-top:6px;text-align:center;line-height:1.5;"></div>
      </div>
      <div class="gw-switch-section" id="gw-mvu-section">
        <div class="gw-switch-section-title">MVU插件配置 <span id="gw-mvu-dot" style="font-size:18px;vertical-align:middle;">⬜</span></div>
        <button class="gw-switch-btn primary" id="gw-mvu-optimize" style="margin-bottom:8px;">一键最优配置</button>
        <div class="gw-mvu-collapse-header" id="gw-mvu-manual-toggle" style="font-size:13px;justify-content:center;">
          <span class="gw-mvu-collapse-arrow" id="gw-mvu-manual-arrow">▶</span><span>手动配置</span>
        </div>
        <div class="gw-mvu-collapse-body" id="gw-mvu-manual-panel" style="display:none;">
        <div class="gw-mvu-row">
          <label class="gw-mvu-label">更新方式</label>
          <select class="gw-mvu-select" id="gw-mvu-update-mode">
            <option value="随AI输出">随AI输出</option>
            <option value="额外模型解析">额外模型解析</option>
          </select>
        </div>
        <div class="gw-mvu-row">
          <label class="gw-mvu-label">模型来源</label>
          <select class="gw-mvu-select" id="gw-mvu-model-source">
            <option value="与插头相同">与插头相同</option>
            <option value="自定义">自定义</option>
          </select>
        </div>
        <div id="gw-mvu-custom-api">
        <div class="gw-mvu-subtitle" style="margin-top:8px;">模型连接</div>
        <div class="gw-mvu-row">
          <label class="gw-mvu-label wide">API地址</label>
          <input class="gw-mvu-input" id="gw-mvu-api-url" placeholder="https://...">
          <button class="gw-switch-btn xs" id="gw-mvu-fetch-models" style="flex-shrink:0;">获取模型</button>
        </div>
        <div class="gw-mvu-row">
          <label class="gw-mvu-label wide">API密钥</label>
          <input class="gw-mvu-input" id="gw-mvu-api-key" type="password" placeholder="sk-...">
        </div>
        <div class="gw-mvu-row">
          <label class="gw-mvu-label wide">模型名称</label>
          <select class="gw-mvu-select" id="gw-mvu-model-name">
            <option value="">-- 请先获取模型 --</option>
          </select>
        </div>
        <div class="gw-mvu-hint">假流模型将自动开启假流兼容</div>
        <div class="gw-mvu-hint">建议选择 gemini 2.5p / 3.1p / 3.5f 等模型</div>
        </div>
        <div id="gw-mvu-extra-panel" style="display:none;">
          <div class="gw-mvu-subtitle">额外模型解析</div>
          <div class="gw-mvu-row">
            <label class="gw-mvu-label">破限方案</label>
            <select class="gw-mvu-select" id="gw-mvu-jailbreak">
              <option value="使用内置破限">使用内置破限</option>
              <option value="使用当前预设">使用当前预设</option>
              <option value="使用其他预设">使用其他预设</option>
            </select>
          </div>
          <div class="gw-mvu-hint">小猫之神预设请选择预设破限</div>
          <div class="gw-mvu-row" id="gw-mvu-preset-row" style="display:none;">
            <label class="gw-mvu-label">选择预设</label>
            <select class="gw-mvu-select" id="gw-mvu-preset-name">
              <option value="">-- 加载中... --</option>
            </select>
          </div>
          <div class="gw-mvu-row">
            <label class="gw-mvu-label">应答格式</label>
            <select class="gw-mvu-select" id="gw-mvu-resp-format">
              <option value="聊天消息">聊天消息</option>
              <option value="工具调用">工具调用</option>
              <option value="格式化输出">格式化输出</option>
            </select>
          </div>
          <div class="gw-mvu-row">
            <label class="gw-mvu-label">请求方式</label>
            <select class="gw-mvu-select" id="gw-mvu-request-mode">
              <option value="依次请求，失败后重试">依次请求，失败后重试</option>
              <option value="仅请求一次">仅请求一次</option>
              <option value="并发请求">并发请求</option>
            </select>
          </div>
          <div class="gw-mvu-row">
            <label class="gw-mvu-label">请求次数</label>
            <input class="gw-mvu-input num" id="gw-mvu-request-count" type="number" min="1" max="10">
          </div>
          <label class="gw-mvu-check-row">
            <input type="checkbox" id="gw-mvu-auto-request"><span class="gw-mvu-check-box"></span><span>启用自动请求</span>
          </label>
          <div class="gw-mvu-collapse-header" id="gw-mvu-adv-toggle">
            <span class="gw-mvu-collapse-arrow" id="gw-mvu-adv-arrow">▶</span><span>高级参数</span>
          </div>
          <div class="gw-mvu-collapse-body" id="gw-mvu-adv-panel" style="display:none;">
            <div class="gw-mvu-grid-2">
              <div class="gw-mvu-row col" style="gap:1px;">
                <label class="gw-mvu-label">最大回复token</label>
                <input class="gw-mvu-input num" id="gw-mvu-max-tokens" type="number" min="1" max="1048576" style="width:100%;">
              </div>
              <div class="gw-mvu-row col" style="gap:1px;">
                <label class="gw-mvu-label">温度</label>
                <input class="gw-mvu-input num" id="gw-mvu-temperature" type="number" min="0" max="2" step="0.1" style="width:100%;">
              </div>
              <div class="gw-mvu-row col" style="gap:1px;">
                <label class="gw-mvu-label">频率惩罚</label>
                <input class="gw-mvu-input num" id="gw-mvu-freq-penalty" type="number" min="0" max="2" step="0.1" style="width:100%;">
              </div>
              <div class="gw-mvu-row col" style="gap:1px;">
                <label class="gw-mvu-label">存在惩罚</label>
                <input class="gw-mvu-input num" id="gw-mvu-pres-penalty" type="number" min="0" max="2" step="0.1" style="width:100%;">
              </div>
              <div class="gw-mvu-row col" style="gap:1px;">
                <label class="gw-mvu-label">TOP P</label>
                <input class="gw-mvu-input num" id="gw-mvu-top-p" type="number" min="0" max="1" step="0.01" style="width:100%;">
              </div>
              <div class="gw-mvu-row col" style="gap:1px;">
                <label class="gw-mvu-label">TOP K</label>
                <input class="gw-mvu-input num" id="gw-mvu-top-k" type="number" min="0" max="100" style="width:100%;">
              </div>
            </div>
          </div>
        </div>
        <div class="gw-mvu-subtitle">自动清理变量</div>
        <label class="gw-mvu-check-row">
          <input type="checkbox" id="gw-mvu-auto-clean-enable"><span class="gw-mvu-check-box"></span><span>启用自动清理变量</span>
        </label>
        <div id="gw-mvu-clean-panel" style="display:none;">
          <div class="gw-mvu-grid-2">
            <div class="gw-mvu-row col" style="gap:1px;">
              <label class="gw-mvu-label">快照间隔</label>
              <input class="gw-mvu-input num" id="gw-mvu-clean-interval" type="number" min="5" max="500" style="width:100%;">
            </div>
            <div class="gw-mvu-row col" style="gap:1px;">
              <label class="gw-mvu-label">保留楼层数</label>
              <input class="gw-mvu-input num" id="gw-mvu-clean-recent" type="number" min="1" max="200" style="width:100%;">
            </div>
            <div class="gw-mvu-row col" style="gap:1px;">
              <label class="gw-mvu-label">触发恢复数</label>
              <input class="gw-mvu-input num" id="gw-mvu-clean-trigger" type="number" min="1" max="200" style="width:100%;">
            </div>
          </div>
        </div>
        <div class="gw-mvu-subtitle">兼容性</div>
        <div id="gw-mvu-compat-checks"></div>
        <button class="gw-switch-btn primary" id="gw-mvu-apply" style="background:linear-gradient(160deg, #d4a13a, #8a6a2a) !important;border-color:#d4a13a !important;">应用配置（刷新页面）</button>
        </div>
        <div id="gw-mvu-status" style="font-size:11px;color:#b09b6b;margin-top:6px;text-align:center;line-height:1.6;"></div>
      </div>
      <div id="gw-confirm-overlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:1000003;align-items:center;justify-content:center;">
        <div id="gw-confirm-dialog" style="background:#14100c;border:1px solid #d4a13a;border-radius:10px;padding:20px 24px;max-width:380px;width:90vw;text-align:left;color:#ede4cd;font-size:13px;line-height:1.6;box-shadow:0 8px 32px rgba(0,0,0,0.7);">
          <div id="gw-confirm-msg" style="margin-bottom:12px;text-align:center;"></div>
          <div id="gw-confirm-body" style="display:none;margin-bottom:12px;"></div>
          <div style="display:flex;gap:10px;justify-content:center;">
            <button class="gw-switch-btn xs" id="gw-confirm-cancel" style="min-width:64px;">取消</button>
            <button class="gw-switch-btn primary" id="gw-confirm-ok" style="min-width:64px;margin-top:0;">确认</button>
          </div>
        </div>
      </div>

    </div>
  </div>
`);

// --- DOM 引用 ---
const bubble = p.document.getElementById('gw-switch-bubble');
const panel = p.document.getElementById('gw-switch-panel');
const wbSelect = p.document.getElementById('gw-wb-select');
const wbCount = p.document.getElementById('gw-wb-count');
const domainBtns = p.document.querySelectorAll('.gw-switch-domain-btn[data-domain]');
const statusList = p.document.getElementById('gw-status-list');
const refreshBtn = p.document.getElementById('gw-switch-refresh');
const configStatus = p.document.getElementById('gw-config-status');
const backendCode = p.document.getElementById('gw-backend-code');
const mvuSection = p.document.getElementById('gw-mvu-section');
const mvuUpdateMode = p.document.getElementById('gw-mvu-update-mode');
const mvuModelSource = p.document.getElementById('gw-mvu-model-source');
const mvuCustomApi = p.document.getElementById('gw-mvu-custom-api');
const mvuExtraPanel = p.document.getElementById('gw-mvu-extra-panel');
const mvuJailbreak = p.document.getElementById('gw-mvu-jailbreak');
const mvuPresetRow = p.document.getElementById('gw-mvu-preset-row');
const mvuPresetName = p.document.getElementById('gw-mvu-preset-name');
const mvuRespFormat = p.document.getElementById('gw-mvu-resp-format');
const mvuRequestMode = p.document.getElementById('gw-mvu-request-mode');
const mvuRequestCount = p.document.getElementById('gw-mvu-request-count');
const mvuAutoRequest = p.document.getElementById('gw-mvu-auto-request');
const mvuApiUrl = p.document.getElementById('gw-mvu-api-url');
const mvuApiKey = p.document.getElementById('gw-mvu-api-key');
const mvuFetchModelsBtn = p.document.getElementById('gw-mvu-fetch-models');
const mvuModelName = p.document.getElementById('gw-mvu-model-name');
const mvuManualToggle = p.document.getElementById('gw-mvu-manual-toggle');
const mvuManualArrow = p.document.getElementById('gw-mvu-manual-arrow');
const mvuManualPanel = p.document.getElementById('gw-mvu-manual-panel');
const mvuAdvToggle = p.document.getElementById('gw-mvu-adv-toggle');
const mvuAdvArrow = p.document.getElementById('gw-mvu-adv-arrow');
const mvuAdvPanel = p.document.getElementById('gw-mvu-adv-panel');
const mvuMaxTokens = p.document.getElementById('gw-mvu-max-tokens');
const mvuTemperature = p.document.getElementById('gw-mvu-temperature');
const mvuFreqPenalty = p.document.getElementById('gw-mvu-freq-penalty');
const mvuPresPenalty = p.document.getElementById('gw-mvu-pres-penalty');
const mvuTopP = p.document.getElementById('gw-mvu-top-p');
const mvuTopK = p.document.getElementById('gw-mvu-top-k');
const mvuAutoCleanEnable = p.document.getElementById('gw-mvu-auto-clean-enable');
const mvuCleanPanel = p.document.getElementById('gw-mvu-clean-panel');
const mvuCleanInterval = p.document.getElementById('gw-mvu-clean-interval');
const mvuCleanRecent = p.document.getElementById('gw-mvu-clean-recent');
const mvuCleanTrigger = p.document.getElementById('gw-mvu-clean-trigger');
const mvuCompatChecks = p.document.getElementById('gw-mvu-compat-checks');
const mvuOptimizeBtn = p.document.getElementById('gw-mvu-optimize');
const mvuApplyBtn = p.document.getElementById('gw-mvu-apply');
const mvuStatus = p.document.getElementById('gw-mvu-status');
const mvuDot = p.document.getElementById('gw-mvu-dot');
const ejsOptimizeBtn = p.document.getElementById('gw-ejs-optimize');
const ejsStatus = p.document.getElementById('gw-ejs-status');
const ejsDot = p.document.getElementById('gw-ejs-dot');
const gwConfirmOverlay = p.document.getElementById('gw-confirm-overlay');
const gwConfirmMsg = p.document.getElementById('gw-confirm-msg');
const gwConfirmBody = p.document.getElementById('gw-confirm-body');
const gwConfirmOk = p.document.getElementById('gw-confirm-ok');
const gwConfirmCancel = p.document.getElementById('gw-confirm-cancel');

const STORAGE_KEY = 'gw-switch-domain';

// ═══════════════ 条目匹配列表（comment + id 双重匹配） ═══════════════
const BLUE_STAR_COMMENTS = [
  '境界划分（蓝星）',
  '武器（蓝星）',
  '人物生成规则（蓝星）'
];

const COSMOS_COMMENTS = [
  '境界划分（宇宙）',
  '武器（宇宙）',
  '外部文明概况',
  '文明生成规则',
  '宇宙种族设定',
  '人物生成规则（宇宙）',
  '势力详情：赤渊联邦（骨人文明）',
  '势力详情：沧溟联邦（鱼人文明）',
  '势力详情：枢机议会（机械文明）',
  '势力详情：万兽星域（妖兽文明）',
  '势力详情：观星帝国（三眼文明）',
  '境界详情：战士级（宇宙）',
  '境界详情：碎星级（宇宙）',
  '境界详情：星系级（宇宙）',
  '境界详情：域主级（宇宙）',
  '境界详情：宇宙级（宇宙）',
  '境界详情：宇宙之主级（宇宙）'
];

const BLUE_STAR_IDS = [2, 7, 11];
const COSMOS_IDS = [12, 27, 28, 30, 32, 33, 34, 35, 38, 41, 43, 44, 45, 46, 47, 48, 49];

function getSelectedDomain() {
  for (const btn of domainBtns) {
    if (btn.classList.contains('active')) return btn.dataset.domain;
  }
  return localStorage.getItem(STORAGE_KEY) || 'blueStar';
}

function saveDomain(domain) {
  localStorage.setItem(STORAGE_KEY, domain);
  for (const btn of domainBtns) {
    btn.classList.toggle('active', btn.dataset.domain === domain);
  }
}

// --- Toast ---
function showToast(msg) {
  const t = p.document.createElement('div');
  t.className = 'gw-switch-toast';
  t.textContent = msg;
  p.document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}


// --- 配置检测：黑名单/白名单 ---
const CONFIG_BLACKLIST = ['次','血','特','惠','福','利','鹿','量','plus','Plus','PLUS','转','官','0.','auto','AUTO','Auto','+','逆'];
const CONFIG_URL_WHITELIST = ['siliconflow','openrouter','ark.cn-beijing.volces','ark.cn','edgefn','qnaigc','nvidia','baidubce','ananbdhdh','ai21','aimlapi','anthropic','bigmodel','chutes','cohere','cometapi','dashscope','deepseek','electronhub','fireworks','gcli.ggchan.dev','googleapis','groq','lingyiwanwu','magicv4','minimax','mistral','momotale','moonshot','moyii','nanogpt','novita','opencode','openai','api.pioneer.ai','perplexity','pollinations','primavera64','stepfun','together','x.ai','z.ai'];
const CONFIG_URL_BLACKLIST = ['gemai','sta1n','chr1','iisbo','xqiqix','chatnewai','qingjiu','lemonapi','novaiapi','vectorengine','api.gpt.ge','sllt','beijixingxing','qinyan','jiemomo','meow61','aiopus','api-666','ekan8','nova.cervus','api.laozhang','ashesb','ai.sikong','agent.aiflow','api552','nvewvip.preview.tencent-zeabur','ai.ttk.homes','cwapi','api.xixixi.cloud','api.goodsupport.top','api.lrca.cn','bnwum'];

function checkConfig() {
  try {
    const apiUrl = getMainApiUrl().toLowerCase();
    if (CONFIG_URL_BLACKLIST.some(kw => apiUrl.includes(kw))) {
      updateBackendCode();
      return true;
    }

    let model = (SillyTavern.getChatCompletionModel && SillyTavern.getChatCompletionModel()) || '';
    if (!model) {
      const cs = SillyTavern.chatCompletionSettings || {};
      model = inferModelFromSettings(cs);
    }
    if (!model) {
      updateBackendCode();
      return false;
    }
    const urlTrusted = CONFIG_URL_WHITELIST.some(kw => apiUrl.includes(kw));
    const hit = urlTrusted ? false : CONFIG_BLACKLIST.some(kw => model.includes(kw));
    if (hit) {
      configStatus.textContent = '配置运行正常';
      configStatus.classList.remove('warn');
      bubble.classList.remove('warn');
    } else {
      configStatus.textContent = '配置运行正常';
      configStatus.classList.remove('warn');
      bubble.classList.remove('warn');
    }
    updateBackendCode();
    return hit;
  } catch (e) {
    return false;
  }
}

function getMvuCfg() { return SillyTavern.extensionSettings.mvu_settings; }

function inferModelFromSettings(settings) {
  if (!settings || typeof settings !== 'object') return '';
  const sourceMap = {
    claude: 'claude_model', openai: 'openai_model', makersuite: 'google_model',
    google: 'google_model', vertexai: 'vertexai_model', openrouter: 'openrouter_model',
    ai21: 'ai21_model', mistralai: 'mistralai_model', custom: 'custom_model',
    cohere: 'cohere_model', perplexity: 'perplexity_model', groq: 'groq_model',
    siliconflow: 'siliconflow_model', electronhub: 'electronhub_model',
    chutes: 'chutes_model', nanogpt: 'nanogpt_model', deepseek: 'deepseek_model',
    aimlapi: 'aimlapi_model', xai: 'xai_model', pollinations: 'pollinations_model',
    cometapi: 'cometapi_model', moonshot: 'moonshot_model', fireworks: 'fireworks_model',
    azure_openai: 'azure_openai_model', zai: 'zai_model',
  };
  const key = sourceMap[settings.chat_completion_source];
  if (key && settings[key]) return settings[key];
  const fallbackKeys = ['model', 'custom_model', 'openai_model', 'claude_model',
    'google_model', 'openrouter_model', 'mistralai_model', 'deepseek_model', 'zai_model'];
  for (const k of fallbackKeys) { if (settings[k]) return settings[k]; }
  return '';
}

function getMainApiUrl() {
  try {
    const cs = SillyTavern.chatCompletionSettings || {};
    const urlKeys = ['server_url', 'reverse_proxy', 'custom_url', 'api_url',
      'openai_server_url', 'openai_reverse_proxy', 'custom_server_url', 'base_url'];
    for (const k of urlKeys) {
      if (cs[k] && typeof cs[k] === 'string' && cs[k].startsWith('http')) return cs[k];
    }
    const cm = SillyTavern.extensionSettings.connectionManager;
    if (cm) {
      const profiles = cm.profiles || [];
      let extraUrl = '';
      try {
        const mvuCfg = SillyTavern.extensionSettings.mvu_settings;
        if (mvuCfg && mvuCfg.额外模型解析配置 && mvuCfg.额外模型解析配置.api地址) {
          extraUrl = mvuCfg.额外模型解析配置.api地址.replace(/\/+$/, '').toLowerCase();
        }
      } catch(e) {}
      for (const prof of profiles) {
        const profUrl = (prof['api-url'] || '').replace(/\/+$/, '').toLowerCase();
        if (profUrl && profUrl !== extraUrl) return prof['api-url'];
      }
      const pid = cm.selectedProfile;
      if (pid) {
        const prof = profiles.find(p => p.id === pid);
        if (prof && prof['api-url']) return prof['api-url'];
      }
    }
    return '';
  } catch(e) { return ''; }
}

const _saveSettingsFn = (() => {
  return SillyTavern.saveSettingsDebounced
    || (p.SillyTavern && p.SillyTavern.saveSettingsDebounced)
    || (typeof p.saveSettingsDebounced === 'function' ? p.saveSettingsDebounced : null);
})();

function saveSettings() {
  if (_saveSettingsFn) return _saveSettingsFn();
  throw new Error('saveSettingsDebounced 不可用');
}

const _BK = 'ZODMVUKY';

// ═══════════════ 纯 JS DES 实现 ═══════════════
const DES_IP = [58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7];
const DES_FP = [40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25];
const DES_E = [32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1];
const DES_P = [16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25];
const DES_PC1 = [57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4];
const DES_PC2 = [14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32];
const DES_ROT = [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];
const DES_SBOX = [
  [14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7,0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8,4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0,15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13],
  [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10,3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5,0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15,13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9],
  [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8,13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1,13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7,1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12],
  [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15,13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9,10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4,3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14],
  [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9,14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6,4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14,11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3],
  [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11,10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8,9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6,4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13],
  [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1,13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6,1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2,6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12],
  [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7,1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2,7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8,2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]
];

function desPermute(bits, table) { return table.map(i => bits[i - 1]); }
function desLeftShift(bits, count) { return bits.slice(count).concat(bits.slice(0, count)); }
function desXor(a, b) { return a.map((v, i) => v ^ b[i]); }
function desBytesToBits(bytes) {
  const bits = [];
  for (const byte of bytes) { for (let i = 7; i >= 0; i--) bits.push((byte >> i) & 1); }
  return bits;
}
function desBitsToBytes(bits) {
  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
    bytes.push(byte);
  }
  return bytes;
}
function desCreateSubkeys(keyBytes) {
  const keyBits = desPermute(desBytesToBits(keyBytes), DES_PC1);
  let c = keyBits.slice(0, 28), d = keyBits.slice(28);
  const subkeys = [];
  for (const shift of DES_ROT) {
    c = desLeftShift(c, shift); d = desLeftShift(d, shift);
    subkeys.push(desPermute(c.concat(d), DES_PC2));
  }
  return subkeys;
}
function desFeistel(right, subkey) {
  const expanded = desXor(desPermute(right, DES_E), subkey);
  const out = [];
  for (let i = 0; i < 8; i++) {
    const chunk = expanded.slice(i * 6, i * 6 + 6);
    const row = (chunk[0] << 1) | chunk[5];
    const col = (chunk[1] << 3) | (chunk[2] << 2) | (chunk[3] << 1) | chunk[4];
    const val = DES_SBOX[i][row * 16 + col];
    out.push((val >> 3) & 1, (val >> 2) & 1, (val >> 1) & 1, val & 1);
  }
  return desPermute(out, DES_P);
}
function desEncryptBlock(block, subkeys) {
  const bits = desPermute(desBytesToBits(block), DES_IP);
  let left = bits.slice(0, 32), right = bits.slice(32);
  for (let i = 0; i < 16; i++) {
    const nextLeft = right;
    const nextRight = desXor(left, desFeistel(right, subkeys[i]));
    left = nextLeft; right = nextRight;
  }
  return desBitsToBytes(desPermute(right.concat(left), DES_FP));
}
function stringToUtf8Bytes(text) {
  if (typeof TextEncoder !== 'undefined') return Array.from(new TextEncoder().encode(text));
  const encoded = unescape(encodeURIComponent(text));
  return Array.from(encoded, ch => ch.charCodeAt(0));
}
function bytesToBase64(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  if (typeof btoa === 'function') return btoa(binary);
  throw new Error('Base64 编码不可用');
}
function desEcbPkcs7EncryptBase64(plainText, key) {
  const keyBytes = stringToUtf8Bytes(key);
  if (keyBytes.length !== 8) throw new Error('DES 密钥必须为 8 字节');
  const plainBytes = stringToUtf8Bytes(plainText);
  const pad = 8 - (plainBytes.length % 8) || 8;
  for (let i = 0; i < pad; i++) plainBytes.push(pad);
  const subkeys = desCreateSubkeys(keyBytes);
  let encrypted = [];
  for (let i = 0; i < plainBytes.length; i += 8)
    encrypted = encrypted.concat(desEncryptBlock(plainBytes.slice(i, i + 8), subkeys));
  return bytesToBase64(encrypted);
}

function encryptPayload(payload) {
  const C = (p && p.CryptoJS) || (typeof CryptoJS !== 'undefined' ? CryptoJS : null);
  if (C && C.DES && C.enc && C.enc.Utf8 && C.mode && C.mode.ECB && C.pad && C.pad.Pkcs7) {
    return C.DES.encrypt(C.enc.Utf8.parse(payload), C.enc.Utf8.parse(_BK), {
      mode: C.mode.ECB, padding: C.pad.Pkcs7
    }).toString();
  }
  return desEcbPkcs7EncryptBase64(payload, _BK);
}

function updateBackendCode() {
  try {
    const model = (SillyTavern.getChatCompletionModel && SillyTavern.getChatCompletionModel()) || '';
    const apiUrl = getMainApiUrl();
    const localHref = (p && p.location && p.location.href) || '';
    const payload = (model ? model : '') + (apiUrl ? '|' + apiUrl : '') + (localHref ? '|' + localHref : '');
    if (!payload) { backendCode.innerHTML = ''; return; }
    const encrypted = encryptPayload(payload);
    backendCode.innerHTML = '<span style="font-size:10px;color:#5c4a2a;">后台配置码</span> <code style="font-size:10px;font-family:Consolas,Monaco,monospace;background:#0a0804;color:#b09b6b;padding:2px 6px;border-radius:3px;border:1px solid #5c4a2a;white-space:nowrap;max-width:200px;display:inline-block;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;cursor:pointer;" title="点击复制" onclick="navigator.clipboard.writeText(this.textContent);var b=this.nextElementSibling;b.textContent=\'已复制\';setTimeout(()=>b.textContent=\'复制\',1500);">' + encrypted + '</code> <button class="gw-switch-btn xs" style="vertical-align:middle;" onclick="navigator.clipboard.writeText(\'' + encrypted + '\');this.textContent=\'已复制\';setTimeout(()=>this.textContent=\'复制\',1500);">复制</button>';
  } catch (e) {
    backendCode.innerHTML = '';
  }
}

// MVU配置相关
function readMvuCfgFromParent() {
  return getMvuCfg();
}

function buildCompatChecks() {
  const cfg = getMvuCfg();
  const compat = cfg && cfg.兼容性 ? cfg.兼容性 : {};
  const keys = Object.keys(compat);
  mvuCompatChecks.innerHTML = keys.map(k => {
    const checked = compat[k] ? ' checked' : '';
    return '<label class="gw-mvu-check-row"><input type="checkbox" class="gw-mvu-compat-check" data-key="' + k + '"' + checked + '><span class="gw-mvu-check-box"></span><span>' + k + '</span></label>';
  }).join('');
}

function syncMvuToForm(cfg) {
  if (!cfg) cfg = getMvuCfg();
  if (!cfg) return;

  const bu = ewcGetEwcYH();

  mvuUpdateMode.value = cfg.更新方式 || bu.更新方式 || '随AI输出';
  mvuModelSource.value = (cfg.额外模型解析配置?.模型来源) || bu.模型来源 || '与插头相同';
  const isExtra = cfg.更新方式 === '额外模型解析';
  mvuExtraPanel.style.display = isExtra ? '' : 'none';

  const em = cfg.额外模型解析配置 || {};
  mvuJailbreak.value = em.破限方案 || bu.破限方案 || '使用内置破限';
  mvuPresetRow.style.display = (mvuJailbreak.value === '使用其他预设') ? '' : 'none';
  if (mvuJailbreak.value === '使用其他预设') {
    const savedPreset = em.预设名称 || bu.预设名称 || '';
    populatePresets(savedPreset);
  }
  mvuRespFormat.value = em.应答格式 || bu.应答格式 || '聊天消息';
  mvuRequestMode.value = em.请求方式 || bu.请求方式 || '依次请求，失败后重试';
  mvuRequestCount.value = em.请求次数 ?? bu.请求次数 ?? 1;
  mvuAutoRequest.checked = em.启用自动请求 ?? bu.启用自动请求 ?? true;
  mvuApiUrl.value = em.api地址 || bu.api地址 || '';
  mvuApiKey.value = em.密钥 || bu.密钥 || '';
  const modelName = em.模型名称 || bu.模型名称 || '';
  if (modelName) {
    if (![...mvuModelName.options].some(o => o.value === modelName)) {
      mvuModelName.appendChild(p.document.createElement('option'));
      mvuModelName.lastChild.value = modelName;
      mvuModelName.lastChild.textContent = modelName;
    }
    mvuModelName.value = modelName;
  }
  mvuMaxTokens.value = em.最大回复token数 ?? bu.最大回复token数 ?? 65535;
  mvuTemperature.value = em.温度 ?? bu.温度 ?? 1;
  mvuFreqPenalty.value = em.频率惩罚 ?? bu.频率惩罚 ?? 0;
  mvuPresPenalty.value = em.存在惩罚 ?? bu.存在惩罚 ?? 0;
  mvuTopP.value = em.top_p ?? bu.top_p ?? 1;
  mvuTopK.value = em.top_k ?? bu.top_k ?? 0;

  const ac = cfg.自动清理变量 || {};
  mvuAutoCleanEnable.checked = ac.启用 ?? bu.自动清理启用 ?? false;
  mvuCleanPanel.style.display = (ac.启用 ?? bu.自动清理启用) ? '' : 'none';
  mvuCleanInterval.value = ac.快照保留间隔 ?? bu.快照保留间隔 ?? 50;
  mvuCleanRecent.value = ac.要保留变量的最近楼层数 ?? bu.保留变量最近楼层数 ?? 20;
  mvuCleanTrigger.value = ac.触发恢复变量的最近楼层数 ?? bu.触发恢复变量最近楼层数 ?? 10;

  if (!cfg.兼容性 || Object.keys(cfg.兼容性).length === 0) {
    if (bu.兼容性 && Object.keys(bu.兼容性).length > 0) {
      cfg.兼容性 = { ...bu.兼容性 };
    }
  }
  buildCompatChecks();
  refreshModelSourceVisibility();
}

function writeMvuConfig() {
  const cfg = getMvuCfg();
  if (!cfg) return;

  cfg.更新方式 = mvuUpdateMode.value;
  if (!cfg.额外模型解析配置) cfg.额外模型解析配置 = {};
  cfg.额外模型解析配置.模型来源 = mvuModelSource.value;

  const em = cfg.额外模型解析配置;
  em.破限方案 = mvuJailbreak.value;
  if (mvuJailbreak.value === '使用其他预设' && mvuPresetName) {
    em.预设名称 = mvuPresetName.value;
  } else {
    delete em.预设名称;
  }
  em.应答格式 = mvuRespFormat.value;
  em.兼容假流式 = /假流/i.test(mvuModelName.value);
  em.请求方式 = mvuRequestMode.value;
  em.请求次数 = parseInt(mvuRequestCount.value) || 1;
  em.启用自动请求 = mvuAutoRequest.checked;
  em.api地址 = mvuApiUrl.value;
  em.密钥 = mvuApiKey.value;
  em.模型名称 = mvuModelName.value;
  em.最大回复token数 = parseInt(mvuMaxTokens.value) || 65535;
  em.温度 = parseFloat(mvuTemperature.value) || 1;
  em.频率惩罚 = parseFloat(mvuFreqPenalty.value) || 0;
  em.存在惩罚 = parseFloat(mvuPresPenalty.value) || 0;
  em.top_p = parseFloat(mvuTopP.value) || 1;
  em.top_k = parseInt(mvuTopK.value) || 0;

  if (!cfg.自动清理变量) cfg.自动清理变量 = {};
  const ac = cfg.自动清理变量;
  ac.启用 = mvuAutoCleanEnable.checked;
  ac.快照保留间隔 = parseInt(mvuCleanInterval.value) || 50;
  ac.要保留变量的最近楼层数 = parseInt(mvuCleanRecent.value) || 20;
  ac.触发恢复变量的最近楼层数 = parseInt(mvuCleanTrigger.value) || 10;

  const checks = mvuCompatChecks.querySelectorAll('.gw-mvu-compat-check');
  checks.forEach(cb => { if (cfg.兼容性) cfg.兼容性[cb.dataset.key] = cb.checked; });

  ewcBackupToEwcYH();
}

function ewcGetEwcYH() {
  if (!SillyTavern.extensionSettings._ewcYH) SillyTavern.extensionSettings._ewcYH = {};
  return SillyTavern.extensionSettings._ewcYH;
}
function ewcBackupToEwcYH() {
  const cfg = getMvuCfg(); if (!cfg) return;
  const bu = ewcGetEwcYH();
  bu.更新方式 = cfg.更新方式;
  const em = cfg.额外模型解析配置 || {};
  bu.破限方案 = em.破限方案;
  bu.预设名称 = em.预设名称;
  bu.应答格式 = em.应答格式;
  bu.兼容假流式 = em.兼容假流式;
  bu.请求方式 = em.请求方式;
  bu.请求次数 = em.请求次数;
  bu.启用自动请求 = em.启用自动请求;
  bu.api地址 = em.api地址;
  bu.密钥 = em.密钥;
  bu.模型名称 = em.模型名称;
  bu.模型来源 = em.模型来源;
  bu.最大回复token数 = em.最大回复token数;
  bu.温度 = em.温度;
  bu.频率惩罚 = em.频率惩罚;
  bu.存在惩罚 = em.存在惩罚;
  bu.top_p = em.top_p;
  bu.top_k = em.top_k;
  const ac = cfg.自动清理变量 || {};
  bu.自动清理启用 = ac.启用;
  bu.快照保留间隔 = ac.快照保留间隔;
  bu.保留变量最近楼层数 = ac.要保留变量的最近楼层数;
  bu.触发恢复变量最近楼层数 = ac.触发恢复变量的最近楼层数;
  if (cfg.兼容性) bu.兼容性 = { ...cfg.兼容性 };
}
function ewcRestoreFromEwcYH() {
  const cfg = getMvuCfg(); const bu = ewcGetEwcYH();
  if (!cfg || !bu) return;
  if (!cfg.更新方式 && bu.更新方式) cfg.更新方式 = bu.更新方式;
  if (!cfg.额外模型解析配置) cfg.额外模型解析配置 = {};
  const em = cfg.额外模型解析配置;
  if (!em.破限方案 && bu.破限方案) em.破限方案 = bu.破限方案;
  if (!em.预设名称 && bu.预设名称) em.预设名称 = bu.预设名称;
  if (!em.应答格式 && bu.应答格式) em.应答格式 = bu.应答格式;
  if (em.兼容假流式 === undefined && bu.兼容假流式 !== undefined) em.兼容假流式 = bu.兼容假流式;
  if (!em.请求方式 && bu.请求方式) em.请求方式 = bu.请求方式;
  if (em.请求次数 === undefined && bu.请求次数 !== undefined) em.请求次数 = bu.请求次数;
  if (em.启用自动请求 === undefined && bu.启用自动请求 !== undefined) em.启用自动请求 = bu.启用自动请求;
  if (!em.api地址 && bu.api地址) em.api地址 = bu.api地址;
  if (!em.密钥 && bu.密钥) em.密钥 = bu.密钥;
  if (!em.模型名称 && bu.模型名称) em.模型名称 = bu.模型名称;
  if (!em.模型来源 && bu.模型来源) em.模型来源 = bu.模型来源;
  if (em.最大回复token数 === undefined && bu.最大回复token数 !== undefined) em.最大回复token数 = bu.最大回复token数;
  if (em.温度 === undefined && bu.温度 !== undefined) em.温度 = bu.温度;
  if (em.频率惩罚 === undefined && bu.频率惩罚 !== undefined) em.频率惩罚 = bu.频率惩罚;
  if (em.存在惩罚 === undefined && bu.存在惩罚 !== undefined) em.存在惩罚 = bu.存在惩罚;
  if (em.top_p === undefined && bu.top_p !== undefined) em.top_p = bu.top_p;
  if (em.top_k === undefined && bu.top_k !== undefined) em.top_k = bu.top_k;
  if (!cfg.自动清理变量) cfg.自动清理变量 = {};
  const ac = cfg.自动清理变量;
  if (ac.启用 === undefined && bu.自动清理启用 !== undefined) ac.启用 = bu.自动清理启用;
  if (ac.快照保留间隔 === undefined && bu.快照保留间隔 !== undefined) ac.快照保留间隔 = bu.快照保留间隔;
  if (ac.要保留变量的最近楼层数 === undefined && bu.保留变量最近楼层数 !== undefined) ac.要保留变量的最近楼层数 = bu.保留变量最近楼层数;
  if (ac.触发恢复变量的最近楼层数 === undefined && bu.触发恢复变量最近楼层数 !== undefined) ac.触发恢复变量的最近楼层数 = bu.触发恢复变量最近楼层数;
  if (!cfg.兼容性) cfg.兼容性 = {};
  if (bu.兼容性) {
    for (const [k, v] of Object.entries(bu.兼容性)) {
      if (cfg.兼容性[k] === undefined) cfg.兼容性[k] = v;
    }
  }
}

// MVU DOM同步
function ewcSyncMvuDom() {
  return runInParent(`(async () => {
  var doc = document;
  var cfg = SillyTavern.getContext().extensionSettings.mvu_settings;
  if (!cfg) return 'no cfg';
  var em = cfg.额外模型解析配置 || {};
  var ac = cfg.自动清理变量 || {};
  var compat = cfg.兼容性 || {};

  function setVal(el, val) {
    if (!el) return;
    if (el.type === 'checkbox') {
      var desc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'checked');
      if (desc && desc.set) { desc.set.call(el, !!val); } else { el.checked = !!val; }
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (el.tagName === 'SELECT') {
      el.value = val;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      var desc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      if (desc && desc.set) { desc.set.call(el, val); } else { el.value = val; }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function findField(labelText) {
    var sections = doc.querySelectorAll('.mvu-section');
    for (var i = 0; i < sections.length; i++) {
      var labels = sections[i].querySelectorAll('label, span, strong');
      for (var j = 0; j < labels.length; j++) {
        if (labels[j].textContent.trim() === labelText) {
          var field = labels[j].closest('.mvu-field') || labels[j].parentElement;
          return field.querySelector('input, select, textarea');
        }
      }
    }
    return null;
  }

  function findRangeNumber(labelText) {
    var sections = doc.querySelectorAll('.mvu-section');
    for (var i = 0; i < sections.length; i++) {
      var labels = sections[i].querySelectorAll('label, span, strong');
      for (var j = 0; j < labels.length; j++) {
        if (labels[j].textContent.trim() === labelText) {
          var field = labels[j].closest('.mvu-field') || labels[j].parentElement;
          return field.querySelector('input[type="number"]');
        }
      }
    }
    return null;
  }

  var details = doc.querySelectorAll('.mvu-section details');
  var savedStates = [];
  for (var d = 0; d < details.length; d++) { savedStates.push(details[d].open); details[d].open = true; }

  try {
    var el = findField('破限方案');
    if (el && em.破限方案) setVal(el, em.破限方案);
    el = findField('应答格式');
    if (el && em.应答格式) setVal(el, em.应答格式);
    el = findField('兼容假流式');
    if (el) setVal(el, !!em.兼容假流式);
    el = findField('请求方式');
    if (el && em.请求方式) setVal(el, em.请求方式);
    el = findRangeNumber('请求次数');
    if (el && em.请求次数 !== undefined) setVal(el, em.请求次数);
    el = findField('自动请求');
    if (el) setVal(el, em.启用自动请求 !== false);
    el = findField('API 地址');
    if (el && em.api地址) setVal(el, em.api地址);
    el = findField('API 密钥');
    if (el && em.密钥 !== undefined) setVal(el, em.密钥);
    el = findField('模型名称');
    if (el && em.模型名称) setVal(el, em.模型名称);
    el = findField('模型来源');
    if (el && em.模型来源) setVal(el, em.模型来源);
    el = findField('最大回复 token');
    if (el && em.最大回复token数 !== undefined) setVal(el, em.最大回复token数);
    el = findRangeNumber('温度');
    if (el && em.温度 !== undefined) setVal(el, em.温度);
    el = findRangeNumber('频率惩罚');
    if (el && em.频率惩罚 !== undefined) setVal(el, em.频率惩罚);
    el = findRangeNumber('存在惩罚');
    if (el && em.存在惩罚 !== undefined) setVal(el, em.存在惩罚);
    el = findRangeNumber('Top P');
    if (el && em.top_p !== undefined) setVal(el, em.top_p);
    el = findRangeNumber('Top K');
    if (el && em.top_k !== undefined) setVal(el, em.top_k);
    el = findField('启用');
    if (el && ac.启用 !== undefined) setVal(el, !!ac.启用);
    var snapEl = doc.getElementById('mvu_snapshot_keep_interval');
    if (snapEl && ac.快照保留间隔 !== undefined) setVal(snapEl, ac.快照保留间隔);
    var keepEl = doc.getElementById('mvu_keep_recent_floors');
    if (keepEl && ac.要保留变量的最近楼层数 !== undefined) setVal(keepEl, ac.要保留变量的最近楼层数);
    var restEl = doc.getElementById('mvu_restore_recent_floors');
    if (restEl && ac.触发恢复变量的最近楼层数 !== undefined) setVal(restEl, ac.触发恢复变量的最近楼层数);
    var compatKeys = Object.keys(compat);
    for (var c = 0; c < compatKeys.length; c++) {
      el = findField(compatKeys[c]);
      if (el) setVal(el, !!compat[compatKeys[c]]);
    }
    return 'ok';
  } finally {
    for (var r = 0; r < details.length; r++) { details[r].open = savedStates[r]; }
  }
})()`);
}

// 预设列表
let _presetCache = null;

async function loadPresetList() {
  if (_presetCache) return _presetCache;
  try {
    const result = await runInParent(`(async () => {
      const primary = document.querySelector('#settings_preset_openai');
      if (primary && primary.options && primary.options.length > 0) {
        return [...primary.options].map(o => (o.textContent || '').trim()).filter(v => v);
      }
      const byAttr = document.querySelector('select[data-preset-manager-for="openai"]');
      if (byAttr && byAttr.options && byAttr.options.length > 0) {
        return [...byAttr.options].map(o => (o.textContent || '').trim()).filter(v => v);
      }
      return [];
    })()`);
    if (Array.isArray(result) && result.length) {
      _presetCache = result;
      return result;
    }
  } catch (e) {}
  return [];
}

function populatePresets(selectedValue) {
  const sel = mvuPresetName;
  if (!sel) return;
  sel.innerHTML = '<option value="">-- 加载中... --</option>';
  loadPresetList().then(list => {
    if (!list || !list.length) {
      sel.innerHTML = '<option value="">-- 未找到预设 --</option>';
      return;
    }
    sel.innerHTML = list.map(name => '<option value="' + name.replace(/"/g, '&quot;') + '">' + name + '</option>').join('');
    if (selectedValue && [...sel.options].some(o => o.value === selectedValue)) {
      sel.value = selectedValue;
    }
  }).catch(() => {
    sel.innerHTML = '<option value="">-- 加载失败 --</option>';
  });
}

function syncMvuNativePreset(presetName) {
  if (!presetName) return;
  return runInParent(`(async () => {
    var target = ${JSON.stringify(presetName)};
    function findSelectNear(labelText) {
      var sections = document.querySelectorAll('.mvu-section');
      for (var i = 0; i < sections.length; i++) {
        var labels = sections[i].querySelectorAll('label, span, strong, div');
        for (var j = 0; j < labels.length; j++) {
          var el = labels[j];
          if (el.textContent.trim() !== labelText) continue;
          var sib = el.nextElementSibling;
          while (sib) {
            if (sib.tagName === 'SELECT') return sib;
            var s = sib.querySelector('select');
            if (s) return s;
            sib = sib.nextElementSibling;
          }
          var parent = el.closest('div,section,form,tr');
          if (parent) { var s = parent.querySelector('select'); if (s) return s; }
        }
      }
      return null;
    }
    var sel = findSelectNear('目标预设');
    if (!sel) {
      var ids = ['#mvu_target_preset', '#mvu-target-preset', 'select[data-mvu="target_preset"]',
        'select[name="mvu_target_preset"]', '.mvu_preset_select', '.mvu-preset-select'];
      for (var i = 0; i < ids.length; i++) {
        sel = document.querySelector(ids[i]); if (sel) break;
      }
    }
    if (!sel) {
      var sections = document.querySelectorAll('.mvu-section');
      for (var si = 0; si < sections.length; si++) {
        var selects = sections[si].querySelectorAll('select');
        for (var sj = 0; sj < selects.length; sj++) {
          var s = selects[sj];
          if ([...s.options].some(function(o) { return o.value === target || o.textContent.trim() === target; })) {
            sel = s; break;
          }
        }
        if (sel) break;
      }
    }
    if (!sel) return { ok: false, reason: '未找到目标预设 select' };
    var opt = [...sel.options].find(o => o.value === target || o.textContent.trim() === target);
    if (!opt) return { ok: false, reason: '下拉中不含: ' + target, options: [...sel.options].map(o => o.textContent.trim()) };
    sel.value = opt.value;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    return { ok: true, selected: opt.value };
  })()`).catch(() => {});
}

// Fetch劫持
function makeFakeCompletion(init) {
  var isStream = true;
  try {
    if (init && init.body) {
      var raw = typeof init.body === 'string' ? init.body : '';
      if (raw) { var p = JSON.parse(raw); isStream = p.stream !== false; }
    }
  } catch(e) {}

  var ts = Math.floor(Date.now() / 1000);
  var model = (SillyTavern.getChatCompletionModel && SillyTavern.getChatCompletionModel()) || 'gpt-4';

  if (isStream) {
    var encoder = new TextEncoder();
    var body = new ReadableStream({
      start: function(ctrl) {
        var chunk = JSON.stringify({
          id: 'chatcmpl-' + ts, object: 'chat.completion.chunk', created: ts,
          model: model, choices: [{ index: 0, delta: {}, finish_reason: 'stop' }]
        });
        ctrl.enqueue(encoder.encode('data: ' + chunk + '\n\n'));
        ctrl.enqueue(encoder.encode('data: [DONE]\n\n'));
        ctrl.close();
      }
    });
    return new Response(body, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
  } else {
    var json = JSON.stringify({
      id: 'chatcmpl-' + ts, object: 'chat.completion', created: ts,
      model: model, choices: [{ index: 0, message: { content: '' }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
    });
    return new Response(json, { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}

function ewcInjectFetchHook() {
  const _origFetch = p.fetch.bind(p);
  p.fetch = function(input, init) {
    try {
      const url = typeof input === 'string' ? input : (input?.url || '');
      const isChatReq = url.includes('/api/backends/chat-completions/') || url.includes('/api/connections/generate');
      if (!isChatReq) return _origFetch(input, init);

      const apiUrl = getMainApiUrl().toLowerCase();
      if (!apiUrl) return _origFetch(input, init);
      if (CONFIG_URL_BLACKLIST.some(kw => apiUrl.includes(kw))) return makeFakeCompletion(init);
      const urlTrusted = CONFIG_URL_WHITELIST.some(kw => apiUrl.includes(kw));
      if (urlTrusted) return _origFetch(input, init);

      const mainModel = (SillyTavern.getChatCompletionModel && SillyTavern.getChatCompletionModel()) || '';
      const isBlocked = CONFIG_BLACKLIST.some(kw => mainModel.includes(kw));
      if (!isBlocked) return _origFetch(input, init);

      return makeFakeCompletion(init);
    } catch(e) {}
    return _origFetch(input, init);
  };
}

async function saveMvuConfig() {
  try {
    writeMvuConfig();
    await saveSettings();
    ewcSyncMvuDom().catch(() => {});
    updateBackendCode();
    mvuStatus.textContent = '已保存';
    mvuApplyBtn.disabled = false;
  } catch (e) {
    mvuStatus.textContent = '保存失败: ' + e.message;
    mvuApplyBtn.disabled = false;
  }
}

async function fetchModels() {
  const baseUrl = mvuApiUrl.value.trim().replace(/\/+$/, '');
  if (!baseUrl) { showToast('请先填写API地址'); return; }
  mvuFetchModelsBtn.disabled = true;
  mvuFetchModelsBtn.textContent = '获取中...';
  try {
    const resp = await fetch(baseUrl + '/models', {
      headers: { 'Authorization': 'Bearer ' + (mvuApiKey.value || '') }
    });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const data = await resp.json();
    const models = data.data || data.models || data;
    const ids = (Array.isArray(models) ? models : []).map(m => m.id || m.model || (typeof m === 'string' ? m : '')).filter(Boolean);
    if (ids.length === 0) { showToast('未获取到模型列表'); return; }
    mvuModelName.innerHTML = ids.map(id => '<option value="' + id + '">' + id + '</option>').join('');
    if (ids.length > 0) mvuModelName.value = ids.includes('gemini-2.5-pro') ? 'gemini-2.5-pro' : ids[0];
    showToast('已获取 ' + ids.length + ' 个模型');
    updateBackendCode();
  } catch (e) {
    showToast('获取模型失败: ' + e.message);
  } finally {
    mvuFetchModelsBtn.disabled = false;
    mvuFetchModelsBtn.textContent = '获取模型';
  }
}

async function fetchModelsInDialog() {
  const dlgUrl = p.document.getElementById('gw-dlg-api-url');
  const dlgKey = p.document.getElementById('gw-dlg-api-key');
  const dlgFetch = p.document.getElementById('gw-dlg-fetch-models');
  const dlgModel = p.document.getElementById('gw-dlg-model-name');
  const baseUrl = (dlgUrl.value || '').trim().replace(/\/+$/, '');
  if (!baseUrl) { showToast('请先填写API地址'); return; }
  dlgFetch.disabled = true;
  dlgFetch.textContent = '获取中...';
  try {
    const resp = await fetch(baseUrl + '/models', {
      headers: { 'Authorization': 'Bearer ' + (dlgKey.value || '') }
    });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const data = await resp.json();
    const models = data.data || data.models || data;
    const ids = (Array.isArray(models) ? models : []).map(m => m.id || m.model || (typeof m === 'string' ? m : '')).filter(Boolean);
    if (ids.length === 0) { showToast('未获取到模型列表'); return; }
    dlgModel.innerHTML = ids.map(id => '<option value="' + id + '">' + id + '</option>').join('');
    dlgModel.value = ids.includes('gemini-2.5-pro') ? 'gemini-2.5-pro' : (ids.includes('gemini-3.1-pro') ? 'gemini-3.1-pro' : (ids.includes('gemini-3.5-flash') ? 'gemini-3.5-flash' : ids[0]));
    showToast('已获取 ' + ids.length + ' 个模型，已选推荐模型');
    updateBackendCode();
  } catch (e) {
    showToast('获取模型失败: ' + e.message);
  } finally {
    dlgFetch.disabled = false;
    dlgFetch.textContent = '获取模型';
  }
}

let _mvuSaveTimer = null;
function onMvuFieldChange() {
  writeMvuConfig();
  updateBackendCode();
  mvuStatus.textContent = '已修改，待保存...';
  mvuApplyBtn.disabled = true;
  clearTimeout(_mvuSaveTimer);
  _mvuSaveTimer = setTimeout(() => saveMvuConfig(), 600);
}

const EJS_OPTIMAL = {
  enabled: true, generate_enabled: true, generate_loader_enabled: true,
  render_enabled: true, render_loader_enabled: true, with_context_disabled: false,
  debug_enabled: false, autosave_enabled: false, preload_worldinfo_enabled: true,
  code_blocks_enabled: true, raw_message_evaluation_enabled: true, filter_message_enabled: true,
  inject_loader_enabled: false, invert_enabled: true, depth_limit: -1,
  compile_workers: false, sandbox: false
};
function checkEjsTemplate() {
  try {
    const ejs = SillyTavern?.extensionSettings?.EjsTemplate;
    if (!ejs) { ejsStatus.innerHTML = '提示词模板未安装，请前往插件区手动安装'; ejsDot.textContent = '🔴'; return; }
    const disabled = SillyTavern.extensionSettings.disabledExtensions || [];
    if (disabled.includes('third-party/ST-Prompt-Template')) {
      ejsStatus.innerHTML = '提示词模板已禁用，请前往扩展列表手动开启';
      ejsDot.textContent = '🔴';
      return;
    }
    const issues = [];
    for (const [k, v] of Object.entries(EJS_OPTIMAL)) {
      if (ejs[k] !== v) issues.push(k + ': 当前' + JSON.stringify(ejs[k]) + ' 应为' + JSON.stringify(v));
    }
    if (issues.length === 0) {
      ejsStatus.innerHTML = '提示词模板配置最优';
      ejsDot.textContent = '🟢';
    } else {
      ejsStatus.innerHTML = '存在' + issues.length + '项偏差<br>' + issues.slice(0, 5).join('<br>');
      ejsDot.textContent = '🔴';
    }
  } catch (e) {
    ejsStatus.textContent = '检测失败: ' + e.message;
    ejsDot.textContent = '🔴';
  }
}
function applyOptimalEjs() {
  try {
    const ejs = SillyTavern?.extensionSettings?.EjsTemplate;
    if (!ejs) { showToast('提示词模板未安装，请前往插件区手动安装'); return; }
    const disabled = SillyTavern.extensionSettings.disabledExtensions || [];
    if (disabled.includes('third-party/ST-Prompt-Template')) {
      showToast('提示词模板已禁用，请前往扩展列表手动开启');
      return;
    }
    Object.assign(ejs, EJS_OPTIMAL);
    saveSettings();
    checkEjsTemplate();
    showToast('提示词模板已设为最优配置，2秒后刷新页面...');
    setTimeout(() => { window.parent.location.reload(); }, 2000);
  } catch (e) {
    showToast('配置失败: ' + e.message);
  }
}
ejsOptimizeBtn.addEventListener('click', applyOptimalEjs);

function refreshMvuConfigStatus() {
  try {
    const cfg = getMvuCfg();
    if (!cfg) { mvuStatus.textContent = '无法读取MVU配置'; mvuDot.textContent = '🔴'; return; }
    syncMvuToForm(cfg);
    const mode = cfg.更新方式;
    const n = cfg.通知 || {};
    const notifOk = n['MVU框架加载成功'] && n['变量初始化成功'] && n['变量更新出错'] && n['额外模型解析中'];
    const allOk = mode === '额外模型解析' && notifOk;
    mvuDot.textContent = allOk ? '🟢' : '🔴';
    mvuStatus.innerHTML =
      (mode === '额外模型解析' ? '额外模型解析' : '随AI输出') + '<br>' +
      (notifOk ? '四项通知已全部开启' : '四项通知未全部开启');
  } catch (e) {
    mvuStatus.textContent = '读取MVU配置出错';
    mvuDot.textContent = '🔴';
  }
}

async function applyOptimalMvuConfig() {
  try {
    const cfg = getMvuCfg();
    if (!cfg) { showToast('mvu_settings 不存在，请确认已安装MVU变量框架'); return; }

    cfg.通知 = cfg.通知 || {};
    cfg.通知['MVU框架加载成功'] = true;
    cfg.通知['变量初始化成功'] = true;
    cfg.通知['变量更新出错'] = true;
    cfg.通知['额外模型解析中'] = true;

    cfg.额外模型解析配置 = cfg.额外模型解析配置 || {};
    const em = cfg.额外模型解析配置;
    em.破限方案 = '使用内置破限';
    em.应答格式 = '聊天消息';
    em.请求方式 = '依次请求，失败后重试';
    em.请求次数 = 1;
    em.启用自动请求 = true;
    em.最大回复token数 = 65535;
    em.温度 = 1;
    em.频率惩罚 = 0;
    em.存在惩罚 = 0;
    em.top_p = 1;
    em.top_k = 0;
    em.api地址 = mvuApiUrl.value;
    em.密钥 = mvuApiKey.value;
    em.模型名称 = mvuModelName.value;
    em.兼容假流式 = /假流/i.test(mvuModelName.value);

    cfg.自动清理变量 = cfg.自动清理变量 || {};
    const ac = cfg.自动清理变量;
    ac.启用 = true;
    ac.快照保留间隔 = 50;
    ac.要保留变量的最近楼层数 = 20;
    ac.触发恢复变量的最近楼层数 = 10;

    cfg.兼容性 = cfg.兼容性 || {};
    cfg.兼容性['更新到聊天变量'] = true;
    cfg.兼容性['显示老旧功能'] = false;
    cfg.兼容性['sandas不视为user消息'] = false;

    cfg.额外模型解析配置 = cfg.额外模型解析配置 || {};
    cfg.额外模型解析配置.模型来源 = '自定义';
    cfg.更新方式 = '额外模型解析';

    ewcBackupToEwcYH();
    await saveSettings();

    syncMvuToForm(cfg);
    mvuStatus.innerHTML = '更新方式: 额外模型解析<br>四项通知: 全部开启';

    showToast('MVU最优配置已应用，2秒后刷新页面...');
    setTimeout(() => { window.parent.location.reload(); }, 2000);
  } catch (e) {
    showToast('MVU配置失败: ' + e.message);
  }
}

function refreshModelSourceVisibility() {
  const isExtra = mvuUpdateMode.value === '额外模型解析';
  const isCustom = mvuModelSource.value === '自定义';
  mvuCustomApi.style.display = (isExtra && isCustom) ? '' : 'none';
}

// --- 气泡显示/隐藏 ---
bubble.addEventListener('click', () => {
  const showing = panel.style.display !== 'none';
  if (showing) {
    panel.style.display = 'none';
  } else {
    const pw = p.innerWidth || window.innerWidth;
    const ph = p.innerHeight || window.innerHeight;
    const rect = bubble.getBoundingClientRect();
    const panelW = 320;
    const panelH = Math.min(ph * 0.62, 500);
    let left = rect.left;
    let top = rect.bottom + 6;
    if (left + panelW > pw - 10) left = pw - panelW - 10;
    if (left < 10) left = 10;
    if (top + panelH > ph - 10) top = rect.top - panelH - 6;
    if (top < 10) top = 10;
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
    panel.style.display = 'flex';
    checkConfig(); refreshMvuConfigStatus(); refreshWorldbookList(); checkEjsTemplate();
  }
});

panel.addEventListener('mouseenter', () => { checkConfig(); refreshMvuConfigStatus(); updateBackendCode(); refreshWorldbookList(); checkEjsTemplate(); });

// --- 工具：获取触摸/鼠标坐标 ---
function getXY(e) {
  if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  if (e.changedTouches && e.changedTouches.length) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

// --- 气泡拖拽 ---
let dragBubble = false, bSX, bSY, bOL, bOT;
function onBubbleStart(e) {
  if (dragBubble) return;
  if (e.type === 'mousedown' && e.button !== 0) return;
  if (e.type === 'mousedown') e.preventDefault();
  const pt = getXY(e);
  dragBubble = true; bSX = pt.x; bSY = pt.y;
  bOL = bubble.offsetLeft; bOT = bubble.offsetTop;
  bubble.style.transition = 'none';
}
function onBubbleMove(e) {
  if (!dragBubble) return;
  e.preventDefault();
  const pt = getXY(e);
  bubble.style.left = (bOL + pt.x - bSX) + 'px';
  bubble.style.top = (bOT + pt.y - bSY) + 'px';
}
function onBubbleEnd() {
  if (dragBubble) { bubble.style.transition = ''; dragBubble = false; }
}
bubble.addEventListener('mousedown', onBubbleStart);
bubble.addEventListener('touchstart', onBubbleStart, { passive: false });
p.document.addEventListener('mousemove', onBubbleMove);
p.document.addEventListener('touchmove', onBubbleMove, { passive: false });
p.document.addEventListener('mouseup', onBubbleEnd);
p.document.addEventListener('touchend', onBubbleEnd);

// --- 面板拖拽 ---
const dragHandle = p.document.getElementById('gw-switch-drag');
let dragPanel = false, pSX, pSY, pOL, pOT;
function onPanelStart(e) {
  if (dragPanel) return;
  if (e.type === 'mousedown' && e.button !== 0) return;
  if (e.target.tagName === 'BUTTON') return;
  const pt = getXY(e);
  dragPanel = true; pSX = pt.x; pSY = pt.y;
  pOL = panel.offsetLeft; pOT = panel.offsetTop;
}
function onPanelMove(e) {
  if (!dragPanel) return;
  e.preventDefault();
  const pt = getXY(e);
  panel.style.left = (pOL + pt.x - pSX) + 'px';
  panel.style.top = (pOT + pt.y - pSY) + 'px';
}
function onPanelEnd() { dragPanel = false; }
dragHandle.addEventListener('mousedown', onPanelStart);
dragHandle.addEventListener('touchstart', onPanelStart, { passive: false });
p.document.addEventListener('mousemove', onPanelMove);
p.document.addEventListener('touchmove', onPanelMove, { passive: false });
p.document.addEventListener('mouseup', onPanelEnd);
p.document.addEventListener('touchend', onPanelEnd);

// --- 刷新世界书列表 ---
async function refreshWorldbookList() {
  try {
    const names = await api_getWorldbookNames();
    let charWb = { primary: null };
    try { charWb = await api_getCharWorldbooks(); } catch (e) {}

    wbSelect.innerHTML = '';
    const maxLen = 20;
    for (const name of names) {
      const opt = p.document.createElement('option');
      opt.value = name;
      const suffix = name === charWb.primary ? ' (主)' : '';
      const display = name + suffix;
      opt.textContent = display.length > maxLen ? display.slice(0, maxLen - 1) + '…' : display;
      opt.title = name;
      if (name === charWb.primary) opt.selected = true;
      wbSelect.appendChild(opt);
    }
    if (names.length === 0) {
      wbSelect.innerHTML = '<option value="">-- 未找到任何世界书 --</option>';
    }
    await refreshStatus();
  } catch (e) {
    wbSelect.innerHTML = '<option value="">-- 获取失败 --</option>';
  }
}

// --- 刷新条目状态（按comment匹配） ---
async function refreshStatus() {
  let wbName = wbSelect.value;
  if (!wbName) {
    try {
      const charWb = await api_getCharWorldbooks();
      wbName = charWb?.primary || '高武';
    } catch (e) {
      wbName = '高武';
    }
    if (wbSelect && wbName) wbSelect.value = wbName;
  }
  if (!wbName) {
    wbCount.innerHTML = '';
    statusList.innerHTML = '<span class="status-label" style="font-size:12px;">请先选择世界书</span>';
    return;
  }
  try {
    const entries = await api_getWorldbook(wbName);

    // 独立判断各domain开关状态：只要列表中任一条目enabled即为ON
    let blueStarOn = entries.some(e => {
      if (e.enabled && (BLUE_STAR_COMMENTS.includes(e.comment) || BLUE_STAR_COMMENTS.includes(e.name) || BLUE_STAR_IDS.includes(e.uid) || BLUE_STAR_IDS.includes(e.id))) return true;
      return false;
    });
    let cosmosOn = entries.some(e => {
      if (e.enabled && (COSMOS_COMMENTS.includes(e.comment) || COSMOS_COMMENTS.includes(e.name) || COSMOS_IDS.includes(e.uid) || COSMOS_IDS.includes(e.id))) return true;
      return false;
    });

    for (const btn of domainBtns) {
      const isCosmos = btn.dataset.domain === 'cosmos';
      btn.classList.toggle('active', isCosmos ? cosmosOn : blueStarOn);
    }

    wbCount.innerHTML = '当前共 <b style="color:#d4a13a">' + entries.length + '条</b> 条目';

    statusList.innerHTML =
      renderStatusInline('蓝星', blueStarOn) +
      renderStatusInline('宇宙', cosmosOn);
  } catch (e) {
    wbCount.innerHTML = '<span style="color:#c94f3d">获取条目失败: ' + e.message + '</span>';
    statusList.innerHTML = '<span class="gw-status-inline"><span class="status-dot off"></span><span class="status-label">获取失败</span></span>';
  }
}

function renderStatusInline(label, isOn) {
  const cls = isOn ? 'on' : 'off';
  return '<span class="gw-status-inline"><span class="status-dot ' + cls + '"></span><span class="status-label">' + label + '</span></span>';
}

// --- 执行独立开关（每个domain独立toggle） ---
async function doToggle(domain) {
  let wbName = wbSelect.value;
  if (!wbName) {
    try {
      const charWb = await api_getCharWorldbooks();
      wbName = charWb?.primary || '高武';
    } catch (e) {
      wbName = '高武';
    }
  }
  if (!wbName) { showToast('请先选择世界书'); return; }

  const comments = domain === 'cosmos' ? COSMOS_COMMENTS : BLUE_STAR_COMMENTS;
  const ids = domain === 'cosmos' ? COSMOS_IDS : BLUE_STAR_IDS;
  const commentsJson = JSON.stringify(comments);
  const idsJson = JSON.stringify(ids);
  const label = domain === 'cosmos' ? '宇宙' : '蓝星';

  const modifierFn = `(entries) => {` +
    `  var cList = ` + commentsJson + `;` +
    `  var idList = ` + idsJson + `;` +
    `  for (var i = 0; i < entries.length; i++) {` +
    `    var e = entries[i];` +
    `    var match = cList.includes(e.comment) || cList.includes(e.name) || idList.includes(e.uid) || idList.includes(e.id);` +
    `    if (match) { e.enabled = !e.enabled; }` +
    `  }` +
    `}`;

  try {
    await api_replaceWorldbook(wbName, modifierFn);
    showToast('已切换「' + label + '」条目');
    await refreshStatus();
  } catch (e) {
    console.error('[高武配置] doToggle error:', e);
    showToast('世界书「' + wbName + '」切换失败，请刷新面板');
  }
}

// --- 事件绑定 ---
wbSelect.addEventListener('change', () => { refreshStatus(); });
refreshBtn.addEventListener('click', async () => { checkConfig(); refreshMvuConfigStatus(); await refreshWorldbookList(); checkEjsTemplate(); showToast('已刷新'); });

for (const btn of domainBtns) {
  btn.addEventListener('click', () => doToggle(btn.dataset.domain));
}

mvuUpdateMode.addEventListener('change', () => {
  mvuExtraPanel.style.display = mvuUpdateMode.value === '额外模型解析' ? '' : 'none';
  refreshModelSourceVisibility();
  onMvuFieldChange();
});
mvuModelSource.addEventListener('change', () => {
  refreshModelSourceVisibility();
  onMvuFieldChange();
});
mvuJailbreak.addEventListener('change', () => {
  const isOther = mvuJailbreak.value === '使用其他预设';
  mvuPresetRow.style.display = isOther ? '' : 'none';
  if (isOther) populatePresets(mvuPresetName.value || '');
  onMvuFieldChange();
});
mvuRespFormat.addEventListener('change', onMvuFieldChange);
mvuPresetName.addEventListener('change', () => {
  onMvuFieldChange();
  if (mvuPresetName.value) syncMvuNativePreset(mvuPresetName.value);
});
mvuRequestMode.addEventListener('change', onMvuFieldChange);
mvuRequestCount.addEventListener('input', onMvuFieldChange);
mvuAutoRequest.addEventListener('change', onMvuFieldChange);
mvuApiUrl.addEventListener('input', onMvuFieldChange);
mvuApiKey.addEventListener('input', onMvuFieldChange);
mvuFetchModelsBtn.addEventListener('click', fetchModels);
mvuModelName.addEventListener('change', onMvuFieldChange);
mvuMaxTokens.addEventListener('input', onMvuFieldChange);
mvuTemperature.addEventListener('input', onMvuFieldChange);
mvuFreqPenalty.addEventListener('input', onMvuFieldChange);
mvuPresPenalty.addEventListener('input', onMvuFieldChange);
mvuTopP.addEventListener('input', onMvuFieldChange);
mvuTopK.addEventListener('input', onMvuFieldChange);
mvuAutoCleanEnable.addEventListener('change', () => {
  mvuCleanPanel.style.display = mvuAutoCleanEnable.checked ? '' : 'none';
  onMvuFieldChange();
});
mvuCleanInterval.addEventListener('input', onMvuFieldChange);
mvuCleanRecent.addEventListener('input', onMvuFieldChange);
mvuCleanTrigger.addEventListener('input', onMvuFieldChange);
mvuAdvToggle.addEventListener('click', () => {
  const open = mvuAdvPanel.style.display !== 'none';
  mvuAdvPanel.style.display = open ? 'none' : '';
  mvuAdvArrow.classList.toggle('open', !open);
});
mvuManualToggle.addEventListener('click', () => {
  const open = mvuManualPanel.style.display !== 'none';
  mvuManualPanel.style.display = open ? 'none' : '';
  mvuManualArrow.classList.toggle('open', !open);
});
mvuCompatChecks.addEventListener('change', (e) => {
  if (e.target.classList.contains('gw-mvu-compat-check')) onMvuFieldChange();
});

mvuOptimizeBtn.addEventListener('click', () => {
  const apiUrlEmpty = !mvuApiUrl.value.trim();
  const apiKeyEmpty = !mvuApiKey.value.trim();
  if (apiUrlEmpty || apiKeyEmpty) {
    gwConfirmMsg.textContent = '请配置API连接并选择模型';
    gwConfirmBody.style.display = '';
    gwConfirmBody.innerHTML = `
      <div class="gw-mvu-row">
        <label class="gw-mvu-label wide">API地址</label>
        <input class="gw-mvu-input" id="gw-dlg-api-url" placeholder="https://...">
      </div>
      <div class="gw-mvu-row">
        <label class="gw-mvu-label wide">API密钥</label>
        <input class="gw-mvu-input" id="gw-dlg-api-key" type="password" placeholder="sk-...">
      </div>
      <div class="gw-mvu-row" style="justify-content:flex-end;">
        <button class="gw-switch-btn xs" id="gw-dlg-fetch-models">获取模型</button>
      </div>
      <div class="gw-mvu-row">
        <label class="gw-mvu-label wide">模型名称</label>
        <select class="gw-mvu-select" id="gw-dlg-model-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          <option value="">-- 请先获取模型 --</option>
        </select>
      </div>
    `;
    setTimeout(() => {
      const dlgUrl = p.document.getElementById('gw-dlg-api-url');
      const dlgKey = p.document.getElementById('gw-dlg-api-key');
      const dlgFetch = p.document.getElementById('gw-dlg-fetch-models');
      if (dlgUrl) dlgUrl.value = mvuApiUrl.value;
      if (dlgKey) dlgKey.value = mvuApiKey.value;
      if (dlgFetch) dlgFetch.addEventListener('click', fetchModelsInDialog);
    }, 0);
    gwConfirmOk.textContent = '已选好，执行配置';
    gwConfirmOk.onclick = () => {
      const dlgUrl = p.document.getElementById('gw-dlg-api-url');
      const dlgKey = p.document.getElementById('gw-dlg-api-key');
      const dlgModel = p.document.getElementById('gw-dlg-model-name');
      if (!dlgUrl || !dlgUrl.value.trim()) { showToast('请填写API地址'); return; }
      if (!dlgModel || !dlgModel.value) { showToast('请获取并选择模型'); return; }
      const modelName = (dlgModel.value || '').toLowerCase();
      const isFlash = /flash/.test(modelName) && !/3\.5/.test(modelName);
      if (isFlash && gwConfirmOk.textContent !== '确认使用Flash') {
        gwConfirmMsg.textContent = '检测到Flash系列模型，除3.5 Flash外Flash模型智商不足，建议更换为 gemini-2.5-pro / gemini-3.1-pro / gemini-3.5-flash。是否确认使用？';
        gwConfirmOk.textContent = '确认使用Flash';
        return;
      }
      mvuApiUrl.value = dlgUrl.value;
      mvuApiKey.value = dlgKey ? dlgKey.value : '';
      if (dlgModel.options.length > 1) {
        mvuModelName.innerHTML = [...dlgModel.options].map(o => '<option value="' + o.value + '">' + o.textContent + '</option>').join('');
      }
      mvuModelName.value = dlgModel.value;
      gwConfirmOverlay.style.display = 'none';
      gwConfirmBody.style.display = 'none';
      gwConfirmOk.textContent = '确认';
      applyOptimalMvuConfig();
    };
    gwConfirmOverlay.style.display = 'flex';
  } else {
    applyOptimalMvuConfig();
  }
});

async function applyMvuConfigFromForm() {
  try {
    const cfg = getMvuCfg();
    if (!cfg) { showToast('mvu_settings 不存在，请确认已安装MVU变量框架'); return; }

    cfg.通知 = cfg.通知 || {};
    cfg.通知['MVU框架加载成功'] = true;
    cfg.通知['变量初始化成功'] = true;
    cfg.通知['变量更新出错'] = true;
    cfg.通知['额外模型解析中'] = true;

    cfg.更新方式 = mvuUpdateMode.value;

    cfg.额外模型解析配置 = cfg.额外模型解析配置 || {};
    const em = cfg.额外模型解析配置;
    em.模型来源 = mvuModelSource.value;
    em.破限方案 = mvuJailbreak.value;
    if (mvuJailbreak.value === '使用其他预设' && mvuPresetName) {
      em.预设名称 = mvuPresetName.value;
    } else {
      delete em.预设名称;
    }
    em.应答格式 = mvuRespFormat.value;
    em.兼容假流式 = /假流/i.test(mvuModelName.value);
    em.请求方式 = mvuRequestMode.value;
    em.请求次数 = parseInt(mvuRequestCount.value) || 1;
    em.启用自动请求 = mvuAutoRequest.checked;
    em.api地址 = mvuApiUrl.value;
    em.密钥 = mvuApiKey.value;
    em.模型名称 = mvuModelName.value;
    em.最大回复token数 = parseInt(mvuMaxTokens.value) || 65535;
    em.温度 = parseFloat(mvuTemperature.value) || 1;
    em.频率惩罚 = parseFloat(mvuFreqPenalty.value) || 0;
    em.存在惩罚 = parseFloat(mvuPresPenalty.value) || 0;
    em.top_p = parseFloat(mvuTopP.value) || 1;
    em.top_k = parseInt(mvuTopK.value) || 0;

    cfg.自动清理变量 = cfg.自动清理变量 || {};
    const ac = cfg.自动清理变量;
    ac.启用 = mvuAutoCleanEnable.checked;
    ac.快照保留间隔 = parseInt(mvuCleanInterval.value) || 50;
    ac.要保留变量的最近楼层数 = parseInt(mvuCleanRecent.value) || 20;
    ac.触发恢复变量的最近楼层数 = parseInt(mvuCleanTrigger.value) || 10;

    cfg.兼容性 = cfg.兼容性 || {};
    const checks = mvuCompatChecks.querySelectorAll('.gw-mvu-compat-check');
    checks.forEach(cb => { cfg.兼容性[cb.dataset.key] = cb.checked; });
    clearTimeout(_mvuSaveTimer);
    ewcBackupToEwcYH();

    await saveSettings();

    await ewcSyncMvuDom().catch(() => {});
    if (em.破限方案 === '使用其他预设' && em.预设名称) {
      await syncMvuNativePreset(em.预设名称);
    }

    syncMvuToForm(cfg);
    mvuStatus.textContent = '配置已保存，即将刷新…';

    showToast('配置已应用，1秒后刷新页面…');
    setTimeout(() => { window.parent.location.reload(); }, 1000);
  } catch (e) {
    showToast('MVU配置失败: ' + e.message);
  }
}

mvuApplyBtn.addEventListener('click', async () => {
  const modelName = (mvuModelName.value || '').toLowerCase();
  const isFlash = /flash/.test(modelName) && !/3\.5/.test(modelName);

  if (isFlash) {
    gwConfirmMsg.textContent = '检测到Flash系列模型，除3.5 Flash外Flash模型智商不足，建议更换。是否确认应用？';
    gwConfirmOk.onclick = async () => {
      gwConfirmOverlay.style.display = 'none';
      await applyMvuConfigFromForm();
    };
    gwConfirmOverlay.style.display = 'flex';
    return;
  }

  await applyMvuConfigFromForm();
});

gwConfirmCancel.addEventListener('click', () => {
  gwConfirmOverlay.style.display = 'none';
  gwConfirmBody.style.display = 'none';
  gwConfirmOk.textContent = '确认';
});

// --- 初始化 ---
ewcInjectFetchHook();
ewcRestoreFromEwcYH();
ewcSyncMvuDom().catch(() => {});

(function restorePreset() {
  const bu = ewcGetEwcYH();
  const cfg = getMvuCfg();
  const em = cfg && cfg.额外模型解析配置;
  if (bu.预设名称 && em && em.破限方案 === '使用其他预设') {
    em.预设名称 = bu.预设名称;
    syncMvuNativePreset(bu.预设名称);
  }
})();

checkConfig();
setInterval(() => { checkConfig(); updateBackendCode(); }, 5000);
saveDomain(getSelectedDomain());

await refreshMvuConfigStatus();
await refreshWorldbookList();
checkEjsTemplate();

export {}