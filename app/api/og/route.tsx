import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Jake Chen'
  const subtitle =
    searchParams.get('subtitle') ||
    'Strategy lead at Waymo. Writing about how AI reshapes decisions, organizations, and the systems that run them.'
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []

  const isHomepage = title === 'Jake Chen'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#0A0A0F',
        }}
      >
        {/* Background gradient mesh */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-80px',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(180,83,9,0.15) 0%, rgba(217,119,6,0.05) 40%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-200px',
            left: '-100px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(217,119,6,0.1) 0%, rgba(217,119,6,0.03) 40%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Subtle grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            display: 'flex',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '80px',
            right: '80px',
            height: '3px',
            background:
              'linear-gradient(90deg, #B45309 0%, #D97706 50%, transparent 100%)',
            display: 'flex',
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 80px 56px',
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Top section - name badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Monogram circle */}
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '22px',
                background: 'linear-gradient(135deg, #B45309, #D97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 600,
                color: '#FFFFFF',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              JC
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#E4E4E7',
                  fontFamily: 'system-ui, sans-serif',
                  letterSpacing: '0.01em',
                }}
              >
                Jake Chen
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: '#71717A',
                  fontFamily: 'system-ui, sans-serif',
                  letterSpacing: '0.02em',
                }}
              >
                jake-chen.com
              </span>
            </div>
          </div>

          {/* Main title area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              maxWidth: '960px',
            }}
          >
            <div
              style={{
                fontSize: isHomepage
                  ? '72px'
                  : title.length > 60
                  ? '42px'
                  : title.length > 40
                  ? '48px'
                  : '54px',
                lineHeight: isHomepage ? '1.05' : '1.18',
                color: '#FAFAFA',
                fontWeight: isHomepage ? 700 : 600,
                letterSpacing: '-0.03em',
                fontFamily: 'Georgia, serif',
              }}
            >
              {title}
            </div>

            {subtitle && (
              <div
                style={{
                  fontSize: '20px',
                  color: '#A1A1AA',
                  lineHeight: '1.55',
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 400,
                  maxWidth: '780px',
                  letterSpacing: '0.005em',
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Credential pills */}
              {isHomepage ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      background: 'rgba(180,83,9,0.12)',
                      border: '1px solid rgba(180,83,9,0.2)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#FCD34D',
                        fontFamily: 'system-ui, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Waymo
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#A1A1AA',
                        fontFamily: 'system-ui, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      AI Strategy
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#A1A1AA',
                        fontFamily: 'system-ui, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Builder
                    </span>
                  </div>
                </>
              ) : (
                // Article tags
                tags.slice(0, 3).map((tag) => (
                  <div
                    key={tag}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#A1A1AA',
                        fontFamily: 'system-ui, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      {tag.trim()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Right side - decorative accent */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: '#B45309',
                  display: 'flex',
                }}
              />
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: '#D97706',
                  display: 'flex',
                }}
              />
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: '#F59E0B',
                  display: 'flex',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
