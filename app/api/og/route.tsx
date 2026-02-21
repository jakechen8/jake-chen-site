import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Jake Chen'
  const subtitle =
    searchParams.get('subtitle') ||
    'Building autonomous systems at Waymo. Writing about trust, autonomy, and AI.'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#09090B',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '2px',
              backgroundColor: '#2563EB',
            }}
          />
          <span
            style={{
              fontSize: '13px',
              fontFamily: 'system-ui, sans-serif',
              color: '#60A5FA',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Jake Chen
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: title.length > 60 ? '44px' : '56px',
              lineHeight: '1.15',
              color: '#FAFAFA',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                fontSize: '22px',
                color: '#A1A1AA',
                lineHeight: '1.5',
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                maxWidth: '800px',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Bottom */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #27272A',
            paddingTop: '24px',
          }}
        >
          <span
            style={{
              fontSize: '15px',
              color: '#71717A',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            jake-chen.com
          </span>
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            {['Trust', 'Autonomy', 'AI Systems'].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '4px 12px',
                  borderRadius: '100px',
                  border: '1px solid #27272A',
                  fontSize: '12px',
                  color: '#71717A',
                  fontFamily: 'system-ui, sans-serif',
                  letterSpacing: '0.06em',
                }}
              >
                {tag}
              </div>
            ))}
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
