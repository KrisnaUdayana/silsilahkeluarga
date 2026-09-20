import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAssetUrl, personApi } from '../services/api';
import type { TreeNode } from '../types';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  User, 
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface FamilyNodeProps {
  node: TreeNode;
  allNodes: TreeNode[];
  level: number;
  onSelect: (node: TreeNode) => void;
}

function FamilyNode({ node, allNodes, level, onSelect }: FamilyNodeProps) {
  const [expanded, setExpanded] = useState(level < 2);
  
  // Get children of this node
  const children = allNodes.filter(
    n => n.fatherId === node.id || n.motherId === node.id
  );

  // Get spouse
  const spouse = allNodes.find(n => node.spouseIds.includes(n.id));

  const formatDate = (date?: string | null) => {
    if (!date) return '';
    return new Date(date).getFullYear().toString();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Node with spouse */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Main person card */}
        <div
          onClick={() => onSelect(node)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onSelect(node);
            }
          }}
          aria-label={`Buka detail ${node.fullName}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 'var(--spacing-md)',
            background: node.gender === 'MALE' 
              ? 'linear-gradient(135deg, var(--color-male-light), #fff)'
              : 'linear-gradient(135deg, var(--color-female-light), #fff)',
            border: `2px solid ${node.gender === 'MALE' ? 'var(--color-male)' : 'var(--color-female)'}`,
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            minWidth: 140,
            transition: 'all var(--transition-fast)',
            boxShadow: 'var(--shadow-md)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          <div style={{
            width: 50,
            height: 50,
            borderRadius: 'var(--radius-full)',
            background: node.profilePhoto 
              ? `url(${getAssetUrl(node.profilePhoto)}) center/cover`
              : node.gender === 'MALE' ? 'var(--color-male)' : 'var(--color-female)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginBottom: 8
          }}>
            {!node.profilePhoto && <User size={24} />}
          </div>
          <div style={{ 
            fontWeight: 600, 
            fontSize: '0.9rem',
            color: 'var(--color-text)',
            textAlign: 'center',
            marginBottom: 2
          }}>
            {node.nickname || node.fullName.split(' ')[0]}
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)',
            textAlign: 'center'
          }}>
            {formatDate(node.birthDate)}
            {node.deathDate && ` - ${formatDate(node.deathDate)}`}
          </div>
        </div>

        {/* Heart Icon between Spouses */}
        {spouse && (
          <div style={{ 
            color: 'var(--color-female)',
            fontSize: '1.2rem',
            userSelect: 'none'
          }}>
            ♥
          </div>
        )}

        {/* Spouse Card */}
        {spouse && (
          <div
            onClick={() => onSelect(spouse)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect(spouse);
              }
            }}
            aria-label={`Buka detail ${spouse.fullName}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 'var(--spacing-md)',
              background: spouse.gender === 'MALE' 
                ? 'linear-gradient(135deg, var(--color-male-light), #fff)'
                : 'linear-gradient(135deg, var(--color-female-light), #fff)',
              border: `2px solid ${spouse.gender === 'MALE' ? 'var(--color-male)' : 'var(--color-female)'}`,
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              minWidth: 140,
              transition: 'all var(--transition-fast)',
              boxShadow: 'var(--shadow-md)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
          >
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 'var(--radius-full)',
              background: spouse.profilePhoto 
                ? `url(${getAssetUrl(spouse.profilePhoto)}) center/cover`
                : spouse.gender === 'MALE' ? 'var(--color-male)' : 'var(--color-female)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: 8
            }}>
              {!spouse.profilePhoto && <User size={24} />}
            </div>
            <div style={{ 
              fontWeight: 600, 
              fontSize: '0.9rem',
              color: 'var(--color-text)',
              textAlign: 'center',
              marginBottom: 2
            }}>
              {spouse.nickname || spouse.fullName.split(' ')[0]}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'var(--color-text-muted)',
              textAlign: 'center'
            }}>
              {formatDate(spouse.birthDate)}
              {spouse.deathDate && ` - ${formatDate(spouse.deathDate)}`}
            </div>
          </div>
        )}
      </div>

      {/* Expand/collapse button for children */}
      {children.length > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          style={{
            marginTop: 8,
            padding: '4px 12px',
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            zIndex: 2
          }}
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          {children.length} anak
        </button>
      )}

  {expanded && children.length > 0 && (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Vertical line from parent center */}
      <div style={{ 
        width: 2, 
        height: 24, 
        background: '#94A3B8' // More visible color
      }} />
      
      {/* Children row with solid continuous horizontal connector */}
      <div style={{ 
        display: 'flex', 
        gap: 'var(--spacing-lg)',
        padding: '0 20px',
        position: 'relative'
      }}>
        {children.map((child, index) => (
          <div key={child.id} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            position: 'relative'
          }}>
            {/* Horizontal connector segments that overlap to close gaps */}
            {children.length > 1 && (
              <div style={{
                position: 'absolute',
                top: 0,
                // Span from previous child center to next child center
                left: index === 0 ? '50%' : 'calc(var(--spacing-lg) * -0.5 - 2px)',
                right: index === children.length - 1 ? '50%' : 'calc(var(--spacing-lg) * -0.5 - 2px)',
                height: 2,
                background: '#94A3B8',
                zIndex: 1
              }} />
            )}
            
            {/* Vertical line to child center */}
            <div style={{ width: 2, height: 24, background: '#94A3B8' }} />
            
            <FamilyNode 
              node={child} 
              allNodes={allNodes} 
              level={level + 1}
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>
    </div>
  )}
