import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, DragOverlay } from '@dnd-kit/core';
import { useBuilderStore } from './store';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertyPanel } from './components/PropertyPanel';
import { DynamicForm } from 'pdyform-react';
import type { FieldType, FormElement, FormField } from 'pdyform-core';
import { Code2, Sparkles, Copy, Check, X, FileJson, Laptop } from 'lucide-react';

type TemplateDragData = {
  isTemplate: true;
  type: string;
  label: string;
  isLayout?: boolean;
};

type ElementDragData = {
  isElement: true;
  element: FormElement;
};

type ActiveDragData = TemplateDragData | ElementDragData;

export function FormBuilder() {
  const schema = useBuilderStore((s) => s.schema);
  const elements = schema.elements || [];
  const addElement = useBuilderStore((s) => s.addElement);
  const moveElement = useBuilderStore((s) => s.moveElement);
  const selectElement = useBuilderStore((s) => s.selectElement);

  const [activeData, setActiveData] = useState<ActiveDragData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    const current = event.active.data.current;
    if (current?.isTemplate) {
      setActiveData({
        isTemplate: true,
        type: current.type,
        label: current.label,
        isLayout: current.isLayout,
      });
      return;
    }

    if (current?.isElement) {
      setActiveData({
        isElement: true,
        element: current.element,
      });
      return;
    }

    setActiveData(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveData(null);
    const { active, over } = event;
    if (!over) return;

    if (active.data.current?.isTemplate) {
      const template = active.data.current;
      const id = `${template.type}_${Date.now()}`;
      let newElement: FormElement;

      if (template.type === 'list') {
        newElement = {
          nodeType: 'list',
          id,
          name: `list_${Date.now()}`,
          title: '动态联系人列表',
          description: '可以在此列表容器中配置重复的子表单行',
          defaultValue: [{}], // Prepopulate with one empty row so that it renders beautifully in design view
          elements: [
            {
              nodeType: 'field',
              id: `field_name_${Date.now()}`,
              name: 'name',
              label: '姓名',
              type: 'text',
              placeholder: '请输入姓名',
            },
            {
              nodeType: 'field',
              id: `field_phone_${Date.now()}`,
              name: 'phone',
              label: '电话号码',
              type: 'number',
              placeholder: '请输入联系电话',
            }
          ],
        };
      } else if (template.type === 'group') {
        newElement = {
          nodeType: 'group',
          id,
          title: '分组卡片',
          description: '包含相关联字段的卡片面板',
          elements: [
            {
              nodeType: 'field',
              id: `field_title_${Date.now()}`,
              name: 'title',
              label: '标题',
              type: 'text',
            }
          ],
        };
      } else if (template.type === 'grid') {
        newElement = {
          nodeType: 'grid',
          id,
          columns: 2,
          elements: [
            {
              nodeType: 'field',
              id: `field_col1_${Date.now()}`,
              name: 'col1',
              label: '左侧列',
              type: 'text',
            },
            {
              nodeType: 'field',
              id: `field_col2_${Date.now()}`,
              name: 'col2',
              label: '右侧列',
              type: 'text',
            }
          ],
        };
      } else {
        newElement = {
          nodeType: 'field',
          id,
          name: `field_${Date.now()}`,
          type: template.type as FieldType,
          label: template.label,
        };
      }

      addElement(newElement);
      selectElement(newElement.id!);
      return;
    }

    if (active.id !== over.id) {
      // Reordering elements in the canvas
      const oldIndex = elements.findIndex((e) => e.id === active.id);
      const newIndex = elements.findIndex((e) => e.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        moveElement(oldIndex, newIndex);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
        
        {/* Designer Premium Header Bar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-20 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent">
                  pdyform Designer
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Industrial Grade
                </span>
              </div>
              <p className="text-[10px] text-slate-400">配置式、安全沙箱表达式评估、深层动态表格 monorepo 生成器</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-4 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-all shadow-sm flex items-center gap-2"
            >
              <FileJson className="w-3.5 h-3.5 text-slate-500" />
              查看 Schema
            </button>
            <button
              onClick={() => setIsExportOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-blue-500/10 flex items-center gap-2"
            >
              <Code2 className="w-3.5 h-3.5" />
              导出配置代码
            </button>
          </div>
        </header>

        {/* Builder Workspace Area */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <Canvas />
          <PropertyPanel />
        </div>

        {/* Drag Overlay for smooth UI transitions */}
        <DragOverlay>
          {activeData && 'isTemplate' in activeData ? (
            <div className="p-3 bg-white border-2 border-blue-500 rounded-lg shadow-lg flex items-center justify-between opacity-95 cursor-grabbing w-56">
              <span className="text-sm font-medium text-slate-700">{activeData.label}</span>
              {activeData.isLayout && (
                <span className="text-[9px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                  容器
                </span>
              )}
            </div>
          ) : null}
          {activeData && 'isElement' in activeData ? (
            <div className="p-4 bg-white border-2 border-blue-500 rounded-lg shadow-lg opacity-95 cursor-grabbing w-[500px]">
              <div className="pointer-events-none">
                <DynamicForm schema={{ elements: [activeData.element] }} onSubmit={() => {}} hideSubmitButton />
              </div>
            </div>
          ) : null}
        </DragOverlay>

        {/* Sliding Backdrop-Blurred Schema Code Drawer */}
        {(isPreviewOpen || isExportOpen) && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-[2px] transition-all duration-300">
            <div className="w-[580px] h-full bg-white shadow-2xl flex flex-col animate-slide-in relative border-l border-slate-100">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                    {isPreviewOpen ? <FileJson className="w-5 h-5 text-blue-500" /> : <Code2 className="w-5 h-5 text-indigo-500" />}
                    {isPreviewOpen ? 'Form Schema (JSON)' : '导出表单配置代码'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isPreviewOpen 
                      ? '直接将此配置对象传给 DynamicForm 的 schema 属性即可直接渲染。' 
                      : '配置支持 Rule AST 表达式，无 eval/new Function 执行风险。'
                    }
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsPreviewOpen(false);
                    setIsExportOpen(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* High Fidelity Premium Code Container */}
              <div className="flex-1 overflow-auto p-6 bg-slate-950 font-mono text-xs text-slate-300 relative select-all leading-relaxed custom-scrollbar">
                <pre className="overflow-x-auto whitespace-pre-wrap break-all select-all selection:bg-blue-600/30">
                  {JSON.stringify(schema, null, 2)}
                </pre>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
                <button
                  onClick={() => {
                    setIsPreviewOpen(false);
                    setIsExportOpen(false);
                  }}
                  className="px-4 py-2 border border-slate-200 hover:bg-white rounded-lg text-xs font-semibold text-slate-600 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(schema, null, 2))}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-md shadow-blue-500/10 active:scale-95"
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      已成功复制!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      复制 Schema
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DndContext>
  );
}
