import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import './index.css';

// Load generated 3D model
function LoadedModel({ url }) {
  const { scene } = useGLTF(url);
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={meshRef} object={scene} />;
}

function App() {
  const [activeTab, setActiveTab] = useState('character');
  const [inputMode, setInputMode] = useState('text');
  const [prompt, setPrompt] = useState('');
  const [generated3D, setGenerated3D] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [modelColor, setModelColor] = useState('#22d3ee');

  const handleGenerate = async () => {
    setGenerating(true);
    setProgress(0);
    setProgressMessage('Initializing...');

    try {
      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt || `A high-quality ${activeTab}`,
          type: activeTab,
          features: {
            pbr_textures: true,
            auto_rigging: activeTab === 'character',
            retopology: true,
            watertight: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('Backend not responding. Make sure server is running on port 8000');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n').filter(l => l.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);

            if (data.stage === 'error') {
              throw new Error(data.message);
            }

            if (data.progress !== undefined) {
              setProgress(data.progress);
              setProgressMessage(data.message || '');
            }

            if (data.stage === 'complete' && data.file) {
              // Download the GLB file
              const fileResponse = await fetch(`http://localhost:8000/api/download/${data.file.split('/').pop()}`);
              const blob = await fileResponse.blob();
              const modelUrl = URL.createObjectURL(blob);

              setGenerated3D({
                type: activeTab,
                prompt: prompt || `Generated ${activeTab}`,
                modelUrl: modelUrl,
                timestamp: new Date().toISOString()
              });
            }
          } catch (e) {
            console.warn('Parse error:', e);
          }
        }
      }
    } catch (error) {
      alert('Generation failed: ' + error.message + '\n\nMake sure the backend server is running:\ncd backend\npython server.py');
      console.error(error);
    } finally {
      setGenerating(false);
      setProgress(0);
      setProgressMessage('');
    }
  };

  const handleExport = () => {
    if (!generated3D?.modelUrl) return;

    // Download the GLB file
    const a = document.createElement('a');
    a.href = generated3D.modelUrl;
    a.download = `aetherforge_${activeTab}_${Date.now()}.glb`;
    a.click();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e1a',
      color: '#fff',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
    }}>
      {/* Animated Grid Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        zIndex: -1,
        animation: 'gridScroll 20s linear infinite'
      }} />

      {/* Header */}
      <header style={{
        background: 'rgba(10, 14, 26, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(34, 211, 238, 0.3)',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 0 30px rgba(34, 211, 238, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#22d3ee',
              textShadow: '0 0 20px rgba(34, 211, 238, 0.5)',
              marginBottom: '0.25rem',
              letterSpacing: '0.1em'
            }}>
              AETHERFORGE NEXUS
            </h1>
            <p style={{ fontSize: '0.7rem', color: '#22d3ee', opacity: 0.7 }}>
              V15.3 • OPEN-SOURCE LOCAL AI • ZERO COST
            </p>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#22d3ee', opacity: 0.8 }}>
            Backend: {generating ? '🟢 Processing' : '🟢 Ready'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[
            { id: 'character', icon: '👤', label: 'CHARACTER' },
            { id: 'asset', icon: '🎨', label: 'ASSET' },
            { id: 'environment', icon: '🌍', label: 'ENVIRONMENT' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(59, 130, 246, 0.2))'
                  : 'rgba(15, 23, 42, 0.5)',
                border: `1px solid ${activeTab === tab.id ? '#22d3ee' : 'rgba(51, 65, 85, 0.5)'}`,
                borderRadius: '0.5rem',
                color: activeTab === tab.id ? '#22d3ee' : '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                transition: 'all 0.3s',
                boxShadow: activeTab === tab.id ? '0 0 20px rgba(34, 211, 238, 0.3)' : 'none'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '1.5rem' }}>
          {/* Control Panel */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(34, 211, 238, 0.2)',
            borderRadius: '1rem',
            padding: '1.5rem',
            height: 'fit-content'
          }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#22d3ee', letterSpacing: '0.1em' }}>
              AI GENERATION
            </h3>

            {/* Text Input */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.65rem', color: '#22d3ee', opacity: 0.7, display: 'block', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
                PROMPT
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Describe the ${activeTab}...\ne.g., "futuristic cyberpunk robot with glowing blue armor"`}
                disabled={generating}
                style={{
                  width: '100%',
                  minHeight: '100px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  color: '#fff',
                  fontSize: '0.8rem',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Pipeline Info */}
            <div style={{
              background: 'rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.2)',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#22d3ee', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                ACTIVE PIPELINE:
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', lineHeight: '1.4' }}>
                ✓ Multi-View (Zero123++)<br />
                ✓ 3D Reconstruction (TripoSR)<br />
                ✓ Watertight Sealing<br />
                ✓ Quad Retopology<br />
                ✓ PBR Textures (ORM Packed)<br />
                {activeTab === 'character' && '✓ Auto-Rigging'}
              </div>
            </div>

            {/* Progress Bar */}
            {generating && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.65rem', color: '#22d3ee', marginBottom: '0.5rem' }}>
                  {progressMessage || 'Processing...'}
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                    transition: 'width 0.3s',
                    boxShadow: '0 0 10px rgba(34, 211, 238, 0.5)'
                  }} />
                </div>
                <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  {progress}% complete
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              style={{
                width: '100%',
                padding: '1rem',
                background: generating
                  ? 'rgba(34, 211, 238, 0.3)'
                  : 'linear-gradient(135deg, #22d3ee, #3b82f6)',
                border: 'none',
                borderRadius: '0.5rem',
                color: generating ? '#94a3b8' : '#000',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: generating || !prompt.trim() ? 'not-allowed' : 'pointer',
                boxShadow: generating ? 'none' : '0 0 30px rgba(34, 211, 238, 0.5)',
                letterSpacing: '0.1em',
                transition: 'all 0.3s',
                opacity: (!prompt.trim() && !generating) ? 0.5 : 1
              }}
            >
              {generating ? '⚡ GENERATING...' : '⚡ GENERATE 3D MODEL'}
            </button>

            {!prompt.trim() && !generating && (
              <div style={{ fontSize: '0.65rem', color: '#ef4444', marginTop: '0.5rem', textAlign: 'center' }}>
                Enter a prompt to generate
              </div>
            )}
          </div>

          {/* 3D Viewport */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(34, 211, 238, 0.2)',
            borderRadius: '1rem',
            padding: '1.5rem',
            position: 'relative',
            minHeight: '600px'
          }}>
            {/* Viewport Controls */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{ fontSize: '0.9rem', color: '#22d3ee', letterSpacing: '0.1em' }}>
                3D PREVIEW
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {generated3D && (
                  <>
                    <button
                      onClick={handleExport}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(34, 211, 238, 0.15)',
                        border: '1px solid #22d3ee',
                        borderRadius: '0.375rem',
                        color: '#22d3ee',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        letterSpacing: '0.05em'
                      }}
                    >
                      💾 EXPORT GLB
                    </button>
                    <button
                      onClick={() => setGenerated3D(null)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid #ef4444',
                        borderRadius: '0.375rem',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        letterSpacing: '0.05em'
                      }}
                    >
                      🗑️ CLEAR
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 3D Canvas */}
            <div style={{
              height: '500px',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              position: 'relative'
            }}>
              {generated3D?.modelUrl ? (
                <Canvas style={{ background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.05), #000)' }}>
                  <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[3, 3, 3]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22d3ee" />
                    <LoadedModel url={generated3D.modelUrl} />
                    <OrbitControls enableDamping dampingFactor={0.05} />
                    <gridHelper args={[20, 20, '#22d3ee', '#3b82f6']} />
                  </Suspense>
                </Canvas>
              ) : (
                <div style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.05), #000)'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>
                    {generating ? '⚡' : '🎨'}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#22d3ee', opacity: 0.5, textAlign: 'center' }}>
                    {generating
                      ? `Generating ${activeTab}...\n${progressMessage}`
                      : 'Enter prompt and click Generate'}
                  </p>
                  {!generating && (
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', opacity: 0.5, marginTop: '0.5rem', textAlign: 'center' }}>
                      Drag to rotate • Scroll to zoom • Right-click to pan
                    </p>
                  )}
                </div>
              )}

              {/* Corner Accents */}
              {['tl', 'tr', 'bl', 'br'].map(pos => (
                <div key={pos} style={{
                  position: 'absolute',
                  width: '40px',
                  height: '40px',
                  borderColor: '#22d3ee',
                  pointerEvents: 'none',
                  ...(pos.includes('t') ? { top: 0 } : { bottom: 0 }),
                  ...(pos.includes('l') ? { left: 0 } : { right: 0 }),
                  ...(pos.includes('t') && pos.includes('l') && { borderTop: '2px solid', borderLeft: '2px solid' }),
                  ...(pos.includes('t') && pos.includes('r') && { borderTop: '2px solid', borderRight: '2px solid' }),
                  ...(pos.includes('b') && pos.includes('l') && { borderBottom: '2px solid', borderLeft: '2px solid' }),
                  ...(pos.includes('b') && pos.includes('r') && { borderBottom: '2px solid', borderRight: '2px solid' })
                }} />
              ))}
            </div>

            {/* Model Info */}
            {generated3D && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(34, 211, 238, 0.1)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(34, 211, 238, 0.2)'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#22d3ee' }}>
                  <div>✓ TYPE: {generated3D.type.toUpperCase()}</div>
                  <div>✓ PROMPT: {generated3D.prompt}</div>
                  <div>✓ GENERATED: {new Date(generated3D.timestamp).toLocaleTimeString()}</div>
                  <div style={{ marginTop: '0.5rem', color: '#10b981' }}>
                    Ready for Unity/Unreal Engine • Quad Topology • Watertight Mesh
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
