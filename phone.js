// ═══════════════════════════════════════════════════════
//  霖州往事 · 悬浮手机  v1.1
//  二创组件 — 为《霖州往事》角色卡添加悬浮手机（微信私聊 / 群聊 / 表情包）
//  手机壳：贾可默核桃木壳 ｜ 壁纸与配色：封面油画 ｜ 悬浮球：墙头探头的猫
//  需要：JS-Slash-Runner（酒馆助手）
// ═══════════════════════════════════════════════════════
(function () {
  'use strict';

  var NS = 'lz-phone';
  var BTN = '\u{1F4F1}手机';
  var CATBOX = 'https://files.catbox.moe/';
  var VAR_NS = 'lz_phone';
  var INJ_ID = 'lz_phone_memory';

  var DOC, VIEW;
  try { VIEW = window.parent; DOC = VIEW.document; } catch (e) { return; }
  if (!DOC) return;

  // 单例租约：脚本重载时先请旧实例收摊
  try { if (typeof VIEW.__lzPhoneLease === 'function') VIEW.__lzPhoneLease(); } catch (e) {}

  // ─── 壁纸：封面（jsDelivr 多域备胎，全挂则退油画渐变） ───
  var WALL_REPO = 'fannnnnnn5822/linzhou-phone';
  var WALL_REF = '41de1d84f16d485216a3c54416fb6778c064d905';
  var WALL_SRCS = [
    'https://cdn.jsdelivr.net/gh/' + WALL_REPO + '@' + WALL_REF + '/cover.jpg',
    'https://testingcf.jsdelivr.net/gh/' + WALL_REPO + '@' + WALL_REF + '/cover.jpg',
    'https://fastly.jsdelivr.net/gh/' + WALL_REPO + '@' + WALL_REF + '/cover.jpg',
    'https://raw.githubusercontent.com/' + WALL_REPO + '/' + WALL_REF + '/cover.jpg'
  ];

  // ══════════════════════════════════════
  //  §1  角色 · 群聊 · 表情包
  // ══════════════════════════════════════

  var CONTACTS = [
    { id: 'zhouyan', name: '周言', avatar: 'gc1s0f.jpg', theme: '#5B7FB0',
      voice: '温柔有礼、语速不疾不徐的班长。用词精准，逻辑清晰，标点规范。对{{user}}特别耐心，偶尔露出隐性的固执和胜负欲。很少用emoji，偶尔用"嗯""好的"。',
      relation: '挚友' },
    { id: 'shenxiyuan', name: '沈锡元', avatar: 'jnjhio.png', theme: '#C9848C',
      voice: '慵懒痞气的篮球队长，尾音习惯性拖长。嘴硬心软、口是心非，说话直接偶尔毒舌。短句多，打字常省标点。对{{user}}别扭但关心。',
      relation: '挚友' },
    { id: 'linxi', name: '林溪', avatar: 'ehdf6a.png', theme: '#5FA37E',
      voice: '大大咧咧、正义感爆棚的闺蜜。爱八卦爱吃瓜，自称情感大师。感叹号多、emoji多，爱用"哈哈哈""啊啊啊"等语气词，常发表情包。',
      relation: '同桌 · 死党' },
    { id: 'lufei', name: '陆飞', avatar: 'fac3wy.png', theme: '#D69A3C',
      voice: '开朗外向的气氛组担当，神经大条爱开玩笑。哈哈哈多，爱发表情包，说话夸张常大惊小怪。是沈锡元的最佳拍档和"翻译官"。',
      relation: '沈锡元的铁哥们' },
    { id: 'chenyouyou', name: '陈悠悠', avatar: '5sgfqn.jpeg', theme: '#7F9CC4',
      voice: '文静内敛的文艺少女，说话轻声细语，用词优美有诗意。偶尔害羞，不太主动但很真诚。',
      relation: '同学' },
    { id: 'wenjia', name: '闻迦', avatar: 'ppr6j3.jpg', theme: '#8AA37E',
      voice: '沉稳可靠的朋友，说话不急不躁，偶尔冒出冷幽默。观察力强，是旁观者视角。',
      relation: '同学' },
    { id: 'linsiwan', name: '林思菀', avatar: 'awzjxd.jpeg', theme: '#A88CC2',
      voice: '个性独立的短发女生，说话带点酷和距离感，但骨子里温柔。审美独到，偶尔分享艺术相关。',
      relation: '同学' },
    { id: 'jiangmo', name: '蒋默', avatar: 'meuzgh.jpg', theme: '#C07A7A',
      voice: '沉默寡言的篮球队员，打字极简，句子短，不爱解释。情绪不外露，偶尔会冒出出人意料的直球发言。',
      relation: '篮球队' },
    { id: 'azhe', name: '阿哲', avatar: 'y2h7tq.jpg', theme: '#7E9C7E',
      voice: '随和开朗的普通男生，接地气，说话口语化。爱附和别人，偶尔自嘲，有点小幽默。',
      relation: '同学' }
  ];

  var GROUPS = [
    { id: 'fupin', name: '金华苑扶贫小组', icon: '\u{1F3E0}', members: ['zhouyan', 'shenxiyuan'], desc: '三人小群' },
    { id: 'moyu', name: '霖附摸鱼自留地', icon: '\u{1F41F}', members: ['zhouyan', 'shenxiyuan', 'lufei', 'linxi'], desc: '朋友群' },
    { id: 'class2', name: '高三（2）班', icon: '\u{1F4DA}',
      members: ['zhouyan', 'shenxiyuan', 'lufei', 'linxi', 'chenyouyou', 'wenjia', 'linsiwan', 'jiangmo', 'azhe'], desc: '班级群' },
    { id: 'gossip', name: '霖附吃瓜二手交易市场', icon: '\u{1F349}', members: ['lufei', 'linxi'], desc: '校园百人大群' }
  ];

  var STICKERS = {
    "偷看":"s9v34y.jpeg","你好呀":"sm67i1.jpeg","摆烂":"z4tnmw.jpeg","不爽":"s38nln.jpeg","不行":"1hapz4.gif",
    "可怜兮兮":"7d82g1.jpg","你爹来咯":"hppo99.jpg","无语":"ok9xm5.gif","别不识好歹":"gum33t.jpg","回老子消息":"gy1hs6.gif",
    "不找我是害羞？":"5xt73w.jpeg","小子有种报段位":"1n2kps.gif","【委屈】垮起个小猫批脸":"aaz2qw.jpg","蛙蛙哭泣":"81la40.gif",
    "妈的":"w26osr.jpeg","你他妈的":"ilyo3o.jpeg","杰瑞生气叉腰":"fnjbj6.gif","你很牛吗":"usg5yj.jpeg",
    "让姐品品这什么货色":"7kaqyx.gif","赔偿我精神损失费":"kxowcj.jpeg","杀了你":"93cwle.jpeg","算了":"b9uzio.jpeg",
    "所以呢":"g0vvp4.jpeg","亲亲":"ghjaxl.gif","听不懂想亲嘴":"2b8fj2.jpeg","做姐姐的舔狗":"y7nrxm.gif","跟我约会":"pcgy43.jpg",
    "老公抱抱":"u6tph8.gif","想老婆了":"zh2plc.gif","你不爱我了":"6ekg1y.gif","恋爱脑清醒清醒":"wun9dh.gif","我疯了":"a1oiuu.jpeg",
    "有品位":"rvak3o.jpeg","猪头问号":"bshhsw.jpeg","满屏问号":"frtizf.gif","杰瑞生气问号":"64jb35.jpg","猫咪问号":"75cjiq.gif",
    "开始摆烂":"5pcxo1.jpeg","躺平别卷了":"f043ww.gif","卷死你们":"1jazgl.gif","卷起来了":"18dxxh.gif","来不及了快快学习":"cgtdb5.gif",
    "没脸见人了":"hh1qcp.gif","磕头":"596zav.jpeg","哦嚯":"ns4c7w.gif","瞪大眼睛":"5a8su3.gif","来了":"dcooze.gif","死了":"h97356.gif",
    "已老实":"gza0yc.gif","急急急":"ssm222.gif","那我走":"5anbfb.gif","好热啊":"7lcgld.jpg","太有实力了":"kujto0.gif",
    "竖起耳朵听":"m8b5lo.jpeg","看戏吃瓜":"cr6ydz.gif","姐妹有八卦吗":"t75i48.gif","假装没在听八卦":"lanin5.gif",
    "说八卦请大点声":"9ixmip.gif","有什么八卦让我听听":"y7n0js.jpeg","乡下人的目光":"2d88v1.jpeg","吃瓜群众已就位":"rxgo8j.gif",
    "睡了拜拜":"eufams.gif","有一丁点害羞":"sto3ob.gif","撸袖子冲":"igsolv.jpeg","拜托拜托":"yns5x8.jpg","我要当废物":"ypphrr.jpeg",
    "我投降":"uaseh3.jpeg","等我有钱了":"3pie3n.png","滑跪道歉":"aw00em.jpeg","【可爱小狗】我来咯":"cjq0ng.jpeg",
    "【可爱】好的呀":"8iixex.gif","【可爱】大笑":"b7ib9u.gif","【可爱】道歉":"dwvb5k.gif","【可爱】给你我的心":"ouvm3g.gif",
    "【可爱】呐":"9j1gia.gif","【可爱】嗯嗯":"92ffxx.gif","【可爱】生气":"hwznad.gif","【可爱】委屈":"kdlm6b.gif",
    "【可爱】谢谢":"o3caur.gif","【可爱】心碎":"rhawk1.gif","【可爱】兴奋":"fcw3mi.gif","【可爱】爱你":"lv4svp.jpeg",
    "【可爱】鞠躬":"p8wg65.gif","【可爱】哇喔":"snpmwq.gif","【可爱】阴影":"5cjkx3.gif","【可爱】震惊":"d6rmkp.gif",
    "暗中观察":"my92nd.gif","翻滚":"55p5hs.gif"
  };
  var STICKER_NAMES = Object.keys(STICKERS);

  // ══════════════════════════════════════
  //  §2  工具
  // ══════════════════════════════════════

  function findContact(id) { for (var i = 0; i < CONTACTS.length; i++) if (CONTACTS[i].id === id) return CONTACTS[i]; return null; }
  function findGroup(id) { for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].id === id) return GROUPS[i]; return null; }
  function contactByName(n) { for (var i = 0; i < CONTACTS.length; i++) if (CONTACTS[i].name === n) return CONTACTS[i]; return null; }
  function catUrl(f) { return CATBOX + f; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function hhmm() { var d = new Date(); return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function $(id) { return DOC.getElementById(NS + '-' + id); }
  function bqbToText(t) { return t.replace(/<bqb>(.*?)<\/bqb>/g, '(表情:$1)'); }
  var JUNK_LINE = /^\s*(time|location|npc|event|status|状态|时间|地点|人物|事件)\s*[:：]/i;
  function cleanAI(s) {
    return (s || '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/<(think|thinking|update_variable|initvar|Analysis)>[\s\S]*?<\/\1>/gi, '')
      .replace(/<(?!\/?bqb>)[^>]*>/g, '')
      .split('\n').filter(function (l) { return !JUNK_LINE.test(l); }).join('\n')
      .trim();
  }

  // ─── 聊天变量：序列化写队列 ───
  var _wQ = Promise.resolve();
  function phoneData() {
    try { var all = getVariables({ type: 'chat' }) || {}; return all[VAR_NS] || {}; } catch (e) { return {}; }
  }
  function updatePhone(fn) {
    _wQ = _wQ.then(function () {
      return updateVariablesWith(function (v) { if (!v[VAR_NS]) v[VAR_NS] = {}; fn(v[VAR_NS]); return v; }, { type: 'chat' });
    }).catch(function (e) { console.log('[霖州手机] 写变量失败', e); });
    return _wQ;
  }
  function getHistory(chatId) { return phoneData()['h_' + chatId] || []; }
  function saveHistory(chatId, msgs) {
    if (msgs.length > 60) msgs = msgs.slice(-60);
    return updatePhone(function (p) { p['h_' + chatId] = msgs; });
  }

  // ─── 设置：存浏览器本地（跟卡/聊天无关） ───
  var CFG_KEY = 'lz_phone_cfg';
  var DEFAULT_CFG = { apiurl: '', key: '', model: '', source: 'openai', temperature: 1.1, inject: true };
  function loadCfg() {
    try { var raw = VIEW.localStorage.getItem(CFG_KEY); if (raw) return Object.assign({}, DEFAULT_CFG, JSON.parse(raw)); } catch (e) {}
    return Object.assign({}, DEFAULT_CFG);
  }
  function saveCfg(c) { cfg = c; try { VIEW.localStorage.setItem(CFG_KEY, JSON.stringify(c)); } catch (e) {} }
  var cfg = loadCfg();
  function customApi() {
    var api = {};
    if (cfg.apiurl) { api.apiurl = cfg.apiurl.trim(); api.key = (cfg.key || '').trim(); api.source = cfg.source || 'openai'; }
    if (cfg.model) api.model = cfg.model.trim();
    if (cfg.temperature !== '' && !isNaN(cfg.temperature)) api.temperature = Number(cfg.temperature);
    return Object.keys(api).length ? api : null;
  }

  // ─── 副轨生成（不走玩家预设） ───
  async function phoneGenerate(prompt) {
    for (var attempt = 0; attempt < 2; attempt++) {
      try {
        var req = {
          ordered_prompts: [{ role: 'system', content: prompt }, { role: 'user', content: '请按要求输出。' }],
          should_silence: true,
          max_chat_history: 0
        };
        var api = customApi(); if (api) req.custom_api = api;
        var r = await generateRaw(req);
        var txt = typeof r === 'string' ? r : (r && r.content) || '';
        txt = cleanAI(txt);
        if (txt) return txt;
      } catch (e) { console.log('[霖州手机] 生成失败', e); }
    }
    return '';
  }

  // ─── 回灌主线 ───
  function refreshInjection() {
    var out = '';
    CONTACTS.forEach(function (c) {
      var h = getHistory(c.id); if (!h.length) return;
      var lines = h.slice(-6).map(function (m) { return (m.sender === 'user' ? '{{user}}' : c.name) + '：' + bqbToText(m.text); });
      out += '【与' + c.name + '的近期微信私聊 — 仅' + c.name + '与{{user}}知晓，其他角色不应知情】\n' + lines.join('\n') + '\n\n';
    });
    GROUPS.forEach(function (g) {
      var h = getHistory('g_' + g.id); if (!h.length) return;
      var names = g.members.map(function (id) { var c = findContact(id); return c ? c.name : id; });
      var lines = h.slice(-8).map(function (m) { return (m.sender === 'user' ? '{{user}}' : (m.senderName || '?')) + '：' + bqbToText(m.text); });
      out += '【群聊「' + g.name + '」（成员：' + names.join('、') + '、{{user}}）近期聊天 — 仅群成员知晓】\n' + lines.join('\n') + '\n\n';
    });
    try { uninjectPrompts([INJ_ID]); } catch (e) {}
    if (!out || cfg.inject === false) return;
    out = '<手机记录>\n' + out.trim() + '\n</手机记录>\n（以上是{{user}}手机里的聊天记录，角色可自然地知道并在正文中带出，但正文绝不复述、不排版这些消息。）';
    try {
      injectPrompts([{ id: INJ_ID, position: 'in_chat', depth: 4, role: 'system', content: out, should_scan: true }]);
    } catch (e) { console.log('[霖州手机] 注入失败', e); }
  }

  // ══════════════════════════════════════
  //  §3  几何（手机端四件套，抄自悬浮面板骨架）
  // ══════════════════════════════════════

  function clientPlace(el, left, top, w, h) {
    el.style.transform = ''; el.style.right = 'auto'; el.style.bottom = 'auto';
    el.style.left = '0px'; el.style.top = '0px'; el.style.width = '100px'; el.style.height = '100px';
    var r = el.getBoundingClientRect();
    var sx = (r.width / 100) || 1, sy = (r.height / 100) || 1;
    el.style.width = (w / sx) + 'px'; el.style.height = (h / sy) + 'px';
    el.style.left = ((left - r.left) / sx) + 'px'; el.style.top = ((top - r.top) / sy) + 'px';
  }
  function clearPlace(el) {
    el.style.width = ''; el.style.height = ''; el.style.left = ''; el.style.top = '';
    el.style.right = ''; el.style.bottom = ''; el.style.transform = '';
  }
  function visibleRect() {
    var vv = VIEW.visualViewport;
    return { w: vv ? vv.width : (VIEW.innerWidth || 0), h: vv ? vv.height : (VIEW.innerHeight || 0) };
  }
  function inputTop() {
    var sf = DOC.getElementById('send_form') || DOC.getElementById('form_sheld');
    if (sf) { var r = sf.getBoundingClientRect(); if (r.top > 100) return r.top; }
    return visibleRect().h - 90;
  }
  function isNarrow() { var vp = visibleRect(); return vp.w > 0 && vp.w < 500; }

  function placeBall() {
    var b = $('ball'); if (!b) return;
    if (!isNarrow()) { clearPlace(b); return; }
    var vp = visibleRect();
    clientPlace(b, vp.w - 66, inputTop() - 124, 56, 56);
  }
  function setOpen(open) {
    var p = $('panel'), b = $('ball'); if (!p) return;
    phoneOpen = !!open;
    if (b) b.classList.toggle('open', phoneOpen);
    if (!open) { p.style.display = 'none'; return; }
    p.style.display = 'flex';
    if (isNarrow()) {
      var vp = visibleRect(), w = Math.min(392, vp.w - 10), top = 6;
      p.classList.add('narrow');
      clientPlace(p, (vp.w - w) / 2, top, w, Math.max(360, inputTop() - top - 8));
      p.style.maxHeight = 'none'; p.style.maxWidth = 'none'; p.style.minHeight = '0';
    } else {
      p.classList.remove('narrow');
      clearPlace(p); p.style.maxHeight = ''; p.style.maxWidth = ''; p.style.minHeight = '';
    }
    unread = 0; syncBadge();
    if (currentScreen === 'lock') showLock(); else showScreen(currentScreen, currentChatId);
  }
  function isOpen() { var p = $('panel'); return !!p && p.style.display === 'flex'; }
  function reflow() {
    if (!mounted) return;
    try {
      var a = DOC.activeElement;
      if (a && a.closest && a.closest('#' + NS + '-panel') && (a.tagName === 'TEXTAREA' || a.tagName === 'INPUT')) return;
    } catch (e) {}
    placeBall(); if (isOpen()) setOpen(true);
  }

  // ══════════════════════════════════════
  //  §4  样式
  // ══════════════════════════════════════

  var B = '#' + NS + '-ball', P = '#' + NS + '-panel';
  var CSS = [
    /* ── 悬浮球：墙头探头的猫（无底盘） ── */
    B + '{position:fixed;right:24px;bottom:30px;width:56px;height:56px;box-sizing:border-box;z-index:2147483600;',
    'cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;background:none;border:none;',
    'filter:drop-shadow(0 6px 10px rgba(20,30,50,.5));animation:' + NS + '-float 4.6s ease-in-out infinite;touch-action:manipulation}',
    B + ' .lz-halo{position:absolute;inset:-14px;border-radius:50%;pointer-events:none;',
    'background:radial-gradient(circle,rgba(120,175,230,.55) 0%,rgba(120,175,230,.22) 42%,rgba(120,175,230,0) 68%);',
    'animation:' + NS + '-halo 3.8s ease-in-out infinite}',
    B + ' svg{position:relative;width:100%;height:100%;display:block;overflow:visible}',
    B + ' .lz-cat{transform-origin:32px 40px;transition:transform .25s}',
    B + ':hover .lz-cat{transform:rotate(-9deg)}',
    B + ' .lz-eye-shut{opacity:0}',
    B + '.open .lz-eye-open{opacity:0}', B + '.open .lz-eye-shut{opacity:1}', B + '.open .lz-halo{opacity:.35}',
    B + ' .lz-star{opacity:0;transform-origin:center;transform-box:fill-box}',
    B + '.lit .lz-star{animation:' + NS + '-twinkle 2.4s ease-in-out infinite}',
    B + '.lit .lz-star:nth-of-type(2){animation-delay:.7s;animation-duration:2.9s}',
    B + '.lit .lz-star:nth-of-type(3){animation-delay:1.5s;animation-duration:2.1s}',
    B + '.lit .lz-halo{background:radial-gradient(circle,rgba(242,180,190,.6) 0%,rgba(242,180,190,.25) 42%,rgba(242,180,190,0) 68%)}',
    B + ' .lz-badge{position:absolute;top:-2px;right:-4px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;',
    'background:#e2536a;color:#fff;font:700 11px/18px sans-serif;text-align:center;border:2px solid #fff;display:none}',
    B + '.lit .lz-badge{display:block}',
    '@keyframes ' + NS + '-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}',
    '@keyframes ' + NS + '-halo{0%,100%{transform:scale(.9);opacity:.55}50%{transform:scale(1.08);opacity:.95}}',
    '@keyframes ' + NS + '-twinkle{0%,100%{opacity:0;transform:scale(.4) rotate(0)}50%{opacity:1;transform:scale(1) rotate(25deg)}}',

    /* ── 手机壳：贾可默核桃木 ── */
    P + '{position:fixed;right:24px;bottom:96px;width:340px;height:min(700px,calc(100vh - 120px));box-sizing:border-box;',
    'z-index:2147483599;display:none;flex-direction:column;isolation:isolate;',
    '--ink:#2a221a;--ink2:#6a5d50;--ink3:#a2978b;--paper:rgba(255,250,240,.90);--line:rgba(42,34,26,.10);',
    '--rose:#F3C7CD;--rose-ink:#5a2a33;--sky:#5B93D6;--sky-soft:rgba(91,147,214,.16);--leaf:#6E9A3A;',
    'font-family:-apple-system,"PingFang SC","Microsoft YaHei","Noto Sans SC","Helvetica Neue",sans-serif;font-size:14px;color:var(--ink);',
    'background:linear-gradient(160deg,#6b5640,#4a3a2c 48%,#382a1f);border-radius:44px;padding:11px 11px 12px;',
    'box-shadow:0 1px 0 rgba(255,235,200,.14) inset,0 -1px 0 rgba(0,0,0,.40) inset,0 0 0 1px rgba(48,32,20,.55),',
    '0 40px 80px -22px rgba(40,25,12,.45),0 18px 40px -10px rgba(40,25,12,.25);',
    'animation:' + NS + '-in .28s ease}',
    '@keyframes ' + NS + '-in{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}',
    P + '::before{content:"";position:absolute;left:-1px;top:80px;bottom:80px;width:2px;',
    'background:linear-gradient(180deg,transparent,rgba(255,220,170,.30) 20%,rgba(255,220,170,.30) 80%,transparent);border-radius:2px;pointer-events:none}',
    P + '::after{content:"";position:absolute;inset:8px;border-radius:38px;pointer-events:none;',
    'box-shadow:0 0 0 1px rgba(35,22,12,.65),0 0 0 2px rgba(255,220,170,.05)}',
    P + '.narrow{border-radius:30px;padding:6px 6px 7px}', P + '.narrow::after{inset:4px;border-radius:26px}',
    P + ' *{box-sizing:border-box}',

    /* ── 屏幕 ── */
    P + ' .lz-screen{flex:1;min-height:0;position:relative;overflow:hidden;display:flex;flex-direction:column;',
    'border-radius:34px;border:1px solid rgba(40,25,12,.35);',
    'background:linear-gradient(160deg,#6FA3DC 0%,#9CC44A 28%,#F4F1E6 52%,#F2C7CC 76%,#C9C2DA 100%);',
    'box-shadow:0 0 0 1px rgba(255,220,170,.06),0 1px 0 rgba(255,220,170,.10) inset}',
    P + '.narrow .lz-screen{border-radius:24px}',
    P + ' .lz-wall{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;pointer-events:none;display:block}',
    P + ' .lz-shade{position:absolute;inset:0;z-index:1;pointer-events:none;',
    'background:linear-gradient(180deg,rgba(0,0,0,.30) 0%,rgba(0,0,0,0) 20%,rgba(0,0,0,0) 80%,rgba(0,0,0,.22) 100%)}',
    P + ' .lz-notch{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:78px;height:6px;border-radius:3px;',
    'background:rgba(35,22,12,.75);box-shadow:inset 0 1px 1px rgba(0,0,0,.45);z-index:6}',
    P + ' .lz-notch::after{content:"";position:absolute;right:-14px;top:1px;width:4px;height:4px;border-radius:50%;background:#241a12;box-shadow:inset 0 0 2px rgba(255,220,170,.18)}',
    P + ' .lz-rail{position:relative;z-index:5;display:flex;align-items:center;justify-content:space-between;padding:20px 20px 0;',
    'font-size:11px;font-weight:600;color:rgba(255,255,255,.95);text-shadow:0 1px 2px rgba(0,0,0,.25);font-variant-numeric:tabular-nums;flex:none}',
    P + ' .lz-rail .lz-sig{display:inline-flex;gap:2px;align-items:flex-end;margin-right:6px}',
    P + ' .lz-rail .lz-sig i{width:3px;background:currentColor;border-radius:1px;display:block}',
    P + ' .lz-batt{display:inline-flex;align-items:center;gap:4px}',
    P + ' .lz-batt b{width:20px;height:10px;border:1.4px solid currentColor;border-radius:3px;position:relative;padding:1.4px;display:inline-block}',
    P + ' .lz-batt b::after{content:"";position:absolute;right:-3px;top:2px;width:2px;height:4px;background:currentColor;border-radius:0 1px 1px 0}',
    P + ' .lz-batt b i{display:block;height:100%;width:78%;background:currentColor;border-radius:1px}',
    P + ' .lz-x{margin-left:10px;width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,.28);display:inline-flex;align-items:center;justify-content:center;',
    'cursor:pointer;font-size:11px;color:#fff;text-shadow:none;transition:background .15s}',
    P + ' .lz-x:hover{background:rgba(0,0,0,.5)}',
    P + ' .lz-body{position:relative;z-index:3;flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden}',
    P + ' .lz-home{position:relative;z-index:5;align-self:center;width:96px;height:4px;border-radius:2px;background:#fff;opacity:.7;margin:6px 0 6px;cursor:pointer;flex:none;box-shadow:0 1px 2px rgba(0,0,0,.2)}',

    /* ── 锁屏 ── */
    P + ' .lz-lock{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.25),0 1px 8px rgba(0,0,0,.15)}',
    P + ' .lz-lock .lz-t{font-size:54px;font-weight:700;letter-spacing:-.02em;line-height:1;font-variant-numeric:tabular-nums}',
    P + ' .lz-lock .lz-d{font-size:13px;margin-top:8px;opacity:.92}',
    P + ' .lz-lock .lz-hint{margin-top:auto;margin-bottom:26px;font-size:12px;opacity:.75;animation:' + NS + '-breathe 2.6s ease-in-out infinite}',
    P + ' .lz-lock .lz-hint b{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.85);color:#2a221a;text-shadow:none;',
    'padding:6px 12px;border-radius:999px;font-weight:500;box-shadow:0 1px 4px rgba(0,0,0,.15)}',
    '@keyframes ' + NS + '-breathe{0%,100%{opacity:.6}50%{opacity:1}}',

    /* ── 通用：导航栏 / 列表 ── */
    P + ' .lz-nav{flex:none;display:flex;align-items:center;gap:8px;padding:8px 12px 8px 10px;margin:8px 10px 0;',
    'background:var(--paper);border:1px solid rgba(120,80,40,.10);border-radius:14px;',
    'box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 6px 18px rgba(70,40,15,.10);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}',
    P + ' .lz-back{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;color:var(--ink2);flex:none}',
    P + ' .lz-back:hover{background:rgba(0,0,0,.06)}',
    P + ' .lz-nav h2{margin:0;flex:1;font-size:15px;font-weight:600;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    P + ' .lz-nav small{font-size:11px;color:var(--ink3)}',
    P + ' .lz-list{flex:1;min-height:0;overflow-y:auto;padding:8px 10px 10px;display:flex;flex-direction:column;gap:6px;scrollbar-width:thin}',
    P + ' .lz-sec{font-size:9.5px;font-weight:700;letter-spacing:.14em;color:rgba(255,255,255,.85);text-shadow:0 1px 2px rgba(0,0,0,.25);',
    'display:flex;align-items:center;gap:10px;margin:6px 4px 2px}',
    P + ' .lz-sec::before,' + P + ' .lz-sec::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,rgba(255,255,255,.05),rgba(255,255,255,.35),rgba(255,255,255,.05))}',
    P + ' .lz-item{display:grid;grid-template-columns:40px 1fr auto;align-items:center;gap:10px;padding:8px 11px 8px 9px;cursor:pointer;',
    'background:var(--paper);border:1px solid rgba(120,80,40,.10);border-radius:12px;',
    'box-shadow:0 1px 0 rgba(255,255,255,.4) inset;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);transition:transform .12s}',
    P + ' .lz-item:hover{transform:translateY(-1px)}', P + ' .lz-item:active{transform:scale(.99)}',
    P + ' .lz-av{width:40px;height:40px;border-radius:11px;background-size:cover;background-position:center;background-color:#eee;',
    'display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 1px 3px rgba(0,0,0,.12)}',
    P + ' .lz-av.g{background:linear-gradient(135deg,rgba(111,163,220,.25),rgba(156,196,74,.25))}',
    P + ' .lz-item .lz-nm{font-size:13.5px;font-weight:600;color:var(--ink)}',
    P + ' .lz-item .lz-pv{font-size:11.5px;color:var(--ink2);margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:190px}',
    P + ' .lz-item .lz-tm{font-size:10px;color:var(--ink3);align-self:flex-start;margin-top:2px}',

    /* ── 聊天 ── */
    P + ' .lz-chat{flex:1;min-height:0;overflow-y:auto;padding:10px 12px;display:flex;flex-direction:column;gap:8px;scrollbar-width:thin;',
    'background:linear-gradient(180deg,rgba(246,241,233,.62),rgba(246,241,233,.72))}',
    P + ' .lz-msg{display:flex;gap:7px;max-width:100%}', P + ' .lz-msg.me{flex-direction:row-reverse}',
    P + ' .lz-msg .lz-ma{width:32px;height:32px;border-radius:9px;background-size:cover;background-position:center;flex:none;margin-top:1px;box-shadow:0 1px 2px rgba(0,0,0,.15)}',
    P + ' .lz-msg.me .lz-ma{display:none}',
    P + ' .lz-mb{max-width:74%;display:flex;flex-direction:column}', P + ' .lz-msg.me .lz-mb{align-items:flex-end}',
    P + ' .lz-sn{font-size:10.5px;font-weight:600;margin:0 0 2px 3px}',
    P + ' .lz-bub{padding:8px 12px;border-radius:14px;font-size:13.5px;line-height:1.5;word-break:break-word;',
    'background:#fff;color:var(--ink);border-top-left-radius:4px;box-shadow:0 1px 2px rgba(42,34,26,.08)}',
    P + ' .lz-msg.me .lz-bub{background:var(--rose);color:var(--rose-ink);border-top-left-radius:14px;border-top-right-radius:4px}',
    P + ' .lz-bub.stk{background:transparent!important;box-shadow:none!important;padding:2px!important}',
    P + ' .lz-bub.stk img{max-width:118px;max-height:118px;border-radius:8px;display:block}',
    P + ' .lz-mt{font-size:9.5px;color:var(--ink3);margin:3px 4px 0}',
    P + ' .lz-sys{text-align:center;font-size:11px;color:var(--ink2);padding:6px 0}',
    P + ' .lz-sys span{background:rgba(255,255,255,.7);padding:3px 10px;border-radius:999px}',
    P + ' .lz-typing{display:inline-flex;gap:4px;padding:10px 12px;background:#fff;border-radius:14px;border-top-left-radius:4px;margin-left:39px;box-shadow:0 1px 2px rgba(42,34,26,.08)}',
    P + ' .lz-typing i{width:6px;height:6px;border-radius:50%;background:var(--ink3);animation:' + NS + '-dot 1.4s ease-in-out infinite}',
    P + ' .lz-typing i:nth-child(2){animation-delay:.2s}', P + ' .lz-typing i:nth-child(3){animation-delay:.4s}',
    '@keyframes ' + NS + '-dot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}',

    /* ── 输入栏 / 表情包 ── */
    P + ' .lz-inbar{flex:none;display:flex;align-items:flex-end;gap:8px;padding:8px 10px 8px;background:var(--paper);border-top:1px solid var(--line);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}',
    P + ' .lz-ib{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none;font-size:19px;transition:background .15s}',
    P + ' .lz-ib:hover{background:rgba(0,0,0,.06)}', P + ' .lz-ib.on{background:var(--sky-soft)}',
    P + ' textarea.lz-in{flex:1;min-height:34px;max-height:96px;padding:7px 12px;border:1px solid var(--line);border-radius:17px;background:#fff;color:var(--ink);',
    'font-size:13.5px;line-height:1.4;resize:none;outline:none;font-family:inherit;-webkit-text-fill-color:var(--ink);color-scheme:light}',
    P + ' textarea.lz-in:focus{border-color:var(--sky)}',
    P + ' .lz-send{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#7BAFD4,#5B93D6);color:#fff;display:flex;align-items:center;justify-content:center;',
    'cursor:pointer;flex:none;font-size:15px;box-shadow:0 2px 6px rgba(91,147,214,.35);transition:transform .15s,opacity .15s}',
    P + ' .lz-send:hover{transform:scale(1.06)}', P + ' .lz-send.busy{opacity:.45;pointer-events:none}',
    P + ' .lz-stk{flex:none;display:none;height:220px;overflow-y:auto;padding:8px;background:rgba(250,246,238,.95);border-top:1px solid var(--line);scrollbar-width:thin}',
    P + ' .lz-stk.open{display:block}',
    P + ' .lz-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}',
    P + ' .lz-cell{aspect-ratio:1;border-radius:9px;overflow:hidden;cursor:pointer;background:#fff;display:flex;align-items:center;justify-content:center;',
    'box-shadow:0 1px 2px rgba(0,0,0,.06);transition:transform .12s,box-shadow .12s}',
    P + ' .lz-cell:hover{transform:scale(1.07);box-shadow:0 3px 10px rgba(0,0,0,.14)}',
    P + ' .lz-cell img{max-width:88%;max-height:88%;object-fit:contain}',
    P + ' ::-webkit-scrollbar{width:4px}', P + ' ::-webkit-scrollbar-thumb{background:rgba(42,34,26,.18);border-radius:2px}',

    /* ── 设置页 ── */
    P + ' .lz-gear{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;color:var(--ink2);flex:none}',
    P + ' .lz-gear:hover{background:rgba(0,0,0,.06)}',
    P + ' .lz-card{background:var(--paper);border:1px solid rgba(120,80,40,.10);border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:8px;',
    'box-shadow:0 1px 0 rgba(255,255,255,.4) inset;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}',
    P + ' .lz-card h3{margin:0;font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--ink2)}',
    P + ' .lz-card p{margin:0;font-size:11px;color:var(--ink3);line-height:1.5}',
    P + ' .lz-f{display:flex;flex-direction:column;gap:3px}',
    P + ' .lz-f label{font-size:11px;color:var(--ink2)}',
    P + ' .lz-f input{height:32px;padding:0 10px;border:1px solid var(--line);border-radius:9px;background:#fff;color:var(--ink);font-size:13px;font-family:inherit;outline:none;',
    '-webkit-text-fill-color:var(--ink);color-scheme:light;width:100%}',
    P + ' .lz-f input:focus{border-color:var(--sky)}',
    P + ' .lz-pills{display:flex;flex-wrap:wrap;gap:6px}',
    P + ' .lz-pill{padding:5px 11px;border-radius:999px;font-size:12px;cursor:pointer;background:#fff;border:1px solid var(--line);color:var(--ink2);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    P + ' .lz-pill.on{background:var(--sky);border-color:var(--sky);color:#fff}',
    P + ' .lz-btns{display:flex;gap:8px;flex-wrap:wrap}',
    P + ' .lz-btn{flex:1;min-width:90px;height:34px;border-radius:10px;border:1px solid var(--line);background:#fff;color:var(--ink);font-size:13px;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;font-family:inherit}',
    P + ' .lz-btn.pri{background:linear-gradient(135deg,#7BAFD4,#5B93D6);color:#fff;border-color:transparent}',
    P + ' .lz-btn.warn{color:#b5424f}',
    P + ' .lz-btn:disabled{opacity:.5}',
    P + ' .lz-note{font-size:11.5px;min-height:16px;color:var(--ink2)}',
    P + ' .lz-note.ok{color:var(--leaf)}', P + ' .lz-note.bad{color:#b5424f}'
  ].join('\n');

  // ══════════════════════════════════════
  //  §5  SVG：墙头探头的猫
  // ══════════════════════════════════════

  var CAT_SVG =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<defs>' +
    '<linearGradient id="lzWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6EFE1"/><stop offset=".55" stop-color="#EAE0CF"/><stop offset="1" stop-color="#C9C2DA"/></linearGradient>' +
    '<linearGradient id="lzFur" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3B36B"/><stop offset="1" stop-color="#D9853F"/></linearGradient>' +
    '<linearGradient id="lzRose" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7CDD3"/><stop offset="1" stop-color="#E69AA6"/></linearGradient>' +
    '</defs>' +
    '<path class="lz-star" d="M9 18l1.3 3.2L13.5 22.5 10.3 23.8 9 27l-1.3-3.2L4.5 22.5l3.2-1.3z" fill="#FFF3C4"/>' +
    '<path class="lz-star" d="M55 12l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="#FFF3C4"/>' +
    '<path class="lz-star" d="M50 30l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z" fill="#FFF3C4"/>' +
    '<rect x="4" y="41" width="56" height="17" rx="5" fill="url(#lzWall)"/>' +
    '<rect x="4" y="41" width="56" height="3.5" rx="1.5" fill="#FBF7EE"/>' +
    '<path d="M6 52c8-2 14 2 22 0s16-3 30 1" stroke="#B8B0D2" stroke-width="1.2" fill="none" opacity=".55"/>' +
    '<g class="lz-cat">' +
    '<path d="M19 30 L21 16 L30 25Z" fill="#D9853F"/><path d="M45 30 L43 16 L34 25Z" fill="#D9853F"/>' +
    '<path d="M21.5 27.5 L22.5 20 L27.5 25.5Z" fill="#F4C3B8"/><path d="M42.5 27.5 L41.5 20 L36.5 25.5Z" fill="#F4C3B8"/>' +
    '<ellipse cx="32" cy="32" rx="14" ry="12.5" fill="url(#lzFur)"/>' +
    '<path d="M28 21.5q4-2 8 0" stroke="#B9682A" stroke-width="1.6" stroke-linecap="round" fill="none"/>' +
    '<path d="M25 24.5q2-1.5 4.5-.5M34.5 24q2.5-1 4.5.5" stroke="#B9682A" stroke-width="1.4" stroke-linecap="round" fill="none"/>' +
    '<ellipse cx="32" cy="36.5" rx="7.5" ry="5" fill="#FBF3E7"/>' +
    '<g class="lz-eye-open"><ellipse cx="26.5" cy="31" rx="2.1" ry="2.6" fill="#2E2A25"/><ellipse cx="37.5" cy="31" rx="2.1" ry="2.6" fill="#2E2A25"/>' +
    '<circle cx="27.2" cy="30.1" r=".7" fill="#fff"/><circle cx="38.2" cy="30.1" r=".7" fill="#fff"/></g>' +
    '<g class="lz-eye-shut"><path d="M24.3 31.2q2.2 1.8 4.4 0M35.3 31.2q2.2 1.8 4.4 0" stroke="#2E2A25" stroke-width="1.5" stroke-linecap="round" fill="none"/></g>' +
    '<path d="M30.8 34.6h2.4l-1.2 1.4z" fill="#E7909C"/>' +
    '<path d="M32 36v1.2M32 37.2q-1.4 1.4-2.8.2M32 37.2q1.4 1.4 2.8.2" stroke="#B36A5A" stroke-width=".9" stroke-linecap="round" fill="none"/>' +
    '<path d="M22 35.5l-6-1M22 37.5l-6 1M42 35.5l6-1M42 37.5l6 1" stroke="#5A4A3A" stroke-width=".8" stroke-linecap="round" opacity=".7"/>' +
    '<rect x="21" y="39" width="8.5" height="6" rx="3" fill="#FBF3E7"/><rect x="34.5" y="39" width="8.5" height="6" rx="3" fill="#FBF3E7"/>' +
    '<path d="M23.5 44v-2M25.5 44v-2.3M27.5 44v-2M37 44v-2M39 44v-2.3M41 44v-2" stroke="#E0B8A0" stroke-width=".8" stroke-linecap="round"/>' +
    '</g>' +
    '<circle cx="53" cy="47" r="5" fill="url(#lzRose)"/><circle cx="53" cy="47" r="2.6" fill="#EFA9B5"/><circle cx="53" cy="47" r="1.1" fill="#D97F91"/>' +
    '<path d="M48 50q-4 1-5 4 4 0 5.5-3z" fill="#7FA84B"/><path d="M57.5 50.5q4 .5 4.5 3.5-3.5.5-5-2.5z" fill="#7FA84B"/>' +
    '<circle cx="11" cy="47" r="3.2" fill="url(#lzRose)"/><circle cx="11" cy="47" r="1.3" fill="#D97F91"/>' +
    '</svg>';

  // ══════════════════════════════════════
  //  §6  挂载
  // ══════════════════════════════════════

  var mounted = false, vvBound = null, clockTimer = null, chatTimer = null;
  var phoneOpen = false, currentScreen = 'lock', currentChatId = null, stickerOpen = false, generating = false, unread = 0;

  function mount() {
    if (mounted) return;
    unmount();

    var st = DOC.createElement('style'); st.id = NS + '-style'; st.textContent = CSS; DOC.head.appendChild(st);

    var ball = DOC.createElement('div'); ball.id = NS + '-ball'; ball.title = '手机';
    ball.innerHTML = '<span class="lz-halo"></span>' + CAT_SVG + '<span class="lz-badge"></span>';
    DOC.body.appendChild(ball);

    var panel = DOC.createElement('div'); panel.id = NS + '-panel';
    panel.innerHTML =
      '<div class="lz-screen">' +
        '<img class="lz-wall" alt="" data-i="0">' +
        '<div class="lz-shade"></div>' +
        '<div class="lz-notch"></div>' +
        '<div class="lz-rail"><span id="' + NS + '-time">' + hhmm() + '</span>' +
          '<span style="display:inline-flex;align-items:center"><span class="lz-sig"><i style="height:4px"></i><i style="height:6px"></i><i style="height:8px"></i><i style="height:10px;opacity:.35"></i></span>' +
          '<span class="lz-batt">78%<b><i></i></b></span><span class="lz-x" id="' + NS + '-x">✕</span></span></div>' +
        '<div class="lz-body" id="' + NS + '-body"></div>' +
        '<div class="lz-home" id="' + NS + '-homebar" title="回到首页"></div>' +
      '</div>';
    DOC.body.appendChild(panel);

    // 壁纸多域备胎
    var wall = panel.querySelector('.lz-wall');
    wall.onerror = function () {
      var i = parseInt(wall.dataset.i || '0', 10) + 1;
      if (i < WALL_SRCS.length) { wall.dataset.i = String(i); wall.src = WALL_SRCS[i]; }
      else { wall.style.display = 'none'; }
    };
    wall.src = WALL_SRCS[0];

    // 事件
    var lpt = null, moved = false;
    ball.addEventListener('click', function () { if (moved) { moved = false; return; } setOpen(!isOpen()); });
    ball.addEventListener('pointerdown', function () {
      lpt = setTimeout(function () { generating = false; currentScreen = 'lock'; setOpen(false); placeBall(); }, 1500);
    });
    ball.addEventListener('pointerup', function () { clearTimeout(lpt); });
    ball.addEventListener('pointerleave', function () { clearTimeout(lpt); });
    $('x').addEventListener('click', function () { setOpen(false); });
    $('homebar').addEventListener('click', function () { if (currentScreen !== 'lock') showScreen('home'); });

    mounted = true;
    placeBall();
    setTimeout(placeBall, 600);
    if (!vvBound) {
      vvBound = function () { setTimeout(reflow, 120); };
      try { if (VIEW.visualViewport) VIEW.visualViewport.addEventListener('resize', vvBound); } catch (e) {}
      try { VIEW.addEventListener('resize', vvBound); } catch (e) {}
      try { VIEW.addEventListener('orientationchange', vvBound); } catch (e) {}
    }
    if (!clockTimer) clockTimer = setInterval(tick, 30000);
    syncBadge();
  }
  function unmount() {
    ['-ball', '-panel', '-style'].forEach(function (s) {
      var el = DOC.getElementById(NS + s); if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    mounted = false;
  }
  function ensureMounted() { if (!$('ball') || !$('panel') || !$('style')) { mounted = false; mount(); } }
  function syncBadge() {
    var b = $('ball'); if (!b) return;
    b.classList.toggle('lit', unread > 0);
    var bd = b.querySelector('.lz-badge'); if (bd) bd.textContent = unread > 9 ? '9+' : String(unread);
  }
  function tick() {
    var t = $('time'); if (t) t.textContent = hhmm();
    var lt = $('lock-t'); if (lt) lt.textContent = hhmm();
  }

  // ══════════════════════════════════════
  //  §7  屏幕
  // ══════════════════════════════════════

  function body() { return $('body'); }

  function showLock() {
    currentScreen = 'lock';
    var now = new Date(), day = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()];
    body().innerHTML =
      '<div class="lz-lock" id="' + NS + '-lock">' +
        '<div class="lz-t" id="' + NS + '-lock-t">' + hhmm() + '</div>' +
        '<div class="lz-d">' + (now.getMonth() + 1) + '月' + now.getDate() + '日 星期' + day + '</div>' +
        '<div class="lz-hint"><b>\u{1F512} 轻触解锁</b></div>' +
      '</div>';
    $('lock').addEventListener('click', function () { showScreen('home'); });
  }

  function showScreen(name, id) {
    currentScreen = name; currentChatId = id || null; stickerOpen = false;
    if (name === 'home') renderHome();
    else if (name === 'chat') renderChat(id);
    else if (name === 'group') renderGroup(id);
    else if (name === 'settings') renderSettings();
    else showLock();
  }

  function renderSettings() {
    var c = cfg;
    var src = c.source || 'openai';
    body().innerHTML =
      '<div class="lz-nav"><div class="lz-back" id="' + NS + '-back">‹</div><h2>设置</h2></div>' +
      '<div class="lz-list" id="' + NS + '-set">' +
        '<div class="lz-card"><h3>手机专用 API</h3>' +
          '<p>留空 = 用酒馆当前接的模型。填了就走这里，手机聊天不占主线额度。</p>' +
          '<div class="lz-f"><label>API 地址</label><input id="' + NS + '-f-url" placeholder="https://api.example.com/v1" value="' + esc(c.apiurl || '') + '" autocomplete="off" name="lz-api-url"></div>' +
          '<div class="lz-f"><label>密钥</label><input id="' + NS + '-f-key" type="password" placeholder="sk-…" value="' + esc(c.key || '') + '" autocomplete="new-password" name="lz-api-key"></div>' +
          '<div class="lz-f"><label>接口类型</label><div class="lz-pills" id="' + NS + '-f-src">' +
            ['openai:OpenAI 兼容', 'claude:Claude', 'custom:自定义'].map(function (s) { var p = s.split(':'); return '<span class="lz-pill' + (src === p[0] ? ' on' : '') + '" data-v="' + p[0] + '">' + p[1] + '</span>'; }).join('') +
          '</div></div>' +
          '<div class="lz-f"><label>模型</label><input id="' + NS + '-f-model" placeholder="留空用默认" value="' + esc(c.model || '') + '" autocomplete="off" name="lz-api-model"></div>' +
          '<div class="lz-pills" id="' + NS + '-f-models"></div>' +
          '<div class="lz-f"><label>温度</label><input id="' + NS + '-f-temp" inputmode="decimal" value="' + esc(c.temperature) + '" autocomplete="off" name="lz-api-temp"></div>' +
          '<div class="lz-btns"><button class="lz-btn" id="' + NS + '-b-models">拉取模型列表</button><button class="lz-btn" id="' + NS + '-b-test">测试</button><button class="lz-btn pri" id="' + NS + '-b-save">保存</button></div>' +
          '<div class="lz-note" id="' + NS + '-note"></div>' +
        '</div>' +
        '<div class="lz-card"><h3>主线联动</h3>' +
          '<p>开着：手机里聊的内容会悄悄告诉主线 AI（带「仅当事人知晓」框），正文里角色会自然接上。关掉：手机和正文互不知情。</p>' +
          '<div class="lz-pills"><span class="lz-pill' + (c.inject !== false ? ' on' : '') + '" id="' + NS + '-inj-on">回灌主线</span><span class="lz-pill' + (c.inject === false ? ' on' : '') + '" id="' + NS + '-inj-off">不回灌</span></div>' +
        '</div>' +
        '<div class="lz-card"><h3>记录</h3><p>聊天记录存在当前聊天的变量里，换聊天各自独立。</p>' +
          '<div class="lz-btns"><button class="lz-btn warn" id="' + NS + '-b-clear">清空本聊天的手机记录</button></div>' +
        '</div>' +
      '</div>';

    $('back').addEventListener('click', function () { showScreen('home'); });
    var srcBox = $('f-src');
    srcBox.querySelectorAll('.lz-pill').forEach(function (p) {
      p.addEventListener('click', function () { srcBox.querySelectorAll('.lz-pill').forEach(function (q) { q.classList.remove('on'); }); p.classList.add('on'); });
    });
    function readForm() {
      var on = srcBox.querySelector('.lz-pill.on');
      var t = parseFloat($('f-temp').value);
      return { apiurl: $('f-url').value.trim(), key: $('f-key').value.trim(), model: $('f-model').value.trim(),
        source: on ? on.dataset.v : 'openai', temperature: isNaN(t) ? 1.1 : t, inject: cfg.inject !== false };
    }
    function note(t, cls) { var n = $('note'); n.textContent = t; n.className = 'lz-note ' + (cls || ''); }
    $('b-save').addEventListener('click', function () { saveCfg(readForm()); note('已保存', 'ok'); });
    $('b-models').addEventListener('click', async function () {
      var f = readForm(); if (!f.apiurl) { note('先填 API 地址', 'bad'); return; }
      note('拉取中…');
      try {
        var list = await getModelList({ apiurl: f.apiurl, key: f.key });
        var box = $('f-models'); box.innerHTML = '';
        if (!list || !list.length) { note('这个地址没返回模型列表，手填也行', 'bad'); return; }
        list.slice(0, 60).forEach(function (m) {
          var p = DOC.createElement('span'); p.className = 'lz-pill'; p.textContent = m; p.title = m;
          p.addEventListener('click', function () { $('f-model').value = m; box.querySelectorAll('.lz-pill').forEach(function (q) { q.classList.remove('on'); }); p.classList.add('on'); });
          box.appendChild(p);
        });
        note('共 ' + list.length + ' 个模型，点一个填入', 'ok');
      } catch (e) { note('拉取失败：' + (e && e.message ? e.message : e), 'bad'); }
    });
    $('b-test').addEventListener('click', async function () {
      saveCfg(readForm()); note('测试中…');
      var t0 = Date.now();
      try {
        var req = { ordered_prompts: [{ role: 'system', content: '只回复两个字：收到' }, { role: 'user', content: '在吗' }], should_silence: true, max_chat_history: 0 };
        var api = customApi(); if (api) req.custom_api = api;
        var r = await generateRaw(req);
        var txt = typeof r === 'string' ? r : (r && r.content) || '';
        note(txt ? '通了（' + ((Date.now() - t0) / 1000).toFixed(1) + 's）：' + txt.trim().slice(0, 40) : '有响应但内容为空', txt ? 'ok' : 'bad');
      } catch (e) { note('失败：' + (e && e.message ? e.message : e), 'bad'); }
    });
    $('inj-on').addEventListener('click', function () { var f = readForm(); f.inject = true; saveCfg(f); $('inj-on').classList.add('on'); $('inj-off').classList.remove('on'); refreshInjection(); });
    $('inj-off').addEventListener('click', function () { var f = readForm(); f.inject = false; saveCfg(f); $('inj-off').classList.add('on'); $('inj-on').classList.remove('on'); refreshInjection(); });
    $('b-clear').addEventListener('click', async function () {
      if (!VIEW.confirm('清空这个聊天里的全部手机记录？')) return;
      await updatePhone(function (p) { Object.keys(p).forEach(function (k) { if (k.indexOf('h_') === 0) delete p[k]; }); });
      refreshInjection(); note('已清空', 'ok');
    });
  }

  function preview(t) { return t.replace(/<bqb>(.*?)<\/bqb>/g, '[表情]').substring(0, 28); }

  function renderHome() {
    var h = '<div class="lz-nav"><h2>微信</h2><small>' + (CONTACTS.length + GROUPS.length) + ' 个会话</small><div class="lz-gear" id="' + NS + '-gear" title="设置">⚙</div></div><div class="lz-list">';
    h += '<div class="lz-sec">群聊</div>';
    GROUPS.forEach(function (g) {
      var hist = getHistory('g_' + g.id), last = hist[hist.length - 1];
      var pv = last ? (last.sender === 'user' ? '我' : (last.senderName || '?')) + '：' + preview(last.text) : g.desc;
      h += '<div class="lz-item" data-a="group" data-id="' + g.id + '"><div class="lz-av g">' + g.icon + '</div>' +
        '<div><div class="lz-nm">' + esc(g.name) + '</div><div class="lz-pv">' + esc(pv) + '</div></div>' +
        '<div class="lz-tm">' + (last ? esc(last.time || '') : '') + '</div></div>';
    });
    h += '<div class="lz-sec">联系人</div>';
    CONTACTS.forEach(function (c) {
      var hist = getHistory(c.id), last = hist[hist.length - 1];
      var pv = last ? (last.sender === 'user' ? '我：' : '') + preview(last.text) : c.relation;
      h += '<div class="lz-item" data-a="chat" data-id="' + c.id + '"><div class="lz-av" style="background-image:url(\'' + catUrl(c.avatar) + '\')"></div>' +
        '<div><div class="lz-nm">' + esc(c.name) + '</div><div class="lz-pv">' + esc(pv) + '</div></div>' +
        '<div class="lz-tm">' + (last ? esc(last.time || '') : '') + '</div></div>';
    });
    h += '</div>';
    body().innerHTML = h;
    body().querySelectorAll('.lz-item').forEach(function (el) {
      el.addEventListener('click', function () { showScreen(el.dataset.a, el.dataset.id); });
    });
    $('gear').addEventListener('click', function () { showScreen('settings'); });
  }

  function renderChatUI(title, sub, chatId, sendFn) {
    body().innerHTML =
      '<div class="lz-nav"><div class="lz-back" id="' + NS + '-back">‹</div><h2>' + esc(title) + '</h2><small>' + esc(sub || '') + '</small></div>' +
      '<div class="lz-chat" id="' + NS + '-chat"></div>' +
      '<div class="lz-stk" id="' + NS + '-stk"><div class="lz-grid" id="' + NS + '-grid"></div></div>' +
      '<div class="lz-inbar"><div class="lz-ib" id="' + NS + '-stkbtn" title="表情包">\u{1F600}</div>' +
        '<textarea class="lz-in" id="' + NS + '-in" rows="1" placeholder="发消息…" autocomplete="off" name="lz-msg"></textarea>' +
        '<div class="lz-send' + (generating ? ' busy' : '') + '" id="' + NS + '-send">➤</div></div>';
    renderMessages(chatId);
    renderStickers();
    $('back').addEventListener('click', function () { showScreen('home'); });
    $('send').addEventListener('click', sendFn);
    $('stkbtn').addEventListener('click', function () {
      stickerOpen = !stickerOpen;
      $('stk').classList.toggle('open', stickerOpen);
      $('stkbtn').classList.toggle('on', stickerOpen);
    });
    var input = $('in');
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendFn(); } });
    input.addEventListener('input', function () { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 96) + 'px'; });
  }
  function renderChat(cid) {
    var c = findContact(cid); if (!c) return showScreen('home');
    renderChatUI(c.name, c.relation, cid, function () { sendPrivate(cid); });
  }
  function renderGroup(gid) {
    var g = findGroup(gid); if (!g) return showScreen('home');
    renderChatUI(g.name, (g.members.length + 1) + ' 人', 'g_' + gid, function () { sendGroup(gid); });
  }

  function renderMessages(chatId) {
    var area = $('chat'); if (!area) return;
    var hist = getHistory(chatId);
    area.innerHTML = hist.length ? hist.map(msgHtml).join('') : '<div class="lz-sys"><span>还没有消息，说点什么吧</span></div>';
    area.scrollTop = area.scrollHeight;
  }
  function msgHtml(m) {
    var me = m.sender === 'user';
    var c = me ? null : findContact(m.sender);
    var av = m.avatar ? 'background-image:url(\'' + catUrl(m.avatar) + '\')' : '';
    var sn = (!me && m.senderName) ? '<div class="lz-sn" style="color:' + (c ? c.theme : '#6a5d50') + '">' + esc(m.senderName) + '</div>' : '';
    var bqb = m.text.match(/^<bqb>(.*?)<\/bqb>$/), inner;
    if (bqb && STICKERS[bqb[1]]) inner = '<div class="lz-bub stk"><img src="' + catUrl(STICKERS[bqb[1]]) + '" alt="' + esc(bqb[1]) + '" loading="lazy"></div>';
    else inner = '<div class="lz-bub">' + esc(bqbToText(m.text)) + '</div>';
    return '<div class="lz-msg' + (me ? ' me' : '') + '"><div class="lz-ma" style="' + av + '"></div><div class="lz-mb">' + sn + inner +
      '<div class="lz-mt">' + esc(m.time || '') + '</div></div></div>';
  }
  function appendMsg(m) {
    var area = $('chat'); if (!area) return;
    var e = area.querySelector('.lz-sys'); if (e) e.remove();
    area.insertAdjacentHTML('beforeend', m.sender === 'system' ? '<div class="lz-sys"><span>' + esc(m.text) + '</span></div>' : msgHtml(m));
    area.scrollTop = area.scrollHeight;
  }
  function showTyping() { var a = $('chat'); if (a) { a.insertAdjacentHTML('beforeend', '<div class="lz-typing" id="' + NS + '-typing"><i></i><i></i><i></i></div>'); a.scrollTop = a.scrollHeight; } }
  function hideTyping() { var t = $('typing'); if (t) t.remove(); }
  function renderStickers() {
    var grid = $('grid'); if (!grid) return;
    grid.innerHTML = STICKER_NAMES.map(function (n) {
      return '<div class="lz-cell" title="' + esc(n) + '" data-n="' + esc(n) + '"><img src="' + catUrl(STICKERS[n]) + '" alt="' + esc(n) + '" loading="lazy"></div>';
    }).join('');
    grid.querySelectorAll('.lz-cell').forEach(function (el) { el.addEventListener('click', function () { sendSticker(el.dataset.n); }); });
  }
  function closeStickers() { stickerOpen = false; var s = $('stk'), b = $('stkbtn'); if (s) s.classList.remove('open'); if (b) b.classList.remove('on'); }
  function setBusy(on) { generating = on; var s = $('send'); if (s) s.classList.toggle('busy', on); }

  // ══════════════════════════════════════
  //  §8  发送 / 生成
  // ══════════════════════════════════════

  function takeInput() {
    var input = $('in'); var t = (input ? input.value : '').trim();
    if (!t) return '';
    input.value = ''; input.style.height = 'auto'; closeStickers();
    return t;
  }
  function pushUser(chatId, text) {
    var hist = getHistory(chatId);
    var m = { sender: 'user', text: text, time: hhmm() };
    hist.push(m); appendMsg(m);
    return hist;
  }
  function noteArrival() { if (!isOpen()) { unread++; syncBadge(); } }

  async function sendPrivate(cid) {
    if (generating) return;
    var text = takeInput(); if (!text) return;
    var c = findContact(cid);
    var hist = pushUser(cid, text);
    await saveHistory(cid, hist);
    setBusy(true); showTyping();
    try {
      var reply = await generatePrivate(c, hist);
      hideTyping();
      if (!reply) { appendMsg({ sender: 'system', text: c.name + '暂时没回，再发一条试试' }); }
      var lines = reply.split('\n').map(function (l) {
        return l.replace(new RegExp('^\\s*' + c.name + '\\s*[:：]\\s*'), '').replace(/^\s*[-•·]\s*/, '').trim();
      }).filter(Boolean).slice(0, 4);
      for (var i = 0; i < lines.length; i++) {
        var m = { sender: c.id, senderName: c.name, avatar: c.avatar, text: lines[i], time: hhmm() };
        hist.push(m); if (currentChatId === cid && currentScreen === 'chat') appendMsg(m);
        noteArrival();
        if (i < lines.length - 1) await sleep(350);
      }
      await saveHistory(cid, hist);
      refreshInjection();
    } catch (e) { hideTyping(); appendMsg({ sender: 'system', text: '发送失败，请重试' }); console.log('[霖州手机]', e); }
    setBusy(false);
  }

  async function sendGroup(gid) {
    if (generating) return;
    var text = takeInput(); if (!text) return;
    var g = findGroup(gid), chatId = 'g_' + gid;
    var hist = pushUser(chatId, text);
    await saveHistory(chatId, hist);
    setBusy(true); showTyping();
    try {
      var reply = await generateGroup(g, hist);
      hideTyping();
      var got = 0;
      var lines = reply.split('\n');
      for (var i = 0; i < lines.length && got < 7; i++) {
        var line = lines[i].replace(/^\s*[-•·]\s*/, '').trim(); if (!line) continue;
        var k = line.search(/[:：]/); if (k <= 0 || k > 8) continue;
        var name = line.substring(0, k).replace(/[\[\]【】]/g, '').trim(), body = line.substring(k + 1).trim();
        if (!body) continue;
        var c = contactByName(name); if (!c) continue;
        var m = { sender: c.id, senderName: c.name, avatar: c.avatar, text: body, time: hhmm() };
        hist.push(m); if (currentChatId === gid && currentScreen === 'group') appendMsg(m);
        noteArrival(); got++;
        await sleep(420);
      }
      if (!got) appendMsg({ sender: 'system', text: '群里没人接话，再发一条试试' });
      await saveHistory(chatId, hist);
      refreshInjection();
    } catch (e) { hideTyping(); appendMsg({ sender: 'system', text: '发送失败，请重试' }); console.log('[霖州手机]', e); }
    setBusy(false);
  }

  function sendSticker(name) {
    if (!currentChatId || generating) return;
    closeStickers();
    var chatId = currentScreen === 'group' ? 'g_' + currentChatId : currentChatId;
    var hist = pushUser(chatId, '<bqb>' + name + '</bqb>');
    saveHistory(chatId, hist);
  }

  // ─── Prompt ───
  function histText(hist, n) {
    return hist.slice(-n).map(function (m) {
      return (m.sender === 'user' ? '{{user}}' : (m.senderName || '?')) + '：' + m.text.replace(/<bqb>(.*?)<\/bqb>/g, '[表情包：$1]');
    }).join('\n');
  }
  function mainContext() {
    try {
      var msgs = getChatMessages('0-{{lastMessageId}}'); if (!msgs || !msgs.length) return '';
      return msgs.slice(-8).map(function (m) {
        var t = (m.message || '').replace(/```[\s\S]*?```/g, '').replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/<[^>]+>/g, '').trim();
        if (t.length > 320) t = t.substring(0, 320) + '…';
        return (m.role === 'user' ? '{{user}}' : '旁白') + '：' + t;
      }).filter(function (l) { return l.length > 4; }).join('\n');
    } catch (e) { return ''; }
  }
  function stickerHint(n) { return STICKER_NAMES.slice(0, n).join('、') + '……（还有更多，名字要一字不差）'; }

  async function generatePrivate(c, hist) {
    var ctx = mainContext();
    var p = '你正在扮演校园故事《霖州往事》里的「' + c.name + '」，通过微信私聊回复{{user}}。\n\n' +
      '【' + c.name + '的说话方式】\n' + c.voice + '\n\n' +
      (ctx ? '【主线剧情（最近发生的事，手机聊天要接得上）】\n' + ctx + '\n\n' : '') +
      '【微信聊天记录】\n' + histText(hist, 14) + '\n\n' +
      '【输出规则】\n' +
      '- 只写' + c.name + '发出的新消息，1～3 条，每条一行，只写消息内容\n' +
      '- 每条不超过 35 字，像真人打字，不复述{{user}}的话\n' +
      '- 想发表情包时单独一行写 <bqb>表情包名</bqb>，可选：' + stickerHint(30) + '\n' +
      '- 不要角色名前缀、不要时间戳、不要旁白动作、不要括号里的心理描写\n' +
      '【务必直接输出消息，严禁在开头输出"好的"等废话。】';
    return await phoneGenerate(p);
  }
  async function generateGroup(g, hist) {
    var ctx = mainContext();
    var names = g.members.map(function (id) { var c = findContact(id); return c ? c.name : id; });
    var voices = g.members.map(function (id) { var c = findContact(id); return c ? '· ' + c.name + '：' + c.voice : ''; }).filter(Boolean).join('\n');
    var p = '你正在模拟校园故事《霖州往事》里的微信群「' + g.name + '」。群成员：' + names.join('、') + '、{{user}}。\n\n' +
      '【各人说话方式】\n' + voices + '\n\n' +
      (ctx ? '【主线剧情（最近发生的事）】\n' + ctx + '\n\n' : '') +
      '【群聊记录】\n' + histText(hist, 18) + '\n\n' +
      '【输出规则】\n' +
      '- 输出 2～5 条群成员的新消息，每条一行，格式严格为「角色名：消息」\n' +
      '- 不必人人都说话，谁会接这句谁说；可以互相接梗、互相拆台\n' +
      '- 每条不超过 35 字，像真人在群里打字\n' +
      '- 想发表情包写「角色名：<bqb>表情包名</bqb>」，可选：' + stickerHint(20) + '\n' +
      '- 不要生成{{user}}的消息，不要旁白，不要时间戳\n' +
      '【务必直接输出消息，严禁在开头输出"好的"等废话。】';
    return await phoneGenerate(p);
  }

  // ══════════════════════════════════════
  //  §9  三件套：脚本按钮逃生阀 / 切卡补建 / 收摊
  // ══════════════════════════════════════

  try {
    if (typeof appendInexistentScriptButtons === 'function') appendInexistentScriptButtons([{ name: BTN, visible: true }]);
    var ev = getButtonEvent(BTN);
    if (typeof eventClearEvent === 'function') eventClearEvent(ev);
    eventOn(ev, function () {
      if (!$('ball')) { ensureMounted(); placeBall(); return; }
      placeBall();
      setOpen(!isOpen());
    });
  } catch (e) { console.log('[霖州手机] 脚本按钮注册失败', e); }

  try {
    eventOn(tavern_events.CHAT_CHANGED, function () {
      setOpen(false); currentScreen = 'lock'; currentChatId = null;
      clearTimeout(chatTimer);
      chatTimer = setTimeout(function () { ensureMounted(); placeBall(); refreshInjection(); }, 400);
    });
  } catch (e) {}

  function cleanup() {
    unmount();
    if (clockTimer) { clearInterval(clockTimer); clockTimer = null; }
    if (chatTimer) { clearTimeout(chatTimer); chatTimer = null; }
    if (vvBound) {
      try { if (VIEW.visualViewport) VIEW.visualViewport.removeEventListener('resize', vvBound); } catch (e) {}
      try { VIEW.removeEventListener('resize', vvBound); } catch (e) {}
      try { VIEW.removeEventListener('orientationchange', vvBound); } catch (e) {}
      vvBound = null;
    }
    try { uninjectPrompts([INJ_ID]); } catch (e) {}
    try { if (VIEW.__lzPhoneLease === cleanup) VIEW.__lzPhoneLease = null; } catch (e) {}
  }
  VIEW.__lzPhoneLease = cleanup;
  window.addEventListener('pagehide', cleanup);
  window.addEventListener('unload', cleanup);

  mount();
  refreshInjection();
  console.log('[霖州往事·悬浮手机] v1.1 已加载');
})();
