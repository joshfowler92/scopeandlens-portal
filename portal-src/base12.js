/* ═══════════ v12 shared state ═══════════ */
let DEMO_MODE=false;          /* true while a new user explores the example agency */
let REAL_S=null;              /* their own workspace, kept safe while the demo is open */
function isPremium(){try{return !!(DEMO_MODE||(S&&S.setup&&S.setup.premium)||(SESSION&&SESSION.role==='admin'))}catch(e){return false}}