</div>
);
}

// Person detail sidebar
interface PersonDetailProps {
  node: TreeNode | null;
  onClose: () => void;
}

function PersonDetail({ node, onClose }: PersonDetailProps) {
  if (!node) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[360px] bg-white shadow-2xl z-[100] flex flex-col animate-[slideIn_0.3s_ease]">
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
      
      {/* Header */}
      <div 
        className="p-6 text-white relative"
        style={{
          background: node.gender === 'MALE' 
            ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
            : 'linear-gradient(135deg, #EC4899, #DB2777)',
        }}
      >
        <button 
          type="button"
          onClick={onClose}
          aria-label="Tutup detail"
          className="absolute right-4 top-4 bg-white/20 border-none rounded-full w-8 h-8 cursor-pointer text-white text-xl hover:bg-white/30"
        >
          ×
        </button>
        
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-[3px] border-white/30"
          style={{
            background: node.profilePhoto 
              ? `url(${getAssetUrl(node.profilePhoto)}) center/cover`
              : 'rgba(255,255,255,0.2)',
          }}
        >
          {!node.profilePhoto && <User size={36} />}
        </div>
        
        <h2 className="text-center text-xl font-bold mb-1">
          {node.fullName}
        </h2>
        {node.nickname && (
          <p className="text-center opacity-90">
            "{node.nickname}"
          </p>
        )}
      </div>

      {/* Details */}
      <div className="p-6 flex-1 overflow-auto">
        <div className="mb-6">
          <div className={`badge ${node.gender === 'MALE' ? 'badge-male' : 'badge-female'}`}>
            {node.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
          </div>
        </div>

        {node.birthDate && (
          <div className="mb-4">
            <div className="text-sm text-slate-400 mb-1">
              Tanggal Lahir
            </div>
            <div className="font-medium text-slate-700">
              {new Date(node.birthDate).toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
          </div>
        )}

        {node.deathDate && (
          <div className="mb-4">
            <div className="text-sm text-slate-400 mb-1">
              Tanggal Wafat
            </div>
            <div className="font-medium text-slate-700">
              {new Date(node.deathDate).toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
          </div>
        )}

        <Link 
          to={`/members/${node.id}`}
          className="btn btn-primary w-full mt-6"
        >
          Lihat Profil Lengkap
        </Link>
      </div>
    </div>
  );
}

export function TreePage() {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  useEffect(() => {
    personApi.getTree()
      .then(data => {
        setNodes(data.nodes);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Gagal memuat data');
        setLoading(false);
      });
  }, []);

  // Find root nodes (people without parents)
  // Logic: 
  // 1. Must not have parents defined in the system
  // 2. If has a spouse, and that spouse HAS parents, don't render this person as a root 
  //    (they will be rendered as a spouse in the spouse's family branch)
  // 3. If both spouses have no parents, only render the HUSBAND as root to avoid duplication
  const rootNodes = nodes.filter(n => {
    // Must be a root (no parents)
    const isRoot = !n.fatherId && !n.motherId;
    if (!isRoot) return false;

    // Check spouse
    if (n.spouseIds && n.spouseIds.length > 0) {
      const spouse = nodes.find(s => n.spouseIds.includes(s.id));
      if (spouse) {
        // If spouse HAS parents, they are already rendered in another branch.
        // This person will be pulled in as a spouse there, so don't start a new root tree here.
        if (spouse.fatherId || spouse.motherId) {
          return false;
        }

        // If both are roots, pick the male to avoid duplication
        if (!spouse.fatherId && !spouse.motherId) {
          if (n.gender === 'FEMALE' && spouse.gender === 'MALE') {
            return false;
          }
        }
      }
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="card p-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50">
        <div className="container py-12">
          <div className="card p-8 text-center max-w-xl mx-auto">
            <h1 className="text-xl font-semibold text-slate-800 mb-2">Belum ada data silsilah</h1>
            <p className="text-slate-500">Tambahkan anggota keluarga dari panel admin untuk mulai menampilkan pohon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-slate-50 to-transparent flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-lime-900">
            Silsilah Keluarga Besar
          </h1>
          <p className="font-bold text-2xl text-slate-500">Pura Dalem Majapahit</p>
          <p className="font-bold text-2xl text-slate-500">Semarapura Kangin Klungkung</p>
        </div>
      </div>

      {/* Tree view with zoom/pan */}
      <TransformWrapper
        initialScale={0.8}
        minScale={0.3}
        maxScale={2}
        centerOnInit
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom controls */}
            <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-1 bg-white p-1 rounded-lg shadow-lg">
              <button type="button" className="btn btn-ghost" onClick={() => zoomIn()}>
                <ZoomIn size={20} />
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => zoomOut()}>
                <ZoomOut size={20} />
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => resetTransform()}>
                <Maximize2 size={20} />
              </button>
            </div>

            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ padding: '100px' }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                gap: 'var(--spacing-2xl)',
                paddingTop: 80
              }}>
                {rootNodes.map(root => (
                  <FamilyNode
                    key={root.id}
                    node={root}
                    allNodes={nodes}
                    level={0}
                    onSelect={setSelectedNode}
                  />
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Person detail sidebar */}
      {selectedNode && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 z-[99]"
            onClick={() => setSelectedNode(null)}
          />
          <PersonDetail node={selectedNode} onClose={() => setSelectedNode(null)} />
        </>
      )}
    </div>
  );
}
