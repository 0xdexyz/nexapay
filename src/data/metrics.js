export const COLS = 36;
export const ROWS = 12;
export const DEFAULT_COL = 12;

export const METRICS = [
  { key:'exec', icon:'✓', label:'Card transactions', value:'320', change:'+12%', down:false, seed:0, scale:1, ticks:[400,300,200,100], prefix:'', suffix:'', precision:0, selected:320 },
  { key:'fail', icon:'✕', label:'Crypto spent', value:'$28.4K', change:'+8.6%', down:false, seed:1.45, scale:0.62, ticks:[100,75,50,25], prefix:'$', suffix:'K', precision:1, selected:28.4 },
  { key:'rate', icon:'%', label:'Active cards', value:'2.4K', change:'+14%', down:false, seed:2.6, scale:0.55, ticks:[20,15,10,5], prefix:'', suffix:'K', precision:1, selected:2.4 },
  { key:'time', icon:'⏰', label:'Avg. transaction', value:'$86.40', change:'-3.2%', down:true, seed:3.85, scale:0.75, ticks:[24,18,12,6], prefix:'$', suffix:'', precision:2, selected:86.4 }
];

function clamp(v, min, max){ return Math.min(Math.max(v, min), max); }

function buildColumns(metric){
  const peaks = [3,7,11,14,17,20,23,26,29,32];
  const cols = [];
  for(let i=0;i<COLS;i++){
    const baseline = 1.6 + Math.sin(i*0.58+metric.seed)*0.6 + Math.sin(i*1.24+metric.seed*0.75)*0.4;
    let peakH = 0;
    for(let p=0;p<peaks.length;p++){
      const width = 0.9 + ((p+Math.round(metric.seed))%3)*0.2;
      const amp = 2.6 + ((p*3+Math.round(metric.seed*3))%4);
      peakH += amp*Math.exp(-Math.pow(i-peaks[p],2)/(2*width*width));
    }
    const height = clamp(Math.round((baseline+peakH)*metric.scale), 2, 9);
    const secondary = clamp(height + 1 + Math.round((Math.sin(i*0.37+metric.seed)+1)*1.2), height+1, ROWS);
    const wave = Math.sin(i*0.41+metric.seed);
    let value;
    if(metric.key==='exec') value = 95+height*24+wave*9;
    else if(metric.key==='fail') value = 8+height*5.4+wave*2;
    else if(metric.key==='rate') value = 0.8+height*0.72+wave*0.35;
    else value = 42+height*7.5+wave*4;
    cols.push({
      height, secondary,
      value: i===DEFAULT_COL ? metric.selected : Number(value.toFixed(metric.precision))
    });
  }
  return cols;
}

export const DATA = {};
METRICS.forEach((m) => { DATA[m.key] = buildColumns(m); });

export function dateForCol(i){
  if(i===DEFAULT_COL) return new Date(2026,8,20);
  const d = new Date(2026,0,1);
  d.setDate(1+Math.round((i/(COLS-1))*364));
  return d;
}

export const fmtLong = new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'});
