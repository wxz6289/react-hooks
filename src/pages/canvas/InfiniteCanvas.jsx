import { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const NODE_TYPES = {
  default: { color: '#3498db', icon: '●' },
  warning: { color: '#e67e22', icon: '⚠️' },
  success: { color: '#2ecc71', icon: '✔️' },
};

export default function InfiniteCanvas() {
  const [nodes, setNodes] = useState([]);
  const [lines, setLines] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedLineId, setSelectedLineId] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, scale: 1 });
  const [draggingId, setDraggingId] = useState(null);
  const [selectionRect, setSelectionRect] = useState(null);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);

  const canvasRef = useRef();
  const startRef = useRef();

  // 快照
  const snapshot = useCallback(() => {
    setHistory(h => [...h.slice(-49), { nodes, lines }]);
    setFuture([]);
  }, [nodes, lines]);

  // 撤销
  const undo = () => {
    if (history.length) {
      setFuture(f => [{ nodes, lines }, ...f]);
      const prev = history[history.length - 1];
      setNodes(prev.nodes);
      setLines(prev.lines);
      setHistory(h => h.slice(0, -1));
    }
  };
  // 重做
  const redo = () => {
    if (future.length) {
      setHistory(h => [...h, { nodes, lines }]);
      const next = future[0];
      setNodes(next.nodes);
      setLines(next.lines);
      setFuture(f => f.slice(1));
    }
  };

  // 监听节点/连线变化自动快照
  useEffect(() => {
    if (history.length === 0 || history[history.length - 1].nodes !== nodes || history[history.length - 1].lines !== lines) {
      snapshot();
    }
    // eslint-disable-next-line
  }, [nodes, lines]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete') {
        if (selectedNodes.length) {
          setNodes((ns) => ns.filter((n) => !selectedNodes.includes(n.id)));
          setLines((ls) => ls.filter((l) => !selectedNodes.includes(l.from) && !selectedNodes.includes(l.to)));
          setSelectedNodes([]);
        }
        if (selectedLineId) {
          setLines((ls) => ls.filter((l) => l.id !== selectedLineId));
          setSelectedLineId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodes, selectedLineId]);

  const handleMouseDown = (e) => {
    if (e.shiftKey) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - viewBox.x) / viewBox.scale;
      const y = (e.clientY - rect.top - viewBox.y) / viewBox.scale;
      startRef.current = { x, y };
      setSelectionRect({ x, y, width: 0, height: 0 });
    } else {
      startRef.current = { x: e.clientX, y: e.clientY, viewBox: { ...viewBox } };
    }
  };

  const handleMouseMove = (e) => {
    if (selectionRect) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - viewBox.x) / viewBox.scale;
      const y = (e.clientY - rect.top - viewBox.y) / viewBox.scale;
      const sx = startRef.current.x;
      const sy = startRef.current.y;
      const newRect = {
        x: Math.min(sx, x),
        y: Math.min(sy, y),
        width: Math.abs(x - sx),
        height: Math.abs(y - sy),
      };
      setSelectionRect(newRect);
      setSelectedNodes(
        nodes.filter((n) =>
          n.x >= newRect.x &&
          n.x <= newRect.x + newRect.width &&
          n.y >= newRect.y &&
          n.y <= newRect.y + newRect.height
        ).map((n) => n.id)
      );
    } else if (draggingId) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - viewBox.x) / viewBox.scale;
      const y = (e.clientY - rect.top - viewBox.y) / viewBox.scale;
      setNodes((prev) =>
        prev.map((n) =>
          selectedNodes.includes(n.id)
            ? { ...n, x: x + (n.offsetX || 0), y: y + (n.offsetY || 0) }
            : n
        )
      );
    } else if (startRef.current?.viewBox) {
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      setViewBox({
        ...viewBox,
        x: startRef.current.viewBox.x + dx,
        y: startRef.current.viewBox.y + dy,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setSelectionRect(null);
  };

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const scale = Math.max(0.2, Math.min(3, viewBox.scale - e.deltaY * 0.001));
      setViewBox({ ...viewBox, scale });
    }
  };

  const addNode = (e, type = 'default') => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - viewBox.x) / viewBox.scale;
    const y = (e.clientY - rect.top - viewBox.y) / viewBox.scale;
    const newNode = { id: uuidv4(), x, y, type };
    setNodes([...nodes, newNode]);
  };

  const exportData = () => {
    const data = JSON.stringify({ nodes, lines });
    console.log('Exported:', data);
    return data;
  };

  const importData = (json) => {
    const { nodes: n, lines: l } = JSON.parse(json);
    setNodes(n);
    setLines(l);
  };

  // 右键菜单
  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      target: null,
      type: 'canvas',
    });
  };

  // 节点右键
  const handleNodeContextMenu = (e, node) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      target: node,
      type: 'node',
    });
  };

  // 连线右键
  const handleLineContextMenu = (e, line) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      target: line,
      type: 'line',
    });
  };

  // 关闭菜单
  const closeMenu = () => setContextMenu(null);

  // 画布双击重置视图
  const handleDoubleClick = (e) => {
    if (e.target === canvasRef.current) {
      setViewBox({ x: 0, y: 0, scale: 1 });
    } else {
      addNode(e, 'default');
    }
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-screen bg-neutral-100 overflow-hidden"
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
      tabIndex={0}
      onKeyDown={e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') undo();
        if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) redo();
      }}
    >
      <svg
        className="absolute top-0 left-0 w-full h-full"
        style={{ transform: `translate(${viewBox.x}px, ${viewBox.y}px) scale(${viewBox.scale})`, zIndex: 0 }}
      >
        {lines.map((line) => {
          const from = nodes.find((n) => n.id === line.from);
          const to = nodes.find((n) => n.id === line.to);
          if (!from || !to) return null;
          return (
            <line
              key={line.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#555"
              strokeWidth={2}
              onClick={() => setSelectedLineId(line.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                setLines((ls) => ls.filter((l) => l.id !== line.id));
              }}
            />
          );
        })}
      </svg>

      {nodes.map((node) => {
        const isSelected = selectedNodes.includes(node.id);
        const { color, icon } = NODE_TYPES[node.type] || NODE_TYPES.default;
        return (
          <div
            key={node.id}
            onClick={(e) => {
              e.stopPropagation();
              if (connecting) {
                if (connecting !== node.id) {
                  setLines([...lines, { id: uuidv4(), from: connecting, to: node.id }]);
                }
                setConnecting(null);
              } else {
                setSelectedNodes((prev) => e.shiftKey ? [...new Set([...prev, node.id])] : [node.id]);
              }
            }}
            onDoubleClick={() => setConnecting(node.id)}
            onMouseDown={(e) => {
              e.stopPropagation();
              const rect = canvasRef.current.getBoundingClientRect();
              const x = (e.clientX - rect.left - viewBox.x) / viewBox.scale;
              const y = (e.clientY - rect.top - viewBox.y) / viewBox.scale;
              const dx = node.x - x;
              const dy = node.y - y;
              setNodes((prev) =>
                prev.map((n) =>
                  selectedNodes.includes(n.id)
                    ? { ...n, offsetX: dx, offsetY: dy }
                    : n
                )
              );
              setDraggingId(node.id);
            }}
            onContextMenu={e => handleNodeContextMenu(e, node)}
            className="absolute cursor-move select-none text-white text-sm px-2 py-1 rounded"
            style={{
              left: node.x * viewBox.scale + viewBox.x,
              top: node.y * viewBox.scale + viewBox.y,
              background: isSelected ? '#2c3e50' : color,
              zIndex: 1,
            }}
          >
            {icon} Node
          </div>
        );
      })}

      {selectionRect && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-100/30"
          style={{
            left: selectionRect.x * viewBox.scale + viewBox.x,
            top: selectionRect.y * viewBox.scale + viewBox.y,
            width: selectionRect.width * viewBox.scale,
            height: selectionRect.height * viewBox.scale,
            zIndex: 2,
          }}
        />
      )}

      {/* 右键菜单 */}
      {contextMenu && (
        <div
          className="fixed bg-white border rounded shadow z-50"
          style={{ left: contextMenu.x, top: contextMenu.y, minWidth: 120 }}
          onClick={closeMenu}
        >
          {contextMenu.type === 'canvas' && (
            <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setNodes([]); setLines([]); closeMenu(); }}>清空画布</div>
          )}
          {contextMenu.type === 'node' && (
            <>
              <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setNodes(ns => ns.filter(n => n.id !== contextMenu.target.id)); closeMenu(); }}>删除节点</div>
              <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setConnecting(contextMenu.target.id); closeMenu(); }}>开始连线</div>
            </>
          )}
          {contextMenu.type === 'line' && (
            <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setLines(ls => ls.filter(l => l.id !== contextMenu.target.id)); closeMenu(); }}>删除连线</div>
          )}
        </div>
      )}

      <div className="absolute top-2 left-2 p-2 bg-white shadow rounded z-10">
        <button onClick={exportData} className="mr-2 px-2 py-1 bg-blue-500 text-white rounded">导出</button>
        <button
          onClick={() => {
            const json = prompt('粘贴导入的 JSON 数据');
            if (json) importData(json);
          }}
          className="px-2 py-1 bg-green-500 text-white rounded"
        >导入</button>
      </div>
      <div className="absolute top-2 right-2 p-2 bg-white shadow rounded z-10">
        <button onClick={undo} className="mr-2 px-2 py-1 bg-gray-500 text-white rounded">撤销</button>
        <button onClick={redo} className="px-2 py-1 bg-gray-500 text-white rounded">重做</button>
      </div>
    </div>
  );
}
