import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAssetUrl, personApi } from '../services/api';
import type { TreeNode } from '../types';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import {
  ChevronDown,
  ChevronRight,
  Heart,
  Maximize2,
  Network,
  RotateCcw,
  User,
  UsersRound,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

const DEMO_TREE_NODES: TreeNode[] = [
  {
    id: 'demo-01',
    fullName: 'Ida Bagus Made Wirasana',
    nickname: 'Kakek Made',
    gender: 'MALE',
    birthDate: '1938-04-12',
    spouseIds: ['demo-02'],
  },
  {
    id: 'demo-02',
    fullName: 'Ida Ayu Nyoman Sekarini',
    nickname: 'Nenek Sekar',
    gender: 'FEMALE',
    birthDate: '1942-09-21',
    spouseIds: ['demo-01'],
  },
  {
    id: 'demo-03',
    fullName: 'Ida Bagus Putu Mahendra',
    nickname: 'Pak Putu',
    gender: 'MALE',
    birthDate: '1965-02-02',
    fatherId: 'demo-01',
    motherId: 'demo-02',
    spouseIds: ['demo-04'],
  },
  {
    id: 'demo-04',
    fullName: 'Ida Ayu Ketut Lestari',
    nickname: 'Bu Lestari',
    gender: 'FEMALE',
    birthDate: '1968-05-18',
    spouseIds: ['demo-03'],
  },
  {
    id: 'demo-05',
    fullName: 'Ida Bagus Made Satria',
    nickname: 'Pak Satria',
    gender: 'MALE',
    birthDate: '1967-08-14',
    fatherId: 'demo-01',
    motherId: 'demo-02',
    spouseIds: ['demo-06'],
  },
  {
    id: 'demo-06',
    fullName: 'Ida Ayu Komang Puspa',
    nickname: 'Bu Puspa',
    gender: 'FEMALE',
    birthDate: '1970-12-04',
    spouseIds: ['demo-05'],
  },
  {
    id: 'demo-07',
    fullName: 'Ida Ayu Wayan Ratih',
    nickname: 'Bu Ratih',
    gender: 'FEMALE',
    birthDate: '1971-03-27',
    fatherId: 'demo-01',
    motherId: 'demo-02',
    spouseIds: ['demo-08'],
  },
  {
    id: 'demo-08',
    fullName: 'Anak Agung Gede Pradnya',
    nickname: 'Pak Gede',
    gender: 'MALE',
    birthDate: '1969-10-09',
    spouseIds: ['demo-07'],
  },
  {
    id: 'demo-09',
    fullName: 'Ida Bagus Ketut Wicaksana',
    nickname: 'Pak Ketut',
    gender: 'MALE',
    birthDate: '1974-01-30',
    fatherId: 'demo-01',
    motherId: 'demo-02',
    spouseIds: ['demo-10'],
  },
  {
    id: 'demo-10',
    fullName: 'Ida Ayu Made Candra',
    nickname: 'Bu Candra',
    gender: 'FEMALE',
    birthDate: '1976-07-16',
    spouseIds: ['demo-09'],
  },
  {
    id: 'demo-11',
    fullName: 'Ida Bagus Arya Wiratama',
    nickname: 'Arya',
    gender: 'MALE',
    birthDate: '1992-06-11',
    fatherId: 'demo-03',
    motherId: 'demo-04',
    spouseIds: ['demo-12'],
  },
  {
    id: 'demo-12',
    fullName: 'Ni Luh Saraswati',
    nickname: 'Saras',
    gender: 'FEMALE',
    birthDate: '1994-09-03',
    spouseIds: ['demo-11'],
  },
  {
    id: 'demo-13',
    fullName: 'Ida Ayu Maharani',
    nickname: 'Rani',
    gender: 'FEMALE',
    birthDate: '1995-11-20',
    fatherId: 'demo-03',
    motherId: 'demo-04',
    spouseIds: ['demo-14'],
  },
  {
    id: 'demo-14',
    fullName: 'I Made Yudha Pratama',
    nickname: 'Yudha',
    gender: 'MALE',
    birthDate: '1993-04-24',
    spouseIds: ['demo-13'],
  },
  {
    id: 'demo-15',
    fullName: 'Ida Bagus Dharma Kusuma',
    nickname: 'Dharma',
    gender: 'MALE',
    birthDate: '1994-02-19',
    fatherId: 'demo-05',
    motherId: 'demo-06',
    spouseIds: ['demo-16'],
  },
  {
    id: 'demo-16',
    fullName: 'Ni Made Padmi',
    nickname: 'Padmi',
    gender: 'FEMALE',
    birthDate: '1996-05-06',
    spouseIds: ['demo-15'],
  },
  {
    id: 'demo-17',
    fullName: 'Ida Ayu Kirana Dewi',
    nickname: 'Kirana',
    gender: 'FEMALE',
    birthDate: '1997-08-26',
    fatherId: 'demo-07',
    motherId: 'demo-08',
    spouseIds: ['demo-18'],
  },
  {
    id: 'demo-18',
    fullName: 'I Komang Surya Dana',
    nickname: 'Surya',
    gender: 'MALE',
    birthDate: '1995-01-15',
    spouseIds: ['demo-17'],
  },
  {
    id: 'demo-19',
    fullName: 'Ida Bagus Raka Adnyana',
    nickname: 'Raka',
    gender: 'MALE',
    birthDate: '1999-03-07',
    fatherId: 'demo-09',
    motherId: 'demo-10',
    spouseIds: ['demo-20'],
  },
  {
    id: 'demo-20',
    fullName: 'Ni Putu Larasati',
    nickname: 'Laras',
    gender: 'FEMALE',
    birthDate: '2000-12-13',
    spouseIds: ['demo-19'],
  },
  {
    id: 'demo-21',
    fullName: 'Ida Bagus Danendra',
    nickname: 'Dane',
    gender: 'MALE',
    birthDate: '2019-05-10',
    fatherId: 'demo-11',
    motherId: 'demo-12',
    spouseIds: [],
  },
  {
    id: 'demo-22',
    fullName: 'Ida Ayu Gayatri',
    nickname: 'Gaya',
    gender: 'FEMALE',
    birthDate: '2021-01-28',
    fatherId: 'demo-11',
    motherId: 'demo-12',
    spouseIds: [],
  },
  {
    id: 'demo-23',
    fullName: 'Ida Bagus Angga',
    nickname: 'Angga',
    gender: 'MALE',
    birthDate: '2020-10-02',
    fatherId: 'demo-14',
    motherId: 'demo-13',
    spouseIds: [],
  },
  {
    id: 'demo-24',
    fullName: 'Ida Ayu Diah Prameswari',
    nickname: 'Diah',
    gender: 'FEMALE',
    birthDate: '2022-06-18',
    fatherId: 'demo-15',
    motherId: 'demo-16',
    spouseIds: [],
  },
  {
    id: 'demo-25',
    fullName: 'Ida Bagus Bima Pranata',
    nickname: 'Bima',
    gender: 'MALE',
    birthDate: '2023-02-12',
    fatherId: 'demo-18',
    motherId: 'demo-17',
    spouseIds: [],
  },
  {
    id: 'demo-26',
    fullName: 'Ida Ayu Tara Kumala',
    nickname: 'Tara',
    gender: 'FEMALE',
    birthDate: '2024-04-08',
    fatherId: 'demo-19',
    motherId: 'demo-20',
    spouseIds: [],
  },
];

interface FamilyNodeProps {
  node: TreeNode;
  allNodes: TreeNode[];
  level: number;
  onSelect: (node: TreeNode) => void;
}

const formatYear = (date?: string | null) => {
  if (!date) return '';
  return new Date(date).getFullYear().toString();
};

const shortName = (node: TreeNode) => node.nickname || node.fullName.split(' ').slice(0, 3).join(' ');

const sortByBirthDate = (items: TreeNode[]) =>
  [...items].sort((a, b) => Number(new Date(a.birthDate || '9999')) - Number(new Date(b.birthDate || '9999')));

const getSpouses = (node: TreeNode, allNodes: TreeNode[]) =>
  sortByBirthDate(node.spouseIds.map((id) => allNodes.find((item) => item.id === id)).filter(Boolean) as TreeNode[]);

const isChildOf = (child: TreeNode, parent: TreeNode) => child.fatherId === parent.id || child.motherId === parent.id;

const getOtherParentId = (child: TreeNode, parent: TreeNode) => (parent.gender === 'MALE' ? child.motherId : child.fatherId);

const getChildren = (node: TreeNode, allNodes: TreeNode[]) => {
  const directChildren = allNodes.filter((item) => isChildOf(item, node) && !node.spouseIds.includes(item.id));
  const directChildIds = new Set(directChildren.map((item) => item.id));

  return sortByBirthDate(
    directChildren.filter((child) => {
      const spouseInSameSiblingRow = child.spouseIds
        .map((spouseId) => allNodes.find((item) => item.id === spouseId))
        .find((spouse) => spouse && directChildIds.has(spouse.id));

      return !(spouseInSameSiblingRow && child.gender === 'FEMALE' && spouseInSameSiblingRow.gender === 'MALE');
    }),
  );
};

const getChildrenForSpouse = (node: TreeNode, spouse: TreeNode, allNodes: TreeNode[]) =>
  sortByBirthDate(allNodes.filter((child) => isChildOf(child, node) && getOtherParentId(child, node) === spouse.id));

const getChildrenWithoutKnownSpouse = (node: TreeNode, spouses: TreeNode[], allNodes: TreeNode[]) => {
  const spouseIds = new Set(spouses.map((spouse) => spouse.id));
  return sortByBirthDate(
    allNodes.filter((child) => isChildOf(child, node) && !child.spouseIds.includes(node.id) && !spouseIds.has(getOtherParentId(child, node) || '')),
  );
};

function ChildrenBranch({
  children,
  allNodes,
  level,
  onSelect,
}: {
  children: TreeNode[];
  allNodes: TreeNode[];
  level: number;
  onSelect: (node: TreeNode) => void;
}) {
  if (children.length === 0) return null;

  return (
    <div className="tree-branch">
      <div className="tree-line-vertical" />
      <div className="tree-children-row">
        {children.map((child, index) => (
          <div key={child.id} className="tree-child-branch">
            {children.length > 1 && (
              <div
                className="tree-line-horizontal"
                style={{
                  left: index === 0 ? '50%' : 'calc(var(--tree-column-gap) / -2)',
                  right: index === children.length - 1 ? '50%' : 'calc(var(--tree-column-gap) / -2)',
                }}
              />
            )}
            <div className="tree-line-vertical tree-line-to-child" />
            <FamilyNode node={child} allNodes={allNodes} level={level + 1} onSelect={onSelect} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonCard({ node, level, onSelect }: { node: TreeNode; level: number; onSelect: (node: TreeNode) => void }) {
  const genderLabel = node.gender === 'MALE' ? 'Laki-laki' : 'Perempuan';

  return (
    <button
      type="button"
      onClick={() => onSelect(node)}
      aria-label={`Buka detail ${node.fullName}`}
      className={`tree-person-card ${node.gender === 'MALE' ? 'tree-person-card-male' : 'tree-person-card-female'}`}
    >
      <span className="tree-generation-label">Gen {level + 1}</span>
      <span
        className="tree-avatar"
        style={{
          background: node.profilePhoto
            ? `url(${getAssetUrl(node.profilePhoto)}) center/cover`
            : undefined,
        }}
      >
        {!node.profilePhoto && <User size={20} />}
      </span>
      <span className="tree-person-name">{shortName(node)}</span>
      <span className="tree-person-year">
        {formatYear(node.birthDate)}
        {node.deathDate && ` - ${formatYear(node.deathDate)}`}
      </span>
      <span className="tree-gender-label">{genderLabel}</span>
    </button>
  );
}

function FamilyNode({ node, allNodes, level, onSelect }: FamilyNodeProps) {
  const [expanded, setExpanded] = useState(level < 3);
  const spouses = getSpouses(node, allNodes);
  const singleParentChildren = getChildrenWithoutKnownSpouse(node, spouses, allNodes);
  const spouseFamilies = spouses.map((spouse) => ({
    spouse,
    children: getChildrenForSpouse(node, spouse, allNodes),
  }));
  const children = getChildren(node, allNodes);
  const totalChildren = spouseFamilies.reduce((total, family) => total + family.children.length, singleParentChildren.length);

  return (
    <div className="tree-family-node">
      <div className="tree-couple-card">
        <PersonCard node={node} level={level} onSelect={onSelect} />

        {spouses.length > 0 && (
          <div className="tree-spouse-list">
            {spouses.map((spouse) => (
              <div className="tree-spouse-item" key={spouse.id}>
                <div className="tree-spouse-link" aria-hidden="true">
                  <span />
                  <Heart size={14} fill="currentColor" />
                  <span />
                </div>
                <PersonCard node={spouse} level={level} onSelect={onSelect} />
              </div>
            ))}
          </div>
        )}
      </div>

      {totalChildren > 0 && (
        <button type="button" className="tree-children-toggle" onClick={() => setExpanded((value) => !value)}>
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          {totalChildren} anak
        </button>
      )}

      {expanded && totalChildren > 0 && spouses.length <= 1 && (
        <ChildrenBranch children={children} allNodes={allNodes} level={level} onSelect={onSelect} />
      )}

      {expanded && totalChildren > 0 && spouses.length > 1 && (
        <div className="tree-multi-spouse-branches">
          {spouseFamilies
            .filter((family) => family.children.length > 0)
            .map((family) => (
              <div className="tree-spouse-family" key={family.spouse.id}>
                <div className="tree-spouse-family-label">dengan {shortName(family.spouse)}</div>
                <ChildrenBranch children={family.children} allNodes={allNodes} level={level} onSelect={onSelect} />
              </div>
            ))}
          {singleParentChildren.length > 0 && (
            <div className="tree-spouse-family">
              <div className="tree-spouse-family-label">tanpa pasangan tercatat</div>
              <ChildrenBranch children={singleParentChildren} allNodes={allNodes} level={level} onSelect={onSelect} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface PersonDetailProps {
  node: TreeNode | null;
  onClose: () => void;
}

function PersonDetail({ node, onClose }: PersonDetailProps) {
  if (!node) return null;
  const isDemoPerson = node.id.startsWith('demo-');

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[360px] max-w-[92vw] bg-white shadow-2xl z-[100] flex flex-col animate-[slideIn_0.3s_ease]">
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      <div
        className="p-6 text-white relative"
        style={{
          background:
            node.gender === 'MALE'
              ? 'linear-gradient(135deg, #2563eb, #1e40af)'
              : 'linear-gradient(135deg, #db2777, #9d174d)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail"
          className="absolute right-4 top-4 bg-white/20 border-none rounded-full w-8 h-8 cursor-pointer text-white text-xl hover:bg-white/30"
        >
          x
        </button>

        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-[3px] border-white/30"
          style={{
            background: node.profilePhoto ? `url(${getAssetUrl(node.profilePhoto)}) center/cover` : 'rgba(255,255,255,0.2)',
          }}
        >
          {!node.profilePhoto && <User size={36} />}
        </div>

        <h2 className="text-center text-xl font-bold mb-1">{node.fullName}</h2>
        {node.nickname && <p className="text-center opacity-90">"{node.nickname}"</p>}
      </div>

      <div className="p-6 flex-1 overflow-auto">
        <div className="mb-6">
          <div className={`badge ${node.gender === 'MALE' ? 'badge-male' : 'badge-female'}`}>
            {node.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
          </div>
        </div>

        {node.birthDate && (
          <div className="mb-4">
            <div className="text-sm text-slate-400 mb-1">Tanggal Lahir</div>
            <div className="font-medium text-slate-700">
              {new Date(node.birthDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>
        )}

        {node.deathDate && (
          <div className="mb-4">
            <div className="text-sm text-slate-400 mb-1">Tanggal Wafat</div>
            <div className="font-medium text-slate-700">
              {new Date(node.deathDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>
        )}

        {isDemoPerson ? (
          <div className="mt-6 rounded-lg border border-lime-100 bg-lime-50 px-4 py-3 text-center text-sm font-semibold text-lime-800">
            Data contoh untuk pratinjau pohon
          </div>
        ) : (
          <Link to={`/members/${node.id}`} className="btn btn-primary w-full mt-6">
            Lihat Profil Lengkap
          </Link>
        )}
      </div>
    </div>
  );
}

export function TreePage() {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [showDemoTree, setShowDemoTree] = useState(false);

  useEffect(() => {
    personApi
      .getTree()
      .then((data) => {
        setNodes(data.nodes);
        setShowDemoTree(data.nodes.length === 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Gagal memuat data');
        setLoading(false);
      });
  }, []);

  const displayNodes = showDemoTree ? DEMO_TREE_NODES : nodes;
  const isDemoView = showDemoTree;

  const rootNodes = useMemo(
    () =>
      displayNodes.filter((node) => {
        const isRoot = !node.fatherId && !node.motherId;
        if (!isRoot) return false;

        if (node.spouseIds && node.spouseIds.length > 0) {
          const spouse = displayNodes.find((item) => node.spouseIds.includes(item.id));
          if (spouse) {
            if (spouse.fatherId || spouse.motherId) return false;
            if (!spouse.fatherId && !spouse.motherId && node.gender === 'FEMALE' && spouse.gender === 'MALE') {
              return false;
            }
          }
        }

        return true;
      }),
    [displayNodes],
  );

  const familyHeadCount = useMemo(() => {
    const seen = new Set<string>();

    displayNodes.forEach((node) => {
      node.spouseIds.forEach((spouseId) => {
        const key = [node.id, spouseId].sort().join(':');
        seen.add(key);
      });
    });

    return seen.size;
  }, [displayNodes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="spinner" />
      </div>
    );
  }

  if (error && nodes.length === 0) {
    return (
      <div className="container py-12">
        <div className="card p-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tree-page-shell">
      <div className="tree-toolbar">
        <div>
          <div className="tree-eyebrow">
            <Network size={16} />
            {isDemoView ? 'Contoh 10 kepala keluarga' : 'Pohon keluarga'}
          </div>
          <h1>Silsilah Keluarga Besar</h1>
          <p>Pura Dalem Majapahit, Semarapura Kangin Klungkung</p>
        </div>

        <div className="tree-toolbar-actions">
          <div className="tree-stats" aria-label="Ringkasan pohon">
            <div>
              <strong>{familyHeadCount}</strong>
              <span>KK</span>
            </div>
            <div>
              <strong>{displayNodes.length}</strong>
              <span>Anggota</span>
            </div>
            <div>
              <strong>{rootNodes.length}</strong>
              <span>Garis Utama</span>
            </div>
          </div>
        </div>
      </div>

      <TransformWrapper initialScale={0.72} minScale={0.25} maxScale={2} centerOnInit>
        {({ zoomIn, zoomOut, resetTransform, centerView }) => (
          <>
            <div className="tree-zoom-controls" aria-label="Kontrol zoom">
              <button type="button" title="Perbesar" onClick={() => zoomIn()}>
                <ZoomIn size={18} />
              </button>
              <button type="button" title="Perkecil" onClick={() => zoomOut()}>
                <ZoomOut size={18} />
              </button>
              <button type="button" title="Pusatkan" onClick={() => centerView()}>
                <Maximize2 size={18} />
              </button>
              <button type="button" title="Reset" onClick={() => resetTransform()}>
                <RotateCcw size={18} />
              </button>
            </div>

            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ padding: '160px 120px 120px' }}>
              <div className="tree-canvas">
                <div className="tree-root-row">
                  {rootNodes.map((root) => (
                    <FamilyNode key={root.id} node={root} allNodes={displayNodes} level={0} onSelect={setSelectedNode} />
                  ))}
                </div>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      <div className="tree-hint">
        <UsersRound size={16} />
        Geser kanvas untuk melihat cabang keluarga lainnya
      </div>

      {selectedNode && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[99]" onClick={() => setSelectedNode(null)} />
          <PersonDetail node={selectedNode} onClose={() => setSelectedNode(null)} />
        </>
      )}
    </div>
  );
}
