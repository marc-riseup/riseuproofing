/**
 * The page sky: one fixed full-viewport layer behind everything.
 * Five stacked gradient layers are cross-faded by opacity (never animated gradients) by
 * components/motion/Director.tsx. Without JS or with reduced motion it stays at morning.
 */

const W = 2400;
const H = 120;

/* Warm neighborhood windows & coastal lights across the San Diego horizon silhouette */
const FRONT_WINDOWS = [
  { x: 210, y: H - 15, w: 10, h: 7 },
  { x: 224, y: H - 15, w: 8, h: 7 },
  { x: 486, y: H - 18, w: 11, h: 8 },
  { x: 742, y: H - 14, w: 9, h: 6 },
  { x: 755, y: H - 14, w: 9, h: 6 },
  { x: 1150, y: H - 13, w: 12, h: 8 },
  { x: 1166, y: H - 13, w: 8, h: 8 },
  { x: 1480, y: H - 17, w: 11, h: 7 },
  { x: 1790, y: H - 14, w: 10, h: 7 },
  { x: 2085, y: H - 16, w: 12, h: 7 },
];

const MID_WINDOWS = [
  { x: 360, y: H - 22, w: 7, h: 5 },
  { x: 920, y: H - 24, w: 8, h: 5 },
  { x: 1330, y: H - 21, w: 7, h: 5 },
  { x: 1640, y: H - 23, w: 8, h: 5 },
  { x: 1950, y: H - 20, w: 7, h: 5 },
];

export function Sky() {
  return (
    <div className="sky" aria-hidden="true">
      <div className="sky__layer sky__layer--morning" data-sky="morning" />
      <div className="sky__layer sky__layer--midday" data-sky="midday" />
      <div className="sky__layer sky__layer--golden" data-sky="golden" />
      <div className="sky__layer sky__layer--dusk" data-sky="dusk" />
      <div className="sky__layer sky__layer--night" data-sky="night">
        <span className="sky__twinkle sky__twinkle--a" />
        <span className="sky__twinkle sky__twinkle--b" />
        <span className="sky__meteor" />
      </div>

      <div className="sky__orb" data-sky="orb">
        <span className="sky__sun" data-sky="sun">
          <span className="sky__sun-corona" />
          <span className="sky__sun-core" />
        </span>
        <span className="sky__moon" data-sky="moon">
          <span className="sky__moon-halo" />
          <span className="sky__moon-disc" />
        </span>
      </div>

      {/* Two cloud depths: far (small, slow, faint) and near (larger, a little faster) */}
      <div className="sky__clouds" data-sky="clouds">
        <span className="cloud cloud--far cloud--f1" />
        <span className="cloud cloud--far cloud--f2" />
        <span className="cloud cloud--far cloud--f3" />
        <span className="cloud cloud--near cloud--n1" />
        <span className="cloud cloud--near cloud--n2" />
      </div>

      <div className="sky__horizon">
        {(['back', 'mid', 'front'] as const).map((k) => (
          <div key={k} className={`horizon__layer horizon__layer--${k}`} data-horizon={k}>
            <svg className="horizon" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice">
              <defs>
                <path id={`hz-${k}`} />
              </defs>
              <use className="horizon--day" href={`#hz-${k}`} />
              <use className="horizon--night" data-sky="horizon-night" href={`#hz-${k}`} />
              {k === 'mid' && (
                <g className="horizon__windows" data-sky="window">
                  {MID_WINDOWS.map((w, i) => (
                    <rect
                      key={i}
                      className="horizon__window horizon__window--mid"
                      x={w.x}
                      y={w.y}
                      width={w.w}
                      height={w.h}
                      rx="1"
                    />
                  ))}
                </g>
              )}
              {k === 'front' && (
                <g className="horizon__windows" data-sky="window">
                  {FRONT_WINDOWS.map((w, i) => (
                    <rect
                      key={i}
                      className="horizon__window"
                      x={w.x}
                      y={w.y}
                      width={w.w}
                      height={w.h}
                      rx="1.5"
                    />
                  ))}
                </g>
              )}
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
