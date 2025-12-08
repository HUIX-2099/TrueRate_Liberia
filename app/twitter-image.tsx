import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'TrueRate Liberia - Live USD/LRD Exchange Rates'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(22, 163, 74, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
            display: 'flex',
          }}
        />
        
        {/* Liberia Flag Colors - Top Border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            display: 'flex',
          }}
        >
          <div style={{ flex: 1, backgroundColor: '#bf0a30', display: 'flex' }} />
          <div style={{ flex: 1, backgroundColor: '#ffffff', display: 'flex' }} />
          <div style={{ flex: 1, backgroundColor: '#002868', display: 'flex' }} />
        </div>

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
          }}
        >
          {/* Logo/Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                backgroundColor: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
                boxShadow: '0 8px 32px rgba(22, 163, 74, 0.4)',
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span
                style={{
                  fontSize: '56px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  letterSpacing: '-2px',
                }}
              >
                TrueRate
              </span>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: '500',
                  color: '#22c55e',
                  letterSpacing: '4px',
                  marginTop: '-8px',
                }}
              >
                LIBERIA
              </span>
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '32px',
              color: '#a1a1aa',
              marginBottom: '40px',
              textAlign: 'center',
              display: 'flex',
            }}
          >
            #1 USD/LRD Exchange Rate Platform
          </div>

          {/* Rate Display */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '24px',
              padding: '30px 60px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '16px',
              }}
            >
              <span style={{ fontSize: '28px', color: '#71717a', display: 'flex' }}>$1 USD =</span>
              <span style={{ fontSize: '72px', fontWeight: 'bold', color: '#22c55e', display: 'flex' }}>198.50</span>
              <span style={{ fontSize: '28px', color: '#71717a', display: 'flex' }}>LRD</span>
            </div>
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginTop: '50px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'flex' }} />
              <span style={{ fontSize: '20px', color: '#d4d4d8', display: 'flex' }}>Real-Time Rates</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'flex' }} />
              <span style={{ fontSize: '20px', color: '#d4d4d8', display: 'flex' }}>AI Predictions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex' }} />
              <span style={{ fontSize: '20px', color: '#d4d4d8', display: 'flex' }}>100+ Sources</span>
            </div>
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '22px', color: '#71717a', display: 'flex' }}>truerateliberia.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

